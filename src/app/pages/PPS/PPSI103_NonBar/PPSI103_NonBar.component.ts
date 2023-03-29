import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";




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


@Component({
  selector: "app-PPSI103_NonBar",
  templateUrl: "./PPSI103_NonBar.component.html",
  styleUrls: ["./PPSI103_NonBar.component.scss"],
  providers:[NzMessageService]
})
export class PPSI103_NonBarComponent implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;



  // 設備能力
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
    this.getPPSINP02List();
  }
  
  
  PPSINP02List_tmp;
  editCache2: { [key: string]: { edit: boolean; data: ItemData2 } } = {};
  PPSINP02List: ItemData2[] = [];
  displayPPSINP02List: ItemData2[] = [];

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
      this.updateEditCache(1);
      console.log(this.PPSINP02List);
      myObj.loading = false;
    });
  }

  

  // insert
  insertTab() {
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
          this.insertSave(1)
        }
    })}
  }


  // update
  editRow(id: string): void {
    this.editCache2[id].edit = true;
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
    const index = this.PPSINP02List.findIndex(item => item.id === id);
    this.editCache2[id] = {
      data: { ...this.PPSINP02List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
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
          this.updateSave(id)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  

  // update
  updateEditCache(_type): void {
    this.PPSINP02List.forEach(item => {
      this.editCache2[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  

  // 新增資料
  insertSave(_type) {
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


  // 修改資料
  updateSave(_id) {
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

  
  // 刪除資料
  delID(_id) {
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
  // 新增設備能力之彈出視窗
  openCapabilityInput() : void {
    this.isVisibleCapability = true;
  }
  //取消設備能力彈出視窗
  cancelCapabilityInput() : void {
    this.isVisibleCapability = false;
  }



// ============= 過濾資料之menu ========================
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


}
