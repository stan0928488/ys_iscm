import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";


interface ItemData14 {
  id: string;
  ID: number;
  PLANT_CODE: string;
  SCH_SHOP_CODE: string;
  EQUIP_GROUP: string;
  YIELD_TYPE: string;
  YIELD_VALUE: number;
  DATE_CREATE: string;
  USER_CREATE: string;
  DATE_UPDATE: string;
  USER_UPDATE: string;
}

@Component({
  selector: "app-PPSI109",
  templateUrl: "./PPSI109.component.html",
  styleUrls: ["./PPSI109.component.scss"],
  providers:[NzMessageService]
})
export class PPSI109Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 產率設定欄位查詢關鍵字
  searchSchShopCodeValue = '';
  searchEquipGroup3Value = '';
  searchYieldTypeValue = '';
  searchYieldValueValue = '';


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
    this.gettbppsm102List();
  }
  
  
  tbppsm012List_tmp;
  tbppsm012List: ItemData14[] = [];
  displayTbppsm012List : ItemData14[] = [];
  editCache14: { [key: string]: { edit: boolean; data: ItemData14 } } = {};
  showYieldValue = false;
  editColse14 = false;
  gettbppsm102List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.gettbppsm102List().subscribe(res => {
      console.log("gettbppsm102List success");
      this.tbppsm012List_tmp = res;

      const data = [];
      for (let i = 0; i < this.tbppsm012List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          ID: this.tbppsm012List_tmp[i].ID,
          PLANT_CODE: this.tbppsm012List_tmp[i].PLANT_CODE,
          EQUIP_GROUP: this.tbppsm012List_tmp[i].EQUIP_GROUP,
          SCH_SHOP_CODE: this.tbppsm012List_tmp[i].SCH_SHOP_CODE,
          YIELD_TYPE: this.tbppsm012List_tmp[i].YIELD_TYPE,
          YIELD_VALUE: this.tbppsm012List_tmp[i].YIELD_VALUE
        });
      }
      this.tbppsm012List = data;
      this.displayTbppsm012List = this.tbppsm012List;
      this.updateEditCache();
      console.log(this.tbppsm012List);
      myObj.loading = false;
    });
  }



  // update
  editRow(id: string): void {
    if(this.editColse14) {
      this.errorMSG("錯誤", "尚有資料未完成修改，請先存檔或取消");
    } else {
      this.editCache14[id].edit = true;
      this.editColse14 = true;
      if(this.editCache14[id].data.YIELD_TYPE === '定值') {
        this.showYieldValue = false;
      } else {
        this.showYieldValue = true;
      }
    }
  }


  // cancel
  cancelEdit(id: string): void {
    const index = this.tbppsm012List.findIndex(item => item.id === id);
    this.editCache14[id] = {
      data: { ...this.tbppsm012List[index] },
      edit: false
    };
    this.editColse14 = false;
  }


  // update Save
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache14[id].data.SCH_SHOP_CODE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.editCache14[id].data.EQUIP_GROUP === undefined) {
      myObj.message.create("error", "「機群」不可為空");
      return;
    } else if (this.editCache14[id].data.YIELD_TYPE === undefined) {
      myObj.message.create("error", "「設定類型」不可為空");
      return;
    } else if (this.editCache14[id].data.YIELD_VALUE === undefined) {
      myObj.message.create("error", "「設定值」不可為空");
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
    this.tbppsm012List.forEach(item => {
      this.editCache14[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }



  // 修改資料
  updateSave(_id) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID : this.editCache14[_id].data.ID,
        SCH_SHOP_CODE : this.editCache14[_id].data.SCH_SHOP_CODE,
        EQUIP_GROUP : this.editCache14[_id].data.EQUIP_GROUP,
        YIELD_TYPE : this.editCache14[_id].data.YIELD_TYPE,
        YIELD_VALUE : this.editCache14[_id].data.YIELD_VALUE,
        USERNAME : this.USERNAME,
        PLANT_CODE : this.PLANT_CODE,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })
      myObj.PPSService.updateI101Tab14Save(obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.sucessMSG("修改成功", ``);

          const index = this.tbppsm012List.findIndex(item => item.id === _id);
          Object.assign(this.tbppsm012List[index], this.editCache14[_id].data);
          this.editCache14[_id].edit = false;
          this.editColse14 = false;
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
  
  
  // tab 14 編輯下拉產率設定類型
  changeYieldType(idx, _event) {
    if(_event === '定值') {
      this.showYieldValue = false;
    } else {
      this.showYieldValue = true;
      this.editCache14[idx].data.YIELD_VALUE = 0;
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


// ============= 過濾資料之menu ========================
   // 14.(資料過濾)產率設定
   tbppsm012ListFilter(property:string, keyWord:string) : void {

    if(_.isEmpty(keyWord)){
      this.displayTbppsm012List = this.tbppsm012List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.tbppsm012List.filter(item => filterFunc(item));
    this.displayTbppsm012List = data;
  }

  // 資料過濾---產率設定 --> 站別
  searchBySchShopCode() : void {
    this.tbppsm012ListFilter("SCH_SHOP_CODE", this.searchSchShopCodeValue);
  } 
  resetBySchShopCode() : void {
    this.searchSchShopCodeValue = '';
    this.tbppsm012ListFilter("SCH_SHOP_CODE", this.searchSchShopCodeValue);
  }

  // 資料過濾---產率設定 --> 機群 
  searchByEquipGroup3() : void {
    this.tbppsm012ListFilter("EQUIP_GROUP", this.searchEquipGroup3Value);
  } 
  resetByEquipGroup3() : void {
    this.searchEquipGroup3Value = '';
    this.tbppsm012ListFilter("EQUIP_GROUP", this.searchEquipGroup3Value);
  }

  // 資料過濾---產率設定 --> 設定類型
  searchByYieldType() : void {
    this.tbppsm012ListFilter("YIELD_TYPE", this.searchYieldTypeValue);
  } 
  resetByYieldType() : void {
    this.searchYieldTypeValue = '';
    this.tbppsm012ListFilter("YIELD_TYPE", this.searchYieldTypeValue);
  }

  // 資料過濾---產率設定 --> 設定值
  searchByYieldValue() : void {
    this.tbppsm012ListFilter("YIELD_VALUE", this.searchYieldValueValue);
  } 
  resetByYieldValue() : void {
    this.searchYieldValueValue = '';
    this.tbppsm012ListFilter("YIELD_VALUE", this.searchYieldValueValue);
  }



}
