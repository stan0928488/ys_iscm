import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { LABService } from "src/app/services/LAB/LAB.service";
import { ExcelService } from "src/app/services/common/excel.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from "moment";
import { ThisReceiver } from "@angular/compiler";



interface ItemData {
  idx: number;
  id: number;
  cuso4_test: string;
  impact_test: string;
  dia_min: string;
  dia_max: string;
  shape: number;
  mechanical_properties_code: string;
  grade_no: string;
  experiment_days: string;
  del_status: number;

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

  CUSO4_TEST = 'N';
  IMPACT_TEST = 'N';
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
  tempData = [];
  
  constructor(
    private LABService : LABService,
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
    this.getLabI001List();
  }
  
  onInit() {
    this.CUSO4_TEST = 'N';
    this.IMPACT_TEST = 'N';
    this.DIA_MIN = 0;
    this.DIA_MAX = 0;
    this.SHAPE = '';
    this.MECHANICAL_PROPERTIES_CODE = '';
    this.GRADE_NO = '';
    this.EXPERIMENT_DAYS = 0;

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
    
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_new = [];
    this.isERROR = false;
    this.errorTXT = [];
  }

  
  tblabm001_tmp;
  tblabm001: ItemData[] = [];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  displaytblabm001: ItemData[] = [];
  
  getLabI001List() {
    this.loading = true;

    let myObj = this;

    myObj.LABService.getLab001Data().subscribe(res => {

      let result:any = res;
      this.tblabm001_tmp = result.data;

      const data = [];
      for (let i = 0; i < this.tblabm001_tmp.length ; i++) {
        
        data.push({
          idx: this.tblabm001_tmp[i].id,
          id: this.tblabm001_tmp[i].id,
          plant_code: this.tblabm001_tmp[i].plantCode,
          cuso4_test: this.tblabm001_tmp[i].cuso4Test,
          impact_test: this.tblabm001_tmp[i].impactTest,
          sale_order_dia: this.tblabm001_tmp[i].saleOrderDia,
          dia_min: this.tblabm001_tmp[i].diaMin,
          dia_max: this.tblabm001_tmp[i].diaMax,
          shape: this.tblabm001_tmp[i].shape,
          mechanical_properties_code: this.tblabm001_tmp[i].mechanicalPropertiesCode,
          grade_no: this.tblabm001_tmp[i].gradeNo,
          experiment_days: this.tblabm001_tmp[i].experimentDays,
          del_status: this.tblabm001_tmp[i].delStatus,
          date_create: this.tblabm001_tmp[i].dateCreate == null ? null:moment(this.tblabm001_tmp[i].dateCreate),
          user_create: this.tblabm001_tmp[i].userCreate,
          date_update: this.tblabm001_tmp[i].dateUpdate == null ? null : moment(this.tblabm001_tmp[i].dateUpdate),
          user_update: this.tblabm001_tmp[i].userUpdate
        });
      }
      this.data = data;
      this.tempData = data;
      this.displaytblabm001 = this.tblabm001;
      this.updateEditCache();
      myObj.loading = false;
      
    });
      
      
      
  }
  

