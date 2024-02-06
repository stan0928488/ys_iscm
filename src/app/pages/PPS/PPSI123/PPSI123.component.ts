import { AfterViewInit, Component, ElementRef } from '@angular/core';
import {
  ColDef,
  ColGroupDef
} from 'ag-grid-community';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { CommonService } from 'src/app/services/common/common.service';
import { CookieService } from 'src/app/services/config/cookie.service';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import * as XLSX from 'xlsx';
import { BtnCellRenderer } from '../../RENDERER/BtnCellRenderer.component';
import { AGHeaderCommonParams, AGHeaderParams } from 'src/app/shared/ag-component/types';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';
import { Router } from '@angular/router';

interface ItemData20 {
  id: string;
  tab20ID: number;
  EQUIP_CODE_20: string;
  KIND_TYPE_20: string;
  OUTPUT_SHAPE_20: number;
  PROCESS_CODE_20: string;
  FINAL_PROCESS_20: string;
  SCHE_TYPE_20: string;
}

@Component({
  selector: 'app-PPSI123',
  templateUrl: './PPSI123.component.html',
  styleUrls: ['./PPSI123.component.scss'],
  providers: [NzMessageService],
})
export class PPSI123Component implements AfterViewInit {
  
  frameworkComponents: any;
  thisTabName = "直棒清洗站設備能力(PPSI123)";
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  // 清洗站設備能力表
  tab20ID;
  EQUIP_CODE_20;
  KIND_TYPE_20;
  OUTPUT_SHAPE_20;
  PROCESS_CODE_20;
  FINAL_PROCESS_20;
  SCHE_TYPE_20;
  isVisibleWash = false;
  searchEquipCode20Value = '';
  searchKindType20Value = '';
  searchOutputShape20Value = '';
  searchProcessCode20Value = '';
  searchFinalProcess20Value = '';
  searchScheType20Value = '';

  isSpinning = false;
  excelImportFile: File = null;

  agCustomHeaderParams : AGHeaderParams = {isMenuShow: true,}
  agCustomHeaderCommonParams : AGHeaderCommonParams = {agName: 'AGName1' , isSave:true ,path: this.router.url  }
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

