import { Component, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ExcelService } from 'src/app/services/common/excel.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridOptions,
} from 'ag-grid-community';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import { AGHeaderCommonParams, AGHeaderParams } from 'src/app/shared/ag-component/types';
import { Router } from '@angular/router';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';

interface ItemData {
  id: number;
  plantCode: string;
  shopCode: string;
  steelType: string;
  diaMin: number;
  diaMax: number;
  packCode: string;
  bestMachine: string;
  machine1: string;
  machine2: string;
  machine3: string;
  comment: string;
}

@Component({
  selector: 'app-PPSI103_NonBar',
  templateUrl: './PPSI103_NonBar.component.html',
  styleUrls: ['./PPSI103_NonBar.component.scss'],
  providers: [NzMessageService],
})
export class PPSI103_NonBarComponent implements AfterViewInit {
  thisTabName = '設備能力(PPSI103)';
  loading = false; //loaging data flag
  isErrorMsg = false;
  arrayBuffer: any;
  file: File;
  importdata = [];
  importdata_new = [];
  isERROR = false;
  errorTXT = [];
  customWidth;

  rowData: ItemData[] = [];
  userName: string;
  plantCode: string;
  shopCode = '';
  steelType = '';
  diaMin = 0;
  diaMax = 999;
  packCode = '';
  bestMachine = '';
  machine1 = '';
  machine2 = '';
  machine3 = '';
  comment: string;

  isVisibleCapability = false;