  // insert
  insertTab() {
    let myObj = this;

    if(this.CUSO4_TEST === ''){
      myObj.message.create("新增錯誤","硫酸銅試驗 不可為空");
      return ;
    }else if(this.IMPACT_TEST === ''){
      myObj.message.create("新增錯誤","衝擊試驗 不可為空");
      return ;
    }else if(this.DIA_MAX === 0){
      myObj.message.create("新增錯誤","尺寸MAX 不可為0");
      return ;
    }else if (this.EXPERIMENT_DAYS === 0 ) {
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
    const index = this.data.findIndex(item => item.idx === id);
    this.editCache[id] = {
      data: { ...this.data[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: number): void {

    let myObj = this;

    if(this.editCache[id].data.cuso4_test === ''){
      myObj.message.create("修改錯誤","硫酸銅試驗 不可為空");
      return ;
    }else if(this.editCache[id].data.impact_test === ''){
      myObj.message.create("修改錯誤","衝擊試驗 不可為空");
      return ;
    }else if(this.editCache[id].data.dia_max === '0'){
      myObj.message.create("修改錯誤","尺寸MAX 不可為0");
      return ;
    }else if (this.editCache[id].data.experiment_days === '0') {
      myObj.message.create("修改錯誤", "「實驗天數」不可為0天");
      return;  
    }else {
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
    this.data.forEach(item => {
      // console.log(item)
      this.editCache[item.idx] = {
        edit: false,
        data: { ...item }
      };
    });
    // console.log(this.editCache);
  }


  // 新增資料
  insertSave() {
    let myObj = this;
    this.LoadingPage = true;
    
    return new Promise((resolve, reject) => {
      let obj = {};
      
      _.extend(obj, {
        cuso4Test:this.CUSO4_TEST,
        impactTest:this.IMPACT_TEST,
        diaMin:this.DIA_MIN,
        diaMax:this.DIA_MAX,
        shape:this.SHAPE == ''? null:this.SHAPE,
        mechanicalPropertiesCode:this.MECHANICAL_PROPERTIES_CODE == ''?null:this.MECHANICAL_PROPERTIES_CODE,
        gradeNo:this.GRADE_NO==''?null:this.GRADE_NO ,
        experimentDays:this.EXPERIMENT_DAYS,
        userCreate: this.USERNAME,
        dateCreate: moment(),
        plantCode : this.PLANT_CODE,
        delStatus : 0
      })
      myObj.LABService.saveLab001Data(obj).subscribe(res => {

        let result:any = res;

        if(result.code === 200) {
          this.onInit();
          this.getLabI001List();
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
        id : this.editCache[_id].data.id,
        cuso4Test : this.editCache[_id].data.cuso4_test,
        impactTest : this.editCache[_id].data.impact_test,
        diaMin : this.editCache[_id].data.dia_min,
        diaMax : this.editCache[_id].data.dia_max,
        shape : this.editCache[_id].data.shape,
        mechanicalPropertiesCode : this.editCache[_id].data.mechanical_properties_code,
        gradeNo : this.editCache[_id].data.grade_no,
        experimentDays : this.editCache[_id].data.experiment_days,
        userUpdate: this.USERNAME,
        dateUpdate: moment(),
        plantCode : this.PLANT_CODE,
        delStatus : this.editCache[_id].data.del_status
        
      })
      myObj.LABService.updateLab001Data(obj).subscribe(res => {
        let result:any = res;

        if(result.code === 200){
          this.sucessMSG("更新成功","更新成功");
          this.getLabI001List();
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
    this.LoadingPage = true;

    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        id : this.editCache[_id].data.id,
        cuso4Test : this.editCache[_id].data.cuso4_test,
        impactTest : this.editCache[_id].data.impact_test,
        diaMin : this.editCache[_id].data.dia_min,
        diaMax : this.editCache[_id].data.dia_max,
        shape : this.editCache[_id].data.shape,
        mechanicalPropertiesCode : this.editCache[_id].data.mechanical_properties_code,
        gradeNo : this.editCache[_id].data.grade_no,
        experimentDays : this.editCache[_id].data.experiment_days,
        userUpdate: this.USERNAME,
        dateUpdate: moment(),
        plantCode : this.PLANT_CODE,
        delStatus : this.editCache[_id].data.del_status
        
      })
      myObj.LABService.deleteLab001Data(obj).subscribe(res => {
        let result:any = res;

        if(result.code === 200){
          this.sucessMSG("刪除成功","刪除成功");
          this.getLabI001List();
        }
      },err => {
        reject('upload fail');
        this.errorMSG("修改失敗", "後台刪除錯誤，請聯繫系統工程師");
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
      fileName = `實驗室靜態資料_直棒`;
      titleArray = ['硫酸銅試驗', '衝擊試驗', '尺寸MIN', '尺寸MAX', '型態', '機械性質碼', '鋼種', '實驗天數'];
    } else {
      this.errorMSG("匯出失敗", "直棒實驗室靜態資料目前無資料");
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

    fileReader.readAsArrayBuffer(this.file);
  }


  // EXCEL 匯入樣版檢查
  checkTemplate(worksheet, importdata) {

    console.log('hello');
    if(worksheet.A1 === undefined || worksheet.B1 === undefined || worksheet.C1 === undefined || worksheet.D1 === undefined || worksheet.E1 === undefined ||
        worksheet.F1 === undefined || worksheet.G1 === undefined || worksheet.H1 === undefined ) {
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
      return ;
    } else {
      
      for(let i=0 ; i < _data.length ; i++) {

        let cuso4Test = _data[i].硫酸銅試驗.toString();
        let impactTest = _data[i].衝擊試驗.toString();
        let diaMin = _data[i].尺寸MIN !== undefined || null? _data[i].尺寸MIN.toString() : '0';
        let diaMax = _data[i].尺寸MAX !== undefined || null? _data[i].尺寸MAX.toString() : '0';
        let shape = _data[i].型態 !== undefined || null? _data[i].型態.toString() : null;
        let mechanicalPropertiesCode = _data[i].機械性質碼 !== undefined || null? _data[i].機械性質碼.toString() : null;
        let gradeNo = _data[i].鋼種 !== undefined || null ? _data[i].鋼種.toString() : null;
        let experimentDays = _data[i].實驗天數 !== undefined || null ? _data[i].實驗天數.toString() : '0';
        
        
        var findData = this.data.some(element => 
          element['cuso4_test'] == cuso4Test&&
          element['impact_test'] == impactTest&&
          element['dia_min'] == diaMin&&
          element['dia_max'] == diaMax&&
          element['shape'] == shape&&
          element['mechanical_properties_code'] == mechanicalPropertiesCode&&
          element['grade_no'] == gradeNo&&
          element['experiment_days'] == experimentDays);
        
        if(findData){
          this.errorTXT.push(`第 ` + (i +1) + `列`);
          this.isERROR = true;
        }
        this.importdata_new.push({cuso4Test: cuso4Test, impactTest: impactTest, diaMin: diaMin, diaMax: diaMax,
          shape: shape, mechanicalPropertiesCode: mechanicalPropertiesCode, gradeNo: gradeNo, experimentDays: experimentDays,userCreate: this.USERNAME
        ,dateCreate: moment(),plantCode : this.PLANT_CODE,delStatus : 0});
      }
      if(this.isERROR){
          this.clearFile();
          this.isErrorMsg = true;
          this.importdata_new = [];
          this.errorMSG("匯入錯誤", this.errorTXT + "，重複 請檢查");
      }
      else{
        return new Promise((resolve, reject) => {
          this.LoadingPage = true;
          let myObj = this;
          let obj = {};
          _.extend(obj, {
            EXCELDATA : this.importdata_new,
            USERCODE : this.USERNAME
          })
          myObj.LABService.batchsaveLab001Data(this.importdata_new).subscribe(res => {
            let result:any = res;

          if(result.code === 200){
            this.sucessMSG("EXCCEL上傳成功", "");
            this.getLabI001List();
          }
          else {
              this.errorMSG("匯入錯誤", "");
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
      }
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
  tblabm001Filter(property:string, keyWord:string){
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

  // 資料過濾 --> 硫酸銅試驗
  searchCuso4Test() : void{
    this.filterAll();
  } 
  resetByCuso4Test() : void{
    this.reset();
  }

  // 資料過濾 --> 衝擊試驗
  searchImpactTest() : void{
    this.filterAll();
  } 
  resetByImpactTest() : void{
    this.reset();
  }
  // 資料過濾 --> 尺寸MIN
  searchDiaMin() : void{
    this.filterAll();
  } 
  resetByDiaMin() : void{
    this.reset();
  }

  // 資料過濾 --> 尺寸Max
  searchDiaMax() : void{
    this.filterAll();
  } 
  resetByDiaMax() : void{
    this.reset();
  }

  // 資料過濾 --> 型態
  searchByShape() : void{
    this.filterAll();
  } 
  resetByShape() : void{
    this.reset();
  }

  // 資料過濾 --> 機械性質碼
  searchByMechanicalPropertiesCode() : void{
    this.filterAll();
  } 
  resetByMechanicalPropertiesCode() : void{
    this.reset();
  }

  // 資料過濾 --> 鋼種
  searchByGradeNo() : void{
    this.filterAll();
  } 
  resetByGradeNo() : void{
    this.reset();
  }

  // 資料過濾 --> 實驗天數
  searchByExperimentDays() : void{
    this.filterAll();
  } 
  resetByExperimentDays() : void{
    this.reset();
  }
  
  filterAll(){
    this.data = this.tempData;
    this.tblabm001Filter("cuso4_test", this.searchCuso4TestValue);
    this.tblabm001Filter("impact_test", this.searchImpactTestValue);
    this.tblabm001Filter("dia_min", this.searchDiaMinValue);
    this.tblabm001Filter("dia_max", this.searchDiaMaxValue);
    this.tblabm001Filter("shape", this.searchByShapeValue);
    this.tblabm001Filter("mechanical_properties_code", this.searchByMechanicalPropertiesCodeValue);
    this.tblabm001Filter("grade_no", this.searchByGradeNoValue);
    this.tblabm001Filter("experiment_days", this.searchByExperimentDaysValue);
  }

  reset(){
    this.searchCuso4TestValue = '';   
    this.searchImpactTestValue = '';
    this.searchDiaMinValue = '';
    this.searchDiaMaxValue = '';
    this.searchByShapeValue = '';
    this.searchByMechanicalPropertiesCodeValue = '';
    this.searchByGradeNoValue = '';
    this.searchByExperimentDaysValue = '';

    this.data = this.tempData;
  }

}
