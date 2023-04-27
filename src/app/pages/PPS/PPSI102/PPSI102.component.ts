import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";
import * as moment from 'moment';

interface ItemData7 {
  id: string;
  tab1ID: number;
  EQUIP_CODE_1: string;
  EQUIP_GROUP: string;
  EQUIP_NAME: string;
  PLANT: string;
  SHOP_CODE: string;
  SHOP_NAME: string;
  VALID: string;
}


@Component({
  selector: "app-PPSI102",
  templateUrl: "./PPSI102.component.html",
  styleUrls: ["./PPSI102.component.scss"],
  providers:[NzMessageService]
})
export class PPSI102Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 站別機台關聯表
  PLANT = "直棒";
  SHOP_CODE;
  SHOP_NAME;
  EQUIP_CODE_1;
  EQUIP_NAME;
  EQUIP_GROUP;
  VALID = "Y";
  isVisibleShop = false;
  searchPlantValue = '';
  searchShopCodeValue = '';
  searchShopNameValue = '';
  searchEquipCode1Value = '';
  searchEquipNameValue = '';
  searchEquipGroupValue = '';
  searchValidValue = '';

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ['工廠別','站別代碼','站別名稱','機台','機台名稱','機台群組','有效碼'];
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
    this.getPPSINP07List();
  }
  
  
  PPSINP07List_tmp;
  editCache7: { [key: string]: { edit: boolean; data: ItemData7 } } = {};
  PPSINP07List: ItemData7[] = [];
  displayPPSINP07List: ItemData7[] = [];
  getPPSINP07List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP07List('1').subscribe(res => {
      console.log("getPPSINP07List success");
      this.PPSINP07List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP07List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.PPSINP07List_tmp[i].ID,
          EQUIP_CODE_1: this.PPSINP07List_tmp[i].EQUIP_CODE,
          EQUIP_GROUP: this.PPSINP07List_tmp[i].EQUIP_GROUP,
          EQUIP_NAME: this.PPSINP07List_tmp[i].EQUIP_NAME,
          PLANT: this.PPSINP07List_tmp[i].PLANT,
          SHOP_CODE: this.PPSINP07List_tmp[i].SHOP_CODE,
          SHOP_NAME: this.PPSINP07List_tmp[i].SHOP_NAME,
          VALID: this.PPSINP07List_tmp[i].VALID,
        });
      }
      this.PPSINP07List = data;
      this.displayPPSINP07List = this.PPSINP07List;
      this.updateEditCache();
      console.log(this.PPSINP07List);
      myObj.loading = false;
    });
  }

  

  // insert
  insertTab() {
    let myObj = this;
    if (this.PLANT === undefined) {
      myObj.message.create("error", "「工廠別」不可為空");
      return;
    } else if (this.SHOP_CODE === undefined) {
      myObj.message.create("error", "「站別代碼」不可為空");
      return;
    } else if (this.EQUIP_CODE_1 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.VALID === undefined) {
      myObj.message.create("error", "「有效碼」不可為空");
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave()
          this.isVisibleShop = false;
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }


    
  // update
  editRow(id: string): void {
    this.editCache7[id].edit = true;
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
    const index = this.PPSINP07List.findIndex(item => item.id === id);
    this.editCache7[id] = {
      data: { ...this.PPSINP07List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache7[id].data.PLANT === undefined) {
      myObj.message.create("error", "「工廠別」不可為空");
      return;
    } else if (this.editCache7[id].data.SHOP_CODE === undefined) {
      myObj.message.create("error", "「站別代碼」不可為空");
      return;
    } else if (this.editCache7[id].data.EQUIP_CODE_1 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.editCache7[id].data.VALID === undefined) {
      myObj.message.create("error", "「有效碼」不可為空");
      return;
    }else {
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
    this.PPSINP07List.forEach(item => {
      this.editCache7[item.id] = {
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
        PLANT_CODE : this.PLANT_CODE,
        PLANT : this.PLANT,
        SHOP_CODE : this.SHOP_CODE,
        SHOP_NAME : this.SHOP_NAME === undefined ? null : this.SHOP_NAME,
        EQUIP_CODE : this.EQUIP_CODE_1,
        EQUIP_NAME : this.EQUIP_NAME === undefined ? null : this.EQUIP_NAME,
        EQUIP_GROUP: this.EQUIP_GROUP === undefined ? null : this.EQUIP_GROUP,
        VALID: this.VALID,
        BALANCE_RULE: null,
        ORDER_SEQ: null,
        WT_TYPE : null
      })

      myObj.PPSService.insertI107Save('1', obj).subscribe(res => {
        console.log(res)
        if(res[0].MSG === "Y") {
          this.PLANT = undefined;
          this.SHOP_CODE = undefined;
          this.SHOP_NAME = undefined;
          this.EQUIP_CODE_1 = undefined;
          this.EQUIP_NAME = undefined;
          this.EQUIP_GROUP = undefined;
          this.VALID = undefined;
          this.getPPSINP07List();
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
        ID : this.editCache7[_id].data.tab1ID,
        PLANT : this.editCache7[_id].data.PLANT,
        SHOP_CODE : this.editCache7[_id].data.SHOP_CODE,
        SHOP_NAME : this.editCache7[_id].data.SHOP_NAME === undefined ? null : this.editCache7[_id].data.SHOP_NAME,
        EQUIP_CODE : this.editCache7[_id].data.EQUIP_CODE_1,
        EQUIP_NAME : this.editCache7[_id].data.EQUIP_NAME === undefined ? null : this.editCache7[_id].data.EQUIP_NAME,
        EQUIP_GROUP : this.editCache7[_id].data.EQUIP_GROUP === undefined ? null : this.editCache7[_id].data.EQUIP_GROUP,
        VALID : this.editCache7[_id].data.VALID,
        BALANCE_RULE: null,
        ORDER_SEQ: null,
        WT_TYPE: null
      })
      myObj.PPSService.updateI107Save('1', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.PLANT = undefined;
          this.SHOP_CODE = undefined;
          this.SHOP_NAME = undefined;
          this.EQUIP_CODE_1 = undefined;
          this.EQUIP_NAME = undefined;
          this.EQUIP_GROUP = undefined;
          this.VALID = undefined;

          this.sucessMSG("修改成功", ``);

          const index = this.PPSINP07List.findIndex(item => item.id === _id);
          Object.assign(this.PPSINP07List[index], this.editCache7[_id].data);
          this.editCache7[_id].edit = false;
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
      let _ID = this.editCache7[_id].data.tab1ID;
      myObj.PPSService.delI107Data('1', _ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.PLANT = undefined;
          this.SHOP_CODE = undefined;
          this.SHOP_NAME = undefined;
          this.EQUIP_CODE_1 = undefined;
          this.EQUIP_NAME = undefined;
          this.EQUIP_GROUP = undefined;
          this.VALID = undefined;

          this.sucessMSG("刪除成功", ``);
          this.getPPSINP07List();
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
  // 新增站別機台關聯表之彈出視窗
  openShopInput(): void {
    this.isVisibleShop = true;
  }
  // 取消站別機台關聯表之彈出視窗
  cancelShopInput() : void{
    this.isVisibleShop = false;
  }


// ============= 過濾資料之menu ========================


  // 2.(資料過濾)站別機台關聯表
  ppsInp07ListFilter(property:string, keyWord:string){
    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      if (keyWord == "") {
        return true;
      } else {
        return _.startsWith(propertyValue, keyWord);
      }
    };

    const data = this.PPSINP07List.filter(item => filterFunc(item));
    this.displayPPSINP07List = data;
  }

  // 資料過濾---站別機台關聯表 --> 工廠別
  searchByPlant() :void {
    this.ppsInp07ListFilter("PLANT", this.searchPlantValue);
  }
  resetByPlant() :void {
    this.searchPlantValue = '';
    this.ppsInp07ListFilter("PLANT", this.searchPlantValue);
  }

  // 資料過濾---站別機台關聯表 --> 站別代碼
  searchByShopCode() :void {
    this.ppsInp07ListFilter("SHOP_CODE", this.searchShopCodeValue);
  }
  resetByShopCode() :void {
    this.searchShopCodeValue = '';
    this.ppsInp07ListFilter("SHOP_CODE", this.searchShopCodeValue);
  }

  // 資料過濾---站別機台關聯表 --> 站別名稱
  searchByShopName() :void {
    this.ppsInp07ListFilter("SHOP_NAME", this.searchShopNameValue);
  }
  resetByShopName() :void {
    this.searchShopNameValue = '';
    this.ppsInp07ListFilter("SHOP_NAME", this.searchShopNameValue);
  }

  // 資料過濾---站別機台關聯表 --> 機台
  searchByEquipCode1() :void {
    this.ppsInp07ListFilter("EQUIP_CODE_1", this.searchEquipCode1Value);
  }
  resetByEquipCode1() :void {
    this.searchEquipCode1Value = '';
    this.ppsInp07ListFilter("EQUIP_CODE_1", this.searchEquipCode1Value);
  }

  // 資料過濾---站別機台關聯表 --> 設備名
  searchByEquipName() :void {
    this.ppsInp07ListFilter("EQUIP_NAME", this.searchEquipNameValue);
  }
  resetByEquipName() :void {
    this.searchEquipNameValue = '';
    this.ppsInp07ListFilter("EQUIP_NAME", this.searchEquipNameValue);
  }

   // 資料過濾---站別機台關聯表 --> 機台群組
   searchByEquipGroup() : void {
    this.ppsInp07ListFilter("EQUIP_GROUP", this.searchEquipGroupValue);
  }
  resetByEquipGroup() : void {
    this.searchEquipGroupValue = '';
    this.ppsInp07ListFilter("EQUIP_GROUP", this.searchEquipGroupValue);
  }

  // 資料過濾---站別機台關聯表 --> 有效碼
  searchByValid() : void {
    this.ppsInp07ListFilter("VALID", this.searchValidValue);
  }
  resetByValid() : void {
    this.searchValidValue = '';
    this.ppsInp07ListFilter("VALID", this.searchValidValue);
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
    
          this.importExcel(this.importdata);
          
        }
        fileReader.readAsArrayBuffer(this.file);
      }
    }


    importExcel(_data) {
      console.log("EXCEL 資料上傳檢核開始");
      var upload_data = [];
      for(let i=0 ; i < _data.length ; i++) {
        if (_data[i]['工廠別'] === undefined) {
          this.errorMSG('第'+ (i+1) +'筆檔案內容錯誤', '「工廠別」不可為空');
          this.clearFile();
            return;
        } else if (_data[i]['站別代碼'] === undefined) {
          this.errorMSG('第'+ (i+1) +'筆檔案內容錯誤', '「站別代碼」不可為空');
          this.clearFile();
            return;
        } else if (_data[i]['機台']  === undefined) {
          this.errorMSG('第'+ (i+1) +'筆檔案內容錯誤', '「機台」不可為空');
          this.clearFile();
            return;
        } else if (_data[i]['有效碼']  === undefined) {
          this.errorMSG('第'+ (i+1) +'筆檔案內容錯誤', '「有效碼」不可為空');
          this.clearFile();
            return;
        }
        
        let allData = JSON.stringify(_data[i]);
        this.importdata_repeat.push(allData);

        if(_data[i]['機台名稱'] == undefined)
          _data[i]['機台名稱'] = '';
        if(_data[i]['機台群組'] == undefined)
          _data[i]['機台群組'] = '';
        if(_data[i]['機台'] == undefined)
          _data[i]['機台'] = '';

          upload_data.push({            
            PLANT_CODE: 'YS',
            PLANT: _data[i]['工廠別'],
            SHOP_CODE: _data[i]['站別代碼'],
            SHOP_NAME: _data[i]['站別名稱'],
            EQUIP_CODE: _data[i]['機台'] ,
            EQUIP_NAME: _data[i]['機台名稱'],
            EQUIP_GROUP: _data[i]['機台群組'],
            VALID: _data[i]['有效碼'],
            BALANCE_RULE: null,
            ORDER_SEQ: null,
            WT_TYPE: null,
            DATETIME : moment().format('YYYY-MM-DD HH:mm:ss'),
            USERNAME : this.USERNAME,
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
          console.log("importExcelPPSI102");
          if(res[0].MSG === "Y") {
            this.loading = false;
            this.LoadingPage = false;
            this.sucessMSG("EXCCEL上傳成功", "");
            this.clearFile();
            this.getPPSINP07List()
            
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
    }

    convertToExcel() {
      console.log("convertToExcel");
      let ID_List = [];
      let arr = [];
      console.log(JSON.stringify(this.displayPPSINP07List[1]));
      let fileName = `站別機台關聯表_直棒`;
      for(let i=0 ; i < this.displayPPSINP07List.length ; i++){
        var ppsIn107 = {
          PLANT : this.displayPPSINP07List[i].PLANT,
          SHOP_CODE: this.displayPPSINP07List[i].SHOP_CODE,
          SHOP_NAME : this.displayPPSINP07List[i].SHOP_NAME,
          EQUIP_CODE_1 : this.displayPPSINP07List[i].EQUIP_CODE_1,
          EQUIP_NAME : this.displayPPSINP07List[i].EQUIP_NAME,
          EQUIP_GROUP : this.displayPPSINP07List[i].EQUIP_GROUP,
          VALID : this.displayPPSINP07List[i].VALID
        }

        arr.push(ppsIn107);
      }

      console.log(arr);
      this.excelService.exportAsExcelFile(arr, fileName, this.titleArray);
    }
}
