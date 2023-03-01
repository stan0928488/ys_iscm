import { Component, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
//import { en_US, zh_TW, NzI18nService, T } from "ng-zorro-antd";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from "lodash";
import * as moment from "moment";
//import { forEach } from "@angular/router/src/utils/collection";



@Component({
  selector: "app-PPSR300",
  templateUrl: "./PPSR300.component.html",
  styleUrls: ["./PPSR300.component.scss"],
  providers:[NzMessageService]
})
export class PPSR300Component implements AfterViewInit {
  isSpinning = false;
  SaleAreadata;   // 區別下拉
  radioValue = 'A';
  verList;  //版本
  MOverList;  //MO版本
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfMOOption: Array<{ label: string; value: string }> = [];
  selectedVer;
  selectedMOVer;

  TSalData; //表格顯示資料  (表頭訂單數量合計)
  DSalData; //表格顯示資料  (明細PST數量合計)
  MODtlData; //MO表格明細顯示資料(所有MO明細)
  SHOPMachineData; //表格圖層 (byTB站別SHOW機台)
  DelayOrderData;   // 遞延訂單
  totalListWeight = 0;
  classC;

  HighlightRow : Number;
  ClickedRow : any;
  loading = false; //loaging data flag
  LoadingPage = false;
  isVisible = false;
  isVisibleChart = false;
  isVisibleDelay = false;

  searchChange$ = new BehaviorSubject('');

  isLoading = false;  //loading select

  searchByMOValue; // 找 MO keyword
  searchBySHOPValue; //找 站別 keyword
  searchByBestMValue; // 找 最佳機台 keyword
  searchByPSTMValue; // 找 投料機台 keyword
  isModalVisible;
  isModalCancleFlagVisible = false;
  date;

  isOkLoading;
  modalString;
  USERNAME = "";

  // 第二層逾期
  stylesDtl = {
    width: '7%',
    color: 'black'
  };
  // 第二層日期
  Sdate1; Sdate2; Sdate3; Sdate4; Sdate5; Sdate6; Sdate7; Sdate8; Sdate9; Sdate10; Sdate11;

  // 第三層 PST 超過 LPST
  stylesSHOP1 = { color: 'black' };
  stylesSHOP2 = { color: 'black' };
  stylesSHOP3 = { color: 'black' };
  stylesSHOP4 = { color: 'black' };
  stylesSHOP5 = { color: 'black' };
  stylesSHOP6 = { color: 'black' };
  stylesSHOP7 = { color: 'black' };
  stylesSHOP8 = { color: 'black' };
  stylesSHOP9 = { color: 'black' };
  stylesSHOP10 = { color: 'black' };
  stylesSHOP11 = { color: 'black' };
  stylesSHOP12 = { color: 'black' };
  stylesSHOP13 = { color: 'black' };
  stylesSHOP14 = { color: 'black' };
  stylesSHOP15 = { color: 'black' };
  stylesSHOP16 = { color: 'black' };
  stylesSHOP17 = { color: 'black' };
  stylesSHOP18 = { color: 'black' };
  stylesSHOP19 = { color: 'black' };
  stylesSHOP20 = { color: 'black' };
  stylesSHOP21 = { color: 'black' };
  stylesSHOP22 = { color: 'black' };
  stylesSHOP23 = { color: 'black' };
  stylesSHOP24 = { color: 'black' };
  stylesSHOP25 = { color: 'black' };

  FCPData; //初版資料;

  constructor(
    private getPPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.ClickedRow = function(index){
      this.HighlightRow = index;
    }
  }


  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getVerList();
    this.getMOVerList();
    this.getTBDate();
    this.getTSalWeightData();
    this.getDSalWeightData(this.radioValue, this.selectedVer, this.selectedMOVer);
    // this.getSaleAreaListData();
  }


  // 取得版本號
  getVerList() {
    this.loading = true;
    console.log("getVerList...");

    let myObj = this;
    this.getPPSService.getVerList().subscribe(res => {
      console.log("getVerList success");
      this.verList = res;
      const children: Array<{ label: string; value: string }> = [];
      for(let i = 0 ; i<this.verList.length ; i++) {
        children.push({ label: this.verList[i].FCP_EDITION, value: this.verList[i].FCP_EDITION })
      }
      this.listOfOption = children;

      myObj.loading = false;
    });
  }
  changeVersion(){
    this.getDSalWeightData(this.radioValue, this.selectedVer, this.selectedMOVer);
  }

  addRow() {
    console.log("----------onSunmit------")
    this.cdRef.detectChanges()
  }

  // 取得MO版本號
  getMOVerList() {
    this.loading = true;
    console.log("getMOVerList...");

    let myObj = this;
    this.getPPSService.getMOVerList(this.selectedVer).subscribe(res => {
      console.log("getMOVerList success");
      this.MOverList = res;
      const children: Array<{ label: string; value: string }> = [];
      for(let i = 0 ; i<this.MOverList.length ; i++) {
        children.push({ label: this.MOverList[i].MO_EDITION, value: this.MOverList[i].MO_EDITION })
      }
      this.listOfMOOption = children;
      console.log(this.listOfMOOption)
      myObj.loading = false;
    });
  }
  changeMOVersion(){
    this.getDSalWeightData(this.radioValue, this.selectedVer, this.selectedMOVer);
  }


  //Get Data
  getTBDate() {
    this.loading = true;
    console.log("getTBDate...");
    let myObj = this;
    this.getPPSService.getTBDate().subscribe(res => {
      console.log("getTBDate success");
      this.date = res;
      console.log(this.date);
      myObj.loading = false;
    });
  }
  getTSalWeightData() {
    this.loading = true;
    console.log("getData...");

    let myObj = this;
    this.getPPSService.getTSalWeightData().subscribe(res => {
      console.log("getTSalWeightData success");
      this.TSalData = res;
      myObj.loading = false;
    });
  }
  getDSalWeightData(_rule, _ver, _MOver) {
    this.loading = true;
    this.isSpinning = true;
    console.log("getData...");

    let myObj = this;
    this.getPPSService.getDSalWeightData(_rule, _ver, _MOver).subscribe(res => {
      console.log("getDSalWeightData success");
      console.log(res);
      this.DSalData = res;
      this.isSpinning = false;
      myObj.loading = false;
    });
  }


  getSaleAreaListData() {
    this.loading = true;
    console.log("SaleAreaList...");
    let myObj = this;
    this.getPPSService.getSaleAreaListData().subscribe(res => {
      console.log("getSaleAreaListData success");
      this.SaleAreadata = res;
      myObj.loading = false;
    });
  }


  onSearch(value: string): void {
    this.isLoading = true;
    this.searchChange$.next(value);
  }

  // 畫面條件 (A / B... 方案)
  onChangeStatus(_event) {
    this.getTSalWeightData();
    this.getDSalWeightData(_event, this.selectedVer, this.selectedMOVer);
  }

  openDetailDialog(item, row, cell): void {
    console.log("openDetailDialog")

    if(item.TB === '計畫入庫量') {
      this.isVisible = false;
      return;
    }
    this.isVisible = true;
    let date1, date2, date3, date4;
    let flag;

    date1 = this.date[row].Sdate
    date2 = this.date[row].Edate

    this.Sdate1 = this.dateFormat(this.addDays(date1, 0)).substring(5, 10);
    this.Sdate2 = this.dateFormat(this.addDays(date1, 1)).substring(5, 10);
    this.Sdate3 = this.dateFormat(this.addDays(date1, 2)).substring(5, 10);
    this.Sdate4 = this.dateFormat(this.addDays(date1, 3)).substring(5, 10);
    this.Sdate5 = this.dateFormat(this.addDays(date1, 4)).substring(5, 10);
    this.Sdate6 = this.dateFormat(this.addDays(date1, 5)).substring(5, 10);
    this.Sdate7 = this.dateFormat(this.addDays(date1, 6)).substring(5, 10);
    this.Sdate8 = this.dateFormat(this.addDays(date1, 7)).substring(5, 10);
    this.Sdate9 = this.dateFormat(this.addDays(date1, 8)).substring(5, 10);
    this.Sdate10 = this.dateFormat(this.addDays(date1, 9)).substring(5, 10);
    this.Sdate11 = this.dateFormat(this.addDays(date1, 10)).substring(5, 10);

    if (cell == 0) {
      date3 = this.date[cell].Sdate;
      date4 = this.date[cell].Edate;
    } else if (cell == 10) {
      date3 = "1911-01-01";
      date4 = "1911-01-01";
    } else {
      date3 = this.date[cell-1].Sdate;
      date4 = this.date[cell-1].Edate;
    }

    if (row > (cell-1)) {
      this.stylesDtl.color = 'red';
    } else {
      this.stylesDtl.color = 'black';
    }

    if (row == 0 || cell == 0 ){
      if (row == 0 && cell == 0) {
        flag = "1";
      } else if ( row != 0 && cell == 0) {
        flag = "2";
      } else if ( row == 0 && cell != 0) {
        if (cell == 10) {
          flag = "5";
        } else {
          flag = "3";
        }
      }
    } else {
      if (cell == 10) {
        flag = "5";
      } else {
        flag = "4";
      }
    }

    console.log("row, cell : " + row + " ----- " + cell);
    console.log("date1, date2 : " + date1 + " ----- " + date2);
    console.log("date3, date4 : " + date3 + " ----- " + date4);

    let myObj = this;
    this.getPPSService.getFCPResDtlData(date1, date2, date3, date4, flag, this.radioValue, this.selectedVer, this.selectedMOVer).subscribe(res => {
      console.log("getFCPResDtlData success");
      this.MODtlData = res;
      console.log(this.MODtlData)

      // this.totalListWeight = 0;
      // this.MODtlData.forEach(item => {
      //   this.totalListWeight += item.WEIGHT;
      // })
      myObj.loading = false;
    });

  }

  openChartDialog(_order, _item): void {
    this.isVisibleChart = true;
    console.log("openChartDialog")

    let myObj = this;
    this.getPPSService.getTB_SCHSHOPCODE(_order, _item, this.selectedVer, this.radioValue, this.selectedMOVer).subscribe(res => {
      console.log("getTB_SCHSHOPCODE success");
      this.SHOPMachineData = res;
      const LPST = res[0].LPST.substring(5, 10);
      console.log(LPST);

      if (LPST < res[0].P1) {
        this.stylesSHOP1.color = 'red';
      } else {
        this.stylesSHOP1.color = 'black';
      }
      if (LPST < res[0].P2) {
        this.stylesSHOP2.color = 'red';
      } else {
        this.stylesSHOP2.color = 'black';
      }
      if (LPST < res[0].P3) {
        this.stylesSHOP3.color = 'red';
      } else {
        this.stylesSHOP3.color = 'black';
      }
      if (LPST < res[0].P4) {
        this.stylesSHOP4.color = 'red';
      } else {
        this.stylesSHOP4.color = 'black';
      }
      if (LPST < res[0].P5) {
        this.stylesSHOP5.color = 'red';
      } else {
        this.stylesSHOP5.color = 'black';
      }
      if (LPST < res[0].P6) {
        this.stylesSHOP6.color = 'red';
      } else {
        this.stylesSHOP6.color = 'black';
      }
      if (LPST < res[0].P7) {
        this.stylesSHOP7.color = 'red';
      } else {
        this.stylesSHOP7.color = 'black';
      }
      if (LPST < res[0].P8) {
        this.stylesSHOP8.color = 'red';
      } else {
        this.stylesSHOP8.color = 'black';
      }
      if (LPST < res[0].P9) {
        this.stylesSHOP9.color = 'red';
      } else {
        this.stylesSHOP9.color = 'black';
      }
      if (LPST < res[0].P10) {
        this.stylesSHOP10.color = 'red';
      } else {
        this.stylesSHOP10.color = 'black';
      }
      if (LPST < res[0].P11) {
        this.stylesSHOP11.color = 'red';
      } else {
        this.stylesSHOP11.color = 'black';
      }
      if (LPST < res[0].P12) {
        this.stylesSHOP12.color = 'red';
      } else {
        this.stylesSHOP12.color = 'black';
      }
      if (LPST < res[0].P13) {
        this.stylesSHOP13.color = 'red';
      } else {
        this.stylesSHOP13.color = 'black';
      }
      if (LPST < res[0].P14) {
        this.stylesSHOP14.color = 'red';
      } else {
        this.stylesSHOP14.color = 'black';
      }
      if (LPST < res[0].P15) {
        this.stylesSHOP15.color = 'red';
      } else {
        this.stylesSHOP15.color = 'black';
      }
      if (LPST < res[0].P16) {
        this.stylesSHOP16.color = 'red';
      } else {
        this.stylesSHOP16.color = 'black';
      }
      if (LPST < res[0].P17) {
        this.stylesSHOP17.color = 'red';
      } else {
        this.stylesSHOP17.color = 'black';
      }
      if (LPST < res[0].P18) {
        this.stylesSHOP18.color = 'red';
      } else {
        this.stylesSHOP18.color = 'black';
      }
      if (LPST < res[0].P19) {
        this.stylesSHOP19.color = 'red';
      } else {
        this.stylesSHOP19.color = 'black';
      }
      if (LPST < res[0].P20) {
        this.stylesSHOP20.color = 'red';
      } else {
        this.stylesSHOP20.color = 'black';
      }
      if (LPST < res[0].P21) {
        this.stylesSHOP21.color = 'red';
      } else {
        this.stylesSHOP21.color = 'black';
      }
      if (LPST < res[0].P22) {
        this.stylesSHOP22.color = 'red';
      } else {
        this.stylesSHOP22.color = 'black';
      }
      if (LPST < res[0].P23) {
        this.stylesSHOP23.color = 'red';
      } else {
        this.stylesSHOP23.color = 'black';
      }
      if (LPST < res[0].P24) {
        this.stylesSHOP24.color = 'red';
      } else {
        this.stylesSHOP24.color = 'black';
      }
      if (LPST < res[0].P25) {
        this.stylesSHOP25.color = 'red';
      } else {
        this.stylesSHOP25.color = 'black';
      }
      myObj.loading = false;
    });

  }


  // 撈出遞延訂單
  delayOrder(): void {
    this.isVisibleDelay = true;
    console.log("delayOrder")

    let myObj = this;
    this.getPPSService.getDelayOrder(this.radioValue, this.selectedVer, this.selectedMOVer).subscribe(res => {
      console.log("getDelayOrder success");
      this.DelayOrderData = res;

      this.totalListWeight = 0;
      this.DelayOrderData.forEach(item => {
        this.totalListWeight += item.S_WEIGHT;
      })
      myObj.loading = false;
    });

  }


  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }


  handleOk_chart(): void {
    console.log('Button ok clicked!');
    this.isVisibleChart = false;
  }
  handleCancel_chart(): void {
    console.log('Button cancel clicked!');
    this.isVisibleChart = false;
  }


  handleCancel_Delay(): void {
    console.log('Button ok clicked!');
    this.isVisibleDelay = false;
  }
  handleOk_Delay(): void {
    console.log('Button cancel clicked!');
    this.isVisibleDelay = false;
  }




  //Date Format
  dateFormat(_dateString) {
    if (_dateString == undefined || _dateString == '') {
      return "---";
    }
    let date = moment(_dateString, "YYYY-MM-DD").format("YYYY-MM-DD");
    return date;
  }

  //pipe
  toThousandNumber(param) {
    const paramStr = param.toFixed(1).toString();
    if (paramStr.length > 3) {
      return paramStr.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    if (param === 0) {
      return '　';
    }
    return paramStr;
  }


  // 計算幾日後
  addDays = (date: Date, days: number): Date => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };




  // ----------------

  //search by MO (ID_NO)
  searchByMO() {
    const filterFunc = item => {
      let MO = _.get(item, "ID_NO");

      if (this.searchByMOValue == "") {
        return true;
      } else {
        return _.startsWith(MO, this.searchByMOValue);
      }
    };
    const data = this.FCPData.filter(item => filterFunc(item));
    this.MODtlData = data;
  }

  //search by 站別
  searchBySHOP() {
    const filterFunc = item => {
      let SHOP = _.get(item, "SCH_SHOP_CODE");

      if (this.searchBySHOPValue == "") {
        return true;
      } else {
        return _.startsWith(SHOP, this.searchBySHOPValue);
      }
    };
    const data = this.FCPData.filter(item => filterFunc(item));
    this.MODtlData = data;
  }

  //search by 最佳機台
  searchByBestM() {
    const filterFunc = item => {
      let machine = _.get(item, "machine");

      if (this.searchByBestMValue == "") {
        return true;
      } else {
        return _.startsWith(machine, _.toUpper(this.searchByBestMValue));
      }
    };
    const data = this.FCPData.filter(item => filterFunc(item));
    this.MODtlData = data;
  }

  //search by 投料機台
  searchByPSTM() {
    console.log("searchByDIA");
    const filterFunc = item => {
      let PSTM = _.get(item, "PST_machine");

      console.log(_.toNumber(this.searchByPSTMValue));
      if (this.searchByPSTMValue == "") {
        return true;
      } else {
        return _.startsWith(PSTM, _.toUpper(this.searchByPSTMValue));
      }
    };
    console.log();
    const data = this.FCPData.filter(item => filterFunc(item));
    this.MODtlData = data;
  }



  qlist(value: string[]): void {
    console.log(value);
  }


}
