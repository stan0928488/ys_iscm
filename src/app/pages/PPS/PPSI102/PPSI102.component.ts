import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as _ from "lodash";



interface ItemData7 {
  id: string;
  tab1ID: number;
  BALANCE_RULE: string;
  EQUIP_CODE_1: string;
  EQUIP_GROUP: string;
  EQUIP_NAME: string;
  ORDER_SEQ: string;
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
  PLANT;
  SHOP_CODE;
  SHOP_NAME;
  EQUIP_CODE_1;
  EQUIP_NAME;
  EQUIP_GROUP;
  VALID;
  isVisibleShop = false;
  searchPlantValue = '';
  searchShopCodeValue = '';
  searchShopNameValue = '';
  searchEquipCode1Value = '';
  searchEquipNameValue = '';
  searchEquipGroupValue = '';
  searchValidValue = '';


  constructor(
    private PPSService: PPSService,
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
    this.getPPSINP07List();
  }
  
  
  PPSINP07List_tmp;
  editCache7: { [key: string]: { edit: boolean; data: ItemData7 } } = {};
  PPSINP07List: ItemData7[] = [];
  displayPPSINP07List: ItemData7[] = [];
  getPPSINP07List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP07List().subscribe(res => {
      console.log("getPPSINP07List success");
      this.PPSINP07List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP07List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.PPSINP07List_tmp[i].ID,
          BALANCE_RULE: this.PPSINP07List_tmp[i].BALANCE_RULE,
          EQUIP_CODE_1: this.PPSINP07List_tmp[i].EQUIP_CODE,
          EQUIP_GROUP: this.PPSINP07List_tmp[i].EQUIP_GROUP,
          EQUIP_NAME: this.PPSINP07List_tmp[i].EQUIP_NAME,
          ORDER_SEQ: this.PPSINP07List_tmp[i].ORDER_SEQ,
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
    } else if (this.SHOP_NAME === undefined) {
      myObj.message.create("error", "「站別名」不可為空");
      return;
    } else if (this.EQUIP_CODE_1 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.EQUIP_NAME === undefined) {
      myObj.message.create("error", "「設備名」不可為空");
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
    } else if (this.editCache7[id].data.SHOP_NAME === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.editCache7[id].data.EQUIP_CODE_1 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.editCache7[id].data.EQUIP_NAME === undefined) {
      myObj.message.create("error", "「設備名」不可為空");
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
        BALANCE_RULE: "",
        PLANT : this.PLANT,
        SHOP_CODE : this.SHOP_CODE,
        SHOP_NAME : this.SHOP_NAME,
        EQUIP_CODE : this.EQUIP_CODE_1,
        EQUIP_NAME : this.EQUIP_NAME,
        EQUIP_GROUP: this.EQUIP_GROUP,
        VALID: this.VALID,
        ORDER_SEQ: "",
        // DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })

      myObj.PPSService.insertI107Tab1Save(obj).subscribe(res => {
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
        BALANCE_RULE: "",
        ORDER_SEQ: "",
        PLANT : this.editCache7[_id].data.PLANT,
        SHOP_CODE : this.editCache7[_id].data.SHOP_CODE,
        SHOP_NAME : this.editCache7[_id].data.SHOP_NAME,
        EQUIP_CODE : this.editCache7[_id].data.EQUIP_CODE_1,
        EQUIP_NAME : this.editCache7[_id].data.EQUIP_NAME,
        EQUIP_GROUP : this.editCache7[_id].data.EQUIP_GROUP,
        VALID : this.editCache7[_id].data.VALID,
        // DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })

      myObj.PPSService.updateI107Tab1Save(obj).subscribe(res => {
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
      myObj.PPSService.delI107Tab1Data(_ID).subscribe(res => {
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


}
