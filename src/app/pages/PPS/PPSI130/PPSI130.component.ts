import { CellEditingStoppedEvent, ColumnApi, ICellRendererParams } from 'ag-grid-community';
import { map } from 'rxjs/operators';
import { Component, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/services/common/common.service';
import { firstValueFrom } from 'rxjs';
import { ColDef, FirstDataRenderedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import { AGCustomActionCellComponent } from 'src/app/shared/ag-component/ag-custom-action-cell-component';
import { AGHeaderCommonParams, AGHeaderParams } from 'src/app/shared/ag-component/types';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';
import { Router } from '@angular/router';

class Tbppsm014 {
  id: number;
  plantCode: string;
  shopCode: string;
  equipCode: string;
  equipGroup: string;
  steelType: string;
  diaMin: number;
  dixMax: number;
  processCode2pcs: string;
  processCode4pcs: string;
  dateCreate: number;
  userCreate: string;
  dateUpdate: number;
  userUpdate: string;

  constructor(
    _id: number,
    _plantCode: string,
    _shopCode: string,
    _equipCode: string,
    _equipGroup: string,
    _steelType: string,
    _diaMin: number,
    _dixMax: number,
    _processCode2pcs: string,
    _processCode4pcs: string,
    _dateCreate: number,
    _userCreate: string,
    _dateUpdate: number,
    _userUpdate: string
  ) {
    this.id = _id;
    this.plantCode = _plantCode;
    this.shopCode = _shopCode;
    this.equipCode = _equipCode;
    this.equipGroup = _equipGroup;
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

@Component({
  selector: 'app-PPSI130',
  templateUrl: './PPSI130.component.html',
  styleUrls: ['./PPSI130.component.scss'],
  providers: [NzMessageService],
})
export class PPSI130Component implements AfterViewInit {
  thisTabName = "精整批次爐鋼種捲數製程碼對應表(PPSI130)";
  USERNAME;
  PLANT_CODE;
  isSpinning = false;

  /////////////////////////////////////////////////////////////
  // 批次爐鋼種捲數製程碼對應表
  /////////////////////////////////////////////////////////////

  // 控制輸入彈出視窗的顯示
  isVisibleBFSGCCPC = false;
  // 輸入欄位 -> 站別
  shopCodeInput = '';
  // 輸入欄位 -> 機台
  equipCodeInput = null;
  // 輸入欄位 -> 機群
  equipGroupInput = null;
  // 輸入欄位 -> 鋼種
  steelTypeInput = '';
  // 輸入欄位 -> 尺寸_min(含)
  diaMinInput: number = undefined;
  // 輸入欄位 -> 尺寸_max(含)
  dixMaxInput: number = undefined;
  // 輸入欄位 -> 製程碼_一爐兩捲
  processCode2pcsInput = '';
  // 輸入欄位 -> 製程碼_一爐四捲
  processCode4pcsInput = '';

  // 廠區別搜尋關鍵字
  searchPlantCodeValue = '';
  // 廠區別搜尋框是否出現
  plantCodeFilterVisible = false;

  // 站別搜尋關鍵字
  searchShopCodeValue = '';
  // 站別搜尋框是否出現
  shopCodeFilterVisible = false;

  // 鋼種搜尋關鍵字
  searchSteelTypeValue = '';
  // 鋼種搜尋框是否出現
  steelTypeFilterVisible = false;

  // 尺寸_min(含)搜尋關鍵字
  searchDiaMinValue = '';
  // 尺寸_min(含)搜尋框是否出現
  diaMinFilterVisible = false;

  // 尺寸_max(含)搜尋關鍵字
  searchDiaMaxValue = '';
  // 尺寸_max(含)搜尋框是否出現
  diaMaxFilterVisible = false;

  // 製程碼_一爐兩捲搜尋關鍵字
  searchProcessCode2pcsValue = '';
  // 製程碼_一爐兩捲搜尋框是否出現
  processCode2pcsFilterVisible = false;

  // 製程碼_一爐四捲搜尋關鍵字
  searchProcessCode4pcsValue = '';
  // 製程碼_一爐四捲搜尋框是否出現
  processCode4pcsFilterVisible = false;

  // 是否正在搜尋
  isSearching = false;
  // 正在針對哪一個欄位做搜尋
  searchingColumn = '';

  DB_PLANT_CODE_COLUMN_NAME = 'PLANT_CODE';
  DB_SHOP_CODE_COLUMN_NAME = 'SCH_SHOP_CODE';
  DB_STEEL_TYPE_COLUMN_NAME = 'STEEL_TYPE';
  DB_DIA_MIN_COLUMN_NAME = 'DIA_MIN';
  DB_DIA_MAX_COLUMN_NAME = 'DIA_MAX';
  DB_PROCESS_CODE_2PCS_COLUMN_NAME = 'PROCESS_CODE_2PCS';
  DB_PROCESS_CODE_4PCS_COLUMN_NAME = 'PROCESS_CODE_4PCS';

  // 於畫面表格顯示的資料
  displayTbppsm014List: any[] = [];
  // 編輯時顯示的資料
  editCache: { [id: number]: { data: Tbppsm014 } } = {};
  // 記錄一個用來比對使用者是否有修改畫面上資料的變數
  wasModifiedData: { [id: number]: { data: Tbppsm014 } } = {};

  // tbppsm014表總共有幾筆資料
  tbppsm014DataTotal = 0;
  // 當前頁碼(第幾頁)
  currentPageIndex = 1;
  // 每頁有幾筆
  pageSize = 20;

  // 紀錄正在編輯中的項目id
  editingItemList: number[] = [];

  // 使用者匯入的Excel檔案
  excelImportFile: File;

  // ag-grid相關api變數
  gridApi : GridApi;
  gridColumnApi : ColumnApi;

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

  tbppsm014ColumnDefs : ColDef[] = [
    { 
      headerName:'廠區別', 
      field:'plantCode',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'站別', 
      field:'shopCode',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'機台', 
      field:'equipCode',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'機群', 
      field:'equipGroup',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'鋼種', 
      field:'steelType',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'尺寸MIN', 
      field:'diaMin',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'尺寸MAX', 
      field:'dixMax',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'製程碼_一爐兩捲', 
      field:'processCode2pcs',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'製程碼_一爐四捲', 
      field:'processCode4pcs',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'Action',
      field:'action',
      editable: false,
      headerComponent : AGCustomHeaderComponent,
      headerComponentParams:this.agCustomHeaderParams,
      cellRenderer: AGCustomActionCellComponent,
      cellRendererParams:{
        edit : this.rowEditHandler.bind(this),
        cancelEdit: this.rowCancalEditHandler.bind(this),
        saveEdit : this.saveEditHandler.bind(this),
        delete : this.deleteHandler.bind(this)
      }
    }
  ];



  constructor(
    private elementRef:ElementRef,
    private PPSService: PPSService,
    private commonService: CommonService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private systemService : SYSTEMService,
    private router: Router
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie('USERNAME');
    this.PLANT_CODE = this.cookieService.getCookie('plantCode');
  }

  async ngAfterViewInit() {
    await this.getPPSI130List();
    //this.setupTableAndEditCache(p);
    this.getDbCloumn();
    const liI130Tab = this.elementRef.nativeElement.querySelector('#liI130') as HTMLLIElement;
    const aI130Tab = this.elementRef.nativeElement.querySelector('#aI130') as HTMLAnchorElement;
    liI130Tab.style.backgroundColor = '#E4E3E3';
    aI130Tab.style.cssText = 'color: blue; font-weight:bold;';
  }

  //調用DB欄位
  getDbCloumn(){
    this.systemService.getHeaderComponentStatus(this.agCustomHeaderCommonParams).subscribe(res=>{
      let result:any = res ;
      if(result.code === 200) {
        console.log(result) ;
        if (result.data.length > 0) {
          //拿到DB數據 ，複製到靜態數據
          this.tbppsm014ColumnDefs.forEach((item)=>{
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
          this.tbppsm014ColumnDefs.sort((a, b) => (a.sortIndex < b.sortIndex ? -1 : 1));
          console.log()
          this.gridOptions.api.setColumnDefs(this.tbppsm014ColumnDefs) ;   
        }
      } else {
        this.message.error("load error")
      }
    });
  }

  cellEditingStoppedHandler(event: CellEditingStoppedEvent<any, any>) {
    
    const newValue = _.omit(event.data, ['isEditing']);
    const oldValue = _.omit(this.editCache[event.data.id].data, ['isEditing']);
    
    if(_.isEqual(newValue, oldValue)){
      event.data.isEditing = false;
    }
    else{
      event.data.isEditing = true;
    }
    
  }

/**
 * 做寬度適應的調整
 */
  autoSizeAll() {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  /**
   * 首次渲染資料完畢後被調用
   * @param event 
   */
  onFirstDataRendered(event : FirstDataRenderedEvent<any>){
    // 在首次資料渲染完畢後，做寬度適應的調整
    this.autoSizeAll();
  }

  /**
   * 獲取ag-grid的Api函數
   * @param params 
   */
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  /**
   * 
   * @param params 刪除資料
   */
  deleteHandler(params: ICellRendererParams<any, any>){
    this.deleteRow(params.data.id);
  }

  async saveEditHandler(params: ICellRendererParams<any, any>){
    // 關閉編輯狀態讓資料生效進到當前陣列中的某條row之中
    params.api.stopEditing(false);

    // 透過id取得緩存的舊資料
    const cacheRowData = this.editCache[params.data.id.toString()].data;

    // 排除非業務的資料(isEditing)進行比較
    // 若一樣，表示使用者未修改任何資料，不給予更新
    if(_.isEqual(_.omit(params.data, ['isEditing']), _.omit(cacheRowData, ['isEditing']))){
        // 無法轉換提示錯誤
        this.message.warning('無法更新，你尚未修改任何資料');
        return;
    }

    // 執行更新
    await this.saveEdit(params.data, params.rowIndex);
  }

     /**
   * 取消編輯並還原已變動的資料
   * @param params 
   */
    rowCancalEditHandler(params: ICellRendererParams<any, any>){
    params.api.stopEditing(false);
      // 透過id取得緩存的舊資料
      const cacheRowData = this.editCache[params.data.id.toString()].data;
      // 還原為原資料
      this.displayTbppsm014List[params.node.rowIndex] = _.cloneDeep(cacheRowData);
      // 渲染資料
      this.gridApi.setRowData(this.displayTbppsm014List);
      // Y軸滾動到此row的位置
      this.gridApi.ensureIndexVisible(params.node.rowIndex, 'middle');
  }

   /**
   * 開始編輯
   * @param params 
   */
   rowEditHandler(params: ICellRendererParams<any, any>){
    // 控制編輯按鈕的顯示切換
    params.data.isEditing = true;
    
    // 使用ag-grid提供的api開啟整行進入編輯狀態
    // colKey設定進入編輯狀態後焦點要是哪個cloumn，
    // 但一定要帶值，且帶的該欄位是要可編輯的
    params.api.startEditingCell({
      rowIndex : params.rowIndex,
      colKey : 'processCode4pcs' 
    });
  }

  async getPPSI130List(){
    try{
      this.isSpinning = true;
      const resObservable$ = this.PPSService.listTbppsm014Data();
      const res = await firstValueFrom<any>(resObservable$);
     
      if(res.code !== 200){
        this.errorMSG(
          '查詢「精整批次爐鋼種捲數製程碼對應表」資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        this.isSpinning = false;
        return;
      }

      this.displayTbppsm014List = res.data;
      this.setupUpdateEditCache();

    } catch (error) {
      this.errorMSG(
        '查詢「精整批次爐鋼種捲數製程碼對應表」資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isSpinning = false;
    }

  }

  async saveEdit(updateRowData : any, updateRowIndex){

    try{
      this.isSpinning = true;
      updateRowData.userUpdate = this.USERNAME;
      const resObservable$ = this.PPSService.updateTbppsm014Data(updateRowData);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '更新「精整批次爐鋼種捲數製程碼對應表」資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        this.isSpinning = false;
        return;
      }

      await this.getPPSI130List();
      this.changeDetectorRef.detectChanges();
      // Y軸滾動到此row的位置
      this.gridApi.ensureIndexVisible(updateRowIndex, 'middle');
      this.sucessMSG(
        '操作成功',
        '更新「精整批次爐鋼種捲數製程碼對應表」資料成功'
      );

    } 
    catch (error) {
      this.errorMSG(
        '更新「精整批次爐鋼種捲數製程碼對應表」資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } 
    finally {
      this.isSpinning = false;
    }

  }

  async deleteRow(id: number){

    try{

      this.isSpinning = true;
      const resObservable$ = this.PPSService.deleteTbppsm014Data(id);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '刪除「精整批次爐鋼種捲數製程碼對應表」資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        this.isSpinning = false;
        return;
      }

      await this.getPPSI130List();
      this.sucessMSG(
        '操作成功',
        '刪除「精整批次爐鋼種捲數製程碼對應表」資料成功'
      );

    }
    catch (error) {
      this.errorMSG(
        '刪除「精整批次爐鋼種捲數製程碼對應表」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isSpinning = false;
    }

  }

  // 複製一份資料到編輯專用的資料list
  setupUpdateEditCache(): void {
    this.editCache = {};
    this.displayTbppsm014List.forEach((item) => {
      this.editCache[item.id] = {
        data: _.cloneDeep(item),
      };
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
        const tbppsm014Data = new Tbppsm014(
          null,
          this.PLANT_CODE,
          this.shopCodeInput,
          this.equipCodeInput,
          this.equipGroupInput,
          this.steelTypeInput,
          this.diaMinInput,
          this.dixMaxInput,
          this.processCode2pcsInput,
          this.processCode4pcsInput,
          null,
          this.USERNAME,
          null,
          null
        );

        const myThis = this;
        new Promise<any>(function (resolve, reject) {
          myThis.PPSService.saveTbppsm014Data(tbppsm014Data).subscribe(
            (response) => {
              if (response.code === 200) resolve(response.message);
              else reject(response.message);
            },
            (error) => {
              const errorMsg = JSON.stringify(error['error']);
              reject(
                `新增失敗，後台新增錯誤，請聯繫系統工程師。異常訊息:${errorMsg}`
              );
            }
          );
        })
          .then(async (saveSuccess) => {
            this.isVisibleBFSGCCPC = false;
            this.shopCodeInput = '';
            this.equipCodeInput = null,
            this.equipGroupInput = null,
            this.steelTypeInput = '';
            this.diaMinInput = undefined;
            this.dixMaxInput = undefined;
            this.processCode2pcsInput = '';
            this.processCode4pcsInput = '';
            myThis.sucessMSG(
              '操作成功', 
              '更新「精整批次爐鋼種捲數製程碼對應表」資料成功'
            );
            await this.getPPSI130List();
            myThis.isSpinning = false;
          })
          .catch((error) => {
            myThis.isSpinning = false;
            myThis.errorMSG(
              '更新「精整批次爐鋼種捲數製程碼對應表」資料失敗', 
              `錯誤訊息：${error}`
            );
          });
      },
      nzOnCancel: () => console.log('cancel add data'),
    });
  }

  validateInputFieldForInsert(): boolean {
    if (_.isEmpty(this.shopCodeInput)) {
      this.message.create('error', '「站別」不可為空');
      return false;
    }

    if (_.isEmpty(this.steelTypeInput)) {
      this.message.create('error', '「鋼種」不可為空');
      return false;
    }

    if (!_.isNumber(this.diaMinInput)) {
      this.message.create('error', '「尺寸_min(含)」僅能是數字或不可為空');
      return false;
    }

    if (!_.isNumber(this.dixMaxInput)) {
      this.message.create('error', '「尺寸_max(含)」僅能是數字或不可為空');
      return false;
    }

    return true;
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
  // 新增 批次爐鋼種捲數製程碼對應表 之彈出視窗
  openBFSGCCPCInput(): void {
    this.isVisibleBFSGCCPC = true;
  }
  // 取消 批次爐鋼種捲數製程碼對應表 之彈出視窗
  cancelBFSGCCPCInput(): void {
    this.isVisibleBFSGCCPC = false;
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
          defval: null, // 單元格為空的預設值
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

 async importExcel() {
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

    // 開始執行Excel的匯入
    await this.barchInsertExcelData();
    (<HTMLInputElement>document.getElementById('importExcel')).value = '';
    this.isSpinning = false;
  }

  async barchInsertExcelData(){

    try{
      this.isSpinning = true;
      const resObservable$ = this.PPSService.batchSaveTbppsm014Data(this.jsonExcelData);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '匯入「精整批次爐鋼種捲數製程碼對應表」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isSpinning = false;
        return;
      }

      await this.getPPSI130List();

      this.sucessMSG(
        '操作成功',
        '匯入「精整批次爐鋼種捲數製程碼對應表」資料成功'
      );

    }
    catch (error) {
      this.errorMSG(
        '匯入「精整批次爐鋼種捲數製程碼對應表」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isSpinning = false;
    }
  }

  convertJsonToEnglishkey(): void {
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"廠區別":').join('"plantCode":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"站別":').join('"shopCode":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"鋼種":').join('"steelType":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"尺寸MIN":').join('"diaMin":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"尺寸MAX":').join('"dixMax":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"製程碼_一爐兩捲":')
        .join('"processCode2pcs":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData)
        .split('"製程碼_一爐四捲":')
        .join('"processCode4pcs":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"機台":').join('"equipCode":')
    );
    this.jsonExcelData = JSON.parse(
      JSON.stringify(this.jsonExcelData).split('"機群":').join('"equipGroup":')
    );
    for (let i = 0; i < this.jsonExcelData.length; i++) {
      this.jsonExcelData[i].userCreate = this.USERNAME;

      if (
        _.isEqual(this.jsonExcelData[i].processCode4pcs, '-') ||
        _.isEqual(this.jsonExcelData[i].processCode4pcs, '')
      ) {
        this.jsonExcelData[i].processCode4pcs = null;
      }
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
    let b8 = false;
    let b9 = false;

    const keys = Object.keys(d);

    keys.forEach((k) => {
      if (k === '廠區別') b1 = true;
      if (k === '站別') b2 = true;
      else if (k === '鋼種') b3 = true;
      else if (k === '尺寸MIN') b4 = true;
      else if (k === '尺寸MAX') b5 = true;
      else if (k === '製程碼_一爐兩捲') b6 = true;
      else if (k === '製程碼_一爐四捲') b7 = true;
      else if (k === '機台') b8 = true;
      else if (k === '機群') b9 = true;
    });

    return b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9;
  }

  checkAllValuesNotEmpty(jsonExcelData): boolean {
    for (let i = 1; i <= jsonExcelData.length; i++) {
      let rowNumberInExcel = i + 1;

      if (_.isEmpty(String(jsonExcelData[i - 1]['廠區別']))) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「廠區別」不得為空，請修正`
        );
        return false;
      }

      if (_.isEmpty(String(jsonExcelData[i - 1]['站別']))) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「站別」不得為空，請修正`
        );
        return false;
      }

      if (_.isEmpty(String(jsonExcelData[i - 1]['鋼種']))) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「鋼種」不得為空，請修正`
        );
        return false;
      }

      if (_.isEmpty(String(jsonExcelData[i - 1]['尺寸MIN']))) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「尺寸MIN」不得為空，請修正`
        );
        return false;
      }

      if (_.isEmpty(String(jsonExcelData[i - 1]['尺寸MAX']))) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「尺寸MAX」不得為空，請修正`
        );
        return false;
      }

      if (_.isEmpty(String(jsonExcelData[i - 1]['機台']))) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「機台」不得為空，請修正`
        );
        return false;
      }

      if (_.isEmpty(String(jsonExcelData[i - 1]['機群']))) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「機群」不得為空，請修正`
        );
        return false;
      }
    }

    return true;
  }

  exportToExcel() {
    let myThis = this;
    myThis.isSpinning = true;

    const exportDataList = [];

    this.displayTbppsm014List.forEach(item => {
      exportDataList.push(_.omit(item, ['id', 'dateCreate', 'userCreate', 'dateUpdate', 'userUpdate']))
    });

      const firstRow = [
        'plantCode',
        'shopCode',
        'equipCode',
        'equipGroup',
        'steelType',
        'diaMin',
        'dixMax',
        'processCode2pcs',
        'processCode4pcs',
      ];
      const firstRowDisplay = {
        plantCode: '廠區別',
        shopCode: '站別',
        equipCode: '機台',
        equipGroup: '機群',
        steelType: '鋼種',
        diaMin: '尺寸MIN',
        dixMax: '尺寸MAX',
        processCode2pcs: '製程碼_一爐兩捲',
        processCode4pcs: '製程碼_一爐四捲',
      };
      const exportData = [firstRowDisplay, ...exportDataList];

      const workSheet = XLSX.utils.json_to_sheet(exportData, {
        header: firstRow,
        skipHeader: true,
      });
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
      XLSX.writeFileXLSX(
        workBook, 
        `批次爐鋼種捲數製程碼對應表_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`
      );

      myThis.isSpinning = false;
      myThis.sucessMSG('匯出成功!', ``);
  }

}
