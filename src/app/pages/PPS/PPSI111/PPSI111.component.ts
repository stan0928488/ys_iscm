import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";

import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";


interface ItemData1 {
  id: string;
  tab1ID: number;
  SCH_SHOP_CODE_1: string;
  MACHINE: string;
  COLUMN_COMMENT: string;
  COLUMN_NAME: string;
}


@Component({
  selector: "app-PPSI111",
  templateUrl: "./PPSI111.component.html",
  styleUrls: ["./PPSI111.component.scss"],
  providers:[NzMessageService]
})
export class PPSI111Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  // tab 1
  FCPTB26List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  FCPTB26List: ItemData1[] = [];
  panels = [
    {
      active: false,
      name: '批次新增資料區',
      disabled: false
    }
  ];
  COLUMN_NAME;
  SHOP_CODEList;           // 站別清單
  SHOP_splitList;          // 站別清單 (分群)
  PickShopCode = [];       // 已挑選站別
  EQUIP_CODEList;          // 機台別清單
  EQUIP_splitList;         // 機台別清單 (分群)
  PickEquipCode = [];      // 已挑選機台別
  shopCodeAndEquipCodeList = [];  //已選擇站台幾台數據重組
  COLUMN_NAMEList;
  ShopList;   // UPDATE
  pickerShopList; //tmp
  MachineList;  // UPDATE
  pickerMachineList; //tmp
  
  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["id","tab1ID","站號","機台","combin條件"];
  importdata_repeat = [];

  constructor(
    private PPSService: PPSService,
    private getPPSService: PPSService,
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
    this.getRunFCPCount();
    this.getFCPTB26List();
    this.getSHOP_CODEList();
  }
  

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe(res => {
      console.log("getRunFCPCount success");
      if(res > 0) this.isRunFCP = true;

    });
  }

  
  getFCPTB26List() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getFCPTB26List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.FCPTB26List_tmp = res;

      const data = [];
      for (let i = 0; i < this.FCPTB26List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.FCPTB26List_tmp[i].ID,
          SCH_SHOP_CODE_1: this.FCPTB26List_tmp[i].SCH_SHOP_CODE_1,
          MACHINE: this.FCPTB26List_tmp[i].MACHINE,
          COLUMN_COMMENT: this.FCPTB26List_tmp[i].COLUMN_COMMENT,
          COLUMN_NAME: this.FCPTB26List_tmp[i].COLUMN_NAME
        });
      }
      this.FCPTB26List = data;
      this.updateEditCache();
      console.log(this.FCPTB26List);
      myObj.loading = false;
    });
  }


  //Get Data
  //站別
  getSHOP_CODEList() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getPickerShopEQUIP('1', '　').subscribe(res => {
      console.log("SHOP_CODEList success");
      this.SHOP_CODEList = res;
      console.log(this.SHOP_CODEList);

      var newres = [];
      for(let i=0 ; i < this.SHOP_CODEList.length ; i++) {
        newres.push(this.SHOP_CODEList[i].SHOP_CODE);
      }
      this.SHOP_splitList =  _.chunk(newres, 5);    // list 6組 一分群
      myObj.loading = false;
    });
  }
  //機台別
  getEQUIP_CODEList(_ShopArr) {
    if (_ShopArr.toString() !== "") {
      this.loading = true;
      let myObj = this;
      this.getPPSService.getPickerShopEQUIP('2', _ShopArr.toString()).subscribe(res => {
        console.log("EQUIP_CODEList success");
        this.EQUIP_CODEList = res;
        console.log(this.EQUIP_CODEList);
        var newres = [];
        for(let i=0 ; i < this.EQUIP_CODEList.length ; i++) {
          newres.push({SHOP_CODE: this.EQUIP_CODEList[i].SHOP_CODE, value: this.EQUIP_CODEList[i].EQUIP_CODE, checked :false});
        }
        if(this.PickEquipCode.length > 0) {
          for (let j=0; j< newres.length; j++) {    // 判斷目前機台及已挑選機台
            for(let k=0 ; k< this.PickEquipCode.length; k++) {
              if(newres[j].value === this.PickEquipCode[k].value) {
                newres[j].checked = true;
              }
            }
          }
          this.EQUIP_splitList =  _.chunk(newres, 5);    // list 6組 一分群
        } else {
          this.EQUIP_splitList =  _.chunk(newres, 5);    // list 6組 一分群
        }
        myObj.loading = false;
      });
    } else {
      this.EQUIP_splitList = [];
    }
  }
  // combine條件
  getRequierList(): void {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getOrignListData().subscribe(res => {
      console.log("getOrignListData success");
      this.COLUMN_NAMEList = res;

      let result:any = res ;
      this.COLUMN_NAMEList = []
      let optionListTemp = [] ;
      for(let item of result) {
        let temp = { label: item.column_comment, value:item.column_name } ;
        optionListTemp.push(temp);
      }
      this.COLUMN_NAMEList = optionListTemp ;
      myObj.loading = false;
    });
  }
  // 點擊站別控制項
  clickShopCode(_value) {
    console.log("clickShopCode ")
    if(_value == '' || _value == undefined) {
      this.PickShopCode = [];
      this.PickEquipCode = [];
    } else {
      this.PickShopCode = _value.toString().split(',');
      let shopCodeTemp = this.PickShopCode ;
      let pickEquipCodeListTemp = this.PickEquipCode ;
      let newEquip = [] ;
      shopCodeTemp.forEach((val,index,array)=>{
        for(let i of pickEquipCodeListTemp){
          if(val === i.SHOP_CODE) {
            newEquip.push({SHOP_CODE:val, value:i.value, checked:true}) ;
          }
        }
      })
      this.PickEquipCode = [...newEquip];
    }
    this.getEQUIP_CODEList(this.PickShopCode);

    if (this.PickShopCode.length > 0 && this.PickEquipCode.length > 0) {
      const queryEquip = [];
      for(let i = 0; i <this.PickEquipCode.length; i++) {
        queryEquip.push(this.PickEquipCode[i].value);
      }
      // this.getCalendarList("1911-01", this.PickShopCode, queryEquip);
    } else if (this.PickShopCode.length > 0 && this.PickEquipCode.length < 1) {
      // this.getCalendarList("1911-01", this.PickShopCode, "　");
    } else {
      // this.getCalendarList("1911-01", "　", "　");
    }
  }
  // 點擊機台別控制項
  clickEquipCode(_value) {
    console.log("clickEquipCode ")
    var pickEquipCodeTemp = _value.toString().split(',') ;
    this.PickEquipCode = [] ;
    for(let itemTemp of pickEquipCodeTemp){
      this.EQUIP_splitList.forEach((item1,index,arry)=>{
        item1.forEach((item2,index,arry)=>{
          if(item2.value === itemTemp){
            item2.checked = true
            this.PickEquipCode.push(item2);
            console.log("機台數據 :" + JSON.stringify(this.PickEquipCode))
          }
        })
      })
    }

    if (this.PickEquipCode.length > 0) {
      const queryEquip = [];
      for(let i = 0; i <this.PickEquipCode.length; i++) {
        queryEquip.push(this.PickEquipCode[i].value);
      }
      // this.getCalendarList("1911-01", this.PickShopCode, queryEquip);
    } else {
      // this.getCalendarList("1911-01", this.PickShopCode, "　");
    }

    // console.log(this.PickEquipCode)
  }

  // 站別
  getPickerShopData(_idx) {
    console.log(_idx)
    this.loading = true;
    let myObj = this;
    this.getPPSService.getPickerShopData().subscribe(res => {
      console.log("getPickerShopData success");
      this.pickerShopList = res;
      const SchShopCode = [];
      this.editCache1[_idx].data.MACHINE = '';
      for(let i = 0 ; i<this.pickerShopList.length ; i++) {
        SchShopCode.push(this.pickerShopList[i].SCH_SHOP_CODE);
      }
      var newSchShopCode = SchShopCode.filter(function(element, index, arr){    // 排除重複資料
        return arr.indexOf(element) === index;
      });

      this.ShopList = newSchShopCode;
      myObj.loading = false;
    });
  }
  // 撈取 sorting 表中的機台 by 站別
  getPickerMachineData(_shop, _idx) {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getPickerMachineData(_shop).subscribe(res => {
      console.log("getPickerMachineData success");
      this.pickerMachineList = res;
      const machine = [];
      for(let i = 0 ; i<this.pickerMachineList.length ; i++) {
        machine.push(this.pickerMachineList[i].MACHINE);
      }
      var newMachine = machine.filter(function(element, index, arr){    // 排除重複資料
        return arr.indexOf(element) === index;
      });
      this.MachineList = newMachine;
      myObj.loading = false;
    });
  }

  //處理機台選擇
  //希望提交的數據 {站別： '',幾台 : '' , sortData : [{}]}
  formatEQUIPPickList(){
    this.PickEquipCode = [] ;
    for(let item of this.EQUIP_splitList){
      for(let i of item){
        if(i.checked) this.PickEquipCode.push(i)
      }
    }
    //console.log("選擇組：" + JSON.stringify(this.PickEquipCodeList) ) ;
    this.formatPickShopCode() ;
  }
  // 處理站別選擇
  formatPickShopCode(){
    this.shopCodeAndEquipCodeList  = [] ;
    let shopAndEquip = [] ;
    let shopCodeTemp = this.PickShopCode ;
    let pickEquipCodeListTemp = this.PickEquipCode ;
    shopCodeTemp.forEach((val,index,array)=>{
      let containFg = false ;
      for(let i of pickEquipCodeListTemp){
        if(index === 0){
          shopAndEquip.push({shopCode:i.SHOP_CODE,equipCode:i.value}) ;
        }
        if(val === i.SHOP_CODE){
          console.log("val === i.shopCode : "+ val)
          containFg = true ;
        }
      }
      if(!containFg) shopAndEquip.push({shopCode:val,equipCode:''}) ;
    })
    // console.log("最後重組站別機台數據： " + JSON.stringify(shopAndEquip))
    this.shopCodeAndEquipCodeList = shopAndEquip ;
  }



  insertTab() {
    let myObj = this;
    if (this.COLUMN_NAME === undefined) {
      myObj.message.create("error", "「combin條件」不可為空");
      return;
    } else if (this.PickShopCode.length === 0) {
      myObj.message.create("error", "「站別」不可為空");
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
  editRow(id: string): void {
    this.editCache1[id].edit = true;
    this.getRequierList();
    this.getPickerShopData(id);
    this.getPickerMachineData(this.editCache1[id].data.SCH_SHOP_CODE_1, id);
  }
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
  cancelEdit(id: string): void {
    const index = this.FCPTB26List.findIndex(item => item.id === id);
    this.editCache1[id] = {
      data: { ...this.FCPTB26List[index] },
      edit: false
    };
  }
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache1[id].data.SCH_SHOP_CODE_1 === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.editCache1[id].data.COLUMN_COMMENT === undefined) {
      myObj.message.create("error", "「combin條件」不可為空");
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
  updateEditCache(): void {
    this.FCPTB26List.forEach(item => {
      this.editCache1[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  
  // 新增資料
  insertSave() {
    let myObj = this;
    this.LoadingPage = true;
    //重组站別跟機台數據
    this.formatEQUIPPickList() ;
    // console.log("最後重組站別幾台數據： " + JSON.stringify(this.shopCodeAndEquipCodeList))

    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        shopCodeEquip : this.shopCodeAndEquipCodeList,
        COLUMN_NAME : this.COLUMN_NAME,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })

      myObj.getPPSService.insertTab1Save(obj).subscribe(res => {

        console.log(res)
        if(res[0].MSG === "Y") {
          this.COLUMN_NAME = undefined;
          this.shopCodeAndEquipCodeList = [];
          this.PickShopCode = [];
          this.PickEquipCode = [];
          this.getSHOP_CODEList();
          this.getFCPTB26List();
          this.sucessMSG("新增成功", ``);
          this.panels[0].disabled = false;
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
        ID : this.editCache1[_id].data.tab1ID,
        SCH_SHOP_CODE : this.editCache1[_id].data.SCH_SHOP_CODE_1,
        MACHINE : this.editCache1[_id].data.MACHINE,
        COLUMN_NAME : this.editCache1[_id].data.COLUMN_NAME,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })
      myObj.getPPSService.updateTab1Save(obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.COLUMN_NAME = undefined;
          this.PickShopCode = [];
          this.PickEquipCode = [];

          this.sucessMSG("修改成功", ``);

          const index = this.FCPTB26List.findIndex(item => item.id === _id);
          Object.assign(this.FCPTB26List[index], this.editCache1[_id].data);
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

  // 刪除資料
  delID(_id) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let _ID = this.editCache1[_id].data.tab1ID;
      myObj.getPPSService.delI200Data(_ID, 1).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.COLUMN_NAME = undefined;
          this.PickShopCode = [];
          this.PickEquipCode = [];

          this.sucessMSG("刪除成功", ``);
          this.getFCPTB26List();
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
      myObj.PPSService.importI102Excel(obj).subscribe(res => {
        console.log("importExcelPPSI105");
        if(res[0].MSG === "Y") { 
          

          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getFCPTB26List()
          
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
    this.getFCPTB26List();

  }

  convertToExcel() {
    console.log("convertToExcel");
    let ID_List = [];
    let arr = [];
    console.log(JSON.stringify(this.FCPTB26List[0]));
    let fileName = `非線速 - 直棒`;
    
    this.excelService.exportAsExcelFile(this.FCPTB26List, fileName, this.titleArray);
  }
}
