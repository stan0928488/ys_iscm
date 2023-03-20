import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";


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

@Component({
  selector: "app-PPSI123",
  templateUrl: "./PPSI123.component.html",
  styleUrls: ["./PPSI123.component.scss"],
  providers:[NzMessageService]
})
export class PPSI123Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 清洗站設備能力表
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
    this.getPPSINP20List();
  }
  
 
  PPSINP20List_tmp;
  PPSINP20List: ItemData20[] = [];
  editCache20: { [key: string]: { edit: boolean; data: ItemData20 } } = {};
  displayPPSINP20List : ItemData20[] = [];
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
      this.updateEditCache();
      myObj.loading = false;
    });
  }


  // insert
  insertTab() {
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
          this.insertSave()
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }


  // update
  editRow(id: string): void {
    this.editCache20[id].edit = true;
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
    const index = this.PPSINP20List.findIndex(item => item.id === id);
    this.editCache20[id] = {
      data: { ...this.PPSINP20List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
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
          this.updateSave(id)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  

  // update
  updateEditCache(): void {
    this.PPSINP20List.forEach(item => {
      this.editCache20[item.id] = {
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


  // 修改資料
  updateSave(_id) {
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

  
  // 刪除資料
  delID(_id) {
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
  // 新增清洗站設備能力表之彈出視窗 
  openWashInput(): void {
    this.isVisibleWash = true;
  }
  // 取消清洗站設備能力表之彈出視窗 
  cancelWashInput() : void {
    this.isVisibleWash = false;
  }


// ============= 過濾資料之menu ========================
  // 清洗站設備能力表
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



}
