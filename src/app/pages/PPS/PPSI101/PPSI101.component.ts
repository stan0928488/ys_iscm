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
interface ItemData1 {
  id: string;
  tab1ID: number;
  GRADE_NO: string;
  GRADE_GROUP: string;
  SPECIAL_EQUIP_CODE: string;
}

@Component({
  selector: "app-PPSI101",
  templateUrl: "./PPSI101.component.html",
  styleUrls: ["./PPSI101.component.scss"],
  providers:[NzMessageService]
})

export class PPSI101Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  // 1.鋼種分類
  GRADE_NO;
  SPECIAL_EQUIP_CODE;
  GRADE_GROUP;
  isVisibleGrade = false;
  searchByGradeNoValue = '';
  searchBySpecialEquipCodeValue = '';
  searchByGradeGroupValue = '';

  // tab 1
  PPSINP01List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  PPSINP01List: ItemData1[] = [];
  displayPPSINP01List: ItemData1[] = [];
  
  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["鋼種","特殊機台使用","鋼種類別"];
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
    this.getPPSINP01List();
  }
  
  
  //tab1_select 
  getPPSINP01List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP01List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP01List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP01List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.PPSINP01List_tmp[i].ID,
          GRADE_NO: this.PPSINP01List_tmp[i].GRADE_NO,
          SPECIAL_EQUIP_CODE: this.PPSINP01List_tmp[i].SPECIAL_EQUIP_CODE,
          GRADE_GROUP: this.PPSINP01List_tmp[i].GRADE_GROUP
        });
      }
      this.PPSINP01List = data;
      this.displayPPSINP01List = this.PPSINP01List;
      this.updateEditCache(1);
      console.log(this.PPSINP01List);
      myObj.loading = false;
    });
  }


  // insert1
  insertTab1() {
    let myObj = this;
    if (this.GRADE_NO === undefined) {
      myObj.message.create("error", "「設定鋼種」不可為空");
      return;
    } else if (this.SPECIAL_EQUIP_CODE === undefined) {
      myObj.message.create("error", "「特殊機台使用」不可為空");
      return;
    }  else if (this.GRADE_GROUP === undefined) {
      myObj.message.create("error", "「鋼種類別」不可為空");
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave(1)
          this.isVisibleGrade = false;
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }


  // update
  editRow(id: string, _type): void {
    if(_type === 1) {
      this.editCache1[id].edit = true;
    }
  }


  // delete
  deleteRow(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }

  // cancel
  cancelEdit(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP01List.findIndex(item => item.id === id);
      this.editCache1[id] = {
        data: { ...this.PPSINP01List[index] },
        edit: false
      };
    }
  }


  // update Save
  saveEdit(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache1[id])

      let myObj = this;
      if (this.editCache1[id].data.GRADE_NO === undefined) {
        myObj.message.create("error", "「鋼種」不可為空");
        return;
      } else if (this.editCache1[id].data.SPECIAL_EQUIP_CODE === undefined) {
        myObj.message.create("error", "「特殊機台使用」不可為空");
        return;
      } else if (this.editCache1[id].data.GRADE_GROUP === undefined) {
        myObj.message.create("error", "「鋼種類別」不可為空");
        return;
      } else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }


  // update
  updateEditCache(_type): void {
    if(_type === 1) {
      this.PPSINP01List.forEach(item => {
        this.editCache1[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }

  changeTab(tab): void {
    console.log(tab)
    if(tab === 1) {
      this.getPPSINP01List();
    }
  }
  

  // 新增資料
  insertSave(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          GRADE_NO : this.GRADE_NO,
          GRADE_GROUP : this.GRADE_GROUP,
          SPECIAL_EQUIP_CODE : this.SPECIAL_EQUIP_CODE,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })

        myObj.PPSService.insertI101Tab1Save(obj).subscribe(res => {

          console.log(res)
          if(res[0].MSG === "Y") {
            this.GRADE_NO = undefined;
            this.GRADE_GROUP = undefined;
            this.SPECIAL_EQUIP_CODE = undefined;
            this.getPPSINP01List();
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
  }
  

  // 修改資料
  updateSave(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache1[_id].data.tab1ID,
          GRADE_NO : this.editCache1[_id].data.GRADE_NO,
          GRADE_GROUP : this.editCache1[_id].data.GRADE_GROUP,
          SPECIAL_EQUIP_CODE : this.editCache1[_id].data.SPECIAL_EQUIP_CODE,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.PPSService.updateI101Tab1Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.GRADE_NO = undefined;
            this.GRADE_GROUP = undefined;
            this.SPECIAL_EQUIP_CODE = undefined;

            this.sucessMSG("修改成功", ``);

            const index = this.PPSINP01List.findIndex(item => item.id === _id);
            Object.assign(this.PPSINP01List[index], this.editCache1[_id].data);
            this.editCache1[_id].edit = false;
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
  }
  

  // 刪除資料
  delID(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache1[_id].data.tab1ID;
        myObj.PPSService.delI101Tab1Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.GRADE_NO = undefined;
            this.GRADE_GROUP = undefined;
            this.SPECIAL_EQUIP_CODE = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getPPSINP01List();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
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

  //============== 新增資料之彈出視窗 =====================

  // 新增鋼種之彈出視窗
  openGradeInput(): void {
    this.isVisibleGrade = true;
  }
  // 取消鋼種彈出視窗
  cancelGradeInput() : void{
    this.isVisibleGrade = false;
  }



  // ============= 過濾資料之menu ========================

  // 1.(過濾資料)鋼種分類
  ppsInp01ListFilter(property:string, keyWord:string){
    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      if (keyWord == "") {
        return true;
      } else {
        return _.startsWith(propertyValue, keyWord);
      }
    };

     const data = this.PPSINP01List.filter(item => filterFunc(item));
    this.displayPPSINP01List = data;
  }

  // 資料過濾---鋼種分類 --> 鋼種
  searchByGradeNo() : void {
    this.ppsInp01ListFilter("GRADE_NO", this.searchByGradeNoValue);
  }
  resetByGradeNo() : void {
    this.searchByGradeNoValue = '';
    this.ppsInp01ListFilter("GRADE_NO", this.searchByGradeNoValue);
  }
  
  // 資料過濾---鋼種分類 --> 特殊機台使用
  searchBySpecialEquipCode() :void {
    this.ppsInp01ListFilter("SPECIAL_EQUIP_CODE", this.searchBySpecialEquipCodeValue);
  }
  resetBySpecialEquipCode() :void {
    this.searchBySpecialEquipCodeValue = '';
    this.ppsInp01ListFilter("SPECIAL_EQUIP_CODE", this.searchBySpecialEquipCodeValue);
  }

   // 資料過濾---鋼種分類 --> 鋼種類別
   searchByGradeGroup() :void {
    this.ppsInp01ListFilter("GRADE_GROUP", this.searchByGradeGroupValue);
  }
  resetByGradeGroup() :void {
    this.searchByGradeGroupValue = '';
    this.ppsInp01ListFilter("GRADE_GROUP", this.searchByGradeGroupValue);
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

        if (this.importdata_repeat.includes(allData)){
          this.errorMSG('重複資料', '第' + (i+2) + "筆與上一筆為重複資料");
          this.clearFile();
          return;
        }
        else{
          this.importdata_repeat.push(allData);
          console.log(_data[i]['特殊機台使用']);
          if(_data[i]['特殊機台使用'] == undefined)
            _data[i]['特殊機台使用'] = '';

          console.log(_data[i]['特殊機台使用']);
          upload_data.push({
            GRADE_NO: _data[i]['鋼種'],
            SPECIAL_EQUIP_CODE: _data[i]['特殊機台使用'] ,
            GRADE_GROUP: _data[i]['鋼種類別'],
            DATETIME : moment().format('YYYY-MM-DD HH:mm:ss'),
            USERNAME : this.USERNAME,
            PLANT_CODE : this.PLANT_CODE
          })
        }
      }
      

      return new Promise((resolve, reject) => {
        console.log("匯入開始");
        this.LoadingPage = true;
        let myObj = this;
        let obj = {};
        obj = {
          EXCELDATA: upload_data
        };

        console.log("EXCELDATA:"+ obj);
        myObj.PPSService.importI101TablExcel(obj).subscribe(res => {
          console.log("importExcelPPSI101");
          if(res[0].MSG === "Y") { 
            

            this.loading = false;
            this.LoadingPage = false;
            
            this.sucessMSG("EXCCEL上傳成功", "");
            this.clearFile();
            this.getPPSINP01List()
            
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
      this.getPPSINP01List();

    }

    convertToExcel() {
      console.log("convertToExcel");
      let arr = [];
      console.log(this.displayPPSINP01List);
      let fileName = `鋼種分類`;
      
      for(let i = 0 ; i<this.displayPPSINP01List.length ; i++ ){

        var ppsInP01 = {
          GRADE_NO: this.displayPPSINP01List[i].GRADE_NO,
          GRADE_GROUP: this.displayPPSINP01List[i].GRADE_GROUP,
          SPECIAL_EQUIP_CODE: this.displayPPSINP01List[i].SPECIAL_EQUIP_CODE
        }
        arr.push(ppsInP01);
      }
      
      this.excelService.exportAsExcelFile(arr, fileName, this.titleArray);
    }
}