  private gridApi!: GridApi;
  public editType: 'fullRow' = 'fullRow';
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  agCustomHeaderParams : AGHeaderParams = {isMenuShow: true,}
  agCustomHeaderCommonParams : AGHeaderCommonParams = {agName: 'AGName1' , isSave:true ,path: this.router.url  }
  colDefs: ColDef[] = [
    {
      headerName: '站別',
      field: 'shopCode',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '鋼種',
      field: 'steelType',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '尺寸MIN',
      field: 'diaMin',
      width: 145,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '尺寸MAX',
      field: 'diaMax',
      width: 145,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '包裝碼',
      field: 'packCode',
      width: 130,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '最佳機台',
      field: 'bestMachine',
      width: 145,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '替代機台1',
      field: 'machine1',
      width: 150,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '替代機台2',
      field: 'machine2',
      width: 150,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '替代機台3',
      field: 'machine3',
      width: 150,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '備註',
      field: 'comment',
      width: 355,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: 'Action',
      field: 'id',
      width: 165,
      headerComponent : AGCustomHeaderComponent,
      headerComponentParams:this.agCustomHeaderParams,
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
    agCustomHeaderParams : {
      agName: 'AGName1' , // AG 表名
      isSave:true ,
      path: this.router.url ,
    },
  };

  constructor(
    private elementRef: ElementRef,
    private PPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private renderer: Renderer2,
    private systemService : SYSTEMService,
    private router: Router
  ) {
    this.i18n.setLocale(zh_TW);
    this.userName = this.cookieService.getCookie('USERNAME');
    this.plantCode = this.cookieService.getCookie('plantCode');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewChecked');
    this.getDataList();
    const aI103NTab = this.elementRef.nativeElement.querySelector(
      '#aI103N'
    ) as HTMLAnchorElement;
    const liI103NTab = this.elementRef.nativeElement.querySelector(
      '#liI103N'
    ) as HTMLLIElement;
    liI103NTab.style.backgroundColor = '#E4E3E3';
    aI103NTab.style.cssText = 'color: blue; font-weight:bold;';
    this.getDbCloumn();
  }

  onInit() {
    this.shopCode = null;
    this.steelType = null;
    this.diaMin = 0;
    this.diaMax = 999;
    this.packCode = null;
    this.bestMachine = null;
    this.machine1 = null;
    this.machine2 = null;
    this.machine3 = null;
    this.comment = null;
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_new = [];
    this.isERROR = false;
    this.errorTXT = [];
  }

  //調用DB欄位
  getDbCloumn(){
    this.systemService.getHeaderComponentStatus(this.agCustomHeaderCommonParams).subscribe(res=>{
      let result:any = res ;
      if(result.code === 200) {
        console.log(result) ;
        if (result.data.length > 0) {
          //拿到DB數據 ，複製到靜態數據
          this.colDefs.forEach((item)=>{
            result.data.forEach((it) => {
               if(item.field === it.colId) {
                 item.width = it.width;
                 item.hide = it.hide ;
                 item.resizable = it.resizable;
                 item.sortable = it.sortable ;
                 item.filter = it.filter ;
                 item.sortIndex = it.sortIndex ;
               }
            })
          })
          this.colDefs.sort((a, b) => (a.sortIndex < b.sortIndex ? -1 : 1));
          console.log()
          this.gridOptions.api.setColumnDefs(this.colDefs) ;   
        }
      } else {
        this.message.error("load error")
      }
    });
  }

  getDataList() {
    this.loading = true;
    this.PPSService.getPPSINPTB02('2').subscribe((res: any) => {
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
    } else if (this.steelType === undefined) {
      this.message.create('error', '「鋼種」不可為空');
    } else if (this.diaMin === undefined) {
      this.message.create('error', '「尺寸MIN」不可為空');
    } else if (this.diaMax === undefined) {
      this.message.create('error', '「尺寸MAX」不可為空');
    } else if (this.packCode === undefined) {
      this.message.create('error', '「包裝碼」不可為空');
    } else if (this.bestMachine === undefined) {
      this.message.create('error', '「最佳機台」不可為空');
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave();
        },
      });
    }
  }

  insertSave() {
    this.loading = true;

    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        plantCode: this.plantCode,
        shopCode: this.shopCode,
        steelType: this.steelType,
        diaMin: this.diaMin,
        diaMax: this.diaMax,
        packCode: this.packCode,
        bestMachine: this.bestMachine,
        machine1: this.machine1,
        machine2: this.machine2,
        machine3: this.machine3,
        comment: this.comment,
        userCreate: this.userName,
      });

      this.PPSService.insertPPSINPTB02('2', obj).subscribe(
        (res) => {
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

  updateById(params: any) {
    this.loading = true;
    this.gridApi.stopEditing();
    let preUpdateData = {
      id: this.rowData[params.rowIndex].id,
      plantCode: this.rowData[params.rowIndex].plantCode,
      shopCode: this.rowData[params.rowIndex].shopCode,
      steelType: this.rowData[params.rowIndex].steelType,
      diaMin: this.rowData[params.rowIndex].diaMin,
      diaMax: this.rowData[params.rowIndex].diaMax,
      packCode: this.rowData[params.rowIndex].packCode,
      bestMachine: this.rowData[params.rowIndex].bestMachine,
      machine1: this.rowData[params.rowIndex].machine1,
      machine2: this.rowData[params.rowIndex].machine2,
      machine3: this.rowData[params.rowIndex].machine3,
      comment: this.rowData[params.rowIndex].comment,
      userName: this.userName,
    };
    this.PPSService.updatePPSINPTB02('2', preUpdateData).subscribe(
      (res) => {
        if (res['message'] === 'Y') {
          this.onInit();
          this.sucessMSG('修改成功', ``);
          this.getDataList();
        } else {
          this.errorMSG('修改失敗', res['message']);
        }
      },
      (err) => {
        this.errorMSG(
          '修改失敗',
          '後台修改錯誤，請聯繫系統工程師' + err['message']
        );
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
    return new Promise((resolve, reject) => {
      this.PPSService.deletePPSINPTB02('2', params.id).subscribe(
        (res) => {
          if (res['message'] === 'Y') {
            this.sucessMSG('刪除成功', ``);
            this.getDataList();
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG(
            '刪除失敗',
            '後台刪除錯誤，請聯繫系統工程師' + err['message']
          );
          this.loading = false;
        }
      );
    });
  }

  //convert to Excel and Download
  convertToExcel() {
    this.loading = true;
    let data;
    let fileName;
    let titleArray = [];
    if (this.rowData.length > 0) {
      data = this.formatDataForExcel(this.rowData);
      fileName = `設備能力_非直棒`;
      titleArray = [
        '廠區別',
        '站別',
        '鋼種',
        '尺寸MIN',
        '尺寸MAX',
        '包裝碼',
        '最佳機台',
        '替代機台1',
        '替代機台2',
        '替代機台3',
        '備註',
      ];
    } else {
      this.errorMSG('匯出失敗', '非直棒設備能力表目前無資料');
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
        plantCode: _.get(item, 'plantCode'),
        shopCode: _.get(item, 'shopCode'),
        steelType: _.get(item, 'steelType'),
        diaMin: _.get(item, 'diaMin'),
        diaMax: _.get(item, 'diaMax'),
        packCode: _.get(item, 'packCode'),
        bestMachine: _.get(item, 'bestMachine'),
        machine1: _.get(item, 'machine1'),
        machine2: _.get(item, 'machine2'),
        machine3: _.get(item, 'machine3'),
        comment: _.get(item, 'comment'),
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

  clearFile() {
    document.getElementsByTagName('input')[0].value = '';
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
      worksheet.I1 === undefined ||
      worksheet.J1 === undefined ||
      worksheet.K1 === undefined
    ) {
      this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
      this.clearFile();
      return;
    } else if (
      worksheet.A1.v !== '廠區別' ||
      worksheet.B1.v !== '站別' ||
      worksheet.C1.v !== '鋼種' ||
      worksheet.D1.v !== '尺寸MIN' ||
      worksheet.E1.v !== '尺寸MAX' ||
      worksheet.F1.v !== '包裝碼' ||
      worksheet.G1.v !== '最佳機台' ||
      worksheet.H1.v !== '替代機台1' ||
      worksheet.I1.v !== '替代機台2' ||
      worksheet.J1.v !== '替代機台3' ||
      worksheet.K1.v !== '備註'
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
      let plantCode = _data[i].廠區別;
      let shopCode = _data[i].站別;
      let steelType = _data[i].鋼種;
      let diaMin = _data[i].尺寸MIN;
      let diaMax = _data[i].尺寸MAX;
      let packCode = _data[i].包裝碼;
      let bestMachine = _data[i].最佳機台;
      if (
        plantCode === undefined ||
        shopCode === undefined ||
        steelType === undefined ||
        diaMin === undefined ||
        diaMax === undefined ||
        bestMachine === undefined
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
        let plantCode = _data[i].廠區別.toString();
        let shopCode = _data[i].站別.toString();
        let steelType = _data[i].鋼種.toString();
        let diaMin =
          _data[i].尺寸MIN !== undefined ? _data[i].尺寸MIN.toString() : '0';
        let diaMax =
          _data[i].尺寸MAX !== undefined ? _data[i].尺寸MAX.toString() : '999';
        let packCode =
          _data[i].包裝碼 !== undefined ? _data[i].包裝碼.toString() : '';
        let bestMachine = _data[i].最佳機台.toString();
        let machine1 =
          _data[i].替代機台1 !== undefined ? _data[i].替代機台1.toString() : '';
        let machine2 =
          _data[i].替代機台2 !== undefined ? _data[i].替代機台2.toString() : '';
        let machine3 =
          _data[i].替代機台3 !== undefined ? _data[i].替代機台3.toString() : '';
        let comment =
          _data[i].備註 !== undefined ? _data[i].備註.toString() : '';

        this.importdata_new.push({
          plantCode: plantCode,
          shopCode: shopCode,
          steelType: steelType,
          diaMin: diaMin,
          diaMax: diaMax,
          packCode: packCode,
          bestMachine: bestMachine,
          machine1: machine1,
          machine2: machine2,
          machine3: machine3,
          comment: comment,
        });
      }

      return new Promise((resolve, reject) => {
        this.loading = true;
        let myObj = this;
        let obj = {};
        _.extend(obj, {
          EXCELDATA: this.importdata_new,
          USERCODE: this.userName,
        });
        myObj.PPSService.importPPSINPTB02('2', obj).subscribe(
          (res) => {
            if (res['message'] === 'Y') {
              this.loading = false;
              this.loading = false;

              this.sucessMSG('EXCCEL上傳成功', '');
              this.getDataList();
              this.clearFile();
              this.onInit();
            } else {
              this.errorMSG('匯入錯誤', res['message']);
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
    this.onInit();
  }
}
