import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LABService } from "src/app/services/LAB/LAB.service";
import * as _ from "lodash";
import { CookieService } from 'src/app/services/config/cookie.service';
import { NzMessageService } from 'ng-zorro-antd/message';

class Tblabm002{
  constructor(
    public id : number,
    public plantCode : string,
    public startWeekDay : string,
    public startTime : Date,
    public endWeekDay : string,
    public endTime : Date,
    public days : string
    ){}
}

class Tblabm002Time{
  constructor(
    public rowNumber : number,
    public id : number,
    public plantCode : string,
    public timeStart : Date,
    public timeEnd : Date,
    public setTime : Date,
    public defaultSet : string,
    public isSetDefaultTime : boolean,
    public defaultTimeTooltip : string,
    public isDefaultTimecheckboxDisabled : boolean
    ){}
}

@Component({
  selector: 'app-LABI002',
  templateUrl: './LABI002.component.html',
  styleUrls: ['./LABI002.component.css'],
  providers:[NzMessageService]
})
export class LABI002Component implements AfterViewInit {

//////////////////////////////////////////////////////////////
/// 實驗室取樣時間設定(weekday+time)
/////////////////////////////////////////////////////////////
  USERNAME;
  PLANT_CODE;
  weekDayConvertMap : Map<string, string> = null;
  weekDayReverseConvertMap : Map<string, string> = null;
  isEditingList : number[] = [];

  startWeekDayList = [
    { label: '星期日', value: 6, disabled: false },
    { label: '星期一', value: 0, disabled: false },
    { label: '星期二', value: 1, disabled: false },
    { label: '星期三', value: 2, disabled: false },
    { label: '星期四', value: 3, disabled: false },
    { label: '星期五', value: 4, disabled: false },
    { label: '星期六', value: 5, disabled: false }
  ];

  endWeekDayList = [
    { label: '星期日', value: 6, disabled: false },
    { label: '星期一', value: 0, disabled: false },
    { label: '星期二', value: 1, disabled: false },
    { label: '星期三', value: 2, disabled: false },
    { label: '星期四', value: 3, disabled: false },
    { label: '星期五', value: 4, disabled: false },
    { label: '星期六', value: 5, disabled: false }
  ];

  editStartWeekDayList = [
    { label: '星期日', value: '星期日', disabled: false  },
    { label: '星期一', value: '星期一', disabled: false  },
    { label: '星期二', value: '星期二', disabled: false  },
    { label: '星期三', value: '星期三', disabled: false  },
    { label: '星期四', value: '星期四', disabled: false  },
    { label: '星期五', value: '星期五', disabled: false  },
    { label: '星期六', value: '星期六', disabled: false  }
  ];

  editEndWeekDayList = [
    { label: '星期日', value: '星期日', disabled: false  },
    { label: '星期一', value: '星期一', disabled: false  },
    { label: '星期二', value: '星期二', disabled: false  },
    { label: '星期三', value: '星期三', disabled: false  },
    { label: '星期四', value: '星期四', disabled: false  },
    { label: '星期五', value: '星期五', disabled: false  },
    { label: '星期六', value: '星期六', disabled: false  }
  ];

  timePickerDefaultOpenValue = new Date(0, 0, 0, 0, 0, 0);

  startWeekDay : number = null;
  startTime : Date = null;
  endWeekDay : number = null;
  endTime : Date = null;
  days : number = null;

  endTimeDisabled = false;

  isVisibleSampleTimeSetting = false;

  isSpinning = false;
  isOkLoading = false;

  displayTblabm002List : Tblabm002[] = [];
  editCache: { [id: string]: { isEdit: boolean, data: Tblabm002, editEndWeekDayList:{label: string, value: string, disabled: boolean}[] }} = {};
  cloneDeepTblabm002List : { [id: string]: { isEdit: boolean, data: Tblabm002, editEndWeekDayList:{label: string, value: string, disabled: boolean}[] } } = {};

