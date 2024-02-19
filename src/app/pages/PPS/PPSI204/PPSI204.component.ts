import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import { ExcelService } from "src/app/services/common/excel.service";
import * as XLSX from 'xlsx';
import * as _ from "lodash";
import { BtnCellRenderer } from "../../RENDERER/BtnCellRenderer.component";
import { AGCustomHeaderComponent } from "src/app/shared/ag-component/ag-custom-header-component";
import { SYSTEMService } from "src/app/services/SYSTEM/SYSTEM.service";
import { Router } from "@angular/router";
import { ColDef } from "ag-grid-community";
import { AGHeaderCommonParams, AGHeaderParams } from "src/app/shared/ag-component/types";



interface ItemData16 {
  id: string;
  tab1ID: number;
  SHOP_CODE_SCHE: string;
  CHOOSE_EQUIP_CODE: string;
  COMPAIGN_ID: string;
  PARAMETER_COL: string;
  PARAMETER_CONDITION: string;
  PARAMETER_NAME: string;
  TURN_DIA_MAX_MIN: string;
  TURN_DIA_MAX_MAX: string;
  SCHE_TYPE: string;
  DATA_DELIVERY_RANGE_MIN: string;
  DATA_DELIVERY_RANGE_MAX: string;
  START_TIME: string;
  END_TIME: string;
}

@Component({
  selector: "app-PPSI204",
  templateUrl: "./PPSI204.component.html",
  styleUrls: ["./PPSI204.component.scss"],
  providers:[NzMessageService]
})
export class PPSI204Component implements AfterViewInit {
  
  frameworkComponents: any;
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;
  file:File;
  importdata = [];
  importdata_new = [];
  arrayBuffer:any;


  // Campaign限制
  SHOP_CODE_SCHE;
  CHOOSE_EQUIP_CODE;
  COMPAIGN_ID;
  PARAMETER_COL;
  PARAMETER_CONDITION;
  PARAMETER_NAME;
  TURN_DIA_MAX_MIN;
  TURN_DIA_MAX_MAX;
  SCHE_TYPE;
  DATA_DELIVERY_RANGE_MIN;
  DATA_DELIVERY_RANGE_MAX;
  START_TIME;
  END_TIME;
  DIA_MIN;
  isVisibleCampaign = false;
  searchShopCodeScheValue = '';
  searchChooseEquipCodeValue = '';
  searchCompaignIdValue = '';
  searchParameterColValue = '';
  searchParameterConditionValue = '';
  searchParameterNameValue = '';
  searchTurnDiaMaxMinValue = '';
  searchTurnDiaMaxMaxValue = '';
  searchScheTypeValue = '';
  searchDataDeliveryRangeMinValue = '';
  searchDataDeliveryRangeMaxValue = '';
  searchStartTimeValue = '';
  searchEndTimeValue = '';

