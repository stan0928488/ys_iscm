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
  isRunFCP: boolean;
  // 等待資料變動
  loading: boolean;
  //新增視窗開關
  isVisibleYield: boolean;

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

  frameworkComponents;

  gridOptions = {
    defaultColDef: {
      editable: false,
      sortable: false,
      resizable: true,
    },
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
    this.PPSService.getRunFCPCount().subscribe((res) => {
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
    this.isRunFCP = false;
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
      width: 75,
      editable: false,
    },
    {
      headerName: 'Action',
      editable: false,
      cellRenderer: (params) => {
        return '<button (click)="update()">按鈕</button>';
      },
    },
  ];

  myDataList;
  displayDataList: ItemData[] = [];
  async getTBPPSM107() {
    this.PPSService.getTBPPSM107().subscribe((res) => {
      this.myDataList = res;
      this.loading = true;
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
    });
  }

  // // insert
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

  // // update
  // editRow(id: number): void {
  //   this.editCache[id].edit = true;
  // }

  // // delete
  // deleteRow(id: number): void {
  //   this.Modal.confirm({
  //     nzTitle: '是否確定刪除',
  //     nzOnOk: () => {
  //       this.delID(id);
  //     },
  //     nzOnCancel: () => console.log('cancel'),
  //   });
  // }

  // // cancel
  // cancelEdit(id: number): void {
  //   const index = this.tbppsm013List.findIndex((item) => item.idx === id);
  //   this.editCache[id] = {
  //     data: { ...this.tbppsm013List[index] },
  //     edit: false,
  //   };
  // }

  // // update Save
  // saveEdit(tbppsm107: any, id: number): void {
  //   let myObj = this;
  //   if (tbppsm107.schShopCode === undefined) {
  //     myObj.message.create('error', '「站別」不可為空');
  //     return;
  //   } else if (
  //     tbppsm107.equipCode === undefined &&
  //     tbppsm107.equipGroup === undefined
  //   ) {
  //     myObj.message.create('error', '「機台」和「機群」至少填一項');
  //     return;
  //   } else {
  //     this.Modal.confirm({
  //       nzTitle: '是否確定修改',
  //       nzOnOk: () => {
  //         this.updateSave(tbppsm107, id);
  //       },
  //       nzOnCancel: () => console.log('cancel'),
  //     });
  //   }
  // }

  // // update
  // updateEditCache(): void {
  //   this.tbppsm013List.forEach((item) => {
  //     this.editCache[item.idx] = {
  //       edit: false,
  //       data: { ...item },
  //     };
  //   });
  // }

  // // 修改資料
  // updateSave(tbppsm107, _id) {
  //   let myObj = this;
  //   this.LoadingPage = true;
  //   return new Promise((resolve, reject) => {
  //     let obj = {};
  //     _.extend(obj, {
  //       id: tbppsm107.id,
  //       plantCode: tbppsm107.plantCode,
  //       schShopCode: tbppsm107.schShopCode,
  //       equipCode: tbppsm107.equipCode,
  //       equipGroup: tbppsm107.equipGroup,
  //       groupAmount: tbppsm107.groupAmount,
  //       equipQuanity: tbppsm107.equipQuanity,
  //       bootControl: tbppsm107.bootControl,
  //       accumulateDay: tbppsm107.accumulateDay,
  //       dateLimit: tbppsm107.dateLimit,
  //       userName: this.userName,
  //     });
  //     myObj.PPSService.updateI106Save('1', obj).subscribe(
  //       (res) => {
  //         if (res[0].MSG === 'Y') {
  //           this.onInit();
  //           this.sucessMSG('修改成功', ``);
  //           const index = this.tbppsm013List.findIndex(
  //             (item) => item.idx === _id
  //           );
  //           Object.assign(this.tbppsm013List[index], rowData);
  //           this.editCache[_id].edit = false;
  //         } else {
  //           this.errorMSG('修改失敗', res[0].MSG);
  //         }
  //       },
  //       (err) => {
  //         reject('upload fail');
  //         this.errorMSG('修改失敗', '後台修改錯誤，請聯繫系統工程師');
  //         this.LoadingPage = false;
  //       }
  //     );
  //   });
  // }

  // // 刪除資料
  // delID(_id) {
  //   let myObj = this;
  //   return new Promise((resolve, reject) => {
  //     let id = this.editCache[_id].data.id;
  //     myObj.PPSService.delI106Data('1', id).subscribe(
  //       (res) => {
  //         if (res[0].MSG === 'Y') {
  //           this.onInit();
  //           this.sucessMSG('刪除成功', ``);
  //           this.getTbppsm013List();
  //         }
  //       },
  //       (err) => {
  //         reject('upload fail');
  //         this.errorMSG('刪除失敗', '後台刪除錯誤，請聯繫系統工程師');
  //         this.LoadingPage = false;
  //       }
  //     );
  //   });
  // }

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
  }
  //取消產能維護彈出視窗
  cancelYieldInput(): void {
    this.onInit();
    this.isVisibleYield = false;
  }
}
