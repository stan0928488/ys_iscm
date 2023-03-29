import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";


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
  selector: "app-PPSI108_NonBar",
  templateUrl: "./PPSI108_NonBar.component.html",
  styleUrls: ["./PPSI108_NonBar.component.scss"],
  providers:[NzMessageService]
})
export class PPSI108_NonBarComponent implements AfterViewInit {
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
    this.getPPSINP08List();
  }
  
  PPSINP08List_tmp;
  PPSINP08List: ItemData8[] = [];
  editCache8: { [key: string]: { edit: boolean; data: ItemData8 } } = {};
  displayPPSINP08List : ItemData8[] = [];
  getPPSINP08List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP08List().subscribe(res => {
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

      myObj.PPSService.insertI108Tab1Save(obj).subscribe(res => {

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
      myObj.PPSService.updateI108Tab1Save(obj).subscribe(res => {
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
      myObj.PPSService.delI108Tab1Data(_ID).subscribe(res => {
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


}
