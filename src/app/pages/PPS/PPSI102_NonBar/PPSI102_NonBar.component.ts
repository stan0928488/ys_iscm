import { Component, AfterViewInit } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/common/excel.service';
import * as moment from 'moment';
import { BtnCellRenderer } from '../../RENDERER/BtnCellRenderer.component';
import {
  ColDef,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import { __param } from 'tslib';

interface ItemData7 {
  id: string;
  plantCode: string;
  plant: string;
  shopCode: string;
  shopName: string;
  equipCode: string;
  equipName: string;
  wipMin: string;
  wipMax: string;
  equipGroup: string;
  mesPublishGroup: string;
  balanceRule: string;
  orderSeq: string;
  wtType: string;
  valid: string;
  wtTypeName: string;
  validName: string;
}

@Component({
  selector: 'app-PPSI102_NonBar',
  templateUrl: './PPSI102_NonBar.component.html',
  styleUrls: ['./PPSI102_NonBar.component.scss'],
  providers: [NzMessageService],
})
export class PPSI102_NonBarComponent implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  colDefs: ColDef[] = [
    { headerName: '工廠別', field: 'plant', width: 91 },
    { headerName: '站別代碼', field: 'shopCode', width: 104 },
    { headerName: '站別', field: 'shopName', width: 106 },
    { headerName: '機台', field: 'equipCode', width: 80 },
    { headerName: '機台名稱', field: 'equipName', width: 131 },
    { headerName: '設備庫存下限(單位:MT)', field: 'wipMin', width: 190 },
    { headerName: '設備庫存上限(單位:MT)', field: 'wipMax', width: 190 },
    { headerName: '機台群組', field: 'equipGroup', width: 104 },
    { headerName: '發佈MES群組', field: 'mesPublishGroup', width: 131 },
    {
      headerName: '工時計算分類',
      field: 'wtType',
      width: 131,
      valueFormatter: this.wtTypeNameDisplay,
    },
    {
      headerName: '有效碼',
      field: 'valid',
      width: 91,
      valueFormatter: this.validNameDisplay,
    },
    {
      headerName: 'Action',
      editable: false,
      filter: false,
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

  // 站別機台關聯表
  PLANT = '精整';
  SHOP_CODE;
  SHOP_NAME;
  EQUIP_CODE;
  EQUIP_NAME;
  WIP_MIN;
  WIP_MAX;
  EQUIP_GROUP;
  MES_PUBLISH_GROUP;
  WT_TYPE;
  VALID = 'Y';
  isVisibleYield = false;
  searchPlantValue = '';
  searchShopCodeValue = '';
  searchShopNameValue = '';
  searchEquipCode1Value = '';
  searchEquipNameValue = '';
  searchEquipGroupValue = '';
  searchMesPublishGroupValue = '';
  searchValidValue = '';
  searchWtTypeValue = '';
  searchWipMinValue = '';
  searchWipMaxValue = '';

  file: File;
  inputFileUseInUpload;
  arrayBuffer: any;
  importdata = [];
  titleArray = [
    '工廠別',
    '站別代碼',
    '站別',
    '機台',
    '機台名稱',
    '設備庫存下限(單位:MT)',
    '設備庫存上限(單位:MT)',
    '機台群組',
    '發佈MES群組',
    '工時計算分類',
    '有效碼',
  ];
  frameworkComponents: any;
  constructor(
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie('USERNAME');
    this.PLANT_CODE = this.cookieService.getCookie('plantCode');
    this.frameworkComponents = {
      buttonRenderer: BtnCellRenderer,
    };
  }

  ngAfterViewInit() {
    console.log('ngAfterViewChecked');
    this.getPPSINP07List();
  }

  PPSINP07List_tmp;
  editCache7: { [key: string]: { edit: boolean; data: ItemData7 } } = {};
  PPSINP07List: ItemData7[] = [];
  getPPSINP07List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINPTB07List('2').subscribe((res: any) => {
      const { code, data } = res;
      this.PPSINP07List = data;
      console.log(this.PPSINP07List);

      // console.log('getPPSINP07List success');
      // this.PPSINP07List_tmp = res;
      // console.log(res);
      // console.log('%%%%%%%%%%%%%%%%');
      // const data = [];
      // for (let i = 0; i < this.PPSINP07List_tmp.length; i++) {
      //   data.push({
      //     id: `${i}`,
      //     tab1ID: this.PPSINP07List_tmp[i].ID,
      //     PLANT_CODE: this.PPSINP07List_tmp[i].PLANT_CODE,
      //     PLANT: this.PPSINP07List_tmp[i].PLANT,
      //     SHOP_CODE: this.PPSINP07List_tmp[i].SHOP_CODE,
      //     SHOP_NAME: this.PPSINP07List_tmp[i].SHOP_NAME,
      //     EQUIP_CODE: this.PPSINP07List_tmp[i].EQUIP_CODE,
      //     EQUIP_NAME: this.PPSINP07List_tmp[i].EQUIP_NAME,
      //     WIP_MIN: this.PPSINP07List_tmp[i].WIP_MIN,
      //     WIP_MAX: this.PPSINP07List_tmp[i].WIP_MAX,
      //     EQUIP_GROUP: this.PPSINP07List_tmp[i].EQUIP_GROUP,
      //     MES_PUBLISH_GROUP: this.PPSINP07List_tmp[i].MES_PUBLISH_GROUP,
      //     BALANCE_RULE: this.PPSINP07List_tmp[i].BALANCE_RULE,
      //     ORDER_SEQ: this.PPSINP07List_tmp[i].ORDER_SEQ,
      //     WT_TYPE: this.PPSINP07List_tmp[i].WT_TYPE,
      //     VALID: this.PPSINP07List_tmp[i].VALID,
      //     wtTypeName: this.PPSINP07List_tmp[i].wtTypeName,
      //     validName: this.PPSINP07List_tmp[i].validName,
      //   });
      // }
      // this.PPSINP07List = data;
      // console.log(data);
      // console.log('======================');
      // this.displayPPSINP07List = this.PPSINP07List;
      this.updateEditCache();
      // console.log(this.PPSINP07List);
      myObj.loading = false;
    });
  }

  // insert
  insertTab() {
    let myObj = this;
    if (this.PLANT === undefined) {
      myObj.message.create('error', '「工廠別」不可為空');
      return;
    } else if (this.SHOP_CODE === undefined) {
      myObj.message.create('error', '「站別代碼」不可為空');
      return;
    } else if (this.EQUIP_CODE === undefined) {
      myObj.message.create('error', '「機台」不可為空');
      return;
    } else if (this.VALID === undefined) {
      myObj.message.create('error', '「有效碼」不可為空');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave();
          this.isVisibleYield = false;
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }

  // update
  editRow(id: string): void {
    this.editCache7[id].edit = true;
  }

  // delete
  deleteRow(id: string): void {
    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        this.delID(id);
      },
      nzOnCancel: () => console.log('cancel'),
    });
  }

  // cancel
  cancelEdit(id: string): void {
    const index = this.PPSINP07List.findIndex((item) => item.id === id);
    this.editCache7[id] = {
      data: { ...this.PPSINP07List[index] },
      edit: false,
    };
  }

  // update Save
  saveEdit(rowData: any, id: string): void {
    let myObj = this;
    if (rowData.plant === undefined) {
      myObj.message.create('error', '「工廠別」不可為空');
      return;
    } else if (rowData.shopCode === undefined) {
      myObj.message.create('error', '「站別代碼」不可為空');
      return;
    } else if (rowData.equipCode === undefined) {
      myObj.message.create('error', '「機台」不可為空');
      return;
    } else if (rowData.valid === undefined) {
      myObj.message.create('error', '「有效碼」不可為空');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.updateSave(rowData, id);
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }

  // update
  updateEditCache(): void {
    this.PPSINP07List.forEach((item) => {
      this.editCache7[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  // 新增資料
  insertSave() {
    let myObj = this;
    this.LoadingPage = true;

    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        PLANT_CODE: this.PLANT_CODE,
        PLANT: this.PLANT,
        SHOP_CODE: this.SHOP_CODE,
        SHOP_NAME: this.SHOP_NAME === undefined ? null : this.SHOP_NAME,
        EQUIP_CODE: this.EQUIP_CODE,
        EQUIP_NAME: this.EQUIP_NAME === undefined ? null : this.EQUIP_NAME,
        WIP_MIN: this.WIP_MIN === undefined ? null : this.WIP_MIN,
        WIP_MAX: this.WIP_MAX === undefined ? null : this.WIP_MAX,
        EQUIP_GROUP: this.EQUIP_GROUP === undefined ? null : this.EQUIP_GROUP,
        MES_PUBLISH_GROUP:
          this.MES_PUBLISH_GROUP === undefined ? null : this.MES_PUBLISH_GROUP,
        VALID: this.VALID,
        WT_TYPE: this.WT_TYPE === undefined ? null : this.WT_TYPE,
        BALANCE_RULE: null,
        ORDER_SEQ: null,
      });

      myObj.PPSService.insertI107Save('2', obj).subscribe(
        (res) => {
          console.log(res);
          if (res[0].MSG === 'Y') {
            this.SHOP_CODE = undefined;
            this.SHOP_NAME = undefined;
            this.EQUIP_CODE = undefined;
            this.EQUIP_NAME = undefined;
            this.WIP_MIN = undefined;
            this.WIP_MAX = undefined;
            this.EQUIP_GROUP = undefined;
            this.MES_PUBLISH_GROUP = undefined;
            this.VALID = undefined;
            this.WT_TYPE = undefined;
            this.getPPSINP07List();
            this.sucessMSG('新增成功', ``);
          } else {
            this.errorMSG('新增失敗', res[0].MSG);
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('新增失敗', '後台新增錯誤，請聯繫系統工程師');
          this.LoadingPage = false;
        }
      );
    });
  }

  wttypeChange(_id) {
    let newType = this.editCache7[_id].data.wtType;
    if (newType === '1') {
      this.editCache7[_id].data.wtTypeName = '線速';
    } else if (newType === '2') {
      this.editCache7[_id].data.wtTypeName = '非線速';
    } else {
      this.editCache7[_id].data.wtTypeName = '-';
    }
  }
  validChange(_id) {
    let newType = this.editCache7[_id].data.valid;
    if (newType === 'Y') {
      this.editCache7[_id].data.validName = '有效';
    } else {
      this.editCache7[_id].data.validName = '無效';
    }
  }

  // 修改資料
  updateSave(rowData, _id) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID: rowData.id,
        PLANT_CODE: rowData.plantCode,
        PLANT: rowData.plant,
        SHOP_CODE: rowData.shopCode,
        SHOP_NAME: rowData.shopName === undefined ? null : rowData.shopName,
        EQUIP_CODE: rowData.equipCode,
        EQUIP_NAME: rowData.equipName === undefined ? null : rowData.equipName,
        WIP_MIN: rowData.wipMin === undefined ? null : rowData.wipMin,
        WIP_MAX: rowData.wipMax === undefined ? null : rowData.wipMax,
        EQUIP_GROUP:
          rowData.equipGroup === undefined ? null : rowData.equipGroup,
        MES_PUBLISH_GROUP:
          rowData.mesPublishGroup === undefined
            ? null
            : rowData.mesPublishGroup,
        VALID: rowData.valid,
        WT_TYPE: rowData.wtType === undefined ? null : rowData.wtType,
        BALANCE_RULE: null,
        ORDER_SEQ: null,
      });

      myObj.PPSService.updateI107Save('2', obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.SHOP_CODE = undefined;
            this.SHOP_NAME = undefined;
            this.EQUIP_CODE = undefined;
            this.EQUIP_NAME = undefined;
            this.WIP_MIN = undefined;
            this.WIP_MAX = undefined;
            this.EQUIP_GROUP = undefined;
            this.MES_PUBLISH_GROUP = undefined;
            this.VALID = undefined;
            this.WT_TYPE = undefined;
            console.log(this.PPSINP07List);
            console.log(this.editCache7);

            this.sucessMSG('修改成功', ``);
            const index = this.PPSINP07List.findIndex(
              (item) => item.id === _id
            );
            Object.assign(this.PPSINP07List[index], rowData);
            this.editCache7[_id].edit = false;
          } else {
            this.errorMSG('修改失敗', res[0].MSG);
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改失敗', '後台修改錯誤，請聯繫系統工程師');
          this.LoadingPage = false;
        }
      );
    });
  }

  // 刪除資料
  delID(_id) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let _ID = this.editCache7[_id].data.id;
      myObj.PPSService.delI107Data('2', _ID).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.sucessMSG('刪除成功', ``);
            this.getPPSINP07List();
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('刪除失敗', '後台刪除錯誤，請聯繫系統工程師');
          this.LoadingPage = false;
        }
      );
    });
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
  // 新增站別機台關聯表之彈出視窗
  openShopInput(): void {
    this.isVisibleYield = true;
  }
  // 取消站別機台關聯表之彈出視窗
  cancelShopInput(): void {
    this.isVisibleYield = false;
  }

  // excel檔名
  incomingfile(event) {
    this.file = event.target.files[0];
    console.log('incomingfile e : ' + this.file);
    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    }
  }

  clearFile() {
    document.getElementsByTagName('input')[0].value = '';
  }

  Upload() {
    // let getFileNull = this.inputFileUseInUpload;
    // if(getFileNull === undefined){
    //   this.errorMSG('請選擇檔案', '');
    //   return;
    // }

    let lastname = this.file.name.split('.').pop();
    console.log('this.file.name: ' + this.file.name);
    console.log('incomingfile e : ' + this.file);
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {
      console.log('上傳檔案格式沒有錯誤');
      let fileReader = new FileReader();
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

        console.log('importExcel');
        console.log(this.importdata);
        this.importExcel(this.importdata);
      };
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  importExcel(_data) {
    var upload_data = [];

    for (let i = 0; i < _data.length; i++) {
      if (_data[i]['工廠別'] === undefined) {
        this.errorMSG('第' + (i + 1) + '筆檔案內容錯誤', '「工廠別」不可為空');
        this.clearFile();
        return;
      } else if (_data[i]['站別代碼'] === undefined) {
        this.errorMSG(
          '第' + (i + 1) + '筆檔案內容錯誤',
          '「站別代碼」不可為空'
        );
        this.clearFile();
        return;
      } else if (_data[i]['機台'] === undefined) {
        this.errorMSG('第' + (i + 1) + '筆檔案內容錯誤', '「機台」不可為空');
        this.clearFile();
        return;
      } else if (_data[i]['有效碼'] === undefined) {
        this.errorMSG('第' + (i + 1) + '筆檔案內容錯誤', '「有效碼」不可為空');
        this.clearFile();
        return;
      }

      let allData = JSON.stringify(_data[i]);
      if (_data[i]['機台名稱'] == undefined) _data[i]['機台名稱'] = '';
      if (_data[i]['機台群組'] == undefined) _data[i]['機台群組'] = '';
      if (_data[i]['發佈MES群組'] == undefined) _data[i]['發佈MES群組'] = '';
      if (_data[i]['機台'] == undefined) _data[i]['機台'] = '';
      upload_data.push({
        PLANT_CODE: 'YS',
        PLANT: _data[i]['工廠別'],
        SHOP_CODE: _data[i]['站別代碼'],
        SHOP_NAME: _data[i]['站別'],
        EQUIP_CODE: _data[i]['機台'],
        EQUIP_GROUP: _data[i]['機台群組'],
        MES_PUBLISH_GROUP: _data[i]['發佈MES群組'],
        EQUIP_NAME: _data[i]['機台名稱'],
        WIP_MIN: _.isNil(_data[i]['設備庫存下限(單位:MT)'])
          ? null
          : _data[i]['設備庫存下限(單位:MT)'],
        WIP_MAX: _.isNil(_data[i]['設備庫存上限(單位:MT)'])
          ? null
          : _data[i]['設備庫存上限(單位:MT)'],
        WT_TYPE:
          _data[i]['工時計算分類'] == '線速'
            ? '1'
            : _data[i]['工時計算分類'] == '非線速'
            ? '2'
            : null,
        VALID:
          _data[i]['有效碼'] == '有效'
            ? 'Y'
            : _data[i]['有效碼'] == '無效'
            ? 'X'
            : null,
        BALANCE_RULE: null,
        ORDER_SEQ: null,
        DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
        USERNAME: this.USERNAME,
      });
    }

    console.log(upload_data);
    return new Promise((resolve, reject) => {
      console.log('匯入開始');
      this.LoadingPage = true;
      let myObj = this;
      let obj = {};
      obj = {
        EXCELDATA: upload_data,
      };

      myObj.PPSService.importI107Excel('2', obj).subscribe(
        (res) => {
          console.log('importExcelPPSI102');
          if (res[0].MSG === 'Y') {
            this.loading = false;
            this.LoadingPage = false;
            console.log(obj);
            this.sucessMSG('EXCCEL上傳成功', '');
            this.clearFile();
            this.getPPSINP07List();
          } else {
            this.errorMSG('匯入錯誤', res[0].MSG);
            this.clearFile();
            this.loading = false;
            this.LoadingPage = false;
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
          this.loading = false;
          this.LoadingPage = false;
        }
      );
    });
    this.getPPSINP07List();
  }

  convertToExcel() {
    console.log('convertToExcel');
    let data;
    let fileName = `站別機台關聯表_非直棒`;
    data = this.formatDataForExcel(this.PPSINP07List);
    this.excelService.exportAsExcelFile(data, fileName, this.titleArray);
  }

  formatDataForExcel(displayData) {
    let excelData = [];
    for (let item of displayData) {
      let obj = {};
      _.extend(obj, {
        PLANT: _.get(item, 'plant'),
        SHOP_CODE: _.get(item, 'shopCode'),
        SHOP_NAME: _.get(item, 'shopName'),
        EQUIP_CODE: _.get(item, 'equipCode'),
        EQUIP_NAME: _.get(item, 'equipName'),
        WIP_MIN: _.get(item, 'wipMin'),
        WIP_MAX: _.get(item, 'wipMax'),
        EQUIP_GROUP: _.get(item, 'equipGroup'),
        MES_PUBLISH_GROUP: _.get(item, 'mesPublishGroup'),

        WT_TYPE:
          _.get(item, 'wtType') === '1'
            ? '線速'
            : _.get(item, 'wtType') === '2'
            ? '非線速'
            : null,
        VALID:
          _.get(item, 'valid') === 'Y'
            ? '有效'
            : _.get(item, 'valid') === 'X'
            ? '無效'
            : null,
      });
      excelData.push(obj);
    }
    console.log(excelData);
    return excelData;
  }

  wtTypeNameDisplay(params: ValueFormatterParams) {
    if (params.value === '1') {
      return '線速';
    } else if (params.value === '2') {
      return '非線速';
    }
  }

  validNameDisplay(params: ValueFormatterParams) {
    if (params.value === 'Y') {
      return '有效';
    } else if (params.value === 'X') {
      return '無效';
    }
  }

  onBtnClick1(e) {
    e.params.api.setFocusedCell(e.params.node.rowIndex, 'equipCode');
    e.params.api.startEditingCell({
      rowIndex: e.params.node.id,
      colKey: 'equipCode',
    });
  }

  onBtnClick2(e) {
    this.saveEdit(e.rowData, e.rowData.id);
    console.log(e.rowData);
    console.log(e.rowData.id);
  }

  onBtnClick3(e) {
    this.cancelEdit(e.rowData.id);
    this.getPPSINP07List();
  }

  onBtnClick4(e) {
    this.deleteRow(e.rowData.id);
  }
}
