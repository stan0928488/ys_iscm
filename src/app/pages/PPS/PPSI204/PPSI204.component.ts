import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as _ from "lodash";



interface ItemData16 {
  id: string;
  tab1ID: number;
  SHOP_CODE_SCHE: string;
  CHOOSE_EQUIP_CODE: string;
  COMPAIGN_ID: string;
  PARAMETER_COL: string;
  PARAMETER_CONDITION: string;
  PARAMETER_NAME: string;
  TURN_DIA_MAX_MIN: string;
  TURN_DIA_MAX_MAX: string;
  SCHE_TYPE: string;
  DATA_DELIVERY_RANGE_MIN: string;
  DATA_DELIVERY_RANGE_MAX: string;
  START_TIME: string;
  END_TIME: string;
}

@Component({
  selector: "app-PPSI204",
  templateUrl: "./PPSI204.component.html",
  styleUrls: ["./PPSI204.component.scss"],
  providers:[NzMessageService]
})
export class PPSI204Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // Campaign限制
  SHOP_CODE_SCHE;
  CHOOSE_EQUIP_CODE;
  COMPAIGN_ID;
  PARAMETER_COL;
  PARAMETER_CONDITION;
  PARAMETER_NAME;
  TURN_DIA_MAX_MIN;
  TURN_DIA_MAX_MAX;
  SCHE_TYPE;
  DATA_DELIVERY_RANGE_MIN;
  DATA_DELIVERY_RANGE_MAX;
  START_TIME;
  END_TIME;
  DIA_MIN;
  isVisibleCampaign = false;
  searchShopCodeScheValue = '';
  searchChooseEquipCodeValue = '';
  searchCompaignIdValue = '';
  searchParameterColValue = '';
  searchParameterConditionValue = '';
  searchParameterNameValue = '';
  searchTurnDiaMaxMinValue = '';
  searchTurnDiaMaxMaxValue = '';
  searchScheTypeValue = '';
  searchDataDeliveryRangeMinValue = '';
  searchDataDeliveryRangeMaxValue = '';
  searchStartTimeValue = '';
  searchEndTimeValue = '';


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
    this.getPPSINP16List();
  }
  
  
  PPSINP16List_tmp;
  editCache16: { [key: string]: { edit: boolean; data: ItemData16 } } = {};
  PPSINP16List: ItemData16[] = [];
  displayPPSINP16List : ItemData16[] = [];
  getPPSINP16List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP16List().subscribe(res => {
      console.log("getPPSINP16List success");
      this.PPSINP16List_tmp = res;
      
      const data = [];
      for (let i = 0; i < this.PPSINP16List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.PPSINP16List_tmp[i].ID,
          SHOP_CODE_SCHE: this.PPSINP16List_tmp[i].SHOP_CODE_SCHE,
          CHOOSE_EQUIP_CODE: this.PPSINP16List_tmp[i].CHOOSE_EQUIP_CODE,
          COMPAIGN_ID: this.PPSINP16List_tmp[i].COMPAIGN_ID,
          PARAMETER_COL: this.PPSINP16List_tmp[i].PARAMETER_COL,
          PARAMETER_CONDITION: this.PPSINP16List_tmp[i].PARAMETER_CONDITION,
          PARAMETER_NAME: this.PPSINP16List_tmp[i].PARAMETER_NAME,
          TURN_DIA_MAX_MIN: this.PPSINP16List_tmp[i].TURN_DIA_MAX_MIN,
          TURN_DIA_MAX_MAX: this.PPSINP16List_tmp[i].TURN_DIA_MAX_MAX,
          SCHE_TYPE: this.PPSINP16List_tmp[i].SCHE_TYPE,
          DATA_DELIVERY_RANGE_MIN: this.PPSINP16List_tmp[i].DATA_DELIVERY_RANGE_MIN,
          DATA_DELIVERY_RANGE_MAX: this.PPSINP16List_tmp[i].DATA_DELIVERY_RANGE_MAX,
          START_TIME: this.PPSINP16List_tmp[i].START_TIME,
          END_TIME: this.PPSINP16List_tmp[i].END_TIME,
        });
      }
      this.PPSINP16List = data;
      this.displayPPSINP16List = this.PPSINP16List;
      this.updateEditCache();
      console.log(this.PPSINP16List);
      myObj.loading = false;
    });
  }

  

  // insert
  insertTab() {
    let myObj = this;
    if (this.SHOP_CODE_SCHE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.CHOOSE_EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.COMPAIGN_ID === undefined) {
      myObj.message.create("error", "「Campaign ID」不可為空");
      return;
    } else if (this.PARAMETER_COL === undefined) {
      myObj.message.create("error", "「欄位」不可為空");
      return;
    } else if (this.PARAMETER_CONDITION === undefined) {
      myObj.message.create("error", "「條件」不可為空");
      return;
    } else if (this.PARAMETER_NAME === undefined) {
      myObj.message.create("error", "「參數」不可為空");
      return;
    } else if (this.TURN_DIA_MAX_MIN === undefined) {
      myObj.message.create("error", "「產出尺寸MIN」不可為空");
      return;
    } else if (this.TURN_DIA_MAX_MAX === undefined) {
      myObj.message.create("error", "「產出尺寸MAX」不可為空");
      return;
    } else if (this.SCHE_TYPE === undefined) {
      myObj.message.create("error", "「抽數別」不可為空");
      return;
    } else if (this.DATA_DELIVERY_RANGE_MIN === undefined) {
      myObj.message.create("error", "「交期區間MIN」不可為空");
      return;
    } else if (this.DATA_DELIVERY_RANGE_MAX === undefined) {
      myObj.message.create("error", "「交期區間MAX」不可為空");
      return;
    } else if (this.START_TIME === undefined) {
      myObj.message.create("error", "「生產日期 起」不可為空");
      return;
    } else if (this.END_TIME === undefined) {
      myObj.message.create("error", "「生產日期 訖」不可為空");
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
    this.editCache16[id].edit = true;
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
    const index = this.PPSINP16List.findIndex(item => item.id === id);
    this.editCache16[id] = {
      data: { ...this.PPSINP16List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache16[id].data.SHOP_CODE_SCHE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.editCache16[id].data.CHOOSE_EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.editCache16[id].data.COMPAIGN_ID === undefined) {
      myObj.message.create("error", "「Campaign ID」不可為空");
      return;
    } else if (this.editCache16[id].data.PARAMETER_COL === undefined) {
      myObj.message.create("error", "「欄位」不可為空");
      return;
    } else if (this.editCache16[id].data.PARAMETER_CONDITION === undefined) {
      myObj.message.create("error", "「條件」不可為空");
      return;
    } else if (this.editCache16[id].data.PARAMETER_NAME === undefined) {
      myObj.message.create("error", "「參數」不可為空");
      return;
    } else if (this.editCache16[id].data.TURN_DIA_MAX_MIN === undefined) {
      myObj.message.create("error", "「產出尺寸MIN」不可為空");
      return;
    } else if (this.editCache16[id].data.TURN_DIA_MAX_MAX === undefined) {
      myObj.message.create("error", "「產出尺寸MAX」不可為空");
      return;
    } else if (this.editCache16[id].data.SCHE_TYPE === undefined) {
      myObj.message.create("error", "「抽數別」不可為空");
      return;
    } else if (this.editCache16[id].data.DATA_DELIVERY_RANGE_MIN === undefined) {
      myObj.message.create("error", "「交期區間MIN」不可為空");
      return;
    } else if (this.editCache16[id].data.DATA_DELIVERY_RANGE_MAX === undefined) {
      myObj.message.create("error", "「交期區間MAX」不可為空");
      return;
    } else if (this.editCache16[id].data.START_TIME === undefined) {
      myObj.message.create("error", "「生產日期 起」不可為空");
      return;
    } else if (this.editCache16[id].data.END_TIME === undefined) {
      myObj.message.create("error", "「生產日期 訖」不可為空");
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
    this.PPSINP16List.forEach(item => {
      this.editCache16[item.id] = {
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
        SHOP_CODE_SCHE: this.SHOP_CODE_SCHE,
        CHOOSE_EQUIP_CODE : this.CHOOSE_EQUIP_CODE,
        COMPAIGN_ID : this.COMPAIGN_ID,
        PARAMETER_COL : this.PARAMETER_COL,
        PARAMETER_CONDITION : this.PARAMETER_CONDITION,
        PARAMETER_NAME : this.PARAMETER_NAME,
        TURN_DIA_MAX_MIN: this.TURN_DIA_MAX_MIN,
        TURN_DIA_MAX_MAX: this.TURN_DIA_MAX_MAX,
        SCHE_TYPE: this.SCHE_TYPE,
        DATA_DELIVERY_RANGE_MIN: this.DATA_DELIVERY_RANGE_MIN,
        DATA_DELIVERY_RANGE_MAX: this.DATA_DELIVERY_RANGE_MAX,
        START_TIME: this.START_TIME,
        END_TIME: this.END_TIME ,
      })

      myObj.PPSService.insertI116Tab1Save(obj).subscribe(res => {
        
        console.log(res)
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_SCHE = undefined;
          this.CHOOSE_EQUIP_CODE = undefined;
          this.COMPAIGN_ID = undefined;
          this.PARAMETER_COL = undefined;
          this.PARAMETER_CONDITION = undefined;
          this.PARAMETER_NAME = undefined;
          this.TURN_DIA_MAX_MIN = undefined;
          this.TURN_DIA_MAX_MAX = undefined;
          this.SCHE_TYPE = undefined;
          this.DATA_DELIVERY_RANGE_MIN = undefined;
          this.DATA_DELIVERY_RANGE_MAX = undefined;
          this.START_TIME = undefined;
          this.END_TIME = undefined;
          this.getPPSINP16List();
          this.sucessMSG("新增成功", ``);
          this.isVisibleCampaign = false;
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
        ID : this.editCache16[_id].data.tab1ID,
        SHOP_CODE_SCHE : this.editCache16[_id].data.SHOP_CODE_SCHE,
        CHOOSE_EQUIP_CODE : this.editCache16[_id].data.CHOOSE_EQUIP_CODE,
        COMPAIGN_ID : this.editCache16[_id].data.COMPAIGN_ID,
        PARAMETER_COL : this.editCache16[_id].data.PARAMETER_COL,
        PARAMETER_CONDITION : this.editCache16[_id].data.PARAMETER_CONDITION,
        PARAMETER_NAME : this.editCache16[_id].data.PARAMETER_NAME,
        TURN_DIA_MAX_MIN : this.editCache16[_id].data.TURN_DIA_MAX_MIN,
        TURN_DIA_MAX_MAX : this.editCache16[_id].data.TURN_DIA_MAX_MAX,
        SCHE_TYPE : this.editCache16[_id].data.SCHE_TYPE,
        DATA_DELIVERY_RANGE_MIN : this.editCache16[_id].data.DATA_DELIVERY_RANGE_MIN,
        DATA_DELIVERY_RANGE_MAX : this.editCache16[_id].data.DATA_DELIVERY_RANGE_MAX,
        START_TIME : this.editCache16[_id].data.START_TIME,
        END_TIME : this.editCache16[_id].data.END_TIME,
      })

      myObj.PPSService.updateI116Tab1Save(obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_SCHE = undefined;
          this.CHOOSE_EQUIP_CODE = undefined;
          this.COMPAIGN_ID = undefined;
          this.PARAMETER_COL = undefined;
          this.PARAMETER_CONDITION = undefined;
          this.PARAMETER_NAME = undefined;
          this.TURN_DIA_MAX_MIN = undefined;
          this.TURN_DIA_MAX_MAX = undefined;
          this.SCHE_TYPE = undefined;
          this.DATA_DELIVERY_RANGE_MIN = undefined;
          this.DATA_DELIVERY_RANGE_MAX = undefined;
          this.START_TIME = undefined;
          this.END_TIME = undefined;

          this.sucessMSG("修改成功", ``);

          const index = this.PPSINP16List.findIndex(item => item.id === _id);
          Object.assign(this.PPSINP16List[index], this.editCache16[_id].data);
          this.editCache16[_id].edit = false;
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
      let _ID = this.editCache16[_id].data.tab1ID;
      myObj.PPSService.delI116Tab1Data(_ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_SCHE = undefined;
          this.CHOOSE_EQUIP_CODE = undefined;
          this.COMPAIGN_ID = undefined;
          this.PARAMETER_COL = undefined;
          this.PARAMETER_CONDITION = undefined;
          this.PARAMETER_NAME = undefined;
          this.TURN_DIA_MAX_MIN = undefined;
          this.TURN_DIA_MAX_MAX = undefined;
          this.SCHE_TYPE = undefined;
          this.DATA_DELIVERY_RANGE_MIN = undefined;
          this.DATA_DELIVERY_RANGE_MAX = undefined;
          this.START_TIME = undefined;
          this.END_TIME = undefined;

          this.sucessMSG("刪除成功", ``);
          this.getPPSINP16List();
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
  // 新增Campaign限制之彈出視窗 
  openCampaignInput(): void {
    this.isVisibleCampaign = true;
  }
  // 取消Campaign限制之彈出視窗 
  cancelCampaignInput() : void {
    this.isVisibleCampaign = false;
  } 


// ============= 過濾資料之menu ========================.
  // Campaign限制
   ppsInp16ListFilter(property:string, keyWord:string) : void {

    if(_.isEmpty(keyWord)){
      this.displayPPSINP16List = this.PPSINP16List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP16List.filter(item => filterFunc(item));
    this.displayPPSINP16List = data;
  }

  // 資料過濾---Campaign限制 --> 站別
  searchByShopCodeSche() : void {
    this.ppsInp16ListFilter("SHOP_CODE_SCHE", this.searchShopCodeScheValue);
  } 
  resetByShopCodeSche() : void {
    this.searchShopCodeScheValue = '';
    this.ppsInp16ListFilter("SHOP_CODE_SCHE", this.searchShopCodeScheValue);
  }

  // 資料過濾---Campaign限制 --> 機台
  searchByChooseEquipCode() : void {
    this.ppsInp16ListFilter("CHOOSE_EQUIP_CODE", this.searchChooseEquipCodeValue);
  } 
  resetByChooseEquipCode() : void {
    this.searchChooseEquipCodeValue = '';
    this.ppsInp16ListFilter("CHOOSE_EQUIP_CODE", this.searchChooseEquipCodeValue);
  }

  // 資料過濾---Campaign限制 --> Campaign ID
  searchByCompaignId() : void {
    this.ppsInp16ListFilter("COMPAIGN_ID", this.searchCompaignIdValue);
  } 
  resetByCompaignId() : void {
    this.searchCompaignIdValue = '';
    this.ppsInp16ListFilter("COMPAIGN_ID", this.searchCompaignIdValue);
  }

  // 資料過濾---Campaign限制 --> 欄位
  searchByParameterCol() : void {
    this.ppsInp16ListFilter("PARAMETER_COL", this.searchParameterColValue);
  } 
  resetByParameterCol() : void {
    this.searchParameterColValue = '';
    this.ppsInp16ListFilter("PARAMETER_COL", this.searchParameterColValue);
  }

  // 資料過濾---Campaign限制 --> 欄位
  searchByParameterCondition() : void {
    this.ppsInp16ListFilter("PARAMETER_CONDITION", this.searchParameterConditionValue);
  } 
  resetByParameterCondition() : void {
    this.searchParameterConditionValue = '';
    this.ppsInp16ListFilter("PARAMETER_CONDITION", this.searchParameterConditionValue);
  }

  // 資料過濾---Campaign限制 --> 參數
  searchByParameterName() : void {
    this.ppsInp16ListFilter("PARAMETER_NAME", this.searchParameterNameValue);
  } 
  resetByParameterName() : void {
    this.searchParameterNameValue = '';
    this.ppsInp16ListFilter("PARAMETER_NAME", this.searchParameterNameValue);
  }

  // 資料過濾---Campaign限制 --> 產出尺寸MIN
  searchByTurnDiaMaxMin() : void {
    this.ppsInp16ListFilter("TURN_DIA_MAX_MIN", this.searchTurnDiaMaxMinValue);
  } 
  resetByTurnDiaMaxMin() : void {
    this.searchTurnDiaMaxMinValue = '';
    this.ppsInp16ListFilter("TURN_DIA_MAX_MIN", this.searchTurnDiaMaxMinValue);
  }

  // 資料過濾---Campaign限制 --> 產出尺寸MAX
  searchByTurnDiaMaxMax() : void {
    this.ppsInp16ListFilter("TURN_DIA_MAX_MAX", this.searchTurnDiaMaxMaxValue);
  } 
  resetByTurnDiaMaxMax() : void {
    this.searchTurnDiaMaxMaxValue = '';
    this.ppsInp16ListFilter("TURN_DIA_MAX_MAX", this.searchTurnDiaMaxMaxValue);
  }

  // 資料過濾---Campaign限制 --> 抽數別
  searchByScheType() : void {
    this.ppsInp16ListFilter("SCHE_TYPE", this.searchScheTypeValue);
  } 
  resetByScheType() : void {
    this.searchScheTypeValue = '';
    this.ppsInp16ListFilter("SCHE_TYPE", this.searchScheTypeValue);
  }

  // 資料過濾---Campaign限制 --> 交期區間MIN
  searchByDataDeliveryRangeMin() : void {
    this.ppsInp16ListFilter("DATA_DELIVERY_RANGE_MIN", this.searchDataDeliveryRangeMinValue);
  } 
  resetByDataDeliveryRangeMin() : void {
    this.searchDataDeliveryRangeMinValue = '';
    this.ppsInp16ListFilter("DATA_DELIVERY_RANGE_MIN", this.searchDataDeliveryRangeMinValue);
  }

  // 資料過濾---Campaign限制 --> 交期區間MAX
  searchByDataDeliveryRangeMax() : void {
    this.ppsInp16ListFilter("DATA_DELIVERY_RANGE_MAX", this.searchDataDeliveryRangeMaxValue);
  } 
  resetByDataDeliveryRangeMax() : void {
    this.searchDataDeliveryRangeMaxValue = '';
    this.ppsInp16ListFilter("DATA_DELIVERY_RANGE_MAX", this.searchDataDeliveryRangeMaxValue);
  }

  // 資料過濾---Campaign限制 --> 生產日期 起
  searchByStartTime() : void {
    this.ppsInp16ListFilter("START_TIME", this.searchStartTimeValue);
  } 
  resetByStartTime() : void {
    this.searchStartTimeValue = '';
    this.ppsInp16ListFilter("START_TIME", this.searchStartTimeValue);
  }

  // 資料過濾---Campaign限制 --> 生產日期 起
  searchByEndTime() : void {
    this.ppsInp16ListFilter("END_TIME", this.searchEndTimeValue);
  } 
  resetByEndTime() : void {
    this.searchEndTimeValue = '';
    this.ppsInp16ListFilter("END_TIME", this.searchEndTimeValue);
  }



}
