import { Component, OnInit } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/common/excel.service';
import * as moment from 'moment';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { BtnCellRenderer } from '../../RENDERER/BtnCellRenderer.component';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';

interface row {
  id: string;
  plant: string;
  shopCode: string;
  shopName: string;
  equipCode: string;
  equipName: string;
  wipMin: number;
  wipMax: number;
  equipGroup: string;
  mesPublishGroup: string;
  valid: string;
}

@Component({
  selector: 'app-PPSI102',
  templateUrl: './PPSI102.component.html',
  styleUrls: ['./PPSI102.component.scss'],
  providers: [NzMessageService],
})
export class PPSI102Component implements OnInit {
  USERNAME: string;
  PLANT_CODE: any;

  rowData: row[] = [];
  colDefs: ColDef[] = [
    { headerName: '工廠別', field: 'plant', width: 91, headerComponent : AGCustomHeaderComponent },
    { headerName: '站別代碼', field: 'shopCode', width: 104, headerComponent : AGCustomHeaderComponent },
    { headerName: '站別名稱', field: 'shopName', width: 106, headerComponent : AGCustomHeaderComponent },
    { headerName: '機台', field: 'equipCode', width: 80, headerComponent : AGCustomHeaderComponent },
    { headerName: '機台名稱', field: 'equipName', width: 131, headerComponent : AGCustomHeaderComponent },
    { headerName: '設備庫存下限(單位:MT)', field: 'wipMin', width: 190, headerComponent : AGCustomHeaderComponent },
    { headerName: '設備庫存上限(單位:MT)', field: 'wipMax', width: 190, headerComponent : AGCustomHeaderComponent },
    { headerName: '機台群組', field: 'equipGroup', width: 104, headerComponent : AGCustomHeaderComponent },
    { headerName: '發佈MES群組', field: 'mesPublishGroup', width: 131, headerComponent : AGCustomHeaderComponent },
    { headerName: '有效碼', field: 'valid', width: 91, headerComponent : AGCustomHeaderComponent },
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

  editCache: { [key: string]: { edit: boolean; data: row } } = {};

  PLANT: string;
  SHOP_CODE: string;
  SHOP_NAME: string;
  EQUIP_CODE: string;
  EQUIP_NAME: string;
  WIP_MIN: number;
  WIP_MAX: number;
  EQUIP_GROUP: string;
  MES_PUBLISH_GROUP: string;
  VALID: string;

  isVisibleYield = false;
  loading = false;
  arrayBuffer: any;
  file: File;
  importdata = [];
  titleArray = [
    '工廠別',
    '站別代碼',
    '站別名稱',
    '機台',
    '機台名稱',
    '設備庫存下限(單位:MT)',
    '設備庫存上限(單位:MT)',
    '機台群組',
    '發佈MES群組',
    '有效碼',
  ];
  importdata_repeat = [];
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

  ngOnInit(): void {
    this.getDataList();
  }

  getDataList() {
    this.PPSService.getPPSINPTB07List('1').subscribe((response: any) => {
      const { code, data } = response;
      this.rowData = data;
      console.log(this.rowData);
    });
  }

  openYieldInput(): void {
    this.isVisibleYield = true;
  }

  cancelShopInput(): void {
    this.isVisibleYield = false;
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
    } else if (this.MES_PUBLISH_GROUP.length > 8) {
      myObj.message.create('error', '「發佈MES群組」超過8碼');
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
    this.editCache[id].edit = true;
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
    const index = this.rowData.findIndex((item) => item.id === id);
    this.editCache[id] = {
      data: { ...this.rowData[index] },
      edit: false,
    };
  }

  // update Save
  saveEdit(rowData: any, id: string): void {
    let myObj = this;
    if (rowData.plant === undefined || '' === rowData.plant) {
      myObj.message.create('error', '「工廠別」不可為空');
      return;
    } else if (rowData.shopCode === undefined || '' === rowData.shopCode) {
      myObj.message.create('error', '「站別代碼」不可為空');
      return;
    } else if (rowData.equipCode === undefined || '' === rowData.equipCode) {
      myObj.message.create('error', '「機台」不可為空');
      return;
    } else if (rowData.mesPublishGroup.length > 8) {
      myObj.message.create('error', '「發佈MES群組」超過8碼');
      return;
    } else if (rowData.valid === undefined || '' === rowData.valid) {
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
    this.rowData.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  // 新增資料
  insertSave() {
    let myObj = this;
    this.loading = true;

    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        PLANT_CODE: this.PLANT_CODE,
        PLANT: this.PLANT,
        SHOP_CODE: this.SHOP_CODE,
        SHOP_NAME: this.SHOP_NAME === undefined ? null : this.SHOP_NAME,
        EQUIP_CODE: this.EQUIP_CODE,
        EQUIP_NAME: this.EQUIP_NAME === undefined ? null : this.EQUIP_NAME,
        EQUIP_GROUP: this.EQUIP_GROUP === undefined ? null : this.EQUIP_GROUP,
        MES_PUBLISH_GROUP:
          this.MES_PUBLISH_GROUP === undefined ? null : this.MES_PUBLISH_GROUP,
        WIP_MIN: this.WIP_MIN === undefined ? null : this.WIP_MIN,
        WIP_MAX: this.WIP_MAX === undefined ? null : this.WIP_MAX,
        VALID: this.VALID,
        BALANCE_RULE: null,
        ORDER_SEQ: null,
        WT_TYPE: null,
      });

      myObj.PPSService.insertI107Save('1', obj).subscribe(
        (res) => {
          console.log(res);
          if (res[0].MSG === 'Y') {
            this.PLANT = undefined;
            this.SHOP_CODE = undefined;
            this.SHOP_NAME = undefined;
            this.EQUIP_CODE = undefined;
            this.EQUIP_NAME = undefined;
            this.EQUIP_GROUP = undefined;
            this.MES_PUBLISH_GROUP = undefined;
            this.VALID = undefined;
            this.WIP_MIN = undefined;
            this.WIP_MAX = undefined;
            this.getDataList();
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

  // 修改資料
  updateSave(rowData, _id) {
    let myObj = this;
    this.loading = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID: rowData.id,
        PLANT: rowData.plant,
        SHOP_CODE: rowData.shopCode,
        SHOP_NAME: rowData.shopName === undefined ? null : rowData.shopName,
        EQUIP_CODE: rowData.equipCode,
        EQUIP_NAME: rowData.equipName === undefined ? null : rowData.equipName,
        MES_PUBLISH_GROUP:
          rowData.mesPublishGroup === undefined
            ? null
            : rowData.mesPublishGroup,
        WIP_MIN: rowData.wipMin === undefined ? null : rowData.wipMin,
        WIP_MAX: rowData.wipMax === undefined ? null : rowData.wipMax,
        EQUIP_GROUP:
          rowData.equipGroup === undefined ? null : rowData.equipGroup,
        VALID: rowData.valid,
        BALANCE_RULE: null,
        ORDER_SEQ: null,
        WT_TYPE: null,
      });
      myObj.PPSService.updateI107Save('1', obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.PLANT = undefined;
            this.SHOP_CODE = undefined;
            this.SHOP_NAME = undefined;
            this.EQUIP_CODE = undefined;
            this.EQUIP_NAME = undefined;
            this.EQUIP_GROUP = undefined;
            this.MES_PUBLISH_GROUP = undefined;
            this.VALID = undefined;
            this.WIP_MIN = undefined;
            this.WIP_MAX = undefined;

            this.sucessMSG('修改成功', ``);
            this.getDataList();

            const index = this.rowData.findIndex((item) => item.id === _id);
            Object.assign(this.rowData[index], this.rowData);
            this.editCache[_id].edit = false;
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
  delID(_id) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let _ID = this.editCache[_id].data.id;
      myObj.PPSService.delI107Data('1', _ID).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.PLANT = undefined;
            this.SHOP_CODE = undefined;
            this.SHOP_NAME = undefined;
            this.EQUIP_CODE = undefined;
            this.EQUIP_NAME = undefined;
            this.EQUIP_GROUP = undefined;
            this.MES_PUBLISH_GROUP = undefined;
            this.VALID = undefined;

            this.sucessMSG('刪除成功', ``);
            this.getDataList();
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

        this.importExcel(this.importdata);
      };
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  importExcel(_data) {
    console.log('EXCEL 資料上傳檢核開始');
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
      } else if (_data[i]['發佈MES群組'].length > 8) {
        console.log(_data[i]['發佈MES群組']);
        this.errorMSG(
          '第' + (i + 1) + '筆檔案內容錯誤',
          '「發佈MES群組」超過8碼'
        );
        this.clearFile();
        return;
      } else if (_data[i]['有效碼'] === undefined) {
        this.errorMSG('第' + (i + 1) + '筆檔案內容錯誤', '「有效碼」不可為空');
        this.clearFile();
        return;
      }

      let allData = JSON.stringify(_data[i]);
      this.importdata_repeat.push(allData);

      if (_data[i]['機台名稱'] == undefined) _data[i]['機台名稱'] = '';
      if (_data[i]['機台群組'] == undefined) _data[i]['機台群組'] = '';
      if (_data[i]['機台'] == undefined) _data[i]['機台'] = '';

      upload_data.push({
        PLANT_CODE: 'YS',
        PLANT: _data[i]['工廠別'],
        SHOP_CODE: _data[i]['站別代碼'].toString(),
        SHOP_NAME: _data[i]['站別名稱'],
        EQUIP_CODE: _data[i]['機台'],
        EQUIP_NAME: _data[i]['機台名稱'],
        WIP_MIN: _.isNil(_data[i]['設備庫存下限(單位:MT)'])
          ? ''
          : _data[i]['設備庫存下限(單位:MT)'],
        WIP_MAX: _.isNil(_data[i]['設備庫存上限(單位:MT)'])
          ? ''
          : _data[i]['設備庫存上限(單位:MT)'],
        EQUIP_GROUP: _data[i]['機台群組'],
        MES_PUBLISH_GROUP: _data[i]['發佈MES群組'],
        VALID: _data[i]['有效碼'],
        BALANCE_RULE: '',
        ORDER_SEQ: '',
        WT_TYPE: '',
        DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
        USERNAME: this.USERNAME,
      });
    }

    return new Promise((resolve, reject) => {
      console.log('匯入開始');
      let myObj = this;
      let obj = {};
      obj = {
        EXCELDATA: upload_data,
      };
      console.log(obj);
      console.log('@@@@@@@@@@@@@@@@@@');
      myObj.PPSService.importI107Excel('1', obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.loading = false;
            this.sucessMSG('EXCCEL上傳成功', '');
            this.clearFile();
            this.getDataList();
          } else {
            this.errorMSG('匯入錯誤', res[0].MSG);
            this.clearFile();
            this.loading = false;
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
          this.loading = false;
        }
      );
    });
  }

  convertToExcel() {
    let arr = [];
    let fileName = `站別機台關聯表_直棒`;
    for (let i = 0; i < this.rowData.length; i++) {
      var ppsIn107 = {
        plant: this.rowData[i].plant,
        shopCode: this.rowData[i].shopCode,
        shopName: this.rowData[i].shopName,
        equipCode: this.rowData[i].equipCode,
        equipName: this.rowData[i].equipName,
        wipMin: this.rowData[i].wipMin,
        wipMax: this.rowData[i].wipMax,
        equipGroup: this.rowData[i].equipGroup,
        mesPublishGroup: this.rowData[i].mesPublishGroup,
        valid: this.rowData[i].valid,
      };
      arr.push(ppsIn107);
    }
    this.excelService.exportAsExcelFile(arr, fileName, this.titleArray);
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
    this.getDataList();
  }

  onBtnClick4(e) {
    this.deleteRow(e.rowData.id);
  }
}
