import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface ItemData1 {
  id: string;
  tab1ID: number;
  GRADE_NO: string;
  GRADE_GROUP: string;
  SPECIAL_EQUIP_CODE: string;
}
interface ItemData2 {
  id: string;
  tab2ID: number;
  SHOP_CODE_2: string;
  EQUIP_GROUP_2: string;
  EQUIP_CODE_2: string;
  PROCESS_CODE_2: string;
  GRADE_GROUP_2: string;
  SHAPE_TYPE_2: string;
  INPUT_DIA_MAX_2: number;
  CAPABILITY_DIA_MIN_2: number;
  CAPABILITY_DIA_MAX_2: number;
  CAPABILITY_LENGTH_MIN_2: number;
  CAPABILITY_LENGTH_MAX_2: number;
  OPTIMAL_DIA_MIN_2: number;
  OPTIMAL_DIA_MAX_2: number;
  OPTIMAL_LENGTH_MIN_2: number;
  OPTIMAL_LENGTH_MAX_2: number;
  OPTION_EQUIP_1_2: string;
  OPTION_EQUIP_2_2: string;
  OPTION_EQUIP_3_2: string;
}

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

interface ItemData13 {
  id: string;
  tab1ID: number;
  GRADE_NO_13: string;
  OUT_TYPE: string;
  DIA_MIN: number;
  DIA_MAX: number;
  GRINDING_PASS: number;
  GRINDING_SIZE: number;
}

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

interface ItemData3 {
  id: string;
  tab3ID: number;
  EQUIP_CODE: string;
  LOAD_TIME: number;
  TRANSFER_TIME: number;
  OTHER_TIME: number;
  BIG_ADJUST_TIME: number;
  SMALL_ADJUST_TIME: number;
  RETURN_TIME: number;
  COOLING_TIME: number;
}
interface ItemData4 {
  id: string;
  tab4ID: number;
  EQUIP_CODE_4: string;
  DIA_MIN_4: number;
  DIA_MAX_4: number;
  SHAPE_TYPE_4: string;
  BIG_ADJUST_CODE_4: string;
  SMALL_ADJUST_TOLERANCE_4: string;
  FURANCE_BATCH_QTY_4: number; 
}
interface ItemData05 {
  id: string;
  tab5ID: number;
  SHOP_CODE_5: string;
  EQUIP_CODE_5: string;
  SHAPE_TYPE_5: string;
  GRADE_GROUP_5: string;
  SPEED_TYPE_5: string;
  REDUCTION_RATE_MIN_5: number;
  REDUCTION_RATE_MAX_5: number;
  DIA_MAX_5: number;
  DIA_MIN_5: number;
  SPEED_5: number;
  EQUIP_CAP_5: number;
}
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
interface ItemData9 {
  id: string;
  tab9ID: number;
  SHOP_CODE_9:string;
  EQUIP_CODE_9: string;
  OP_CODE_9:string;
  TEMPERATURE_9: number;
  FREQUENCY_9: number;
  STEEL_GRADE_MIN_9: number;
}
interface ItemData10 {
  id: string;
  tab10ID: number;
  SHOP_CODE_10: string;
  EQUIP_CODE_10: string;
  GRADE_NO_10: string;
  LENGTH_MIN_10: number;
  LENGTH_MAX_10: number;
  DIA_MIN_10: number;
  DIA_MAX_10: number;
  TOTAL_TIMES_10: number;
  PICKLING_TIMES_10: number;
  WASHING_TIMES_10: number;
  DRAINING_TIMES_10: number;
  BATCH_CNT_10: number;
}
interface ItemData17 {
  id: string;
  tab17ID: number;
  EQUIP_CODE_17: string;
  DIA_MIN_17: number;
  DIA_MAX_17: number;
  SHAPE_TYPE_17: string;
  SMALL_ADJUST_CODE_17: string;
  SMALL_ADJUST_TOLERANCE_17: string;
  FURANCE_BATCH_QTY_17: number; 
}
interface ItemData20 {
  id: string;
  tab20ID: number;
  EQUIP_CODE_20: string;
  KIND_TYPE_20: string;
  OUTPUT_SHAPE_20: number;
  PROCESS_CODE_20: string;
  FINAL_PROCESS_20: string;
  SCHE_TYPE_20: string; 
}
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
@Component({
  selector: "app-PPSI106",
  templateUrl: "./PPSI106.component.html",
  styleUrls: ["./PPSI106.component.scss"],
  providers:[NzMessageService]
})
export class PPSI106Component implements AfterViewInit {
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
  // 2.機台能力
  SHOP_CODE_2;
  EQUIP_GROUP_2;
  EQUIP_CODE_2;
  PROCESS_CODE_2;
  GRADE_GROUP_2;
  SHAPE_TYPE_2;
  INPUT_DIA_MAX_2;
  CAPABILITY_DIA_MIN_2;
  CAPABILITY_DIA_MAX_2;
  CAPABILITY_LENGTH_MIN_2;
  CAPABILITY_LENGTH_MAX_2;
  OPTIMAL_DIA_MIN_2;
  OPTIMAL_DIA_MAX_2;
  OPTIMAL_LENGTH_MIN_2;
  OPTIMAL_LENGTH_MAX_2;
  OPTION_EQUIP_1_2;
  OPTION_EQUIP_2_2;
  OPTION_EQUIP_3_2;
  isVisibleCapability = false;
  searchShopCode2Value = '';
  searchEquipGroup2Value = '';
  searchEquipCode2Value = '';
  searchProcessCode2Value = '';
  searchGradeGroup2Value = '';
  searchShapeType2Value = '';
  searchInputDiaMax2Value = '';
  searchCapabilityDiaMin2Value = '';
  searchCapabilityDiaMax2Value = '';
  searchCapabilityLengthMin2Value = '';
  searchCapabilityLengthMax2Value = '';
  searchOptimalDiaMin2Value = '';
  searchOptimalDiaMax2Value = '';
  searchOptimalLengthMin2Value = '';
  searchOptimalLengthMax2Value = '';
  searchoptionEquip1_2Value = '';
  searchoptionEquip2_2Value = '';
  searchoptionEquip3_2Value = '';
  // 3.整備
  EQUIP_CODE;
  LOAD_TIME;
  TRANSFER_TIME;
  OTHER_TIME;
  BIG_ADJUST_TIME;
  SMALL_ADJUST_TIME;
  RETURN_TIME;
  COOLING_TIME;
  isVisiblePrepare = false;
  searchEquipCodeValue = '';
  searchLoadTimeValue = '';
  searchTransferTimeValue = '';
  searchOtherTimeValue = '';
  searchBigAdjustTimeValue = '';
  searchSmallAdjustTimeValue = '';
  searchReturnTimeValue = '';
  searchCoolingTimeValue = '';
  
  // 4.大調機
  EQUIP_CODE_4;
  DIA_MIN_4;
  DIA_MAX_4;
  SHAPE_TYPE_4;
  BIG_ADJUST_CODE_4;
  SMALL_ADJUST_TOLERANCE_4;
  FURANCE_BATCH_QTY_4; 
  isVisibleBigAdjust = false;
  searchEquipCode4Value = '';
  searchDiaMin4Value = '';
  searchDiaMax4Value = '';
  searchShapeType4Value = '';
  searchBigAdjustCode4Value = '';
  searchSmallAdjustTolerance4Value = '';
  searchFuranceBatchQty4Value = '';
  // 5.線速
  SHOP_CODE_5;
  EQUIP_CODE_5;
  SHAPE_TYPE_5;
  GRADE_GROUP_5;
  SPEED_TYPE_5;
  REDUCTION_RATE_MIN_5;
  REDUCTION_RATE_MAX_5;
  DIA_MAX_5;
  DIA_MIN_5;
  SPEED_5;
  EQUIP_CAP_5;
  isVisibleSpeed = false;
  searchShopCode5Value = '';
  searchEquipCode5Value = '';
  searchShapeType5Value = '';
  searchGradeGroup5Value = '';
  searchSpeedType5Value = '';
  searchReductionRateMin5Value = '';
  searchReductionRateMax5Value = '';
  searchDiaMax5Value = '';
  searchDiaMin5Value = '';
  searchSpeed5Value = '';
  searchEquipCap5Value = '';
  // 8.非線速
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
  // 9.退火爐工時
  tab9ID;
  SHOP_CODE_9;
  EQUIP_CODE_9
  OP_CODE_9;
  TEMPERATURE_9;
  FREQUENCY_9;
  STEEL_GRADE_MIN_9;
  isVisibleStove = false;
  searchShopCode9Value = '';
  searchEquipCode9Value = '';
  searchOpCode9Value = '';
  searchTemperature9Value = '';
  searchFrequency9Value = '';
  searchSteelGradeMin9Value = '';
  // 10.其他站別工時
  SHOP_CODE_10;
  EQUIP_CODE_10;
  GRADE_NO_10;
  LENGTH_MIN_10;
  LENGTH_MAX_10;
  DIA_MIN_10;
  DIA_MAX_10;
  TOTAL_TIMES_10;
  PICKLING_TIMES_10;
  WASHING_TIMES_10;
  DRAINING_TIMES_10;
  BATCH_CNT_10;
  isVisibleOtherShop = false;
  searchShopCode10Value = '';
  searchEquipCode10Value = '';
  searchGradeNo10Value = '';
  searchLengthMin10Value = '';
  searchLengthMax10Value = '';
  searchDiaMin10Value = '';
  searchDiaMax10Value = '';
  searchTotalTimes10Value = '';
  searchPicklingTimes10Value = '';
  searchWashingTimes10Value = '';
  searchDrainingTimes10Value = '';
  searchBatchCnt10Value = '';
  // 17.小調機
  EQUIP_CODE_17;
  DIA_MIN_17;
  DIA_MAX_17;
  SHAPE_TYPE_17;
  SMALL_ADJUST_CODE_17;
  SMALL_ADJUST_TOLERANCE_17;
  FURANCE_BATCH_QTY_17; 
  isVisibleSmallAdjust = false;
  searchEquipCode17Value = '';
  searchDiaMin17Value = '';
  searchDiaMax17Value = '';
  searchShapeType17Value = '';
  searchSmallAdjustCode17Value = '';
  searchSmallAdjustTolerance17Value = '';
  searchFuranceBatchQty17Value = '';
  // 20.清洗站設備能力表
  tab20ID;
  EQUIP_CODE_20;
  KIND_TYPE_20;
  OUTPUT_SHAPE_20;
  PROCESS_CODE_20;
  FINAL_PROCESS_20;
  SCHE_TYPE_20;
  isVisibleWash = false;
  searchEquipCode20Value = '';
  searchKindType20Value = '';
  searchOutputShape20Value = '';
  searchProcessCode20Value = '';
  searchFinalProcess20Value = '';
  searchScheType20Value = '';

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

  // 研磨道次
  GRADE_NO_13;
  OUT_TYPE;
  DIA_MIN;
  DIA_MAX;
  GRINDING_PASS;
  GRINDING_SIZE;
  isVisibleGrinding = false;
  searchGradeNo13Value = '';
  searchOutTypeValue = '';
  searchDiaMinValue = '';
  searchDiaMaxValue = '';
  searchGrindingPassValue = '';
  searchGrindingSizeValue = '';

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

