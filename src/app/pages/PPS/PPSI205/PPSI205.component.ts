import { Component, AfterViewInit, NgZone, EventEmitter } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ExcelService } from 'src/app/services/common/excel.service';
import { registerLocaleData, DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  ColDef,
  ColGroupDef,
  ICellEditorComp,
  RowValueChangedEvent,
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
} from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import * as _ from 'lodash';
import zh from '@angular/common/locales/zh';
import { BtnCellRendererUpdate } from '../../RENDERER/BtnCellRendererUpdate.component';
import { DatePickerCellRendererComponent } from '../../RENDERER/datepicker-cell-renderer.component';
registerLocaleData(zh);

interface data {}

@Component({
  selector: 'app-PPSI205',
  templateUrl: './PPSI205.component.html',
  styleUrls: ['./PPSI205.component.scss'],
  providers: [NzMessageService, DatePipe],
})
export class PPSI205Component implements AfterViewInit {
  private gridApi!: GridApi;
  public editType: 'fullRow' = 'fullRow';
  tcFrequenceLeft = ['升冪', '降冪'];

  frameworkComponents: any;
  PLANT_CODE;
  USERNAME;
  loading = false; //loaging data flag
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  isErrorMsg = false;

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
  datetime = moment();
  arrayBuffer: any;
  file: File;
  importdata = [];
  importdata_new = [];
  isERROR = false;
  errorTXT = [];

  EditMode = [];
  oldlist = {};
  newlist;

  rowData: data[] = [];

  fileType: string = '.xls, .xlsx, .csv'; //檔案類型

  // tab 1
  tbppsm101List;
  // tab 4
  tbppsm102List;
  // tab 4 All
  tbppsm102ListAll;
  // tab 4 export excel
  tbppsm102ExportExcel;
  // tab 3
  tbppsm113List;

  tbppsm100List;

  ppsfcptb16_ms_cust_sortList;
  fcpEditionList;
  fcpEditionLoading = false;
  fcpEditionOption: any[] = [];
  selectedTabIndex;
  innerSelect;
  panels = [
    {
      active: true,
      name: '資料結轉與EXCEL匯出',
      disabled: false,
    },
  ];

  isSpinning = false;

  forTbppsm100Date;
  currentDate = new Date();

  public ColGroupDef: ColDef = {
    filter: true,
    editable: false,
    enableRowGroup: false,
    enablePivot: false,
    enableValue: false,
    sortable: false,
    resizable: true,
  };

  dateTimeFormatter(params) {
    return moment(params.value).format('YYYY-MM-DD HH:mm:ss');
  }

  dayDateFormatter(params) {
    return moment(params.value).format('YYYY-MM-DD');
  }

  yearMonthFormatter(params) {
    return moment(params.value).format('YYYY-MM');
  }

