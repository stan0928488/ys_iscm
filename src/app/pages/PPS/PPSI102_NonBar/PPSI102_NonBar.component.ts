import { Component, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
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
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridOptions,
  ValueFormatterParams,
} from 'ag-grid-community';
import { __param } from 'tslib';

interface entity {
  id: string;
  plantCode: string;
  plant: string;
  shopCode: string;
  shopName: string;
  equipCode: string;
  equipName: string;
  wipMin: any;
  wipMax: any;
  equipGroup: string;
  mesPublishGroup: string;
  balanceRule: string;
  orderSeq: string;
  wtType: string;
  valid: string;
  wtTypeName: string;
  validName: string;
  produceMin: any;
  produceMax: any;
}

@Component({
  selector: 'app-PPSI102_NonBar',
  templateUrl: './PPSI102_NonBar.component.html',
  styleUrls: ['./PPSI102_NonBar.component.scss'],
  providers: [NzMessageService],
})
export class PPSI102_NonBarComponent implements AfterViewInit {
  thisTabName = '站別機台關聯表(PPSI102)';
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  plantCode;

  colDefs: ColDef[] = [
    {
      headerName: '工廠別',
      field: 'plant',
      width: 130,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '站別代碼',
      field: 'shopCode',
      width: 145,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '站別',
      field: 'shopName',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '機台',
      field: 'equipCode',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '機台名稱',
      field: 'equipName',
      width: 140,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '設備庫存下限(單位:MT)',
      field: 'wipMin',
      width: 210,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '設備庫存上限(單位:MT)',
      field: 'wipMax',
      width: 210,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '設備日產量目標下限(單位:MT)',
      field: 'produceMin',
      width: 210,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '設備日產量目標上限(單位:MT)',
      field: 'produceMax',
      width: 210,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '機台群組',
      field: 'equipGroup',
      width: 140,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '發佈MES群組',
      field: 'mesPublishGroup',
      width: 165,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '工時計算分類',
      field: 'wtType',
      width: 160,
      valueFormatter: this.wtTypeNameDisplay,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '有效碼',
      field: 'valid',
      width: 120,
      valueFormatter: this.validNameDisplay,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: 'Action',
      field: 'id',
      width: 165,
      cellRenderer: (params) => {
        const container = this.renderer.createElement('div');
        this.renderer.addClass(container, 'container');

        let updateButton = this.renderer.createElement('button');
        const updateText = this.renderer.createText('修改');
        let check: number = null;
        this.renderer.appendChild(updateButton, updateText);
        this.renderer.addClass(updateButton, 'updateButton');

        let deleteButton = this.renderer.createElement('button');
        const deleteText = this.renderer.createText('刪除');
        this.renderer.appendChild(deleteButton, deleteText);
        this.renderer.addClass(deleteButton, 'deleteButton');
        this.renderer.listen(deleteButton, 'click', () => {
          this.deleteData(params.data);
        });

        updateButton.addEventListener('click', () => {
          check = this.updateCheck(params);
          if (check === 1) {
            const confirmButton = this.renderer.createElement('button');
            const confirmText = this.renderer.createText('確認');
            this.renderer.appendChild(confirmButton, confirmText);
            this.renderer.addClass(confirmButton, 'updateButton');
            confirmButton.addEventListener('click', () => {
              this.updateById(params);
            });
            const parent = updateButton.parentNode;
            parent.replaceChild(confirmButton, updateButton);
            updateButton = confirmButton;

            const cancelButton = this.renderer.createElement('button');
            const cancelText = this.renderer.createText('取消');
            this.renderer.appendChild(cancelButton, cancelText);
            this.renderer.addClass(cancelButton, 'deleteButton');

            cancelButton.addEventListener('click', () => {
              // this.updateById(params);
              console.log('cancel');
              this.cancelUpdate();
            });

            const parent2 = deleteButton.parentNode;
            parent2.replaceChild(cancelButton, deleteButton);
            deleteButton = cancelButton;
          }
        });

        this.renderer.appendChild(container, updateButton);
        this.renderer.appendChild(container, deleteButton);
        return container;
      },
      editable: false,
      pinned: 'right',
      filter: false,
    },
  ];

  public defaultColDef: ColDef = {
    sortable: false,
    resizable: true,
    filter: true,
    editable: true,
  };

