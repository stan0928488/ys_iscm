import { Component, ElementRef, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import * as _ from "lodash";
import * as XLSX from 'xlsx';


interface ItemData {
  idx: number;
  id: number;
  plantCode: string;
  schShopCode: string;
  equipCode: string;
  equipGroup: string;
  equipProcessCode: string;
  diaMin: number;
  diaMax: number;
  wkSpeed: number;
}


@Component({
  selector: "app-PPSI107_NonBar",
  templateUrl: "./PPSI107_NonBar.component.html",
  styleUrls: ["./PPSI107_NonBar.component.scss"],
  providers:[NzMessageService]
})
export class PPSI107_NonBarComponent implements AfterViewInit {
  thisTabName = "線速工時(PPSI107)";
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  userName;
  plantCode;

  // 線速工時
  schShopCode = '';
  equipCode = '';
  equipGroup = '';
  equipProcessCode = '';
  diaMin = 0;
  diaMax = 0;
  wkSpeed = 0;

  isVisibleSpeed = false;
  searchSchShopCodeValue = '';
  searchEquipCodeValue = '';
  searchEquipGroupValue = '';
  searchEquipProcessCodeValue = '';
  searchDiaMinValue = '';
  searchDiaMaxValue = '';
  searchWkSpeedValue = '';

  isErrorMsg = false;;
  isERROR = false;
  arrayBuffer:any;
  file:File;
  importdata = [];
  importdata_new = [];
  errorTXT = [];

  constructor(
    private elementRef:ElementRef,
    private PPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.userName = this.cookieService.getCookie("USERNAME");
    this.plantCode = this.cookieService.getCookie("plantCode");
  }


  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getRunFCPCount();
    this.getPpsinptb05List();
    
    const aI107NTab = this.elementRef.nativeElement.querySelector('#aI107N') as HTMLAnchorElement;
    const liI107NTab = this.elementRef.nativeElement.querySelector('#liI107N') as HTMLLIElement;
    liI107NTab.style.backgroundColor = '#E4E3E3';
    aI107NTab.style.cssText = 'color: blue; font-weight:bold;'
  }
  

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.PPSService.getRunFCPCount().subscribe(res => {
      console.log("getRunFCPCount success");
      if(res > 0) this.isRunFCP = true;

    });
  }

  onInit() {
    this.schShopCode = '';
    this.equipCode = '';
    this.equipGroup = '';
    this.equipProcessCode = '';
    this.diaMin = 0;
    this.diaMax = 0;
    this.wkSpeed = 0;
  
    this.LoadingPage = false;
    this.isVisibleSpeed = false;
    this.searchSchShopCodeValue = '';
    this.searchEquipCodeValue = '';
    this.searchEquipGroupValue = '';
    this.searchEquipProcessCodeValue = '';
    this.searchDiaMinValue = '';
    this.searchDiaMaxValue = '';
    this.searchWkSpeedValue = '';
    
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_new = [];
    this.isERROR = false;
    this.errorTXT = [];
  }

  
  ppsinptb05Tmp;
  ppsinptb05List: ItemData[] = [];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  displayPpsinptb05List: ItemData[] = [];
  getPpsinptb05List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP05List('2').subscribe(res => {
      this.ppsinptb05Tmp = res;
      const data = [];
      for (let i = 0; i < this.ppsinptb05Tmp.length ; i++) {
        data.push({
          idx: `${i}`,
          id: this.ppsinptb05Tmp[i].id,
          plantCode: this.ppsinptb05Tmp[i].plantCode,
          schShopCode: this.ppsinptb05Tmp[i].schShopCode,
          equipCode: this.ppsinptb05Tmp[i].equipCode,
          equipGroup: this.ppsinptb05Tmp[i].equipGroup,
          equipProcessCode: this.ppsinptb05Tmp[i].equipProcessCode,
          diaMin: this.ppsinptb05Tmp[i].diaMin,
          diaMax: this.ppsinptb05Tmp[i].diaMax,
          wkSpeed: this.ppsinptb05Tmp[i].wkSpeed
        });
      }
      this.ppsinptb05List = data;
      this.displayPpsinptb05List = this.ppsinptb05List;
      this.updateEditCache();
      console.log(this.ppsinptb05List);
      myObj.loading = false;
    });
    
  }

 

  // insert
  insertTab() {
    let myObj = this;
    if (this.schShopCode === "") {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.equipCode === "" && this.equipGroup === "") {
      myObj.message.create("error", "「機台」和「機群」至少填一項");
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
    const index = this.ppsinptb05List.findIndex(item => item.idx === id);
    this.editCache[id] = {
      data: { ...this.ppsinptb05List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(id: number): void {
    let myObj = this;
    if (this.editCache[id].data.schShopCode === undefined) {
      myObj.message.create("error", "「站別」不可為空");
      return;
    } else if (this.editCache[id].data.equipCode === undefined && this.editCache[id].data.equipGroup === undefined) {
      myObj.message.create("error", "「機台」和「機群」至少填一項");
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
    this.ppsinptb05List.forEach(item => {
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
        plantCode : this.plantCode,
        schShopCode : this.schShopCode,
        equipCode : this.equipCode,
        equipGroup : this.equipGroup,
        equipProcessCode : this.equipProcessCode,
        diaMin : this.diaMin,
        diaMax : this.diaMax,
        wkSpeed : this.wkSpeed,
        userName : this.userName
      })

      myObj.PPSService.insertI105Save('2', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.getPpsinptb05List();
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
        plantCode : this.editCache[_id].data.plantCode,
        schShopCode : this.editCache[_id].data.schShopCode,
        equipCode : this.editCache[_id].data.equipCode,
        equipGroup : this.editCache[_id].data.equipGroup,
        equipProcessCode : this.editCache[_id].data.equipProcessCode,
        diaMin : this.editCache[_id].data.diaMin,
        diaMax : this.editCache[_id].data.diaMax,
        wkSpeed : this.editCache[_id].data.wkSpeed,
        userName : this.userName
      })
      myObj.PPSService.updateI105Save('2', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.sucessMSG("修改成功", ``);
          const index = this.ppsinptb05List.findIndex(item => item.idx === _id);
          Object.assign(this.ppsinptb05List[index], this.editCache[_id].data);
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
      let id = this.editCache[_id].data.id;
      myObj.PPSService.delI105Data('2', id).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.onInit();
          this.sucessMSG("刪除成功", ``);
          this.getPpsinptb05List();
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
    if(this.ppsinptb05List.length > 0) {
      data = this.formatDataForExcel(this.ppsinptb05List);
      fileName = `非直棒線速工時`;
      titleArray = ['廠區別', '站別', '機台', '機群', '製程代號', '尺寸MIN', '尺寸MAX', '生產速度'];
    } else {
      this.errorMSG("匯出失敗", "非直棒線速工時目前無資料");
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
        plantCode: _.get(item, "plantCode"),
        schShopCode: _.get(item, "schShopCode"),
        equipCode: _.get(item, "equipCode"),
        equipGroup: _.get(item, "equipGroup"),
        equipProcessCode: _.get(item, "equipProcessCode"),
        diaMin: _.get(item, "diaMin"),
        diaMax: _.get(item, "diaMax"),
        wkSpeed: _.get(item, "wkSpeed")
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
    if(worksheet.A1 === undefined || worksheet.B1 === undefined || worksheet.C1 === undefined || worksheet.D1 === undefined || worksheet.E1 === undefined ||
       worksheet.F1 === undefined || worksheet.G1 === undefined || worksheet.H1 === undefined) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if(worksheet.A1.v !== "廠區別" || worksheet.B1.v !== "站別" || worksheet.C1.v !== "機台" || worksheet.D1.v !== "機群" || worksheet.E1.v !== "製程代號" ||
              worksheet.F1.v !== "尺寸MIN" || worksheet.G1.v !== "尺寸MAX" || worksheet.H1.v !== "生產速度") {
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
      let schShopCode = _data[i].站別;
      let equipCode = _data[i].機台;
      let equipGroup = _data[i].機群;
      if(plantCode === undefined || schShopCode === undefined || (equipCode === undefined && equipGroup === undefined)) {
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
        let schShopCode = _data[i].站別.toString();
        let equipCode = _data[i].機台 !== undefined ? _data[i].機台.toString() : '';
        let equipGroup = _data[i].機群 !== undefined ? _data[i].機群.toString() : '';
        let equipProcessCode = _data[i].製程代號 !== undefined ? _data[i].製程代號.toString() : '';
        let diaMin = _data[i].尺寸MIN !== undefined ? _data[i].尺寸MIN.toString() : '0';
        let diaMax = _data[i].尺寸MAX !== undefined ? _data[i].尺寸MAX.toString() : '0';
        let wkSpeed = _data[i].生產速度 !== undefined ? _data[i].生產速度.toString() : '0';
        this.importdata_new.push({plantCode: plantCode, schShopCode: schShopCode, equipCode: equipCode, equipGroup: equipGroup, 
                                  equipProcessCode: equipProcessCode, diaMin: diaMin, diaMax: diaMax, wkSpeed: wkSpeed});
      }

      return new Promise((resolve, reject) => {
        this.LoadingPage = true;
        let myObj = this;
        let obj = {};
        _.extend(obj, {
          excelData : this.importdata_new,
          userName : this.userName
        })
        myObj.PPSService.importI105Excel('2', obj).subscribe(res => {
          if(res[0].MSG === "Y") {
            this.loading = false;
            this.LoadingPage = false;

            this.sucessMSG("EXCCEL上傳成功", "");
            this.getPpsinptb05List();
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
  // 新增線速工時之彈出視窗
  openSpeedInput() : void {
    this.isVisibleSpeed = true;
  }
   //取消線速工時彈出視窗
   cancelSpeedInput() : void {
    this.isVisibleSpeed = false;
  }

// ============= 過濾資料之menu ========================
  // 4.(資料過濾)線速工時
  ppsinptb05ListFilter(property:string, keyWord:string){
    const filterFunc = item => {
      let propertyValue = _.get(item, property);
      if (keyWord == "") {
        return true;
      } else {
        return _.startsWith(propertyValue, keyWord);
      }
    };

    const data = this.ppsinptb05List.filter(item => filterFunc(item));
    this.displayPpsinptb05List = data;
  }

  // 資料過濾---線速工時 --> 站別
  searchSchShopCode() : void{
    this.ppsinptb05ListFilter("schShopCode", this.searchSchShopCodeValue);
  } 
  resetBySchShopCode() : void{
    this.searchSchShopCodeValue = '';
    this.ppsinptb05ListFilter("schShopCode", this.searchSchShopCodeValue);
  }

  // 資料過濾---線速工時 --> 機台
  searchEquipCode() : void{
    this.ppsinptb05ListFilter("equipCode", this.searchEquipCodeValue);
  } 
  resetByEquipCode() : void{
    this.searchEquipCodeValue = '';
    this.ppsinptb05ListFilter("equipCode", this.searchEquipCodeValue);
  }
  // 資料過濾---線速工時 --> 機群
  searchEquipGroup() : void{
    this.ppsinptb05ListFilter("equipGroup", this.searchEquipGroupValue);
  } 
  resetByEquipGroup() : void{
    this.searchEquipGroupValue = '';
    this.ppsinptb05ListFilter("equipGroup", this.searchEquipGroupValue);
  }
  // 資料過濾---線速工時 --> 製程代號
  searchEquipProcessCode() : void{
    this.ppsinptb05ListFilter("equipGroup", this.searchEquipProcessCodeValue);
  } 
  resetByEquipProcessCode() : void{
    this.searchEquipProcessCodeValue = '';
    this.ppsinptb05ListFilter("equipGroup", this.searchEquipProcessCodeValue);
  }

  // 資料過濾---線速工時 --> 尺寸MIN
  searchDiaMin() : void{
    this.ppsinptb05ListFilter("diaMin", this.searchDiaMinValue);
  } 
  resetByDiaMin() : void{
    this.searchDiaMinValue = '';
    this.ppsinptb05ListFilter("diaMin", this.searchDiaMinValue);
  }

  // 資料過濾---線速工時 --> 尺寸MAX
  searchDiaMax() : void{
    this.ppsinptb05ListFilter("diaMax", this.searchDiaMaxValue);
  } 
  resetByDiaMax() : void{
    this.searchDiaMaxValue = '';
    this.ppsinptb05ListFilter("diaMax", this.searchDiaMaxValue);
  }

  // 資料過濾---線速工時 --> 生產速度
  searchByWkSpeed() : void{
    this.ppsinptb05ListFilter("wkSpeed", this.searchWkSpeedValue);
  } 
  resetByWkSpeed() : void{
    this.searchWkSpeedValue = '';
    this.ppsinptb05ListFilter("wkSpeed", this.searchWkSpeedValue);
  }


}
