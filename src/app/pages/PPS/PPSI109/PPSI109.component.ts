import { Component, AfterViewInit, ElementRef } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";
import {  ColDef, ColGroupDef, CellClickedEvent } from 'ag-grid-community';
import { BtnCellRendererUpdate } from '../../RENDERER/BtnCellRendererUpdate.component';

interface ItemData {
  idx: string;
  ID: number;
  PLANT_CODE: string;
  SCH_SHOP_CODE: string;
  EQUIP_GROUP: string;
  YIELD_TYPE: string;
  YIELD_VALUE: number;
  DATE_CREATE: string;
  USER_CREATE: string;
  DATE_UPDATE: string;
  USER_UPDATE: string;
}

interface ItemData {
  SCH_SHOP_CODE: string;
  EQUIP_GROUP: string;
  YIELD_TYPE: string;
  YIELD_VALUE: number;
}

@Component({
  selector: "app-PPSI109",
  templateUrl: "./PPSI109.component.html",
  styleUrls: ["./PPSI109.component.scss"],
  providers:[NzMessageService]
})
export class PPSI109Component implements AfterViewInit {
  thisTabName = "產率設定(PPSI109)";
  tableHeight: string;
  frameworkComponents: any;
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  ID;
  USERNAME;
  PLANT_CODE;
  SCH_SHOP_CODE;
  EQUIP_GROUP;
  YIELD_TYPE;
  YIELD_VALUE;


  // 產率設定欄位查詢關鍵字
  searchSchShopCodeValue = '';
  searchEquipGroupValue = '';
  searchYieldTypeValue = '';
  searchYieldValueValue = '';

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  rowData: ItemData[] = []; 
  titleArray = ["站別","機群","設定類型","設定值"];
  isErrorMsg = false;
  isERROR = false;
  importdata = [];
  importdata_repeat = [];
  errorTXT = [];
  isVisibleYieldDialog = false;
  EditMode = [];
  oldlist = {};
  newlist;
  datetime = moment();
  pageIndex = 1;
  pageSize = 30;

  constructor(
    private elementRef:ElementRef,
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
    this.frameworkComponents = {
      buttonRenderer: BtnCellRendererUpdate,
    }
  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.gettbppsm012List();
    this.tableHeight = (window.innerHeight - 250).toString() + "px";
    
    const aI109Tab = this.elementRef.nativeElement.querySelector('#aI109') as HTMLAnchorElement;
    const liI109Tab = this.elementRef.nativeElement.querySelector('#liI109') as HTMLLIElement;
    liI109Tab.style.backgroundColor = '#E4E3E3';
    aI109Tab.style.cssText = 'color: blue; font-weight:bold;';
  }

