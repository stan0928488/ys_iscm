import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';


import * as _ from "lodash";
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridReadyEvent, ValueFormatterParams } from "ag-grid-community";
import { OpenMachineRendererComponent } from "../../PPSI210_TabMenu/PPSI210/open-machine-renderer-component";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-PPSI230",
  templateUrl: "./PPSI230_Refining.component.html",
  styleUrls: ["./PPSI230_Refining.component.scss"],
  providers:[NzMessageService]
})
export class PPSI230RefiningComponent implements AfterViewInit {
  moSortList : any[] = []; // 平衡設定選項選項
  shopSortLoading = false; // 站別優先順序明細表是否載入中
  machineSortLoading = false; // 站別機台優先順序明細表是否載入中
  isSpinning = false;
	loading = false;
  isVisibleSorting = false;
  isVisibleMachine = false;
  datetime = moment();

  planListData;       // 規劃案啟動log
  StartLogList;       // 規劃案執行log
  ShopSortingList;    // 站別排序
  tmpArr;
  MachineSortingList;    // 機台排序
  PLANT = '精整'; //類型
  isExistProposal = true; //是否有任何規劃案版本

  STARTRUN_TIME;
  PLAN_EDITION;
  PLANSET_EDITION;
  SETNAME;
  PLAN_STATU_NA;
  ICP_EDITION_NA;
  MO_EDITION_NA;
  MSEQNO;
  INITIALFLAG;
  MOSORTNA;
  CELLSORTNA;
  NEXTSHOPSORTNA;
  MACHINESORTNA;

  // LOG
  PLANSTARTVER;
  MOVER;
  DATAVER;
  FCPVER;
  S_PENT;
  M_PENT;
  I_PENT;
  F_PENT;
  RES_S;
  RES_M;
  RES_I;
  RES_F;

  USERNAME;
  startrun;
  timer;

  // 第一次初始化獲取選項
  isFirstGetoptions = true;
  // 輸入選項，規劃案版本與執行時間
  options : any = null;
  // 規劃案版本List
  planEditionList : any[] = [];
  // 執行時間List
  startRunTimeList : any[] = [];
  // 規劃案版本選項載入中
  planEditionLoading = false;
  // 使用者選中的規劃案版本
  planEditionInput : string = null;
  // 執行時間選項載入中
  startRunTimeLoading = false;
  // 使用者選中的執行時間
  startRunTimeInput : string = null;

  nzPagination:any ;

  gridApi : GridApi;
  gridColumnApi : ColumnApi;
  agGridContext : any;

  gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: false,
      resizable: true,
      //wrapText: true,
      autoHeight: true,
    }
  };

  // 站別優先順序明細表ColumnDefs
  shopSortingColumnDefs: ColDef[] = [
    { 
      headerName:'站別',
      field:'SCH_SHOP_CODE',
      width:80,
      headerClass:'wrap-header-Text',
    },
    { 
      headerName:'規劃優先順序',
      field:'SORTING_SEQ',
      width:350,
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'集批天數',
      field:'INTERVAL',
      width:110,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'集批條件',
      field:'REQUIREMENT',
      width:110,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'COMBINE執行',
      field:'ISCOMBINE',
      width:120,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'交期範圍(單位:月)',
      field:'COMBINE_RANGE',
      width:120,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'指定平衡設定',
      field:'MO_SORT',
      width:110,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text',
      valueFormatter : (params: ValueFormatterParams) : string => {
        let formatValue = null;
        this.moSortList.some(item =>{
          if(item.method === params.value) {
            formatValue = item.notesChinese;
            return true;
          }
        }); 
        return formatValue;
      }
    },
    { 
      headerName:'平移日期',
      field:'OFFLOAD_DATE',
      width:110,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text',
      valueFormatter : (params: ValueFormatterParams) : string => {
        if(_.isNil(params.value)){
          return moment().format('YYYY-MM-DD');
        }
      }
    },
    { 
      headerName:'平移日期-迄',
      field:'OFFLOAD_DATE_END',
      width:110,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text',
      valueFormatter : (params: ValueFormatterParams) : string => {
        if(_.isNil(params.value)){
          return moment().format('YYYY-MM-DD');
        }
      }
    },
    { 
      headerName:'Action',
      field:'action',
      width:95,
      headerClass:'wrap-header-Text',
      cellRenderer: OpenMachineRendererComponent
    }
  ];

  // 站別機台優先順序明細表ColumnDefs
  machineSortingColumnDefs : ColDef[] = [
    { 
      headerName:'站別',
      field:'SCH_SHOP_CODE_D2',
      width:80,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'機台',
      field:'MACHINE',
      width:80,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'規劃優先順序',
      field:'SORTING_SEQ_D2',
      width:400,
      cellClass:'wrap-cell-Text',
    },
    { 
      headerName:'集批天數',
      field:'INTERVAL_D2',
      width:105,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'集批條件',
      field:'REQUIREMENT_D2',
      width:150,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'COMBINE執行',
      field:'ISCOMBINE_D2',
      width:120,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'交期範圍(單位:月)',
      field:'COMBINE_RANGE_D2',
      width:120,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    }
  ];
  
  constructor(
    private route: ActivatedRoute,
    private getPPSService: PPSService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.agGridContext = {
      componentParent: this,
    };

    // this.STARTRUN_TIME = this.route.snapshot.paramMap.get('startrun');
    // this.PLAN_EDITION = this.route.snapshot.paramMap.get('plan');

    // console.log(this.route.params)
    console.log(this.route.snapshot.params)
    // this.route.snapshot.params.subscribe((param: any) => {
    //   console.log('startrun', param['startrun']);
    //   console.log("plan",  param["plan"]);
    // })

    console.log("--------------------------------")
    console.log(this.STARTRUN_TIME);
    console.log(this.route.snapshot.paramMap.get('plan'));
    console.log("--------------------------------")

    //设置定时刷新事件，每隔1分鐘刷新
    this.timer = setInterval(() => {
      this.getLogPlanData(this.planEditionInput, this.startRunTimeInput);
    }, 30000)
  }

  async ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    await this.getOptions();
    this.isFirstGetoptions = false;
    await this.getMoSortList();
  }

  async getOptions(){

    try{
      this.isSpinning = true;
      this.planEditionLoading = true;
      const resObservable$ = this.getPPSService.getI230Options(this.PLANT);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取「規劃案版本」選項失敗',
          `錯誤訊息 : ${res.message}`
        );
        this.planEditionLoading = false;
        return;
      }

      this.options = res.data;
      this.planEditionList = _.keys(this.options);
      // 第一筆最新的規劃案版本為預設輸入參數
      if(this.isFirstGetoptions){
        this.planEditionInput = this.planEditionList[0];
      }
      this.startRunTimeList = this.options[this.planEditionInput].map(item => String(item.startRunTime));
      if(this.isFirstGetoptions){
        this.startRunTimeInput = this.startRunTimeList[0];
        this.getLogPlanData(this.planEditionInput, this.startRunTimeInput);
      }

    } catch (error) {
      this.errorMSG(
        '獲取「規劃案版本」選項失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.planEditionLoading = false;
      this.isSpinning = false;
    }
  }

  planEditionChange(){
    this.startRunTimeList = this.options[this.planEditionInput].map(item => String(item.startRunTime));
    this.startRunTimeInput = this.startRunTimeList[0];
    this.getLogPlanData(this.planEditionInput, this.startRunTimeInput);
  }

  startRunTimeChange(){
    this.getLogPlanData(this.planEditionInput, this.startRunTimeInput);
  }

  //Get Data
  getLogPlanData(planEdition : string, startRunTime : string) {
    this.loading = true;
    this.isSpinning = true;
    console.log("getLogPlanData...");

    let myObj = this;
    this.getPPSService.getLogPlanData(planEdition, startRunTime, this.PLANT).subscribe(res => {
      console.log("getLogPlanData success");

      if(_.isNull(res.data)){
        this.sucessMSG(
          '沒有資料',
          `目前該${this.PLANT}類型無任何規劃案版本`
        );
        // 沒有任何規劃案版本關閉明細的點選
        this.isExistProposal = false;
        // 清除更新規劃案資訊的定時任務
        clearInterval(this.timer);
        return;
      }
      
      this.planListData = res.data;
      console.log(" ------ res ------ ");
      console.log(res);
      console.log(" ------ res ------ ");
      this.STARTRUN_TIME = this.planListData[0].STARTRUN_TIME;
      this.PLAN_EDITION = this.planListData[0].PLAN_EDITION;
      this.PLANSET_EDITION = this.planListData[0].PLANSET_EDITION;
      this.SETNAME = this.planListData[0].SETNAME;
      this.PLAN_STATU_NA = this.planListData[0].PLAN_STATU_NA;
      this.ICP_EDITION_NA = this.planListData[0].ICP_EDITION_NA;
      this.MO_EDITION_NA = this.planListData[0].MO_EDITION_NA;
      this.MSEQNO = this.planListData[0].SEQNO;
      this.INITIALFLAG = this.planListData[0].INITIALFLAG;
      this.MOSORTNA = this.planListData[0].MOSORTNA;
      this.CELLSORTNA = this.planListData[0].CELLSORTNA;
      this.NEXTSHOPSORTNA = this.planListData[0].NEXTSHOPSORTNA;
      this.MACHINESORTNA = this.planListData[0].MACHINESORTNA;

        this.getPPSService.getStartLogData(this.planListData[0].STARTRUN_TIME, this.planListData[0].PLAN_EDITION).subscribe(res => {
          console.log("getStartLogData success");
          this.StartLogList = res.data;
          this.PLANSTARTVER = this.StartLogList[0].PLANSTARTVER;
          this.MOVER = this.StartLogList[0].MOVER;
          this.DATAVER = this.StartLogList[0].DATAVER;
          this.FCPVER = this.StartLogList[0].FCPVER;
          this.S_PENT = this.StartLogList[0].S_PENT;
          this.M_PENT = this.StartLogList[0].M_PENT;
          this.I_PENT = this.StartLogList[0].I_PENT;
          this.F_PENT = this.StartLogList[0].F_PENT;
          this.RES_S = this.StartLogList[0].RES_S;
          this.RES_M = this.StartLogList[0].RES_M;
          this.RES_I = this.StartLogList[0].RES_I;
          this.RES_F = this.StartLogList[0].RES_F;

        });
      myObj.loading = false;
    });
    this.isSpinning = false;
  }


  openSorting(_Mseqno): void {
    this.isVisibleSorting = true;
    console.log("-----------this.isVisibleSorting--------------")
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
    this.getPPSService.getShopMachineSortingList('Q', _planset).subscribe(res => {
      console.log("getShopMachineSortingList success");
      this.tmpArr = res.data;
      if (this.tmpArr.length > 0) {
        var newSchShopCode = this.tmpArr.filter(function(item, index, arr) {    // 排除重複資料
          return item.SCH_SHOP_CODE_D2 === _shopcode;
        });
        if(newSchShopCode.length > 0) {
          this.MachineSortingList = [...newSchShopCode];
          this.isVisibleMachine = true;
        } else {
          myObj.message.create("warning", `站別「${_shopcode}」無設定機台優先順序`);
        }
      } else {
        myObj.message.create("warning", `站別「${_shopcode}」無設定機台優先順序`);
      }
      myObj.machineSortLoading = false;
    });
  }

  handleCancel_M(): void {
    console.log(this.MachineSortingList)
    this.MachineSortingList = [];
    this.isVisibleMachine = false;
  }


  // 撈取 sorting 表
  getShopSortingList(_Mseqno) {
    this.shopSortLoading = true;
    let myObj = this;
    this.getPPSService.getShopSortingList('Q', _Mseqno).subscribe(res => {
      console.log("getShopSortingList success");
      res.data.forEach(item => {
        item.MO_SORT = _.isNil(item.MO_SORT) ? 'null_string' : item.MO_SORT;
      })
      this.ShopSortingList = res.data;
      myObj.shopSortLoading = false;
    });
  }


  ngOnInit(): void {
  }

  // 銷毀定時器
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  async getMoSortList(){

    if(!_.isEmpty(this.moSortList)) return;

    this.shopSortLoading = true;

    try{
      const resObservable$ = this.getPPSService.getMoSort();
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取平衡設定選項資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        return;
      }
      this.moSortList = res.data;
    }
    catch (error) {
      this.errorMSG(
        '獲取平衡設定選項資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.shopSortLoading = false;
    }
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

}
