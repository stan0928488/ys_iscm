import { Component, AfterViewInit } from '@angular/core';
import { ColDef, FirstDataRenderedEvent, ColumnApi, GridReadyEvent , GridApi} from 'ag-grid-community';
import * as moment from "moment";
import { Router } from '@angular/router';
import { AGHeaderCommonParams, AGHeaderParams } from 'src/app/shared/ag-component/types';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import { AGCustomActionCellComponent } from 'src/app/shared/ag-component/ag-custom-action-cell-component';
import { ORPService } from 'src/app/services/ORP/ORP.service';
import * as _ from "lodash";
import { firstValueFrom } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SummaryDatePickerCellEditorComponent } from './SummaryDatePickerCellEditor.Component';
import { CookieService } from 'src/app/services/config/cookie.service';
import { CommonService } from 'src/app/services/common/common.service';
import * as XLSX from 'xlsx';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-ORPP001',
  templateUrl: './ORPP001.component.html',
  styleUrls: ['./ORPP001.component.scss']
})
export class ORPP001Component implements AfterViewInit {
  USERNAME;
  // 獲取資料載入中提示元件是否顯示
  isSpinning = false;
  /////////////查詢/////////////
  //查詢框是否隱藏
  queryBarActive = false;
  // 客戶代號
  queryCustomerNo = null;
  // 客戶名稱
  queryCustomerName = null;
  //進單時間
  dateRange = [];
  startDateStr = '';
  endDateStr = '';
  // 資料內容
  queryDataList : any[] = [];
  //////////////////////////////
  isCustomerListLoading = false;
  // 客戶清單
  customerList : any[] = [];
  // 客戶名稱清單
  customerNameList : any[] = [];
  //客戶代號
  customerNoList : any[] = [];
  // 使用者選中的客戶代號
  customerNoInput = '';

  // 使用者選中的客戶名稱
    customerNameInput = '';
  /////////////新增/////////////
  //獲取新增資料載入中提示元件是否顯示
  isSpinningModal = false;
  // 新增submit處理中提示
  submitOkLoading = false;
  // 新增資料modal隱藏/顯示
  isVisibleAddData = false;
  // 客戶代號
  addCustomerNo = null;
  // 客戶名稱
  addCustomerName = null;
  //收貨人
  consignee;
  //訂單類型
  soType;
  //合約號
  contractNo;
  //幣別
  saleOrderCurrency;
  //合約餘量
  contractBalance;
  //業務員
  salesId;
  //業務員選單
  salesList : any[] = [];
  //採購單號
  custPurchaseOrder;
  // 資料內容
  addDataList : any[] = [];
  //合約號清單
  contractNoList: any[] = [];
  //合約清單載入狀態
  isContractNoListLoading = false;
  //合約相關資訊MAP
  contractInfoMap
  // 使用者匯入的檔案
  file: File;
  //單筆新增欄位
   maxOfTotalWeight;
  //總重下限
  minOfTotalWeight;
  //單重上限
  maxWeightOfEachProd;
  //單重下限
   minWeightOfEachProd;
  // 用於匯出之Excel與中文名稱對照的英文名稱
  fieldNameList : string[] = [];
  // 用於匯出之Excel與英文名稱與中文名稱的對照
  englishChineseTitleMapping = {}; 




  gridApiByAdd: GridApi;
  gridApi : GridApi;
  gridColumnApi : ColumnApi;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  status: "initial" | "uploading" | "success" | "fail" | "" = ""; // Variable to store file status

  constructor(
    private modal: NzModalService,
    private orpService: ORPService,
    private router: Router,
    private systemService : SYSTEMService,
    private cookieService: CookieService,
    private commonService:CommonService,
    private message: NzMessageService,
  ) 
  { 
    this.USERNAME = this.cookieService.getCookie("USERNAME");
  }

