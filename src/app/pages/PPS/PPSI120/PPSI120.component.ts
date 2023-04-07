import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import * as _ from "lodash";
import * as XLSX from 'xlsx';



interface ItemData9 {
  id: string;
  tab9ID: number;
  PLANT_CODE:string;
  SHOP_CODE:string;
  EQUIP_CODE: string;
  OP_CODE:string;
  OP_CODE1:string;
  OP_CODE2:string;
  OP_CODE3:string;
  TEMPERATURE: number;
  FREQUENCY: number;
  STEEL_GRADE_MIN: number;
  HEAT_MIN: number;
  ALTERNATE_SET:string;
}

@Component({
  selector: "app-PPSI120",
  templateUrl: "./PPSI120.component.html",
  styleUrls: ["./PPSI120.component.scss"],
  providers:[NzMessageService]
})
export class PPSI120Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;


  // 退火爐工時
  tab9ID;
  SHOP_CODE;
  EQUIP_CODE
  OP_CODE;
  OP_CODE1 = "";
  OP_CODE2 = "";
  OP_CODE3 = "";
  TEMPERATURE;
  FREQUENCY;
  STEEL_GRADE_MIN;
  HEAT_MIN;
  ALTERNATE_SET = "";
  isVisibleStove = false;
  searchShopCodeValue = '';
  searchEquipCodeValue = '';
  searchOpCodeValue = '';
  searchOpCode1Value = '';
  searchOpCode2Value = '';
  searchOpCode3Value = '';
  searchTemperatureValue = '';
  searchFrequencyValue = '';
  searchSteelGradeMinValue = '';
  searchHeatMinValue = '';
  searchAlternateSetValue = '';

  // 是否顯示「執行中」元件
  isSpinning = false;


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
    this.getPPSINP09List();
  }
  
 
  PPSINP09List_tmp;
  PPSINP09List: ItemData9[] = [];
  editCache9: { [key: string]: { edit: boolean; data: ItemData9 } } = {};
  displayPPSINP09List : ItemData9[] = [];
  //tab9_select 
  getPPSINP09List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP09List().subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP09List_tmp = res;

      console.log("OP_CODE", this.PPSINP09List_tmp[0].OP_CODE);
      
      console.table(this.PPSINP09List_tmp);

      const data = [];
      for (let i = 0; i < this.PPSINP09List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab9ID: this.PPSINP09List_tmp[i].ID,
          PLANT_CODE: this.PPSINP09List_tmp[i].PLANT_CODE,
          SHOP_CODE: this.PPSINP09List_tmp[i].SHOP_CODE,
          EQUIP_CODE: this.PPSINP09List_tmp[i].EQUIP_CODE,
          OP_CODE: this.PPSINP09List_tmp[i].OP_CODE,
          OP_CODE1: this.PPSINP09List_tmp[i].OP_CODE1,
          OP_CODE2: this.PPSINP09List_tmp[i].OP_CODE2,
          OP_CODE3: this.PPSINP09List_tmp[i].OP_CODE3,
          TEMPERATURE: this.PPSINP09List_tmp[i].TEMPERATURE,
          FREQUENCY: this.PPSINP09List_tmp[i].FREQUENCY,
          STEEL_GRADE_MIN: this.PPSINP09List_tmp[i].STEEL_GRADE_MIN,
          HEAT_MIN: this.PPSINP09List_tmp[i].HEAT_MIN,
          ALTERNATE_SET: this.PPSINP09List_tmp[i].ALTERNATE_SET
        });
      }
      this.PPSINP09List = data;
      this.displayPPSINP09List = this.PPSINP09List;
      this.updateEditCache();
      myObj.loading = false;
    });
  }

  // insert
  insertTab() {
    let myObj = this;
    if (this.SHOP_CODE === undefined) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.OP_CODE === undefined) {
      myObj.message.create("error", "「作業代碼」不可為空");
      return;
    } else if (this.TEMPERATURE === undefined) {
      myObj.message.create("error", "「溫度」不可為空");
      return;
    } else if (this.FREQUENCY === undefined) {
      myObj.message.create("error", "「頻率」不可為空");
      return;
    } else if (this.STEEL_GRADE_MIN === undefined) {
      myObj.message.create("error", "「每噸花時間」不可為空");
      return;
    } else if (this.HEAT_MIN === undefined) {
      myObj.message.create("error", "「每爐工時」不可為空");
      return;
    } else {
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
    this.editCache9[id].edit = true;
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
    const index = this.PPSINP09List.findIndex(item => item.id === id);
    this.editCache9[id] = {
      data: { ...this.PPSINP09List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache9[id].data.SHOP_CODE === undefined) {
      myObj.message.create("error", "「站號」不可為空");
      return;
    } else if (this.editCache9[id].data.EQUIP_CODE === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.editCache9[id].data.OP_CODE === undefined) {
      myObj.message.create("error", "「作業代碼」不可為空");
      return;
    } else if (this.editCache9[id].data.TEMPERATURE === undefined) {
      myObj.message.create("error", "「溫度」不可為空");
      return;
    } else if (this.editCache9[id].data.FREQUENCY === undefined) {
      myObj.message.create("error", "「頻率」不可為空");
      return;
    } else if (this.editCache9[id].data.STEEL_GRADE_MIN === undefined) {
      myObj.message.create("error", "「每噸花時間」不可為空");
      return;
    } else if (this.editCache9[id].data.HEAT_MIN === undefined) {
      myObj.message.create("error", "「每爐工時」不可為空");
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
    this.PPSINP09List.forEach(item => {
      this.editCache9[item.id] = {
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
        PLANT_CODE : this.PLANT_CODE,
        SHOP_CODE : this.SHOP_CODE,
        EQUIP_CODE : this.EQUIP_CODE,
        OP_CODE : this.OP_CODE,
        OP_CODE1 : this.OP_CODE1,
        OP_CODE2 : this.OP_CODE2,
        OP_CODE3 : this.OP_CODE3,
        TEMPERATURE : this.TEMPERATURE,
        FREQUENCY : this.FREQUENCY,
        STEEL_GRADE_MIN : this.STEEL_GRADE_MIN,
        HEAT_MIN : this.HEAT_MIN,
        ALTERNATE_SET : this.ALTERNATE_SET
      })

      myObj.PPSService.insertI109Tab1Save(obj).subscribe(res => {

        console.log(res)
        if(res[0].MSG === "Y") {
          this.SHOP_CODE = undefined;
          this.EQUIP_CODE = undefined;
          this.OP_CODE = undefined;
          this.OP_CODE1 = undefined;
          this.OP_CODE2 = undefined;
          this.OP_CODE3 = undefined;
          this.TEMPERATURE = undefined;
          this.FREQUENCY = undefined;
          this.STEEL_GRADE_MIN = undefined;
          this.HEAT_MIN = undefined;
          this.ALTERNATE_SET = undefined;
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


  // 修改資料
  updateSave(_id) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID : this.editCache9[_id].data.tab9ID,
        PLANT_CODE : this.editCache9[_id].data.PLANT_CODE,
        SHOP_CODE : this.editCache9[_id].data.SHOP_CODE,
        EQUIP_CODE : this.editCache9[_id].data.EQUIP_CODE,
        OP_CODE : this.editCache9[_id].data.OP_CODE,
        OP_CODE1 : this.editCache9[_id].data.OP_CODE1,
        OP_CODE2 : this.editCache9[_id].data.OP_CODE2,
        OP_CODE3 : this.editCache9[_id].data.OP_CODE3,
        TEMPERATURE : this.editCache9[_id].data.TEMPERATURE,
        FREQUENCY : this.editCache9[_id].data.FREQUENCY,
        STEEL_GRADE_MIN : this.editCache9[_id].data.STEEL_GRADE_MIN,
        HEAT_MIN : this.editCache9[_id].data.HEAT_MIN,
        ALTERNATE_SET : this.editCache9[_id].data.ALTERNATE_SET
      })
      myObj.PPSService.updateI109Tab1Save(obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.PLANT_CODE = undefined;
          this.SHOP_CODE = undefined;
          this.EQUIP_CODE = undefined;
          this.OP_CODE = undefined;
          this.OP_CODE1 = undefined;
          this.OP_CODE2 = undefined;
          this.OP_CODE3 = undefined;
          this.TEMPERATURE = undefined;
          this.FREQUENCY = undefined;
          this.STEEL_GRADE_MIN = undefined;
          this.HEAT_MIN = undefined;
          this.ALTERNATE_SET = undefined;

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

  
  // 刪除資料
  delID(_id) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let _ID = this.editCache9[_id].data.tab9ID;
      myObj.PPSService.delI109Tab1Data(_ID).subscribe(res => {
        if(res[0].MSG === "Y") {
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
  // 新增退火爐工時之彈出視窗 
  openStoveInput() : void {
    this.isVisibleStove = true;
  }
  // 取消退火爐工時之彈出視窗 
  cancelStoveInput() : void{
    this.isVisibleStove = false;
  }


// ============= 過濾資料之menu ========================
  // 退火爐工時
  ppsInp09ListFilter(property:string, keyWord:string) {
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
  searchByShopCode() : void {
    this.ppsInp09ListFilter("SHOP_CODE", this.searchShopCodeValue);
  } 
  resetByShopCode() : void {
    this.searchShopCodeValue = '';
    this.ppsInp09ListFilter("SHOP_CODE", this.searchShopCodeValue);
  }

  // 資料過濾---退火爐工時 --> 機台
  searchByEquipCode() : void {
    this.ppsInp09ListFilter("EQUIP_CODE", this.searchEquipCodeValue);
  } 
  resetByEquipCode() : void {
    this.searchEquipCodeValue = '';
    this.ppsInp09ListFilter("EQUIP_CODE", this.searchEquipCodeValue);
  }

  // 資料過濾---退火爐工時 --> 作業代碼
  searchByOpCode() : void {
    this.ppsInp09ListFilter("OP_CODE", this.searchOpCodeValue);
  } 
  resetByOpCode() : void {
    this.searchOpCodeValue = '';
    this.ppsInp09ListFilter("OP_CODE", this.searchOpCodeValue);
  }

  // 資料過濾---退火爐工時 --> 作業代碼1
  searchByOpCode1() : void {
    this.ppsInp09ListFilter("OP_CODE1", this.searchOpCode1Value);
  } 
  resetByOpCode1() : void {
    this.searchOpCode1Value = '';
    this.ppsInp09ListFilter("OP_CODE1", this.searchOpCode1Value);
  }

  // 資料過濾---退火爐工時 --> 作業代碼2
  searchByOpCode2() : void {
    this.ppsInp09ListFilter("OP_CODE2", this.searchOpCode2Value);
  } 
  resetByOpCode2() : void {
    this.searchOpCode2Value = '';
    this.ppsInp09ListFilter("OP_CODE2", this.searchOpCode2Value);
  }

  // 資料過濾---退火爐工時 --> 作業代碼3
  searchByOpCode3() : void {
    this.ppsInp09ListFilter("OP_CODE3", this.searchOpCode3Value);
  } 
  resetByOpCode3() : void {
    this.searchOpCode3Value = '';
    this.ppsInp09ListFilter("OP_CODE3", this.searchOpCode3Value);
  }

  // 資料過濾---退火爐工時 --> 溫度
  searchByTemperature() : void {
    this.ppsInp09ListFilter("TEMPERATURE", this.searchTemperatureValue);
  } 
  resetByTemperature() : void {
    this.searchTemperatureValue = '';
    this.ppsInp09ListFilter("TEMPERATURE", this.searchTemperatureValue);
  }

  // 資料過濾---退火爐工時 --> 頻率
  searchByFrequency() : void {
    this.ppsInp09ListFilter("FREQUENCY", this.searchFrequencyValue);
  } 
  resetByFrequency() : void {
    this.searchFrequencyValue = '';
    this.ppsInp09ListFilter("FREQUENCY", this.searchFrequencyValue);
  }

  // 資料過濾---退火爐工時 --> 每噸花時間
  searchBySteelGradeMin() : void {
    this.ppsInp09ListFilter("STEEL_GRADE_MIN", this.searchSteelGradeMinValue);
  } 
  resetBySteelGradeMin() : void {
    this.searchSteelGradeMinValue = '';
    this.ppsInp09ListFilter("STEEL_GRADE_MIN", this.searchSteelGradeMinValue);
  }

  // 資料過濾---退火爐工時 --> 每爐工時
  searchByHeateMin() : void {
    this.ppsInp09ListFilter("HEAT_MIN", this.searchHeatMinValue);
  } 
  resetByHeateMin() : void {
    this.searchHeatMinValue = '';
    this.ppsInp09ListFilter("HEAT_MIN", this.searchHeatMinValue);
  }

  // 資料過濾---退火爐工時 --> 穿插設定
  searchByAlternateSet() : void {
    this.ppsInp09ListFilter("ALTERNATE_SET", this.searchAlternateSetValue);
  } 
  resetByAlternateSet() : void {
    this.searchAlternateSetValue = '';
    this.ppsInp09ListFilter("ALTERNATE_SET", this.searchAlternateSetValue);
  }

//=============================================
// Excel 匯入、匯出
//=============================================

  // Excel 匯入
  jsonExcelData: any[] = [];
  handleImport($event: any) {

    const files = $event.target.files;

    if (files.length) {

      const reader = new FileReader();
      const file = files[0];

      // 文件加載完成後調用
      reader.onload = (e: any) => {
        this.isSpinning = true;

        // 從檔案獲取原始資料
        let data = e.target.result;

        // 從原始資料獲取工作簿
        // 兼容IE，需把type改為binary，並對data進行轉化
        let workbook = XLSX.read(data, {
          type: 'binary'
        });

        const sheets = workbook.SheetNames;

        if (sheets.length) {
          var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]], {
            defval: '' // 單元格為空的預設值
          });
          this.jsonExcelData = jsonData;

          if(this.jsonExcelData.length != 0){
            this.importExcel();
          }
          else{
            this.errorMSG("匯入失敗", `此檔案無任何數據`);
            this.isSpinning = false;
          }

        }
      }
      // 加載文件
      reader.readAsArrayBuffer(file);
    }
  }

  importExcel(){

    // 檢查欄位名稱是否都正確
    if(!this.checkExcelHeader(this.jsonExcelData[0])){
      this.errorMSG("匯入失敗", `Header名稱有誤或有缺失Header，請修正`);
      this.isSpinning = false;
      (<HTMLInputElement>document.getElementById("importExcel")).value = "" ;
      return;
    }
    console.log("匯入的Excle欄位名稱皆正確");

    // 校驗每個Excel欄位是否都有填寫
    if(!this.checkAllValuesNotEmpty(this.jsonExcelData)){
      this.isSpinning = false;
      (<HTMLInputElement>document.getElementById("importExcel")).value = "" ;
      return;
    }
    console.log("匯入的Excle特定的欄位都有填寫");

    // 將jsonData轉成英文的key
    this.convertJsonToEnglishKey();

    // 校驗Excel中的資料是否有重複
    if(this.checkDataDuplicate()){
      this.isSpinning = false;
      (<HTMLInputElement>document.getElementById("importExcel")).value = "" ;
      return;
    }
    console.log("匯入的Excle中的資料皆無重複");
    console.table(this.jsonExcelData);

    // 將資料全刪除，再匯入EXCEL檔內的資料
    const myThis = this;
    const p = this.deleteAllData();
    p.then(deleteSuccess =>{
      // 批次新增Excle中的資料
      return myThis.barchInsertExcelData();
    }).then(barchInsertSuccess =>{
      myThis.sucessMSG(barchInsertSuccess, ``);
      this.getPPSINP09List();
      myThis.isSpinning = false;
    }).catch(function(error) {
      myThis.isSpinning = false;
      myThis.errorMSG(error, ``);
    });
    (<HTMLInputElement>document.getElementById("importExcel")).value = "" ;

  }

  barchInsertExcelData(){
    const myThis = this;
    return new Promise(function(resolve, reject){
      myThis.PPSService.batchSaveI109Data(myThis.jsonExcelData).subscribe(response => {
        if (response.success === true) {
          resolve("匯入成功")
        } 
        else {
          reject(response.success)
        }
      }, error =>{
        reject(`匯入失敗，後台匯入錯誤，請聯繫系統工程師。Error Msg : ${JSON.stringify(error["error"])}`)
      });
    });

  }

  deleteAllData(){
    const myThis = this;
    return new Promise(function(resolve, reject){
      myThis.PPSService.deleteI109AllData().subscribe(response => {
        if (response.success === true) {
          resolve("刪除所有資料成功")
        } 
        else {
          resolve(response.success)
        }
      }, error =>{
        reject(`匯入失敗，後台匯入錯誤，請聯繫系統工程師。Error Msg : ${JSON.stringify(error["error"])}`)
      });
    });
  }

  checkDataDuplicate(){

    let i = 0;
    let j = 1;
    while(true){


      if(i === this.jsonExcelData.length-1) return false;

      if(j > this.jsonExcelData.length-1){
        i++;
        j = i+1;
      }

      if(i === this.jsonExcelData.length-1) return false;


      if(_.isEqual(this.jsonExcelData[i], this.jsonExcelData[j])){
        this.errorMSG("匯入失敗", `第 ${i+2} 行資料的與第 ${j+2} 行資料已重複，請修改後再匯入`);
        return true;
      }
      else{
        j++;
      }

    }
  }


  convertJsonToEnglishKey() : void {
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"站號":').join('"SHOP_CODE":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"機台":').join('"EQUIP_CODE":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"作業代碼":').join('"OP_CODE":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"作業代碼1":').join('"OP_CODE1":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"作業代碼2":').join('"OP_CODE2":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"作業代碼3":').join('"OP_CODE3":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"溫度":').join('"TEMPERATURE":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"頻率":').join('"FREQUENCY":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"每噸花時間":').join('"STEEL_GRADE_MIN":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"每爐工時":').join('"HEAT_MIN":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"穿插設定":').join('"ALTERNATE_SET":'));

    for (let i = 0; i < this.jsonExcelData.length; i++) {

      this.jsonExcelData[i].PLANT_CODE = this.PLANT_CODE;

      if(_.isEqual(this.jsonExcelData[i].OP_CODE1, '-') || _.isEqual(this.jsonExcelData[i].OP_CODE1, '')){
        this.jsonExcelData[i].OP_CODE1 = null;
      }

      if(_.isEqual(this.jsonExcelData[i].OP_CODE2, '-') || _.isEqual(this.jsonExcelData[i].OP_CODE2, '')){
        this.jsonExcelData[i].OP_CODE2 = null;
      }

      if(_.isEqual(this.jsonExcelData[i].ALTERNATE_SET, '-') || _.isEqual(this.jsonExcelData[i].ALTERNATE_SET, '')){
        this.jsonExcelData[i].ALTERNATE_SET = null;
      }

    }

  }

  checkAllValuesNotEmpty(jsonExcelData) : boolean{

    for (let i = 1; i <= jsonExcelData.length; i++){

      let rowNumberInExcel = i+1;

      if(_.isEmpty(String(jsonExcelData[i-1]["站號"])) || _.isEqual(String(jsonExcelData[i-1]["站號"]), '-')){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「站號」不得為空，請修正`);
        return false;
      }

      if(_.isEmpty(String(jsonExcelData[i-1]["機台"])) || _.isEqual(String(jsonExcelData[i-1]["機台"]), '-')){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「機台」不得為空，請修正`);
        return false;
      }

      // if(_.isEmpty(String(jsonExcelData[i-1]["作業代碼"])) || _.isEqual(String(jsonExcelData[i-1]["作業代碼"]), '-')){
      //   this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「作業代碼」不得為空，請修正`);
      //   return false;
      // }

      if(_.isEmpty(String(jsonExcelData[i-1]["溫度"])) || _.isEqual(String(jsonExcelData[i-1]["溫度"]), '-')){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「溫度」不得為空，請修正`);
        return false;
      }
      else if(!this.myIsNumber(jsonExcelData[i-1]["溫度"])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「溫度」必須為數字，請修正`);
        return false;
      }

      if(_.isEmpty(String(jsonExcelData[i-1]["頻率"])) || _.isEqual(String(jsonExcelData[i-1]["頻率"]), '-')){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「頻率」不得為空，請修正`);
        return false;
      }
      else if(!this.myIsNumber(jsonExcelData[i-1]["頻率"])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「頻率」必須為數字，請修正`);
        return false;
      }

      if(_.isEmpty(String(jsonExcelData[i-1]["每噸花時間"])) || _.isEqual(String(jsonExcelData[i-1]["每噸花時間"]), '-')){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「每噸花時間」不得為空，請修正`);
        return false;
      }
      else if(!this.myIsNumber(jsonExcelData[i-1]["每噸花時間"])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「每噸花時間」必須為數字，請修正`);
        return false;
      }

      // if(_.isEmpty(String(jsonExcelData[i-1]["每爐工時"])) || _.isEqual(String(jsonExcelData[i-1]["每爐工時"]), '-')){
      //   this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「每爐工時」不得為空，請修正`);
      //   return false;
      // }
      // else if(!this.myIsNumber(jsonExcelData[i-1]["每爐工時"])){
      //   this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「每爐工時」必須為數字，請修正`);
      //   return false;
      // }
      if(!_.isEmpty(String(jsonExcelData[i-1]["每爐工時"])) && !_.isEqual(String(jsonExcelData[i-1]["每爐工時"]), '-') && !this.myIsNumber(jsonExcelData[i-1]["每爐工時"])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「每爐工時」必須為數字，請修正`);
        return false;
      }
    } // end for

    return true;
  }

  myIsNumber(_data){
    return _data !== true && _data !== false && _data !== null && isNaN(_.toNumber(_data)) === false;
  }

  checkExcelHeader(d) : boolean{

    let b1 = false;
    let b2 = false;
    let b3 = false;
    let b4 = false;
    let b5 = false;
    let b6 = false;
    let b7 = false;
    let b8 = false;
    let b9 = false;
    let b10 = false;
    let b11 = false;
 
    const keys = Object.keys(d);

    keys.forEach(k =>{
      if(k === "站號") b1 = true;
      else if (k === "機台") b2 = true;
      else if (k === "作業代碼") b3 = true;
      else if (k === "作業代碼1") b4 = true;
      else if (k === "作業代碼2") b5 = true;
      else if (k === "作業代碼3") b6 = true;
      else if (k === "溫度") b7 = true;
      else if (k === "頻率") b8 = true;
      else if (k === "每噸花時間") b9 = true;
      else if (k === "每爐工時") b10 = true;
      else if (k === "穿插設定") b11 = true;
    });

    return b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9 && b10 && b11;
  }


  // Excel 匯出
  exportToExcel(){

    this.isSpinning = true;

    const exportJsonDataList = this.displayPPSINP09List.map(obj => {
      return _.omit(obj, ['id', 'tab9ID']);
    });

    const firstRow = ["SHOP_CODE", "EQUIP_CODE", "OP_CODE", "OP_CODE1", "OP_CODE2", "OP_CODE3", "TEMPERATURE", "FREQUENCY", "STEEL_GRADE_MIN", "HEAT_MIN", "ALTERNATE_SET"];
    const firstRowDisplay = {SHOP_CODE:"站號", EQUIP_CODE:"機台", OP_CODE:"作業代碼", OP_CODE1:"作業代碼1", OP_CODE2:"作業代碼2", OP_CODE3:"作業代碼3", TEMPERATURE:"溫度", FREQUENCY:"頻率", STEEL_GRADE_MIN:"每噸花時間", HEAT_MIN:"每爐工時", ALTERNATE_SET:"穿插設定"};
    const exportData = [firstRowDisplay, ...exportJsonDataList];  

    const workSheet = XLSX.utils.json_to_sheet(exportData,{header:firstRow, skipHeader:true});
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    XLSX.writeFileXLSX(workBook, '直棒退火爐工時.xlsx')

    this.isSpinning = false;
    this.sucessMSG("匯出成功!", ``);

  }


}
