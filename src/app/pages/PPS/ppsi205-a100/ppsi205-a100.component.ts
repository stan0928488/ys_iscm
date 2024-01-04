import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ExcelService } from 'src/app/services/common/excel.service';
import { CookieService } from 'src/app/services/config/cookie.service';
import * as XLSX from 'xlsx';
registerLocaleData(zh);


@Component({
  selector: 'app-ppsi205-a100',
  templateUrl: './ppsi205-a100.component.html',
  styleUrls: ['./ppsi205-a100.component.css']
})
export class PPSI205A100Component implements AfterViewInit {

  panels = [
    {
      active: true,
      name: '資料結轉與EXCEL匯出',
      disabled: false,
    },
  ];
  loading = false; //loaging data flag
  fcpEditionList;
  ppsfcptb16_ms_cust_sortList;
  shopCodeOptions;
  checkboxStatus: boolean[];
  isRunFCP = false; // 如為true則不可異動
  file: File;
  PLANT_CODE;
  USERNAME;
  myContext: any;
  importdata = [];
  arrayBuffer: any;
  errorTXT = [];
  isERROR = false;
  isErrorMsg = false;
  importdata_new = [];
  forTbppsm100Date;
  LoadingPage = false;
  datetime = moment();
  tbppsm100List;
  titleArray5 = [
    '站別',
    '投產機台',
    '製程碼',
    '投入型態',
    '產出型態',
    '投入尺寸',
    '產出尺寸',
    '產品種類',
    '下站別',
    '鋼種群組',
    '自訂月份',
    '自訂排序',
  ];
  currentDate = new Date();

  constructor(
    private router: ActivatedRoute,
    private getPPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private route: ActivatedRoute
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie('USERNAME');
    this.PLANT_CODE = this.cookieService.getCookie('plantCode');
    this.myContext = {
      componentParent: this,
    };
  }

  ngAfterViewInit() {
    this.getTbppsm100List();
    this.forTbppsm100Date = moment(this.currentDate).format(
      'YYYY-MM-DD HH:mm:ss'
    );
  }

  clearFile() {
    var objFile = document.getElementsByTagName('input')[0];
    console.log(objFile.value + '已清除');
    objFile.value = '';
    console.log(this.file);
    console.log(JSON.stringify(this.file));
  }

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

  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe((res: number) => {
      console.log('getRunFCPCount success');
      console.log(res);
      if (res > 0) this.isRunFCP = true;
    });
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

