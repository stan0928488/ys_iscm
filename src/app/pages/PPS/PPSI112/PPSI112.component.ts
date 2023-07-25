import { Component, AfterViewInit } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ExcelService } from 'src/app/services/common/excel.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { number } from 'echarts';
import {
  CellClickedEvent,
  ColDef,
  ColGroupDef,
  GridReadyEvent,
  PreConstruct,
} from 'ag-grid-community';
import { BtnCellRenderer } from '../../RENDERER/BtnCellRenderer.component';
import { TBPPSM107 } from './TBPPSM107.model';
import { GridOptions } from 'ag-grid-community';

interface ItemData {
  schShopCode: string;
  equipCode: string;
  cumsumType: string;
  accumulation: number;
  dateLimit: number;
  useFlag: string;
  dateUpdate: string;
  userUpdate: string;
}

@Component({
  selector: 'app-PPSI112',
  templateUrl: './PPSI112.component.html',
  styleUrls: ['./PPSI112.component.scss'],
  providers: [NzMessageService],
})
export class PPSI112Component implements AfterViewInit {
  userName: string;
  plantCode: string;
  //存放資料的陣列
  tbppsm107: ItemData[] = [];
  // 如為true則不可異動
  isRunFCP = false;
  // 等待資料變動
  loading = true;
  //新增視窗開關
  isVisibleYield: boolean;

  preShopEquip;

  schShopCode: string;
  equipCode: string;
  cumsumType: string;
  accumulation: number;
  dateLimit: number;
  useFlag: string;
  dateUpdate: string;
  userUpdate: string;

  isErrorMsg = false;
  isERROR = false;
  arrayBuffer: any;
  file: File;
  importdata = [];
  importdata_new = [];
  errorTXT = [];
  rowData: ItemData[] = [];
  whichRow;

  frameworkComponents;

  gridOptions = {
    defaultColDef: {
      editable: true,
      sortable: false,
      resizable: true,
    },
    api: null,
  };

  constructor(
    private PPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService
  ) {
    this.i18n.setLocale(zh_TW);
    this.userName = this.cookieService.getCookie('USERNAME');
    this.plantCode = this.cookieService.getCookie('plantCode');
    this.frameworkComponents = {
      buttonRenderer: BtnCellRenderer,
    };
  }

