import { Component, ElementRef, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";




interface ItemData {
  id: string;
  tabID: number;
  SHOP_CODE: string;
  EQUIP_GROUP: string;
  EQUIP_CODE: string;
  PROCESS_CODE: string;
  GRADE_GROUP: string;
  SHAPE_TYPE: string;
  INPUT_DIA_MAX: number;
  CAPABILITY_DIA_MIN: number;
  CAPABILITY_DIA_MAX: number;
  CAPABILITY_LENGTH_MIN: number;
  CAPABILITY_LENGTH_MAX: number;
  OPTIMAL_DIA_MIN: number;
  OPTIMAL_DIA_MAX: number;
  OPTIMAL_LENGTH_MIN: number;
  OPTIMAL_LENGTH_MAX: number;
  OPTION_EQUIP_1: string;
  OPTION_EQUIP_2: string;
  OPTION_EQUIP_3: string;
  OPTION_EQUIP_4: string;
  OPTION_EQUIP_5: string;
  OPTION_EQUIP_6: string;
  OPTION_EQUIP_7: string;
}


@Component({
  selector: "app-PPSI103",
  templateUrl: "./PPSI103.component.html",
  styleUrls: ["./PPSI103.component.scss"],
  providers:[NzMessageService]
})
export class PPSI103Component implements AfterViewInit {
  thisTabName = "設備能力(PPSI103)";
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  // 設備能力
  SHOP_CODE = "";
  EQUIP_GROUP = "";
  EQUIP_CODE = "";
  PROCESS_CODE = "";
  GRADE_GROUP = "";
  SHAPE_TYPE = "";
  INPUT_DIA_MAX = 0;
  CAPABILITY_DIA_MIN = 0;
  CAPABILITY_DIA_MAX = 0;
  CAPABILITY_LENGTH_MIN = 0;
  CAPABILITY_LENGTH_MAX = 0;
  OPTIMAL_DIA_MIN = 0;
  OPTIMAL_DIA_MAX = 0;
  OPTIMAL_LENGTH_MIN = 0;
  OPTIMAL_LENGTH_MAX = 0;
  OPTION_EQUIP_1 = "";
  OPTION_EQUIP_2 = "";
  OPTION_EQUIP_3 = "";
  OPTION_EQUIP_4 = "";
  OPTION_EQUIP_5 = "";
  OPTION_EQUIP_6 = "";
  OPTION_EQUIP_7 = "";
  isVisibleCapability = false;
  searchShopCodeValue = '';
  searchEquipGroupValue = '';
  searchEquipCodeValue = '';
  searchProcessCodeValue = '';
  searchGradeGroupValue = '';
  searchShapeTypeValue = '';
  searchInputDiaMaxValue = '';
  searchCapabilityDiaMinValue = '';
  searchCapabilityDiaMaxValue = '';
  searchCapabilityLengthMinValue = '';
  searchCapabilityLengthMaxValue = '';
  searchOptimalDiaMinValue = '';
  searchOptimalDiaMaxValue = '';
  searchOptimalLengthMinValue = '';
  searchOptimalLengthMaxValue = '';
  searchoptionEquip1Value = '';
  searchoptionEquip2Value = '';
  searchoptionEquip3Value = '';
  searchoptionEquip4Value = '';
  searchoptionEquip5Value = '';
  searchoptionEquip6Value = '';
  searchoptionEquip7Value = '';

  importdata = [];  
  importdata_repeat = [];

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  titleArray = ["站別","機台群組","機台","製程碼","鋼種類別","形狀","投入尺寸上限","設備能力最小尺寸","設備能力最大尺寸","設備能力最小長度","設備能力最大長度","最佳能力最小尺寸","最佳能力最大尺寸","最佳能力最小長度","最佳能力最大長度","替代機台順位1","替代機台順位2","替代機台順位3","替代機台順位4","替代機台順位5","替代機台順位6","替代機台順位7"];

  
  constructor(
    private elementRef:ElementRef,
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
    this.getPPSINP02List();
    
    const aI103Tab = this.elementRef.nativeElement.querySelector('#aI103') as HTMLAnchorElement;
    const liI103Tab = this.elementRef.nativeElement.querySelector('#liI103') as HTMLLIElement;
    liI103Tab.style.backgroundColor = '#E4E3E3';
    aI103Tab.style.cssText = 'color: blue; font-weight:bold;';
  }
  
  onInit() {
    this.SHOP_CODE = "";
    this.EQUIP_GROUP = "";
    this.EQUIP_CODE = "";
    this.PROCESS_CODE = "";
    this.GRADE_GROUP = "";
    this.SHAPE_TYPE = "";
    this.INPUT_DIA_MAX = 0;
    this.CAPABILITY_DIA_MIN = 0;
    this.CAPABILITY_DIA_MAX = 0;
    this.CAPABILITY_LENGTH_MIN = 0;
    this.CAPABILITY_LENGTH_MAX = 0;
    this.OPTIMAL_DIA_MIN = 0;
    this.OPTIMAL_DIA_MAX = 0;
    this.OPTIMAL_LENGTH_MIN = 0;
    this.OPTIMAL_LENGTH_MAX = 0;
    this.OPTION_EQUIP_1 = "";
    this.OPTION_EQUIP_2 = "";
    this.OPTION_EQUIP_3 = "";
    this.OPTION_EQUIP_4 = "";
    this.OPTION_EQUIP_5 = "";
    this.OPTION_EQUIP_6 = "";
    this.OPTION_EQUIP_7 = "";
    this.importdata = [];  
    this.importdata_repeat = [];
  }

  PPSINP02List_tmp;
  editCache2: { [key: string]: { edit: boolean; data: ItemData } } = {};
  PPSINP02List: ItemData[] = [];
  displayPPSINP02List: ItemData[] = [];

  getPPSINP02List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP02List('1').subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP02List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP02List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tabID: this.PPSINP02List_tmp[i].ID,
          SHOP_CODE: this.PPSINP02List_tmp[i].SHOP_CODE,
          EQUIP_GROUP: this.PPSINP02List_tmp[i].EQUIP_GROUP,
          EQUIP_CODE: this.PPSINP02List_tmp[i].EQUIP_CODE,
          PROCESS_CODE: this.PPSINP02List_tmp[i].PROCESS_CODE,
          GRADE_GROUP: this.PPSINP02List_tmp[i].GRADE_GROUP,
          SHAPE_TYPE: this.PPSINP02List_tmp[i].SHAPE_TYPE,
          INPUT_DIA_MAX: this.PPSINP02List_tmp[i].INPUT_DIA_MAX,
          CAPABILITY_DIA_MIN: this.PPSINP02List_tmp[i].CAPABILITY_DIA_MIN,
          CAPABILITY_DIA_MAX: this.PPSINP02List_tmp[i].CAPABILITY_DIA_MAX,
          CAPABILITY_LENGTH_MIN: this.PPSINP02List_tmp[i].CAPABILITY_LENGTH_MIN,
          CAPABILITY_LENGTH_MAX: this.PPSINP02List_tmp[i].CAPABILITY_LENGTH_MAX,
          OPTIMAL_DIA_MIN: this.PPSINP02List_tmp[i].OPTIMAL_DIA_MIN,
          OPTIMAL_DIA_MAX: this.PPSINP02List_tmp[i].OPTIMAL_DIA_MAX,
          OPTIMAL_LENGTH_MIN: this.PPSINP02List_tmp[i].OPTIMAL_LENGTH_MIN,
          OPTIMAL_LENGTH_MAX: this.PPSINP02List_tmp[i].OPTIMAL_LENGTH_MAX,
          OPTION_EQUIP_1: this.PPSINP02List_tmp[i].OPTION_EQUIP_1,
          OPTION_EQUIP_2: this.PPSINP02List_tmp[i].OPTION_EQUIP_2,
          OPTION_EQUIP_3: this.PPSINP02List_tmp[i].OPTION_EQUIP_3,
          OPTION_EQUIP_4: this.PPSINP02List_tmp[i].OPTION_EQUIP_4,
          OPTION_EQUIP_5: this.PPSINP02List_tmp[i].OPTION_EQUIP_5,
          OPTION_EQUIP_6: this.PPSINP02List_tmp[i].OPTION_EQUIP_6,
          OPTION_EQUIP_7: this.PPSINP02List_tmp[i].OPTION_EQUIP_7,
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
    if (this.SHOP_CODE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.EQUIP_GROUP === undefined) {
      myObj.message.create("error", "「機台群組」不可為空");
      return;
    } else if (this.EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.PROCESS_CODE === undefined) {
      myObj.message.create("error", "「製程碼」不可為空");
      return;
    } else if (this.GRADE_GROUP === undefined) {
      myObj.message.create("error", "「鋼種類別」不可為空");
      return;
    } else if (this.SHAPE_TYPE === undefined) {
      myObj.message.create("error", "「形狀」不可為空");
      return;
    } else if (this.INPUT_DIA_MAX === undefined) {
      myObj.message.create("error", "「投入尺寸上限」不可為空");
      return;
    } else if (this.CAPABILITY_DIA_MIN === undefined) {
      myObj.message.create("error", "「設備能力最小尺寸」不可為空");
      return;
    } else if (this.CAPABILITY_DIA_MAX === undefined) {
      myObj.message.create("error", "「設備能力最大尺寸」不可為空");
      return;
    } else if (this.CAPABILITY_LENGTH_MIN === undefined) {
      myObj.message.create("error", "「設備能力最小長度」不可為空");
      return;
    } else if (this.CAPABILITY_LENGTH_MAX === undefined) {
      myObj.message.create("error", "「設備能力最大長度」不可為空");
      return;
    } else if (this.OPTIMAL_DIA_MIN === undefined) {
      myObj.message.create("error", "「最佳能力最小尺寸」不可為空");
      return;
    } else if (this.OPTIMAL_DIA_MAX === undefined) {
      myObj.message.create("error", "「最佳能力最大尺寸」不可為空");
      return;
    } else if (this.OPTIMAL_LENGTH_MIN === undefined) {
      myObj.message.create("error", "「最佳能力最小長度」不可為空");
      return;
    } else if (this.OPTIMAL_LENGTH_MAX === undefined) {
      myObj.message.create("error", "「最佳能力最大長度」不可為空");
      return;
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
    if (this.editCache2[id].data.SHOP_CODE === undefined || "" === this.editCache2[id].data.SHOP_CODE) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.editCache2[id].data.EQUIP_GROUP === undefined || "" === this.editCache2[id].data.EQUIP_GROUP) {
      myObj.message.create("error", "「機台群組」不可為空");
      return;
    } else if (this.editCache2[id].data.EQUIP_CODE === undefined || "" === this.editCache2[id].data.EQUIP_CODE) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.editCache2[id].data.PROCESS_CODE === undefined || "" === this.editCache2[id].data.PROCESS_CODE) {
      myObj.message.create("error", "「製程碼」不可為空");
      return;
    } else if (this.editCache2[id].data.GRADE_GROUP === undefined || "" === this.editCache2[id].data.GRADE_GROUP) {
      myObj.message.create("error", "「鋼種類別」不可為空");
      return;
    } else if (this.editCache2[id].data.SHAPE_TYPE === undefined || "" === this.editCache2[id].data.SHAPE_TYPE) {
      myObj.message.create("error", "「形狀」不可為空");
      return;
    } else if (this.editCache2[id].data.INPUT_DIA_MAX === undefined || "" === this.editCache2[id].data.INPUT_DIA_MAX.toString()) {
      myObj.message.create("error", "「投入尺寸上限」不可為空");
      return;
    } else if (this.editCache2[id].data.CAPABILITY_DIA_MIN === undefined || "" === this.editCache2[id].data.CAPABILITY_DIA_MIN.toString()) {
      myObj.message.create("error", "「設備能力最小尺寸」不可為空");
      return;
    } else if (this.editCache2[id].data.CAPABILITY_DIA_MAX === undefined || "" === this.editCache2[id].data.CAPABILITY_DIA_MAX.toString()) {
      myObj.message.create("error", "「設備能力最大尺寸」不可為空");
      return;
    } else if (this.editCache2[id].data.CAPABILITY_LENGTH_MIN === undefined || "" === this.editCache2[id].data.CAPABILITY_LENGTH_MIN.toString()) {
      myObj.message.create("error", "「設備能力最小長度」不可為空");
      return;
    } else if (this.editCache2[id].data.CAPABILITY_LENGTH_MAX === undefined || "" === this.editCache2[id].data.CAPABILITY_LENGTH_MAX.toString()) {
      myObj.message.create("error", "「設備能力最大長度」不可為空");
      return;
    } else if (this.editCache2[id].data.OPTIMAL_DIA_MIN === undefined || "" === this.editCache2[id].data.OPTIMAL_DIA_MIN.toString()) {
      myObj.message.create("error", "「最佳能力最小尺寸」不可為空");
      return;
    } else if (this.editCache2[id].data.OPTIMAL_DIA_MAX === undefined || "" === this.editCache2[id].data.OPTIMAL_DIA_MAX.toString()) {
      myObj.message.create("error", "「最佳能力最大尺寸」不可為空");
      return;
    } else if (this.editCache2[id].data.OPTIMAL_LENGTH_MIN === undefined || "" === this.editCache2[id].data.OPTIMAL_LENGTH_MIN.toString()) {
      myObj.message.create("error", "「最佳能力最小長度」不可為空");
      return;
    } else if (this.editCache2[id].data.OPTIMAL_LENGTH_MAX === undefined || "" === this.editCache2[id].data.OPTIMAL_LENGTH_MAX.toString())  {
      myObj.message.create("error", "「上最佳能力最大長度」不可為空");
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
        SHOP_CODE: this.SHOP_CODE,
        EQUIP_GROUP: this.EQUIP_GROUP,
        EQUIP_CODE: this.EQUIP_CODE,
        PROCESS_CODE: this.PROCESS_CODE,
        GRADE_GROUP: this.GRADE_GROUP,
        SHAPE_TYPE: this.SHAPE_TYPE,
        INPUT_DIA_MAX: this.INPUT_DIA_MAX,
        CAPABILITY_DIA_MIN: this.CAPABILITY_DIA_MIN,
        CAPABILITY_DIA_MAX: this.CAPABILITY_DIA_MAX,
        CAPABILITY_LENGTH_MIN: this.CAPABILITY_LENGTH_MIN,
        CAPABILITY_LENGTH_MAX: this.CAPABILITY_LENGTH_MAX,
        OPTIMAL_DIA_MIN: this.OPTIMAL_DIA_MIN,
        OPTIMAL_DIA_MAX: this.OPTIMAL_DIA_MAX,
        OPTIMAL_LENGTH_MIN: this.OPTIMAL_LENGTH_MIN,
        OPTIMAL_LENGTH_MAX: this.OPTIMAL_LENGTH_MAX,
        OPTION_EQUIP_1: this.OPTION_EQUIP_1,
        OPTION_EQUIP_2: this.OPTION_EQUIP_2,
        OPTION_EQUIP_3: this.OPTION_EQUIP_3,
        OPTION_EQUIP_4: this.OPTION_EQUIP_4,
        OPTION_EQUIP_5: this.OPTION_EQUIP_5,
        OPTION_EQUIP_6: this.OPTION_EQUIP_6,
        OPTION_EQUIP_7: this.OPTION_EQUIP_7,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })

      myObj.PPSService.insertI102Tab1Save('1', obj).subscribe(res => {

        console.log(res)
        if(res[0].MSG === "Y") {
          this.onInit();
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
        ID : this.editCache2[_id].data.tabID,
        SHOP_CODE : this.editCache2[_id].data.SHOP_CODE,
        EQUIP_GROUP : this.editCache2[_id].data.EQUIP_GROUP,
        EQUIP_CODE : this.editCache2[_id].data.EQUIP_CODE,
        PROCESS_CODE : this.editCache2[_id].data.PROCESS_CODE,
        GRADE_GROUP : this.editCache2[_id].data.GRADE_GROUP,
        SHAPE_TYPE : this.editCache2[_id].data.SHAPE_TYPE,
        INPUT_DIA_MAX : this.editCache2[_id].data.INPUT_DIA_MAX,
        CAPABILITY_DIA_MIN : this.editCache2[_id].data.CAPABILITY_DIA_MIN,
        CAPABILITY_DIA_MAX : this.editCache2[_id].data.CAPABILITY_DIA_MAX,
        CAPABILITY_LENGTH_MIN : this.editCache2[_id].data.CAPABILITY_LENGTH_MIN,
        CAPABILITY_LENGTH_MAX : this.editCache2[_id].data.CAPABILITY_LENGTH_MAX,
        OPTIMAL_DIA_MIN : this.editCache2[_id].data.OPTIMAL_DIA_MIN,
        OPTIMAL_DIA_MAX : this.editCache2[_id].data.OPTIMAL_DIA_MAX,
        OPTIMAL_LENGTH_MIN : this.editCache2[_id].data.OPTIMAL_LENGTH_MIN,
        OPTIMAL_LENGTH_MAX : this.editCache2[_id].data.OPTIMAL_LENGTH_MAX,
        OPTION_EQUIP_1 : this.editCache2[_id].data.OPTION_EQUIP_1,
        OPTION_EQUIP_2 : this.editCache2[_id].data.OPTION_EQUIP_2,
        OPTION_EQUIP_3 : this.editCache2[_id].data.OPTION_EQUIP_3,
        OPTION_EQUIP_4 : this.editCache2[_id].data.OPTION_EQUIP_4,
        OPTION_EQUIP_5 : this.editCache2[_id].data.OPTION_EQUIP_5,
        OPTION_EQUIP_6 : this.editCache2[_id].data.OPTION_EQUIP_6,
        OPTION_EQUIP_7 : this.editCache2[_id].data.OPTION_EQUIP_7,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })
      console.log(obj)
      myObj.PPSService.updateI102Tab1Save('1', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
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
      let _ID = this.editCache2[_id].data.tabID;
      myObj.PPSService.delI102Tab1Data('1', _ID).subscribe(res => {
        if(res[0].MSG === "Y") {
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

  // 資料過濾---設備能力 --> 站別
  searchByShopCode() : void{
    this.ppsInp02ListFilter("SHOP_CODE", this.searchShopCodeValue);
  } 
  resetByShopCode() : void{
    this.searchShopCodeValue = '';
    this.ppsInp02ListFilter("SHOP_CODE", this.searchShopCodeValue);
  }

  // 資料過濾---設備能力 --> 機台群組
  searchByEquipGroup() : void{
    this.ppsInp02ListFilter("EQUIP_GROUP", this.searchEquipGroupValue);
  } 
  resetByEquipGroup() : void{
    this.searchEquipGroupValue = '';
    this.ppsInp02ListFilter("EQUIP_GROUP", this.searchEquipGroupValue);
  }

  // 資料過濾---設備能力 --> 機台
  searchByEquipCode() : void{
    this.ppsInp02ListFilter("EQUIP_CODE", this.searchEquipCodeValue);
  } 
  resetByEquipCode() : void{
    this.searchEquipCodeValue = '';
    this.ppsInp02ListFilter("EQUIP_CODE", this.searchEquipCodeValue);
  }
  
  // 資料過濾---設備能力 --> 製程碼
  searchByProcessCode() : void{
    this.ppsInp02ListFilter("PROCESS_CODE", this.searchProcessCodeValue);
  } 
  resetByProcessCode() : void{
    this.searchProcessCodeValue = '';
    this.ppsInp02ListFilter("PROCESS_CODE", this.searchProcessCodeValue);
  }

  // 資料過濾---設備能力 --> 鋼種類別
  searchByGradeGroup() : void{
    this.ppsInp02ListFilter("GRADE_GROUP", this.searchGradeGroupValue);
  } 
  resetByGradeGroup() : void{
    this.searchGradeGroupValue = '';
    this.ppsInp02ListFilter("GRADE_GROUP", this.searchGradeGroupValue);
  }

  // 資料過濾---設備能力 --> 形狀
  searchByShapeType() : void{
    this.ppsInp02ListFilter("SHAPE_TYPE", this.searchShapeTypeValue);
  } 
  resetByShapeType() : void{
    this.searchShapeTypeValue = '';
    this.ppsInp02ListFilter("SHAPE_TYPE", this.searchShapeTypeValue);
  }
  
  // 資料過濾---設備能力 --> 投入尺寸上限
  searchByInputDiaMax() : void{
    this.ppsInp02ListFilter("INPUT_DIA_MAX", this.searchInputDiaMaxValue);
  } 
  resetByInputDiaMax() : void{
    this.searchInputDiaMaxValue = '';
    this.ppsInp02ListFilter("INPUT_DIA_MAX", this.searchInputDiaMaxValue);
  }
  
  // 資料過濾---設備能力 --> 設備能力最小尺寸
  searchByCapabilityDiaMin() : void{
    this.ppsInp02ListFilter("CAPABILITY_DIA_MIN", this.searchCapabilityDiaMinValue);
  } 
  resetByCapabilityDiaMin() : void{
    this.searchCapabilityDiaMinValue = '';
    this.ppsInp02ListFilter("CAPABILITY_DIA_MIN", this.searchCapabilityDiaMinValue);
  }
  
  // 資料過濾---設備能力 --> 設備能力最大尺寸
  searchByCapabilityDiaMax() : void{
    this.ppsInp02ListFilter("CAPABILITY_DIA_MAX", this.searchCapabilityDiaMaxValue);
  } 
  resetByCapabilityDiaMax() : void{
    this.searchCapabilityDiaMaxValue = '';
    this.ppsInp02ListFilter("CAPABILITY_DIA_MAX", this.searchCapabilityDiaMaxValue);
  }

  // 資料過濾---設備能力 --> 設備能力最小長度
  searchByCapabilityLengthMin() : void{
    this.ppsInp02ListFilter("CAPABILITY_LENGTH_MIN", this.searchCapabilityLengthMinValue);
  } 
  resetByCapabilityLengthMin() : void{
    this.searchCapabilityLengthMinValue = '';
    this.ppsInp02ListFilter("CAPABILITY_LENGTH_MIN", this.searchCapabilityLengthMinValue);
  }

  // 資料過濾---設備能力 --> 設備能力最大長度
  searchByCapabilityLengthMax() : void{
    this.ppsInp02ListFilter("CAPABILITY_LENGTH_MAX", this.searchCapabilityLengthMaxValue);
  } 
  resetByCapabilityLengthMax() : void{
    this.searchCapabilityLengthMaxValue = '';
    this.ppsInp02ListFilter("CAPABILITY_LENGTH_MAX", this.searchCapabilityLengthMaxValue);
  }

  // 資料過濾---設備能力 --> 最佳能力最小尺寸
   searchByOptimalDiaMin() : void{
    this.ppsInp02ListFilter("OPTIMAL_DIA_MIN", this.searchOptimalDiaMinValue);
  } 
  resetByOptimalDiaMin() : void{
    this.searchOptimalDiaMinValue = '';
    this.ppsInp02ListFilter("OPTIMAL_DIA_MIN", this.searchOptimalDiaMinValue);
  }

  // 資料過濾---設備能力 --> 最佳能力最大尺寸
   searchByOptimalDiaMax() : void{
    this.ppsInp02ListFilter("OPTIMAL_DIA_MAX", this.searchOptimalDiaMaxValue);
  } 
  resetByOptimalDiaMax() : void{
    this.searchOptimalDiaMaxValue = '';
    this.ppsInp02ListFilter("OPTIMAL_DIA_MAX", this.searchOptimalDiaMaxValue);
  }

  // 資料過濾---設備能力 --> 最佳能力最小長度
  searchByOptimalLengthMin() : void{
    this.ppsInp02ListFilter("OPTIMAL_LENGTH_MIN", this.searchOptimalLengthMinValue);
  } 
  resetByOptimalLengthMin() : void{
    this.searchOptimalLengthMinValue = '';
    this.ppsInp02ListFilter("OPTIMAL_LENGTH_MIN", this.searchOptimalLengthMinValue);
  }

  // 資料過濾---設備能力 --> 最佳能力最大長度
  searchByOptimalLengthMax() : void{
    this.ppsInp02ListFilter("OPTIMAL_LENGTH_MAX", this.searchOptimalLengthMaxValue);
  } 
  resetByOptimalLengthMax() : void{
    this.searchOptimalLengthMaxValue = '';
    this.ppsInp02ListFilter("OPTIMAL_LENGTH_MAX", this.searchOptimalLengthMaxValue);
  }

  // 資料過濾---設備能力 --> 替代機台順位1
  searchByoptionEquip1() : void{
    this.ppsInp02ListFilter("OPTION_EQUIP_1", this.searchoptionEquip1Value);
  } 
  resetByoptionEquip1() : void{
    this.searchoptionEquip1Value = '';
    this.ppsInp02ListFilter("OPTION_EQUIP_1", this.searchoptionEquip1Value);
  }

  // 資料過濾---設備能力 --> 替代機台順位2
  searchByoptionEquip2() : void{
    this.ppsInp02ListFilter("OPTION_EQUIP_2", this.searchoptionEquip2Value);
  } 
  resetByoptionEquip2() : void{
    this.searchoptionEquip2Value = '';
    this.ppsInp02ListFilter("OPTION_EQUIP_2", this.searchoptionEquip2Value);
  }

  // 資料過濾---設備能力 --> 替代機台順位3
  searchByoptionEquip3() : void{
    this.ppsInp02ListFilter("OPTION_EQUIP_3", this.searchoptionEquip3Value);
  } 
  resetByoptionEquip3() : void{
    this.searchoptionEquip3Value = '';
    this.ppsInp02ListFilter("OPTION_EQUIP_3", this.searchoptionEquip3Value);
  }

  // 資料過濾---設備能力 --> 替代機台順位4
  searchByoptionEquip4() : void{
    this.ppsInp02ListFilter("OPTION_EQUIP_4", this.searchoptionEquip4Value);
  } 
  resetByoptionEquip4() : void{
    this.searchoptionEquip4Value = '';
    this.ppsInp02ListFilter("OPTION_EQUIP_3", this.searchoptionEquip4Value);
  }
  
  // 資料過濾---設備能力 --> 替代機台順位5
  searchByoptionEquip5() : void{
    this.ppsInp02ListFilter("OPTION_EQUIP_5", this.searchoptionEquip5Value);
  } 
  resetByoptionEquip5() : void{
    this.searchoptionEquip5Value = '';
    this.ppsInp02ListFilter("OPTION_EQUIP_5", this.searchoptionEquip5Value);
  }

  // 資料過濾---設備能力 --> 替代機台順位6
  searchByoptionEquip6() : void{
    this.ppsInp02ListFilter("OPTION_EQUIP_6", this.searchoptionEquip6Value);
  } 
  resetByoptionEquip6() : void{
    this.searchoptionEquip6Value = '';
    this.ppsInp02ListFilter("OPTION_EQUIP_6", this.searchoptionEquip6Value);
  }
  
  // 資料過濾---設備能力 --> 替代機台順位7
  searchByoptionEquip7() : void{
    this.ppsInp02ListFilter("OPTION_EQUIP_7", this.searchoptionEquip7Value);
  } 
  resetByoptionEquip7() : void{
    this.searchoptionEquip3Value = '';
    this.ppsInp02ListFilter("OPTION_EQUIP_7", this.searchoptionEquip7Value);
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
    // let getFileNull = this.inputFileUseInUpload;
    // if(getFileNull === undefined){
    //   this.errorMSG('請選擇檔案', '');
    //   return;
    // }

    let lastname = this.file.name.split('.').pop();
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
        this.importExcel(this.importdata);
      }
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  importExcel(_data) {
    console.log("EXCEL 資料上傳檢核開始");
    var upload_data = [];
    for(let i=0 ; i < _data.length ; i++) {
      upload_data.push({
        PLANT_CODE : this.PLANT_CODE,
        SHOP_CODE: _data[i]['站別'].toString(),
        EQUIP_GROUP: _data[i]['機台群組'] === undefined ? null : _data[i]['機台群組'],
        EQUIP_CODE: _data[i]['機台'],
        PROCESS_CODE: _data[i]['製程碼'] === undefined ? null : _data[i]['製程碼'],
        GRADE_GROUP: _data[i]['鋼種類別'] === undefined ? null : _data[i]['鋼種類別'],
        SHAPE_TYPE: _data[i]['形狀'] === undefined ? null : _data[i]['形狀'],
        INPUT_DIA_MAX: _data[i]['投入尺寸上限'],
        CAPABILITY_DIA_MIN: _data[i]['設備能力最小尺寸'],
        CAPABILITY_DIA_MAX: _data[i]['設備能力最大尺寸'],
        CAPABILITY_LENGTH_MIN: _data[i]['設備能力最小長度'],
        CAPABILITY_LENGTH_MAX: _data[i]['設備能力最大長度'],
        OPTIMAL_DIA_MIN: _data[i]['最佳能力最小尺寸'],
        OPTIMAL_DIA_MAX: _data[i]['最佳能力最大尺寸'],
        OPTIMAL_LENGTH_MIN: _data[i]['最佳能力最小長度'],
        OPTIMAL_LENGTH_MAX: _data[i]['最佳能力最大長度'],
        OPTION_EQUIP_1: _data[i]['替代機台順位1'] === undefined ? null : _data[i]['替代機台順位1'],
        OPTION_EQUIP_2: _data[i]['替代機台順位2'] === undefined ? null : _data[i]['替代機台順位2'],
        OPTION_EQUIP_3: _data[i]['替代機台順位3'] === undefined ? null : _data[i]['替代機台順位3'],
        OPTION_EQUIP_4: _data[i]['替代機台順位4'] === undefined ? null : _data[i]['替代機台順位4'],
        OPTION_EQUIP_5: _data[i]['替代機台順位5'] === undefined ? null : _data[i]['替代機台順位5'],
        OPTION_EQUIP_6: _data[i]['替代機台順位6'] === undefined ? null : _data[i]['替代機台順位6'],
        OPTION_EQUIP_7: _data[i]['替代機台順位7'] === undefined ? null : _data[i]['替代機台順位7']
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

      myObj.PPSService.importI102Excel('1', obj).subscribe(res => {
        if(res[0].MSG === "Y") { 
          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getPPSINP02List()
          
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
      this.getPPSINP02List();
    });
  }

  convertToExcel() {
    let fileName = `設備能力_直棒`;
    let arr = [];
    for(let i=0 ; i < this.displayPPSINP02List.length ; i++){
      var ppsInp02 = {
        SHOP_CODE : this.displayPPSINP02List[i].SHOP_CODE,
        EQUIP_GROUP: this.displayPPSINP02List[i].EQUIP_GROUP,
        EQUIP_CODE : this.displayPPSINP02List[i].EQUIP_CODE,
        PROCESS_CODE : this.displayPPSINP02List[i].PROCESS_CODE,
        GRADE_GROUP : this.displayPPSINP02List[i].GRADE_GROUP,
        SHAPE_TYPE : this.displayPPSINP02List[i].SHAPE_TYPE,
        INPUT_DIA_MAX : this.displayPPSINP02List[i].INPUT_DIA_MAX,
        CAPABILITY_DIA_MIN: this.displayPPSINP02List[i].CAPABILITY_DIA_MIN,
        CAPABILITY_DIA_MAX : this.displayPPSINP02List[i].CAPABILITY_DIA_MAX,
        CAPABILITY_LENGTH_MIN : this.displayPPSINP02List[i].CAPABILITY_LENGTH_MIN,
        CAPABILITY_LENGTH_MAX : this.displayPPSINP02List[i].CAPABILITY_LENGTH_MAX,
        OPTIMAL_DIA_MIN : this.displayPPSINP02List[i].OPTIMAL_DIA_MIN,
        OPTIMAL_DIA_MAX : this.displayPPSINP02List[i].OPTIMAL_DIA_MAX,
        OPTIMAL_LENGTH_MIN : this.displayPPSINP02List[i].OPTIMAL_LENGTH_MIN,
        OPTIMAL_LENGTH_MAX: this.displayPPSINP02List[i].OPTIMAL_LENGTH_MAX,
        OPTION_EQUIP_1 : this.displayPPSINP02List[i].OPTION_EQUIP_1,
        OPTION_EQUIP_2 : this.displayPPSINP02List[i].OPTION_EQUIP_2,
        OPTION_EQUIP_3 : this.displayPPSINP02List[i].OPTION_EQUIP_3,
        OPTION_EQUIP_4 : this.displayPPSINP02List[i].OPTION_EQUIP_4,
        OPTION_EQUIP_5 : this.displayPPSINP02List[i].OPTION_EQUIP_5,
        OPTION_EQUIP_6 : this.displayPPSINP02List[i].OPTION_EQUIP_6,
        OPTION_EQUIP_7 : this.displayPPSINP02List[i].OPTION_EQUIP_7
      }
      arr.push(ppsInp02);
    }
    this.excelService.exportAsExcelFile(arr, fileName, this.titleArray);
  }

}
