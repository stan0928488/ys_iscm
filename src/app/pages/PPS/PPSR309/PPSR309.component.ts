import { Component, AfterViewInit, OnInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { zh_TW, NzI18nService } from "ng-zorro-antd/i18n"
import { NzModalService } from "ng-zorro-antd/modal"
import { ExcelService } from "src/app/services/common/excel.service";
import { CellClickedEvent, ColDef, GridReadyEvent, PreConstruct } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-PPSR309',
  templateUrl: './PPSR309.component.html',
  styleUrls: ['./PPSR309.component.scss'],
  providers:[NzMessageService]
})
export class PPSR309Component implements OnInit {

  isSpinning = false;

  USERNAME;
  PLANT_CODE;

  constructor(
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private excelService: ExcelService,
    private message: NzMessageService
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }
  ngOnInit(): void {
    this.getDataList();
  }

  gridOptions = {
    defaultColDef: {
        editable: false,
        enableRowGroup: false,
        enablePivot: false,
        enableValue: false,
        sortable: false,
        resizable: true,
        filter: true
    }
  };

  columnDefs: ColDef<data>[] = [
    { headerName: 'MO版本',field: "moEdition" , filter: false,width: 100 },
    { headerName: '廠區別',field: "plantCode" , filter: false,width: 100 },
    { headerName: '來源',field: "source" , filter: false,width: 100 },
    { headerName: '區別',field: "areaGroup" , filter: false,width: 100 },
    { headerName: '客戶簡稱',field: "custAbbreviations" , filter: false,width: 100 },
    { headerName: '業務員',field: "sales" , filter: false,width: 100 },
    { headerName: 'MO',field: "idNo" , filter: false,width: 100 },
    { headerName: '訂單編號',field: "saleOrder" , filter: false,width: 100 },
    { headerName: '訂單項次',field: "saleItem" , filter: false,width: 100 },
    { headerName: '生計交期',field: "dateDeliveryPp" , filter: false,width: 100 },
    { headerName: '現況重量',field: "weight" , filter: false,width: 100 },
    { headerName: 'PST',field: "pst" , filter: false,width: 100 },
    { headerName: '缺項群組',field: "missingGroup" , filter: false,width: 100 },
    { headerName: '允收截止日',field: "datePlanInStorage" , filter: false,width: 100 },
    { headerName: '可接受交期',field: "dateAcceptable" , filter: false,width: 100 },
    { headerName: '區別修正',field: "fixAreaGroup" , filter: false,width: 100 },
    { headerName: '異型棒',field: "isProfield" , filter: false,width: 100 },
    { headerName: '大棒',field: "isBigStick" , filter: false,width: 100 },
    { headerName: '是否符合允收截止日',field: "isDatePlanInStorage" , filter: false,width: 100 },
    { headerName: '是否符合可接受交期',field: "isDateAcceptable" , filter: false,width: 100 },
    { headerName: '是否缺項',field: "isMissingGroup" , filter: false,width: 100 },
    { headerName: '月底是否可足項',field: "isEnoughBeforeEndOfMonth" , filter: false,width: 100 },
    { headerName: '建立日期',field: "dateCreate" , filter: false,width: 100 },
    { headerName: '建立者',field: "userCreate" , filter: false,width: 100 },
    { headerName: '異動日期',field: "dateUpdate" , filter: false,width: 100 },
    { headerName: '異動者',field: "userUpdate" , filter: false,width: 100 }
  ]

  rowData: data[] = [];    

  getDataList(){

    let postData = {};
    this.PPSService.getR308Data(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
      } else {
        this.message.error('無資料');
        return;
      }

    },err => {
      this.message.error('網絡請求失敗');
    })


  }

  dataConvert() {
    
    this.isSpinning = true;

    let postData = {};
    this.PPSService.convertR308Data(postData).subscribe(res =>{
      if(res['code'] == 1){
        this.message.info('截轉成功');
        this.getDataList();
      }else{
        this.message.error('截轉失敗');
      }
      this.isSpinning = false;
    });

  }

  excelExport(){

    this.isSpinning = true;
    let headerArray = [] ;

    this.columnDefs.forEach(function(obj){
      headerArray.push(obj['headerName']);
    });

    let exportTableName = "出貨計畫彙總表"

    let exportData = this.rowData;
    this.excelService.exportAsExcelFile(exportData, exportTableName,headerArray);
    
    this.isSpinning = false;

 }

}

interface data {
  "moEdition": String,
  "plantCode": String,
  "source": String,
  "areaGroup": String,
  "custAbbreviations": String,
  "sales": String,
  "idNo": String,
  "saleOrder": String,
  "saleItem": String,
  "dateDeliveryPp": String,
  "weight": number,
  "pst": String,
  "missingGroup": String,
  "datePlanInStorage": String,
  "dateAcceptable": String,
  "fixAreaGroup": String,
  "isProfield": String,
  "isBigStick": String,
  "isDatePlanInStorage": String,
  "isDateAcceptable": String,
  "isMissingGroup": String,
  "isEnoughBeforeEndOfMonth": String,
  "dateCreate": String,
  "userCreate": String,
  "dateUpdate": String,
  "userUpdate": String
}