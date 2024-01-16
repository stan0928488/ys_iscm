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

interface ItemData10 {
  id: string;
  tab10ID: number;
  SHOP_CODE_10: string;
  EQUIP_CODE_10: string;
  GRADE_NO_10: string;
  LENGTH_MIN_10: number;
  LENGTH_MAX_10: number;
  DIA_MIN_10: number;
  DIA_MAX_10: number;
  TOTAL_TIMES_10: number;
  PICKLING_TIMES_10: number;
  WASHING_TIMES_10: number;
  DRAINING_TIMES_10: number;
  BATCH_CNT_10: number;
}

@Component({
  selector: 'app-PPSI122',
  templateUrl: './PPSI122.component.html',
  styleUrls: ['./PPSI122.component.scss'],
  providers: [NzMessageService],
})
export class PPSI122Component implements AfterViewInit {
  
  frameworkComponents: any;
  thisTabName = "直棒桶槽式工時(PPSI122)";
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  // 桶槽式工時
  SHOP_CODE_10;
  EQUIP_CODE_10;
  GRADE_NO_10;
  LENGTH_MIN_10;
  LENGTH_MAX_10;
  DIA_MIN_10;
  DIA_MAX_10;
  TOTAL_TIMES_10;
  PICKLING_TIMES_10;
  WASHING_TIMES_10;
  DRAINING_TIMES_10;
  BATCH_CNT_10;
  isVisibleOtherShop = false;
  searchShopCode10Value = '';
  searchEquipCode10Value = '';
  searchGradeNo10Value = '';
  searchLengthMin10Value = '';
  searchLengthMax10Value = '';
  searchDiaMin10Value = '';
  searchDiaMax10Value = '';
  searchTotalTimes10Value = '';
  searchPicklingTimes10Value = '';
  searchWashingTimes10Value = '';
  searchDrainingTimes10Value = '';
  searchBatchCnt10Value = '';

  isSpinning = false;
  excelImportFile: File;

  gridOptions = {
    defaultColDef: {
      editable: true,
      sortable: false,
      resizable: true,
      filter: true,
    },
    api: null,
  };

