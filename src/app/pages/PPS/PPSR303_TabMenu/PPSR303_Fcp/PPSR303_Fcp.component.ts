import { Component, OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-PPSR303_Fcp',
  templateUrl: './PPSR303_Fcp.component.html',
  styleUrls: ['./PPSR303_Fcp.component.scss'],
  providers:[NzMessageService,NzModalService,DatePipe]
})
export class PPSR303FcpComponent implements OnInit {
  

  FcpEditionList = [];
  displayRowData : data[] = [];
  fcpEdition : string ;
  tooltipShowDelay = 0;
  isLoading = false;
  isShowFCPMo = false;
  spinType = "";
  
  constructor(
    private http: HttpClient,
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
    this.getFcpEdition();
  }
  
  checked = false;
  checkSecond = false;
  columnDefsTab1: ColDef<data>[] = [
    { headerName:'FCP版本',field: 'fcpEdition' , filter: false,width: 150, headerComponent: AGCustomHeaderComponent },
    { headerName:'MO版次',field: 'moEdition' , filter: false,width: 150, headerComponent: AGCustomHeaderComponent },
    { headerName: 'ICP版次' ,field: 'icpEdition' , filter: false,width: 150, headerComponent: AGCustomHeaderComponent },
    { headerName:'MO',field: 'idNo' , filter: false,width: 150, headerComponent: AGCustomHeaderComponent },
    { headerName:'訂單號碼',field: 'saleOrder' , filter: false,width: 140, headerComponent: AGCustomHeaderComponent },
    { headerName:'訂單項次',field: 'saleItem' , filter: false,width: 140, headerComponent: AGCustomHeaderComponent },
    { headerName:'訂單批次', field:'saleLineno', filter:false, width:80, headerComponent: AGCustomHeaderComponent },
    { headerName: 'LOCK_值' ,field: 'lock' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: 'CYCLE_NO' ,field: 'cycleNo' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '合併單號' ,field: 'mergeNo' , filter: false,width: 80, headerComponent: AGCustomHeaderComponent },
    { headerName:'製程碼',field: 'processCode' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'製序', field: "routingSeq", filter :false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'站別',field: 'schShopCode' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '鋼種' ,field: 'steelType' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '現況重量' ,field: 'weight' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '計畫重量' ,field: 'planWeightI' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '上一站製序' ,field: 'priorRoutingSeq' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '下一站站別' ,field: 'nextSchShopCode' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '下一站製序' ,field: 'nextRoutingSeq' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '實際長度' ,field: 'actualLength' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '投入型態' ,field: 'inputType' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '產出型態' ,field: 'outputShape' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '投入尺寸' ,field: 'inputDia' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '產出尺寸' ,field: 'outDia' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '密度' ,field: 'density' , filter: false,width: 80, headerComponent: AGCustomHeaderComponent },
    { headerName: '現況站別' ,field: 'sfcShopCode' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '建立日期' ,field: 'dateCreate' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '生計交期' ,field: 'dateDeliveryPp' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '備註入庫日' ,field: 'datePlanInStorage' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '軋延日期' ,field: 'rollDate' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
	  { headerName:'FINAL_生產流程',field: 'finalProcess' , filter: false,width: 160, headerComponent: AGCustomHeaderComponent },
    { headerName:'現況尺寸',field: 'sfcDia' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '訂單長度' ,field: 'saleItemLength' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName:'現況流程',field: 'lineupProcess' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'銷售區別',field: 'saleAreaGroup' , filter: false,width: 200, headerComponent: AGCustomHeaderComponent },
    { headerName:'客戶名稱',field: 'custAbbreviations' , filter: false,width: 200, headerComponent: AGCustomHeaderComponent },
    { headerName:'TC_溫度', field:'tcTemperature', filter:false, width:90, headerComponent: AGCustomHeaderComponent },
    { headerName: 'TC_頻率' ,field: 'tcFrequence' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: 'BA1_溫度' ,field: 'ba1Temperature' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: 'BA1_頻率' ,field: 'ba1Frequence' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'RF_溫度',field: 'rfTemperature' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'RF_頻率',field: 'rfFrequence' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName:'剩餘工時',field: 'lastWorksHours' , filter: false,width: 90, headerComponent: AGCustomHeaderComponent },
    { headerName: '最早可投入時間' ,field: 'epst' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '最晚須投入時間' ,field: 'lpst' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '投入時間 JIT' ,field: 'jit' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: 'ASAP' ,field: 'asap' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: 'ASAP調整' ,field: 'newAsap' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '最佳機台_mes' ,field: 'bestMachine' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '大調機代碼_最佳機台' ,field: 'status' , filter: false,width: 150, headerComponent: AGCustomHeaderComponent },
    { headerName: '工時_最佳機台' ,field: 'workHours' , filter: false,width: 80, headerComponent: AGCustomHeaderComponent },
    { headerName: '搬移時間' ,field: 'transferTime' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '替代機台1' ,field: 'machine1' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '大調機代碼_替代機台1' ,field: 'status1' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '工時_替代機台1' ,field: 'workHours1' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '搬移時間1' ,field: 'transferTime1' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '替代機台2' ,field: 'machine2' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '大調機代碼_替代機台2' ,field: 'status2' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '工時_替代機台2' ,field: 'workHours2' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '搬移時間2' ,field: 'transferTime2' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '替代機台3' ,field: 'machine3' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '大調機代碼_替代機台3' ,field: 'status3' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '工時_替代機台3' ,field: 'workHours3' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '搬移時間3' ,field: 'transferTime3' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '選定機台' ,field: 'chooseEquipCode' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: 'Campaign_ID' ,field: 'compaignId' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: 'CPST' ,field: 'cpst' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '抽數別' ,field: 'scheType' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
	  { headerName: 'FINAL_MIC_NO' ,field: 'finalMicNo' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: 'SORT群組' ,field: 'sortGroup' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '虛擬分捆註記' ,field: 'prepareDivideId' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '工廠排程的凍結狀態' ,field: 'autoFrozen' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '工廠排程的預計投入時間' ,field: 'planDateI' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '工廠排程的預計產出時間' ,field: 'planDateO' , filter: false,width: 200, headerComponent: AGCustomHeaderComponent },
    { headerName: '工廠排程的排程順序' ,field: 'autoSort' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '委外註記' ,field: 'flagOutsourcing' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '委外回廠時間' ,field: 'dateBackOutsourcing' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '委外出廠時間' ,field: 'dateSendOutsourcing' , filter: false,width: 80, headerComponent: AGCustomHeaderComponent },
    { headerName: '技術指定機台註記' ,field: 'fixedEquipCode' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '產品種類' ,field: 'kindType' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '料號' ,field: 'mtrlNo' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '新的EPST' ,field: 'newEpst' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '新的LPST' ,field: 'newLpst' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
	  { headerName: '新的CPST' ,field: 'newCpst' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '上版FCP_PST' ,field: 'pstRerun' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: 'LINEUP_MIC_NO' ,field: 'lineupMicNo' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '鋼種群組' ,field: 'gradeGroup' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '作業代碼' ,field: 'opCode' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: 'COMBINE註記' ,field: 'combineFlag' , filter: false,width: 200, headerComponent: AGCustomHeaderComponent },
    { headerName: '修正的EPST(X Run)' ,field: 'fixEpst' , filter: false,width: 150, headerComponent: AGCustomHeaderComponent },
    { headerName: '修正後工廠排程的凍結狀態' ,field: 'fixAutoFrozen' , filter: false,width: 300, headerComponent: AGCustomHeaderComponent },
    { headerName: '自訂排序' ,field: 'customSort' , filter: false,width: 100, headerComponent: AGCustomHeaderComponent },
    { headerName: '原始CAMPAIGN_ID' ,field: 'originalCampaignId' , filter: false,width: 80, headerComponent: AGCustomHeaderComponent },
    { headerName: '原始CUSTOM_SORT' ,field: 'originalCustomSort' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '入庫日的備註' ,field: 'remark_planInStorage' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent },
    { headerName: '建立日期' ,field: 'createDate' , filter: false,width: 120, headerComponent: AGCustomHeaderComponent }
  ];

  public defaultColDefTab1: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  public autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };


  getFcpEdition(){
    this.isLoading = true ;
    let myObj = this ;
    myObj.getPPSService.getR303FCPEditionList().subscribe(res => {
    
      let result:any = res;
      if(result.data.length == 0){
        this.errorMSG("錯誤","沒有版次資料");
        return;
      }
      if(result.code == 200){
        this.FcpEditionList = result.data;
        this.fcpEdition = this.FcpEditionList[0];
        this.getR303FcpData(this.fcpEdition);
      } else {
        this.Modal.error({
          nzTitle: "失敗",
          nzContent: `${result.message}`
        });
      }
      this.isLoading = false ;
    },
    error =>{
      this.errorMSG("錯誤","請連繫後端工程師");
    });

  }


  async getR303FcpData(edition : string){
    console.log("getR303FcpData: " + this.fcpEdition)
    let myObj = this ;
    myObj.getPPSService.getR303FCPData(edition).subscribe(res => {
      let result:any = res ;
      this.displayRowData = result.data;
    });
  }


  changeEdition(){
    if(this.fcpEdition != null){
      this.isLoading = true;
      this.checked = false;
      this.checkSecond  = false;
      console.log("changeEdition: " + this.fcpEdition)
      this.getR303FcpData(this.fcpEdition);
    }
  }


  exportExcelTab1(): void {
    this.isLoading = true;
    let header = [];

    var head = [];
    for(var i in this.columnDefsTab1){
      
      head.push(this.columnDefsTab1[i]['headerName']);
    }
    header.push(head);
    var dataReSort = {
      data : []
    };

    for(var i in this.displayRowData) {
      var temp = {}
      for(var j in this.columnDefsTab1){
        var field = this.columnDefsTab1[j]['field']
        temp[field] = this.displayRowData[i][this.columnDefsTab1[j]['field']];
      }
      dataReSort.data.push(temp);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet,header);
    XLSX.utils.sheet_add_json(worksheet,dataReSort.data,{ origin: 'A2', skipHeader: true });//origin => started row

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet,'sheet1');
    XLSX.writeFile(book, moment().format('YYYYMMDDHHmmss') + '_MO異常表_'+this.fcpEdition+ '.xlsx');//filename => Date_
    this.isLoading = false;
    this.Modal.info({
      nzTitle: '提示訊息',
      nzContent: 'excel 匯出完成' ,
      nzOkText:'確認'
    })
  }


  exportFcpExcel() {
    let hostName = window.location.hostname;
    if(hostName === 'localhost') hostName = "ys-ppsapt01.walsin.corp" ;
    let fcpEdition = this.fcpEdition;
    let queryUrl = `http://${hostName}:8080/pps_FCP/rest/run/downloadErrorMo?FCP_EDITION=${fcpEdition}`;
  
    this.http.get(queryUrl, { responseType: 'arraybuffer' }).subscribe(
      (res) => {
        // 在這裡處理請求成功的情況
        this.Modal.info({
          nzTitle: '提示訊息',
          nzContent: 'excel 匯出完成' ,
          nzOkText:'確認'
        })

        // 例如，你可以創建一個 Blob 並啟動檔案下載
        const blob = new Blob([res], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `FCP異常MO_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        // 在這裡處理請求失敗的情況
        this.Modal.error({
          nzTitle: "失敗",
          nzContent: `${this.fcpEdition}， 獲取資料失敗，${error}`
        });
      }
    );
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
