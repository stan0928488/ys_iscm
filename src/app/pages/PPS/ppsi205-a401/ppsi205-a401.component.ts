import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
  ValueFormatterParams,
  ValueParserParams
} from 'ag-grid-community';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ExcelService } from 'src/app/services/common/excel.service';
import { CookieService } from 'src/app/services/config/cookie.service';
import * as XLSX from 'xlsx';
import { BtnCellRendererUpdate } from '../../RENDERER/BtnCellRendererUpdate.component';
import { DatePickerCellEditor } from '../../RENDERER/DatePickerCellEditor.component';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
registerLocaleData(zh);

@Component({
  selector: 'app-ppsi205-a401',
  templateUrl: './ppsi205-a401.component.html',
  styleUrls: ['./ppsi205-a401.component.css']
})
export class PPSI205A401Component implements AfterViewInit {

  frameworkComponents;
  isEditing = false;
  myContext: any;
  tbppsm102ListAll;
  isSpinning = false;
  isErrorMsg = false;
  isERROR = false;
  errorTXT = [];
  file: File;
  isRunFCP = false; // 如為true則不可異動
  LoadingPage = false;
  tbppsm102List;
  rowData: data[] = [];
  loading = false; //loaging data flag
  PLANT_CODE;
  USERNAME;
  datetime = moment();
  importdata_new = [];
  importdata = [];
  arrayBuffer: any;
  gridApi: GridApi;
  oldlist = {};
  newlist;

