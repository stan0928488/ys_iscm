import { Component, AfterViewInit, OnInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { zh_TW, NzI18nService } from "ng-zorro-antd/i18n"
import { NzModalService } from "ng-zorro-antd/modal"
import { ExcelService } from "src/app/services/common/excel.service";
import { CellClickedEvent, ColDef, GridReadyEvent, PreConstruct } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from "moment";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-PPSR309',
  templateUrl: './PPSR309.component.html',
  styleUrls: ['./PPSR309.component.scss'],
  providers:[NzMessageService]
})
export class PPSR309Component implements OnInit {

  selectedVer_default:string = null;

  selectedVer = [{label:'',value:''}]; //版本选择

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
    this.getVerListData();
  }

  gridOptions = {
    defaultColDef: {
        editable: false,
        enableRowGroup: false,
        enablePivot: false,
        enableValue: false,
        sortable: true,
        resizable: true,
        filter: true
    }
  };

  columnDefs: ColDef<data>[] = [
    { headerName: 'MO版本',field: "moEdition" , filter: false,width: 150 },
    { headerName: '廠區別',field: "plantCode" , filter: false,width: 100 },
    { headerName: '來源',field: "source" , filter: false,width: 100 },
    { headerName: '區別',field: "areaGroup" , filter: false,width: 120 },
    { headerName: '客戶簡稱',field: "custAbbreviations" , filter: false,width: 120 },
    { headerName: '業務員',field: "sales" , filter: false,width: 100 },
    { headerName: 'MO',field: "idNo" , filter: false,width: 120 },
    { headerName: '訂單編號',field: "saleOrder" , filter: false,width: 100 },
    { headerName: '訂單項次',field: "saleItem" , filter: false,width: 100 },
    { headerName: '生計交期',field: "dateDeliveryPp" , filter: false,width: 120 },
    { headerName: '現況重量',field: "weight" , filter: false,width: 100 },
    { headerName: 'PST',field: "pst" , filter: false,width: 120 },
    { headerName: '缺項群組',field: "missingGroup" , filter: false,width: 120 },
    { headerName: '允收截止日',field: "datePlanInStorage" , filter: false,width: 120 },
    { headerName: '可接受交期',field: "dateAcceptable" , filter: false,width: 120 },
    { headerName: '區別修正',field: "fixAreaGroup" , filter: false,width: 100 },
    { headerName: '異型棒',field: "isProfield" , filter: false,width: 100 },
    { headerName: '大棒',field: "isBigStick" , filter: false,width: 100 },
    { headerName: '是否符合允收截止日',field: "isDatePlanInStorage" , filter: false,width: 150 },
    { headerName: '是否符合可接受交期',field: "isDateAcceptable" , filter: false,width: 150 },
    { headerName: '符合缺項',field: "isMissingGroup" , filter: false,width: 100 },
    { headerName: '月底可入庫',field: "isEnoughBeforeEndOfMonth" , filter: false,width: 150 },
    { headerName: '現況MIC_NO',field: "lineupMicNo" , filter: false,width: 100 },
    { headerName: '尺寸',field: "outDia" , filter: false,width: 100 }
  ]

  rowData: data[] = [];    

  getVerListData(){

    this.isSpinning = true;
    let postData = {};
    this.PPSService.getR308VerListData(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        for(let i = 0 ; i<result.length ; i++) {
          this.selectedVer.push({label:result[i].mo_EDITION, value:result[i].mo_EDITION})
        }
      } else {
        this.message.error('無資料');
        return;
      }
      this.isSpinning = false;
    },err => {
      this.message.error('網絡請求失敗');
    })

  }

  getDataList(){
    this.isSpinning = true;
    let postData = {};
    postData['mo_EDITION'] = this.selectedVer_default;
    this.PPSService.getR309Data(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
        this.rowData.forEach((element) => {
          var temp = element['dateDeliveryPp'] as string;
          if(temp){
            element['dateDeliveryPp'] = moment(temp).format('YYYY-MM-DD');
          }

          temp = element['pst'] as string;
          if(temp){
            element['pst'] = moment(temp).format('YYYY-MM-DD');
          }

          temp = element['dateAcceptable'] as string;
          element['dateAcceptable'] = moment(temp).format('YYYY-MM-DD');

          temp = element['datePlanInStorage'] as string;
          element['datePlanInStorage'] = moment(temp).format('YYYY-MM-DD');

        });
      } else {
        this.message.error("版次:"+this.selectedVer_default+"無資料");
      }
      this.isSpinning = false;
    },err => {
      this.message.error('網絡請求失敗');
    })


  }

  dataConvert() {
    this.isSpinning = true;
    let postData = {};
    postData['mo_EDITION'] = this.selectedVer_default;
    this.PPSService.convertR308Data(postData).subscribe(res =>{
      if(res['code'] == 200){
        this.message.info('結轉成功');
        this.getDataList();
        this.getVerListData();
      }else{
        this.message.error('結轉失敗');
      }
      this.isSpinning = false;
    });

  }

 excelExport() {

    let exportData = [];
    let postData = {};
    postData['mo_EDITION'] = this.selectedVer_default;
    this.PPSService.getR309Data(postData).subscribe(res =>{
      
      let result: any = res;

      for (var i = 0; i <= result.length; i++) {
        var element = result[i];
        if (element) {
          var obj =
          {
            "MO版本": (element['moEdition'] ? element['moEdition'] : null),
            "廠區別": (element['plantCode'] ? element['plantCode'] : null),
            "來源": (element['source'] ? element['source'] : null),
            "區別": (element['areaGroup'] ? element['areaGroup'] : null),
            "客戶簡稱": (element['custAbbreviations'] ? element['custAbbreviations'] : null),
            "業務員": (element['sales'] ? element['sales'] : null),
            "MO": (element['idNo'] ? element['idNo'] : null),
            "訂單編號": (element['saleOrder'] ? element['saleOrder'] : null),
            "訂單項次": (element['saleItem'] ? element['saleItem'] : null),
            "生計交期": (element['dateDeliveryPp'] ? new Date(element['dateDeliveryPp']) : null),
            "現況重量": (element['weight'] ? element['weight'] : null),
            "PST": (element['pst'] ? new Date(element['pst']) : null),
            "缺項群組": (element['missingGroup'] ? element['missingGroup'] : null),
            "允收截止日": (element['datePlanInStorage'] ? new Date(element['datePlanInStorage']) : null),
            "可接受交期": (element['dateAcceptable'] ? new Date(element['dateAcceptable']) : null),
            "區別修正": (element['fixAreaGroup'] ? element['fixAreaGroup'] : null),
            "異型棒": (element['isProfield'] ? element['isProfield'] : null),
            "大棒": (element['isBigStick'] ? element['isBigStick'] : null),
            "是否符合允收截止日": (element['isDatePlanInStorage'] ? element['isDatePlanInStorage'] : null),
            "是否符合可接受交期": (element['isDateAcceptable'] ? element['isDateAcceptable'] : null),
            "符合缺項": (element['isMissingGroup'] ? element['isMissingGroup'] : null),
            "月底可入庫": (element['isEnoughBeforeEndOfMonth'] ? element['isEnoughBeforeEndOfMonth'] : null),
            "現況MIC_NO": (element['lineupMicNo'] ? element['lineupMicNo'] : null),
            "尺寸": (element['outDia'] ? element['outDia'] : null),
          }
          exportData.push(obj);
        }
      }

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '出貨計畫總表')
      XLSX.writeFile(wb, ExcelService.toExportFileName("出貨計畫總表"));

    });

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