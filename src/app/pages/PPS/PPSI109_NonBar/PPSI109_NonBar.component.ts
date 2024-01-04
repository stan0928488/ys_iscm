import { Component, AfterViewInit, ElementRef } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { BtnCellRenderer} from '../../RENDERER/BtnCellRenderer.component';
import {  CellClickedEvent, ColDef, ColGroupDef} from 'ag-grid-community';
import * as moment from 'moment';

interface ItemData {
  idx: number;
  ID: number;
  PLANT_CODE: string;
  SCH_SHOP_CODE: string;
  GRADE_NO: string;
  YIELD_VALUE: number;
  DATE_CREATE: string;
  USER_CREATE: string;
  DATE_UPDATE: string;
  USER_UPDATE: string;
}

interface data {
  SCH_SHOP_CODE: string;
  GRADE_NO: string;
  YIELD_VALUE: number;
}

@Component({
  selector: "app-PPSI109_NonBar",
  templateUrl: "./PPSI109_NonBar.component.html",
  styleUrls: ["./PPSI109_NonBar.component.scss"],
  providers:[NzMessageService]
})
export class PPSI109_NonBarComponent implements AfterViewInit {
  thisTabName = "產率設定(PPSI109)";
  tableHeight: string;
  frameworkComponents: any;
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;
  SCH_SHOP_CODE = '';
  GRADE_NO = '';
  YIELD_VALUE = 0;
  SHOP_CODE = '';

  searchSchShopCodeValue = '';
  searchGradeNoValue = '';
  searchYieldValueValue = '';

  isErrorMsg = false;;
  isERROR = false;
  arrayBuffer:any;
  file:File;
  importdata = [];
  importdata_new = [];
  errorTXT = [];
  isVisibleYieldDialog = false;
  EditMode = [];
  oldlist = {};
  pageIndex = 1;
  pageSize = 30;
  datetime = moment();
  titleArray = ["站別","鋼種","產率設定值",'建立日期', '建立者', '異動日期', '異動者', 'Action'];

  constructor(
    private elementRef:ElementRef,
    private PPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
    this.frameworkComponents = {
      buttonRenderer: BtnCellRenderer,
    };
  }


  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getRunFCPCount();
    this.getTbppsm012NoBarList();
    this.getI109GradeNoList();
    this.getI109ShopCodeList();
    this.tableHeight = (window.innerHeight - 250).toString() + "px";
    