  titleArray4 = [
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

  gridOptions = {
    defaultColDef: {
      editable: true,
      sortable: false,
      resizable: true,
      filter: true,
    },
    api: null,
  };

  ngAfterViewInit() {
    this.getTbppsm102List();
    this.getTbppsm102ListAll();
  }

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: '優先順序',
      field: 'ORDER_ID',
      filter: true,
      width: 120,
      editable: false,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '站別',
      field: 'SCH_SHOP_CODE',
      filter: true,
      width: 100,
      editable: false,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '機台',
      field: 'EQUIP_CODE',
      filter: true,
      width: 100,
      editable: false,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '下一站站別',
      field: 'NEXT_SHOP_CODE',
      filter: true,
      width: 120,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '天數',
      field: 'DAYS',
      filter: true,
      editable: true,
      width: 100,
      headerComponent: AGCustomHeaderComponent,
      valueParser: (params: ValueParserParams): number => {
        return Number.isNaN(Number(params.newValue))
          ? params.oldValue
          : Number(params.newValue);
      },
    },
    {
      headerName: 'max(EPST/ASAP)',
      field: 'MAX_DATE',
      filter: true,
      width: 170,
      cellEditor: DatePickerCellEditor,
      headerComponent: AGCustomHeaderComponent,
      cellRenderer: (data) => {
        if(data.value){
          return moment(data.value).format('YYYY-MM')
        }
      }
    },
    {
      headerName: '生產開始日',
      field: 'STARTDATE',
      filter: true,
      width: 130,
      cellEditor: DatePickerCellEditor,
      headerComponent: AGCustomHeaderComponent,
      cellRenderer: (data) => {
        if(data.value){
          return moment(data.value).format('YYYY-MM-DD')
        }
      }
    },
    {
      headerName: '生產結束日',
      field: 'ENDDATE',
      filter: true,
      editable: false,
      width: 130,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: 'TC頻率升降冪',
      field: 'TC_FREQUENCE_LIFT',
      filter: true,
      width: 140,
      cellEditor: 'agSelectCellEditor',
      headerComponent: AGCustomHeaderComponent,
      cellEditorParams: {
        values: ['ASC', 'DESC'],
      },
      valueFormatter: (params: ValueFormatterParams): string => {
        return params.value === 'ASC' ? '升冪' : '降冪';
      },
    },
    {
      headerName: 'COMPAIGN_ID',
      field: 'COMPAIGN_ID',
      filter: true,
      editable: false,
      width: 150,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '轉入COMPAIGN表時間',
      field: 'EXPORTDATETIME',
      filter: true,
      editable: false,
      width: 220,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: 'Action',
      editable: false,
      width: 170,
      cellRenderer: BtnCellRendererUpdate,
      cellRendererParams: [
        {
          onClick: this.editOnClick.bind(this)
        },
        {
          onClick: this.updateOnClick.bind(this)
        },
        {
          onClick: this.calcelOnClick.bind(this)
        }
      ]
    },
  ];

  constructor(
    private getPPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private router: Router,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie('USERNAME');
    this.PLANT_CODE = this.cookieService.getCookie('plantCode');
    this.myContext = {
      componentParent: this,
    };
    this.frameworkComponents = {
      buttonRenderer: BtnCellRendererUpdate,
    }
  }

  changeTab(tab): void {
    // this.isTabVisible = false;
    /*if (tab === 1) {
      window.location.href = '#/PlanSet/I205?selectedTabIndex=0';
      this.getTbppsm101List();
    } else if (tab === 2) {
      window.location.href = '#/PlanSet/I205?selectedTabIndex=0';
      this.getTbppsm102List();
    } else*/ if (tab === 3) {
      this.router.navigateByUrl('/main/PlanSet/I205');
    } else if (tab === 4) {
      this.router.navigateByUrl('/main/PlanSet/I205_a401');
    } else if (tab === 5) {
      this.router.navigateByUrl('/main/PlanSet/I205_a100');
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

  importCompaign(flag) {
    return new Promise((resolve, reject) => {
      this.LoadingPage = true;
      let myObj = this;
      let obj = {};
      let list = [];
      if (flag === 1) list = this.tbppsm102List;
      else if (flag === 2) list = this.rowData;
      _.extend(obj, {
        dataList: list,
        flag: flag,
        PLANT_CODE: this.PLANT_CODE,
        USERCODE: this.USERNAME,
        DATETIME: this.datetime.format('YYYY-MM-DD HH:mm:ss'),
      });
      myObj.getPPSService.importCompaign(obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.loading = false;
            this.LoadingPage = false;

            this.sucessMSG('上傳Compaign成功', '');
            this.getTbppsm102List();
          } else {
            this.errorMSG('上傳失敗', res[0].MSG);
            this.LoadingPage = false;
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('上傳失敗', '後台存檔錯誤，請聯繫系統工程師');
          this.importdata_new = [];
          this.LoadingPage = false;
        }
      );
    });
  }

  getTbppsm102List() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getTbppsm102List(this.PLANT_CODE).subscribe((res) => {
      console.log('getTbppsm102List success');
      this.tbppsm102List = res;
      console.log(this.tbppsm102List);
      myObj.loading = false;
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

  clearFile() {
    var objFile = document.getElementsByTagName('input')[0];
    console.log(objFile.value + '已清除');
    objFile.value = '';
    console.log(this.file);
    console.log(JSON.stringify(this.file));
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
    if (_type === '4') {
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
        worksheet.I1 === undefined
      ) {
        this.errorMSG('檔案樣板錯誤', '請先資料後，再透過該檔案調整上傳。');
        this.clearFile();
        return;
      } else if (
        worksheet.A1.v !== '站別' ||
        worksheet.B1.v !== '機台' ||
        worksheet.C1.v !== '下一站站別' ||
        worksheet.D1.v !== '天數' ||
        worksheet.E1.v !== '最大值的EPST或LPST' ||
        worksheet.F1.v !== '生產開始日' ||
        worksheet.G1.v !== '生產結束日' ||
        worksheet.H1.v !== 'TC頻率升降冪' ||
        worksheet.I1.v !== 'COMPAIGN_ID'
      ) {
        this.errorMSG(
          '檔案樣板欄位表頭錯誤',
          '請先下載資料後，再透過該檔案調整上傳。'
        );
        this.clearFile();
        return;
      } else {
        this.importExcel4('4', importdata);
      }
    }
  }

  importExcel4(_type, _data) {
    console.log('incomingfile e6 : ' + _type);
    for (let i = 0; i < _data.length; i++) {
      let shopCode = _data[i].站別;
      let equipCode = _data[i].機台;
      let nextShopCode = _data[i].下一站站別;
      let days = _data[i].天數;
      let maxDate = this.dateFormat(
        this.ExcelDateExchange(_data[i].最大值的EPST或LPST),
        2
      );
      let startDate = this.dateFormat(
        this.ExcelDateExchange(_data[i].生產開始日),
        2
      );
      let tcFrequenceLeft = _data[i].TC頻率升降冪;

      if (maxDate === 'Invalid date') {
        maxDate = this.dateFormat(_data[i].最大值的EPST或LPST, 2);
      }
      if (startDate === 'Invalid date') {
        startDate = this.dateFormat(_data[i].生產開始日, 2);
      }

      if (
        shopCode === undefined ||
        equipCode === undefined ||
        nextShopCode === undefined ||
        days === undefined ||
        maxDate === undefined ||
        startDate === undefined ||
        tcFrequenceLeft === undefined
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
        let shopCode = _data[i].站別.toString();
        let equipCode = _data[i].機台.toString();
        let nextShopCode = _data[i].下一站站別.toString();
        let days = _data[i].天數.toString();
        let maxDate = this.dateFormat(
          this.ExcelDateExchange(_data[i].最大值的EPST或LPST),
          2
        );
        let startDate = this.dateFormat(
          this.ExcelDateExchange(_data[i].生產開始日),
          2
        );
        let tcFrequenceLeft =
          _data[i].TC頻率升降冪.toString() === '升冪'
            ? 'ASC'
            : _data[i].TC頻率升降冪.toString() === '降冪'
            ? 'DESC'
            : null;

        if (maxDate === 'Invalid date') {
          maxDate = this.dateFormat(_data[i].最大值的EPST或LPST, 2);
        }
        if (startDate === 'Invalid date') {
          startDate = this.dateFormat(_data[i].生產開始日, 2);
        }
        this.importdata_new.push({
          shopCode: shopCode,
          equipCode: equipCode,
          nextShopCode: nextShopCode,
          days: days,
          maxDate: maxDate,
          startDate: startDate,
          tcFrequenceLeft: tcFrequenceLeft,
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
            console.log(res);
            if (res[0].MSG === 'Y') {
              this.loading = false;
              this.LoadingPage = false;

              this.sucessMSG('EXCEL上傳成功', '');
              this.getTbppsm102ListAll();
              this.clearFile();
            } else {
              this.errorMSG('匯入錯誤', res[0].MSG);
              this.clearFile();
              this.LoadingPage = false;
            }
          },
          (err) => {
            reject('upload fail');
            this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
            this.LoadingPage = false;
          }
        );
        this.importdata = [];
        this.importdata_new = [];
        this.errorTXT = [];
      });
    }
  }

  dateFormat(_dateString, _flag) {
    if (_dateString == undefined || _dateString == '') {
      return '';
    }
    if (_flag == '1') {
      let date = moment(_dateString, 'YYYY-MM-DD HH:mm:ss').format(
        'YYYY-MM-DD HH:mm:ss'
      );
      return date;
    } else if (_flag == '2') {
      let date = moment(_dateString, 'YYYY-MM-DD').format('YYYY-MM-DD');
      return date;
    } else if (_flag == '3') {
      let date = moment(_dateString, 'HH:mm:ss').format('HH:mm:ss');
      return date;
    } else if (_flag == '4') {
      let date = moment(_dateString, 'HH:mm').format('HH:mm');
      return date;
    } else if (_flag == '5') {
      let date = moment(_dateString, 'MM').format('MM');
      return date;
    } else if (_flag == '6') {
      let date = moment(_dateString, 'YYYY-MM').format('YYYY-MM');
      return date;
    }
  }

  ExcelDateExchange(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
    var total_seconds = Math.floor(86400 * fractional_day);
    var seconds = total_seconds % 60;
    total_seconds -= seconds;
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
  }

  getTbppsm102ListAll() {
    this.getPPSService.getTbppsm102ListAll(this.PLANT_CODE).subscribe((res) => {
      this.isSpinning = true;
      // console.log('getTbppsm102ListAll success');
      let result: any = res;
      if (result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
        this.rowData.forEach((item) => {
          item['isEditing'] = false;
        });
      } else {
        this.message.error('無資料');
        return;
      }
      this.isSpinning = false;
      console.log('getTbppsm102ListAll success');
      this.tbppsm102ListAll = this.rowData;
    });
  }

  convertToExcel(_type) {
    console.log('convertToExcel');
    let data;
    let fileName;
    let titleArray;
    if (_type === '4') {
      if (this.tbppsm102ListAll.length > 0) {
        data = this.formatDataForExcel(_type, this.tbppsm102ListAll);
        fileName = `Auto Campaign 主表`;
        titleArray = this.titleArray4;
      } else {
        this.errorMSG('匯出失敗', '401 Auto Campaign 目前無資料');
        return;
      }
    }
    this.excelService.exportAsExcelFile(data, fileName, titleArray);
  }

  formatDataForExcel(_type, _displayData) {
    console.log('_displayData');
    let excelData = [];
    if (_type === '4') {
      for (let item of _displayData) {
        let obj = {};
        _.extend(obj, {
          SCH_SHOP_CODE: _.get(item, 'SCH_SHOP_CODE'),
          EQUIP_CODE: _.get(item, 'EQUIP_CODE'),
          NEXT_SHOP_CODE: _.get(item, 'NEXT_SHOP_CODE').toString(),
          DAYS: _.get(item, 'DAYS'),
          MAX_DATE: moment(_.get(item, 'MAX_DATE')).format('YYYY-MM'),
          STARTDATE: _.get(item, 'STARTDATE'),
          ENDDATE: _.get(item, 'ENDDATE'),
          TC_FREQUENCE_LIFT:
            _.get(item, 'TC_FREQUENCE_LIFT') === 'ASC'
              ? '升冪'
              : _.get(item, 'TC_FREQUENCE_LIFT') === 'DESC'
              ? '降冪'
              : '',
          COMPAIGN_ID: _.get(item, 'COMPAIGN_ID'),
        });
        excelData.push(obj);
      }
    }
    console.log(excelData);
    return excelData;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  editOnClick(e) {
    e.params.api.setFocusedCell(e.params.node.rowIndex, "TC_FREQUENCE_LIFT");
    e.params.api.startEditingCell({
      rowIndex: e.params.node.rowIndex,
      colKey: "TC_FREQUENCE_LIFT"
    });
  }

  updateOnClick(e) {
    e.params.api.stopEditing();
    this.save401_dtlRow(e.index, e.rowData);
  }

  calcelOnClick(e) {
  }

  save401_dtlRow(i, data) {
    console.log('-------save_dtlRow------');
    // oldlist存放更新根據的條件(複合主鍵:IMPORTDATETIME+PLANT_CODE+ORDER_ID)
    this.oldlist = data;
    this.newlist = data;
    this.newlist.startDate = moment(this.newlist.startDate).format('YYYY-MM-DD')
    this.newlist.MAX_DATE = moment(this.newlist.MAX_DATE).format('YYYY-MM-DD')
    this.newlist.STARTDATE = moment(this.newlist.STARTDATE).format('YYYY-MM-DD')

    let importdatetime = this.newlist.IMPORTDATETIME;
    let plantCode = this.newlist.PLANT_CODE;
    let orderID = this.newlist.ORDER_ID;

    let nextShopCode = this.newlist.NEXT_SHOP_CODE;
    let maxDate = this.newlist.MAX_DATE;
    let days = this.newlist.DAYS;
    let startDate = this.newlist.STARTDATE;
    let tcFrequenceLeft = this.newlist.TC_FREQUENCE_LIFT;

    if (
      importdatetime === '' ||
      plantCode === '' ||
      orderID === '' ||
      nextShopCode === '' ||
      maxDate === '' ||
      days === '' ||
      startDate === '' ||
      tcFrequenceLeft === ''
    ) {
      this.errorMSG('錯誤', '有欄位尚未填寫完畢，請檢查');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定存檔',
        nzOnOk: () => {
          this.Save401OK(i);
        },
        nzOnCancel: () => {},
      });
    }
  }

  Save401OK(col) {
    console.log('oldlist --> ', this.oldlist);
    console.log('newlist --> ', this.newlist);

    this.LoadingPage = true;
    let myObj = this;
    return new Promise((resolve, reject) => {
      let obj = {};

      _.extend(obj, {
        OLDLIST: this.oldlist,
        NEWList: this.newlist,
        USERCODE: this.USERNAME,
        DATETIME: this.datetime.format('YYYY-MM-DD HH:mm:ss'),
      });
      myObj.getPPSService.upd401AutoCampaignData(obj).subscribe(
        (res) => {
          console.log(res);
          if (res[0].MSG === 'Y') {
            this.LoadingPage = true;
            this.oldlist = [];
            this.newlist = [];
            this.getTbppsm102ListAll();
            this.sucessMSG('修改存檔成功', '');
            // 將編輯模式關閉
            this.gridApi.getRowNode(col).data.isEditing = false;
          } else {
            this.errorMSG('修改存檔失敗', res[0].MSG);
            this.LoadingPage = false;
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
          this.oldlist = [];
          this.LoadingPage = false;
        }
      );
    });
  }

}

interface data {}
