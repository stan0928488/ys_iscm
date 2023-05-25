import { Component, OnInit } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
import {NzMessageService} from "ng-zorro-antd/message"
import { AppComponent } from "src/app/app.component";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';
import * as _ from "lodash";

interface data {
  fcpEdition: String,
  schShopCode: String,
  sfcShopCode: String,
  saleAreaGroup: String,
  custAbbreviations: String,
  idNo: String,
  saleOrder: String,
  saleItem: String,
  dateDeliveryPP: String,
  steelType: String,
  lineupProcess: String,
  finalProcess: String,
  scheType: String,
  planWeightI: number,
  saleItemLength: number,
  actualLength: number,
  cycleNo: String,
  mergeNo: String,
  inputDia: String,
  outDia: String,
  datePlanInStorage: String,
  remarkPlanInStorage: String,
  kindType: String
}


@Component({
  selector: 'app-PPSR301',
  templateUrl: './PPSR301.component.html',
  styleUrls: ['./PPSR301.component.css'],
  providers:[NzMessageService,DatePipe]
})
export class PPSR301Component implements OnInit {
  date = new Date(); // new Date();
  isVisibleUse = false;
  isVisibleDtl = false;
  loadMachineDtlLoading = false;
  // content = "style={ p { word-break:break-all; }}"
  queryDate = "" ;
  MonOne = ""
  Montwo = ""
  MonThree = ""
  thead = [] ;
  testHeader = [
    {
      value : 'A' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'B' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'C' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'D' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'E' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },

    {
      value : 'F' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'G' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'H' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'I' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value :'J' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'K' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'L' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'M' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'N' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'O' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'P' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'Q' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'R' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'S' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },

    {
      value : 'T' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'U' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'V' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : ' -明細- ' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },

  ] ;
  theadList = [
    [
    {
    value : '站別' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'來源：站別機台關聯表-站別'
  },{
    value : '機群' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'來源：站別機台關聯表-機群'

  },{
    value : '機台' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'來源：站別機台關聯表-機台'
  },
  {
    value : '交期月份' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'計算當月往後，共三個月'
  },
  {
    value : '已生產量' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'MES代入已過機量'
  },
  {
    value : '最大負荷量' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'接單量+可再負荷量'
  },
  {
    value : '機台狀況' ,
    mergeRow: 0 ,
    mergeCol: 2,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'機台狀況'
  },
  {
    value : '機台狀況' ,
    mergeRow: 0 ,
    mergeCol: 2,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台狀況'
  },
  {
    value : '負荷量' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'負荷量'
  },
  {
    value : '負荷量' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'負荷量'
  },
  {
    value : '負荷量' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'負荷量'
  },
  {
    value : '負荷量' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'負荷量'
  },
  {
    value : '庫存分佈' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'庫存分佈'
  },
  {
    value : '庫存分佈' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'庫存分佈'
  },
  {
    value : '庫存分佈' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'庫存分佈'
  },
  {
    value : '庫存分佈' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'庫存分佈'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '顯示明細' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true
  },
  ],[
    {
      value : '站別' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false
    },
    {
      value : '機群' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false
    },
    {
      value : '機台' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false
    },
    {
      value : '交期月份' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false,
      hoverTitle:'說明'
    },
    {
      value : '已生產量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false
    },
    {
      value : '最大負荷量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false
    },
    {
      value : '剩餘負荷量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:`來源：FCP結果表，不含跨天的總重，依機台、交期月份顯示`
    },
    {
      value : '可再負荷量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:`來源：FCP結果表，剩餘工時*平均工時；剩餘工時：月天數-目前時間-停機時間； 平均工時：總重/總工時(排除停機) `
    },
    {
      value : this.MonOne ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，總工時(不含停機)/排程負荷_當月工時(M)'
    },
    {
      value : this.Montwo ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，總工時(不含停機)/排程負荷_當月工時(M+1)'
    },
    {
      value :this.MonThree ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，總工時(不含停機)/排程負荷_當月工時(M+2)'
    },
    {
      value : '總工時(天)' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，總工時(不含停機)，換算成天'
    },
    {
      value : '軋欠' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天 & MO開頭=Y & MO開頭=0X & LOCK=1 的總重，依機台、交期月份顯示'
    },
    {
      value : '已軋未到料' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天 & MO開頭=Y & MO開頭=0X & LOCK=0 & 合併單號開頭=0C 的總重，依機台、交期月份顯示'
    },

    {
      value : 'WIP未到站' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天 & MO開頭<>Y & MO開頭<>0X & 預計安排站別不等於現況站別 的總重，依機台、交期月份顯示'
    },
    {
      value : 'WIP已到站' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天 & MO開頭<>Y & MO開頭<>0X & 預計安排站別 = 現況站別 & SORT群組=1 的總重，依機台、交期月份顯示',
    },
    {
      value : 'R' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，型態限定為 R & D，依機台、交期月份顯示'
    },
    {
      value : 'H' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，型態限定為 C & H，依機台、交期月份顯示'
    },
    {
      value : 'S' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，型態限定為 Z & S，依機台、交期月份顯示'
    },
    {
      value : 'F' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，型態限定為 F，依機台、交期月份顯示'
    },
    {
      value : 'I' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，型態限定為 I，依機台、交期月份顯示'
    },
    {
      value : '解捲' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，製程碼限定為 J，依機台、交期月份顯示'
    },

  ]];

