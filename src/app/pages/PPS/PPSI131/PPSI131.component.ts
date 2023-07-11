import { map } from 'rxjs/operators';
import { Component, AfterViewInit } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/services/common/common.service';

class tbppsm114 {
  id: number;
  diaMin: number;
  diaMax: number;
  productionTime: any;
  dateCreate: number;
  userCreate: string;
  dateUpdate: number;
  userUpdate: string;

  constructor(
    _id: number,
    _diaMin: number,
    _diaMax: number,
    _productionTime: any,
    _dateCreate: number,
    _userCreate: string,
    _dateUpdate: number,
    _userUpdate: string
  ) {
    this.id = _id;
    this.diaMin = _diaMin;
    this.diaMax = _diaMax;
    this.productionTime = _productionTime;
    this.dateCreate = _dateCreate;
    this.userCreate = _userCreate;
    this.dateUpdate = _dateUpdate;
    this.userUpdate = _userUpdate;
  }
}

class Displaytbppsm114 extends tbppsm114 {
  isEdit: boolean;
  constructor(
    _id: number,
    _diaMin: number,
    _diaMax: number,
    _productionTime: any,
    _dateCreate: number,
    _userCreate: string,
    _dateUpdate: number,
    _userUpdate: string,
    _isEdit: boolean
  ) {
    super(
      _id,
      _diaMin,
      _diaMax,
      _productionTime,
      _dateCreate,
      _userCreate,
      _dateUpdate,
      _userUpdate
    );

    this.isEdit = _isEdit;
  }
}

@Component({
  selector: 'app-PPSI131',
  templateUrl: './PPSI131.component.html',
  styleUrls: ['./PPSI131.component.scss'],
  providers: [NzMessageService],
})
export class PPSI131Component implements AfterViewInit {
  USERNAME;
  id;
  isSpinning = false;

  /////////////////////////////////////////////////////////////
  // 批次爐鋼種捲數製程碼對應表
  /////////////////////////////////////////////////////////////

  // 控制輸入彈出視窗的顯示
  isVisibleBFSGCCPC = false;
  // 輸入欄位 -> 尺寸_min(含)
  diaMinInput: number = undefined;
  // 輸入欄位 -> 尺寸_max(含)
  diaMaxInput: number = undefined;
  // 輸入欄位 -> 製程碼_一爐兩捲
  productionTimeInput = '';

  // 尺寸_min(含)搜尋關鍵字
  searchDiaMinValue = '';
  // 尺寸_min(含)搜尋框是否出現
  diaMinFilterVisible = false;

  // 尺寸_max(含)搜尋關鍵字
  searchDiaMaxValue = '';
  // 尺寸_max(含)搜尋框是否出現
  diaMaxFilterVisible = false;

  // 製程碼_一爐兩捲搜尋關鍵字
  searchproductionTimeValue = '';
  // 製程碼_一爐兩捲搜尋框是否出現
  productionTimeFilterVisible = false;

  // 是否正在搜尋
  isSearching = false;
  // 正在針對哪一個欄位做搜尋
  searchingColumn = '';

  DB_id_COLUMN_NAME = 'id';
  DB_DIA_MIN_COLUMN_NAME = 'DIA_MIN';
  DB_DIA_MAX_COLUMN_NAME = 'DIA_MAX';
  DB_PRODUCTION_TIME_COLUMN_NAME = 'PRODUCTION_TIME';

  // 於畫面表格顯示的資料
  displaytbppsm114List: Displaytbppsm114[] = [];
  // 編輯時顯示的資料
  editCache: { [id: number]: { isEdit: boolean; data: tbppsm114 } } = {};
  // 記錄一個用來比對使用者是否有修改畫面上資料的變數
  wasModifiedData: { [id: number]: { data: tbppsm114 } } = {};

  // tbppsm114表總共有幾筆資料
  tbppsm114DataTotal = 0;
  // 當前頁碼(第幾頁)
  currentPageIndex = 1;
  // 每頁有幾筆
  pageSize = 20;

  // 紀錄正在編輯中的項目id
  editingItemList: number[] = [];

  // 使用者匯入的Excel檔案
  excelImportFile: File;

  constructor(
    private PPSService: PPSService,
    private commonService: CommonService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie('USERNAME');
    this.id = this.cookieService.getCookie('id');
  }

  async ngAfterViewInit() {
    const p = this.getPPSI131List();
    await this.setupTableAndEditCache(p);
  }

