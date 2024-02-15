import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/common/excel.service';
import { BtnCellRenderer } from '../../RENDERER/BtnCellRenderer.component';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';
import { AGHeaderCommonParams, AGHeaderParams } from 'src/app/shared/ag-component/types';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
interface ItemData1 {
  id: string;
  tab1ID: number;
  GRADE_NO: string;
  GRADE_GROUP: string;
  SPECIAL_EQUIP_CODE: string;
  ROLL_WEIGHT: number;
}

@Component({
  selector: 'app-PPSI101',
  templateUrl: './PPSI101.component.html',
  styleUrls: ['./PPSI101.component.scss'],
  providers: [NzMessageService],
})
export class PPSI101Component implements AfterViewInit {
  
  frameworkComponents: any;
  thisTabName = "鋼種分類(PPSI101)";
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  // 1.鋼種分類
  GRADE_NO;
  SPECIAL_EQUIP_CODE;
  GRADE_GROUP;
  ROLL_WEIGHT; //鋼胚重(KG)
  isVisibleGrade = false;
  searchByGradeNoValue = '';
  searchBySpecialEquipCodeValue = '';
  searchByGradeGroupValue = '';
  searchByRollWeightValue = '';

  // tab 1
  PPSINP01List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  PPSINP01List: ItemData1[] = [];
  displayPPSINP01List: ItemData1[] = [];

  file: File;
  inputFileUseInUpload;
  arrayBuffer: any;
  importdata = [];
  titleArray = ['鋼種', '特殊機台使用', '鋼種類別', '鋼胚重(KG)'];
  importdata_repeat = [];
  pageIndex = 1;
  pageSize = 20;