  agCustomHeaderCommonParams : AGHeaderCommonParams = { agName: 'AGName1' , isSave:true ,path: this.router.url  }   // 從db撈的參數
  agCustomHeaderParams : AGHeaderParams = { isMenuShow: true }
  gridOptions = {
    defaultColDef: {
      filter: true,
      resizable: true,
      sortable: false,
      enableRowGroup: false,
      enablePivot: false,
      enableValue: false,
    },
    api: null,
    agCustomHeaderParams : {
      agName: 'AGName1',      // agName自訂義，程式內如果有多個要配置，就AGName2...等等接續編號
      isSave:true ,          // 是否要有保存功能，可自行定義要不要保存目前ag欄位
      path: this.router.url , // 抓router
    }
  };



  columnDefs : ColDef[]   = [
    { headerName: '盤元進單轉單號', field: 'enquiryNo', width: 150, headerComponent : AGCustomHeaderComponent, headerComponentParams:this.agCustomHeaderParams},
    { headerName: '客戶鋼種', field: 'gradeNoCust', width: 150, headerComponent : AGCustomHeaderComponent},
    { headerName: '尺寸', field: 'saleOrderDia', width: 100, headerComponent : AGCustomHeaderComponent},
    { headerName: '重量(MT)', field: 'saleOrderWeight', width: 130, headerComponent : AGCustomHeaderComponent},
    { headerName: '華新料號', field: 'mtrlNo', width: 130, headerComponent : AGCustomHeaderComponent},
    { headerName: '單價', field: 'saleOrderUnitPrice', width: 130, headerComponent : AGCustomHeaderComponent},
    { headerName: '生計交期', field: 'dateDeliveryPp', width: 130, headerComponent : AGCustomHeaderComponent},
    { headerName: 'ITCA', field: 'saleItemt', width: 100, headerComponent : AGCustomHeaderComponent},
    { headerName: '次採購單號', field: 'custPurchaseOrder2', width: 150, headerComponent : AGCustomHeaderComponent},
    { headerName: '單重上限(KG)', field: 'maxWeightOfEachProd', width: 150, headerComponent : AGCustomHeaderComponent},
    { headerName: '單重下限(KG)', field: 'minWeightOfEachProd', width: 150, headerComponent : AGCustomHeaderComponent},
    { headerName: '總重上限(KG)', field: 'maxOfTotalWeight', width: 150, headerComponent : AGCustomHeaderComponent},
    { headerName: '總重下限(KG)', field: 'minOfTotalWeight', width: 150, headerComponent : AGCustomHeaderComponent},
    { headerName: '品保書碼', field: 'certificateCode', width: 130, headerComponent : AGCustomHeaderComponent},
    { headerName: '包裝碼', field: 'packCode', width: 120, headerComponent : AGCustomHeaderComponent},
    { headerName: '特殊需求', field: 'mechElmtRemark', width: 130, headerComponent : AGCustomHeaderComponent},
    { headerName: '營業說明', field: 'commentSales', width: 130, headerComponent : AGCustomHeaderComponent},
    { headerName: '客戶特殊掛牌', field: 'specialCustTag', width: 160, headerComponent : AGCustomHeaderComponent},
    { headerName: 'TAG列印PO號碼', field: 'custPoNoTag', width: 170, headerComponent : AGCustomHeaderComponent},
	];

