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



interface ItemData17 {
  id: string;
  tab17ID: number;
  EQUIP_CODE_17: string;
  DIA_MIN_17: number;
  DIA_MAX_17: number;
  SHAPE_TYPE_17: string;
  SMALL_ADJUST_CODE_17: string;
  SMALL_ADJUST_TOLERANCE_17: string;
  FURANCE_BATCH_QTY_17: number; 
}

@Component({
  selector: "app-PPSI106",
  templateUrl: "./PPSI106.component.html",
  styleUrls: ["./PPSI106.component.scss"],
  providers:[NzMessageService]
})
export class PPSI106Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 小調機
  EQUIP_CODE_17;
  DIA_MIN_17;
  DIA_MAX_17;
  SHAPE_TYPE_17;
  SMALL_ADJUST_CODE_17;
  SMALL_ADJUST_TOLERANCE_17;
  FURANCE_BATCH_QTY_17; 
  isVisibleSmallAdjust = false;
  searchEquipCode17Value = '';
  searchDiaMin17Value = '';
  searchDiaMax17Value = '';
  searchShapeType17Value = '';
  searchSmallAdjustCode17Value = '';
  searchSmallAdjustTolerance17Value = '';
  searchFuranceBatchQty17Value = '';

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["id","tab4ID","機台","產出尺寸最小值","產出尺寸最大直","產出型態","小調機代碼","小調機公差標準","爐批數量"];
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
    this.getPPSINP17List();
  }
  
 
  PPSINP17List_tmp;
  PPSINP17List: ItemData17[] = [];
  editCache17: { [key: string]: { edit: boolean; data: ItemData17 } } = {};
  displayPPSINP17List : ItemData17[] = [];
  getPPSINP17List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP17List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP17List_tmp = res;
      const data = [];
      for (let i = 0; i < this.PPSINP17List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab17ID: this.PPSINP17List_tmp[i].ID,
          EQUIP_CODE_17: this.PPSINP17List_tmp[i].EQUIP_CODE,
          DIA_MIN_17: this.PPSINP17List_tmp[i].DIA_MIN,
          DIA_MAX_17: this.PPSINP17List_tmp[i].DIA_MAX,
          SHAPE_TYPE_17: this.PPSINP17List_tmp[i].SHAPE_TYPE,
          SMALL_ADJUST_CODE_17: this.PPSINP17List_tmp[i].SMALL_ADJUST_CODE,
          SMALL_ADJUST_TOLERANCE_17: this.PPSINP17List_tmp[i].SMALL_ADJUST_TOLERANCE,
          FURANCE_BATCH_QTY_17: this.PPSINP17List_tmp[i].FURANCE_BATCH_QTY
        });
      }
      this.PPSINP17List = data;
      this.displayPPSINP17List = this.PPSINP17List;
      this.updateEditCache();
      myObj.loading = false;
    });
  }

  // insert
  insertTab() {
    let myObj = this;
    if (this.EQUIP_CODE_17 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.DIA_MIN_17 === undefined) {
      myObj.message.create("error", "「產出尺寸最小值」不可為空");
      return;
    }  else if (this.DIA_MAX_17 === undefined) {
      myObj.message.create("error", "「產出尺寸最大值」不可為空");
      return;
    }   else if (this.SHAPE_TYPE_17 === undefined) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    }   else if (this.SMALL_ADJUST_CODE_17 === undefined) {
      myObj.message.create("error", "「小調機代碼」不可為空");
      return;
    }   else if (this.SMALL_ADJUST_TOLERANCE_17 === undefined) {
      myObj.message.create("error", "「小調機公差標準」不可為空");
      return;
    }   else if (this.FURANCE_BATCH_QTY_17 === undefined) {
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
    this.editCache17[id].edit = true;
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
    const index = this.PPSINP17List.findIndex(item => item.id === id);
    this.editCache17[id] = {
      data: { ...this.PPSINP17List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache17[id].data.EQUIP_CODE_17 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.editCache17[id].data.DIA_MIN_17 === undefined) {
      myObj.message.create("error", "「產出尺寸最小值」不可為空");
      return;
    } else if (this.editCache17[id].data.DIA_MAX_17 === undefined) {
      myObj.message.create("error", "「產出尺寸最大值」不可為空");
      return;
    }  else if (this.editCache17[id].data.SHAPE_TYPE_17 === undefined) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    }  else if (this.editCache17[id].data.SMALL_ADJUST_CODE_17 === undefined) {
      myObj.message.create("error", "「大調機代碼」不可為空");
      return;
    }  else if (this.editCache17[id].data.SMALL_ADJUST_TOLERANCE_17 === undefined) {
      myObj.message.create("error", "「小調機公差標準」不可為空");
      return;
    }   else if (this.editCache17[id].data.FURANCE_BATCH_QTY_17 === undefined) {
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
    this.PPSINP17List.forEach(item => {
      this.editCache17[item.id] = {
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
        EQUIP_CODE : this.EQUIP_CODE_17,
        DIA_MIN : this.DIA_MIN_17,
        DIA_MAX : this.DIA_MAX_17,
        SHAPE_TYPE : this.SHAPE_TYPE_17,
        SMALL_ADJUST_CODE : this.SMALL_ADJUST_CODE_17,
        SMALL_ADJUST_TOLERANCE : this.SMALL_ADJUST_TOLERANCE_17,
        FURANCE_BATCH_QTY : this.FURANCE_BATCH_QTY_17,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })

      myObj.PPSService.insertI117Tab1Save(obj).subscribe(res => {
        console.log(res)
        if(res[0].MSG === "Y") {
          this.EQUIP_CODE_17 = undefined;
          this.DIA_MIN_17 = undefined;
          this.DIA_MAX_17 = undefined;
          this.SHAPE_TYPE_17 = undefined;
          this.SMALL_ADJUST_CODE_17 = undefined;
          this.SMALL_ADJUST_TOLERANCE_17 = undefined;
          this.FURANCE_BATCH_QTY_17 = undefined;
          this.getPPSINP17List();
          this.sucessMSG("新增成功", ``);
          this.isVisibleSmallAdjust = false;
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
        ID : this.editCache17[_id].data.tab17ID,
        EQUIP_CODE : this.editCache17[_id].data.EQUIP_CODE_17,
        DIA_MIN : this.editCache17[_id].data.DIA_MIN_17,
        DIA_MAX : this.editCache17[_id].data.DIA_MAX_17,
        SHAPE_TYPE : this.editCache17[_id].data.SHAPE_TYPE_17,
        SMALL_ADJUST_CODE : this.editCache17[_id].data.SMALL_ADJUST_CODE_17,
        SMALL_ADJUST_TOLERANCE : this.editCache17[_id].data.SMALL_ADJUST_TOLERANCE_17,
        FURANCE_BATCH_QTY : this.editCache17[_id].data.FURANCE_BATCH_QTY_17,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })
      myObj.PPSService.updateI117Tab1Save(obj).subscribe(res => 
        {
        if(res[0].MSG === "Y") {
          this.EQUIP_CODE_17 = undefined;
          this.DIA_MIN_17 = undefined;
          this.DIA_MAX_17 = undefined;
          this.SHAPE_TYPE_17 = undefined;
          this.SMALL_ADJUST_CODE_17 = undefined;
          this.SMALL_ADJUST_TOLERANCE_17 = undefined;
          this.FURANCE_BATCH_QTY_17 = undefined;
          this.sucessMSG("修改成功", ``);
          const index = this.PPSINP17List.findIndex(item => item.id === _id);
          Object.assign(this.PPSINP17List[index], this.editCache17[_id].data);
          this.editCache17[_id].edit = false;
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
      let _ID = this.editCache17[_id].data.tab17ID;
      myObj.PPSService.delI117Tab1Data(_ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.EQUIP_CODE_17 = undefined;
          this.DIA_MIN_17 = undefined;
          this.DIA_MAX_17 = undefined;
          this.SHAPE_TYPE_17 = undefined;
          this.SMALL_ADJUST_CODE_17 = undefined;
          this.SMALL_ADJUST_TOLERANCE_17 = undefined;
          this.FURANCE_BATCH_QTY_17 = undefined;
          this.sucessMSG("刪除成功", ``);
          this.getPPSINP17List();
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
   // 新增小調機之彈出視窗
  openSmallAdjustInput() : void {
    this.isVisibleSmallAdjust = true;
  }
  //取消小調機彈出視窗
  cancelSmallAdjustInput() : void {
    this.isVisibleSmallAdjust = false;
  }



// ============= 過濾資料之menu ========================
// 6.(資料過濾)小調機
ppsInp17ListFilter(property:string, keyWord:string){

  if(_.isEmpty(keyWord)){
    this.displayPPSINP17List = this.PPSINP17List;
    return;
  }

  const filterFunc = item => {
    let propertyValue = _.get(item, property);
    return _.startsWith(propertyValue, keyWord);
  };

  const data = this.PPSINP17List.filter(item => filterFunc(item));
  this.displayPPSINP17List = data;
}

// 資料過濾---小調機 --> 機台
searchByEquipCode17() : void{
  this.ppsInp17ListFilter("EQUIP_CODE_17", this.searchEquipCode17Value);
} 
resetByEquipCode17() : void{
  this.searchEquipCode17Value = '';
  this.ppsInp17ListFilter("EQUIP_CODE_17", this.searchEquipCode17Value);
}

// 資料過濾---小調機 --> 產出尺寸最小值
searchByDiaMin17() : void{
  this.ppsInp17ListFilter("DIA_MIN_17", this.searchDiaMin17Value);
} 
resetByDiaMin17() : void{
  this.searchDiaMin17Value = '';
  this.ppsInp17ListFilter("DIA_MIN_17", this.searchDiaMin17Value);
}

// 資料過濾---小調機 --> 產出尺寸最大值
searchByDiaMax17() : void{
  this.ppsInp17ListFilter("DIA_MAX_17", this.searchDiaMax17Value);
} 
resetByDiaMax17() : void{
  this.searchDiaMax17Value = '';
  this.ppsInp17ListFilter("DIA_MAX_17", this.searchDiaMax17Value);
}

// 資料過濾---小調機 --> 產出型態
searchByShapeType17() : void {
  this.ppsInp17ListFilter("SHAPE_TYPE_17", this.searchShapeType17Value);
} 
resetByShapeType17() : void {
  this.searchShapeType17Value = '';
  this.ppsInp17ListFilter("SHAPE_TYPE_17", this.searchShapeType17Value);
}

// 資料過濾---小調機 --> 小調機代碼
searchBySmallAdjustCode17() : void {
  this.ppsInp17ListFilter("SMALL_ADJUST_CODE_17", this.searchSmallAdjustCode17Value);
} 
resetBySmallAdjustCode17() : void {
  this.searchSmallAdjustCode17Value = '';
  this.ppsInp17ListFilter("SMALL_ADJUST_CODE_17", this.searchSmallAdjustCode17Value);
}

// 資料過濾---小調機 --> 小調機公差標準
searchBySmallAdjustTolerance17() : void {
  this.ppsInp17ListFilter("SMALL_ADJUST_TOLERANCE_17", this.searchSmallAdjustTolerance17Value);
} 
resetBySmallAdjustTolerance17() : void {
  this.searchSmallAdjustTolerance17Value = '';
  this.ppsInp17ListFilter("SMALL_ADJUST_TOLERANCE_17", this.searchSmallAdjustTolerance17Value);
}

// 資料過濾---小調機 --> 爐批數量
searchByFuranceBatchQty17() : void {
  this.ppsInp17ListFilter("FURANCE_BATCH_QTY_17", this.searchFuranceBatchQty17Value);
} 
resetByFuranceBatchQty17() : void {
  this.searchFuranceBatchQty17Value = '';
  this.ppsInp17ListFilter("FURANCE_BATCH_QTY_17", this.searchFuranceBatchQty17Value);
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
      myObj.PPSService.importI107Excel('1',obj).subscribe(res => {
        console.log("importExcelPPSI105");
        if(res[0].MSG === "Y") { 
          

          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getPPSINP17List()
          
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
    this.getPPSINP17List();

  }

  convertToExcel() {
    console.log("convertToExcel");
    let ID_List = [];
    let arr = [];
    console.log(JSON.stringify(this.displayPPSINP17List[0]));
    let fileName = `小調機 - 直棒`;
    
    this.excelService.exportAsExcelFile(this.displayPPSINP17List, fileName, this.titleArray);
  }
}
