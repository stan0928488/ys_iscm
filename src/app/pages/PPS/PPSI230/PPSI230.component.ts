import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';


import * as _ from "lodash";

@Component({
  selector: "app-PPSI230",
  templateUrl: "./PPSI230.component.html",
  styleUrls: ["./PPSI230.component.scss"],
  providers:[NzMessageService]
})
export class PPSI230Component implements AfterViewInit {
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

  nzPagination:any ;
  
  constructor(
    private route: ActivatedRoute,
    private getPPSService: PPSService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private cookieService: CookieService,
    private message: NzMessageService
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");

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
      this.getLogPlanData();
    }, 30000)
  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getLogPlanData();
  }


  //Get Data
  getLogPlanData() {
    this.loading = true;
    this.isSpinning = true;
    console.log("getLogPlanData...");

    let myObj = this;
    this.getPPSService.getLogPlanData("N", "N").subscribe(res => {
      console.log("getLogPlanData success");
      this.planListData = res;
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
          this.StartLogList = res;
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
    this.loading = true;
    let myObj = this;
    this.getPPSService.getShopMachineSortingList('Q', _planset).subscribe(res => {
      console.log("getShopMachineSortingList success");
      this.tmpArr = res;
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
      myObj.loading = false;
    });
  }

  handleCancel_M(): void {
    console.log(this.MachineSortingList)
    this.MachineSortingList = [];
    this.isVisibleMachine = false;
  }


  // 撈取 sorting 表
  getShopSortingList(_Mseqno) {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getShopSortingList('Q', _Mseqno).subscribe(res => {
      console.log("getShopSortingList success");
      this.ShopSortingList = res;
      myObj.loading = false;
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





}
