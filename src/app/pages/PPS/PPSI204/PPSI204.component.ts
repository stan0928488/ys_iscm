import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"

import * as moment from 'moment';
import * as _ from "lodash";


interface ItemData1 {
  id: string;
  tab1ID: number;
  SCH_SHOP_CODE_1: string;
  MACHINE: string;
  COLUMN_COMMENT: string;
  COLUMN_NAME: string;
}


@Component({
  selector: "app-PPSI204",
  templateUrl: "./PPSI204.component.html",
  styleUrls: ["./PPSI204.component.scss"],
  providers:[NzMessageService]
})
export class PPSI204Component implements AfterViewInit {
  LoadingPage = false;
  isVisibleDIA = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;

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
  // i = 1;
  // editId: string | null = null;

  // tab 3
  FCPTB28List;



  constructor(
    private getPPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");

  }


  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getRunFCPCount();

    this.getSHOP_CODEList();
    this.getFCPTB26List();

  }



  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe(res => {
      console.log("getRunFCPCount success");
      if(res > 0) this.isRunFCP = true;

    });
  }


  //tab1
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
      this.updateEditCache(1);
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



  insertTab1() {
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
          this.insertSave(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  editRow(id: string, _type): void {
    if(_type === 1) {
      this.editCache1[id].edit = true;
      this.getPickerShopData(id);
      this.getPickerMachineData(this.editCache1[id].data.SCH_SHOP_CODE_1, id);
    }
  }
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
  cancelEdit(id: string, _type): void {
    if(_type === 1) {
      const index = this.FCPTB26List.findIndex(item => item.id === id);
      this.editCache1[id] = {
        data: { ...this.FCPTB26List[index] },
        edit: false
      };
    }

  }
  saveEdit(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache1[id])

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
            this.updateSave(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  updateEditCache(_type): void {
    if(_type === 1) {
      this.FCPTB26List.forEach(item => {
        this.editCache1[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }

  }

  popupTab1() {
    this.isVisibleDIA = true;
  }
  diaCancel() {
    this.isVisibleDIA = false;
  }
  diaOK() {
    this.isVisibleDIA = true;
  }



  changeTab(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      this.getSHOP_CODEList();
      this.getFCPTB26List();
    }

  }


  // 新增資料
  insertSave(_type) {
    if(_type === 1) {
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
  }

  // 刪除資料
  delID(_id, _type) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let _ID = this.editCache1[_id].data.tab1ID;
      myObj.getPPSService.delI200Data(_ID, _type).subscribe(res => {
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




}
