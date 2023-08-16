import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
  AgGridEvent,
  CellClickedEvent,
  ColDef,
  ColGroupDef,
  GridReadyEvent,
  PreConstruct,
  RowDragEnterEvent,
  RowDragEvent,
} from 'ag-grid-community';
import { BtnCellRenderer } from '../../RENDERER/BtnCellRenderer.component';
import { TBPPSM107 } from './TBPPSM107.model';
import { GridOptions } from 'ag-grid-community';

interface ItemData {
  id: number;
  sort: number;
  schShopCode: string;
  equipCode: string;
  cumsumType: string;
  accumulation: number;
  dateLimit: number;
  condition: string;
  conditionValue: string;
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

  preEquip;

  sort: number;
  schShopCode: string;
  equipCode: string;
  cumsumType: string;
  accumulation: number;
  dateLimit: number;
  condition: string;
  conditionValue: string;
  useFlag: string;
  dateUpdate: string;
  userUpdate: string;
  discumsumType;

  isErrorMsg = false;
  isERROR = false;
  arrayBuffer: any;
  file: File;
  importdata = [];
  importdata_new = [];
  errorTXT = [];
  rowData: ItemData[] = [];
  whichRow;
  conditionList: string[] = [];

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
    private Modal: NzModalService,
    private cdRef: ChangeDetectorRef
  ) {
    this.i18n.setLocale(zh_TW);
    this.userName = this.cookieService.getCookie('USERNAME');
    this.plantCode = this.cookieService.getCookie('plantCode');
    this.frameworkComponents = {
      buttonRenderer: BtnCellRenderer,
    };
  }

  async ngAfterViewInit() {
    this.getRunFCPCount();
    await this.getTBPPSM107();
    this.onInit();
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
    this.accumulation = undefined;
    this.dateLimit = undefined;
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
    this.aaa();
  }
  columnDefs = [];
  aaa() {
    this.columnDefs = [
      {
        headerName: '順序',
        field: 'sort',
        width: 65,
      },
      {
        headerName: '站別',
        field: 'schShopCode',
        width: 65,
        editable: false,
      },
      {
        headerName: '機台',
        field: 'equipCode',
        width: 65,
        editable: false,
      },
      {
        headerName: '累積單位',
        field: 'cumsumType',
        width: 90,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['day', 'hour'],
        },
        valueFormatter: this.cumsumTypeSelect,
        // valueGetter: this.cumsumTypeDisplay,
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
        headerName: '條件',
        field: 'condition',
        width: 100,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: this.conditionList,
        },
      },
      {
        headerName: '條件值',
        field: 'conditionValue',
        width: 100,
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
  }

  // public

  myDataList;
  displayDataList: ItemData[] = [];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  async getTBPPSM107() {
    await this.PPSService.getTBPPSM107().then(async (res) => {
      this.myDataList = res;
      for (let i = 0; i < this.myDataList.length; i++) {
        this.tbppsm107.push({
          id: this.myDataList[i].id,
          sort: this.myDataList[i].sort,
          schShopCode: this.myDataList[i].schShopCode,
          equipCode: this.myDataList[i].equipCode,
          cumsumType: this.myDataList[i].cumsumType,
          accumulation: this.myDataList[i].accumulation,
          dateLimit: this.myDataList[i].dateLimit,
          condition: this.myDataList[i].condition,
          conditionValue: this.myDataList[i].conditionValue,
          useFlag: this.myDataList[i].useFlag,
          dateUpdate: this.myDataList[i].dateUpdate,
          userUpdate: this.myDataList[i].userUpdate,
        });
      }
      this.displayDataList = this.tbppsm107;
      this.tbppsm107 = [];
      this.myDataList = {};
      await this.getCondition();
      this.loading = false;
      this.updateEditCache();
    });
  }

  temp;
  data = [];
  async getCondition() {
    await this.PPSService.getCondition()
      .toPromise()
      .then((res: Array<string>) => {
        // this.conditionList = data.map((item) => item.columnComment);
        // this.conditionList = res;
        this.cdRef.detectChanges();
        this.temp = res;
        for (let i = 0; i < this.temp.length; i++) {
          this.data.push(this.temp[i].columnComment);
        }
        this.conditionList = this.data;
        this.data = [];
        this.temp = [];
        console.log(this.conditionList);
      });
  }

  changeDisplay() {
    for (let i = 0; i < this.displayDataList.length; i++) {
      if (this.displayDataList[i].cumsumType == 'day') {
        this.discumsumType[i] = '天';
      } else if (this.displayDataList[i].cumsumType == 'hour') {
        this.discumsumType[i] = '小時';
      }
    }
  }

  shopCodeOptions;
  getShopCode() {
    this.PPSService.getShopCode().subscribe((res) => {
      const data = Object.values(res);
      this.shopCodeOptions = data.map((item) => item.schShopCode);
    });
  }

  onSelect(event: boolean): void {
    console.log('Select list opened:', event);
    this.getEquipCode();
    // 在这里执行你想要的操作
  }

  equipCodeOptions;
  getEquipCode() {
    this.preEquip = { schShopCode: this.schShopCode };
    this.PPSService.getEquipCode(this.preEquip).subscribe((res) => {
      const data = Object.values(res);
      this.equipCodeOptions = res.map((item) => item.EQUIP_CODE);
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
    } else if (this.cumsumType === '') {
      this.message.create('error', '「累積單位」不可為空');
      return;
    } else if (this.accumulation === undefined) {
      this.message.create('error', '「累積值」不可為空');
      return;
    } else if (this.dateLimit === undefined) {
      this.message.create('error', '「強制投產」不可為空');
      return;
    } else if (this.useFlag === '') {
      this.message.create('error', '「是否使用」不可為空');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave();
          this.onInit();
        },
        nzOnCancel: () => {
          console.log('cancel');
          this.onInit();
        },
      });
    }
  }

  // 新增資料
  insertSave() {
    this.loading = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        sort: this.sort,
        schShopCode: this.schShopCode,
        equipCode: this.equipCode,
        cumsumType: this.cumsumType,
        accumulation: this.accumulation,
        dateLimit: this.dateLimit,
        condition: this.condition,
        conditionValue: this.conditionValue,
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
  editRow(id: number): void {
    this.editCache[id].edit = true;
  }

  // delete
  deleteRow(id: number): void {
    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        this.delByEquipCode(id);
      },
      nzOnCancel: () => console.log('cancel'),
    });
  }

  // cancel
  cancelEdit(id: number): void {
    const index = this.displayDataList.findIndex((item) => item.id === id);
    this.editCache[id] = {
      data: { ...this.displayDataList[index] },
      edit: false,
    };
  }

  // update Save
  saveEdit(rowData: any, id: number): void {
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
          this.updateSave(rowData, id);
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
  updateSave(rowData, _id) {
    let myObj = this;
    this.loading = true;
    console.log(rowData);
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        id: rowData.id,
        sort: rowData.sort,
        schShopCode: rowData.schShopCode,
        equipCode: rowData.equipCode,
        cumsumType: rowData.cumsumType,
        accumulation: rowData.accumulation,
        dateLimit: rowData.dateLimit,
        condition: rowData.condition,
        conditionValue: rowData.conditionValue,
        useFlag: rowData.useFlag,
        userUpdate: this.userName,
      });
      myObj.PPSService.updateTBPPSM107('1', obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.onInit();
            this.sucessMSG('修改成功', ``);
            const index = this.displayDataList.findIndex(
              (item) => item.id === _id
            );
            this.getTBPPSM107();
            // Object.assign(this.displayDataList[index], rowData);
            // this.editCache[_equipCode].edit = false;
          } else {
            this.errorMSG('修改失敗', res[0].MSG);
            this.loading = false;
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
  delByEquipCode(_id) {
    let myObj = this;
    this.loading = true;
    return new Promise((resolve, reject) => {
      myObj.PPSService.delTBPPSM107('1', _id).subscribe(
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
        '順序',
        '站別',
        '機台',
        '累積單位',
        '累積值',
        '強制投產',
        '條件',
        '條件值',
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
        sort: _.get(item, 'sort'),
        schShopCode: _.get(item, 'schShopCode'),
        equipCode: _.get(item, 'equipCode'),
        cumsumType: _.get(item, 'cumsumType'),
        accumulation: _.get(item, 'accumulation'),
        dateLimit: _.get(item, 'dateLimit'),
        condition: _.get(item, 'condition'),
        conditionValue: _.get(item, 'conditionValue'),
        useFlag: _.get(item, 'useFlag'),
      });
      excelData.push(obj);
    }
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
      worksheet.F1 === undefined ||
      worksheet.G1 === undefined ||
      worksheet.H1 === undefined ||
      worksheet.I1 === undefined
    ) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if (
      worksheet.A1.v !== '順序' ||
      worksheet.B1.v !== '站別' ||
      worksheet.C1.v !== '機台' ||
      worksheet.D1.v !== '累積單位' ||
      worksheet.E1.v !== '累積值' ||
      worksheet.F1.v !== '強制投產' ||
      worksheet.G1.v !== '條件' ||
      worksheet.H1.v !== '條件值' ||
      worksheet.I1.v !== '是否使用'
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
      let sort = _data[i].順序;
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
        let sort = _data[i].順序.toString();
        let schShopCode = _data[i].站別.toString();
        let equipCode = _data[i].機台.toString();
        let cumsumType = _data[i].累積單位.toString();
        let accumulation = _data[i].累積值.toString();
        let dateLimit = _data[i].強制投產.toString();
        let condition = _data[i].條件.toString();
        let conditionValue = _data[i].條件值.toString();
        let useFlag = _data[i].是否使用.toString();
        let userUpdate = this.userName.toString();

        this.importdata_new.push({
          sort: sort,
          schShopCode: schShopCode,
          equipCode: equipCode,
          cumsumType: cumsumType,
          accumulation: accumulation,
          dateLimit: dateLimit,
          condition: condition,
          conditionValue: conditionValue,
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
    this.getCondition();
    console.log(this.conditionList);
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
    this.deleteRow(e.rowData.id);
  }

  onRowClicked(event: any) {
    console.log('Row clicked:', event.node);
    this.whichRow = event.data.equipCode;
  }

  cumsumTypeDisplay(params: any): string {
    const selectedOption = params.data.cumsumType;
    console.log('selected option:', selectedOption);
    if (selectedOption === 'day') {
      return '日';
    } else if (selectedOption === 'hour') {
      return '小時';
    }
    return '';
  }

  cumsumTypeSelect(params: any): string {
    const selectedOption = params.value;
    if (selectedOption === 'day') {
      return '日';
    } else if (selectedOption === 'hour') {
      return '小時';
    }
    return '';
  }
}
