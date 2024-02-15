import { ColumnApi, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { CellEditingStoppedEvent, ColDef, FirstDataRenderedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';
import { ORPService } from 'src/app/services/ORP/ORP.service';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import { AGCustomActionCellComponent } from 'src/app/shared/ag-component/ag-custom-action-cell-component';
import { ORPI001DiaMaxCellEditorComponent } from './ORPI001-dia-max-cell-editor.component';
import { ORPI001DiaMinCellEditorComponent } from './ORPI001-dia-min-cell-editor.component';
import { ORPI001CustomerNameCellEditorComponent } from './ORPI001-customer-name-cell-editor.component';
import { CommonService } from 'src/app/services/common/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-orpi001',
  templateUrl: './orpi001.component.html',
  styleUrls: ['./ORPI001.component.style.scss'],
  providers:[NzMessageService]
})
export class ORPI001Component implements OnInit, AfterViewInit {

  // 新增submit處理中提示
  submitOkLoading = false;

  // 新增資料modal隱藏/顯示
  isVisibleAddData = false;

  // 是否禁用新增資料modal的取消按鈕與
  isDisableCancel = false;

  // 點選新增資料model之外範圍是否關閉modal
  isMaskClosable = true;

  // 新增資料model顯示Loading Spinning
  isSpinningModal = false;
  
  // 是否顯示右上角的關閉圖示
  isClosable = true;

  // 客戶清單
  customerList : any[] = [];
  // 客戶名稱清單
  customerNameList : any[] = [];

  // 客戶代號
  customerNo = null;
  // 客戶名稱
  customerName = null;
  // 客戶鋼種
  custGradeNo = null;
  // 華新鋼種
  gradeNo = null;
  // 尺寸min
  saleOrderDiaMin = null;
  // 尺寸max
  saleOrderDiaMax = null;
  // 規範碼
  ruleCode = null;
  // 品質碼
  qualityCode = null;
  // 機械性質碼
  mechanicalPropertiesCode = null;


  // 獲取資料載入中提示元件是否顯示
  isSpinning = false;

  // 資料內容
  tborpm001List : any[] = [];

  // 更新用資料內容副本
  editCache : any[] = [];

  gridApi : GridApi;
  gridColumnApi : ColumnApi;

