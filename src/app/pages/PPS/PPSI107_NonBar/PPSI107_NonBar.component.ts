import { Component, ElementRef, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { CellEditingStoppedEvent, ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridReadyEvent, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { AGCustomHeaderComponent } from "src/app/shared/ag-component/ag-custom-header-component";
import { AGCustomActionCellComponent } from "src/app/shared/ag-component/ag-custom-action-cell-component";
import { DecimalPipe } from "@angular/common";
import { SYSTEMService } from "src/app/services/SYSTEM/SYSTEM.service";
import { Router } from "@angular/router";
import { AGHeaderCommonParams, AGHeaderParams } from "src/app/shared/ag-component/types";


interface ItemData {
  idx: number;
  id: number;
  plantCode: string;
  schShopCode: string;
  equipCode: string;
  equipGroup: string;
  equipProcessCode: string;
  diaMin: number;
  diaMax: number;
  wkSpeed: number;
}


@Component({
  selector: "app-PPSI107_NonBar",
  templateUrl: "./PPSI107_NonBar.component.html",
  styleUrls: ["./PPSI107_NonBar.component.scss"],
  providers:[NzMessageService]
})
export class PPSI107_NonBarComponent implements AfterViewInit {
  thisTabName = "線速工時(PPSI107)";
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  userName;
  plantCode;

  // 線速工時
  schShopCode = '';
  equipCode = '';
  equipGroup = '';
  equipProcessCode = '';
  diaMin = 0;
  diaMax = 0;
  wkSpeed = 0;

  isVisibleSpeed = false;
  searchSchShopCodeValue = '';
  searchEquipCodeValue = '';
  searchEquipGroupValue = '';
  searchEquipProcessCodeValue = '';
  searchDiaMinValue = '';
  searchDiaMaxValue = '';
  searchWkSpeedValue = '';

  isErrorMsg = false;;
  isERROR = false;
  arrayBuffer:any;
  file:File;
  importdata = [];
  importdata_new = [];
  errorTXT = [];


  gridApi : GridApi;
  gridColumnApi : ColumnApi;
  decimalPipe : DecimalPipe;
  
  agCustomHeaderParams : AGHeaderParams = {isMenuShow: true,}
  ppsinptb05ColumnDefs : ColDef[] = [
    { 
      headerName:'站別', 
      field:'schShopCode',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'機台', 
      field:'equipCode',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'機群', 
      field:'equipGroup',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'製程代號', 
      field:'equipProcessCode',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'尺寸MIN', 
      field:'diaMin',
      valueFormatter : (params: ValueFormatterParams) => {
        return this.decimalPipe.transform(params.value);
      },
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'尺寸MAX', 
      field:'diaMax',
      valueFormatter : (params: ValueFormatterParams) => {
        return this.decimalPipe.transform(params.value);
      },
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'生產速度', 
      field:'wkSpeed',
      valueFormatter : (params: ValueFormatterParams) => {
        return this.decimalPipe.transform(params.value);
      },
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'Action',
      field:'action',
      editable: false,
      headerComponent : AGCustomHeaderComponent,
      headerComponentParams:this.agCustomHeaderParams,
      cellRenderer: AGCustomActionCellComponent,
      cellRendererParams:{
        edit : this.rowEditHandler.bind(this),
        cancelEdit: this.rowCancalEditHandler.bind(this),
        saveEdit : this.saveEditHandler.bind(this),
        delete : this.deleteHandler.bind(this)
      }
    }
  ];

  agCustomHeaderCommonParams : AGHeaderCommonParams = {agName: 'AGName1' , isSave:true ,path: this.router.url  }
  gridOptions = {
    defaultColDef: {
      editable: true,
      enableRowGroup: false,
      enablePivot: false,
      enableValue: false,
      sortable: false,
      resizable: true,
      filter: true,
    },
    api: null,
    agCustomHeaderParams : {
      agName: 'AGName1' , // AG 表名
      isSave:true ,
      path: this.router.url ,
    },
  };

  constructor(
    private elementRef:ElementRef,
    private PPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private systemService : SYSTEMService,
    private router: Router
  ) {
    this.i18n.setLocale(zh_TW);
    this.userName = this.cookieService.getCookie("USERNAME");
    this.plantCode = this.cookieService.getCookie("plantCode");
    this.decimalPipe = new DecimalPipe('en-US');
  }

  //調用DB欄位
  getDbCloumn(){
    this.systemService.getHeaderComponentStatus(this.agCustomHeaderCommonParams).subscribe(res=>{
      let result:any = res ;
      if(result.code === 200) {
        console.log(result) ;
        if (result.data.length > 0) {
          //拿到DB數據 ，複製到靜態數據
          this.ppsinptb05ColumnDefs.forEach((item)=>{
            result.data.forEach((it) => {
              if(item.field === it.colId) {
                item.width = it.width;
                item.hide = it.hide ;
                item.resizable = it.resizable;
                item.sortable = it.sortable ;
                item.filter = it.filter ;
                item.sortIndex = it.sortIndex ;
              }
            })
          })
          this.ppsinptb05ColumnDefs.sort((a, b) => (a.sortIndex < b.sortIndex ? -1 : 1));
          console.log()
          this.gridOptions.api.setColumnDefs(this.ppsinptb05ColumnDefs) ;   
        }
      } else {
        this.message.error("load error")
      }
    });
  }

   /**
   * 
   * @param params 刪除資料
   */
   deleteHandler(params: ICellRendererParams<any, any>){
    this.deleteRow(params.data.id);
    }

  async saveEditHandler(params: ICellRendererParams<any, any>){
    // 關閉編輯狀態讓資料生效進到當前陣列中的某條row之中
    params.api.stopEditing(false);

    // 透過id取得緩存的舊資料
    const cacheRowData = this.editCache[params.data.idx.toString()].data;

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
     const cacheRowData = this.editCache[params.data.idx.toString()].data;
     // 還原為原資料
     this.displayPpsinptb05List[params.node.rowIndex] = _.cloneDeep(cacheRowData);
     // 渲染資料
     this.gridApi.setRowData(this.displayPpsinptb05List);
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
      colKey : 'wkSpeed' 
    });
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

  /**
   * 獲取ag-grid的Api函數
   * @param params 
   */
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  
  cellEditingStoppedHandler(event: CellEditingStoppedEvent<any, any>) {
    
    const newValue = _.omit(event.data, ['isEditing']);
    const oldValue = _.omit(this.editCache[event.data.idx].data, ['isEditing']);
    

    if(_.isEqual(newValue, oldValue)){
      event.data.isEditing = false;
    }
    else{
      event.data.isEditing = true;
    }
    
  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getRunFCPCount();
    this.getPpsinptb05List();
    
    const aI107NTab = this.elementRef.nativeElement.querySelector('#aI107N') as HTMLAnchorElement;
    const liI107NTab = this.elementRef.nativeElement.querySelector('#liI107N') as HTMLLIElement;
    liI107NTab.style.backgroundColor = '#E4E3E3';
    aI107NTab.style.cssText = 'color: blue; font-weight:bold;'
    this.getDbCloumn();
  }
  

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.PPSService.getRunFCPCount().subscribe(res => {
      console.log("getRunFCPCount success");
      if(res > 0) this.isRunFCP = true;

    });
  }

  onInit() {
    this.schShopCode = '';
    this.equipCode = '';
    this.equipGroup = '';
    this.equipProcessCode = '';
    this.diaMin = 0;
    this.diaMax = 0;
    this.wkSpeed = 0;
  
    this.LoadingPage = false;
    this.isVisibleSpeed = false;
    this.searchSchShopCodeValue = '';
    this.searchEquipCodeValue = '';
    this.searchEquipGroupValue = '';
    this.searchEquipProcessCodeValue = '';
    this.searchDiaMinValue = '';
    this.searchDiaMaxValue = '';
    this.searchWkSpeedValue = '';
    
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_new = [];
    this.isERROR = false;
    this.errorTXT = [];
  }

  
  ppsinptb05Tmp;
  ppsinptb05List: ItemData[] = [];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  displayPpsinptb05List: ItemData[] = [];
  
  getPpsinptb05List() :Promise<void> {
    this.loading = true;
    let myObj = this;
    return new Promise((resolve, reject) => {
      this.PPSService.getPPSINP05List('2').subscribe(res => {
        if(res.code === 200) {

          if(res.length <= 0){
            this.sucessMSG("無資料", "線速工時非直棒目前尚無資料");
            resolve();
            return;
          }

          this.ppsinptb05Tmp = res.data;
          const data = [];
          for (let i = 0; i < this.ppsinptb05Tmp.length ; i++) {
            data.push({
              idx: `${i}`,
              id: this.ppsinptb05Tmp[i].id,
              plantCode: this.ppsinptb05Tmp[i].plantCode,
              schShopCode: this.ppsinptb05Tmp[i].schShopCode,
              equipCode: this.ppsinptb05Tmp[i].equipCode,
              equipGroup: this.ppsinptb05Tmp[i].equipGroup,
              equipProcessCode: this.ppsinptb05Tmp[i].equipProcessCode,
              diaMin: this.ppsinptb05Tmp[i].diaMin,
              diaMax: this.ppsinptb05Tmp[i].diaMax,
              wkSpeed: this.ppsinptb05Tmp[i].wkSpeed
            });
          }
          this.ppsinptb05List = data;
          this.displayPpsinptb05List = this.ppsinptb05List;
          this.updateEditCache();
          console.log(this.ppsinptb05List);
          myObj.loading = false;
          resolve();
        }
      },err => {
        this.errorMSG("獲取資料失敗", "獲取資料失敗，請聯繫系統工程師");
        myObj.loading = false;
        reject();
      });
    });
      
  }

 

  // insert
  insertTab() {
    let myObj = this;
    if (this.schShopCode === "") {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.equipCode === "" && this.equipGroup === "") {
      myObj.message.create("error", "「機台」和「機群」至少填一項");
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


  // update
  editRow(id: number): void {
    this.editCache[id].edit = true;
  }
  
  // delete
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


  // cancel
  cancelEdit(id: number): void {
    const index = this.ppsinptb05List.findIndex(item => item.idx === id);
    this.editCache[id] = {
      data: { ...this.ppsinptb05List[index] },
      edit: false
    };
  }


  // update Save
  async saveEdit(rowData : ItemData, rowIndex : number) : Promise<void> {
    let myObj = this;
    if (rowData.schShopCode === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (rowData.equipCode === undefined && rowData.equipGroup === undefined) {
      myObj.message.create("error", "「機台」和「機群」至少填一項");
      return;
    } else {
        await this.updateSave(rowData, rowIndex)
    }
  }
  

  // update
  updateEditCache(): void {
    this.ppsinptb05List.forEach(item => {
      this.editCache[item.idx] = {
        edit: false,
        data: { ...item }
      };
    });
  }


  // 新增資料
  insertSave() {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        plantCode : this.plantCode,
        schShopCode : this.schShopCode,
        equipCode : this.equipCode,
        equipGroup : this.equipGroup,
        equipProcessCode : this.equipProcessCode,
        diaMin : this.diaMin,
        diaMax : this.diaMax,
        wkSpeed : this.wkSpeed,
        userName : this.userName
      })

      myObj.PPSService.insertI105Save('2', obj).subscribe(res => {
        if(res.message === "Y") {
          this.onInit();
          this.getPpsinptb05List();
          this.sucessMSG("新增成功", ``);
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
  updateSave(rowData : ItemData, rowIndex : number) : Promise<void>{
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        id : rowData.id,
        plantCode : rowData.plantCode,
        schShopCode : rowData.schShopCode,
        equipCode : rowData.equipCode,
        equipGroup : rowData.equipGroup,
        equipProcessCode : rowData.equipProcessCode,
        diaMin : rowData.diaMin,
        diaMax : rowData.diaMax,
        wkSpeed : rowData.wkSpeed,
        userName : this.userName
      })
      myObj.PPSService.updateI105Save('2', obj).subscribe( async res => {
        if(res.message === "Y") {
          this.onInit();
          this.sucessMSG("修改成功", ``);
          await this.getPpsinptb05List();
          this.changeDetectorRef.detectChanges();
          // Y軸滾動到此row的位置
          this.gridApi.ensureIndexVisible(rowIndex, 'middle');
          resolve();
        } else {
          this.LoadingPage = false;
          this.errorMSG("修改失敗", res.message);
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
    return new Promise((resolve, reject) => {
      myObj.PPSService.delI105Data('2', _id).subscribe(res => {
        if(res.message === "Y") {
          this.onInit();
          this.sucessMSG("刪除成功", ``);
          this.getPpsinptb05List();
        }
      },err => {
        reject('upload fail');
        this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }

  
  //convert to Excel and Download
  convertToExcel() {
    let data;
    let fileName;
    let titleArray = [];
    if(this.ppsinptb05List.length > 0) {
      data = this.formatDataForExcel(this.ppsinptb05List);
      fileName = `非直棒線速工時`;
      titleArray = ['廠區別', '站別', '機台', '機群', '製程代號', '尺寸MIN', '尺寸MAX', '生產速度'];
    } else {
      this.errorMSG("匯出失敗", "非直棒線速工時目前無資料");
      return;
    }
    this.excelService.exportAsExcelFile(data, fileName, titleArray);
  }

  formatDataForExcel(_displayData) {
    console.log("_displayData");
    let excelData = [];
    for (let item of _displayData) {
      let obj = {};
      _.extend(obj, {
        plantCode: _.get(item, "plantCode"),
        schShopCode: _.get(item, "schShopCode"),
        equipCode: _.get(item, "equipCode"),
        equipGroup: _.get(item, "equipGroup"),
        equipProcessCode: _.get(item, "equipProcessCode"),
        diaMin: _.get(item, "diaMin"),
        diaMax: _.get(item, "diaMax"),
        wkSpeed: _.get(item, "wkSpeed")
      });
      excelData.push(obj);
    }
    console.log(excelData);
    return excelData;
  }


  // excel檔名
  incomingfile(event) {
    this.file = event.target.files[0];
    console.log("incomingfile e1 : " + this.file);
    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    }
  }

  // EXCEL 匯入
  Upload() {
    let value = document.getElementsByTagName('input')[0].value;
    let lastname = this.file.name.split('.').pop();
    console.log("incomingfile e2 : " + this.file);
    if(value === "") {
      this.errorMSG('無檔案', '請先選擇欲上傳檔案。');
      this.clearFile();
    } else if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {
      this.Excelimport();
    }
  }
  // EXCEL 樣板內資料取得及檢誤
  Excelimport() {
    let fileReader = new FileReader();
    this.importdata = [];
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

      this.checkTemplate(worksheet, this.importdata);
    }
    fileReader.readAsArrayBuffer(this.file);
  }


  // EXCEL 匯入樣版檢查
  checkTemplate(worksheet, importdata) {
    if(worksheet.A1 === undefined || worksheet.B1 === undefined || worksheet.C1 === undefined || worksheet.D1 === undefined || worksheet.E1 === undefined ||
       worksheet.F1 === undefined || worksheet.G1 === undefined || worksheet.H1 === undefined) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if(worksheet.A1.v !== "廠區別" || worksheet.B1.v !== "站別" || worksheet.C1.v !== "機台" || worksheet.D1.v !== "機群" || worksheet.E1.v !== "製程代號" ||
              worksheet.F1.v !== "尺寸MIN" || worksheet.G1.v !== "尺寸MAX" || worksheet.H1.v !== "生產速度") {
      this.errorMSG('檔案樣板欄位表頭錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else {
      this.importExcel(importdata);
    }
  
  }
  
  // EXCEL 資料上傳 (ppsinptb02_nonbar)
  importExcel(_data) {
    for(let i=0 ; i < _data.length ; i++) {
      let plantCode = _data[i].廠區別;
      let schShopCode = _data[i].站別;
      let equipCode = _data[i].機台;
      let equipGroup = _data[i].機群;
      if(plantCode === undefined || schShopCode === undefined || (equipCode === undefined && equipGroup === undefined)) {
        let col = i+2;
        this.errorTXT.push(`第 ` + col + `列，有欄位為空值`);
        this.isERROR = true;
      }
    }

    if(this.isERROR) {
      // 匯入錯誤失敗訊息提醒
      this.clearFile();
      this.isErrorMsg = true;
      this.importdata_new = [];
      this.errorMSG("匯入錯誤", this.errorTXT);

    } else {
      for(let i=0 ; i < _data.length ; i++) {

        let plantCode = _data[i].廠區別.toString();
        let schShopCode = _data[i].站別.toString();
        let equipCode = _data[i].機台 !== undefined ? _data[i].機台.toString() : '';
        let equipGroup = _data[i].機群 !== undefined ? _data[i].機群.toString() : '';
        let equipProcessCode = _data[i].製程代號 !== undefined ? _data[i].製程代號.toString() : '';
        let diaMin = _data[i].尺寸MIN !== undefined ? _data[i].尺寸MIN.toString() : '0';
        let diaMax = _data[i].尺寸MAX !== undefined ? _data[i].尺寸MAX.toString() : '0';
        let wkSpeed = _data[i].生產速度 !== undefined ? _data[i].生產速度.toString() : '0';
        this.importdata_new.push({plantCode: plantCode, schShopCode: schShopCode, equipCode: equipCode, equipGroup: equipGroup, 
                                  equipProcessCode: equipProcessCode, diaMin: diaMin, diaMax: diaMax, wkSpeed: wkSpeed});
      }

      return new Promise((resolve, reject) => {
        this.LoadingPage = true;
        let myObj = this;
        let obj = {};
        _.extend(obj, {
          excelData : this.importdata_new,
          userName : this.userName
        })
        myObj.PPSService.importI105Excel('2', obj).subscribe(res => {
          if(res.message === "Y") {
            this.loading = false;
            this.LoadingPage = false;

            this.sucessMSG("EXCCEL上傳成功", "");
            this.getPpsinptb05List();
            this.clearFile();
            this.onInit();
          } else {
            this.errorMSG("匯入錯誤", res.message);
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
  
  // 清空資料
  clearFile() {
    var objFile = document.getElementsByTagName('input')[0];
    console.log(objFile.value + "已清除");
    objFile.value = "";
    console.log(this.file)
    console.log(JSON.stringify(this.file))
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

  //============== 新增資料之彈出視窗 =====================
  // 新增線速工時之彈出視窗
  openSpeedInput() : void {
    this.isVisibleSpeed = true;
  }
   //取消線速工時彈出視窗
   cancelSpeedInput() : void {
    this.isVisibleSpeed = false;
  }

// ============= 過濾資料之menu ========================
  // 4.(資料過濾)線速工時
  ppsinptb05ListFilter(property:string, keyWord:string){
    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      if (keyWord == "") {
        return true;
      } else {
        return _.startsWith(propertyValue, keyWord);
      }
    };

    const data = this.ppsinptb05List.filter(item => filterFunc(item));
    this.displayPpsinptb05List = data;
  }

  // 資料過濾---線速工時 --> 站別
  searchSchShopCode() : void{
    this.ppsinptb05ListFilter("schShopCode", this.searchSchShopCodeValue);
  } 
  resetBySchShopCode() : void{
    this.searchSchShopCodeValue = '';
    this.ppsinptb05ListFilter("schShopCode", this.searchSchShopCodeValue);
  }

  // 資料過濾---線速工時 --> 機台
  searchEquipCode() : void{
    this.ppsinptb05ListFilter("equipCode", this.searchEquipCodeValue);
  } 
  resetByEquipCode() : void{
    this.searchEquipCodeValue = '';
    this.ppsinptb05ListFilter("equipCode", this.searchEquipCodeValue);
  }
  // 資料過濾---線速工時 --> 機群
  searchEquipGroup() : void{
    this.ppsinptb05ListFilter("equipGroup", this.searchEquipGroupValue);
  } 
  resetByEquipGroup() : void{
    this.searchEquipGroupValue = '';
    this.ppsinptb05ListFilter("equipGroup", this.searchEquipGroupValue);
  }
  // 資料過濾---線速工時 --> 製程代號
  searchEquipProcessCode() : void{
    this.ppsinptb05ListFilter("equipGroup", this.searchEquipProcessCodeValue);
  } 
  resetByEquipProcessCode() : void{
    this.searchEquipProcessCodeValue = '';
    this.ppsinptb05ListFilter("equipGroup", this.searchEquipProcessCodeValue);
  }

  // 資料過濾---線速工時 --> 尺寸MIN
  searchDiaMin() : void{
    this.ppsinptb05ListFilter("diaMin", this.searchDiaMinValue);
  } 
  resetByDiaMin() : void{
    this.searchDiaMinValue = '';
    this.ppsinptb05ListFilter("diaMin", this.searchDiaMinValue);
  }

  // 資料過濾---線速工時 --> 尺寸MAX
  searchDiaMax() : void{
    this.ppsinptb05ListFilter("diaMax", this.searchDiaMaxValue);
  } 
  resetByDiaMax() : void{
    this.searchDiaMaxValue = '';
    this.ppsinptb05ListFilter("diaMax", this.searchDiaMaxValue);
  }

  // 資料過濾---線速工時 --> 生產速度
  searchByWkSpeed() : void{
    this.ppsinptb05ListFilter("wkSpeed", this.searchWkSpeedValue);
  } 
  resetByWkSpeed() : void{
    this.searchWkSpeedValue = '';
    this.ppsinptb05ListFilter("wkSpeed", this.searchWkSpeedValue);
  }


}