  addColumnDefs : ColDef[]   = [
    { 
      headerName: '是否存在於合約', 
      field: 'isContract', 
      width: 100, 
      filter:false,
      cellStyle: params => {
        if (params.value == 'N') {
            return {background: 'red'};
        }else{
          return { background: '' };
        }
      },
    },
    { 
      headerName: '客戶鋼種', 
      field: 'gradeNoCust', 
      width: 100, 
      filter:false, 
      editable: true,
      onCellValueChanged: (event) => {
        if(!_.isEmpty(event.data.gradeNoCust)&&!_.isEmpty(event.data.saleOrderDia)&&!_.isEmpty(event.data.saleOrderWeight)){
          this.queryMtrlAndUnitPrice(event);
        }
      }
    },
    { 
      headerName: '尺寸', 
      field: 'saleOrderDia', 
      width: 80, 
      filter:false, 
      editable: true,
      onCellValueChanged: (event) => {
        if(!_.isEmpty(event.data.gradeNoCust)&&!_.isEmpty(event.data.saleOrderDia)&&!_.isEmpty(event.data.saleOrderWeight)){
          this.queryMtrlAndUnitPrice(event);
        }
      }
    },
    { 
      headerName: '重量(MT)', 
      field: 'saleOrderWeight', 
      width: 100, 
      filter:false, 
      editable: true,
      onCellValueChanged: (event) => {
        if(!_.isEmpty(event.data.gradeNoCust)&&!_.isEmpty(event.data.saleOrderDia)&&!_.isEmpty(event.data.saleOrderWeight)){
          this.queryMtrlAndUnitPrice(event);
        }
      }
    },
    { headerName: '華新料號', 
      field: 'mtrlNo', 
      width: 150, 
      filter:false, 
      editable: true,
      onCellValueChanged: (event) => {
        if(!_.isEmpty(event.data.mtrlNo)){
          this.queryPackCodeCertificateCodeByCustNo(event);
        }
      }
    },
    { headerName: '單價', field: 'saleOrderUnitPrice', width: 130, filter:false, editable: true},
    {
      width: 150,
      headerName: '生計交期',
      field: 'dateDeliveryPp',
      filter:false,
      editable: true,
      cellEditor:'summaryDatePickerCellEditorComponent'
    },
    { headerName: 'ITCA', field: 'saleItemt', width: 80, filter:false, editable: true},
    { headerName: '次採購單號', field: 'custPurchaseOrder2', width: 110, filter:false, editable: true},
    { headerName: '單重上限(KG)', field: 'maxWeightOfEachProd', width: 120, filter:false, editable: true},
    { headerName: '單重下限(KG)', field: 'minWeightOfEachProd', width: 120, filter:false, editable: true},
    { headerName: '總重上限(KG)', field: 'maxOfTotalWeight', width: 120, filter:false, editable: true},
    { headerName: '總重下限(KG)', field: 'minOfTotalWeight', width: 120, filter:false, editable: true},
    { headerName: '品保書碼', field: 'certificateCode', width: 100, filter:false, editable: true},
    { headerName: '包裝碼', field: 'packCode', width: 90, filter:false, editable: true},
    { headerName: '特殊需求', field: 'mechElmtRemark', width: 100, filter:false, editable: true},
    { headerName: '營業說明', field: 'commentSales', width: 100, filter:false, editable: true},
    { headerName: '客戶特殊掛牌', field: 'specialCustTag', width: 120, filter:false, editable: true},
    { headerName: 'TAG列印PO號碼', field: 'custPoNoTag', width: 140, filter:false, editable: true},
	];

  addGridOptions = {
    defaultColDef: {
      filter: true,
      editable: true,
      resizable: true,
      sortable: false,
      enableRowGroup: false,
      enablePivot: false,
      enableValue: false,
    },
      columnDefs: this.addColumnDefs,
      rowData: this.addDataList,
      enableCellChangeFlash: true,
    api: null,
    components: {
      summaryDatePickerCellEditorComponent:SummaryDatePickerCellEditorComponent,
    },

  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
  }

  async ngOnInit(): Promise<void> {
    await this.getCustomerList();
  }

  setCustomerNo(_customerNo:string, _type:string){
    if(_type === 'Q'){
      this.queryCustomerNo = _customerNo;
    }else{
      this.addCustomerNo = _customerNo;
      
      this.queryContractNoByCustNo();

    }
    
  }

  setCustomerName(_customerName:string, _type:string){
    if(_type === 'Q'){
      this.queryCustomerName = _customerName;
    }else{
      this.addCustomerName = _customerName;
    }
    
  }

