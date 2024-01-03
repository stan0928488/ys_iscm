import { Component, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/common/excel.service';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridOptions,
} from 'ag-grid-community';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';

interface ItemData {
  id: string;
  tabID: number;
  shopCode: string;
  equipGroup: string;
  equipCode: string;
  processCode: string;
  gradeGroup: string;
  shapeType: string;
  inputDiaMax: number;
  capabilityDiaMin: number;
  capabilityDiaMax: number;
  capabilityLengthMin: number;
  capabilityLengthMax: number;
  optimalDiaMin: number;
  optimalDiaMax: number;
  optimalLengthMin: number;
  optimalLengthMax: number;
  optionEquip1: string;
  optionEquip2: string;
  optionEquip3: string;
  optionEquip4: string;
  optionEquip5: string;
  optionEquip6: string;
  optionEquip7: string;
}

@Component({
  selector: 'app-PPSI103',
  templateUrl: './PPSI103.component.html',
  styleUrls: ['./PPSI103.component.scss'],
  providers: [NzMessageService],
})
export class PPSI103Component implements AfterViewInit {
  thisTabName = '設備能力(PPSI103)';
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  userName;
  plantCode;
  customWidth;
  gridOptions: GridOptions;

  //ag-grid
  rowData: ItemData[] = [];

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

