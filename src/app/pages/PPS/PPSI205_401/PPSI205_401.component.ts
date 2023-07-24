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
  inputDate_val:number = 1;
  selectedVer = [{label:'',value:''}]; //版本選擇

  PLANT_CODE;
  USERNAME;
  DAY = this.inputDate_val;

  isLoading = false;
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

  dateTimeFormatter(params) {
    return moment(params.value).format('YYYY/MM/DD HH:mm:ss');
  }

  dateFormatter(params) {
    return moment(params.value).format('YYYY/MM/DD');
  }

  columnDefs: (ColDef | ColGroupDef)[] = [
      { headerName:'MO 版次',
        field: 'moEdition' , 
        filter: true,
        width: 200,
        },
      { headerName:'EPST',
        field: 'epst' , 
        filter: true,
        width: 150, 
        valueFormatter: this.dateFormatter,
      },
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
    this.getTbppsm119VerList();
    this.getTbppsm119ListAll();
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
    });
  }

  convertTBPPSM102AutoCampaign() {
    let data = {"userName": ""};
    
    data.userName = this.USERNAME;

      console.log("convertTBPPSM102AutoCampaign success");
      this.getPPSService.convertTBPPSM102AutoCampaign(data).subscribe(res =>{
        let result:any = res ;
        if(result.code == 0) {
          this.message.error('轉入發生異常，請連繫系統後端人員');
        }else {
        this.message.info('轉入成功');
        this.getTbppsm119ListAll();
        }
      },err => {
        this.message.error('轉入發生異常，請連繫系統後端人員');
      });
      console.log("Success");
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
        this.getTbppsm119ListAll();
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
    console.log(tab);
    if (tab === 1) {
      window.location.href = '#/singleData/I124?selectedTabIndex=0';
      // this.getTbppsm101List();
    } else if (tab === 2) {
      window.location.href = '#/singleData/I124?selectedTabIndex=1';
      // this.getTbppsm102List();
    } else if (tab === 3) {
      window.location.href = '#/singleData/I124?selectedTabIndex=2';
      // this.getTbppsm113List();
    } else if (tab === 4) {
      // this.getTbppsm102ListAll();
      window.location.href = '#/singleData/I124?selectedTabIndex=3';
    } else if (tab === 5) {
      // this.getTbppsm100List();
      window.location.href =
        '#/singleData/I124?selectedTabIndex=4&innerSelect=0';
    }
  }

  // I205_401 Auto Campaign明細表匯出 Excel
  excelExport(){
    this.isSpinning = true;
    let headerArray = [] ;

    this.columnDefs.forEach(function(obj){
      headerArray.push(obj['headerName']);
    });

    let exportTableName = "Auto Campaign 明細表"

    let exportData = this.rowData;

    console.log(exportData);
    
    this.excelService.exportAsExcelFile(exportData, exportTableName,headerArray);
    
    this.isSpinning = false;

 }

 
}