  agCustomHeaderParams : AGHeaderParams = {isMenuShow: true,}
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
    }
  };

  columnDefs: ColDef[] = [
    {width: 100,headerName: '站別',field: 'SHOP_CODE_SCHE',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '機台',field: 'CHOOSE_EQUIP_CODE',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: 'Campaign ID',field: 'COMPAIGN_ID',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '欄位',field: 'PARAMETER_COL',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '條件',field: 'PARAMETER_CONDITION',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '參數',field: 'PARAMETER_NAME',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '產出尺寸MIN',field: 'TURN_DIA_MAX_MIN',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '產出尺寸MAX',field: 'TURN_DIA_MAX_MAX',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '抽數別',field: 'SCHE_TYPE',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '交期區間MIN',field: 'DATA_DELIVERY_RANGE_MIN',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '交期區間MAX',field: 'DATA_DELIVERY_RANGE_MAX',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '生產日期 起',field: 'START_TIME',headerComponent: AGCustomHeaderComponent},
    {width: 100,headerName: '生產日期 訖',field: 'END_TIME',headerComponent: AGCustomHeaderComponent},
    {
      width: 150,
      headerName: 'Action',
      editable: false,
      headerComponent : AGCustomHeaderComponent,
      headerComponentParams:this.agCustomHeaderParams,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: [
        {
          onClick: this.onBtnClick1.bind(this),
        },
        {
          onClick: this.onBtnClick2.bind(this),
        },
        {
          onClick: this.onBtnClick3.bind(this),
        },
        {
          onClick: this.onBtnClick4.bind(this),
        },
      ],
    },
  ];

  constructor(
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
    private systemService : SYSTEMService,
    private router: Router
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
    this.getPPSINP16List();
    this.getDbCloumn();
  }
  
  
  PPSINP16List_tmp;
  editCache16: { [key: string]: { edit: boolean; data: ItemData16 } } = {};
  PPSINP16List: ItemData16[] = [];
  displayPPSINP16List : ItemData16[] = [];
  getPPSINP16List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP16List().subscribe(res => {
      console.log("getPPSINP16List success");
      this.PPSINP16List_tmp = res;
      
      const data = [];
      for (let i = 0; i < this.PPSINP16List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.PPSINP16List_tmp[i].ID,
          SHOP_CODE_SCHE: this.PPSINP16List_tmp[i].SHOP_CODE_SCHE,
          CHOOSE_EQUIP_CODE: this.PPSINP16List_tmp[i].CHOOSE_EQUIP_CODE,
          COMPAIGN_ID: this.PPSINP16List_tmp[i].COMPAIGN_ID,
          PARAMETER_COL: this.PPSINP16List_tmp[i].PARAMETER_COL,
          PARAMETER_CONDITION: this.PPSINP16List_tmp[i].PARAMETER_CONDITION,
          PARAMETER_NAME: this.PPSINP16List_tmp[i].PARAMETER_NAME,
          TURN_DIA_MAX_MIN: this.PPSINP16List_tmp[i].TURN_DIA_MAX_MIN,
          TURN_DIA_MAX_MAX: this.PPSINP16List_tmp[i].TURN_DIA_MAX_MAX,
          SCHE_TYPE: this.PPSINP16List_tmp[i].SCHE_TYPE,
          DATA_DELIVERY_RANGE_MIN: this.PPSINP16List_tmp[i].DATA_DELIVERY_RANGE_MIN,
          DATA_DELIVERY_RANGE_MAX: this.PPSINP16List_tmp[i].DATA_DELIVERY_RANGE_MAX,
          START_TIME: this.PPSINP16List_tmp[i].START_TIME,
          END_TIME: this.PPSINP16List_tmp[i].END_TIME,
        });
      }
      this.PPSINP16List = data;
      this.displayPPSINP16List = this.PPSINP16List;
      this.updateEditCache();
      console.log(this.PPSINP16List);
      myObj.loading = false;
    });
  }

  //調用DB欄位
  getDbCloumn(){
    this.systemService.getHeaderComponentStatus(this.agCustomHeaderCommonParams).subscribe(res=>{
      let result:any = res ;
      if(result.code === 200) {
        console.log(result) ;
        if (result.data.length > 0) {
          //拿到DB數據 ，複製到靜態數據
          this.columnDefs.forEach((item)=>{
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
          this.columnDefs.sort((a, b) => (a.sortIndex < b.sortIndex ? -1 : 1));
          console.log()
          this.gridOptions.api.setColumnDefs(this.columnDefs) ;   
        }
      } else {
        this.message.error("load error")
      }
    });
  }  

  // insert
  insertTab() {
    let myObj = this;
    if (this.SHOP_CODE_SCHE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.CHOOSE_EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.COMPAIGN_ID === undefined) {
      myObj.message.create("error", "「Campaign ID」不可為空");
      return;
    } else if (this.PARAMETER_COL === undefined) {
      myObj.message.create("error", "「欄位」不可為空");
      return;
    } else if (this.PARAMETER_CONDITION === undefined) {
      myObj.message.create("error", "「條件」不可為空");
      return;
    } else if (this.PARAMETER_NAME === undefined) {
      myObj.message.create("error", "「參數」不可為空");
      return;
    } else if (this.TURN_DIA_MAX_MIN === undefined) {
      myObj.message.create("error", "「產出尺寸MIN」不可為空");
      return;
    } else if (this.TURN_DIA_MAX_MAX === undefined) {
      myObj.message.create("error", "「產出尺寸MAX」不可為空");
      return;
    } else if (this.SCHE_TYPE === undefined) {
      myObj.message.create("error", "「抽數別」不可為空");
      return;
    } else if (this.DATA_DELIVERY_RANGE_MIN === undefined) {
      myObj.message.create("error", "「交期區間MIN」不可為空");
      return;
    } else if (this.DATA_DELIVERY_RANGE_MAX === undefined) {
      myObj.message.create("error", "「交期區間MAX」不可為空");
      return;
    } else if (this.START_TIME === undefined) {
      myObj.message.create("error", "「生產日期 起」不可為空");
      return;
    } else if (this.END_TIME === undefined) {
      myObj.message.create("error", "「生產日期 訖」不可為空");
      return;
    }else {
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
  editRow(id: string): void {
    this.editCache16[id].edit = true;
  }
  
  // delete
  deleteRow(rowData: ItemData16): void {
    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        this.delID(rowData)
      },
      nzOnCancel: () =>
        console.log("cancel")
    });
  }


  // cancel
  cancelEdit(id: string): void {
    const index = this.PPSINP16List.findIndex(item => item.id === id);
    this.editCache16[id] = {
      data: { ...this.PPSINP16List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(rowData: ItemData16): void {
    let myObj = this;
    if (rowData.SHOP_CODE_SCHE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (rowData.CHOOSE_EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (rowData.COMPAIGN_ID === undefined) {
      myObj.message.create("error", "「Campaign ID」不可為空");
      return;
    } else if (rowData.PARAMETER_COL === undefined) {
      myObj.message.create("error", "「欄位」不可為空");
      return;
    } else if (rowData.PARAMETER_CONDITION === undefined) {
      myObj.message.create("error", "「條件」不可為空");
      return;
    } else if (rowData.PARAMETER_NAME === undefined) {
      myObj.message.create("error", "「參數」不可為空");
      return;
    } else if (rowData.TURN_DIA_MAX_MIN === undefined) {
      myObj.message.create("error", "「產出尺寸MIN」不可為空");
      return;
    } else if (rowData.TURN_DIA_MAX_MAX === undefined) {
      myObj.message.create("error", "「產出尺寸MAX」不可為空");
      return;
    } else if (rowData.SCHE_TYPE === undefined) {
      myObj.message.create("error", "「抽數別」不可為空");
      return;
    } else if (rowData.DATA_DELIVERY_RANGE_MIN === undefined) {
      myObj.message.create("error", "「交期區間MIN」不可為空");
      return;
    } else if (rowData.DATA_DELIVERY_RANGE_MAX === undefined) {
      myObj.message.create("error", "「交期區間MAX」不可為空");
      return;
    } else if (rowData.START_TIME === undefined) {
      myObj.message.create("error", "「生產日期 起」不可為空");
      return;
    } else if (rowData.END_TIME === undefined) {
      myObj.message.create("error", "「生產日期 訖」不可為空");
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.updateSave(rowData)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  

  // update
  updateEditCache(): void {
    this.PPSINP16List.forEach(item => {
      this.editCache16[item.id] = {
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
        SHOP_CODE_SCHE: this.SHOP_CODE_SCHE,
        CHOOSE_EQUIP_CODE : this.CHOOSE_EQUIP_CODE,
        COMPAIGN_ID : this.COMPAIGN_ID,
        PARAMETER_COL : this.PARAMETER_COL,
        PARAMETER_CONDITION : this.PARAMETER_CONDITION,
        PARAMETER_NAME : this.PARAMETER_NAME,
        TURN_DIA_MAX_MIN: this.TURN_DIA_MAX_MIN,
        TURN_DIA_MAX_MAX: this.TURN_DIA_MAX_MAX,
        SCHE_TYPE: this.SCHE_TYPE,
        DATA_DELIVERY_RANGE_MIN: this.DATA_DELIVERY_RANGE_MIN,
        DATA_DELIVERY_RANGE_MAX: this.DATA_DELIVERY_RANGE_MAX,
        START_TIME: this.START_TIME,
        END_TIME: this.END_TIME ,
      })

      myObj.PPSService.insertI116Tab1Save(obj).subscribe(res => {
        
        console.log(res)
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_SCHE = undefined;
          this.CHOOSE_EQUIP_CODE = undefined;
          this.COMPAIGN_ID = undefined;
          this.PARAMETER_COL = undefined;
          this.PARAMETER_CONDITION = undefined;
          this.PARAMETER_NAME = undefined;
          this.TURN_DIA_MAX_MIN = undefined;
          this.TURN_DIA_MAX_MAX = undefined;
          this.SCHE_TYPE = undefined;
          this.DATA_DELIVERY_RANGE_MIN = undefined;
          this.DATA_DELIVERY_RANGE_MAX = undefined;
          this.START_TIME = undefined;
          this.END_TIME = undefined;
          this.getPPSINP16List();
          this.sucessMSG("新增成功", ``);
          this.isVisibleCampaign = false;
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
  updateSave(rowData:ItemData16) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID : rowData.tab1ID,
        SHOP_CODE_SCHE : rowData.SHOP_CODE_SCHE,
        CHOOSE_EQUIP_CODE : rowData.CHOOSE_EQUIP_CODE,
        COMPAIGN_ID : rowData.COMPAIGN_ID,
        PARAMETER_COL : rowData.PARAMETER_COL,
        PARAMETER_CONDITION : rowData.PARAMETER_CONDITION,
        PARAMETER_NAME : rowData.PARAMETER_NAME,
        TURN_DIA_MAX_MIN : rowData.TURN_DIA_MAX_MIN,
        TURN_DIA_MAX_MAX : rowData.TURN_DIA_MAX_MAX,
        SCHE_TYPE : rowData.SCHE_TYPE,
        DATA_DELIVERY_RANGE_MIN : rowData.DATA_DELIVERY_RANGE_MIN,
        DATA_DELIVERY_RANGE_MAX : rowData.DATA_DELIVERY_RANGE_MAX,
        START_TIME : rowData.START_TIME,
        END_TIME : rowData.END_TIME,
      })

      myObj.PPSService.updateI116Tab1Save(obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_SCHE = undefined;
          this.CHOOSE_EQUIP_CODE = undefined;
          this.COMPAIGN_ID = undefined;
          this.PARAMETER_COL = undefined;
          this.PARAMETER_CONDITION = undefined;
          this.PARAMETER_NAME = undefined;
          this.TURN_DIA_MAX_MIN = undefined;
          this.TURN_DIA_MAX_MAX = undefined;
          this.SCHE_TYPE = undefined;
          this.DATA_DELIVERY_RANGE_MIN = undefined;
          this.DATA_DELIVERY_RANGE_MAX = undefined;
          this.START_TIME = undefined;
          this.END_TIME = undefined;

          this.sucessMSG("修改成功", ``);

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
  delID(rowData:ItemData16) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let _ID = rowData.tab1ID;
      myObj.PPSService.delI116Tab1Data(_ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_SCHE = undefined;
          this.CHOOSE_EQUIP_CODE = undefined;
          this.COMPAIGN_ID = undefined;
          this.PARAMETER_COL = undefined;
          this.PARAMETER_CONDITION = undefined;
          this.PARAMETER_NAME = undefined;
          this.TURN_DIA_MAX_MIN = undefined;
          this.TURN_DIA_MAX_MAX = undefined;
          this.SCHE_TYPE = undefined;
          this.DATA_DELIVERY_RANGE_MIN = undefined;
          this.DATA_DELIVERY_RANGE_MAX = undefined;
          this.START_TIME = undefined;
          this.END_TIME = undefined;

          this.sucessMSG("刪除成功", ``);
          this.getPPSINP16List();
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

  //============== 新增資料之彈出視窗 =====================
  // 新增Campaign限制之彈出視窗 
  openCampaignInput(): void {
    this.isVisibleCampaign = true;
  }
  // 取消Campaign限制之彈出視窗 
  cancelCampaignInput() : void {
    this.isVisibleCampaign = false;
  } 

  // 匯出 Excel
  convertToExcel() {
    let data;
    let fileName;
    let titleArray = [];
    if(this.PPSINP16List.length > 0) {
      data = this.formatDataForExcel(this.PPSINP16List);
      fileName = `Campaign限制資料_直棒`;
      titleArray = ['站別', '機台', 'Campaign ID', '欄位', '條件', '參數', '產出尺寸MIN', '產出尺寸MAX', '抽數別', '交期區間MIN', '交期區間MAX', '生產日期 起', '生產日期 迄'];
    } else {
      this.errorMSG("匯出失敗", "Campaign 限制資料內目前無資料");
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
        SHOP_CODE_SCHE: _.get(item, "SHOP_CODE_SCHE"),
        CHOOSE_EQUIP_CODE: _.get(item, "CHOOSE_EQUIP_CODE"),
        COMPAIGN_ID: _.get(item, "COMPAIGN_ID"),
        PARAMETER_COL: _.get(item, "PARAMETER_COL"),
        PARAMETER_CONDITION: _.get(item, "PARAMETER_CONDITION"),
        PARAMETER_NAME: _.get(item, "PARAMETER_NAME"),
        TURN_DIA_MAX_MIN: _.get(item, "TURN_DIA_MAX_MIN"),
        TURN_DIA_MAX_MAX: _.get(item, "TURN_DIA_MAX_MAX"),
        SCHE_TYPE: _.get(item, "SCHE_TYPE"),
        DATA_DELIVERY_RANGE_MIN: _.get(item, "DATA_DELIVERY_RANGE_MIN"),
        DATA_DELIVERY_RANGE_MAX: _.get(item, "DATA_DELIVERY_RANGE_MAX"),
        START_TIME: _.get(item, "START_TIME"),
        END_TIME: _.get(item, "END_TIME"),
      });
      excelData.push(obj);
    }
    console.log(excelData);
    return excelData;
  }

 // 匯入 Excel，excel檔名
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
    var objFile = document.getElementsByTagName('input')[0];
    console.log(objFile.value + "已清除資料");
    objFile.value = "";
    console.log(this.file)
    console.log(JSON.stringify(this.file))
  }

  Upload() {
    let value = document.getElementsByTagName('input')[0].value;
    let lastname = this.file.name.split('.').pop();
    console.log("incomingfile e2 : " + this.file);
      if(value === null) {
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
    if(worksheet.A1 === undefined || worksheet.B1 === undefined || worksheet.C1 === undefined || worksheet.D1 === undefined || 
      worksheet.E1 === undefined || worksheet.F1 === undefined || worksheet.G1 === undefined || worksheet.H1 === undefined || 
      worksheet.I1 === undefined || worksheet.J1 === undefined || worksheet.K1 === undefined || worksheet.L1 === undefined || worksheet.M1 === undefined) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if(worksheet.A1.v !== "站別" || worksheet.B1.v !== "機台" || worksheet.C1.v !== "Campaign ID" || worksheet.D1.v !== "欄位" || 
    worksheet.E1.v !== "條件" || worksheet.F1.v !== "參數" || worksheet.G1.v !== "產出尺寸MIN" || worksheet.H1.v !== "產出尺寸MAX" || 
    worksheet.I1.v !== "抽數別" || worksheet.J1.v !== "交期區間MIN" || worksheet.K1.v !== "交期區間MAX" || worksheet.L1.v !== "生產日期 起" || worksheet.M1.v !== "生產日期 迄") {
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
    for(let i=0; i < _data.length; i++) {
      let allData = JSON.stringify(_data[i]);
      console.log(_data[i]);
        this.importdata_new.push(allData);
        if(_data[i]['站別'] == undefined)
          _data[i]['站別'] = '';
        if(_data[i]['機台'] == undefined)
          _data[i]['機台'] = '';
        if(_data[i]['Campaign ID'] == undefined)
          _data[i]['Campaign ID'] = '';
        if(_data[i]['欄位'] == undefined)
          _data[i]['欄位'] = '';
        if(_data[i]['條件'] == undefined)
          _data[i]['條件'] = '';
        if(_data[i]['參數'] == undefined)
          _data[i]['參數'] = '';
        if(_data[i]['產出尺寸MIN'] == undefined)
          _data[i]['產出尺寸MIN'] = '';
        if(_data[i]['產出尺寸MAX'] == undefined)
          _data[i]['產出尺寸MAX'] = '';
        if(_data[i]['抽數別'] == undefined)
          _data[i]['抽數別'] = '';
        if(_data[i]['交期區間MIN'] == undefined)
          _data[i]['交期區間MIN'] = '';
        if(_data[i]['交期區間MAX'] == undefined)
          _data[i]['交期區間MAX'] = '';
        if(_data[i]['生產日期 起'] == undefined)
          _data[i]['生產日期 起'] = '';
        if(_data[i]['生產日期 迄'] == undefined)
          _data[i]['生產日期 迄'] = '';

        upload_data.push({
          SHOP_CODE_SCHE: _data[i]['站別'] ,
          CHOOSE_EQUIP_CODE: _data[i]['機台'],
          COMPAIGN_ID: _data[i]['Campaign ID'],
          PARAMETER_COL: _data[i]['欄位'],
          PARAMETER_CONDITION: _data[i]['條件'],
          PARAMETER_NAME: _data[i]['參數'],
          TURN_DIA_MAX_MIN: _data[i]['產出尺寸MIN'],
          TURN_DIA_MAX_MAX: _data[i]['產出尺寸MAX'],
          SCHE_TYPE: _data[i]['抽數別'],
          DATA_DELIVERY_RANGE_MIN: _data[i]['交期區間MIN'],
          DATA_DELIVERY_RANGE_MAX: _data[i]['交期區間MAX'],
          START_TIME: _data[i]['生產日期 起'],
          END_TIME: _data[i]['生產日期 迄'],
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
        myObj.PPSService.importExcelPPSI116(obj).subscribe(res => {
          console.log("importExcelPPSI116");
          if(res[0].MSG === "Y") { 
            this.loading = false;
            this.LoadingPage = false;
            
            this.sucessMSG("EXCEL上傳成功", "");
            this.clearFile();
            this.getPPSINP16List();
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
      this.getPPSINP16List();
    }

    onBtnClick1(e) {
      e.params.api.setFocusedCell(e.params.node.rowIndex, 'END_TIME');
      e.params.api.startEditingCell({
        rowIndex: e.params.node.rowIndex,
        colKey: 'END_TIME',
      });
    }
  
    onBtnClick2(e) {
      this.saveEdit(e.rowData)
    }
  
    onBtnClick3(e) {
    }
  
    onBtnClick4(e) {
      this.deleteRow(e.rowData);
    }

}
