import { Component, AfterViewInit, NgZone,EventEmitter } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import { registerLocaleData, DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CellClickedEvent, 
  ColDef, 
  ColGroupDef,
} from 'ag-grid-community';

import { Router } from "@angular/router";
import * as moment from 'moment';
import * as _ from "lodash";
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

interface data {

}
@Component({
  selector: 'app-PPSI205_401',
  templateUrl: './PPSI205_401.component.html',
  styleUrls: ['./PPSI205_401.component.scss'],
  providers:[NzMessageService,DatePipe]
})
export class PPSI205_401Component implements AfterViewInit {

  
  titleArray1 = [
    '月份',
    '站別',
    '機台',
    '產出型態',
    '產出尺寸',
    '現況尺寸',
    '最終製程',
    '鋼種群組',
    '製程碼',
  ];
  titleArray2 = [
    '站別',
    '機台',
    '下一站站別',
    '天數',
    '最大值的EPST或LPST',
    '生產開始日',
    '生產結束日',
    'TC頻率升降冪',
    'COMPAIGN_ID',
  ];
  titleArray3 = ['公版月份', '產品', '軋延尺寸', 'CYCLE', '日期~起', '日期~迄'];
  titleArray4 = [
    'MO版本',
    '轉入COMPAIGN限制表時間',
    '401工時(天)',
    '405工時(天)',
    '401剩餘工時(天)',
    '405剩餘工時(天)',
    '401投產日期(起)',
    '401投產日期(迄)',
  ];

  arrayBuffer: any;

  selectedVer_default:string = null;
  inputDate_val:number = 0;
  selectedVer = [{label:'',value:''}]; //版本選擇

  PLANT_CODE;
  USERNAME;
  DAY = this.inputDate_val;

  isRunFCP = false; // 如為true則不可異動
  file:File;
  importdata = [];
  importdata_new = [];
  isERROR = false;

  rowData: data[] = [];

  verList = [
    { label: '', value: '' }
  ];

  fileType: string = '.xls, .xlsx, .csv'; //檔案類型
  
 // tab 1
 tbppsm101List;
 // tab 2
 tbppsm102List;
 // tab 2 All
 tbppsm102ListAll;
 // tab 3
 tbppsm113List;

  public defaultColDefTab1: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  isSpinning = false;

  columnDefs: (ColDef | ColGroupDef)[] = [
      { headerName:'MO 版次',field: 'moEdition' , filter: true,width: 200 },
      { headerName:'日期',field: 'exportDateTime' , filter: true,width: 150 },
      { headerName: '401 到料工時(天)' ,field: 'workTIme1' , filter: true,width: 150 },
      { headerName:'405 到料工時(天)',field: 'workTIme2' , filter: true,width: 150},
      { headerName:'401 剩餘工時(天)',field: 'leastTime1' , filter: true,width: 150 },
      { headerName:'405 剩餘工時(天)',field: 'leastTime2' , filter: true,width: 150 },
      { headerName:'401 投產日_起', field:'startDate', filter:true, width: 150},
      { headerName: '401 投產日_迄' ,field: 'endDate' , filter: true,width: 150 },
    ];
    public ColGroupDef: ColDef = {
      filter: true,
      sortable: true,
      resizable: true,
  };
  
  constructor(
    private router: Router,
    private getPPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }
  
  ngAfterViewInit() {
    this.getTbppsm119ListAll();
    this.getTbppsm119VerList();
    // this.getRunFCPCount();
  }

  //I205_401 DataList
  getTbppsm119ListAll() {
    this.getPPSService.getTbppsm119ListAll(this.PLANT_CODE).subscribe(res => {
      console.log("getTbppsm119ListAll success");
      let result:any = res;
      if(result.length > 0) {       
        this.rowData = JSON.parse(JSON.stringify(result));
      } else {
        this.message.error("無資料");
        return;
      }
      console.log(this.getTbppsm119ListAll)
    });
  }

  converTBPPSM119Data() {
    let data = {"userName": "","day":this.inputDate_val, "moEdition": ""};
    
    data.moEdition = this.selectedVer_default;
    data.userName = this.USERNAME;
    data.day = this.inputDate_val;

      console.log("converTBPPSM119Data success");
      this.getPPSService.converTBPPSM119Data(data).subscribe(res =>{
        let result:any = res ;
        if(result.code == 0) {
          this.message.error('結轉發生異常，請選擇版本號');
        }else {
        this.message.info('結轉成功');
        }
      },err => {
        this.message.error('結轉發生異常，請選擇版本號');
      });
      console.log("Success");
  }

