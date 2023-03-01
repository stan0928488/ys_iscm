import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
//import { zh_TW, NzI18nService, NzMessageService, NzModalService } from "ng-zorro-antd";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"

import * as moment from 'moment';
import * as _ from "lodash";
import { JsonPipe } from "@angular/common";


interface ItemData1 {
  id: string;
  tab1ID: number;
  SCH_SHOP_CODE_1: string;
  MACHINE: string;
  COLUMN_COMMENT: string;
  COLUMN_NAME: string;
}

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
  //
  selectOptionWeek = [] ;
  selectOptionWeekDay = {label: '星期五', value: 4} ;

  // tab 1
  FCPTB26List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  FCPTB26List: ItemData1[] = [];
  panels = [
    {
      active: false,
      name: '批次新增資料區',
      disabled: false
    }
  ];
  COLUMN_NAME;
  SHOP_CODEList;           // 站別清單
  SHOP_splitList;          // 站別清單 (分群)
  PickShopCode = [];       // 已挑選站別
  EQUIP_CODEList;          // 機台別清單
  EQUIP_splitList;         // 機台別清單 (分群)
  PickEquipCode = [];      // 已挑選機台別
  shopCodeAndEquipCodeList = [];  //已選擇站台幾台數據重組
  COLUMN_NAMEList;
  ShopList;   // UPDATE
  pickerShopList; //tmp
  MachineList;  // UPDATE
  pickerMachineList; //tmp
  // i = 1;
  // editId: string | null = null;

  // tab 3
  FCPTB28List;



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

  constructor(
    private getPPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");

  }


  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getRunFCPCount();

    this.getSHOP_CODEList();
    this.getFCPTB26List();

  }
  

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe(res => {
      console.log("getRunFCPCount success");
      if(res > 0) this.isRunFCP = true;

    });
  }


  //tab1
  getFCPTB26List() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getFCPTB26List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.FCPTB26List_tmp = res;

      const data = [];
      for (let i = 0; i < this.FCPTB26List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.FCPTB26List_tmp[i].ID,
          SCH_SHOP_CODE_1: this.FCPTB26List_tmp[i].SCH_SHOP_CODE_1,
          MACHINE: this.FCPTB26List_tmp[i].MACHINE,
          COLUMN_COMMENT: this.FCPTB26List_tmp[i].COLUMN_COMMENT,
          COLUMN_NAME: this.FCPTB26List_tmp[i].COLUMN_NAME
        });
      }
      this.FCPTB26List = data;
      this.updateEditCache(1);
      console.log(this.FCPTB26List);
      myObj.loading = false;
    });
  }


  //Get Data
  //站別
  getSHOP_CODEList() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getPickerShopEQUIP('1', '　').subscribe(res => {
      console.log("SHOP_CODEList success");
      this.SHOP_CODEList = res;
      console.log(this.SHOP_CODEList);

      var newres = [];
      for(let i=0 ; i < this.SHOP_CODEList.length ; i++) {
        newres.push(this.SHOP_CODEList[i].SHOP_CODE);
      }
      this.SHOP_splitList =  _.chunk(newres, 5);    // list 6組 一分群
      myObj.loading = false;
    });
  }
  //機台別
  getEQUIP_CODEList(_ShopArr) {
    if (_ShopArr.toString() !== "") {
      this.loading = true;
      let myObj = this;
      this.getPPSService.getPickerShopEQUIP('2', _ShopArr.toString()).subscribe(res => {
        console.log("EQUIP_CODEList success");
        this.EQUIP_CODEList = res;
        console.log(this.EQUIP_CODEList);
        var newres = [];
        for(let i=0 ; i < this.EQUIP_CODEList.length ; i++) {
          newres.push({SHOP_CODE: this.EQUIP_CODEList[i].SHOP_CODE, value: this.EQUIP_CODEList[i].EQUIP_CODE, checked :false});
        }
        if(this.PickEquipCode.length > 0) {
          for (let j=0; j< newres.length; j++) {    // 判斷目前機台及已挑選機台
            for(let k=0 ; k< this.PickEquipCode.length; k++) {
              if(newres[j].value === this.PickEquipCode[k].value) {
                newres[j].checked = true;
              }
            }
          }
          this.EQUIP_splitList =  _.chunk(newres, 5);    // list 6組 一分群
        } else {
          this.EQUIP_splitList =  _.chunk(newres, 5);    // list 6組 一分群
        }
        myObj.loading = false;
      });
    } else {
      this.EQUIP_splitList = [];
    }
  }
  // combine條件
  getRequierList(): void {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getOrignListData().subscribe(res => {
      console.log("getOrignListData success");
      this.COLUMN_NAMEList = res;

      let result:any = res ;
      this.COLUMN_NAMEList = []
      let optionListTemp = [] ;
      for(let item of result) {
        let temp = { label: item.column_comment, value:item.column_name } ;
        optionListTemp.push(temp);
      }
      this.COLUMN_NAMEList = optionListTemp ;
      myObj.loading = false;
    });
  }
  // 點擊站別控制項
  clickShopCode(_value) {
    console.log("clickShopCode ")
    if(_value == '' || _value == undefined) {
      this.PickShopCode = [];
      this.PickEquipCode = [];
    } else {
      this.PickShopCode = _value.toString().split(',');
      let shopCodeTemp = this.PickShopCode ;
      let pickEquipCodeListTemp = this.PickEquipCode ;
      let newEquip = [] ;
      shopCodeTemp.forEach((val,index,array)=>{
        for(let i of pickEquipCodeListTemp){
          if(val === i.SHOP_CODE) {
            newEquip.push({SHOP_CODE:val, value:i.value, checked:true}) ;
          }
        }
      })
      this.PickEquipCode = [...newEquip];
    }
    this.getEQUIP_CODEList(this.PickShopCode);

    if (this.PickShopCode.length > 0 && this.PickEquipCode.length > 0) {
      const queryEquip = [];
      for(let i = 0; i <this.PickEquipCode.length; i++) {
        queryEquip.push(this.PickEquipCode[i].value);
      }
      // this.getCalendarList("1911-01", this.PickShopCode, queryEquip);
    } else if (this.PickShopCode.length > 0 && this.PickEquipCode.length < 1) {
      // this.getCalendarList("1911-01", this.PickShopCode, "　");
    } else {
      // this.getCalendarList("1911-01", "　", "　");
    }
  }
  // 點擊機台別控制項
  clickEquipCode(_value) {
    console.log("clickEquipCode ")
    var pickEquipCodeTemp = _value.toString().split(',') ;
    this.PickEquipCode = [] ;
    for(let itemTemp of pickEquipCodeTemp){
      this.EQUIP_splitList.forEach((item1,index,arry)=>{
        item1.forEach((item2,index,arry)=>{
          if(item2.value === itemTemp){
            item2.checked = true
            this.PickEquipCode.push(item2);
            console.log("機台數據 :" + JSON.stringify(this.PickEquipCode))
          }
        })
      })
    }

    if (this.PickEquipCode.length > 0) {
      const queryEquip = [];
      for(let i = 0; i <this.PickEquipCode.length; i++) {
        queryEquip.push(this.PickEquipCode[i].value);
      }
      // this.getCalendarList("1911-01", this.PickShopCode, queryEquip);
    } else {
      // this.getCalendarList("1911-01", this.PickShopCode, "　");
    }

    // console.log(this.PickEquipCode)
  }

  // 站別
  getPickerShopData(_idx) {
    console.log(_idx)
    this.loading = true;
    let myObj = this;
    this.getPPSService.getPickerShopData().subscribe(res => {
      console.log("getPickerShopData success");
      this.pickerShopList = res;
      const SchShopCode = [];
      this.editCache1[_idx].data.MACHINE = '';
      for(let i = 0 ; i<this.pickerShopList.length ; i++) {
        SchShopCode.push(this.pickerShopList[i].SCH_SHOP_CODE);
      }
      var newSchShopCode = SchShopCode.filter(function(element, index, arr){    // 排除重複資料
        return arr.indexOf(element) === index;
      });

      this.ShopList = newSchShopCode;
      myObj.loading = false;
    });
  }
  // 撈取 sorting 表中的機台 by 站別
  getPickerMachineData(_shop, _idx) {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getPickerMachineData(_shop).subscribe(res => {
      console.log("getPickerMachineData success");
      this.pickerMachineList = res;
      const machine = [];
      for(let i = 0 ; i<this.pickerMachineList.length ; i++) {
        machine.push(this.pickerMachineList[i].MACHINE);
      }
      var newMachine = machine.filter(function(element, index, arr){    // 排除重複資料
        return arr.indexOf(element) === index;
      });
      this.MachineList = newMachine;
      myObj.loading = false;
    });
  }

  //處理機台選擇
  //希望提交的數據 {站別： '',幾台 : '' , sortData : [{}]}
  formatEQUIPPickList(){
    this.PickEquipCode = [] ;
    for(let item of this.EQUIP_splitList){
      for(let i of item){
        if(i.checked) this.PickEquipCode.push(i)
      }
    }
    //console.log("選擇組：" + JSON.stringify(this.PickEquipCodeList) ) ;
    this.formatPickShopCode() ;
  }
  // 處理站別選擇
  formatPickShopCode(){
    this.shopCodeAndEquipCodeList  = [] ;
    let shopAndEquip = [] ;
    let shopCodeTemp = this.PickShopCode ;
    let pickEquipCodeListTemp = this.PickEquipCode ;
    shopCodeTemp.forEach((val,index,array)=>{
      let containFg = false ;
      for(let i of pickEquipCodeListTemp){
        if(index === 0){
          shopAndEquip.push({shopCode:i.SHOP_CODE,equipCode:i.value}) ;
        }
        if(val === i.SHOP_CODE){
          console.log("val === i.shopCode : "+ val)
          containFg = true ;
        }
      }
      if(!containFg) shopAndEquip.push({shopCode:val,equipCode:''}) ;
    })
    // console.log("最後重組站別機台數據： " + JSON.stringify(shopAndEquip))
    this.shopCodeAndEquipCodeList = shopAndEquip ;
  }



  insertTab1() {
    let myObj = this;
    if (this.COLUMN_NAME === undefined) {
      myObj.message.create("error", "「combin條件」不可為空");
      return;
    } else if (this.PickShopCode.length === 0) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  editRow(id: string, _type): void {
    if(_type === 1) {
      this.editCache1[id].edit = true;
      this.getRequierList();
      this.getPickerShopData(id);
      this.getPickerMachineData(this.editCache1[id].data.SCH_SHOP_CODE_1, id);
    }
  }
  deleteRow(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }else if(_type === 5){
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
  cancelEdit(id: string, _type): void {
    if(_type === 1) {
      const index = this.FCPTB26List.findIndex(item => item.id === id);
      this.editCache1[id] = {
        data: { ...this.FCPTB26List[index] },
        edit: false
      };
    }

  }
  saveEdit(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache1[id])

      let myObj = this;
      if (this.editCache1[id].data.SCH_SHOP_CODE_1 === undefined) {
        myObj.message.create("error", "「站別」不可為空");
        return;
      } else if (this.editCache1[id].data.COLUMN_COMMENT === undefined) {
        myObj.message.create("error", "「combin條件」不可為空");
        return;
      } else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  updateEditCache(_type): void {
    if(_type === 1) {
      this.FCPTB26List.forEach(item => {
        this.editCache1[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }

  }




  // tab 3
  getFCPTB28List() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getFCPTB28List().subscribe(res => {
      console.log("getFCPTB28List success");
      this.FCPTB28List = res;
      console.log(this.FCPTB28List);
      myObj.loading = false;
    });
  }




  changeTab(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      this.getSHOP_CODEList();
      this.getFCPTB26List();
    } else if(tab === 3) {
      this.getFCPTB28List();
    } else if(tab === 4) {
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
  weekEditFunc(id,index){
    console.log("weekEditFunc  :" + index);
    this.weekData[index].editStatus = true ;
    console.log("default data :" + JSON.stringify(this.selectOptionWeekDay));
    //this.selectOptionWeekDay =  {label: '星期五', value: 4} ;
    this.selectOptionWeekDay = this.selectOptionWeek[index] ;
    console.log("select options :" + JSON.stringify(this.selectOptionWeek)) ;
    console.log("this.selectOptionWeekDay:" + JSON.stringify(this.selectOptionWeekDay)) ;
    //console.log("weekData:" + JSON.stringify(this.weekData) );
    console.log("select option :" + this.selectOptionWeek[index]);
  }

  weekSaveEdit(id,index){
    console.log("weekSaveEdit  :" + index);
    // let myObj = this;
    console.log("select value: " + JSON.stringify(this.selectOptionWeekDay)) ;
    let obj =  {
      ID          : this.weekData[index].ID,
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

  weekCancelEdit( id, index){
    this.weekData[index].editStatus = false ;
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
  statusEditFunc(id,index){
    console.log("statusEditFunc  :" + index);
    this.FCPRSData[index].editStatus = true ;
    this.tab5Switch = this.FCPRSData[index].statusFlag;
  }

  // delStatusID(id,index){
  //   console.log("statusDelFunc  :" + index);
  //   this.FCPRSData[index].editStatus = true ;

  // }
  statusSaveEdit(id,index){
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

    console.log("switch value: " + JSON.stringify(this.FCPRSData[index].statusFlag)) ;
    let obj =  {
      ID          :  this.FCPRSData[index].id,
      SETDATE     :  this.FCPRSData[index].setDate,
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

  statusCancelEdit( id, index){
    this.FCPRSData[index].editStatus = false ;
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
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      //重组站別跟機台數據
      this.formatEQUIPPickList() ;
      // console.log("最後重組站別幾台數據： " + JSON.stringify(this.shopCodeAndEquipCodeList))

      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          shopCodeEquip : this.shopCodeAndEquipCodeList,
          COLUMN_NAME : this.COLUMN_NAME,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })

        myObj.getPPSService.insertTab1Save(obj).subscribe(res => {

          console.log(res)
          if(res[0].MSG === "Y") {
            this.COLUMN_NAME = undefined;
            this.shopCodeAndEquipCodeList = [];
            this.PickShopCode = [];
            this.PickEquipCode = [];
            this.getSHOP_CODEList();
            this.getFCPTB26List();
            this.sucessMSG("新增成功", ``);
            this.panels[0].disabled = false;
          } else {
            this.errorMSG("新增失敗", res[0].MSG);
          }
        },err => {
          reject('upload fail');
          this.errorMSG("新增失敗", "後台新增錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    } else if((_type === 4 )){
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
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache1[_id].data.tab1ID,
          SCH_SHOP_CODE : this.editCache1[_id].data.SCH_SHOP_CODE_1,
          MACHINE : this.editCache1[_id].data.MACHINE,
          COLUMN_NAME : this.editCache1[_id].data.COLUMN_NAME,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.getPPSService.updateTab1Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.COLUMN_NAME = undefined;
            this.PickShopCode = [];
            this.PickEquipCode = [];

            this.sucessMSG("修改成功", ``);

            const index = this.FCPTB26List.findIndex(item => item.id === _id);
            Object.assign(this.FCPTB26List[index], this.editCache1[_id].data);
            this.editCache1[_id].edit = false;
          } else {
            this.errorMSG("修改失敗", res[0].MSG);
          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    } else if(_type === 4) {
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

  // 刪除資料
  delID(_id, _type) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let _ID = this.editCache1[_id].data.tab1ID;
      myObj.getPPSService.delI200Data(_ID, _type).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.COLUMN_NAME = undefined;
          this.PickShopCode = [];
          this.PickEquipCode = [];

          this.sucessMSG("刪除成功", ``);
          this.getFCPTB26List();
        }
      },err => {
        reject('upload fail');
        this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
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




}
