import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ExcelService } from 'src/app/services/common/excel.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { ColGroupDef, ColDef, ColumnApi, GridApi, GridReadyEvent, ICellEditorParams, ICellRendererParams, ValueFormatterParams, ValueParserParams, Column } from 'ag-grid-community';
import { AGCustomHeaderComponent } from "src/app/shared/ag-component/ag-custom-header-component";
import { AppComponent } from 'src/app/app.component';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AGHeaderCommonParams, AGHeaderParams } from 'src/app/shared/ag-component/types';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';



@Component({
  selector: 'app-PPSI206',
  templateUrl: './PPSI206_RES.component.html',
  styleUrls: ['./PPSI206_RES.component.scss'],
  providers: [NzMessageService],
})
export class PPSI206RESComponent implements OnInit  {
  
  rowData: data[] = [];
  tbppsm041 = [];
  loading = false;

  agCustomHeaderParams : AGHeaderParams = {isMenuShow: true,}
  agCustomHeaderCommonParams : AGHeaderCommonParams = {agName: 'AGName1' , isSave:true ,path: this.router.url  }
  gridOptions = {
    defaultColDef: {
      sortable: false,
      resizable: true,
      filter: true,
      suppressMovable: true
    },
    api: null,
    agCustomHeaderParams : {
      agName: 'AGName1' , // AG 表名
      isSave:true ,
      path: this.router.url ,
    },
  };

  constructor(
    private PPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private appComponent: AppComponent,
    private router: Router,
    private systemService : SYSTEMService,
  ) {
    this.i18n.setLocale(zh_TW);
  }
  
  ngOnInit(): void {
    this.getTbppsm041();
    this.getDbCloumn();
  }