  getPPSI131List() {
    this.isSpinning = true;

    const myThis = this;
    return new Promise<any>(function (resolve, reject) {
      myThis.PPSService.listtbppsm114DataByPagination(
        myThis.currentPageIndex,
        myThis.pageSize
      ).subscribe(
        (response) => {
          const resData = { response: response, isSearch: false };
          resolve(resData);
          const licss = document.getElementById('ggli');
          if (licss != null) {
            licss.style.backgroundColor = '#E4E3E3';
          }
          const acss = document.getElementById('gga');
          if (acss != null) {
            acss.style.cssText = 'color: blue; font-weight:bold;';
          }
          document.getElementById('gga').innerHTML =
            '直棒BA1批次爐工時維護(PPSI131)';
          document.getElementById('gga').style.fontSize = '17px';
        },
        (error) => {
          const errorMsg = JSON.stringify(error['error']);
          reject(
            `查詢失敗，後台新增錯誤，請聯繫系統工程師。Error Msg : ${errorMsg}`
          );
        }
      );
    });
  }

  handleData(resData) {
    const response = resData['response'];
    if (response.success === true) {
      this.setupTable(response);
      this.setupUpdateEditCache();
      if (response.data.length <= 0) {
        this.sucessMSG('已無資料', ``);
        return;
      }
    } else {
      this.errorMSG(response.message, ``);
    }
  }

  async setupTableAndEditCache(p: Promise<any>) {
    const myThis = this;
    p.then((response) => {
      myThis.handleData(response);
      myThis.isSpinning = false;
    }).catch((error) => {
      myThis.isSpinning = false;
      // myThis.errorMSG(error.message, ``);
    });
  }

  setupTable(response): void {
    this.tbppsm114DataTotal = response.totalCount;
    const dataList = response.data;

    const displayDataList: Displaytbppsm114[] = dataList.map((item) => {
      let isEdit = _.includes(this.editingItemList, item.id);

      let data = new Displaytbppsm114(
        item.id,
        item.diaMin,
        item.diaMax,
        item.productionTime,
        item.dateCreate,
        item.userCreate,
        item.dateUpdate,
        item.userUpdate,
        isEdit
      );
      return data;
    });

    this.displaytbppsm114List = displayDataList;
  }

  // 複製一份資料到編輯專用的資料list
  setupUpdateEditCache(): void {
    this.editCache = {};
    this.displaytbppsm114List.forEach((item) => {
      let newCloneItem: tbppsm114 = _.omit(item, ['isEdit']);
      this.editCache[item.id] = {
        isEdit: item.isEdit,
        data: newCloneItem,
      };
    });
  }

  editRow(id: number): void {
    // 紀錄有哪筆資料處於編輯中
    this.editingItemList.push(id);
    this.editCache[id].isEdit = true;
    //去重，以避免不可知的情況同一筆ID被加入超過第1次
    this.editingItemList = _.uniq(this.editingItemList);

    // 紀錄此筆資料使用者是否有修改
    this.wasModifiedData[id] = { data: _.cloneDeep(this.editCache[id].data) };
  }

  cancelEdit(id: number): void {
    _.remove(this.editingItemList, (_id) => _id === id);
    this.editCache[id].isEdit = false;

    //將儲存編輯中的資料還原
    this.editCache[id].data = _.cloneDeep(this.wasModifiedData[id].data);

    //移除「紀錄此筆資料使用者是否有修改」的資料
    delete this.wasModifiedData[id];
  }

  deleteRow(id: number): void {
    this.isSpinning = true;
    const myThis = this;
    new Promise<any>(function (resolve, reject) {
      myThis.PPSService.deletetbppsm114Data(id).subscribe(
        (response) => {
          if (response.success == true) {
            resolve(true);
          } else {
            reject(response.message);
          }
        },
        (error) => {
          const errorMsg = JSON.stringify(error['error']);
          reject(
            `刪除失敗，後台錯誤，請聯繫系統工程師。Error Msg : ${errorMsg}`
          );
        }
      );
    })
      .then((updateSuccess) => {
        if (_.isEmpty(myThis.searchingColumn)) return this.getPPSI131List();
        else return this.switchGetSearchtbppsm114ColumnDataByKeyWord();
      })
      .then((resData) => {
        this.handleData(resData);
        myThis.sucessMSG('刪除成功', ``);
        myThis.isSpinning = false;
      })
      .catch(function (error) {
        myThis.isSpinning = false;
        myThis.errorMSG(error, ``);
      });
  }