  onInit() {
    this.SCH_SHOP_CODE = '';
    this.EQUIP_GROUP = '';
    this.YIELD_TYPE = '';
    this.YIELD_VALUE = 0;
  
    this.LoadingPage = false;
    this.isVisibleYieldDialog = false;
    this.searchSchShopCodeValue = '';
    this.searchEquipGroupValue = '';
    this.searchYieldTypeValue = '';
    this.searchYieldValueValue = '';
    
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_repeat = [];
    this.isERROR = false;
    this.errorTXT = [];
  }

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
      width: 150,
    },
    {
      headerName: '機群',
      field: "EQUIP_GROUP",
      width: 150,
    },
    {
      headerName: '產率設定類型',
      field: "YIELD_TYPE",
      width: 150,
    },
    {
      headerName: '設定值',
      field: "YIELD_VALUE",
      width: 150,
    },
    {
      headerName: 'Action',
      width: 150,
      editable: false,
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

  tbppsm012List_tmp;
  tbppsm012List: ItemData[] = [];
  displayTbppsm012List : ItemData[] = [];
  editCache14: { [key: string]: { edit: boolean; data: ItemData } } = {};
  showYieldValue = false;
  editColse14 = false;

  gettbppsm012List() {
    this.loading = true;
    let myObj = this;
    const thisForFunc = this;
    thisForFunc.PPSService.gettbppsm012List(
      thisForFunc.pageIndex,
      thisForFunc.pageSize
    )
    .subscribe(res => {
      console.log("gettbppsm012List success");
      this.tbppsm012List_tmp = res;

      const data = [];
      for (let i = 0; i < this.tbppsm012List_tmp.length ; i++) {
        data.push({
          ID: this.tbppsm012List_tmp[i].ID,
          PLANT_CODE: this.tbppsm012List_tmp[i].PLANT_CODE,
          SCH_SHOP_CODE: this.tbppsm012List_tmp[i].SCH_SHOP_CODE,
          EQUIP_GROUP: this.tbppsm012List_tmp[i].EQUIP_GROUP,
          YIELD_TYPE: this.tbppsm012List_tmp[i].YIELD_TYPE,
          YIELD_VALUE: this.tbppsm012List_tmp[i].YIELD_VALUE
        });
      }
      this.tbppsm012List = data;
      this.displayTbppsm012List = this.tbppsm012List;
      this.updateEditCache();
      console.log(this.tbppsm012List);
      myObj.loading = false;
    });
  }


  // update
  editRow(id: string): void {
    this.editCache14[id].edit = true;
  }


  // cancel
  cancelEdit(id: string): void {
    const index = this.tbppsm012List.findIndex(item => item.idx === id);
    this.editCache14[id] = {
      data: { ...this.tbppsm012List[index] },
      edit: false
    };
    this.editColse14 = false;
  }


  // update Save
  saveEdit(rowData:any): void {
    let myObj = this;
    if (rowData.SCH_SHOP_CODE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if ( rowData.EQUIP_GROUP === undefined) {
      myObj.message.create("error", "「機群」不可為空");
      return;
    } else { 
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.upd012BarData(rowData)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  

  // update
  updateEditCache(): void {
    this.tbppsm012List.forEach(item => {
      this.editCache14[item.idx] = {
        edit: false,
        data: { ...item }
      };
    });
  }



  // 修改資料
  upd012BarData(rowData) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID : rowData.ID,
        PLANT_CODE : rowData.PLANT_CODE,
        SCH_SHOP_CODE : rowData.SCH_SHOP_CODE,
        EQUIP_GROUP : rowData.EQUIP_GROUP,
        YIELD_TYPE : rowData.YIELD_TYPE,
        YIELD_VALUE : rowData.YIELD_VALUE,
        USERNAME : this.USERNAME,
        DATETIME : this.dateTimeFormatter,   
      })
      myObj.PPSService.upd012BarData(obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.sucessMSG("修改成功", ``);

          const index = this.tbppsm012List.findIndex(item => item.ID === rowData);
          Object.assign(this.tbppsm012List[index], rowData);
          this.editCache14[rowData].edit = false;
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
  
  
  // tab 14 編輯下拉產率設定類型
  changeYieldType(idx, _event) {
    if(_event === '定值') {
      this.showYieldValue = false;
    } else {
      this.showYieldValue = true;
      this.editCache14[idx].data.YIELD_VALUE = 0;
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

  // 新增產能維護之彈出視窗
  openYieldDialog() : void {
    this.isVisibleYieldDialog = true;
  }
  // 取消產能維護彈出視窗
  closeYieldDialog() : void {
    this.isVisibleYieldDialog = false;
  }

  // insert
  insertTab() {
    let myObj = this;
    if (this.SCH_SHOP_CODE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.EQUIP_GROUP === undefined) {
      myObj.message.create("error", "「機群」不可為空");
      return;
    } else if (this.YIELD_TYPE === undefined) {
      myObj.message.create("error", "「設定類型」不可為空");
      return;
    }  else if (this.YIELD_VALUE === undefined) {
      myObj.message.create("error", "「設定值」不可為空");
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

  // 新增資料
  insertSave() {
    let myObj = this;
    this.LoadingPage = true;
    
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        SCH_SHOP_CODE : this.SCH_SHOP_CODE,
        EQUIP_GROUP : this.EQUIP_GROUP,
        YIELD_TYPE : this.YIELD_TYPE,
        YIELD_VALUE : this.YIELD_VALUE,
        USERNAME : this.USERNAME,
        DATETIME : this.dateTimeFormatter,
      })

      myObj.PPSService.insertI109Save(obj).subscribe(res => {

        console.log(res)
        if(res[0].MSG === "Y") {
          this.gettbppsm012List();
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


// ============= 過濾資料之menu ========================
   // 14.(資料過濾)產率設定
   tbppsm012ListFilter(property:string, keyWord:string) : void {

    if(_.isEmpty(keyWord)){
      this.displayTbppsm012List = this.tbppsm012List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.tbppsm012List.filter(item => filterFunc(item));
    this.displayTbppsm012List = data;
  }

  // 資料過濾---產率設定 --> 站別
  searchBySchShopCode() : void {
    this.tbppsm012ListFilter("SCH_SHOP_CODE", this.searchSchShopCodeValue);
  } 
  resetBySchShopCode() : void {
    this.searchSchShopCodeValue = '';
    this.tbppsm012ListFilter("SCH_SHOP_CODE", this.searchSchShopCodeValue);
  }

  // 資料過濾---產率設定 --> 機群 
  searchByEquipGroup3() : void {
    this.tbppsm012ListFilter("EQUIP_GROUP", this.searchEquipGroupValue);
  } 
  resetByEquipGroup3() : void {
    this.searchEquipGroupValue = '';
    this.tbppsm012ListFilter("EQUIP_GROUP", this.searchEquipGroupValue);
  }

  // 資料過濾---產率設定 --> 設定類型
  searchByYieldType() : void {
    this.tbppsm012ListFilter("YIELD_TYPE", this.searchYieldTypeValue);
  } 
  resetByYieldType() : void {
    this.searchYieldTypeValue = '';
    this.tbppsm012ListFilter("YIELD_TYPE", this.searchYieldTypeValue);
  }

  // 資料過濾---產率設定 --> 設定值
  searchByYieldValue() : void {
    this.tbppsm012ListFilter("YIELD_VALUE", this.searchYieldValueValue);
  } 
  resetByYieldValue() : void {
    this.searchYieldValueValue = '';
    this.tbppsm012ListFilter("YIELD_VALUE", this.searchYieldValueValue);
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
    var objFile = document.getElementsByTagName('input')[0];
    console.log(objFile.value + "已清除");
    objFile.value = "";
    console.log(this.file)
    console.log(JSON.stringify(this.file))
  }

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
    if(worksheet.A1 === undefined || worksheet.B1 === undefined || worksheet.C1 === undefined || worksheet.D1 === undefined) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if(worksheet.A1.v !== "站別" || worksheet.B1.v !== "機群" || worksheet.C1.v !== "產率設定類型" || worksheet.D1.v !== "產率設定值") {
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

      if(this.importdata_repeat.includes(allData)){
        this.errorTXT.push(`第 ` + (i+2) + `列站別+機群資料重複，請檢查` + "<BR/>");
        this.isERROR = true;

      }else{
        this.importdata_repeat.push(allData);
        if(_data[i]['站別'] == undefined)
          _data[i]['站別'] = '';
        if(_data[i]['機群'] == undefined)
          _data[i]['機群'] = '';
        if(_data[i]['產率設定類型'] == undefined)
          _data[i]['產率設定類型'] = '';
        if(_data[i]['產率設定值'] == undefined)
          _data[i]['產率設定值'] = '';
      }  
        upload_data.push({
          SCH_SHOP_CODE: _data[i]['站別'] ,
          EQUIP_GROUP: _data[i]['機群'],
          YIELD_TYPE: _data[i]['產率設定類型'],
          YIELD_VALUE: _data[i]['產率設定值'],
          USERNAME : this.USERNAME,
          DATETIME : this.dateTimeFormatter,
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
        myObj.PPSService.importI109Excel(obj).subscribe(res => {
          console.log("importI109Excel");
          if(res[0].MSG === "Y") { 
            this.loading = false;
            this.LoadingPage = false;
            
            this.sucessMSG("EXCEL上傳成功", "");
            this.clearFile();
            this.gettbppsm012List();
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
      this.gettbppsm012List();
    }

  // 修改直棒產率設定存檔
  save012_dtlRow(i, ItemData) {
    console.log('-------save_dtlRow------');
    this.newlist = ItemData;

    let ID = this.newlist.ID;
    let PLANT_CODE = this.newlist.PLANT_CODE;
    let SCH_SHOP_CODE = this.newlist.SCH_SHOP_CODE;
    let EQUIP_GROUP = this.newlist.EQUIP_GROUP;
    let YIELD_TYPE = this.newlist.YIELD_TYPE;
    let YIELD_VALUE = this.newlist.YIELD_VALUE;

    if (
      ID === '' ||
      PLANT_CODE === '' ||
      SCH_SHOP_CODE === '' ||
      EQUIP_GROUP === '' ||
      YIELD_TYPE === '' ||
      YIELD_VALUE === ''
    ) {
      this.errorMSG('錯誤', '有欄位尚未填寫完畢，請檢查');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定存檔',
        nzOnOk: () => {
          this.Save012OK(i), (this.EditMode[i] = true);
        },
        nzOnCancel: () => (this.EditMode[i] = true),
      });
    }
  }

   // 確定修改直棒產率設定存檔
   Save012OK(col) {
    console.log('oldlist :');
    console.log(this.oldlist);

    console.log('newlist :');
    console.log(this.newlist);

    this.LoadingPage = true;
    let myObj = this;
    return new Promise((resolve, reject) => {
      let obj = {};

      _.extend(obj, {
        OLDLIST: this.oldlist,
        NEWList: this.newlist,
        USERNAME: this.USERNAME,
        DATETIME: this.dateTimeFormatter,
      });
      myObj.PPSService.upd012BarData(obj).subscribe(
        (res) => {
          console.log(res);
          if (res[0].MSG === 'Y') {
            this.LoadingPage = true;
            this.EditMode[col] = false;
            this.oldlist = [];
            this.newlist = [];
            this.gettbppsm012List();
            this.sucessMSG('修改存檔成功', '');
          } else {
            this.errorMSG('修改存檔失敗', res[0].MSG);
            this.LoadingPage = false;
            this.EditMode[col] = true;
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
          this.oldlist = [];
          this.LoadingPage = false;
        }
      );
    });
  }

  cancel012_dtlRow(id: number): void {
    const index = this.tbppsm012List.findIndex(item => item.ID === id);
    this.editCache14[id] = {
      data: { ...this.tbppsm012List[index] },
      edit: false
    };
  }

  editOnClick1(e) {
    console.log("Clicked" + e);
    e.params.api.setFocusedCell(e.params.node.rowIndex, "YIELD_VALUE");
    e.params.api.startEditingCell({
      rowIndex: e.params.node.rowIndex,
      colKey: "YIELD_VALUE"
    });
  }

  updateOnClick2(e) {
    console.log(e);
    console.log("rowData = " , e.params.node.data);
    this.save012_dtlRow(e.params.node.rowIndex, e.params.node.data);
  }

  calcelOnClick3(e) {
    this.cancel012_dtlRow(e.params.node.data);
  }

  excelExport() {
    let exportData = [];
    this.PPSService.gettbppsm012List(this.pageIndex, this.pageSize).subscribe(res => {
      
      let result: any = res;


      for (var i = 0; i <= result.length; i++) {
        var element = result[i];
        console.log(element);
        if (element) {
          var obj =
          {
            "站別": (element['SCH_SHOP_CODE'] ? element['SCH_SHOP_CODE'] : null),
            "機群": (element['EQUIP_GROUP'] ? element['EQUIP_GROUP'] : null),
            "產率設定類型": (element['YIELD_TYPE'] ? element['YIELD_TYPE'] : null),
            "產率設定值": (element['YIELD_VALUE'] ? element['YIELD_VALUE'] : null)
          }
          exportData.push(obj);
        }
      }

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '產率設定 - 直棒')
      XLSX.writeFile(wb, ExcelService.toExportFileName("產率設定 - 直棒"));

    });

  }
}