  Upload(_type) {
    let value = document.getElementsByTagName('input')[0].value;
    let lastname = this.file.name.split('.').pop();
    console.log('incomingfile e2 : ' + this.file);
    if (value === '') {
      this.errorMSG('無檔案', '請先選擇欲上傳檔案。');
      this.clearFile();
    } else if (
      lastname !== 'xlsx' &&
      lastname !== 'xls' &&
      lastname !== 'csv'
    ) {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {
      this.Excelimport(_type);
    }
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

      this.checkTemplate(_type, worksheet, this.importdata);
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  checkTemplate(_type, worksheet, importdata) {
    if (_type === '5') {
      console.log('incomingfile e5 : ' + _type);
      if (
        worksheet.A1 === undefined ||
        worksheet.B1 === undefined ||
        worksheet.C1 === undefined ||
        worksheet.D1 === undefined ||
        worksheet.E1 === undefined ||
        worksheet.F1 === undefined ||
        worksheet.G1 === undefined ||
        worksheet.H1 === undefined ||
        worksheet.I1 === undefined ||
        worksheet.J1 === undefined ||
        worksheet.K1 === undefined ||
        worksheet.L1 === undefined
      ) {
        this.errorMSG('檔案樣板錯誤', '請先資料後，再透過該檔案調整上傳。');
        this.clearFile();
        return;
      } else if (
        worksheet.A1.v !== '站別' ||
        worksheet.B1.v !== '投產機台' ||
        worksheet.C1.v !== '製程碼' ||
        worksheet.D1.v !== '投入型態' ||
        worksheet.E1.v !== '產出型態' ||
        worksheet.F1.v !== '投入尺寸' ||
        worksheet.G1.v !== '產出尺寸' ||
        worksheet.H1.v !== '產品種類' ||
        worksheet.I1.v !== '下站別' ||
        worksheet.J1.v !== '鋼種群組' ||
        worksheet.K1.v !== '自訂月份' ||
        worksheet.L1.v !== '自訂排序'
      ) {
        this.errorMSG(
          '檔案樣板欄位表頭錯誤',
          '請先下載資料後，再透過該檔案調整上傳。'
        );
        this.clearFile();
        return;
      } else {
        this.importExcel5('5', importdata);
      }
    }
  }

  importExcel5(_type, _data) {
    console.log('incomingfile e6 : ' + _type);
    for (let i = 0; i < _data.length; i++) {
      let schShopCode = _data[i].站別;
      let pstMachine = _data[i].投產機台;
      let processCode = _data[i].製程碼;
      let inputType = _data[i].投入型態;
      let outputShape = _data[i].產出型態;
      let inputDia = _data[i].投入尺寸;
      let outDia = _data[i].產出尺寸;
      let kindType = _data[i].產品種類;
      let nextSchShopCode = _data[i].下站別;
      let gradeGroup = _data[i].鋼種群組;
      let newEpstYymm = _data[i].自訂月份;
      let campaignSort = _data[i].自訂排序;

      if (
        schShopCode === undefined ||
        pstMachine === undefined ||
        processCode === undefined ||
        inputType === undefined ||
        outputShape === undefined ||
        inputDia === undefined ||
        outDia === undefined ||
        kindType === undefined ||
        nextSchShopCode === undefined ||
        gradeGroup === undefined ||
        newEpstYymm === undefined ||
        campaignSort === undefined
      ) {
        let col = i + 2;
        this.errorTXT.push(`第 ` + col + `列，有欄位為空值`);
        this.isERROR = true;
      }
    }

    if (this.isERROR) {
      // 匯入錯誤失敗訊息提醒
      this.clearFile();
      this.isErrorMsg = true;
      this.importdata_new = [];
      this.errorMSG('匯入錯誤', this.errorTXT);
    } else {
      for (let i = 0; i < _data.length; i++) {
        let schShopCode = _data[i].站別.toString();
        let pstMachine = _data[i].投產機台.toString();
        let processCode = _data[i].製程碼.toString();
        let inputType = _data[i].投入型態.toString();
        let outputShape = _data[i].產出型態.toString();
        let inputDia = _data[i].投入尺寸.toString();
        let outDia = _data[i].產出尺寸.toString();
        let kindType = _data[i].產品種類.toString();
        let nextSchShopCode = _data[i].下站別.toString();
        let gradeGroup = _data[i].鋼種群組.toString();
        let newEpstYymm = _data[i].自訂月份.toString();
        let campaignSort = _data[i].自訂排序.toString();
        let dateCreate = this.forTbppsm100Date;
        let userCreate = this.USERNAME;

        this.importdata_new.push({
          schShopCode: schShopCode,
          pstMachine: pstMachine,
          processCode: processCode,
          inputType: inputType,
          outputShape: outputShape,
          inputDia: inputDia,
          outDia: outDia,
          kindType: kindType,
          nextSchShopCode: nextSchShopCode,
          gradeGroup: gradeGroup,
          newEpstYymm: newEpstYymm,
          campaignSort: campaignSort,
          dateCreate: dateCreate,
          userCreate: userCreate,
        });
      }

      return new Promise((resolve, reject) => {
        this.LoadingPage = true;
        let myObj = this;
        let obj = {};
        _.extend(obj, {
          NOWTABS: _type,
          EXCELDATA: this.importdata_new,
          PLANT_CODE: this.PLANT_CODE,
          USERCODE: this.USERNAME,
          DATETIME: this.datetime.format('YYYY-MM-DD HH:mm:ss'),
        });
        myObj.getPPSService.importI205Excel(obj).subscribe(
          (res) => {
            if (res[0].MSG === 'Y') {
              this.sucessMSG('EXCCEL上傳成功', '');
              this.getTbppsm100List();
              this.clearFile();
            } else {
              this.errorMSG('匯入錯誤', res[0].MSG);
            }
          },
          (err) => {
            reject('upload fail');
            this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
          }
        );
        this.importdata = [];
        this.importdata_new = [];
        this.errorTXT = [];
        this.loading = false;
        this.LoadingPage = false;
      });
    }
  }

  getTbppsm100List() {
    this.loading = true;
    let myObj = this;
    let FCP_EDITION = 'F20230705153099';
    this.getPPSService.getTbppsm100List(FCP_EDITION).subscribe((res) => {
      console.log('getppsfcptb16_ms_cust_sortList success');
      this.tbppsm100List = res;
      console.log(this.tbppsm100List);

      myObj.loading = false;
    });
  }

  convertToExcel(_type) {
    console.log('convertToExcel');
    let data;
    let fileName;
    let titleArray;
    if (_type === '5') {
      if (this.tbppsm100List.length > 0) {
        data = this.formatDataForExcel(_type, this.tbppsm100List);
        fileName = `公版排程維護`;
        titleArray = this.titleArray5;
      } else {
        this.errorMSG('匯出失敗', '公版排程維護目前無資料');
        return;
      }
    }
    this.excelService.exportAsExcelFile(data, fileName, titleArray);
  }

  formatDataForExcel(_type, _displayData) {
    console.log('_displayData');
    let excelData = [];
    if (_type === '5') {
      for (let item of _displayData) {
        let obj = {};
        _.extend(obj, {
          // ORDER_ID: _.get(item, "ORDER_ID"),
          SCH_SHOP_CODE: _.get(item, 'schShopCode'),
          PST_MACHINE: _.get(item, 'pstMachine'),
          PROCESS_CODE: _.get(item, 'processCode'),
          INPUT_TYPE: _.get(item, 'inputType'),
          OUTPUT_SHAPE: _.get(item, 'outputShape'),
          INPUT_DIA: _.get(item, 'inputDia'),
          OUT_DIA: _.get(item, 'outDia'),
          KIND_TYPE: _.get(item, 'kindType'),
          NEXT_SCH_SHOP_CODE: _.get(item, 'nextSchShopCode'),
          GRADE_GROUP: _.get(item, 'gradeGroup'),
          NEW_EPST_YYMM: _.get(item, 'newEpstYymm'),
          CAMPAIGN_SORT: _.get(item, 'campaignSort'),
        });
        excelData.push(obj);
      }
    }
    console.log(excelData);
    return excelData;
  }

}

interface data {}
