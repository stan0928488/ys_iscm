import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";

import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";


interface ItemData2 {
  id          : string;
  tab1ID      : number;
  MONTH       : String;
  WEEK_NAME   : String;
  WEEK_INDEX  : number;
}

@Component({
  selector: "app-PPSI200",
  templateUrl: "./PPSI200.component.html",
  styleUrls: ["./PPSI200.component.scss"],
  providers:[NzMessageService]
})
export class PPSI200Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  //
  selectOptionWeek = [] ;
  selectOptionWeekDay = {label: '星期五', value: 4} ;


  // ----tab-4 begin------------
  weekData = [];
  set_weekList;
  startDateForAdd;
  endDateForAdd;
  weekDayValueForAdd;
  isVisibleWeekDayAdd = false;
  yearAndMonth = moment().format('YYYY-MM');
  weekList;
  weekDayValueForEdit;
  weekDayNameListForEdit;
  weekDayValueListForEdit;
  arrayYearAndMonthRange = [];
  editCache5: { [key: string]: { edit: boolean; data: ItemData2 } } = {};
  setAddDatePanels = [
    {
      active: false,
      name: '新增星期起始',
      disabled: false
    }
  ];

  weekDayList = [
      { label: '星期日', value: 6},
      { label: '星期一', value: 0},
      { label: '星期二', value: 1},
      { label: '星期三', value: 2},
      { label: '星期四', value: 3},
      { label: '星期五', value: 4},
      { label: '星期六', value: 5}
    ];
    weekDayList2 = [
      { label: '星期日', value: 6},
      { label: '星期一', value: 0},
      { label: '星期二', value: 1},
      { label: '星期三', value: 2},
      { label: '星期四', value: 3},
      { label: '星期五', value: 4},
      { label: '星期六', value: 5}
    ];
    FCPTB16List;
  // ----tab-4 end------------


  // ----tab-5 begin----------
  setTab5AddDatePanels = [
    {
      active: false,
      name: '新增FCP結果',
      disabled: false
    }
  ];
  tab5DateOf_YYYYMM_ForAdd;
  tab5DateOf_DD_ForAdd;
  selMenuTab5DateOf_DD_ForAddList;
  tab5Year;
  tab5Mon;
  tab5Switch;
  FCPRSData = [];
  DayOfMonthList=[];
  FCPTB16StatusList;
  // ----tab-5 end------------
  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["ID","年-月","week_index","星期","disabledFlag","editStatus"];
  importdata_repeat = [];
  constructor(
    private PPSService: PPSService,
    private getPPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");

  }


  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getFCPTB16List();
  }
  

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe(res => {
      console.log("getRunFCPCount success");
      if(res > 0) this.isRunFCP = true;

    });
  }


  deleteRow(id: string, _type): void {
    if(_type === 5){
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delStatus(id);
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  

  changeTab(tab): void {
    if(tab === 4) {
      this.getFCPTB16List();
    } else if(tab === 5) {
      // has a lot to do
      this.getFCPTB16StatusList();
    }

  }

  // ----tab-4 begin --------------

  insertTab4() {
    let myObj = this;
    // tab4新增檢核 begin------------------
    if (this.startDateForAdd === undefined) {
      myObj.message.create("error", "「開始年月」不可為空");
      return;
    } else if (this.endDateForAdd === undefined) {
      myObj.message.create("error", "「結束年月」不可為空");
      return;
    } else if (this.startDateForAdd > this.endDateForAdd) {
      myObj.message.create("error", "「開始年月」不可大於「結束年月」");
      return;
    } else if (this.weekDayValueForAdd === undefined) {
      myObj.message.create("error", "「設定星期」不可為空");
      return;
    }
    // tab4新增檢核 end------------------
    else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave(4)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  compareWeekFn = (o1: any, o2: any) => (o1 && o2 ? o1.label === o2.label : o1 === o2);
  //
  selectWeekChange(value){
    console.log("select :"+value) ;
  }
  // edit function
  weekEditFunc(item,index){
    console.log("weekEditFunc  :" + index);
    item.editStatus = true ;
    console.log("default data :" + JSON.stringify(this.selectOptionWeekDay));
    //this.selectOptionWeekDay =  {label: '星期五', value: 4} ;
    this.selectOptionWeekDay = this.selectOptionWeek[index] ;
    console.log("select options :" + JSON.stringify(this.selectOptionWeek)) ;
    console.log("this.selectOptionWeekDay:" + JSON.stringify(this.selectOptionWeekDay)) ;
    //console.log("weekData:" + JSON.stringify(this.weekData) );
    console.log("select option :" + this.selectOptionWeek[index]);
  }

  weekSaveEdit(item,index){
    console.log("weekSaveEdit  :" + index);
    // let myObj = this;
    console.log("select value: " + JSON.stringify(this.selectOptionWeekDay)) ;
    let obj =  {
      ID          : item.ID,
      WEEK_NAME   : this.selectOptionWeekDay.label,
      WEEK_INDEX  : this.selectOptionWeekDay.value,
      USERNAME    : this.USERNAME,
      DATETIME    : moment().format('YYYY-MM-DD HH:mm:ss')
    }
    console.log("comit paramete : " + JSON.stringify(obj)) ;
    this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateTab4Sava(obj)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
  }

  updateTab4Sava(_obj){
    let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = _obj;

        myObj.getPPSService.updateTab4Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {

            this.sucessMSG("修改成功", ``);
            this.getFCPTB16List();

          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
  }

  weekCancelEdit(item, index){
    item.editStatus = false ;
  }
  //get week number
  getFCPTB16List() {
    this.loading = true;
    this.selectOptionWeek = [] ;
    this.weekData = [] ;
    let myObj = this;
    this.getPPSService.getPPSFCPTB16List().subscribe(res => {
      console.log("getFCPTB16List success");
      this.FCPTB16List = res;
      console.log(this.FCPTB16List);
      for(let i = 0; i<this.FCPTB16List.length; i++){
        let id = this.FCPTB16List[i].ID;
        let mon = this.FCPTB16List[i].month;
        let WI = this.FCPTB16List[i].week_index;
        let WN = this.FCPTB16List[i].week_name;

        let weekObj ={label:WN,value:WI} ;;
        this.selectOptionWeek.push(weekObj) ;

        let disabledFlag = false ;
        let editStatus = false ;

        console.log(id+", "+mon+", "+WI+", "+WN);
        if(mon === this.yearAndMonth){
          console.log('dis');
          disabledFlag = true ;
        }else if(mon > this.yearAndMonth){
          console.log('en');
          disabledFlag = false ;
        }else if(mon < this.yearAndMonth){
          console.log('dis');
          disabledFlag = true ;
        }
        let obj2 = {
          ID           :id,
          month        :mon,
          week_index   :WI,
          week_name    :WN,
          disabledFlag :disabledFlag,
          editStatus   :editStatus
        } ;
        this.weekData.push(obj2);
      }
       console.log("init weeedata"+JSON.stringify(this.weekData));
       console.log("init select weeekdata"+JSON.stringify(this.selectOptionWeek));

      myObj.loading = false;
    });
  }

  weekDayChange(value){
    console.log("Value: " + value);
    console.log("weekDayValueForAdd:" + this.weekDayValueForAdd.label);
    console.log('value: ' + this.weekDayValueForAdd.value);
  }
  // 取得開始年月到結束年月的區間，回傳字串陣列，陣列內容包含區間內的所有年月
  yearAndMonthRange(d1:Date, d2:Date) {

    let start = d1;
    let end   = d2;
    // 計算相差幾年幾月 都轉成相差幾個月
    let diffYear = end.getFullYear() - start.getFullYear();
    let tmpYearToMon = diffYear * 12;
    let diffMonth = tmpYearToMon + (end.getMonth() - start.getMonth());
    // 取得開始年及月 準備跑迴圈 迴圈總數為相差幾個月
    let beginMon = start.getMonth()+1;
    let tmpMon = start.getMonth()+1;
    let tmpYear = start.getFullYear();
    let countMonth = tmpMon;
    let countYear;
    let arrYearAndMonth = [];
    console.log(beginMon);
    for(let i = 0; i <= diffMonth; i++){
      countMonth = tmpMon + i;
      countYear = tmpYear;
      let strcountMonth;
      let strSum;
      if(countMonth > 12){
        countYear = countYear + (Math.floor(countMonth / 12));
        countMonth = countMonth % 12;
      }
      if(countMonth.toString().length < 2){
        strcountMonth = '0' + countMonth.toString();
      }else{
        strcountMonth = countMonth.toString();
      }
      // 組合字串
      strSum =  countYear.toString() + '-' + strcountMonth;
      // console.log(strSum);
      // 將字串push到陣列
      arrYearAndMonth.push(strSum);
    }

    // console.log(diffMonth);
    console.log(JSON.stringify(arrYearAndMonth));

    return arrYearAndMonth;
  }
  // ----tab-4 end --------------

  
  // ---- tab 5 begin ---------
  insertTab5(){
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {

      let postData = 
      {
        "STATUS":"1",
        "USERNAME":this.USERNAME,
        "DATETIME":moment().format('YYYY-MM-DD HH:mm:ss'),
        'PICKER_DATE':this.tab5DateOf_DD_ForAdd
      }
      myObj.getPPSService.insertTab5Save(postData).subscribe(res => {
        if(res[0].MSG === "Y") {

          this.sucessMSG("修改成功", ``);
          this.getFCPTB16StatusList();
          this.LoadingPage = false;
        }
      },err => {
        reject('upload fail');
        this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }

  FCPDayChange(value){
    console.log("Value: " + value);
    console.log("tab5DateOf_DD_ForAdd:" + this.tab5DateOf_DD_ForAdd.label);
    console.log('value: ' + this.tab5DateOf_DD_ForAdd.value);
  }
  //get status
  getFCPTB16StatusList() {
    this.loading = true;
    this.FCPRSData = [] ;
    let myObj = this;
    this.getPPSService.getPPSFCPTB16RSSetList().subscribe(res => {
      console.log("getPPSFCPTB16RSSetList success");
      this.FCPTB16StatusList = res;
      console.log(this.FCPTB16StatusList);
      for(let i = 0; i<this.FCPTB16StatusList.length; i++){
        let id      = this.FCPTB16StatusList[i].ID;
        let setDate = this.FCPTB16StatusList[i].SET_DATE;
        let mon     = this.FCPTB16StatusList[i].SET_DATE;
        let tmpSt   = (this.FCPTB16StatusList[i].STATUS==="1")? '啟用': '停用';
        let rdoSt   = (this.FCPTB16StatusList[i].STATUS==="1")?  true : false;
        let st      = this.FCPTB16StatusList[i].STATUS;

        let weekObj ={} ;;
        //this.selectOptionWeek.push(weekObj) ;

        let disabledFlag = false ;
        let editStatus = false ;

        console.log(id+", "+setDate+", "+tmpSt+rdoSt+st);
        if(mon === this.yearAndMonth){
          // console.log('dis');
          disabledFlag = true ;
        }else if(mon > this.yearAndMonth){
          // console.log('en');
          disabledFlag = false ;
        }else if(mon < this.yearAndMonth){
          // console.log('dis');
          disabledFlag = true ;
        }
        let obj2 = {
          id           :id,
          setDate      :setDate,
          month        :mon,
          STATUS       :tmpSt,
          statusFlag   :rdoSt,
          disabledFlag :disabledFlag,
          editStatus   :editStatus
        } ;
        this.FCPRSData.push(obj2);
      }

      myObj.loading = false;
    });
  }
  // edit function
  statusEditFunc(item,index){
    console.log("statusEditFunc  :" + index);
    item.editStatus = true ;
    this.tab5Switch = item.statusFlag;
  }

  // delStatusID(id,index){
  //   console.log("statusDelFunc  :" + index);
  //   this.FCPRSData[index].editStatus = true ;

  // }
  statusSaveEdit(item,index){
    console.log("statusSaveEdit  :" + index);
    // let myObj = this;
    let statusVal;
    console.log('aaaaaa:'+JSON.stringify(this.tab5Switch));
    if(this.tab5Switch === true){
      statusVal = '1';
    }else if(this.tab5Switch === false){
      statusVal = '0';
    }
    console.log('statusVal:' + statusVal);

    console.log("switch value: " + JSON.stringify(item.statusFlag)) ;
    let obj =  {
      ID          :  item.id,
      SETDATE     :  item.setDate,
      STATUS      :  statusVal,
      USERNAME    :  this.USERNAME,
      DATETIME    :  moment().format('YYYY-MM-DD HH:mm:ss')
    }
    console.log("comit paramete : " + JSON.stringify(obj)) ;
    this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateTab5Sava(obj)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
  }

  updateTab5Sava(_obj){
    let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = _obj;

        myObj.getPPSService.updateTab5Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {

            this.sucessMSG("修改成功", ``);
            this.getFCPTB16StatusList();
            this.LoadingPage = false;
          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
  }

  statusCancelEdit(item, index){
    item.editStatus = false ;
  }

  // 刪除資料
  delStatus(_id) {
    let myObj = this;
    console.log(_id);
    return new Promise((resolve, reject) => {
      let _ID = _id;
      myObj.getPPSService.delI200Tab5Data(_ID).subscribe(res => {
        if(res[0].MSG === "Y") {

          this.sucessMSG("刪除成功", ``);
          this.getFCPTB16StatusList();
        }
      },err => {
        reject('upload fail');
        this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }

  FCP_YYYYMMChange($event){
    this.DayOfMonthList = [];
    this.tab5DateOf_DD_ForAdd = [];
    let tmpDate   = new Date(this.tab5DateOf_YYYYMM_ForAdd);
    this.tab5Year = moment(tmpDate).format('YYYY');
    this.tab5Mon  = moment(tmpDate).format('MM');
    // console.log(year+'-'+month);
    this.getDayNumOfMonth(this.tab5Year,this.tab5Mon);
  }


  // 用年月去取得當月天數
  getDayNumOfMonth(_year, _month){
    let year  = parseInt(_year, 10);
    let month = parseInt(_month, 10);
    let dayNum;
    if(month === 1 || month === 3 ||
       month === 5 || month === 7 ||
       month === 8 || month === 10 || month === 12){
        dayNum = 31;
        console.log("day num:" + dayNum);
    }else if((month === 2) && ((year%400===0)
         || (year%4===0 && year%100!=0)))	{
        dayNum = 29;
        console.log("day num:" + dayNum);
    }else if(month === 2){
        dayNum = 28;
        console.log("day num:" + dayNum);
    }else{
        dayNum = 30;
        console.log("day num:" + dayNum);
    }
    this.genDataArr(dayNum);
  }

  // 用當月天數去取得日期陣列
  genDataArr(_dayNum){
    let _dayArr = [];
    let tmp1, tmp2;
    for(let i = 2;i < _dayNum;i++){
        let countDay = i.toString();
        if(countDay.length < 2){
          tmp1 = '0'+ countDay ;
        }else{
          tmp1 = countDay ;
        }

        tmp2 = this.tab5Year + '-' + this.tab5Mon + '-' + tmp1;
        let obj = {year:this.tab5Year, month:this.tab5Mon, day:tmp1,label:tmp1, value:tmp2 }
        // tmp2 = tmp1;
        _dayArr.push(obj);
    }
    this.DayOfMonthList = _dayArr;

    console.log("_dayArr:"+_dayArr);
  }

  // ---- tab 5 end -----------


  
  // 新增資料
  insertSave(_type) {
    if((_type === 4 )){
      let myObj = this;
      this.LoadingPage = true;
      let dateStart = this.startDateForAdd;
      let dateEnd   = this.endDateForAdd;
      let dateOfBegin = Date.parse(dateStart);
      let dateOfEnd   = Date.parse(dateEnd);
      let start = new Date(dateOfBegin);
      let end   = new Date(dateOfEnd);

      let aa = moment(start);
      let bb = moment(end);
      console.log(JSON.stringify(aa)+"  ~  "+JSON.stringify(bb));
      console.log('l: ' + this.weekDayValueForAdd.label + 'v: ' + this.weekDayValueForAdd.value);


      // this.arrayYearAndMonthRange = this.yearAndMonthRange(start, end);
      this.arrayYearAndMonthRange = this.yearAndMonthRange(start, end);
        return new Promise((resolve, reject) => {
          let obj = {};
          obj = {
            MONTH_RANGE   : this.arrayYearAndMonthRange,
            WEEKDAY_VALUE : this.weekDayValueForAdd.value,
            WEEKDAY_LABEL : this.weekDayValueForAdd.label,
            USERNAME      : this.USERNAME,
            DATETIME      : moment().format('YYYY-MM-DD HH:mm:ss')
          }

          myObj.getPPSService.insertTab4Save(obj).subscribe(res => {
            if(res[0].MSG === "Y") {
              this.startDateForAdd     = undefined;
              this.endDateForAdd       = undefined;
              this.weekDayValueForAdd  = undefined;

              this.sucessMSG("新增成功", ``);
              this.getFCPTB16List();
              this.LoadingPage = false;
              //  this.isVisibleUpd = false;
            }else if(res[0].MSG === "N") {
              this.errorMSG("新增失敗", "新增的資料中，設定年月值已有相同值存在於資料庫，請檢察新增的資料");
            }
          },err => {
            reject('insert fail');
            this.errorMSG("新增失敗", "後台新增錯誤，請聯繫系統工程師");
            this.LoadingPage = false;
          })

        });
    }
  }

  // 修改資料
  updateSave(_id, _type) {
    if(_type === 4) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        obj =  {
          ID          : this.weekData[_id].ID,
          MONTH       : this.weekData[_id].month,
          WEEK_NAME   : this.weekData[_id].week_name,
          WEEK_INDEX  : this.weekData[_id].week_index,
          USERNAME    : this.USERNAME,
          DATETIME    : moment().format('YYYY-MM-DD HH:mm:ss')
        }

        myObj.getPPSService.updateTab4Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {

            this.sucessMSG("修改成功", ``);

            const index = this.FCPTB16List.findIndex(item => item.id === _id);
            Object.assign(this.FCPTB16List[index], this.weekData[_id]);
            // this.editCache5[_id].edit = false;
          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    }
  }

	sucessMSG(_title, _plan): void {
		this.Modal.success({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}

	errorMSG(_title, _context): void {
		this.Modal.error({
			nzTitle: _title,
			nzContent: `${_context}`
		});
	}



  // excel檔名
  incomingfile(event) {
    this.file = event.target.files[0]; 
    console.log("incomingfile e : " + this.file);
    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    }
  }
  clearFile() {
    document.getElementsByTagName('input')[0].value = '';

  }

  Upload() {
  
    let getFileNull = this.inputFileUseInUpload;
    if(getFileNull === undefined){
      this.errorMSG('請選擇檔案', '');
      return;
    }

    let lastname = this.file.name.split('.').pop();
    console.log("this.file.name: "+this.file.name);
    console.log("incomingfile e : " + this.file);
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {
      console.log("上傳檔案格式沒有錯誤");
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet:any = workbook.Sheets[first_sheet_name];
        this.importdata = XLSX.utils.sheet_to_json(worksheet, {raw:true});
  
        
          console.log("importExcel")
          console.log(this.importdata)
          this.importExcel(this.importdata);
        
      }
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  importExcel(_data) {

    console.log("EXCEL 資料上傳檢核開始");
    var upload_data = [];
    for(let i=0 ; i < _data.length ; i++) {
      console.log(_data[i]);

      let allData = JSON.stringify(_data[i]);

      
        this.importdata_repeat.push(allData);

        if(_data[i]['機台名稱'] == undefined)
          _data[i]['機台名稱'] = '';
        if(_data[i]['機台群組'] == undefined)
          _data[i]['機台群組'] = '';
        if(_data[i]['機台'] == undefined)
          _data[i]['機台'] = '';
        if(_data[i]['BALANCE_RULE'] == undefined)
          _data[i]['BALANCE_RULE'] = '';
        if(_data[i]['ORDER_SEQ'] == undefined)
          _data[i]['ORDER_SEQ'] = '';

        upload_data.push({
          id : _data[i].id,
          tab1ID : _data[i].tab1ID,
          BALANCE_RULE: _data[i]['BALANCE_RULE'],
          EQUIP_CODE: _data[i]['機台'] ,
          EQUIP_GROUP: _data[i]['機台群組'],
          EQUIP_NAME: _data[i]['機台名稱'],
          ORDER_SEQ: _data[i]['ORDER_SEQ'],
          PLANT: _data[i]['工廠別'],
          SHOP_CODE: _data[i]['站別代碼'],
          SHOP_NAME: _data[i]['站別名稱'],
          VALID: _data[i]['有效碼'],
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss'),
          USERNAME : this.USERNAME,
          WT_TYPE : "",
          PLANT_CODE : this.PLANT_CODE,
        })
      
    }
    
    console.log(upload_data);
    return new Promise((resolve, reject) => {
      console.log("匯入開始");
      this.LoadingPage = true;
      let myObj = this;
      let obj = {};
      obj = {
        EXCELDATA: upload_data
      };

      console.log("EXCELDATA:"+ obj);
      myObj.PPSService.importI107Excel('1', obj).subscribe(res => {
        console.log("importExcelPPSI105");
        if(res[0].MSG === "Y") { 
          

          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getFCPTB16List()
          
        } else {
          this.errorMSG("匯入錯誤", res[0].MSG);
          this.clearFile();
          this.loading = false;
          this.LoadingPage = false;
        }
      },err => {
        reject('upload fail');
        this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
        this.loading = false;
        this.LoadingPage = false;
      })
    });
    this.getFCPTB16List();

  }

  convertToExcel() {
    console.log("convertToExcel");
    let ID_List = [];
    let arr = [];
    console.log(JSON.stringify(this.weekData[0]));
    let fileName = `系統設定 - 星期起始設定`;
    
    this.excelService.exportAsExcelFile(this.weekData, fileName, this.titleArray);
  }

  convertToExcel1() {
    console.log("convertToExcel");
    let ID_List = [];
    let arr = [];
    console.log(JSON.stringify(this.FCPRSData[0]));
    let fileName = `系統設定 - FCP結果保留設定`;
    
    this.excelService.exportAsExcelFile(this.FCPRSData, fileName, this.titleArray);
  }
}
