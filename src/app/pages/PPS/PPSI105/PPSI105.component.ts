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





interface ItemData4 {
  id: string;
  tab4ID: number;
  EQUIP_CODE_4: string;
  DIA_MIN_4: number;
  DIA_MAX_4: number;
  SHAPE_TYPE_4: string;
  BIG_ADJUST_CODE_4: string;
  SMALL_ADJUST_TOLERANCE_4: string;
  FURANCE_BATCH_QTY_4: number; 
}


@Component({
  selector: "app-PPSI105",
  templateUrl: "./PPSI105.component.html",
  styleUrls: ["./PPSI105.component.scss"],
  providers:[NzMessageService]
})
export class PPSI105Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 大調機
  EQUIP_CODE_4;
  DIA_MIN_4;
  DIA_MAX_4;
  SHAPE_TYPE_4;
  BIG_ADJUST_CODE_4;
  SMALL_ADJUST_TOLERANCE_4;
  FURANCE_BATCH_QTY_4; 
  isVisibleBigAdjust = false;
  searchEquipCode4Value = '';
  searchDiaMin4Value = '';
  searchDiaMax4Value = '';
  searchShapeType4Value = '';
  searchBigAdjustCode4Value = '';
  searchSmallAdjustTolerance4Value = '';
  searchFuranceBatchQty4Value = '';

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["機台","產出尺寸最小值","產出尺寸最大值","產出型態","大調機代碼","小調機公差標準","爐批數量"];
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
    this.getPPSINP04List();
  }
  
 
  PPSINP04List_tmp;
  PPSINP04List: ItemData4[] = [];
  editCache4: { [key: string]: { edit: boolean; data: ItemData4 } } = {};
  displayPPSINP04List : ItemData4[] = [];
  getPPSINP04List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP04List('1').subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP04List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP04List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab4ID: this.PPSINP04List_tmp[i].ID,
          EQUIP_CODE_4: this.PPSINP04List_tmp[i].EQUIP_CODE,
          DIA_MIN_4: this.PPSINP04List_tmp[i].DIA_MIN,
          DIA_MAX_4: this.PPSINP04List_tmp[i].DIA_MAX,
          SHAPE_TYPE_4: this.PPSINP04List_tmp[i].SHAPE_TYPE,
          BIG_ADJUST_CODE_4: this.PPSINP04List_tmp[i].BIG_ADJUST_CODE,
          SMALL_ADJUST_TOLERANCE_4: this.PPSINP04List_tmp[i].SMALL_ADJUST_TOLERANCE,
          FURANCE_BATCH_QTY_4: this.PPSINP04List_tmp[i].FURANCE_BATCH_QTY
        });
      }
      this.PPSINP04List = data;
      this.displayPPSINP04List = this.PPSINP04List;
      this.updateEditCache();
      console.log(this.PPSINP04List);
      myObj.loading = false;
    });
  }


  // insert
  insertTab() {
    let myObj = this;
    if (this.EQUIP_CODE_4 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.DIA_MIN_4 === undefined) {
      myObj.message.create("error", "「產出尺寸最小值」不可為空");
      return;
    }  else if (this.DIA_MAX_4 === undefined) {
      myObj.message.create("error", "「產出尺寸最大值」不可為空");
      return;
    }   else if (this.SHAPE_TYPE_4 === undefined) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    }   else if (this.BIG_ADJUST_CODE_4 === undefined) {
      myObj.message.create("error", "「大調機代碼」不可為空");
      return;
    }   else if (this.SMALL_ADJUST_TOLERANCE_4 === undefined) {
      myObj.message.create("error", "「小調機公差標準」不可為空");
      return;
    }   else if (this.FURANCE_BATCH_QTY_4 === undefined) {
      myObj.message.create("error", "「爐批數量」不可為空");
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
    this.editCache4[id].edit = true;
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
    const index = this.PPSINP04List.findIndex(item => item.id === id);
    this.editCache4[id] = {
      data: { ...this.PPSINP04List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache4[id].data.EQUIP_CODE_4 === undefined || "" === this.editCache4[id].data.EQUIP_CODE_4) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.editCache4[id].data.DIA_MIN_4 === undefined || "" === this.editCache4[id].data.DIA_MIN_4.toString()) {
      myObj.message.create("error", "「產出尺寸最小值」不可為空");
      return;
    } else if (this.editCache4[id].data.DIA_MAX_4 === undefined || "" === this.editCache4[id].data.DIA_MAX_4.toString()) {
      myObj.message.create("error", "「產出尺寸最大值」不可為空");
      return;
    } else if (this.editCache4[id].data.SHAPE_TYPE_4 === undefined || "" === this.editCache4[id].data.SHAPE_TYPE_4) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    } else if (this.editCache4[id].data.BIG_ADJUST_CODE_4 === undefined || "" === this.editCache4[id].data.BIG_ADJUST_CODE_4) {
      myObj.message.create("error", "「大調機代碼」不可為空");
      return;
    } else if (this.editCache4[id].data.SMALL_ADJUST_TOLERANCE_4 === undefined || "" === this.editCache4[id].data.SMALL_ADJUST_TOLERANCE_4) {
      myObj.message.create("error", "「小調機公差標準」不可為空");
      return;
    } else if (this.editCache4[id].data.FURANCE_BATCH_QTY_4 === undefined || "" === this.editCache4[id].data.FURANCE_BATCH_QTY_4.toString()) {
      myObj.message.create("error", "「爐批數量」不可為空");
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
    this.PPSINP04List.forEach(item => {
      this.editCache4[item.id] = {
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
        EQUIP_CODE : this.EQUIP_CODE_4,
        DIA_MIN : this.DIA_MIN_4,
        DIA_MAX : this.DIA_MAX_4,
        SHAPE_TYPE : this.SHAPE_TYPE_4,
        BIG_ADJUST_CODE : this.BIG_ADJUST_CODE_4,
        SMALL_ADJUST_TOLERANCE : this.SMALL_ADJUST_TOLERANCE_4,
        FURANCE_BATCH_QTY : this.FURANCE_BATCH_QTY_4,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })

      myObj.PPSService.insertI104Tab1Save('1', obj).subscribe(res => {

        console.log(res)
        if(res[0].MSG === "Y") {
          this.EQUIP_CODE_4 = undefined;
          this.DIA_MIN_4 = undefined;
          this.DIA_MAX_4 = undefined;
          this.SHAPE_TYPE_4 = undefined;
          this.BIG_ADJUST_CODE_4 = undefined;
          this.SMALL_ADJUST_TOLERANCE_4 = undefined;
          this.FURANCE_BATCH_QTY_4 = undefined;
          this.getPPSINP04List();
          this.sucessMSG("新增成功", ``);
          this.isVisibleBigAdjust = false;
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
        ID : this.editCache4[_id].data.tab4ID,
        EQUIP_CODE : this.editCache4[_id].data.EQUIP_CODE_4,
        DIA_MIN : this.editCache4[_id].data.DIA_MIN_4,
        DIA_MAX : this.editCache4[_id].data.DIA_MAX_4,
        SHAPE_TYPE : this.editCache4[_id].data.SHAPE_TYPE_4,
        BIG_ADJUST_CODE : this.editCache4[_id].data.BIG_ADJUST_CODE_4,
        SMALL_ADJUST_TOLERANCE : this.editCache4[_id].data.SMALL_ADJUST_TOLERANCE_4,
        FURANCE_BATCH_QTY : this.editCache4[_id].data.FURANCE_BATCH_QTY_4,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })
      myObj.PPSService.updateI104Tab1Save('1', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.EQUIP_CODE_4 = undefined;
          this.DIA_MIN_4 = undefined;
          this.DIA_MAX_4 = undefined;
          this.SHAPE_TYPE_4 = undefined;
          this.BIG_ADJUST_CODE_4 = undefined;
          this.SMALL_ADJUST_TOLERANCE_4 = undefined;
          this.FURANCE_BATCH_QTY_4 = undefined;

          this.sucessMSG("修改成功", ``);

          const index = this.PPSINP04List.findIndex(item => item.id === _id);
          Object.assign(this.PPSINP04List[index], this.editCache4[_id].data);
          this.editCache4[_id].edit = false;
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
      let _ID = this.editCache4[_id].data.tab4ID;
      myObj.PPSService.delI104Tab1Data('1', _ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.EQUIP_CODE_4 = undefined;
          this.DIA_MIN_4 = undefined;
          this.DIA_MAX_4 = undefined;
          this.SHAPE_TYPE_4 = undefined;
          this.BIG_ADJUST_CODE_4 = undefined;
          this.SMALL_ADJUST_TOLERANCE_4 = undefined;
          this.FURANCE_BATCH_QTY_4 = undefined;

          this.sucessMSG("刪除成功", ``);
          this.getPPSINP04List();
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
   // 新增大調機之彈出視窗
  openBigAdjustInput() : void {
    this.isVisibleBigAdjust = true;
  }
   //取消大調機彈出視窗
   cancelBigAdjustInput() : void {
    this.isVisibleBigAdjust = false;
  }



// ============= 過濾資料之menu ========================

  // 5.(資料過濾)大調機
  ppsInp04ListFilter(property:string, keyWord:string){

    if(keyWord == ""){
      this.displayPPSINP04List = this.PPSINP04List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP04List.filter(item => filterFunc(item));
    this.displayPPSINP04List = data;
  }
    
  // 資料過濾---大調機 --> 機台
  searchByEquipCode4() : void{
    this.ppsInp04ListFilter("EQUIP_CODE_4", this.searchEquipCode4Value);
  } 
  resetByEquipCode4() : void{
    this.searchEquipCode4Value = '';
    this.ppsInp04ListFilter("EQUIP_CODE_4", this.searchEquipCode4Value);
  }

  // 資料過濾---大調機 --> 產出尺寸最小值
  searchByDiaMin4() : void{
    this.ppsInp04ListFilter("DIA_MIN_4", this.searchDiaMin4Value);
  } 
  resetByDiaMin4() : void{
    this.searchDiaMin4Value = '';
    this.ppsInp04ListFilter("DIA_MIN_4", this.searchDiaMin4Value);
  }

  // 資料過濾---大調機 --> 產出尺寸最大值
  searchByDiaMax4() : void{
    this.ppsInp04ListFilter("DIA_MAX_4", this.searchDiaMax4Value);
  } 
  resetByDiaMax4() : void{
    this.searchDiaMax4Value = '';
    this.ppsInp04ListFilter("DIA_MAX_4", this.searchDiaMax4Value);
  }

  // 資料過濾---大調機 --> 產出型態
  searchByShapeType4() : void{
    this.ppsInp04ListFilter("SHAPE_TYPE_4", this.searchShapeType4Value);
  } 
  resetByShapeType4() : void{
    this.searchShapeType4Value = '';
    this.ppsInp04ListFilter("SHAPE_TYPE_4", this.searchShapeType4Value);
  }

  // 資料過濾---大調機 --> 大調機代碼
  searchByBigAdjustCode4() : void{
    this.ppsInp04ListFilter("BIG_ADJUST_CODE_4", this.searchBigAdjustCode4Value);
  } 
  resetByBigAdjustCode4() : void{
    this.searchBigAdjustCode4Value = '';
    this.ppsInp04ListFilter("BIG_ADJUST_CODE_4", this.searchBigAdjustCode4Value);
  }

  // 資料過濾---大調機 --> 小調機公差標準
  searchBySmallAdjustTolerance4() : void{
    this.ppsInp04ListFilter("SMALL_ADJUST_TOLERANCE_4", this.searchSmallAdjustTolerance4Value);
  } 
  resetBySmallAdjustTolerance4() : void{
    this.searchSmallAdjustTolerance4Value = '';
    this.ppsInp04ListFilter("SMALL_ADJUST_TOLERANCE_4", this.searchSmallAdjustTolerance4Value);
  }

  // 資料過濾---大調機 --> 爐批數量
  searchByFuranceBatchQty4() : void{
    this.ppsInp04ListFilter("FURANCE_BATCH_QTY_4", this.searchFuranceBatchQty4Value);
  } 
  resetByFuranceBatchQty4() : void{
    this.searchFuranceBatchQty4Value = '';
    this.ppsInp04ListFilter("FURANCE_BATCH_QTY_4", this.searchFuranceBatchQty4Value);
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
        EQUIP_CODE: _data[i]['機台'].toString(),
        DIA_MIN: _data[i]['產出尺寸最小值'].toString(),
        DIA_MAX: _data[i]['產出尺寸最大值'].toString(),
        SHAPE_TYPE: _data[i]['產出型態'].toString(),
        BIG_ADJUST_CODE: _data[i]['大調機代碼'].toString(),
        SMALL_ADJUST_TOLERANCE: _data[i]['小調機公差標準'].toString(),
        FURANCE_BATCH_QTY: _data[i]['爐批數量'].toString()
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

      myObj.PPSService.importI104Excel('1', obj).subscribe(res => {
        if(res[0].MSG === "Y") { 
          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getPPSINP04List()
          
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
      this.getPPSINP04List();
    });
  }

  convertToExcel() {
    let fileName = `調機狀態_直棒`;
    let arr = [];
    
    for(let i=0 ; i < this.displayPPSINP04List.length ; i++){
      var ppsInp04 = {
        EQUIP_CODE : this.displayPPSINP04List[i].EQUIP_CODE_4,
        DIA_MIN : this.displayPPSINP04List[i].DIA_MIN_4,
        DIA_MAX: this.displayPPSINP04List[i].DIA_MAX_4,
        SHAPE_TYPE : this.displayPPSINP04List[i].SHAPE_TYPE_4,
        BIG_ADJUST_CODE : this.displayPPSINP04List[i].BIG_ADJUST_CODE_4,
        SMALL_ADJUST_TOLERANCE : this.displayPPSINP04List[i].SMALL_ADJUST_TOLERANCE_4,
        FURANCE_BATCH_QTY: this.displayPPSINP04List[i].FURANCE_BATCH_QTY_4
      }
      arr.push(ppsInp04);
    }
    this.excelService.exportAsExcelFile(arr, fileName, this.titleArray);
  }



}