  constructor(private Modal : NzModalService,
              private LABService : LABService,
              private cookieService: CookieService,
              private message: NzMessageService,
              private changeDetectorRef: ChangeDetectorRef,
             ) {

    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");

    this.weekDayConvertMap = new Map<string, string>();
    this.weekDayConvertMap.set('6', '星期日');
    this.weekDayConvertMap.set('0', '星期一'); 
    this.weekDayConvertMap.set('1', '星期二'); 
    this.weekDayConvertMap.set('2', '星期三'); 
    this.weekDayConvertMap.set('3', '星期四'); 
    this.weekDayConvertMap.set('4', '星期五'); 
    this.weekDayConvertMap.set('5', '星期六'); 

    this.weekDayReverseConvertMap = new Map<string, string>();
    this.weekDayReverseConvertMap.set('星期日', '6');
    this.weekDayReverseConvertMap.set('星期一', '0'); 
    this.weekDayReverseConvertMap.set('星期二', '1'); 
    this.weekDayReverseConvertMap.set('星期三', '2'); 
    this.weekDayReverseConvertMap.set('星期四', '3'); 
    this.weekDayReverseConvertMap.set('星期五', '4'); 
    this.weekDayReverseConvertMap.set('星期六', '5'); 

  }

  ngAfterViewInit(): void {
    this.getTblabm002List();
    this.getTblabm003List();
  }