  columnDefs: (ColDef | ColGroupDef)[] = [
    {headerComponent: AGCustomHeaderComponent,headerName: '站號',field: 'SHOP_CODE_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '機台碼',field: 'EQUIP_CODE_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '鋼種',field: 'GRADE_NO_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '長度-最小值(mm)',field: 'LENGTH_MIN_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '長度-最大值(mm)',field: 'LENGTH_MAX_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '尺寸最小',field: 'DIA_MIN_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '尺寸最大',field: 'DIA_MAX_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '總時間(分/批)',field: 'TOTAL_TIMES_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '浸酸時間(分/批)',field: 'PICKLING_TIMES_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '清洗時間(分/批)',field: 'WASHING_TIMES_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '瀝乾時間(分/批)',field: 'DRAINING_TIMES_10',filter: true,width: 120,editable: true},
    {headerComponent: AGCustomHeaderComponent,headerName: '投入上限值(捆/批)',field: 'BATCH_CNT_10',filter: true,width: 120,editable: true},
    {
      width: 150,
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

  constructor(
    private elementRef:ElementRef,
    private PPSService: PPSService,
    private commonService: CommonService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService
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
    this.getPPSINP10List();
    
    const liI122Tab = this.elementRef.nativeElement.querySelector('#liI122') as HTMLLIElement;
    const aI122Tab = this.elementRef.nativeElement.querySelector('#aI122') as HTMLAnchorElement;
    liI122Tab.style.backgroundColor = '#E4E3E3';
    aI122Tab.style.cssText = 'color: blue; font-weight:bold;';
  }

  PPSINP10List_tmp;
  PPSINP10List: ItemData10[] = [];
  editCache10: { [key: string]: { edit: boolean; data: ItemData10 } } = {};
  displayPPSINP10List: ItemData10[] = [];
  getPPSINP10List() {
    this.isSpinning = true;
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP10List().subscribe((res) => {
      console.log('getFCPTB26List success');
      this.PPSINP10List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP10List_tmp.length; i++) {
        data.push({
          id: `${i}`,
          tab10ID: this.PPSINP10List_tmp[i].ID,
          SHOP_CODE_10: this.PPSINP10List_tmp[i].SHOP_CODE,
          EQUIP_CODE_10: this.PPSINP10List_tmp[i].EQUIP_CODE,
          GRADE_NO_10: this.PPSINP10List_tmp[i].GRADE_NO,
          LENGTH_MIN_10: this.PPSINP10List_tmp[i].LENGTH_MIN,
          LENGTH_MAX_10: this.PPSINP10List_tmp[i].LENGTH_MAX,
          DIA_MIN_10: this.PPSINP10List_tmp[i].DIA_MIN,
          DIA_MAX_10: this.PPSINP10List_tmp[i].DIA_MAX,
          TOTAL_TIMES_10: this.PPSINP10List_tmp[i].TOTAL_TIMES,
          PICKLING_TIMES_10: this.PPSINP10List_tmp[i].PICKLING_TIMES,
          WASHING_TIMES_10: this.PPSINP10List_tmp[i].WASHING_TIMES,
          DRAINING_TIMES_10: this.PPSINP10List_tmp[i].DRAINING_TIMES,
          BATCH_CNT_10: this.PPSINP10List_tmp[i].BATCH_CNT,
        });
      }
      this.PPSINP10List = data;
      this.displayPPSINP10List = this.PPSINP10List;
      this.updateEditCache();
      console.log(this.PPSINP10List);
      myObj.loading = false;
      myObj.isSpinning = false;
    });
  }

  // insert
  insertTab() {
    let myObj = this;
    if (this.SHOP_CODE_10 === undefined) {
      myObj.message.create('error', '「站號」不可為空');
      return;
    } else if (this.EQUIP_CODE_10 === undefined) {
      myObj.message.create('error', '「機台碼」不可為空');
      return;
    } else if (this.GRADE_NO_10 === undefined) {
      myObj.message.create('error', '「鋼種」不可為空');
      return;
    } else if (this.LENGTH_MIN_10 === undefined) {
      myObj.message.create('error', '「長度最小值」不可為空');
      return;
    } else if (this.LENGTH_MAX_10 === undefined) {
      myObj.message.create('error', '「長度最大值」不可為空');
      return;
    } else if (this.DIA_MIN_10 === undefined) {
      myObj.message.create('error', '「最小尺寸」不可為空');
      return;
    } else if (this.DIA_MAX_10 === undefined) {
      myObj.message.create('error', '「最大尺寸」不可為空');
      return;
    } else if (this.TOTAL_TIMES_10 === undefined) {
      myObj.message.create('error', '「總時間(分/批)」不可為空');
      return;
    } else if (this.PICKLING_TIMES_10 === undefined) {
      myObj.message.create('error', '「浸酸時間(分/批)」不可為空');
      return;
    } else if (this.WASHING_TIMES_10 === undefined) {
      myObj.message.create('error', '「清洗時間(分/批)」不可為空');
      return;
    } else if (this.DRAINING_TIMES_10 === undefined) {
      myObj.message.create('error', '「瀝乾時間(分/批)」不可為空');
      return;
    } else if (this.BATCH_CNT_10 === undefined) {
      myObj.message.create('error', '「投入上限值(捆/批)」不可為空');
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
    this.editCache10[id].edit = true;
  }

  // delete
  deleteRow(rowData: ItemData10): void {
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
    const index = this.PPSINP10List.findIndex((item) => item.id === id);
    this.editCache10[id] = {
      data: { ...this.PPSINP10List[index] },
      edit: false,
    };
  }

  // update Save
  saveEdit(rowData: ItemData10): void {
    let myObj = this;
    if (rowData.SHOP_CODE_10 === undefined) {
      myObj.message.create('error', '「站號」不可為空');
      return;
    } else if (rowData.EQUIP_CODE_10 === undefined) {
      myObj.message.create('error', '「機台碼」不可為空');
      return;
    } else if (rowData.GRADE_NO_10 === undefined) {
      myObj.message.create('error', '「鋼種」不可為空');
      return;
    } else if (rowData.LENGTH_MIN_10 === undefined) {
      myObj.message.create('error', '「長度最小值」不可為空');
      return;
    } else if (rowData.LENGTH_MAX_10 === undefined) {
      myObj.message.create('error', '「長度最大值」不可為空');
      return;
    } else if (rowData.DIA_MIN_10 === undefined) {
      myObj.message.create('error', '「最小尺寸」不可為空');
      return;
    } else if (rowData.DIA_MAX_10 === undefined) {
      myObj.message.create('error', '「最大尺寸」不可為空');
      return;
    } else if (rowData.TOTAL_TIMES_10 === undefined) {
      myObj.message.create('error', '「總時間」不可為空');
      return;
    } else if (rowData.PICKLING_TIMES_10 === undefined) {
      myObj.message.create('error', '「浸酸時間」不可為空');
      return;
    } else if (rowData.WASHING_TIMES_10 === undefined) {
      myObj.message.create('error', '「清洗時間」不可為空');
      return;
    } else if (rowData.DRAINING_TIMES_10 === undefined) {
      myObj.message.create('error', '「瀝乾時間」不可為空');
      return;
    } else if (rowData.DIA_MAX_10 === undefined) {
      myObj.message.create('error', '「投入上限值」不可為空');
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
    this.PPSINP10List.forEach((item) => {
      this.editCache10[item.id] = {
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
        SHOP_CODE: this.SHOP_CODE_10,
        EQUIP_CODE: this.EQUIP_CODE_10,
        GRADE_NO: this.GRADE_NO_10,
        LENGTH_MIN: this.LENGTH_MIN_10,
        LENGTH_MAX: this.LENGTH_MAX_10,
        DIA_MIN: this.DIA_MIN_10,
        DIA_MAX: this.DIA_MAX_10,
        TOTAL_TIMES: this.TOTAL_TIMES_10,
        PICKLING_TIMES: this.PICKLING_TIMES_10,
        WASHING_TIMES: this.WASHING_TIMES_10,
        DRAINING_TIMES: this.DRAINING_TIMES_10,
        BATCH_CNT: this.BATCH_CNT_10,

        USERNAME: this.USERNAME,
        DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
      });

      myObj.PPSService.insertI110Tab1Save(obj).subscribe(
        (res) => {
          console.log(res);
          if (res[0].MSG === 'Y') {
            this.SHOP_CODE_10 = undefined;
            this.EQUIP_CODE_10 = undefined;
            this.GRADE_NO_10 = undefined;
            this.LENGTH_MIN_10 = undefined;
            this.LENGTH_MAX_10 = undefined;
            this.DIA_MIN_10 = undefined;
            this.DIA_MAX_10 = undefined;
            this.TOTAL_TIMES_10 = undefined;
            this.PICKLING_TIMES_10 = undefined;
            this.WASHING_TIMES_10 = undefined;
            this.DRAINING_TIMES_10 = undefined;
            this.BATCH_CNT_10 = undefined;

            this.getPPSINP10List();
            this.sucessMSG('新增成功', ``);
            this.isVisibleOtherShop;
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
  updateSave(rowData:ItemData10) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID: rowData.tab10ID,
        SHOP_CODE_10: rowData.SHOP_CODE_10,
        EQUIP_CODE_10: rowData.EQUIP_CODE_10,
        GRADE_NO_10: rowData.GRADE_NO_10,
        LENGTH_MIN_10: rowData.LENGTH_MIN_10,
        LENGTH_MAX_10: rowData.LENGTH_MAX_10,
        DIA_MIN_10: rowData.DIA_MIN_10,
        DIA_MAX_10: rowData.DIA_MAX_10,
        TOTAL_TIMES_10: rowData.TOTAL_TIMES_10,
        PICKLING_TIMES_10: rowData.PICKLING_TIMES_10,
        WASHING_TIMES_10: rowData.WASHING_TIMES_10,
        DRAINING_TIMES_10: rowData.DRAINING_TIMES_10,
        BATCH_CNT_10: rowData.BATCH_CNT_10,

        USERNAME: this.USERNAME,
        DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
      myObj.PPSService.updateI110Tab1Save(obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.SHOP_CODE_10 = undefined;
            this.EQUIP_CODE_10 = undefined;
            this.GRADE_NO_10 = undefined;
            this.LENGTH_MIN_10 = undefined;
            this.LENGTH_MAX_10 = undefined;
            this.DIA_MIN_10 = undefined;
            this.DIA_MAX_10 = undefined;
            this.TOTAL_TIMES_10 = undefined;
            this.PICKLING_TIMES_10 = undefined;
            this.WASHING_TIMES_10 = undefined;
            this.DRAINING_TIMES_10 = undefined;
            this.BATCH_CNT_10 = undefined;
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
  delID(rowData:ItemData10) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let _ID = rowData.tab10ID;
      myObj.PPSService.delI110Tab1Data(_ID).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.SHOP_CODE_10 = undefined;
            this.EQUIP_CODE_10 = undefined;
            this.GRADE_NO_10 = undefined;
            this.LENGTH_MIN_10 = undefined;
            this.LENGTH_MAX_10 = undefined;
            this.DIA_MIN_10 = undefined;
            this.DIA_MAX_10 = undefined;
            this.TOTAL_TIMES_10 = undefined;
            this.PICKLING_TIMES_10 = undefined;
            this.WASHING_TIMES_10 = undefined;
            this.DRAINING_TIMES_10 = undefined;
            this.BATCH_CNT_10 = undefined;

            this.sucessMSG('刪除成功', ``);
            this.getPPSINP10List();
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
  // 新增桶槽式工時之彈出視窗
  openOtherShopInput(): void {
    this.isVisibleOtherShop = true;
  }
  // 取消桶槽式工時之彈出視窗
  cancelOtherShopInput(): void {
    this.isVisibleOtherShop = false;
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
    const myThis = this;
    myThis.barchInsertExcelData().then((barchInsertSuccess:any) => {
      myThis.sucessMSG(barchInsertSuccess, ``);
      myThis.getPPSINP10List();
    })
    .catch(function (error) {
      myThis.isSpinning = false;
      myThis.errorMSG(error, ``);
    });
    (<HTMLInputElement>document.getElementById('importExcel')).value = '';
  }

  barchInsertExcelData() {
    const myThis = this;
    return new Promise(function (resolve, reject) {
      myThis.PPSService.batchSaveI110Data(myThis.jsonExcelData).subscribe(
        (response) => {
          if (response.code === 200) {
            resolve('匯入成功');
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

  deleteAllData() {
    const myThis = this;
    return new Promise(function (resolve, reject) {
      myThis.PPSService.deleteI110AllData().subscribe(
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
      JSON.stringify(this.jsonExcelData).split('"站號":').join('"SHOP_CODE":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"機台碼":')
        .join('"EQUIP_CODE":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"鋼種":').join('"GRADE_NO":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"長度-最小值(mm)":')
        .join('"LENGTH_MIN":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"長度-最大值(mm)":')
        .join('"LENGTH_MAX":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"尺寸最小":').join('"DIA_MIN":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"尺寸最大":').join('"DIA_MAX":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"總時間(分/批)":')
        .join('"TOTAL_TIMES":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"浸酸時間(分/批)":')
        .join('"PICKLING_TIMES":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"清洗時間(分/批)":')
        .join('"WASHING_TIMES":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"瀝乾時間(分/批)":')
        .join('"DRAINING_TIMES":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"投入上限值(捆/批)":')
        .join('"BATCH_CNT":')
    );
  }

  checkAllValuesNotEmpty(jsonExcelData): boolean {
    for (let i = 1; i <= jsonExcelData.length; i++) {
      let rowNumberInExcel = i + 1;

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['站號'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['站號']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「站號」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['機台碼'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['機台碼']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「機台碼」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['鋼種'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['鋼種']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「鋼種」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['長度-最小值(mm)'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['長度-最小值(mm)']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「長度-最小值(mm)」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['長度-最大值(mm)'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['長度-最大值(mm)']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「長度-最大值(mm)」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['尺寸最小'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['尺寸最小']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「尺寸最小」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['尺寸最大'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['尺寸最大']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「尺寸最大」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['總時間(分/批)'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['總時間(分/批)']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「總時間(分/批)」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['浸酸時間(分/批)'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['浸酸時間(分/批)']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「浸酸時間(分/批)」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['清洗時間(分/批)'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['清洗時間(分/批)']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「清洗時間(分/批)」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['瀝乾時間(分/批)'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['瀝乾時間(分/批)']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「瀝乾時間(分/批)」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['投入上限值(捆/批)'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['投入上限值(捆/批)']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「投入上限值(捆/批)」不得為空，請修正`
        );
        return false;
      }
    } //enf for

    return true;
  }

  checkExcelHeader(d): boolean {
    let b1 = false;
    let b2 = false;
    let b3 = false;
    let b4 = false;
    let b5 = false;
    let b6 = false;
    let b7 = false;
    let b8 = false;
    let b9 = false;
    let b10 = false;
    let b11 = false;
    let b12 = false;

    const keys = Object.keys(d);
    if (keys.length !== 12) return false;

    keys.forEach((k) => {
      if (k === '站號') b1 = true;
      else if (k === '機台碼') b2 = true;
      else if (k === '鋼種') b3 = true;
      else if (k === '長度-最小值(mm)') b4 = true;
      else if (k === '長度-最大值(mm)') b5 = true;
      else if (k === '尺寸最小') b6 = true;
      else if (k === '尺寸最大') b7 = true;
      else if (k === '總時間(分/批)') b8 = true;
      else if (k === '浸酸時間(分/批)') b9 = true;
      else if (k === '清洗時間(分/批)') b10 = true;
      else if (k === '瀝乾時間(分/批)') b11 = true;
      else if (k === '投入上限值(捆/批)') b12 = true;
    });

    return (
      b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9 && b10 && b11 && b12
    );
  }

  // Excel 匯出
  exportToExcel() {
    this.isSpinning = true;

    const exportJsonDataList = this.displayPPSINP10List.map((obj) => {
      return _.omit(obj, ['id', 'tab10ID']);
    });

    const firstRow = [
      'SHOP_CODE_10',
      'EQUIP_CODE_10',
      'GRADE_NO_10',
      'LENGTH_MIN_10',
      'LENGTH_MAX_10',
      'DIA_MIN_10',
      'DIA_MAX_10',
      'TOTAL_TIMES_10',
      'PICKLING_TIMES_10',
      'WASHING_TIMES_10',
      'DRAINING_TIMES_10',
      'BATCH_CNT_10',
    ];
    const firstRowDisplay = {
      SHOP_CODE_10: '站號',
      EQUIP_CODE_10: '機台碼',
      GRADE_NO_10: '鋼種',
      LENGTH_MIN_10: '長度-最小值(mm)',
      LENGTH_MAX_10: '長度-最大值(mm)',
      DIA_MIN_10: '尺寸最小',
      DIA_MAX_10: '尺寸最大',
      TOTAL_TIMES_10: '總時間(分/批)',
      PICKLING_TIMES_10: '浸酸時間(分/批)',
      WASHING_TIMES_10: '清洗時間(分/批)',
      DRAINING_TIMES_10: '瀝乾時間(分/批)',
      BATCH_CNT_10: '投入上限值(捆/批)',
    };
    const exportData = [firstRowDisplay, ...exportJsonDataList];

    const workSheet = XLSX.utils.json_to_sheet(exportData, {
      header: firstRow,
      skipHeader: true,
    });
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
    XLSX.writeFileXLSX(workBook, '直棒桶槽式工時.xlsx');

    this.isSpinning = false;
    this.sucessMSG('匯出成功!', ``);
  }

  onBtnClick1(e) {
    e.params.api.setFocusedCell(e.params.node.rowIndex, 'BATCH_CNT_10');
    e.params.api.startEditingCell({
      rowIndex: e.params.node.rowIndex,
      colKey: 'BATCH_CNT_10',
    });
  }

  onBtnClick2(e) {
    this.saveEdit(e.rowData)
  }

  onBtnClick3(e) {
  }

  onBtnClick4(e) {
    this.deleteRow(e.rowData);
  }

}
