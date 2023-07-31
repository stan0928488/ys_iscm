import { Component, AfterViewInit, NgZone, EventEmitter } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ExcelService } from 'src/app/services/common/excel.service';
import { registerLocaleData, DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CellClickedEvent, ColDef, ColGroupDef } from 'ag-grid-community';

import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import zh from '@angular/common/locales/zh';
import { promise } from 'protractor';
registerLocaleData(zh);
interface data {}

@Component({
  selector: 'app-PPSI205_100',
  templateUrl: './PPSI205_100.component.html',
  styleUrls: ['./PPSI205_100.component.scss'],
  providers: [NzMessageService, DatePipe],
})
export class PPSI205_100Component implements AfterViewInit {
  PLANT_CODE;
  USERNAME;
  loading = false; //loaging data flag
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  isErrorMsg = false;

  PickShopCode = [];
  preinsert = [];

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
  datetime = moment();
  arrayBuffer: any;
  file: File;
  importdata = [];
  importdata_new = [];
  isERROR = false;
  errorTXT = [];
  maxFcp;

  EditMode = [];
  oldlist = {};
  newlist;

  rowData: data[] = [];

  fileType: string = '.xls, .xlsx, .csv'; //檔案類型

  // tab 1
  tbppsm101List;
  // tab 2
  tbppsm102List;
  // tab 2 All
  tbppsm102ListAll;
  // tab 3
  tbppsm113List;

  ppsfcptb16_ms_cust_sortList;
  fcpEditionList;
  fcpEditionLoading = false;
  selectedIndex;
  fcpEditionOption: any[] = [];
  panels = [
    {
      active: true,
      name: '資料結轉與EXCEL匯出',
      disabled: false,
    },
  ];

  isSpinning = false;

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: '匯入時間',
      field: 'IMPORTDATETIME',
      filter: true,
      width: 200,
    },
    { headerName: '優先順序', field: 'ORDER_ID', filter: true, width: 100 },
    { headerName: '站別', field: 'SCH_SHOP_CODE', filter: true, width: 100 },
    { headerName: '機台', field: 'EQUIP_CODE', filter: true, width: 100 },
    {
      headerName: '下一站站別',
      field: 'NEXT_SHOP_CODE',
      filter: true,
      width: 120,
    },
    {
      headerName: 'max(EPST/ASAP)',
      field: 'MAX_DATE',
      filter: true,
      width: 150,
    },
    { headerName: '天數', field: 'DAYS', filter: true, width: 100 },
    {
      headerName: '生產時間(起)',
      field: 'STARTDATE',
      filter: true,
      width: 120,
    },
    {
      headerName: 'TC頻率升降冪',
      field: 'TC_FREQUENCE_LIFT',
      filter: true,
      width: 150,
    },
    {
      headerName: '轉入COMPAIGN限制表時間',
      field: 'EXPORTDATETIME',
      filter: true,
      width: 200,
    },
    { headerName: '建立日期', field: 'DATE_CREATE', filter: true, width: 200 },
    { headerName: '建立者', field: 'USER_CREATE', filter: true, width: 100 },
    { headerName: '異動日期', field: 'DATE_UPDATE', filter: true, width: 200 },
    { headerName: '異動者', field: 'USER_UPDATE', filter: true, width: 100 },
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
    this.USERNAME = this.cookieService.getCookie('USERNAME');
    this.PLANT_CODE = this.cookieService.getCookie('plantCode');
  }

  async ngOnInit() {
    console.log('預載入');
    await this.getFcpList();
    console.log(this.maxFcp + '最大');
    this.fcpEditionList = this.maxFcp;
    // this.getShopCode();
    this.getPPSService
      .getPpsfcptb16MsCustSortList(this.fcpEditionList)
      .subscribe((res) => {
        this.ppsfcptb16_ms_cust_sortList = res;
        this.loading = false;
      });
  }

  ngAfterViewInit() {
    console.log('ngAfterViewChecked');
    this.getRunFCPCount();
  }

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe((res: number) => {
      console.log('getRunFCPCount success');
      console.log(res);
      if (res > 0) this.isRunFCP = true;
    });
  }

  getppsfcptb16_ms_cust_sortList() {
    this.loading = true;
    this.getPPSService
      .getPpsfcptb16MsCustSortList(this.fcpEditionList)
      .subscribe((res) => {
        console.log('getppsfcptb16_ms_cust_sortList success');
        this.ppsfcptb16_ms_cust_sortList = res;
        console.log(this.fcpEditionList);
        this.getShopCode();
        this.loading = false;
      });
  }

  getFcpList(): Promise<void> {
    this.loading = true;
    return new Promise<void>((resolve, reject) => {
      this.getPPSService.getFcpList(this.PLANT_CODE).subscribe(
        (res) => {
          console.log('getFcpList success');
          this.fcpEditionOption = res;
          this.maxFcp = _.max(this.fcpEditionOption);
          this.getppsfcptb16_ms_cust_sortList();
          // this.getShopCode();
          this.loading = false;
          resolve();
        },
        (error) => {
          console.log('getFcpList error', error);
          this.loading = false;
          reject();
        }
      );
    });
  }

  shopCodeOptions;
  getShopCode() {
    this.loading = true;
    let preShopCode = {
      fcpEdition: this.fcpEditionList,
    };
    console.log('hiiiii' + preShopCode);
    return new Promise<void>((resolve, reject) => {
      this.getPPSService.ppsi205100getShopCode(preShopCode).subscribe(
        (res) => {
          console.log('getShopCode success');
          this.shopCodeOptions = res.map((item) => item.schShopCode);
          console.log(this.shopCodeOptions);
          this.loading = false;
          resolve();
        },
        (error) => {
          console.log('getShopCode error', error);
          this.loading = false;
          reject();
        }
      );
    });
  }

  convertToTbppsm100(userClick: boolean) {
    this.loading = true;
    let myObj = this;
    this.preinsert = [];
    if (!_.isNil(this.PickShopCode)) {
      for (var i = 0; i < this.PickShopCode.length; i++) {
        const data = {
          fcpEdition: this.fcpEditionList,
          schShopCode: this.PickShopCode[i],
        };
        this.preinsert.push(data);
      }
      console.log(this.preinsert);
      this.getPPSService.convertToTbppsm100(this.preinsert).subscribe((res) => {
        console.log('convertToTbppsm100 success');
        this.message.success('轉入成功');
        myObj.loading = false;
      });
      this.PickShopCode = [];
      this.preinsert = [];
    } else {
      this.message.error('請選擇站別');
    }
  }

  changeTab(tab): void {
    console.log(tab);
    if (tab === 1) {
      window.location.href = '#/PlanSet/I205?selectedTabIndex=0';
    } else if (tab === 2) {
      window.location.href = '#/PlanSet/I205?selectedTabIndex=1';
    } else if (tab === 3) {
      window.location.href = '#/PlanSet/I205?selectedTabIndex=2';
    } else if (tab === 4) {
      window.location.href = '#/PlanSet/I205?selectedTabIndex=3';
    } else if (tab === 5) {
      this.getppsfcptb16_ms_cust_sortList();
    }
  }

  log(value: string[]): void {
    this.PickShopCode = value.toString().split(',');
    console.log(this.PickShopCode);
  }
}
