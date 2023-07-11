import { CommonService } from './../../../services/common/common.service';
import { Component, AfterViewInit } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';

interface ItemData13 {
  id: string;
  tab1ID: number;
  GRADE_NO_13: string;
  OUT_TYPE: string;
  DIA_MIN: number;
  DIA_MAX: number;
  GRINDING_PASS: number;
  GRINDING_SIZE: number;
}

@Component({
  selector: 'app-PPSI121',
  templateUrl: './PPSI121.component.html',
  styleUrls: ['./PPSI121.component.scss'],
  providers: [NzMessageService],
})
export class PPSI121Component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  // 研磨道次
  GRADE_NO_13;
  OUT_TYPE;
  DIA_MIN;
  DIA_MAX;
  GRINDING_PASS;
  GRINDING_SIZE;
  isVisibleGrinding = false;
  searchGradeNo13Value = '';
  searchOutTypeValue = '';
  searchDiaMinValue = '';
  searchDiaMaxValue = '';
  searchGrindingPassValue = '';
  searchGrindingSizeValue = '';

  isSpinning = false;
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
    this.PLANT_CODE = this.cookieService.getCookie('plantCode');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewChecked');
    this.getPPSINP13List();
  }

  PPSINP13List_tmp;
  editCache13: { [key: string]: { edit: boolean; data: ItemData13 } } = {};
  PPSINP13List: ItemData13[] = [];
  displayPPSINP13List: ItemData13[] = [];
  getPPSINP13List() {
    this.isSpinning = true;
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP13List().subscribe((res) => {
      const licss = document.getElementById('bbli');
      if (licss != null) {
        licss.style.backgroundColor = '#E4E3E3';
      }
      const acss = document.getElementById('bba');
      if (acss != null) {
        acss.style.cssText = 'color: blue; font-weight:bold;';
      }
      document.getElementById('number').innerHTML = 'PPSI121';
      console.log('getPPSINP13List success');
      this.PPSINP13List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP13List_tmp.length; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.PPSINP13List_tmp[i].ID,
          GRADE_NO_13: this.PPSINP13List_tmp[i].GRADE_NO,
          OUT_TYPE: this.PPSINP13List_tmp[i].OUT_TYPE,
          DIA_MIN: this.PPSINP13List_tmp[i].DIA_MIN,
          DIA_MAX: this.PPSINP13List_tmp[i].DIA_MAX,
          GRINDING_PASS: this.PPSINP13List_tmp[i].GRINDING_PASS,
          GRINDING_SIZE: this.PPSINP13List_tmp[i].GRINDING_SIZE,
        });
      }
      this.PPSINP13List = data;
      this.displayPPSINP13List = this.PPSINP13List;
      this.updateEditCache();
      console.log(this.PPSINP13List);
      myObj.loading = false;
      myObj.isSpinning = false;
    });
  }

  // insert
  insertTab() {
    let myObj = this;
    if (this.GRADE_NO_13 === undefined) {
      myObj.message.create('error', '「鋼種類別」不可為空');
      return;
    } else if (this.OUT_TYPE === undefined) {
      myObj.message.create('error', '「產出型態」不可為空');
      return;
    } else if (this.DIA_MIN === undefined) {
      myObj.message.create('error', '「產出成品尺寸最小值」不可為空');
      return;
    } else if (this.DIA_MAX === undefined) {
      myObj.message.create('error', '「產出成品尺寸最大值」不可為空');
      return;
    } else if (this.GRINDING_PASS === undefined) {
      myObj.message.create('error', '「研磨道次」不可為空');
      return;
    } else if (this.GRINDING_SIZE === undefined) {
      myObj.message.create('error', '「每刀研磨尺寸」不可為空');
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
    this.editCache13[id].edit = true;
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
    const index = this.PPSINP13List.findIndex((item) => item.id === id);
    this.editCache13[id] = {
      data: { ...this.PPSINP13List[index] },
      edit: false,
    };
  }

  // update Save
  saveEdit(id: string): void {
    let myObj = this;
    if (this.editCache13[id].data.GRADE_NO_13 === undefined) {
      myObj.message.create('error', '「輸入鋼種」不可為空');
      return;
    } else if (this.editCache13[id].data.OUT_TYPE === undefined) {
      myObj.message.create('error', '「產出型態」不可為空');
      return;
    } else if (this.editCache13[id].data.DIA_MIN === undefined) {
      myObj.message.create('error', '「產出成品尺寸最小值」不可為空');
      return;
    } else if (this.editCache13[id].data.DIA_MAX === undefined) {
      myObj.message.create('error', '「產出成品尺寸最大值」不可為空');
      return;
    } else if (this.editCache13[id].data.GRINDING_PASS === undefined) {
      myObj.message.create('error', '「研磨道次」不可為空');
      return;
    } else if (this.editCache13[id].data.GRINDING_SIZE === undefined) {
      myObj.message.create('error', '「每刀研磨尺寸」不可為空');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.updateSave(id);
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }

  // update
  updateEditCache(): void {
    this.PPSINP13List.forEach((item) => {
      this.editCache13[item.id] = {
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
        GRADE_NO: this.GRADE_NO_13,
        OUT_TYPE: this.OUT_TYPE,
        DIA_MIN: this.DIA_MIN,
        DIA_MAX: this.DIA_MAX,
        GRINDING_PASS: this.GRINDING_PASS,
        GRINDING_SIZE: this.GRINDING_SIZE,
      });

      myObj.PPSService.insertI113Tab1Save(obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.GRADE_NO_13 = undefined;
            this.OUT_TYPE = undefined;
            this.DIA_MIN = undefined;
            this.DIA_MAX = undefined;
            this.GRINDING_PASS = undefined;
            this.GRINDING_SIZE = undefined;
            this.getPPSINP13List();
            this.sucessMSG('新增成功', ``);
            this.isVisibleGrinding = false;
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
  updateSave(_id) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID: this.editCache13[_id].data.tab1ID,
        GRADE_NO: this.editCache13[_id].data.GRADE_NO_13,
        OUT_TYPE: this.editCache13[_id].data.OUT_TYPE,
        DIA_MIN: this.editCache13[_id].data.DIA_MIN,
        DIA_MAX: this.editCache13[_id].data.DIA_MAX,
        GRINDING_PASS: this.editCache13[_id].data.GRINDING_PASS,
        GRINDING_SIZE: this.editCache13[_id].data.GRINDING_SIZE,
      });

      myObj.PPSService.updateI113Tab1Save(obj).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.GRADE_NO_13 = undefined;
            this.OUT_TYPE = undefined;
            this.DIA_MIN = undefined;
            this.DIA_MAX = undefined;
            this.GRINDING_PASS = undefined;
            this.GRINDING_SIZE = undefined;

            this.sucessMSG('修改成功', ``);

            const index = this.PPSINP13List.findIndex(
              (item) => item.id === _id
            );
            Object.assign(this.PPSINP13List[index], this.editCache13[_id].data);
            this.editCache13[_id].edit = false;
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
      let _ID = this.editCache13[_id].data.tab1ID;
      myObj.PPSService.delI113Tab1Data(_ID).subscribe(
        (res) => {
          if (res[0].MSG === 'Y') {
            this.sucessMSG('刪除成功', ``);
            this.getPPSINP13List();
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
  // 新增研磨道次之彈出視窗
  openGrindingInput(): void {
    this.isVisibleGrinding = true;
  }
  // 取消研磨道次之彈出視窗
  cancelGrindingInput(): void {
    this.isVisibleGrinding = false;
  }

  // ============= 過濾資料之menu ========================
  // 研磨道次
  ppsInp13ListFilter(property: string, keyWord: string): void {
    if (_.isEmpty(keyWord)) {
      this.displayPPSINP13List = this.PPSINP13List;
      return;
    }

    const filterFunc = (item) => {
      let propertyValue = _.get(item, property);
      return _.startsWith(propertyValue, keyWord);
    };

    const data = this.PPSINP13List.filter((item) => filterFunc(item));
    this.displayPPSINP13List = data;
  }

  // 資料過濾---研磨道次 --> 鋼種類別
  searchByGradeNo13(): void {
    this.ppsInp13ListFilter('GRADE_NO_13', this.searchGradeNo13Value);
  }
  resetByGradeNo13(): void {
    this.searchGradeNo13Value = '';
    this.ppsInp13ListFilter('GRADE_NO_13', this.searchGradeNo13Value);
  }

  // 資料過濾---研磨道次 --> 產出型態
  searchByOutType(): void {
    this.ppsInp13ListFilter('OUT_TYPE', this.searchOutTypeValue);
  }
  resetByOutType(): void {
    this.searchOutTypeValue = '';
    this.ppsInp13ListFilter('OUT_TYPE', this.searchOutTypeValue);
  }

  // 資料過濾---研磨道次 --> 產出成品尺寸最小值
  searchByDiaMin(): void {
    this.ppsInp13ListFilter('DIA_MIN', this.searchDiaMinValue);
  }
  resetByDiaMin(): void {
    this.searchDiaMinValue = '';
    this.ppsInp13ListFilter('DIA_MIN', this.searchDiaMinValue);
  }

  // 資料過濾---研磨道次 --> 產出成品尺寸最大值
  searchByDiaMax(): void {
    this.ppsInp13ListFilter('DIA_MAX', this.searchDiaMaxValue);
  }
  resetByDiaMax(): void {
    this.searchDiaMaxValue = '';
    this.ppsInp13ListFilter('DIA_MAX', this.searchDiaMaxValue);
  }

  // 資料過濾---研磨道次 --> 研磨道次
  searchByGrindingPass(): void {
    this.ppsInp13ListFilter('GRINDING_PASS', this.searchGrindingPassValue);
  }
  resetByGrindingPass(): void {
    this.searchGrindingPassValue = '';
    this.ppsInp13ListFilter('GRINDING_PASS', this.searchGrindingPassValue);
  }

  // 資料過濾---研磨道次 --> 每刀研磨尺寸
  searchByGrindingsize(): void {
    this.ppsInp13ListFilter('GRINDING_SIZE', this.searchGrindingSizeValue);
  }
  resetByGrindingsize(): void {
    this.searchGrindingSizeValue = '';
    this.ppsInp13ListFilter('GRINDING_SIZE', this.searchGrindingSizeValue);
  }

  // excel檔案
  incomingFile($event: any) {
    this.excelImportFile = $event.target.files[0];
    let lastName = this.excelImportFile.name.split('.').pop();
    if (lastName !== 'xlsx' && lastName !== 'xls' && lastName !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      (<HTMLInputElement>document.getElementById('importExcel')).value = '';
      return;
    }
  }

  jsonExcelData: any[] = [];
  handleImport(): void {
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
    const p = this.deleteAllData();
    p.then((deleteSuccess) => {
      // 批次新增Excle中的資料
      return myThis.barchInsertExcelData();
    })
      .then((barchInsertSuccess) => {
        myThis.sucessMSG(barchInsertSuccess, ``);
        this.getPPSINP13List();
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
      myThis.PPSService.batchSaveI113Data(myThis.jsonExcelData).subscribe(
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
      myThis.PPSService.deleteI113AllData().subscribe(
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
      JSON.stringify(this.jsonExcelData)
        .split('"鋼種類別":')
        .join('"GRADE_NO_13":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"產出型態":')
        .join('"OUT_TYPE":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"產出成品尺寸最小值":')
        .join('"DIA_MIN":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"產出成品尺寸最大值":')
        .join('"DIA_MAX":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"研磨道次":')
        .join('"GRINDING_PASS":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"每刀研磨尺寸":')
        .join('"GRINDING_SIZE":')
    );
  }

  checkAllValuesNotEmpty(jsonExcelData): boolean {
    for (let i = 1; i <= jsonExcelData.length; i++) {
      let rowNumberInExcel = i + 1;

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['鋼種類別'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['鋼種類別']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「鋼種類別」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['產出型態'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['產出型態']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「產出型態」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['產出成品尺寸最小值'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['產出成品尺寸最小值']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「產出成品尺寸最小值」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['產出成品尺寸最大值'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['產出成品尺寸最大值']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「產出成品尺寸最大值」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['研磨道次'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['研磨道次']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「研磨道次」不得為空，請修正`
        );
        return false;
      }

      if (
        _.isEmpty(String(jsonExcelData[i - 1]['每刀研磨尺寸'])) ||
        _.isEqual(String(jsonExcelData[i - 1]['每刀研磨尺寸']), '-')
      ) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「每刀研磨尺寸」不得為空，請修正`
        );
        return false;
      }
    } //end for

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
      if (k === '鋼種類別') b1 = true;
      else if (k === '產出型態') b2 = true;
      else if (k === '產出成品尺寸最小值') b3 = true;
      else if (k === '產出成品尺寸最大值') b4 = true;
      else if (k === '研磨道次') b5 = true;
      else if (k === '每刀研磨尺寸') b6 = true;
    });

    return b1 && b2 && b3 && b4 && b5 && b6;
  }

  exportToExcel(): void {
    this.isSpinning = true;

    const exportJsonDataList = this.displayPPSINP13List.map((obj) => {
      return _.omit(obj, ['id', 'tab1ID']);
    });

    const firstRow = [
      'GRADE_NO_13',
      'OUT_TYPE',
      'DIA_MIN',
      'DIA_MAX',
      'GRINDING_PASS',
      'GRINDING_SIZE',
    ];
    const firstRowDisplay = {
      GRADE_NO_13: '鋼種類別',
      OUT_TYPE: '產出型態',
      DIA_MIN: '產出成品尺寸最小值',
      DIA_MAX: '產出成品尺寸最大值',
      GRINDING_PASS: '研磨道次',
      GRINDING_SIZE: '每刀研磨尺寸',
    };
    const exportData = [firstRowDisplay, ...exportJsonDataList];

    const workSheet = XLSX.utils.json_to_sheet(exportData, {
      header: firstRow,
      skipHeader: true,
    });
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
    XLSX.writeFileXLSX(workBook, '直棒研磨道次.xlsx');

    this.isSpinning = false;
    this.sucessMSG('匯出成功!', ``);
  }
}
