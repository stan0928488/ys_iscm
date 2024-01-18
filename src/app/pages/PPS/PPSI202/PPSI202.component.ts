import { filter } from 'rxjs/operators';
import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import { registerLocaleData, DatePipe } from '@angular/common';

import * as XLSX from 'xlsx';
//import { zh_TW, NzI18nService, NzMessageService, NzModalService, NzGridModule, UploadFile, NzUploadModule, UploadChangeParam } from "ng-zorro-antd";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import {NzUploadModule} from "ng-zorro-antd/upload"


import { Router } from "@angular/router";
import * as moment from 'moment';
import * as _ from "lodash";
import zh from '@angular/common/locales/zh';
import { PPSI202DataTransferService } from "../PPSI202_TabMenu/PPSI202DataTransferService";
import { CellDoubleClickedEvent, CellEditingStoppedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent, ICellEditorParams, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { PPSI202_NonBarEditButtonRendererComponent } from "../PPSI202_NonBar/PPSI202_NonBarEditButtonRendererComponent";
import { PPSI202EditStartTimeCellEditorComponent } from "./PPSI202EditStartTimeCellEditorComponent";
import { PPSI202EditEndTimeCellEditorComponent } from "./PPSI202EditEndTimeeCellEditorComponent";
import { DisabledTimeConfig } from "ng-zorro-antd/date-picker";
import { PPSI202EditShopCellEditorComponent } from "./PPSI202EditShopCellEditorComponent";
import { PPSI202EditEquipCellEditorComponent } from "./PPSI202EditEquipCellEditorComponent";
import { PPSI202EditShutdownTypeCellEditorComponent } from "./PPSI202EditShutdownTypeCellEditorComponent";
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
registerLocaleData(zh);



@Component({
  selector: "app-PPSI202",
  templateUrl: "./PPSI202.component.html",
  styleUrls: ["./PPSI202.component.scss"],
  providers:[NzMessageService,DatePipe]
})
export class PPSI202Component implements AfterViewInit {
  USERNAME;
	loading = false; //loaging data flag
  isRunFCP = false; // 如為true則不可異動
  LoadingPage = false;
  isVisibleUpd = false;
  isVisibleDtl = false;
  isErrorMsg = false;
  clicked = false;
  EditMode = [];

  allChecked_shop = false;
  indeterminate_shop = false;
  allChecked = false;
  indeterminate = false;

  time: Date | null = null;

  CalendarList;            // 定修時間清單
  CalendarDtlList;         // 定修時間清單(明細)
  calendarDtlCacheList = [];// 定修時間清單(明細)更新用的緩存
  CalendarDisplay;         // 定修時間清單(excel)
  selectedValue;           // 日曆
  pickCalendar = [];       // 已挑選日期
  Calendar_splitList;      // 日期 (分群)
  SHOP_CODEList;           // 站別清單
  SHOP_splitList;          // 站別清單 (分群)
  PickShopCode = [];       // 已挑選站別
  EQUIP_CODEList;          // 機台別清單
  EQUIP_splitList;         // 機台別清單 (分群)
  PickEquipCode = [];      // 已挑選機台別
  queryEquip = [];
  time_S;       // 開始時間
  time_E;       // 結束時間
  MODEL_TYPE;   // 停機模式
  showShopEquip;  // 氣泡顯示--暫不使用
  currentmonth;   // 目前顯示月份
  shopListForEdit : any[] = []; // 編輯專用的站別選項清單

  titleArray = [
    "停機開始時間",
    "停機結束時間",
    "站別",
    "機台",
    "停機模式"
  ];

  datetime = moment();
  arrayBuffer:any;
  file:File;
  importdata = [];
  importdata_new = [];
  isERROR = false;
  errorTXT = [];

  oldlist = {};
  newlist;

  fileType: string = '.xls, .xlsx, .csv'; //檔案類型
  
  nzPagination:any ;

  // ag grid Api物件
  gridApi : GridApi;
  gridColumnApi : ColumnApi;
  agGridContext : any;

  // 表格共有設定定義
  gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: false,
      resizable: true,
      autoHeight: true,
      editable: true
    }
  };

  ppsinptb06ColumnDefs: ColDef[] = [
    { 
      headerName:'開始時間',
      field: 'START_TIME', 
      width: 220,
      cellEditor : PPSI202EditStartTimeCellEditorComponent,
      valueFormatter: (params: ValueFormatterParams): string => {
        return moment(params.value).format('YYYY-MM-DD HH:mm:ss')
      },
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'結束時間',
      field: 'END_TIME', 
      width: 220,
      cellEditor : PPSI202EditEndTimeCellEditorComponent,
      valueFormatter: (params: ValueFormatterParams): string => {
        return moment(params.value).format('YYYY-MM-DD HH:mm:ss')
      },
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'站別',
      field: 'SCH_SHOP_CODE', 
      cellEditor : PPSI202EditShopCellEditorComponent,
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'機台',
      field: 'EQUIP_CODE', 
      cellEditor : PPSI202EditEquipCellEditorComponent,
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'停機模式',
      field: 'MODEL_TYPE', 
      cellEditor : PPSI202EditShutdownTypeCellEditorComponent,
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'Action',
      field: 'action', 
      editable: false,
      filter : false,
      cellRenderer : PPSI202_NonBarEditButtonRendererComponent,
      headerComponent : AGCustomHeaderComponent
    }
  ];

  constructor(
    private router: Router,
    private getPPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private upload : NzUploadModule,
    private ppsI202DataTransferService : PPSI202DataTransferService
  ) {

    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.agGridContext = {
      componentParent: this,
    };
  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getSHOP_CODEList(false);
    this.getCalendarList("1911-01", "　", "　");
    this.getRunFCPCount();
    setTimeout(()=>{
      this.ppsI202DataTransferService.setSelectedPage("i202");
    },0);
  }

  // 補充定義
  checktimer(){}

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe(res => {
      console.log("getRunFCPCount success");
      if(res > 0) this.isRunFCP = true;

    });
  }

  async deleteRow(params: ICellRendererParams<any, any>){

    this.Modal.confirm({
      nzTitle: '確定刪除資料?',
      nzOkText: '確定',
      nzCancelText:'取消',
       nzOnOk: async () => {
        this.delete_dtlRow(params.rowIndex, params.data);
      },
      nzOnCancel: () => {
      },
    });

  }

  editSave(params: ICellRendererParams<any, any>){
    this.save_dtlRow(params.rowIndex, params.data);
  }

  cancalEditRow(params: ICellRendererParams<any, any>){
    params.api.stopEditing(false);
    this.CalendarDtlList[params.node.rowIndex] = _.cloneDeep(
      this.calendarDtlCacheList[params.node.rowIndex]
    );
    this.gridApi.setRowData(this.CalendarDtlList);
  }

  editRow(params: ICellRendererParams<any, any>){
    // 控制編輯按鈕的顯示切換
    params.data.hasEdit = true;
    // 使用ag-grid提供的api開啟整行進入編輯狀態
    // colKey設定進入編輯狀態後焦點要是哪個cloumn，
    // 但一定要帶值，且帶的該欄位是要可編輯的
    params.api.startEditingCell({
      rowIndex : params.rowIndex,
      colKey : 'START_TIME' 
    });

    this.upd_dtlRow(params.rowIndex, params.data);
  }

  cellDoubleClickedHandler(event: CellDoubleClickedEvent<any, any>) {
    event.data.hasEdit = true;
  }

  cellEditingStoppedHandler(event: CellEditingStoppedEvent<any, any>) {
    
    // 排除 "hasEdit" 屬性，不列入後續的資料比較
    const newValue = _.omit(event.data, ['hasEdit', 'equipOptionListForUpdate', 'disabledShutdownEndtime', 'isDisabledHourPlusOne', 'shutdownEndtimeTooltipTitle']) as any;
    const oldValue = _.omit(this.calendarDtlCacheList[event.rowIndex], ['hasEdit', 'equipOptionListForUpdate', 'disabledShutdownEndtime', 'isDisabledHourPlusOne', 'shutdownEndtimeTooltipTitle']) as any;

    newValue.START_TIME = newValue.START_TIME.toString();
    newValue.END_TIME = newValue.END_TIME.toString();
    oldValue.START_TIME = oldValue.START_TIME.toString();
    oldValue.END_TIME = oldValue.END_TIME.toString();

    if (_.isEqual(oldValue, newValue)) {
      event.data.hasEdit = false;
    } else {
      event.data.hasEdit = true;
    } 
  }

  // 獲取ag-grid的Api物件
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  

  startTimeStartChange(params: ICellEditorParams) : void {

    if(_.isNil(params.data.START_TIME)){
      params.data.END_TIME = null;
      params.data.disabledShutdownEndtime = true;
      params.data.shutdownEndtimeTooltipTitle = '請先選擇「開始時間」';
      return;
    }
  
    const selectedholidayTimeStartHour = params.data.START_TIME.getHours();
    const selectedholidayTimeStartMinute = params.data.START_TIME.getMinutes();
    const selectedholidayTimeStartSecond = params.data.START_TIME.getSeconds();

    if(selectedholidayTimeStartHour === 23 &&
       selectedholidayTimeStartMinute === 59 &&
       selectedholidayTimeStartSecond === 59){
        params.data.disabledShutdownEndtime = true;
        params.data.shutdownEndtimeTooltipTitle = '「開始時間」已達最後時刻，無「休假時間」可選，請調整開始時間';
    }
    else{
      params.data.disabledShutdownEndtime = false;
      params.data.shutdownEndtimeTooltipTitle = '';
    }
  }

  disabledDate(params: ICellEditorParams){

    return (current: Date): boolean => {
  
      const currentDate = moment(moment(current).format('YYYY-MM-DD'));
      const startDate = moment(moment(params.data.START_TIME).format('YYYY-MM-DD'));
  
      // 禁止選擇比停機開始時間還早的時間
      const disabledBeforeStratTime = currentDate.isBefore(startDate, 'days');
  
      // 禁止選擇比停機開始時間還晚超過一天時間
      const disabledAfterMoreThanOneDayLaterStratTime = currentDate.diff(startDate, 'days') > 1;
  
      return disabledBeforeStratTime || disabledAfterMoreThanOneDayLaterStratTime;
    }
  }

  disabledEndTime(params: ICellEditorParams) {

    return () : DisabledTimeConfig => (
        {
          nzDisabledHours:  this.disabledHours(params),
          nzDisabledMinutes: this.disabledMinutes(params),
          nzDisabledSeconds: this.disabledSeconds(params)
        } 
    );
 }

 // 限制使用者的休假結束時間不能小於休假開始時間
 disabledHours(params: ICellEditorParams){
  const _holidayTimeStart = params.data.START_TIME;

  return () :  number[] => {

    params.data.END_TIME = null;

    let disabledHoursNums : number[] = [];
    let selectedholidayTimeStartHour = _holidayTimeStart.getHours();
    const selectedholidayTimeStartMinute = _holidayTimeStart.getMinutes();
    const selectedholidayTimeStartSecond = _holidayTimeStart.getSeconds();

    if(selectedholidayTimeStartMinute === 59 && selectedholidayTimeStartSecond === 59){
      selectedholidayTimeStartHour++;
    params.data.isDisabledHourPlusOne = true;
    }
    else{
      params.data.isDisabledHourPlusOne = false;
    }

    for (let i = 0; i < selectedholidayTimeStartHour; i++) {
      disabledHoursNums.push(i);
    }

    return disabledHoursNums;
  }
}

