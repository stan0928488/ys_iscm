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
  selector: 'app-PPSR310',
  templateUrl: './PPSR310.component.html',
  styleUrls: ['./PPSR310.component.scss'],
  providers:[NzMessageService]
})
export class PPSR310Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
          }
      ]
    },
    {
      children: [
          { 
            headerName: '業務員',
          }
      ]
    },
    {
      children: [
          { 
            headerName: '付款條件',
          }
      ]
    },
    {
      children: [
          { 
            headerName: '客戶簡稱',
          }
      ]
    },
    {
        headerName: '訂單餘量',
        children: [
            { 
              headerName: '總量',
              field: 'athlete' 
            }
        ]
    },
    {
      headerName: '目標量',
      children: [
          { 
            headerName: '總量',
            field: 'athlete' 
          }
      ]
    },
    {
      headerName: '生計回覆',
      children: [
          { 
            headerName: '總量',
            field: 'athlete' 
          }
      ]
    },
    {
      children: [
          { 
            headerName: '出貨進度',
          }
      ]
    },
    {
      headerName: '出貨量(總量)',
      children: [
          { 
            headerName: '已過帳',
            field: 'athlete' 
          },
          { 
            headerName: '未過帳',
            field: 'athlete' 
          },
          { 
            headerName: '小計',
            field: 'athlete' 
          }
      ]
    },
    {
      headerName: '庫存量(庫存量)',
      children: [
          { 
            headerName: '成品',
            field: 'athlete' 
          },
          { 
            headerName: '半成品',
            field: 'athlete' 
          },
          { 
            headerName: '小計',
            field: 'athlete' 
          }
      ]
    },
    {
      children: [
          { 
            headerName: '合計',
          }
      ]
    }
  ];

  rowData: data[] = [];    

}

interface data {

}
