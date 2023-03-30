import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as _ from "lodash";
import * as XLSX from 'xlsx';



interface ItemData {
  idx: number;
  ID: number;
  PLANT_CODE: string;
  SHOP_CODE: string;
  EQUIP_CODE: string;
  EQUIP_GROUP: string;
  LOAD_TIME: number;
  TRANSFER_TIME: number;
  BIG_ADJUST_TIME: number;
  SMALL_ADJUST_TIME: number;
  RETURN_TIME: number;
  COOLING_TIME: number;
  OTHER_TIME: number;
}



@Component({
  selector: "app-PPSI104_NonBar",
  templateUrl: "./PPSI104_NonBar.component.html",
  styleUrls: ["./PPSI104_NonBar.component.scss"],
  providers:[NzMessageService]
})
export class PPSI104_NonBarComponent implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  // 整備時間
  SHOP_CODE = '';
  EQUIP_CODE = '';
  EQUIP_GROUP = '';
  LOAD_TIME = 0;
  TRANSFER_TIME = 0;
  BIG_ADJUST_TIME = 0;
  SMALL_ADJUST_TIME = 0;
  RETURN_TIME = 0;
  COOLING_TIME = 0;
  OTHER_TIME = 0;

  isVisiblePrepare = false;
  searchShopCodeValue = '';
  searchEquipCodeValue = '';
  searchEquipGroupValue = '';
  searchLoadTimeValue = '';
  searchTransferTimeValue = '';
  searchOtherTimeValue = '';
  searchBigAdjustTimeValue = '';
  searchSmallAdjustTimeValue = '';
  searchReturnTimeValue = '';
  searchCoolingTimeValue = '';

  isErrorMsg = false;;
  isERROR = false;
  arrayBuffer:any;
  file:File;
  importdata = [];
  importdata_new = [];
  errorTXT = [];

  constructor(
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
  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getPPSINP03List();
  }
  
  onInit() {
    this.SHOP_CODE = '';
    this.EQUIP_CODE = '';
    this.EQUIP_GROUP = '';
    this.LOAD_TIME = 0;
    this.TRANSFER_TIME = 0;
    this.BIG_ADJUST_TIME = 0;
    this.SMALL_ADJUST_TIME = 0;
    this.RETURN_TIME = 0;
    this.COOLING_TIME = 0;
    this.OTHER_TIME = 0;

    this.isVisiblePrepare = false;
    this.LoadingPage = false;
    this.searchShopCodeValue = '';
    this.searchEquipCodeValue = '';
    this.searchEquipGroupValue = '';
    this.searchLoadTimeValue = '';
    this.searchTransferTimeValue = '';
    this.searchOtherTimeValue = '';
    this.searchBigAdjustTimeValue = '';
    this.searchSmallAdjustTimeValue = '';
    this.searchReturnTimeValue = '';
    this.searchCoolingTimeValue = '';
    
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_new = [];
    this.isERROR = false;
    this.errorTXT = [];
  }

  
  PPSINP03List_tmp;
  PPSINP03List: ItemData[] = [];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  displayPPSINP03List: ItemData[] = [];
  
  getPPSINP03List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP03List('2').subscribe(res => {
      this.PPSINP03List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP03List_tmp.length ; i++) {
        data.push({
          idx: `${i}`,
          ID: this.PPSINP03List_tmp[i].ID,
          PLANT_CODE: this.PPSINP03List_tmp[i].PLANT_CODE,
          SHOP_CODE: this.PPSINP03List_tmp[i].SHOP_CODE,
          EQUIP_CODE: this.PPSINP03List_tmp[i].EQUIP_CODE,
          EQUIP_GROUP: this.PPSINP03List_tmp[i].EQUIP_GROUP,
          LOAD_TIME: this.PPSINP03List_tmp[i].LOAD_TIME,
          TRANSFER_TIME: this.PPSINP03List_tmp[i].TRANSFER_TIME,
          BIG_ADJUST_TIME: this.PPSINP03List_tmp[i].BIG_ADJUST_TIME,
          SMALL_ADJUST_TIME: this.PPSINP03List_tmp[i].SMALL_ADJUST_TIME,
          RETURN_TIME: this.PPSINP03List_tmp[i].RETURN_TIME,
          COOLING_TIME: this.PPSINP03List_tmp[i].COOLING_TIME,
          OTHER_TIME: this.PPSINP03List_tmp[i].OTHER_TIME
        });
      }
      this.PPSINP03List = data;
      this.displayPPSINP03List = this.PPSINP03List;
      this.updateEditCache();
      console.log(this.PPSINP03List);
      myObj.loading = false;
    });
  }

  

  // insert
  insertTab() {
    let myObj = this;
    if (this.SHOP_CODE === "") {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.EQUIP_CODE === "" && this.EQUIP_GROUP === "") {
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
    const index = this.PPSINP03List.findIndex(item => item.idx === id);
    this.editCache[id] = {
      data: { ...this.PPSINP03List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: number): void {
    let myObj = this;
    if (this.editCache[id].data.SHOP_CODE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.editCache[id].data.EQUIP_CODE === undefined && this.editCache[id].data.EQUIP_GROUP === undefined) {
      myObj.message.create("error", "「機台」和「機群」至少填一項");
      return;
    } else if (this.editCache[id].data.LOAD_TIME === undefined) {
      myObj.message.create("error", "「上下料」不可為空");
      return;
    } else if (this.editCache[id].data.TRANSFER_TIME === undefined) {
      myObj.message.create("error", "「搬運」不可為空");
      return;
    } else if (this.editCache[id].data.BIG_ADJUST_TIME === undefined) {
      myObj.message.create("error", "「大調機」不可為空");
      return;
    } else if (this.editCache[id].data.SMALL_ADJUST_TIME === undefined) {
      myObj.message.create("error", "「小調機」不可為空");
      return;
    } else if (this.editCache[id].data.RETURN_TIME === undefined) {
      myObj.message.create("error", "「退料」不可為空");
      return;
    }  else if (this.editCache[id].data.COOLING_TIME === undefined) {
      myObj.message.create("error", "「冷卻」不可為空");
      return;
    } else if (this.editCache[id].data.OTHER_TIME === undefined) {
      myObj.message.create("error", "「其他整備」不可為空");
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.updateSave(id)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  

  // update
  updateEditCache(): void {
    this.PPSINP03List.forEach(item => {
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
        SHOP_CODE : this.SHOP_CODE,
        PLANT_CODE : this.PLANT_CODE,
        EQUIP_CODE : this.EQUIP_CODE,
        EQUIP_GROUP : this.EQUIP_GROUP,
        LOAD_TIME : this.LOAD_TIME,
        TRANSFER_TIME : this.TRANSFER_TIME,
        BIG_ADJUST_TIME : this.BIG_ADJUST_TIME,
        SMALL_ADJUST_TIME : this.SMALL_ADJUST_TIME,
        RETURN_TIME : this.RETURN_TIME,
        COOLING_TIME : this.COOLING_TIME,
        OTHER_TIME : this.OTHER_TIME,
        USERNAME : this.USERNAME
      })

      myObj.PPSService.insertI103Tab1Save('2', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.getPPSINP03List();
          this.sucessMSG("新增成功", ``);
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
  updateSave(_id) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID : this.editCache[_id].data.ID,
        PLANT_CODE : this.editCache[_id].data.PLANT_CODE,
        SHOP_CODE : this.editCache[_id].data.SHOP_CODE,
        EQUIP_CODE : this.editCache[_id].data.EQUIP_CODE,
        EQUIP_GROUP : this.editCache[_id].data.EQUIP_GROUP,
        LOAD_TIME : this.editCache[_id].data.LOAD_TIME,
        TRANSFER_TIME : this.editCache[_id].data.TRANSFER_TIME,
        OTHER_TIME : this.editCache[_id].data.OTHER_TIME,
        BIG_ADJUST_TIME : this.editCache[_id].data.BIG_ADJUST_TIME,
        SMALL_ADJUST_TIME : this.editCache[_id].data.SMALL_ADJUST_TIME,
        RETURN_TIME : this.editCache[_id].data.RETURN_TIME,
        COOLING_TIME : this.editCache[_id].data.COOLING_TIME,
        USERNAME : this.USERNAME
      })
      myObj.PPSService.updateI103Tab1Save('2', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.sucessMSG("修改成功", ``);
          const index = this.PPSINP03List.findIndex(item => item.idx === _id);
          Object.assign(this.PPSINP03List[index], this.editCache[_id].data);
          this.editCache[_id].edit = false;
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
      let _ID = this.editCache[_id].data.ID;
      myObj.PPSService.delI103Tab1Data('2', _ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.sucessMSG("刪除成功", ``);
          this.getPPSINP03List();
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
    if(this.PPSINP03List.length > 0) {
      data = this.formatDataForExcel(this.PPSINP03List);
      fileName = `非直棒設備能力`;
      titleArray = ['廠區別', '站別', '機台', '機群', '上下料時間', '搬運時間', '大調機時間', '小調機時間', '退料時間', '冷卻時間', '其他整備時間'];
    } else {
      this.errorMSG("匯出失敗", "非直棒整備時間目前無資料");
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
        PLANT_CODE: _.get(item, "PLANT_CODE"),
        SHOP_CODE: _.get(item, "SHOP_CODE"),
        EQIUP_CODE: _.get(item, "EQIUP_CODE"),
        EQUIP_GROUP: _.get(item, "EQUIP_GROUP"),
        LOAD_TIME: _.get(item, "LOAD_TIME"),
        TRANSFER_TIME: _.get(item, "TRANSFER_TIME"),
        OTHER_TIME: _.get(item, "OTHER_TIME"),
        BIG_ADJUST_TIME: _.get(item, "BIG_ADJUST_TIME"),
        SMALL_ADJUST_TIME: _.get(item, "SMALL_ADJUST_TIME"),
        RETURN_TIME: _.get(item, "RETURN_TIME"),
        COOLING_TIME: _.get(item, "COOLING_TIME")
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
        worksheet.F1 === undefined || worksheet.G1 === undefined || worksheet.H1 === undefined || worksheet.I1 === undefined || worksheet.J1 === undefined || worksheet.K1 === undefined) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if(worksheet.A1.v !== "廠區別" || worksheet.B1.v !== "站別" || worksheet.C1.v !== "機台" || worksheet.D1.v !== "機群" || worksheet.E1.v !== "上下料時間" || worksheet.F1.v !== "搬運時間" 
        || worksheet.G1.v !== "大調機時間" || worksheet.H1.v !== "小調機時間" || worksheet.I1.v !== "退料時間" || worksheet.J1.v !== "冷卻時間" || worksheet.K1.v !== "其他整備時間") {
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
      let shopCode = _data[i].站別;
      let equipCode = _data[i].機台;
      let equipGroup = _data[i].機群;
      if(plantCode === undefined || shopCode === undefined || (equipCode === undefined && equipGroup === undefined)) {
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
        let shopCode = _data[i].站別.toString();
        let equipCode = _data[i].機台 !== undefined ? _data[i].機台.toString() : '';
        let equipGroup = _data[i].機群 !== undefined ? _data[i].機群.toString() : '';
        let loadTime = _data[i].上下料時間 !== undefined ? _data[i].上下料時間.toString() : '0';
        let transferTime = _data[i].搬運時間 !== undefined ? _data[i].搬運時間.toString() : '0';
        let bigAdjustTime = _data[i].大調機時間 !== undefined ? _data[i].大調機時間.toString() : '0';
        let smallAdjustTime = _data[i].小調機時間 !== undefined ? _data[i].小調機時間.toString() : '0';
        let returnTime = _data[i].退料時間 !== undefined ? _data[i].退料時間.toString() : '0';
        let coolingTime = _data[i].冷卻時間 !== undefined ? _data[i].冷卻時間.toString() : '0';
        let otherTime = _data[i].其他整備時間 !== undefined ? _data[i].其他整備時間.toString() : '0';

        this.importdata_new.push({plantCode: plantCode, shopCode: shopCode, equipCode: equipCode, equipGroup: equipGroup, loadTime: loadTime, transferTime: transferTime,
          bigAdjustTime: bigAdjustTime, smallAdjustTime: smallAdjustTime, returnTime: returnTime, coolingTime: coolingTime, otherTime: otherTime});
      }

      return new Promise((resolve, reject) => {
        this.LoadingPage = true;
        let myObj = this;
        let obj = {};
        _.extend(obj, {
          EXCELDATA : this.importdata_new,
          USERCODE : this.USERNAME
        })
        myObj.PPSService.importI103Excel('2', obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.loading = false;
            this.LoadingPage = false;

            this.sucessMSG("EXCCEL上傳成功", "");
            this.getPPSINP03List();
            this.clearFile();
            this.onInit();
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
  // 新增整備時間之彈出視窗
  openPrepareInput() : void {
    this.isVisiblePrepare = true;
  }
   //取消整備時間彈出視窗
   cancelPrepareInput() : void {
    this.isVisiblePrepare = false;
  }

// ============= 過濾資料之menu ========================
  // 4.(資料過濾)整備時間
  ppsInp03ListFilter(property:string, keyWord:string){
    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      if (keyWord == "") {
        return true;
      } else {
        return _.startsWith(propertyValue, keyWord);
      }
    };

    const data = this.PPSINP03List.filter(item => filterFunc(item));
    this.displayPPSINP03List = data;
  }

  // 資料過濾---整備時間 --> 站別
  searchShopCode() : void{
    this.ppsInp03ListFilter("SHOP_CODE", this.searchShopCodeValue);
  } 
  resetByShopCode() : void{
    this.searchShopCodeValue = '';
    this.ppsInp03ListFilter("SHOP_CODE", this.searchShopCodeValue);
  }

  // 資料過濾---整備時間 --> 機台
  searchEquipCode() : void{
    this.ppsInp03ListFilter("EQUIP_CODE", this.searchEquipCodeValue);
  } 
  resetByEquipCode() : void{
    this.searchEquipCodeValue = '';
    this.ppsInp03ListFilter("EQUIP_CODE", this.searchEquipCodeValue);
  }
  // 資料過濾---整備時間 --> 機群
  searchEquipGroup() : void{
    this.ppsInp03ListFilter("EQUIP_GROUP", this.searchEquipGroupValue);
  } 
  resetByEquipGroup() : void{
    this.searchEquipGroupValue = '';
    this.ppsInp03ListFilter("EQUIP_GROUP", this.searchEquipGroupValue);
  }

  // 資料過濾---整備時間 --> 上下料
  searchLoadTime() : void{
    this.ppsInp03ListFilter("LOAD_TIME", this.searchLoadTimeValue);
  } 
  resetByLoadTime() : void{
    this.searchLoadTimeValue = '';
    this.ppsInp03ListFilter("LOAD_TIME", this.searchLoadTimeValue);
  }

  // 資料過濾---整備時間 --> 搬運
  searchByTransferTime() : void{
    this.ppsInp03ListFilter("TRANSFER_TIME", this.searchTransferTimeValue);
  } 
  resetByTransferTime() : void{
    this.searchTransferTimeValue = '';
    this.ppsInp03ListFilter("TRANSFER_TIME", this.searchTransferTimeValue);
  }

  // 資料過濾---整備時間 --> 大調機
  searchByBigAdjustTime() : void{
    this.ppsInp03ListFilter("BIG_ADJUST_TIME", this.searchBigAdjustTimeValue);
  } 
  resetByBigAdjustTime() : void{
    this.searchBigAdjustTimeValue = '';
    this.ppsInp03ListFilter("BIG_ADJUST_TIME", this.searchBigAdjustTimeValue);
  }

  // 資料過濾---整備時間 --> 小調機
  searchBySmallAdjustTime() : void{
    this.ppsInp03ListFilter("SMALL_ADJUST_TIME", this.searchSmallAdjustTimeValue);
  } 
  resetBySmallAdjustTime() : void{
    this.searchSmallAdjustTimeValue = '';
    this.ppsInp03ListFilter("SMALL_ADJUST_TIME", this.searchSmallAdjustTimeValue);
  }

  // 資料過濾---整備時間 --> 退料
  searchByReturnTime() : void{
    this.ppsInp03ListFilter("RETURN_TIME", this.searchReturnTimeValue);
  } 
  resetByReturnTime() : void{
    this.searchReturnTimeValue = '';
    this.ppsInp03ListFilter("RETURN_TIME", this.searchReturnTimeValue);
  }
  
  // 資料過濾---整備時間 --> 冷卻
  searchByCoolingTime() : void{
    this.ppsInp03ListFilter("COOLING_TIME", this.searchCoolingTimeValue);
  } 
  resetByCoolingTime() : void{
    this.searchCoolingTimeValue = '';
    this.ppsInp03ListFilter("COOLING_TIME", this.searchCoolingTimeValue);
  }

  // 資料過濾---整備時間 --> 其他整備
  searchByOtherTime() : void{
    this.ppsInp03ListFilter("OTHER_TIME", this.searchOtherTimeValue);
  } 
  resetByOtherTime() : void{
    this.searchOtherTimeValue = '';
    this.ppsInp03ListFilter("OTHER_TIME", this.searchOtherTimeValue);
  }


}