disabledMinutes(params: ICellEditorParams) {

  const _holidayTimeStart = params.data.START_TIME;
  const _isDisabledHourPlusOne = params.data.isDisabledHourPlusOne;

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

  disabledSeconds(params: ICellEditorParams) {

    const _holidayTimeStart = params.data.START_TIME;
    const _isDisabledHourPlusOne = params.data.isDisabledHourPlusOne;
  
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

  holidayTimeEndChange(params: ICellEditorParams){

    // 如果停機開始日期與停機結束日期相差一天
    // 停機開始時間與停機結束時間調整為一樣
    // 這樣才符合相差一天(不能跨天)

    const startDate = moment(params.data.START_TIME);
    const endDate = moment(params.data.END_TIME);
    
    if(Math.abs(startDate.diff(endDate)) > 86400000){
      params.data.END_TIME = moment(`${endDate.year()}-${endDate.month()+1}-${endDate.date()} 00:00:00`).toDate();
      this.message.warning('停機時段不得跨天，停機結束時間自動調整為零點');
    }
  }

  //Get Data
  //站別
  getSHOP_CODEList(forEdit : boolean) {
    this.loading = true;
    this.LoadingPage = true;
    let myObj = this;
    this.getPPSService.getPickerShopEQUIP('1', '　').subscribe(res => {
      console.log("SHOP_CODEList success");
      this.SHOP_CODEList = res;
      var newres = [];
      for(let i=0 ; i < this.SHOP_CODEList.length ; i++) {
        newres.push({label: this.SHOP_CODEList[i].SHOP_CODE, value: this.SHOP_CODEList[i].SHOP_CODE, checked :false});
      }

      if(forEdit){
        this.shopListForEdit = [...newres];
        myObj.LoadingPage = false;
        return;
      }

      this.SHOP_CODEList = [...newres]; 
      this.SHOP_splitList =  _.chunk(newres, 5);    // list 6組 一分群
      
      myObj.loading = false;
      myObj.LoadingPage = false;
    });
  }

  async getEquipsByShopsForEditHandler(params : ICellEditorParams, shop : string) {



    // 如果該站別對應的機台已有緩存則從緩存拿
    // if(this.shopEquipMapPersist.has(shop)){
    //   params.data.equipOptionList = _.cloneDeep(this.shopEquipMapPersist.get(shop))
    // }
    // // 沒有該站別對應機台，則發請求跟後端要
    // // 一樣存到緩存中後，從緩存拿
    // else{
    //   await this.getEquipsByShops([shop]);
    //   params.data.equipOptionList = _.cloneDeep(this.shopEquipMapPersist.get(shop))
    // }

  }

  //機台別
  getEQUIP_CODEList(_ShopArr, forUpdate : boolean, rowData : any) {
    if (_ShopArr.toString() !== "") {
      this.loading = true;
      this.LoadingPage = true;
      let myObj = this;
      this.getPPSService.getPickerShopEQUIP('2', _ShopArr.toString()).subscribe(res => {
        console.log("EQUIP_CODEList success");
        this.EQUIP_CODEList = res;
        var newres = [];
        let _equipOptionListForUpdate = [];
        for(let i=0 ; i < this.EQUIP_CODEList.length ; i++) {
          if(forUpdate){
            _equipOptionListForUpdate.push(this.EQUIP_CODEList[i].EQUIP_CODE);
           
          }
          else{
            newres.push({SHOP_CODE: this.EQUIP_CODEList[i].SHOP_CODE, value: this.EQUIP_CODEList[i].EQUIP_CODE, checked :false});
          }
        }

        // 每行休假資訊站別對應的機台
        if(forUpdate){
          rowData.equipOptionListForUpdate = _equipOptionListForUpdate;
          return;
        }

        if(this.PickEquipCode.length > 0) {
          for (let j=0; j< newres.length; j++) {    // 判斷目前機台及已挑選機台
            for(let k=0 ; k< this.PickEquipCode.length; k++) {
              if(newres[j].value === this.PickEquipCode[k].value) {
                newres[j].checked = true;
              }
            }
          }
          this.EQUIP_CODEList = [...newres]; 
          this.EQUIP_splitList =  _.chunk(newres, 5);    // list 5組 一分群
        } else {
          this.EQUIP_CODEList = [...newres]; 
          this.EQUIP_splitList =  _.chunk(newres, 5);    // list 5組 一分群
        }
        myObj.loading = false;
        myObj.LoadingPage = false;
      });
    } else {
      this.EQUIP_splitList = [];
    }
  }
  // 取得定修計畫內容
    getCalendarList(_YM, _SHOP, _EQUIP) {
    this.loading = true;
    this.LoadingPage = true;
    let myObj = this;
    this.getPPSService.getCalendarList(_YM, _SHOP, _EQUIP).subscribe(res => {
      console.log("getCalendarList success");
      this.CalendarList = res;
      myObj.loading = false;
      myObj.LoadingPage = false;
    });
  }

  // 點擊站別控制項
  clickShopCode(_value) {
    console.log("clickShopCode ")
    console.log(_value);

    if(_value == '' || _value == undefined) {
      this.PickShopCode = [];
      this.PickEquipCode = [];
      this.queryEquip = [];
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
    this.getEQUIP_CODEList(this.PickShopCode, false, null);

    if (this.PickShopCode.length > 0 && this.PickEquipCode.length > 0) {
      this.queryEquip = [];
      for(let i = 0; i <this.PickEquipCode.length; i++) {
        this.queryEquip.push(this.PickEquipCode[i].value);
      }
      this.getCalendarList("1911-01", this.PickShopCode, this.queryEquip);
    } else if (this.PickShopCode.length > 0 && this.PickEquipCode.length < 1) {
      this.getCalendarList("1911-01", this.PickShopCode, "　");
      this.queryEquip = [];
    } else {
      this.getCalendarList("1911-01", "　", "　");
      this.queryEquip = [];
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
      this.queryEquip = [];
      for(let i = 0; i <this.PickEquipCode.length; i++) {
        this.queryEquip.push(this.PickEquipCode[i].value);
      }
      this.getCalendarList("1911-01", this.PickShopCode, this.queryEquip);

    } else {
      this.getCalendarList("1911-01", this.PickShopCode, "　");
      this.queryEquip = [];
    }
  }

  
  // 站別checkall
  updateAllChecked_shop(): void {
    this.indeterminate_shop = false;
    if (this.allChecked_shop) {

      this.SHOP_CODEList = this.SHOP_CODEList.map(item => ({
        ...item,
        checked: true
      }));
      this.SHOP_splitList = [];
      this.SHOP_splitList = _.chunk(this.SHOP_CODEList, 5);

      this.PickShopCode = [];
      this.SHOP_CODEList.forEach(e => {
        this.PickShopCode.push(e.value);
      });      

      this.getEQUIP_CODEList(this.PickShopCode, false, null);
    } else {
      this.SHOP_CODEList = this.SHOP_CODEList.map(item => ({
        ...item,
        checked: false
      }));
      this.SHOP_splitList = [];
      this.SHOP_splitList = _.chunk(this.SHOP_CODEList, 5);

      this.PickShopCode = [];
      this.PickEquipCode = [];
      this.getEQUIP_CODEList(this.PickShopCode, false, null);
    }
  }
  // 站別單選
  updateSingleChecked_shop(): void {
    console.log("updateSingleChecked_shop")
    for(let i=0; i<this.SHOP_CODEList.length; i++) {

      if (this.SHOP_splitList.every(item => !item.checked)) {
        this.allChecked_shop = false;
        this.indeterminate_shop = false;
      } else if (this.SHOP_splitList.every(item => item.checked)) {
        this.allChecked_shop = true;
        this.indeterminate_shop = false;
      } else {
        this.indeterminate_shop = true;
      }
    }
  }

  // 機台全選
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {

      this.EQUIP_CODEList = this.EQUIP_CODEList.map(item => ({
        ...item,
        checked: true
      }));
      this.EQUIP_splitList = [];
      this.EQUIP_splitList = _.chunk(this.EQUIP_CODEList, 5);

      this.PickEquipCode = [];
      this.EQUIP_CODEList.forEach(e => {
        this.PickEquipCode.push({SHOP_CODE: e.SHOP_CODE, value: e.value, checked: true});
      });      

      this.queryEquip = [];
      for(let i = 0; i <this.PickEquipCode.length; i++) {
        this.queryEquip.push(this.PickEquipCode[i].value);
      }
      this.getCalendarList("1911-01", this.PickShopCode, this.queryEquip);

    } else {
      this.EQUIP_CODEList = this.EQUIP_CODEList.map(item => ({
        ...item,
        checked: false
      }));
      this.EQUIP_splitList = [];
      this.EQUIP_splitList = _.chunk(this.EQUIP_CODEList, 5);

      this.PickEquipCode = [];
      this.queryEquip = [];
      this.getCalendarList("1911-01", this.PickShopCode, "　");

    }
  }
  // 機台單選
  updateSingleChecked(): void {
    if (this.EQUIP_splitList.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.EQUIP_splitList.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }



  // 點選日曆
  selectChange(select: Date): void {
    console.log("selectChange ");
    var date;
    // this.getCalendarList(this.dateFormat(this.datetime, 6), "　", "　");

    if(select !== undefined) date = this.dateFormat(select, 2);
    var findarr = [];
    if(date !== undefined) {
      if(this.pickCalendar.length > 0) {
        findarr = [...this.pickCalendar];
        var filterValue = findarr.filter(function(item, index, array) {
          return item === date;
        });
        if (filterValue.length > 0) {
          findarr.splice(findarr.findIndex(item => item === date), 1);
          this.pickCalendar = [...findarr];
        } else {
            this.pickCalendar.push(date);
        }
      } else {
        this.pickCalendar.push(date);
      }
    }

  }

  // 刪除不要的日期
  onClose(event, i) {
    if(event) {
      this.pickCalendar.splice(i, 1);
    }
  }

  currentGetDtlParams;

  // 取得停機內容 (站別-機台-時間)
  getDtl(_item) : Promise<void> {
    this.isVisibleDtl = true;
    this.EditMode = [];
    let newShopCode;
    let newEquip;
    if(this.PickShopCode.length === 0) newShopCode = ['x']; else newShopCode = this.PickShopCode;
    if(this.queryEquip.length === 0) newEquip = ['x']; else newEquip = this.queryEquip;

    this.currentGetDtlParams = {
      S_DATE : _item.S_DATE,
      MODEL_TYPE : _item.MODEL_TYPE
    };
    return new Promise((resolve, reject) => {
      this.getPPSService.getCalendarDtlList('2', _item.S_DATE, _item.MODEL_TYPE, newShopCode, newEquip).subscribe(res => {
        console.log("getCalendarDtlList success");
        this.CalendarDtlList = res.map(item => {
          item.START_TIME = new Date(item.START_TIME);
          item.END_TIME = new Date(item.END_TIME);
          item.disabledShutdownEndtime = false;
          item.shutdownEndtimeTooltipTitle = '';
          item.isDisabledHourPlusOne = false;
          item.equipOptionListForUpdate = [];
          return item;
        });
        this.setupUpdateEditCache();
        console.log('this.CalendarDtlList--->', this.CalendarDtlList)
        resolve();
      });
    });

  }

   // 深拷貝緩存一份停機詳細資訊
   setupUpdateEditCache(): void {
    this.calendarDtlCacheList = _.cloneDeep(this.CalendarDtlList);
  }



  //關閉定修計畫詳細資料
  Cdtl_Cancel() {
    // let colsed = false;

    // if(this.EditMode.length > 0) {
    //   for(let i=0 ; i < this.EditMode.length; i++) {
    //     if(this.EditMode[i]) {
    //       colsed = true;
    //       break;
    //     }
    //   }
    // }

    // if(colsed) {
    //   this.isVisibleDtl = true;

    //   this.Modal.confirm({
    //     nzTitle: '訊息提示',
    //     nzContent: '<b style="color: red;"> 修改模式中，尚未存檔，是否繼續修改？</b>',
    //     nzOkText: '繼續修改',
    //     nzOnOk: () => this.isVisibleDtl = true,
    //     nzCancelText: '放棄修改',
    //     nzOnCancel: () => this.Cdtl_ok()

    //   });
    // }

    this.gridApi.stopEditing(false);
    
    setTimeout(()=> {
      const hasEditingRowData = this.CalendarDtlList.filter(item => {
        return item.hasEdit;
      });
  
      if(hasEditingRowData.length > 0){
           this.Modal.confirm({
          nzTitle: '訊息提示',
          nzContent: '<b style="color: red;"> 尚有未提交的資料，是否仍然關閉？</b>',
          nzOkText: '關閉',
          nzOnOk: () => {
            this.isVisibleDtl = false;
          },
          nzCancelText: '取消',
          nzOnCancel: () => {}
        });
      }
      else{
        this.isVisibleDtl = false;
      }  
    }, 1);
  }
  //確定定修計畫詳細資料
  Cdtl_ok() {
    this.isVisibleDtl = false;
  }




  // 定修計畫存檔
  onSunmit() {
    let myObj = this;
    console.log("onSunmit")

    if (this.PickShopCode.length === 0) {
      myObj.message.create("error", "請選擇「站別」");
      return;
    }
    if (this.PickEquipCode.length === 0) {
      myObj.message.create("error", "請選擇「機台別」");
      return;
    }
    if (this.time_S === undefined) {
      myObj.message.create("error", "請選擇「停機開始時間」");
      return;
    }
    if (this.time_E === undefined) {
      myObj.message.create("error", "請選擇「停機結束時間」");
      return;
    }
    if (this.dateFormat(this.time_S, 4) === this.dateFormat(this.time_E, 4)) {
      myObj.message.create("error", "「停機開始時間」不可等於「停機結束時間」");
      return;
    }
    if (this.dateFormat(this.time_S, 4) > this.dateFormat(this.time_E, 4)) {
      myObj.message.create("error", "「停機開始時間」不可大於「停機結束時間」");
      return;
    }
    if (this.MODEL_TYPE === undefined) {
      myObj.message.create("error", "請選擇「停機模式」");
      return;
    }
    if (this.pickCalendar.length === 0) {
      myObj.message.create("error", "請選擇「停機日期」");
      return;
    }

    this.loading = true;
    this.LoadingPage = true;
		return new Promise((resolve, reject) => {
			let obj = {};

			_.extend(obj, {
				PickEquipCode : this.PickEquipCode,
				START_TIME : this.dateFormat(this.time_S, 4),
				END_TIME : this.dateFormat(this.time_E, 4),
				MODEL_TYPE : this.MODEL_TYPE,
				pickCalendar : this.pickCalendar,
        USERCODE : this.USERNAME,
        DATETIME : this.datetime.format('YYYY-MM-DD HH:mm:ss')
			})

      myObj.getPPSService.addCalendarData(obj).subscribe(res => {
        console.log(res[0].MSG)
        if(res[0].MSG === "Y") {
          this.PickShopCode = [];
          this.PickEquipCode = [];
          this.time_S = undefined;
          this.time_E = undefined;
          this.MODEL_TYPE = undefined;
          this.pickCalendar = [];
          this.EQUIP_splitList = undefined;
          this.allChecked_shop = false;
          this.indeterminate_shop = false;
          this.allChecked = false;
          this.indeterminate = false;
          this.getSHOP_CODEList(false);

          this.loading = false;
          this.LoadingPage = false;

          this.sucessMSG("存檔成功", "");
          this.getCalendarList("1911-01", "　", "　");
        } else {
          this.errorMSG("存檔失敗", res[0].MSG);
          this.LoadingPage = false;
        }
      },err => {
        reject('upload fail');
        this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
		});

  }



  //convert to Excel and Download
  convertToExcel() {
    console.log("convertToExcel");
    console.log(this.dateFormat(new Date().getMonth(), 5))
    console.log(this.dateFormat(moment(), 5))
    console.log(this.selectedValue);
    console.log(this.dateFormat(this.selectedValue, 5));
    let date;
    if (this.selectedValue == "" || this.selectedValue == undefined) date = this.dateFormat(moment(), 5); else date = this.dateFormat(this.selectedValue,  5);

    this.getPPSService.getCalendarDtlList('1', date, 'x', 'x', 'x').subscribe(res => {
      console.log("getCalendarDtlList success");
      this.CalendarDisplay = res;

      let data = this.formatDataForExcel(this.CalendarDisplay);
      let fileName = `定修計畫`;
      this.excelService.exportAsExcelFile(data, fileName, this.titleArray);
      console.log("convertToExcel Done");
    });
  }

  formatDataForExcel(_displayData) {
    console.log("_displayData");
    let excelData = [];
    for (let item of _displayData) {
      let obj = {};
      _.extend(obj, {
        START_TIME: this.dateFormat(_.get(item, "START_TIME"), 1),
        END_TIME: this.dateFormat(_.get(item, "END_TIME"), 1),
        SCH_SHOP_CODE: _.get(item, "SCH_SHOP_CODE"),
        EQUIP_CODE: _.get(item, "EQUIP_CODE"),
        MODEL_TYPE: _.get(item, "MODEL_TYPE")
      });
      excelData.push(obj);
    }
    console.log(excelData);
    return excelData;
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

  Upload() {
    let lastname = this.file.name.split('.').pop();
    console.log("incomingfile e : " + this.file);
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {
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

        if(worksheet.A1 === undefined || worksheet.B1 === undefined|| worksheet.C1 === undefined || worksheet.D1 === undefined || worksheet.E1 === undefined) {
          this.errorMSG('檔案樣板錯誤', '請先下載當月資料後，再透過該檔案調整上傳。');
          this.clearFile();
          return;
        } else if(worksheet.A1.v !== "停機開始時間" || worksheet.B1.v !== "停機結束時間" || worksheet.C1.v !== "站別" || worksheet.D1.v !== "機台" || worksheet.E1.v !== "停機模式") {
          this.errorMSG('檔案樣板欄位表頭錯誤', '請先下載當月資料後，再透過該檔案調整上傳。');
          this.clearFile();
          return;
        } else {
          console.log("importExcel")
          console.log(this.importdata)
          this.importExcel(this.importdata);
        }
      }
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  clearFile() {
    var objFile = document.querySelector('#fileupload') as HTMLInputElement;
    console.log('objFile--->', objFile);
    
    console.log(objFile.value + "已清除");
    objFile.value = "";
    console.log(this.file)
    console.log(JSON.stringify(this.file))

  }
  clearFile2 () {
    var obj = document.getElementById('fileupload');
    obj.outerHTML = obj.outerHTML;
  }
  // EXCEL 資料上傳
  importExcel(_data) {

    for(let i=0 ; i < _data.length ; i++) {
      let STIME = this.dateFormat(this.ExcelDateExchange(_data[i].停機開始時間), 1);
      let ETIME = this.dateFormat(this.ExcelDateExchange(_data[i].停機結束時間), 1);
      let SHOP = _data[i].站別;
      let EQUIP = _data[i].機台;
      let MODETYPE = _data[i].停機模式;

      if (STIME === 'Invalid date') {
        STIME = this.dateFormat(_data[i].停機開始時間, 1);
      }
      if(ETIME === 'Invalid date') {
        ETIME = this.dateFormat(_data[i].停機結束時間, 1);
      }

      let diff = this.dayDiff(new Date(STIME), new Date(ETIME));

      if(STIME === undefined || ETIME === undefined || SHOP === undefined || EQUIP === undefined || MODETYPE === undefined) {
        this.errorTXT.push({row: i+2, msg: "有欄位為空值"});
        this.isERROR = true;
      } else if(STIME === 'Invalid date') {
        this.errorTXT.push({row: i+2, msg: "停機開始" + STIME + "時間格式有誤"});
        this.isERROR = true;
      } else if(ETIME === 'Invalid date') {
        this.errorTXT.push({row: i+2, msg: "停機結束時間" + ETIME + "格式有誤"});
        this.isERROR = true;
      } else if(STIME > ETIME) {
        this.errorTXT.push({row: i+2, msg: "「停機開始時間」" + STIME + "，不可超過「停機結束時間」" + ETIME});
        this.isERROR = true;
      } else if(STIME === ETIME) {
        this.errorTXT.push({row: i+2, msg: "「停機開始時間」，不可等於「停機結束時間」"});
        this.isERROR = true;
      } else if( STIME.substring(0, 10) !== ETIME.substring(0, 10) ) {
        if (diff === 1) {
          if (ETIME.substring(11, 19) !== '00:00:00') {
            this.errorTXT.push({row: i+2, msg: "「停機開始時間」" + STIME + "及「停機結束時間」" + ETIME + "不可跨日"});
            this.isERROR = true;
          } else {

          }
        } else {
          this.errorTXT.push({row: i+2, msg: "「停機開始時間」" + STIME + "及「停機結束時間」" + ETIME + "不可跨日"});
          this.isERROR = true;
        }
      } else if(MODETYPE !== '週保' && MODETYPE !== '計畫性停機' && MODETYPE !== '調機' && MODETYPE !== '定修') {
        this.errorTXT.push({row: i+2, msg: "「調機模式」僅能為：週保、計畫性停機、調機、定修，請檢查"});
        this.isERROR = true;
      }
    }

    if(this.isERROR) {
      // 匯入錯誤失敗訊息提醒
      console.log("error msg----------------------------------")
      console.log(this.errorTXT);
      this.clearFile();
      this.isErrorMsg = true;
      this.importdata_new = [];
      this.errorTXT =  _.chunk(this.errorTXT, 1);    // list 5組 一分群

    } else {

      for(let i=0 ; i < _data.length ; i++) {
        let STIME = this.dateFormat(this.ExcelDateExchange(_data[i].停機開始時間), 1);
        let ETIME = this.dateFormat(this.ExcelDateExchange(_data[i].停機結束時間), 1);
        let SHOP = _data[i].站別.toString();
        let EQUIP = _data[i].機台.toString();
        let MODETYPE = _data[i].停機模式;


        if (STIME === 'Invalid date') {
          STIME = this.dateFormat(_data[i].停機開始時間, 1);
        }
        if(ETIME === 'Invalid date') {
          ETIME = this.dateFormat(_data[i].停機結束時間, 1);
        }

        this.importdata_new.push({STIME: STIME, ETIME: ETIME, SHOP: SHOP, EQUIP: EQUIP, MODETYPE: MODETYPE});
      }

      console.log("this.importdata_new")
      console.log(this.importdata_new)

      return new Promise((resolve, reject) => {
        this.LoadingPage = true;
        let myObj = this;
        let obj = {};
        _.extend(obj, {
          EXCELDATA : this.importdata_new,
          DELYM : this.importdata_new[0].STIME.substring(0, 7),
          USERCODE : this.USERNAME,
          DATETIME : this.datetime.format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.getPPSService.importExcel(obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.PickShopCode = [];
            this.PickEquipCode = [];
            this.time_S = undefined;
            this.time_E = undefined;
            this.MODEL_TYPE = undefined;
            this.pickCalendar = [];
            this.EQUIP_splitList = undefined;
            this.importdata_new = [];
            this.allChecked_shop = false;
            this.indeterminate_shop = false;
            this.allChecked = false;
            this.indeterminate = false;
            this.getSHOP_CODEList(false);

            this.loading = false;
            this.LoadingPage = false;

            this.sucessMSG("EXCCEL上傳成功", "");
            this.getCalendarList("1911-01", "　", "　");
            this.clearFile();
          } else {
            this.errorMSG("匯入錯誤", res[0].MSG);
            this.clearFile();
            this.importdata_new = [];
            this.LoadingPage = false;
          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
          this.importdata_new = [];
          this.LoadingPage = false;
        })
      });
    }
  }

  // 修改模式
  upd_dtlRow(i, data) {
    console.log("--------upd_dtlRow-----");
    this.oldlist = {...data};

    this.oldlist['START_TIME'] = moment(this.oldlist['START_TIME']).format('YYYY-MM-DD HH:mm:ss');
    this.oldlist['END_TIME'] = moment(this.oldlist['END_TIME']).format('YYYY-MM-DD HH:mm:ss');


    if (this.EQUIP_CODEList === undefined) {
      this.EQUIP_CODEList = this.getEQUIP_CODEList(data.SCH_SHOP_CODE, false, null);
    } else {
      if(this.EQUIP_CODEList[0].SCH_SHOP_CODE !== data.SCH_SHOP_CODE) {
        this.EQUIP_CODEList = this.getEQUIP_CODEList(data.SCH_SHOP_CODE, false, null);
      }
    }
    let colsed = false;
    if(this.EditMode.length > 0) {
      for(let i=0 ; i < this.EditMode.length; i++) {
        if(this.EditMode[i]) {
          colsed = true;
          break;
        }
      }
    }

    if(colsed) {
      // this.errorMSG("錯誤", "尚有資料未完成修改，請先存檔或取消");
      // return;
    } else {
      this.EditMode[i] = true;
    }

  }

  // 修改存檔
  save_dtlRow(i, data) {
    console.log("-------save_dtlRow------");
    this.newlist = data;

    let START_TIME = this.newlist.START_TIME;
    let END_TIME = this.newlist.END_TIME;
    let diff = this.dayDiff(START_TIME, END_TIME);

    START_TIME = moment(START_TIME).format('YYYY-MM-DD HH:mm:ss');
    END_TIME = moment(END_TIME).format('YYYY-MM-DD HH:mm:ss');
    let SCH_SHOP_CODE = this.newlist.SCH_SHOP_CODE;
    let EQUIP_CODE = this.newlist.EQUIP_CODE;
    let MODEL_TYPE = this.newlist.MODEL_TYPE;

    this.newlist.START_TIME = START_TIME;
    this.newlist.END_TIME = END_TIME;

    console.log(START_TIME)
    console.log(END_TIME)
    if(START_TIME === '' || END_TIME === '' || SCH_SHOP_CODE === '' || EQUIP_CODE === '' || MODEL_TYPE === '') {
      this.errorMSG("錯誤", "有欄位尚未填寫完畢，請檢查");
      return;
    } else if( START_TIME.substring(0, 10) !== END_TIME.substring(0, 10) ) {
      if (diff === 1) {
        if (END_TIME.substring(11, 19) !== '00:00:00') {
          this.errorMSG("錯誤", "停機時間不可跨日");
          return;
        } else {

        }
      } else {
        this.errorMSG("錯誤", "停機時間不可跨日");
        return;
      }
    } else if(START_TIME === END_TIME) {
      this.errorMSG("錯誤", "停機開始時間不可等於停機結束時間");
      return;
    } else if(START_TIME > END_TIME) {
      this.errorMSG("錯誤", "停機開始時間不可大於停機結束時間");
      return;
    } else {

      this.Modal.confirm({
        nzTitle: '是否確定存檔',
        nzOnOk: () => {
          this.SaveOK(i),
          this.EditMode[i] = true
        },
        nzOnCancel: () =>
          this.EditMode[i] = true
      });

    }
  }

  // 確定修改存檔
  SaveOK(col) {
    console.log("SaveOK-------------------------------------")
    console.log("oldlist-->", this.oldlist)
    console.log("newlist-->", this.newlist)

    this.LoadingPage = true;
    let myObj = this;
		return new Promise((resolve, reject) => {
			let obj = {};

			_.extend(obj, {
				OLDLIST : this.oldlist,
				NEWList : this.newlist,
        USERCODE : this.USERNAME,
        DATETIME : this.datetime.format('YYYY-MM-DD HH:mm:ss')
			})
      myObj.getPPSService.updCalendarData(obj).subscribe(async res => {
        if(res[0].MSG === "Y") {
          this.LoadingPage = false;
          this.isVisibleDtl = true;
          this.EditMode[col] = false;
          this.oldlist = [];
          this.getCalendarList("1911-01", "　", "　");
          this.gridApi.stopEditing(false);
          this.queryEquip = [];
          await this.getDtl(this.currentGetDtlParams);
          // 重新渲染停機資訊
          this.gridApi.setRowData(this.CalendarDtlList);
          this.sucessMSG("修改存檔成功", "");
        } else {
          this.errorMSG("修改存檔失敗", res[0].MSG);
          this.LoadingPage = false;
          this.isVisibleDtl = false;
          this.EditMode[col] = true;
        }
      },err => {
        reject('upload fail');
        this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
        this.oldlist = [];
        this.LoadingPage = false;
      })
		});

  }


  // 取消修改
  cancel_dtlRow(i, data) {
    console.log("------cancel_dtlRow-------");
    this.EditMode[i] = false;
  }

  // 明細刪除
  delete_dtlRow(i, data) {
    let colsed = false;
    // if(this.EditMode.length > 0) {
    //   for(let i=0 ; i < this.EditMode.length; i++) {
    //     if(this.EditMode[i]) {
    //       colsed = true;
    //       break;
    //     }
    //   }
    // }
    // if(colsed) {
    //   // this.errorMSG("錯誤", "尚有資料未完成修改，請先存檔或取消");
    //   // return;
    // } else {
      console.log("------delete_dtlRow-------");
      this.oldlist = data;
      this.oldlist['START_TIME'] = moment(this.oldlist['START_TIME']).format('YYYY-MM-DD HH:mm:ss');
      this.oldlist['END_TIME'] = moment(this.oldlist['END_TIME']).format('YYYY-MM-DD HH:mm:ss');

      this.LoadingPage = true;
      let myObj = this;
      return new Promise((resolve, reject) => {
        let obj = {};

        _.extend(obj, {
          OLDLIST : this.oldlist,
          NEWList : this.newlist,
          USERCODE : this.USERNAME,
          DATETIME : this.datetime.format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.getPPSService.delCalendarData(obj).subscribe(async res => {
          if(res[0].MSG === "Y") {

            this.LoadingPage = false;
            this.isVisibleDtl = true;
            this.EditMode[i] = false;
            this.oldlist = [];

            this.sucessMSG("刪除成功", "");
            this.queryEquip = [];
            this.getCalendarList("1911-01", "　", "　");
            await this.getDtl(this.currentGetDtlParams);
             // 如果該顯示停機資訊的表格中資料被刪完
            // 則關閉modal彈出視窗
            if(_.isEmpty(this.CalendarDtlList)){
              this.message.success('停機資訊已被刪除完了');
              this.isVisibleDtl = false;
              return;
            }

            // 重新渲染停機資訊
            this.gridApi.setRowData(this.CalendarDtlList);

            this.LoadingPage = false;
          } else {
            this.errorMSG("刪除失敗", res[0].MSG);
            this.LoadingPage = false;
            this.isVisibleDtl = false;
            this.EditMode[i] = true;
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台存檔錯誤，請聯繫系統工程師");
          this.oldlist = [];
          this.LoadingPage = false;
        })
      });

    // }
  }





  // excel 匯入日期格式處理
  ExcelDateExchange(serial) {
    // const old = serial - 1;
    // const t = Math.round((old - Math.floor(old)) * 24 *60 *60);
    // const time = new Date(1900, 0, old, 0, 0, t);
    // const year = time.getFullYear();
    // const month = time.getMonth() + 1;
    // const date = time.getDate();

    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
    var total_seconds = Math.floor(86400 * fractional_day);
    var seconds = total_seconds % 60;
    total_seconds -= seconds;
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }


  //Date Format
  dateFormat(_dateString, _flag) {
    if (_dateString == undefined || _dateString == '') {
      return "";
    }
    if (_flag == '1') {
      let date = moment(_dateString, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
      return date;
    } else if (_flag == '2') {
      let date = moment(_dateString, "YYYY-MM-DD").format("YYYY-MM-DD");
      return date;
    } else if (_flag == '3') {
      let date = moment(_dateString, "HH:mm:ss").format("HH:mm:ss");
      return date;
    } else if (_flag == '4') {
      let date = moment(_dateString, "HH:mm").format("HH:mm");
      return date;
    } else if (_flag == '5') {
      let date = moment(_dateString, "MM").format("MM");
      return date;
    } else if (_flag == '6') {
      let date = moment(_dateString, "YYYY-MM").format("YYYY-MM");
      return date;
    }
  }

  dayDiff(d1:Date, d2:Date) {
    var diff = Math.abs(d2.getTime() - d1.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays;
  }


	sucessMSG(_title, _context): void {
		this.Modal.success({
			nzTitle: _title,
			nzContent: `${_context}`
		});
	}


	errorMSG(_title, _context): void {
		this.Modal.error({
			nzTitle: _title,
			nzContent: `${_context}`
		});
	}


  //關閉錯誤訊息
  ERR_Cancel() {
    this.errorTXT = [];
    this.isErrorMsg = false;

  }



}
