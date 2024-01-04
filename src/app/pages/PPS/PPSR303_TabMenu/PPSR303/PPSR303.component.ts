import { Component, OnInit  } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService,NzModalRef} from "ng-zorro-antd/modal"
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import zh from '@angular/common/locales/zh';
import { AGCustomHeaderComponent } from "src/app/shared/ag-component/ag-custom-header-component";
registerLocaleData(zh);
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';

interface data {

}


@Component({
  selector: 'app-PPSR303',
  templateUrl: './PPSR303.component.html',
  styleUrls: ['./PPSR303.component.scss'],
  providers:[NzMessageService,NzModalService,DatePipe]
})
export class PPSR303Component implements OnInit {
// 测试提交
  constructor(
    private nzInputModule:NzInputModule ,
    private  NzTimePickerModule:NzTimePickerModule,
    private  nzDatePickerModule:NzDatePickerModule,
    private datePipe : DatePipe,
    private getPPSService: PPSService,
    private excelService: ExcelService,
    private message:NzMessageService ,
    private Modal: NzModalService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.getAllEdition();
    
  }
  
  checked = false;
  checkSecond = false;
  columnDefsTab1: ColDef<data>[] = [
    { headerName:'ID_NO',field: 'idNo' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName:'訂單號碼',field: 'saleOrder' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '訂單項次' ,field: 'saleItem' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName:'訂單批次',field: 'saleLineno' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName:'FINAL_MIC_NO',field: 'finalMicNo' , filter: false,width: 140, headerComponent: AGCustomHeaderComponent },
    { headerName:'LINEUP_MIC_NO',field: 'lineupMicNo' , filter: false,width: 140, headerComponent: AGCustomHeaderComponent },
    { headerName:'製程碼', field:'processCode', filter:false, width:80, headerComponent: AGCustomHeaderComponent },
    { headerName: '製程順序' ,field: 'routingSeq' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '下一站的製程順序' ,field: 'nextRoutingSeq' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '站別碼' ,field: 'shopCodeSche' , filter: false,width: 80, headerComponent: AGCustomHeaderComponent },
    { headerName:'現況流程',field: 'lineupProcess' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'重量', field: "weight", filter :false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'現況重量',field: 'planWeightI' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '合併單號' ,field: 'mergeNo' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '訂單長度' ,field: 'saleOrderLength' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '實際長度' ,field: 'actualLength' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '下站別' ,field: 'nextShopCode' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: 'CYCLE_NO' ,field: 'ppCycleNo' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '鋼種' ,field: 'steelType' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: 'LOCK值' ,field: 'lock' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '投入型態' ,field: 'inputShape' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '產出型態' ,field: 'outputShape' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '投入尺寸' ,field: 'inputDiaMax' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '產出尺寸' ,field: 'turnDiaMax' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '密度' ,field: 'density' , filter: false,width: 80, headerComponent: AGCustomHeaderComponent },
    { headerName: '軋延計劃日' ,field: 'millDate' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '生計交期' ,field: 'dateDeliveryPp' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '最佳機台' ,field: 'optimalEquipCode' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '選定機台' ,field: 'chooseEquipCode' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '備註入庫日' ,field: 'remarkWarehousingDate' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
	  { headerName:'FINAL_生產流程',field: 'finalProcess' , filter: false,width: 160, headerComponent: AGCustomHeaderComponent },
    { headerName:'現況尺寸',field: 'sfcDia' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '現況站別' ,field: 'sfcShopCode' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName:'銷售區別',field: 'saleAreaGroup' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'客戶名稱',field: 'custAbbreviations' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName:'TC_溫度',field: 'tcTemperature' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'TC_頻率', field:'tcFrequence', filter:false, width:90, headerComponent: AGCustomHeaderComponent },
    { headerName: 'BA1_溫度' ,field: 'ba1Temperature' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: 'BA1_頻率' ,field: 'ba1Frequence' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: 'RF_溫度' ,field: 'rfTemperature' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'RF_頻率',field: 'rfFrequence' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'抽數別',field: 'scheType' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'當站工時',field: 'workingHours' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '最早可投入時間' ,field: 'epst' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '最晚須投入時間' ,field: 'lpst' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '投入時間 JIT' ,field: 'jit' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: 'ASAP' ,field: 'asap' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: 'CPST' ,field: 'cpst' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '建立日期' ,field: 'dateCreate' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '版次' ,field: 'edition' , filter: false,width: 150, headerComponent: AGCustomHeaderComponent },
    { headerName: '上一站的製程順序' ,field: 'priorRoutingSeq' , filter: false,width: 80, headerComponent: AGCustomHeaderComponent },
    { headerName: '儲區' ,field: 'loc' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '倉別' ,field: 'house' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: 'COMPAIGN_ID' ,field: 'compaignId' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '虛擬分捆註記' ,field: 'prepareDivideId' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '工廠排程的凍結狀態' ,field: 'autoFrozen' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '工廠排程的預計投入時間' ,field: 'planDateI' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '工廠排程的預計產出時間' ,field: 'planDateO' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '工廠排程的排程順序' ,field: 'autoSort' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: 'ASAP調整日期' ,field: 'newasap' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
	  { headerName: '委外' ,field: 'flagOutsourcing' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '委外回廠時間' ,field: 'dateBackOutsourcing' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '委外出廠時間' ,field: 'dateSendOutsourcing' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '技術指定機台' ,field: 'fixenEquipCode' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '產品種類' ,field: 'kindType' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '料號' ,field: 'mtrlNo' , filter: false,width: 200, headerComponent: AGCustomHeaderComponent },
    { headerName: '違反事項' ,field: 'violation' , filter: false,width: 150, headerComponent: AGCustomHeaderComponent },
    { headerName: '違反事項_已解決' ,field: 'resetViolation' , filter: false,width: 300, headerComponent: AGCustomHeaderComponent },
    { headerName: '作業代碼' ,field: 'opCode' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '判斷 405站是否做過C2/C3F' ,field: 'flag405Temp' , filter: false,width: 80, headerComponent: AGCustomHeaderComponent },
    { headerName: '入庫日備註' ,field: 'remarkPlanInStorage' , filter: false,width: 120 }
    ];

  columnDefsTab2: ColDef<data>[] = [
      { headerName: '版次' ,field: 'edition' , filter: false,width: 300, headerComponent: AGCustomHeaderComponent },
      { headerName: 'ID號碼' ,field: 'idNo' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '站別碼' ,field: 'shopCodeSche' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '機台碼' ,field: 'equipCode' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '鋼種' ,field: 'steelType' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '製程順序' ,field: 'routingSeq' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '產出尺寸' ,field: 'turnDiaMax' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '實際長度' ,field: 'actualLength' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '支數' ,field: 'pieceCount' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '減面率' ,field: 'reductionRate' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '機台群組' ,field: 'equipGroup' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '鋼種群組' ,field: 'gradeGroup' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '線速分類' ,field: 'speedType' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '線速' ,field: 'wireSpeed' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '研磨道次' ,field: 'gringdingPass' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '非線速-加工時間' ,field: 'processingTime' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '總生產長度' ,field: 'ttlLength' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '大調機代碼' ,field: 'bigAdjustCode' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '搬運時間' ,field: 'transferTime' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '其他整備時間' ,field: 'otherTime' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '冷卻時間' ,field: 'coolingTime' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '產出型態' ,field: 'outputShape' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '當站工時' ,field: 'workingHours' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '優先順序' ,field: 'priority' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '最早可投入時間' ,field: 'epst' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '最晚須投入時間' ,field: 'lpst' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '投入時間' ,field: 'jit' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: 'ASAP' ,field: 'asap' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: 'CPST' ,field: 'cpst' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '建立日期' ,field: 'dateCreate' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '違反事項' ,field: 'violation' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: 'compaign Id' ,field: 'compaignId' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: 'ASAP調整日期' ,field: 'newAsap' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
      { headerName: '違反事項_已解決' ,field: 'resetViolation' , filter: false,width: 300, headerComponent: AGCustomHeaderComponent },
      { headerName: '判斷 405站是否做過C2/C3F' ,field: 'flag405Temp' , filter: false,width: 120}
  ]
  public defaultColDefTab1: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  public autoGroupColumnDef: ColDef = {
    // flex: 1,
    // resizable: true,
    minWidth: 200,
  };

  // infinite scroll
  // public rowBuffer = 0;
  // public rowSelection: 'single' | 'multiple' = 'multiple';
  // public rowModelType: RowModelType = 'infinite';
  // public cacheBlockSize = 100;
  // public cacheOverflowSize = 2;
  // public maxConcurrentDatasourceRequests = 1;
  // public infiniteInitialRowCount = 1000;
  // public maxBlocksInCache = 10;

  displayRowData : data[] = [];
  displayTable2Data = [];
  rowDataTab1 : data[] = [];
  rowDataTab2 : data[] = [];
  rowDataTab4 : data[] = [];
  editionList = [];
  edition : string ;
  tooltipShowDelay = 0;
  isLoading = false;
  isShowTable2 = false;
  spinType = "";
  isError = false;
  secondIdNo = '';

  FCP_HEADER = [{field : "fcpEdition" ,headerName : "FCP版本 "},
                {field : "moEdition" ,headerName : " MO版次"},
                {field : "icpEdition" ,headerName : "ICP版次 "},
                {field : "idNo" ,headerName : "MO "},
                {field : "saleOrder" ,headerName : "訂單號碼 "},
                {field : "saleItem" ,headerName : "訂單項次 "},
                {field : "saleLineno" ,headerName : "訂單批次 "},
                {field : "lock" ,headerName : "LOCK_值 "},
                {field : "cycleNo" ,headerName : "CYCLE_NO "},
                {field : "mergeNo" ,headerName : "合併單號 "},
                {field : "processCode" ,headerName : "製程碼 "},
                {field : "routingSeq" ,headerName : "製序 "},
                {field : "schShopCode" ,headerName : "站別 "},
                {field : "steelType" ,headerName : "鋼種 "},
                {field : "weight" ,headerName : "現況重量 "},
                {field : "planWeightI" ,headerName : "計畫重量 "},
                {field : "priorRoutingSeq" ,headerName : "上一站製序 "},
                {field : "nextSchShopCode" ,headerName : "下一站站別 "},
                {field : "nextRoutingSeq" ,headerName : "下一站製序 "},
                {field : "actualLength" ,headerName : "實際長度 "},
                {field : "inputType" ,headerName : "投入型態 "},
                {field : "outputShape" ,headerName : "產出型態 "},
                {field : "inputDia" ,headerName : "投入尺寸 "},
                {field : "outDia" ,headerName : "產出尺寸 "},
                {field : "density" ,headerName : " 密度"},
                {field : "sfcShopCode" ,headerName : "現況站別 "},
                {field : "dateCreate" ,headerName : " 建立日期"},
                {field : "dateDeliveryPp" ,headerName : "生計交期 "},
                {field : "datePlanInStorage" ,headerName : " 備註入庫日"},
                {field : "rollDate" ,headerName : "軋延日期 "},
                {field : "finalProcess" ,headerName : "生產流程 "},
                {field : "sfcDia" ,headerName : "現況尺寸 "},
                {field : "saleItemLength" ,headerName : "訂單長度 "},
                {field : "lineupProcess" ,headerName : "現況流程 "},
                {field : "saleAreaGroup" ,headerName : "銷售區別 "},
                {field : "custAbbreviations" ,headerName : "客戶名稱 "},
                {field : "tcTemperature" ,headerName : "TC_溫度 "},
                {field : "tcFrequence" ,headerName : "TC_頻率 "},
                {field : "ba1Temperature" ,headerName : "BA1_溫度 "},
                {field : "ba1Frequence" ,headerName : "BA1_頻率 "},
                {field : "rfTemperature" ,headerName : "RF_溫度 "},
                {field : "rfFrequence" ,headerName : "RF_頻率 "},
                {field : "lastWorksHours" ,headerName : "剩餘工時 "},
                {field : "epst" ,headerName : "EPST "},
                {field : "lpst" ,headerName : "LPST "},
                {field : "asap" ,headerName : "ASAP "},
                {field : "jit" ,headerName : "JIT "},
                {field : "newAsap" ,headerName : "ASAP調整 "},
                {field : "bestMachine" ,headerName : "最佳機台_mes "},
                {field : "status" ,headerName : "大調機代碼_最佳機台 "},
                {field : "workHours" ,headerName : "工時_最佳機台 "},
                {field : "transferTime" ,headerName : "搬移時間 "},
                {field : "machine1" ,headerName : "替代機台1 "},
                {field : "status1" ,headerName : "大調機代碼_替代機台1 "},
                {field : "workHours1" ,headerName : "工時_替代機台1 "},
                {field : "transferTime1" ,headerName : "搬移時間1 "},
                {field : "machine2" ,headerName : "替代機台2 "},
                {field : "status2" ,headerName : "大調機代碼_替代機台2 "},
                {field : "workHours2" ,headerName : "工時_替代機台2 "},
                {field : "transferTime2" ,headerName : "搬移時間2 "},
                {field : "machine3" ,headerName : "替代機台3 "},
                {field : "status3" ,headerName : "大調機代碼_替代機台3 "},
                {field : "workHours3" ,headerName : "工時_替代機台3 "},
                {field : "transferTime3" ,headerName : "搬移時間3 "},
                {field : "chooseEquipCode" ,headerName : "選定機台 "},
                {field : "compaignId" ,headerName : "Campaign_ID "},
                {field : "cpst" ,headerName : "CPST_min "},
                {field : "scheType" ,headerName : "抽數別 "},
                {field : "finalMicNo" ,headerName : "FINAL_MIC_NO "},
                {field : "sortGroup" ,headerName : "SORT群組 "},
                {field : "prepareDivideId" ,headerName : "虛擬分捆註記 "},
                {field : "autoFrozen" ,headerName : "工廠排程的凍結狀態 "},
                {field : "planDateI" ,headerName : "工廠排程的預計投入時間 "},
                {field : "planDateO" ,headerName : "工廠排程的預計產出時間 "},
                {field : "autoSort" ,headerName : "工廠排程的排程順序 "},
                {field : "flagOutsourcing" ,headerName : "委外註記 "},
                {field : "dateBackOutsourcing" ,headerName : "委外回廠時間 "},
                {field : "dateSendOutsourcing" ,headerName : "委外出廠時間 "},
                {field : "fixedEquipCode" ,headerName : "技術指定機台註記 "},
                {field : "kindType" ,headerName : "產品種類 "},
                {field : "mtrlNo" ,headerName : "料號 "},
                {field : "newEpst" ,headerName : "新的EPST "},
                {field : "newLpst" ,headerName : "新的LPST "},
                {field : "newCpst" ,headerName : "新的CPST "},
                {field : "pstRerun" ,headerName : "上版FCP_PST "},
                {field : "lineupMicNo" ,headerName : "LINEUP_MIC_NO "},
                {field : "gradeGroup" ,headerName : "鋼種群組 "},
                {field : "opCode" ,headerName : "作業代碼 "},
                {field : "combineFlag" ,headerName : "COMBINE註記 "},
                {field : "fixEpst" ,headerName : "修正的EPST(X Run) "},
                {field : "fixAutoFrozen" ,headerName : "修正後工廠排程的凍結狀態 "},
                {field : "customSort" ,headerName : "自訂排序 "},
                {field : "originalCampaignId" ,headerName : "原始CAMPAIGN ID "},
                {field : "originalCustomSort" ,headerName : "原始CUSTOM_SORT "},
                {field : "remark_planInStorage" ,headerName : "入庫日的備註 "},
                {field : "createDate" ,headerName : "建立日期 "}]

  getAllEdition(){
    this.isLoading = true ;

    let myObj = this ;
    myObj.getPPSService.getR303EditionList().subscribe(async res => {
      let result:any = res ;
      
      this.edition = result.data[0];
      this.editionList = result.data;

      this.getR303Data(this.edition);

    });
  }


  async getR303Data(edition : string){
    let myObj = this ;
    myObj.getPPSService.getR303AllFirstData(edition).subscribe(res => {
      let result:any = res ;


      this.rowDataTab1 = result.data;

      console.log(this.rowDataTab1)
      if(this.rowDataTab1 !=null)
        this.displayRowData = this.displayRowData.concat(this.rowDataTab1);
        this.getR303ErrorData(this.edition);
        
    });
  }

  async getR303ErrorData(edition : string){
    let myObj = this ;
    myObj.getPPSService.getR303AllFirstErrorData(edition).subscribe(res => {
      let result:any = res ;
      
      this.rowDataTab4 = result.data;
      console.log(this.rowDataTab4);
      if(this.rowDataTab4 !=null)
        this.displayRowData = this.displayRowData.concat(this.rowDataTab4);

        this.isLoading = false;
    });
  }

  changeEdition(){
    
    if(this.edition != null){
      this.isLoading = true;
      this.checked = false;
      this.checkSecond  = false;
      this.getR303Data(this.edition);
    }
    
  }

    // Example of consuming Grid Event
    onCellClicked( e: CellClickedEvent): void {
      console.log('cellClicked', e.data.idNo);

      this.isLoading = true ;

      if(this.rowDataTab4 !=null &&this.rowDataTab4.some(element => element['idNo'] == e.data.idNo))
        this.isError = true;

      this.secondIdNo = e.data.idNo;

      let myObj = this ;
      console.log(e.data)
      myObj.getPPSService.getR303SecondData(e.data.idNo ,this.edition, this.isError,e.data.routingSeq).subscribe(res => {
        let result:any = res ;
        

        this.rowDataTab2 = result.data;

        
        this.displayTable2Data = this.rowDataTab2;
        this.isLoading = false;
        this.isShowTable2 = true;
      });

    }

    onlyShowError(){

      console.log('change show error');

      this.isLoading = true;

      if(this.checked){
        this.displayRowData = [];


        this.displayRowData = this.rowDataTab4;
  
        this.displayRowData = this.displayRowData.concat(this.rowDataTab1.filter(element => element['violation'] != null));
        
      }else{
        this.displayRowData = [];

        if(this.rowDataTab1 !=null)
          this.displayRowData = this.displayRowData.concat(this.rowDataTab1);
        if(this.rowDataTab4 !=null)
          this.displayRowData = this.displayRowData.concat(this.rowDataTab4);
      }
      this.isLoading = false;
    }

    onlyShowErrorSecond(){

      console.log('change show second error');

      this.isLoading = true;

      if(this.checkSecond){
        this.displayTable2Data = [];

  
        this.displayTable2Data = this.displayTable2Data.concat(this.rowDataTab2.filter(element => element['violation'] != null));
        
      }else{
        this.displayTable2Data = [];

        if(this.rowDataTab2 !=null)
          this.displayTable2Data = this.rowDataTab2;
        
      }
      this.isLoading = false;
    }
    handleOk(): void {
      console.log('Button ok clicked!');
      this.isShowTable2 = false;
    }
  
    handleCancel(): void {
      console.log('Button cancel clicked!');
      this.isShowTable2 = false;
      this.checkSecond = false;
    }

    exportExcelTab1(): void {
      
      this.isLoading = true;
      let header = [];

      var head = [];
      for(var i in this.columnDefsTab1){
        
        head.push(this.columnDefsTab1[i]['headerName']);
      }
      header.push(head);
      console.log(header);
      var dataReSort = {
        data : []
      };
  
      for(var i in this.displayRowData) {
        var temp = {}
        for(var j in this.columnDefsTab1){
          
          var field = this.columnDefsTab1[j]['field']
          temp[field] = this.displayRowData[i][this.columnDefsTab1[j]['field']];
          
          
        }
        console.log(temp)
        dataReSort.data.push(temp);

      }
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.sheet_add_aoa(worksheet,header);
      XLSX.utils.sheet_add_json(worksheet,dataReSort.data,{ origin: 'A2', skipHeader: true });//origin => started row
  
      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet,'sheet1');
      XLSX.writeFile(book, moment().format('YYYYMMDDHHmmss') + '_MO異常表_' + this.edition+ '.xlsx');//filename => Date_
      this.isLoading = false;
      this.Modal.info({
        nzTitle: '提示訊息',
        nzContent: 'excel 匯出完成' ,
        nzOkText:'確認'
      })

    }

    exportExcelTab2(): void {
      
      this.isLoading = true;
      let header = [];

      var head = []
      for(var i in this.columnDefsTab2){
        
        head.push(this.columnDefsTab2[i]['headerName']);
      }
      header.push(head);
      console.log(head);
      var dataReSort = {
        data : []
      };
  
      for(var i in this.displayTable2Data) {
        var temp = {}
        for(var j in this.columnDefsTab2){
          
          var field = this.columnDefsTab2[j]['field']
          temp[field] = this.displayTable2Data[i][this.columnDefsTab2[j]['field']];
          
          
        }
       
        dataReSort.data.push(temp);

      }
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.sheet_add_aoa(worksheet,header);
      XLSX.utils.sheet_add_json(worksheet,dataReSort.data,{ origin: 'A2', skipHeader: true });//origin => started row
  
      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet,'sheet1');
      XLSX.writeFile(book, moment().format('YYYYMMDDHHmmss') + '_MO異常表 _ '+ this.secondIdNo +'.xlsx');//filename => Date_
      this.isLoading = false;
      this.Modal.info({
        nzTitle: '提示訊息',
        nzContent: 'excel 匯出完成' ,
        nzOkText:'確認'
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
}