  saveEdit(id: number) {
    let updateItem = this.editCache[id].data;
    let wasModifiedItem = this.wasModifiedData[id].data;

    if (_.isEqual(updateItem, wasModifiedItem)) {
      this.message.create('error', '無法更新，資料與原來相同');
      return;
    }

    this.Modal.confirm({
      nzTitle: '是否確定修改?',
      nzOnOk: () => {
        updateItem.userUpdate = this.USERNAME;
        this.isSpinning = true;
        const myThis = this;
        new Promise<any>(function (resolve, reject) {
          myThis.PPSService.updatetbppsm114Data(updateItem).subscribe(
            (response) => {
              if (response.success == true) {
                resolve(true);
              } else {
                reject(response.message);
              }
            },
            (error) => {
              const errorMsg = JSON.stringify(error['error']);
              reject(
                `更新失敗，後台錯誤，請聯繫系統工程師。Error Msg : ${errorMsg}`
              );
            }
          );
        })
          .then((updateSuccess) => {
            myThis.cancelEdit(id);

            if (_.isEmpty(myThis.searchingColumn)) return this.getPPSI131List();
            else return this.switchGetSearchtbppsm114ColumnDataByKeyWord();
          })
          .then((resData) => {
            this.handleData(resData);
            myThis.sucessMSG('更新成功', ``);
            myThis.isSpinning = false;
          })
          .catch(function (error) {
            myThis.isSpinning = false;
            myThis.errorMSG(error, ``);
          });
      },
      nzOnCancel: () => console.log('cancel'),
    });
  }

  insertData(): void {
    if (!this.validateInputFieldForInsert()) {
      return;
    }

    this.Modal.confirm({
      nzTitle: '是否確定新增?',
      nzOnOk: () => {
        this.isSpinning = true;
        const tbppsm114Data = new tbppsm114(
          null,
          this.diaMinInput,
          this.diaMaxInput,
          this.productionTimeInput,
          null,
          this.USERNAME,
          null,
          null
        );

        const myThis = this;
        new Promise<any>(function (resolve, reject) {
          myThis.PPSService.savetbppsm114Data(tbppsm114Data).subscribe(
            (response) => {
              if (response.success === true) resolve(response.message);
              else reject(response.message);
            },
            (error) => {
              const errorMsg = JSON.stringify(error['error']);
              reject(
                `新增失敗，後台新增錯誤，請聯繫系統工程師。Error Msg : ${errorMsg}`
              );
            }
          );
        })
          .then((saveSuccess) => {
            this.isVisibleBFSGCCPC = false;
            this.diaMinInput = undefined;
            this.diaMaxInput = undefined;
            this.productionTimeInput = '';
            myThis.sucessMSG(saveSuccess, ``);
            return this.getPPSI131List();
          })
          .then((response) => {
            this.handleData(response);
            myThis.isSpinning = false;
          })
          .catch((error) => {
            myThis.isSpinning = false;
            myThis.errorMSG(error, ``);
          });
      },
      nzOnCancel: () => console.log('cancel add data'),
    });
  }

  validateInputFieldForInsert(): boolean {
    if (!_.isNumber(this.diaMinInput)) {
      this.message.create('error', '「尺寸下限(含)」僅能是數字或不可為空');
      return false;
    }

    if (!_.isNumber(this.diaMaxInput)) {
      this.message.create('error', '「尺寸上限(含)」僅能是數字或不可為空');
      return false;
    }

    if (_.isEmpty(this.productionTimeInput)) {
      this.message.create('error', '「每爐生產時間(分)」不可為空');
      return false;
    }

    return true;
  }

  tablePageChange(): void {
    this.isSpinning = true;

    if (!_.isEmpty(this.searchingColumn)) {
      const p = this.switchGetSearchtbppsm114ColumnDataByKeyWord();
      this.setupTableAndEditCache(p);
      return;
    }

    const p = this.getPPSI131List();
    this.setupTableAndEditCache(p);
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

    this.Modal.afterAllClose.subscribe((result) => {
      console.log('重新刷新.....');
      this.reset();
    });
  }

