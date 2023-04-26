
import { Component, AfterViewInit, NgZone,ViewChild} from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { zh_TW ,NzI18nService } from "ng-zorro-antd/i18n";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { AppComponent } from "src/app/app.component";
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { CellClickedEvent, ColDef, GridReadyEvent, PreConstruct } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { element } from "protractor";
import { LABService } from "src/app/services/LAB/LAB.service";

interface data {
  moEdition: String,
  sampleNo: string,
  sampleId: string,
  saleOrderDia: string,
  cuso4Test: string,
  impactTest: string;
  shape: string,
  mechanicalPropertiesCode: string,
  gradeNo: string,
  sampleDate: string,
  experimentDays: string,

  
}

interface dataMain {
  moEdition: String,
  sampleNo: string,
  sampleId: string,
  idNo: String,
  custAbbr: String,
  sampleDate: String,
  saleOrderDia: string,
  shopCode: String,
  sfcDia: String,
  finalMicNo: String,
  gradeNo: String,
  shape: String,
  mechanicalPropertiesCode: String,
  sampleLineUp: String,
  lineupDesc: String,
  sampleShopCode: String,
  saleOrder: String,
  saleItem: String,
  dateDeliveryPp: String,
  dlvyDate: String,
  sensitizationTest: String,
  sensitizationTestDesc: String,
  impactTest: String,
  impacTestDesc: String,
  sampleDateCreate: String,
  cuso4Test: String,
  experimentDays: String,
  experimentDoneDate: String,
  sampleStatus: String,
}

class statusInformation {
  moEdition: String;
  status: String;
  status_sub: String;
  percent :Number;
  construct(moEdition: String,status: String,status_sub: string){
    this.moEdition = moEdition;
    this.status = status;
    this.status_sub = status_sub;
  }
}
class labInformation {
  moEdition: String;
  status: String;
  dateCreate: string;
  dateUpdate: string;

  construct(moEdition: String,status: String,dateCreate: string,dateUpdate: string){
    this.moEdition = moEdition;
    this.status = status;
    this.dateCreate = dateCreate;
    this.dateUpdate = dateUpdate;
  }
  
}
@Component({
  selector: 'app-LABP100',
  templateUrl: './LABP100.component.html',
  styleUrls: ['./LABP100.component.css'],
  providers:[NzMessageService]
})

export class LABP100Component implements AfterViewInit {
  isSpinning = false;
  LoadingPage = false;
  isClear = true;
  USERNAME;
  PLANT_CODE;
  mo_default:string = null;
  abbr_default:string = '';
  order_default = '';
  shape = "";
  saleOrderDia = "";
  status = "this is a status test";
  
