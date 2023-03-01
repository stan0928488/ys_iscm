import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { ORPService } from "src/app/services/ORP/ORP.service";
import { zh_TW ,NzI18nService } from "ng-zorro-antd/i18n";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { AppComponent } from "src/app/app.component";
import { NzTableSize } from 'ng-zorro-antd/table';
// import { NzCheckboxChange } from 'ng-zorro-antd';
import * as XLSX from 'xlsx'
import * as _ from "lodash";
import * as moment from 'moment';
import { reject } from "lodash";


interface Data {
  id: number;
  productKind: string;
  product: string;
  ID_NO: string;
  gradeNo: string;
  width: number;
  thickness: number;
  quality: string;
  weight: number;
  wipTime: string;
  DATE_PLAN_IN_STORAGE: string;
  DATE_DELIVERY_PP: string;
  memo: String;
  countDay: number;
  disabled: boolean;
}

@Component({
  selector: "app-ORPP100",
  templateUrl: "./ORPP100.component.html",
  styleUrls: ["./ORPP100.component.scss"],
  providers:[NzMessageService]
})
export class ORPP100Component implements AfterViewInit {
	loading = false; //loaging data flag
  isVisible = false;
  isGredientsVisible = false;
  isTempVisible = false;
  isOPVisible = true;
  isDisabled = false;
  isSpinning = false;
  disable_r = false;
  disable_o = false;
  USERNAME;
  custlistOfOption = [];
  listOfData = [];    // queryData
  listOfData1 = [];   // queryData1
  listOfDataTemp = [];           // 暫存資料

  selCustomer = "";  // 已選擇客戶
  // bak
  FROZAN_GROUP;
  planlist;
  oldPlanEdition;

  // 訂單配料程式所需欄位
  SALE_ORDER = "";               // 訂單號碼
  DATE_DELIVERY_PP = "";         // 生計交期
  SALE_ORDER_WEIGHT = "";        // 訂單重
  CYCLE_NO = "";                 // CTCLE_NO
  PRODUCT = "";                  // 產品分類
  CUSTOMER = "";                 // 客戶
  PP_SHOW_LINEUP_DESC = "";      // 製程
  MTRL_NO = "";                  // 料號
  GRADE_NO = "";                 // 鋼種
  SALE_ORDER_THICK = "";         // 訂單厚度(厚度?)
  JIS_MARK = "";                 // JIS_MARK
  SALE_ORDER_WIDTH = "";         // 寬度
  THICK_MAX = "";                // 厚度上限
  THICK_MIN = "";                // 厚度下限
  HOT_ROLLED_THICK = "";         // 熱軋厚度
  MAX_WEIGHT_OF_EACH_PROD = "";  // 單重上限
  MIN_WEIGHT_OF_EACH_PROD = "";  // 單重下限
  FLAG_CERTIICATE_ORIGIN = "";   // 產證
  FLAG_BIS = "";                 // BIS 認證
  CUST_SPECIAL = "";             // 訂單特殊需求
  UNROLL_WEIGHT;                 // 待軋量
  GREDIENTS_WEIGHT;              // 配料量
  selectedData = [];
  public isAllSelected: boolean = false;

  // 配料量頁面所需欄位
  ID_NO = "";  
  THICK;                         // 實際厚度
  WIDTH;                         // 實際寬度
  LENGTH;                        // 實際長度
  WEIGHT;                        // 重量
  MIC_NO;                        // 現況料號

  pp_date_start = "";            // 生計交期_起
  pp_date_end = "";              // 生計交期_迄
  strategy_method = "";          // 選定策略

  strategylistOfOption = [];     // 策略選單 
  strategyName = "";             // 策略名稱

  order_list = [];               // 欲配料的ID
  sale_orders = [];              // 欲配料的ID
  checkboxStatus = false         // 

  isCheckedButton = true;
  isDisabledButton = false;
  tableSize: NzTableSize = 'middle';

