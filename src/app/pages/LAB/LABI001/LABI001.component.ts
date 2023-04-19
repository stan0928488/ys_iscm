import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as _ from "lodash";
import * as XLSX from 'xlsx';



interface ItemData {
  idx: number;
  ID: number;
  cuso4_test: string;
  impact_test: string;
  dia_min: string;
  dia_max: string;
  shape: number;
  mechanical_properties_code: string;
  grade_no: string;
  experiment_days: string;
  RETURN_TIME: number;
  COOLING_TIME: number;
  OTHER_TIME: number;
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

  // 整備時間
  CUSO4_TEST = '';
  IMPACT_TEST = '';
  DIA_MIN = 0;
  DIA_MAX = 0;
  SHAPE = '';
  MECHANICAL_PROPERTIES_CODE = '';
  GRADE_NO = '';
  EXPERIMENT_DAYS = 0;
  OTHER_TIME = '';

  isVisiblePrepare = false;
  searchCuso4TestValue = '';
  searchImpactTestValue = '';
  searchDiaMinValue = '';
  searchDiaMaxValue = '';
  searchByShapeValue = '';
  searchOtherTimeValue = '';
  searchByMechanicalPropertiesCodeValue = '';
  searchByGradeNoValue = '';
  searchByExperimentDaysValue = '';
  searchCoolingTimeValue = '';

  isErrorMsg = false;;
  isERROR = false;
  arrayBuffer:any;
  file:File;
  importdata = [];
  importdata_new = [];
  errorTXT = [];
  data = [];
  constructor(
    private PPSService: PPSService,
    private excelService: ExcelService,
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
    this.getPPSINP03List();
  }
  
  onInit() {
    this.CUSO4_TEST = '';
    this.IMPACT_TEST = '';
    this.DIA_MIN = 0;
    this.DIA_MAX = 0;
    this.SHAPE = '';
    this.MECHANICAL_PROPERTIES_CODE = '';
    this.GRADE_NO = '';
    this.EXPERIMENT_DAYS = 0;
    this.OTHER_TIME = '';

    this.isVisiblePrepare = false;
    this.LoadingPage = false;
    this.searchCuso4TestValue = '';
    this.searchImpactTestValue = '';
    this.searchDiaMinValue = '';
    this.searchDiaMaxValue = '';
    this.searchByShapeValue = '';
    this.searchOtherTimeValue = '';
    this.searchByMechanicalPropertiesCodeValue = '';
    this.searchByGradeNoValue = '';
    this.searchByExperimentDaysValue = '';
    this.searchCoolingTimeValue = '';
    
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_new = [];
    this.isERROR = false;
    this.errorTXT = [];
  }

  
  PPSINP03List_tmp;
  PPSINP03List: ItemData[] = [];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  displayPPSINP03List: ItemData[] = [];
  
  getPPSINP03List() {
    this.loading = true;
      this.data = [
        {
          "idx": 0 ,
          "cuso4_test" :"N",
          "impact_test" :"N",
          "dia_min" :"0",
          "dia_max" :"40.00",
          "shape" :"H",
          "mechanical_properties_code" :'-',
          "grade_no" :'-',
          "experiment_days":"2"
        },
        {
          "idx": 1 ,
          "cuso4_test" :"N",
          "impact_test" :"N",
          "dia_min" :"0",
          "dia_max" :"40.00",
          "shape" :"S",
          "mechanical_properties_code" :'-',
          "grade_no" :'-',
          "experiment_days":"2"
        },
        {
          "idx": 2 ,
          "cuso4_test" :"N",
          "impact_test" :"N",
          "dia_min" :"0",
          "dia_max" :"40.00",
          "shape" :'-',
          "mechanical_properties_code" :'-',
          "grade_no" :"S303XX",
          "experiment_days":"2"
        },
        {
          "idx": 3 ,
          "cuso4_test" :"N",
          "impact_test" :"N",
          "dia_min" :"0",
          "dia_max" :"40.00",
          "shape" :'-',
          "mechanical_properties_code" :'-',
          "grade_no" :"S316LC",
          "experiment_days":"2"
        }
        
        ];

      
      this.updateEditCache();
      console.log(this.data);
      
  }

  