  dateRange = [];
  expDateRange = [];
  startDateStr = '';
  endDateStr = '';
  mo_list = ['版本一','版本二','版本三','版本四','版本五'];
  abbr_list = ['a1' , 'b1'];
  order_list = ['o1' , 'o1'];
  stat
  sampleId :string = '';
  idNo = '';
  date = '';
  status_list = [];
  columnDefsTab1: ColDef<data>[] = [
    { headerName:'MO版本',field: 'moEdition' , filter: false,width: 100 },
    { headerName:'取樣代號',field: 'sampleNo' , filter: false,width: 100 },
    { headerName: '取樣ID' ,field: 'sampleId' , filter: false,width: 100 },
    { headerName:'放樣ID',field: 'idNo' , filter: false,width: 100 },
    { headerName:'客戶',field: 'custAbbr' , filter: false,width: 100 },
    { headerName:'取樣時間',field: 'sampleDate' , filter: false,width: 100 },
    { headerName: '訂單尺寸' ,field: 'saleOrderDia' , filter: false,width: 100 },
    { headerName:'現況站別',field: 'shopCode' , filter: false,width: 100 },
    { headerName:'現況尺寸',field: 'sfcDia' , filter: false,width: 100 },
    { headerName:'現況final_mic_no',field: 'finalMicNo' , filter: false,width: 150 },
    { headerName: '鋼種' ,field: 'gradeNo' , filter: false,width: 100 },
    { headerName: '生產型態' ,field: 'shape' , filter: false,width: 100 },
    { headerName: '機械性質碼' ,field: 'mechanicalPropertiesCode' , filter: false,width: 120 },
    { headerName: '取樣流程' ,field: 'sampleLineUp' , filter: false,width: 100 },
    { headerName: '生產流程' ,field: 'lineupDesc' , filter: false,width: 100 },
    { headerName: '取樣站別' ,field: 'sampleShopCode' , filter: false,width: 100 },
    { headerName: '現況訂單' ,field: 'saleOrder' , filter: false,width: 100 },
    { headerName: '現況訂單項次' ,field: 'saleItem' , filter: false,width: 120 },
    { headerName: '生計交期' ,field: 'dateDeliveryPp' , filter: false,width: 100 },
    { headerName: '允收截止日' ,field: 'dlvyDate' , filter: false,width: 120 },
    { headerName: '敏化測試' ,field: 'sensitizationTest' , filter: false,width: 100 },
    { headerName: '敏化測試說明' ,field: 'sensitizationTestDesc' , filter: false,width: 120 },
    { headerName: '衝擊測試' ,field: 'impactTest' , filter: false,width: 100 },
    { headerName: '衝擊測試說明' ,field: 'impacTestDesc' , filter: false,width: 120 },
    { headerName: '取樣建立時間' ,field: 'sampleDateCreate' , filter: false,width: 120 },
    { headerName: '硫酸銅測試' ,field: 'cuso4Test' , filter: false,width: 120 },
    { headerName: '實驗天數' ,field: 'experimentDays' , filter: false,width: 100 },
    { headerName: '預計實驗完成時間' ,field: 'experimentDoneDate' , filter: false,width: 150 },
    { headerName: '取樣狀態' ,field: 'sampleStatus' , filter: false,width: 100 }
  ];

  columnDefsTab2: ColDef<data>[] = [
    { headerName:'MO版本',field: 'moEdition' , filter: false,width: 100 },
    { headerName:'取樣代號',field: 'sampleNo' , filter: false,width: 100 },
    { headerName: '取樣ID' ,field: 'sampleId' , filter: false,width: 100 },
    { headerName: '訂單尺寸' ,field: 'saleOrderDia' , filter: false,width: 100 },
    { headerName: '硫酸銅測試' ,field: 'cuso4Test' , filter: false,width: 120 },
    { headerName: '衝擊測試' ,field: 'impactTest' , filter: false,width: 100 },
    { headerName: '生產型態' ,field: 'shape' , filter: false,width: 100 },
    { headerName: '機械性質碼' ,field: 'mechanicalPropertiesCode' , filter: false,width: 120 },
    { headerName: '鋼種' ,field: 'gradeNo' , filter: false,width: 100 },
    { headerName: '取樣時間' ,field: 'sampleDate' , filter: false,width: 100 },
    { headerName: '實驗天數' ,field: 'experimentDays' , filter: false,width: 100 }
  ];

  labs : labInformation[] = [];
  rowDataTab1: dataMain[] = [];
  rowDataTab2: data[] = [];
  initialData : data[] = [];
  // DefaultColDef sets props common to all Columns

  public defaultColDefTab1: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  public defaultColDefTab2: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  gridOptionsTab1 = {
    columnDefs: this.columnDefsTab2,
    rowDataTab1: this.rowDataTab1,
    rowSelection: 'single',
    animateRows: true,
  };

  gridOptionsTab2 = {
    columnDefs: this.columnDefsTab2,
    rowDataTab2: this.rowDataTab2,
    rowSelection: 'single',
    animateRows: true,
  };