  // ----- 主畫面欄位寬度 ----- //
  // widthConfig = Array(22).fill(null);
  widthConfig = [];
  // ----- 主畫面欄位寬度 ----- //

  // ----- 配料量欄位寬度 ----- //
  widthConfig1 = Array(7).fill(null);
  // ----- 配料量欄位寬度 ----- //


  panels = [
    {
      active: true,
      name: '資料查詢區域',
      disabled: false
    }
  ];

  constructor(
    private ORPService: ORPService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private component: AppComponent
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    
  }

  ngOnInit(): void {
  }

  checkButton(): void {
    this.isCheckedButton = !this.isCheckedButton;
  }

  disableButton(): void {
    this.isDisabledButton = !this.isDisabledButton;
  }

  // 匯出EXCEL(訂單查詢對照表)
  async exportToExcel() {
    /* generate worksheet */
    var json_data = this.listOfData
    json_data = JSON.parse(JSON.stringify(json_data).split('"SALE_ORDER":').join('"訂單號碼":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"CUSTOMER":').join('"收貨人":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"PRODUCT":').join('"產品分類":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"SALE_ORDER_WEIGHT":').join('"訂單重":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"UNROLL_WEIGHT":').join('"待軋量":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"GREDIENTS_WEIGHT":').join('"配料量":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"SALE_ORDER_THICK":').join('"厚度":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"THICK_MAX":').join('"厚度上限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"THICK_MIN":').join('"厚度下限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"SALE_ORDER_WIDTH":').join('"寬度":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"GRADE_NO":').join('"鋼種":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"HOT_ROLLED_THICK":').join('"熱軋厚度":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"MAX_WEIGHT_OF_EACH_PROD":').join('"單重上限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"MIN_WEIGHT_OF_EACH_PROD":').join('"單重下限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"MTRL_NO":').join('"料號":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"PP_SHOW_LINEUP_DESC":').join('"製程":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"DATE_DELIVERY_PP":').join('"生計交期":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"CYCLE_NO":').join('"CYCLE_NO":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"JIS_MARK":').join('"MARK":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"FLAG_CERTIICATE_ORIGIN":').join('"產證":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"FLAG_BIS":').join('"BIS認證":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"CUST_SPECIAL":').join('"訂單特殊需求":'));
    for (let i = 1; i <= json_data.length; i++){
      delete json_data[i-1]['id'];
      delete json_data[i-1]['tab1ID'];
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json_data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '訂單查詢對照表');
    /* save to file */
    XLSX.writeFile(wb, '訂單查詢對照表.xlsx');
    await this.delay(500); // 睡眠0.5秒，以同步程式
    // this.LoadingStatus("Off");
    this.sucessMSG("成功匯出!", ``);
  }

  // 匯出EXCEL(配料明細)
  async exportToExcel2() {
    /* generate worksheet */
    var json_data = this.listOfData1
    // json_data = JSON.parse(JSON.stringify(json_data).split('"ID_NO":').join('"ID_NO":'));
    // json_data = JSON.parse(JSON.stringify(json_data).split('"data.SALE_ORDER":').join('"配料訂單":'));
    // json_data = JSON.parse(JSON.stringify(json_data).split('"THICK":').join('"實際厚度":'));
    // json_data = JSON.parse(JSON.stringify(json_data).split('"WIDTH":').join('"實際寬度":'));
    // json_data = JSON.parse(JSON.stringify(json_data).split('"LENGTH":').join('"實際長度":'));
    // json_data = JSON.parse(JSON.stringify(json_data).split('"WEIGHT":').join('"重量":'));
    for (let i = 1; i <= json_data.length; i++){
      delete json_data[i-1]['id'];
      delete json_data[i-1]['tab1ID'];
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json_data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '配料明細');
    /* save to file */
    XLSX.writeFile(wb, '配料明細.xlsx');
    await this.delay(500); // 睡眠0.5秒，以同步程式
    // this.LoadingStatus("Off");
    this.sucessMSG("成功匯出!", ``);
  }

