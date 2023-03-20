import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import * as _ from "lodash";



interface ItemData9 {
  id: string;
  tab9ID: number;
  PLANT_CODE:string;
  SHOP_CODE:string;
  EQUIP_CODE: string;
  OP_CODE:string;
  OP_CODE1:string;
  OP_CODE2:string;
  OP_CODE3:string;
  TEMPERATURE: number;
  FREQUENCY: number;
  STEEL_GRADE_MIN: number;
  HEAT_MIN: number;
  ALTERNATE_SET:string;
}

@Component({
  selector: "app-PPSI120",
  templateUrl: "./PPSI120.component.html",
  styleUrls: ["./PPSI120.component.scss"],
  providers:[NzMessageService]
})
export class PPSI120Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 退火爐工時
  tab9ID;
  SHOP_CODE;
  EQUIP_CODE
  OP_CODE;
  OP_CODE1 = "";
  OP_CODE2 = "";
  OP_CODE3 = "";
  TEMPERATURE;
  FREQUENCY;
  STEEL_GRADE_MIN;
  HEAT_MIN;
  ALTERNATE_SET = "";
  isVisibleStove = false;
  searchShopCodeValue = '';
  searchEquipCodeValue = '';
  searchOpCodeValue = '';
  searchOpCode1Value = '';
  searchOpCode2Value = '';
  searchOpCode3Value = '';
  searchTemperatureValue = '';
  searchFrequencyValue = '';
  searchSteelGradeMinValue = '';
  searchHeatMinValue = '';
  searchAlternateSetValue = '';


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
    this.getPPSINP09List();
  }
  
 
  PPSINP09List_tmp;
  PPSINP09List: ItemData9[] = [];
  editCache9: { [key: string]: { edit: boolean; data: ItemData9 } } = {};
  displayPPSINP09List : ItemData9[] = [];
  //tab9_select 
  getPPSINP09List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP09List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP09List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP09List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab9ID: this.PPSINP09List_tmp[i].ID,
          PLANT_CODE: this.PPSINP09List_tmp[i].PLANT_CODE,
          SHOP_CODE: this.PPSINP09List_tmp[i].SHOP_CODE,
          EQUIP_CODE: this.PPSINP09List_tmp[i].EQUIP_CODE,
          OP_CODE: this.PPSINP09List_tmp[i].OP_CODE,
          OP_CODE1: this.PPSINP09List_tmp[i].OP_CODE1,
          OP_CODE2: this.PPSINP09List_tmp[i].OP_CODE2,
          OP_CODE3: this.PPSINP09List_tmp[i].OP_CODE3,
          TEMPERATURE: this.PPSINP09List_tmp[i].TEMPERATURE,
          FREQUENCY: this.PPSINP09List_tmp[i].FREQUENCY,
          STEEL_GRADE_MIN: this.PPSINP09List_tmp[i].STEEL_GRADE_MIN,
          HEAT_MIN: this.PPSINP09List_tmp[i].HEAT_MIN,
          ALTERNATE_SET: this.PPSINP09List_tmp[i].ALTERNATE_SET
        });
      }
      this.PPSINP09List = data;
      this.displayPPSINP09List = this.PPSINP09List;
      this.updateEditCache();
      myObj.loading = false;
    });
  }

  // insert
  insertTab() {
    let myObj = this;
    if (this.SHOP_CODE === undefined) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.OP_CODE === undefined) {
      myObj.message.create("error", "「作業代碼」不可為空");
      return;
    } else if (this.TEMPERATURE === undefined) {
      myObj.message.create("error", "「溫度」不可為空");
      return;
    } else if (this.FREQUENCY === undefined) {
      myObj.message.create("error", "「頻率」不可為空");
      return;
    } else if (this.STEEL_GRADE_MIN === undefined) {
      myObj.message.create("error", "「每噸花時間」不可為空");
      return;
    } else if (this.HEAT_MIN === undefined) {
      myObj.message.create("error", "「每爐工時」不可為空");
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


  // update
  editRow(id: string): void {
    this.editCache9[id].edit = true;
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
    const index = this.PPSINP09List.findIndex(item => item.id === id);
    this.editCache9[id] = {
      data: { ...this.PPSINP09List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache9[id].data.SHOP_CODE === undefined) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.editCache9[id].data.EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.editCache9[id].data.OP_CODE === undefined) {
      myObj.message.create("error", "「作業代碼」不可為空");
      return;
    } else if (this.editCache9[id].data.TEMPERATURE === undefined) {
      myObj.message.create("error", "「溫度」不可為空");
      return;
    } else if (this.editCache9[id].data.FREQUENCY === undefined) {
      myObj.message.create("error", "「頻率」不可為空");
      return;
    } else if (this.editCache9[id].data.STEEL_GRADE_MIN === undefined) {
      myObj.message.create("error", "「每噸花時間」不可為空");
      return;
    } else if (this.editCache9[id].data.HEAT_MIN === undefined) {
      myObj.message.create("error", "「每爐工時」不可為空");
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
    this.PPSINP09List.forEach(item => {
      this.editCache9[item.id] = {
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
        SHOP_CODE : this.SHOP_CODE,
        EQUIP_CODE : this.EQUIP_CODE,
        OP_CODE : this.OP_CODE,
        OP_CODE1 : this.OP_CODE1,
        OP_CODE2 : this.OP_CODE2,
        OP_CODE3 : this.OP_CODE3,
        TEMPERATURE : this.TEMPERATURE,
        FREQUENCY : this.FREQUENCY,
        STEEL_GRADE_MIN : this.STEEL_GRADE_MIN,
        HEAT_MIN : this.HEAT_MIN,
        ALTERNATE_SET : this.ALTERNATE_SET
      })

      myObj.PPSService.insertI109Tab1Save(obj).subscribe(res => {

        console.log(res)
        if(res[0].MSG === "Y") {
          this.SHOP_CODE = undefined;
          this.EQUIP_CODE = undefined;
          this.OP_CODE = undefined;
          this.OP_CODE1 = undefined;
          this.OP_CODE2 = undefined;
          this.OP_CODE3 = undefined;
          this.TEMPERATURE = undefined;
          this.FREQUENCY = undefined;
          this.STEEL_GRADE_MIN = undefined;
          this.HEAT_MIN = undefined;
          this.ALTERNATE_SET = undefined;
          this.getPPSINP09List();
          this.sucessMSG("新增成功", ``);
          this.isVisibleStove = false;
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
        ID : this.editCache9[_id].data.tab9ID,
        PLANT_CODE : this.editCache9[_id].data.PLANT_CODE,
        SHOP_CODE : this.editCache9[_id].data.SHOP_CODE,
        EQUIP_CODE : this.editCache9[_id].data.EQUIP_CODE,
        OP_CODE : this.editCache9[_id].data.OP_CODE,
        OP_CODE1 : this.editCache9[_id].data.OP_CODE1,
        OP_CODE2 : this.editCache9[_id].data.OP_CODE2,
        OP_CODE3 : this.editCache9[_id].data.OP_CODE3,
        TEMPERATURE : this.editCache9[_id].data.TEMPERATURE,
        FREQUENCY : this.editCache9[_id].data.FREQUENCY,
        STEEL_GRADE_MIN : this.editCache9[_id].data.STEEL_GRADE_MIN,
        HEAT_MIN : this.editCache9[_id].data.HEAT_MIN,
        ALTERNATE_SET : this.editCache9[_id].data.ALTERNATE_SET
      })
      myObj.PPSService.updateI109Tab1Save(obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.PLANT_CODE = undefined;
          this.SHOP_CODE = undefined;
          this.EQUIP_CODE = undefined;
          this.OP_CODE = undefined;
          this.OP_CODE1 = undefined;
          this.OP_CODE2 = undefined;
          this.OP_CODE3 = undefined;
          this.TEMPERATURE = undefined;
          this.FREQUENCY = undefined;
          this.STEEL_GRADE_MIN = undefined;
          this.HEAT_MIN = undefined;
          this.ALTERNATE_SET = undefined;

          this.sucessMSG("修改成功", ``);
          const index = this.PPSINP09List.findIndex(item => item.id === _id);
          Object.assign(this.PPSINP09List[index], this.editCache9[_id].data);
          this.editCache9[_id].edit = false;
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
      let _ID = this.editCache9[_id].data.tab9ID;
      myObj.PPSService.delI109Tab1Data(_ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.sucessMSG("刪除成功", ``);
          this.getPPSINP09List();
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
  // 新增退火爐工時之彈出視窗 
  openStoveInput() : void {
    this.isVisibleStove = true;
  }
  // 取消退火爐工時之彈出視窗 
  cancelStoveInput() : void{
    this.isVisibleStove = false;
  }


// ============= 過濾資料之menu ========================
  // 退火爐工時
  ppsInp09ListFilter(property:string, keyWord:string) {
    if(_.isEmpty(keyWord)){
      this.displayPPSINP09List = this.PPSINP09List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP09List.filter(item => filterFunc(item));
    this.displayPPSINP09List = data;
  }

  // 資料過濾---退火爐工時 --> 站號
  searchByShopCode() : void {
    this.ppsInp09ListFilter("SHOP_CODE", this.searchShopCodeValue);
  } 
  resetByShopCode() : void {
    this.searchShopCodeValue = '';
    this.ppsInp09ListFilter("SHOP_CODE", this.searchShopCodeValue);
  }

  // 資料過濾---退火爐工時 --> 機台
  searchByEquipCode() : void {
    this.ppsInp09ListFilter("EQUIP_CODE", this.searchEquipCodeValue);
  } 
  resetByEquipCode() : void {
    this.searchEquipCodeValue = '';
    this.ppsInp09ListFilter("EQUIP_CODE", this.searchEquipCodeValue);
  }

  // 資料過濾---退火爐工時 --> 作業代碼
  searchByOpCode() : void {
    this.ppsInp09ListFilter("OP_CODE", this.searchOpCodeValue);
  } 
  resetByOpCode() : void {
    this.searchOpCodeValue = '';
    this.ppsInp09ListFilter("OP_CODE", this.searchOpCodeValue);
  }

  // 資料過濾---退火爐工時 --> 作業代碼1
  searchByOpCode1() : void {
    this.ppsInp09ListFilter("OP_CODE1", this.searchOpCode1Value);
  } 
  resetByOpCode1() : void {
    this.searchOpCode1Value = '';
    this.ppsInp09ListFilter("OP_CODE1", this.searchOpCode1Value);
  }

  // 資料過濾---退火爐工時 --> 作業代碼2
  searchByOpCode2() : void {
    this.ppsInp09ListFilter("OP_CODE2", this.searchOpCode2Value);
  } 
  resetByOpCode2() : void {
    this.searchOpCode2Value = '';
    this.ppsInp09ListFilter("OP_CODE2", this.searchOpCode2Value);
  }

  // 資料過濾---退火爐工時 --> 作業代碼3
  searchByOpCode3() : void {
    this.ppsInp09ListFilter("OP_CODE3", this.searchOpCode3Value);
  } 
  resetByOpCode3() : void {
    this.searchOpCode3Value = '';
    this.ppsInp09ListFilter("OP_CODE3", this.searchOpCode3Value);
  }

  // 資料過濾---退火爐工時 --> 溫度
  searchByTemperature() : void {
    this.ppsInp09ListFilter("TEMPERATURE", this.searchTemperatureValue);
  } 
  resetByTemperature() : void {
    this.searchTemperatureValue = '';
    this.ppsInp09ListFilter("TEMPERATURE", this.searchTemperatureValue);
  }

  // 資料過濾---退火爐工時 --> 頻率
  searchByFrequency() : void {
    this.ppsInp09ListFilter("FREQUENCY", this.searchFrequencyValue);
  } 
  resetByFrequency() : void {
    this.searchFrequencyValue = '';
    this.ppsInp09ListFilter("FREQUENCY", this.searchFrequencyValue);
  }

  // 資料過濾---退火爐工時 --> 每噸花時間
  searchBySteelGradeMin() : void {
    this.ppsInp09ListFilter("STEEL_GRADE_MIN", this.searchSteelGradeMinValue);
  } 
  resetBySteelGradeMin() : void {
    this.searchSteelGradeMinValue = '';
    this.ppsInp09ListFilter("STEEL_GRADE_MIN", this.searchSteelGradeMinValue);
  }

  // 資料過濾---退火爐工時 --> 每爐工時
  searchByHeateMin() : void {
    this.ppsInp09ListFilter("HEAT_MIN", this.searchHeatMinValue);
  } 
  resetByHeateMin() : void {
    this.searchHeatMinValue = '';
    this.ppsInp09ListFilter("HEAT_MIN", this.searchHeatMinValue);
  }

  // 資料過濾---退火爐工時 --> 穿插設定
  searchByAlternateSet() : void {
    this.ppsInp09ListFilter("ALTERNATE_SET", this.searchAlternateSetValue);
  } 
  resetByAlternateSet() : void {
    this.searchAlternateSetValue = '';
    this.ppsInp09ListFilter("ALTERNATE_SET", this.searchAlternateSetValue);
  }


}
