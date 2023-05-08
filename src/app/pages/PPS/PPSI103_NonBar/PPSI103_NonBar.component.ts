import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import { zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import { NzMessageService} from "ng-zorro-antd/message"
import { NzModalService} from "ng-zorro-antd/modal"
import * as _ from "lodash";
import * as XLSX from 'xlsx';



interface ItemData {
  idx: number;
  ID: number;
  PLANT_CODE: string;
  SHOP_CODE: string;
  STEEL_TYPE: string;
  DIA_MIN: number;
  DIA_MAX: number;
  PACK_CODE: string;
  BEST_MACHINE: string;
  MACHINE1: string;
  MACHINE2: string;
  MACHINE3: string;
  COMMENT: string;
}


@Component({
  selector: "app-PPSI103_NonBar",
  templateUrl: "./PPSI103_NonBar.component.html",
  styleUrls: ["./PPSI103_NonBar.component.scss"],
  providers:[NzMessageService]
})
export class PPSI103_NonBarComponent implements AfterViewInit {
  LoadingPage = false;
  loading = false; //loaging data flag  
  isErrorMsg = false;
  arrayBuffer:any;
  file:File;
  importdata = [];
  importdata_new = [];
  isERROR = false;
  errorTXT = [];

  USERNAME;
  PLANT_CODE = '';
  SHOP_CODE = '';
  STEEL_TYPE = '';
  DIA_MIN = 0;
  DIA_MAX = 999;
  PACK_CODE = '';
  BEST_MACHINE = '';
  MACHINE1 = '';
  MACHINE2 = '';
  MACHINE3 = '';
  COMMENT = '';

  isVisibleCapability = false;
  searchShopCodeValue = '';
  searchSteelTypeValue = '';
  searchDiaMinValue = '';
  searchDiaMaxValue = '';
  searchPackCodeValue = '';
  searchBestMachineValue = '';
  searchMachine1Value = '';
  searchMachine2Value = '';
  searchMachine3Value = '';
  searchCommentValue = '';


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
    this.getPPSINP02List();
  }
  
  onInit() {
    this.SHOP_CODE = '';
    this.STEEL_TYPE = '';
    this.DIA_MIN = 0;
    this.DIA_MAX = 999;
    this.PACK_CODE = '';
    this.BEST_MACHINE = '';
    this.MACHINE1 = '';
    this.MACHINE2 = '';
    this.MACHINE3 = '';
    this.COMMENT = '';
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_new = [];
    this.isERROR = false;
    this.errorTXT = [];
  }

  PPSINP02List_tmp;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  PPSINP02List: ItemData[] = [];
  displayPPSINP02List: ItemData[] = [];

  getPPSINP02List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP02List('2').subscribe(res => {
      this.PPSINP02List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP02List_tmp.length ; i++) {
        data.push({
          idx: `${i}`,
          ID: this.PPSINP02List_tmp[i].ID,
          PLANT_CODE: this.PPSINP02List_tmp[i].PLANT_CODE,
          SHOP_CODE: this.PPSINP02List_tmp[i].SHOP_CODE,
          STEEL_TYPE: this.PPSINP02List_tmp[i].STEEL_TYPE,
          DIA_MIN: this.PPSINP02List_tmp[i].DIA_MIN,
          DIA_MAX: this.PPSINP02List_tmp[i].DIA_MAX,
          PACK_CODE: this.PPSINP02List_tmp[i].PACK_CODE,
          BEST_MACHINE: this.PPSINP02List_tmp[i].BEST_MACHINE,
          MACHINE1: this.PPSINP02List_tmp[i].MACHINE1,
          MACHINE2: this.PPSINP02List_tmp[i].MACHINE2,
          MACHINE3: this.PPSINP02List_tmp[i].MACHINE3,
          COMMENT: this.PPSINP02List_tmp[i].COMMENT
        });
      }
      this.PPSINP02List = data;
      this.displayPPSINP02List = this.PPSINP02List;
      this.updateEditCache();
      console.log(this.PPSINP02List);
      myObj.loading = false;
    });
  }

  

  // insert
  insertTab() {
    let myObj = this;
    if (this.SHOP_CODE === "") {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.STEEL_TYPE === "") {
      myObj.message.create("error", "「鋼種」不可為空")
    } else if (this.DIA_MIN === undefined) {
      myObj.message.create("error", "「尺寸MIN」不可為空")
    } else if (this.DIA_MAX === undefined) {
      myObj.message.create("error", "「尺寸MAX」不可為空")
    } else if (this.PACK_CODE === undefined) {
      myObj.message.create("error", "「包裝碼」不可為空")
    } else if (this.BEST_MACHINE === "") {
      myObj.message.create("error", "「最佳機台」不可為空")
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave()
        }
    })}
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
    const index = this.PPSINP02List.findIndex(item => item.idx === id);
    this.editCache[id] = {
      data: { ...this.PPSINP02List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: number): void {
    console.log(this.editCache[id])

    let myObj = this;
    if (this.editCache[id].data.SHOP_CODE === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.editCache[id].data.STEEL_TYPE === undefined) {
      myObj.message.create("error", "「鋼種」不可為空");
      return;
    } else if (this.editCache[id].data.DIA_MIN === undefined) {
      myObj.message.create("error", "「尺寸MIN」不可為空");
      return;
    } else if (this.editCache[id].data.DIA_MAX === undefined) {
      myObj.message.create("error", "「尺寸MAX」不可為空");
      return;
    } else if (this.editCache[id].data.PACK_CODE === undefined) {
      myObj.message.create("error", "「包裝碼」不可為空");
      return;
    } else if (this.editCache[id].data.BEST_MACHINE === undefined) {
      myObj.message.create("error", "「最佳機台」不可為空");
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
    this.PPSINP02List.forEach(item => {
      this.editCache[item.idx] = {
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
        PLANT_CODE: this.PLANT_CODE,
        SHOP_CODE: this.SHOP_CODE,
        STEEL_TYPE: this.STEEL_TYPE,
        DIA_MIN: this.DIA_MIN,
        DIA_MAX: this.DIA_MAX,
        PACK_CODE: this.PACK_CODE,
        BEST_MACHINE: this.BEST_MACHINE,
        MACHINE1: this.MACHINE1,
        MACHINE2: this.MACHINE2,
        MACHINE3: this.MACHINE3,
        COMMENT: this.COMMENT,
        USERNAME : this.USERNAME
      })

      myObj.PPSService.insertI102Tab1Save('2', obj).subscribe(res => {
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
        ID : this.editCache[_id].data.ID,
        PLANT_CODE : this.editCache[_id].data.PLANT_CODE,
        SHOP_CODE : this.editCache[_id].data.SHOP_CODE,
        STEEL_TYPE : this.editCache[_id].data.STEEL_TYPE,
        DIA_MIN : this.editCache[_id].data.DIA_MIN,
        DIA_MAX : this.editCache[_id].data.DIA_MAX,
        PACK_CODE : this.editCache[_id].data.PACK_CODE,
        BEST_MACHINE : this.editCache[_id].data.BEST_MACHINE,
        MACHINE1 : this.editCache[_id].data.MACHINE1,
        MACHINE2 : this.editCache[_id].data.MACHINE2,
        MACHINE3 : this.editCache[_id].data.MACHINE3,
        COMMENT : this.editCache[_id].data.COMMENT,
        USERNAME : this.USERNAME
      })
      console.log(obj)
      myObj.PPSService.updateI102Tab1Save('2', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.sucessMSG("修改成功", ``);
          const index = this.PPSINP02List.findIndex(item => item.idx === _id);
          Object.assign(this.PPSINP02List[index], this.editCache[_id].data);
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
      myObj.PPSService.delI102Tab1Data('2', _ID).subscribe(res => {
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


  
  //convert to Excel and Download
  convertToExcel() {
    let data;
    let fileName;
    let titleArray = [];
    if(this.PPSINP02List.length > 0) {
      data = this.formatDataForExcel(this.PPSINP02List);
      fileName = `非直棒設備能力`;
      titleArray = ['廠區別', '站別', '鋼種', '尺寸MIN', '尺寸MAX', '包裝碼', '最佳機台', '替代機台1', '替代機台2', '替代機台3', '備註'];
    } else {
      this.errorMSG("匯出失敗", "非直棒設備能力表目前無資料");
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
        PLANT_CODE: _.get(item, "PLANT_CODE"),
        SHOP_CODE: _.get(item, "SHOP_CODE"),
        STEEL_TYPE: _.get(item, "STEEL_TYPE"),
        DIA_MIN: _.get(item, "DIA_MIN"),
        DIA_MAX: _.get(item, "DIA_MAX"),
        PACK_CODE: _.get(item, "PACK_CODE"),
        BEST_MACHINE: _.get(item, "BEST_MACHINE"),
        MACHINE1: _.get(item, "MACHINE1"),
        MACHINE2: _.get(item, "MACHINE2"),
        MACHINE3: _.get(item, "MACHINE3"),
        COMMENT: _.get(item, "COMMENT")
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
    if(worksheet.A1 === undefined || worksheet.B1 === undefined || worksheet.C1 === undefined || worksheet.D1 === undefined || worksheet.E1 === undefined || worksheet.F1 === undefined ||
        worksheet.G1 === undefined || worksheet.H1 === undefined || worksheet.I1 === undefined || worksheet.J1 === undefined || worksheet.K1 === undefined) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if(worksheet.A1.v !== "廠區別" || worksheet.B1.v !== "站別" || worksheet.C1.v !== "鋼種" || worksheet.D1.v !== "尺寸MIN" || worksheet.E1.v !== "尺寸MAX" ||  worksheet.F1.v !== "包裝碼" || 
        worksheet.G1.v !== "最佳機台" || worksheet.H1.v !== "替代機台1" || worksheet.I1.v !== "替代機台2" || worksheet.J1.v !== "替代機台3" || worksheet.K1.v !== "備註") {
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
      let plantCode = _data[i].廠區別;
      let shopCode = _data[i].站別;
      let steelType = _data[i].鋼種;
      let diaMin = _data[i].尺寸MIN;
      let diaMax = _data[i].尺寸MAX;
      let packCode = _data[i].包裝碼;
      let bestMachine = _data[i].最佳機台;
      if(plantCode === undefined || shopCode === undefined || steelType === undefined || diaMin === undefined || diaMax === undefined || bestMachine === undefined) {
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

        let plantCode = _data[i].廠區別.toString();
        let shopCode = _data[i].站別.toString();
        let steelType = _data[i].鋼種.toString();
        let diaMin = _data[i].尺寸MIN !== undefined ? _data[i].尺寸MIN.toString() : '0';
        let diaMax = _data[i].尺寸MAX !== undefined ? _data[i].尺寸MAX.toString() : '999';
        let packCode = _data[i].包裝碼 !== undefined ? _data[i].包裝碼.toString() : '';
        let bestMachine = _data[i].最佳機台.toString();
        let machine1 = _data[i].替代機台1 !== undefined ? _data[i].替代機台1.toString() : '';
        let machine2 = _data[i].替代機台2 !== undefined ? _data[i].替代機台2.toString() : '';
        let machine3 = _data[i].替代機台3 !== undefined ? _data[i].替代機台3.toString() : '';
        let comment = _data[i].備註 !== undefined ? _data[i].備註.toString() : '';

        this.importdata_new.push({plantCode: plantCode, shopCode: shopCode, steelType: steelType, diaMin: diaMin, diaMax: diaMax, packCode: packCode,
              bestMachine: bestMachine, machine1: machine1, machine2: machine2, machine3: machine3, comment: comment});
      }

      return new Promise((resolve, reject) => {
        this.LoadingPage = true;
        let myObj = this;
        let obj = {};
        _.extend(obj, {
          EXCELDATA : this.importdata_new,
          USERCODE : this.USERNAME
        })
        myObj.PPSService.importI102Excel('2', obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.loading = false;
            this.LoadingPage = false;

            this.sucessMSG("EXCCEL上傳成功", "");
            this.getPPSINP02List();
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
  // 新增設備能力之彈出視窗
  openCapabilityInput() : void {
    this.isVisibleCapability = true;
  }
  //取消設備能力彈出視窗
  cancelCapabilityInput() : void {
    this.isVisibleCapability = false;
    this.onInit();
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

  // 資料過濾---設備能力 --> 鋼種
  searchBySteelType() : void{
    this.ppsInp02ListFilter("STEEL_TYPE", this.searchSteelTypeValue);
  } 
  resetBySteelType() : void{
    this.searchSteelTypeValue = '';
    this.ppsInp02ListFilter("STEEL_TYPE", this.searchSteelTypeValue);
  }

  // 資料過濾---設備能力 --> 尺寸MIN
  searchByDiaMin() : void{
    this.ppsInp02ListFilter("DIA_MIN", this.searchDiaMinValue);
  } 
  resetByDiaMin() : void{
    this.searchDiaMinValue = '';
    this.ppsInp02ListFilter("DIA_MIN", this.searchDiaMinValue);
  }
  
  // 資料過濾---設備能力 --> 尺寸MAX
  searchByDiaMax() : void{
    this.ppsInp02ListFilter("DIA_MAX", this.searchDiaMaxValue);
  } 
  resetByDiaMax() : void{
    this.searchDiaMaxValue = '';
    this.ppsInp02ListFilter("DIA_MAX", this.searchDiaMaxValue);
  }

  // 資料過濾---設備能力 --> 包裝碼
  searchByPackCode() : void{
    this.ppsInp02ListFilter("PACK_CODE", this.searchPackCodeValue);
  } 
  resetByPackCode() : void{
    this.searchPackCodeValue = '';
    this.ppsInp02ListFilter("PACK_CODE", this.searchPackCodeValue);
  }

  // 資料過濾---設備能力 --> 最佳機台
  searchByBestMachine() : void{
    this.ppsInp02ListFilter("BEST_MACHINE", this.searchBestMachineValue);
  } 
  resetByBestMachine() : void{
    this.searchBestMachineValue = '';
    this.ppsInp02ListFilter("BEST_MACHINE", this.searchBestMachineValue);
  }

  // 資料過濾---設備能力 --> 替代機台1
  searchByMachine1() : void{
    this.ppsInp02ListFilter("MACHINE1", this.searchMachine1Value);
  } 
  resetByMachine1() : void{
    this.searchMachine1Value = '';
    this.ppsInp02ListFilter("MACHINE1", this.searchMachine1Value);
  }
  
  // 資料過濾---設備能力 --> 替代機台2
  searchByMachine2() : void{
    this.ppsInp02ListFilter("MACHINE2", this.searchMachine2Value);
  } 
  resetByMachine2() : void{
    this.searchMachine2Value = '';
    this.ppsInp02ListFilter("MACHINE2", this.searchMachine2Value);
  }
  
  // 資料過濾---設備能力 --> 替代機台3
  searchByMachine3() : void{
    this.ppsInp02ListFilter("MACHINE3", this.searchMachine3Value);
  } 
  resetByMachine3() : void{
    this.searchMachine3Value = '';
    this.ppsInp02ListFilter("MACHINE3", this.searchMachine3Value);
  }
  
  // 資料過濾---設備能力 --> 投入尺寸上限
  searchByComment() : void{
    this.ppsInp02ListFilter("COMMENT", this.searchCommentValue);
  } 
  resetByComment() : void{
    this.searchCommentValue = '';
    this.ppsInp02ListFilter("COMMENT", this.searchCommentValue);
  }
  


}