  // 用途說明
  modalTableTitle = [] ;
  usetbodyList = [
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '由MES取得直棒各工站/機台實際過機量(區分生產訂單交期月份)' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '依據剩餘負荷量與可再負荷量加總顯示交期月份的最大負荷量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '依據交期月份角度計算目前剩餘負荷量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '依據交期月份的訂單平均工時與剩餘工時，推算當月可在接單量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '呈現各月份排程計畫中訂單交期分布工時' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value :'-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '交期月份中訂單的軋鋼尚未產出之欠量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '交期月份中訂單於軋鋼已產出但尚未到直棒廠重量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },

    {
      value : '交期月份中訂單中來料已到直棒廠生產，但尚未到該站生產的重量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '交期月份中訂單中來料已到直棒廠生產，且已到站待生產的重量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '計算交期月份現況各機台生產的產品型態分布量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '交期月份於當站為解捲製程的重量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'a' ,
      mergeRow: 0,
      mergeCol: 0,
      showCell : true
    },

  ] ;

  // 展開明細表頭
  dtlModalTitle = "";

  optionList = [];
  selectedValue = {};

  fcpVer = "";
  monList = [] ;
  tbodyList = [] ;
  tableLoading = false ;

  loading = false; //loaging data flag
  // tslint:disable-next-line:no-any
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  log(value: { label: string; value: string }): void {
    //console.log(value);
  }
  
  tooltipShowDelay = 0;

  constructor(
    private datePipe : DatePipe,
    private getPPSService: PPSService,
    private message:NzMessageService,
    private Modal: NzModalService,
    private component: AppComponent
    ) {

  }

  
  columnDefs: ColDef<data>[] = [
    { headerName: '站別' ,field: 'schShopCode' , filter: false,width: 100 },
    { headerName: '現況站別',field: 'sfcShopCode' , filter: false,width: 100 },
    { headerName: '銷售區別' ,field: 'saleAreaGroup' , filter: false,width: 120 },
    { headerName: '客戶名稱',field: 'custAbbreviations' , filter: false,width: 120},
    { headerName: 'MO',field: 'idNo' , filter: false,width: 120 },
    { headerName: '訂單號碼' ,field: 'saleOrder' , filter: false,width: 100 },
    { headerName: '訂單項次' ,field: 'saleItem' , filter: false,width: 100 },
    { headerName: '交期',field: 'dateDeliveryPP' , filter: false,width: 120 },
    { headerName: '鋼種' ,field: 'steelType' , filter: false,width: 120 },
    { headerName: '現況流程' ,field: 'lineupProcess' , filter: false,width: 150},
    { headerName: 'FINAL_生產流程',field: 'finalProcess' , filter: false,width: 150 },
    { headerName: '抽數別', field:'scheType', filter:false, width:120},
    { headerName: '計畫重量' ,field: 'planWeightI' , filter: false,width: 100 },
    { headerName: '訂單長度' ,field: 'saleItemLength' , filter: false,width: 120 },
    { headerName: '實際長度' ,field: 'actualLength' , filter: false,width: 100 },
    { headerName: 'CYCLE_NO',field: 'cycleNo' , filter: false,width: 120 },
    { headerName: '合併單號',field: 'mergeNo' , filter: false,width: 120 },
    { headerName: '投入尺寸' ,field: 'inputDia' , filter: false,width: 100 },
    { headerName: '產出尺寸',field: 'outDia' , filter: false,width: 100 },
    { headerName: '允收截止日' ,field: 'datePlanInStorage' , filter: false,width: 120 },
    { headerName: '入庫日的備註' ,field: 'remarkPlanInStorage' , filter: false,width: 120 },
    { headerName: '產品種類' ,field: 'kindType' , filter: false,width: 100 }
  ];
  
  rowData: data[] = [];    

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };


  ngOnInit() {
    this.theadList.push(this.testHeader);
    this.getVerList();
    this.initDate();
    this.getShopList();
    this.modalTableTitle.push(this.usetbodyList)
  }

  listOfOption = [];
  listOfSelectedValue: string[] = [];

  isNotSelected(value: string): boolean {
    return this.listOfSelectedValue.indexOf(value) === -1;
  }

  // 取得版本號
  getVerList() {
    this.loading = true;
    //console.log("getVerList...");
    let myObj = this;
    this.getPPSService.getR301VerList().subscribe(res => {
     // console.log("getVerList success :" + JSON.stringify(res)) ;
      let result:any = res ;
      this.optionList = []
      let optionListTemp = [] ;
      for(let item of result) {
        let temp = {label:item.FCP_EDITION, value:item.FCP_EDITION} ;
        optionListTemp.push(temp);
      }
      this.selectedValue = optionListTemp[0] ;
      this.optionList = optionListTemp ;
      //console.log("optionList:"+JSON.stringify(this.optionList))
      myObj.loading = false;
    });
  }
  initDate(){
    let result = this.date ;
    this.queryDate = this.datePipe.transform(result,'yyyy-MM') ;
    this.MonOne = moment(result).format('YYYY-MM') ;
    this.Montwo = moment(result).add(1,'months').format('YYYY-MM') ;
    this.MonThree = moment(result).add(2,'months').format('YYYY-MM') ;
    this.theadList[1][8].value = this.MonOne ;
    this.theadList[1][9].value = this.Montwo ;
    this.theadList[1][10].value = this.MonThree ;
    this.thead = this.theadList ;
    // console.log("表格头部：" + JSON.stringify(this.thead)) ;
  }

  onChange(result: Date): void {
    this.queryDate = this.datePipe.transform(result,'yyyy-MM') ;
    this.MonOne = moment(result).format('YYYY-MM') ;
    this.Montwo = moment(result).add(1,'months').format('YYYY-MM') ;
    this.MonThree = moment(result).add(2,'months').format('YYYY-MM') ;
    this.theadList[1][8].value = this.MonOne ;
    this.theadList[1][9].value = this.Montwo ;
    this.theadList[1][10].value = this.MonThree ;
    this.thead = this.theadList ;
    //console.log("theadList : "+ JSON.stringify(this.theadList));
    //console.log('onChange: ', this.datePipe.transform(result,'yyyy-MM'));
  }

  getShopList(){
  let myObj = this;
  this.getPPSService.getPickerShopEQUIPNEW('1', '　').subscribe(res => {
    let result :any = res;
    var newres = [];
    for(let i=0 ; i < result.length ; i++) {
      newres.push(result[i].SHOP_CODE);
    }
    this.listOfOption = newres;   //初始化站別選擇
  });
  }

  queryBtnFun(){
    // console.log("queryDate",)
    // //數據庫讀出日期
    // this.queryDate = "2022-05"
    // let date = new Date(this.queryDate)
    // this.date = date ;
    // console.log("data ： "+date) ;
    this.tbodyList = [];
    //this.fcpVer = "F20220906165544"
    this.monList = [] ;
    this.monList.push(this.MonOne) ;
    this.monList.push(this.Montwo) ;
    this.monList.push(this.MonThree) ;
    //console.log("已選擇數據:" + this.listOfSelectedValue)
    let verTemp:any = this.selectedValue ;
    this.fcpVer = verTemp.value ;
    //console.log("版本號選擇："  + JSON.stringify(verTemp.value) ) ;
    this.getDataList() ;

  }

  getDataList(){
    this.tableLoading = true ;
    let myObj = this ;
    let comitParamete = {fcpVer : this.fcpVer, monList: this.monList, shopList: this.listOfSelectedValue } ;
    myObj.getPPSService.getR301DataList(comitParamete).subscribe(res => {
      //console.log("comitData :" + JSON.stringify(res)) ;
      this.tableLoading = false;
      let result:any = res ;
      this.tbodyList = [] ;
      if(result.code === 1) {
        this.tbodyList = result.data ;
        console.log("tbodyList :" + JSON.stringify(this.tbodyList)) ;
        //this.message.info(result.message) ;
      } else {
        //this.message.error(result.message) ;
      }

    },err => {
      this.tableLoading = false ;
      this.message.error('網絡請求失敗');
    })
  }

  openComment() {
    this.isVisibleUse = true;

  }
  useCancel() {
    this.isVisibleUse = false;

  }
  useOk() {
    this.isVisibleUse = false;
  }

  // EXCEL 匯出
  loadMachineExport() {
    // this.message.error('還沒寫完');

    // 建立Workbook物件
    const workbook = new ExcelJS.Workbook();

    // 建立Worksheet物件
    const worksheet = workbook.addWorksheet('Sheet1');

    // 設定合併儲存格
    worksheet.mergeCells('A1:A2');
    worksheet.mergeCells('B1:B2');
    worksheet.mergeCells('C1:C2');
    worksheet.mergeCells('D1:D2');
    worksheet.mergeCells('E1:E2');
    worksheet.mergeCells('F1:F2');
    worksheet.mergeCells('G1:H1');
    worksheet.mergeCells('I1:L1');
    worksheet.mergeCells('M1:P1');
    worksheet.mergeCells('Q1:V1');

    // 設定儲存格值
    worksheet.getCell('A1').value = '站別';
    worksheet.getCell('B1').value = '機群';
    worksheet.getCell('C1').value = '機台';
    worksheet.getCell('D1').value = '交期月份';
    worksheet.getCell('E1').value = '已生產量';
    worksheet.getCell('F1').value = '最大負荷量';
    worksheet.getCell('G1').value = '機台狀況';
    worksheet.getCell('I1').value = '負荷量';
    worksheet.getCell('Q1').value = '庫存分佈';
    worksheet.getCell('M1').value = '機台負荷';
    worksheet.getCell('G2').value = '剩餘負荷量';
    worksheet.getCell('H2').value = '可再負荷量';
    worksheet.getCell('I2').value = this.MonOne;
    worksheet.getCell('J2').value = this.Montwo;
    worksheet.getCell('K2').value = this.MonThree;
    worksheet.getCell('L2').value = '總工時(天)';
    worksheet.getCell('M2').value = '軋欠';
    worksheet.getCell('N2').value = '已軋未到料';
    worksheet.getCell('O2').value = 'WIP未到站';
    worksheet.getCell('P2').value = 'WIP已到站';
    worksheet.getCell('Q2').value = 'R';
    worksheet.getCell('R2').value = 'H';
    worksheet.getCell('S2').value = 'S';
    worksheet.getCell('T2').value = 'F';
    worksheet.getCell('U2').value = 'I';
    worksheet.getCell('V2').value = '解捲';
    
    // 填入資料
    this.tbodyList.forEach(item => {
      const row = worksheet.addRow([item[0].value, item[1].value, item[2].value, item[3].value, item[4].value, item[5].value, item[6].value,
        item[7].value, item[8].value, item[9].value, item[10].value, item[11].value, item[12].value, item[13].value, item[14].value, item[15].value,
        item[16].value, item[17].value, item[18].value, item[19].value, item[20].value, item[21].value]);
    });

    // 設定樣式
    // headerRow.font = { bold: true };

    // 生成Excel檔案
    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      // 建立檔案名稱
      const fileName = '機台負荷表_' + this.component.dateFormat(moment(), 7) + '.xlsx';

      // 下載Excel檔案
      this.saveAsExcelFile(buffer, fileName);
    });
  
  }

    // 下載Excel檔案
    private saveAsExcelFile(buffer: ArrayBuffer, fileName: string): void {
      console.log(buffer);

      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      FileSaver.saveAs(data, fileName);
    }


  // loadMachineExport() {
  //   // this.message.error('還沒寫完');
  //   // if (this.tbodyList.length < 1) {
  //   //   this.errorMSG("EXCEL 匯出失敗", "請先查詢後再匯出");
  //   //   return;
  //   // }

  //   let title = [];
    
  //   // this.theadList.forEach(item => {
  //   //   const value = item.value;
  //   //   console.log(value);
  //   // });

  //   // console.log(title)
  //   // for (let a of this.theadList) {
  //   //   // title.push([this.theadList[a].value])
  //   // }
  //   // let header = [[this.theadList.value]];
  //   // console.log(this.theadList.value)
  //   var dataLoadMachine = {
  //     data : []
  //   };

  //   for(var i in this.tbodyList) {
  //       var item = this.tbodyList[i];
  //       dataLoadMachine.data.push({
  //           "fcpEdition" : item.fcpVer
  //       });
  //   }

    
  //   // 创建工作簿和工作表
  //   const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    
  //   // 添加合并单元格的定义
  //   const mergeRange = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 0 }} ,
  //                       { s: { r: 1, c: 1 }, e: { r: 2, c: 0 }} ,
  //                       { s: { r: 2, c: 1 }, e: { r: 3, c: 0 }} ,
  //                      ];
    
  //   // 转换合并单元格数据为二维数组
  //   const merges: XLSX.CellAddress[][] = mergeRange.map(range => [
  //     { r: range.s.r, c: range.s.c },
  //     { r: range.e.r, c: range.e.c }
  //   ]);

  //   // 合并列
  //   XLSX.utils.sheet_add_aoa(worksheet, merges, { origin: -1 });

  //   // XLSX.utils.sheet_add_aoa(worksheet,header);
  //   XLSX.utils.sheet_add_json(worksheet, dataLoadMachine.data, { origin: 'A2', skipHeader: true });//origin => started row

  //   const book: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(book, worksheet,'sheet1');
  //   XLSX.writeFile(book, '機台負荷表_'+new Date().toLocaleDateString('sv')+'.xlsx');//filename => Date_
  // }

  // 展開明細第二層
  openDtl(i) {
    this.isVisibleDtl = true ;
    this.loadMachineDtlLoading = true;
    let shopCode = i[0].value;
    let pstMachine = i[2].value;
    let showMonth = i[3].value;
    this.dtlModalTitle = "版次: " + this.fcpVer + "-站別: " + shopCode + "-機台: " + pstMachine + "-交期月份: " + showMonth;

    let obj = { fcpVer: this.fcpVer, shopCode: shopCode, pstMachine: pstMachine, showMonth: showMonth }
    let myObj = this ;
    const dateRegex = /^\d{4}[\/-]\d{2}[\/-]\d{2}$|^\d{4}[\/-]\d{2}[\/-]\d{2}\s\d{2}:\d{2}:\d{2}$/;

    myObj.getPPSService.getR301DtlList(obj).subscribe(res => {
      this.loadMachineDtlLoading = false;
      let result:any = res ;
      if(result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
      } else {
        this.message.error('無資料');
        return;
      }

    },err => {
      this.loadMachineDtlLoading = false ;
      this.message.error('網絡請求失敗');
    })

    // this.message.create("error", title);
  }

  // 展開明細第二層EXCEL匯出
  loadMachineDtlExport() {
    if (this.rowData.length < 1) {
      this.errorMSG("EXCEL 匯出失敗", "請先查詢後再匯出");
      return;
    }
    let header = [['FCP版次', '站別', '現況站別', '銷售區別', '客戶名稱', 'MO','訂單號碼', '訂單項次', '交期', '鋼種', '現況流程', 'FINAL_生產流程', '抽數別', '計畫重量', '訂單長度', '實際長度', 'CYCLE_NO', '合併單號', '投入尺寸', '產出尺寸', '允收截止日', '入庫日的備註', '產品種類']];
    var dataLoadMachineDtl = {
      data : []
    };

    for(var i in this.rowData) {
        var item = this.rowData[i];
        dataLoadMachineDtl.data.push({
            "fcpEdition" : item.fcpEdition,
            "schShopCode" : item.schShopCode,
            "sfcShopCode" : item.sfcShopCode,
            "saleAreaGroup" : item.saleAreaGroup,
            "custAbbreviations" : item.custAbbreviations,
            "idNo" : item.idNo,
            "saleOrder" : item.saleOrder,
            "saleItem" : item.saleItem,
            "dateDeliveryPP" : item.dateDeliveryPP,
            "steelType" : item.steelType,
            "lineupProcess" : item.lineupProcess,
            "finalProcess" : item.finalProcess,
            "scheType" : item.scheType,
            "planWeightI" : item.planWeightI,
            "saleItemLength" : item.saleItemLength,
            "actualLength" : item.actualLength,
            "cycleNo" : item.cycleNo,
            "mergeNo" : item.mergeNo,
            "inputDia" : item.inputDia,
            "outDia" : item.outDia,
            "datePlanInStorage" : item.datePlanInStorage,
            "remarkPlanInStorage" : item.remarkPlanInStorage,
            "kindType" : item.kindType
        });
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet,header);
    XLSX.utils.sheet_add_json(worksheet, dataLoadMachineDtl.data,{ origin: 'A2', skipHeader: true });//origin => started row

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet,'sheet1');
    XLSX.writeFile(book, '機台負荷表明細清單_'+this.component.dateFormat(moment(), 7)+'.xlsx');//filename => Date_
  }

  loadMachineDtlCancel() {
    this.isVisibleDtl = false;
  }

  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }
  
  // Example load data from sever
  onGridReady(params: GridReadyEvent) {
  }

  errorMSG(_title, _context): void {
		this.Modal.error({
			nzTitle: _title,
			nzContent: `${_context}`
	  });
	}



}
