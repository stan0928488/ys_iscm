import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { LABService } from "src/app/services/LAB/LAB.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";


interface ItemData1 {
  id: string;
  tab1ID: number;
  GRADE_NO: string;
  GRADE_GROUP: string;
  SPECIAL_EQUIP_CODE: string;
}

@Component({
  selector: "app-LABI001",
  templateUrl: "./LABI001.component.html",
  styleUrls: ["./LABI001.component.scss"],
  providers:[NzMessageService]
})

export class LABI001Component implements AfterViewInit {
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

  // tab 1
  PPSINP01List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  PPSINP01List: ItemData1[] = [];
  displayPPSINP01List: ItemData1[] = [];
  

  constructor(
    private LABService: LABService,
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
    this.getPPSINP01List();
  }
  
  
  //tab1_select 
  getPPSINP01List() {
    this.loading = true;
    let myObj = this;
    // this.LABService.getPPSINP01List().subscribe(res => {
    //   console.log("getFCPTB26List success");
    //   this.PPSINP01List_tmp = res;

    //   const data = [];
    //   for (let i = 0; i < this.PPSINP01List_tmp.length ; i++) {
    //     data.push({
    //       id: `${i}`,
    //       tab1ID: this.PPSINP01List_tmp[i].ID,
    //       GRADE_NO: this.PPSINP01List_tmp[i].GRADE_NO,
    //       SPECIAL_EQUIP_CODE: this.PPSINP01List_tmp[i].SPECIAL_EQUIP_CODE,
    //       GRADE_GROUP: this.PPSINP01List_tmp[i].GRADE_GROUP
    //     });
    //   }
    //   this.PPSINP01List = data;
    //   this.displayPPSINP01List = this.PPSINP01List;
    //   this.updateEditCache(1);
    //   console.log(this.PPSINP01List);
    //   myObj.loading = false;
    // });
  }


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


  // update
  editRow(id: string, _type): void {
    if(_type === 1) {
      this.editCache1[id].edit = true;
    }
  }


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
    }
  }

  // cancel
  cancelEdit(id: string, _type): void {
    if(_type === 1) {
      const index = this.PPSINP01List.findIndex(item => item.id === id);
      this.editCache1[id] = {
        data: { ...this.PPSINP01List[index] },
        edit: false
      };
    }
  }


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
    }
  }


  // update
  updateEditCache(_type): void {
    if(_type === 1) {
      this.PPSINP01List.forEach(item => {
        this.editCache1[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }

  changeTab(tab): void {
    console.log(tab)
    if(tab === 1) {
      this.getPPSINP01List();
    }
  }
  

  // 新增資料
  insertSave(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      // return new Promise((resolve, reject) => {
      //   let obj = {};
      //   _.extend(obj, {
      //     GRADE_NO : this.GRADE_NO,
      //     GRADE_GROUP : this.GRADE_GROUP,
      //     SPECIAL_EQUIP_CODE : this.SPECIAL_EQUIP_CODE,
      //     USERNAME : this.USERNAME,
      //     DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      //   })

      //   myObj.LABService.insertI001Tab1Save(obj).subscribe(res => {

      //     console.log(res)
      //     if(res[0].MSG === "Y") {
      //       this.GRADE_NO = undefined;
      //       this.GRADE_GROUP = undefined;
      //       this.SPECIAL_EQUIP_CODE = undefined;
      //       this.getPPSINP01List();
      //       this.sucessMSG("新增成功", ``);
      //     } else {
      //       this.errorMSG("新增失敗", res[0].MSG);
      //     }
      //   },err => {
      //     reject('upload fail');
      //     this.errorMSG("新增失敗", "後台新增錯誤，請聯繫系統工程師");
      //     this.LoadingPage = false;
      //   })
      // });
    }
  }
  

  // 修改資料
  updateSave(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      // return new Promise((resolve, reject) => {
      //   let obj = {};
      //   _.extend(obj, {
      //     ID : this.editCache1[_id].data.tab1ID,
      //     GRADE_NO : this.editCache1[_id].data.GRADE_NO,
      //     GRADE_GROUP : this.editCache1[_id].data.GRADE_GROUP,
      //     SPECIAL_EQUIP_CODE : this.editCache1[_id].data.SPECIAL_EQUIP_CODE,
      //     USERNAME : this.USERNAME,
      //     DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      //   })
      //   myObj.LABService.updateI001Tab1Save(obj).subscribe(res => {
      //     if(res[0].MSG === "Y") {
      //       this.GRADE_NO = undefined;
      //       this.GRADE_GROUP = undefined;
      //       this.SPECIAL_EQUIP_CODE = undefined;

      //       this.sucessMSG("修改成功", ``);

      //       const index = this.PPSINP01List.findIndex(item => item.id === _id);
      //       Object.assign(this.PPSINP01List[index], this.editCache1[_id].data);
      //       this.editCache1[_id].edit = false;
      //     } else {
      //       this.errorMSG("修改失敗", res[0].MSG);
      //     }
      //   },err => {
      //     reject('upload fail');
      //     this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
      //     this.LoadingPage = false;
      //   })
      // });
    }
  }
  

  // 刪除資料
  delID(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      // return new Promise((resolve, reject) => {
      //   let _ID = this.editCache1[_id].data.tab1ID;
      //   myObj.LABService.delI001Tab1Data(_ID).subscribe(res => {
      //     if(res[0].MSG === "Y") {
      //       this.GRADE_NO = undefined;
      //       this.GRADE_GROUP = undefined;
      //       this.SPECIAL_EQUIP_CODE = undefined;
  
      //       this.sucessMSG("刪除成功", ``);
      //       this.getPPSINP01List();
      //     }
      //   },err => {
      //     reject('upload fail');
      //     this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
      //     this.LoadingPage = false;
      //   })
      // });
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
  

  
}