  //============== 新增資料之彈出視窗 =====================
  // 新增 批次爐鋼種捲數製程碼對應表 之彈出視窗
  openBFSGCCPCInput(): void {
    this.isVisibleBFSGCCPC = true;
  }
  // 取消 批次爐鋼種捲數製程碼對應表 之彈出視窗
  cancelBFSGCCPCInput(): void {
    this.isVisibleBFSGCCPC = false;
  }

  // ============= filter資料 ========================

  searchByDiaMin(isUserClick: boolean) {
    if (_.isEmpty(this.searchDiaMinValue)) {
      this.message.create('error', '請輸入搜尋關鍵字');
      return;
    }

    this.searchingColumn = this.DB_DIA_MIN_COLUMN_NAME;
    this.clearOtherSearchValue(this.DB_DIA_MIN_COLUMN_NAME);
    const p = this.searchtbppsm114ColumnDataByKeyWord(
      this.searchingColumn,
      this.searchDiaMinValue
    );

    if (!isUserClick) {
      return p;
    } else {
      this.setupTableAndEditCache(p);
      this.diaMinFilterVisible = false;
    }
  }
  resetByDiaMin() {
    this.searchDiaMinValue = '';
    this.reset();
    this.diaMinFilterVisible = false;
  }

  searchByDiaMax(isUserClick: boolean) {
    if (_.isEmpty(this.searchDiaMaxValue)) {
      this.message.create('error', '請輸入搜尋關鍵字');
      return;
    }

    this.searchingColumn = this.DB_DIA_MAX_COLUMN_NAME;
    this.clearOtherSearchValue(this.DB_DIA_MAX_COLUMN_NAME);
    const p = this.searchtbppsm114ColumnDataByKeyWord(
      this.searchingColumn,
      this.searchDiaMaxValue
    );

    if (!isUserClick) {
      return p;
    } else {
      this.setupTableAndEditCache(p);
      this.diaMaxFilterVisible = false;
    }
  }
  resetByDiaMax() {
    this.searchDiaMaxValue = '';
    this.reset();
    this.diaMaxFilterVisible = false;
  }

  searchByproductionTime(isUserClick: boolean) {
    if (_.isEmpty(this.searchproductionTimeValue)) {
      this.message.create('error', '請輸入搜尋關鍵字');
      return;
    }

    this.searchingColumn = this.DB_PRODUCTION_TIME_COLUMN_NAME;
    this.clearOtherSearchValue(this.DB_PRODUCTION_TIME_COLUMN_NAME);
    const p = this.searchtbppsm114ColumnDataByKeyWord(
      this.searchingColumn,
      this.searchproductionTimeValue
    );

    if (!isUserClick) {
      return p;
    } else {
      this.setupTableAndEditCache(p);
      this.productionTimeFilterVisible = false;
    }
  }
  resetByproductionTime() {
    this.searchproductionTimeValue = '';
    this.reset();
    this.productionTimeFilterVisible = false;
  }

  reset(): void {
    this.isSpinning = true;
    this.currentPageIndex = 1;
    this.searchingColumn = '';
    this.clearOtherSearchValue('All Clear');
    const p = this.getPPSI131List();
    this.setupTableAndEditCache(p);
  }

  clearOtherSearchValue(currentField: string) {
    if (!_.isEqual(currentField, this.DB_DIA_MIN_COLUMN_NAME)) {
      this.searchDiaMinValue = '';
    }

    if (!_.isEqual(currentField, this.DB_DIA_MAX_COLUMN_NAME)) {
      this.searchDiaMaxValue = '';
    }

    if (!_.isEqual(currentField, this.DB_PRODUCTION_TIME_COLUMN_NAME)) {
      this.searchproductionTimeValue = '';
    }
  }

  searchtbppsm114ColumnDataByKeyWord(column: string, keyword: string) {
    this.isSpinning = true;
    const myThis = this;
    return new Promise(function (resolve, reject) {
      myThis.PPSService.searchtbppsm114ColumnDataByKeyword(
        column,
        keyword,
        myThis.currentPageIndex,
        myThis.pageSize
      ).subscribe(
        (response) => {
          if (response.success === true) {
            const resData = { response: response, isSearch: true };
            resolve(resData);
          } else {
            reject(response.message);
          }
        },
        (error) => {
          reject(
            `查詢失敗，後台查詢錯誤，請聯繫系統工程師。Error Msg : ${JSON.stringify(
              error['error']
            )}`
          );
        }
      );
    });
  }

