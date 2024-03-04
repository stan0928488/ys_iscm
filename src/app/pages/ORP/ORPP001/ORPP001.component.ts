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
  // 客戶清單
  customerList : any[] = [];
  // 客戶名稱清單
  customerNameList : any[] = [];
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
  sales;
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
      headerName: '客戶鋼種', 
      field: 'gradeNoCust', 
      width: 100, 
      filter:false, 
      editable: true,
      onCellValueChanged: (event) => {
        if(!_.isEmpty(event.data.gradeNoCust)&&!_.isEmpty(event.data.saleOrderDia)&&!_.isEmpty(event.data.saleOrderWeight)){
          this.queryMtrl(event);
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
          this.queryMtrl(event);
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
          this.queryMtrl(event);
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

  async querySales(){
    try{
      const resObservable$ = this.orpService.querySales();
      const res = await firstValueFrom<any>(resObservable$);
       
      if(res.code !== 200){
        this.errorMSG(
          '獲取業務員下拉選單失敗',
          `錯誤訊息 : ${res.message}`
        );
        return;
      }

      this.salesList = res.data;

    } catch (error) {
      this.errorMSG(
        '獲取業務員下拉選單失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    }
  }

  async ngOnInit(): Promise<void> {
    await this.querySales();
  }

  setCustomerNo(_customerNo:string, _type:string){
    if(_type === 'Q'){
      this.queryCustomerNo = _customerNo;
    }else{
      this.addCustomerNo = _customerNo;
      this.consignee = _customerNo;
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
          item.dateDeliveryPp = moment(item.dateDeliveryPp).month(moment(item.dateDeliveryPp).month() - 1).format("YYYY-MM-DD");
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

  }

  import(){
    if (this.file) {
      const formData = new FormData();
      // 上傳word
      if (this.file.type === 'application/msword') {
        formData.append('file', this.file, this.file.name);
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
              delete item.gradeNo; // 删除原始的属性
              delete item.dia; // 删除原始的属性
              delete item.mtrl; // 删除原始的属性
              delete item.weightMt; // 删除原始的属性
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
        console.log('上傳pdf');
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
              delete item.gradeNo; // 删除原始的属性
              delete item.dia; // 删除原始的属性
              delete item.mtrl; // 删除原始的属性
              delete item.weightMt; // 删除原始的属性
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

  async submit(){
    try{
      this.isSpinningModal = true;
      this.addDataList.forEach(item => {
        item.dateDeliveryPp =  moment(item.dateDeliveryPp);
      });
      let obj = {};
      _.extend(obj, {
        custNo : this.addCustomerNo,
        saleOrderCurrency :this.saleOrderCurrency,
        soType : this.soType,
        custPurchaseOrder : this.custPurchaseOrder,
        sales : this.sales,
        consignee : this.consignee,
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
    this.sales = '';
    this.contractNo = '';
    this.contractBalance = '';
    this.custPurchaseOrder = '';
    this.soType = '';
    this.contractNoList = [];
    this.addDataList = [];
    this.status='';
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
          minOfTotalWeight : this.minOfTotalWeight  
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
    this.saleOrderCurrency = this.contractInfoMap.get(contractNo).saleOrderCurrency;
    this.custPurchaseOrder = this.contractInfoMap.get(contractNo).custPurchaseOrder;
    try{
      this.isContractNoListLoading = true;
      let obj = {};
      _.extend(obj, {
        custNo : this.addCustomerNo,
        contractNo : contractNo
      })
      const resObservable$ = this.orpService.queryContractTotalWeightLeft(obj);
      const res = await firstValueFrom<any>(resObservable$); 
     
      if(res.code !== 200){
        this.errorMSG(
          '查詢合約號資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        return;
      }else if(null != res.data){
        this.contractBalance = res.data.contractBalance;
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

  async queryMtrl(event){
    try{

      let obj = {};
      _.extend(obj, {
        custName : this.addCustomerName,
        gradeNoCust : event.data.gradeNoCust,
        saleOrderWeight : event.data.saleOrderWeight,
        saleOrderDia : event.data.saleOrderDia
      })
      const resObservable$ = this.orpService.queryMtrl(obj);
      const res = await firstValueFrom<any>(resObservable$);
      event.data.mtrlNo = res.data.mtrlNo

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



}