  columnDefs: ColDef[] = [
    { 
      headerName:'客戶名稱', 
      field:'customerName',
      cellEditor : ORPI001CustomerNameCellEditorComponent,
      cellEditorParams : {
        customerList : (async() => { 
          await this.getCustomerList();
          return this.customerList;
        })(),
        customerNameList : (async() => { 
          await this.getCustomerList();
          return this.customerNameList;
        })(),
      },
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'客戶鋼種', 
      field:'custGradeNo',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'尺寸min', 
      field:'saleOrderDiaMin',
      valueFormatter : (params: ValueFormatterParams) => {
        if(_.isNil(params.value)){
          return '-';
        }
        return params.value;
      },
      cellEditor : ORPI001DiaMinCellEditorComponent,
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'尺寸max', 
      field:'saleOrderDiaMax',
      valueFormatter : (params: ValueFormatterParams) => {
        if(_.isNil(params.value)){
          return '-';
        }
        return params.value;
      },
      cellEditor : ORPI001DiaMaxCellEditorComponent,
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'華新鋼種', 
      field:'gradeNo',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'規範碼', 
      field:'ruleCode',
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
          maxLength: 1
      },
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'品質碼', 
      field:'qualityCode',
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
          maxLength: 1
      },
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'機械性質碼', 
      field:'mechanicalPropertiesCode',
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
          maxLength: 1
      },
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'Action',
      field:'action',
      editable: false,
      pinned: 'right',
      headerComponent : AGCustomHeaderComponent,
      cellRenderer: AGCustomActionCellComponent,
      cellRendererParams:{
        edit : this.rowEditHandler.bind(this),
        cancelEdit: this.rowCancalEditHandler.bind(this),
        saveEdit : this.saveEditHandler.bind(this),
        delete : this.deleteHandler.bind(this)
      }
    }
  ];

  gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: false,
      editable: true,
      resizable: true,
    }
  };

   // 使用者匯入的Excel檔案
   excelImportFile: File;
   // input元件
   inputExcelFile:any;

   // 用於匯出之Excel與中文名稱對照的英文名稱
  fieldNameList : string[] = [];
  // 用於匯出之Excel與英文名稱與中文名稱的對照
  englishChineseTitleMapping = {}; 

  constructor(private modal: NzModalService,
              private orpService: ORPService,
              private commonService:CommonService,
              private message: NzMessageService,
              private renderer: Renderer2) { }

  async ngOnInit(): Promise<void> {
    await this.findAllData();
  }

  ngAfterViewInit(): void {
    this.inputExcelFile = this.renderer.selectRootElement('#importExcelFile');
  }

  async getCustomerList(){

    if(!_.isEmpty(this.customerList)){
      return;
    }

    try{
      this.isSpinning = true;
      const resObservable$ = this.commonService.getCustomerList();
      const res = await firstValueFrom<any>(resObservable$);
      this.customerList = res.data;
     
      if(res.code !== 200){
        this.errorMSG(
          '查詢客戶資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        return;
      }

      this.customerNameList = res.data.map(item => item.custAbbreviations);

    } catch (error) {
      this.errorMSG(
        '查詢客戶資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isSpinning = false;
    }
  }

  async findAllData() {
    try{
      this.isSpinning = true;
      const resObservable$ = this.orpService.finaAllI001Data();
      const res = await firstValueFrom<any>(resObservable$);
       
      if(res.code !== 200){
        this.errorMSG(
          '獲取「料號客戶需求碼對照表」資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        this.isSpinning = false;
        return;
      }

      this.tborpm001List = res.data;
      this.editCache = _.cloneDeep(this.tborpm001List);

    } catch (error) {
      this.errorMSG(
        '獲取「料號客戶需求碼對照表」資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isSpinning = false;
    }

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
    const cacheRowData = this.editCache[params.rowIndex];

    // 排除非業務的資料(isEditing)進行比較
    // 若一樣，表示使用者未修改任何資料，不給予更新
    if(_.isEqual(_.omit(params.data, ['isEditing']), _.omit(cacheRowData, ['isEditing']))){
        this.message.warning('無法更新，你尚未修改任何資料');
        return;
    }

    // 資料檢驗
    if(!this.validateUpdateParameters(params.data)){
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
    const cacheRowData = this.editCache[params.node.rowIndex];
    // 還原為原資料
    this.tborpm001List[params.node.rowIndex] = _.cloneDeep(cacheRowData);
    // 渲染資料
    this.gridApi.setRowData(this.tborpm001List);
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
      colKey : 'customerName' 
    });
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


  cellEditingStoppedHandler(event: CellEditingStoppedEvent<any, any>) {
    
    const newValue = _.omit(event.data, ['isEditing']);
    const oldValue = _.omit(this.editCache[event.rowIndex], ['isEditing']);
    
    if(_.isEqual(newValue, oldValue)){
      event.data.isEditing = false;
    }
    else{
      event.data.isEditing = true;
    }
    
  }

  async deleteRow(id:string){
    try{

      const resObservable$ = this.orpService.deleteI001Data(id);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '刪除「料號客戶需求碼對照表」資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        this.isSpinning = false;
        return;
      }

      this.sucessMSG('操作成功', '刪除「料號客戶需求碼對照表」資料成功');

      /// 重新渲染畫面
      await this.findAllData();

    } catch (error) {
      this.errorMSG(
        '刪除「料號客戶需求碼對照表」資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isSpinning = false;
    }
  }

  addData(){
    this.isVisibleAddData = true;
  }

  async saveEdit(updateDate : any, rowIndex : number){
    this.isSpinning = true;
    const payload = {
      id: updateDate.id,
      customerNo : updateDate.customerNo, // 客戶代號
      customerName : updateDate.customerName, // 客戶名稱
      custGradeNo : updateDate.custGradeNo, //客戶鋼種
      gradeNo : updateDate.gradeNo, // 華新鋼種
      saleOrderDiaMin : updateDate.saleOrderDiaMin, // 尺寸min
      saleOrderDiaMax : updateDate.saleOrderDiaMax, // 尺寸max
      ruleCode : updateDate.ruleCode, // 規範碼
      qualityCode : updateDate.qualityCode, // 品質碼
      mechanicalPropertiesCode : updateDate.mechanicalPropertiesCode // 機械性質碼
    }

    try{

      const resObservable$ = this.orpService.updateI001Data(payload);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '修改「料號客戶需求碼對照表」資料失敗',
          `${res.message}`
        );
        this.isSpinning = false;
        return;
      }

      this.sucessMSG('操作成功', '更新「料號客戶需求碼對照表」資料成功');

      /// 重新渲染畫面
      await this.findAllData();
      // Y軸滾動到此row的位置
      this.gridApi.ensureIndexVisible(rowIndex, 'middle');

    } catch (error) {
      this.errorMSG(
        '修改「料號客戶需求碼對照表」資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isSpinning = false;
    }


  }

  async submit(){

    this.submitUIHandler();

    if(!this.validateInputParameters()){
      this.finishSubmitUIHandler();
      return;
    } 

    const payload = {
      customerNo : this.customerNo, // 客戶代號
      customerName : this.customerName, // 客戶名稱
      custGradeNo : this.custGradeNo, //客戶鋼種
      gradeNo : this.gradeNo, // 華新鋼種
      saleOrderDiaMin : this.saleOrderDiaMin, // 尺寸min
      saleOrderDiaMax : this.saleOrderDiaMax, // 尺寸max
      ruleCode : this.ruleCode, // 規範碼
      qualityCode : this.qualityCode, // 品質碼
      mechanicalPropertiesCode : this.mechanicalPropertiesCode // 機械性質碼
    }

    try{

      const resObservable$ = this.orpService.insertI001Data(payload);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '新增「料號客戶需求碼對照表」資料失敗',
          `${res.message}`
        );
        this.isSpinningModal = false;
        return;
      }

      this.addCancel();
      this.clearInput();
      this.sucessMSG('操作成功', '新增「料號客戶需求碼對照表」資料成功');

      /// 重新渲染畫面
      this.findAllData();

    } catch (error) {
      this.errorMSG(
        '新增「料號客戶需求碼對照表」資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.finishSubmitUIHandler();
    }

  }

  addCancel(){
    this.isVisibleAddData = false;
  }

  setCustomerNo(_customerNo:string){
    this.customerNo = _customerNo;
  }

  setCustomerName(_customerName:string){
    this.customerName = _customerName;
  }

  validateUpdateParameters(updateData : any){

    if(_.isEmpty(updateData.customerNo)){
      this.errorMSG('請選擇客戶代號', '客戶代號不能為空');
      return false;
    }

    if(_.isEmpty(updateData.customerName)){
      this.errorMSG('請選擇客戶名稱', '客戶名稱不能為空');
      return false;
    }

    if(_.isEmpty(updateData.custGradeNo)){
      this.errorMSG('請輸入客戶鋼種', '客戶鋼種不能為空');
      return false;
    }

    if(_.isEmpty(updateData.gradeNo)){
      this.errorMSG('請輸入華新鋼種', '華新鋼種不能為空');
      return false;
    }

    if(_.isNil(updateData.saleOrderDiaMin) || _.isEmpty(String(this.saleOrderDiaMin))){
      updateData.saleOrderDiaMin = null;
    }

    if(_.isNil(updateData.saleOrderDiaMax) || _.isEmpty(String(this.saleOrderDiaMax))){
      updateData.saleOrderDiaMax = null;
    }

    if(_.isEmpty(updateData.ruleCode)){
      this.errorMSG('請輸入規範碼', '規範碼不能為空');
      return false;
    }

    if(_.isEmpty(updateData.qualityCode)){
      this.errorMSG('請輸入品質碼', '品質碼不能為空');
      return false;
    }

    if(_.isEmpty(updateData.mechanicalPropertiesCode)){
      this.errorMSG('請輸入機械性質碼', '機械性質碼不能為空');
      return false;
    }

    return true;

  }
  
  validateInputParameters(){

    if(_.isEmpty(this.customerNo)){
      this.errorMSG('請選擇客戶代號', '客戶代號不能為空');
      return false;
    }

    if(_.isEmpty(this.customerName)){
      this.errorMSG('請選擇客戶名稱', '客戶名稱不能為空');
      return false;
    }

    if(_.isEmpty(this.custGradeNo)){
      this.errorMSG('請輸入客戶鋼種', '客戶鋼種不能為空');
      return false;
    }

    if(_.isEmpty(this.gradeNo)){
      this.errorMSG('請輸入華新鋼種', '華新鋼種不能為空');
      return false;
    }

    if(_.isNil(this.saleOrderDiaMin) || _.isEmpty(String(this.saleOrderDiaMin))){
      this.saleOrderDiaMin = null;
    }

    if(_.isNil(this.saleOrderDiaMax) || _.isEmpty(String(this.saleOrderDiaMax))){
      this.saleOrderDiaMax = null;
    }

    if(_.isEmpty(this.ruleCode)){
      this.errorMSG('請輸入規範碼', '規範碼不能為空');
      return false;
    }

    if(_.isEmpty(this.qualityCode)){
      this.errorMSG('請輸入品質碼', '品質碼不能為空');
      return false;
    }

    if(_.isEmpty(this.mechanicalPropertiesCode)){
      this.errorMSG('請輸入機械性質碼', '機械性質碼不能為空');
      return false;
    }

    return true;

  }

  submitUIHandler(){
    this.submitOkLoading = true;
    this.isDisableCancel = true;
    this.isMaskClosable = false;
    this.isSpinningModal = true;
    this.isClosable = false;
  }

  finishSubmitUIHandler(){
    this.submitOkLoading = false;
    this.isDisableCancel = false;
    this.isMaskClosable = true;
    this.isSpinningModal = false;
    this.isClosable = true;
  }

  clearInput(){
    this.customerNo = null; // 客戶代號
    this.customerName = null; // 客戶名稱
    this.custGradeNo = null; //客戶鋼種
    this.gradeNo = null; // 華新鋼種
    this.saleOrderDiaMin = null; // 尺寸min
    this.saleOrderDiaMax = null; // 尺寸max
    this.ruleCode = null; // 規範碼
    this.qualityCode = null; // 品質碼
    this.mechanicalPropertiesCode = null; // 機械性質碼
  }

   // excel檔案
   incomingFile($event: any) {
    this.excelImportFile = $event.target.files[0];
    let lastname = this.excelImportFile.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.renderer.setProperty(this.inputExcelFile, 'value', '');
      return;
    }
  }

  jsonExcelData : any[] = [];
  headerNameList : string[] = [];
  excelImportHandler() {

    this.isSpinning = true;

    // 獲取所有欄位名稱
    this.getHeaderNameList();
    // 檢查欄位是否齊全以及名稱是否正確
    if (!this.checkExcelHeader(this.jsonExcelData[0])) {
      this.errorMSG('檔案欄位表頭錯誤', '請參考匯出的Excel修改後再做匯入');
      this.renderer.setProperty(this.inputExcelFile, 'value', '');
      this.isSpinning = false;
      return;
    } 

    // 將jsonData轉成英文的key
    this.convertJsonToEnglishkey();

    // 發送資料進行驗證與儲存
    this.batchImportDataList();
    this.renderer.setProperty(this.inputExcelFile, 'value', '');

  }



  async batchImportDataList(){
    try{

      const resObservable$ = this.orpService.batchImportDataList(this.jsonExcelData);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '匯入「料號客戶需求碼對照表」資料失敗',
          res.message
        );
        this.isSpinning = false;
        return;
      }

      this.sucessMSG('操作成功', '匯入「料號客戶需求碼對照表」資料成功');

      /// 重新渲染畫面
      await this.findAllData();

    } catch (error) {
      this.errorMSG(
        '匯入「料號客戶需求碼對照表」資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isSpinning = false;
    }
  }

  convertJsonToEnglishkey() {

    this.getFieldNameList();
    this.getHeaderNameList();

    for (let i = 0; i <= this.headerNameList.length; i++) {
      let chineseKey = `"${this.headerNameList[i]}":`;
      let englishKey = `"${this.fieldNameList[i]}":`;
      this.jsonExcelData = JSON.parse(
        JSON.stringify(this.jsonExcelData).split(chineseKey).join(englishKey)
      );
    }
  }

  checkExcelHeader(d): boolean {

    const keys = Object.keys(d);

    // 用於判斷使用者匯入的Excel header是否正確以及數量一樣
    let checkNumber = 0;

    keys.forEach(key => {
        if(_.includes(this.headerNameList, key)){
          checkNumber++;
        }
    })

    return checkNumber == this.headerNameList.length && keys.length == this.headerNameList.length;

  }

  getHeaderNameList(){
    if(_.isEmpty(this.headerNameList)){

      this.headerNameList = this.columnDefs.map(item => {
                            if(!_.includes(['Action'], item.headerName)){
                              return item.headerName
                            }
                          }).filter(headerName => !_.isNil(headerName));

    }
  }

  readExcelToJson(){

    const fileValue = this.inputExcelFile.value
    if(fileValue === "") {
      this.errorMSG('無檔案', '請先選擇要上傳的檔案');
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
        type: 'binary'
      });

      const sheets = workbook.SheetNames;

      if (sheets.length) {
        var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]], {
          defval: null // 單元格為空的預設值
        });
        this.jsonExcelData = jsonData;

        if(this.jsonExcelData.length != 0){
          this.excelImportHandler();
        }
        else{
          this.errorMSG('匯入失敗', '此檔案無任何資料');
          this.isSpinning = false;
        }

      }
    }
    // 加載文件
    reader.readAsArrayBuffer(this.excelImportFile);
  }

  exportToExcel(){

    this.isSpinning = true;
    this.getFieldNameList();
    this.getEnglishChineseTitleMapping();

    if(_.isEmpty(this.tborpm001List)){
      this.findAllData();
    }

    const dataList = this.tborpm001List.map(item => {
        const data = _.omit(item, ['id', 'plantCode', 'customerNo', 'createUser', 'createDate', 'updateUser', 'updateDate']) as any;
        if(_.isNil(data.saleOrderDiaMin)){
          data.saleOrderDiaMin = '-';
        }
        if(_.isNil(data.saleOrderDiaMax)){
          data.saleOrderDiaMax = '-';
        }
      return data
    });

    const exportData = [this.englishChineseTitleMapping, ...dataList];

    const workSheet = XLSX.utils.json_to_sheet(exportData, {
      header: this.fieldNameList,
      skipHeader: true,
    });
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
    XLSX.writeFileXLSX(
      workBook,
      `料號客戶需求碼對照表_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`
    );

    this.isSpinning = false;
    this.message.success('匯出成功');


  }

  getFieldNameList(){
    if(_.isEmpty(this.fieldNameList)){
      this.fieldNameList = this.columnDefs.map(item => {
        if(!_.isEqual('action', item.field)){
          return item.field;
        }
        else{
          return null;
        }
      }).filter(item => !_.isNil(item));
    }
  }

  getEnglishChineseTitleMapping(){

    if(_.isEmpty(this.englishChineseTitleMapping)){
      this.englishChineseTitleMapping = {};
      this.columnDefs.forEach(item => {
        if(!_.isEqual('action', item.field)){
          let enChMapping = {
            [item.field] : item.headerName
          }
          _.merge(this.englishChineseTitleMapping, enChMapping);
        }
      });
    }
  }

  sucessMSG(_title, _plan): void {
		this.modal.success({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}

  errorMSG(_title, _context): void {
		this.modal.error({
			nzTitle: _title,
			nzContent: `${_context}`
		});
  }

}
