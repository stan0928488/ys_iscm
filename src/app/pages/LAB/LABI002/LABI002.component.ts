import { AfterViewInit, Component } from '@angular/core';
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


@Component({
  selector: 'app-LABI002',
  templateUrl: './LABI002.component.html',
  styleUrls: ['./LABI002.component.css'],
  providers:[NzMessageService]
})
export class LABI002Component implements AfterViewInit {

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
        plantCode : this.PLANT_CODE,
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
