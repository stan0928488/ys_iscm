import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";




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
  selector: "app-PPSI103",
  templateUrl: "./PPSI103.component.html",
  styleUrls: ["./PPSI103.component.scss"],
  providers:[NzMessageService]
})
export class PPSI103Component implements AfterViewInit {
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

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["站別","機台群組","機台","製程碼","鋼種類別","形狀","投入尺寸上限","設備能力最小尺寸","設備能力最大尺寸","設備能力最小長度","設備能力最大長度","最佳能力最小尺寸","最佳能力最大尺寸","最佳能力最小長度","最佳能力最大長度","替代機台順位1","替代機台順位2","替代機台順位3"];
  importdata_repeat = [];
  constructor(
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
  }
  
  
  PPSINP02List_tmp;
  editCache2: { [key: string]: { edit: boolean; data: ItemData2 } } = {};
  PPSINP02List: ItemData2[] = [];
  displayPPSINP02List: ItemData2[] = [];

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
      myObj.message.create("error", "「站別」不可為空");
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
      myObj.message.create("error", "「站別」不可為空");
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

      myObj.PPSService.insertI102Tab1Save('1', obj).subscribe(res => {

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
      myObj.PPSService.updateI102Tab1Save('1', obj).subscribe(res => {
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
      myObj.PPSService.delI102Tab1Data('1', _ID).subscribe(res => {
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

  // 資料過濾---設備能力 --> 站別
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
        // PLANT_CODE : this.PLANT_CODE,
        SHOP_CODE: _data[i]['站別'],
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
        OPTION_EQUIP_3: _data[i]['替代機台順位3'] === undefined ? null : _data[i]['替代機台順位3']
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
        SHOP_CODE : this.displayPPSINP02List[i].SHOP_CODE_2,
        EQUIP_GROUP: this.displayPPSINP02List[i].EQUIP_GROUP_2,
        EQUIP_CODE : this.displayPPSINP02List[i].EQUIP_CODE_2,
        PROCESS_CODE : this.displayPPSINP02List[i].PROCESS_CODE_2,
        GRADE_GROUP : this.displayPPSINP02List[i].GRADE_GROUP_2,
        SHAPE_TYPE : this.displayPPSINP02List[i].SHAPE_TYPE_2,
        INPUT_DIA_MAX : this.displayPPSINP02List[i].INPUT_DIA_MAX_2,
        CAPABILITY_DIA_MIN: this.displayPPSINP02List[i].CAPABILITY_DIA_MIN_2,
        CAPABILITY_DIA_MAX : this.displayPPSINP02List[i].CAPABILITY_DIA_MAX_2,
        CAPABILITY_LENGTH_MIN : this.displayPPSINP02List[i].CAPABILITY_LENGTH_MIN_2,
        CAPABILITY_LENGTH_MAX : this.displayPPSINP02List[i].CAPABILITY_LENGTH_MAX_2,
        OPTIMAL_DIA_MIN : this.displayPPSINP02List[i].OPTIMAL_DIA_MIN_2,
        OPTIMAL_DIA_MAX : this.displayPPSINP02List[i].OPTIMAL_DIA_MAX_2,
        OPTIMAL_LENGTH_MIN : this.displayPPSINP02List[i].OPTIMAL_LENGTH_MIN_2,
        OPTIMAL_LENGTH_MAX: this.displayPPSINP02List[i].OPTIMAL_LENGTH_MAX_2,
        OPTION_EQUIP_1 : this.displayPPSINP02List[i].OPTION_EQUIP_1_2,
        OPTION_EQUIP_2 : this.displayPPSINP02List[i].OPTION_EQUIP_2_2,
        OPTION_EQUIP_3 : this.displayPPSINP02List[i].OPTION_EQUIP_3_2
      }
      arr.push(ppsInp02);
    }
    this.excelService.exportAsExcelFile(arr, fileName, this.titleArray);
  }

}
