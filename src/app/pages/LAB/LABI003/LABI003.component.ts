import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CookieService } from 'src/app/services/config/cookie.service';
import { LABService } from "src/app/services/LAB/LAB.service";
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common/common.service';

// 實驗室行事曆設定表
class Tblabm003Request {

  constructor(
    public id : number, 
    public plantCode : string, // 廠區別
    public startTime : string, // 休息開始時間
    public endTime : string, // 休息結束時間
    public shopCode : string, // 站別(暫時用不到)
    public equipCOde : string, // 機台碼(暫時用不到)
    public modelType : string, //定修模式(暫時用不到)
    public dateCreate : string, // 建立時間
    public userCreate : string, //建立者
    public dateUpdate : string, //異動日期
    public userUpdate : string, // 異動者
    public rowNumberInExcel : number // 使用者匯入的excel當中資料的流水號
    ){}
}

class Tblabm003Response {

  constructor(
    public holiday : string, // 休假日期
    public rowNumber : number, // 流水號
    public id : number, 
    public plantCode : string, // 廠區別
    public startTime : Date, // 休息開始時間
    public endTime : Date, // 休息結束時間
    public shopCode : string, // 站別(暫時用不到)
    public equipCOde : string, // 機台碼(暫時用不到)
    public modelType : string, //定修模式(暫時用不到)
    public dateCreate : string, // 建立時間
    public userCreate : string, //建立者
    public dateUpdate : string, //異動日期
    public userUpdate : string, // 異動者
    public disabledHolidayTimeEnd : boolean, //當使用者休假開始時間輸入23:59:59則禁用休假結束時間的輸入
    public holidayTimeEndTooltipTitle : string, // 禁止輸入結束時間的提示文字
    public isDisabledHourPlusOne : boolean // 當使用者選擇到的開始時間是 H:59:59，結束時間必須從H+1開始選
    
    ){}
}

class ExcelExport{
  constructor(
    public startTime : string, // 休息開始時間
    public endTime : string, // 休息結束時間
  ){}
}

@Component({
  selector: 'app-LABI003',
  templateUrl: './LABI003.component.html',
  styleUrls: ['./LABI003.component.css'],
  providers:[NzMessageService]
})
export class LABI003Component implements AfterViewInit {

  leftDiv! : HTMLDivElement;
  rightDiv! : HTMLDivElement;
  divider! : any;
  isStartDrag = false;
  startX = 0;


  USERNAME;
  PLANT_CODE;
  isSpinning = false;
 
  calendarSelectedDate : Date = new Date();
  calendarMode : NzCalendarMode = 'month';

  // 紀錄當前日期時間
  currentDate : Date = this.calendarSelectedDate;

  timePickerDefaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  holidayTimeStart : Date = null;
  holidayTimeEnd : Date = null;

  // 彈出視窗的載入動畫控制
  isOkLoading = false;

  // 選中的日期
  pickDates : string[] = [];

  // 使用者匯入的Excel檔案  
  excelImportFile:File;
  // input元件
  inputExcelFile:any;
  // Excel表頭名稱
  START_TIME_HEADER_NAME = '休假時間(起)';
  END_TIME_HEADER_NAME = '休假時間(迄)';
  

  // 當使用者輸入休假開始時間之前，先禁止輸入休假結束時間
  disabledHolidayTimeEnd = true;
  // 休假結束時間禁用時的提示
  holidayTimeEndTooltipTitle = '請先選擇「休假時間(起)」';
  // 當使用者選擇到的開始時間是 H:59:59，
  // 結束時間必須從H+1開始選
  isDisabledHourPlusOne = false;

  // 使用者設定的休假日清單
  listHolidayMap : Map<string, Tblabm003Response[]> = new Map<string, Tblabm003Response[]>();
  // 更新資料專用的物件
  editCache : { [id : number]: { isEdit : boolean, data : Tblabm003Response} } = {};
  // 顯示使用者設定的休假時段
  displayholidayPeriodsList : Tblabm003Response[] = [];

  // 隱藏顯示每天設定的休息時段彈出框
  isVisibleHolidayPeriods = false;
  // 顯示在彈出框標題的休假日期
  holidayDateShowInModalTitle = '';

  // 當月所有休息時段資料
  allHolidayPeriodsListByMonth : ExcelExport[] = [];

  constructor(private elementRef : ElementRef,
              private Modal : NzModalService,
              private LABService : LABService,
              private cookieService: CookieService,
              private message: NzMessageService,
              private renderer: Renderer2,
              private changeDetectorRef: ChangeDetectorRef,
              private commonService : CommonService) { 

    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }


  ngAfterViewInit(): void {
    this.divider = this.elementRef.nativeElement.querySelector('.custom-divider') as any;
    this.leftDiv = this.elementRef.nativeElement.querySelector('.leftDiv') as HTMLDivElement;
    this.rightDiv = this.elementRef.nativeElement.querySelector('.rightDiv') as HTMLDivElement;
    this.divider.addEventListener('mousedown', this.startDrag);
    document.addEventListener('mousemove', this.dragHandler);
    document.addEventListener('mouseup', this.stopDrag);
    document.addEventListener('mouseleave', this.stopDrag);

    this.inputExcelFile = this.renderer.selectRootElement('#importExcelFile');
    this.getHolidayList();
  }

  startDrag = (event: MouseEvent): void =>{ 
    this.isStartDrag = true;
    this.startX = event.pageX;
  }

  dragHandler = (event : MouseEvent) : void => {
    if(!this.isStartDrag) return;

    event.preventDefault();

    let dividerRect = this.divider.getBoundingClientRect();
    let distanceMoved = this.startX - event.pageX;
    this.startX = event.pageX;

    // 調整左邊div的寬度
    let leftDivRect = this.leftDiv.getBoundingClientRect();
    this.leftDiv.style.width = (leftDivRect.width - distanceMoved) + 'px';
  }

  stopDrag = (event : Event) : void => {
    if(this.isStartDrag){
      this.isStartDrag = false;
    }
  }


  getWidthNum(widthStr : string){
    const matches = widthStr.match(/\d+/);
    const widthNumber = matches ? parseInt(matches[0], 10) : 0;
    return widthNumber;
  }