  ngAfterViewInit() {
    console.log('ngAfterViewChecked');
    this.getRunFCPCount();
    this.getTBPPSM107();
  }

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.PPSService.getRunFCPCount().subscribe((res: number) => {
      console.log('getRunFCPCount success');
      if (res > 0) this.isRunFCP = true;
    });
  }

  onInit() {
    this.schShopCode = '';
    this.equipCode = '';
    this.cumsumType = '';
    this.accumulation = 0;
    this.dateLimit = 0;
    this.useFlag = '';
    this.dateUpdate = '';
    this.userUpdate = '';

    this.isVisibleYield = false;
    this.loading = false;
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_new = [];
    this.isERROR = false;
    this.errorTXT = [];
  }

  public columnDefs = [
    {
      headerName: '站別',
      field: 'schShopCode',
      width: 65,
    },
    {
      headerName: '機台',
      field: 'equipCode',
      width: 65,
    },
    {
      headerName: '累積單位',
      field: 'cumsumType',
      width: 90,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['day', 'hour'],
      },
    },
    {
      headerName: '累積值',
      field: 'accumulation',
      width: 75,
    },
    {
      headerName: '強制投產',
      field: 'dateLimit',
      width: 90,
    },
    {
      headerName: '是否使用',
      field: 'useFlag',
      width: 90,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Y', 'N'],
      },
    },
    {
      headerName: '更新時間',
      field: 'dateUpdate',
      width: 180,
      editable: false,
    },
    {
      headerName: '更新者',
      field: 'userUpdate',
      width: 100,
      editable: false,
    },
    {
      headerName: 'Action',
      editable: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: [
        {
          onClick: this.onBtnClick1.bind(this),
        },
        {
          onClick: this.onBtnClick2.bind(this),
        },
        {
          onClick: this.onBtnClick3.bind(this),
        },
        {
          onClick: this.onBtnClick4.bind(this),
        },
      ],
    },
  ];

  myDataList;
  displayDataList: ItemData[] = [];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  async getTBPPSM107() {
    this.PPSService.getTBPPSM107().subscribe((res) => {
      this.myDataList = res;
      for (let i = 0; i < this.myDataList.length; i++) {
        this.tbppsm107.push({
          schShopCode: this.myDataList[i].schShopCode,
          equipCode: this.myDataList[i].equipCode,
          cumsumType: this.myDataList[i].cumsumType,
          accumulation: this.myDataList[i].accumulation,
          dateLimit: this.myDataList[i].dateLimit,
          useFlag: this.myDataList[i].useFlag,
          dateUpdate: this.myDataList[i].dateUpdate,
          userUpdate: this.myDataList[i].userUpdate,
        });
      }
      this.displayDataList = this.tbppsm107;
      this.tbppsm107 = [];
      this.myDataList = {};
      console.log(this.displayDataList);
      this.loading = false;
      this.updateEditCache();
    });
  }
  shopCode;
  getShopCode() {
    this.PPSService.getShopCode().subscribe((res) => {
      this.shopCode = Object.values(res);
      console.log(this.shopCode);
    });
  }

  // insert
  insertTab() {
    if (this.schShopCode === '') {
      this.message.create('error', '「站別」不可為空');
      return;
    } else if (this.equipCode === '') {
      this.message.create('error', '「機台」不可為空');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave();
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }

  // 新增資料
  insertSave() {
    this.loading = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        schShopCode: this.schShopCode,
        equipCode: this.equipCode,
        cumsumType: this.cumsumType,
        accumulation: this.accumulation,
        dateLimit: this.dateLimit,
        useFlag: this.useFlag,
        userUpdate: this.userName,
      });

      this.PPSService.insertTBPPSM107('1', obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.onInit();
            this.getTBPPSM107();
            this.sucessMSG('新增成功', ``);
          } else {
            this.errorMSG('新增失敗', res[0].MSG);
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('新增失敗', '後台新增錯誤，請聯繫系統工程師');
          this.loading = false;
        }
      );
    });
  }
  update() {
    this.gridOptions.defaultColDef.editable = true;
  }

  // update
  editRow(equipCode: string): void {
    this.editCache[equipCode].edit = true;
  }

  // delete
  deleteRow(equipCode: string): void {
    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        this.delByEquipCode(equipCode);
      },
      nzOnCancel: () => console.log('cancel'),
    });
  }

  // cancel
  cancelEdit(equipCode: string): void {
    const index = this.displayDataList.findIndex(
      (item) => item.equipCode === equipCode
    );
    this.editCache[equipCode] = {
      data: { ...this.displayDataList[index] },
      edit: false,
    };
  }

  // update Save
  saveEdit(rowData: any, equipCode: string): void {
    let myObj = this;
    if (rowData.schShopCode === undefined) {
      myObj.message.create('error', '「站別」不可為空');
      return;
    } else if (rowData.equipCode === undefined) {
      myObj.message.create('error', '「機台」不可為空');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.updateSave(rowData, equipCode);
          this.loading = true;
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }

  // update
  updateEditCache(): void {
    this.displayDataList.forEach((item) => {
      this.editCache[item.equipCode] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  // 修改資料
  updateSave(rowData, _equipCode) {
    let myObj = this;
    this.loading = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        schShopCode: rowData.schShopCode,
        equipCode: rowData.equipCode,
        cumsumType: rowData.cumsumType,
        accumulation: rowData.accumulation,
        dateLimit: rowData.dateLimit,
        useFlag: rowData.useFlag,
        userUpdate: this.userName,
      });
      myObj.PPSService.updateTBPPSM107('1', obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.onInit();
            this.sucessMSG('修改成功', ``);
            const index = this.displayDataList.findIndex(
              (item) => item.equipCode === _equipCode
            );
            this.getTBPPSM107();
            // Object.assign(this.displayDataList[index], rowData);
            // this.editCache[_equipCode].edit = false;
          } else {
            this.errorMSG('修改失敗', res[0].MSG);
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改失敗', '後台修改錯誤，請聯繫系統工程師');
          this.loading = false;
        }
      );
    });
  }

  // 刪除資料
  delByEquipCode(_equipCode) {
    let myObj = this;
    this.loading = true;
    return new Promise((resolve, reject) => {
      myObj.PPSService.delTBPPSM107('1', _equipCode).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.onInit();
            this.sucessMSG('刪除成功', ``);
            this.getTBPPSM107();
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('刪除失敗', '後台刪除錯誤，請聯繫系統工程師');
          this.loading = false;
        }
      );
    });
  }

  // convert to Excel and Download
  convertToExcel() {
    let data;
    let fileName;
    let titleArray = [];
    if (this.displayDataList.length > 0) {
      data = this.formatDataForExcel(this.displayDataList);
      fileName = `直棒累計生產`;
      titleArray = [
        '站別',
        '機台',
        '累積單位',
        '累積值',
        '強制投產',
        '是否使用',
      ];
    } else {
      this.errorMSG('匯出失敗', '直棒產能維護目前無資料');
      return;
    }
    this.excelService.exportAsExcelFile(data, fileName, titleArray);
  }

  formatDataForExcel(_displayData) {
    console.log('_displayData');
    let excelData = [];
    for (let item of _displayData) {
      let obj = {};
      _.extend(obj, {
        schShopCode: _.get(item, 'schShopCode'),
        equipCode: _.get(item, 'equipCode'),
        cumsumType: _.get(item, 'cumsumType'),
        accumulation: _.get(item, 'accumulation'),
        dateLimit: _.get(item, 'dateLimit'),
        useFlag: _.get(item, 'useFlag'),
        userUpdate: _.get(item, 'userUpdate'),
      });
      excelData.push(obj);
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
  Upload() {
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
      this.Excelimport();
    }
  }
  // EXCEL 樣板內資料取得及檢誤
  Excelimport() {
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

      this.checkTemplate(worksheet, this.importdata);
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  // EXCEL 匯入樣版檢查
  checkTemplate(worksheet, importdata) {
    if (
      worksheet.A1 === undefined ||
      worksheet.B1 === undefined ||
      worksheet.C1 === undefined ||
      worksheet.D1 === undefined ||
      worksheet.E1 === undefined ||
      worksheet.F1 === undefined
    ) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if (
      worksheet.A1.v !== '站別' ||
      worksheet.B1.v !== '機台' ||
      worksheet.C1.v !== '累積單位' ||
      worksheet.D1.v !== '累積值' ||
      worksheet.E1.v !== '強制投產' ||
      worksheet.F1.v !== '是否使用'
    ) {
      this.errorMSG(
        '檔案樣板欄位表頭錯誤',
        '請先下載資料後，再透過該檔案調整上傳。'
      );
      this.clearFile();
      return;
    } else {
      this.importExcel(importdata);
    }
  }

  // EXCEL 資料上傳 (ppsinptb02_nonbar)
  importExcel(_data) {
    for (let i = 0; i < _data.length; i++) {
      let schShopCode = _data[i].站別;
      let equipCode = _data[i].機台;
      let cumsumType = _data[i].累積單位;
      let accumulation = _data[i].累積值;
      let dateLimit = _data[i].強制投產;
      let useFlag = _data[i].是否使用;
      if (schShopCode === undefined || equipCode === undefined) {
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
        let equipCode = _data[i].機台.toString();
        let cumsumType = _data[i].累積單位.toString();
        let accumulation = _data[i].累積值.toString();
        let dateLimit = _data[i].強制投產.toString();
        let useFlag = _data[i].是否使用.toString();
        let userUpdate = this.userName.toString();

        this.importdata_new.push({
          schShopCode: schShopCode,
          equipCode: equipCode,
          cumsumType: cumsumType,
          accumulation: accumulation,
          dateLimit: dateLimit,
          useFlag: useFlag,
          userUpdate: userUpdate,
        });
      }

      return new Promise((resolve, reject) => {
        this.loading = true;
        let myObj = this;
        let obj = {};
        obj = {
          EXCELDATA: this.importdata_new,
        };
        myObj.PPSService.importTBPPSM107Excel('1', obj).subscribe(
          async (res) => {
            if (res[0].MSG === 'Y') {
              this.loading = false;
              await this.getTBPPSM107();
              this.sucessMSG('EXCCEL上傳成功', '');
              this.clearFile();
              this.onInit();
            } else {
              this.errorMSG('匯入錯誤', res[0].MSG);
              this.clearFile();
              this.importdata_new = [];
              this.loading = false;
            }
          },
          (err) => {
            reject('upload fail');
            this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
            this.importdata_new = [];
            this.loading = false;
          }
        );
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

  //============== 新增資料之彈出視窗 =====================
  // 新增產能維護之彈出視窗
  openYieldInput(): void {
    this.isVisibleYield = true;
    this.getShopCode();
  }
  //取消產能維護彈出視窗
  cancelYieldInput(): void {
    this.onInit();
    this.isVisibleYield = false;
  }

  onBtnClick1(e) {
    e.params.api.setFocusedCell(e.params.node.rowIndex, 'accumulation');
    e.params.api.startEditingCell({
      rowIndex: e.params.node.rowIndex,
      colKey: 'accumulation',
    });
  }

  onBtnClick2(e) {
    this.saveEdit(e.rowData, e.rowData.idx);
  }

  onBtnClick3(e) {
    this.cancelEdit(e.rowData.idx);
  }

  onBtnClick4(e) {
    this.deleteRow(e.rowData.equipCode);
  }

  onRowClicked(event: any) {
    console.log('Row clicked:', event.data);
    this.whichRow = event.data.equipCode;
    // 在这里处理您点击行后的逻辑
  }
}