  agCustomHeaderCommonParams : AGHeaderCommonParams = {agName: 'AGName1' , isSave:true ,path: this.router.url  }
  agCustomHeaderParams : AGHeaderParams = {isMenuShow: true,}
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
    {
      width: 150,
      headerName: '鋼種',
      field: 'GRADE_NO',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 150,
      headerName: '特殊機台使用',
      field: 'SPECIAL_EQUIP_CODE',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 150,
      headerName: '鋼種類別',
      field: 'GRADE_GROUP',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 150,
      headerName: '鋼胚重(KG)',
      field: 'ROLL_WEIGHT',
      headerComponent: AGCustomHeaderComponent
    },
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
  ]

  constructor(
    private elementRef:ElementRef,
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
    private systemService : SYSTEMService,
    private router: Router,
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
    this.getPPSINP01List(this.pageIndex, this.pageSize);
    
    const aI101Tab = this.elementRef.nativeElement.querySelector('#aI101') as HTMLAnchorElement;
    const liI101Tab = this.elementRef.nativeElement.querySelector('#liI101') as HTMLLIElement;
    liI101Tab.style.backgroundColor = '#E4E3E3';
    aI101Tab.style.cssText = 'color: blue; font-weight:bold;';
    this.getDbCloumn();
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

  //tab1_select
  getPPSINP01List(pageIndex: number, pageSize: number) {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP01List(pageIndex, pageSize).subscribe((res) => {
      console.log('getFCPTB26List success');
      this.PPSINP01List_tmp = res;
      console.log(
        'this.PPSINP01List_tmp==>',
        JSON.stringify(this.PPSINP01List_tmp)
      );

      const data = [];
      for (let i = 0; i < this.PPSINP01List_tmp.length; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.PPSINP01List_tmp[i].ID,
          GRADE_NO: this.PPSINP01List_tmp[i].GRADE_NO,
          SPECIAL_EQUIP_CODE: this.PPSINP01List_tmp[i].SPECIAL_EQUIP_CODE,
          ROLL_WEIGHT: this.PPSINP01List_tmp[i].ROLL_WEIGHT,
          GRADE_GROUP: this.PPSINP01List_tmp[i].GRADE_GROUP,
        });
      }
      this.PPSINP01List = data;
      this.displayPPSINP01List = this.PPSINP01List;
      this.updateEditCache(1);
      console.log(this.PPSINP01List);
      myObj.loading = false;
    });
  }

  // insert1
  insertTab1() {
    let myObj = this;
    if (this.GRADE_NO === undefined || '' === this.GRADE_NO) {
      myObj.message.create('error', '「設定鋼種」不可為空');
      return;
    } else if (this.GRADE_GROUP === undefined || '' === this.GRADE_GROUP) {
      myObj.message.create('error', '「鋼種類別」不可為空');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave(1);
          this.isVisibleGrade = false;
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }

  // update
  editRow(id: string, _type): void {
    if (_type === 1) {
      this.editCache1[id].edit = true;
    }
  }

  // delete
  deleteRow(rowData:ItemData1, _type): void {
    if (_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID(rowData, _type);
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }

  // cancel
  cancelEdit(id: string, _type): void {
    if (_type === 1) {
      const index = this.PPSINP01List.findIndex((item) => item.id === id);
      this.editCache1[id] = {
        data: { ...this.PPSINP01List[index] },
        edit: false,
      };
    }
  }

  // update Save
  saveEdit(rowData: ItemData1, _type): void {
    if (_type === 1) {

      let myObj = this;
      if (
        rowData.GRADE_NO === undefined ||
        '' === rowData.GRADE_NO
      ) {
        myObj.message.create('error', '「鋼種」不可為空');
        return;
      } else if (
        rowData.GRADE_GROUP === undefined ||
        '' === rowData.GRADE_GROUP
      ) {
        myObj.message.create('error', '「鋼種類別」不可為空');
        return;
      } else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSave(rowData, 1);
          },
          nzOnCancel: () => console.log('cancel'),
        });
      }
    }
  }

  // update
  updateEditCache(_type): void {
    if (_type === 1) {
      this.PPSINP01List.forEach((item) => {
        this.editCache1[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  changeTab(tab): void {
    console.log(tab);
    if (tab === 1) {
      this.getPPSINP01List(10, 10);
    }
  }

  // 新增資料
  insertSave(_type) {
    if (_type === 1) {
      let myObj = this;
      this.LoadingPage = true;

      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          GRADE_NO: this.GRADE_NO,
          GRADE_GROUP: this.GRADE_GROUP,
          SPECIAL_EQUIP_CODE: this.SPECIAL_EQUIP_CODE,
          ROLL_WEIGHT: this.ROLL_WEIGHT,
          USERNAME: this.USERNAME,
          DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
        });

        myObj.PPSService.insertI101Tab1Save(obj).subscribe(
          (res) => {
            console.log(res);
            if (res[0].MSG === 'Y') {
              this.GRADE_NO = undefined;
              this.GRADE_GROUP = undefined;
              this.SPECIAL_EQUIP_CODE = undefined;
              this.ROLL_WEIGHT = undefined;
              this.getPPSINP01List(1, 0);
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
  }

  // 修改資料
  updateSave(rowData:ItemData1, _type) {
    if (_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          ID: rowData.tab1ID,
          GRADE_NO: rowData.GRADE_NO,
          GRADE_GROUP: rowData.GRADE_GROUP,
          SPECIAL_EQUIP_CODE: rowData.SPECIAL_EQUIP_CODE,
          ROLL_WEIGHT: rowData.ROLL_WEIGHT,
          USERNAME: this.USERNAME,
          DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
        myObj.PPSService.updateI101Tab1Save(obj).subscribe(
          (res) => {
            if (res[0].MSG === 'Y') {
              this.GRADE_NO = undefined;
              this.GRADE_GROUP = undefined;
              this.SPECIAL_EQUIP_CODE = undefined;
              this.ROLL_WEIGHT = undefined;
              this.sucessMSG('修改成功', ``);
              this.getPPSINP01List(this.pageIndex,this.pageSize);
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
  }

  // 刪除資料
  delID(rowData:ItemData1, _type) {
    if (_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = rowData.tab1ID;
        myObj.PPSService.delI101Tab1Data(_ID).subscribe(
          (res) => {
            if (res[0].MSG === 'Y') {
              this.GRADE_NO = undefined;
              this.GRADE_GROUP = undefined;
              this.SPECIAL_EQUIP_CODE = undefined;
              this.ROLL_WEIGHT = undefined;

              this.sucessMSG('刪除成功', ``);
              this.getPPSINP01List(this.pageIndex, this.pageSize);
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

  // 新增鋼種之彈出視窗
  openGradeInput(): void {
    this.isVisibleGrade = true;
  }
  // 取消鋼種彈出視窗
  cancelGradeInput(): void {
    this.isVisibleGrade = false;
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
    console.log('EXCEL 資料上傳檢核開始');
    var upload_data = [];
    for (let i = 0; i < _data.length; i++) {
      console.log(_data[i]);

      let allData = JSON.stringify(_data[i]);
      this.importdata_repeat.push(allData);
      console.log(_data[i]['特殊機台使用']);
      if (_data[i]['特殊機台使用'] == undefined) _data[i]['特殊機台使用'] = '';

      console.log(_data[i]['特殊機台使用']);
      upload_data.push({
        GRADE_NO: _data[i]['鋼種'],
        SPECIAL_EQUIP_CODE: _data[i]['特殊機台使用'],
        GRADE_GROUP: _data[i]['鋼種類別'],
        ROLL_WEIGHT: _data[i]['鋼胚重(KG)'],
        DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
        USERNAME: this.USERNAME,
        PLANT_CODE: this.PLANT_CODE,
      });
    }

    return new Promise((resolve, reject) => {
      console.log('匯入開始');
      this.LoadingPage = true;
      let myObj = this;
      let obj = {};
      obj = {
        EXCELDATA: upload_data,
      };

      console.log('EXCELDATA:' + obj);
      myObj.PPSService.importI101TablExcel(obj).subscribe(
        (res) => {
          console.log('importExcelPPSI101');
          if (res[0].MSG === 'Y') {
            this.loading = false;
            this.LoadingPage = false;

            this.sucessMSG('EXCCEL上傳成功', '');
            this.clearFile();
            this.getPPSINP01List(10, 10);
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
    this.getPPSINP01List(10, 10);
  }

  convertToExcel() {
    console.log('convertToExcel');
    let arr = [];
    console.log(this.displayPPSINP01List);
    let fileName = `鋼種分類`;

    for (let i = 0; i < this.displayPPSINP01List.length; i++) {
      var ppsInP01 = {
        GRADE_NO: this.displayPPSINP01List[i].GRADE_NO,
        SPECIAL_EQUIP_CODE: this.displayPPSINP01List[i].SPECIAL_EQUIP_CODE,
        GRADE_GROUP: this.displayPPSINP01List[i].GRADE_GROUP,
        ROLL_WEIGHT: this.displayPPSINP01List[i].ROLL_WEIGHT,
      };
      arr.push(ppsInP01);
    }

    this.excelService.exportAsExcelFile(arr, fileName, this.titleArray);
  }

  onBtnClick1(e) {
    e.params.api.setFocusedCell(e.params.node.rowIndex, 'ROLL_WEIGHT');
    e.params.api.startEditingCell({
      rowIndex: e.params.node.rowIndex,
      colKey: 'ROLL_WEIGHT',
    });
  }

  onBtnClick2(e) {
    this.saveEdit(e.rowData,1);
  }

  onBtnClick3(e) {
  }

  onBtnClick4(e) {
    this.deleteRow(e.rowData,1);
  }

}