  async onQuery(){

    if(!_.isEmpty(this.queryCustomerNo)){
      try{
        this.isSpinning = true;
        let obj = {};
        _.extend(obj, {
          custNo : this.queryCustomerNo,
          startDate : this.startDateStr,
          endDate : this.endDateStr,
        })
        const resObservable$ = this.orpService.querySSM407MST01(obj);
        const res = await firstValueFrom<any>(resObservable$);
        this.queryDataList = res.data;

        this.queryDataList.forEach(item => {
          if(!_.isEmpty(item.dateDeliveryPp)){
            item.dateDeliveryPp = moment(item.dateDeliveryPp).month(moment(item.dateDeliveryPp).month() - 1).format("YYYY-MM-DD");
          }
          
        })
  
        if(res.code !== 200){
          this.errorMSG(
            '查詢資料失敗',
            `${res.message}`
          );
          this.isSpinning = false;
          return;
        }
          this.isSpinning = false;
      } catch (error) {
        this.errorMSG(
          '查詢資料失敗',
          `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
        );
        this.isSpinning = false;
      }
    }else{
      this.errorMSG(
        '客戶代碼不可為空',
        `請先選擇客戶代碼再做查詢`
      );
    }

    
  }

  onDateChange(result: Date[]){
    console.log(result);
    if(result.length>0){
      this.startDateStr = moment(result[0]).format('YYYY-MM-DD');
      this.endDateStr = moment(result[1]).format('YYYY-MM-DD');
    }else{
      this.startDateStr = "";
      this.endDateStr = "";
    }
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
    * 獲取ag-grid的Api函數
    * @param params 
  */
    onGridReady(params: GridReadyEvent<any>) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    }

      /**
    * 獲取ag-grid的Api函數
    * @param params 
  */
    onGridReadyByAdd(params: GridReadyEvent<any>) {
      this.gridApiByAdd = params.api;
      this.gridColumnApi = params.columnApi;
    }
  

    addData(){
      this.isVisibleAddData = true;
    }

  // excel檔案
   incomingFile(event: any) {
    const file: File = event.target.files[0];
    this.addDataList = [];

    if (file) {
      this.status = "initial";
      this.file = file;
    }
  }

  exportToExcel(){
    this.isSpinning = true;
    this.getFieldNameList();
    this.getEnglishChineseTitleMapping();

    if(_.isEmpty(this.queryDataList)){
      this.errorMSG(
        '匯出失敗',
        `請先做查詢再匯出`
      );
      return;
    }

    const dataList = this.queryDataList.map(item => {
      const data = _.omit(item, ['dateCreate', 'userCreate', 'enquiryItem', 'docStatus', 'saleItem', 'userUpdate', 'dateUpdate','saleOrder', ,'DateDeliveryPp']) as any;
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
      `進單作業表_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`
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

  import(){
    if (this.file) {
      const formData = new FormData();
      // 上傳word
      if (this.file.type === 'application/msword') {
        formData.append('file', this.file, this.file.name);
        formData.append('contractNO', this.contractNo);
        console.log('上傳word');
        const upload$ = this.orpService.readWordFileByOrder(formData);
        this.status = 'uploading';

        upload$.subscribe({
          next: (res) => {
            var result:any = res.body;
            var myArray = JSON.parse(result);
            myArray.forEach(item => {
              item.gradeNoCust = item.gradeNo;
              item.saleOrderDia = item.dia;
              item.mtrlNo = item.mtrl;
              item.saleOrderWeight = item.weightMt;
              item.saleOrderUnitPrice = item.contractPrice
              delete item.gradeNo; // 删除原始的属性
              delete item.dia; // 删除原始的属性
              delete item.mtrl; // 删除原始的属性
              delete item.weightMt; // 删除原始的属性
              delete item.weightcontractPriceMt; // 删除原始的属性
            });
            console.log(myArray);

            this.addDataList = myArray;
            let obj = {};
            _.extend(obj, {
              custNo : this.addCustomerNo,
            })
            
            this.orpService.queryMinMaxWeightByCustNo(obj).subscribe(res => {
              console.log("getCreatePlanDataList success");
              let result: any = res;
              this.maxWeightOfEachProd = result.data.maxWeightOfEachProd;
              this.minWeightOfEachProd = result.data.minWeightOfEachProd;
              this.maxOfTotalWeight = result.data.maxOfTotalWeight;
              this.minOfTotalWeight = result.data.minOfTotalWeight;

              this.addDataList.forEach(item => {
                item.saleItemt = this.autoITCA(this.soType),
                item.maxWeightOfEachProd = this.maxWeightOfEachProd,
                item.minWeightOfEachProd = this.minWeightOfEachProd,
                item.maxOfTotalWeight = this.maxOfTotalWeight,
                item.minOfTotalWeight = this.minOfTotalWeight
                item.dateDeliveryPp = moment(new Date()).format("YYYY-MM-DD")
              });

              this.addGridOptions.api.setRowData(this.addDataList);
            });
      

            
            
            this.status = 'success';
          },
          error: (error: any) => {
            this.status = 'fail';
            return (() => error);
          },
        });
      } 

      // 上傳pdf
      else if (this.file.type === 'application/pdf') {
        formData.append('upload', this.file, this.file.name);
        formData.append('contractNo', this.contractNo);
        console.log('上傳pdf');
        let contractNo = this.contractNo;
        console.log(contractNo);
        const upload$ = this.orpService.readPdfFileByOrder(formData);
        this.status = 'uploading';

        upload$.subscribe({
          next: (res) => {
            var result:any = res.body;
            var myArray = JSON.parse(result);
            myArray.forEach(item => {
              item.gradeNoCust = item.gradeNo;
              item.saleOrderDia = item.dia;
              item.mtrlNo = item.mtrl;
              item.saleOrderWeight = item.weightMt;
              item.saleOrderUnitPrice = item.contractPrice
              delete item.gradeNo; // 删除原始的属性
              delete item.dia; // 删除原始的属性
              delete item.mtrl; // 删除原始的属性
              delete item.weightMt; // 删除原始的属性
              delete item.weightcontractPriceMt; // 删除原始的属性
              if(null == item.saleOrderUnitPrice){
                item.isContract = 'N'
              }else{
                item.isContract = 'Y'
              }
            });
            console.log(myArray);

            this.addDataList = myArray;
            let obj = {};
            _.extend(obj, {
              custNo : this.addCustomerNo,
            })
            
            this.orpService.queryMinMaxWeightByCustNo(obj).subscribe(res => {
              console.log("getCreatePlanDataList success");
              let result: any = res;
              this.maxWeightOfEachProd = result.data.maxWeightOfEachProd;
              this.minWeightOfEachProd = result.data.minWeightOfEachProd;
              this.maxOfTotalWeight = result.data.maxOfTotalWeight;
              this.minOfTotalWeight = result.data.minOfTotalWeight;

              this.addDataList.forEach(item => {
                item.saleItemt = this.autoITCA(this.soType),
                item.maxWeightOfEachProd = this.maxWeightOfEachProd,
                item.minWeightOfEachProd = this.minWeightOfEachProd,
                item.maxOfTotalWeight = this.maxOfTotalWeight,
                item.minOfTotalWeight = this.minOfTotalWeight,
                item.dateDeliveryPp = moment(new Date()).format("YYYY-MM-DD")  
              });

              this.addGridOptions.api.setRowData(this.addDataList);
            });
      

            
            
            this.status = 'success';
          },
          error: (error: any) => {
            this.status = 'fail';
            return (() => error);
          },
        });
      }
      
    }
  }

  required(){
    let flag = '';
    for(let i=0 ; i < this.addDataList.length ; i++) {
      let item = this.addDataList[i];
      if('N' === item.isContract){
        this.errorMSG(
          '尚有紅底未消除',
          `請先確認鋼種、尺寸是否存在於合約`
        );
        return;
      }else if(_.isEmpty(item.gradeNoCust)){
        this.errorMSG(
          '客戶鋼種不可為空',
          `請先填寫客戶鋼種`
        );
        return;
      }else if(_.isEmpty(item.saleOrderDia)){
        this.errorMSG(
          '尺寸不可為空',
          `請先填寫尺寸`
        );
        return;
      }else if(_.isEmpty(item.saleOrderWeight)){
        this.errorMSG(
          '重量(MT)不可為空',
          `請先填寫重量(MT)`
        );
        return;

      }else if(_.isEmpty(item.mtrlNo)){
        this.errorMSG(
          '華新料號不可為空',
          `請先填寫華新料號`
        );
        return;

      }else if(null == item.saleOrderUnitPrice){
        this.errorMSG(
          '單價不可為空',
          `請先填寫單價`
        );
        return;

      }else if(_.isEmpty(item.dateDeliveryPp)){
        this.errorMSG(
          '生計交期不可為空',
          `請先填寫生計交期`
        );
        return;

      }else if(_.isEmpty(item.saleItemt)){
        this.errorMSG(
          'ITCA不可為空',
          `請先填寫ITCA`
        );
        return;
      }else{
         flag = 'Y'
      }
    }

    if('Y' === flag){
      this.submit();
    }
  }

  async submit(){

    try{
      this.isSpinningModal = true;
      this.addDataList.forEach(item => {
        if(!_.isEmpty(item.dateDeliveryPp)){
          item.dateDeliveryPp =  new Date(item.dateDeliveryPp);
        }       
      });
      let obj = {};
      _.extend(obj, {
        custNo : this.addCustomerNo,
        custName : this.addCustomerName,
        saleOrderCurrency :this.saleOrderCurrency,
        soType : this.soType,
        custPurchaseOrder : this.custPurchaseOrder,
        salesId : this.salesId,
        consigneeSaleOrder : this.consignee,
        contractNo : this.contractNo,
        userCreate : this.USERNAME,
        dataList : this.addDataList
      })
      const resObservable$ = this.orpService.insertP001Data(obj);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '新增資料失敗',
          `${res.message}`
        );
        this.isSpinningModal = false;
        return;
      }

      this.addCancel();
      this.isSpinningModal = false;
      this.sucessMSG('操作成功', '新增資料成功');

    } catch (error) {
      this.errorMSG(
        '查詢單總上下限資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
      this.isSpinningModal = false;
    }

    
    
  }

  addCancel(){
    this.isVisibleAddData = false;
    this.consignee = '';
    this.saleOrderCurrency = '';
    this.salesId = '';
    this.contractNo = '';
    this.contractBalance = '';
    this.custPurchaseOrder = '';
    this.soType = '';
    this.contractNoList = [];
    this.addDataList = [];
    this.status='';
    this.addCustomerNo = null;
    this.addCustomerName = null;

  }

  requiredField(){
    if(!_.isEmpty(this.addCustomerNo) && !_.isEmpty(this.soType) && !_.isEmpty(this.contractNo)){
      return true;
    }else{
      this.errorMSG('請先完成填寫',
      `錯誤訊息 : 請先填寫上方資訊再做新增或上傳`)
      return;
    }

  }

  async addRow(){
    if(this.requiredField()){
      try{
        let obj = {};
        _.extend(obj, {
          custNo : this.addCustomerNo,
        })
        const resObservable$ = this.orpService.queryMinMaxWeightByCustNo(obj);
        const res = await firstValueFrom<any>(resObservable$);
        this.maxWeightOfEachProd = res.data.maxWeightOfEachProd;
        this.minWeightOfEachProd = res.data.minWeightOfEachProd;
        this.maxOfTotalWeight = res.data.maxOfTotalWeight;
        this.minOfTotalWeight = res.data.minOfTotalWeight;
       
        if(res.code !== 200){
          this.errorMSG(
            '查詢單總上下限資料失敗',
            `錯誤訊息 : ${res.message}`
          );
          return;
        }
  
        this.addDataList.push({
          saleItemt : this.autoITCA(this.soType),
          maxWeightOfEachProd : this.maxWeightOfEachProd,
          minWeightOfEachProd : this.minWeightOfEachProd,
          maxOfTotalWeight : this.maxOfTotalWeight,
          minOfTotalWeight : this.minOfTotalWeight,
          dateDeliveryPp : moment(new Date()).format("YYYY-MM-DD")
    
        });
        //添加新的行
        this.addGridOptions.api.setRowData(this.addDataList);
  
      } catch (error) {
        this.errorMSG(
          '查詢單總上下限資料失敗',
          `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
        );
      }
    }
    
    
  }

