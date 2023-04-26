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
  PLANT_CODE: string;
  PLANT: string;
  SHOP_CODE: string;
  SHOP_NAME: string;
  EQUIP_CODE: string;
  EQUIP_NAME: string;
  EQUIP_GROUP: string;
  BALANCE_RULE: string;
  ORDER_SEQ: string;
  WT_TYPE: string;
  VALID: string;
  wtTypeName: string;
  validName: string;
}


@Component({
  selector: "app-PPSI102_NonBar",
  templateUrl: "./PPSI102_NonBar.component.html",
  styleUrls: ["./PPSI102_NonBar.component.scss"],
  providers:[NzMessageService]
})
export class PPSI102_NonBarComponent implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 站別機台關聯表
  PLANT = "精整";
  SHOP_CODE;
  SHOP_NAME;
  EQUIP_CODE;
  EQUIP_NAME;
  EQUIP_GROUP;
  WT_TYPE;
  VALID = "Y";
  isVisibleShop = false;
  searchPlantValue = '';
  searchShopCodeValue = '';
  searchShopNameValue = '';
  searchEquipCode1Value = '';
  searchEquipNameValue = '';
  searchEquipGroupValue = '';
  searchValidValue = '';
  searchWtTypeValue = '';

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["id","tab1ID","PLANT_CODE","工廠別","站別代碼","站別名稱","機台","設備名","機台群組","BALANCE_RULE","ORDER_SEQ","WT_TYPE","VALID","工時計算分類","有效碼"];
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
    this.PPSService.getPPSINP07List('2').subscribe(res => {
      console.log("getPPSINP07List success");
      this.PPSINP07List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP07List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.PPSINP07List_tmp[i].ID,
          PLANT_CODE: this.PPSINP07List_tmp[i].PLANT_CODE,
          PLANT: this.PPSINP07List_tmp[i].PLANT,
          SHOP_CODE: this.PPSINP07List_tmp[i].SHOP_CODE,
          SHOP_NAME: this.PPSINP07List_tmp[i].SHOP_NAME,
          EQUIP_CODE: this.PPSINP07List_tmp[i].EQUIP_CODE,
          EQUIP_NAME: this.PPSINP07List_tmp[i].EQUIP_NAME,
          EQUIP_GROUP: this.PPSINP07List_tmp[i].EQUIP_GROUP,
          BALANCE_RULE: this.PPSINP07List_tmp[i].BALANCE_RULE,
          ORDER_SEQ: this.PPSINP07List_tmp[i].ORDER_SEQ,
          WT_TYPE: this.PPSINP07List_tmp[i].WT_TYPE,
          VALID: this.PPSINP07List_tmp[i].VALID,
          wtTypeName: this.PPSINP07List_tmp[i].wtTypeName,
          validName: this.PPSINP07List_tmp[i].validName
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
    } else if (this.EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.VALID === undefined) {
      myObj.message.create("error", "「有效碼」不可為空");
      return;
    }else {
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
    } else if (this.editCache7[id].data.EQUIP_CODE === undefined) {
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
        SHOP_NAME : this.SHOP_NAME,
        EQUIP_CODE : this.EQUIP_CODE,
        EQUIP_NAME : this.EQUIP_NAME,
        EQUIP_GROUP: this.EQUIP_GROUP,
        VALID: this.VALID,
        WT_TYPE: this.WT_TYPE,
        BALANCE_RULE: "",
        ORDER_SEQ: ""
      })

      myObj.PPSService.insertI107Save('2', obj).subscribe(res => {
        console.log(res)
        if(res[0].MSG === "Y") {
          this.SHOP_CODE = undefined;
          this.SHOP_NAME = undefined;
          this.EQUIP_CODE = undefined;
          this.EQUIP_NAME = undefined;
          this.EQUIP_GROUP = undefined;
          this.VALID = undefined;
          this.WT_TYPE = undefined;
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

  wttypeChange(_id) {
    let newType = this.editCache7[_id].data.WT_TYPE;
    if(newType === '1') {
      this.editCache7[_id].data.wtTypeName = "線速";
    } else if(newType === '2') {
      this.editCache7[_id].data.wtTypeName = "非線速";
    } else {
      this.editCache7[_id].data.wtTypeName = "-";
    }
  }
  validChange(_id) {
    let newType = this.editCache7[_id].data.VALID;
    if(newType === 'Y') {
      this.editCache7[_id].data.validName = "有效";
    } else {
      this.editCache7[_id].data.validName = "無效";
    }
  }

  // 修改資料
  updateSave(_id) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID : this.editCache7[_id].data.tab1ID,
        PLANT_CODE : this.editCache7[_id].data.PLANT_CODE,
        PLANT : this.editCache7[_id].data.PLANT,
        SHOP_CODE : this.editCache7[_id].data.SHOP_CODE,
        SHOP_NAME : this.editCache7[_id].data.SHOP_NAME,
        EQUIP_CODE : this.editCache7[_id].data.EQUIP_CODE,
        EQUIP_NAME : this.editCache7[_id].data.EQUIP_NAME,
        EQUIP_GROUP : this.editCache7[_id].data.EQUIP_GROUP,
        VALID : this.editCache7[_id].data.VALID,
        WT_TYPE : this.editCache7[_id].data.WT_TYPE,
        BALANCE_RULE: "",
        ORDER_SEQ: ""
      })

      myObj.PPSService.updateI107Save('2', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SHOP_CODE = undefined;
          this.SHOP_NAME = undefined;
          this.EQUIP_CODE = undefined;
          this.EQUIP_NAME = undefined;
          this.EQUIP_GROUP = undefined;
          this.VALID = undefined;
          this.WT_TYPE = undefined;
          console.log(this.PPSINP07List)
          console.log(this.editCache7)

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
      myObj.PPSService.delI107Data('2', _ID).subscribe(res => {
        if(res[0].MSG === "Y") {
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
    this.ppsInp07ListFilter("EQUIP_CODE", this.searchEquipCode1Value);
  }
  resetByEquipCode1() :void {
    this.searchEquipCode1Value = '';
    this.ppsInp07ListFilter("EQUIP_CODE", this.searchEquipCode1Value);
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

  // 資料過濾---站別機台關聯表 --> 工時計算分類
  searchByWtType() : void {
    this.ppsInp07ListFilter("WT_TYPE", this.searchWtTypeValue);
  }
  resetByWtType() : void {
    this.searchWtTypeValue = '';
    this.ppsInp07ListFilter("WT_TYPE", this.searchWtTypeValue);
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
    this.getPPSINP07List();

  }

  convertToExcel() {
    console.log("convertToExcel");
    let ID_List = [];
    let arr = [];
    console.log(JSON.stringify(this.displayPPSINP07List[0]));
    let fileName = `站別機台關聯表-非直棒`;
    
    this.excelService.exportAsExcelFile(this.displayPPSINP07List, fileName, this.titleArray);
  }
}
