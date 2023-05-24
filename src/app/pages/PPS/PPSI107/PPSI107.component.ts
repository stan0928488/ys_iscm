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
  DIA_MIN_5: number;
  DIA_MAX_5: number;
  SPEED_5: number;
  EQUIP_CAP_5: number;
}

@Component({
  selector: "app-PPSI107",
  templateUrl: "./PPSI107.component.html",
  styleUrls: ["./PPSI107.component.scss"],
  providers:[NzMessageService]
})
export class PPSI107Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 線速
  SHOP_CODE_5;
  EQUIP_CODE_5;
  SHAPE_TYPE_5;
  GRADE_GROUP_5;
  SPEED_TYPE_5;
  REDUCTION_RATE_MIN_5;
  REDUCTION_RATE_MAX_5;
  DIA_MIN_5;
  DIA_MAX_5;
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
  searchDiaMin5Value = '';
  searchDiaMax5Value = '';
  searchSpeed5Value = '';
  searchEquipCap5Value = '';

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["站號","機台","產出型態","鋼種類別","線速分類","減面率MIN","減面率MAX","產出尺寸最小值","產出尺寸最大值","線速(公尺/分)","日產出量"];
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
    this.getPPSINP05List();
  }
  
  
  PPSINP05List_tmp;
  PPSINP05List: ItemData05[] = [];
  editCache05: { [key: string]: { edit: boolean; data: ItemData05 } } = {};
  displayPPSINP05List : ItemData05[] = [];
  getPPSINP05List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP05List('1').subscribe(res => {
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
          DIA_MIN_5: this.PPSINP05List_tmp[i].DIA_MIN,
          DIA_MAX_5: this.PPSINP05List_tmp[i].DIA_MAX,
          SPEED_5: this.PPSINP05List_tmp[i].SPEED,
          EQUIP_CAP_5: this.PPSINP05List_tmp[i].EQUIP_CAP
        });
      }
      console.log("打印data");
      console.log(data);

      this.PPSINP05List = data;
      this.displayPPSINP05List = this.PPSINP05List;
      console.log("更新線速暫存區");
      this.updateEditCache();
      myObj.loading = false;
    });
  }

  // insert
  insertTab() {
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
    } else if (this.DIA_MIN_5 === undefined) {
      myObj.message.create("error", "「產出最小尺寸」不可為空");
      return;
    } else if (this.DIA_MAX_5 === undefined) {
      myObj.message.create("error", "「產出最大尺寸」不可為空");
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
          this.insertSave()
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }


  // update
  editRow(id: string): void {
    this.editCache05[id].edit = true;
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
    const index = this.PPSINP05List.findIndex(item => item.id === id);
    this.editCache05[id] = {
      data: { ...this.PPSINP05List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
    console.log("更改線速表");
    let myObj = this;
    if (this.editCache05[id].data.SHOP_CODE_5 === undefined || "" === this.editCache05[id].data.SHOP_CODE_5) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.editCache05[id].data.EQUIP_CODE_5 === undefined || "" === this.editCache05[id].data.EQUIP_CODE_5) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    }  else if (this.editCache05[id].data.SHAPE_TYPE_5 === undefined || "" === this.editCache05[id].data.SHAPE_TYPE_5) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    }   else if (this.editCache05[id].data.GRADE_GROUP_5 === undefined || "" === this.editCache05[id].data.GRADE_GROUP_5) {
      myObj.message.create("error", "「鋼種類別」不可為空");
      return;
    } else if (this.editCache05[id].data.REDUCTION_RATE_MIN_5 === undefined || "" === this.editCache05[id].data.REDUCTION_RATE_MIN_5.toString()) {
      myObj.message.create("error", "「減面率MIN」不可為空");
      return;
    }   else if (this.editCache05[id].data.REDUCTION_RATE_MAX_5 === undefined || "" === this.editCache05[id].data.REDUCTION_RATE_MAX_5.toString()) {
      myObj.message.create("error", "「減面率MAX」不可為空");
      return;
    }  else if (this.editCache05[id].data.DIA_MIN_5 === undefined || "" === this.editCache05[id].data.DIA_MIN_5.toString()) {
      myObj.message.create("error", "「最小產出尺寸不可為空");
      return;
    } else if (this.editCache05[id].data.DIA_MAX_5 === undefined || "" === this.editCache05[id].data.DIA_MAX_5.toString()) {
      myObj.message.create("error", "「最大產出尺寸」不可為空");
      return;
    } else if (this.editCache05[id].data.SPEED_5 === undefined || "" === this.editCache05[id].data.SPEED_5.toString()) {
      myObj.message.create("error", "「線速」不可為空");
      return;
    } else if (this.editCache05[id].data.EQUIP_CAP_5 === undefined || "" === this.editCache05[id].data.EQUIP_CAP_5.toString()) {
      myObj.message.create("error", "「日產出量」不可為空");
      return;}
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
  updateEditCache(): void {
    this.PPSINP05List.forEach(item => {
      this.editCache05[item.id] = {
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
        SHOP_CODE:this.SHOP_CODE_5,
        EQUIP_CODE:this.EQUIP_CODE_5,
        SHAPE_TYPE:this.SHAPE_TYPE_5,
        GRADE_GROUP:this.GRADE_GROUP_5,
        SPEED_TYPE:this.SPEED_TYPE_5,
        REDUCTION_RATE_MIN:this.REDUCTION_RATE_MIN_5,
        REDUCTION_RATE_MAX:this.REDUCTION_RATE_MAX_5,
        DIA_MIN:this.DIA_MIN_5,
        DIA_MAX:this.DIA_MAX_5,
        SPEED:this.SPEED_5,
        EQUIP_CAP:this.EQUIP_CAP_5,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })

      myObj.PPSService.insertI105Save('1', obj).subscribe(res => {
        console.log(res)
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_5 = undefined;
          this.EQUIP_CODE_5 = undefined;
          this.SHAPE_TYPE_5 = undefined;
          this.GRADE_GROUP_5 = undefined;
          this.SPEED_TYPE_5 = undefined;
          this.REDUCTION_RATE_MIN_5 = undefined;
          this.REDUCTION_RATE_MAX_5 = undefined;
          this.DIA_MIN_5 = undefined;
          this.DIA_MAX_5 = undefined;
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


  // 修改資料
  updateSave(_id) {
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
        DIA_MIN: this.editCache05[_id].data.DIA_MIN_5,
        DIA_MAX: this.editCache05[_id].data.DIA_MAX_5,
        SPEED: this.editCache05[_id].data.SPEED_5,
        EQUIP_CAP: this.editCache05[_id].data.EQUIP_CAP_5,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')})
      
        myObj.PPSService.updateI105Save('1', obj).subscribe(res => 
        {
          if(res[0].MSG === "Y") {
            this.SHOP_CODE_5 = undefined;
            this.EQUIP_CODE_5 = undefined;
            this.SHAPE_TYPE_5 = undefined;
            this.GRADE_GROUP_5 = undefined;
            this.SPEED_TYPE_5 = undefined;
            this.REDUCTION_RATE_MIN_5 = undefined;
            this.REDUCTION_RATE_MAX_5 = undefined;
            this.DIA_MIN_5 = undefined;
            this.DIA_MAX_5 = undefined;
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

  
  // 刪除資料
  delID(_id) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      console.log("當前線速暫存區");
      console.log(this.editCache05);
      console.log("_id");
      console.log(_id);
      console.log("BBBBBB"+this.editCache05[_id]);
      let _ID = this.editCache05[_id].data.tab5ID;
      myObj.PPSService.delI105Data('1', _ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.SHOP_CODE_5 = undefined;
          this.EQUIP_CODE_5 = undefined;
          this. SHAPE_TYPE_5 = undefined;
          this.GRADE_GROUP_5 = undefined;
          this.SPEED_TYPE_5 = undefined;
          this.REDUCTION_RATE_MIN_5 = undefined;
          this.REDUCTION_RATE_MAX_5 = undefined;
          this.DIA_MIN_5 = undefined;
          this.DIA_MAX_5 = undefined;
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
  // 新增線速之彈出視窗
  openSpeedInput() : void {
    this.isVisibleSpeed = true;
  }
  //取消線速之彈出視窗
  cancelSpeedInput() : void {
    this.isVisibleSpeed = false;
  }


// ============= 過濾資料之menu ========================
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
  searchByDiaMin5() : void {
    this.ppsInp05ListFilter("DIA_MIN_5", this.searchDiaMin5Value);
  } 
  resetByDiaMin5() : void {
    this.searchDiaMin5Value = '';
    this.ppsInp05ListFilter("DIA_MIN_5", this.searchDiaMin5Value);
  }

  // 資料過濾---線速 --> 產出最大尺寸
  searchByDiaMax5() : void {
    this.ppsInp05ListFilter("DIA_MAX_5", this.searchDiaMax5Value);
  } 
  resetByDiaMax5() : void {
    this.searchDiaMax5Value = '';
    this.ppsInp05ListFilter("DIA_MAX_5", this.searchDiaMax5Value);
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
  
    //let getFileNull = this.inputFileUseInUpload;
    //if(getFileNull === undefined){
    //this.errorMSG('請選擇檔案', '');
    //return;
    //}

    let lastname = this.file.name.split('.').pop();
    console.log("this.file.name: "+this.file.name);
    console.log("incomingfile e : " + this.file);
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
  
        
          console.log("importExcel")
          console.log(this.importdata)
          this.importExcel(this.importdata);
        
      }
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  importExcel(_data) {

    console.log("EXCEL 資料上傳檢核開始");
    var upload_data = [];
    for(let i=0 ; i < _data.length ; i++) {
      console.log(_data[i]);

      let allData = JSON.stringify(_data[i]);

        if (this.importdata_repeat.includes(allData)){
          this.errorMSG('重複資料', '第' + (i+2) + "筆與上一筆為重複資料");
          this.clearFile();
          return;
        }
        else{
          this.importdata_repeat.push(allData);         
          upload_data.push({
            SHOP_CODE:_data[i]['站號'].toString(),
            EQUIP_CODE:_data[i]['機台'],
            SHAPE_TYPE:_data[i]['產出型態'],
            GRADE_GROUP:_data[i]['鋼種類別'],
            SPEED_TYPE:_data[i]['線速分類'],
            REDUCTION_RATE_MIN:_data[i]['減面率MIN'],
            REDUCTION_RATE_MAX:_data[i]['減面率MAX'],
            DIA_MIN:_data[i]['產出尺寸最小值'],
            DIA_MAX:_data[i]['產出尺寸最大值'],
            SPEED:_data[i]['線速(公尺/分)'],
            EQUIP_CAP:_data[i]['日產出量'],
            USERNAME : this.USERNAME,
            DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
          })
        }
      
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

      console.log("EXCELDATA:"+ obj);
      myObj.PPSService.importI105Excel('1',obj).subscribe(res => {
        console.log("importExcelPPSI105");
        if(res[0].MSG === "Y") { 
          

          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getPPSINP05List()
          
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
    });
    this.getPPSINP05List();

  }

  convertToExcel() {
    console.log("convertToExcel");
    let ID_List = [];
    let arr = [];
    console.log(JSON.stringify(this.displayPPSINP05List[0]));
    let fileName = `線速 - 直棒`;
    for(let i = 0 ; i<this.displayPPSINP05List.length ; i++ ){

      var ppsInP05 = {
        SHOP_CODE_5:this.PPSINP05List_tmp[i].SHOP_CODE,
          EQUIP_CODE_5: this.PPSINP05List_tmp[i].EQUIP_CODE,
          SHAPE_TYPE_5: this.PPSINP05List_tmp[i].SHAPE_TYPE,
          GRADE_GROUP_5: this.PPSINP05List_tmp[i].GRADE_GROUP,
          SPEED_TYPE_5: this.PPSINP05List_tmp[i].SPEED_TYPE,
          REDUCTION_RATE_MIN_5: this.PPSINP05List_tmp[i].REDUCTION_RATE_MIN,
          REDUCTION_RATE_MAX_5: this.PPSINP05List_tmp[i].REDUCTION_RATE_MAX,
          DIA_MIN_5: this.PPSINP05List_tmp[i].DIA_MIN,
          DIA_MAX_5: this.PPSINP05List_tmp[i].DIA_MAX,
          SPEED_5: this.PPSINP05List_tmp[i].SPEED,
          EQUIP_CAP_5: this.PPSINP05List_tmp[i].EQUIP_CAP
      }
      arr.push(ppsInP05);
    }
    
    this.excelService.exportAsExcelFile(arr, fileName, this.titleArray);
  }
}
