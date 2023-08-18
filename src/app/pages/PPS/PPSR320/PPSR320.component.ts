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
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-PPSR320',
  templateUrl: './PPSR320.component.html',
  styleUrls: ['./PPSR320.component.scss'],
  providers:[NzMessageService]
})
export class PPSR320Component implements OnInit {

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
    },
    getRowStyle: params => {
      if (params.data.areaGroup.includes("總計")) {
        return { background: '#97CBFF' };
      }else if( params.data.areaGroup == '合計'){
        return { background: 'yellow' };
      }
    }
  };

  columnDefs = [
    {
      children: [
          { 
            headerName: '產品',
            field: 'areaGroup',
            width:120
          }
      ]
    },
    {
      children: [
          { 
            headerName: '區域',
            field: 'areaGroup',
            width:120
          }
      ]
    },
    {
        headerValueGetter: (params) => '7月',
        children: [
            { 
              columnGroupShow: 'closed',
              headerName: '出貨目標',
              field: 'orderbalanceweight',
              width:120,
              openByDefault: false,
            },
            { 
              columnGroupShow: 'open',
              headerName: '期初庫存A',
              field: 'orderbalanceweight',
              width:120,
              openByDefault: false,
            },
            { 
              columnGroupShow: 'open',
              headerName: '當月入庫量B',
              field: 'orderbalanceweight',
              width:120,
              openByDefault: false,
            },
            { 
              columnGroupShow: 'open',
              wrapHeaderText:true,
              headerName: '本月最大出貨C=A+B',
              field: 'orderbalanceweight',
              width:140,
              openByDefault: false,
            },
            { 
              columnGroupShow: 'open',
              headerName: '出貨(已過帳)',
              field: 'orderbalanceweight',
              width:140,
              openByDefault: false,
            },
            { 
              columnGroupShow: 'open',
              headerName: '檢貨未過帳',
              field: 'orderbalanceweight',
              width:120,
              openByDefault: false,
            },
            { 
              columnGroupShow: 'open',
              headerName: '成品',
              field: 'orderbalanceweight',
              width:80,
              openByDefault: false,
            },
            { 
              columnGroupShow: 'open',
              headerName: '待入庫',
              field: 'orderbalanceweight',
              width:100,
              openByDefault: false,
            }
        ]
    },
    {
      headerValueGetter: (params) => '7月W1(7/1~7/8)',
      children: [
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            headerName: 'W1目標',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            headerName: 'W1實績',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '成品(A)',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '待入庫(B)',
            field: 'estimateWeight',
            width:120
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '假日出貨(C)',
            field: 'estimateWeight',
            width:140
          },
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            groupId: 'A',
            wrapHeaderText:true,
            headerName: '次週可出貨量D=(A)+(B)-(C)',
            field: 'estimateWeight',
            width:140
          }
      ]
    },
    {
      headerValueGetter: (params) => '7月W2(7/9~7/15)',
      children: [
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            headerName: 'W2目標',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            headerName: 'W2實績',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '成品(A)',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '待入庫(B)',
            field: 'estimateWeight',
            width:120
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '假日出貨(C)',
            field: 'estimateWeight',
            width:140
          },
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            wrapHeaderText:true,
            headerName: '次週可出貨量D=(A)+(B)-(C)',
            field: 'estimateWeight',
            width:140
          }
      ]
    },
    {
      headerValueGetter: (params) => '7月W3(7/16~7/22)',
      children: [
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            groupId: 'A',
            headerName: 'W3目標',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            headerName: 'W3實績',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '成品(A)',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '待入庫(B)',
            field: 'estimateWeight',
            width:120
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '假日出貨(C)',
            field: 'estimateWeight',
            width:140
          },
          { 
            wrapHeaderText:true,
            openByDefault: false,
            columnGroupShow: 'close',
            headerName: '次週可出貨量D=(A)+(B)-(C)',
            field: 'estimateWeight',
            width:140
          }
      ]
    },
    {
      headerValueGetter: (params) => '7月W4(7/23~7/29)',
      children: [
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            headerName: 'W4目標',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            headerName: 'W4實績',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '成品(A)',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '待入庫(B)',
            field: 'estimateWeight',
            width:120
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '假日出貨(C)',
            field: 'estimateWeight',
            width:140
          },
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            wrapHeaderText:true,
            headerName: '次週可出貨量D=(A)+(B)-(C)',
            field: 'estimateWeight',
            width:140
          }
      ]
    },
    {
      headerValueGetter: (params) => '7月W5(7/30~7/31)',
      children: [
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            headerName: 'W5目標',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            headerName: 'W5實績',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '成品(A)',
            field: 'estimateWeight',
            width:100
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '待入庫(B)',
            field: 'estimateWeight',
            width:120
          },
          { 
            openByDefault: false,
            columnGroupShow: 'open',
            headerName: '假日出貨(C)',
            field: 'estimateWeight',
            width:140
          },
          { 
            openByDefault: false,
            columnGroupShow: 'close',
            wrapHeaderText:true,
            headerName: '次週可出貨量D=(A)+(B)-(C)',
            field: 'estimateWeight',
            width:140
          }
      ]
    },
    {
      children: [
          { 
            headerName: '累計出貨量',
            field: 'shipmentSumStock',
            width:130
          }
      ]
    },
    {
      children: [
          { 
            headerName: '月差異實績VS目標',
            field: 'shipmentSumStock',
            wrapHeaderText:true,
            width:130
          }
      ]
    }
  ];

  excelExport() {

    let exportData = [];
    let postData = this.searchData;
    postData['mo_EDITION'] = this.searchData.selectedVer_default;
    this.PPSService.getR320Data(postData).subscribe(res =>{
      
      let result: any = res;


      for (var i = 0; i <= result.length; i++) {
        var element = result[i];
        console.log(element);
        if (element) {
          var obj =
          {
            "A.銷售區域": (element['areaGroup'] ? element['areaGroup'] : null),
            "B.業務員": (element['sales'] ? element['sales'] : null),
            "C.付款條件": (element['paymentTerms'] ? element['paymentTerms'] : null),
            "D.客戶簡稱": (element['custAbbreviations'] ? element['custAbbreviations'] : null),
            "E.訂單餘量_總量": (element['orderbalanceweight'] ? Number(element['orderbalanceweight']) : null),
            "F.目標量_總量": (element['estimateWeight'] ? Number(element['estimateWeight']) : null),
            "G.生計回覆_總量": (element['availableToShip'] ? Number(element['availableToShip']) : null),
            "H.出貨進度": (element['shippingProgress'] ? Math.round(element['shippingProgress'] * 100) + '%' : null),
            "I.出貨量(總量)_已過帳": (element['shipmentPostedWeight'] ? Number(element['shipmentPostedWeight']) : null),
            "J.出貨量(總量)_未過帳": (element['shipmentUnpostedWeight'] ? Number(element['shipmentUnpostedWeight']) : null),
            "K.出貨量(總量)_小計": (element['shipmentWeightSum'] ? Number(element['shipmentWeightSum']) : null),
            "L.庫存量(庫存量)_成品": (element['stockFinalProductWeight'] ? Number(element['stockFinalProductWeight']) : null),
            "M.庫存量(庫存量)_半成品": (element['stockUnfinalProductWeight'] ? Number(element['stockUnfinalProductWeight']) : null),
            "N.庫存量(庫存量)_小計": (element['stockWeightSum'] ? Number(element['stockWeightSum']) : null),
            "O.合計": (element['shipmentSumStock'] ? Number(element['shipmentSumStock']) : null)
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
    this.PPSService.getR320Data(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
      } else {
        this.message.error("版次:"+this.searchData.selectedVer_default+"無資料");
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