  private gridApi!: GridApi;
  public editType: 'fullRow' = 'fullRow';
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  // 站別機台關聯表
  plant = '精整';
  shopCode;
  shopName;
  equipCode;
  equipName;
  wipMin;
  wipMax;
  equipGroup;
  mesPublishGroup;
  wtType;
  valid = 'Y';
  produceMin;
  produceMax;
  isVisibleYield = false;

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
    '設備日產量目標下限(單位:MT)',
    '設備日產量目標上限(單位:MT)',
    '機台群組',
    '發佈MES群組',
    '工時計算分類',
    '有效碼',
  ];
  frameworkComponents: any;
  constructor(
    private elementRef: ElementRef,
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
    private renderer: Renderer2
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie('USERNAME');
    this.plantCode = this.cookieService.getCookie('plantCode');
    this.frameworkComponents = {
      buttonRenderer: BtnCellRenderer,
    };
  }

  ngAfterViewInit() {
    console.log('ngAfterViewChecked');
    this.getDataList();

    const aI102NTab = this.elementRef.nativeElement.querySelector(
      '#aI102N'
    ) as HTMLAnchorElement;
    const liI102NTab = this.elementRef.nativeElement.querySelector(
      '#liI102N'
    ) as HTMLLIElement;
    liI102NTab.style.backgroundColor = '#E4E3E3';
    aI102NTab.style.cssText = 'color: blue; font-weight:bold;';
  }

  rowData: entity[] = [];
  getDataList() {
    this.loading = true;
    this.PPSService.getPPSINPTB07List('2').subscribe((res: any) => {
      const { code, data } = res;
      this.rowData = data;
      console.log(this.rowData);
      this.loading = false;
    });
  }

  // insert
  insertTab() {
    let myObj = this;
    if (this.plant === undefined) {
      myObj.message.create('error', '「工廠別」不可為空');
      return;
    } else if (this.shopCode === undefined) {
      myObj.message.create('error', '「站別代碼」不可為空');
      return;
    } else if (this.equipCode === undefined) {
      myObj.message.create('error', '「機台」不可為空');
      return;
    } else if (this.valid === undefined) {
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

  // 新增資料
  insertSave() {
    let myObj = this;
    this.LoadingPage = true;

    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        plantCode: this.plantCode,
        plant: this.plant,
        shopCode: this.shopCode,
        shopName: this.shopName === undefined ? null : this.shopName,
        equipCode: this.equipCode,
        equipName: this.equipName === undefined ? null : this.equipName,
        wipMin: this.wipMin === undefined ? null : this.wipMin,
        wipMax: this.wipMax === undefined ? null : this.wipMax,
        equipGroup: this.equipGroup === undefined ? null : this.equipGroup,
        mesPublishGroup:
          this.mesPublishGroup === undefined ? null : this.mesPublishGroup,
        valid: this.valid,
        wtType: this.wtType === undefined ? null : this.wtType,
        balanceRule: null,
        orderSeq: null,
        produceMin: this.produceMin === undefined ? null : this.produceMin,
        produceMax: this.produceMax === undefined ? null : this.produceMax,
      });

      myObj.PPSService.insertPPSINPTB07List('2', obj).subscribe(
        (res) => {
          console.log(res);
          if (res['message'] === 'Y') {
            this.shopCode = undefined;
            this.shopName = undefined;
            this.equipCode = undefined;
            this.equipName = undefined;
            this.wipMin = undefined;
            this.wipMax = undefined;
            this.equipGroup = undefined;
            this.mesPublishGroup = undefined;
            this.valid = undefined;
            this.wtType = undefined;
            this.produceMin = undefined;
            this.produceMax = undefined;
            this.getDataList();
            this.sucessMSG('新增成功', ``);
          } else {
            this.errorMSG('新增失敗', res['message']);
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
        plantCode: 'YS',
        plant: _data[i]['工廠別'],
        shopCode: _data[i]['站別代碼'],
        shopName: _data[i]['站別'],
        equipCode: _data[i]['機台'],
        equipGroup: _data[i]['機台群組'],
        mesPublishGroup: _data[i]['發佈MES群組'],
        equipName: _data[i]['機台名稱'],
        wipMin: _.isNil(_data[i]['設備庫存下限(單位:MT)'])
          ? null
          : _data[i]['設備庫存下限(單位:MT)'],
        wipMax: _.isNil(_data[i]['設備庫存上限(單位:MT)'])
          ? null
          : _data[i]['設備庫存上限(單位:MT)'],
        produceMin: _.isNil(_data[i]['設備日產量目標下限(單位:MT)'])
          ? null
          : _data[i]['設備日產量目標下限(單位:MT)'],
        produceMax: _.isNil(_data[i]['設備日產量目標上限(單位:MT)'])
          ? null
          : _data[i]['設備日產量目標上限(單位:MT)'],
        wtType:
          _data[i]['工時計算分類'] == '線速'
            ? '1'
            : _data[i]['工時計算分類'] == '非線速'
            ? '2'
            : null,
        valid:
          _data[i]['有效碼'] == '有效'
            ? 'Y'
            : _data[i]['有效碼'] == '無效'
            ? 'X'
            : null,
        balanceRule: null,
        orderSeq: null,
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

      myObj.PPSService.importPPSINPTB07('2', obj).subscribe(
        (res) => {
          console.log(res);
          console.log('importExcelPPSI102');
          if (res['message'] === 'Y') {
            this.loading = false;
            this.LoadingPage = false;
            console.log(obj);
            this.sucessMSG('EXCCEL上傳成功', '');
            this.clearFile();
            this.getDataList();
          } else {
            this.errorMSG('匯入錯誤', res['message']);
            this.clearFile();
            this.loading = false;
            this.LoadingPage = false;
          }
        },
        (err) => {
          console.log(err);
          reject('upload fail');
          this.errorMSG(
            '修改存檔失敗',
            '後台存檔錯誤，請聯繫系統工程師' + err['message']
          );
          this.loading = false;
          this.LoadingPage = false;
        }
      );
    });
    this.getDataList();
  }

  convertToExcel() {
    console.log('convertToExcel');
    let data;
    let fileName = `站別機台關聯表_非直棒`;
    data = this.formatDataForExcel(this.rowData);
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
        PRODUCE_MIN: _.get(item, 'produceMin'),
        PRODUCE_MAX: _.get(item, 'produceMax'),
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

  updateCheck(params: any) {
    console.log('updateCheck');
    this.gridApi.startEditingCell({
      rowIndex: params.rowIndex,
      colKey: 'id',
    });
    return 1;
  }

  // 修改資料
  updateById(params: any) {
    this.loading = true;
    this.gridApi.stopEditing();
    let preUpdateData = {
      id: this.rowData[params.rowIndex].id,
      plant: this.rowData[params.rowIndex].plant,
      shopCode: this.rowData[params.rowIndex].shopCode,
      shopName: this.rowData[params.rowIndex].shopName,
      equipCode: this.rowData[params.rowIndex].equipCode,
      equipName: this.rowData[params.rowIndex].equipName,
      wipMin:
        this.rowData[params.rowIndex].wipMin === ''
          ? undefined
          : this.rowData[params.rowIndex].wipMin,
      wipMax:
        this.rowData[params.rowIndex].wipMax === ''
          ? undefined
          : this.rowData[params.rowIndex].wipMax,
      produceMin:
        this.rowData[params.rowIndex].produceMin === ''
          ? undefined
          : this.rowData[params.rowIndex].produceMin,
      produceMax:
        this.rowData[params.rowIndex].produceMax === ''
          ? undefined
          : this.rowData[params.rowIndex].produceMax,
      equipGroup: this.rowData[params.rowIndex].equipGroup,
      mesPublishGroup: this.rowData[params.rowIndex].mesPublishGroup,
      wtType: this.rowData[params.rowIndex].wtTypeName,
      valid: this.rowData[params.rowIndex].validName,
    };
    this.PPSService.updatePPSINPTB07List('2', preUpdateData).subscribe(
      (res) => {
        console.log(preUpdateData);
        if (res['message'] === 'Y') {
          this.sucessMSG('修改成功', ``);
          this.getDataList();
        } else {
          this.errorMSG('修改失敗', res['message']);
          this.loading = false;
        }
      },
      (err) => {
        this.errorMSG('修改失敗', '後台修改錯誤，請聯繫系統工程師');
        this.loading = false;
      }
    );
  }

  cancelUpdate() {
    this.gridApi.stopEditing(true);
    this.gridApi.refreshCells({ force: true });
  }
  // 刪除資料
  deleteData(params: any) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      myObj.PPSService.deletePPSINPTB07('2', params.id).subscribe(
        (res) => {
          console.log(res);
          if (res['message'] === 'Y') {
            this.sucessMSG('刪除成功', ``);
            this.getDataList();
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG(
            '刪除失敗',
            '後台刪除錯誤，請聯繫系統工程師' + err.message
          );
          this.loading = false;
        }
      );
    });
  }
}