  async queryContractNoByCustNo(){

    try{
      this.isContractNoListLoading = true;
      let obj = {};
      _.extend(obj, {
        custNo : this.addCustomerNo,
      })
      const resObservable$ = this.orpService.queryContractNoByCustNo(obj);
      const res = await firstValueFrom<any>(resObservable$);
      this.contractNoList = res.data;
     
      if(res.code !== 200){
        this.errorMSG(
          '查詢合約號資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        return;
      }

      this.contractInfoMap = this.contractNoList.reduce((map, item) => {
        map.set(item.contractNo, item);
        return map;
    }, new Map<string, any>());

    } catch (error) {
      this.errorMSG(
        '查詢合約資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isContractNoListLoading = false;
    }
  }

  async getContractInfo(contractNo:String){
    this.addDataList = [];
    this.saleOrderCurrency = this.contractInfoMap.get(contractNo).saleOrderCurrency;
    this.custPurchaseOrder = this.contractInfoMap.get(contractNo).custPurchaseOrder;
    const salesId =  this.contractInfoMap.get(contractNo).salesId;
    try{
      this.isContractNoListLoading = true;
      let obj = {};
      _.extend(obj, {
        custNo : this.addCustomerNo,
        contractNo : contractNo,
        salesId :salesId
      })
      const resObservable$ = this.orpService.queryContractTotalWeightLeft(obj);
      const res = await firstValueFrom<any>(resObservable$);
      const resObservable1$ = this.orpService.querySales(obj);
      const res1 = await firstValueFrom<any>(resObservable1$);

      if(res.code !== 200){
        this.errorMSG(
          '查詢合約餘量失敗',
          `錯誤訊息 : ${res.message}`
        );
        return;
      }else if(null != res.data){
        this.contractBalance = res.data.contractBalance;
      }

      if(res1.code !== 200){
        this.errorMSG(
          '查詢業務員失敗',
          `錯誤訊息 : ${res1.message}`
        );
        return;
      }else if(null != res1.data){
        this.salesId = res1.data.salesId;
      }



      this.contractInfoMap = this.contractNoList.reduce((map, item) => {
        map.set(item.contractNo, item);
        return map;
    }, new Map<string, any>());

    } catch (error) {
      this.errorMSG(
        '查詢合約資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isContractNoListLoading = false;
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

  onRemoveSelected() {
    const selectedData = this.gridApiByAdd.getSelectedRows();
    const res = this.gridApiByAdd.applyTransaction({ remove: selectedData })!;
    const indexToRemove: number = this.addDataList.indexOf(selectedData[0]);
    this.addDataList.splice(indexToRemove, 1);
  }

  autoITCA(orderType: String){
    if(orderType === 'ZFT' || orderType === 'OR'){
      return 'ZTAA'
    }else if(orderType === 'ZFD'){
      return 'ZKLN'
    }else if(orderType === 'ZCM'){
      return 'ZTAN'
    }
  }

  async queryMtrlAndUnitPrice(event){
    try{

      let obj = {};
      _.extend(obj, {
        custName : this.addCustomerName,
        gradeNoCust : event.data.gradeNoCust,
        saleOrderWeight : event.data.saleOrderWeight,
        saleOrderDia : event.data.saleOrderDia,
        contractNo : this.contractNo
      })
      const resObservable$ = this.orpService.queryMtrlAndUnitPrice(obj);
      const res = await firstValueFrom<any>(resObservable$);
      event.data.mtrlNo = res.data.mtrlNo
      event.data.saleOrderUnitPrice = res.data.saleOrderUnitPrice

      if(null == event.data.saleOrderUnitPrice){
        event.data.isContract = 'N';
      }else{
        event.data.isContract = 'Y';
      }

      this.gridApiByAdd.applyTransaction({ update: [event.data] });
      this.queryPackCodeCertificateCodeByCustNo(event);
      if(res.code !== 200){
        this.errorMSG(
          '查詢合約號資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        return;
      }

    } catch (error) {
      this.errorMSG(
        '查詢合約資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    }
  }

  async queryPackCodeCertificateCodeByCustNo(event){
    try{

      let obj = {};
      _.extend(obj, {
        custNo : this.addCustomerNo,
        mtrlNo : event.data.mtrlNo
      })
      const resObservable$ = this.orpService.queryPackCodeCertificateCodeByCustNo(obj);
      const res = await firstValueFrom<any>(resObservable$);
     
      if(res.code !== 200){
        this.errorMSG(
          '查詢品保書碼、包裝碼資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        return;
      }else if(null != res.data){
        event.data.packCode = res.data.packCode;
        event.data.certificateCode = res.data.certificateCode;
  
        this.gridApiByAdd.applyTransaction({ update: [event.data] });
      }

    } catch (error) {
      this.errorMSG(
        '查詢品保書碼、包裝碼資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    }
  }

  index = 0;
  addItem(input: HTMLInputElement): void {
    const value = input.value;
    if (this.salesList.indexOf(value) === -1) {
      this.salesList = [...this.salesList, input.value || `New item ${this.index++}`];
    }
  }

    async getCustomerList(){

    if(!_.isEmpty(this.customerList)){
      return;
    }

    try{
      this.isCustomerListLoading = true;
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

      this.customerNoList = res.data.map(item => item.custNo);
      this.customerNameList = res.data.map(item => item.custAbbreviations);

    } catch (error) {
      this.errorMSG(
        '查詢客戶資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isCustomerListLoading = false;
    }
  }

  customerChange(type:string , queryAdd:string){
      
      // 選中某一個客戶代號則帶出對應的客戶名稱
      if(_.isEqual(type, 'no')){
        if(_.isNil(this.customerNoInput)){
          if('add' === queryAdd){
            this.addCustomerName = null;
          }else{
            this.queryCustomerName = null;
          }
         
        }
        else{
          if('add' === queryAdd){
            this.consignee = this.addCustomerNo;
            this.addCustomerName = this.customerList.find(item => item.custNo === this.addCustomerNo).custAbbreviations;
            this.queryContractNoByCustNo();
          }else{
            this.queryCustomerName = this.customerList.find(item => item.custNo === this.queryCustomerNo).custAbbreviations;
          }
          
        }
      }
        // 選中某一個客戶名稱則帶出對應的客戶代號
      else{
        if(_.isNil(this.customerNameInput)){
          if('add' === queryAdd){
            this.addCustomerNo = null;
          }else{
            this.queryCustomerNo = null;
          }
        }
        else{
          if('add' === queryAdd){
            this.consignee = this.addCustomerNo;
            this.addCustomerNo = this.customerList.find(item => item.custAbbreviations === this.addCustomerName).custNo;
            this.queryContractNoByCustNo();
          }else{
            this.queryCustomerNo = this.customerList.find(item => item.custAbbreviations === this.queryCustomerNo).custNo;
          }
          
        }
      }

  }


}