    const aI109NTab = this.elementRef.nativeElement.querySelector('#aI109N') as HTMLAnchorElement;
    const liI109NTab = this.elementRef.nativeElement.querySelector('#liI109N') as HTMLLIElement;
    liI109NTab.style.backgroundColor = '#E4E3E3';
    aI109NTab.style.cssText = 'color: blue; font-weight:bold;';
  }

  searchData= {
    selectedShopCode_default:"",
    selectedGradeNo_default:"",
  }

  selectedShopCode = [{label:'', value:''}]; // 站別選擇
  selectedGradeNo = [{label:'', value:''}]; // 鋼種選擇
  
  gradeNoRowData: gData[] = [];
  shopCodeRowData: sData[] = [];

  gridOptions = {
    defaultColDef: {
        editable: true,
        enableRowGroup: false,
        enablePivot: false,
        enableValue: false,
        sortable: true,
        resizable: true,
        filter: true,
    },
    api:null
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: '站別',
      field: "SCH_SHOP_CODE",
      editable: true,
      width: 150,
    },
    {
      headerName: '鋼種',
      field: "GRADE_NO",
      editable: true,
      width: 150,
    },
    {
      headerName: '產率設定值',
      editable: true,
      field: "YIELD_VALUE",
      width: 150,
    },
    {
      headerName: '建立日期',
      field: "DATE_CREATE",
      editable: false,
      width: 200,
      valueFormatter: this.dateTimeFormatter, 
    },
    {
      headerName: '建立者',
      field: "USER_CREATE",
      editable: false,
      width: 150,
    },
    {
      headerName: '異動日期',
      field: "DATE_UPDATE",
      editable: false,
      width: 200,
      valueFormatter: this.dateTimeFormatter, 
    },
    {
      headerName: '異動者',
      field: "USER_UPDATE",
      editable: false,
      width: 150,
    },
    {
      headerName: 'Action',
      editable:false,
      width: 150,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: [
        {
          onClick: this.editOnClick1.bind(this)
        },
        {
          onClick: this.updateOnClick2.bind(this)
        },
        {
          onClick: this.calcelOnClick3.bind(this)
        },
        {
          onClick: this.deleteOnClick4.bind(this)
        }
      ]
    }
  ]

  dateTimeFormatter(params) {
    return moment(params.value).format('YYYY-MM-DD HH:mm:ss');
  }

  dayDateFormatter(params) {
    return moment(params.value).format('YYYY-MM-DD');
  }

  yearMonthFormatter(params) {
    return moment(params.value).format('YYYY-MM');
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
    this.SCH_SHOP_CODE = '';
    this.GRADE_NO = '';
    this.YIELD_VALUE = 0;

    this.LoadingPage = false;
    this.isVisibleYieldDialog = false;
    this.searchSchShopCodeValue = '';
    this.searchGradeNoValue = '';
    this.searchYieldValueValue = '';
    
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_new = [];
    this.isERROR = false;
    this.errorTXT = [];
  }

  
  tbppsm013Tmp;
  tbppsm013List: ItemData[] = [];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  displayTbppsm013List: ItemData[] = [];
  getTbppsm013List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getTbppsm013List('2').subscribe(res => {
      this.tbppsm013Tmp = res;
      const data = [];
      for (let i = 0; i < this.tbppsm013Tmp.length ; i++) {
        data.push({
          idx: `${i}`,
          id: this.tbppsm013Tmp[i].id,
          plantCode: this.tbppsm013Tmp[i].plantCode,
          schShopCode: this.tbppsm013Tmp[i].schShopCode,
          equipCode: this.tbppsm013Tmp[i].equipCode,
          equipGroup: this.tbppsm013Tmp[i].equipGroup,
          groupAmount: this.tbppsm013Tmp[i].groupAmount,
          equipQuanity: this.tbppsm013Tmp[i].equipQuanity
        });
      }
      this.tbppsm013List = data;
      this.displayTbppsm013List = this.tbppsm013List;
      this.updateEditCache();
      console.log(this.tbppsm013List);
      myObj.loading = false;
    });
    
  }

  tbppsm012NonBarTmp;
  tbppsm012NonBarList: ItemData[] = [];
  resultSet: { [key: string]: { edit: boolean; rowData: ItemData } } = {};
  displayTbppsm012NonBarList: ItemData[] = [];
  showYieldValue = false;

  getTbppsm012NoBarList() {
    this.loading = true;
    let myObj = this;
    const thisForFunc = this;
    thisForFunc.PPSService.gettbppsm012NonBarList(
      thisForFunc.pageIndex,
      thisForFunc.pageSize
    )
    .subscribe(res => {
      console.log("gettbppsm012NonBarList success");
      this.tbppsm012NonBarTmp = res;

      const data = [];
      for (let i = 0; i < this.tbppsm012NonBarTmp.length ; i++) {
        data.push({
          idx: `${i}`,
          ID: this.tbppsm012NonBarTmp[i].ID,
          PLANT_CODE: this.tbppsm012NonBarTmp[i].PLANT_CODE,
          SCH_SHOP_CODE: this.tbppsm012NonBarTmp[i].SCH_SHOP_CODE,
          GRADE_NO: this.tbppsm012NonBarTmp[i].GRADE_NO,
          YIELD_VALUE: this.tbppsm012NonBarTmp[i].YIELD_VALUE,
          USER_CREATE: this.tbppsm012NonBarTmp[i].USER_CREATE,
          DATE_CREATE: this.tbppsm012NonBarTmp[i].DATE_CREATE,
          USER_UPDATE: this.tbppsm012NonBarTmp[i].USER_UPDATE,
          DATE_UPDATE: this.tbppsm012NonBarTmp[i].DATE_UPDATE,
        });
      }
      this.tbppsm012NonBarList = data;
      this.displayTbppsm012NonBarList = this.tbppsm012NonBarList;
      this.updEditCache();
      console.log(this.tbppsm012NonBarList);
      myObj.loading = false;
    });
    
  }
 
  // insert
  insertTab() {
    let myObj = this;

    // if (this.SHOP_CODE === "") {
    //   myObj.message.create("error", "「站別」不可為空");
    //   return;
    // } else if (this.GRADE_NO === "") {
    //   myObj.message.create("error", "「鋼種」不可為空");
    //   return;
    // } 
    // else if(this.SHOP_CODE === this.SCH_SHOP_CODE && this.GRADE_NO === this.GRADE_NO) {
    //   myObj.message.create("error", "同站別下，「鋼種」不可重複新增");
    //   return;
    // } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave()
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    // }
  }


  // update
  editRow(id: number): void {
    this.editCache[id].edit = true;
  }
  
  // delete
  deleteRow(ID: number): void {
    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        this.delID(ID)
      },
      nzOnCancel: () =>
        console.log("cancel")
    });
  }


  // cancel
  cancelEdit(id: number): void {
    const index = this.tbppsm012NonBarList.findIndex(item => item.ID === id);
    this.resultSet[id] = {
      rowData: { ...this.tbppsm012NonBarList[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(rowData:any,id: number): void {
    let myObj = this;
    // e.rowData.idx
    if (rowData.SCH_SHOP_CODE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (rowData.GRADE_NO === undefined) {
      myObj.message.create("error", "「鋼種」不可為空");
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.updateSave(rowData, id)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  

  // update
  updateEditCache(): void {
    this.tbppsm013List.forEach(item => {
      this.editCache[item.ID] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  updEditCache(): void {
    this.tbppsm012NonBarList.forEach(item => {
      this.resultSet[item.ID] = {
        edit: false,
        rowData: { ...item }
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
        SCH_SHOP_CODE : this.searchData.selectedShopCode_default,
        GRADE_NO : this.searchData.selectedGradeNo_default,
        YIELD_VALUE : this.YIELD_VALUE,
        USERNAME : this.USERNAME,
        DATETIME : this.dateTimeFormatter,
      })

      myObj.PPSService.insertI109NonBarSave(obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SCH_SHOP_CODE = undefined;
          this.GRADE_NO = undefined;
          this.YIELD_VALUE = undefined;
          this.onInit();
          this.getTbppsm012NoBarList();
          this.sucessMSG("新增成功", ``);
          this.isVisibleYieldDialog = false;
        } else {
          this.errorMSG("新增失敗", res[0].MSG);
        }
      },err => {
        reject('upload fail');
        this.errorMSG("新增失敗", "後台新增錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }


  // 修改資料
  updateSave(rowData, _id) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID : rowData.ID,
        PLANT_CODE : rowData.PLANT_CODE,
        SCH_SHOP_CODE : rowData.SCH_SHOP_CODE,
        GRADE_NO : rowData.GRADE_NO,
        YIELD_VALUE : rowData.YIELD_VALUE,
        USERNAME : this.USERNAME,
        DATETIME : this.dateTimeFormatter,
      })

      myObj.PPSService.upd012NonBarData(obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.sucessMSG("修改成功", ``);
          const index = this.tbppsm012NonBarList.findIndex(item => item.idx === _id);
          Object.assign(this.tbppsm012NonBarList[index], rowData);
          this.resultSet[_id].edit = false;
        } else {
          this.errorMSG("修改失敗", res[0].MSG);
        }
      },err => {
        reject('upload fail');
        this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }

  
  // 刪除資料
  delID(_id) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      console.log(_id);
      console.log(this.resultSet);
      let id = this.tbppsm012NonBarList[_id].ID;
      myObj.PPSService.del012NonBarTabData(id).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.sucessMSG("刪除成功", ``);
          this.getTbppsm012NoBarList();
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
    if(this.tbppsm012NonBarList.length > 0) {
      data = this.formatDataForExcel(this.tbppsm012NonBarList);
      fileName = `非直棒產率設定`;
      titleArray = ['站別', '鋼種', '產率設定值', '建立日期', '建立者', '異動日期', '異動者'];
    } else {
      this.errorMSG("匯出失敗", "非直棒產率設定目前無資料");
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
        SCH_SHOP_CODE: _.get(item, "SCH_SHOP_CODE"),
        GRADE_NO: _.get(item, "GRADE_NO"),
        YIELD_VALUE: _.get(item, "YIELD_VALUE"),
        DATE_CREATE: _.get(item, "DATE_CREATE"),
        USER_CREATE: _.get(item, "USER_CREATE"),
        DATE_UPDATE: _.get(item, "DATE_UPDATE"),
        USER_UPDATE: _.get(item, "USER_UPDATE"),
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
    if(worksheet.A1 === undefined || worksheet.B1 === undefined || worksheet.C1 === undefined ) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if(worksheet.A1.v !== "站別" || worksheet.B1.v !== "鋼種" || worksheet.C1.v !== "產率設定值" ) {
      this.errorMSG('檔案樣板欄位表頭錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else {
      this.importExcel(importdata);
    }
  
  }
  
  importExcel(_data) {
    console.log("EXCEL 資料上傳檢核開始");
    var upload_data = [];
    for(let i=0 ; i < _data.length ; i++) {
      let allData = JSON.stringify(_data[i]);
      console.log(_data[i]);


      if(this.importdata_new.includes(allData)){
        this.errorTXT.push(`第 ` + (i+2) + `列站別+鋼種資料重複，請檢查` + "<BR/>");
        this.isERROR = true;

      }else{
        this.importdata_new.push(allData);

        if(_data[i]['站別'] == undefined)
          _data[i]['站別'] = '';
        if(_data[i]['鋼種'] == undefined)
          _data[i]['鋼種'] = '';
        if(_data[i]['產率設定值'] == undefined)
          _data[i]['產率設定值'] = '';

      }
        upload_data.push({
          SCH_SHOP_CODE: _data[i]['站別'] ,
          GRADE_NO: _data[i]['鋼種'],
          YIELD_VALUE: _data[i]['產率設定值'],
          USERNAME : this.USERNAME,
          DATETIME : this.dateTimeFormatter
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
            myObj.PPSService.importI109NonBarExcel(obj).subscribe(res => {
              console.log("importI109NonBarExcel");
              if(res[0].MSG === "Y") { 
                this.loading = false;
                this.LoadingPage = false;
                
                this.sucessMSG("EXCEL上傳成功", "");
                this.clearFile();
                this.getTbppsm012NoBarList();
              }
              else {
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
        this.getTbppsm012NoBarList();
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
  // 新增產率設定彈出視窗 
  openYieldDialog() : void {
    this.isVisibleYieldDialog = true;
  }
   // 關閉產率設定彈出視窗
  closeYieldDialog() : void {
    this.isVisibleYieldDialog = false;
  }
  
  cancel012NonBar_dtlRow(i, data) {
    console.log();
    this.EditMode[i] = false;

    this.tbppsm012NonBarList[i].SCH_SHOP_CODE = this.oldlist['SCH_SHOP_CODE'];
    this.tbppsm012NonBarList[i].GRADE_NO = this.oldlist['GRADE_NO'];
    this.tbppsm012NonBarList[i].YIELD_VALUE = this.oldlist['YIELD_VALUE'];
  }

  editOnClick1(e) {
    e.params.api.setFocusedCell(e.params.node.rowIndex, "YIELD_VALUE");
    e.params.api.startEditingCell({
      rowIndex: e.params.node.rowIndex,
      colKey: "YIELD_VALUE"
    });
  }

  updateOnClick2(e) {
    this.saveEdit(e.rowData,e.rowData.idx);
  }

  calcelOnClick3(e) {
    this.cancelEdit(e.rowData.idx);
  }

  deleteOnClick4(e) {
    this.deleteRow(e.rowData.idx);
  }

  // shopCodeList
  getI109ShopCodeList() {
    this.LoadingPage = true;
    let postData = this.searchData;
    postData['SHOP_CODE'] = this.searchData.selectedShopCode_default;
    this.PPSService.getI109ShopCodeList(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        this.shopCodeRowData = JSON.parse(JSON.stringify(result));

        for(let i = 0 ; i<result.length ; i++) {
          this.selectedShopCode.push({label:result[i], value:result[i]})
          console.log(result[i]);
        }
        console.log(this.selectedShopCode);
      } else {
        this.message.error('無資料');
        return;
      }
      this.LoadingPage = false;
    },err => {
      this.LoadingPage = false;
      this.message.error('網絡請求失敗');
    })
  }

  getI109GradeNoList() {
    this.LoadingPage = true;
    let postData = this.searchData;
    postData['GRADE_NO'] = this.searchData.selectedGradeNo_default;
    this.PPSService.getI109GradeNoList(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        this.gradeNoRowData = JSON.parse(JSON.stringify(result));

        for(let i = 0 ; i<result.length ; i++) {
          this.selectedGradeNo.push({label:result[i], value:result[i]})
        }
        console.log(this.selectedGradeNo);
      } else {
        this.message.error('無資料');
        return;
      }
      this.LoadingPage = false;
    },err => {
      this.LoadingPage = false;
      this.message.error('網絡請求失敗');
    })
  }
}

interface sData{
  "SHOP_CODE": String
}

interface gData{
  "GRADE_NO": String
}