  stringFormatter(params) {
    params.tcFrequenceLeft === '升冪' ? 'ASC' : 'ASC';
    params.tcFrequenceLeft === '降冪' ? 'DESC' : 'DESC';
    return params.TC_FREQUENCE_LIFT;
  }

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: '優先順序',
      field: 'ORDER_ID',
      filter: true,
      width: 120,
      editable: false,
    },
    {
      headerName: '站別',
      field: 'SCH_SHOP_CODE',
      filter: true,
      width: 100,
      editable: false,
    },
    {
      headerName: '機台',
      field: 'EQUIP_CODE',
      filter: true,
      width: 100,
      editable: false,
    },
    {
      headerName: '下一站站別',
      field: 'NEXT_SHOP_CODE',
      filter: true,
      editable: true,
      width: 120,
    },
    {
      headerName: '天數',
      field: 'DAYS',
      filter: true,
      editable: true,
      width: 100,
    },
    {
      headerName: 'max(EPST/ASAP)',
      field: 'MAX_DATE',
      filter: true,
      width: 160,
      valueFormatter: this.yearMonthFormatter,
      cellRenderer: DatePickerCellRendererComponent,
      cellRendererParams: [
        {
          onClick: this.onDatePickerBtnClick1.bind(this),
        },
      ],
      editable: false,
      maxWidth: 150,
    },
    {
      headerName: '生產開始日',
      field: 'STARTDATE',
      filter: true,
      cellEditor: 'primeDatePickerCellEditorComponent',
      width: 130,
      valueFormatter: this.dayDateFormatter,
      cellRenderer: DatePickerCellRendererComponent,
      cellRendererParams: [
        {
          onClick: this.onDatePickerBtnClick2.bind(this),
        },
      ],
      editable: false,
      maxWidth: 150,
    },
    {
      headerName: '生產結束日',
      field: 'ENDDATE',
      filter: true,
      editable: false,
      width: 130,
    },
    {
      headerName: 'TC頻率升降冪',
      field: 'TC_FREQUENCE_LIFT',
      valueFormatter: this.stringFormatter,
      filter: true,
      width: 140,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.tcFrequenceLeft,
      },
    },
    {
      headerName: 'COMPAIGN_ID',
      field: 'COMPAIGN_ID',
      filter: true,
      editable: false,
      width: 120,
    },
    {
      headerName: '轉入COMPAIGN表時間',
      field: 'EXPORTDATETIME',
      filter: true,
      editable: false,
      width: 220,
      valueFormatter: this.dateTimeFormatter,
    },
    {
      headerName: 'Action',
      editable: false,
      width: 170,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: [
        {
          onclick: this.editOnClick.bind(this),
        },
        {
          onClick: this.updateOnClick.bind(this),
        },
        {
          onClick: this.calcelOnClick.bind(this),
        },
      ],
    },
  ];

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
    this.frameworkComponents = {
      buttonRenderer: BtnCellRendererUpdate,
    };
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedTabIndex = +params['selectedTabIndex'] || 0;
      this.innerSelect = +params['innerSelect'] || 0;
    });
  }
  ngAfterViewInit() {
    console.log('ngAfterViewChecked');
    this.getRunFCPCount();
    this.getTbppsm101List();
    this.forTbppsm100Date = moment(this.currentDate).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    this.getTbppsm102ListAll();
    // this.getTbppsm113List();
    this.getTbppsm100List();
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

  //tab1
  getTbppsm101List() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getTbppsm101List(this.PLANT_CODE).subscribe((res) => {
      console.log('getTbppsm101List success');
      this.tbppsm101List = res;
      console.log(this.tbppsm101List);

      myObj.loading = false;
    });
  }

  //tab2
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

  // tab4 All
  getTbppsm102ListAll() {
    this.getPPSService.getTbppsm102ListAll(this.PLANT_CODE).subscribe((res) => {
      this.isSpinning = true;
      console.log('getTbppsm102ListAll success');
      let result: any = res;
      if (result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
      } else {
        this.message.error('無資料');
        return;
      }
      this.isSpinning = false;
      console.log(this.tbppsm102ListAll);
    });
  }

  //tab3
  getTbppsm113List() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getTbppsm113List(this.PLANT_CODE).subscribe((res) => {
      console.log('getTbppsm113List success');
      this.tbppsm113List = res;
      console.log(this.tbppsm113List);

      myObj.loading = false;
    });
  }

  getppsfcptb16_ms_cust_sortList() {
    this.loading = true;
    let myObj = this;
    this.getPPSService
      .getPpsfcptb16MsCustSortList(this.fcpEditionList)
      .subscribe((res) => {
        console.log('getppsfcptb16_ms_cust_sortList success');
        this.ppsfcptb16_ms_cust_sortList = res;
        console.log(this.fcpEditionList);

        myObj.loading = false;
      });
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

  getFcpList() {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getFcpList(this.PLANT_CODE).subscribe((res) => {
      console.log('getFcpList success');
      this.fcpEditionOption = res;
      console.log(this.fcpEditionOption);
      console.log(res.fcpEdition);

      myObj.loading = false;
    });
  }

  changeTab(tab): void {
    console.log(tab);
    if (tab === 1) {
      window.location.href = '#/singleData/I124?selectedTabIndex=0';
      this.getTbppsm101List();
    } else if (tab === 2) {
      window.location.href = '#/singleData/I124?selectedTabIndex=1';
      this.getTbppsm102List();
    } else if (tab === 3) {
      window.location.href = '#/singleData/I124?selectedTabIndex=2';
      this.getTbppsm113List();
    } else if (tab === 4) {
      this.getTbppsm102ListAll();
      window.location.href = '#/singleData/I124?selectedTabIndex=3';
    } else if (tab === 5) {
      this.getTbppsm100List();
      window.location.href =
        '#/singleData/I124?selectedTabIndex=4&innerSelect=0';
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
      if (this.tbppsm102ExportExcel.length > 0) {
        data = this.formatDataForExcel(_type, this.tbppsm102ExportExcel);
        fileName = `Auto Campaign 主表`;
        titleArray = this.titleArray4;
      } else {
        this.errorMSG('匯出失敗', '401 Auto Campaign 目前無資料');
        return;
      }
    } else if (_type === '5') {
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
    if (_type === '1') {
      for (let item of _displayData) {
        let obj = {};
        _.extend(obj, {
          // CUSTOM_SORT: _.get(item, "CUSTOM_SORT"),
          USE_MONTH: _.get(item, 'USE_MONTH'),
          SCH_SHOP_CODE: _.get(item, 'SCH_SHOP_CODE'),
          EQUIP_CODE: _.get(item, 'EQUIP_CODE'),
          UTPUT_SHAPE: _.get(item, 'OUTPUT_SHAPE'),
          OUT_DIA: _.get(item, 'OUT_DIA'),
          SFC_DIA: _.get(item, 'SFC_DIA'),
          FINAL_PROCESS_CODE: _.get(item, 'FINAL_PROCESS_CODE'),
          GRADE_GROUP: _.get(item, 'GRADE_GROUP'),
          PROCESS_CODE: _.get(item, 'PROCESS_CODE'),
        });
        excelData.push(obj);
      }
    } else if (_type === '2') {
      for (let item of _displayData) {
        let obj = {};
        _.extend(obj, {
          // ORDER_ID: _.get(item, "ORDER_ID"),
          SCH_SHOP_CODE: _.get(item, 'SCH_SHOP_CODE'),
          EQUIP_CODE: _.get(item, 'EQUIP_CODE'),
          NEXT_SHOP_CODE: _.get(item, 'NEXT_SHOP_CODE').toString(),
          DAYS: _.get(item, 'DAYS'),
          MAX_DATE: _.get(item, 'MAX_DATE'),
          STARTDATE: _.get(item, 'STARTDATE'),
          ENDDATE: _.get(item, 'ENDDATE'),
          TC_FREQUENCE_LIFT:
            _.get(item, 'TC_FREQUENCE_LIFT') === 'ASC'
              ? '升冪'
              : _.get(item, 'TC_FREQUENCE_LIFT') === 'DESC'
              ? '降冪'
              : '',
          COMPAIGN_ID: _.get(item, 'COMPAIGN_ID'), //,
          // EXPORTDATETIME: _.get(item, "EXPORTDATETIME")
        });
        excelData.push(obj);
      }
    } else if (_type === '3') {
      for (let item of _displayData) {
        let obj = {};
        _.extend(obj, {
          // ORDER_ID: _.get(item, "ORDER_ID"),
          publicMonth: _.get(item, 'publicMonth'),
          productType: _.get(item, 'productType'),
          dia: _.get(item, 'dia').toString(),
          cycleNo: _.get(item, 'cycleNo'),
          startDate: _.get(item, 'startDate'),
          endDate: _.get(item, 'endDate'),
        });
        excelData.push(obj);
      }
    } else if (_type === '4') {
      for (let item of _displayData) {
        let obj = {};
        _.extend(obj, {
          SCH_SHOP_CODE: _.get(item, 'SCH_SHOP_CODE'),
          EQUIP_CODE: _.get(item, 'EQUIP_CODE'),
          NEXT_SHOP_CODE: _.get(item, 'NEXT_SHOP_CODE').toString(),
          DAYS: _.get(item, 'DAYS'),
          MAX_DATE: _.get(item, 'MAX_DATE'),
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
    } else if (_type === '5') {
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

  // EXCEL 匯入樣版檢查
  checkTemplate(_type, worksheet, importdata) {
    if (_type === '1') {
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
        this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
        this.clearFile();
        return;
      } else if (
        worksheet.A1.v !== '月份' ||
        worksheet.B1.v !== '站別' ||
        worksheet.C1.v !== '機台' ||
        worksheet.D1.v !== '產出型態' ||
        worksheet.E1.v !== '產出尺寸' ||
        worksheet.F1.v !== '現況尺寸' ||
        worksheet.G1.v !== '最終製程' ||
        worksheet.H1.v !== '鋼種群組' ||
        worksheet.I1.v !== '製程碼'
      ) {
        this.errorMSG(
          '檔案樣板欄位表頭錯誤',
          '請先下載資料後，再透過該檔案調整上傳。'
        );
        this.clearFile();
        return;
      } else {
        this.importExcel1('1', importdata);
      }
    } else if (_type === '2') {
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
        this.importExcel2('2', importdata);
      }
    } else if (_type === '3') {
      console.log('incomingfile e5 : ' + _type);
      if (
        worksheet.A1 === undefined ||
        worksheet.B1 === undefined ||
        worksheet.C1 === undefined ||
        worksheet.D1 === undefined ||
        worksheet.E1 === undefined ||
        worksheet.F1 === undefined
      ) {
        this.errorMSG('檔案樣板錯誤', '請先資料後，再透過該檔案調整上傳。');
        this.clearFile();
        return;
      } else if (
        worksheet.A1.v !== '公版月份' ||
        worksheet.B1.v !== '產品' ||
        worksheet.C1.v !== '軋延尺寸' ||
        worksheet.D1.v !== 'CYCLE' ||
        worksheet.E1.v !== '日期~起' ||
        worksheet.F1.v !== '日期~迄'
      ) {
        this.errorMSG(
          '檔案樣板欄位表頭錯誤',
          '請先下載資料後，再透過該檔案調整上傳。'
        );
        this.clearFile();
        return;
      } else {
        this.importExcel3('3', importdata);
      }
    } else if (_type === '4') {
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
    } else if (_type === '5') {
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
        worksheet.L1 === undefined ||
        worksheet.M1 === undefined ||
        worksheet.N1 === undefined
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

  // EXCEL 資料上傳 (tbppsm101List)
  importExcel1(_type, _data) {
    for (let i = 0; i < _data.length; i++) {
      let useMonth = _data[i].月份;
      let shopCode = _data[i].站別;
      let equipCode = _data[i].機台;
      let outputShap = _data[i].產出型態;
      let outDia = _data[i].產出尺寸;
      let sfcDia = _data[i].現況尺寸;
      let finalProcessCode = _data[i].最終製程;
      let gradeGroup = _data[i].鋼種群組;
      let processCode = _data[i].製程碼;

      if (
        useMonth === undefined ||
        shopCode === undefined ||
        equipCode === undefined ||
        outputShap === undefined ||
        outDia === undefined ||
        sfcDia === undefined ||
        finalProcessCode === undefined ||
        gradeGroup === undefined ||
        processCode === undefined
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
        let useMonth = _data[i].月份.toString();
        let shopCode = _data[i].站別.toString();
        let equipCode = _data[i].機台.toString();
        let outputShap = _data[i].產出型態.toString();
        let outDia = _data[i].產出尺寸.toString();
        let sfcDia = _data[i].現況尺寸.toString();
        let finalProcessCode = _data[i].最終製程.toString();
        let gradeGroup = _data[i].鋼種群組.toString();
        let processCode = _data[i].製程碼.toString();

        this.importdata_new.push({
          useMonth: useMonth,
          shopCode: shopCode,
          equipCode: equipCode,
          outputShap: outputShap,
          outDia: outDia,
          sfcDia: sfcDia,
          finalProcessCode: finalProcessCode,
          gradeGroup: gradeGroup,
          processCode: processCode,
        });
      }

      console.log('this.importdata_new');
      console.log(this.importdata_new);

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
              this.importdata = [];
              this.importdata_new = [];
              this.errorTXT = [];
              this.loading = false;
              this.LoadingPage = false;

              this.sucessMSG('EXCCEL上傳成功', '');
              this.getTbppsm102List();
              this.clearFile();
            } else {
              this.errorMSG('匯入錯誤', res[0].MSG);
              this.clearFile();
              this.importdata_new = [];
              this.LoadingPage = false;
            }
          },
          (err) => {
            reject('upload fail');
            this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
            this.importdata_new = [];
            this.LoadingPage = false;
          }
        );
      });
    }
  }

  // EXCEL 資料上傳 (tbppsm102List)
  importExcel2(_type, _data) {
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
            if (res[0].MSG === 'Y') {
              this.loading = false;
              this.LoadingPage = false;

              this.sucessMSG('EXCCEL上傳成功', '');
              this.getTbppsm102List();
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

  // EXCEL 資料上傳 (tbppsm102List)
  importExcel3(_type, _data) {
    console.log('incomingfile e6 : ' + _type);
    for (let i = 0; i < _data.length; i++) {
      let publicMonth = this.dateFormat(
        this.ExcelDateExchange(_data[i].公版月份),
        6
      );
      let productType = _data[i].產品;
      let dia = _data[i].軋延尺寸;
      let cycleNo = _data[i].CYCLE;
      let startDate = this.dateFormat(
        this.ExcelDateExchange(_data[i]['日期~起']),
        2
      );

      if (startDate === 'Invalid date') {
        startDate = this.dateFormat(_data[i]['日期~起'], 2);
      }

      if (
        publicMonth === undefined ||
        productType === undefined ||
        dia === undefined ||
        cycleNo === undefined ||
        startDate === undefined
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
        let publicMonth = this.dateFormat(
          this.ExcelDateExchange(_data[i].公版月份),
          6
        );
        let productType = _data[i].產品;
        let dia = _data[i].軋延尺寸.toString();
        let cycleNo = _data[i].CYCLE.toString();
        let startDate = this.dateFormat(
          this.ExcelDateExchange(_data[i]['日期~起']),
          2
        );
        console.log(publicMonth);
        if (publicMonth === 'Invalid date') {
          publicMonth = this.dateFormat(_data[i]['公版月份'], 6);
        }
        if (startDate === 'Invalid date') {
          startDate = this.dateFormat(_data[i]['日期~起'], 2);
        }
        if (_data[i]['日期~迄'] != undefined) {
          var endDate = this.dateFormat(
            this.ExcelDateExchange(_data[i]['日期~迄']),
            2
          );

          if (endDate === 'Invalid date') {
            endDate = this.dateFormat(_data[i]['日期~起'], 2);
          }

          this.importdata_new.push({
            publicMonth: publicMonth,
            productType: productType,
            dia: dia,
            cycleNo: cycleNo,
            startDate: startDate,
            endDate: endDate,
          });
        } else {
          this.importdata_new.push({
            publicMonth: publicMonth,
            productType: productType,
            dia: dia,
            cycleNo: cycleNo,
            startDate: startDate,
          });
        }
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
              this.loading = false;
              this.LoadingPage = false;

              this.sucessMSG('EXCCEL上傳成功', '');
              this.getTbppsm113List();
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

  // I205 Auto Campaign 匯入
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
              this.loading = false;
              this.LoadingPage = false;

              this.sucessMSG('EXCCEL上傳成功', '');
              this.getTbppsm100List();
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
  // 清空資料
  clearFile() {
    var objFile = document.getElementsByTagName('input')[0];
    console.log(objFile.value + '已清除');
    objFile.value = '';
    console.log(this.file);
    console.log(JSON.stringify(this.file));
  }

  // 上傳到compaign 資料到 ppsinptb16
  importCompaign() {
    return new Promise((resolve, reject) => {
      this.LoadingPage = true;
      let myObj = this;
      let obj = {};
      _.extend(obj, {
        dataList: this.tbppsm102List,
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

  //Date Format
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

  // EXCEL 匯入日期格式處理
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

  // 月曆切換
  onChange(_type, idx, result: Date): void {
    if (_type === '1') {
      this.tbppsm102List[idx].MAX_DATE = this.dateFormat(result, 6);
    } else if (_type === '2') {
      this.tbppsm102List[idx].STARTDATE = this.dateFormat(result, 2);
    } else if (_type === '3-0') {
      this.tbppsm113List[idx].publicMonth = this.dateFormat(result, 2);
      console.log(this.tbppsm113List[idx]);
    } else if (_type === '3-1') {
      this.tbppsm113List[idx].startDate = this.dateFormat(result, 2);
      console.log(this.tbppsm113List[idx]);
    } else if (_type === '3-2') {
      console.log(result);
      this.tbppsm113List[idx].endDate = this.dateFormat(result, 2);
      console.log(this.tbppsm113List[idx]);
    }
  }

  // 修改模式
  upd_dtlRow(i, data) {
    if (data.TC_FREQUENCE_LIFT === undefined) data.TC_FREQUENCE_LIFT = 'ASC';

    this.oldlist = { ...data };
    let colsed = false;
    if (this.EditMode.length > 0) {
      for (let i = 0; i < this.EditMode.length; i++) {
        if (this.EditMode[i]) {
          colsed = true;
          break;
        }
      }
    }

    if (colsed) {
      this.errorMSG('錯誤', '尚有資料未完成修改，請先存檔或取消');
      return;
    } else {
      this.EditMode[i] = true;
    }
  }

  // 修改存檔
  save_dtlRow(i, data) {
    console.log('-------save_dtlRow------');
    this.newlist = data;

    // let importdatetime = this.newlist.IMPORTDATETIME;
    // let plantCode = this.newlist.PLANT_CODE;
    // let orderID = this.newlist.ORDER_ID;
    // let schShopCode = this.newlist.SCH_SHOP_CODE;
    // let equipCode = this.newlist.EQUIP_CODE;
    let nextShopCode = this.newlist.NEXT_SHOP_CODE;
    let maxDate = this.newlist.MAX_DATE;
    let days = this.newlist.DAYS;
    let startDate = this.newlist.STARTDATE;
    let tcFrequenceLeft = this.newlist.TC_FREQUENCE_LIFT;

    if (
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
          this.SaveOK(i), (this.EditMode[i] = true);
        },
        nzOnCancel: () => (this.EditMode[i] = true),
      });
    }
  }

  // 修改401存檔
  save401_dtlRow(i, data) {
    console.log('-------save_dtlRow------');
    this.newlist = data;

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
          this.Save401OK(i), (this.EditMode[i] = true);
        },
        nzOnCancel: () => (this.EditMode[i] = true),
      });
    }
  }

  // 確定修改 Auto Campaign 存檔
  Save401OK(col) {
    console.log('oldlist :');
    console.log(this.oldlist);

    console.log('newlist :');
    console.log(this.newlist);

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
            this.EditMode[col] = false;
            this.oldlist = [];
            this.newlist = [];
            this.getTbppsm102List();
            this.sucessMSG('修改存檔成功', '');
          } else {
            this.errorMSG('修改存檔失敗', res[0].MSG);
            this.LoadingPage = false;
            this.EditMode[col] = true;
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

  // 確定修改存檔
  SaveOK(col) {
    console.log('oldlist :');
    console.log(this.oldlist);

    console.log('newlist :');
    console.log(this.newlist);

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
      myObj.getPPSService.upd102ListData(obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.LoadingPage = true;
            this.EditMode[col] = false;
            this.oldlist = [];
            this.newlist = [];
            this.getTbppsm102List();
            this.sucessMSG('修改存檔成功', '');
          } else {
            this.errorMSG('修改存檔失敗', res[0].MSG);
            this.LoadingPage = false;
            this.EditMode[col] = true;
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

  // 取消修改
  cancel_dtlRow(i, data) {
    console.log();
    this.EditMode[i] = false;

    this.tbppsm102List[i].NEXT_SHOP_CODE = this.oldlist['NEXT_SHOP_CODE'];
    this.tbppsm102List[i].DAYS = this.oldlist['DAYS'];
    this.tbppsm102List[i].MAX_DATE = this.dateFormat(
      this.oldlist['MAX_DATE'],
      6
    );
    this.tbppsm102List[i].STARTDATE = this.dateFormat(
      this.oldlist['STARTDATE'],
      2
    );
    this.tbppsm102List[i].TC_FREQUENCE_LIFT = this.oldlist['TC_FREQUENCE_LIFT'];
  }

  cancel401_dtlRow(i, data) {
    console.log();
    this.EditMode[i] = false;

    this.tbppsm102ListAll[i].NEXT_SHOP_CODE = this.oldlist['NEXT_SHOP_CODE'];
    this.tbppsm102ListAll[i].DAYS = this.oldlist['DAYS'];
    this.tbppsm102ListAll[i].MAX_DATE = this.dateFormat(
      this.oldlist['MAX_DATE'],
      6
    );
    this.tbppsm102ListAll[i].STARTDATE = this.dateFormat(
      this.oldlist['STARTDATE'],
      2
    );
    this.tbppsm102ListAll[i].TC_FREQUENCE_LIFT =
      this.oldlist['TC_FREQUENCE_LIFT'];

    // this.data.api.stopEditing(true);
  }

  // 修改存檔
  save113_dtlRow(i, data) {
    console.log('-------save113_dtlRow------');

    this.newlist = data;
    console.log(this.oldlist);
    let publicMonth = this.dateFormat(this.newlist.publicMonth, 6);
    let productType = this.newlist.productType;
    let dia = this.newlist.dia;
    let cycleNo = this.newlist.cycleNo;
    let startDate = this.dateFormat(this.newlist.startDate, 2);
    let endDate = this.dateFormat(this.newlist.endDate, 2);

    console.log(this.newlist);
    if (
      publicMonth === '' ||
      productType === '' ||
      dia === '' ||
      cycleNo === '' ||
      startDate === '' ||
      endDate === '' ||
      endDate === undefined
    ) {
      this.errorMSG('錯誤', '有欄位尚未填寫完畢，請檢查');
      //this.cancel113_dtlRow(i,data);
      return;
    } else {
      this.newlist.publicMonth = publicMonth;
      this.newlist.startDate = startDate;
      this.newlist.endDate = endDate;
      this.newlist.dia = this.newlist.dia.toString();
      this.newlist.cycleNo = this.newlist.cycleNo.toString();

      this.Modal.confirm({
        nzTitle: '是否確定存檔',
        nzOnOk: () => {
          this.Save113OK(i), (this.EditMode[i] = true);
        },
        nzOnCancel: () => (this.EditMode[i] = true),
      });
    }
  }

  // 確定修改存檔
  Save113OK(col) {
    console.log('oldlist :');
    console.log(this.oldlist);

    console.log('newlist :');
    console.log(this.newlist);

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
      myObj.getPPSService.upd113ListData(obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.LoadingPage = false;
            this.EditMode[col] = false;
            this.oldlist = [];
            this.newlist = [];
            this.getTbppsm102List();
            this.sucessMSG('修改存檔成功', '');
            this.getTbppsm113List();
          } else {
            this.errorMSG('修改存檔失敗', res[0].MSG);
            this.LoadingPage = false;
            this.EditMode[col] = true;
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

  // 取消修改
  cancel113_dtlRow(i, data) {
    console.log();
    this.EditMode[i] = false;

    this.tbppsm113List[i].publicMonth = this.dateFormat(
      this.oldlist['publicMonth'],
      6
    );
    this.tbppsm113List[i].productType = this.oldlist['productType'];
    this.tbppsm113List[i].dia = this.oldlist['dia'];
    this.tbppsm113List[i].cycleNo = this.oldlist['cycleNo'];
    this.tbppsm113List[i].startDate = this.dateFormat(
      this.oldlist['startDate'],
      2
    );
    this.tbppsm113List[i].endDate = this.dateFormat(this.oldlist['endDate'], 2);
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

  //關閉錯誤訊息
  ERR_Cancel() {
    this.errorTXT = [];
    this.isErrorMsg = false;
  }

  // tab4 export excel
  exportTbppsm102ListExcel() {
    this.loading = true;
    let myObj = this;
    let exportTableName = 'Auto Campaign 主表';
    this.getPPSService
      .exportTbppsm102ListExcel(this.PLANT_CODE)
      .subscribe((res) => {
        console.log('exportTbppsm102ListExcel success');
        this.tbppsm102ExportExcel = res;
        console.log(this.tbppsm102ExportExcel);
        this.excelService.exportAsExcelFile(
          this.tbppsm102ExportExcel,
          exportTableName,
          this.titleArray4
        );
        myObj.loading = false;
      });
  }

  editOnClick(e) {}

  updateOnClick(e) {
    this.upd_dtlRow(e.index, e.rowData);
    this.save401_dtlRow(e.index, e.rowData);
  }

  calcelOnClick(e) {
    this.cancel401_dtlRow(e.index, e.rowData);
  }

  onDatePickerBtnClick1(e) {
    this.dateFormat('YYYY-MM', 6);
    this.upd_dtlRow(e, e.rowData);
    e.rowData.save401_dtlRow;
  }

  onDatePickerBtnClick2(e) {
    this.dateFormat('YYYY-MM-DD', 2);
    e.rowData.save401_dtlRow;
  }
}