  // 產率設定欄位查詢關鍵字
  searchSchShopCodeValue = '';
  searchEquipGroup3Value = '';
  searchYieldTypeValue = '';
  searchYieldValueValue = '';

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // tab 1
  PPSINP01List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  PPSINP01List: ItemData1[] = [];
  displayPPSINP01List: ItemData1[] = [];
  // tab 2
  PPSINP02List_tmp;
  editCache2: { [key: string]: { edit: boolean; data: ItemData2 } } = {};
  PPSINP02List: ItemData2[] = [];
  displayPPSINP02List: ItemData2[] = [];
  // tab 3
  PPSINP03List_tmp;
  PPSINP03List: ItemData3[] = [];
  editCache3: { [key: string]: { edit: boolean; data: ItemData3 } } = {};
  displayPPSINP03List: ItemData3[] = [];
  // tab 4
  PPSINP04List_tmp;
  PPSINP04List: ItemData4[] = [];
  editCache4: { [key: string]: { edit: boolean; data: ItemData4 } } = {};
  displayPPSINP04List : ItemData4[] = [];
  // tab 5
  PPSINP05List_tmp;
  PPSINP05List: ItemData05[] = [];
  editCache05: { [key: string]: { edit: boolean; data: ItemData05 } } = {};
  displayPPSINP05List : ItemData05[] = [];
  // tab 8
  PPSINP08List_tmp;
  PPSINP08List: ItemData8[] = [];
  editCache8: { [key: string]: { edit: boolean; data: ItemData8 } } = {};
  displayPPSINP08List : ItemData8[] = [];
  // tab 9
  PPSINP09List_tmp;
  PPSINP09List: ItemData9[] = [];
  editCache9: { [key: string]: { edit: boolean; data: ItemData9 } } = {};
  displayPPSINP09List : ItemData9[] = [];
  // tab 10
  PPSINP10List_tmp;
  PPSINP10List: ItemData10[] = [];
  editCache10: { [key: string]: { edit: boolean; data: ItemData10 } } = {};
  displayPPSINP10List : ItemData10[] = [];
  // tab 17
  PPSINP17List_tmp;
  PPSINP17List: ItemData17[] = [];
  editCache17: { [key: string]: { edit: boolean; data: ItemData17 } } = {};
  displayPPSINP17List : ItemData17[] = [];
  // tab 20
  PPSINP20List_tmp;
  PPSINP20List: ItemData20[] = [];
  editCache20: { [key: string]: { edit: boolean; data: ItemData20 } } = {};
  displayPPSINP20List : ItemData20[] = [];
  // tab 14
  tbppsm012List_tmp;
  tbppsm012List: ItemData14[] = [];
  displayTbppsm012List : ItemData14[] = [];
  editCache14: { [key: string]: { edit: boolean; data: ItemData14 } } = {};
  showYieldValue = false;
  editColse14 = false;

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getPPSINP01List();
    this.getPPSINP02List();
    this.getPPSINP03List();
    this.getPPSINP04List();
    this.getPPSINP05List();
    this.getPPSINP08List();
    this.getPPSINP09List();
    this.getPPSINP10List();
    this.getPPSINP17List();
    this.getPPSINP20List();
  }
  
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  //tab2_select 
  getPPSINP02List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP02List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP02List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP02List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab2ID: this.PPSINP02List_tmp[i].ID,
          SHOP_CODE_2: this.PPSINP02List_tmp[i].SHOP_CODE,
          EQUIP_GROUP_2: this.PPSINP02List_tmp[i].EQUIP_GROUP,
          EQUIP_CODE_2: this.PPSINP02List_tmp[i].EQUIP_CODE,
          PROCESS_CODE_2: this.PPSINP02List_tmp[i].PROCESS_CODE,
          GRADE_GROUP_2: this.PPSINP02List_tmp[i].GRADE_GROUP,
          SHAPE_TYPE_2: this.PPSINP02List_tmp[i].SHAPE_TYPE,
          INPUT_DIA_MAX_2: this.PPSINP02List_tmp[i].INPUT_DIA_MAX,
          CAPABILITY_DIA_MIN_2: this.PPSINP02List_tmp[i].CAPABILITY_DIA_MIN,
          CAPABILITY_DIA_MAX_2: this.PPSINP02List_tmp[i].CAPABILITY_DIA_MAX,
          CAPABILITY_LENGTH_MIN_2: this.PPSINP02List_tmp[i].CAPABILITY_LENGTH_MIN,
          CAPABILITY_LENGTH_MAX_2: this.PPSINP02List_tmp[i].CAPABILITY_LENGTH_MAX,
          OPTIMAL_DIA_MIN_2: this.PPSINP02List_tmp[i].OPTIMAL_DIA_MIN,
          OPTIMAL_DIA_MAX_2: this.PPSINP02List_tmp[i].OPTIMAL_DIA_MAX,
          OPTIMAL_LENGTH_MIN_2: this.PPSINP02List_tmp[i].OPTIMAL_LENGTH_MIN,
          OPTIMAL_LENGTH_MAX_2: this.PPSINP02List_tmp[i].OPTIMAL_LENGTH_MAX,
          OPTION_EQUIP_1_2: this.PPSINP02List_tmp[i].OPTION_EQUIP_1,
          OPTION_EQUIP_2_2: this.PPSINP02List_tmp[i].OPTION_EQUIP_2,
          OPTION_EQUIP_3_2: this.PPSINP02List_tmp[i].OPTION_EQUIP_3,
        });
      }
      this.PPSINP02List = data;
      this.displayPPSINP02List = this.PPSINP02List;
      this.updateEditCache2(1);
      console.log(this.PPSINP02List);
      myObj.loading = false;
    });
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
      this.updateEditCache(2);
      console.log(this.PPSINP07List);
      myObj.loading = false;
    });
  }

  PPSINP13List_tmp;
  editCache13: { [key: string]: { edit: boolean; data: ItemData13 } } = {};
  PPSINP13List: ItemData13[] = [];
  displayPPSINP13List : ItemData13[] = [];
  getPPSINP13List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP13List().subscribe(res => {
      console.log("getPPSINP13List success");
      this.PPSINP13List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP13List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.PPSINP13List_tmp[i].ID,
          GRADE_NO_13: this.PPSINP13List_tmp[i].GRADE_NO,
          OUT_TYPE: this.PPSINP13List_tmp[i].OUT_TYPE,
          DIA_MIN: this.PPSINP13List_tmp[i].DIA_MIN,
          DIA_MAX: this.PPSINP13List_tmp[i].DIA_MAX,
          GRINDING_PASS: this.PPSINP13List_tmp[i].GRINDING_PASS,
          GRINDING_SIZE: this.PPSINP13List_tmp[i].GRINDING_SIZE,
        });
      }
      this.PPSINP13List = data;
      this.displayPPSINP13List = this.PPSINP13List;
      this.updateEditCache(13);
      console.log(this.PPSINP13List);
      myObj.loading = false;
    });
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
      this.updateEditCache(16);
      console.log(this.PPSINP16List);
      myObj.loading = false;
    });
  }

  //tab3_select 
  getPPSINP03List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP03List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP03List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP03List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab3ID: this.PPSINP03List_tmp[i].ID,
          EQUIP_CODE: this.PPSINP03List_tmp[i].EQUIP_CODE,
          LOAD_TIME: this.PPSINP03List_tmp[i].LOAD_TIME,
          TRANSFER_TIME: this.PPSINP03List_tmp[i].TRANSFER_TIME,
          OTHER_TIME: this.PPSINP03List_tmp[i].OTHER_TIME,
          BIG_ADJUST_TIME: this.PPSINP03List_tmp[i].BIG_ADJUST_TIME,
          SMALL_ADJUST_TIME: this.PPSINP03List_tmp[i].SMALL_ADJUST_TIME,
          RETURN_TIME: this.PPSINP03List_tmp[i].RETURN_TIME,
          COOLING_TIME: this.PPSINP03List_tmp[i].COOLING_TIME
        });
      }
      this.PPSINP03List = data;
      this.displayPPSINP03List = this.PPSINP03List;
      this.updateEditCache3(1);
      console.log(this.PPSINP03List);
      myObj.loading = false;
    });
  }
  //tab4_select 
  getPPSINP04List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP04List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP04List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP04List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab4ID: this.PPSINP04List_tmp[i].ID,
          EQUIP_CODE_4: this.PPSINP04List_tmp[i].EQUIP_CODE,
          DIA_MIN_4: this.PPSINP04List_tmp[i].DIA_MIN,
          DIA_MAX_4: this.PPSINP04List_tmp[i].DIA_MAX,
          SHAPE_TYPE_4: this.PPSINP04List_tmp[i].SHAPE_TYPE,
          BIG_ADJUST_CODE_4: this.PPSINP04List_tmp[i].BIG_ADJUST_CODE,
          SMALL_ADJUST_TOLERANCE_4: this.PPSINP04List_tmp[i].SMALL_ADJUST_TOLERANCE,
          FURANCE_BATCH_QTY_4: this.PPSINP04List_tmp[i].FURANCE_BATCH_QTY
        });
      }
      this.PPSINP04List = data;
      this.displayPPSINP04List = this.PPSINP04List;
      this.updateEditCache4(1);
      console.log(this.PPSINP04List);
      myObj.loading = false;
    });
  }
  //tab05_select 
  getPPSINP05List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP05List().subscribe(res => {
      console.log("getFCPTB26List success 05");
      this.PPSINP05List_tmp = res;
      console.log("取得this.PPSINP05List_tmp");
      console.log(this.PPSINP05List_tmp);
      console.log("將撈出來的資料用迴圈放進data");
      const data = [];
      for (let i = 0; i < this.PPSINP05List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab5ID: this.PPSINP05List_tmp[i].ID,
          SHOP_CODE_5:this.PPSINP05List_tmp[i].SHOP_CODE,
          EQUIP_CODE_5: this.PPSINP05List_tmp[i].EQUIP_CODE,
          SHAPE_TYPE_5: this.PPSINP05List_tmp[i].SHAPE_TYPE,
          GRADE_GROUP_5: this.PPSINP05List_tmp[i].GRADE_GROUP,
          SPEED_TYPE_5: this.PPSINP05List_tmp[i].SPEED_TYPE,
          REDUCTION_RATE_MIN_5: this.PPSINP05List_tmp[i].REDUCTION_RATE_MIN,
          REDUCTION_RATE_MAX_5: this.PPSINP05List_tmp[i].REDUCTION_RATE_MAX,
          DIA_MAX_5: this.PPSINP05List_tmp[i].DIA_MAX,
          DIA_MIN_5: this.PPSINP05List_tmp[i].DIA_MIN,
          SPEED_5: this.PPSINP05List_tmp[i].SPEED,
          EQUIP_CAP_5: this.PPSINP05List_tmp[i].EQUIP_CAP
        });
      }
      console.log("打印data");
      console.log(data);

      this.PPSINP05List = data;
      this.displayPPSINP05List = this.PPSINP05List;
      console.log("更新線速暫存區");
      this.updateEditCache05(1);
      myObj.loading = false;
    });
  }
  //tab8_select 
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
      this.updateEditCache8(1);
      console.log(this.PPSINP08List);
      myObj.loading = false;
    });
  }
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
          SHOP_CODE_9: this.PPSINP09List_tmp[i].SHOP_CODE,
          EQUIP_CODE_9: this.PPSINP09List_tmp[i].EQUIP_CODE,
          OP_CODE_9: this.PPSINP09List_tmp[i].OP_CODE,
          TEMPERATURE_9: this.PPSINP09List_tmp[i].TEMPERATURE,
          FREQUENCY_9: this.PPSINP09List_tmp[i].FREQUENCY,
          STEEL_GRADE_MIN_9: this.PPSINP09List_tmp[i].STEEL_GRADE_MIN
        });
      }
      this.PPSINP09List = data;
      this.displayPPSINP09List = this.PPSINP09List;
      this.updateEditCache9(1);
      console.log(this.PPSINP09List);
      myObj.loading = false;
    });
  }
  //tab10_select 
  getPPSINP10List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP10List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP10List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP10List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab10ID: this.PPSINP10List_tmp[i].ID,
          SHOP_CODE_10: this.PPSINP10List_tmp[i].SHOP_CODE,
          EQUIP_CODE_10: this.PPSINP10List_tmp[i].EQUIP_CODE,
          GRADE_NO_10: this.PPSINP10List_tmp[i].GRADE_NO,
          LENGTH_MIN_10: this.PPSINP10List_tmp[i].LENGTH_MIN,
          LENGTH_MAX_10: this.PPSINP10List_tmp[i].LENGTH_MAX,
          DIA_MIN_10: this.PPSINP10List_tmp[i].DIA_MIN,
          DIA_MAX_10: this.PPSINP10List_tmp[i].DIA_MAX,
          TOTAL_TIMES_10: this.PPSINP10List_tmp[i].TOTAL_TIMES,
          PICKLING_TIMES_10: this.PPSINP10List_tmp[i].PICKLING_TIMES,
          WASHING_TIMES_10: this.PPSINP10List_tmp[i].WASHING_TIMES,
          DRAINING_TIMES_10: this.PPSINP10List_tmp[i].DRAINING_TIMES,
          BATCH_CNT_10: this.PPSINP10List_tmp[i].BATCH_CNT
        });
      }
      this.PPSINP10List = data;
      this.displayPPSINP10List = this.PPSINP10List;
      this.updateEditCache10(1);
      console.log(this.PPSINP10List);
      myObj.loading = false;
    });
  }
  //tab17_select 
  getPPSINP17List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP17List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP17List_tmp = res;
      const data = [];
      for (let i = 0; i < this.PPSINP17List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab17ID: this.PPSINP17List_tmp[i].ID,
          EQUIP_CODE_17: this.PPSINP17List_tmp[i].EQUIP_CODE,
          DIA_MIN_17: this.PPSINP17List_tmp[i].DIA_MIN,
          DIA_MAX_17: this.PPSINP17List_tmp[i].DIA_MAX,
          SHAPE_TYPE_17: this.PPSINP17List_tmp[i].SHAPE_TYPE,
          SMALL_ADJUST_CODE_17: this.PPSINP17List_tmp[i].SMALL_ADJUST_CODE,
          SMALL_ADJUST_TOLERANCE_17: this.PPSINP17List_tmp[i].SMALL_ADJUST_TOLERANCE,
          FURANCE_BATCH_QTY_17: this.PPSINP17List_tmp[i].FURANCE_BATCH_QTY
        });
      }
      this.PPSINP17List = data;
      this.displayPPSINP17List = this.PPSINP17List;
      this.updateEditCache17(1);
      myObj.loading = false;
    });
  }
  //tab20_select 
  getPPSINP20List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP20List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP20List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP20List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab20ID: this.PPSINP20List_tmp[i].ID,
          EQUIP_CODE_20: this.PPSINP20List_tmp[i].EQUIP_CODE,
          KIND_TYPE_20: this.PPSINP20List_tmp[i].KIND_TYPE,
          OUTPUT_SHAPE_20: this.PPSINP20List_tmp[i].OUTPUT_SHAPE,
          PROCESS_CODE_20: this.PPSINP20List_tmp[i].PROCESS_CODE,
          FINAL_PROCESS_20: this.PPSINP20List_tmp[i].FINAL_PROCESS,
          SCHE_TYPE_20: this.PPSINP20List_tmp[i].SCHE_TYPE
        });
      }
      this.PPSINP20List = data;
      this.displayPPSINP20List = this.PPSINP20List;
      this.updateEditCache20(1);
      console.log(this.PPSINP20List);
      myObj.loading = false;
    });
  }

  
  //tab14_select 
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
      this.updateEditCache(14);
      console.log(this.tbppsm012List);
      myObj.loading = false;
    });
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  // insert2
  insertTab2() {
    let myObj = this;
    if (this.SHOP_CODE_2 === undefined) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.EQUIP_GROUP_2 === undefined) {
      myObj.message.create("error", "「機台群組」不可為空")
    } else if (this.EQUIP_CODE_2 === undefined) {
      myObj.message.create("error", "「機台」不可為空")
    } else if (this.PROCESS_CODE_2 === undefined) {
      myObj.message.create("error", "「製程碼」不可為空")
    } else if (this.GRADE_GROUP_2 === undefined) {
      myObj.message.create("error", "「鋼種類別」不可為空")
    } else if (this.SHAPE_TYPE_2 === undefined) {
      myObj.message.create("error", "「形狀」不可為空")
    } else if (this.INPUT_DIA_MAX_2 === undefined) {
      myObj.message.create("error", "「投入尺寸上限」不可為空")
    } else if (this.CAPABILITY_DIA_MIN_2 === undefined) {
      myObj.message.create("error", "「設備能力最小尺寸」不可為空")
    } else if (this.CAPABILITY_DIA_MAX_2 === undefined) {
      myObj.message.create("error", "「設備能力最大尺寸」不可為空")
    } else if (this.CAPABILITY_LENGTH_MIN_2 === undefined) {
      myObj.message.create("error", "「設備能力最小長度」不可為空")
    } else if (this.CAPABILITY_LENGTH_MAX_2 === undefined) {
      myObj.message.create("error", "「設備能力最大長度」不可為空")
    } else if (this.OPTIMAL_DIA_MIN_2 === undefined) {
      myObj.message.create("error", "「最佳能力最小尺寸」不可為空")
    } else if (this.OPTIMAL_DIA_MAX_2 === undefined) {
      myObj.message.create("error", "「最佳能力最大尺寸」不可為空")
    } else if (this.OPTIMAL_LENGTH_MIN_2 === undefined) {
      myObj.message.create("error", "「最佳能力最小長度」不可為空")
    } else if (this.OPTIMAL_LENGTH_MAX_2 === undefined) {
      myObj.message.create("error", "「最佳能力最大長度」不可為空")
    } else if (this.OPTION_EQUIP_1_2 === undefined) {
      myObj.message.create("error", "「替代機台順位1」不可為空")
    } else if (this.OPTION_EQUIP_2_2 === undefined) {
      myObj.message.create("error", "「替代機台順位2」不可為空")
    } else if (this.OPTION_EQUIP_3_2 === undefined) {
      myObj.message.create("error", "「替代機台順位3」不可為空")
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave2(1)
        }
    })}
  }

    // insert
    insertTab7() {
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
            this.insertSave(2)
            this.isVisibleShop = false;
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  
    insertTab13() {
      let myObj = this;
      if (this.GRADE_NO_13 === undefined) {
        myObj.message.create("error", "「鋼種類別」不可為空");
        return;
      } else if (this.OUT_TYPE === undefined) {
        myObj.message.create("error", "「產出型態」不可為空");
        return;
      } else if (this.DIA_MIN === undefined) {
        myObj.message.create("error", "「產出成品尺寸最小值」不可為空");
        return;
      } else if (this.DIA_MAX === undefined) {
        myObj.message.create("error", "「產出成品尺寸最大值」不可為空");
        return;
      } else if (this.GRINDING_PASS === undefined) {
        myObj.message.create("error", "「研磨道次」不可為空");
        return;
      } else if (this.GRINDING_SIZE === undefined) {
        myObj.message.create("error", "「每刀研磨尺寸」不可為空");
        return;
      }else {
        this.Modal.confirm({
          nzTitle: '是否確定新增',
          nzOnOk: () => {
            this.insertSave(13)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  
    insertTab16() {
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
            this.insertSave(16)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  
    // insert3
    insertTab3() {
      let myObj = this;
      if (this.EQUIP_CODE === undefined) {
        myObj.message.create("error", "「機台」不可為空");
        return;
      } else if (this.LOAD_TIME === undefined) {
        myObj.message.create("error", "「上下料」不可為空");
        return;
      }  else if (this.TRANSFER_TIME === undefined) {
        myObj.message.create("error", "「搬運」不可為空");
        return;
      }   else if (this.OTHER_TIME === undefined) {
        myObj.message.create("error", "「其他整備」不可為空");
        return;
      }   else if (this.BIG_ADJUST_TIME === undefined) {
        myObj.message.create("error", "「大調機」不可為空");
        return;
      }   else if (this.SMALL_ADJUST_TIME === undefined) {
        myObj.message.create("error", "「小調機」不可為空");
        return;
      }   else if (this.RETURN_TIME === undefined) {
        myObj.message.create("error", "「退料」不可為空");
        return;
      }   else if (this.COOLING_TIME === undefined) {
        myObj.message.create("error", "「冷卻」不可為空");
        return;
      }else {
        this.Modal.confirm({
          nzTitle: '是否確定新增',
          nzOnOk: () => {
            this.insertSave3(1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
  }
  // insert8
  insertTab8() {
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
          this.insertSave8(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // insert9
  insertTab9() {
    let myObj = this;
    if (this.SHOP_CODE_9 === undefined) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.EQUIP_CODE_9 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.OP_CODE_9 === undefined) {
      myObj.message.create("error", "「作業代碼」不可為空");
      return;
    } else if (this.TEMPERATURE_9 === undefined) {
      myObj.message.create("error", "「溫度」不可為空");
      return;
    } else if (this.FREQUENCY_9 === undefined) {
      myObj.message.create("error", "「頻率」不可為空");
      return;
    } else if (this.STEEL_GRADE_MIN_9 === undefined) {
      myObj.message.create("error", "「每噸花時間」不可為空");
      return;
    }else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave9(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // insert10
  insertTab10() {
    let myObj = this;
    if (this.SHOP_CODE_10 === undefined) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.EQUIP_CODE_10 === undefined) {
      myObj.message.create("error", "「機台碼」不可為空");
      return;
    } else if (this.GRADE_NO_10 === undefined) {
      myObj.message.create("error", "「鋼種」不可為空");
      return;
    } else if (this.LENGTH_MIN_10 === undefined) {
      myObj.message.create("error", "「長度最小值」不可為空");
      return;
    } else if (this.LENGTH_MAX_10 === undefined) {
      myObj.message.create("error", "「長度最大值」不可為空");
      return;
    } else if (this.DIA_MIN_10 === undefined) {
      myObj.message.create("error", "「最小尺寸」不可為空");
      return;
    } else if (this.DIA_MAX_10 === undefined) {
      myObj.message.create("error", "「最大尺寸」不可為空");
      return;
    } else if (this.TOTAL_TIMES_10 === undefined) {
      myObj.message.create("error", "「總時間(分/批)」不可為空");
      return;
    } else if (this.PICKLING_TIMES_10 === undefined) {
      myObj.message.create("error", "「浸酸時間(分/批)」不可為空");
      return;
    } else if (this.WASHING_TIMES_10 === undefined) {
      myObj.message.create("error", "「清洗時間(分/批)」不可為空");
      return;
    } else if (this.DRAINING_TIMES_10 === undefined) {
      myObj.message.create("error", "「瀝乾時間(分/批)」不可為空");
      return;
    } else if (this.BATCH_CNT_10 === undefined) {
      myObj.message.create("error", "「投入上限值(捆/批)」不可為空");
      return;
    }else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave10(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }

   // insert4
   insertTab4() {
    let myObj = this;
    if (this.EQUIP_CODE_4 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.DIA_MIN_4 === undefined) {
      myObj.message.create("error", "「產出尺寸最小值」不可為空");
      return;
    }  else if (this.DIA_MAX_4 === undefined) {
      myObj.message.create("error", "「產出尺寸最大值」不可為空");
      return;
    }   else if (this.SHAPE_TYPE_4 === undefined) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    }   else if (this.BIG_ADJUST_CODE_4 === undefined) {
      myObj.message.create("error", "「大調機代碼」不可為空");
      return;
    }   else if (this.SMALL_ADJUST_TOLERANCE_4 === undefined) {
      myObj.message.create("error", "「小調機公差標準」不可為空");
      return;
    }   else if (this.FURANCE_BATCH_QTY_4 === undefined) {
      myObj.message.create("error", "「爐批數量」不可為空");
      return;
    }else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave4(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // insert05
  insertTab05() {
    let myObj = this;
    if (this.SHOP_CODE_5 === undefined) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.EQUIP_CODE_5 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    }  else if (this.SHAPE_TYPE_5 === undefined) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    }   else if (this.GRADE_GROUP_5 === undefined) {
      myObj.message.create("error", "「鋼種分類」不可為空");
      return;
    } else if (this.REDUCTION_RATE_MIN_5 === undefined) {
      myObj.message.create("error", "「減面率最小值」不可為空");
      return;
    }   else if (this.REDUCTION_RATE_MAX_5 === undefined) {
      myObj.message.create("error", "「減面率最大值」不可為空");
      return;
    }   else if (this.DIA_MAX_5 === undefined) {
      myObj.message.create("error", "「產出最大尺寸」不可為空");
      return;
    } else if (this.DIA_MIN_5 === undefined) {
      myObj.message.create("error", "「產出最小尺寸」不可為空");
      return;
    } else if (this.SPEED_5 === undefined) {
      myObj.message.create("error", "「線速」不可為空");
      return;
    } else if (this.EQUIP_CAP_5 === undefined) {
      myObj.message.create("error", "「日產出量」不可為空");
      return;
    }else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave05(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // // insert10
  // insertTab10() {
  //   let myObj = this;
  //   if (this.SHOP_CODE_10 === undefined) {
  //     myObj.message.create("error", "「站號」不可為空");
  //     return;
  //   } else if (this.EQUIP_CODE_10 === undefined) {
  //     myObj.message.create("error", "「機台碼」不可為空");
  //     return;
  //   } else if (this.GRADE_NO_10 === undefined) {
  //     myObj.message.create("error", "「鋼種」不可為空");
  //     return;
  //   } else if (this.LENGTH_MIN_10 === undefined) {
  //     myObj.message.create("error", "「長度最小值」不可為空");
  //     return;
  //   } else if (this.LENGTH_MAX_10 === undefined) {
  //     myObj.message.create("error", "「長度最大值」不可為空");
  //     return;
  //   } else if (this.DIA_MIN_10 === undefined) {
  //     myObj.message.create("error", "「最小尺寸」不可為空");
  //     return;
  //   } else if (this.DIA_MAX_10 === undefined) {
  //     myObj.message.create("error", "「最大尺寸」不可為空");
  //     return;
  //   } else if (this.TOTAL_TIMES_10 === undefined) {
  //     myObj.message.create("error", "「總時間(分/批)」不可為空");
  //     return;
  //   } else if (this.PICKLING_TIMES_10 === undefined) {
  //     myObj.message.create("error", "「浸酸時間(分/批)」不可為空");
  //     return;
  //   } else if (this.WASHING_TIMES_10 === undefined) {
  //     myObj.message.create("error", "「清洗時間(分/批)」不可為空");
  //     return;
  //   } else if (this.DRAINING_TIMES_10 === undefined) {
  //     myObj.message.create("error", "「瀝乾時間(分/批)」不可為空");
  //     return;
  //   } else if (this.BATCH_CNT_10 === undefined) {
  //     myObj.message.create("error", "「投入上限值(捆/批)」不可為空");
  //     return;
  //   }else {
  //     this.Modal.confirm({
  //       nzTitle: '是否確定新增',
  //       nzOnOk: () => {
  //         this.insertSave10(1)
  //       },
  //       nzOnCancel: () =>
  //         console.log("cancel")
  //     });
  //   }
  // }
    // insert17
  insertTab17(){
    let myObj = this;
    if (this.EQUIP_CODE_17 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.DIA_MIN_17 === undefined) {
      myObj.message.create("error", "「產出尺寸最小值」不可為空");
      return;
    }  else if (this.DIA_MAX_17 === undefined) {
      myObj.message.create("error", "「產出尺寸最大值」不可為空");
      return;
    }   else if (this.SHAPE_TYPE_17 === undefined) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    }   else if (this.SMALL_ADJUST_CODE_17 === undefined) {
      myObj.message.create("error", "「小調機代碼」不可為空");
      return;
    }   else if (this.SMALL_ADJUST_TOLERANCE_17 === undefined) {
      myObj.message.create("error", "「小調機公差標準」不可為空");
      return;
    }   else if (this.FURANCE_BATCH_QTY_17 === undefined) {
      myObj.message.create("error", "「爐批數量」不可為空");
      return;
    }else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave17(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // insert20
  insertTab20() {
    let myObj = this;
    if (this.EQUIP_CODE_20 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.KIND_TYPE_20 === undefined) {
      myObj.message.create("error", "「產品種類」不可為空");
      return;
    }  else if (this.OUTPUT_SHAPE_20 === undefined) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    }   else if (this.PROCESS_CODE_20 === undefined) {
      myObj.message.create("error", "「製程碼」不可為空");
      return;
    }   else if (this.FINAL_PROCESS_20 === undefined) {
      myObj.message.create("error", "「FINAL_製程」不可為空");
      return;
    }   else if (this.SCHE_TYPE_20 === undefined) {
      myObj.message.create("error", "「抽數別」不可為空");
      return;
    }else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave20(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// update
  editRow(id: string, _type): void {
    if(_type === 1) {
      this.editCache1[id].edit = true;
    } else if (_type === 2) {
      this.editCache7[id].edit = true;
    } else if (_type === 13) {
      this.editCache13[id].edit = true;
    } else if (_type === 16) {
      this.editCache16[id].edit = true;
    } else if (_type === 14) {
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
  }

  // update2
  editRow2(id: string, _type): void {
    if(_type === 1) {
      this.editCache2[id].edit = true;
    }
  }
  
  // update3
  editRow3(id: string, _type): void {
    if(_type === 1) {
      this.editCache3[id].edit = true;
    }
  }
  // update4
  editRow4(id: string, _type): void {
    if(_type === 1) {
      this.editCache4[id].edit = true;
    }
  }
  // update5
  editRow05(id: string, _type): void {
    if(_type === 1) {
      this.editCache05[id].edit = true;
    }
  }
  // update8
  editRow8(id: string, _type): void {
    if(_type === 1) {
      this.editCache8[id].edit = true;
    }
  }
  // update9
  editRow9(id: string, _type): void {
    if(_type === 1) {
      this.editCache9[id].edit = true;
    }
  }
  // update10
  editRow10(id: string, _type): void {
    if(_type === 1) {
      this.editCache10[id].edit = true;
    }
  }
  // update17
  editRow17(id: string, _type): void {
    
    if(_type === 1) {
      this.editCache17[id].edit = true;
    }
  }
  // update20
  editRow20(id: string, _type): void {
    if(_type === 1) {
      this.editCache20[id].edit = true;
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    } else if (_type === 2) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    } else if (_type === 13) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    } else if (_type === 16) {
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
  // delete2
  deleteRow2(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID2(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // delete3
  deleteRow3(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID3(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // delete4
  deleteRow4(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID4(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // delete05
  deleteRow05(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID05(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // delete8
  deleteRow8(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID8(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // delete9
  deleteRow9(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID9(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // delete10
  deleteRow10(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID10(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // delete17
  deleteRow17(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID17(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  // delete20
  deleteRow20(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID20(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // cancel
  cancelEdit(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP01List.findIndex(item => item.id === id);
      this.editCache1[id] = {
        data: { ...this.PPSINP01List[index] },
        edit: false
      };
    } else if(_type === 2) {
      const index = this.PPSINP07List.findIndex(item => item.id === id);
      this.editCache7[id] = {
        data: { ...this.PPSINP07List[index] },
        edit: false
      };
    } else if(_type === 13) {
      const index = this.PPSINP13List.findIndex(item => item.id === id);
      this.editCache13[id] = {
        data: { ...this.PPSINP13List[index] },
        edit: false
      };
    } else if(_type === 14) {
      const index = this.tbppsm012List.findIndex(item => item.id === id);
      this.editCache14[id] = {
        data: { ...this.tbppsm012List[index] },
        edit: false
      };
      this.editColse14 = false;
    }
  }
  // cancel2
  cancelEdit2(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP02List.findIndex(item => item.id === id);
      this.editCache2[id] = {
        data: { ...this.PPSINP02List[index] },
        edit: false
      };
    }
  }
  // cancel3
  cancelEdit3(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP03List.findIndex(item => item.id === id);
      this.editCache3[id] = {
        data: { ...this.PPSINP03List[index] },
        edit: false
      };
    }
  }
  // cancel4
  cancelEdit4(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP04List.findIndex(item => item.id === id);
      this.editCache4[id] = {
        data: { ...this.PPSINP04List[index] },
        edit: false
      };
    }
  }
  // cancel05
  cancelEdit05(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP05List.findIndex(item => item.id === id);
      this.editCache05[id] = {
        data: { ...this.PPSINP05List[index] },
        edit: false
      };
    }
  }
  // cancel8
  cancelEdit8(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP08List.findIndex(item => item.id === id);
      this.editCache8[id] = {
        data: { ...this.PPSINP08List[index] },
        edit: false
      };
    }
  }
  // cancel9
  cancelEdit9(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP09List.findIndex(item => item.id === id);
      this.editCache9[id] = {
        data: { ...this.PPSINP09List[index] },
        edit: false
      };
    }
  }
  // cancel10
  cancelEdit10(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP10List.findIndex(item => item.id === id);
      this.editCache10[id] = {
        data: { ...this.PPSINP10List[index] },
        edit: false
      };
    }
  }
  // cancel17
  cancelEdit17(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP17List.findIndex(item => item.id === id);
      this.editCache17[id] = {
        data: { ...this.PPSINP17List[index] },
        edit: false
      };
    }
  }
  // cancel20
  cancelEdit20(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP20List.findIndex(item => item.id === id);
      this.editCache20[id] = {
        data: { ...this.PPSINP20List[index] },
        edit: false
      };
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    } else if (_type === 2) {
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
            this.updateSave(id, 2)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    } else if (_type === 13) {
      let myObj = this;
      if (this.editCache13[id].data.GRADE_NO_13 === undefined) {
        myObj.message.create("error", "「輸入鋼種」不可為空");
        return;
      } else if (this.editCache13[id].data.OUT_TYPE === undefined) {
        myObj.message.create("error", "「產出型態」不可為空");
        return;
      } else if (this.editCache13[id].data.DIA_MIN === undefined) {
        myObj.message.create("error", "「產出成品尺寸最小值」不可為空");
        return;
      } else if (this.editCache13[id].data.DIA_MAX === undefined) {
        myObj.message.create("error", "「產出成品尺寸最大值」不可為空");
        return;
      } else if (this.editCache13[id].data.GRINDING_PASS === undefined) {
        myObj.message.create("error", "「研磨道次」不可為空");
        return;
      } else if (this.editCache13[id].data.GRINDING_SIZE === undefined) {
        myObj.message.create("error", "「每刀研磨尺寸」不可為空");
        return;
      }else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave(id, 13)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    } else if (_type === 16) {
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
            this.updateSave(id, 16)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    } else if (_type === 14) {
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
            this.updateSave(id, 14)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  // update Save2
  saveEdit2(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache2[id])

      let myObj = this;
      if (this.editCache2[id].data.SHOP_CODE_2 === undefined) {
        myObj.message.create("error", "「站號」不可為空");
        return;
      } else if (this.editCache2[id].data.EQUIP_GROUP_2 === undefined) {
        myObj.message.create("error", "「機台群組」不可為空");
        return;
      } else if (this.editCache2[id].data.EQUIP_CODE_2 === undefined) {
        myObj.message.create("error", "「機台」不可為空");
        return;
      } else if (this.editCache2[id].data.PROCESS_CODE_2 === undefined) {
        myObj.message.create("error", "「製程碼」不可為空");
        return;
      } else if (this.editCache2[id].data.GRADE_GROUP_2 === undefined) {
        myObj.message.create("error", "「鋼種類別」不可為空");
        return;
      } else if (this.editCache2[id].data.SHAPE_TYPE_2 === undefined) {
        myObj.message.create("error", "「形狀」不可為空");
        return;
      } else if (this.editCache2[id].data.INPUT_DIA_MAX_2 === undefined) {
        myObj.message.create("error", "「投入尺寸上限」不可為空");
        return;
      } else if (this.editCache2[id].data.CAPABILITY_DIA_MIN_2 === undefined) {
        myObj.message.create("error", "「設備能力最小尺寸」不可為空");
        return;
      } else if (this.editCache2[id].data.CAPABILITY_DIA_MAX_2 === undefined) {
        myObj.message.create("error", "「設備能力最大尺寸」不可為空");
        return;
      } else if (this.editCache2[id].data.CAPABILITY_LENGTH_MIN_2 === undefined) {
        myObj.message.create("error", "「設備能力最小長度」不可為空");
        return;
      } else if (this.editCache2[id].data.CAPABILITY_LENGTH_MAX_2 === undefined) {
        myObj.message.create("error", "「設備能力最大長度」不可為空");
        return;
      } else if (this.editCache2[id].data.OPTIMAL_DIA_MIN_2 === undefined) {
        myObj.message.create("error", "「最佳能力最小尺寸」不可為空");
        return;
      } else if (this.editCache2[id].data.OPTIMAL_DIA_MAX_2 === undefined) {
        myObj.message.create("error", "「最佳能力最大尺寸」不可為空");
        return;
      } else if (this.editCache2[id].data.OPTIMAL_LENGTH_MIN_2 === undefined) {
        myObj.message.create("error", "「最佳能力最小長度」不可為空");
        return;
      } else if (this.editCache2[id].data.OPTIMAL_LENGTH_MAX_2 === undefined) {
        myObj.message.create("error", "「上最佳能力最大長度」不可為空");
        return;
      } else if (this.editCache2[id].data.OPTION_EQUIP_1_2 === undefined) {
        myObj.message.create("error", "「替代機台順位1」不可為空");
        return;
      } else if (this.editCache2[id].data.OPTION_EQUIP_2_2 === undefined) {
        myObj.message.create("error", "「替代機台順位2」不可為空");
        return;
      } else if (this.editCache2[id].data.OPTION_EQUIP_3_2 === undefined) {
        myObj.message.create("error", "「替代機台順位3」不可為空");
        return;
      } 
      else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave2(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  // update Save3
  saveEdit3(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache3[id])

      let myObj = this;
      if (this.editCache3[id].data.EQUIP_CODE === undefined) {
        myObj.message.create("error", "「機台」不可為空");
        return;
      } else if (this.editCache3[id].data.LOAD_TIME === undefined) {
        myObj.message.create("error", "「上下料」不可為空");
        return;
      } else if (this.editCache3[id].data.TRANSFER_TIME === undefined) {
        myObj.message.create("error", "「搬運」不可為空");
        return;
      }  else if (this.editCache3[id].data.OTHER_TIME === undefined) {
        myObj.message.create("error", "「其他整備」不可為空");
        return;
      }  else if (this.editCache3[id].data.BIG_ADJUST_TIME === undefined) {
        myObj.message.create("error", "「大調機」不可為空");
        return;
      }  else if (this.editCache3[id].data.SMALL_ADJUST_TIME === undefined) {
        myObj.message.create("error", "「小調機」不可為空");
        return;
      }  else if (this.editCache3[id].data.RETURN_TIME === undefined) {
        myObj.message.create("error", "「退料」不可為空");
        return;
      }   else if (this.editCache3[id].data.COOLING_TIME === undefined) {
        myObj.message.create("error", "「冷卻」不可為空");
        return;
      } else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave3(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  // update Save4
  saveEdit4(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache4[id])

      let myObj = this;
      if (this.editCache4[id].data.EQUIP_CODE_4 === undefined) {
        myObj.message.create("error", "「機台」不可為空");
        return;
      } else if (this.editCache4[id].data.DIA_MIN_4 === undefined) {
        myObj.message.create("error", "「產出尺寸最小值」不可為空");
        return;
      } else if (this.editCache4[id].data.DIA_MAX_4 === undefined) {
        myObj.message.create("error", "「產出尺寸最大值」不可為空");
        return;
      } else if (this.editCache4[id].data.SHAPE_TYPE_4 === undefined) {
        myObj.message.create("error", "「產出型態」不可為空");
        return;
      } else if (this.editCache4[id].data.BIG_ADJUST_CODE_4 === undefined) {
        myObj.message.create("error", "「大調機代碼」不可為空");
        return;
      } else if (this.editCache4[id].data.SMALL_ADJUST_TOLERANCE_4 === undefined) {
        myObj.message.create("error", "「小調機公差標準」不可為空");
        return;
      } else if (this.editCache4[id].data.FURANCE_BATCH_QTY_4 === undefined) {
        myObj.message.create("error", "「爐批數量」不可為空");
        return;
      } else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave4(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  // update Save05
  saveEdit05(id: string, _type): void {
    if(_type === 1) {
      console.log("更改05線速表");
      console.log(this.editCache05[id]);

      let myObj = this;
      if (this.editCache05[id].data.SHOP_CODE_5 === undefined) {
        myObj.message.create("error", "「線別」不可為空");
        return;
      } else if (this.editCache05[id].data.EQUIP_CODE_5 === undefined) {
        myObj.message.create("error", "「機台」不可為空");
        return;
      }  else if (this.editCache05[id].data.SHAPE_TYPE_5 === undefined) {
        myObj.message.create("error", "「產品型態」不可為空");
        return;
      }   else if (this.editCache05[id].data.GRADE_GROUP_5 === undefined) {
        myObj.message.create("error", "「鋼種群組」不可為空");
        return;
      } else if (this.editCache05[id].data.REDUCTION_RATE_MIN_5 === undefined) {
        myObj.message.create("error", "「減面率MIN」不可為空");
        return;
      }   else if (this.editCache05[id].data.REDUCTION_RATE_MAX_5 === undefined) {
        myObj.message.create("error", "「減面率MAX」不可為空");
        return;
      }   else if (this.editCache05[id].data.DIA_MAX_5 === undefined) {
        myObj.message.create("error", "「最大產出尺寸」不可為空");
        return;
      } else if (this.editCache05[id].data.DIA_MIN_5 === undefined) {
        myObj.message.create("error", "「最小產出尺寸不可為空");
        return;
      } else if (this.editCache05[id].data.SPEED_5 === undefined) {
        myObj.message.create("error", "「線速」不可為空");
        return;
      } else if (this.editCache05[id].data.EQUIP_CAP_5 === undefined) {
        myObj.message.create("error", "「日產出量」不可為空");
        return;}
        else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave05(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  // update Save8
  saveEdit8(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache8[id])

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
            this.updateSave8(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  // update Save9
  saveEdit9(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache9[id])

      let myObj = this;
      if (this.editCache9[id].data.SHOP_CODE_9 === undefined) {
        myObj.message.create("error", "「站號」不可為空");
        return;
      } else if (this.editCache9[id].data.EQUIP_CODE_9 === undefined) {
        myObj.message.create("error", "「機台」不可為空");
        return;
      } else if (this.editCache9[id].data.OP_CODE_9 === undefined) {
        myObj.message.create("error", "「作業代碼」不可為空");
        return;
      } else if (this.editCache9[id].data.TEMPERATURE_9 === undefined) {
        myObj.message.create("error", "「溫度」不可為空");
        return;
      } else if (this.editCache9[id].data.FREQUENCY_9 === undefined) {
        myObj.message.create("error", "「頻率」不可為空");
        return;
      } else if (this.editCache9[id].data.STEEL_GRADE_MIN_9 === undefined) {
        myObj.message.create("error", "「每噸花時間」不可為空");
        return;
      } else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave9(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  // update Save10
  saveEdit10(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache10[id])
      let myObj = this;
      if (this.editCache10[id].data.SHOP_CODE_10 === undefined) {
        myObj.message.create("error", "「站號」不可為空");
        return;
      } else if (this.editCache10[id].data.EQUIP_CODE_10 === undefined) {
        myObj.message.create("error", "「機台碼」不可為空");
        return;
      } else if (this.editCache10[id].data.GRADE_NO_10 === undefined) {
        myObj.message.create("error", "「鋼種」不可為空");
        return;
      }  else if (this.editCache10[id].data.LENGTH_MIN_10 === undefined) {
        myObj.message.create("error", "「長度最小值」不可為空");
        return;
      }  else if (this.editCache10[id].data.LENGTH_MAX_10 === undefined) {
        myObj.message.create("error", "「長度最大值」不可為空");
        return;
      }  else if (this.editCache10[id].data.DIA_MIN_10 === undefined) {
        myObj.message.create("error", "「最小尺寸」不可為空");
        return;
      }   else if (this.editCache10[id].data.DIA_MAX_10 === undefined) {
        myObj.message.create("error", "「最大尺寸」不可為空");
        return;
      }   else if (this.editCache10[id].data.TOTAL_TIMES_10 === undefined) {
        myObj.message.create("error", "「總時間」不可為空");
        return;
      }   else if (this.editCache10[id].data.PICKLING_TIMES_10 === undefined) {
        myObj.message.create("error", "「浸酸時間」不可為空");
        return;
      }   else if (this.editCache10[id].data.WASHING_TIMES_10 === undefined) {
        myObj.message.create("error", "「清洗時間」不可為空");
        return;
      }   else if (this.editCache10[id].data.DRAINING_TIMES_10 === undefined) {
        myObj.message.create("error", "「瀝乾時間」不可為空");
        return;
      }   else if (this.editCache10[id].data.DIA_MAX_10 === undefined) {
        myObj.message.create("error", "「投入上限值」不可為空");
        return;
      } else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave10(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  // update Save17
  saveEdit17(id: string, _type): void {
    if(_type === 1) {
      
      
      let myObj = this;
      if (this.editCache17[id].data.EQUIP_CODE_17 === undefined) {
        myObj.message.create("error", "「機台」不可為空");
        return;
      } else if (this.editCache17[id].data.DIA_MIN_17 === undefined) {
        myObj.message.create("error", "「產出尺寸最小值」不可為空");
        return;
      } else if (this.editCache17[id].data.DIA_MAX_17 === undefined) {
        myObj.message.create("error", "「產出尺寸最大值」不可為空");
        return;
      }  else if (this.editCache17[id].data.SHAPE_TYPE_17 === undefined) {
        myObj.message.create("error", "「產出型態」不可為空");
        return;
      }  else if (this.editCache17[id].data.SMALL_ADJUST_CODE_17 === undefined) {
        myObj.message.create("error", "「大調機代碼」不可為空");
        return;
      }  else if (this.editCache17[id].data.SMALL_ADJUST_TOLERANCE_17 === undefined) {
        myObj.message.create("error", "「小調機公差標準」不可為空");
        return;
      }   else if (this.editCache17[id].data.FURANCE_BATCH_QTY_17 === undefined) {
        myObj.message.create("error", "「爐批數量」不可為空");
        return;
      } else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave17(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  // update Save20
  saveEdit20(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache20[id])

      let myObj = this;
      if (this.editCache20[id].data.EQUIP_CODE_20 === undefined) {
        myObj.message.create("error", "「機台」不可為空");
        return;
      } else if (this.editCache20[id].data.KIND_TYPE_20 === undefined) {
        myObj.message.create("error", "「產品種類」不可為空");
        return;
      } else if (this.editCache20[id].data.OUTPUT_SHAPE_20 === undefined) {
        myObj.message.create("error", "「產出型態」不可為空");
        return;
      } else if (this.editCache20[id].data.PROCESS_CODE_20 === undefined) {
        myObj.message.create("error", "「製程碼」不可為空");
        return;
      } else if (this.editCache20[id].data.FINAL_PROCESS_20 === undefined) {
        myObj.message.create("error", "「FINAL_製程」不可為空");
        return;
      } else if (this.editCache20[id].data.SCHE_TYPE_20 === undefined) {
        myObj.message.create("error", "「抽數別」不可為空");
        return;
      } else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave20(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update
  updateEditCache(_type): void {
    if(_type === 1) {
      this.PPSINP01List.forEach(item => {
        this.editCache1[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    } else if (_type === 2 ) {
      this.PPSINP07List.forEach(item => {
        this.editCache7[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    } else if (_type === 13 ) {
      this.PPSINP13List.forEach(item => {
        this.editCache13[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    } else if (_type === 16 ) {
      this.PPSINP16List.forEach(item => {
        this.editCache16[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    } else if (_type === 14 ) {
      this.tbppsm012List.forEach(item => {
        this.editCache14[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }
  // update2
  updateEditCache2(_type): void {
    if(_type === 1) {
      this.PPSINP02List.forEach(item => {
        this.editCache2[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }
  // update3
   updateEditCache3(_type): void {
    if(_type === 1) {
      this.PPSINP03List.forEach(item => {
        this.editCache3[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }
  // update4
  updateEditCache4(_type): void {
    if(_type === 1) {
      this.PPSINP04List.forEach(item => {
        this.editCache4[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }
  // update05
  updateEditCache05(_type): void {
    if(_type === 1) {
      this.PPSINP05List.forEach(item => {
        this.editCache05[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }
  // update8
  updateEditCache8(_type): void {
    if(_type === 1) {
      this.PPSINP08List.forEach(item => {
        this.editCache8[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }
  // update9
  updateEditCache9(_type): void {
    if(_type === 1) {
      this.PPSINP09List.forEach(item => {
        this.editCache9[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }
  // update10
  updateEditCache10(_type): void {
    if(_type === 1) {
      this.PPSINP10List.forEach(item => {
        this.editCache10[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }
// update17
  updateEditCache17(_type): void {
  if(_type === 1) {
    this.PPSINP17List.forEach(item => {
      this.editCache17[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  }
  // update20
  updateEditCache20(_type): void {
    if(_type === 1) {
      this.PPSINP20List.forEach(item => {
        this.editCache20[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  changeTab(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getPPSINP01List();
    } else if( tab === 2 ) {
      this.getPPSINP07List();
    } else if( tab === 13 ) {
      this.getPPSINP13List();
    } else if( tab === 16 ) {
      this.getPPSINP16List();
    } else if( tab === 14 ) {
      this.gettbppsm102List();
    }
  }
  changeTab2(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getPPSINP02List();
    }
  }
  changeTab3(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getPPSINP03List();
    }
  }
  changeTab4(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getPPSINP04List();
    }
  }
  changeTab05(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getPPSINP05List();
    }
  }
  changeTab8(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getPPSINP08List();
    }
  }
  changeTab9(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getPPSINP09List();
    }
  }
  changeTab10(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getPPSINP10List();
    }
  }
  changeTab17(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getPPSINP17List();
    }
  }
  changeTab20(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getPPSINP20List();
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    } else if (_type === 2) {
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
    } else if (_type === 13) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          GRADE_NO: this.GRADE_NO_13,
          OUT_TYPE : this.OUT_TYPE,
          DIA_MIN : this.DIA_MIN,
          DIA_MAX : this.DIA_MAX,
          GRINDING_PASS : this.GRINDING_PASS,
          GRINDING_SIZE : this.GRINDING_SIZE,
        })

        myObj.PPSService.insertI113Tab1Save(obj).subscribe(res => {
          
          console.log(res)
          if(res[0].MSG === "Y") {
            this.GRADE_NO_13 = undefined;
            this.OUT_TYPE = undefined;
            this.DIA_MIN = undefined;
            this.DIA_MAX = undefined;
            this.GRINDING_PASS = undefined;
            this.GRINDING_SIZE = undefined;
            this.getPPSINP13List();
            this.sucessMSG("新增成功", ``);
            this.isVisibleGrinding = false;
          } else {
            this.errorMSG("新增失敗", res[0].MSG);
          }
        },err => {
          reject('upload fail');
          this.errorMSG("新增失敗", "後台新增錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    } else if (_type === 16) {
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
            this.DIA_MIN = undefined;
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
  }
  // 新增資料2
  insertSave2(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          SHOP_CODE: this.SHOP_CODE_2,
          EQUIP_GROUP: this.EQUIP_GROUP_2,
          EQUIP_CODE: this.EQUIP_CODE_2,
          PROCESS_CODE: this.PROCESS_CODE_2,
          GRADE_GROUP: this.GRADE_GROUP_2,
          SHAPE_TYPE: this.SHAPE_TYPE_2,
          INPUT_DIA_MAX: this.INPUT_DIA_MAX_2,
          CAPABILITY_DIA_MIN: this.CAPABILITY_DIA_MIN_2,
          CAPABILITY_DIA_MAX: this.CAPABILITY_DIA_MAX_2,
          CAPABILITY_LENGTH_MIN: this.CAPABILITY_LENGTH_MIN_2,
          CAPABILITY_LENGTH_MAX: this.CAPABILITY_LENGTH_MAX_2,
          OPTIMAL_DIA_MIN: this.OPTIMAL_DIA_MIN_2,
          OPTIMAL_DIA_MAX: this.OPTIMAL_DIA_MAX_2,
          OPTIMAL_LENGTH_MIN: this.OPTIMAL_LENGTH_MIN_2,
          OPTIMAL_LENGTH_MAX: this.OPTIMAL_LENGTH_MAX_2,
          OPTION_EQUIP_1: this.OPTION_EQUIP_1_2,
          OPTION_EQUIP_2: this.OPTION_EQUIP_2_2,
          OPTION_EQUIP_3: this.OPTION_EQUIP_3_2,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })

        myObj.PPSService.insertI102Tab1Save(obj).subscribe(res => {

          console.log(res)
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_2 = undefined;
            this.EQUIP_GROUP_2 = undefined;
            this.EQUIP_CODE_2 = undefined;
            this.PROCESS_CODE_2 = undefined;
            this.GRADE_GROUP_2 = undefined;
            this.SHAPE_TYPE_2 = undefined;
            this.INPUT_DIA_MAX_2 = undefined;
            this.CAPABILITY_DIA_MIN_2 = undefined;
            this.CAPABILITY_DIA_MAX_2 = undefined;
            this.CAPABILITY_LENGTH_MIN_2 = undefined;
            this.CAPABILITY_LENGTH_MAX_2 = undefined;
            this.OPTIMAL_DIA_MIN_2 = undefined;
            this.OPTIMAL_DIA_MAX_2 = undefined;
            this.OPTIMAL_LENGTH_MIN_2 = undefined;
            this.OPTIMAL_LENGTH_MAX_2 = undefined;
            this.OPTION_EQUIP_1_2 = undefined;
            this.OPTION_EQUIP_2_2 = undefined;
            this.OPTION_EQUIP_3_2 = undefined;
            this.getPPSINP02List();
            this.sucessMSG("新增成功", ``);
            this.isVisibleCapability = false;
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
  // 新增資料3
  insertSave3(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          EQUIP_CODE : this.EQUIP_CODE,
          LOAD_TIME : this.LOAD_TIME,
          TRANSFER_TIME : this.TRANSFER_TIME,
          OTHER_TIME : this.OTHER_TIME,
          BIG_ADJUST_TIME : this.BIG_ADJUST_TIME,
          SMALL_ADJUST_TIME : this.SMALL_ADJUST_TIME,
          RETURN_TIME : this.RETURN_TIME,
          COOLING_TIME : this.COOLING_TIME,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })

        myObj.PPSService.insertI103Tab1Save(obj).subscribe(res => {

          console.log(res)
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE = undefined;
            this.LOAD_TIME = undefined;
            this.TRANSFER_TIME = undefined;
            this.OTHER_TIME = undefined;
            this.BIG_ADJUST_TIME = undefined;
            this.SMALL_ADJUST_TIME = undefined;
            this.RETURN_TIME = undefined;
            this.COOLING_TIME = undefined;
            this.getPPSINP03List();
            this.sucessMSG("新增成功", ``);
            this.isVisiblePrepare = false;
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
  // 新增資料4
  insertSave4(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          EQUIP_CODE : this.EQUIP_CODE_4,
          DIA_MIN : this.DIA_MIN_4,
          DIA_MAX : this.DIA_MAX_4,
          SHAPE_TYPE : this.SHAPE_TYPE_4,
          BIG_ADJUST_CODE : this.BIG_ADJUST_CODE_4,
          SMALL_ADJUST_TOLERANCE : this.SMALL_ADJUST_TOLERANCE_4,
          FURANCE_BATCH_QTY : this.FURANCE_BATCH_QTY_4,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })

        myObj.PPSService.insertI104Tab1Save(obj).subscribe(res => {

          console.log(res)
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE_4 = undefined;
            this.DIA_MIN_4 = undefined;
            this.DIA_MAX_4 = undefined;
            this.SHAPE_TYPE_4 = undefined;
            this.BIG_ADJUST_CODE_4 = undefined;
            this.SMALL_ADJUST_TOLERANCE_4 = undefined;
            this.FURANCE_BATCH_QTY_4 = undefined;
            this.getPPSINP04List();
            this.sucessMSG("新增成功", ``);
            this.isVisibleBigAdjust = false;
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

  // 新增資料5
  insertSave05(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {

        let obj = {};
        _.extend(obj, {
          SHOP_CODE:this.SHOP_CODE_5,
          EQUIP_CODE:this.EQUIP_CODE_5,
          SHAPE_TYPE:this.SHAPE_TYPE_5,
          GRADE_GROUP:this.GRADE_GROUP_5,
          SPEED_TYPE:this.SPEED_TYPE_5,
          REDUCTION_RATE_MIN:this.REDUCTION_RATE_MIN_5,
          REDUCTION_RATE_MAX:this.REDUCTION_RATE_MAX_5,
          DIA_MAX:this.DIA_MAX_5,
          DIA_MIN:this.DIA_MIN_5,
          SPEED:this.SPEED_5,
          EQUIP_CAP:this.EQUIP_CAP_5,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })

        myObj.PPSService.insertI105Tab1Save(obj).subscribe(res => {
          console.log(res)
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_5 = undefined;
            this.EQUIP_CODE_5 = undefined;
            this.SHAPE_TYPE_5 = undefined;
            this.GRADE_GROUP_5 = undefined;
            this.SPEED_TYPE_5 = undefined;
            this.REDUCTION_RATE_MIN_5 = undefined;
            this.REDUCTION_RATE_MAX_5 = undefined;
            this.DIA_MAX_5 = undefined;
            this.DIA_MIN_5 = undefined;
            this.SPEED_5 = undefined;
            this.EQUIP_CAP_5 = undefined;
            this.getPPSINP05List();
            this.sucessMSG("新增成功", ``);
            this.isVisibleSpeed = false;
          } else {
            this.errorMSG("新增失敗", res[0].MSG);
          }
        },err => {
          reject('upload fail');
          this.errorMSG("05新增失敗", "後台新增錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    } 
  }
  // 新增資料8
  insertSave8(_type) {
    if(_type === 1) {
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
  }
  // 新增資料9
  insertSave9(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          SHOP_CODE : this.SHOP_CODE_9,
          EQUIP_CODE : this.EQUIP_CODE_9,
          OP_CODE : this.OP_CODE_9,
          TEMPERATURE : this.TEMPERATURE_9,
          FREQUENCY : this.FREQUENCY_9,
          STEEL_GRADE_MIN : this.STEEL_GRADE_MIN_9,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })

        myObj.PPSService.insertI109Tab1Save(obj).subscribe(res => {

          console.log(res)
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_9 = undefined;
            this.EQUIP_CODE_9 = undefined;
            this.OP_CODE_9 = undefined;
            this.TEMPERATURE_9 = undefined;
            this.FREQUENCY_9 = undefined;
            this.STEEL_GRADE_MIN_9 = undefined;
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
  }
  // 新增資料10
  insertSave10(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          SHOP_CODE : this.SHOP_CODE_10,
          EQUIP_CODE : this.EQUIP_CODE_10,
          GRADE_NO : this.GRADE_NO_10,
          LENGTH_MIN : this.LENGTH_MIN_10,
          LENGTH_MAX : this.LENGTH_MAX_10,
          DIA_MIN : this.DIA_MIN_10,
          DIA_MAX : this.DIA_MAX_10,
          TOTAL_TIMES : this.TOTAL_TIMES_10,
          PICKLING_TIMES : this.PICKLING_TIMES_10,
          WASHING_TIMES : this.WASHING_TIMES_10,
          DRAINING_TIMES : this.DRAINING_TIMES_10,
          BATCH_CNT : this.BATCH_CNT_10,

          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })

        myObj.PPSService.insertI110Tab1Save(obj).subscribe(res => {

          console.log(res)
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_10 = undefined;
            this.EQUIP_CODE_10 = undefined;
            this.GRADE_NO_10 = undefined;
            this.LENGTH_MIN_10 = undefined;
            this.LENGTH_MAX_10 = undefined;
            this.DIA_MIN_10 = undefined;
            this.DIA_MAX_10 = undefined;
            this.TOTAL_TIMES_10 = undefined;
            this.PICKLING_TIMES_10 = undefined;
            this.WASHING_TIMES_10 = undefined;
            this.DRAINING_TIMES_10 = undefined;
            this.BATCH_CNT_10 = undefined;

            this.getPPSINP10List();
            this.sucessMSG("新增成功", ``);
            this.isVisibleOtherShop;
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

  // 新增資料17
  insertSave17(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          EQUIP_CODE : this.EQUIP_CODE_17,
          DIA_MIN : this.DIA_MIN_17,
          DIA_MAX : this.DIA_MAX_17,
          SHAPE_TYPE : this.SHAPE_TYPE_17,
          SMALL_ADJUST_CODE : this.SMALL_ADJUST_CODE_17,
          SMALL_ADJUST_TOLERANCE : this.SMALL_ADJUST_TOLERANCE_17,
          FURANCE_BATCH_QTY : this.FURANCE_BATCH_QTY_17,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })

        myObj.PPSService.insertI117Tab1Save(obj).subscribe(res => {
          console.log(res)
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE_17 = undefined;
            this.DIA_MIN_17 = undefined;
            this.DIA_MAX_17 = undefined;
            this.SHAPE_TYPE_17 = undefined;
            this.SMALL_ADJUST_CODE_17 = undefined;
            this.SMALL_ADJUST_TOLERANCE_17 = undefined;
            this.FURANCE_BATCH_QTY_17 = undefined;
            this.getPPSINP17List();
            this.sucessMSG("新增成功", ``);
            this.isVisibleSmallAdjust = false;
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
  // 新增資料20
  insertSave20(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          EQUIP_CODE : this.EQUIP_CODE_20,
          KIND_TYPE : this.KIND_TYPE_20,
          OUTPUT_SHAPE : this.OUTPUT_SHAPE_20,
          PROCESS_CODE : this.PROCESS_CODE_20,
          FINAL_PROCESS : this.FINAL_PROCESS_20,
          SCHE_TYPE : this.SCHE_TYPE_20,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })

        myObj.PPSService.insertI120Tab1Save(obj).subscribe(res => {

          console.log(res)
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE_20 = undefined;
            this.KIND_TYPE_20 = undefined;
            this.OUTPUT_SHAPE_20 = undefined;
            this.PROCESS_CODE_20 = undefined;
            this.FINAL_PROCESS_20 = undefined;
            this.SCHE_TYPE_20 = undefined;
            this.getPPSINP20List();
            this.sucessMSG("新增成功", ``);
            this.isVisibleWash = false;
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
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    } else if (_type === 2) {
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
    } else if (_type === 13) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache13[_id].data.tab1ID,
          GRADE_NO : this.editCache13[_id].data.GRADE_NO_13,
          OUT_TYPE : this.editCache13[_id].data.OUT_TYPE,
          DIA_MIN : this.editCache13[_id].data.DIA_MIN,
          DIA_MAX : this.editCache13[_id].data.DIA_MAX,
          GRINDING_PASS : this.editCache13[_id].data.GRINDING_PASS,
          GRINDING_SIZE : this.editCache13[_id].data.GRINDING_SIZE,
        })

        myObj.PPSService.updateI113Tab1Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.GRADE_NO_13 = undefined;
            this.OUT_TYPE = undefined;
            this.DIA_MIN = undefined;
            this.DIA_MAX = undefined;
            this.GRINDING_PASS = undefined;
            this.GRINDING_SIZE = undefined;

            this.sucessMSG("修改成功", ``);

            const index = this.PPSINP13List.findIndex(item => item.id === _id);
            Object.assign(this.PPSINP13List[index], this.editCache13[_id].data);
            this.editCache13[_id].edit = false;
          } else {
            this.errorMSG("修改失敗", res[0].MSG);
          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      }); 
    } else if (_type === 16) {
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
    } else if(_type === 14) {
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
  }
  // 修改資料2
  updateSave2(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache2[_id].data.tab2ID,
          SHOP_CODE : this.editCache2[_id].data.SHOP_CODE_2,
          EQUIP_CROUP : this.editCache2[_id].data.EQUIP_GROUP_2,
          EQUIP_CODE : this.editCache2[_id].data.EQUIP_CODE_2,
          PROCESS_CODE : this.editCache2[_id].data.PROCESS_CODE_2,
          GRADE_GROUP : this.editCache2[_id].data.GRADE_GROUP_2,
          SHAPE_TYPE : this.editCache2[_id].data.SHAPE_TYPE_2,
          INPUT_DIA_MAX : this.editCache2[_id].data.INPUT_DIA_MAX_2,
          CAPABILITY_DIA_MIN : this.editCache2[_id].data.CAPABILITY_DIA_MIN_2,
          CAPABILITY_DIA_MAX : this.editCache2[_id].data.CAPABILITY_DIA_MAX_2,
          CAPABILITY_LENGTH_MIN : this.editCache2[_id].data.CAPABILITY_LENGTH_MIN_2,
          CAPABILITY_LENGTH_MAX : this.editCache2[_id].data.CAPABILITY_LENGTH_MAX_2,
          OPTION_EQUIP_1 : this.editCache2[_id].data.OPTION_EQUIP_1_2,
          OPTION_EQUIP_2 : this.editCache2[_id].data.OPTION_EQUIP_2_2,
          OPTION_EQUIP_3 : this.editCache2[_id].data.OPTION_EQUIP_3_2,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.PPSService.updateI102Tab1Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_2 = undefined;
            this.EQUIP_GROUP_2 = undefined;
            this.EQUIP_CODE_2 = undefined;
            this.PROCESS_CODE_2 = undefined;
            this.GRADE_GROUP_2 = undefined;
            this.SHAPE_TYPE_2 = undefined;
            this.INPUT_DIA_MAX_2 = undefined;
            this.CAPABILITY_DIA_MIN_2 = undefined;
            this.CAPABILITY_DIA_MAX_2 = undefined;
            this.CAPABILITY_LENGTH_MIN_2 = undefined;
            this.CAPABILITY_LENGTH_MAX_2 = undefined;
            this.OPTION_EQUIP_1_2 = undefined;
            this.OPTION_EQUIP_2_2 = undefined;
            this.OPTION_EQUIP_3_2 = undefined;

            this.sucessMSG("修改成功", ``);

            const index = this.PPSINP02List.findIndex(item => item.id === _id);
            Object.assign(this.PPSINP02List[index], this.editCache2[_id].data);
            this.editCache2[_id].edit = false;
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
  // 修改資料3
  updateSave3(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache3[_id].data.tab3ID,
          EQUIP_CODE : this.editCache3[_id].data.EQUIP_CODE,
          LOAD_TIME : this.editCache3[_id].data.LOAD_TIME,
          TRANSFER_TIME : this.editCache3[_id].data.TRANSFER_TIME,
          OTHER_TIME : this.editCache3[_id].data.OTHER_TIME,
          BIG_ADJUST_TIME : this.editCache3[_id].data.BIG_ADJUST_TIME,
          SMALL_ADJUST_TIME : this.editCache3[_id].data.SMALL_ADJUST_TIME,
          RETURN_TIME : this.editCache3[_id].data.RETURN_TIME,
          COOLING_TIME : this.editCache3[_id].data.COOLING_TIME,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.PPSService.updateI103Tab1Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE = undefined;
            this.LOAD_TIME = undefined;
            this.TRANSFER_TIME = undefined;
            this.OTHER_TIME = undefined;
            this.BIG_ADJUST_TIME = undefined;
            this.SMALL_ADJUST_TIME = undefined;
            this.RETURN_TIME = undefined;
            this.COOLING_TIME = undefined;

            this.sucessMSG("修改成功", ``);

            const index = this.PPSINP03List.findIndex(item => item.id === _id);
            Object.assign(this.PPSINP03List[index], this.editCache3[_id].data);
            this.editCache3[_id].edit = false;
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
  // 修改資料4
  updateSave4(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache4[_id].data.tab4ID,
          EQUIP_CODE : this.editCache4[_id].data.EQUIP_CODE_4,
          DIA_MIN : this.editCache4[_id].data.DIA_MIN_4,
          DIA_MAX : this.editCache4[_id].data.DIA_MAX_4,
          SHAPE_TYPE : this.editCache4[_id].data.SHAPE_TYPE_4,
          BIG_ADJUST_CODE : this.editCache4[_id].data.BIG_ADJUST_CODE_4,
          SMALL_ADJUST_TOLERANCE : this.editCache4[_id].data.SMALL_ADJUST_TOLERANCE_4,
          FURANCE_BATCH_QTY : this.editCache4[_id].data.FURANCE_BATCH_QTY_4,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.PPSService.updateI104Tab1Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE_4 = undefined;
            this.DIA_MIN_4 = undefined;
            this.DIA_MAX_4 = undefined;
            this.SHAPE_TYPE_4 = undefined;
            this.BIG_ADJUST_CODE_4 = undefined;
            this.SMALL_ADJUST_TOLERANCE_4 = undefined;
            this.FURANCE_BATCH_QTY_4 = undefined;

            this.sucessMSG("修改成功", ``);

            const index = this.PPSINP04List.findIndex(item => item.id === _id);
            Object.assign(this.PPSINP04List[index], this.editCache4[_id].data);
            this.editCache4[_id].edit = false;
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
  // 修改資料05
  updateSave05(_id, _type) 
  {
    if(_type === 1) 
    {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache05[_id].data.tab5ID,
          SHOP_CODE: this.editCache05[_id].data.SHOP_CODE_5,
          EQUIP_CODE: this.editCache05[_id].data.EQUIP_CODE_5,
          SHAPE_TYPE: this.editCache05[_id].data.SHAPE_TYPE_5,
          GRADE_GROUP: this.editCache05[_id].data.GRADE_GROUP_5,
          SPEED_TYPE: this.editCache05[_id].data.SPEED_TYPE_5,
          REDUCTION_RATE_MIN: this.editCache05[_id].data.REDUCTION_RATE_MIN_5,
          REDUCTION_RATE_MAX: this.editCache05[_id].data.REDUCTION_RATE_MAX_5,
          DIA_MAX: this.editCache05[_id].data.DIA_MAX_5,
          DIA_MIN: this.editCache05[_id].data.DIA_MIN_5,
          SPEED: this.editCache05[_id].data.DIA_MAX_5,
          EQUIP_CAP: this.editCache05[_id].data.DIA_MIN_5,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')})
        
          myObj.PPSService.updateI105Tab1Save(obj).subscribe(res => 
          {
            if(res[0].MSG === "Y") {
              this.SHOP_CODE_5 = undefined;
              this.EQUIP_CODE_5 = undefined;
              this.SHAPE_TYPE_5 = undefined;
              this.GRADE_GROUP_5 = undefined;
              this.SPEED_TYPE_5 = undefined;
              this.REDUCTION_RATE_MIN_5 = undefined;
              this.REDUCTION_RATE_MAX_5 = undefined;
              this.DIA_MAX_5 = undefined;
              this.DIA_MIN_5 = undefined;
              this.SPEED_5 = undefined;
              this.EQUIP_CAP_5 = undefined;
              this.getPPSINP05List();
              this.sucessMSG("修改成功", ``);
              const index = this.PPSINP05List.findIndex(item => item.id === _id);
              Object.assign(this.PPSINP05List[index], this.editCache05[_id].data);
              this.editCache05[_id].edit = false;
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
  // 修改資料8
  updateSave8(_id, _type) {
    if(_type === 1) {
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
  }
  // 修改資料9
  updateSave9(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache9[_id].data.tab9ID,
          SHOP_CODE : this.editCache9[_id].data.SHOP_CODE_9,
          EQUIP_CODE : this.editCache9[_id].data.EQUIP_CODE_9,
          OP_CODE : this.editCache9[_id].data.OP_CODE_9,
          TEMPERATURE : this.editCache9[_id].data.TEMPERATURE_9,
          FREQUENCY : this.editCache9[_id].data.FREQUENCY_9,
          STEEL_GRADE_MIN : this.editCache9[_id].data.STEEL_GRADE_MIN_9,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.PPSService.updateI109Tab1Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_9 = undefined;
            this.EQUIP_CODE_9 = undefined;
            this.OP_CODE_9 = undefined;
            this.TEMPERATURE_9 = undefined;
            this.FREQUENCY_9 = undefined;
            this.STEEL_GRADE_MIN_9 = undefined;

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
  }
  // 修改資料10
  updateSave10(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache10[_id].data.tab10ID,
          SHOP_CODE_10 : this.editCache10[_id].data.SHOP_CODE_10,
          EQUIP_CODE_10 : this.editCache10[_id].data.EQUIP_CODE_10,
          GRADE_NO_10 : this.editCache10[_id].data.GRADE_NO_10,
          LENGTH_MIN_10 : this.editCache10[_id].data.LENGTH_MIN_10,
          LENGTH_MAX_10 : this.editCache10[_id].data.LENGTH_MAX_10,
          DIA_MIN_10 : this.editCache10[_id].data.DIA_MIN_10,
          DIA_MAX_10 : this.editCache10[_id].data.DIA_MAX_10,
          TOTAL_TIMES_10 : this.editCache10[_id].data.TOTAL_TIMES_10,
          PICKLING_TIMES_10 : this.editCache10[_id].data.PICKLING_TIMES_10,
          WASHING_TIMES_10 : this.editCache10[_id].data.WASHING_TIMES_10,
          DRAINING_TIMES_10 : this.editCache10[_id].data.DRAINING_TIMES_10,
          BATCH_CNT_10 : this.editCache10[_id].data.BATCH_CNT_10,

          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.PPSService.updateI110Tab1Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_10 = undefined;
            this.EQUIP_CODE_10 = undefined;
            this.GRADE_NO_10 = undefined;
            this.LENGTH_MIN_10 = undefined;
            this.LENGTH_MAX_10 = undefined;
            this.DIA_MIN_10 = undefined;
            this.DIA_MAX_10 = undefined;
            this.TOTAL_TIMES_10 = undefined;
            this.PICKLING_TIMES_10 = undefined;
            this.WASHING_TIMES_10 = undefined;
            this.DRAINING_TIMES_10 = undefined;
            this.BATCH_CNT_10 = undefined;
            this.sucessMSG("修改成功", ``);
            const index = this.PPSINP10List.findIndex(item => item.id === _id);
            Object.assign(this.PPSINP10List[index], this.editCache10[_id].data);
            this.editCache10[_id].edit = false;
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
    
  // 修改資料17
  updateSave17(_id, _type) 
  {
    if(_type === 1) 
    {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache17[_id].data.tab17ID,
          EQUIP_CODE : this.editCache17[_id].data.EQUIP_CODE_17,
          DIA_MIN : this.editCache17[_id].data.DIA_MIN_17,
          DIA_MAX : this.editCache17[_id].data.DIA_MAX_17,
          SHAPE_TYPE : this.editCache17[_id].data.SHAPE_TYPE_17,
          SMALL_ADJUST_CODE : this.editCache17[_id].data.SMALL_ADJUST_CODE_17,
          SMALL_ADJUST_TOLERANCE : this.editCache17[_id].data.SMALL_ADJUST_TOLERANCE_17,
          FURANCE_BATCH_QTY : this.editCache17[_id].data.FURANCE_BATCH_QTY_17,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.PPSService.updateI117Tab1Save(obj).subscribe(res => 
          {
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE_17 = undefined;
            this.DIA_MIN_17 = undefined;
            this.DIA_MAX_17 = undefined;
            this.SHAPE_TYPE_17 = undefined;
            this.SMALL_ADJUST_CODE_17 = undefined;
            this.SMALL_ADJUST_TOLERANCE_17 = undefined;
            this.FURANCE_BATCH_QTY_17 = undefined;
            this.sucessMSG("修改成功", ``);
            const index = this.PPSINP17List.findIndex(item => item.id === _id);
            Object.assign(this.PPSINP17List[index], this.editCache17[_id].data);
            this.editCache17[_id].edit = false;
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
  // 修改資料20
  updateSave20(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID : this.editCache20[_id].data.tab20ID,
          EQUIP_CODE : this.editCache20[_id].data.EQUIP_CODE_20,
          KIND_TYPE : this.editCache20[_id].data.KIND_TYPE_20,
          OUTPUT_SHAPE : this.editCache20[_id].data.OUTPUT_SHAPE_20,
          PROCESS_CODE : this.editCache20[_id].data.PROCESS_CODE_20,
          FINAL_PROCESS : this.editCache20[_id].data.FINAL_PROCESS_20,
          SCHE_TYPE : this.editCache20[_id].data.SCHE_TYPE_20,
          USERNAME : this.USERNAME,
          DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
        })
        myObj.PPSService.updateI120Tab1Save(obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE_20 = undefined;
            this.KIND_TYPE_20 = undefined;
            this.OUTPUT_SHAPE_20 = undefined;
            this.PROCESS_CODE_20 = undefined;
            this.FINAL_PROCESS_20 = undefined;
            this.SCHE_TYPE_20 = undefined;

            this.sucessMSG("修改成功", ``);

            const index = this.PPSINP20List.findIndex(item => item.id === _id);
            Object.assign(this.PPSINP20List[index], this.editCache20[_id].data);
            this.editCache20[_id].edit = false;
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    } else if(_type === 2) {
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
    } else if(_type === 13) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache13[_id].data.tab1ID;
        myObj.PPSService.delI113Tab1Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.PLANT = undefined;
            this.SHOP_CODE = undefined;
            this.SHOP_NAME = undefined;
            this.EQUIP_CODE_1 = undefined;
            this.EQUIP_NAME = undefined;
            this.EQUIP_GROUP = undefined;
            this.VALID = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getPPSINP13List();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    } else if(_type === 16) {
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
  }
  // 刪除資料2
  delID2(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache2[_id].data.tab2ID;
        myObj.PPSService.delI102Tab1Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_2 = undefined;
            this.EQUIP_GROUP_2 = undefined;
            this.EQUIP_CODE_2 = undefined;
            this.PROCESS_CODE_2 = undefined;
            this.GRADE_GROUP_2 = undefined;
            this.SHAPE_TYPE_2 = undefined;
            this.INPUT_DIA_MAX_2 = undefined;
            this.CAPABILITY_DIA_MIN_2 = undefined;
            this.CAPABILITY_DIA_MAX_2 = undefined;
            this.CAPABILITY_LENGTH_MIN_2 = undefined;
            this.CAPABILITY_LENGTH_MAX_2 = undefined;
            this.OPTION_EQUIP_1_2 = undefined;
            this.OPTION_EQUIP_2_2 = undefined;
            this.OPTION_EQUIP_3_2 = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getPPSINP02List();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    }
  }
  // 刪除資料3
  delID3(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache3[_id].data.tab3ID;
        myObj.PPSService.delI103Tab1Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE = undefined;
            this.LOAD_TIME = undefined;
            this.TRANSFER_TIME = undefined;
            this.OTHER_TIME = undefined;
            this.BIG_ADJUST_TIME = undefined;
            this.SMALL_ADJUST_TIME = undefined;
            this.RETURN_TIME = undefined;
            this.COOLING_TIME = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getPPSINP03List();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    }
  }
  // 刪除資料4
  delID4(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache4[_id].data.tab4ID;
        myObj.PPSService.delI104Tab1Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE_4 = undefined;
            this.DIA_MIN_4 = undefined;
            this.DIA_MAX_4 = undefined;
            this.SHAPE_TYPE_4 = undefined;
            this.BIG_ADJUST_CODE_4 = undefined;
            this.SMALL_ADJUST_TOLERANCE_4 = undefined;
            this.FURANCE_BATCH_QTY_4 = undefined;

            this.sucessMSG("刪除成功", ``);
            this.getPPSINP04List();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    }
  }
  // 刪除資料05
  delID05(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        console.log("當前線速暫存區");
        console.log(this.editCache05);
        console.log("_id");
        console.log(_id);
        console.log("BBBBBB"+this.editCache05[_id]);
        let _ID = this.editCache05[_id].data.tab5ID;
        myObj.PPSService.delI105Tab1Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_5 = undefined;
            this.EQUIP_CODE_5 = undefined;
            this. SHAPE_TYPE_5 = undefined;
            this.GRADE_GROUP_5 = undefined;
            this.SPEED_TYPE_5 = undefined;
            this.REDUCTION_RATE_MIN_5 = undefined;
            this.REDUCTION_RATE_MAX_5 = undefined;
            this.DIA_MAX_5 = undefined;
            this.DIA_MIN_5 = undefined;
            this.SPEED_5 = undefined;
            this.EQUIP_CAP_5 = undefined;
            this.sucessMSG("刪除成功", ``);
            this.getPPSINP05List();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("線速刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    }
  }
  // 刪除資料8
  delID8(_id, _type) {
    if(_type === 1) {
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
  }
  // 刪除資料9
  delID9(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache9[_id].data.tab9ID;
        myObj.PPSService.delI109Tab1Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_9 = undefined;
            this.EQUIP_CODE_9 = undefined;
            this.OP_CODE_9 = undefined;
            this.TEMPERATURE_9 = undefined;
            this.FREQUENCY_9 = undefined;
            this.STEEL_GRADE_MIN_9 = undefined;

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
  }
  // 刪除資料10
  delID10(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache10[_id].data.tab10ID;
        myObj.PPSService.delI110Tab1Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_10 = undefined;
            this.EQUIP_CODE_10 = undefined;
            this.GRADE_NO_10 = undefined;
            this.LENGTH_MIN_10 = undefined;
            this.LENGTH_MAX_10 = undefined;
            this.DIA_MIN_10 = undefined;
            this.DIA_MAX_10 = undefined;
            this.TOTAL_TIMES_10 = undefined;
            this.PICKLING_TIMES_10 = undefined;
            this.WASHING_TIMES_10 = undefined;
            this.DRAINING_TIMES_10 = undefined;
            this.BATCH_CNT_10 = undefined;

            this.sucessMSG("刪除成功", ``);
            this.getPPSINP10List();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    }
  }
  // 刪除資料17
  delID17(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache17[_id].data.tab17ID;
        myObj.PPSService.delI117Tab1Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE_17 = undefined;
            this.DIA_MIN_17 = undefined;
            this.DIA_MAX_17 = undefined;
            this.SHAPE_TYPE_17 = undefined;
            this.SMALL_ADJUST_CODE_17 = undefined;
            this.SMALL_ADJUST_TOLERANCE_17 = undefined;
            this.FURANCE_BATCH_QTY_17 = undefined;
            this.sucessMSG("刪除成功", ``);
            this.getPPSINP17List();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    }
  }
  // 刪除資料20
  delID20(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache20[_id].data.tab20ID;
        myObj.PPSService.delI120Tab1Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.EQUIP_CODE_20 = undefined;
            this.KIND_TYPE_20 = undefined;
            this.OUTPUT_SHAPE_20 = undefined;
            this.PROCESS_CODE_20 = undefined;
            this.FINAL_PROCESS_20 = undefined;
            this.SCHE_TYPE_20 = undefined;

            this.sucessMSG("刪除成功", ``);
            this.getPPSINP20List();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    }
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

  //============== 新增資料之彈出視窗 =====================

  // 新增鋼種之彈出視窗
  openGradeInput(): void {
    this.isVisibleGrade = true;
  }
  // 取消鋼種彈出視窗
  cancelGradeInput() : void{
    this.isVisibleGrade = false;
  }


  // 新增站別機台關聯表之彈出視窗
  openShopInput(): void {
    this.isVisibleShop = true;
  }
  // 取消鋼種彈出視窗
  cancelShopInput() : void{
    this.isVisibleShop = false;
  }

  // 新增設備能力之彈出視窗
  openCapabilityInput() : void {
    this.isVisibleCapability = true;
  }
  //取消設備能力彈出視窗
  cancelCapabilityInput() : void {
    this.isVisibleCapability = false;
  }

  // 新增整備時間之彈出視窗
  openPrepareInput() : void {
    this.isVisiblePrepare = true;
  }
   //取消整備時間彈出視窗
   cancelPrepareInput() : void {
    this.isVisiblePrepare = false;
  }

   // 新增大調機之彈出視窗
  openBigAdjustInput() : void {
    this.isVisibleBigAdjust = true;
  }
   //取消整備時間彈出視窗
   cancelBigAdjustInput() : void {
    this.isVisibleBigAdjust = false;
  }

  // 新增小調機之彈出視窗
  openSmallAdjustInput() : void {
    this.isVisibleSmallAdjust = true;
  }
  //取消整備時間彈出視窗
  cancelSmallAdjustInput() : void {
    this.isVisibleSmallAdjust = false;
  }

  // 新增線速之彈出視窗
  openSpeedInput() : void {
    this.isVisibleSpeed = true;
  }
   //取消線速之彈出視窗
   cancelSpeedInput() : void {
    this.isVisibleSpeed = false;
  }

  // 新增非線速之彈出視窗
  openNonSpeedInput() : void {
    this.isVisibleNonSpeed = true;
  }
  //取消線速之彈出視窗
  cancelNonSpeedInput() : void {
    this.isVisibleNonSpeed = false;
  }

  // 新增退火爐工時之彈出視窗 
  openStoveInput() : void {
    this.isVisibleStove = true;
  }
  // 取消退火爐工時之彈出視窗 
  cancelStoveInput() : void{
    this.isVisibleStove = false;
  }

  // 新增其他站別工時之彈出視窗 
  openOtherShopInput(): void {
    this.isVisibleOtherShop = true;
  }
  // 取消其他站別工時之彈出視窗 
  cancelOtherShopInput(): void {
    this.isVisibleOtherShop = false;
  }

  // 新增研磨道次之彈出視窗 
  openGrindingInput(): void {
    this.isVisibleGrinding = true;
  }
  // 取消研磨道次之彈出視窗 
  cancelGrindingInput(): void {
    this.isVisibleGrinding = false;
  }

  // 新增Campaign限制之彈出視窗 
   openCampaignInput(): void {
    this.isVisibleCampaign = true;
  }
  // 取消Campaign限制之彈出視窗 
  cancelCampaignInput() : void {
    this.isVisibleCampaign = false;
  } 

  // 新增清洗站設備能力表之彈出視窗 
  openWashInput(): void {
    this.isVisibleWash = true;
  }
  // 取消清洗站設備能力表之彈出視窗 
  cancelWashInput() : void {
    this.isVisibleWash = false;
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

  // 3.(資料過濾)設備能力
  ppsInp02ListFilter(property:string, keyWord:string){
    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      if (keyWord == "") {
        return true;
      } else {
        return _.startsWith(propertyValue, keyWord);
      }
    };

    const data = this.PPSINP02List.filter(item => filterFunc(item));
    this.displayPPSINP02List = data;
  }

  // 資料過濾---設備能力 --> 站號
  searchByShopCode2() : void{
    this.ppsInp02ListFilter("SHOP_CODE_2", this.searchShopCode2Value);
  } 
  resetByShopCode2() : void{
    this.searchShopCode2Value = '';
    this.ppsInp02ListFilter("SHOP_CODE_2", this.searchShopCode2Value);
  }

  // 資料過濾---設備能力 --> 機台群組
  searchByEquipGroup2() : void{
    this.ppsInp02ListFilter("EQUIP_GROUP_2", this.searchEquipGroup2Value);
  } 
  resetByEquipGroup2() : void{
    this.searchEquipGroup2Value = '';
    this.ppsInp02ListFilter("EQUIP_GROUP_2", this.searchEquipGroup2Value);
  }

  // 資料過濾---設備能力 --> 機台
  searchByEquipCode2() : void{
    this.ppsInp02ListFilter("EQUIP_CODE_2", this.searchEquipCode2Value);
  } 
  resetByEquipCode2() : void{
    this.searchEquipCode2Value = '';
    this.ppsInp02ListFilter("EQUIP_CODE_2", this.searchEquipCode2Value);
  }
  
  // 資料過濾---設備能力 --> 製程碼
  searchByProcessCode2() : void{
    this.ppsInp02ListFilter("PROCESS_CODE_2", this.searchProcessCode2Value);
  } 
  resetByProcessCode2() : void{
    this.searchProcessCode2Value = '';
    this.ppsInp02ListFilter("PROCESS_CODE_2", this.searchProcessCode2Value);
  }

  // 資料過濾---設備能力 --> 鋼種類別
  searchByGradeGroup2() : void{
    this.ppsInp02ListFilter("GRADE_GROUP_2", this.searchGradeGroup2Value);
  } 
  resetByGradeGroup2() : void{
    this.searchGradeGroup2Value = '';
    this.ppsInp02ListFilter("GRADE_GROUP_2", this.searchGradeGroup2Value);
  }

  // 資料過濾---設備能力 --> 形狀
  searchByShapeType2() : void{
    this.ppsInp02ListFilter("SHAPE_TYPE_2", this.searchShapeType2Value);
  } 
  resetByShapeType2() : void{
    this.searchShapeType2Value = '';
    this.ppsInp02ListFilter("SHAPE_TYPE_2", this.searchShapeType2Value);
  }
  
  // 資料過濾---設備能力 --> 投入尺寸上限
  searchByInputDiaMax2() : void{
    this.ppsInp02ListFilter("INPUT_DIA_MAX_2", this.searchInputDiaMax2Value);
  } 
  resetByInputDiaMax2() : void{
    this.searchInputDiaMax2Value = '';
    this.ppsInp02ListFilter("INPUT_DIA_MAX_2", this.searchInputDiaMax2Value);
  }
  
  // 資料過濾---設備能力 --> 設備能力最小尺寸
  searchByCapabilityDiaMin2() : void{
    this.ppsInp02ListFilter("CAPABILITY_DIA_MIN_2", this.searchCapabilityDiaMin2Value);
  } 
  resetByCapabilityDiaMin2() : void{
    this.searchCapabilityDiaMin2Value = '';
    this.ppsInp02ListFilter("CAPABILITY_DIA_MIN_2", this.searchCapabilityDiaMin2Value);
  }
  
  // 資料過濾---設備能力 --> 設備能力最大尺寸
  searchByCapabilityDiaMax2() : void{
    this.ppsInp02ListFilter("CAPABILITY_DIA_MAX_2", this.searchCapabilityDiaMax2Value);
  } 
  resetByCapabilityDiaMax2() : void{
    this.searchCapabilityDiaMax2Value = '';
    this.ppsInp02ListFilter("CAPABILITY_DIA_MAX_2", this.searchCapabilityDiaMax2Value);
  }

  // 資料過濾---設備能力 --> 設備能力最小長度
  searchByCapabilityLengthMin2() : void{
    this.ppsInp02ListFilter("CAPABILITY_LENGTH_MIN_2", this.searchCapabilityLengthMin2Value);
  } 
  resetByCapabilityLengthMin2() : void{
    this.searchCapabilityLengthMin2Value = '';
    this.ppsInp02ListFilter("CAPABILITY_LENGTH_MIN_2", this.searchCapabilityLengthMin2Value);
  }

  // 資料過濾---設備能力 --> 設備能力最大長度
  searchByCapabilityLengthMax2() : void{
    this.ppsInp02ListFilter("CAPABILITY_LENGTH_MAX_2", this.searchCapabilityLengthMax2Value);
  } 
  resetByCapabilityLengthMax2() : void{
    this.searchCapabilityLengthMax2Value = '';
    this.ppsInp02ListFilter("CAPABILITY_LENGTH_MAX_2", this.searchCapabilityLengthMax2Value);
  }

  // 資料過濾---設備能力 --> 最佳能力最小尺寸
   searchByOptimalDiaMin2() : void{
    this.ppsInp02ListFilter("OPTIMAL_DIA_MIN_2", this.searchOptimalDiaMin2Value);
  } 
  resetByOptimalDiaMin2() : void{
    this.searchOptimalDiaMin2Value = '';
    this.ppsInp02ListFilter("OPTIMAL_DIA_MIN_2", this.searchOptimalDiaMin2Value);
  }

  // 資料過濾---設備能力 --> 最佳能力最大尺寸
   searchByOptimalDiaMax2() : void{
    this.ppsInp02ListFilter("OPTIMAL_DIA_MAX_2", this.searchOptimalDiaMax2Value);
  } 
  resetByOptimalDiaMax2() : void{
    this.searchOptimalDiaMax2Value = '';
    this.ppsInp02ListFilter("OPTIMAL_DIA_MAX_2", this.searchOptimalDiaMax2Value);
  }

  // 資料過濾---設備能力 --> 最佳能力最小長度
  searchByOptimalLengthMin2() : void{
    this.ppsInp02ListFilter("OPTIMAL_LENGTH_MIN_2", this.searchOptimalLengthMin2Value);
  } 
  resetByOptimalLengthMin2() : void{
    this.searchOptimalLengthMin2Value = '';
    this.ppsInp02ListFilter("OPTIMAL_LENGTH_MIN_2", this.searchOptimalLengthMin2Value);
  }

  // 資料過濾---設備能力 --> 最佳能力最大長度
  searchByOptimalLengthMax2() : void{
    this.ppsInp02ListFilter("OPTIMAL_LENGTH_MAX_2", this.searchOptimalLengthMax2Value);
  } 
  resetByOptimalLengthMax2() : void{
    this.searchOptimalLengthMax2Value = '';
    this.ppsInp02ListFilter("OPTIMAL_LENGTH_MAX_2", this.searchOptimalLengthMax2Value);
  }

  // 資料過濾---設備能力 --> 替代機台順位1
  searchByoptionEquip1_2() : void{
    this.ppsInp02ListFilter("OPTION_EQUIP_1_2", this.searchoptionEquip1_2Value);
  } 
  resetByoptionEquip1_2() : void{
    this.searchoptionEquip1_2Value = '';
    this.ppsInp02ListFilter("OPTION_EQUIP_1_2", this.searchoptionEquip1_2Value);
  }

  // 資料過濾---設備能力 --> 替代機台順位2
  searchByoptionEquip2_2() : void{
    this.ppsInp02ListFilter("OPTION_EQUIP_2_2", this.searchoptionEquip2_2Value);
  } 
  resetByoptionEquip2_2() : void{
    this.searchoptionEquip2_2Value = '';
    this.ppsInp02ListFilter("OPTION_EQUIP_2_2", this.searchoptionEquip2_2Value);
  }

  // 資料過濾---設備能力 --> 替代機台順位3
  searchByoptionEquip3_2() : void{
    this.ppsInp02ListFilter("OPTION_EQUIP_3_2", this.searchoptionEquip3_2Value);
  } 
  resetByoptionEquip3_2() : void{
    this.searchoptionEquip3_2Value = '';
    this.ppsInp02ListFilter("OPTION_EQUIP_3_2", this.searchoptionEquip3_2Value);
  }

  // 4.(資料過濾)整備時間
  ppsInp03ListFilter(property:string, keyWord:string){
    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      if (keyWord == "") {
        return true;
      } else {
        return _.startsWith(propertyValue, keyWord);
      }
    };

    const data = this.PPSINP03List.filter(item => filterFunc(item));
    this.displayPPSINP03List = data;
  }

  // 資料過濾---整備時間 --> 機台
  searchEquipCode() : void{
    this.ppsInp03ListFilter("EQUIP_CODE", this.searchEquipCodeValue);
  } 
  resetByEquipCode() : void{
    this.searchEquipCodeValue = '';
    this.ppsInp03ListFilter("EQUIP_CODE", this.searchEquipCodeValue);
  }

  // 資料過濾---整備時間 --> 上下料
  searchLoadTime() : void{
    this.ppsInp03ListFilter("LOAD_TIME", this.searchLoadTimeValue);
  } 
  resetByLoadTime() : void{
    this.searchLoadTimeValue = '';
    this.ppsInp03ListFilter("LOAD_TIME", this.searchLoadTimeValue);
  }

  // 資料過濾---整備時間 --> 搬運
  searchByTransferTime() : void{
    this.ppsInp03ListFilter("TRANSFER_TIME", this.searchTransferTimeValue);
  } 
  resetByTransferTime() : void{
    this.searchTransferTimeValue = '';
    this.ppsInp03ListFilter("TRANSFER_TIME", this.searchTransferTimeValue);
  }

  // 資料過濾---整備時間 --> 其他整備
  searchByOtherTime() : void{
    this.ppsInp03ListFilter("OTHER_TIME", this.searchOtherTimeValue);
  } 
  resetByOtherTime() : void{
    this.searchOtherTimeValue = '';
    this.ppsInp03ListFilter("OTHER_TIME", this.searchOtherTimeValue);
  }

  // 資料過濾---整備時間 --> 大調機
  searchByBigAdjustTime() : void{
    this.ppsInp03ListFilter("BIG_ADJUST_TIME", this.searchBigAdjustTimeValue);
  } 
  resetByBigAdjustTime() : void{
    this.searchBigAdjustTimeValue = '';
    this.ppsInp03ListFilter("BIG_ADJUST_TIME", this.searchBigAdjustTimeValue);
  }

  // 資料過濾---整備時間 --> 小調機
  searchBySmallAdjustTime() : void{
    this.ppsInp03ListFilter("SMALL_ADJUST_TIME", this.searchSmallAdjustTimeValue);
  } 
  resetBySmallAdjustTime() : void{
    this.searchSmallAdjustTimeValue = '';
    this.ppsInp03ListFilter("SMALL_ADJUST_TIME", this.searchSmallAdjustTimeValue);
  }

  // 資料過濾---整備時間 --> 退料
  searchByReturnTime() : void{
    this.ppsInp03ListFilter("RETURN_TIME", this.searchReturnTimeValue);
  } 
  resetByReturnTime() : void{
    this.searchReturnTimeValue = '';
    this.ppsInp03ListFilter("RETURN_TIME", this.searchReturnTimeValue);
  }
  
  // 資料過濾---整備時間 --> 冷卻
  searchByCoolingTime() : void{
    this.ppsInp03ListFilter("COOLING_TIME", this.searchCoolingTimeValue);
  } 
  resetByCoolingTime() : void{
    this.searchCoolingTimeValue = '';
    this.ppsInp03ListFilter("COOLING_TIME", this.searchCoolingTimeValue);
  }

  // 5.(資料過濾)大調機
  ppsInp04ListFilter(property:string, keyWord:string){

    if(keyWord == ""){
      this.displayPPSINP04List = this.PPSINP04List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP04List.filter(item => filterFunc(item));
    this.displayPPSINP04List = data;
  }
    
  // 資料過濾---大調機 --> 機台
  searchByEquipCode4() : void{
    this.ppsInp04ListFilter("EQUIP_CODE_4", this.searchEquipCode4Value);
  } 
  resetByEquipCode4() : void{
    this.searchEquipCode4Value = '';
    this.ppsInp04ListFilter("EQUIP_CODE_4", this.searchEquipCode4Value);
  }

  // 資料過濾---大調機 --> 產出尺寸最小值
  searchByDiaMin4() : void{
    this.ppsInp04ListFilter("DIA_MIN_4", this.searchDiaMin4Value);
  } 
  resetByDiaMin4() : void{
    this.searchDiaMin4Value = '';
    this.ppsInp04ListFilter("DIA_MIN_4", this.searchDiaMin4Value);
  }

  // 資料過濾---大調機 --> 產出尺寸最大值
  searchByDiaMax4() : void{
    this.ppsInp04ListFilter("DIA_MAX_4", this.searchDiaMax4Value);
  } 
  resetByDiaMax4() : void{
    this.searchDiaMax4Value = '';
    this.ppsInp04ListFilter("DIA_MAX_4", this.searchDiaMax4Value);
  }

  // 資料過濾---大調機 --> 產出型態
  searchByShapeType4() : void{
    this.ppsInp04ListFilter("SHAPE_TYPE_4", this.searchShapeType4Value);
  } 
  resetByShapeType4() : void{
    this.searchShapeType4Value = '';
    this.ppsInp04ListFilter("SHAPE_TYPE_4", this.searchShapeType4Value);
  }

  // 資料過濾---大調機 --> 大調機代碼
  searchByBigAdjustCode4() : void{
    this.ppsInp04ListFilter("BIG_ADJUST_CODE_4", this.searchBigAdjustCode4Value);
  } 
  resetByBigAdjustCode4() : void{
    this.searchBigAdjustCode4Value = '';
    this.ppsInp04ListFilter("BIG_ADJUST_CODE_4", this.searchBigAdjustCode4Value);
  }

  // 資料過濾---大調機 --> 小調機公差標準
  searchBySmallAdjustTolerance4() : void{
    this.ppsInp04ListFilter("SMALL_ADJUST_TOLERANCE_4", this.searchSmallAdjustTolerance4Value);
  } 
  resetBySmallAdjustTolerance4() : void{
    this.searchSmallAdjustTolerance4Value = '';
    this.ppsInp04ListFilter("SMALL_ADJUST_TOLERANCE_4", this.searchSmallAdjustTolerance4Value);
  }

  // 資料過濾---大調機 --> 爐批數量
  searchByFuranceBatchQty4() : void{
    this.ppsInp04ListFilter("FURANCE_BATCH_QTY_4", this.searchFuranceBatchQty4Value);
  } 
  resetByFuranceBatchQty4() : void{
    this.searchFuranceBatchQty4Value = '';
    this.ppsInp04ListFilter("FURANCE_BATCH_QTY_4", this.searchFuranceBatchQty4Value);
  }

  // 6.(資料過濾)小調機
  ppsInp17ListFilter(property:string, keyWord:string){

    if(_.isEmpty(keyWord)){
      this.displayPPSINP17List = this.PPSINP17List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP17List.filter(item => filterFunc(item));
    this.displayPPSINP17List = data;
  }

  // 資料過濾---小調機 --> 機台
  searchByEquipCode17() : void{
    this.ppsInp17ListFilter("EQUIP_CODE_17", this.searchEquipCode17Value);
  } 
  resetByEquipCode17() : void{
    this.searchEquipCode17Value = '';
    this.ppsInp17ListFilter("EQUIP_CODE_17", this.searchEquipCode17Value);
  }

  // 資料過濾---小調機 --> 產出尺寸最小值
  searchByDiaMin17() : void{
    this.ppsInp17ListFilter("DIA_MIN_17", this.searchDiaMin17Value);
  } 
  resetByDiaMin17() : void{
    this.searchDiaMin17Value = '';
    this.ppsInp17ListFilter("DIA_MIN_17", this.searchDiaMin17Value);
  }

  // 資料過濾---小調機 --> 產出尺寸最大值
  searchByDiaMax17() : void{
    this.ppsInp17ListFilter("DIA_MAX_17", this.searchDiaMax17Value);
  } 
  resetByDiaMax17() : void{
    this.searchDiaMax17Value = '';
    this.ppsInp17ListFilter("DIA_MAX_17", this.searchDiaMax17Value);
  }

  // 資料過濾---小調機 --> 產出型態
  searchByShapeType17() : void {
    this.ppsInp17ListFilter("SHAPE_TYPE_17", this.searchShapeType17Value);
  } 
  resetByShapeType17() : void {
    this.searchShapeType17Value = '';
    this.ppsInp17ListFilter("SHAPE_TYPE_17", this.searchShapeType17Value);
  }

  // 資料過濾---小調機 --> 小調機代碼
  searchBySmallAdjustCode17() : void {
    this.ppsInp17ListFilter("SMALL_ADJUST_CODE_17", this.searchSmallAdjustCode17Value);
  } 
  resetBySmallAdjustCode17() : void {
    this.searchSmallAdjustCode17Value = '';
    this.ppsInp17ListFilter("SMALL_ADJUST_CODE_17", this.searchSmallAdjustCode17Value);
  }

  // 資料過濾---小調機 --> 小調機公差標準
  searchBySmallAdjustTolerance17() : void {
    this.ppsInp17ListFilter("SMALL_ADJUST_TOLERANCE_17", this.searchSmallAdjustTolerance17Value);
  } 
  resetBySmallAdjustTolerance17() : void {
    this.searchSmallAdjustTolerance17Value = '';
    this.ppsInp17ListFilter("SMALL_ADJUST_TOLERANCE_17", this.searchSmallAdjustTolerance17Value);
  }

  // 資料過濾---小調機 --> 爐批數量
  searchByFuranceBatchQty17() : void {
    this.ppsInp17ListFilter("FURANCE_BATCH_QTY_17", this.searchFuranceBatchQty17Value);
  } 
  resetByFuranceBatchQty17() : void {
    this.searchFuranceBatchQty17Value = '';
    this.ppsInp17ListFilter("FURANCE_BATCH_QTY_17", this.searchFuranceBatchQty17Value);
  }





  // 7.(資料過濾)線速
  ppsInp05ListFilter(property:string, keyWord:string){

    if(_.isEmpty(keyWord)){
      this.displayPPSINP05List = this.PPSINP05List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP05List.filter(item => filterFunc(item));
    this.displayPPSINP05List = data;
  }

  // 資料過濾---線速 --> 站號
  searchByShopCode5() : void {
    this.ppsInp05ListFilter("SHOP_CODE_5", this.searchShopCode5Value);
  } 
  resetByShopCode5() : void {
    this.searchShopCode5Value = '';
    this.ppsInp05ListFilter("SHOP_CODE_5", this.searchShopCode5Value);
  }

  // 資料過濾---線速 --> 機台
  searchByEquipCode5() : void {
    this.ppsInp05ListFilter("EQUIP_CODE_5", this.searchEquipCode5Value);
  } 
  resetByEquipCode5() : void {
    this.searchEquipCode5Value = '';
    this.ppsInp05ListFilter("EQUIP_CODE_5", this.searchEquipCode5Value);
  }

  // 資料過濾---線速 --> 產出型態
  searchByShapeType5() : void {
    this.ppsInp05ListFilter("SHAPE_TYPE_5", this.searchShapeType5Value);
  } 
  resetByShapeType5() : void {
    this.searchShapeType5Value = '';
    this.ppsInp05ListFilter("SHAPE_TYPE_5", this.searchShapeType5Value);
  }

  // 資料過濾---線速 --> 鋼種種類
  searchByGradeGroup5() : void {
    this.ppsInp05ListFilter("GRADE_GROUP_5", this.searchGradeGroup5Value);
  } 
  resetByGradeGroup5() : void {
    this.searchGradeGroup5Value = '';
    this.ppsInp05ListFilter("GRADE_GROUP_5", this.searchGradeGroup5Value);
  }
  
  // 資料過濾---線速 --> 線速分類
  searchBySpeedType5() : void {
    this.ppsInp05ListFilter("SPEED_TYPE_5", this.searchSpeedType5Value);
  } 
  resetBySpeedType5() : void {
    this.searchSpeedType5Value = '';
    this.ppsInp05ListFilter("SPEED_TYPE_5", this.searchSpeedType5Value);
  }
  
  // 資料過濾---線速 --> 減面率MIN
  searchByReductionRateMin5() : void {
    this.ppsInp05ListFilter("REDUCTION_RATE_MIN_5", this.searchReductionRateMin5Value);
  } 
  resetByReductionRateMin5() : void {
    this.searchReductionRateMin5Value = '';
    this.ppsInp05ListFilter("REDUCTION_RATE_MIN_5", this.searchReductionRateMin5Value);
  }

  // 資料過濾---線速 --> 減面率MAX
  searchByReductionRateMax5() : void {
    this.ppsInp05ListFilter("REDUCTION_RATE_MAX_5", this.searchReductionRateMax5Value);
  } 
  resetByReductionRateMax5() : void {
    this.searchReductionRateMax5Value = '';
    this.ppsInp05ListFilter("REDUCTION_RATE_MAX_5", this.searchReductionRateMax5Value);
  }

  // 資料過濾---線速 --> 產出最小尺寸
  searchByDiaMax5() : void {
    this.ppsInp05ListFilter("DIA_MAX_5", this.searchDiaMax5Value);
  } 
  resetByDiaMax5() : void {
    this.searchDiaMax5Value = '';
    this.ppsInp05ListFilter("DIA_MAX_5", this.searchDiaMax5Value);
  }

  // 資料過濾---線速 --> 產出最大尺寸
  searchByDiaMin5() : void {
    this.ppsInp05ListFilter("DIA_MIN_5", this.searchDiaMin5Value);
  } 
  resetByDiaMin5() : void {
    this.searchDiaMin5Value = '';
    this.ppsInp05ListFilter("DIA_MIN_5", this.searchDiaMin5Value);
  }

  // 資料過濾---線速 --> 線速(m/min)
  searchBySpeed5() : void {
    this.ppsInp05ListFilter("SPEED_5", this.searchSpeed5Value);
  } 
  resetBySpeed5() : void {
    this.searchSpeed5Value = '';
    this.ppsInp05ListFilter("SPEED_5", this.searchSpeed5Value);
  }

  // 資料過濾---線速 --> 日產出量
  searchByEquipCap5() : void {
    this.ppsInp05ListFilter("EQUIP_CAP_5", this.searchEquipCap5Value);
  } 
  resetByEquipCap5() : void {
    this.searchEquipCap5Value = '';
    this.ppsInp05ListFilter("EQUIP_CAP_5", this.searchEquipCap5Value);
  }




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




  // 9.(資料過濾)退火爐工時
  ppsInp09ListFilter(property:string, keyWord:string){

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
  searchByShopCode9() : void {
    this.ppsInp09ListFilter("SHOP_CODE_9", this.searchShopCode9Value);
  } 
  resetByShopCode9() : void {
    this.searchShopCode9Value = '';
    this.ppsInp09ListFilter("SHOP_CODE_9", this.searchShopCode9Value);
  }

  // 資料過濾---退火爐工時 --> 機台
  searchByEquipCode9() : void {
    this.ppsInp09ListFilter("EQUIP_CODE_9", this.searchEquipCode9Value);
  } 
  resetByEquipCode9() : void {
    this.searchEquipCode9Value = '';
    this.ppsInp09ListFilter("EQUIP_CODE_9", this.searchEquipCode9Value);
  }

  // 資料過濾---退火爐工時 --> 作業代碼
  searchByOpCode9() : void {
    this.ppsInp09ListFilter("OP_CODE_9", this.searchOpCode9Value);
  } 
  resetByOpCode9() : void {
    this.searchOpCode9Value = '';
    this.ppsInp09ListFilter("OP_CODE_9", this.searchOpCode9Value);
  }

  // 資料過濾---退火爐工時 --> 溫度
  searchByTemperature9() : void {
    this.ppsInp09ListFilter("TEMPERATURE_9", this.searchTemperature9Value);
  } 
  resetByTemperature9() : void {
    this.searchTemperature9Value = '';
    this.ppsInp09ListFilter("TEMPERATURE_9", this.searchTemperature9Value);
  }

  // 資料過濾---退火爐工時 --> 頻率
  searchByFrequency9() : void {
    this.ppsInp09ListFilter("FREQUENCY_9", this.searchFrequency9Value);
  } 
  resetByFrequency9() : void {
    this.searchFrequency9Value = '';
    this.ppsInp09ListFilter("FREQUENCY_9", this.searchFrequency9Value);
  }

  // 資料過濾---退火爐工時 --> 每噸花時間
  searchBySteelGradeMin9() : void {
    this.ppsInp09ListFilter("STEEL_GRADE_MIN_9", this.searchSteelGradeMin9Value);
  } 
  resetBySteelGradeMin9() : void {
    this.searchSteelGradeMin9Value = '';
    this.ppsInp09ListFilter("STEEL_GRADE_MIN_9", this.searchSteelGradeMin9Value);
  }






  // 10.(資料過濾)其他站別工時
  ppsInp10ListFilter(property:string, keyWord:string) : void {

    if(_.isEmpty(keyWord)){
      this.displayPPSINP10List = this.PPSINP10List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP10List.filter(item => filterFunc(item));
    this.displayPPSINP10List = data;
  }

  // 資料過濾---其他站別工時 --> 站號
  searchByShopCode10() : void {
    this.ppsInp10ListFilter("SHOP_CODE_10", this.searchShopCode10Value);
  } 
  resetByShopCode10() : void {
    this.searchShopCode10Value = '';
    this.ppsInp10ListFilter("SHOP_CODE_10", this.searchShopCode10Value);
  }

  // 資料過濾---其他站別工時 --> 機台碼
  searchByEquipCode10() : void {
    this.ppsInp10ListFilter("EQUIP_CODE_10", this.searchEquipCode10Value);
  } 
  resetByEquipCode10() : void {
    this.searchEquipCode10Value = '';
    this.ppsInp10ListFilter("EQUIP_CODE_10", this.searchEquipCode10Value);
  }

  // 資料過濾---其他站別工時 --> 鋼種
  searchByGradeNo10() : void {
    this.ppsInp10ListFilter("GRADE_NO_10", this.searchGradeNo10Value);
  } 
  resetByGradeNo10() : void {
    this.searchGradeNo10Value = '';
    this.ppsInp10ListFilter("GRADE_NO_10", this.searchGradeNo10Value);
  }

  // 資料過濾---其他站別工時 --> 長度最小值
  searchByLengthMin10() : void {
    this.ppsInp10ListFilter("LENGTH_MIN_10", this.searchLengthMin10Value);
  } 
  resetByLengthMin10() : void {
    this.searchLengthMin10Value = '';
    this.ppsInp10ListFilter("LENGTH_MIN_10", this.searchLengthMin10Value);
  }

  // 資料過濾---其他站別工時 --> 長度最大值
  searchByLengthMax10() : void {
    this.ppsInp10ListFilter("LENGTH_MAX_10", this.searchLengthMax10Value);
  } 
  resetByLengthMax10() : void {
    this.searchLengthMax10Value = '';
    this.ppsInp10ListFilter("LENGTH_MAX_10", this.searchLengthMax10Value);
  }

  // 資料過濾---其他站別工時 --> 最小尺寸
  searchByDiaMin10() : void {
    this.ppsInp10ListFilter("DIA_MIN_10", this.searchDiaMin10Value);
  } 
  resetByDiaMin10() : void {
    this.searchDiaMin10Value = '';
    this.ppsInp10ListFilter("DIA_MIN_10", this.searchDiaMin10Value);
  }

  // 資料過濾---其他站別工時 --> 最大尺寸
  searchByDiaMax10() : void {
    this.ppsInp10ListFilter("DIA_MAX_10", this.searchDiaMax10Value);
  } 
  resetByDiaMax10() : void {
    this.searchDiaMax10Value = '';
    this.ppsInp10ListFilter("DIA_MAX_10", this.searchDiaMax10Value);
  }

  // 資料過濾---其他站別工時 --> 總時間
  searchByTotalTimes10() : void {
    this.ppsInp10ListFilter("TOTAL_TIMES_10", this.searchTotalTimes10Value);
  } 
  resetByTotalTimes10() : void {
    this.searchTotalTimes10Value = '';
    this.ppsInp10ListFilter("TOTAL_TIMES_10", this.searchTotalTimes10Value);
  }

  // 資料過濾---其他站別工時 --> 浸酸時間
  searchByPicklingTimes10() : void {
    this.ppsInp10ListFilter("PICKLING_TIMES_10", this.searchPicklingTimes10Value);
  } 
  resetByPicklingTimes10() : void {
    this.searchPicklingTimes10Value = '';
    this.ppsInp10ListFilter("PICKLING_TIMES_10", this.searchPicklingTimes10Value);
  }

  // 資料過濾---其他站別工時 --> 清洗時間
  searchByWashingTimes10() : void {
    this.ppsInp10ListFilter("WASHING_TIMES_10", this.searchWashingTimes10Value);
  } 
  resetByWashingTimes10() : void {
    this.searchWashingTimes10Value = '';
    this.ppsInp10ListFilter("WASHING_TIMES_10", this.searchWashingTimes10Value);
  }

  // 資料過濾---其他站別工時 --> 瀝乾時間
  searchByDrainingTimes10() : void {
    this.ppsInp10ListFilter("DRAINING_TIMES_10", this.searchDrainingTimes10Value);
  } 
  resetByDrainingTimes10() : void {
    this.searchDrainingTimes10Value = '';
    this.ppsInp10ListFilter("DRAINING_TIMES_10", this.searchDrainingTimes10Value);
  }

  // 資料過濾---其他站別工時 --> 投入上限值
  searchByBatchCnt10() : void {
    this.ppsInp10ListFilter("BATCH_CNT_10", this.searchBatchCnt10Value);
  } 
  resetByBatchCnt10() : void {
    this.searchBatchCnt10Value = '';
    this.ppsInp10ListFilter("BATCH_CNT_10", this.searchBatchCnt10Value);
  }





  // 11.(資料過濾)研磨道次
  ppsInp13ListFilter(property:string, keyWord:string) : void {

    if(_.isEmpty(keyWord)){
      this.displayPPSINP13List = this.PPSINP13List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP13List.filter(item => filterFunc(item));
    this.displayPPSINP13List = data;
  }

  // 資料過濾---研磨道次 --> 鋼種類別
  searchByGradeNo13() : void {
    this.ppsInp13ListFilter("GRADE_NO_13", this.searchGradeNo13Value);
  } 
  resetByGradeNo13() : void {
    this.searchGradeNo13Value = '';
    this.ppsInp13ListFilter("GRADE_NO_13", this.searchGradeNo13Value);
  }

  // 資料過濾---研磨道次 --> 產出型態
  searchByOutType() : void {
    this.ppsInp13ListFilter("OUT_TYPE", this.searchOutTypeValue);
  } 
  resetByOutType() : void {
    this.searchOutTypeValue = '';
    this.ppsInp13ListFilter("OUT_TYPE", this.searchOutTypeValue);
  }

 // 資料過濾---研磨道次 --> 產出成品尺寸最小值
 searchByDiaMin() : void {
   this.ppsInp13ListFilter("DIA_MIN", this.searchDiaMinValue);
 } 
 resetByDiaMin() : void {
   this.searchDiaMinValue = '';
   this.ppsInp13ListFilter("DIA_MIN", this.searchDiaMinValue);
 }

  // 資料過濾---研磨道次 --> 產出成品尺寸最大值
  searchByDiaMax() : void {
    this.ppsInp13ListFilter("DIA_MAX", this.searchDiaMaxValue);
  } 
  resetByDiaMax() : void {
    this.searchDiaMaxValue = '';
    this.ppsInp13ListFilter("DIA_MAX", this.searchDiaMaxValue);
  }

  // 資料過濾---研磨道次 --> 研磨道次
  searchByGrindingPass() : void {
    this.ppsInp13ListFilter("GRINDING_PASS", this.searchGrindingPassValue);
  } 
  resetByGrindingPass() : void {
    this.searchGrindingPassValue = '';
    this.ppsInp13ListFilter("GRINDING_PASS", this.searchGrindingPassValue);
  }

  // 資料過濾---研磨道次 --> 每刀研磨尺寸
  searchByGrindingsize() : void {
    this.ppsInp13ListFilter("GRINDING_SIZE", this.searchGrindingSizeValue);
  } 
  resetByGrindingsize() : void {
    this.searchGrindingSizeValue = '';
    this.ppsInp13ListFilter("GRINDING_SIZE", this.searchGrindingSizeValue);
  }



   // 12.(資料過濾)Campaign限制
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






  // 13.(資料過濾)清洗站設備能力表
  ppsInp20ListFilter(property:string, keyWord:string) : void {

    if(_.isEmpty(keyWord)){
      this.displayPPSINP20List = this.PPSINP20List;
      return;
    }

    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP20List.filter(item => filterFunc(item));
    this.displayPPSINP20List = data;
  }

  // 資料過濾---清洗站設備能力表 --> 機台
  searchByEquipCode20() : void {
    this.ppsInp20ListFilter("EQUIP_CODE_20", this.searchEquipCode20Value);
  } 
  resetByEquipCode20() : void {
    this.searchEquipCode20Value = '';
    this.ppsInp20ListFilter("EQUIP_CODE_20", this.searchEquipCode20Value);
  }

  // 資料過濾---清洗站設備能力表 --> 產品種類
  searchByKindType20() : void {
    this.ppsInp20ListFilter("KIND_TYPE_20", this.searchKindType20Value);
  } 
  resetByKindType20() : void {
    this.searchKindType20Value = '';
    this.ppsInp20ListFilter("KIND_TYPE_20", this.searchKindType20Value);
  }

  // 資料過濾---清洗站設備能力表 --> 產出型態
  searchByOutputShape20() : void {
    this.ppsInp20ListFilter("OUTPUT_SHAPE_20", this.searchOutputShape20Value);
  } 
  resetByOutputShape20() : void {
    this.searchOutputShape20Value = '';
    this.ppsInp20ListFilter("OUTPUT_SHAPE_20", this.searchOutputShape20Value);
  }

  // 資料過濾---清洗站設備能力表 --> 製程碼
  searchByProcessCode20() : void {
    this.ppsInp20ListFilter("PROCESS_CODE_20", this.searchProcessCode20Value);
  } 
  resetByProcessCode20() : void {
    this.searchProcessCode20Value = '';
    this.ppsInp20ListFilter("PROCESS_CODE_20", this.searchProcessCode20Value);
  }

  // 資料過濾---清洗站設備能力表 --> FINAL_製程
  searchByFinalProcess20() : void {
    this.ppsInp20ListFilter("FINAL_PROCESS_20", this.searchFinalProcess20Value);
  } 
  resetByFinalProcess20() : void {
    this.searchFinalProcess20Value = '';
    this.ppsInp20ListFilter("FINAL_PROCESS_20", this.searchFinalProcess20Value);
  }

  // 資料過濾---清洗站設備能力表 --> 抽數別
  searchByScheType20() : void {
    this.ppsInp20ListFilter("SCHE_TYPE_20", this.searchScheType20Value);
  } 
  resetByScheType20() : void {
    this.searchScheType20Value = '';
    this.ppsInp20ListFilter("SCHE_TYPE_20", this.searchScheType20Value);
  }

  


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
