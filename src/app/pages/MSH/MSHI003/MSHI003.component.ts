import { async } from '@angular/core/testing';
import { AfterViewInit, Component, Renderer2, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { MSHService } from 'src/app/services/MSH/MSH.service';
import {NzModalService} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {MSHI003} from "./MSHI003.model";
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { CellDoubleClickedEvent, CellEditingStartedEvent, ColDef, GridApi, GridReadyEvent, ICellEditorParams, IRowNode } from 'ag-grid-community';
import { PrimeDatePickerCellEditorComponent } from './prime-date-picker-cell-editor';
import { CookieService } from 'src/app/services/config/cookie.service';
import { DataTransferService } from 'src/app/services/MSH/Data.transfer.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common/common.service';
import { AdjShopCodeCellRendererComponent } from './AdjShopCodeCellRenderer.componet';
import { AdjShopCodeCellSelectEditorComponent } from './adj-shop-code-cell-select-editor';
import { AdjLineupProcessSelectEditorComponent } from './adj-lineup-process-cell-select-editor';

class MSHI003Payload {
  shopCode : string[];
  equipCode : string[];
  idNo : string;
  isHold : boolean;
  constructor(_shopCode : string[],
              _equipCode : string[],
              _idNo : string,
              _isHold : boolean){
    this.shopCode = _shopCode;
    this.equipCode = _equipCode;
    this.idNo = _idNo;
    this.isHold = _isHold;        
  }
}

@Component({
  selector: 'app-MSHI003',
  templateUrl: './MSHI003.component.html',
  styleUrls: ['./MSHI003.component.css'],
  providers:[NzMessageService]
})
export class MSHI003Component implements AfterViewInit{
  
  USERNAME;
  PLANTCODE;

  gridApi : GridApi;
  agGridContext : any;
  params: GridReadyEvent;

  // 使用者當前編輯的rowIndex
  currentEditRowIndex : number | null = null;

  isSpinning = false;

  // 使用者選擇的EPST的idNo(Mo)是否存在於MySQL(ppsfcptb16)
  existsInPpsfcptb16 = true;


  // 站別下拉選項
  shopCodeOfOption : string[] = [];
  // 使用者選中哪些站別
  shopCodeInputList : string[] = [];
  // 站別下拉是否正在載入選項
  shopCodeLoading = false;

  // 調整站別(根據IdNo為條件查詢)下拉選項
  shopCodeByIdNoOfOption : string[] = [];
  // 調整站別(根據IdNo為條件查詢)下拉是否正在載入選項
  shopCodeByIdNoLoading = false;

  // 機台下拉選項
  equipCodeOfOption : string[] = [];
  // 使用者選中哪些機台
  equipCodeInputList : string[] = [];
  // 機台下拉是否正在載入選項
  equipCodeLoading = false;

  // 流程下拉選項
  lineupProcessOfOptions : string[] = [];
  // 流程下拉是否正在載入選項
  lineupProcessLoading = false;

  // 可以編輯的column
  editableColumns = ['adjShopCode', 'adjLineupProcess', 'newEpst', 'comment'];

  // mo輸入
  moInput = "";

  // hole狀態選擇
  holeChecked = false;

  MSHI003DataList : MSHI003[] = [];

  MSHI003DataListDeepClone : MSHI003[] = [];

  // 存放待更新或新增的row資料
  MSHI003PendingDataList : MSHI003[] = [];

  // 存放使用者搜尋的條件
  payloadcache : MSHI003Payload;

  // 使用者匯入的Excel檔案  
  excelImportFile:File;

  inputExcelFile:any;

  // Excel檔案的Headers
  ID_NO = "MO";
  SHOP_CODE = "現況站別";
  SALE_ORDER = "訂單號碼";
  SALE_ITEM = "項次";
  CUST_ABBR = "客戶";
  PROC_STATUS = "放行碼";
  SFC_DIA = "現況尺寸";
  FINAL_MIC_NO = "現況MIC";
  PROCESS_CODE = "製程碼";
  EPST = "EPST";
  NEW_EPST = "調整日期";
  COMMENT = "備註";
  ADJ_SHOP_CODE = "調整站別";
  ADJ_LINEUP_PROCESS = "調整流程";
  OVER_SHOP_STATUS = "過站狀態";

  gridOptions = {
    defaultColDef : {
      sortable: false,
      resizable: true
    },
    components: {
      primeDatePickerCellEditorComponent: PrimeDatePickerCellEditorComponent,
      adjShopCodeCellSelectEditorComponent: AdjShopCodeCellSelectEditorComponent,
      adjLineupProcessSelectEditorComponent : AdjLineupProcessSelectEditorComponent
    }
  };

  constructor(private mshService:MSHService,
              private Modal:NzModalService,
              private message:NzMessageService,
              private dataTransferService:DataTransferService,
              private cookieService: CookieService,
              private renderer: Renderer2,
              private commonService : CommonService,
              private changeDetectorRef: ChangeDetectorRef) { 

    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANTCODE = this.cookieService.getCookie("plantCode");
    this.agGridContext = {
          componentParent: this
        };

    // 收集待新增或更新的資料
    this.collectingDataForAdditionOrUpdate();

    // 實時根據調整站別與調整流程搜尋過站狀態與EPST
    this.realTimeSearchForShopStatusAndEPST();

  }

  ngAfterViewInit(): void {
    this.inputExcelFile = this.renderer.selectRootElement('#importExcelFile');
  }

  columnDefs : ColDef[]   = [
    {headerName: 'MO', field: 'idNo', width: 100, filter: true},
    {headerName: '現況站別', field: 'shopCode', width: 120, filter: true},
    {headerName: '訂單號碼', field: 'saleOrder', width: 120, filter: true},
    {headerName: '項次', field: 'saleItem', width: 100, filter: true},
    {headerName: '客戶', field: 'custAbbr', width: 100, filter: true},
    {headerName: '放行碼', field: 'procStatus', width: 100},
    {headerName: '現況尺寸', field: 'sfcDia', width: 100},
    {headerName: '現況流程', field: 'finalMicNo', width: 100},
    {headerName: '製程碼', field: 'processCode', width: 100},
    {
      headerName: '調整站別', 
      field: 'adjShopCode', 
      width: 120,
      editable: true,
      cellEditor: 'adjShopCodeCellSelectEditorComponent',
      headerClass: 'header-editable-color',
      cellClass: 'cell-editable-color',
      cellRenderer: AdjShopCodeCellRendererComponent,
    },
    {
      headerName: '調整流程', 
      field: 'adjLineupProcess', 
      width: 120,
      editable:true,
      cellEditor: 'adjLineupProcessSelectEditorComponent',
      headerClass: 'header-editable-color',
      cellClass: 'cell-editable-color',
    },
    {
      headerName: '過站狀態', 
      field: 'overShopStatus', 
      width: 120,
      valueFormatter : (params) =>{
        let overShopStatusStr = '';
        if(!_.isEmpty(params.value)){
          overShopStatusStr = params.value === 'Y' ? '已過站' : params.value === 'X' ? '查無MO資訊' : '未過站';
        }
        return overShopStatusStr;
      }
    },
    {
      headerName: 'EPST', 
      field: 'epst', 
      width: 120,
      valueFormatter: (params) => {
        let epstStr = null;
        if(!_.isEmpty(params.value)){
          const epstObj = moment(params.value);
          epstStr = epstObj.format('YYYY-MM-DD');
        }
        return epstStr;
      }
    },
    { 
      headerName: '調整日期', 
      field: 'newEpst', 
      width: 120, 
      editable: true,
      cellEditor: 'primeDatePickerCellEditorComponent',
      headerClass: 'header-editable-color',
      cellClass: 'cell-editable-color',
      valueFormatter: (params) => {
        let newEpstStr = null;
        if(!_.isEmpty(params.value)){
          const epstObj = moment(params.value);
          newEpstStr = epstObj.format('YYYY-MM-DD');
        }
        return newEpstStr;
      }
    },
    {
      headerName: '備註', 
      field: 'comment', 
      width: 100,
      editable: true,
      cellEditor: 'agLargeTextCellEditor',
      headerClass: 'header-editable-color',
      cellClass: 'cell-editable-color',
      cellEditorParams: {
        maxLength: 50,
        cols: '50',
        rows: '3'
      },
      onCellValueChanged : event => {
        if(_.isEmpty(event.newValue)){
          event.data.comment = null;
        }

        this.dataTransferService.setData(event.node);
        
      }
    },
    {headerName: '建立人員', field: 'userCreate', width: 100},
    {headerName: '建立日期', field: 'dateCreate', width: 180},
    {headerName: '更新人員', field: 'userUpdate', width: 100},
    {headerName: '更新日期', field: 'dateUpdate', width: 180}
  ];

  async cellDoubleClickedHandler(event : CellDoubleClickedEvent<any,any>){
    console.log("cellDoubleClickedHandler=>", event);
    if(_.includes(this.editableColumns, event.colDef.field)){
      await this.getShopCodeListByIdNo(event.node.data.idNo);
       // 查無站別
       if(!this.existsInPpsfcptb16) {
        this.gridApi.stopEditing(true);
        this.message.error('查無MO資訊，無法新增');
     }
    }
  }

  async getLineupProcessAsync(idNo : string, adjShopCode : string) : Promise<void> {

      this.lineupProcessLoading = true;
      try{
        const res = await this.mshService.getLineupProcessListByIdNoAndShopCode(idNo, adjShopCode).toPromise();
        if(res.code === 200){
          this.lineupProcessOfOptions = res.data;
        }
        else{
          this.message.error('後台錯誤，獲取不到流程清單');
        }
      } catch (error) {
        this.errorMSG('獲取流程清單失敗', `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`);
      }
      finally{
        this.lineupProcessLoading = false;
      }
  }

  getShopCodeList() : void {

    if(!_.isEmpty(this.shopCodeOfOption)) return;
    
    this.shopCodeLoading = true;
    new Promise<boolean>((resolve, reject) => {
      this.mshService.getShopCodeList().subscribe(res => {
        if(res.code === 200){
         this.shopCodeOfOption = res.data;
          resolve(true);
        }else{
          this.message.error('後台錯誤，獲取不到站別清單');
          reject(true);
        }

      }, error => {
        this.errorMSG('獲取站別清單失敗', `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`);
        reject(true);
      });

    })
    .then(success =>{
      this.shopCodeLoading = false;
    }).catch(error =>{
      this.shopCodeLoading = false;
    });

  }
  async getShopCodeListByIdNo(idNo : string) : Promise<void> {
    
    this.shopCodeByIdNoLoading = true;

    try{
      const res = await this.mshService.getShopCodeListByIdNo(idNo).toPromise();
      if(res.code === 200){
        if(res.data.length > 0){
          this.shopCodeByIdNoOfOption = res.data;
          this.existsInPpsfcptb16 = true;
        }
        else{
          // 點擊選擇調整站別，使用者選擇的那一行資料的idNo(MO)不存在於於MySQL(ppsfcptb16)
          this.existsInPpsfcptb16 = false;
        }
      }
      else{
        this.message.error('後台錯誤，獲取不到站別清單');
      }
    }
    catch (error) {
      this.errorMSG('獲取站別清單失敗', `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`);
    }
    finally{
      this.shopCodeByIdNoLoading = false;
    }
  }

  shopCodeChange() : void {
    if(!_.isEmpty(this.shopCodeInputList)){
      this.equipCodeInputList = [];
    }
  }

  getEquipCodeList() : void {
    this.equipCodeLoading = true;

    new Promise<boolean>((resolve, reject) => {
      this.mshService.getEquipCodeList(this.shopCodeInputList).subscribe(res => {
        if(res.code === 200){
          this.equipCodeOfOption = res.data;
          resolve(true);
        }else{
          this.message.error('後台錯誤，獲取不到機台清單');
          reject(true);
        }

      }, error => {
        this.errorMSG('獲取機台清單失敗', `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`);
        reject(true);
      });

    })
    .then(success =>{
      this.equipCodeLoading = false;
    }).catch(error =>{
      this.equipCodeLoading = false;
    });

  }

  serach(isUserClick : boolean) : void {
    
     // 若存在編輯過的資料
     if(!_.isEmpty(this.MSHI003PendingDataList) && isUserClick){
      this.Modal.confirm({
        nzTitle: '資料尚未儲存，是否放棄儲存執行搜尋?',
        nzOnOk: () => {
          this.serachEPST(isUserClick);
        },
        nzOnCancel: () =>
          console.log("取消搜尋EPST資料")
      });
     }
     else{
      this.serachEPST(isUserClick);
     }

  }


  serachEPST(isUserClick : boolean) : void {
    this.isSpinning = true;
    let payloads = null;

    if(isUserClick){
      payloads = new MSHI003Payload(this.shopCodeInputList,
                                        this.equipCodeInputList,
                                        this.moInput,
                                        this.holeChecked)
      this.currentEditRowIndex = null;
    }else{
      payloads = this.payloadcache;
    }

    if(_.isNil(payloads)) return;

     new Promise<boolean>((resolve, reject) => {
      this.mshService.searchEpstData(payloads).subscribe(res => {
        if(res.code === 200){
         
          if(res.data.length > 0) {
            let resultDataList : MSHI003[] =
              res.data.map(item => {

               return new MSHI003(
                  item.id,
                  item.plantCode,
                  item.idNo,
                  item.shopCode,
                  item.saleOrder,
                  item.saleItem,
                  item.saleLineno,
                  item.custAbbr,
                  item.procStatus,
                  item.sfcDia,
                  item.finalMicNo,
                  item.processCode,
                  item.adjShopCode,
                  item.adjLineupProcess,
                  item.overShopStatus,
                  item.epst,
                  item.comment,
                  item.newEpst,
                  item.dateCreate,
                  item.userCreate,
                  item.dateUpdate,
                  item.userUpdate
                  )
                });

              this.MSHI003DataList = resultDataList;
              this.MSHI003DataListDeepClone = _.cloneDeep(this.MSHI003DataList);
            } else{
              this.message.success(res.message);
            }

          resolve(true);
        }else{
          this.message.error('後台錯誤，獲取不到EPST資料');
          reject(true);
        }

      }, error => {
        this.errorMSG('獲取EPST資料失敗', `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`);
        reject(true);
      });

    })
    .then(success =>{
      this.payloadcache = payloads;
      this.MSHI003PendingDataList = [];

      // 清除過濾條件
      this.gridApi.setFilterModel(null);

		  // 使用者編輯後將滾動條定位到可以看到過站狀態與EPST的位置
     if(!_.isNil(this.currentEditRowIndex)){
        // 等待畫面渲染完畢
        this.changeDetectorRef.detectChanges();
        this.gridApi.ensureIndexVisible(this.currentEditRowIndex, 'top');
        this.gridApi.ensureColumnVisible('comment', 'end');
      }
      this.isSpinning = false;
    }).catch(error =>{
      this.payloadcache = payloads;
      this.MSHI003PendingDataList = [];
      this.isSpinning = false;
    });
    
  }

  confirm() :void {

    if(_.isEmpty(this.MSHI003DataList)){
      this.message.error('請更換搜尋條件，目前無資料可儲存');
      this.isSpinning = false;
      return;
    }

     if(_.isEmpty(this.MSHI003PendingDataList)){
      this.message.error('尚無資料異動，無法儲存資料');
      this.isSpinning = false;
      return;
     }

    let missingNewEpst : MSHI003 = null;
    let missingField : string = null;
    let missingNewEpstFlag = this.MSHI003PendingDataList.some(element => {
      missingNewEpst = element;
      if(_.isNil(missingNewEpst.adjShopCode)){
        missingField = '請填寫「調整站別」'
        return true;
      }

      if(_.isNil(missingNewEpst.adjLineupProcess)){
      missingField = '請填寫「調整流程」'
      return true;
      }

      if(_.isNil(missingNewEpst.newEpst)){
      missingField = '請填寫「調整日期」'
      return true;
      }

     });

     if(missingNewEpstFlag){
      this.errorMSG('無法儲存', `MO:「${missingNewEpst.idNo}」，${missingField}。<br>若需要放棄儲存編輯過的資料，請再重新執行「查詢」即可。`);
      this.isSpinning = false;
      return;
     }

    this.Modal.confirm({
      nzTitle: '是否確定儲存資料?',
      nzOnOk: () => {

        this.isSpinning = true;

        // 1.將需要新增的資料設定建立者名稱與廠區別
        // 2.將需要更新的資料設定異動者名稱
        this.MSHI003PendingDataList.forEach(item =>{
          if(_.isNil(item.id)){
            item.userCreate = this.USERNAME;
            item.plantCode = this.PLANTCODE;
          }
          else{
            item.userUpdate = this.USERNAME;
          }
        });

        new Promise<boolean>((resolve, reject) => {
          this.mshService.batchInsertOrUpdateEPST(this.MSHI003PendingDataList).subscribe(res => {
            if(res.code === 200){
              this.sucessMSG(res.message, res.message);
            }else{
              this.errorMSG(res.message, res.message);
            }
            resolve(true);
          }, error => {
            this.errorMSG('EPST變更作業失敗', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error)}`);
            reject(true);
          });

        })
        .then(success =>{
          this.MSHI003PendingDataList = [];
          this.serach(false);
          this.isSpinning = false;
        }).catch(error =>{
          this.MSHI003PendingDataList = [];
          this.serach(false);
          this.isSpinning = false;
        });
      },
      nzOnCancel: () =>
        console.log("取消EPST變更作業")
    });
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
  handleImport() : void {
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
          this.importExcel();
        }
        else{
          this.errorMSG("匯入失敗", `此檔案無任何數據`);
          this.isSpinning = false;
        }

      }
    }
    // 加載文件
    reader.readAsArrayBuffer(this.excelImportFile);

  }

  importExcel() : void {

    this.isSpinning = true;

    // 檢查欄位名稱是否都正確
    if(!this.checkExcelHeader(this.jsonExcelData[0])){
      this.errorMSG('檔案欄位表頭錯誤', '請先匯出檔案後，再透過該檔案調整上傳。');
      this.renderer.setProperty(this.inputExcelFile, 'value', '');  
      this.isSpinning = false;
      return;
    }
    console.log("匯入的Excle欄位名稱皆正確");

    // 校驗每個Excel欄位是否都有填寫
    if(!this.checkAllValuesNotEmpty(this.jsonExcelData)){
      this.isSpinning = false;
      this.renderer.setProperty(this.inputExcelFile, 'value', ''); 
      return;
    }
    console.log("匯入的Excle特定的欄位都有填寫");

    // 將jsonData轉成英文的key
    this.convertJsonToEnglishkey();

    console.log("this.jsonExcelData==>", JSON.stringify(this.jsonExcelData));
  
    // 校驗Excel中的資料是否有重複
   if(this.checkExcelDataDuplicate(this.jsonExcelData)){
      this.isSpinning = false;
      this.renderer.setProperty(this.inputExcelFile, 'value', '');
      return;
    }
    console.log("匯入的Excle中的資料皆無重複");

    new Promise<boolean>((resolve, reject) => {
      this.mshService.excelBatchInsertOrUpdateEPST(this.jsonExcelData).subscribe({
        
        next : (res) =>{
          if(res.code === 200){
            this.sucessMSG('Excel匯入成功', res.message);
          }else{
            this.errorMSG('Excel匯入失敗', res.message);
          }
          resolve(true);
        },
        error : (err) => {
          this.errorMSG('Excel匯入失敗', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(err)}`);
          reject(true);
        },
        complete : () => {
          
        }
      })

    })
    .then(success =>{
      this.MSHI003PendingDataList = [];
      this.serach(false);
      this.isSpinning = false;
    }).catch(error =>{
      this.MSHI003PendingDataList = [];
      this.serach(false);
      this.isSpinning = false;
    });

    this.renderer.setProperty(this.inputExcelFile, 'value', ''); 
  }

  checkExcelDataDuplicate(jsonExcelData : any) : boolean{

    let i = 0;
    let j = 1;

    while(true){

      if(i === jsonExcelData.length-1) return false;

      if(j > jsonExcelData.length-1){
        i++;
        j = i+1;
      }

      if(i === jsonExcelData.length-1) return false;


      if(jsonExcelData[i].idNo === jsonExcelData[j].idNo){
        this.errorMSG("匯入失敗", `第 ${i+2} 行資料的與第 ${j+2} 行資料MO已重複，請修改後再匯入`);
        return true;
      }
      else{
        j++;
      }

    }
  }

  convertJsonToEnglishkey() : void {

    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"MO":').join('"idNo":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"現況站別":').join('"shopCode":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"訂單號碼":').join('"saleOrder":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"項次":').join('"saleItem":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"客戶":').join('"custAbbr":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"放行碼":').join('"procStatus":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"現況尺寸":').join('"sfcDia":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"現況MIC":').join('"finalMicNo":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"製程碼":').join('"processCode":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"調整站別":').join('"adjShopCode":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"調整流程":').join('"adjLineupProcess":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"過站狀態":').join('"overShopStatus":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"EPST":').join('"epst":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"調整日期":').join('"newEpst":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"備註":').join('"comment":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"建立人員":').join('"userCreate":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"建立日期":').join('"dateCreate":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"更新人員":').join('"userUpdate":'));
    this.jsonExcelData = JSON.parse(JSON.stringify(this.jsonExcelData).split('"更新日期":').join('"dateUpdate":'));

    this.jsonExcelData.forEach(item => {
      item.plantCode = this.PLANTCODE;
      item.userCreate = this.USERNAME;
      item.userUpdate = this.USERNAME;
    });

  }

  checkAllValuesNotEmpty(jsonExcelData) : boolean{

    for (let i = 1; i <= jsonExcelData.length; i++){

      let rowNumberInExcel = i+1;
      let item = jsonExcelData[i-1];
      
      if(_.isNull(item[this.ID_NO])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.ID_NO}」不得為空，請修正。`);
        return false;
      }

      // if(_.isNull(item[this.SHOP_CODE])){
      //   this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.SHOP_CODE}」不得為空，請修正。`);
      //   return false;
      // }

      /*if(_.isNull(item[this.SALE_ORDER])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.SALE_ORDER}」不得為空，請修正。`);
        return false;
      }

      if(_.isNull(item[this.SALE_ITEM])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.SALE_ITEM}」不得為空，請修正。`);
        return false;
      }

      if(_.isNull(item[this.CUST_ABBR])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.CUST_ABBR}」不得為空，請修正。`);
        return false;
      }

      if(_.isNull(item[this.PROC_STATUS])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.PROC_STATUS}」不得為空，請修正。`);
        return false;
      }

      if(_.isNull(item[this.SFC_DIA])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.SFC_DIA}」不得為空，請修正。`);
        return false;
      }

      if(_.isNull(item[this.FINAL_MIC_NO])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.FINAL_MIC_NO}」不得為空，請修正。`);
        return false;
      }

      if(_.isNull(item[this.PROCESS_CODE])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.PROCESS_CODE}」不得為空，請修正。`);
        return false;
      }

      if(_.isNull(item[this.EPST])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.EPST}」不得為空，請修正。`);
        return false;
      }*/

      if(_.isNull(item[this.ADJ_SHOP_CODE])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.ADJ_SHOP_CODE}」不得為空，請修正。`);
        return false;
      }
      else if (String(item[this.ADJ_SHOP_CODE]).length > 3){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.ADJ_SHOP_CODE}」字串長度不得大於3，請修正。`);
        return false;
      }

      if(_.isNull(item[this.ADJ_LINEUP_PROCESS])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.ADJ_LINEUP_PROCESS}」不得為空，請修正。`);
        return false;
      }
      else if (String(item[this.ADJ_LINEUP_PROCESS]).length > 30){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.ADJ_LINEUP_PROCESS}」字串長度不得大於30，請修正。`);
        return false;
      }


      if(!_.isNull(item[this.EPST])){
        const isVerifyEpstDate = this.verifyDate(item, rowNumberInExcel, this.EPST);
        if(isVerifyEpstDate === false) return false;
      }

      if(_.isNull(item[this.NEW_EPST])){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.NEW_EPST}」不得為空，請修正。`);
        return false;
      }
      else{
        const isVerifyNewEpstDate = this.verifyDate(item, rowNumberInExcel, this.NEW_EPST);
        if(isVerifyNewEpstDate === false) return false;
      }

      if(!_.isNull(item[this.COMMENT]) && String(item[this.COMMENT]).length > 50){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${this.COMMENT}」字串長度不得大於50，請修正。`);
        return false;
      }
    }

    return true;

  }

  verifyDate(inputItem : any, rowNumberInExcel : number, headerName : string) : boolean{

    const dateRegex = /^\d{4}[\/-]\d{2}[\/-]\d{2}$|^\d{4}[\/-]\d{2}[\/-]\d{2}\s\d{2}:\d{2}:\d{2}$/;

    let inputDate = inputItem[headerName];

    if(typeof inputDate === 'string'){
      if(!dateRegex.test(String(inputDate))){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${headerName}」格式錯誤，請修正。<br>日期格式為 YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DD <br> 例如 ${moment().format('YYYY-MM-DD HH:mm:ss')} 或 ${moment().format('YYYY-MM-DD')}`);
        return false;
      }

      let isValid01 = moment(inputDate, 'YYYY-MM-DD HH:mm:ss', false).isValid();
      let isValid02 = moment(inputDate, 'YYYY-MM-DD', false).isValid();

      // 若比較兩種格式的日期都不合法
      if(!(isValid01 || isValid02)){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${headerName}」日期數字不合法，請修正。`);
        return false;
      }

      if(!moment(inputDate, 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(moment().format('YYYY-MM-DD HH:mm:ss'), 'day')){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${headerName}」不能是過去日期，請修正。`);
        return false;
      }

    }
    else if (typeof inputDate === 'number'){
      const dateStr : string = this.ExcelDateToJSDate(inputDate);
      if(!moment(dateStr).isSameOrAfter(moment(), 'day')){
        this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${headerName}」不能是過去日期，請修正。`);
        return false;
      }else{
        inputItem[headerName] = dateStr;
      }
    }
    else {
      this.errorMSG("匯入失敗", `第${rowNumberInExcel}行資料的「${headerName}」為無法辨識的資料型態，請修正。`);
      return false;
    }

    return true;

  }

  myIsNumber(_value){
    return _value !== true && _value !== false &&
          _value !== null && _value !== undefined &&
          !isNaN(_.toNumber(_value));
  }

  ExcelDateToJSDate(serial) : string {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    const month = (date_info.getMonth() + 1).toString().padStart(2, '0');
    const day = date_info.getDate().toString().padStart(2, '0');
    const hour = hours.toString().padStart(2, '0');
    const minute = minutes.toString().padStart(2, '0');
    const second = seconds.toString().padStart(2, '0');
 
    return `${date_info.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
 }

  checkExcelHeader(d) : boolean{

    const keys = Object.keys(d);

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
    let b13 = false;
    let b14 = false;
    let b15 = false;

    keys.forEach(k => {
      if(k === this.ID_NO) b1 = true;
      else if(k === this.SHOP_CODE) b2 = true;
      // else if(k === this.SALE_ORDER) b3 = true;
      // else if(k === this.SALE_ITEM) b4 = true;
      // else if(k === this.CUST_ABBR) b5 = true;
      // else if(k === this.PROC_STATUS) b6 = true;
      // else if(k === this.SFC_DIA) b7 = true;
      // else if(k === this.FINAL_MIC_NO) b8 = true;
      // else if(k === this.PROCESS_CODE) b9 = true;
      else if(k === this.ADJ_SHOP_CODE) b10 = true;
      else if(k === this.ADJ_LINEUP_PROCESS) b11 = true;
      // else if(k === this.OVER_SHOP_STATUS) b12 = true;
      // else if(k === this.EPST) b13 = true;
      else if(k === this.NEW_EPST) b14 = true;
      // else if(k === this.COMMENT) b15 = true;
    });

    return b1 && b2 && b10 && b11 && b14;
    //return b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9 && b10 && b11 && b12;
  }




  exportExcel() : void {

    if(_.isEmpty(this.MSHI003DataList)){
      this.errorMSG('無資料', '請先查詢資料後再匯出');
      return;
    }

    this.isSpinning = true;

    // 剔除不需要匯出的屬性
    let MSHI003DataListClone = [];
    this.MSHI003DataList.forEach(item => {
      if(!_.isNil(item.overShopStatus)){
        item.overShopStatus = item.overShopStatus === 'Y' ? '已過站' : item.overShopStatus === 'X' ? '查無MO資訊' : '未過站';
      }
      MSHI003DataListClone.push(_.omit(item, ['id', 'plantCode', 'saleLineno']));
    });

    const firstRow = ["idNo", "shopCode", "saleOrder", "saleItem", "custAbbr", "procStatus", "sfcDia", "finalMicNo", "processCode", "adjShopCode", "adjLineupProcess", "overShopStatus", "epst", "newEpst", "comment", "userCreate", "dateCreate", "userUpdate", "dateUpdate"];
    const firstRowDisplay = {idNo:this.ID_NO, shopCode:this.SHOP_CODE, saleOrder:this.SALE_ORDER, saleItem:this.SALE_ITEM, custAbbr:this.CUST_ABBR, procStatus:this.PROC_STATUS, sfcDia:this.SFC_DIA , finalMicNo:this.FINAL_MIC_NO, processCode:this.PROCESS_CODE, adjShopCode:this.ADJ_SHOP_CODE, adjLineupProcess:this.ADJ_LINEUP_PROCESS, overShopStatus:this.OVER_SHOP_STATUS, epst:this.EPST, newEpst:this.NEW_EPST, comment:this.COMMENT, userCreate:"建立人員", dateCreate:"建立日期", userUpdate:"更新人員", dateUpdate:"更新日期"};
    const exportData = [firstRowDisplay, ...MSHI003DataListClone]; 

    const workSheet = XLSX.utils.json_to_sheet(exportData,{header:firstRow, skipHeader:true});
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    XLSX.writeFileXLSX(workBook, `EPST變更作業_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`)
        
    this.isSpinning = false;
    this.sucessMSG("匯出成功!", ``);

  }

  // 當使用者關閉瀏覽器視窗時，若有資料已編輯卻未儲存，
  // 詢問是否不儲存直接關閉瀏覽器視窗
  @HostListener('window:beforeunload', ['$event'])
  onWindowClose(event: any){
    if(!_.isEmpty(this.MSHI003PendingDataList)){
      event.returnValue = ''
    }
  }

  // 使用者點選另一個頁面時，若有資料已編輯卻未儲存，
  // 詢問是否不儲存直接離開此頁面而進到到另一個頁面
  canDeactivate() : Promise<boolean> {
   // 若存在編輯過的資料
   if(!_.isEmpty(this.MSHI003PendingDataList)){
      return new Promise<boolean>(resolve => {
      this.Modal.confirm({
          nzTitle: '資料尚未儲存，是否放棄儲存離開此頁面?',
          nzOnOk: () => {
            resolve(true);
          },
          nzOnCancel: () =>{
            resolve(false);
          }
      })
      });
   }
   else{
    return Promise.resolve(true);
   }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.params = params;
    // this.setShopCodeCellEditorSelectValues();
    //gridApi.sizeColumnsToFit();
  }

  collectingDataForAdditionOrUpdate(){

      this.dataTransferService.getData().subscribe((node) => {
      this.isSpinning = true;
      // 判斷使用者經過一連串的編輯後，是否仍然與原資料相同
      // 若相同該筆資料則不進行儲存
      if(!_.isNil(this.MSHI003DataListDeepClone[node.rowIndex].newEpst)){
        this.MSHI003DataListDeepClone[node.rowIndex].newEpst = moment(this.MSHI003DataListDeepClone[node.rowIndex].newEpst).format('YYYY-MM-DD');
      }
      if(!_.isNil(node.data.newEpst)){
        node.data.newEpst = moment(node.data.newEpst).format('YYYY-MM-DD');
      }

      const isSame = _.isEqual(this.MSHI003DataListDeepClone[node.rowIndex], node.data);

      // 資料一樣(表示經過一連串的編輯後仍然與原資料相同)
      // 若之前有放到MSHI003PendingDataList之中則進行移除
      if(isSame){
        const isSameIndex = this.MSHI003PendingDataList.findIndex(data => data === node.data);
        if(isSameIndex > -1){
          this.MSHI003PendingDataList.splice(isSameIndex, 1);
        }
        this.isSpinning = false;
        return;
      }

      // 若收集待新增或更新的陣列為空則直接push進去
      if(_.isEmpty(this.MSHI003PendingDataList)){
        this.currentEditRowIndex = node.rowIndex;
        this.MSHI003PendingDataList.push(node.data);
        this.isSpinning = false;
        return;
      }
      
      // 判斷該筆資料是否已存在於this.MSHI003PendingDataList
      // 若存在則不需要再進行push
      const isExist = this.MSHI003PendingDataList.some(data => data === node.data);

      // 找不到同樣的資料則進行push
      if(!isSame && !isExist) {
        this.currentEditRowIndex = node.rowIndex;
        this.MSHI003PendingDataList.push(node.data);
      }

      this.isSpinning = false;
    });
  }

  // 根據使用者選擇的調整站別與調整流程搜尋EPST與判定過站狀態
  realTimeSearchForShopStatusAndEPST(){
    // 當收到使用者選擇的調整站別或調整流程時
    this.dataTransferService.getParamsOfAdjShopCodeAndAdjLineupProcess().subscribe((rowNode) => {
      this.isSpinning = true;

      if(!_.isNil(rowNode.data.adjShopCode) && !_.isNil(rowNode.data.adjLineupProcess)){
        // 請求後端API查找EPST與判定過站狀態
        this.findByIdNoAdjShopCodeAdjLineupProcess(rowNode.data.idNo, rowNode.data.adjShopCode, rowNode.data.adjLineupProcess).then(data =>{
          // 查找的到EPST與過站狀態
          if(!_.isNil(data.epst)){
            rowNode.data.epst = data.epst;
            rowNode.data.overShopStatus = 'N';
            rowNode.data.processCode = data.processCode
          }
          // 查找不到過站狀態
          else{
            rowNode.data.epst = null;
            rowNode.data.overShopStatus = 'Y';
            rowNode.data.processCode = data.processCode
          }
          // 渲染EPST與過站狀態至畫面上
          this.editAdjShopCodeAndAdjLineupProcessAfterHandler(rowNode);
        })
      }
      else{
        rowNode.data.epst = null;
        rowNode.data.overShopStatus = null;
        rowNode.data.processCode = null;
        // 渲染EPST與過站狀態至畫面上
        this.editAdjShopCodeAndAdjLineupProcessAfterHandler(rowNode);
      }
      this.isSpinning = false;
    });
  }

  editAdjShopCodeAndAdjLineupProcessAfterHandler(rowNode : IRowNode<MSHI003>) : void {
       
      // 紀錄當前編輯的 row index
      this.currentEditRowIndex = rowNode.rowIndex;
    
      // 渲染過站狀態與EPST到畫面上
       this.gridApi.setRowData(this.MSHI003DataList);

       // 將滾動條定位到可以看到過站狀態與EPST的位置
       this.gridApi.ensureIndexVisible(rowNode.rowIndex, 'middle');
       this.gridApi.ensureColumnVisible('comment', 'end');

       // 送出該筆資料進行儲存或更新
       this.dataTransferService.setData(rowNode);
  }

  async findByIdNoAdjShopCodeAdjLineupProcess(idNo : string, adjShopCode : string, adjLineupProcess : string) : Promise<any>{
    try{
      const res = await this.mshService.findByIdNoAdjShopCodeAdjLineupProcess(idNo, adjShopCode, adjLineupProcess).toPromise();
      if(res.code === 200){
        return res.data;
      }
      else{
        this.message.error('後台錯誤，獲取不到流程清單');
        return null;
      }
    } catch (error) {
      this.errorMSG('獲取流程清單失敗', `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`);
      return null;
    }
    finally{
      
    }
  }

  sucessMSG(_title, _plan): void {
		this.Modal.success({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}

  errorMSG(_title, _plan): void {
		this.Modal.error({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}

}