  columnDefs: ColDef[] = [
    {headerComponent: AGCustomHeaderComponent,headerName: '機台',field: 'EQUIP_CODE_20',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '產品種類',field: 'KIND_TYPE_20',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '產出型態',field: 'OUTPUT_SHAPE_20',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '製程碼',field: 'PROCESS_CODE_20',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: 'FINAL_製程',field: 'FINAL_PROCESS_20',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '抽數別',field: 'SCHE_TYPE_20',filter: true,width: 120,editable: true},

    {
      width: 150,
      headerName: 'Action',
      editable: false,
      headerComponent : AGCustomHeaderComponent,
      headerComponentParams:this.agCustomHeaderParams,
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

  constructor(
    private elementRef:ElementRef,
    private PPSService: PPSService,
    private commonService: CommonService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private systemService : SYSTEMService,
    private router: Router
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
    this.getPPSINP20List();
    
    const liI123Tab = this.elementRef.nativeElement.querySelector('#liI123') as HTMLLIElement;
    const aI123Tab = this.elementRef.nativeElement.querySelector('#aI123') as HTMLAnchorElement;
    liI123Tab.style.backgroundColor = '#E4E3E3';
    aI123Tab.style.cssText = 'color: blue; font-weight:bold;';
    this.getDbCloumn();
  }

  PPSINP20List_tmp;
  PPSINP20List: ItemData20[] = [];
  editCache20: { [key: string]: { edit: boolean; data: ItemData20 } } = {};
  displayPPSINP20List: ItemData20[] = [];
  getPPSINP20List() {
    this.loading = true;
    this.isSpinning = true;
    let myObj = this;
    this.PPSService.getPPSINP20List().subscribe((res) => {
      this.PPSINP20List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP20List_tmp.length; i++) {
        data.push({
          id: `${i}`,
          tab20ID: this.PPSINP20List_tmp[i].ID,
          EQUIP_CODE_20: this.PPSINP20List_tmp[i].EQUIP_CODE,
          KIND_TYPE_20: this.PPSINP20List_tmp[i].KIND_TYPE,
          OUTPUT_SHAPE_20: this.PPSINP20List_tmp[i].OUTPUT_SHAPE,
          PROCESS_CODE_20: this.PPSINP20List_tmp[i].PROCESS_CODE,
          FINAL_PROCESS_20: this.PPSINP20List_tmp[i].FINAL_PROCESS,
          SCHE_TYPE_20: this.PPSINP20List_tmp[i].SCHE_TYPE,
        });
      }
      this.PPSINP20List = data;
      this.displayPPSINP20List = this.PPSINP20List;
      this.updateEditCache();
      myObj.loading = false;
      this.isSpinning = false;
    });
  }

  //調用DB欄位
  getDbCloumn(){
    this.systemService.getHeaderComponentStatus(this.agCustomHeaderCommonParams).subscribe(res=>{
      let result:any = res ;
      if(result.code === 200) {
        console.log(result) ;
        if (result.data.length > 0) {
          //拿到DB數據 ，複製到靜態數據
          this.columnDefs.forEach((item)=>{
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
          this.columnDefs.sort((a, b) => (a.sortIndex < b.sortIndex ? -1 : 1));
          console.log()
          this.gridOptions.api.setColumnDefs(this.columnDefs) ;   
        }
      } else {
        this.message.error("load error")
      }
    });
  }

  // insert
  insertTab() {
    let myObj = this;
    if (this.EQUIP_CODE_20 === undefined) {
      myObj.message.create('error', '「機台」不可為空');
      return;
    } else if (this.KIND_TYPE_20 === undefined) {
      myObj.message.create('error', '「產品種類」不可為空');
      return;
    } else if (this.OUTPUT_SHAPE_20 === undefined) {
      myObj.message.create('error', '「產出型態」不可為空');
      return;
    } else if (this.PROCESS_CODE_20 === undefined) {
      myObj.message.create('error', '「製程碼」不可為空');
      return;
    } else if (this.FINAL_PROCESS_20 === undefined) {
      myObj.message.create('error', '「FINAL_製程」不可為空');
      return;
    } else if (this.SCHE_TYPE_20 === undefined) {
      myObj.message.create('error', '「抽數別」不可為空');
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

  // update
  editRow(id: string): void {
    this.editCache20[id].edit = true;
  }

  // delete
  deleteRow(rowData: ItemData20): void {
    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        this.delID(rowData);
      },
      nzOnCancel: () => console.log('cancel'),
    });
  }

  // cancel
  cancelEdit(id: string): void {
    const index = this.PPSINP20List.findIndex((item) => item.id === id);
    this.editCache20[id] = {
      data: { ...this.PPSINP20List[index] },
      edit: false,
    };
  }

  // update Save
  saveEdit(rowData: ItemData20): void {
    let myObj = this;
    if (rowData.EQUIP_CODE_20 === undefined) {
      myObj.message.create('error', '「機台」不可為空');
      return;
    } else if (rowData.KIND_TYPE_20 === undefined) {
      myObj.message.create('error', '「產品種類」不可為空');
      return;
    } else if (rowData.OUTPUT_SHAPE_20 === undefined) {
      myObj.message.create('error', '「產出型態」不可為空');
      return;
    } else if (rowData.PROCESS_CODE_20 === undefined) {
      myObj.message.create('error', '「製程碼」不可為空');
      return;
    } else if (rowData.FINAL_PROCESS_20 === undefined) {
      myObj.message.create('error', '「FINAL_製程」不可為空');
      return;
    } else if (rowData.SCHE_TYPE_20 === undefined) {
      myObj.message.create('error', '「抽數別」不可為空');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.updateSave(rowData);
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }

  // update
  updateEditCache(): void {
    this.PPSINP20List.forEach((item) => {
      this.editCache20[item.id] = {
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
        EQUIP_CODE: this.EQUIP_CODE_20,
        KIND_TYPE: this.KIND_TYPE_20,
        OUTPUT_SHAPE: this.OUTPUT_SHAPE_20,
        PROCESS_CODE: this.PROCESS_CODE_20,
        FINAL_PROCESS: this.FINAL_PROCESS_20,
        SCHE_TYPE: this.SCHE_TYPE_20,
        USERNAME: this.USERNAME,
        DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
      });

      myObj.PPSService.insertI120Tab1Save(obj).subscribe(
        (res) => {
          console.log(res);
          if (res[0].MSG === 'Y') {
            this.EQUIP_CODE_20 = undefined;
            this.KIND_TYPE_20 = undefined;
            this.OUTPUT_SHAPE_20 = undefined;
            this.PROCESS_CODE_20 = undefined;
            this.FINAL_PROCESS_20 = undefined;
            this.SCHE_TYPE_20 = undefined;
            this.getPPSINP20List();
            this.sucessMSG('新增成功', ``);
            this.isVisibleWash = false;
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

  // 修改資料
  updateSave(rowData:ItemData20) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID: rowData.tab20ID,
        EQUIP_CODE: rowData.EQUIP_CODE_20,
        KIND_TYPE: rowData.KIND_TYPE_20,
        OUTPUT_SHAPE: rowData.OUTPUT_SHAPE_20,
        PROCESS_CODE: rowData.PROCESS_CODE_20,
        FINAL_PROCESS: rowData.FINAL_PROCESS_20,
        SCHE_TYPE: rowData.SCHE_TYPE_20,
        USERNAME: this.USERNAME,
        DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
      myObj.PPSService.updateI120Tab1Save(obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.EQUIP_CODE_20 = undefined;
            this.KIND_TYPE_20 = undefined;
            this.OUTPUT_SHAPE_20 = undefined;
            this.PROCESS_CODE_20 = undefined;
            this.FINAL_PROCESS_20 = undefined;
            this.SCHE_TYPE_20 = undefined;

            this.sucessMSG('修改成功', ``);

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
  delID(rowData:ItemData20) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let _ID = rowData.tab20ID;
      myObj.PPSService.delI120Tab1Data(_ID).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.EQUIP_CODE_20 = undefined;
            this.KIND_TYPE_20 = undefined;
            this.OUTPUT_SHAPE_20 = undefined;
            this.PROCESS_CODE_20 = undefined;
            this.FINAL_PROCESS_20 = undefined;
            this.SCHE_TYPE_20 = undefined;

            this.sucessMSG('刪除成功', ``);
            this.getPPSINP20List();
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
  // 新增清洗站設備能力表之彈出視窗
  openWashInput(): void {
    this.isVisibleWash = true;
  }
  // 取消清洗站設備能力表之彈出視窗
  cancelWashInput(): void {
    this.isVisibleWash = false;
  }

  //=============================================
  // Excel 匯入、匯出
  //=============================================

  // excel檔案
  incomingFile($event: any) {
    this.excelImportFile = $event.target.files[0];
    let lastname = this.excelImportFile.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      (<HTMLInputElement>document.getElementById('importExcel')).value = '';
      return;
    }
  }

  // Excel 匯入
  jsonExcelData: any[] = [];
  handleImport() {
    const fileValue = (<HTMLInputElement>document.getElementById('importExcel'))
      .value;
    if (fileValue === '') {
      this.errorMSG('無檔案', '請先選擇欲上傳檔案。');
      (<HTMLInputElement>document.getElementById('importExcel')).value = '';
      return;
    }

    const reader = new FileReader();

    // 文件加載完成後調用
    reader.onload = (e: any) => {
      this.isSpinning = true;

      // 從檔案獲取原始資料
      let data = e.target.result;

      // 從原始資料獲取工作簿
      // 兼容IE，需把type改為binary，並對data進行轉化
      let workbook = XLSX.read(data, {
        type: 'binary',
      });

      const sheets = workbook.SheetNames;

      if (sheets.length) {
        var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]], {
          defval: '', // 單元格為空的預設值
        });
        this.jsonExcelData = jsonData;

        if (this.jsonExcelData.length != 0) {
          this.importExcel();
        } else {
          this.errorMSG('匯入失敗', `此檔案無任何數據`);
          this.isSpinning = false;
        }
      }
    };
    // 加載文件
    reader.readAsArrayBuffer(this.excelImportFile);
  }

  importExcel(): void {
    // 檢查欄位名稱是否都正確
    if (!this.checkExcelHeader(this.jsonExcelData[0])) {
      this.errorMSG(
        '檔案欄位表頭錯誤',
        '請先匯出檔案後，再透過該檔案調整上傳。'
      );
      this.isSpinning = false;
      (<HTMLInputElement>document.getElementById('importExcel')).value = '';
      return;
    }
    console.log('匯入的Excle欄位名稱皆正確');

    // 校驗每個Excel欄位是否都有填寫
    if (!this.checkAllValuesNotEmpty(this.jsonExcelData)) {
      this.isSpinning = false;
      (<HTMLInputElement>document.getElementById('importExcel')).value = '';
      return;
    }
    console.log('匯入的Excle特定的欄位都有填寫');

    // 將jsonData轉成英文的key
    this.convertJsonToEnglishKey();

    // 校驗Excel中的資料是否有重複
    if (this.commonService.checkExcelDataDuplicate(this.jsonExcelData)) {
      this.isSpinning = false;
      (<HTMLInputElement>document.getElementById('importExcel')).value = '';
      return;
    }
    console.log('匯入的Excle中的資料皆無重複');

    // 將資料全刪除，再匯入EXCEL檔內的資料
    this.barchInsertExcelData()
    .then((barchInsertSuccess) => {
        this.sucessMSG(barchInsertSuccess, ``);
        this.getPPSINP20List();
      })
    .catch(function (error) {
      this.isSpinning = false;
      this.errorMSG(error, ``);
    });
    (<HTMLInputElement>document.getElementById('importExcel')).value = '';
  }

  barchInsertExcelData() {
    const myThis = this;
    return new Promise(function (resolve, reject) {
      myThis.PPSService.batchSaveI120Data(myThis.jsonExcelData).subscribe(
        (response) => {
          if (response.code === 200) {
            resolve('匯入成功');
          } else {
            reject(response.success);
          }
        },
        (error) => {
          reject(
            `匯入失敗，後台匯入錯誤，請聯繫系統工程師。Error Msg : ${JSON.stringify(
              error['error']
            )}`
          );
        }
      );
    });
  }

  deleteAllData() {
    const myThis = this;
    return new Promise(function (resolve, reject) {
      myThis.PPSService.deleteI120AllData().subscribe(
        (response) => {
          if (response.success === true) {
            resolve('刪除所有資料成功');
          } else {
            reject(response.message);
          }
        },
        (error) => {
          reject(
            `匯入失敗，後台匯入錯誤，請聯繫系統工程師。Error Msg : ${JSON.stringify(
              error['error']
            )}`
          );
        }
      );
    });
  }

  convertJsonToEnglishKey(): void {
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"機台":').join('"EQUIP_CODE":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"產品種類":')
        .join('"KIND_TYPE":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"產出型態":')
        .join('"OUTPUT_SHAPE":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"製程碼":')
        .join('"PROCESS_CODE":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"FINAL_製程":')
        .join('"FINAL_PROCESS":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"抽數別":').join('"SCHE_TYPE":')
    );
  }

  checkAllValuesNotEmpty(jsonExcelData): boolean {
    for (let i = 1; i <= jsonExcelData.length; i++) {
      let rowNumberInExcel = i + 1;
      if (
        _.isEmpty(String(jsonExcelData[i - 1]['機台'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['機台']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「機台」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['產品種類'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['產品種類']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「產品種類」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(
          String(jsonExcelData[i - 1]['產出型態'])
        ) /*|| _.isEqual(String(jsonExcelData[i-1]["產出型態"]), '-')*/
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「產出型態」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(
          String(jsonExcelData[i - 1]['製程碼'])
        ) /*|| _.isEqual(String(jsonExcelData[i-1]["製程碼"]), '-')*/
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「製程碼」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(
          String(jsonExcelData[i - 1]['FINAL_製程'])
        ) /*|| _.isEqual(String(jsonExcelData[i-1]["FINAL_製程"]), '-')*/
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「FINAL_製程」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(
          String(jsonExcelData[i - 1]['抽數別'])
        ) /*|| _.isEqual(String(jsonExcelData[i-1]["抽數別"]), '-')*/
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「抽數別」不得為空，請修正`
        );
        return false;
      }
    } // end for

    return true;
  }

  checkExcelHeader(d): boolean {
    let b1 = false;
    let b2 = false;
    let b3 = false;
    let b4 = false;
    let b5 = false;
    let b6 = false;

    const keys = Object.keys(d);
    if (keys.length !== 6) return false;

    keys.forEach((k) => {
      if (k === '機台') b1 = true;
      else if (k === '產品種類') b2 = true;
      else if (k === '產出型態') b3 = true;
      else if (k === '製程碼') b4 = true;
      else if (k === 'FINAL_製程') b5 = true;
      else if (k === '抽數別') b6 = true;
    });

    return b1 && b2 && b3 && b4 && b5 && b6;
  }

  // Excel 匯出
  exportToExcel() {
    this.isSpinning = true;

    const exportJsonDataList = this.displayPPSINP20List.map((obj) => {
      return _.omit(obj, ['id', 'tab20ID']);
    });

    const firstRow = [
      'EQUIP_CODE_20',
      'KIND_TYPE_20',
      'OUTPUT_SHAPE_20',
      'PROCESS_CODE_20',
      'FINAL_PROCESS_20',
      'SCHE_TYPE_20',
    ];
    const firstRowDisplay = {
      EQUIP_CODE_20: '機台',
      KIND_TYPE_20: '產品種類',
      OUTPUT_SHAPE_20: '產出型態',
      PROCESS_CODE_20: '製程碼',
      FINAL_PROCESS_20: 'FINAL_製程',
      SCHE_TYPE_20: '抽數別',
    };
    const exportData = [firstRowDisplay, ...exportJsonDataList];

    const workSheet = XLSX.utils.json_to_sheet(exportData, {
      header: firstRow,
      skipHeader: true,
    });
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
    XLSX.writeFileXLSX(workBook, '直棒清洗站設備能力.xlsx');

    this.isSpinning = false;
    this.sucessMSG('匯出成功!', ``);
  }

  onBtnClick1(e) {
    e.params.api.setFocusedCell(e.params.node.rowIndex, 'EQUIP_CODE_20');
    e.params.api.startEditingCell({
      rowIndex: e.params.node.rowIndex,
      colKey: 'EQUIP_CODE_20',
    });
  }

  onBtnClick2(e) {
    this.saveEdit(e.rowData)
  }

  onBtnClick3(e) {
  }

  onBtnClick4(e) {
    this.deleteRow(e.rowData)
  }

}