  getHolidayList() : void {
    this.isSpinning = true;
      new Promise<boolean>((resolve, reject) => {
        const year = this.calendarSelectedDate.getFullYear().toString();
        const month = (this.calendarSelectedDate.getMonth() + 1).toString().padStart(2, '0');
        this.LABService.findAllTblabm003ByYearAndMonth(year, month).subscribe({
          next : (res) =>{
            if(res.code === 200){
              if(_.keys(res.data).length <= 0){
                // 清空上一個月份查詢到的的資料
                this.allHolidayPeriodsListByMonth = [];
                this.editCache = {};
                this.listHolidayMap.clear();
                this.sucessMSG('查無資料', '該年月目前尚無設定任何休假時段');
                resolve(true);
                return;
              }

              this.assembleHolidayResponseListToOneList(res.data);
              this.assembleHolidayResponseListToMap(res.data);         
              resolve(true);

            }else{
              this.errorMSG('獲取實驗室休假行事曆失敗', res.message);
              reject(true);
            }
          },
          error : (err) => {
            this.errorMSG('發生系統錯誤', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(err)}`);
            reject(true);
          },
          complete : () => {
            console.log('結束獲取實驗室休假行事曆');
          }
        });

      })
      .then(success =>{
        this.holidayTimeStart = null;
        this.holidayTimeEnd = null;
        this.pickDates = [];
        this.isSpinning = false;
      }).catch(error =>{
        this.isSpinning = false;
      });
  }

  assembleHolidayResponseListToOneList(responseData : any) : void{

    this.allHolidayPeriodsListByMonth = [];

    // 根據key，也就是不同的日期(年月日)排序
    const keys = _.keys(responseData);
    keys.sort();

    // 根據排序好的key拿出各天的休假時段合併成一個list
    keys.forEach(key =>{
      let holidayPeriods = _.sortBy(responseData[key], ['startTime']); 
      holidayPeriods = holidayPeriods.map(item => {
         // 剔除掉不需要的屬性
         return _.omit(item, ['holiday', 'rowNumber', 'id', 'plantCode', 'shopCode', 'equipCOde', 'modelType', 'dateCreate', 'userCreate', 'dateUpdate', 'userUpdate']);
      })
      this.allHolidayPeriodsListByMonth = this.allHolidayPeriodsListByMonth.concat(holidayPeriods);
    })
  }

  assembleHolidayResponseListToMap(responseData : any) : void {
      this.editCache = {};
      this.listHolidayMap.clear();

    _.keys(responseData).forEach(key => {
      let rowNumber = 1;

      const holidayListByDay = 
          responseData[key].map(item => {
           
            let holidayByDay  = 
                new Tblabm003Response(
                  item.holiday,
                  rowNumber,
                  item.id,
                  item.plantCode,
                  new Date(item.startTime),
                  new Date(item.endTime),
                  item.shopCode,
                  item.equipCode,
                  item.modelType,
                  item.dateCreate,
                  item.userCreate,
                  item.dateUpdate,
                  item.userUpdate,
                  false,
                  '',
                  false
                );

              rowNumber++;
                            
              return holidayByDay;
          });

          this.listHolidayMap.set(key, holidayListByDay);
          this.setupUpdateEditCache(holidayListByDay);
    });

  }

  setupUpdateEditCache(holidayListByDay : Tblabm003Response[]){
      holidayListByDay.forEach(item => {
        let newCloneItem = _.cloneDeep(item);
        this.editCache[item.id] = {
            isEdit : false,
            data : newCloneItem
        }
      });   
  }

  calendarSelected(date: Date){

    let selectedDateYearStr = moment(date).format("YYYY");
    let selectedDateMonthStr = moment(date).format("MM");
    let currentDateYearStr = moment(this.currentDate).format("YYYY");
    let currentDateMonthStr = moment(this.currentDate).format("MM");
    // 如果使用者是選擇年或月份的跳換，不執行添加日期，執行獲取該年月的休假行事曆清單
    if(selectedDateYearStr !== currentDateYearStr || selectedDateMonthStr !== currentDateMonthStr){
      this.getHolidayList();
      this.currentDate = this.calendarSelectedDate;
      return;
    }

    let dateStr = moment(date).format("YYYY-MM-DD");
    // 若當前選中的日期不存在於集合中則直接添加進去
    // 若已存在則什麼都不做(不再添加)
    if(!_.includes(this.pickDates, dateStr)){
      this.pickDates.push(dateStr);
      this.pickDates.sort();
    }else{
      this.message.warning(`日期「${dateStr}」已存在`)
    }
    
  }

  // 當使用者點選選中的日期tag的叉叉則從集合中移除該筆
  unPickDates(_index) : void {
    this.pickDates.splice(_index, 1);
  }

  // 當休假時間的輸入有變化時
  holidayTimeStartChange(id : number) : void {

    const _holidayTimeStart = _.isNil(id) ? this.holidayTimeStart : this.editCache[id].data.startTime;

    if(_.isNil(id)){
      this.holidayTimeEnd = null;
    }
    else{
      this.editCache[id].data.endTime = null;
    }
    

    if(!_.isNil(_holidayTimeStart)){
      const selectedholidayTimeStartHour = _holidayTimeStart.getHours();
      const selectedholidayTimeStartMinute = _holidayTimeStart.getMinutes();
      const selectedholidayTimeStartSecond = _holidayTimeStart.getSeconds();

      if(selectedholidayTimeStartHour === 23 &&
         selectedholidayTimeStartMinute === 59 &&
         selectedholidayTimeStartSecond === 59){
          if(_.isNil(id)){
            this.disabledHolidayTimeEnd = true;
            this.holidayTimeEndTooltipTitle = '「休假時間(起)」已達最後時刻，已無「休假時間(迄)」可選，請調整';
          }
          else{
            this.editCache[id].data.disabledHolidayTimeEnd = true;
            this.editCache[id].data.holidayTimeEndTooltipTitle = '「休假時間(起)」已達最後時刻，已無「休假時間(迄)」可選，請調整';
          }
      }
      else{
        if(_.isNil(id)){
          this.disabledHolidayTimeEnd = false;
          this.holidayTimeEndTooltipTitle = '';
        }
        else{
          this.editCache[id].data.disabledHolidayTimeEnd = false;
          this.editCache[id].data.holidayTimeEndTooltipTitle = '';
        }
      }
      // 當使用者編輯更新時，清空時間再設定日期會變成抓當天日期，需重新設定回原初選擇的日期
      if(!_.isNil(id)){
          const originalDate : string = this.editCache[id].data.holiday;
          const updateSelectedholidayTimeStartHour = this.editCache[id].data.startTime.getHours().toString();
          const updateSelectedholidayTimeStartMinute = this.editCache[id].data.startTime.getMinutes().toString();
          const updateSelectedholidayTimeStartSecond = this.editCache[id].data.startTime.getSeconds().toString();
          this.editCache[id].data.startTime = new Date(`${originalDate} ${updateSelectedholidayTimeStartHour}:${updateSelectedholidayTimeStartMinute}:${updateSelectedholidayTimeStartSecond}`);          
      }

    }else{
      if(_.isNil(id)){
        this.disabledHolidayTimeEnd = true;
        this.holidayTimeEndTooltipTitle = '請先選擇「休假時間(起)」';
      }
      else{
        this.editCache[id].data.disabledHolidayTimeEnd = true;
        this.editCache[id].data.holidayTimeEndTooltipTitle = '請先選擇「休假時間(起)」';
      }
    }
  }
  
  holidayTimeEndChange(id : number){

    if(!_.isNil(this.editCache[id].data.endTime)) {
      // 當使用者編輯更新時，清空時間再設定日期會變成抓當天日期，需重新設定回原初選擇的日期
      const originalDate : string = this.editCache[id].data.holiday;
      const updateSelectedholidayTimeEndHour = this.editCache[id].data.endTime.getHours().toString();
      const updateSelectedholidayTimeEndMinute = this.editCache[id].data.endTime.getMinutes().toString();
      const updateSelectedholidayTimeEndSecond = this.editCache[id].data.endTime.getSeconds().toString();
      this.editCache[id].data.endTime = new Date(`${originalDate} ${updateSelectedholidayTimeEndHour}:${updateSelectedholidayTimeEndMinute}:${updateSelectedholidayTimeEndSecond}`);
     }
  }

  // 限制使用者的休假結束時間不能小於休假開始時間
  disabledHours(id : number){

    const _holidayTimeStart = _.isNil(id) ? this.holidayTimeStart : this.editCache[id].data.startTime;

    return () :  number[] => {
      if(_.isNil(id)){
        this.holidayTimeEnd = null;
      }
      else{
        this.editCache[id].data.endTime = null;
      }
      let disabledHoursNums : number[] = [];
      let selectedholidayTimeStartHour = _holidayTimeStart.getHours();
      const selectedholidayTimeStartMinute = _holidayTimeStart.getMinutes();
      const selectedholidayTimeStartSecond = _holidayTimeStart.getSeconds();

      if(selectedholidayTimeStartMinute === 59 && selectedholidayTimeStartSecond === 59){
        selectedholidayTimeStartHour++;
        if(_.isNil(id)){
          this.isDisabledHourPlusOne = true;
        }
        else{
          this.editCache[id].data.isDisabledHourPlusOne = true;
        }
      }
      else{
        if(_.isNil(id)){
          this.isDisabledHourPlusOne = false;
        }
        else{
          this.editCache[id].data.isDisabledHourPlusOne = false;
        }
      }

      for (let i = 0; i < selectedholidayTimeStartHour; i++) {
        disabledHoursNums.push(i);
      }

      return disabledHoursNums;
    }
}
disabledMinutes(id : number){

  const _holidayTimeStart = _.isNil(id) ? this.holidayTimeStart : this.editCache[id].data.startTime;
  const _isDisabledHourPlusOne = _.isNil(id) ? this.isDisabledHourPlusOne : this.editCache[id].data.isDisabledHourPlusOne;

  return  (hour: number) : number[] => {
    const selectedholidayTimeStartHour = _holidayTimeStart.getHours();

    if(_isDisabledHourPlusOne || selectedholidayTimeStartHour !== hour){
      return [];
    }

    let disabledMinutesNums : number[] = [];

    let selectedholidayTimeStartMinute = _holidayTimeStart.getMinutes();
    const selectedholidayTimeStartSecond = _holidayTimeStart.getSeconds();

    if(selectedholidayTimeStartSecond === 59){
      selectedholidayTimeStartMinute++;
    }

    for (let i = 0; i < selectedholidayTimeStartMinute; i++) {
      disabledMinutesNums.push(i);
    }

    return disabledMinutesNums;
  }
}

disabledSeconds(id : number) {

  const _holidayTimeStart = _.isNil(id) ? this.holidayTimeStart : this.editCache[id].data.startTime;
  const _isDisabledHourPlusOne = _.isNil(id) ? this.isDisabledHourPlusOne : this.editCache[id].data.isDisabledHourPlusOne;

  return (hour: number, minute: number) : number[] => {

    const selectedholidayTimeStartHour = _holidayTimeStart.getHours();

    if(_isDisabledHourPlusOne || selectedholidayTimeStartHour !== hour){
      return [];
    }

    if( _holidayTimeStart.getMinutes() !==  minute){
      return [];
    }

    let disabledSecondsNums : number[] = [];
    const selectedholidayTimeStartSecond = _holidayTimeStart.getSeconds();
    for (let i = 0; i <= selectedholidayTimeStartSecond; i++) {
      disabledSecondsNums.push(i);
    }

    return disabledSecondsNums;
  }
}

  batchAddPeriods() : void {

    const payloadList = this.assembleAndGenerateHolidayPeriod();

    // 使用者未輸入需要的資料則不繼續執行新增資料
    if(_.isNil(payloadList)) return;

    this.Modal.confirm({
      nzTitle: '確定新增資料嗎?',
      nzOkText: '確定',
      nzCancelText:'取消',
      nzOnOk: () => {
        this.isSpinning = true;
        new Promise<boolean>((resolve, reject) => {
          this.LABService.batchSaveTblabm003(payloadList).subscribe({
            next : (res) =>{
              if(res.code === 200){
                this.sucessMSG('新增成功', res.message);
                resolve(true);
              }else{
                this.errorMSG('新增失敗', res.message);
                reject(true);
              }
            },
            error : (err) => {
              this.errorMSG('發生系統錯誤', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(err)}`);
              reject(true);
            },
            complete : () => {
              console.log('實驗室行事曆休假時段新增完畢');
            }
          });

        })
        .then(success =>{
          this.getHolidayList();
          this.isSpinning = false;
        }).catch(error =>{
          this.isSpinning = false;
        });
      },
      nzOnCancel: () => {
        console.log("取消新增資料");
        return;
      }
    }); // end confirm

  }

  assembleAndGenerateHolidayPeriod() : Tblabm003Request[] | null {

    // 使用者未輸入需要的資料則不繼續執行要新增的資料的組裝
    if(this.checkInputEmpty()) return null;

    const payloadList =
        this.pickDates.map(item => {
          return new Tblabm003Request(
                      null,
                      this.PLANT_CODE,
                      `${item} ${this.holidayTimeStart.toLocaleTimeString('en-GB')}`,
                      `${item} ${this.holidayTimeEnd.toLocaleTimeString('en-GB')}`, 
                      null,
                      null,
                      null,
                      null,
                      this.USERNAME,
                      null,
                      null,
                      null
                );
        });

    return payloadList;
  }

  checkInputEmpty() : boolean {

    if(_.isNil(this.holidayTimeStart)){
      this.errorMSG('新增失敗', '「休假時間(起)」不得為空');
      return true;
    }
    else if(_.isNil(this.holidayTimeEnd)){
      this.errorMSG('新增失敗', '「休假時間(迄)」不得為空');
      return true;
    }
    else if(_.isEmpty(this.pickDates)){
      this.errorMSG('新增失敗', '「休假日期」不得為空');
      return true;
    }

    return false;
  }

  selectedHolidayTag(event : Event, holiday : string){
    event.stopPropagation();

    this.isSpinning = true;
    const holidayPeriodsList = this.listHolidayMap.get(holiday);
    this.holidayDateShowInModalTitle = holidayPeriodsList[0].holiday;
    this.displayholidayPeriodsList = holidayPeriodsList;

    this.isSpinning = false;
    this.isVisibleHolidayPeriods = true
  }

  cancelHolidayPeriods() : void {
    this.isVisibleHolidayPeriods = false;
  }


  editRowData(id : number){
    this.editCache[id].isEdit = true;
  }

  deleteRowData(id : number){
    
    this.isOkLoading = true;
    let resMessage = '';
    new Promise<boolean>((resolve, reject) => {
      this.LABService.deleteTblabm003(id, this.editCache[id].data.plantCode).subscribe({
        next : (res) =>{
          if(res.code === 200){
            resMessage = res.message;
            resolve(true);
          }else{
            this.errorMSG('刪除失敗', res.message);
            reject(true);
          }
        },
        error : (err) => {
          this.errorMSG('發生系統錯誤', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(err)}`);
          reject(true);
        },
        complete : () => {
          console.log("實驗室行事曆休假時段刪除完成");
        }

      });
    })
    .then(success =>{
      this.updateHolidayPeriodsTableForDelete(id, resMessage);
      this.isOkLoading = false;
    }).catch(error =>{
      this.isOkLoading = false;
    });

  }

   // 當使用者更新休假時段後，更新顯示休假時段的table
   updateHolidayPeriodsTableForDelete(id : number, resMessage : string){

    // 先找到這筆刪除的時段是哪一天
    let holidayPeriodsList = this.listHolidayMap.get(this.editCache[id].data.holiday);

    // 再找這個刪除時段是那一天的哪一筆
    const index = _.findIndex(holidayPeriodsList, function(o) { return o.id === id; });

    // 刪除該筆時段
    holidayPeriodsList.splice(index, 1);

    // 如果刪除的是最後一筆，則關閉彈出視窗並且不在行事曆顯示當天有休假
    if(_.isEmpty(holidayPeriodsList)){
      this.listHolidayMap.delete(this.editCache[id].data.holiday);
      this.isVisibleHolidayPeriods = false;
      this.sucessMSG('刪除成功', `${this.editCache[id].data.holiday} 已無休假時段`);
      return;
    }

    // 深拷貝這個刪除過的休假時段物件
    let deepCloneDataList = _.cloneDeep(holidayPeriodsList);
    holidayPeriodsList = deepCloneDataList;

    // 根據休假開始時間排序
    holidayPeriodsList = _.sortBy(holidayPeriodsList, ['startTime']);

    // 根據排序重新計算編號
    holidayPeriodsList = holidayPeriodsList.map((item,index) => {
        item.rowNumber = index + 1;
        return item
    })

    // 重新賦值渲染table
    this.displayholidayPeriodsList = holidayPeriodsList;

    this.sucessMSG('刪除成功', resMessage);
  }

  saveEdit(id : number){

    if(_.isNil(this.editCache[id].data.startTime)){
      this.errorMSG('更新失敗', '「休假時間(起)」不得為空');
      return true;
    }
    else if(_.isNil(this.editCache[id].data.endTime)){
      this.errorMSG('更新失敗', '「休假時間(迄)」不得為空');
      return true;
    }

    this.isOkLoading = true;
    
    const updatePayLoad = new Tblabm003Request(
                              this.editCache[id].data.id,
                              this.editCache[id].data.plantCode,
                              moment(this.editCache[id].data.startTime).format('YYYY-MM-DD HH:mm:ss'),
                              moment(this.editCache[id].data.endTime).format('YYYY-MM-DD HH:mm:ss'), 
                              null,
                              null,
                              null,
                              null,
                              this.USERNAME,
                              null,
                              this.USERNAME,
                              null
                            );
  
    new Promise<boolean>((resolve, reject) => {
      this.LABService.updateTblabm003(updatePayLoad).subscribe({
        next : (res) =>{
          if(res.code === 200){
            this.sucessMSG('更新成功', res.message);
            resolve(true);
          }else{
            this.errorMSG('更新失敗', res.message);
            reject(true);
          }
        },
        error : (err) => {
          this.errorMSG('發生系統錯誤', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(err)}`);
          reject(true);
        },
        complete : () => {
          console.log("實驗室行事曆休假時段更新完成");
        }

      });
    })
    .then(success =>{
      // 當使用者更新休假時段後，更新顯示休假時段的table
      this.updateHolidayPeriodsTable(this.editCache[id].data);
      this.editCache[id].isEdit = false;
      this.isOkLoading = false;
    }).catch(error =>{
      this.isOkLoading = false;
    });

  }

  // 當使用者更新休假時段後，更新顯示休假時段的table
  updateHolidayPeriodsTable(data: Tblabm003Response){

    // 先找到這筆更新的資料是哪一天
    let holidayPeriodsList = this.listHolidayMap.get(data.holiday);

    // 再找這個更新時段是那一天的哪一筆
    const index = _.findIndex(holidayPeriodsList, function(o) { return o.id === data.id; });

    // 深拷貝這個更新過的休假時段物件
    const deepCloneData = _.cloneDeep(data);

    // 賦值給當天所有休假資料的List
    holidayPeriodsList[index] = deepCloneData;

    // 深拷貝這個有更新時段過的休假時段物件
    let deepCloneDataList = _.cloneDeep(holidayPeriodsList);
    holidayPeriodsList = deepCloneDataList;

    // 根據休假開始時間排序
    holidayPeriodsList = _.sortBy(holidayPeriodsList, ['startTime']);

    // 根據排序重新計算編號
    holidayPeriodsList = holidayPeriodsList.map((item,index) => {
      item.rowNumber = index + 1;
      return item
    })

    // 重新賦值渲染table
    this.displayholidayPeriodsList = holidayPeriodsList;
  }

  cancelEdit(id : number){
    this.editCache[id].isEdit = false;
  }

  // 吃excel檔案
  incomingFile($event: any) {
    this.excelImportFile = $event.target.files[0];
    let lastname = this.excelImportFile.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.renderer.setProperty(this.inputExcelFile, 'value', '');  
      return;
    }
  }

  jsonExcelData : any[] = [];
  handleImport() : void {
    const fileValue = this.inputExcelFile.value
    if(fileValue === "") {
      this.errorMSG('無檔案', '請先選擇要上傳的檔案');
      return;
    }

    const reader = new FileReader();

    // 文件加載完成後調用
    reader.onload = (e: any) => {
      this.isSpinning = true;
      // 從檔案獲取原始資料
      let data = e.target.result;

      // 從原始資料獲取工作簿
      // 兼容IE，需把type改為binary，並對data進行轉化
      let workbook = XLSX.read(data, {
        type: 'binary'
      });

      const sheets = workbook.SheetNames;

      if (sheets.length) {
        var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]], {
          defval: null // 單元格為空的預設值
        });
        this.jsonExcelData = jsonData;

        if(this.jsonExcelData.length != 0){
          this.importExcel();
        }
        else{
          this.errorMSG("匯入失敗", `此檔案無任何數據`);
          this.isSpinning = false;
        }

      }
    }
    // 加載文件
    reader.readAsArrayBuffer(this.excelImportFile);
  }

  importExcel() : void {

    this.isSpinning = true;

    // 檢查欄位名稱是否都正確
    if(!this.checkExcelHeader(this.jsonExcelData[0])){
      this.errorMSG('檔案欄位表頭錯誤', '請先匯出檔案後，再透過該檔案調整上傳。');
      this.renderer.setProperty(this.inputExcelFile, 'value', '');  
      this.isSpinning = false;
      return;
    }
    console.log('匯入的實驗室行事曆休假時段設定Excle欄位名稱皆正確');

    // 校驗每個Excel欄位是否都有填寫
    if(!this.checkAllValuesNotEmpty(this.jsonExcelData)){
      this.isSpinning = false;
      this.renderer.setProperty(this.inputExcelFile, 'value', ''); 
      return;
    }
    console.log("匯入的Excle特定的欄位都有填寫且資料正確");

    // 將jsonData轉成英文的key
    this.convertJsonToEnglishkey();

     // 校驗Excel中的資料是否有重複
    if(this.commonService.checkExcelDataDuplicate(this.jsonExcelData)){
      this.isSpinning = false;
      this.renderer.setProperty(this.inputExcelFile, 'value', '');
      return;
    }
    console.log("匯入的Excle中的資料皆無重複");

    // 校驗同一天的休息時段是否有重疊
    // 1.先將資料依據day分組
    const groupbyDayMap : Map<string, any[]> = this.groupbyJsonExcelDataByDay();
    // 2.開始校驗同一天休息時段是否有重疊
    const isOverlap = this.checkOverlapPeriodsOnSameday(groupbyDayMap);
    if(isOverlap){
      this.isSpinning = false;
      this.renderer.setProperty(this.inputExcelFile, 'value', '');
      return;
    }
    console.log("匯入的Excle中的休息時段皆無重複");

    // 前面的檢查都完成，開始組裝要發送的資料
    const payloadList : Tblabm003Request[] = this.assembleAndGenerateHolidayPeriodForExcelImport(this.jsonExcelData)

    new Promise<boolean>((resolve, reject) => {
      this.LABService.batchSaveTblabm003ForExcelImport(payloadList).subscribe({
        next : (res) =>{
          if(res.code === 200){
            this.sucessMSG('新增成功', res.message);
            resolve(true);
          }else{
            this.errorMSG('新增失敗', res.message);
            reject(true);
          }
        },
        error : (err) => {
          this.errorMSG('發生系統錯誤', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(err)}`);
          reject(true);
        },
        complete : () => {
          console.log('實驗室行事曆休假時段匯入完畢');
        }
      });
    })
    .then(success =>{
      this.getHolidayList();
      this.isSpinning = false;
    }).catch(error =>{
      this.isSpinning = false;
    });
    this.renderer.setProperty(this.inputExcelFile, 'value', ''); 
  }

  assembleAndGenerateHolidayPeriodForExcelImport(jsonExcelData : any[]) : Tblabm003Request[] | null {

    const payloadList =
        this.jsonExcelData.map(item => {
          return new Tblabm003Request(
                      null,
                      this.PLANT_CODE,
                      item.startTime,
                      item.endTime, 
                      null,
                      null,
                      null,
                      null,
                      this.USERNAME,
                      null,
                      null,
                      item.rowNumberInExcel
                );
        });

    return payloadList;
  }

  checkOverlapPeriodsOnSameday(groupbyDayMap : Map<string, any[]>) : boolean{

    for (let [key, groupList] of groupbyDayMap.entries()) {

      for (let i = 0; i < groupList.length; i++) {
        let holidayStratDateTime01 = moment(groupList[i]['startTime'], 'YYYY-MM-DD HH:mm:ss');
        let holidayEndDateTime01 = moment(groupList[i]['endTime'], 'YYYY-MM-DD HH:mm:ss');
        for (let j = i+1; j < groupList.length; j++) {
          let holidayStratDateTime02 = moment(groupList[j]['startTime'], 'YYYY-MM-DD HH:mm:ss');
          let holidayEndDateTime02 = moment(groupList[j]['endTime'], 'YYYY-MM-DD HH:mm:ss');
          if(holidayEndDateTime01.isAfter(holidayStratDateTime02) &&
             holidayEndDateTime02.isAfter(holidayStratDateTime01)){
              this.errorMSG("匯入失敗", `${key}，資料行數 ${groupList[i]['rowNumberInExcel']} 與 資料行數 ${groupList[j]['rowNumberInExcel']} 休息時段時間重疊`);
              return true;
             }
        }
      }
    }

    return false;
    
  }

  groupbyJsonExcelDataByDay() : Map<string, any[]> {

    const groupbyDayMap : Map<string, any[]> = new Map();

    this.jsonExcelData.forEach(item => {
      // 將幾年幾月幾號當作key
      const key = moment(item['startTime']).format("YYYY-MM-DD");
      const groupList = groupbyDayMap.get(key);
      // 若key未存在則往該map添加一個array
      if(groupList === undefined){
        let newGroupList = [];
        newGroupList.push(item);
        groupbyDayMap.set(key, newGroupList);
      }
      else{
        groupList.push(item);
      }
    });

    return groupbyDayMap;

  }

  convertJsonToEnglishkey() : void {

    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"休假時間(起)":').join('"startTime":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"休假時間(迄)":').join('"endTime":'));
  }

  checkAllValuesNotEmpty(jsonExcelData) : boolean{

    for (let i = 1; i <= jsonExcelData.length; i++){

      let rowNumberInExcel = i+1;
      let item = jsonExcelData[i-1];
    
      if(_.isNull(item[this.START_TIME_HEADER_NAME])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.START_TIME_HEADER_NAME}」不得為空，請修正。`);
        return false;
      }

      if(_.isNull(item[this.END_TIME_HEADER_NAME])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.END_TIME_HEADER_NAME}」不得為空，請修正。`);
        return false;
      }

      // 若輸入的「休假時間(起)」與「休假時間(迄)」皆不為空
      if(!_.isNull(item[this.START_TIME_HEADER_NAME]) && !_.isNull(item[this.END_TIME_HEADER_NAME])){

        // 驗證「休假時間(起)」與「休假時間(迄)」是否符合規定並調整格式
        const isVerifyHolidayStartDateTime = this.verifyAndAdjustHolidayPeriods(item, rowNumberInExcel, this.START_TIME_HEADER_NAME);
        if(isVerifyHolidayStartDateTime === false) return false;
        const isVerifyHolidayEndDateTime = this.verifyAndAdjustHolidayPeriods(item, rowNumberInExcel, this.END_TIME_HEADER_NAME);
        if(isVerifyHolidayEndDateTime === false) return false;

        // 驗證「休假時間(起)」與「休假時間(迄)」是否為同一天
        const isSameDay = moment(item[this.START_TIME_HEADER_NAME], 'YYYY-MM-DD HH:mm:ss').isSame(moment(item[this.END_TIME_HEADER_NAME], 'YYYY-MM-DD HH:mm:ss'), 'day');
        if(!isSameDay) {
          this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料「休假時間(起)」與「休假時間(迄)」必須是同一天，請修正。`);
          return false;
        }

        // 驗證「休假時間(起)」必須早於「休假時間(迄)」
        const isBefore = moment(item[this.START_TIME_HEADER_NAME], 'YYYY-MM-DD HH:mm:ss').isBefore(moment(item[this.END_TIME_HEADER_NAME], 'YYYY-MM-DD HH:mm:ss'));
        if(!isBefore) {
          this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料「休假時間(起)」必須早於「休假時間(迄)」，請修正。`);
          return false;
        }
      }

      item.rowNumberInExcel = rowNumberInExcel;
    }
    return true;
  }

  verifyAndAdjustHolidayPeriods(inputItem : any, rowNumberInExcel : number, headerName : string) : boolean{
    const dateRegex = /^\d{4}[-]\d{1,2}[-]\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}$/;
    let inputDateTime = inputItem[headerName];

    if(typeof inputDateTime === 'string'){

      // 校驗格式是否正確
      if(!dateRegex.test(inputDateTime)){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${headerName}」格式錯誤，請修正。<br>日期格式必須為 YYYY-MM-DD HH:mm:ss <br> 例如 ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        return false;
      }

      // 校驗日期是否合法
      const isValid = moment(inputDateTime, 'YYYY-MM-DD HH:mm:ss', false).isValid();
      if(!isValid){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${headerName}」日期時間數字不合法，請修正。`);
        return false;
      }

      inputItem[headerName] = moment(inputDateTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    }
    else if (typeof inputDateTime === 'number'){
      const dateStr : string = this.ExcelDateToJSDate(inputDateTime);
      inputItem[headerName] = dateStr;

    }
    else {
      this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${headerName}」為無法辨識的資料型態，請修正。`);
      return false;
    }

    return true;
  }


  ExcelDateToJSDate(serial) : string {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    const month = (date_info.getMonth() + 1).toString().padStart(2, '0');
    const day = date_info.getDate().toString().padStart(2, '0');
    const hour = hours.toString().padStart(2, '0');
    const minute = minutes.toString().padStart(2, '0');
    const second = seconds.toString().padStart(2, '0');
 
    return `${date_info.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
 }

  checkExcelHeader(d) : boolean{

    const keys = Object.keys(d);

    let startTimeHeader = false;
    let endTimeHeader = false;

    keys.forEach(k => {
      if(k === this.START_TIME_HEADER_NAME) startTimeHeader = true;
      else if(k === this.END_TIME_HEADER_NAME) endTimeHeader = true;
    });

    return startTimeHeader && endTimeHeader;
  }
  
  exportExcel() : void {

    let selectedDateYearMonthStr = moment(this.calendarSelectedDate).format("YYYY-MM");

    if(_.isEmpty(this.allHolidayPeriodsListByMonth)){
      this.errorMSG("無資料!", `${selectedDateYearMonthStr} 尚無設定任何休假時段`);
      return;
    }

    const firstRow = ["startTime", "endTime"];
    const firstRowDisplay = {startTime:'休假時間(起)', endTime:'休假時間(迄)'};
    const exportData = [firstRowDisplay, ...this.allHolidayPeriodsListByMonth]; 

    const workSheet = XLSX.utils.json_to_sheet(exportData,{header:firstRow, skipHeader:true});
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    XLSX.writeFileXLSX(workBook, `${selectedDateYearMonthStr} 實驗室行事曆休假時間_${moment().format('YYYY-MM-DD_hh-mm-ss')}.xlsx`)
        
    this.isSpinning = false;
    this.message.success('匯出成功');

  }
  
  sucessMSG(_title, _plan): void {
		this.Modal.success({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}

  errorMSG(_title, _plan): void {
		this.Modal.error({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}
}
