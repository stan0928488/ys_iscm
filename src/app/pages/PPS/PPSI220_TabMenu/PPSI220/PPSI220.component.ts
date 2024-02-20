import {
  Component,
  AfterViewInit,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
import { CookieService } from 'src/app/services/config/cookie.service';
import { AppComponent } from 'src/app/app.component';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ExcelService } from 'src/app/services/common/excel.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import zh from '@angular/common/locales/zh';
import { firstValueFrom } from 'rxjs';
import {
  ColDef,
  ColumnApi,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import { OpenMachineRendererComponent } from '../../PPSI210_TabMenu/PPSI210/open-machine-renderer-component';

import { ConfigService } from 'src/app/services/config/config.service';
import { FcpStatusWebSocketStomp } from 'src/app/services/webSocket/FcpSatusWebSocketStomp';
registerLocaleData(zh);

@Component({
  selector: 'app-PPSI220',
  templateUrl: './PPSI220.component.html',
  styleUrls: ['./PPSI220.component.scss'],
  providers: [DatePipe, NzMessageService, NzModalService],
})
export class PPSI220Component implements OnInit, AfterViewInit, OnDestroy {
  loading = false; //loaging data flag
  spinningTip = 'Loading...';
  isRunFCP = false; // 如為true則不可異動
  moSortList: any[] = []; // 平衡設定選項選項
  shopSortLoading = false; // 站別優先順序明細表是否載入中
  machineSortLoading = false; // 站別機台優先順序明細表是否載入中
  LoadingPage = false;
  isVisibleRun = false;
  isVisibleSorting = false;
  isVisibleMachine = false;
  isVisibleStart = false;
  isVisibleSelPlanSet = false;
  isVisibleSelPlan = false;
  isVisibleUpd = false;
  isCommon = false;
  byUserShow = false;

  PLAN_ITEM_FLAG;
  PlanDataList; //規劃案清單
  PlanDataDtlList; //規劃案清單 (執行歷程)
  ShopSortingList; //挑選排序
  tmpArr;
  MachineSortingList; // 挑選排序
  USERNAME;
  SCHEDULEVER: boolean = false; // 判別公版

  show_PLAN_EDITION; // 欲異動規劃案版本
  upd_PLAN_EDITION; // 欲異動規劃案版本
  upd_oldPLANSET_EDITION; // 欲異動規劃策略版本
  upd_newPLANSET_EDITION; // 欲異動規劃策略版本
  upd_LPSTDATA; // 異動LPST選擇
  upd_startdate; // 異動LPST區間
  upd_enddate; // 異動LPST區間
  upd_SCHEDULE_FLAG; // 異動版本選擇
  upd_SCHEDULE_TIME; // 異動排程時間
  updPlanItemFlag;

  planSetDataList; // 套餐選擇清單
  planSetSort; // 套餐優先順序(下拉條件)
  planSetSortList; // 套餐優先順序(所有清單資料)
  PLANSET_EDITION; // 選定的套餐版本

  CHOICE_plansetlist; // 選定的套餐內容
  CHOICE_shop_code; // 選定的優先順序--站別
  CHOICE_machine; // 選定的優先順序--機台
  CHOICE_sort; // 選定的優先順序--排序
  cellsort; // 站別, 機台

  selPlanDataList;
  MOverList;
  listOfMOOption; //MO歷史版本LIST
  ICPverList;
  listOfICPOption; //ICP歷史版本LIST
  plansetValue; // 規劃策略版本
  ICPVER; // 定義 ICP 版本
  ICPDATA; // 靜態資料 (1:新版 2:歷史)
  HISICP; // 歷史靜態資料版本
  MOVER; // 定義 MO 版本
  MODATA; // MO資料 (1:新版 2:歷史)
  HISMO; // MO歷史資料版本
  LPSTDATA; // 交期小於LPST
  startdate; // LPST區間起始
  enddate; // LPST區間結束
  SCHEDULE_FLAG; // 規劃案排程型態
  SCHEDULE_TIME; // 排程時間
  ICPparam;
  FCPplan;
  oldPlanEdition; // 更改公版版號
  newPlanEdition; // 更改公版版號
  planlist; // 規劃案版本清單
  choicePlanset = 'A'; // 不更換策略版本
  plansetlist; // 規劃策略版本清單

  PLANT = '直棒'; // 工廠別

  scrollWid: string = null;
  nzWidthConfigs: string[] = [];
  thWidths = [60, 80, 200, 100, 60, 70, 120, 50, 50, 100, 40];

  scrollWidForRunList: string = null;
  nzWidthConfigsForRunList: string[] = [];
  thWidthsForRunList = [80, 200, 100, 60, 70, 120, 50, 50, 100, 40];

  timer = new Date();
  commSCHEDULE_TIME;
  titleArray;
  FCPResRepo = [];

  nzPagination: any;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  agGridContext: any;

  switchValue: boolean = false;
  isVisibleStartMulti: boolean = false;

  fcpStatusWebSocketStomp: FcpStatusWebSocketStomp = null;

  gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: false,
      resizable: true,
      //wrapText: true,
      autoHeight: true,
    },
  };

  // 站別優先順序明細表ColumnDefs
  shopSortingColumnDefs: ColDef[] = [
    {
      headerName: '站別',
      field: 'SCH_SHOP_CODE',
      width: 80,
      headerClass: 'wrap-header-Text',
    },
    {
      headerName: '規劃優先順序',
      field: 'SORTING_SEQ',
      width: 180,
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: '集批天數',
      field: 'INTERVAL',
      width: 105,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: '集批條件',
      field: 'REQUIREMENT',
      width: 110,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: 'COMBINE執行',
      field: 'ISCOMBINE',
      width: 120,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: '交期範圍(單位:月)',
      field: 'COMBINE_RANGE',
      width: 120,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: '指定平衡設定',
      field: 'MO_SORT',
      width: 110,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
      valueFormatter: (params: ValueFormatterParams): string => {
        let formatValue = null;
        this.moSortList.some((item) => {
          if (item.method === params.value) {
            formatValue = item.notesChinese;
            return true;
          }
        });
        return formatValue;
      },
    },
    {
      headerName: '平移日期',
      field: 'OFFLOAD_DATE',
      width: 110,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
      valueFormatter: (params: ValueFormatterParams): string => {
        if (_.isNil(params.value)) {
          return moment().format('YYYY-MM-DD');
        }
      },
    },
    {
      headerName: '平移日期-迄',
      field: 'OFFLOAD_DATE_END',
      width: 110,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
      valueFormatter: (params: ValueFormatterParams): string => {
        if (_.isNil(params.value)) {
          return moment().format('YYYY-MM-DD');
        }
      },
    },
    {
      headerName: 'Action',
      field: 'action',
      width: 95,
      headerClass: 'wrap-header-Text',
      cellRenderer: OpenMachineRendererComponent,
    },
  ];

  // 站別機台優先順序明細表ColumnDefs
  machineSortingColumnDefs: ColDef[] = [
    {
      headerName: '站別',
      field: 'SCH_SHOP_CODE_D2',
      width: 80,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: '機台',
      field: 'MACHINE',
      width: 80,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: '規劃優先順序',
      field: 'SORTING_SEQ_D2',
      width: 200,
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: '集批天數',
      field: 'INTERVAL_D2',
      width: 105,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: '集批條件',
      field: 'REQUIREMENT_D2',
      width: 150,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: 'COMBINE執行',
      field: 'ISCOMBINE_D2',
      width: 120,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
    },
    {
      headerName: '交期範圍(單位:月)',
      field: 'COMBINE_RANGE_D2',
      width: 120,
      headerClass: 'wrap-header-Text',
      cellClass: 'wrap-cell-Text',
    },
  ];

  constructor(
    private router: Router,
    private AppComponet: AppComponent,
    private getPPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private datePipe: DatePipe,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private configService: ConfigService
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie('USERNAME');
    this.agGridContext = {
      componentParent: this,
    };
    this.fcpStatusWebSocketStomp = new FcpStatusWebSocketStomp(
      this.configService,
      this.router,
      this.PLANT
    );
  }
  async ngOnInit(): Promise<void> {}

  ngOnDestroy(): void {
    if (!_.isNil(this.fcpStatusWebSocketStomp)) {
      this.fcpStatusWebSocketStomp.disconnect();
    }
  }

  async ngAfterViewInit() {
    console.log('ngAfterViewChecked');

    let totalWidth = 0;
    let widthConfigs: string[] = [];
    this.thWidths.forEach((item) => {
      totalWidth += item;
      widthConfigs.push(`${item}px`);
    });
    totalWidth += Math.ceil(totalWidth / 2);
    this.scrollWid = `${totalWidth}px`;
    this.nzWidthConfigs = widthConfigs;

    totalWidth = 0;
    widthConfigs = [];
    this.thWidthsForRunList.forEach((item) => {
      totalWidth += item;
      widthConfigs.push(`${item}px`);
    });
    totalWidth += Math.ceil(totalWidth / 2);
    this.scrollWidForRunList = `${totalWidth}px`;
    this.nzWidthConfigsForRunList = widthConfigs;
    // 接收後端FCP開始執行與執行結束的通知
    await this.ftpStatusUpdateWebSocketConnect();
    this.getPlanDataList();
    this.getRunFCPCount();
    await this.getMoSortList();

    if (
      this.USERNAME === 'UR10167' ||
      this.USERNAME === 'UR07210' ||
      this.USERNAME === 'UR10369' ||
      this.USERNAME === 'UR11994' ||
      this.USERNAME === 'UR07272' ||
      this.USERNAME === 'UR08084' ||
      this.USERNAME === 'UR11118'
    ) {
      this.byUserShow = true;
    }
  }

  // 取得是否有正在執行的FCP
  async getRunFCPCount() {
    const runFCPCountObservable$ = this.getPPSService.getRunFCPCount();
    const construnFCPCountRes = await firstValueFrom<any>(
      runFCPCountObservable$
    );
    if (construnFCPCountRes > 0) this.isRunFCP = true;
    else this.isRunFCP = false;
  }

  //Get Data
  getPlanDataList() {
    this.LoadingPage = true;

    this.getPPSService.getPlanDataList(this.PLANT).subscribe(
      (res) => {
        console.log('getPlanDataList success');
        let result: any = res;
        this.PlanDataList = result.data;
        this.PlanDataList.forEach((data) => {
          if (data.scheduleFlag === '1') this.SCHEDULEVER = true;
        });
        console.log(this.PlanDataList);
        this.LoadingPage = false;
      },
      (err) => {
        this.LoadingPage = false;
      }
    );
  }

  //Get Data
  getPlanDataListByPlan(_Plan) {
    this.LoadingPage = true;
    this.getPPSService
      .getPlanDataListByPlan(_Plan, this.PLANT)
      .subscribe((res) => {
        if (res.code == 200) {
          this.PlanDataDtlList = res.data;
          console.log(this.PlanDataDtlList);
          this.PlanDataDtlList.forEach((data) => {
            if (data.scheduleFlag === '1') this.SCHEDULEVER = true;
          });
        } else {
          this.errorMSG('操作失敗', res.message);
        }

        this.LoadingPage = false;
      });
  }

  RunList(_paln) {
    this.isVisibleRun = true;
    this.getPlanDataListByPlan(_paln);
  }
  Run_cancel() {
    this.isVisibleRun = false;
  }

  // 撈取 sorting 表
  async getShopSortingList(_Mseqno) {
    this.shopSortLoading = true;
    let myObj = this;
    this.getPPSService.getShopSortingList('Q', _Mseqno).subscribe((res) => {
      console.log('getShopSortingList success');
      res.data.forEach((item) => {
        item.MO_SORT = _.isNil(item.MO_SORT) ? 'null_string' : item.MO_SORT;
      });
      this.ShopSortingList = res.data;
      myObj.shopSortLoading = false;
    });
  }

  openSorting(_Mseqno): void {
    this.isVisibleSorting = true;
    this.getShopSortingList(_Mseqno);
  }

  handleOk(): void {
    console.log('click ok');
    this.isVisibleSorting = false;
  }

  handleCancel(): void {
    this.isVisibleSorting = false;
  }

  openMachineSorting(_planset, _shopcode): void {
    this.machineSortLoading = true;
    let myObj = this;
    this.getPPSService
      .getShopMachineSortingList('Q', _planset)
      .subscribe((res) => {
        this.tmpArr = res.data;
        if (this.tmpArr.length > 0) {
          var newSchShopCode = this.tmpArr.filter(function (item, index, arr) {
            // 排除重複資料
            return item.SCH_SHOP_CODE_D2 === _shopcode;
          });
          if (newSchShopCode.length > 0) {
            this.MachineSortingList = [...newSchShopCode];
            this.isVisibleMachine = true;
          } else {
            myObj.message.create(
              'warning',
              `站別「${_shopcode}」無設定機台優先順序`
            );
          }
        } else {
          myObj.message.create(
            'warning',
            `站別「${_shopcode}」無設定機台優先順序`
          );
        }
        myObj.machineSortLoading = false;
      });
  }

  handleCancel_M(): void {
    this.MachineSortingList = [];
    this.isVisibleMachine = false;
  }

  // 靜態資料選擇
  ICPchange(_value) {
    this.ICPDATA = _value;
    if (_value === '1') {
      this.HISICP = undefined;
    } else {
      this.HISICP = this.HISICP;
    }
  }

  // 靜態資料歷史版本拉選
  getICPVerList() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getICPVerList().subscribe((res) => {
      if ((res.code = 200)) {
        this.ICPverList = res.data;
        const children: Array<{ label: string; value: string }> = [];
        for (let i = 0; i < this.ICPverList.length; i++) {
          children.push({
            label: this.ICPverList[i].icpEdition,
            value: this.ICPverList[i].icpEdition,
          });
        }
        this.listOfICPOption = children;
        console.log(this.listOfICPOption);
        myObj.loading = false;
      } else {
        this.errorMSG('操作失敗', res.message);
      }
    });
  }

  // MO 資料選擇
  MOchange(_value) {
    this.MODATA = _value;

    if (_value === '1') {
      this.HISMO = undefined;
    } else {
      this.MOVER = this.HISMO;
    }
  }

  // MO 歷史版本拉選
  getMOVerList() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getICPMOVerList().subscribe((res) => {
      if ((res.code = 200)) {
        this.MOverList = res.data;
        const children: Array<{ label: string; value: string }> = [];
        for (let i = 0; i < this.MOverList.length; i++) {
          children.push({
            label: this.MOverList[i].moEdition,
            value: this.MOverList[i].moEdition,
          });
        }
        this.listOfMOOption = children;
        console.log(this.listOfMOOption);
        myObj.loading = false;
      } else {
        this.errorMSG('操作失敗', res.message);
      }
    });
  }

  // 變更 LPST區間
  LPSTchange(_value, _type) {
    this.LPSTDATA = _value;
    let lastdate = moment()
      .add(-2, 'years')
      .add(-1, 'month')
      .endOf('month')
      .format('YYYY-MM-DD'); //前二年

    if (_type === 'ins') {
      if (_value === '1') {
        // 當月
        this.startdate = lastdate;
        this.enddate = moment().add(1, 'month').format('YYYY-MM-DD');
      } else if (_value === '2') {
        // 未來兩個月
        this.startdate = lastdate;
        this.enddate = moment()
          .add(1, 'month')
          .endOf('month')
          .format('YYYY-MM-DD');
      } else {
        // 全部
        this.startdate = lastdate;
        this.enddate = moment().add(5, 'years').format('YYYY-MM-DD');
      }
    } else {
      if (_value === '1') {
        // 當月
        this.upd_startdate = lastdate;
        this.upd_enddate = moment().add(1, 'month').format('YYYY-MM-DD');
      } else if (_value === '2') {
        // 未來兩個月
        this.upd_startdate = lastdate;
        this.upd_enddate = moment()
          .add(1, 'month')
          .endOf('month')
          .format('YYYY-MM-DD');
      } else {
        // 全部
        this.upd_startdate = lastdate;
        this.upd_enddate = moment().add(5, 'years').format('YYYY-MM-DD');
      }
    }
  }

  // 選擇排程時間 (DATE)
  SC_Change(result: Date, _type): void {
    if (_type === 'ins') {
      this.SCHEDULE_TIME = this.dateFormat(result, '2');
    } else if (_type === 'upd') {
      this.upd_SCHEDULE_TIME = this.dateFormat(result, '2');
    } else if (_type === 'common') {
      this.commSCHEDULE_TIME = this.dateFormat(result, '2');
    }
  }
  // 選擇排程時間 (DATE)
  SC_Ok(result: Date | Date[] | null, _type): void {
    if (_type === 'ins') {
      this.SCHEDULE_TIME = this.dateFormat(result, '2');
    } else if (_type === 'upd') {
      this.upd_SCHEDULE_TIME = this.dateFormat(result, '2');
    } else if (_type === 'common') {
      this.commSCHEDULE_TIME = this.dateFormat(result, '2');
    }
  }
  SC_TIME() {
    console.log('sc time ');
    console.log(this.timer);
  }

  // 規劃案排程型態
  SCHEDULEchange(_value, _type) {
    if (_type === 'ins') {
      this.SCHEDULE_FLAG = _value;
      if (_value === '1') {
        if (this.SCHEDULEVER) {
          this.SCHEDULE_FLAG = undefined;
        } else {
          this.SCHEDULE_FLAG = _value;
        }
      } else if (_value === '2') {
        this.SCHEDULE_FLAG = _value;
      } else {
        this.SCHEDULE_FLAG = _value;
      }
    } else {
      this.upd_SCHEDULE_FLAG = _value;
      if (_value === '1') {
        if (this.SCHEDULEVER) {
          this.upd_SCHEDULE_FLAG = undefined;
        } else {
          this.upd_SCHEDULE_FLAG = _value;
        }
      } else if (_value === '2') {
        this.upd_SCHEDULE_FLAG = _value;
      } else {
        this.upd_SCHEDULE_FLAG = _value;
      }
    }
  }

  // 開啟策略選擇---------------------
  selPlanSet(): void {
    console.log('selPlanSet...');

    this.isVisibleSelPlanSet = true;
    this.loading = true;
    let myObj = this;
    this.getPPSService.getPlanSetData(this.PLANT).subscribe((res) => {
      // 取規劃策略
      console.log('getPlanSetInitstData success');
      if (res.length <= 0) {
        this.message.success(`目前${this.PLANT}尚無任何規劃策略內容`);
        myObj.loading = false;
        return;
      }
      this.planSetDataList = JSON.parse(res.data);
      myObj.loading = false;
    });
  }
  plansethandleCancel(): void {
    this.isVisibleSelPlanSet = false;
  }

  //送出選定規劃策略
  sendchoice(_value1) {
    console.log('--------sendchoice---------');
    this.PLANSET_EDITION = _value1;
    this.isVisibleSelPlanSet = false;
  }

  // 開啟已制定規劃案---------------------
  selPlan(): void {
    console.log('selPlan...');
    this.isVisibleSelPlan = true;
    this.loading = true;

    let myObj = this;
    this.getPPSService.getCreatePlanDataList(this.PLANT).subscribe((res) => {
      if (res.code == 200) {
        this.selPlanDataList = res.data;
        this.selPlanDataList.forEach((data) => {
          if (data.scheduleFlag === '1') this.SCHEDULEVER = true;
        });
      } else {
        this.errorMSG('操作失敗', res.message);
      }
      myObj.loading = false;
    });
  }

  planhandleCancel(): void {
    this.isVisibleSelPlan = false;
  }

  //送出選定規劃案
  sendPlanchoice(data) {
    console.log('--------sendPlanchoice---------');

    this.PLANSET_EDITION = data.plansetEdition;
    this.ICPDATA = data.icpFlag;
    this.HISICP = data.hisIcpEdition;
    this.listOfICPOption = [
      { label: data.hisIcpEdition, value: data.hisIcpEdition },
    ];
    this.MODATA = data.moFlag;
    this.HISMO = data.hisMoEdition;
    this.listOfMOOption = [
      { label: data.hisMoEdition, value: data.hisMoEdition },
    ];
    this.startdate = data.lpstStartdate;
    this.enddate = data.lpstEndtdate;
    this.PLAN_ITEM_FLAG = data.planItemFlag;

    if (data.lpstFlag === '1') {
      this.LPSTDATA = '1';
    } else if (data.lpstFlag === '2') {
      this.LPSTDATA = '2';
    } else {
      this.LPSTDATA = '3';
    }

    if (data.scheduleFlag === '1') {
      this.SCHEDULE_FLAG = undefined;
    } else {
      console.log(this.dateFormat(data.scheduleTime, '1'));
      this.SCHEDULE_FLAG = data.scheduleFlag;
      this.SCHEDULE_TIME = this.dateFormat(data.scheduleTime, '1');
    }

    this.isVisibleSelPlan = false;
  }

  // 建立規劃案--------------
  openChkStrart(): void {
    console.log('openChkStrart ok');

    this.isVisibleStart = true;
  }
  // 確定建立規劃案
  handleOk_S() {
    let myObj = this;
    if (this.PLANSET_EDITION === undefined) {
      myObj.message.create('error', '請選擇「規劃策略版本」');
      return;
    }
    if (this.ICPDATA === undefined) {
      myObj.message.create('error', '請選擇「靜態資料是否要取最新或歷史」');
      return;
    }
    if (this.ICPDATA === '2' && this.HISICP === undefined) {
      myObj.message.create('error', '請選擇「靜態資料歷史版本」');
      return;
    }

    if (this.MODATA === undefined) {
      myObj.message.create('error', '請選擇「MO 資料是否要取最新或歷史」');
      return;
    }
    if (this.MODATA === '2' && this.HISMO === undefined) {
      myObj.message.create('error', '請選擇「MO 歷史版本」');
      return;
    }

    if (this.enddate === undefined) {
      myObj.message.create('error', '請選擇「MO 要落於LPST哪個區間」');
      return;
    }

    if (this.PLAN_ITEM_FLAG === undefined) {
      myObj.message.create('error', '請選擇「是否加入虛擬訂單MO」');
      return;
    }
    if (this.SCHEDULE_FLAG === undefined) {
      myObj.message.create('error', '請選擇「規劃案排程型態」');
      return;
    }
    if (
      (this.SCHEDULE_FLAG === '1' || this.SCHEDULE_FLAG === '2') &&
      this.SCHEDULE_TIME === undefined
    ) {
      myObj.message.create('error', '請選擇' + `style:` + '「排程啟動時間」');
      return;
    }

    return new Promise((resolve, reject) => {
      let obj = {};
      let ICP = '';
      let MO = '';
      let SCHEDULE = '';
      if (this.HISICP === undefined) ICP = 'New';
      else ICP = this.HISICP;
      if (this.HISMO === undefined) MO = 'New';
      else MO = this.HISMO;
      if (this.SCHEDULE_TIME === undefined) SCHEDULE = '';
      else SCHEDULE = this.SCHEDULE_TIME;

      _.extend(obj, {
        planStartType: 'F', // full run
        plansetEdition: this.PLANSET_EDITION,
        plant: this.PLANT,
        icpFlag: this.ICPDATA,
        hisIcpEdition: ICP,
        moFlag: this.MODATA,
        hisMoEdition: MO,
        lpstFlag: this.LPSTDATA,
        lpstStartdate: this.startdate,
        lpstEndtdate: this.enddate,
        planItemFlag: this.PLAN_ITEM_FLAG,
        scheduleFlag: this.SCHEDULE_FLAG,
        scheduleTime: SCHEDULE,
      });

      myObj.getPPSService.addPlanData(obj).subscribe(
        (res) => {
          if (res.code == 200) {
            this.PLANSET_EDITION = undefined;
            this.ICPDATA = undefined;
            this.HISICP = undefined;
            this.MODATA = undefined;
            this.HISMO = undefined;
            this.LPSTDATA = undefined;
            this.startdate = undefined;
            this.enddate = undefined;
            this.SCHEDULE_FLAG = undefined;
            this.SCHEDULE_TIME = undefined;
            this.ShopSortingList = undefined;
            this.CHOICE_plansetlist = undefined;
            this.CHOICE_shop_code = undefined;
            this.CHOICE_machine = undefined;
            this.CHOICE_sort = undefined;
            this.PLAN_ITEM_FLAG = undefined;

            this.sucessMSG(
              '已建立規劃案',
              `規劃案版本：${res.data[0].planEdition}`
            );
            this.getPlanDataList();
            this.isVisibleStart = false;
          } else {
            this.errorMSG('建立規劃案失敗', res.message);
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('新增存檔失敗', '後台新增存檔錯誤，請聯繫系統工程師');
          this.LoadingPage = false;
        }
      );
    });
  }
  handleCancel_S(): void {
    this.isVisibleStart = false;
    this.PLANSET_EDITION = undefined;
    this.ICPDATA = undefined;
    this.HISICP = undefined;
    this.MODATA = undefined;
    this.HISMO = undefined;
    this.LPSTDATA = undefined;
    this.startdate = undefined;
    this.enddate = undefined;
    this.SCHEDULE_FLAG = undefined;
    this.SCHEDULE_TIME = undefined;
    this.ShopSortingList = undefined;
    this.CHOICE_plansetlist = undefined;
    this.CHOICE_shop_code = undefined;
    this.CHOICE_machine = undefined;
    this.CHOICE_sort = undefined;
    this.PLAN_ITEM_FLAG = undefined;
  }

  // 修改已建立規劃案資料：僅調整排程時間&MO區間
  updPlanData(data) {
    if (data.planStatu === 'Plan') {
      this.message.create('error', '規劃案執行中，不可修改');
    } else {
      this.isVisibleUpd = true;
      this.show_PLAN_EDITION = data.planEdition;
      this.upd_PLAN_EDITION = data.planEdition;
      this.upd_oldPLANSET_EDITION = data.plansetEdition;
      this.upd_SCHEDULE_FLAG = data.scheduleFlag;
      this.upd_LPSTDATA = data.lpstFlag;
      this.updPlanItemFlag = data.planItemFlag;
      this.LPSTchange(data.LPSTDATA, 'upd');
      if (data.scheduleTime !== null) {
        let Yscdate = data.scheduleTime.substring(0, 4);
        let Mscdate = data.scheduleTime.substring(5, 7) - 1; // month 要比实际的月份数字小 1
        let Dscdate = data.scheduleTime.substring(8, 10);
        let HHscdate = data.scheduleTime.substring(11, 13);
        let mmscdate = data.scheduleTime.substring(14, 16);
        let ssscdate = data.scheduleTime.substring(17, 20);
        let date = new Date(
          Yscdate,
          Mscdate,
          Dscdate,
          HHscdate,
          mmscdate,
          ssscdate
        ); // 擷取字段轉型態
        let newDate = this.dateFormat(date, 2);
        this.upd_SCHEDULE_TIME = newDate;
      }
    }
  }
  // 變更changePlanset
  changePlanset(_value) {
    if (this.choicePlanset === 'A') {
      this.upd_newPLANSET_EDITION = undefined;
    } else {
      this.getPlansetVerList(this.upd_oldPLANSET_EDITION);
    }
  }
  // 取得規劃策略版次
  getPlansetVerList(_edition) {
    this.loading = true;
    let myObj = this;
    if (_edition == 'sel') {
      _edition = this.upd_oldPLANSET_EDITION;
    }
    this.getPPSService
      .getPlansetVerList(_edition, this.PLANT)
      .subscribe((res) => {
        console.log('plansetlist success');
        console.log(res);
        if ((res.code = 200)) {
          let result: any = res.data;
          this.plansetlist = [];
          let optionListTemp = [];
          for (let item of result) {
            let temp = {
              label: item.plansetEdition + '_' + item.setName,
              value: item.plansetEdition,
            };
            optionListTemp.push(temp);
          }
          this.plansetlist = optionListTemp;

          if (this.upd_newPLANSET_EDITION === undefined) {
            this.upd_newPLANSET_EDITION = optionListTemp[0];
          }
        } else {
          this.errorMSG('取得規劃策略版次失敗', res.message);
        }
        myObj.loading = false;
      });
  }

  // 確定修改規劃案
  handleOk_U() {
    let myObj = this;
    if (this.upd_enddate === undefined) {
      myObj.message.create('error', '請選擇「MO 要落於LPST哪個區間」');
      return;
    } else if (this.upd_SCHEDULE_FLAG === undefined) {
      myObj.message.create('error', '請選擇「規劃案排程型態」');
      return;
    } else if (
      (this.upd_SCHEDULE_FLAG === '1' || this.upd_SCHEDULE_FLAG === '2') &&
      this.upd_SCHEDULE_TIME === undefined
    ) {
      myObj.message.create('error', '請選擇' + `style:` + '「排程啟動時間」');
      return;
    } else if (this.updPlanItemFlag === undefined) {
      myObj.message.create('error', '請選擇「是否加入虛擬訂單MO');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改存檔',
        nzOnOk: () => {
          this.upd_save();
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }
  handleCancel_U(): void {
    this.isVisibleUpd = false;
    this.upd_PLAN_EDITION = undefined;
    this.upd_newPLANSET_EDITION = undefined;
    this.choicePlanset = 'A';
    this.upd_LPSTDATA = undefined;
    this.upd_startdate = undefined;
    this.upd_enddate = undefined;
    this.upd_SCHEDULE_FLAG = undefined;
    this.upd_SCHEDULE_TIME = undefined;
    this.updPlanItemFlag = undefined;
  }

  // 確定修改存檔
  upd_save() {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let obj = {};
      let SCHEDULE = '';
      if (
        this.upd_SCHEDULE_TIME === undefined ||
        this.upd_SCHEDULE_FLAG === '3'
      ) {
        SCHEDULE = null;
      } else {
        SCHEDULE = this.upd_SCHEDULE_TIME;
      }
      let updPLANSET_EDITION;
      if (this.upd_newPLANSET_EDITION === undefined)
        updPLANSET_EDITION = this.upd_oldPLANSET_EDITION;
      else updPLANSET_EDITION = this.upd_newPLANSET_EDITION.value;

      console.log(' this.updPlanItemFlag : ' + this.updPlanItemFlag);
      _.extend(obj, {
        planEdition: this.upd_PLAN_EDITION,
        plansetEdition: updPLANSET_EDITION,
        lpstFlag: this.upd_LPSTDATA,
        lpstStartdate: this.upd_startdate,
        lpstEndtdate: this.upd_enddate,
        planItemFlag: this.updPlanItemFlag,
        scheduleFlag: this.upd_SCHEDULE_FLAG,
        scheduleTime: SCHEDULE,
      });

      myObj.getPPSService.updPlanData(obj).subscribe(
        (res) => {
          if (res.code == 200) {
            this.upd_PLAN_EDITION = undefined;
            this.upd_newPLANSET_EDITION = undefined;
            this.choicePlanset = 'A';
            this.upd_LPSTDATA = undefined;
            this.upd_startdate = undefined;
            this.upd_enddate = undefined;
            this.updPlanItemFlag = undefined;
            this.upd_SCHEDULE_FLAG = undefined;
            this.upd_SCHEDULE_TIME = undefined;

            this.sucessMSG(
              '「規劃案」修改成功',
              `規劃案版本：${this.show_PLAN_EDITION}`
            );
            this.getPlanDataList();
            this.isVisibleUpd = false;
          } else {
            this.errorMSG('「規劃案」修改失敗', res.message);
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
          this.LoadingPage = false;
        }
      );
    });
  }

  // 修改規劃案公版版本&時間
  openPlanCommon() {
    this.isCommon = true;
    this.getPlanVerList('old', '1');
  }
  // 確定修改規劃案
  Ok_Com() {
    let myObj = this;
    if (this.oldPlanEdition === null) {
      myObj.message.create('error', '請選擇「原公版規劃案版本」');
      return;
    } else if (this.newPlanEdition === null) {
      myObj.message.create('error', '請選擇「新指定公版規劃案版本」');
      return;
    } else if (this.commSCHEDULE_TIME === null) {
      myObj.message.create('error', '請選擇「規劃案執行時間」');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定存檔',
        nzOnOk: () => {
          this.common_Save();
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }
  Cancel_Com(): void {
    this.isCommon = false;
    this.oldPlanEdition = null;
    this.newPlanEdition = null;
    this.commSCHEDULE_TIME = null;
  }
  // 取得規劃案執行版次
  getPlanVerList(_type, _flag) {
    this.loading = true;
    let myObj = this;

    this.getPPSService.getPlanVerList(_flag, this.PLANT).subscribe((res) => {
      console.log('getPlanVerList success');
      if (res.code == 200) {
        let result: any = res.data;
        this.planlist = [];
        let optionListTemp = [];
        for (let item of result) {
          let label;
          if (_type === 'old') {
            label = item.runTime;
          } else {
            label = item.planEdition;
          }
          let temp = {
            label: label,
            value: item.planEdition,
            scdate: item.scheduleTime,
          };
          optionListTemp.push(temp);
        }
        this.planlist = optionListTemp;

        if (_type === 'old') {
          if (this.oldPlanEdition === null) {
            this.oldPlanEdition = optionListTemp[0];
          }
          this.setDateValue(this.oldPlanEdition.value);
        }
      } else {
        this.errorMSG('取得規劃案執行版次失敗', res.message);
      }
      myObj.loading = false;
    });
  }
  // by版本號自動帶出日期
  setDateValue(_ver) {
    var filterValue = this.planlist.filter(function (item, index, array) {
      return item.value === _ver; // 取得相同版次
    });
    let Yscdate = filterValue[0].scdate.substring(0, 4);
    let Mscdate = filterValue[0].scdate.substring(5, 7) - 1; // month 要比实际的月份数字小 1
    let Dscdate = filterValue[0].scdate.substring(8, 10);
    let HHscdate = filterValue[0].scdate.substring(11, 13);
    let mmscdate = filterValue[0].scdate.substring(14, 16);
    let ssscdate = filterValue[0].scdate.substring(17, 20);
    let date = new Date(
      Yscdate,
      Mscdate,
      Dscdate,
      HHscdate,
      mmscdate,
      ssscdate
    ); // 擷取字段轉型態
    let newDate = this.dateFormat(date, 2);
    this.commSCHEDULE_TIME = newDate;
  }
  // 公版修改存檔
  common_Save() {
    this.loading = true;
    let myObj = this;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        oldPlanEdition: this.oldPlanEdition.value,
        newPlanEdition: this.newPlanEdition.value,
        scheduleTime: this.commSCHEDULE_TIME,
      });

      myObj.getPPSService.updSCHEDULEPlanEdition(obj).subscribe(
        (res) => {
          if (res.code == 200) {
            this.sucessMSG(
              '修改成功',
              `已將公版版本由：${this.oldPlanEdition.value} 改為：${this.newPlanEdition.value}`
            );
            this.oldPlanEdition = null;
            this.newPlanEdition = null;
            this.commSCHEDULE_TIME = null;

            this.getPlanDataList();
            this.isCommon = false;
          } else {
            this.errorMSG('公版修改失敗', res.message);
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
          this.LoadingPage = false;
        }
      );
    });
  }

  // 刪除規劃案----------------------
  delPlanData(_value1, _value2) {
    console.log('delPlanData : ' + _value1);
    let myObj = this;
    if (_value2 === 'Plan') {
      myObj.message.create('error', '此規劃案目前執行中，不可刪除');
      return;
    }
    if (_value2 === 'Publish') {
      myObj.message.create('error', '此規劃案已發佈，不可刪除');
      return;
    }

    return new Promise((resolve, reject) => {
      let obj = {};

      _.extend(obj, {
        planEdition: _value1,
        plant: this.PLANT,
      });
      myObj.getPPSService.delPlanData(obj).subscribe(
        (res) => {
          if (res.code == 200) {
            this.sucessMSG('已刪除規劃案', `規劃案版本：${_value1}`);
            this.getPlanDataList();
          } else {
            this.errorMSG('刪除失敗', res.message);
          }
          // } else {
          //   reject('upload fail');
          //   this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          // }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('刪除失敗', '後台刪除錯誤，請聯繫系統工程師');
        }
      );
      this.LoadingPage = false;
    });
  }

  async ftpStatusUpdateWebSocketConnect() {
    if (!this.fcpStatusWebSocketStomp.connectedStatus()) {
      try {
        this.LoadingPage = true;
        // 接收後端FCP開始執行與執行結束的通知
        await this.fcpStatusWebSocketStomp.connect();
        this.fcpStatusWebSocketStomp.getMessages().subscribe((message) => {
          console.log('--直棒收到後端FCP執行狀態的通知--');
          this.getRunFCPCount();
          this.getPlanDataList();
        });
      } catch (error) {
        this.errorMSG(
          '伺服器異常',
          '已失去與FCP執行狀態更新的連線，請稍後重試重新整理頁面'
        );
        this.fcpStatusWebSocketStomp.noAutoReconnectUserHandler();
        await this.sleep(5000);
      } finally {
        this.LoadingPage = false;
      }
    }
  }

  // 啟動規劃案(Full Run)----------------------
  async StrartRun(data) {
    console.log('StrartRun : ' + data.planEdition);
    this.LoadingPage = true;

    // 如果與後端web socket沒有連線了就重新連線
    await this.ftpStatusUpdateWebSocketConnect();

    await this.getRunFCPCount();
    if (this.isRunFCP) {
      this.getPlanDataList();
      this.switchValue = false;
      this.message.create(
        'error',
        '已有規劃案執行中，無法啟動，請等待執行結束'
      );
      this.LoadingPage = false;
      return;
    }

    if (data.planStatu === 'Plan') {
      this.message.create('error', '規劃案執行中，不可重新啟動');
      this.LoadingPage = false;
    } else {
      let myObj = this;
      this.loading = true;

      let STARTRUN_TIME = moment().format('YYYYMMDDHHmmss');
      this.ShopSortingList = undefined;
      this.cellsort = undefined;
      this.CHOICE_plansetlist = undefined;
      this.CHOICE_shop_code = undefined;
      this.CHOICE_machine = undefined;
      this.CHOICE_sort = undefined;

      let SCHEDULE_TIME;
      if (data.scheduleTime === null) SCHEDULE_TIME = '';

      const SHOP_CODE = [];
      const MACHINE = [];
      const SORT = [];
      if (data.CELLSORT === '1') {
        this.cellsort = 'TB, machine';
      } else {
        this.cellsort = 'machine, TB';
      }

      this.getPPSService
        .getShopSortingList('Q', data.seqNo)
        .subscribe((res) => {
          /*
        2023-12-22 用不上，先註解
        console.log("sendchoice : getShopSortingList success");
        this.ShopSortingList = res.data;
        console.log(this.ShopSortingList)

        for(let i=0; i<this.ShopSortingList.length; i++) {
          SHOP_CODE.push(this.ShopSortingList[i].SCH_SHOP_CODE);
          MACHINE.push(this.ShopSortingList[i].MACHINE);
          SORT.push(this.ShopSortingList[i].SORTING_EN);
        }
        this.CHOICE_shop_code = SHOP_CODE;
        this.CHOICE_machine = MACHINE;
        this.CHOICE_sort = SORT;

        this.ICPparam = {
          "STARTRUN_TIME" : STARTRUN_TIME,
          "PLAN_EDITION" : data.planEdition
        };

        this.FCPplan = {
          "startRun_Time" : STARTRUN_TIME,
          "plan_edition" : data.planEdition,
          "notify_YN" : "N",
          "startDate": data.lpstStartdate,
          "endDate": data.lpstEndtdate,
          "methodArray": "[F]",
          "method_dtlArray": "[[B,C]]",
          "move_firstStrategy": this.cellsort
        };
        */

          // "shop_code": `[${SHOP_CODE}]`,
          // "sortBy":`[${SORT}]`,
          return new Promise((resolve, reject) => {
            let obj = {};
            let editionArray = [];
            let scheduleArray = [];
            editionArray.push(data.planEdition);
            scheduleArray.push(data.scheduleFlag);
            _.extend(obj, {
              planEdition: data.planEdition,
              scheduleFlag: data.scheduleFlag,
              createUser: this.USERNAME,
              type: 'A',
              plant: this.PLANT,
            });

            console.log(obj);

            myObj.getPPSService.newStartFullRunPlan(obj).subscribe(
              (res) => {},
              (err) => {
                reject('upload fail');
                this.errorMSG('啟動失敗', '後台啟動錯誤，請聯繫系統工程師');
                this.LoadingPage = false;
              }
            );
            this.sucessMSG('已啟動規劃案', `規劃案版本：${data.planEdition}`);
          });
        });
      if (!this.fcpStatusWebSocketStomp.connectedStatus()) {
        this.errorMSG(
          '系統異常',
          'sorry，目前無法自動提示已完成執行，需自行重整頁面更新狀態'
        );
        this.LoadingPage = true;
        await this.sleep(5000);
      }
    }
  }

  // 停止生產規劃
  async stopPlan(data) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        startrunTime: data.startrunTime,
        planEdition: data.planEdition,
        plant: this.PLANT,
      });
      myObj.getPPSService.stopPlanData(obj).subscribe(
        (res) => {
          if (res.code == 200) {
            this.sucessMSG('已停止規劃案', `規劃案版本：${data.planEdition}`);
            // this.getPlanDataList();
            // this.getRunFCPCount();
          } else {
            this.errorMSG('停止規劃案失敗', res.message);
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('停止失敗', '後台停止錯誤，請聯繫系統工程師');
          this.LoadingPage = false;
        }
      );
    });
  }

  sleep(millisecond) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.getRunFCPCount();
        this.getPlanDataList();
      }, millisecond);
    });
  }

  async exportExcel(fcpEdition: string) {
    this.spinningTip = '資料量大，請稍待幾分鐘..';
    this.LoadingPage = true;

    try {
      const editionExistObservable$ =
        this.getPPSService.getFcpEdition(fcpEdition);
      const editionExistRes = await firstValueFrom<any>(
        editionExistObservable$
      );
      // if(editionExistRes[0].MSG === "Y") {
      if (editionExistRes.data.length == 1) {
        // 根據版次獲取該表的資料
        const fcpResObservable$ =
          this.getPPSService.getFCPResRepoDynamic(fcpEdition);
        let fcpRes = await firstValueFrom<any>(fcpResObservable$);
        const decoder = new TextDecoder('utf-8');
        fcpRes = decoder.decode(fcpRes);

        fcpRes = fcpRes.split(/\r\n|\n/g);

        // 取出檔案名稱(在倒數第二行)
        // 最後要請求後端刪除該檔案用
        const fileName = fcpRes[fcpRes.length - 2];
        // 移除空白的最後一行
        fcpRes.pop();
        // 移除檔案名稱
        fcpRes.pop();

        fcpRes = fcpRes.join('');

        let regex = /\[|\]/g;
        fcpRes = fcpRes.replace(regex, '');

        regex = /\}\{/g;
        fcpRes = fcpRes.replace(regex, '},{');

        fcpRes = `[${fcpRes}]`;

        fcpRes = JSON.parse(fcpRes);

        if (fcpRes.length <= 0) {
          this.message.create(
            'error',
            `該FCP版本：${fcpEdition}，無資料，不可轉出excel`
          );
          this.LoadingPage = false;
          return;
        }

        // 獲取該表中英文屬性名稱(key-value)
        const excelTitleObservable$ = this.getPPSService.getTitleName();
        const excelTitleRes = await firstValueFrom<any>(excelTitleObservable$);

        // 擷取出英文的屬性名稱放到firstRow
        const firstRow = _.keys(excelTitleRes.data);

        // 哪個英文title名稱要轉成哪個中文的title
        const firstRowDisplay = excelTitleRes.data;

        const exportData = [firstRowDisplay, ...fcpRes];
        const workSheet = XLSX.utils.json_to_sheet(exportData, {
          header: firstRow,
          skipHeader: true,
        });
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
        XLSX.writeFileXLSX(
          workBook,
          `${this.PLANT}_FCP結果表_${moment().format('YYYYMMDDHHmmss')}.xlsx`
        );

        // 刪除在後端產生的檔案避免佔用容量
        const deleteFileObservable$ =
          this.getPPSService.deleteFcp16File(fileName);
        firstValueFrom<any>(deleteFileObservable$);
      } else {
        this.message.create(
          'error',
          `FCP版本：${fcpEdition}，已逾時，不可轉出excel`
        );
      }
    } catch (error) {
      this.errorMSG(
        '獲取檔案發生異常',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.spinningTip = 'Loading...';
      this.LoadingPage = false;
    }
  }

  //convert to Excel and Download
  exportExcel_original(data) {
    var titleName = [];
    this.LoadingPage = true;
    this.isVisibleRun = false;
    this.titleArray = [];
    return new Promise((resolve, reject) => {
      this.getPPSService.getFcpEdition(data).subscribe(
        async (res) => {
          if (res.data.length == 1) {
            // 獲取該表中英文屬性名稱(key-value)
            const excelTitleObservable$ = this.getPPSService.getTitleName();
            const excelTitleRes = await firstValueFrom<any>(
              excelTitleObservable$
            );
            // 擷取出英文的屬性名稱放到firstRow
            const firstRow = _.values(excelTitleRes.data);

            this.getPPSService.getFCPResRepo(data).subscribe((res) => {
              let result: any = res;
              this.FCPResRepo = result;

              const data = this.formatDataForExcel(this.FCPResRepo);
              let fileName = `FCP結果表`;
              this.excelService.exportAsExcelFile(data, fileName, firstRow);
              this.LoadingPage = false;
              console.log('convertToExcel Done');
            });
          } else {
            this.message.create(
              'error',
              `FCP版本：${data}，已逾時，不可轉出excel`
            );
            this.LoadingPage = false;
          }
        },
        (err) => {
          this.message.create(
            'error',
            `FCP版本：${data}，已逾時，不可轉出excel`
          );
          this.LoadingPage = false;
          reject('ExportExcel fail');
        }
      );
    });
  }

  formatDataForExcel(_displayData) {
    let excelData = [];
    // excelData = _displayData.reduce((result, item) => {
    //   for (const key in item) {
    //     if (result[key]) {
    //       result[key].push(item[key]);
    //     } else {
    //       result[key] = [item[key]];
    //     }
    //   }
    //   return result;
    // }, {});

    // console.log(excelData)

    // let excelData2 = [];
    // _displayData.forEach(item => {
    //   for (const key in item) {
    //     if (excelData2[key]) {
    //       excelData2[key].push(item[key]);
    //     } else {
    //       excelData2[key] = [item[key]];
    //     }
    //   }
    // });
    // console.log(excelData2)

    for (let item of _displayData) {
      let obj = {};
      _.extend(obj, {
        // FCP_EDITION: _.get(item, "FCP_EDITION"),
        // MO_EDITION: _.get(item, "MO_EDITION"),
        // PLANT_CODE: _.get(item, "PLANT_CODE"),
        // SCH_SHOP_CODE: _.get(item, "SCH_SHOP_CODE"),
        // ID_NO: _.get(item, "ID_NO"),
        // ROUTING_SEQ: _.get(item, "ROUTING_SEQ"),
        // MODEL_TYPE: _.get(item, "MODEL_TYPE"),
        // BEST_MACHINE: _.get(item, "BEST_MACHINE"),
        // PST: _.get(item, "PST"),
        // PST_MACHINE: _.get(item, "PST_MACHINE"),
        // SORT: _.get(item, "SORT"),
        // CROSSDAYS: _.get(item, "CROSSDAYS"),
        // WORK_TIME: _.get(item, "WORK_TIME"),
        // TOTAL_WORK_TIME: _.get(item, "TOTAL_WORK_TIME"),
        // STARTPOINT: _.get(item, "STARTPOINT"),
        // SALE_ORDER: _.get(item, "SALE_ORDER"),
        // SALE_ITEM: _.get(item, "SALE_ITEM"),
        // SALE_LINENO: _.get(item, "SALE_LINENO"),
        // DATE_DELIVERY_PP: this.AppComponet.dateStringFormat(_.get(item, "DATE_DELIVERY_PP")),
        // WEIGHT: _.get(item, "WEIGHT"),
        // PCT_FLAG: _.get(item, "PCT_FLAG"),
        // PROCESS_CODE: _.get(item, "PROCESS_CODE"),
        // LINEUP_PROCESS: _.get(item, "LINEUP_PROCESS"),
        // PLAN_WEIGHT_I: _.get(item, "PLAN_WEIGHT_I"),
        // MERGE_NO: _.get(item, "MERGE_NO"),
        // SALE_ITEM_LENGTH: _.get(item, "SALE_ITEM_LENGTH"),
        // ACTUAL_LENGTH: _.get(item, "ACTUAL_LENGTH"),
        // NEXT_SCH_SHOP_CODE: _.get(item, "NEXT_SCH_SHOP_CODE"),
        // CYCLE_NO: _.get(item, "CYCLE_NO"),
        // STEEL_TYPE: _.get(item, "STEEL_TYPE"),
        // NEXT_ROUTING_SEQ: _.get(item, "NEXT_ROUTING_SEQ"),
        // PRIOR_ROUTING_SEQ: _.get(item, "PRIOR_ROUTING_SEQ"),
        // INPUT_TYPE: _.get(item, "INPUT_TYPE"),
        // OUTPUT_SHAPE: _.get(item, "OUTPUT_SHAPE"),
        // INPUT_DIA: _.get(item, "INPUT_DIA"),
        // OUT_DIA: _.get(item, "OUT_DIA"),
        // DENSITY: _.get(item, "DENSITY"),
        // ROLL_DATE: this.AppComponet.dateStringFormat(_.get(item, "ROLL_DATE")),
        // DATE_PLAN_IN_STORAGE: this.AppComponet.dateStringFormat(_.get(item, "DATE_PLAN_IN_STORAGE")),
        // LAST_WORKS_HOURS: _.get(item, "LAST_WORKS_HOURS"),
        // FINAL_PROCESS: _.get(item, "FINAL_PROCESS"),
        // FINAL_MIC_NO: _.get(item, "FINAL_MIC_NO"),
        // SFC_DIA: _.get(item, "SFC_DIA"),
        // SFC_SHOP_CODE: _.get(item, "SFC_SHOP_CODE"),
        // SALE_AREA_GROUP: _.get(item, "SALE_AREA_GROUP"),
        // CUST_ABBREVIATIONS: _.get(item, "CUST_ABBREVIATIONS"),
        // DATE_CREATE: this.AppComponet.dateFormat(new Date(Date.parse(_.get(item, "DATE_CREATE"))), 1),
        // TC_TEMPERATURE: _.get(item, "TC_TEMPERATURE"),
        // TC_FREQUENCE: _.get(item, "TC_FREQUENCE"),
        // BA1_TEMPERATURE: _.get(item, "BA1_TEMPERATURE"),
        // BA1_FREQUENCE: _.get(item, "BA1_FREQUENCE"),
        // RF_TEMPERATURE: _.get(item, "RF_TEMPERATURE"),
        // RF_FREQUENCE: _.get(item, "RF_FREQUENCE"),
        // STATUS: _.get(item, "STATUS"),
        // EPST: this.AppComponet.dateFormat(new Date(Date.parse(_.get(item, "EPST"))) ,1),
        // LPST: this.AppComponet.dateFormat(new Date(Date.parse(_.get(item, "LPST"))) ,1),
        // JIT: this.AppComponet.dateStringFormat(_.get(item, "JIT")),
        // ASAP: this.AppComponet.dateStringFormat(_.get(item, "ASAP")),
        // WORK_HOURS: _.get(item, "WORK_HOURS"),
        // MACHINE1: _.get(item, "MACHINE1"),
        // STATUS1: _.get(item, "STATUS1"),
        // WORK_HOURS1: _.get(item, "WORK_HOURS1"),
        // MACHINE2: _.get(item, "MACHINE2"),
        // STATUS2: _.get(item, "STATUS2"),
        // WORK_HOURS2: _.get(item, "WORK_HOURS2"),
        // MACHINE3: _.get(item, "MACHINE3"),
        // STATUS3: _.get(item, "STATUS3"),
        // WORK_HOURS3: _.get(item, "WORK_HOURS3"),
        // NEW_EPST: this.AppComponet.dateFormat(new Date(Date.parse(_.get(item, "NEW_EPST"))), 1),
        // NEWL_PST: this.AppComponet.dateFormat(new Date(Date.parse(_.get(item, "NEW_LPST"))), 1),
        // CPST:this.AppComponet.dateStringFormat( _.get(item, "CPST")),
        // CAMPAIGN_ID: _.get(item, "CAMPAIGN_ID"),
        // SCHE_TYPE: _.get(item, "SCHE_TYPE"),
        // AUTO_FROZEN: _.get(item, "AUTO_FROZEN"),
        // SORT_GROUP: _.get(item, "SORT_GROUP"),
        // ICP_EDITION: _.get(item, "ICP_EDITION"),
        // NEW_ASAP: this.AppComponet.dateStringFormat(_.get(item, "NEW_ASAP")),
        // TRANSFER_TIME: _.get(item, "TRANSFER_TIME"),
        // TRANSFER_TIME1: _.get(item, "TRANSFER_TIME1"),
        // TRANSFER_TIME2: _.get(item, "TRANSFER_TIME2"),
        // TRANSFER_TIME3: _.get(item, "TRANSFER_TIME3"),
        // CHOOSE_EQUIP_CODE: _.get(item, "CHOOSE_EQUIP_CODE"),
        // PREPARE_DIVIDE_ID: _.get(item, "PREPARE_DIVIDE_ID"),
        // PLAN_DATE_I: this.AppComponet.dateFormat(new Date(Date.parse(_.get(item, "PLAN_DATE_I"))), 1),
        // PLAN_DATE_O: this.AppComponet.dateFormat(new Date(Date.parse(_.get(item, "PLAN_DATE_O"))), 1),
        // AUTO_SORT: _.get(item, "AUTO_SORT"),
        // FLAG_OUTSOURCING: _.get(item, "FLAG_OUTSOURCING"),
        // DATE_BACK_OUTSOURCING: _.get(item, "DATE_BACK_OUTSOURCING"),
        // DATE_SEND_OUTSOURCING: _.get(item, "DATE_SEND_OUTSOURCING"),
        // FIXED_EQUIP_CODE: _.get(item, "FIXED_EQUIP_CODE"),
        // KIND_TYPE: _.get(item, "KIND_TYPE"),
        // MTRL_NO: _.get(item, "MTRL_NO"),
        // NEW_CPST: this.AppComponet.dateStringFormat(_.get(item, "NEW_CPST")),
        // PST_RERUN: this.AppComponet.dateStringFormat(_.get(item, "PST_RERUN")),
        // LOCK: _.get(item, "LOCK"),
        // LINEUP_MIC_NO: _.get(item, "LINEUP_MIC_NO"),
        // GRADE_GROUP: _.get(item, "GRADE_GROUP"),
        // OP_CODE: _.get(item, "OP_CODE"),
        // COMBINE_FLAG: _.get(item, "COMBINE_FLAG"),
        // CREATE_DATE: this.AppComponet.dateFormat(new Date(Date.parse(_.get(item, "CREATE_DATE"))), 1),
        // FIX_EPST: this.AppComponet.dateFormat(new Date(Date.parse(_.get(item, "FIX_EPST"))), 1),
        // FIX_AUTO_FROZEN: _.get(item, "FIX_AUTO_FROZEN"),
        // CUSTOM_SORT: _.get(item, "CUSTOM_SORT"),
        // ORIGINAL_CAMPAIGN_ID: _.get(item, "ORIGINAL_CAMPAIGN_ID"),
        // ORIGINAL_CUSTOM_SORT: _.get(item, "ORIGINAL_CUSTOM_SORT"),
        // CATEGORY: _.get(item, "CATEGORY"),
        // REMARK: _.get(item, "REMARK"),
        // REMARK_PLAN_IN_STORAGE: _.get(item, "REMARK_PLAN_IN_STORAGE")

        FCP_EDITION: _.get(item, 'FCP_EDITION'),
        MO_EDITION: _.get(item, 'MO_EDITION'),
        PLANT_CODE: _.get(item, 'PLANT_CODE'),
        SCH_SHOP_CODE: _.get(item, 'SCH_SHOP_CODE'),
        ID_NO: _.get(item, 'ID_NO'),
        ROUTING_SEQ: _.get(item, 'ROUTING_SEQ'),
        MODEL_TYPE: _.get(item, 'MODEL_TYPE'),
        BEST_MACHINE: _.get(item, 'BEST_MACHINE'),
        PST: _.get(item, 'PST'),
        PST_MACHINE: _.get(item, 'PST_MACHINE'),
        SORT: _.get(item, 'SORT'),
        CROSSDAYS: _.get(item, 'CROSSDAYS'),
        WORK_TIME: _.get(item, 'WORK_TIME'),
        TOTAL_WORK_TIME: _.get(item, 'TOTAL_WORK_TIME'),
        STARTPOINT: _.get(item, 'STARTPOINT'),
        SALE_ORDER: _.get(item, 'SALE_ORDER'),
        SALE_ITEM: _.get(item, 'SALE_ITEM'),
        SALE_LINENO: _.get(item, 'SALE_LINENO'),
        DATE_DELIVERY_PP: _.get(item, 'DATE_DELIVERY_PP'),
        WEIGHT: _.get(item, 'WEIGHT'),
        PCT_FLAG: _.get(item, 'PCT_FLAG'),
        PCT_LAB_DATE: _.get(item, 'PCT_LAB_DATE'),
        PROCESS_CODE: _.get(item, 'PROCESS_CODE'),
        LINEUP_PROCESS: _.get(item, 'LINEUP_PROCESS'),
        PLAN_WEIGHT_I: _.get(item, 'PLAN_WEIGHT_I'),
        MERGE_NO: _.get(item, 'MERGE_NO'),
        SALE_ITEM_LENGTH: _.get(item, 'SALE_ITEM_LENGTH'),
        ACTUAL_LENGTH: _.get(item, 'ACTUAL_LENGTH'),
        NEXT_SCH_SHOP_CODE: _.get(item, 'NEXT_SCH_SHOP_CODE'),
        CYCLE_NO: _.get(item, 'CYCLE_NO'),
        STEEL_TYPE: _.get(item, 'STEEL_TYPE'),
        NEXT_ROUTING_SEQ: _.get(item, 'NEXT_ROUTING_SEQ'),
        PRIOR_ROUTING_SEQ: _.get(item, 'PRIOR_ROUTING_SEQ'),
        INPUT_TYPE: _.get(item, 'INPUT_TYPE'),
        OUTPUT_SHAPE: _.get(item, 'OUTPUT_SHAPE'),
        INPUT_DIA: _.get(item, 'INPUT_DIA'),
        OUT_DIA: _.get(item, 'OUT_DIA'),
        DENSITY: _.get(item, 'DENSITY'),
        ROLL_DATE: _.get(item, 'ROLL_DATE'),
        DATE_PLAN_IN_STORAGE: _.get(item, 'DATE_PLAN_IN_STORAGE'),
        LAST_WORKS_HOURS: _.get(item, 'LAST_WORKS_HOURS'),
        FINAL_PROCESS: _.get(item, 'FINAL_PROCESS'),
        FINAL_MIC_NO: _.get(item, 'FINAL_MIC_NO'),
        SFC_DIA: _.get(item, 'SFC_DIA'),
        SFC_SHOP_CODE: _.get(item, 'SFC_SHOP_CODE'),
        SALE_AREA_GROUP: _.get(item, 'SALE_AREA_GROUP'),
        CUST_ABBREVIATIONS: _.get(item, 'CUST_ABBREVIATIONS'),
        DATE_CREATE: _.get(item, 'DATE_CREATE'),
        TC_TEMPERATURE: _.get(item, 'TC_TEMPERATURE'),
        TC_FREQUENCE: _.get(item, 'TC_FREQUENCE'),
        BA1_TEMPERATURE: _.get(item, 'BA1_TEMPERATURE'),
        BA1_FREQUENCE: _.get(item, 'BA1_FREQUENCE'),
        RF_TEMPERATURE: _.get(item, 'RF_TEMPERATURE'),
        RF_FREQUENCE: _.get(item, 'RF_FREQUENCE'),
        STATUS: _.get(item, 'STATUS'),
        EPST: _.get(item, 'EPST'),
        LPST: _.get(item, 'LPST'),
        JIT: _.get(item, 'JIT'),
        ASAP: _.get(item, 'ASAP'),
        WORK_HOURS: _.get(item, 'WORK_HOURS'),
        MACHINE1: _.get(item, 'MACHINE1'),
        STATUS1: _.get(item, 'STATUS1'),
        WORK_HOURS1: _.get(item, 'WORK_HOURS1'),
        MACHINE2: _.get(item, 'MACHINE2'),
        STATUS2: _.get(item, 'STATUS2'),
        WORK_HOURS2: _.get(item, 'WORK_HOURS2'),
        MACHINE3: _.get(item, 'MACHINE3'),
        STATUS3: _.get(item, 'STATUS3'),
        WORK_HOURS3: _.get(item, 'WORK_HOURS3'),
        NEW_EPST: _.get(item, 'NEW_EPST'),
        NEWL_PST: _.get(item, 'NEW_LPST'),
        CPST: _.get(item, 'CPST'),
        CAMPAIGN_ID: _.get(item, 'CAMPAIGN_ID'),
        SCHE_TYPE: _.get(item, 'SCHE_TYPE'),
        AUTO_FROZEN: _.get(item, 'AUTO_FROZEN'),
        SORT_GROUP: _.get(item, 'SORT_GROUP'),
        ICP_EDITION: _.get(item, 'ICP_EDITION'),
        NEW_ASAP: _.get(item, 'NEW_ASAP'),
        TRANSFER_TIME: _.get(item, 'TRANSFER_TIME'),
        TRANSFER_TIME1: _.get(item, 'TRANSFER_TIME1'),
        TRANSFER_TIME2: _.get(item, 'TRANSFER_TIME2'),
        TRANSFER_TIME3: _.get(item, 'TRANSFER_TIME3'),
        CHOOSE_EQUIP_CODE: _.get(item, 'CHOOSE_EQUIP_CODE'),
        PREPARE_DIVIDE_ID: _.get(item, 'PREPARE_DIVIDE_ID'),
        PLAN_DATE_I: _.get(item, 'PLAN_DATE_I'),
        PLAN_DATE_O: _.get(item, 'PLAN_DATE_O'),
        AUTO_SORT: _.get(item, 'AUTO_SORT'),
        FLAG_OUTSOURCING: _.get(item, 'FLAG_OUTSOURCING'),
        DATE_BACK_OUTSOURCING: _.get(item, 'DATE_BACK_OUTSOURCING'),
        DATE_SEND_OUTSOURCING: _.get(item, 'DATE_SEND_OUTSOURCING'),
        FIXED_EQUIP_CODE: _.get(item, 'FIXED_EQUIP_CODE'),
        KIND_TYPE: _.get(item, 'KIND_TYPE'),
        MTRL_NO: _.get(item, 'MTRL_NO'),
        NEW_CPST: _.get(item, 'NEW_CPST'),
        PST_RERUN: _.get(item, 'PST_RERUN'),
        LOCK: _.get(item, 'LOCK'),
        LINEUP_MIC_NO: _.get(item, 'LINEUP_MIC_NO'),
        GRADE_GROUP: _.get(item, 'GRADE_GROUP'),
        OP_CODE: _.get(item, 'OP_CODE'),
        COMBINE_FLAG: _.get(item, 'COMBINE_FLAG'),
        CREATE_DATE: _.get(item, 'CREATE_DATE'),
        FIX_EPST: _.get(item, 'FIX_EPST'),
        FIX_AUTO_FROZEN: _.get(item, 'FIX_AUTO_FROZEN'),
        CUSTOM_SORT: _.get(item, 'CUSTOM_SORT'),
        ORIGINAL_CAMPAIGN_ID: _.get(item, 'ORIGINAL_CAMPAIGN_ID'),
        ORIGINAL_CUSTOM_SORT: _.get(item, 'ORIGINAL_CUSTOM_SORT'),
        CATEGORY: _.get(item, 'CATEGORY'),
        SAVE_FLAG: _.get(item, 'SAVE_FLAG'),
        REMARK: _.get(item, 'REMARK'),
        REMARK_PLAN_IN_STORAGE: _.get(item, 'REMARK_PLAN_IN_STORAGE'),
        ORIGINAL_OP_CODE: _.get(item, 'ORIGINAL_OP_CODE'),
        ORIGINAL_PST_MACHINE: _.get(item, 'ORIGINAL_PST_MACHINE'),
        ORIGINAL_CAR_ID: _.get(item, 'ORIGINAL_CAR_ID'),
        UPDATE_DATE: _.get(item, 'UPDATE_DATE'),
        MS_SORT: _.get(item, 'MS_SORT'),
        PLAN_START_TIME: _.get(item, 'PLAN_START_TIME'),
        PLAN_END_TIME: _.get(item, 'PLAN_END_TIME'),
        FROZAN_GROUP: _.get(item, 'FROZAN_GROUP'),
        FCP_USE_FLAG: _.get(item, 'FCP_USE_FLAG'),
        SALE_ORDER_DIA: _.get(item, 'SALE_ORDER_DIA'),
        SFC_PROCESS: _.get(item, 'SFC_PROCESS'),
        LEFT_PROCESS: _.get(item, 'LEFT_PROCESS'),
        SFC_ROUTING_COUNT: _.get(item, 'SFC_ROUTING_COUNT'),
        MACHINE4: _.get(item, 'MACHINE4'),
        STATUS4: _.get(item, 'STATUS4'),
        WORK_HOURS4: _.get(item, 'WORK_HOURS4'),
        TRANSFER_TIME4: _.get(item, 'TRANSFER_TIME4'),
        MACHINE5: _.get(item, 'MACHINE5'),
        STATUS5: _.get(item, 'STATUS5'),
        WORK_HOURS5: _.get(item, 'WORK_HOURS5'),
        TRANSFER_TIME5: _.get(item, 'TRANSFER_TIME5'),
        MACHINE6: _.get(item, 'MACHINE6'),
        STATUS6: _.get(item, 'STATUS6'),
        WORK_HOURS6: _.get(item, 'WORK_HOURS6'),
        TRANSFER_TIME6: _.get(item, 'TRANSFER_TIME6'),
        MACHINE7: _.get(item, 'MACHINE7'),
        STATUS7: _.get(item, 'STATUS7'),
        WORK_HOURS7: _.get(item, 'WORK_HOURS7'),
        TRANSFER_TIME7: _.get(item, 'TRANSFER_TIME7'),
        URGENCY_ORDER_DESC: _.get(item, 'URGENCY_ORDER_DESC'),
        URGENCY_DATE: _.get(item, 'URGENCY_DATE'),
      });
      excelData.push(obj);
    }

    console.log(excelData);
    return excelData;
  }

  // 發佈規劃案FCP結果到MES----------------------
  publishData(data) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      const shopRoutingArray: string[] = [
        '430',
        '431',
        '433',
        '420',
        '421',
        '422',
        '453',
        '452',
        '401',
        '411',
        '402',
        '403',
        '404',
        '405',
        '406',
        '410',
        '460',
        '461',
        '334',
        '450',
        '451',
        '470',
        '480',
        '490',
      ];
      const shop_code: string = shopRoutingArray
        .map((route) => encodeURIComponent(route))
        .join('%2C');

      this.loading = true;
      myObj.getPPSService.getFcpEdition(data.fcpEdition).subscribe(
        (res) => {
          if (res.data.length == 1) {
            myObj.getPPSService
              .publishDataToMsh(data.fcpEdition, shop_code)
              .subscribe(
                (res) => {
                  if (_.get(res, 'msg') == 'Y') {
                    _.extend(obj, {
                      startrunTime: data.startrunTime,
                      planEdition: data.planEdition,
                      fcpEdition: data.fcpEdition,
                    });
                    myObj.getPPSService.publishData(obj).subscribe(
                      (res) => {
                        if ((res.code = 200)) {
                          this.sucessMSG(
                            '已發佈至工廠排程',
                            `FCP版本：${data.fcpEdition}`
                          );
                          this.getPlanDataList();
                        } else {
                          this.errorMSG('發佈至工廠排程失敗', res.message);
                        }
                        myObj.loading = false;
                        this.LoadingPage = false;
                      },
                      (err) => {
                        myObj.message.create(
                          'error',
                          `規劃案「${data.planEdition}」，已發佈至工廠排程，寫入 MYSQL 失敗`
                        );
                        reject('DB寫入失敗 fail');
                        myObj.loading = false;
                        this.LoadingPage = false;
                      }
                    );
                  } else {
                    myObj.message.create(
                      'error',
                      `規劃案「${data.planEdition}」，對應FCP版本：${data.fcpEdition}，Publish失敗`
                    );
                    myObj.loading = false;
                    this.LoadingPage = false;
                  }
                },
                (err) => {
                  myObj.message.create(
                    'error',
                    `規劃案「${data.planEdition}」，已發佈至工廠排程，失敗_FCP`
                  );
                  myObj.loading = false;
                  this.LoadingPage = false;
                  reject('Publish fail');
                }
              );
          } else {
            myObj.message.create(
              'error',
              `規劃案「${data.planEdition}」，對應FCP版本：${data.fcpEdition}，已逾時，不可再Publish`
            );
            myObj.loading = false;
            this.LoadingPage = false;
          }
        },
        (err) => {
          myObj.message.create(
            'error',
            `規劃案「${data.planEdition}」，已發佈至工廠排程，失敗_WEB`
          );
          myObj.loading = false;
          this.LoadingPage = false;
          reject('Publish fail');
        }
      );
    });
  }

  // 轉到生產規劃執行
  routerRun(_startrun, _plan): void {
    const _newstartrun = _startrun
      .substring(0, 19)
      .replace(/-/g, '')
      .replace(/:/g, '')
      .replace(/ /g, '');

    this.router.navigate(['/FCPINPUT/I230'], {
      queryParams: { startrun: _newstartrun, plan: _plan }, //传递的参数
      fragment: 'anchor' /*锚点*/,
    });

    // this.router.navigateByUrl(`/FCPINPUT/I230?startrun=${_startrun}&plan=${_plan}`);
  }

  //Date Format
  dateFormat(_dateString, _flag) {
    // 1.YYYY-MM-DD HH:mm:ss,  2.YYYYMMDDHHmmss
    if (_dateString == undefined || _dateString == '') {
      return '';
    }
    if (_flag == '1') {
      let date = moment(_dateString, 'YYYY-MM-DD HH:mm:ss').format(
        'YYYY-MM-DD HH:mm:ss'
      );
      return date;
    } else if (_flag == '2') {
      let date = moment(_dateString, 'YYYY-MM-DD HH:mm').format(
        'YYYY-MM-DD HH:mm'
      );
      return date;
    } else {
      return '';
    }
  }

  async getMoSortList() {
    if (!_.isEmpty(this.moSortList)) return;

    this.shopSortLoading = true;

    try {
      const resObservable$ = this.getPPSService.getMoSort();
      const res = await firstValueFrom<any>(resObservable$);

      if (res.code !== 200) {
        // this.errorMSG(
        //   '獲取平衡設定選項資料失敗',
        //   `請聯繫系統工程師。`
        // );
        location.reload(); // 设置为 true 表示强制从服务器加载页面
        this.errorMSG('操作失敗', res.message);
        return;
      }
      this.moSortList = res.data;
    } catch (error) {
      location.reload(); // 设置为 true 表示强制从服务器加载页面
      // this.errorMSG(
      //   '獲取平衡設定選項資料失敗',
      //   `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      // );
    } finally {
      this.shopSortLoading = false;
    }
  }

  sucessMSG(_title, _plan): void {
    this.Modal.success({
      nzTitle: _title,
      nzContent: `${_plan}`,
    });
  }

  errorMSG(_title, _context): void {
    this.Modal.error({
      nzTitle: _title,
      nzContent: `${_context}`,
    });
  }

  planEditionArray = [];
  newArray = [];
  test(data: any, event: any) {
    console.log(data.isSelected);
    if (this.switchValue === false) {
      this.planEditionArray = [];
      this.newArray = [];
    }
    if (data.isSelected === true) {
      this.planEditionArray.push(data.planEdition);
      this.newArray.push(data.scheduleFlag);
    } else {
      const index = this.planEditionArray.findIndex(
        (item) => item == data.planEdition
      );
      if (index !== -1) {
        this.planEditionArray.splice(index, 1);
        this.newArray.splice(index, 1);
      }
    }

    console.log(this.planEditionArray);
  }

  shouldDisableCheckbox(data: any): boolean {
    // 如果 planEditionArray.length 大於 2 且 data.isSelected 為 false，返回 true（禁用）
    // this.message.create('info', '最多只能選擇3個版本');
    return this.planEditionArray.length >= 3 && !data.isSelected;
  }

  readyStartMulti() {
    this.isVisibleStartMulti = true;
  }

  cancelMulti() {
    this.isVisibleStartMulti = false;
  }

  async startMulti() {
    let myObj = this;

    if (this.MODATA === undefined) {
      myObj.message.create('error', '請選擇「MO 資料是否要取最新或歷史」');
      return;
    }
    if (this.MODATA === '2' && this.HISMO === undefined) {
      myObj.message.create('error', '請選擇「MO 歷史版本」');
      return;
    }

    if (this.enddate === undefined) {
      myObj.message.create('error', '請選擇「MO 要落於LPST哪個區間」');
      return;
    }

    if (this.PLAN_ITEM_FLAG === undefined) {
      myObj.message.create('error', '請選擇「是否加入虛擬訂單MO」');
      return;
    }

    let MO = '';
    if (this.HISMO === undefined) MO = 'New';
    else MO = this.HISMO;

    console.log('StrartRun : ' + this.planEditionArray);
    this.LoadingPage = true;

    // 如果與後端web socket沒有連線了就重新連線
    await this.ftpStatusUpdateWebSocketConnect();

    await this.getRunFCPCount();
    if (this.isRunFCP) {
      this.getPlanDataList();
      this.switchValue = false;
      this.message.create(
        'error',
        '已有規劃案執行中，無法啟動，請等待執行結束'
      );
      this.LoadingPage = false;
      return;
    }

    if (this.isRunFCP) {
      this.message.create('error', '規劃案執行中，不可重新啟動');
      this.LoadingPage = false;
    } else {
      this.loading = true;

      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          planEditionArray: this.planEditionArray,
          scheduleFlagArray: this.newArray,
          createUser: this.USERNAME,
          type: 'A',
          plant: this.PLANT,
          hisMoEdition: MO,
          lpstStartdate: this.startdate,
          lpstEndtdate: this.enddate,
          planItemFlag: this.PLAN_ITEM_FLAG,
        });
        console.log(obj);
        myObj.getPPSService.newStartFullRunPlan(obj).subscribe(
          (res) => {},
          (err) => {
            reject('upload fail');
            this.errorMSG('啟動失敗', '後台啟動錯誤，請聯繫系統工程師');
            this.LoadingPage = false;
          }
        );
        this.sucessMSG('已啟動規劃案', `規劃案版本：${this.planEditionArray}`);
        this.isVisibleStartMulti = false;
        this.switchValue = false;
      });
    }
    if (!this.fcpStatusWebSocketStomp.connectedStatus()) {
      this.errorMSG(
        '系統異常',
        'sorry，目前無法自動提示已完成執行，需自行重整頁面更新狀態'
      );
      this.LoadingPage = true;
      await this.sleep(5000);
    }
  }
}