  // insert
  insertTab() {
    let myObj = this;
    if (this.EXPERIMENT_DAYS === 0 ) {
      myObj.message.create("error", "「實驗天數」不可為0天");
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
  editRow(id: number): void {
    console.log(id);
    console.log(this.editCache);
    this.editCache[id].edit = true;
  }
  
  // delete
  deleteRow(id: number): void {
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
  cancelEdit(id: number): void {
    const index = this.PPSINP03List.findIndex(item => item.idx === id);
    this.editCache[id] = {
      data: { ...this.PPSINP03List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: number): void {
    let myObj = this;
    /*create("error", "「站別」不可為空");
      return;
    } else if (this.editCache[id].data.EQUIP_CODE === undefined && this.editCache[id].data.EQUIP_GROUP === undefined) {
      myObj.message.create("error", "「機台」和「機群」至少填一項");
      return;
    } else if (this.editCache[id].data.LOAD_TIME === undefined) {
      myObj.message.create("error", "「上下料」不可為空");
      return;
    } else if (this.editCache[id].data.TRANSFER_TIME === undefined) {
      myObj.message.create("error", "「搬運」不可為空");
      return;
    } else if (this.editCache[id].data.BIG_ADJUST_TIME === undefined) {
      myObj.message.create("error", "「大調機」不可為空");
      return;
    } else if (this.editCache[id].data.SMALL_ADJUST_TIME === undefined) {
      myObj.message.create("error", "「小調機」不可為空");
      return;
    } else if (this.editCache[id].data.RETURN_TIME === undefined) {
      myObj.message.create("error", "「退料」不可為空");
      return;
    }  else if (this.editCache[id].data.COOLING_TIME === undefined) {
      myObj.message.create("error", "「冷卻」不可為空");
      return;
    } else if (this.editCache[id].data.OTHER_TIME === undefined) {
      myObj.message.create("error", "「其他整備」不可為空");
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
    */
  }
  

  // update
  updateEditCache(): void {
    this.data.forEach(item => {
      console.log(item)
      this.editCache[item.idx] = {
        edit: false,
        data: { ...item }
      };
    });
    console.log(this.editCache);
  }


  // 新增資料
  insertSave() {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        CUSO4_TEST:this.CUSO4_TEST,
        IMPACT_TEST:this.IMPACT_TEST,
        DIA_MIN:this.DIA_MIN,
        DIA_MAX:this.DIA_MAX,
        SHAPE:this.SHAPE,
        MECHANICAL_PROPERTIES_CODE:this.MECHANICAL_PROPERTIES_CODE,
        GRADE_NO:this.GRADE_NO ,
        EXPERIMENT_DAYS:this.EXPERIMENT_DAYS
    
      })

      myObj.PPSService.insertI103Tab1Save('2', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.getPPSINP03List();
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
  }


  // 修改資料
  updateSave(_id) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID : this.editCache[_id].data.ID,
        CUSO4_TEST : this.editCache[_id].data.cuso4_test,
        IMPACT_TEST : this.editCache[_id].data.impact_test,
        DIA_MIN : this.editCache[_id].data.dia_min,
        DIA_MAX : this.editCache[_id].data.dia_max,
        SHAPE : this.editCache[_id].data.shape,
        MECHANICAL_PROPERTIES_CODE : this.editCache[_id].data.mechanical_properties_code,
        GRADE_NO : this.editCache[_id].data.grade_no,
        EXPERIMENT_DAYS : this.editCache[_id].data.experiment_days,
        USERNAME : this.USERNAME
        
      })
      myObj.PPSService.updateI103Tab1Save('2', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.sucessMSG("修改成功", ``);
          const index = this.PPSINP03List.findIndex(item => item.idx === _id);
          Object.assign(this.PPSINP03List[index], this.editCache[_id].data);
          this.editCache[_id].edit = false;
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
      let _ID = this.editCache[_id].data.ID;
      myObj.PPSService.delI103Tab1Data('2', _ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
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

  
  //convert to Excel and Download
  convertToExcel() {
    let data;
    let fileName;
    let titleArray = [];
    if(this.data.length > 0) {
      data = this.formatDataForExcel(this.data);
      fileName = `非直棒整備時間`;
      titleArray = ['硫酸銅試驗', '衝擊試驗', '尺寸MIN', '尺寸MAX', '型態', '機械性質碼', '鋼種', '實驗天數'];
    } else {
      this.errorMSG("匯出失敗", "非直棒整備時間目前無資料");
      return;
    }
    this.excelService.exportAsExcelFile(data, fileName, titleArray);
  }

  formatDataForExcel(_displayData) {
    console.log("_displayData");
    let excelData = [];
    for (let item of _displayData) {
      let obj = {};
      _.extend(obj, {
        CUSO4_TEST: _.get(item, "cuso4_test"),
        IMPACT_TEST: _.get(item, "impact_test"),
        DIA_MIN: _.get(item, "dia_min"),
        DIA_MAX: _.get(item, "dia_max"),
        SHAPE: _.get(item, "shape"),
        MECHANICAL_PROPERTIES_CODE: _.get(item, "mechanical_properties_code"),
        GRADE_NO: _.get(item, "grade_no"),
        EXPERIMENT_DAYS: _.get(item, "experiment_days")
      });
      excelData.push(obj);
    }
    console.log(excelData);
    return excelData;
  }


  // excel檔名
  incomingfile(event) {
    this.file = event.target.files[0];
    console.log("incomingfile e1 : " + this.file);
    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    }
  }

  // EXCEL 匯入
  Upload() {
    let value = document.getElementsByTagName('input')[0].value;
    let lastname = this.file.name.split('.').pop();
    console.log("incomingfile e2 : " + this.file);
    if(value === "") {
      this.errorMSG('無檔案', '請先選擇欲上傳檔案。');
      this.clearFile();
    } else if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {
      this.Excelimport();
    }
  }
  // EXCEL 樣板內資料取得及檢誤
  Excelimport() {
    let fileReader = new FileReader();
    this.importdata = [];
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
      
      this.checkTemplate(worksheet, this.importdata);
    }
    console.log('hello');
    fileReader.readAsArrayBuffer(this.file);
  }


  // EXCEL 匯入樣版檢查
  checkTemplate(worksheet, importdata) {

    console.log('hello');
    if(worksheet.A1 === undefined || worksheet.B1 === undefined || worksheet.C1 === undefined || worksheet.D1 === undefined || worksheet.E1 === undefined ||
        worksheet.F1 === undefined || worksheet.G1 === undefined || worksheet.H1 === undefined || worksheet.I1 === undefined || worksheet.J1 === undefined || worksheet.K1 === undefined) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if(worksheet.A1.v !== "硫酸銅試驗" || worksheet.B1.v !== "衝擊試驗" || worksheet.C1.v !== "尺寸MIN" || worksheet.D1.v !== "尺寸MAX" || worksheet.E1.v !== "型態" || worksheet.F1.v !== "機械性質碼" 
        || worksheet.G1.v !== "鋼種" || worksheet.H1.v !== "實驗天數") {
      this.errorMSG('檔案樣板欄位表頭錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else {
      this.importExcel(importdata);
    }
  
  }
  
  // EXCEL 資料上傳 (ppsinptb02_nonbar)
  importExcel(_data) {
    for(let i=0 ; i < _data.length ; i++) {
      let experiment_days = _data[i].實驗天數;
      if(experiment_days === undefined) {
        let col = i+2;
        this.errorTXT.push(`第 ` + col + `列，有欄位為空值`);
        this.isERROR = true;
      }
    }

    if(this.isERROR) {
      // 匯入錯誤失敗訊息提醒
      this.clearFile();
      this.isErrorMsg = true;
      this.importdata_new = [];
      this.errorMSG("匯入錯誤", this.errorTXT);

    } else {
      for(let i=0 ; i < _data.length ; i++) {

        let cuso4Test = _data[i].硫酸銅試驗.toString();
        let impactTest = _data[i].衝擊試驗.toString();
        let diaMin = _data[i].尺寸MIN !== undefined || null? _data[i].尺寸MIN.toString() : '0';
        let diaMax = _data[i].尺寸MAX !== undefined || null? _data[i].尺寸MAX.toString() : '0';
        let shape = _data[i].型態 !== undefined || null? _data[i].型態.toString() : '';
        let mechanicalPropertiesCode = _data[i].機械性質碼 !== undefined || null? _data[i].機械性質碼.toString() : '';
        let gradeNo = _data[i].鋼種 !== undefined || null ? _data[i].鋼種.toString() : '';
        let experimentDays = _data[i].實驗天數 !== undefined || null ? _data[i].實驗天數.toString() : '0';
      

        this.importdata_new.push({cuso4Test: cuso4Test, impactTest: impactTest, diaMin: diaMin, diaMax: diaMax,
          shape: shape, mechanicalPropertiesCode: mechanicalPropertiesCode, gradeNo: gradeNo, experimentDays: experimentDays});
      }

      /*return new Promise((resolve, reject) => {
        this.LoadingPage = true;
        let myObj = this;
        let obj = {};
        _.extend(obj, {
          EXCELDATA : this.importdata_new,
          USERCODE : this.USERNAME
        })
        myObj.PPSService.importI103Excel('2', obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.loading = false;
            this.LoadingPage = false;

            this.sucessMSG("EXCCEL上傳成功", "");
            this.getPPSINP03List();
            this.clearFile();
            this.onInit();
          } else {
            this.errorMSG("匯入錯誤", res[0].MSG);
            this.clearFile();
            this.importdata_new = [];
            this.LoadingPage = false;
          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
          this.importdata_new = [];
          this.LoadingPage = false;
        })
      });
      */
    }
  }
  
  // 清空資料
  clearFile() {
    var objFile = document.getElementsByTagName('input')[0];
    console.log(objFile.value + "已清除");
    objFile.value = "";
    console.log(this.file)
    console.log(JSON.stringify(this.file))
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
  // 新增整備時間之彈出視窗
  openPrepareInput() : void {
    this.isVisiblePrepare = true;
  }
   //取消整備時間彈出視窗
   cancelPrepareInput() : void {
    this.isVisiblePrepare = false;
  }

// ============= 過濾資料之menu ========================
  // 4.(資料過濾)整備時間
  ppsInp03ListFilter(property:string, keyWord:string){
    console.log('filter');
    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      if (keyWord == "") {
        return true;
      } else {
        return _.startsWith(propertyValue, keyWord);
      }
    };

    const data = this.data.filter(item => filterFunc(item));
    this.data = data;
  }

  // 資料過濾---整備時間 --> 站別
  searchCuso4Test() : void{
    this.ppsInp03ListFilter("cuso4_test", this.searchCuso4TestValue);
  } 
  resetByCuso4Test() : void{
    this.searchCuso4TestValue = '';
    this.ppsInp03ListFilter("cuso4_test", this.searchCuso4TestValue);
  }

  // 資料過濾---整備時間 --> 機台
  searchImpactTest() : void{
    this.ppsInp03ListFilter("impact_test", this.searchImpactTestValue);
  } 
  resetByImpactTest() : void{
    this.searchImpactTestValue = '';
    this.ppsInp03ListFilter("impact_test", this.searchImpactTestValue);
  }
  // 資料過濾---整備時間 --> 機群
  searchDiaMin() : void{
    this.ppsInp03ListFilter("dia_min", this.searchDiaMinValue);
  } 
  resetByDiaMin() : void{
    this.searchDiaMinValue = '';
    this.ppsInp03ListFilter("dia_min", this.searchDiaMinValue);
  }

  // 資料過濾---整備時間 --> 上下料
  searchDiaMax() : void{
    this.ppsInp03ListFilter("dia_max", this.searchDiaMaxValue);
  } 
  resetByDiaMax() : void{
    this.searchDiaMaxValue = '';
    this.ppsInp03ListFilter("dia_max", this.searchDiaMaxValue);
  }

  // 資料過濾---整備時間 --> 搬運
  searchByShape() : void{
    console.log(this.searchByShapeValue);
    this.ppsInp03ListFilter("shape", this.searchByShapeValue);
  } 
  resetByShape() : void{
    this.searchByShapeValue = '';
    this.ppsInp03ListFilter("shape", this.searchByShapeValue);
  }

  // 資料過濾---整備時間 --> 大調機
  searchByMechanicalPropertiesCode() : void{
    this.ppsInp03ListFilter("mechanical_properties_code", this.searchByMechanicalPropertiesCodeValue);
  } 
  resetByMechanicalPropertiesCode() : void{
    this.searchByMechanicalPropertiesCodeValue = '';
    this.ppsInp03ListFilter("mechanical_properties_code", this.searchByMechanicalPropertiesCodeValue);
  }

  // 資料過濾---整備時間 --> 小調機
  searchByGradeNo() : void{
    this.ppsInp03ListFilter("grade_no", this.searchByGradeNoValue);
  } 
  resetByGradeNo() : void{
    this.searchByGradeNoValue = '';
    this.ppsInp03ListFilter("grade_no", this.searchByGradeNoValue);
  }

  // 資料過濾---整備時間 --> 退料
  searchByExperimentDays() : void{
    this.ppsInp03ListFilter("experiment_days", this.searchByExperimentDaysValue);
  } 
  resetByExperimentDays() : void{
    this.searchByExperimentDaysValue = '';
    this.ppsInp03ListFilter("experiment_days", this.searchByExperimentDaysValue);
  }
  


}
