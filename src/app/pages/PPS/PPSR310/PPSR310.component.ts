import { Component, AfterViewInit, OnInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { zh_TW, NzI18nService } from "ng-zorro-antd/i18n"
import { NzModalService } from "ng-zorro-antd/modal"
import { ExcelService } from "src/app/services/common/excel.service";
import { CellClickedEvent, ColDef, GridReadyEvent, PreConstruct } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-PPSR310',
  templateUrl: './PPSR310.component.html',
  styleUrls: ['./PPSR310.component.scss'],
  providers:[NzMessageService]
})
export class PPSR310Component implements OnInit {

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

  rowData: data[] = [];    
  selectedVer = [{label:'',value:''}]; //版本选择
  isSpinning = false;

  searchData = {
    selectedVer_default:null,
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

  columnDefs = [
    {
      children: [
          { 
            headerName: '銷售區域',
            field: 'areaGroup' 
          }
      ]
    },
    {
      children: [
          { 
            headerName: '業務員',
            field: 'sales' 
          }
      ]
    },
    {
      children: [
          { 
            headerName: '付款條件',
            field: 'paymentTerms' 
          }
      ]
    },
    {
      children: [
          { 
            headerName: '客戶簡稱',
            field: 'custAbbreviations' 
          }
      ]
    },
    {
        headerName: '訂單餘量',
        children: [
            { 
              headerName: '總量',
              field: 'orderBalanceWeight' 
            }
        ]
    },
    {
      headerName: '目標量',
      children: [
          { 
            headerName: '總量',
            field: 'estimateWeight' 
          }
      ]
    },
    {
      headerName: '生計回覆',
      children: [
          { 
            headerName: '總量',
            field: 'availableToShip' 
          }
      ]
    },
    {
      children: [
          { 
            headerName: '出貨進度',
            field: 'shippingProgress' 
          }
      ]
    },
    {
      headerName: '出貨量(總量)',
      children: [
          { 
            headerName: '已過帳',
            field: 'shipmentPostedWeight' 
          },
          { 
            headerName: '未過帳',
            field: 'shipmentUnpostedWeight' 
          },
          { 
            headerName: '小計',
            field: 'shipmentWeightSum' 
          }
      ]
    },
    {
      headerName: '庫存量(庫存量)',
      children: [
          { 
            headerName: '成品',
            field: 'stockFinalProductWeight' 
          },
          { 
            headerName: '半成品',
            field: 'stockUnfinalProductWeight' 
          },
          { 
            headerName: '小計',
            field: 'stockWeightSum' 
          }
      ]
    },
    {
      children: [
          { 
            headerName: '合計',
            field: 'shipmentSumStock' 
          }
      ]
    }
  ];

  excelExport() {

    let exportData = [];
    let postData = this.searchData;
    postData['mo_EDITION'] = this.searchData.selectedVer_default;
    this.PPSService.getR310Data(postData).subscribe(res =>{
      
      let result: any = res;


      for (var i = 0; i <= result.length; i++) {
        var element = result[i];
        console.log(element);
        if (element) {
          var obj =
          {
            "銷售區域": (element['areaGroup'] ? element['areaGroup'] : null),
            "業務員": (element['sales'] ? element['sales'] : null),
            "付款條件": (element['paymentTerms'] ? element['paymentTerms'] : null),
            "客戶簡稱": (element['custAbbreviations'] ? element['custAbbreviations'] : null),
            "訂單餘量_總量": (element['orderBalanceWeight'] ? Number(element['orderBalanceWeight']) : null),
            "目標量_總量": (element['estimateWeight'] ? Number(element['estimateWeight']) : null),
            "生計回覆_總量": (element['availableToShip'] ? Number(element['availableToShip']) : null),
            "出貨量(總量)_已過帳": (element['shipmentPostedWeight'] ? Number(element['shipmentPostedWeight']) : null),
            "出貨量(總量)_未過帳": (element['shipmentUnpostedWeight'] ? Number(element['shipmentUnpostedWeight']) : null),
            "出貨量(總量)_小計": (element['shipmentWeightSum'] ? Number(element['shipmentWeightSum']) : null),
            "庫存量(庫存量)_成品": (element['stockFinalProductWeight'] ? Number(element['stockFinalProductWeight']) : null),
            "庫存量(庫存量)_半成品": (element['stockUnfinalProductWeight'] ? Number(element['stockUnfinalProductWeight']) : null),
            "庫存量(庫存量)_小計": (element['stockWeightSum'] ? Number(element['stockWeightSum']) : null),
            "合計": (element['shipmentSumStock'] ? Number(element['shipmentSumStock']) : null)
          }
          exportData.push(obj);
        }
      }

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '業務報表')
      XLSX.writeFile(wb, ExcelService.toExportFileName("業務報表"));

    });

  }

  getDataList(){

    this.isSpinning = true;
    let postData = this.searchData;
    postData['mo_EDITION'] = this.searchData.selectedVer_default;
    this.PPSService.getR310Data(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
      } else {
        this.message.error('無資料');
        return;
      }
      this.isSpinning = false;
    },err => {
      this.isSpinning = false;
      this.message.error('網絡請求失敗');
    })

  }

  getVerListData(){

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
    },err => {
      this.message.error('網絡請求失敗');
    })

  }

}

interface data {

}