  colDefs: ColDef[] = [
    {
      headerName: '站別',
      field: 'shopCode',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '機台群組',
      field: 'equipGroup',
      width: 145,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '機台',
      field: 'equipCode',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '製程碼',
      field: 'processCode',
      width: 130,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '鋼種類別',
      field: 'gradeGroup',
      width: 145,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '形狀',
      field: 'shapeType',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '投入尺寸上限',
      field: 'inputDiaMax',
      width: 175,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '設備能力最小尺寸',
      field: 'capabilityDiaMin',
      width: 195,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '設備能力最大尺寸',
      field: 'capabilityDiaMax',
      width: 195,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '設備能力最小長度',
      field: 'capabilityLengthMin',
      width: 195,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '設備能力最大長度',
      field: 'capabilityLengthMax',
      width: 195,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '最佳能力最小尺寸',
      field: 'optimalDiaMin',
      width: 195,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '最佳能力最大尺寸',
      field: 'optimalDiaMax',
      width: 195,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '最佳能力最小長度',
      field: 'optimalLengthMin',
      width: 195,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '最佳能力最大長度',
      field: 'optimalLengthMax',
      width: 195,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '替代機台順位1',
      field: 'optionEquip1',
      width: 180,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '替代機台順位2',
      field: 'optionEquip2',
      width: 180,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '替代機台順位3',
      field: 'optionEquip3',
      width: 180,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '替代機台順位4',
      field: 'optionEquip4',
      width: 180,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '替代機台順位5',
      field: 'optionEquip5',
      width: 180,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '替代機台順位6',
      field: 'optionEquip6',
      width: 180,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '替代機台順位7',
      field: 'optionEquip7',
      width: 180,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '更新、刪除',
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

  // 設備能力
  id: number;
  shopCode: string;
  equipGroup: string;
  equipCode: string;
  processCode: string;
  gradeGroup: string;
  shapeType: string;
  inputDiaMax: number;
  capabilityDiaMin: number;
  capabilityDiaMax: number;
  capabilityLengthMin: number;
  capabilityLengthMax: number;
  optimalDiaMin: number;
  optimalDiaMax: number;
  optimalLengthMin: number;
  optimalLengthMax: number;
  optionEquip1: string;
  optionEquip2: string;
  optionEquip3: string;
  optionEquip4: string;
  optionEquip5: string;
  optionEquip6: string;
  optionEquip7: string;

  isVisibleCapability = false;
  importdata = [];
  importdata_repeat = [];

  file: File;
  inputFileUseInUpload;
  arrayBuffer: any;
  titleArray = [
    '站別',
    '機台群組',
    '機台',
    '製程碼',
    '鋼種類別',
    '形狀',
    '投入尺寸上限',
    '設備能力最小尺寸',
    '設備能力最大尺寸',
    '設備能力最小長度',
    '設備能力最大長度',
    '最佳能力最小尺寸',
    '最佳能力最大尺寸',
    '最佳能力最小長度',
    '最佳能力最大長度',
    '替代機台順位1',
    '替代機台順位2',
    '替代機台順位3',
    '替代機台順位4',
    '替代機台順位5',
    '替代機台順位6',
    '替代機台順位7',
  ];

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
    this.userName = this.cookieService.getCookie('USERNAME');
    this.plantCode = this.cookieService.getCookie('plantCode');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.getDataList();
    const aI103Tab = this.elementRef.nativeElement.querySelector(
      '#aI103'
    ) as HTMLAnchorElement;
    const liI103Tab = this.elementRef.nativeElement.querySelector(
      '#liI103'
    ) as HTMLLIElement;
    liI103Tab.style.backgroundColor = '#E4E3E3';
    aI103Tab.style.cssText = 'color: blue; font-weight:bold;';
  }

  onInit() {
    this.shopCode = null;
    this.equipGroup = null;
    this.equipCode = null;
    this.processCode = null;
    this.gradeGroup = null;
    this.shapeType = null;
    this.inputDiaMax = null;
    this.capabilityDiaMin = null;
    this.capabilityDiaMax = null;
    this.capabilityLengthMin = null;
    this.capabilityLengthMax = null;
    this.optimalDiaMin = null;
    this.optimalDiaMax = null;
    this.optimalLengthMin = null;
    this.optimalLengthMax = null;
    this.optionEquip1 = null;
    this.optionEquip2 = null;
    this.optionEquip3 = null;
    this.optionEquip4 = null;
    this.optionEquip5 = null;
    this.optionEquip6 = null;
    this.optionEquip7 = null;
    this.importdata = [];
    this.importdata_repeat = [];
  }

  editCache2: { [key: string]: { edit: boolean; data: ItemData } } = {};

  getDataList() {
    this.loading = true;
    this.PPSService.getPPSINPTB02('1').subscribe((res: any) => {
      const { code, data } = res;
      this.rowData = data;
      // this.updateEditCache(1);
    });
  }

  // insert
  insertTab() {
    if (this.shopCode === undefined) {
      this.message.create('error', '「站別」不可為空');
      return;
    } else if (this.equipGroup === undefined) {
      this.message.create('error', '「機台群組」不可為空');
      return;
    } else if (this.equipCode === undefined) {
      this.message.create('error', '「機台」不可為空');
      return;
    } else if (this.processCode === undefined) {
      this.message.create('error', '「製程碼」不可為空');
      return;
    } else if (this.gradeGroup === undefined) {
      this.message.create('error', '「鋼種類別」不可為空');
      return;
    } else if (this.shapeType === undefined) {
      this.message.create('error', '「形狀」不可為空');
      return;
    } else if (this.inputDiaMax === undefined) {
      this.message.create('error', '「投入尺寸上限」不可為空');
      return;
    } else if (this.capabilityDiaMax === undefined) {
      this.message.create('error', '「設備能力最小尺寸」不可為空');
      return;
    } else if (this.capabilityDiaMax === undefined) {
      this.message.create('error', '「設備能力最大尺寸」不可為空');
      return;
    } else if (this.capabilityLengthMin === undefined) {
      this.message.create('error', '「設備能力最小長度」不可為空');
      return;
    } else if (this.capabilityLengthMax === undefined) {
      this.message.create('error', '「設備能力最大長度」不可為空');
      return;
    } else if (this.optimalDiaMin === undefined) {
      this.message.create('error', '「最佳能力最小尺寸」不可為空');
      return;
    } else if (this.optimalDiaMax === undefined) {
      this.message.create('error', '「最佳能力最大尺寸」不可為空');
      return;
    } else if (this.optimalLengthMin === undefined) {
      this.message.create('error', '「最佳能力最小長度」不可為空');
      return;
    } else if (this.optimalLengthMax === undefined) {
      this.message.create('error', '「最佳能力最大長度」不可為空');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave(1);
        },
      });
    }
  }

  // 新增資料
  insertSave(_type) {
    this.loading = true;

    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        shopCode: this.shopCode,
        equipGroup: this.equipGroup,
        equipCode: this.equipCode,
        processCode: this.processCode,
        gradeGroup: this.gradeGroup,
        shapeType: this.shapeType,
        inputDiaMax: this.inputDiaMax,
        capabilityDiaMin: this.capabilityDiaMin,
        capabilityDiaMax: this.capabilityDiaMax,
        capabilityLengthMin: this.capabilityLengthMin,
        capabilityLengthMax: this.capabilityLengthMax,
        optimalDiaMin: this.optimalDiaMin,
        optimalDiaMax: this.optimalDiaMax,
        optimalLengthMin: this.optimalLengthMin,
        optimalLengthMax: this.optimalLengthMax,
        optionEquip1: this.optionEquip1,
        optionEquip2: this.optionEquip2,
        optionEquip3: this.optionEquip3,
        optionEquip4: this.optionEquip4,
        optionEquip5: this.optionEquip5,
        optionEquip6: this.optionEquip6,
        optionEquip7: this.optionEquip7,
      });

      this.PPSService.insertPPSINPTB02('1', obj).subscribe(
        (res) => {
          console.log(res);
          if (res['message'] === 'Y') {
            this.onInit();
            this.getDataList();
            this.sucessMSG('新增成功', ``);
            this.isVisibleCapability = false;
          } else {
            this.errorMSG('新增失敗', res['message']);
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG(
            '新增失敗',
            '後台新增錯誤，請聯繫系統工程師' + err['message']
          );
          this.loading = false;
        }
      );
    });
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
      shopCode: this.rowData[params.rowIndex].shopCode,
      equipGroup: this.rowData[params.rowIndex].equipGroup,
      equipCode: this.rowData[params.rowIndex].equipCode,
      processCode: this.rowData[params.rowIndex].processCode,
      gradeGroup: this.rowData[params.rowIndex].gradeGroup,
      shapeType: this.rowData[params.rowIndex].shapeType,
      inputDiaMax: this.rowData[params.rowIndex].inputDiaMax,
      capabilityDiaMin: this.rowData[params.rowIndex].capabilityDiaMin,
      capabilityDiaMax: this.rowData[params.rowIndex].capabilityDiaMax,
      capabilityLengthMin: this.rowData[params.rowIndex].capabilityLengthMin,
      capabilityLengthMax: this.rowData[params.rowIndex].capabilityLengthMax,
      optimalDiaMin: this.rowData[params.rowIndex].optimalDiaMin,
      optimalDiaMax: this.rowData[params.rowIndex].optimalDiaMax,
      optimalLengthMin: this.rowData[params.rowIndex].optimalLengthMin,
      optimalLengthMax: this.rowData[params.rowIndex].optimalLengthMax,
      optionEquip1: this.rowData[params.rowIndex].optionEquip1,
      optionEquip2: this.rowData[params.rowIndex].optionEquip2,
      optionEquip3: this.rowData[params.rowIndex].optionEquip3,
      optionEquip4: this.rowData[params.rowIndex].optionEquip4,
      optionEquip5: this.rowData[params.rowIndex].optionEquip5,
      optionEquip6: this.rowData[params.rowIndex].optionEquip6,
      optionEquip7: this.rowData[params.rowIndex].optionEquip7,
    };
    this.PPSService.updatePPSINPTB02('1', preUpdateData).subscribe(
      (res) => {
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
      myObj.PPSService.deletePPSINPTB02('1', params.id).subscribe(
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
  // 新增設備能力之彈出視窗
  openCapabilityInput(): void {
    this.isVisibleCapability = true;
    this.customWidth = '80%';
  }
  //取消設備能力彈出視窗
  cancelCapabilityInput(): void {
    this.isVisibleCapability = false;
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
      upload_data.push({
        plantCode: this.plantCode,
        shopCode: _data[i]['站別'].toString(),
        equipGroup:
          _data[i]['機台群組'] === undefined ? null : _data[i]['機台群組'],
        equipCode: _data[i]['機台'],
        processCode:
          _data[i]['製程碼'] === undefined ? null : _data[i]['製程碼'],
        gradeGroup:
          _data[i]['鋼種類別'] === undefined ? null : _data[i]['鋼種類別'],
        shapeType: _data[i]['形狀'] === undefined ? null : _data[i]['形狀'],
        inputDiaMax: _data[i]['投入尺寸上限'],
        capabilityDiaMin: _data[i]['設備能力最小尺寸'],
        capabilityDiaMax: _data[i]['設備能力最大尺寸'],
        capabilityLengthMin: _data[i]['設備能力最小長度'],
        capabilityLengthMax: _data[i]['設備能力最大長度'],
        optimalDiaMin: _data[i]['最佳能力最小尺寸'],
        optimalDiaMax: _data[i]['最佳能力最大尺寸'],
        optimalLengthMin: _data[i]['最佳能力最小長度'],
        optimalLengthMax: _data[i]['最佳能力最大長度'],
        optionEquip1:
          _data[i]['替代機台順位1'] === undefined
            ? null
            : _data[i]['替代機台順位1'],
        optionEquip2:
          _data[i]['替代機台順位2'] === undefined
            ? null
            : _data[i]['替代機台順位2'],
        optionEquip3:
          _data[i]['替代機台順位3'] === undefined
            ? null
            : _data[i]['替代機台順位3'],
        optionEquip4:
          _data[i]['替代機台順位4'] === undefined
            ? null
            : _data[i]['替代機台順位4'],
        optionEquip5:
          _data[i]['替代機台順位5'] === undefined
            ? null
            : _data[i]['替代機台順位5'],
        optionEquip6:
          _data[i]['替代機台順位6'] === undefined
            ? null
            : _data[i]['替代機台順位6'],
        optionEquip7:
          _data[i]['替代機台順位7'] === undefined
            ? null
            : _data[i]['替代機台順位7'],
      });
    }

    console.log(upload_data);
    return new Promise((resolve, reject) => {
      console.log('匯入開始');
      this.loading = true;
      let myObj = this;
      let obj = {};
      obj = {
        EXCELDATA: upload_data,
      };

      myObj.PPSService.importPPSINPTB02('1', obj).subscribe(
        (res) => {
          if (res['message'] === 'Y') {
            this.loading = false;
            this.sucessMSG('EXCCEL上傳成功', '');
            this.clearFile();
            this.getDataList();
          } else {
            this.errorMSG('匯入錯誤', res['message']);
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
      this.getDataList();
    });
  }

  convertToExcel() {
    this.loading = true;
    let fileName = `設備能力_直棒`;
    let outputDataList = [];
    for (let i = 0; i < this.rowData.length; i++) {
      var data = {
        shopCode: this.rowData[i].shopCode,
        equipGroup: this.rowData[i].equipGroup,
        equipCode: this.rowData[i].equipCode,
        processCode: this.rowData[i].processCode,
        gradeGroup: this.rowData[i].gradeGroup,
        shapeType: this.rowData[i].shapeType,
        inputDiaMax: this.rowData[i].inputDiaMax,
        capabilityDiaMin: this.rowData[i].capabilityDiaMin,
        capabilityDiaMax: this.rowData[i].capabilityDiaMax,
        capabilityLengthMin: this.rowData[i].capabilityLengthMin,
        capabilityLengthMax: this.rowData[i].capabilityLengthMax,
        optimalDiaMin: this.rowData[i].optimalDiaMin,
        optimalDiaMax: this.rowData[i].optimalDiaMax,
        optimalLengthMin: this.rowData[i].optimalLengthMin,
        optimalLengthMax: this.rowData[i].optimalLengthMax,
        optionEquip1: this.rowData[i].optionEquip1,
        optionEquip2: this.rowData[i].optionEquip2,
        optionEquip3: this.rowData[i].optionEquip3,
        optionEquip4: this.rowData[i].optionEquip4,
        optionEquip5: this.rowData[i].optionEquip5,
        optionEquip6: this.rowData[i].optionEquip6,
        optionEquip7: this.rowData[i].optionEquip7,
      };
      outputDataList.push(data);
    }
    this.excelService.exportAsExcelFile(
      outputDataList,
      fileName,
      this.titleArray
    );
    this.loading = false;
  }
}