  // 控制加載圖示顯示/隱藏
  LoadingStatus(Status) {
    var loadingStatus = document.getElementById('loadingStatus')
    if (Status==='On') {
      loadingStatus.className = "";
      // 鎖住按鈕
      (<HTMLInputElement>document.getElementById("singleAdd")).disabled = true;
      (<HTMLInputElement>document.getElementById("bacthAdd")).disabled = true;
      (<HTMLInputElement>document.getElementById("download")).disabled = true;
    }
    else {
      loadingStatus.className = "hidden";
      // 打開按鈕
      (<HTMLInputElement>document.getElementById("singleAdd")).disabled = false;
      (<HTMLInputElement>document.getElementById("bacthAdd")).disabled = false;
      (<HTMLInputElement>document.getElementById("download")).disabled = false;
    }
  }

  // 睡眠函式
  delay(ms: number) {
    return new Promise<void>(function(resolve) {
      setTimeout(resolve, ms);
    });
  }

  // 時間格式修改_起
  changeDate_start(result: Date): void {
    this.pp_date_start = this.component.dateFormat(result, 2)
  }

  // 時間格式修改_迄
  changeDate_end(result: Date): void {
    this.pp_date_end = this.component.dateFormat(result, 2)
  }

  // 暫存結果
  saveResult(){
    let myObj = this;
    // JSON.stringify(jsonString);
    this.listOfDataTemp = this.listOfDataTemp.concat(this.listOfData);
    myObj.message.create("success", "暫存完成")
    console.log(this.listOfDataTemp);
    this.isDisabled = true;
  }

  // 取得策略名稱
  getStrategyList() {
    this.loading = true;
    let myObj = this;
    this.ORPService.getStrategyList().subscribe(res => {
      let result:any = res ;
      if(result.code === 200) {
        console.log(result.data)
        let newres = [];
        for(let i=0 ; i < result.data.length ; i++) {
          newres.push(result.data[i].strategyName);
        }
        this.strategylistOfOption = newres;

      } else {
        this.message.error('後台錯誤，請檢查');
      }
      myObj.loading = false;
    },err => {
      this.message.error('請求獲取失敗');
    });
  }


  // 執行訂單查詢
  onSearch() {
    let myObj = this;
    if (this.pp_date_start === "" || this.pp_date_start === null){
      myObj.message.create("error", "請填寫「生計交期_開始時間」");
      return;
    } else if (this.pp_date_end === "" || this.pp_date_end === null){
      myObj.message.create("error", "請填寫「生計交期_結束時間」");
      return;
    } else if (this.UNROLL_WEIGHT === "" || this.UNROLL_WEIGHT === null){
      myObj.message.create("error", "請填寫「待軋量」");
      return;
    } else if (this.strategyName === ""){
      myObj.message.create("error", "「選定策略」為必填");
      return;
    }
    
    myObj.message.create("success", "資料讀取中 ...")
    this.sendOrder();
  }

