import { map } from 'rxjs/operators';
import { Component, AfterViewInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx';

class Tbppsm014 {
   id : number;
   plantCode : string;
   shopCode : string;
   steelType : string;
   diaMin : number;
   dixMax : number;
   processCode2pcs : string;
   processCode4pcs : string;
   dateCreate : number;
   userCreate : string;
   dateUpdate : number;
   userUpdate : string;
  
  constructor(_id : number, _plantCode : string, _shopCode : string,
              _steelType : string, _diaMin : number, _dixMax : number,
              _processCode2pcs : string, _processCode4pcs : string,
              _dateCreate : number, _userCreate : string,
              _dateUpdate : number, _userUpdate : string){
    this.id = _id;
    this.plantCode = _plantCode;
    this.shopCode = _shopCode;
    this.steelType = _steelType;
    this.diaMin = _diaMin;
    this.dixMax = _dixMax;
    this.processCode2pcs = _processCode2pcs;
    this.processCode4pcs = _processCode4pcs;
    this.dateCreate = _dateCreate;
    this.userCreate = _userCreate;
    this.dateUpdate = _dateUpdate;
    this.userUpdate = _userUpdate;
  }
}

class DisplayTbppsm014 extends Tbppsm014{
  isEdit : boolean;
  constructor(_id : number, _plantCode : string, _shopCode : string,
    _steelType : string, _diaMin : number, _dixMax : number,
    _processCode2pcs : string, _processCode4pcs : string,
    _dateCreate : number, _userCreate : string,
    _dateUpdate : number, _userUpdate : string,
    _isEdit : boolean){

    super(_id, _plantCode, _shopCode, _steelType, 
          _diaMin, _dixMax, _processCode2pcs, _processCode4pcs,
          _dateCreate, _userCreate, _dateUpdate, _userUpdate)

    this.isEdit = _isEdit;
  }

}

@Component({
  selector: "app-PPSI130",
  templateUrl: "./PPSI130.component.html",
  styleUrls: ["./PPSI130.component.scss"],
  providers:[NzMessageService]
})
export class PPSI130Component implements AfterViewInit {

  USERNAME;
  PLANT_CODE;
  isSpinning = false;


/////////////////////////////////////////////////////////////
// 批次爐鋼種捲數製程碼對應表
/////////////////////////////////////////////////////////////

  // 控制輸入彈出視窗的顯示
  isVisibleBFSGCCPC = false;
  // 輸入欄位 -> 站別
  shopCodeInput = "";
  // 輸入欄位 -> 鋼種
  steelTypeInput = "";
  // 輸入欄位 -> 尺寸_min(含)
  diaMinInput : number = undefined;
  // 輸入欄位 -> 尺寸_max(含)
  dixMaxInput : number = undefined;
  // 輸入欄位 -> 製程碼_一爐兩捲
  processCode2pcsInput = "";
  // 輸入欄位 -> 製程碼_一爐四捲
  processCode4pcsInput = "";


  // 廠區別搜尋關鍵字
  searchPlantCodeValue = "";
  // 廠區別搜尋框是否出現
  plantCodeFilterVisible = false;

  // 站別搜尋關鍵字
  searchShopCodeValue = "";
  // 站別搜尋框是否出現
  shopCodeFilterVisible = false;

  // 鋼種搜尋關鍵字
  searchSteelTypeValue = "";
  // 鋼種搜尋框是否出現
  steelTypeFilterVisible = false;

  // 尺寸_min(含)搜尋關鍵字
  searchDiaMinValue = "";
  // 尺寸_min(含)搜尋框是否出現
  diaMinFilterVisible = false;

   // 尺寸_max(含)搜尋關鍵字
  searchDiaMaxValue = "";
  // 尺寸_max(含)搜尋框是否出現
  diaMaxFilterVisible = false;

  // 製程碼_一爐兩捲搜尋關鍵字
  searchProcessCode2pcsValue = "";
  // 製程碼_一爐兩捲搜尋框是否出現
  processCode2pcsFilterVisible = false;

  // 製程碼_一爐四捲搜尋關鍵字
  searchProcessCode4pcsValue = "";
  // 製程碼_一爐四捲搜尋框是否出現
  processCode4pcsFilterVisible = false;

  // 是否正在搜尋
  isSearching = false;
  // 正在針對哪一個欄位做搜尋
  searchingColumn = "";

  DB_PLANT_CODE_COLUMN_NAME = "PLANT_CODE";
  DB_SHOP_CODE_COLUMN_NAME = "SCH_SHOP_CODE";
  DB_STEEL_TYPE_COLUMN_NAME = "STEEL_TYPE";
  DB_DIA_MIN_COLUMN_NAME = "DIA_MIN";
  DB_DIA_MAX_COLUMN_NAME = "DIA_MAX";
  DB_PROCESS_CODE_2PCS_COLUMN_NAME = "PROCESS_CODE_2PCS";
  DB_PROCESS_CODE_4PCS_COLUMN_NAME = "PROCESS_CODE_4PCS";

  // 於畫面表格顯示的資料
  displayTbppsm014List: DisplayTbppsm014[] = [];
  // 編輯時顯示的資料
  editCache: { [id: number]: { isEdit: boolean; data: Tbppsm014 } } = {};
  // 記錄一個用來比對使用者是否有修改畫面上資料的變數
  wasModifiedData : { [id: number] : {data: Tbppsm014} } = {};

  // tbppsm014表總共有幾筆資料
  tbppsm014DataTotal = 0;
  // 當前頁碼(第幾頁)
  currentPageIndex = 1;
  // 每頁有幾筆
  pageSize = 20;

  // 紀錄正在編輯中的項目id
  editingItemList : number[] = [];


  constructor(
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }

  ngAfterViewInit() {
   const p = this.getPPSI130List();
   this.setupTableAndEditCache(p);
  }
  
  getPPSI130List() {

    this.isSpinning = true;
    
    const myThis = this;
    return new Promise<any>(function(resolve, reject){
      myThis.PPSService.listTbppsm014DataByPagination(myThis.currentPageIndex, myThis.pageSize).subscribe(response => {
        const resData = {response : response, isSearch : false}
        resolve(resData);
      }, error =>{
        const errorMsg = JSON.stringify(error["error"]);
        reject(`查詢失敗，後台新增錯誤，請聯繫系統工程師。Error Msg : ${errorMsg}`);
      })
    });
  }

  handleData(resData){
    const response = resData['response'];
    if(response.success === true){
      this.setupTable(response);
      this.setupUpdateEditCache();
      if(response.data.length <= 0){
        this.sucessMSG("已無資料", ``);
        return;
      }
    }else{
      this.errorMSG(response.message, ``);
    }
  }

  setupTableAndEditCache(p : Promise<any>){
    const myThis = this;
    p.then(response =>{
      myThis.handleData(response);
      myThis.isSpinning = false;
    }).catch(error => {
      myThis.isSpinning = false;
      myThis.errorMSG(error.message, ``);
    });
  }

  setupTable(response) : void {
   this.tbppsm014DataTotal = response.totalCount;
   const dataList = response.data;

   const displayDataList : DisplayTbppsm014[] = 

      dataList.map(item => {
       
        let isEdit = _.includes(this.editingItemList, item.id);
        
        let data = new DisplayTbppsm014 (
          item.id,
          item.plantCode,
          item.shopCode,
          item.steelType,
          item.diaMin,
          item.dixMax,
          item.processCode2pcs,
          item.processCode4pcs,
          item.dateCreate,
          item.userCreate,
          item.dateUpdate,
          item.userUpdate,
          isEdit
        )
        return data;
      });

      this.displayTbppsm014List = displayDataList;
  }

  // 複製一份資料到編輯專用的資料list
 setupUpdateEditCache(): void {
  this.editCache = {};
  this.displayTbppsm014List.forEach(item => {
    let newCloneItem : Tbppsm014 = _.omit(item, ['isEdit']);
    this.editCache[item.id] = {
      isEdit: item.isEdit,
      data: newCloneItem
    };
  });
}

  editRow(id : number) : void {
    // 紀錄有哪筆資料處於編輯中
    this.editingItemList.push(id);
    this.editCache[id].isEdit = true;
     //去重，以避免不可知的情況同一筆ID被加入超過第1次
    this.editingItemList = _.uniq(this.editingItemList);

    // 紀錄此筆資料使用者是否有修改
    this.wasModifiedData[id] = { data : _.cloneDeep(this.editCache[id].data) };
    
  }

  cancelEdit(id : number) : void {
    _.remove(this.editingItemList, _id => _id === id);
    this.editCache[id].isEdit = false;

    //將儲存編輯中的資料還原
    this.editCache[id].data = _.cloneDeep(this.wasModifiedData[id].data);

    //移除「紀錄此筆資料使用者是否有修改」的資料
    delete this.wasModifiedData[id];
  } 

  deleteRow(id : number) : void {
    this.isSpinning = true;
    const myThis = this;
    new Promise<any>(function(resolve, reject){
      myThis.PPSService.deleteTbppsm014Data(id).subscribe(response => {
        if(response.success == true){
          resolve(true);
        }
        else{
          reject(response.message);
        }
        
      }, error =>{
        const errorMsg = JSON.stringify(error["error"]);
        reject(`刪除失敗，後台錯誤，請聯繫系統工程師。Error Msg : ${errorMsg}`);
      })
    }).then(updateSuccess => {
      if(_.isEmpty(myThis.searchingColumn)) return this.getPPSI130List();
      else return this.switchGetSearchTbppsm014ColumnDataByKeyWord();
    }).then(resData => { 
      this.handleData(resData);
      myThis.sucessMSG("刪除成功", ``);
      myThis.isSpinning = false;
    }).catch(function(error) {
      myThis.isSpinning = false;
      myThis.errorMSG(error, ``);
    });

  }
 
  saveEdit(id : number) {

    let updateItem =  this.editCache[id].data;
    let wasModifiedItem = this.wasModifiedData[id].data;
    
    if(_.isEqual(updateItem, wasModifiedItem)){
      this.message.create("error", "無法更新，資料與原來相同");
      return;
    }

    this.Modal.confirm({
      nzTitle: '是否確定修改?',
      nzOnOk: () => {
        updateItem.userUpdate = this.USERNAME;
        this.isSpinning = true;
        const myThis = this;
        new Promise<any>(function(resolve, reject){
          myThis.PPSService.updateTbppsm014Data(updateItem).subscribe(response => {
            if(response.success == true){
              resolve(true);
            }
            else{
              reject(response.message);
            }
            
          }, error =>{
            const errorMsg = JSON.stringify(error["error"]);
            reject(`更新失敗，後台錯誤，請聯繫系統工程師。Error Msg : ${errorMsg}`);
          })
        }).then(updateSuccess => {
          myThis.cancelEdit(id);

          if(_.isEmpty(myThis.searchingColumn)) return this.getPPSI130List();
          else return this.switchGetSearchTbppsm014ColumnDataByKeyWord();

        }).then(resData => { 
          this.handleData(resData);
          myThis.sucessMSG("更新成功", ``);
          myThis.isSpinning = false;
        }).catch(function(error) {
          myThis.isSpinning = false;
          myThis.errorMSG(error, ``);
        });
      },
      nzOnCancel: () =>
      console.log("cancel")
    });
  }

 

  insertData() : void {

    if(!this.validateInputFieldForInsert()) {
      return;
    }
    
    this.Modal.confirm({
      nzTitle: '是否確定新增?',
      nzOnOk: () => {
        this.isSpinning = true;
        const tbppsm014Data = new Tbppsm014(
                        null,
                        this.PLANT_CODE,
                        this.shopCodeInput,
                        this.steelTypeInput,
                        this.diaMinInput,
                        this.dixMaxInput,
                        this.processCode2pcsInput,
                        this.processCode4pcsInput,
                        null,
                        this.USERNAME,
                        null,
                        null);

        const myThis = this;
        new Promise<any>(function(resolve, reject){
          myThis.PPSService.saveTbppsm014Data(tbppsm014Data).subscribe(response => {
            if(response.success === true) resolve(response.message);
            else reject(response.message);
          }, error =>{
            const errorMsg = JSON.stringify(error["error"]);
            reject(`新增失敗，後台新增錯誤，請聯繫系統工程師。Error Msg : ${errorMsg}`);
          });

        }).then(saveSuccess => {
          this.isVisibleBFSGCCPC = false;
          this.shopCodeInput = "";
          this.steelTypeInput = "";
          this.diaMinInput = undefined;
          this.dixMaxInput = undefined;
          this.processCode2pcsInput = "";
          this.processCode4pcsInput = "";
          myThis.sucessMSG(saveSuccess, ``);
          return this.getPPSI130List();
        }).then(response => {
          this.handleData(response);
          myThis.isSpinning = false;
        }).catch(error => {
          myThis.isSpinning = false;
          myThis.errorMSG(error, ``);
        });
      },
      nzOnCancel: () =>
        console.log("cancel add data")
    });
  }

  validateInputFieldForInsert() : boolean {

    if (_.isEmpty(this.shopCodeInput)) {
      this.message.create("error", "「站別」不可為空");
      return false;
    }

    if (_.isEmpty(this.steelTypeInput)) {
      this.message.create("error", "「鋼種」不可為空");
      return false;
    }

    if (!_.isNumber(this.diaMinInput)) {
      this.message.create("error", "「尺寸_min(含)」僅能是數字或不可為空");
      return false;
    }

    if (!_.isNumber(this.dixMaxInput)) {
      this.message.create("error", "「尺寸_max(含)」僅能是數字或不可為空");
      return false;
    }

    if (_.isEmpty(this.processCode2pcsInput)) {
      this.message.create("error", "「製程碼_一爐兩捲」不可為空");
      return false;
    }

    if (_.isEmpty(this.processCode4pcsInput)) {
      this.message.create("error", "「製程碼_一爐四捲」不可為空");
      return false;
    }

    return true;

  }

  tablePageChange() : void {

    this.isSpinning = true;

    if(!_.isEmpty(this.searchingColumn)){
      const p = this.switchGetSearchTbppsm014ColumnDataByKeyWord();
      this.setupTableAndEditCache(p);
      return;
    }

    const p = this.getPPSI130List();
    this.setupTableAndEditCache(p);
  }


	sucessMSG(_title, _plan): void {
		this.Modal.success({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}

	errorMSG(_title, _context): void {
		this.Modal.error({
			nzTitle: _title,
			nzContent: `${_context}`
		});
	}

  //============== 新增資料之彈出視窗 =====================
  // 新增 批次爐鋼種捲數製程碼對應表 之彈出視窗 
  openBFSGCCPCInput(): void {
    this.isVisibleBFSGCCPC = true;
  }
  // 取消 批次爐鋼種捲數製程碼對應表 之彈出視窗 
  cancelBFSGCCPCInput() : void {
    this.isVisibleBFSGCCPC = false;
  }


// ============= filter資料 ========================

  searchByPlantCode(isUserClick : boolean){
    if(_.isEmpty(this.searchPlantCodeValue)){
      this.message.create("error", "請輸入搜尋關鍵字");
      return;
    }

    this.searchingColumn = this.DB_PLANT_CODE_COLUMN_NAME;
    this.clearOtherSearchValue(this.DB_PLANT_CODE_COLUMN_NAME);
    const p = this.searchTbppsm014ColumnDataByKeyWord(this.DB_PLANT_CODE_COLUMN_NAME, this.searchPlantCodeValue);

    if(!isUserClick){
      return p;
    }
    else{
      this.setupTableAndEditCache(p);
      this.plantCodeFilterVisible = false;
    }
  }
  resetByPlantCode(){
    this.searchPlantCodeValue = "";
    this.reset();
    this.plantCodeFilterVisible = false;
  }


  searchByShopCode(isUserClick : boolean){
    if(_.isEmpty(this.searchShopCodeValue)){
      this.message.create("error", "請輸入搜尋關鍵字");
      return;
    }

    this.searchingColumn = this.DB_SHOP_CODE_COLUMN_NAME;
    this.clearOtherSearchValue(this.DB_SHOP_CODE_COLUMN_NAME);
    const p = this.searchTbppsm014ColumnDataByKeyWord(this.searchingColumn, this.searchShopCodeValue);

    if(!isUserClick){
      return p;
    }
    else{
      this.setupTableAndEditCache(p);
      this.shopCodeFilterVisible = false;
    }
  }
  resetByShopCode(){
    this.searchShopCodeValue = "";
    this.reset();
    this.shopCodeFilterVisible = false;
  }

  searchBySteelType(isUserClick : boolean){
    
    if(_.isEmpty(this.searchSteelTypeValue)){
      this.message.create("error", "請輸入搜尋關鍵字");
      return;
    }

    this.searchingColumn = this.DB_STEEL_TYPE_COLUMN_NAME;
    this.clearOtherSearchValue(this.DB_STEEL_TYPE_COLUMN_NAME);
    const p = this.searchTbppsm014ColumnDataByKeyWord(this.searchingColumn, this.searchSteelTypeValue);

    if(!isUserClick){
      return p;
    }
    else{
      this.setupTableAndEditCache(p);
      this.steelTypeFilterVisible = false;
    }

  }
  resetBySteelType(){
    this.searchSteelTypeValue = "";
    this.reset();
    this.steelTypeFilterVisible = false;
  }

  searchByDiaMin(isUserClick : boolean){
    if(_.isEmpty(this.searchDiaMinValue)){
      this.message.create("error", "請輸入搜尋關鍵字");
      return;
    }

    this.searchingColumn = this.DB_DIA_MIN_COLUMN_NAME;
    this.clearOtherSearchValue(this.DB_DIA_MIN_COLUMN_NAME);
    const p = this.searchTbppsm014ColumnDataByKeyWord(this.searchingColumn, this.searchDiaMinValue);

    if(!isUserClick){
      return p;
    }
    else{
      this.setupTableAndEditCache(p);
      this.diaMinFilterVisible = false;
    }
  }
  resetByDiaMin(){
    this.searchDiaMinValue = "";
    this.reset();
    this.diaMinFilterVisible = false;
  }

  searchByDiaMax(isUserClick : boolean){
    if(_.isEmpty(this.searchDiaMaxValue)){
      this.message.create("error", "請輸入搜尋關鍵字");
      return;
    }

    this.searchingColumn = this.DB_DIA_MAX_COLUMN_NAME;
    this.clearOtherSearchValue(this.DB_DIA_MAX_COLUMN_NAME);
    const p = this.searchTbppsm014ColumnDataByKeyWord(this.searchingColumn, this.searchDiaMaxValue);

    if(!isUserClick){
      return p;
    }
    else{
      this.setupTableAndEditCache(p);
      this.diaMaxFilterVisible = false;
    }
  }
  resetByDiaMax(){
    this.searchDiaMaxValue = "";
    this.reset();
    this.diaMaxFilterVisible = false;
  }

  searchByProcessCode2pcs(isUserClick : boolean){
    if(_.isEmpty(this.searchProcessCode2pcsValue)){
      this.message.create("error", "請輸入搜尋關鍵字");
      return;
    }

    this.searchingColumn = this.DB_PROCESS_CODE_2PCS_COLUMN_NAME;
    this.clearOtherSearchValue(this.DB_PROCESS_CODE_2PCS_COLUMN_NAME);
    const p = this.searchTbppsm014ColumnDataByKeyWord(this.searchingColumn, this.searchProcessCode2pcsValue);

    if(!isUserClick){
      return p;
    }
    else{
      this.setupTableAndEditCache(p);
      this.processCode2pcsFilterVisible = false;
    }
  }
  resetByProcessCode2pcs(){
    this.searchProcessCode2pcsValue = "";
    this.reset();
    this.processCode2pcsFilterVisible = false;
  }

  searchByProcessCode4pcs(isUserClick : boolean){
    if(_.isEmpty(this.searchProcessCode4pcsValue)){
      this.message.create("error", "請輸入搜尋關鍵字");
      return;
    }

    this.searchingColumn = this.DB_PROCESS_CODE_4PCS_COLUMN_NAME;
    this.clearOtherSearchValue(this.DB_PROCESS_CODE_4PCS_COLUMN_NAME);
    const p = this.searchTbppsm014ColumnDataByKeyWord(this.searchingColumn, this.searchProcessCode4pcsValue);

    if(!isUserClick){
      return p;
    }
    else{
      this.setupTableAndEditCache(p);
      this.processCode4pcsFilterVisible = false;
    }
  }
  resetByProcessCode4pcs(){
    this.searchProcessCode4pcsValue = "";
    this.reset();
    this.processCode4pcsFilterVisible = false;
  }



  reset() : void{
    this.isSpinning = true;
    this.currentPageIndex = 1;
    this.searchingColumn = "";
    this.clearOtherSearchValue("All Clear");
    const p = this.getPPSI130List();
    this.setupTableAndEditCache(p);  
  }

  clearOtherSearchValue(currentField : string){

    if(!_.isEqual(currentField, this.DB_SHOP_CODE_COLUMN_NAME)){
      this.searchShopCodeValue = "";
    }

    if(!_.isEqual(currentField, this.DB_STEEL_TYPE_COLUMN_NAME)){
      this.searchSteelTypeValue = "";
    }

    if(!_.isEqual(currentField, this.DB_DIA_MIN_COLUMN_NAME)){
      this.searchDiaMinValue = "";
    }

    if(!_.isEqual(currentField, this.DB_DIA_MAX_COLUMN_NAME)){
      this.searchDiaMaxValue = "";
    }

    if(!_.isEqual(currentField, this.DB_PROCESS_CODE_2PCS_COLUMN_NAME)){
      this.searchProcessCode2pcsValue = "";
    }

    if(!_.isEqual(currentField, this.DB_PROCESS_CODE_4PCS_COLUMN_NAME)){
      this.searchProcessCode4pcsValue = "";
    }



  }


  searchTbppsm014ColumnDataByKeyWord(column:string, keyword:string){

    this.isSpinning = true;
    const myThis = this;
    return new Promise(function(resolve, reject){
      myThis.PPSService.searchTbppsm014ColumnDataByKeyword(
          column, 
          keyword, 
          myThis.currentPageIndex,
          myThis.pageSize
          ).subscribe(response => {
            if(response.success === true){
              const resData = {response : response, isSearch : true}
              resolve(resData);
            }
            else {
              reject(response.message);
            }
          }, error =>{
            reject(`查詢失敗，後台查詢錯誤，請聯繫系統工程師。Error Msg : ${JSON.stringify(error["error"])}`);
          });
      });
  }


  switchGetSearchTbppsm014ColumnDataByKeyWord() {

    let p : Promise<any>;

    switch (this.searchingColumn){
      case this.DB_SHOP_CODE_COLUMN_NAME : {
        p =  this.searchByShopCode(false);
        break;
      }
      case this.DB_STEEL_TYPE_COLUMN_NAME : {
        p =  this.searchBySteelType(false);
        break;
      }
      case this.DB_DIA_MIN_COLUMN_NAME: {
        p =  this.searchByDiaMin(false);
        break;
      }
      case this.DB_DIA_MAX_COLUMN_NAME: {
        p =  this.searchByDiaMax(false);
        break;
      }
      case this.DB_PROCESS_CODE_2PCS_COLUMN_NAME: {
        p =  this.searchByProcessCode2pcs(false);
        break;
      }
      case this.DB_PROCESS_CODE_4PCS_COLUMN_NAME: {
        p =  this.searchByProcessCode4pcs(false);
        break;
      }
      default: {
        break;
      }
    }

    return p;

  }

  jsonExcelData: any[] = [];
  handleImport($event: any) {

    const files = $event.target.files;

    if (files.length) {

      const reader = new FileReader();
      const file = files[0];

      // 文件加載完成後調用
      reader.onload = (e: any) => {
        this.isSpinning = true;

        // 從檔案獲取原始資料
        let data = e.target.result;

        // 從原始資料獲取工作簿
        // 兼容IE，需把type改為binary，並對data進行轉化
        let workbook = XLSX.read(data, {
          type: 'binary'
        });

        const sheets = workbook.SheetNames;

        if (sheets.length) {
          var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]], {
            defval: '' // 單元格為空的預設值
          });
          this.jsonExcelData = jsonData;

          if(this.jsonExcelData.length != 0){
            this.importExcel();
          }
          else{
            this.errorMSG("匯入失敗", `此檔案無任何數據`);
            this.isSpinning = false;
          }

        }
      }
      // 加載文件
      reader.readAsArrayBuffer(file);
    }
  }

  importExcel(){

    // 檢查欄位名稱是否都正確
    if(!this.checkExcelHeader(this.jsonExcelData[0])){
      this.errorMSG("匯入失敗", `Header名稱有誤或有缺失Header，請修正`);
      this.isSpinning = false;
      (<HTMLInputElement>document.getElementById("importExcel")).value = "" ;
      return;
    }
    console.log("匯入的Excle欄位名稱皆正確");

     // 校驗每個Excel欄位是否都有填寫
     if(!this.checkAllValuesNotEmpty(this.jsonExcelData)){
      this.isSpinning = false;
      (<HTMLInputElement>document.getElementById("importExcel")).value = "" ;
      return;
    }
    console.log("匯入的Excle特定的欄位都有填寫");


    // 將jsonData轉成英文的key
    this.convertJsonToEnglishkey();

    // 校驗Excel中的資料是否有重複
    if(this.checkDataDuplicate()){
      this.isSpinning = false;
      (<HTMLInputElement>document.getElementById("importExcel")).value = "" ;
      return;
    }
    console.log("匯入的Excle中的資料皆無重複");
    console.table(this.jsonExcelData);

     // 將資料全刪除，再匯入EXCEL檔內的資料
     const myThis = this;
     const p = this.deleteAllData();
     p.then(deleteSuccess =>{
       // 批次新增Excle中的資料
       return myThis.barchInsertExcelData();
     }).then(barchInsertSuccess =>{
       myThis.currentPageIndex = 1;
       myThis.searchingColumn = "";
       myThis.sucessMSG(barchInsertSuccess, ``);
       return myThis.getPPSI130List();
     }).then(resData =>{
       myThis.handleData(resData)
       myThis.isSpinning = false;
     }).catch(function(error) {
       myThis.isSpinning = false;
       myThis.errorMSG(error, ``);
     });
     (<HTMLInputElement>document.getElementById("importExcel")).value = "" ;
  }

  barchInsertExcelData() {
    const myThis = this;
    return new Promise(function(resolve, reject){
      myThis.PPSService.batchSaveTbppsm014Data(myThis.jsonExcelData).subscribe(response => {
        if (response.success === true) {
          resolve("匯入成功")
        } 
        else {
          reject(response.success)
        }
      }, error =>{
        reject(`匯入失敗，後台匯入錯誤，請聯繫系統工程師。Error Msg : ${JSON.stringify(error["error"])}`)
      });
    });
  }

  deleteAllData(){
    const myThis = this;
    return new Promise(function(resolve, reject){
      myThis.PPSService.deleteTbppsm014AllData().subscribe(response => {
        if (response.success === true) {
          resolve("刪除所有資料成功")
        } 
        else {
          resolve(response.success)
        }
      }, error =>{
        reject(`匯入失敗，後台匯入錯誤，請聯繫系統工程師。Error Msg : ${JSON.stringify(error["error"])}`)
      });
    });
  }



  convertJsonToEnglishkey() : void {

    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"廠區別":').join('"plantCode":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"站別":').join('"shopCode":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"鋼種":').join('"steelType":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"尺寸MIN":').join('"diaMin":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"尺寸MAX":').join('"dixMax":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"製程碼_一爐兩捲":').join('"processCode2pcs":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"製程碼_一爐四捲":').join('"processCode4pcs":'));

    for (let i = 0; i < this.jsonExcelData.length; i++) {

      this.jsonExcelData[i].userCreate = this.USERNAME;

      if(_.isEqual(this.jsonExcelData[i].processCode2pcs, '-') || _.isEqual(this.jsonExcelData[i].processCode2pcs, '')){
        this.jsonExcelData[i].processCode2pcs = null;
      }

      if(_.isEqual(this.jsonExcelData[i].processCode4pcs, '-') || _.isEqual(this.jsonExcelData[i].processCode4pcs, '')){
        this.jsonExcelData[i].processCode4pcs = null;
      }

    }


  }

  checkExcelHeader(d) : boolean{

    let b1 = false;
    let b2 = false;
    let b3 = false;
    let b4 = false;
    let b5 = false;
    let b6 = false;
    let b7 = false;
 
    const keys = Object.keys(d);

    keys.forEach(k =>{
      if(k === "廠區別") b1 = true;
      if (k === "站別") b2 = true;
      else if (k === "鋼種") b3 = true;
      else if (k === "尺寸MIN") b4 = true;
      else if (k === "尺寸MAX") b5 = true;
      else if (k === "製程碼_一爐兩捲") b6 = true;
      else if (k === "製程碼_一爐四捲") b7 = true;
    });

    return b1 && b2 && b3 && b4 && b5 && b6 && b7;
  }

  checkAllValuesNotEmpty(jsonExcelData) : boolean{

    for (let i = 1; i <= jsonExcelData.length; i++){

      let rowNumberInExcel = i+1;

      if(_.isEmpty(String(jsonExcelData[i-1]["廠區別"]))){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「廠區別」不得為空，請修正`);
        return false;
      }

      if(_.isEmpty(String(jsonExcelData[i-1]["站別"]))){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「站別」不得為空，請修正`);
        return false;
      }

      if(_.isEmpty(String(jsonExcelData[i-1]["鋼種"]))){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「鋼種」不得為空，請修正`);
        return false;
      }

      if(_.isEmpty(String(jsonExcelData[i-1]["尺寸MIN"]))){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「尺寸MIN」不得為空，請修正`);
        return false;
      }

      if(_.isEmpty(String(jsonExcelData[i-1]["尺寸MAX"]))){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「尺寸MAX」不得為空，請修正`);
        return false;
      }

    }

    return true;

  }

  checkDataDuplicate(){

    let i = 0;
    let j = 1;
    while(true){


      if(i === this.jsonExcelData.length-1) return false;

      if(j > this.jsonExcelData.length-1){
        i++;
        j = i+1;
      }

      if(i === this.jsonExcelData.length-1) return false;

      let str1 = JSON.stringify(this.jsonExcelData[i]);
      let str2 = JSON.stringify(this.jsonExcelData[j]);

      if(str1 === str2){
        this.errorMSG("匯入失敗", `第 ${i+2} 行資料的與第 ${j+2} 行資料已重複，請修改後再匯入`);
        return true;
      }
      else{
        j++;
      }

    }
  }

  exportToExcel(){

    let myThis = this;
    myThis.isSpinning = true;
    let p = this.getAllData();

    p.then(jsonDataFroExport => {

      const firstRow = ["plantCode", "shopCode", "steelType", "diaMin", "dixMax", "processCode2pcs", "processCode4pcs"];
      const firstRowDisplay = {plantCode:"廠區別", shopCode:"站別", steelType:"鋼種", diaMin:"尺寸MIN", dixMax:"尺寸MAX", processCode2pcs:"製程碼_一爐兩捲", processCode4pcs:"製程碼_一爐四捲"};
      const exportData = [firstRowDisplay, ...jsonDataFroExport];  

      const workSheet = XLSX.utils.json_to_sheet(exportData,{header:firstRow, skipHeader:true});
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
      XLSX.writeFileXLSX(workBook, '批次爐鋼種捲數製程碼對應表.xlsx')
  
      myThis.isSpinning = false;
      myThis.sucessMSG("匯出成功!", ``);

    }).catch(function(error) {
      myThis.isSpinning = false;
      myThis.errorMSG(error, ``);
    });

  }

  getAllData()  {
    let myThis = this;
    return new Promise<any>(function(resolve, reject){
      myThis.PPSService.listTbppsm014AllData().subscribe(response => {
        if (response.success === true) {
          resolve(response.data);
        } 
        else {      
          reject(`${response.message}。無法匯出Excel"`);
        }
      }, error =>{
        reject(`匯出失敗，後台匯出錯誤，請聯繫系統工程師。Error Msg : ${JSON.stringify(error["error"])}`)
      });
    });
  }
}