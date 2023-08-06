import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";




interface ItemData3 {
  id: string;
  tab3ID: number;
  SHOP_CODE: string;
  EQUIP_CODE: string;
  EQUIP_GROUP: string;
  LOAD_TIME: number;
  TRANSFER_TIME: number;
  OTHER_TIME: number;
  BIG_ADJUST_TIME: number;
  SMALL_ADJUST_TIME: number;
  RETURN_TIME: number;
  COOLING_TIME: number;
}



@Component({
  selector: "app-PPSI104",
  templateUrl: "./PPSI104.component.html",
  styleUrls: ["./PPSI104.component.scss"],
  providers:[NzMessageService]
})
export class PPSI104Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 整備時間
  SHOP_CODE;
  EQUIP_CODE;
  EQUIP_GROUP;
  LOAD_TIME;
  TRANSFER_TIME;
  OTHER_TIME;
  BIG_ADJUST_TIME;
  SMALL_ADJUST_TIME;
  RETURN_TIME;
  COOLING_TIME;
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

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["站別","機台","機群","上下料","搬運","其他整備","大調機","小調機","退料","冷卻"];
  importdata_repeat = [];
  constructor(
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
  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getPPSINP03List();
  }
  
  
  PPSINP03List_tmp;
  PPSINP03List: ItemData3[] = [];
  editCache3: { [key: string]: { edit: boolean; data: ItemData3 } } = {};
  displayPPSINP03List: ItemData3[] = [];
  
  getPPSINP03List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP03List('1').subscribe(res => {
      this.PPSINP03List_tmp = res;
      const data = [];
      for (let i = 0; i < this.PPSINP03List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab3ID: this.PPSINP03List_tmp[i].ID,
          SHOP_CODE: this.PPSINP03List_tmp[i].SHOP_CODE,
          EQUIP_CODE: this.PPSINP03List_tmp[i].EQUIP_CODE,
          EQUIP_GROUP: this.PPSINP03List_tmp[i].EQUIP_GROUP,
          LOAD_TIME: this.PPSINP03List_tmp[i].LOAD_TIME,
          TRANSFER_TIME: this.PPSINP03List_tmp[i].TRANSFER_TIME,
          OTHER_TIME: this.PPSINP03List_tmp[i].OTHER_TIME,
          BIG_ADJUST_TIME: this.PPSINP03List_tmp[i].BIG_ADJUST_TIME,
          SMALL_ADJUST_TIME: this.PPSINP03List_tmp[i].SMALL_ADJUST_TIME,
          RETURN_TIME: this.PPSINP03List_tmp[i].RETURN_TIME,
          COOLING_TIME: this.PPSINP03List_tmp[i].COOLING_TIME
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
    if (this.SHOP_CODE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.LOAD_TIME === undefined) {
      myObj.message.create("error", "「上下料」不可為空");
      return;
    }  else if (this.TRANSFER_TIME === undefined) {
      myObj.message.create("error", "「搬運」不可為空");
      return;
    }   else if (this.OTHER_TIME === undefined) {
      myObj.message.create("error", "「其他整備」不可為空");
      return;
    }   else if (this.BIG_ADJUST_TIME === undefined) {
      myObj.message.create("error", "「大調機」不可為空");
      return;
    }   else if (this.SMALL_ADJUST_TIME === undefined) {
      myObj.message.create("error", "「小調機」不可為空");
      return;
    }   else if (this.RETURN_TIME === undefined) {
      myObj.message.create("error", "「退料」不可為空");
      return;
    }   else if (this.COOLING_TIME === undefined) {
      myObj.message.create("error", "「冷卻」不可為空");
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
    this.editCache3[id].edit = true;
  }
  
  // delete
  deleteRow(id: string): void {
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
  cancelEdit(id: string): void {
    const index = this.PPSINP03List.findIndex(item => item.id === id);
    this.editCache3[id] = {
      data: { ...this.PPSINP03List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache3[id].data.SHOP_CODE === undefined || "" === this.editCache3[id].data.SHOP_CODE) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.editCache3[id].data.EQUIP_CODE === undefined || "" === this.editCache3[id].data.EQUIP_CODE) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.editCache3[id].data.LOAD_TIME === undefined || "" === this.editCache3[id].data.LOAD_TIME.toString()) {
      myObj.message.create("error", "「上下料」不可為空");
      return;
    } else if (this.editCache3[id].data.TRANSFER_TIME === undefined || "" === this.editCache3[id].data.TRANSFER_TIME.toString()) {
      myObj.message.create("error", "「搬運」不可為空");
      return;
    }  else if (this.editCache3[id].data.OTHER_TIME === undefined || "" === this.editCache3[id].data.OTHER_TIME.toString()) {
      myObj.message.create("error", "「其他整備」不可為空");
      return;
    }  else if (this.editCache3[id].data.BIG_ADJUST_TIME === undefined || "" === this.editCache3[id].data.BIG_ADJUST_TIME.toString()) {
      myObj.message.create("error", "「大調機」不可為空");
      return;
    }  else if (this.editCache3[id].data.SMALL_ADJUST_TIME === undefined || "" === this.editCache3[id].data.SMALL_ADJUST_TIME.toString()) {
      myObj.message.create("error", "「小調機」不可為空");
      return;
    }  else if (this.editCache3[id].data.RETURN_TIME === undefined || "" === this.editCache3[id].data.RETURN_TIME.toString()) {
      myObj.message.create("error", "「退料」不可為空");
      return;
    }   else if (this.editCache3[id].data.COOLING_TIME === undefined || "" === this.editCache3[id].data.COOLING_TIME.toString())  {
      myObj.message.create("error", "「冷卻」不可為空");
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
      this.editCache3[item.id] = {
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
        EQUIP_CODE : this.EQUIP_CODE,
        EQUIP_GROUP : this.EQUIP_GROUP === undefined ? null : this.EQUIP_GROUP ,
        LOAD_TIME : this.LOAD_TIME,
        TRANSFER_TIME : this.TRANSFER_TIME,
        OTHER_TIME : this.OTHER_TIME,
        BIG_ADJUST_TIME : this.BIG_ADJUST_TIME,
        SMALL_ADJUST_TIME : this.SMALL_ADJUST_TIME,
        RETURN_TIME : this.RETURN_TIME,
        COOLING_TIME : this.COOLING_TIME,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })

      console.log(obj)
      myObj.PPSService.insertI103Tab1Save('1', obj).subscribe(res => {
        console.log(res)
        if(res[0].MSG === "Y") {
          this.SHOP_CODE = undefined;
          this.EQUIP_CODE = undefined;
          this.EQUIP_GROUP = undefined;
          this.LOAD_TIME = undefined;
          this.TRANSFER_TIME = undefined;
          this.OTHER_TIME = undefined;
          this.BIG_ADJUST_TIME = undefined;
          this.SMALL_ADJUST_TIME = undefined;
          this.RETURN_TIME = undefined;
          this.COOLING_TIME = undefined;
          this.getPPSINP03List();
          this.sucessMSG("新增成功", ``);
          this.isVisiblePrepare = false;
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
        ID : this.editCache3[_id].data.tab3ID,
        SHOP_CODE : this.editCache3[_id].data.SHOP_CODE,
        EQUIP_CODE : this.editCache3[_id].data.EQUIP_CODE,
        EQUIP_GROUP : this.editCache3[_id].data.EQUIP_GROUP === undefined ? null : this.editCache3[_id].data.EQUIP_GROUP ,
        LOAD_TIME : this.editCache3[_id].data.LOAD_TIME,
        TRANSFER_TIME : this.editCache3[_id].data.TRANSFER_TIME,
        OTHER_TIME : this.editCache3[_id].data.OTHER_TIME,
        BIG_ADJUST_TIME : this.editCache3[_id].data.BIG_ADJUST_TIME,
        SMALL_ADJUST_TIME : this.editCache3[_id].data.SMALL_ADJUST_TIME,
        RETURN_TIME : this.editCache3[_id].data.RETURN_TIME,
        COOLING_TIME : this.editCache3[_id].data.COOLING_TIME,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })
      myObj.PPSService.updateI103Tab1Save('1', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SHOP_CODE = undefined;
          this.EQUIP_CODE = undefined;
          this.EQUIP_GROUP = undefined;
          this.LOAD_TIME = undefined;
          this.TRANSFER_TIME = undefined;
          this.OTHER_TIME = undefined;
          this.BIG_ADJUST_TIME = undefined;
          this.SMALL_ADJUST_TIME = undefined;
          this.RETURN_TIME = undefined;
          this.COOLING_TIME = undefined;

          this.sucessMSG("修改成功", ``);

          const index = this.PPSINP03List.findIndex(item => item.id === _id);
          Object.assign(this.PPSINP03List[index], this.editCache3[_id].data);
          this.editCache3[_id].edit = false;
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
      let _ID = this.editCache3[_id].data.tab3ID;
      myObj.PPSService.delI103Tab1Data('1', _ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SHOP_CODE = undefined;
          this.EQUIP_CODE = undefined;
          this.EQUIP_GROUP = undefined;
          this.LOAD_TIME = undefined;
          this.TRANSFER_TIME = undefined;
          this.OTHER_TIME = undefined;
          this.BIG_ADJUST_TIME = undefined;
          this.SMALL_ADJUST_TIME = undefined;
          this.RETURN_TIME = undefined;
          this.COOLING_TIME = undefined;

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

  // 資料過濾---整備時間 --> 其他整備
  searchByOtherTime() : void{
    this.ppsInp03ListFilter("OTHER_TIME", this.searchOtherTimeValue);
  } 
  resetByOtherTime() : void{
    this.searchOtherTimeValue = '';
    this.ppsInp03ListFilter("OTHER_TIME", this.searchOtherTimeValue);
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
    // let getFileNull = this.inputFileUseInUpload;
    // if(getFileNull === undefined){
    //   this.errorMSG('請選擇檔案', '');
    //   return;
    // }

    let lastname = this.file.name.split('.').pop();
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
        this.importExcel(this.importdata);
      }
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  importExcel(_data) {
    console.log("EXCEL 資料上傳檢核開始");
    var upload_data = [];
    for(let i=0 ; i < _data.length ; i++) {
      upload_data.push({
        // PLANT_CODE : this.PLANT_CODE,
        SHOP_CODE: _data[i]['站別'].toString(),
        EQUIP_CODE: _data[i]['機台'],
        EQUIP_GROUP: _data[i]['機群'] === undefined ? null : _data[i]['機群'],
        LOAD_TIME: _data[i]['上下料'],
        TRANSFER_TIME: _data[i]['搬運'],
        OTHER_TIME: _data[i]['其他整備'],
        BIG_ADJUST_TIME: _data[i]['大調機'],
        SMALL_ADJUST_TIME: _data[i]['小調機'],
        RETURN_TIME: _data[i]['退料'],
        COOLING_TIME: _data[i]['冷卻']
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

      myObj.PPSService.importI103Excel('1', obj).subscribe(res => {
        if(res[0].MSG === "Y") { 
          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getPPSINP03List()
          
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
      this.getPPSINP03List();
    });
  }

  convertToExcel() {
    let fileName = `整備時間_直棒`;
    let arr = [];
    
    for(let i=0 ; i < this.displayPPSINP03List.length ; i++){
      var ppsInp03 = {
        SHOP_CODE : this.displayPPSINP03List[i].SHOP_CODE,
        EQUIP_CODE : this.displayPPSINP03List[i].EQUIP_CODE,
        EQUIP_GROUP : this.displayPPSINP03List[i].EQUIP_GROUP,
        LOAD_TIME: this.displayPPSINP03List[i].LOAD_TIME,
        TRANSFER_TIME : this.displayPPSINP03List[i].TRANSFER_TIME,
        OTHER_TIME : this.displayPPSINP03List[i].OTHER_TIME,
        BIG_ADJUST_TIME : this.displayPPSINP03List[i].BIG_ADJUST_TIME,
        SMALL_ADJUST_TIME : this.displayPPSINP03List[i].SMALL_ADJUST_TIME,
        RETURN_TIME : this.displayPPSINP03List[i].RETURN_TIME,
        COOLING_TIME: this.displayPPSINP03List[i].COOLING_TIME
      }
      arr.push(ppsInp03);
    }
    this.excelService.exportAsExcelFile(arr, fileName, this.titleArray);
  }


}