  //I205_401 MO_EDITION
  getTbppsm119VerList(){

    let postData = {};
    this.getPPSService.getTbppsm119VerList(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        for(let i = 0 ; i<result.length ; i++) {
          this.selectedVer.push({label:result[i].mo_EDITION, value:result[i].mo_EDITION})
        }
      } else {
        this.message.error('無資料');
        return;
      }
    },err => {
      this.message.error('網絡請求失敗');
    })

  }

  changeTab(tab): void {
    if(tab === 1) {
      window.location.href = '#/singleData/I124';
    } else if(tab === 2) {
      window.location.href = '#/singleData/I124';
    } else if(tab === 3){
      window.location.href = '#/singleData/I124';
    } else if(tab === 4) {
      this.getTbppsm119ListAll();
    }else if(tab === 5) {
      window.location.href = "#/singleData/I124";
    }
  }

  //convert to Excel and Download
  convertToExcel(_type) {
    console.log('convertToExcel');
    let data;
    let fileName;
    let titleArray;
    if (_type === '1') {
      if (this.tbppsm101List.length > 0) {
        data = this.formatDataForExcel(_type, this.tbppsm101List);
        fileName = `盤元冷抽尺寸優先順序`;
        titleArray = this.titleArray1;
      } else {
        this.errorMSG('匯出失敗', '盤元冷抽尺寸優先順序表目前無資料');
        return;
      }
    } else if (_type === '2') {
      if (this.tbppsm102List.length > 0) {
        data = this.formatDataForExcel(_type, this.tbppsm102List);
        fileName = `401站優先順序表`;
        titleArray = this.titleArray2;
      } else {
        this.errorMSG('匯出失敗', '401站優先順序表目前無資料');
        return;
      }
    } else if (_type === '3') {
      if (this.tbppsm113List.length > 0) {
        data = this.formatDataForExcel(_type, this.tbppsm113List);
        fileName = `205站公版尺寸`;
        titleArray = this.titleArray3;
      } else {
        this.errorMSG('匯出失敗', '205站公版尺寸目前無資料');
        return;
      }
    } else if (_type === '4') {
      if (this.tbppsm102ListAll.length > 0) {
        data = this.formatDataForExcel(_type, this.tbppsm102ListAll);
        fileName = `401 彙整資料表`;
        titleArray = this.titleArray4;
      }
    }
    this.excelService.exportAsExcelFile(data, fileName, titleArray);
  }


  formatDataForExcel(_type, _displayData) {
    let excelData = [];
    return excelData;
  }

  // excel檔名
  incomingfile(event) {
    this.file = event.target.files[0];
    console.log('incomingfile e1 : ' + this.file);
    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    }
  }

  // EXCEL 匯入
  Upload(_type) {
  }

  // EXCEL 樣板內資料取得及檢誤
  Excelimport(_type) {
    console.log('incomingfile e3 : ' + _type);
    let fileReader = new FileReader();
    this.importdata = [];
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join('');
      var workbook = XLSX.read(bstr, { type: 'binary' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet: any = workbook.Sheets[first_sheet_name];
      this.importdata = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      // this.checkTemplate(_type, worksheet, this.importdata);
    };
    fileReader.readAsArrayBuffer(this.file);
  }



  // EXCEL 匯入樣版檢查
  // checkTemplate(_type, worksheet, importdata) {
  //   if (_type === '1') {
  //     if (
  //       worksheet.A1 === undefined ||
  //       worksheet.B1 === undefined ||
  //       worksheet.C1 === undefined ||
  //       worksheet.D1 === undefined ||
  //       worksheet.E1 === undefined ||
  //       worksheet.F1 === undefined ||
  //       worksheet.G1 === undefined ||
  //       worksheet.H1 === undefined ||
  //       worksheet.I1 === undefined
  //     ) {
  //       this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
  //       this.clearFile();
  //       return;
  //     } else if (
  //       worksheet.A1.v !== '月份' ||
  //       worksheet.B1.v !== '站別' ||
  //       worksheet.C1.v !== '機台' ||
  //       worksheet.D1.v !== '產出型態' ||
  //       worksheet.E1.v !== '產出尺寸' ||
  //       worksheet.F1.v !== '現況尺寸' ||
  //       worksheet.G1.v !== '最終製程' ||
  //       worksheet.H1.v !== '鋼種群組' ||
  //       worksheet.I1.v !== '製程碼'
  //     ) {
  //       this.errorMSG(
  //         '檔案樣板欄位表頭錯誤',
  //         '請先下載資料後，再透過該檔案調整上傳。'
  //       );
  //       this.clearFile();
  //       return;
  //     } else {
  //       this.importExcel1('1', importdata);
  //     }
  //   } else if (_type === '2') {
  //     console.log('incomingfile e5 : ' + _type);
  //     if (
  //       worksheet.A1 === undefined ||
  //       worksheet.B1 === undefined ||
  //       worksheet.C1 === undefined ||
  //       worksheet.D1 === undefined ||
  //       worksheet.E1 === undefined ||
  //       worksheet.F1 === undefined ||
  //       worksheet.G1 === undefined ||
  //       worksheet.H1 === undefined ||
  //       worksheet.I1 === undefined
  //     ) {
  //       this.errorMSG('檔案樣板錯誤', '請先資料後，再透過該檔案調整上傳。');
  //       this.clearFile();
  //       return;
  //     } else if (
  //       worksheet.A1.v !== '站別' ||
  //       worksheet.B1.v !== '機台' ||
  //       worksheet.C1.v !== '下一站站別' ||
  //       worksheet.D1.v !== '天數' ||
  //       worksheet.E1.v !== '最大值的EPST或LPST' ||
  //       worksheet.F1.v !== '生產開始日' ||
  //       worksheet.G1.v !== '生產結束日' ||
  //       worksheet.H1.v !== 'TC頻率升降冪' ||
  //       worksheet.I1.v !== 'COMPAIGN_ID'
  //     ) {
  //       this.errorMSG(
  //         '檔案樣板欄位表頭錯誤',
  //         '請先下載資料後，再透過該檔案調整上傳。'
  //       );
  //       this.clearFile();
  //       return;
  //     } else {
  //       this.importExcel2('2', importdata);
  //     }
  //   } else if (_type === '3') {
  //     console.log('incomingfile e5 : ' + _type);
  //     if (
  //       worksheet.A1 === undefined ||
  //       worksheet.B1 === undefined ||
  //       worksheet.C1 === undefined ||
  //       worksheet.D1 === undefined ||
  //       worksheet.E1 === undefined ||
  //       worksheet.F1 === undefined
  //     ) {
  //       this.errorMSG('檔案樣板錯誤', '請先資料後，再透過該檔案調整上傳。');
  //       this.clearFile();
  //       return;
  //     } else if (
  //       worksheet.A1.v !== '公版月份' ||
  //       worksheet.B1.v !== '產品' ||
  //       worksheet.C1.v !== '軋延尺寸' ||
  //       worksheet.D1.v !== 'CYCLE' ||
  //       worksheet.E1.v !== '日期~起' ||
  //       worksheet.F1.v !== '日期~迄'
  //     ) {
  //       this.errorMSG(
  //         '檔案樣板欄位表頭錯誤',
  //         '請先下載資料後，再透過該檔案調整上傳。'
  //       );
  //       this.clearFile();
  //       return;
  //     } else {
  //       this.importExcel3('3', importdata);
  //     } 
  //   } else if(_type === '4') {
  //     console.log('incomingfile e5 : ' + _type);
  //     if(
  //       worksheet.A1.v !== undefined ||
  //       worksheet.B1.v !== undefined ||
  //       worksheet.C1.v !== undefined ||
  //       worksheet.D1.v !== undefined ||
  //       worksheet.E1.v !== undefined ||
  //       worksheet.F1.v !== undefined ||
  //       worksheet.G1.v !== undefined ||  
  //       worksheet.H1.v !== undefined   
  //     ) {
  //       this.errorMSG('檔案樣板錯誤', '請先資料後，再透過該檔案調整上傳。');
  //       this.clearFile();
  //       return;

  //     }else if (
  //       worksheet.A1.v !== 'MO版本' ||
  //       worksheet.B1.v !== '轉入COMPAIGN限制表時間' ||
  //       worksheet.C1.v !== '401到料工時(天)' ||
  //       worksheet.D1.v !== '405到料工時(天)' ||
  //       worksheet.E1.v !== '401剩餘工時(天)' ||
  //       worksheet.F1.v !== '405剩餘工時(天)' ||
  //       worksheet.G1.v !== '401投產日期(起)' ||  
  //       worksheet.H1.v !== '401投產日期(迄)'  
  //     ) {
  //       this.errorMSG(
  //         '檔案樣板欄位表頭錯誤',
  //         '請先下載資料後，再透過該檔案調整上傳。'
  //       );
  //       this.clearFile();
  //       return;
  //       }
  //   }
  // }
 
  importCompaign(){
    
  }

  // I205_401 Auto Campaign明細表匯出 Excel
  excelExport(){
    this.isSpinning = true;
    let headerArray = [] ;

    this.columnDefs.forEach(function(obj){
      headerArray.push(obj['headerName']);
    });

    let exportTableName = "Auto Campaign明細表"

    let exportData = this.rowData;
    this.excelService.exportAsExcelFile(exportData, exportTableName,headerArray);
    
    this.isSpinning = false;

 }

  sucessMSG(_title, _context): void {
    this.Modal.success({
      nzTitle: _title,
      nzContent: `${_context}`,
    });
  }

  errorMSG(_title, _context): void {
    this.Modal.error({
      nzTitle: _title,
      nzContent: `${_context}`,
    });
  }
  // 清空資料
  clearFile() {
    var objFile = document.getElementsByTagName('input')[0];
    console.log(objFile.value + '已清除');
    objFile.value = '';
    console.log(this.file);
    console.log(JSON.stringify(this.file));
  }
}
