import { DatePipe, registerLocaleData } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { CookieService } from 'src/app/services/config/cookie.service';

import zh from '@angular/common/locales/zh';
import * as _ from 'lodash';
registerLocaleData(zh);

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

  PickShopCode = [];
  preinsert = [];

  maxFcp;

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

  columnDefs: (ColDef | ColGroupDef)[] = [
    {headerName: 'FCP版本',field: 'fcpEdition',width: 100,},
    {headerName: '站別',field: 'schShopCode',width: 100,},
    {headerName: '投產機台',field: 'pstMachine',width: 100,},
    {headerName: '製程碼',field: 'processCode',width: 100,},
    {headerName: '投入型態',field: 'inputType',width: 100,},
    {headerName: '產出型態',field: 'outputShape',width: 100,},
    {headerName: '投入尺寸',field: 'inputDia',width: 100,},
    {headerName: '產出尺寸',field: 'outDia',width: 100,},
    {headerName: '產品種類',field: 'kindType',width: 100,},
    {headerName: '下站別',field: 'nextSchShopCode',width: 100,},
    {headerName: '鋼種群組',field: 'gradeGroup',width: 100,},
    {headerName: '自訂月份',field: 'newEpstYymm',width: 100,},
    {headerName: '寫入排序',field: 'campaignSort',width: 100,},
    {headerName: '開始時間',field: 'planStartTime',width: 100,},
    {headerName: '結束時間',field: 'planEndTime',width: 100,},
    {headerName: '創建時間',field: 'dateCreate',width: 100,},
    {headerName: '創建者',field: 'userCreate',width: 100,}
  ];

  gridOptions = {
    defaultColDef: {
      editable: true,
      enableRowGroup: false,
      enablePivot: false,
      enableValue: false,
      sortable: false,
      resizable: true,
      filter: true,
    },
    api: null,
  };

  constructor(
    private getPPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
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
  checkboxStatus: boolean[];
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
          // this.shopCodeOptions = [];
          // for (var i = 0; i < res.length; i++) {
          //   const option = {
          //     label: res[i].schShopCode,
          //     checked: false,
          //   };
          //   this.shopCodeOptions.push(option);
          // }
          this.shopCodeOptions = res.map((item) => item.schShopCode);
          this.checkboxStatus = new Array(this.shopCodeOptions.length).fill(
            false
          );
          // console.log(res.length);
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
    if (this.PickShopCode.length === 0) {
      this.message.error('請選擇站別');
    } else {
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
      this.getFcpList();
      this.checkboxStatus.fill(false);
    }
  }

  changeTab(tab): void {
    console.log(tab);
    /*if (tab === 1) {
      window.location.href = '#/PlanSet/I205?selectedTabIndex=0';
    } else if (tab === 2) {
      window.location.href = '#/PlanSet/I205?selectedTabIndex=0';
    } else */if (tab === 3) {
      window.location.href = '#/PlanSet/I205?selectedTabIndex=0';
    } else if (tab === 4) {
      window.location.href = '#/PlanSet/I205_a401';
    } else if (tab === 5) {
      window.location.href = '#/PlanSet/I205_a100';
    }
  }

  log(value: string[]): void {
    this.PickShopCode = value.toString().split(',');
    console.log(this.PickShopCode);
  }
}