  // 送出訂單查詢
  sendOrder(){
    let myObj = this;
    // return new Promise((resolve, reject) => {
    let obj = {};
      _.extend(obj, {
        pp_date_start : this.pp_date_start,
        pp_date_end : this.pp_date_end,
        unroll_weight : (this.UNROLL_WEIGHT), // 轉換成公斤
        strategy_method : this.strategyName
      })

      myObj.ORPService.sendOrder(obj).subscribe(res => {
        let result:any = res;
        if(result.code === 200) {
          let jsonString = result.data;
          this.listOfData = JSON.parse(jsonString);
          console.log(jsonString)
          console.log("成功接收資料")
          this.selectAll()
          this.isDisabled = false;
          // this.isAllSelected = false
        } else {
          this.message.error('後台錯誤，請檢查')
        }
      },err => {
        reject('upload fail');
        this.message.error('請求獲取失敗')
      })
    
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
  // 查詢檢查
  requestTEST(){
    let myObj = this;
    myObj.message.create("warning", "功能待開發");
  }

  // 測試按紐
  onTest(){
    let myObj = this;
    this.sendGredients();
  }

  // 訂單查詢
  orderSearch(){
    let myObj = this;
  }

  // 執行配料
  runIngredients(){
    let myObj = this;
    myObj.message.create("error", "請先執行訂單查詢");
  }

  // 配料量頁面關閉
  openGredientsPickerCancel() {
    this.isGredientsVisible = false;
  }

  // 暫存頁面關閉
  openTempPickerCancel(){
    this.isTempVisible = false;
  }

  // 全選功能
  selectAll(): void {
    this.listOfData.forEach(item => {
      item.selected = !this.isAllSelected;
    });
    const orderList: string[] = this.listOfData.map(row => row["SALE_ORDER"]);
    // const orderList1: string[] = this.listOfData.reduce((acc, row) => {
    //   acc.push(row["SALE_ORDER"]);
    //   return acc;
    // }, []);
    // console.log("--1--");
    // console.log(orderList1);
    // console.log("--1--");
    if (orderList.length == this.listOfData.length){
      const orderList = [];
    }
    this.sale_orders = orderList
    console.log("--2--");
    console.log(orderList);
    console.log("--2--");
    this.isAllSelected = true
    // this.sale_orders = this.listOfData
    // console.log(this.sale_orders);
  }

  // 點選checkbox後動作
  onCheckboxChange(_data){
    if (!this.sale_orders.includes(_data))
    {
      this.sale_orders.push(_data);
    } else {
      const index = this.sale_orders.indexOf(_data); // 刪除data
      if (index >= 0) {
        this.sale_orders.splice(index, 1);
      }
    }
    // this.sale_orders.push(_data);
    console.log(this.sale_orders);
  }

  // 送出執行配料
  onGredients(){
    let myObj = this;
    myObj.message.create("loading", "配料執行中 ...")
    this.sendGredients();
    
  }

  // 執行配料, 並送出參數
  sendGredients(){
    let obj = {};
    let myObj = this;
    _.extend(obj, {
      sale_orders : this.sale_orders
    })
    
    myObj.ORPService.getGredientsTable(obj).subscribe(res => {
      let result:any = res;
      if(result.code === 200) {
        let jsonString = result.data;
        this.listOfData = JSON.parse(jsonString);
        console.log(jsonString)
        console.log("成功接收資料")
        myObj.message.create("success", "配料完成")
        this.isAllSelected = false
      } else {
        this.message.error('後台錯誤，請檢查')
      }
    },err => {
      reject('upload fail');
      this.message.error('請求獲取失敗')
    })
  }

  // 開啟配料量頁面
  openGredientsPicker(_data) {
    let myObj = this;
    this.isGredientsVisible = true;
    this.onGredientsWeight(_data)
  }

  // 開啟暫存頁面
  openTempPicker() {
    let myObj = this;
    this.isTempVisible = true;
    this.onTemp()
  }

  // 送出查詢配料量
  onGredientsWeight(_data){
    let myObj = this;
    myObj.message.create("loading", "查詢中 ...")
    this.sendGredientsWeight(_data);
  }

  // 送出查詢暫存頁面
  onTemp(){
    let myObj = this;
    myObj.message.create("loading", "查詢中 ...")
  }

  // 執行查詢配料量
  sendGredientsWeight(_data){
    let obj = {};
    let myObj = this;
    _.extend(obj, {
      sale_orders : [_data]
    })
    console.log(obj);
    myObj.ORPService.getGredientsWeightTable(obj).subscribe(res => {
      let result:any = res;
      console.log(result);
      if(result.code === 200) {
        let jsonString1 = result.data;
        this.listOfData1 = JSON.parse(jsonString1);
        console.log(jsonString1);
        console.log("成功接收資料");
      } else {
        this.message.error('後台錯誤，請檢查')
      }
    },err => {
      reject('upload fail');
      this.message.error('請求獲取失敗')
    })
  }
  
}





