import { Component, AfterViewInit, ElementRef, ChangeDetectorRef } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";

import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";
import { AGCustomHeaderComponent } from "src/app/shared/ag-component/ag-custom-header-component";
import { CellEditingStoppedEvent, ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridReadyEvent, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { AGCustomActionCellComponent } from "src/app/shared/ag-component/ag-custom-action-cell-component";
import { PPSI111EditShopCellEditorComponent } from "./PPSI111_EditShopCellEditorComponent";
import { PPSI111EditMachineCellEditorComponent } from "./PPSI111_EditMachineCellEditorComponent";
import { PPSI111EditCombinCellEditorComponent } from "./PPSI111_EditCombinCellEditorComponent";


interface ItemData1 {
  id: string;
  tab1ID: number;
  SCH_SHOP_CODE_1: string;
  MACHINE: string;
  COLUMN_COMMENT: string;
  COLUMN_NAME: string;
}


@Component({
  selector: "app-PPSI111",
  templateUrl: "./PPSI111.component.html",
  styleUrls: ["./PPSI111.component.scss"],
  providers:[NzMessageService]
})
export class PPSI111Component implements AfterViewInit {
  thisTabName = "combine資料設定(PPSI111)";
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

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
  
  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["id","tab1ID","站號","機台","combin條件"];
  importdata_repeat = [];

  //類型
  PLANT = '直棒';

  gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: false,
      editable: true,
      resizable: true,
    }
  };

  fcptb26ColumnDefs : ColDef[] = [
    { 
      headerName:'站別', 
      field:'SCH_SHOP_CODE_1',
      headerComponent : AGCustomHeaderComponent,
      cellEditor : PPSI111EditShopCellEditorComponent
    },
    { 
      headerName:'機台', 
      field:'MACHINE',
      headerComponent : AGCustomHeaderComponent,
      cellEditor : PPSI111EditMachineCellEditorComponent
    },
    { 
      headerName:'combin條件', 
      field:'COLUMN_COMMENT',
      headerComponent : AGCustomHeaderComponent,
      cellEditor : PPSI111EditCombinCellEditorComponent,
      valueFormatter : (params: ValueFormatterParams) => {
        if(Array.isArray(this.COLUMN_NAMEList)){
          for(let combin of this.COLUMN_NAMEList){
              if(_.isEqual(params.value, combin.value)){
                return combin.label;
              }
          }
        }
      }
    },
    { 
      headerName:'Action',
      field:'action',
      editable: false,
      headerComponent : AGCustomHeaderComponent,
      cellRenderer: AGCustomActionCellComponent,
      cellRendererParams:{
        edit : this.rowEditHandler.bind(this),
        cancelEdit: this.rowCancalEditHandler.bind(this),
        saveEdit : this.saveEditHandler.bind(this),
        delete : this.deleteHandler.bind(this)
      }
    }
  ];

  gridApi : GridApi;
  gridColumnApi : ColumnApi;
  agGridContext : any;

  // 編輯模式下，站別選項載入中
  shopListLoading = false;
  // 編輯模式下，combin條件選項載入中	
  combinListLoading = false;


  constructor(
    private elementRef:ElementRef,
    private PPSService: PPSService,
    private getPPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
    this.agGridContext = {
      componentParent: this
    };
  }


  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getRunFCPCount();
    this.getFCPTB26List();
    this.getSHOP_CODEList();
    
    const aI111Tab = this.elementRef.nativeElement.querySelector('#aI111') as HTMLAnchorElement;
    const liI111Tab = this.elementRef.nativeElement.querySelector('#liI111') as HTMLLIElement;
    liI111Tab.style.backgroundColor = '#E4E3E3';
    aI111Tab.style.cssText = 'color: blue; font-weight:bold;';
  }
  

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe(res => {
      console.log("getRunFCPCount success");
      if(res > 0) this.isRunFCP = true;

    });
  }

  /**
   * 
   * @param params 刪除資料
   */
  deleteHandler(params: ICellRendererParams<any, any>){
    this.deleteRow(params.data.tab1ID);
  }

  /**
   * 儲存編輯的資料
   * @param params 
   * @returns 
   */
  async saveEditHandler(params: ICellRendererParams<any, any>){
    // 關閉編輯狀態讓資料生效進到當前陣列中的某條row之中
    params.api.stopEditing(false);

    // 透過id取得緩存的舊資料
    const cacheRowData = this.editCache1[params.data.id.toString()].data;

    // 排除非業務的資料(isEditing)進行比較
    // 若一樣，表示使用者未修改任何資料，不給予更新
    if(_.isEqual(_.omit(params.data, ['isEditing']), _.omit(cacheRowData, ['isEditing']))){
        // 無法轉換提示錯誤
        this.message.warning('無法更新，你尚未修改任何資料');
        return;
    }

    // 執行更新
    await this.saveEdit(params.data, params.rowIndex);
  }

  /**
   * 取消編輯並還原已變動的資料
   * @param params 
   */
     rowCancalEditHandler(params: ICellRendererParams<any, any>){
      params.api.stopEditing(false);
       // 透過id取得緩存的舊資料
       const cacheRowData = this.editCache1[params.data.id.toString()].data;
       // 還原為原資料
       this.FCPTB26List[params.node.rowIndex] = _.cloneDeep(cacheRowData);
       // 渲染資料
       this.gridApi.setRowData(this.FCPTB26List);
       // Y軸滾動到此row的位置
       this.gridApi.ensureIndexVisible(params.node.rowIndex, 'middle');
    }

    /**
   * 開始編輯
   * @param params 
   */
    rowEditHandler(params: ICellRendererParams<any, any>){
      // 控制編輯按鈕的顯示切換
      params.data.isEditing = true;
      
      // 使用ag-grid提供的api開啟整行進入編輯狀態
      // colKey設定進入編輯狀態後焦點要是哪個cloumn，
      // 但一定要帶值，且帶的該欄位是要可編輯的
      params.api.startEditingCell({
        rowIndex : params.rowIndex,
        colKey : 'COLUMN_COMMENT' 
      });

      this.autoSizeAll();
    }

  
  // 獲取ag-grid的Api函數
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  /**
   * 做寬度適應的調整
   */
  autoSizeAll() {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  /**
   * 首次渲染資料完畢後被調用
   * @param event 
   */
  onFirstDataRendered(event : FirstDataRenderedEvent<any>){
    // 在首次資料渲染完畢後，做寬度適應的調整
    this.autoSizeAll();
  }

  cellEditingStoppedHandler(event: CellEditingStoppedEvent<any, any>) {
    
    const newValue = _.omit(event.data, ['isEditing']);
    const oldValue = _.omit(this.editCache1[event.data.id].data, ['isEditing']);
    
    if(_.isEqual(newValue, oldValue)){
      event.data.isEditing = false;
    }
    else{
      event.data.isEditing = true;
    }
    
  }
  
  getFCPTB26List(): Promise<void> {
    this.loading = true;
    let myObj = this;

    return new Promise((resolve, reject) => {
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
        this.updateEditCache();
        console.log(this.FCPTB26List);
        myObj.loading = false;
        resolve();
      },err => {
        this.errorMSG("查詢失敗", "查詢失敗，請聯繫系統工程師");
        this.LoadingPage = false;
        reject();
      });
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
    this.combinListLoading = true;
    let myObj = this;
    this.getPPSService.getOrignListData(this.PLANT).subscribe(res => {
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
      this.combinListLoading = false;
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
    this.shopListLoading = true;
    let myObj = this;
    this.getPPSService.getPickerShopData('直棒').subscribe(res => {
      console.log("getPickerShopData success");
      this.pickerShopList = JSON.parse(res.data);
      const SchShopCode = [];
      //this.editCache1[_idx].data.MACHINE = '';
      for(let i = 0 ; i<this.pickerShopList.length ; i++) {
        SchShopCode.push(this.pickerShopList[i].SCH_SHOP_CODE);
      }
      var newSchShopCode = SchShopCode.filter(function(element, index, arr){    // 排除重複資料
        return arr.indexOf(element) === index;
      });

      this.ShopList = newSchShopCode;
      myObj.loading = false;
      this.shopListLoading = false;
    });
  }
  // 撈取 sorting 表中的機台 by 站別
  getPickerMachineData(_shop, _idx) {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getPickerMachineData('直棒', _shop).subscribe(res => {
      console.log("getPickerMachineData success");
      this.pickerMachineList = JSON.parse(res.data);
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



  insertTab() {
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
          this.insertSave()
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  editRow(id: string): void {
    this.editCache1[id].edit = true;
    this.getRequierList();
    this.getPickerShopData(id);
    this.getPickerMachineData(this.editCache1[id].data.SCH_SHOP_CODE_1, id);
  }
  deleteRow(id: number): void {
    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        this.delID(id)
      },
      nzOnCancel: () =>
        console.log("cancel")
    });
  }
  cancelEdit(id: string): void {
    const index = this.FCPTB26List.findIndex(item => item.id === id);
    this.editCache1[id] = {
      data: { ...this.FCPTB26List[index] },
      edit: false
    };
  }
  saveEdit(rowData : ItemData1, rowIndex : number): void {
    let myObj = this;
    if (_.isEmpty(rowData.SCH_SHOP_CODE_1)) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (_.isEmpty(rowData.COLUMN_COMMENT)) {
      myObj.message.create("error", "「combin條件」不可為空");
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.updateSave(rowData, rowIndex)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  updateEditCache(): void {
    this.FCPTB26List.forEach(item => {
      this.editCache1[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  
  // 新增資料
  insertSave() {
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
        if(res.message === "Y") {
          this.COLUMN_NAME = undefined;
          this.shopCodeAndEquipCodeList = [];
          this.PickShopCode = [];
          this.PickEquipCode = [];
          this.getSHOP_CODEList();
          this.getFCPTB26List();
          this.sucessMSG("新增成功", ``);
          this.panels[0].disabled = false;
        } else {
          this.errorMSG("新增失敗", res.message);
        }
      },err => {
        reject('upload fail');
        this.errorMSG("新增失敗", "後台新增錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }

  // 修改資料
  updateSave(rowData : ItemData1, rowIndex : number) : Promise<void>{
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID : rowData.tab1ID,
        SCH_SHOP_CODE : rowData.SCH_SHOP_CODE_1,
        MACHINE : rowData.MACHINE,
        COLUMN_NAME :rowData.COLUMN_NAME,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })
      myObj.getPPSService.updateTab1Save(obj).subscribe(async res => {
        if(res.message === "Y") {
          this.COLUMN_NAME = undefined;
          this.PickShopCode = [];
          this.PickEquipCode = [];

          this.sucessMSG("修改成功", ``);
          await this.getFCPTB26List();
          this.changeDetectorRef.detectChanges();
          // Y軸滾動到此row的位置
          this.gridApi.ensureIndexVisible(rowIndex, 'middle');
          this.LoadingPage = false;
          resolve();
        } else {
          this.errorMSG("修改失敗", res.message);
          this.LoadingPage = false;
          reject();
        }
      },err => {
        this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
        reject();
      })
    });
  }

  // 刪除資料
  delID(_id) {
    let myObj = this;
    this.loading = true;
    return new Promise((resolve, reject) => {
      myObj.getPPSService.delI200Data(_id, 1).subscribe(res => {
        if(res.message === "Y") {
          this.COLUMN_NAME = undefined;
          this.PickShopCode = [];
          this.PickEquipCode = [];

          this.sucessMSG("刪除成功", ``);
          this.getFCPTB26List();
          this.loading = false;
        }
        else{
          this.errorMSG("刪除失敗", res.message);
          this.loading = false;
        }
      },err => {
        reject('upload fail');
        this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
        this.loading = false;
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
      myObj.PPSService.importI107Excel('2', obj).subscribe(res => {
        console.log("importExcelPPSI105");
        if(res[0].MSG === "Y") { 
          

          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getFCPTB26List()
          
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
    this.getFCPTB26List();

  }

  convertToExcel() {
    console.log("convertToExcel");
    let ID_List = [];
    let arr = [];
    console.log(JSON.stringify(this.FCPTB26List[0]));
    let fileName = `非線速 - 直棒`;
    
    this.excelService.exportAsExcelFile(this.FCPTB26List, fileName, this.titleArray);
  }
}