  switchGetSearchtbppsm114ColumnDataByKeyWord() {
    let p: Promise<any>;

    switch (this.searchingColumn) {
      case this.DB_DIA_MIN_COLUMN_NAME: {
        p = this.searchByDiaMin(false);
        break;
      }
      case this.DB_DIA_MAX_COLUMN_NAME: {
        p = this.searchByDiaMax(false);
        break;
      }
      case this.DB_PRODUCTION_TIME_COLUMN_NAME: {
        p = this.searchByproductionTime(false);
        break;
      }
      default: {
        break;
      }
    }

    return p;
  }

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

  importExcel() {
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
    this.convertJsonToEnglishkey();

    // 校驗Excel中的資料是否有重複
    if (this.commonService.checkExcelDataDuplicate(this.jsonExcelData)) {
      this.isSpinning = false;
      (<HTMLInputElement>document.getElementById('importExcel')).value = '';
      return;
    }
    console.log('匯入的Excle中的資料皆無重複');

    // 將資料全刪除，再匯入EXCEL檔內的資料
    const myThis = this;
    const p = this.barchInsertExcelData();
    p.then((barchInsertSuccess) => {
      // 批次新增Excle中的資料
      myThis.currentPageIndex = 1;
      myThis.searchingColumn = '';
      myThis.sucessMSG(barchInsertSuccess, ``);
      return myThis.getPPSI131List();
    })
      .then((resData) => {
        myThis.handleData(resData);
        myThis.isSpinning = false;
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
      myThis.PPSService.batchSavetbppsm114Data(myThis.jsonExcelData).subscribe(
        (response) => {
          if (response.success === true) {
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
      myThis.PPSService.deletetbppsm114AllData().subscribe(
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

  convertJsonToEnglishkey(): void {
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"尺寸下限":').join('"diaMin":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"尺寸上限":').join('"diaMax":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"每爐生產時間":')
        .join('"productionTime":')
    );
    for (let i = 0; i < this.jsonExcelData.length; i++) {
      this.jsonExcelData[i].userCreate = this.USERNAME;
    }
  }

  checkExcelHeader(d): boolean {
    let b1 = false;
    let b2 = false;
    let b3 = false;
    let b4 = false;
    let b5 = false;
    let b6 = false;
    let b7 = false;

    const keys = Object.keys(d);

    keys.forEach((k) => {
      if (k === '尺寸下限') b1 = true;
      else if (k === '尺寸上限') b2 = true;
      else if (k === '每爐生產時間') b3 = true;
    });

    return b1 && b2 && b3;
  }

  checkAllValuesNotEmpty(jsonExcelData): boolean {
    for (let i = 1; i <= jsonExcelData.length; i++) {
      let rowNumberInExcel = i + 1;

      if (_.isEmpty(String(jsonExcelData[i - 1]['尺寸下限']))) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「尺寸下限」不得為空，請修正`
        );
        return false;
      }

      if (_.isEmpty(String(jsonExcelData[i - 1]['尺寸上限']))) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「尺寸上限」不得為空，請修正`
        );
        return false;
      }
    }

    return true;
  }

  exportToExcel() {
    let myThis = this;
    myThis.isSpinning = true;
    let p = this.getAllData();

    p.then((jsonDataFroExport) => {
      const firstRow = ['diaMin', 'diaMax', 'productionTime'];
      const firstRowDisplay = {
        diaMin: '尺寸下限',
        diaMax: '尺寸上限',
        productionTime: '每爐生產時間',
      };
      const exportData = [firstRowDisplay, ...jsonDataFroExport];

      const workSheet = XLSX.utils.json_to_sheet(exportData, {
        header: firstRow,
        skipHeader: true,
      });
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
      XLSX.writeFileXLSX(workBook, '直棒批次爐表.xlsx');

      myThis.isSpinning = false;
      myThis.sucessMSG('匯出成功!', ``);
    }).catch(function (error) {
      myThis.isSpinning = false;
      myThis.errorMSG(error, ``);
    });
  }

  getAllData() {
    let myThis = this;
    return new Promise<any>(function (resolve, reject) {
      myThis.PPSService.listtbppsm114AllData().subscribe(
        (response) => {
          if (response.success === true) {
            resolve(response.data);
          } else {
            reject(`${response.message}。無法匯出Excel"`);
          }
        },
        (error) => {
          reject(
            `匯出失敗，後台匯出錯誤，請聯繫系統工程師。Error Msg : ${JSON.stringify(
              error['error']
            )}`
          );
        }
      );
    });
  }
}