  columnDefs: ColDef[] = [
    {
      width: 130,
      headerName: '訂單編號',
      field: 'saleOrder',
      headerComponent: AGCustomHeaderComponent,
      headerComponentParams:this.agCustomHeaderParams
    },
    {
      width: 110,
      headerName: '訂單項次',
      field: 'saleItem',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'ID_NO',
      field: 'idNo',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '訂單尺寸',
      field: 'saleOrderDia',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 2).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'MIC_NO',
      field: 'micNo',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 150,
      headerName: 'CYCLE_NO',
      field: 'cycleNo',
      cellRenderer: (params) => {
        return this.appComponent.dateObjFormat(params.value, 8);
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 150,
      headerName: '生計交期',
      field: 'dateDeliveryPp',
      cellRenderer: (params) => {
        return this.appComponent.dateObjFormat(params.value, 2);
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '計畫重量',
      field: 'planWeightI',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 0).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '訂單長度',
      field: 'saleOrderLenght',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 0).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '軋延尺寸',
      field: 'millDia',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 0).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '客戶名稱',
      field: 'custAbbreviations',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '銷售區別',
      field: 'saleAreaGroup',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '料號',
      field: 'mtrlNo',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '鋼種',
      field: 'steelType',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '合併單號',
      field: 'megerNo',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'LOCK值',
      field: 'ppBlock',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '允收截止日',
      field: 'remarkWarehousingDate',
      cellRenderer: (params) => {
        return this.appComponent.dateObjFormat(params.value, 1);
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '入庫日的備註',
      field: 'remarkPlanInStorage',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'MIC_NO',
      field: 'micNo',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'MILL產出日期',
      field: 'millDateO',
      cellRenderer: (params) => {
        return this.appComponent.dateObjFormat(params.value, 1);
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'MILL開始日期',
      field: 'millDateS',
      cellRenderer: (params) => {
        return this.appComponent.dateObjFormat(params.value, 1);
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'ROUTING_SEQ',
      field: 'routingSeq',
      headerComponent: AGCustomHeaderComponent
    },    
    {
      width: 110,
      headerName: '站別',
      field: 'shopCode',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '機台',
      field: 'equipCode',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '下一站站別',
      field: 'nextShopCode',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '下一機台',
      field: 'nextEquipCode',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '現況流程(LINEUP)',
      field: 'lineupProcess',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'FINAL生產流程',
      field: 'finalProcess',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '製程碼',
      field: 'processCode',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'LINEUP_MIC_NO',
      field: 'lineupMicNo',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'FINAL_MIC_NO',
      field: 'finalMicNo',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '現況長度',
      field: 'sfcLenght',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 0).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '投入尺寸',
      field: 'inputDia',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 2).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '產出尺寸',
      field: 'outputDia',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 2).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '投入型態',
      field: 'inputShape',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '產出型態',
      field: 'outputShape',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '下站製程順序',
      field: 'nextRoutingSeq',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '前站製程順序',
      field: 'priorRoutingSeq',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'TC_溫度',
      field: 'tcTemperature',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 0).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'TC_頻率',
      field: 'tcFrequence',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 0).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'BA1_溫度',
      field: 'ba1Temperature',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 0).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'BA1_頻率',
      field: 'ba1Frequence',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 0).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '作業代碼',
      field: 'opCode',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '產品種類',
      field: 'kindType',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '抽數別',
      field: 'scheType',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '密度',
      field: 'density',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 2).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 100,
      headerName: 'SEQ_NO',
      field: 'seqNo',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '產率',
      field: 'yield',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 2).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '工廠排程的預計投入時間',
      field: 'planDateI',
      cellRenderer: (params) => {
        return this.appComponent.dateObjFormat(params.value, 1);
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '工廠排程的預計產出時間',
      field: 'planDateO',
      cellRenderer: (params) => {
        return this.appComponent.dateObjFormat(params.value, 1);
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '工廠排程的排程順序',
      field: 'autoSort',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '排程凍結',
      field: 'autoFrozen',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '固定機台',
      field: 'fixcedEquipCode',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '冷抽數',
      field: 'scheTyped',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 2).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'D製程順序',
      field: 'upDRoutingSeq',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '最大冷抽數',
      field: 'maxCoolDrawn',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 2).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '委外代工機台',
      field: 'outsourcing',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '委外代工日',
      field: 'dateSendOutsourcing',
      cellRenderer: (params) => {
        return this.appComponent.dateObjFormat(params.value, 1);
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '委外代工回廠日',
      field: 'dateBackOutsourcing',
      cellRenderer: (params) => {
        return this.appComponent.dateObjFormat(params.value, 1);
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '委外代工註記',
      field: 'falgOutsourcing',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '軋延日期',
      field: 'millDate',
      cellRenderer: (params) => {
        return this.appComponent.dateObjFormat(params.value, 2);
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '重量',
      field: 'resWeight',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 0).toString();
        }else{
          return params.value         
        }
      },      
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '軋延重量',
      field: 'rollWe',
      cellRenderer: (params) => {
        if(params.value){
          return this.appComponent.toThousandNumber(params.value, 0).toString();
        }else{
          return params.value         
        }
      },
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'FLAG_405_TEMP',
      field: 'flag405Temp',
      headerComponent: AGCustomHeaderComponent
    }
  ];

  getDbCloumn(){
    this.systemService.getHeaderComponentStatus(this.agCustomHeaderCommonParams).subscribe(res=>{
      let result:any = res ;
      if(result.code === 200) {
        console.log(result) ;
        if (result.data.length > 0) {
          //拿到DB數據 ，複製到靜態數據
          this.columnDefs.forEach((item)=>{
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
          this.columnDefs.sort((a, b) => (a.sortIndex < b.sortIndex ? -1 : 1));
          console.log()
          this.gridOptions.api.setColumnDefs(this.columnDefs) ;   
        }
      } else {
        this.message.error("load error")
      }
    });
  }

  excelExport() {

    let appComponent = this.appComponent;
    let exportData = [];
    let dateFieldArr = [
      "dateDeliveryPp",
      "remarkWarehousingDate",
      "millDateO",
      "millDateS",
      "planDateI",
      "planDateO",
      "dateSendOutsourcing",
      "dateBackOutsourcing",
      "millDate",
      "dateUpdate"
    ]
    this.PPSService.getTbppsm041("YS").subscribe((res) => {
      
      let result: any = res;
      if (result.data && result.data.length > 0) {
        if (result.data[0]) {
          for (var i = 0; i <= result.data.length; i++) {
            var element = result.data[i];
            if (element) {
              var obj = {};
              this.columnDefs.forEach(function(temp){
                if(dateFieldArr.includes(temp['field'])){
                  obj[temp['headerName']] =  appComponent.dateObjFormat(element[temp['field']], 2);
                }else{
                  obj[temp['headerName']] = element[temp['field']]
                }
              });
              exportData.push(obj);
            }
          }
        } else {
          this.rowData = [];
        }
      }

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '虛擬訂單結果')
      XLSX.writeFile(wb, ExcelService.toExportFileName("虛擬訂單結果"));

    });

  }

  getTbppsm041() {
    this.loading = true;
    this.PPSService.getTbppsm041("YS").subscribe((res) => {
      let result: any = res;
      this.loading = false;
      if (result.data && result.data.length > 0) {
        if (result.data[0]) {
          this.rowData = result.data.map(
            (itemData) => itemData as data
          ) as data[];
        } else {
          this.rowData = [];
        }
      } else {
        this.message.error('無資料');
        return;
      }
    });
  }

  formatDataForExcel(_displayData) {
    console.log('_displayData');
    let excelData = [];
    for (let item of _displayData) {
      let obj = {};
      _.extend(obj, {
        schShopCode: _.get(item, 'schShopCode'),
        equipCode: _.get(item, 'equipCode'),
        cumsumType: _.get(item, 'cumsumType'),
        accumulation: _.get(item, 'accumulation'),
        dateLimit: _.get(item, 'dateLimit'),
        useFlag: _.get(item, 'useFlag'),
      });
      excelData.push(obj);
    }
    return excelData;
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

  

}

interface data {
  id: string;
  plantCode: string;
  plant: string;
  saleOrder: string;
  saleItem: string;
  idNo: string;
  resWeight: number;
  rollWe: number;
  steelType: string;
  saleOrderDia: number;
  micNo: string;
  mergeNo: string;
  cycleNo: string;
  ppBlock: string;
  dateDeliveryPp: Date;
  saleOrderLength: number;
  millDia: number;
  custAbbreviations: string;
  mtrlNo: string;
  density: number;
  saleAreaGroup: string;
  remarkWarehousingDate: Date;
  remarkPlanInStorage: string;
  seqNo: string;
  millDateO: Date;
  millDateS: Date;
  routingSeq: string;
  inputShape: string;
  outputShape: string;
  shopCode: string;
  equipCode: string;
  nextShopCode: string;
  nextEquipCode: string;
  lineupProcess: string;
  finalProcess: string;
  processCode: string;
  planWeightI: number;
  yield: number;
  lineupMicNo: string;
  finalMicNo: string;
  planDateI: Date;
  planDateO: Date;
  autoSort: number;
  autoFrozen: string;
  fixedEquipCode: string;
  sfcLength: number;
  inputDia: number;
  outputDia: number;
  nextRoutingSeq: string;
  priorRoutingSeq: string;
  scheTyped: number;
  upDRoutingSeq: string;
  maxCoolDrawn: number;
  outsourcing: string;
  dateSendOutsourcing: Date;
  dateBackOutsourcing: Date;
  flagOutsourcing: string;
  tcTemperature: number;
  tcFrequence: number;
  ba1Temperature: number;
  ba1Frequence: number;
  rfTemperature: number;
  opCode: string;
  kindType: string;
  scheType: string;
  millDate: Date;
  flag405Temp: string;
  userCreate:String;
  dateCreate:Date;
}
