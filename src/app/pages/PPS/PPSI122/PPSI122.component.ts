import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";


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

@Component({
  selector: "app-PPSI122",
  templateUrl: "./PPSI122.component.html",
  styleUrls: ["./PPSI122.component.scss"],
  providers:[NzMessageService]
})
export class PPSI122Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 桶槽式工時
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
    this.getPPSINP10List();
  }
  
 
  PPSINP10List_tmp;
  PPSINP10List: ItemData10[] = [];
  editCache10: { [key: string]: { edit: boolean; data: ItemData10 } } = {};
  displayPPSINP10List : ItemData10[] = [];
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
      this.updateEditCache();
      console.log(this.PPSINP10List);
      myObj.loading = false;
    });
  }


  // insert
  insertTab() {
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
          this.insertSave()
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }


  // update
  editRow(id: string): void {
    this.editCache10[id].edit = true;
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
    const index = this.PPSINP10List.findIndex(item => item.id === id);
    this.editCache10[id] = {
      data: { ...this.PPSINP10List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
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
          this.updateSave(id)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  

  // update
  updateEditCache(): void {
    this.PPSINP10List.forEach(item => {
      this.editCache10[item.id] = {
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


  // 修改資料
  updateSave(_id) {
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

  
  // 刪除資料
  delID(_id) {
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
  // 新增桶槽式工時之彈出視窗 
  openOtherShopInput(): void {
    this.isVisibleOtherShop = true;
  }
  // 取消桶槽式工時之彈出視窗 
  cancelOtherShopInput(): void {
    this.isVisibleOtherShop = false;
  }



// ============= 過濾資料之menu ========================
  // 桶槽式工時
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

  // 資料過濾---桶槽式工時 --> 站號
  searchByShopCode10() : void {
    this.ppsInp10ListFilter("SHOP_CODE_10", this.searchShopCode10Value);
  } 
  resetByShopCode10() : void {
    this.searchShopCode10Value = '';
    this.ppsInp10ListFilter("SHOP_CODE_10", this.searchShopCode10Value);
  }

  // 資料過濾---桶槽式工時 --> 機台碼
  searchByEquipCode10() : void {
    this.ppsInp10ListFilter("EQUIP_CODE_10", this.searchEquipCode10Value);
  } 
  resetByEquipCode10() : void {
    this.searchEquipCode10Value = '';
    this.ppsInp10ListFilter("EQUIP_CODE_10", this.searchEquipCode10Value);
  }

  // 資料過濾---桶槽式工時 --> 鋼種
  searchByGradeNo10() : void {
    this.ppsInp10ListFilter("GRADE_NO_10", this.searchGradeNo10Value);
  } 
  resetByGradeNo10() : void {
    this.searchGradeNo10Value = '';
    this.ppsInp10ListFilter("GRADE_NO_10", this.searchGradeNo10Value);
  }

  // 資料過濾---桶槽式工時 --> 長度最小值
  searchByLengthMin10() : void {
    this.ppsInp10ListFilter("LENGTH_MIN_10", this.searchLengthMin10Value);
  } 
  resetByLengthMin10() : void {
    this.searchLengthMin10Value = '';
    this.ppsInp10ListFilter("LENGTH_MIN_10", this.searchLengthMin10Value);
  }

  // 資料過濾---桶槽式工時 --> 長度最大值
  searchByLengthMax10() : void {
    this.ppsInp10ListFilter("LENGTH_MAX_10", this.searchLengthMax10Value);
  } 
  resetByLengthMax10() : void {
    this.searchLengthMax10Value = '';
    this.ppsInp10ListFilter("LENGTH_MAX_10", this.searchLengthMax10Value);
  }

  // 資料過濾---桶槽式工時 --> 最小尺寸
  searchByDiaMin10() : void {
    this.ppsInp10ListFilter("DIA_MIN_10", this.searchDiaMin10Value);
  } 
  resetByDiaMin10() : void {
    this.searchDiaMin10Value = '';
    this.ppsInp10ListFilter("DIA_MIN_10", this.searchDiaMin10Value);
  }

  // 資料過濾---桶槽式工時 --> 最大尺寸
  searchByDiaMax10() : void {
    this.ppsInp10ListFilter("DIA_MAX_10", this.searchDiaMax10Value);
  } 
  resetByDiaMax10() : void {
    this.searchDiaMax10Value = '';
    this.ppsInp10ListFilter("DIA_MAX_10", this.searchDiaMax10Value);
  }

  // 資料過濾---桶槽式工時 --> 總時間
  searchByTotalTimes10() : void {
    this.ppsInp10ListFilter("TOTAL_TIMES_10", this.searchTotalTimes10Value);
  } 
  resetByTotalTimes10() : void {
    this.searchTotalTimes10Value = '';
    this.ppsInp10ListFilter("TOTAL_TIMES_10", this.searchTotalTimes10Value);
  }

  // 資料過濾---桶槽式工時 --> 浸酸時間
  searchByPicklingTimes10() : void {
    this.ppsInp10ListFilter("PICKLING_TIMES_10", this.searchPicklingTimes10Value);
  } 
  resetByPicklingTimes10() : void {
    this.searchPicklingTimes10Value = '';
    this.ppsInp10ListFilter("PICKLING_TIMES_10", this.searchPicklingTimes10Value);
  }

  // 資料過濾---桶槽式工時 --> 清洗時間
  searchByWashingTimes10() : void {
    this.ppsInp10ListFilter("WASHING_TIMES_10", this.searchWashingTimes10Value);
  } 
  resetByWashingTimes10() : void {
    this.searchWashingTimes10Value = '';
    this.ppsInp10ListFilter("WASHING_TIMES_10", this.searchWashingTimes10Value);
  }

  // 資料過濾---桶槽式工時 --> 瀝乾時間
  searchByDrainingTimes10() : void {
    this.ppsInp10ListFilter("DRAINING_TIMES_10", this.searchDrainingTimes10Value);
  } 
  resetByDrainingTimes10() : void {
    this.searchDrainingTimes10Value = '';
    this.ppsInp10ListFilter("DRAINING_TIMES_10", this.searchDrainingTimes10Value);
  }

  // 資料過濾---桶槽式工時 --> 投入上限值
  searchByBatchCnt10() : void {
    this.ppsInp10ListFilter("BATCH_CNT_10", this.searchBatchCnt10Value);
  } 
  resetByBatchCnt10() : void {
    this.searchBatchCnt10Value = '';
    this.ppsInp10ListFilter("BATCH_CNT_10", this.searchBatchCnt10Value);
  }


}