  getTblabm002List() : void {

    this.isSpinning = true;

    new Promise<boolean>((resolve, reject) => {

      this.LABService.findAllTblabm002().subscribe({

        next : (res) =>{
          if(res.code === 200){
            if(res.data.length <= 0){
              this.sucessMSG('查無資料', '目前查無資料');
              this.displayTblabm002List = [];
              this.setupUpdateEditCache();
              resolve(true);
              return;
            }

            let resultDataList : Tblabm002[] =
              res.data.map(item => {

                let timeStartArray : string[] = item.timeStart.split(':');
                let timeEndArray : string[] = item.timeEnd.split(':');

                return new Tblabm002(
                  item.id,
                  item.plantCode,
                  this.weekDayConvertMap.get(item.weekIndexStart),
                  new Date(null,null,null,Number(timeStartArray[0]),Number(timeStartArray[1]),null),
                  this.weekDayConvertMap.get(item.weekIndexEnd),
                  new Date(null,null,null,Number(timeEndArray[0]),Number(timeEndArray[1]),null),
                  item.setDays
                  )
              });

              this.displayTblabm002List = resultDataList;
              this.setupUpdateEditCache();

          }else{
            this.errorMSG('查詢失敗', res.message);
            reject(true);
          }
        },
        error : (err) => {
          this.errorMSG('發生系統錯誤', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(err)}`);
          reject(true);
        },
        complete : () => {
          resolve(true);
        }
      })
    })
    .then(success =>{
      this.isSpinning = false;

    }).catch(error =>{
      this.isSpinning = false;
    })
  }

  displayTime(d : Date){
    let hour = d.getHours.toString().padStart(2, '0');
    let minute = d.getMinutes.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }

  // 複製一份資料到編輯專用的資料list
  setupUpdateEditCache(): void {
    this.editCache = {};
    this.cloneDeepTblabm002List = {};
    this.displayTblabm002List.forEach(item => {
      let newCloneItem01 : Tblabm002 = _.cloneDeep(item);
      let newCloneItem02 : Tblabm002 = _.cloneDeep(item);
      this.editCache[item.id] = {
        isEdit: _.includes(this.isEditingList, item.id),
        data: newCloneItem01,
        editEndWeekDayList : _.cloneDeep(this.editEndWeekDayList)
        
      };
      this.cloneDeepTblabm002List[item.id] = {
        isEdit: false,
        data: newCloneItem02,
        editEndWeekDayList : _.cloneDeep(this.editEndWeekDayList)
      };
    });
  }


  openSampleTimeSettingInput() : void {
    this.isVisibleSampleTimeSetting = true;
  }

  cancelSampleTimeSettingInput() : void {
    this.isVisibleSampleTimeSetting = false;
  }

  startWeekDayChange(startWeekDay : number) : void {

    this.endWeekDay = null;
    this.endTime = null;
    this.endTimeDisabled = false;
    this.endWeekDayList = this.startWeekDayList.map( weekDay =>  {
      let cloneDeepWeekDay = _.cloneDeep(weekDay);
      if(weekDay.value < startWeekDay){
        cloneDeepWeekDay.disabled = true;
      }
      return cloneDeepWeekDay;
    });
  }

  editStartWeekDayChange(isClickEditButton : boolean, id : number) : void {

    if(!isClickEditButton){
      this.editCache[id].data.endWeekDay = null;
      this.editCache[id].data.endTime = null;
    }

    const startWeekDayNum = Number(this.weekDayReverseConvertMap.get(this.editCache[id].data.startWeekDay));

    this.endTimeDisabled = false;
    this.editCache[id].editEndWeekDayList = this.editStartWeekDayList.map( weekDay =>  {
      let cloneDeepWeekDay = _.cloneDeep(weekDay);
      let weekDayValue = Number(this.weekDayReverseConvertMap.get(cloneDeepWeekDay.value));
      if(weekDayValue < startWeekDayNum){
        cloneDeepWeekDay.disabled = true;
      }
      return cloneDeepWeekDay;
    });
  }

  endWeekDayChange(id : number) : void{
    this.startTimeChange(id);
  }

  startTimeChange(id : number) : void {

    if(!_.isNil(id)){
      this.editCache[id].data.endTime = null;
    } else{
      this.endTime = null;
    }

    this.endTimeDisabled = false;
  }


  disabledHours(id : number){
    
    return () : number[] =>{

      let _startWeekDay : any = null;
      let _endWeekDay : any  = null;
      let _startTime : Date = null;

      if(_.isNil(id)){
        _startWeekDay = this.startWeekDay;
        _endWeekDay = this.endWeekDay;
        _startTime = this.startTime;
      }
      else{
        _startWeekDay = this.editCache[id].data.startWeekDay;
        _endWeekDay = this.editCache[id].data.endWeekDay;
        _startTime = this.editCache[id].data.startTime;
      }
     

      if(!_.isNil(_startWeekDay) && !_.isNil(_endWeekDay) &&
         _startWeekDay === _endWeekDay &&
         !_.isNil(_startTime)){

        let startHour = _startTime.getHours();
        let startMinute = _startTime.getMinutes();

        if(startMinute < 30) startHour -= 1;

        let disabledHoursNums : number[] = [];

        for (let i = 0; i <= startHour; i++) {
          disabledHoursNums.push(i);
        }

        return disabledHoursNums;

      }
      else{
        return [];
      }
    }
  };

  disabledMinutes(id : number){
    
    return (hour: number) : number[] => {

      let _startWeekDay = null;
      let _endWeekDay = null;
      let _startTime = null;

      if(_.isNil(id)){
        _startWeekDay = this.startWeekDay;
        _endWeekDay = this.endWeekDay;
        _startTime = this.startTime;
      }
      else{
        _startWeekDay = this.editCache[id].data.startWeekDay;
        _endWeekDay = this.editCache[id].data.endWeekDay;
        _startTime = this.editCache[id].data.startTime;
      }
    
      if(!_.isNil(_startWeekDay) && !_.isNil(_endWeekDay) &&
         _startWeekDay === _endWeekDay &&
         !_.isNil(_startTime)){
        
          let startHour = _startTime.getHours();
          let startMinute = _startTime.getMinutes();

          let disabledMinutesNums : number[] = [];
          if(startHour === hour || (startHour === 23 && startMinute >= 30)){
            for (let i = 0; i <= startMinute; i++) {
              disabledMinutesNums.push(i);
            }
          }

          if(startHour === 23 && startMinute >= 30){
            this.endTimeDisabled = true;
          }

          return disabledMinutesNums;
        }

      return [];
    }
  }
  

  insertSampleTimeSetting() : void{

    if(_.isNil(this.startWeekDay)){
      this.errorMSG('新增失敗', '「起(星期)」不得為空');
      return;
    }
    else if(_.isNil(this.startTime)){
      this.errorMSG('新增失敗', '「起(時間)」不得為空');
      return;
    }
    else if(_.isNil(this.endWeekDay)){
      this.errorMSG('新增失敗', '「迄(星期)」不得為空');
      return;
    }
    else if(_.isNil(this.endTime)){
      this.errorMSG('新增失敗', '「迄(時間)」不得為空');
      return;
    } 
    else if(_.isNil(this.days) || _.isEmpty(String(this.days))){
      this.errorMSG('新增失敗', '「天數」不得為空');
      console.log('this.days===>' + this.days);
      return;
    }
    else if(this.days === 0){
      this.errorMSG('新增失敗', '「天數」不得為零');
      return;
    }

    this.isOkLoading = true;

    let startHour = this.startTime.getHours().toString();
    let startMinute = this.startTime.getMinutes().toString();
    let endHour = this.endTime.getHours().toString();
    let endMinute = this.endTime.getMinutes().toString();

    const payload = {
      plantCode : this.PLANT_CODE,
      timeStart : `${startHour}:${startMinute}`,
      weekIndexStart : this.startWeekDay,
      timeEnd : `${endHour}:${endMinute}`,
      weekIndexEnd : this.endWeekDay,
      userCreate : this.USERNAME,
      setDays: this.days
    };

    new Promise<boolean>((resolve, reject) => {
      this.LABService.saveTblabm002(payload).subscribe({

        next : (res) =>{
          if(res.code === 200){
            this.sucessMSG('新增成功', res.message);
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
          resolve(true);
        }

      });
    })
    .then(success =>{
      this.startWeekDay = null;
      this.startTime = null;
      this.endWeekDay = null;
      this.endTime = null;
      this.days = null;
      this.isOkLoading = false;
      this.isVisibleSampleTimeSetting = false;
      this.getTblabm002List();
    }).catch(error =>{
      this.isOkLoading = false;
    });
  }

  editRowData(id : number){
    this.editCache[id].data = _.cloneDeep(this.cloneDeepTblabm002List[id].data);
    this.editStartWeekDayChange(true, id);
    this.editCache[id].isEdit = true;
    this.isEditingList.push(id);
  }

  deleteRowData(id : number){

    this.isSpinning = true;

    new Promise<boolean>((resolve, reject) => {

      const plantCode = this.editCache[id].data.plantCode; 

      this.LABService.deleteTblabm002(id, plantCode).subscribe({

        next : (res) =>{
          if(res.code === 200){
            this.sucessMSG('刪除成功', res.message);
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
          resolve(true);
        }

      });

    }).then(success =>{
      this.isSpinning = false;
      this.getTblabm002List();
    }).catch(error =>{
      this.isSpinning = false;
    });

  }

  saveEdit(id : number){
      if(_.isNil(this.editCache[id].data.startWeekDay)){
        this.errorMSG('更新失敗', '「起(星期)」不得為空');
        return;
      }
      else if(_.isNil(this.editCache[id].data.startTime)){
        this.errorMSG('更新失敗', '「起(時間)」不得為空');
        return;
      }
      else if(_.isNil(this.editCache[id].data.endWeekDay)){
        this.errorMSG('更新失敗', '「迄(星期)」不得為空');
        return;
      }
      else if(_.isNil(this.editCache[id].data.endTime)){
        this.errorMSG('更新失敗', '「迄(時間)」不得為空');
        return;
      } 
      else if(_.isNil(this.editCache[id].data.days) || _.isEmpty(String(this.editCache[id].data.days))){
        this.errorMSG('更新失敗', '「天數」不得為空');        
        return;
      }
      else if(Number(this.editCache[id].data.days) === 0){
        this.errorMSG('更新失敗', '「天數」不得為零');
        return;
      }

      this.isSpinning = true;

      let startHour = this.editCache[id].data.startTime.getHours().toString();
      let startMinute = this.editCache[id].data.startTime.getMinutes().toString();
      let endHour = this.editCache[id].data.endTime.getHours().toString();
      let endMinute = this.editCache[id].data.endTime.getMinutes().toString();

      const payload = {
        id : id,
        plantCode : this.editCache[id].data.plantCode,
        timeStart : `${startHour}:${startMinute}`,
        weekIndexStart : this.weekDayReverseConvertMap.get(this.editCache[id].data.startWeekDay),
        timeEnd : `${endHour}:${endMinute}`,
        weekIndexEnd : this.weekDayReverseConvertMap.get(this.editCache[id].data.endWeekDay),
        setDays: this.editCache[id].data.days,
        userUpdate : this.USERNAME
      };

      new Promise<boolean>((resolve, reject) => {
        this.LABService.updateTblabm002(payload).subscribe({

          next : (res) =>{
            if(res.code === 200){
              this.sucessMSG('更新成功', res.message);
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
            resolve(true);
          }

        });
      })
      .then(success =>{
        this.isSpinning = false;
        _.remove(this.isEditingList, n => n === id)
        this.getTblabm002List();
      }).catch(error =>{
        this.isSpinning = false;
      });
  }

  cancelEdit(id : number){
    this.editCache[id].isEdit = false;
    _.remove(this.isEditingList, id);
  }



//////////////////////////////////////////////////////////////
/// 實驗室取樣時間設定(only time)
/////////////////////////////////////////////////////////////

  isSpinningForOnlyTime = false;
  isVisibleSampleTimeSettingForOnlyTime = false;
  isOkLoadingForOnlyTime = false;
  startTimeForOnlyTime : Date = null;
  endTimeForOnlyTime : Date = null;
  setTimeForOnlyTime : Date = null;

  displayTblabm003List : Tblabm002Time[] = [];
  editCacheForOnlyTime : { [id: string]: { isEdit: boolean, data: Tblabm002Time} } = {};

  isSetDefaultTime = false;
  setDefaultTimeTooltipTitle = '';

  openSampleTimeSettingInputForOnlyTime() : void {
    this.isVisibleSampleTimeSettingForOnlyTime = true;
  }

  cancelSampleTimeSettingInputForOnlyTime() : void {
    this.isVisibleSampleTimeSettingForOnlyTime = false;
  }

  insertSampleTimeSettingForOnlyTime() : void {

    if(_.isNil(this.startTimeForOnlyTime)){
      this.errorMSG('新增失敗', '「時間起」不得為空');
      return;
    }
    else if(_.isNil(this.endTimeForOnlyTime)){
      this.errorMSG('新增失敗', '「時間迄」不得為空');
      return;
    }
    else if(_.isNil(this.setTimeForOnlyTime)){
      this.errorMSG('新增失敗', '「設定時間」不得為空');
      return;
    } 

    if(this.isSetDefaultTime === true) {

      this.Modal.confirm({
        nzTitle: '確定新增資料，並將此時段設為唯一的預設時段?',
        nzOnOk: () => {
          this.addSampleTimeSettingPeriod();
        },
        nzOnCancel: () => {
          console.log("取消勾選預設時段");
          return;
        }
      }); // end confirm
    }
    else{
      this.addSampleTimeSettingPeriod();
    }
  }

  addSampleTimeSettingPeriod(){

      this.isOkLoadingForOnlyTime = true;
      let startHour = this.startTimeForOnlyTime.getHours().toString().padStart(2, '0');;
      let startMinute = this.startTimeForOnlyTime.getMinutes().toString().padStart(2, '0');;
      let stratSecond = this.startTimeForOnlyTime.getSeconds().toString().padStart(2, '0');;

      let endHour = this.endTimeForOnlyTime.getHours().toString().padStart(2, '0');;
      let endMinute = this.endTimeForOnlyTime.getMinutes().toString().padStart(2, '0');;
      let endSecond  = this.endTimeForOnlyTime.getSeconds().toString().padStart(2, '0');;

      let setHour = this.setTimeForOnlyTime.getHours().toString().padStart(2, '0');;
      let setMinute = this.setTimeForOnlyTime.getMinutes().toString().padStart(2, '0');;
      let setSecond  = this.setTimeForOnlyTime.getSeconds().toString().padStart(2, '0');;

      const payload = {
        plantCode : this.PLANT_CODE,
        timeStart : `${startHour}:${startMinute}:${stratSecond}`,
        timeEnd : `${endHour}:${endMinute}:${endSecond}`,
        setTime : `${setHour}:${setMinute}:${setSecond}`,
        defaultSet : this.isSetDefaultTime ? 'Y' : 'N',
        userCreate : this.USERNAME,
      };

      new Promise<boolean>((resolve, reject) => {
        this.LABService.saveTblabm002Time(payload).subscribe({
          next : (res) =>{
            if(res.code === 200){
              this.sucessMSG('新增成功', res.message);
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
            resolve(true);
          }

        });
      })
      .then(success =>{
        this.isOkLoadingForOnlyTime = false;
        this.isVisibleSampleTimeSettingForOnlyTime = false;
        this.startTimeForOnlyTime = null;
        this.endTimeForOnlyTime = null;
        this.setTimeForOnlyTime = null;
        this.isSetDefaultTime = false;
        this.getTblabm003List();
      }).catch(error =>{
        this.isOkLoadingForOnlyTime = false;
      });
  }


  getTblabm003List() : void {

    this.isSpinningForOnlyTime = true;

    new Promise<boolean>((resolve, reject) => {

      this.LABService.findAllTblabm002Time().subscribe({

        next : (res) =>{
          if(res.code === 200){
            if(res.data.length <= 0){
              this.sucessMSG('查無資料，請設定', '必須至少設定一筆收樣時間!');
              this.displayTblabm003List = [];
              this.setupUpdateEditCacheForOnlyTime();
              resolve(true);
              return;
            }
            
            const resultDataList : Tblabm002Time[] =
              res.data.map(item => {

                let timeStartArray : string[] = item.timeStart.split(':');
                let timeEndArray : string[] = item.timeEnd.split(':');
                let setTimeArray : string[] = item.setTime.split(':');

                return new Tblabm002Time(
                    item.rowNumber,
                    item.id,
                    item.plantCode,
                    new Date(null,null,null,Number(timeStartArray[0]),Number(timeStartArray[1]),Number(timeStartArray[2])),
                    new Date(null,null,null,Number(timeEndArray[0]),Number(timeEndArray[1]),Number(timeEndArray[2])),
                    new Date(null,null,null,Number(setTimeArray[0]),Number(setTimeArray[1]),Number(setTimeArray[2])),
                    item.defaultSet,
                    _.isEqual(item.defaultSet, 'Y') ? true : false,
                    _.isEqual(item.defaultSet, 'Y') ? '若欲修改預設時段，直接至其他時段進行修改即可' : '',
                    _.isEqual(item.defaultSet, 'Y') ? true : false
                  )
              });

              this.displayTblabm003List = resultDataList;
              this.setupUpdateEditCacheForOnlyTime();

          }else{
            this.errorMSG('查詢失敗', res.message);
            reject(true);
          }
        },
        error : (err) => {
          this.errorMSG('發生系統錯誤', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(err)}`);
          reject(true);
        },
        complete : () => {
          resolve(true);
        }
      })
    })
    .then(success =>{
      this.isSpinningForOnlyTime = false;

    }).catch(error =>{
      this.isSpinningForOnlyTime = false;
    })

  }

   // 複製一份資料到編輯專用的資料list
   setupUpdateEditCacheForOnlyTime(): void {
      this.displayTblabm003List.forEach(item => {
        let _data = _.cloneDeep(item);
        this.editCacheForOnlyTime[item.id] = {
          isEdit : false,
          data : _data
        }
      });
   }

   setDefaultTimeHandler(id : number){

      let _isSetDefaultTime = null;
      if(!_.isNil(id)){
        _isSetDefaultTime = this.editCacheForOnlyTime[id].data.isSetDefaultTime;
      }
      else{
        return;
      }

      if(!_isSetDefaultTime) return;
      
      this.displayTblabm003List.forEach(item => {
        if(item.id !== id && !item.isDefaultTimecheckboxDisabled){
          this.editCacheForOnlyTime[item.id].data.isSetDefaultTime = false;
        }
      });
   }

  editRowDataForOnlyTime(id : number) : void {
    this.editCacheForOnlyTime[id].isEdit = true;
  }

  cancelEditForOnlyTime(id : number){
    this.editCacheForOnlyTime[id].isEdit = false;
  }

  saveEditForOnlyTime(id : number){

    if(_.isNil(this.editCacheForOnlyTime[id].data.timeStart)){
      this.errorMSG('更新失敗', '「時間起」不得為空');
      return;
    }
    else if(_.isNil(this.editCacheForOnlyTime[id].data.timeEnd)){
      this.errorMSG('更新失敗', '「時間迄」不得為空');
      return;
    }
    else if(_.isNil(this.editCacheForOnlyTime[id].data.setTime)){
      this.errorMSG('更新失敗', '「設定時間」不得為空');
      return;
    } 

    if(this.editCacheForOnlyTime[id].data.isSetDefaultTime === true) {

      this.Modal.confirm({
        nzTitle: '確定更新資料，並將此時段設為唯一的預設時段?',
        nzOnOk: () => {
          this.updateSampleTimeSettingPeriod(id);
        },
        nzOnCancel: () => {
          console.log("取消勾選預設時段");
          return;
        }
      }); // end confirm
    }
    else{
      this.updateSampleTimeSettingPeriod(id);
    }

    
  }

  updateSampleTimeSettingPeriod(id : number){
    this.isSpinningForOnlyTime = true;

    let startHour = this.editCacheForOnlyTime[id].data.timeStart.getHours().toString().padStart(2, '0');;
    let startMinute = this.editCacheForOnlyTime[id].data.timeStart.getMinutes().toString().padStart(2, '0');;
    let stratSecond = this.editCacheForOnlyTime[id].data.timeStart.getSeconds().toString().padStart(2, '0');;

    let endHour = this.editCacheForOnlyTime[id].data.timeEnd.getHours().toString().padStart(2, '0');;
    let endMinute = this.editCacheForOnlyTime[id].data.timeEnd.getMinutes().toString().padStart(2, '0');;
    let endSecond  = this.editCacheForOnlyTime[id].data.timeEnd.getSeconds().toString().padStart(2, '0');;

    let setHour = this.editCacheForOnlyTime[id].data.setTime.getHours().toString().padStart(2, '0');;
    let setMinute = this.editCacheForOnlyTime[id].data.setTime.getMinutes().toString().padStart(2, '0');;
    let setSecond  = this.editCacheForOnlyTime[id].data.setTime.getSeconds().toString().padStart(2, '0');;

    const payload = {
      id : id,
      plantCode : this.editCacheForOnlyTime[id].data.plantCode,
      timeStart : `${startHour}:${startMinute}:${stratSecond}`,
      timeEnd : `${endHour}:${endMinute}:${endSecond}`,
      setTime : `${setHour}:${setMinute}:${setSecond}`,
      defaultSet : this.editCacheForOnlyTime[id].data.isSetDefaultTime ? 'Y' : 'N',
      userCreate : this.USERNAME,
    };

    new Promise<boolean>((resolve, reject) => {
        this.LABService.updateTblabm002Time(payload).subscribe({
          next : (res) =>{
            if(res.code === 200){
              this.sucessMSG('更新成功', res.message);
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
              resolve(true);
            }

          });
      })
      .then(success =>{
        this.editCacheForOnlyTime[id].isEdit = false;
        this.isSpinningForOnlyTime = false;
        this.getTblabm003List();
      }).catch(error =>{
        this.isSpinningForOnlyTime = false;
      });
  }

  deleteRowDataForOnlyTime(id : number) : void {

    if(this.editCacheForOnlyTime[id].data.isSetDefaultTime){
      this.errorMSG('刪除失敗', '該時段為預設時段無法刪除，需先將預設時段改為其他時段才能進行刪除該時段');
      return;
    }

    this.isSpinningForOnlyTime = true;
    new Promise<boolean>((resolve, reject) => {

      const plantCode = this.editCacheForOnlyTime[id].data.plantCode; 

      this.LABService.deleteTblabm002Time(id, plantCode).subscribe({

        next : (res) =>{
          if(res.code === 200){
            this.sucessMSG('刪除成功', res.message);
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
          resolve(true);
        }

      });

    }).then(success =>{
      this.isSpinningForOnlyTime = false;
      this.getTblabm003List();
    }).catch(error =>{
      this.isSpinningForOnlyTime = false;
    });


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
