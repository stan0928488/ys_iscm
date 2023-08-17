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
            headerName: 'A.銷售區域',
            field: 'areaGroup',
            width:120
          }
      ]
    },
    {
      children: [
          { 
            headerName: 'B.業務員',
            field: 'sales',
            width:110
          }
      ]
    },
    {
      children: [
          { 
            headerName: 'C.付款條件',
            field: 'paymentTerms',
            width:120
          }
      ]
    },
    {
      children: [
          { 
            headerName: 'D.客戶簡稱',
            field: 'custAbbreviations',
            width:150
          }
      ]
    },
    {
        headerName: 'E.訂單餘量',
        children: [
            { 
              headerName: 'E.總量',
              field: 'orderbalanceweight',
              width:100,
              cellStyle: params => {
                if (params.value < 0) {
                    return {color: 'red'};
                }
              },
              cellRenderer: function (params) {
                if (params.value < 0) {
                  return "(" + params.value * -1 + ")";
                }else {
                  return params.value
                }
              },
            }
        ]
    },
    {
      headerName: 'F.目標量',
      children: [
          { 
            headerName: 'F.總量',
            field: 'estimateWeight',
            width:100,
            cellStyle: params => {
              if (params.value < 0) {
                  return {color: 'red'};
              }
            },
            cellRenderer: function (params) {
              if (params.value < 0) {
                return "(" + params.value * -1 + ")";
              }else {
                return params.value
              }
            },
          }
      ]
    },
    {
      headerName: 'G.生計回覆',
      children: [
          { 
            headerName: 'G.總量',
            field: 'availableToShip',
            width:110,
            cellStyle: params => {
              if (params.value < 0) {
                  return {color: 'red'};
              }
            },
            cellRenderer: function (params) {
              if (params.value < 0) {
                return "(" + params.value * -1 + ")";
              }else {
                return params.value
              }
            },
          }
      ]
    },
    {
      children: [
          { 
            headerName: 'H.出貨進度',
            field: 'shippingProgress',
            width:120,
            cellStyle: params => {
              if (params.value < 0) {
                  return {color: 'red'};
              }
            },
            cellRenderer: function (params) {
              if (params.value > 0) {
                return Math.round(params.value * 100) + "%";
              }
              else if (params.value < 0) {
                return "(" + params.value * -1 + ")";
              }
              else {
                return params.value
              }
            },
          }
      ]
    },
    {
      headerName: '出貨量(總量)',
      children: [
          { 
            headerName: 'I.已過帳',
            field: 'shipmentPostedWeight',
            width:120,
            cellStyle: params => {
              if (params.value < 0) {
                  return {color: 'red'};
              }
            },
            cellRenderer: function (params) {
              if (params.value < 0) {
                return "(" + params.value * -1 + ")";
              }else {
                return params.value
              }
            },
          },
          { 
            headerName: 'J.未過帳',
            field: 'shipmentUnpostedWeight',
            width:120,
            cellStyle: params => {
              if (params.value < 0) {
                  return {color: 'red'};
              }
            },
            cellRenderer: function (params) {
              if (params.value < 0) {
                return "(" + params.value * -1 + ")";
              }else {
                return params.value
              }
            },
          },
          { 
            headerName: 'K.小計',
            field: 'shipmentWeightSum',
            width:100,
            cellStyle: params => {
              if (params.value < 0) {
                return {color: 'red', 'background-color': '#FFAAD5'}
              }
              return {'background-color': '#FFAAD5'}
            },
            cellRenderer: function (params) {
              if (params.value < 0) {
                return "(" + params.value * -1 + ")";
              }else {
                return params.value
              }
            },
          }
      ]
    },
    {
      headerName: '庫存量(庫存量)',
      children: [
          { 
            headerName: 'L.成品',
            field: 'stockFinalProductWeight',
            width:90,
            cellStyle: params => {
              if (params.value < 0) {
                  return {color: 'red'};
              }
            },
            cellRenderer: function (params) {
              if (params.value < 0) {
                return "(" + params.value * -1 + ")";
              }else {
                return params.value
              }
            },
          },
          { 
            headerName: 'M.半成品',
            field: 'stockUnfinalProductWeight',
            width:110,
            cellStyle: params => {
              if (params.value < 0) {
                  return {color: 'red'};
              }
            },
            cellRenderer: function (params) {
              if (params.value < 0) {
                return "(" + params.value * -1 + ")";
              }else {
                return params.value
              }
            },
          },
          { 
            headerName: 'N.小計',
            field: 'stockWeightSum',
            width:100,
            cellStyle: params => {
              if (params.value < 0) {
                return {color: 'red', 'background-color': '#FFAAD5'}
              }
              return {'background-color': '#FFAAD5'}
            },
            cellRenderer: function (params) {
              if (params.value < 0) {
                return "(" + params.value * -1 + ")";
              }else {
                return params.value
              }
            },
          }
      ]
    },
    {
      children: [
          { 
            headerName: 'O.合計',
            field: 'shipmentSumStock',
            width:100,
            cellStyle: params => {
              if (params.value < 0) {
                return {color: 'red', 'background-color': '#84C1FF'}
              }
              return {'background-color': '#84C1FF'}
            },
            cellRenderer: function (params) {
              if (params.value < 0) {
                return "(" + params.value * -1 + ")";
              }else {
                return params.value
              }
            },
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
    this.PPSService.getR310Data(postData).subscribe(res =>{
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

  exportPDF() {
    const dataURI = 'https://walsinsmc.sharepoint.com/:b:/s/iSCM/EUdi_NQeAMVHmV-MQcBXNOQBpL0yDIqPhm4MPMyj7pkZdQ?e=V2t0Ey';
    saveAs(dataURI ,'業務報表相關說明.pdf');
  }

}

interface data {

}