  // Data that gets displayed in the grid
  public rowDataTab1$!: Observable<any[]>;
  public rowDataTab2$!: Observable<any[]>;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private LABService : LABService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private component: AppComponent
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }

  ngOnInit(): void {
    this.isSpinning = false;
    this.isClear = true;
    this.mo_default=null;
    this.shape = "";
    this.saleOrderDia = "";
     
    var startDateStr = moment().startOf('month').format('YYYY-MM-DD');
    var endDateStr = moment().endOf('month').format('YYYY-MM-DD');
    this.rowDataTab1 = [];
    this.rowDataTab2 = [];
    
    this.getMoEditionList();
    
    this.initialSampleData();
    this.getTblabl001AllData();
    this.dateRange.push(startDateStr);
    this.dateRange.push(endDateStr);
    this.expDateRange.push(startDateStr);
    this.expDateRange.push(endDateStr);

  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
  }

  getLabInformation(moEdition:String){
   
    console.log('get lab');
    let myObj = this;

    this.labs = [];
    this.status  ='';
    this.status_list = [];

    
    myObj.LABService.getLabInformation(this.PLANT_CODE,moEdition).subscribe(res => {

      let result:any = res;
      
      if(result.code == 200){
        var temp = result.data;

        for(var i=0 ; i<temp.length;i++){
          var lab = new labInformation();
          lab.moEdition = temp[i]['moEdition'];
          lab.status = temp[i]['status'];
          lab.dateCreate = moment(temp[i]['dateCreate']).format('YYYY-MM-DD HH:mm:ss');
          lab.dateUpdate = moment(temp[i]['dateUpdate']).format('YYYY-MM-DD HH:mm:ss');

          this.labs.push(lab);

          
        }

        var now = this.labs[0].status == 'Y' ? '結束':'執行中';

        this.status = "狀態 : " + now;

        myObj.LABService.getTblabl001AllData(this.PLANT_CODE,moEdition).subscribe(res => {
        
          let result:any = res;
      
          if(result.code == 200){
            var temp = result.data;

            for(var i=0 ; i<temp.length;i++){
                var status = new statusInformation();

                status.moEdition = temp[i].moEdition;
                status.status = temp[i].status;

                if(temp[i].statusSub == 'Success')
                  status.percent = 100;

                else 
                  status.percent = 50;

                  this.status_list.push(status);
            }
          }
        });
      }
    });
  }

  getMoEditionList(){

    console.log('get mo edition');
    let myObj = this;
    myObj.LABService.getMoEditionList(this.PLANT_CODE).subscribe(res => {

      let result:any = res;
      
      if(result.code == 200){
        var temp = result.data;

        console.log(result);

        this.mo_list = temp;
        this.mo_default = this.mo_list[0];

        this.getSaleOrder(this.mo_default);
        this.getAbbrList(this.mo_default);
        this.getLabInformation(this.mo_default);
      }
    });

  }

  getAbbrList(moEdition:String){

    console.log('get cust abbr');
    let myObj = this;
    myObj.LABService.getAbbrList(this.PLANT_CODE,moEdition).subscribe(res => {

      let result:any = res;
      
      if(result.code == 200){
        var temp = result.data;

        console.log(result);

        this.abbr_list = temp;
        //this.mo_default = this.mo_list[0];
      }
    });

  }

  getTblabl001AllData(){

    console.log('getTblabl001AllData');
    let myObj = this;
    myObj.LABService.getTblabl001AllData(this.PLANT_CODE,'20230424163414').subscribe(res => {

      let result:any = res;
      
      if(result.code == 200){
        var temp = result.data;

        console.log(result);

        //this.abbr_list = temp;
        //this.mo_default = this.mo_list[0];
      }
    });

  }

  getSaleOrder(moEdition:String){

    
    let myObj = this;
    myObj.LABService.getSaleOrder(this.PLANT_CODE,moEdition).subscribe(res => {

      let result:any = res;
      
      if(result.code == 200){
        var temp = result.data;
        console.log('getSaleOrder');
        console.log(result);

        this.order_list = temp;
        //this.mo_default = this.mo_list[0];
      }
    });

  }
  getMoDetailList(moEdition: String){

    console.log('get mo edition');
    let myObj = this;
    console.log(this.abbr_default);
    myObj.LABService.getMoDetailList(this.PLANT_CODE,moEdition,this.abbr_default,this.sampleId
    ,this.dateRange[0],this.dateRange[1]).subscribe(res => {

      let result:any = res;
      
      if(result.code == 200){
        var temp = result.data;

        console.log(result);
        this.rowDataTab2 = temp;
        
      }
    });

  }

  getMoInformation(moEdition: String){

    console.log('get mo edition');
    let myObj = this;
    myObj.LABService.getMoInformation(this.PLANT_CODE,moEdition,this.abbr_default,this.sampleId,this.idNo,this.order_default,
      this.dateRange[0],this.dateRange[1],this.expDateRange[0],this.expDateRange[1]).subscribe(res => {

      let result:any = res;
      
      if(result.code == 200){
        var temp = result.data;

        console.log(result);

        this.rowDataTab1 = temp;
      }
    });

  }

  //重新取得工時
  reloadLabStatus() {
    let myObj = this;
    this.LoadingPage = true;
    myObj.LABService.reloadLabStatus(this.PLANT_CODE, moment().format('YYYYMMDDHHmmss'), this.USERNAME).subscribe(res => {
      let result:any = res;
      
      if(result.code == 200) {
        this.LoadingPage = false;
        this.getMoInformation(result.message.substring(result.message.length - 14))
        this.sucessMSG("執行成功", result.message);
        console.log(result.data);
      } else {
        this.LoadingPage = false;
        // this.getMoInformation(result.message.substring(result.message.length - 14))
        this.sucessMSG("執行失敗", result.message);
      }

    });
      
  }
  
  initialSampleData() {
    this.initialData = [
      {
      "moEdition": "版本一",
      "sampleNo": "1",
      "sampleId": "1",
      "saleOrderDia": "1",
      "cuso4Test": "1",
      "impactTest": "1",
      "shape": "1",
      "mechanicalPropertiesCode": "1",
      "gradeNo": "1",
      "sampleDate": "1",
      "experimentDays": "1"
      },
      {
      "moEdition": "版本二",
      "sampleNo": "2",
      "sampleId": "2",
      "saleOrderDia": "2",
      "cuso4Test": "2",
      "impactTest": "2",
      "shape": "2",
      "mechanicalPropertiesCode": "2",
      "gradeNo": "2",
      "sampleDate": "2",
      "experimentDays": "2"
      },
      {
      "moEdition": "版本三",
      "sampleNo": "3",
      "sampleId": "3",
      "saleOrderDia": "3",
      "cuso4Test": "3",
      "impactTest": "3",
      "shape": "3",
      "mechanicalPropertiesCode": "3",
      "gradeNo": "3",
      "sampleDate": "3",
      "experimentDays": "3"
      },
      {
      "moEdition": "版本四",
      "sampleNo": "4",
      "sampleId": "4",
      "saleOrderDia": "4",
      "cuso4Test": "4",
      "impactTest": "4",
      "shape": "4",
      "mechanicalPropertiesCode": "4",
      "gradeNo": "4",
      "sampleDate": "4",
      "experimentDays": "4"
      },
      {
      "moEdition": "版本五",
      "sampleNo": "5",
      "sampleId": "5",
      "saleOrderDia": "5",
      "cuso4Test": "5",
      "impactTest": "5",
      "shape": "5",
      "mechanicalPropertiesCode": "5",
      "gradeNo": "5",
      "sampleDate": "5",
      "experimentDays": "5"
      }
      ]

      console.log(this.rowDataTab2);
  }
  onQueryTab1(): void{
    let myObj = this;
    if (this.mo_default === "" || this.mo_default === null) {
      myObj.message.create("error", "請選擇「版次」");
      return;
    // } else if (this.ctNo === "" || this.ctNo === null) {
    //   myObj.message.create("error", "請填寫「合約號」");
    //   return;
    }

    this.rowDataTab2 = [];
    this.isSpinning = true;
    this.getMoInformation(this.mo_default);
    this.isSpinning = false;
  }

  onQueryTab2(): void{
    let myObj = this;
    if (this.mo_default === "" || this.mo_default === null) {
      myObj.message.create("error", "請選擇「版次」");
      return;
    // } else if (this.ctNo === "" || this.ctNo === null) {
    //   myObj.message.create("error", "請填寫「合約號」");
    //   return;
    }

    this.rowDataTab2 = [];
    this.isSpinning = true;
    this.getMoDetailList(this.mo_default);
    this.isSpinning = false;

  }



  onrowDataTab2Tab2(jsonData): void{
    this.gridOptionsTab2.rowDataTab2.push(jsonData);
  }

  exportExcelTab1(): void {
    if (this.rowDataTab1.length < 1) {
      this.errorMSG("EXCEL 匯出失敗", "請先查詢後再匯出");
      return;
    }
    let header = [['MO版本', '取樣代號', '取樣ID', '放樣ID', '客戶','取樣時間', '訂單尺寸', '現況站別', '現況尺寸', '現況final_mic_no', '鋼種',
          '生產型態', '機械性質碼', '取樣流程', '生產流程', '取樣站別','現況訂單', '現況訂單項次', '生計交期', '允收截止日', '敏化測試', '敏化測試說明',
            '衝擊測試', '衝擊測試說明', '取樣建立時間', '硫酸銅測試', '實驗天數', '預計實驗完成時間', '取樣狀態' ]];

    var dataReSort = {
      data : []
    };

    for(var i in this.rowDataTab1) {
        var item = this.rowDataTab1[i];
        dataReSort.data.push({
            "moEdition" : item.moEdition,
            "sampleNo" : item.sampleNo,
            "sampleId" : item.sampleId,
            "idNo" : item.idNo,
            "custAbbr" : item.custAbbr,
            "sampleDate" : item.sampleDate,
            "saleOrderDia" : item.saleOrderDia,
            "shopCode" : item.shopCode,
            "sfcDia" : item.sfcDia,
            "finalMicNo" : item.finalMicNo,
            "gradeNo" : item.gradeNo,
            "shape" : item.shape,
            "mechanicalPropertiesCode" : item.mechanicalPropertiesCode,
            "sampleLineUp" : item.sampleLineUp,
            "lineupDesc" : item.lineupDesc,
            "sampleShopCode" : item.sampleShopCode,
            "saleOrder" : item.saleOrder,
            "saleItem" : item.saleItem,
            "dateDeliveryPp" : item.dateDeliveryPp,
            "dlvyDate" : item.dlvyDate,
            "sensitizationTest" : item.sensitizationTest,
            "sensitizationTestDesc" : item.sensitizationTestDesc,
            "impactTest" : item.impactTest,
            "impacTestDesc" : item.impacTestDesc,
            "sampleDateCreate" : item.sampleDateCreate,
            "cuso4Test" : item.cuso4Test,
            "experimentDays" : item.experimentDays,
            "experimentDoneDate" : item.experimentDoneDate,
            "sampleStatus" : item.sampleStatus
        });
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet,header);
    XLSX.utils.sheet_add_json(worksheet,dataReSort.data,{ origin: 'A2', skipHeader: true });//origin => started row

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet,'sheet1');
    XLSX.writeFile(book,new Date().toLocaleDateString('sv')+'工時擷取與詳細結果_擷取結果主檔.xlsx');//filename => Date_
  }

  exportExcel(): void {
    if (this.rowDataTab2.length < 1) {
      this.errorMSG("EXCEL 匯出失敗", "請先查詢後再匯出");
      return;
    }
    let header = [['MO版本', '取樣代號', '取樣ID', '訂單尺寸', '硫酸銅測試','衝擊測試', '生產型態', '機械性質碼', '鋼種', '取樣時間', '實驗天數']];

    var dataReSort = {
      data : []
    };

    for(var i in this.rowDataTab2) {
        var item = this.rowDataTab2[i];
        dataReSort.data.push({
            "moEdition" : item.moEdition,
            "sampleNo" : item.sampleNo,
            "sampleId" : item.sampleId,
            "saleOrderDia" : item.saleOrderDia,
            "cuso4Test" : item.cuso4Test,
            "impactTest" : item.impactTest,
            "shape" : item.shape,
            "mechanicalPropertiesCode" : item.mechanicalPropertiesCode,
            "gradeNo" : item.gradeNo,
            "sampleDate" : item.sampleDate,
            "experimentDays" : item.experimentDays
        });
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet,header);
    XLSX.utils.sheet_add_json(worksheet,dataReSort.data,{ origin: 'A2', skipHeader: true });//origin => started row

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet,'sheet1');
    XLSX.writeFile(book,new Date().toLocaleDateString('sv')+'工時擷取與詳細結果_擷取結果明細檔.xlsx');//filename => Date_
  }

  // Example load data from sever
 onGridReady(params: GridReadyEvent) {

 }
 changeMo(index){
  console.log('change to' + this.mo_list[index]);
  this.mo_default = this.mo_list[index]
  this.getSaleOrder(this.mo_default);
  this.getAbbrList(this.mo_default);
  this.getLabInformation(this.mo_default);
 }

 changeAbbr(index){
  console.log('change to' + this.abbr_list[index]);
  this.abbr_default = this.abbr_list[index]
 }


 changeOrder(index){
  console.log('change to' + this.order_list[index]);
  this.order_default = this.order_list[index]
 }
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }

  formateDateTime(dateTimeArray, key): string{
    let resultStr = "";

    for(let arrNum = 0; arrNum < dateTimeArray.length; arrNum ++){
      if(arrNum >= 0 && arrNum <=2){
        resultStr += arrNum == 2 ?
          dateTimeArray[arrNum].toString()+" " : dateTimeArray[arrNum].toString()+"/";
      }else if(arrNum >=3 && arrNum != dateTimeArray.length-1){
        resultStr += dateTimeArray[arrNum].toString()+":";
      }else{
        if(key == "plnDate"){
          resultStr += (dateTimeArray.length < 6 && arrNum == dateTimeArray.length-1) ?
                    dateTimeArray[arrNum].toString()+":0" : dateTimeArray[arrNum].toString();
        }else{
          resultStr += dateTimeArray[arrNum].toString();
        }
      }
    }

    return resultStr;
  }


  showTab1(){
    // 關閉頁籤一
    var tab1 = document.getElementById("tab_1");
    tab1.style.display = "";
    // 打開頁籤二
    var tab2 = document.getElementById("tab_2");
    
    tab2.style.display = "none";

    var showtab1 = document.getElementById("show_tab1");
    
    showtab1.style.backgroundColor = '#008CBA';
    var showtab2 = document.getElementById("show_tab2");
    
    showtab2.style.backgroundColor = '' ;
    console.log(showtab2)
  }

  showTab2(){
    // 關閉頁籤一
    var tab1 = document.getElementById("tab_1");
    tab1.style.display = "none";
    // 打開頁籤二
    var tab2 = document.getElementById("tab_2");
    
    tab2.style.display = "";

    var showtab1 = document.getElementById("show_tab1");
    console.log(showtab1)
    showtab1.style.backgroundColor = '';
    var showtab2 = document.getElementById("show_tab2");
    
    showtab2.style.backgroundColor = '#008CBA' ;
    console.log(showtab2)
  }

  onDateChange(result: Date[]): void {
    console.log('onChange: ', result);
    // before after
    this.dateRange[0] =  moment(result[0], "YYYY-MM-DD").format("YYYY-MM-DD");
    this.dateRange[1] = moment(result[1], "YYYY-MM-DD").format("YYYY-MM-DD");
  }

  onExpDateChange(result: Date[]): void {
    console.log('onChange: ', result);
    // before after
    this.expDateRange[0] =  moment(result[0], "YYYY-MM-DD").format("YYYY-MM-DD");
    this.expDateRange[1] = moment(result[1], "YYYY-MM-DD").format("YYYY-MM-DD");
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

}
