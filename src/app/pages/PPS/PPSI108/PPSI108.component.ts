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


interface ItemData8 {
  id: string;
  tab8ID: number;
  SHOP_CODE_8:string;
  EQUIP_CODE_8: string;
  SHAPE_TYPE_8:string;
  DIA_MIN_8: number;
  DIA_MAX_8: number;
  MINS_8: number;
}


@Component({
  selector: "app-PPSI108",
  templateUrl: "./PPSI108.component.html",
  styleUrls: ["./PPSI108.component.scss"],
  providers:[NzMessageService]
})
export class PPSI108Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 非線速
  tab8ID;
  SHOP_CODE_8;
  EQUIP_CODE_8;
  SHAPE_TYPE_8;
  DIA_MIN_8;
  DIA_MAX_8;
  MINS_8;
  isVisibleNonSpeed = false;t
  searchShopCode8Value = '';
  searchEquipCode8Value = '';
  searchShapeType8Value = '';
  searchDiaMin8Value = '';
  searchDiaMax8Value = '';
  searchMins8Value = '';

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["id","tab4ID","站號","機台","產出形狀","產出尺寸最小值","產出尺寸最大值","加工時間"];
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
    this.getPPSINP08List();
  }
  
  PPSINP08List_tmp;
  PPSINP08List: ItemData8[] = [];
  editCache8: { [key: string]: { edit: boolean; data: ItemData8 } } = {};
  displayPPSINP08List : ItemData8[] = [];
  getPPSINP08List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP08List('1').subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP08List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP08List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab8ID: this.PPSINP08List_tmp[i].ID,
          SHOP_CODE_8: this.PPSINP08List_tmp[i].SHOP_CODE,
          EQUIP_CODE_8: this.PPSINP08List_tmp[i].EQUIP_CODE,
          SHAPE_TYPE_8: this.PPSINP08List_tmp[i].SHAPE_TYPE,
          DIA_MIN_8: this.PPSINP08List_tmp[i].DIA_MIN,
          DIA_MAX_8: this.PPSINP08List_tmp[i].DIA_MAX,
          MINS_8: this.PPSINP08List_tmp[i].MINS,
        });
      }
      this.PPSINP08List = data;
      this.displayPPSINP08List = this.PPSINP08List;
      this.updateEditCache();
      console.log(this.PPSINP08List);
      myObj.loading = false;
    });
  }
  

  // insert
  insertTab() {
    let myObj = this;
    if (this.SHOP_CODE_8 === undefined) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.EQUIP_CODE_8 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.SHAPE_TYPE_8 === undefined) {
      myObj.message.create("error", "「產出形狀」不可為空");
      return;
    }  else if (this.DIA_MIN_8 === undefined) {
      myObj.message.create("error", "「產出尺寸最小值」不可為空");
      return;
    }  else if (this.DIA_MAX_8 === undefined) {
      myObj.message.create("error", "「產出尺寸最大值」不可為空");
      return;
    }   else if (this.MINS_8 === undefined) {
      myObj.message.create("error", "「加工時間」不可為空");
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
    this.editCache8[id].edit = true;
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
    const index = this.PPSINP08List.findIndex(item => item.id === id);
    this.editCache8[id] = {
      data: { ...this.PPSINP08List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache8[id].data.SHOP_CODE_8 === undefined) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.editCache8[id].data.EQUIP_CODE_8 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.editCache8[id].data.SHAPE_TYPE_8 === undefined) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    } else if (this.editCache8[id].data.DIA_MIN_8 === undefined) {
      myObj.message.create("error", "「產出尺寸最小值」不可為空");
      return;
    } else if (this.editCache8[id].data.DIA_MAX_8 === undefined) {
      myObj.message.create("error", "「產出尺寸最大值」不可為空");
      return;
    } else if (this.editCache8[id].data.MINS_8 === undefined) {
      myObj.message.create("error", "「每噸花時間」不可為空");
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
    this.PPSINP08List.forEach(item => {
      this.editCache8[item.id] = {
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
        SHOP_CODE : this.SHOP_CODE_8,
        EQUIP_CODE : this.EQUIP_CODE_8,
        SHAPE_TYPE : this.SHAPE_TYPE_8,
        DIA_MIN : this.DIA_MIN_8,
        DIA_MAX : this.DIA_MAX_8,
        MINS : this.MINS_8,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })

      myObj.PPSService.insertI108Save('1', obj).subscribe(res => {

        console.log(res)
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_8 = undefined;
          this.EQUIP_CODE_8 = undefined;
          this.SHAPE_TYPE_8 = undefined;
          this.DIA_MIN_8 = undefined;
          this.DIA_MAX_8 = undefined;
          this.MINS_8 = undefined;
          this.getPPSINP08List();
          this.sucessMSG("新增成功", ``);
          this.isVisibleNonSpeed = false;
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
        ID : this.editCache8[_id].data.tab8ID,
        SHOP_CODE : this.editCache8[_id].data.SHOP_CODE_8,
        EQUIP_CODE : this.editCache8[_id].data.EQUIP_CODE_8,
        SHAPE_TYPE : this.editCache8[_id].data.SHAPE_TYPE_8,
        DIA_MIN : this.editCache8[_id].data.DIA_MIN_8,
        DIA_MAX : this.editCache8[_id].data.DIA_MAX_8,
        MINS : this.editCache8[_id].data.MINS_8,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })
      myObj.PPSService.updateI108Save('1', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_8 = undefined;
          this.EQUIP_CODE_8 = undefined;
          this.SHAPE_TYPE_8 = undefined;
          this.DIA_MIN_8 = undefined;
          this.DIA_MAX_8 = undefined;
          this.MINS_8 = undefined;

          this.sucessMSG("修改成功", ``);

          const index = this.PPSINP08List.findIndex(item => item.id === _id);
          Object.assign(this.PPSINP08List[index], this.editCache8[_id].data);
          this.editCache8[_id].edit = false;
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
      let _ID = this.editCache8[_id].data.tab8ID;
      myObj.PPSService.delI108Data('1', _ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_8 = undefined;
          this.EQUIP_CODE_8 = undefined;
          this.SHAPE_TYPE_8 = undefined;
          this.DIA_MIN_8 = undefined;
          this.DIA_MAX_8 = undefined;
          this.MINS_8 = undefined;

          this.sucessMSG("刪除成功", ``);
          this.getPPSINP08List();
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
  // 新增非線速之彈出視窗
  openNonSpeedInput() : void {
    this.isVisibleNonSpeed = true;
  }
  //取消線速之彈出視窗
  cancelNonSpeedInput() : void {
    this.isVisibleNonSpeed = false;
  }


// ============= 過濾資料之menu ========================
  // 8.(資料過濾)非線速
  ppsInp08ListFilter(property:string, keyWord:string){

    if(_.isEmpty(keyWord)){
      this.displayPPSINP08List = this.PPSINP08List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP08List.filter(item => filterFunc(item));
    this.displayPPSINP08List = data;
  }

  // 資料過濾---非線速 --> 站號
  searchByShopCode8() : void {
    this.ppsInp08ListFilter("SHOP_CODE_8", this.searchShopCode8Value);
  } 
  resetByShopCode8() : void {
    this.searchShopCode8Value = '';
    this.ppsInp08ListFilter("SHOP_CODE_8", this.searchShopCode8Value);
  }

  // 資料過濾---非線速 --> 機台
  searchByEquipCode8() : void {
    this.ppsInp08ListFilter("EQUIP_CODE_8", this.searchEquipCode8Value);
  } 
  resetByEquipCode8() : void {
    this.searchEquipCode8Value = '';
    this.ppsInp08ListFilter("EQUIP_CODE_8", this.searchEquipCode8Value);
  }

  // 資料過濾---非線速 --> 產出形狀
  searchByShapeType8() : void {
    this.ppsInp08ListFilter("SHAPE_TYPE_8", this.searchShapeType8Value);
  } 
  resetByShapeType8() : void {
    this.searchShapeType8Value = '';
    this.ppsInp08ListFilter("SHAPE_TYPE_8", this.searchShapeType8Value);
  }
  
  // 資料過濾---非線速 --> 產出尺寸最小值
  searchByDiaMin8() : void {
    this.ppsInp08ListFilter("DIA_MIN_8", this.searchDiaMin8Value);
  } 
  resetByDiaMin8() : void {
    this.searchDiaMin8Value = '';
    this.ppsInp08ListFilter("DIA_MIN_8", this.searchDiaMin8Value);
  }

  // 資料過濾---非線速 --> 產出尺寸最大值
  searchByDiaMax8() : void {
    this.ppsInp08ListFilter("DIA_MAX_8", this.searchDiaMax8Value);
  } 
  resetByDiaMax8() : void {
    this.searchDiaMax8Value = '';
    this.ppsInp08ListFilter("DIA_MAX_8", this.searchDiaMax8Value);
  }

  // 資料過濾---非線速 --> 加工時間
  searchByMins8() : void {
    this.ppsInp08ListFilter("MINS_8", this.searchMins8Value);
  } 
  resetByMins8() : void {
    this.searchMins8Value = '';
    this.ppsInp08ListFilter("MINS_8", this.searchMins8Value);
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
      myObj.PPSService.importI107Excel(obj).subscribe(res => {
        console.log("importExcelPPSI105");
        if(res[0].MSG === "Y") { 
          

          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getPPSINP08List()
          
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
    this.getPPSINP08List();

  }

  convertToExcel() {
    console.log("convertToExcel");
    let ID_List = [];
    let arr = [];
    console.log(JSON.stringify(this.displayPPSINP08List[0]));
    let fileName = `非線速 - 直棒`;
    
    this.excelService.exportAsExcelFile(this.displayPPSINP08List, fileName, this.titleArray);
  }
}
