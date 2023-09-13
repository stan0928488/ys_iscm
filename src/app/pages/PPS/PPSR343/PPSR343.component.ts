import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-PPSR343',
  templateUrl: './PPSR343.component.html',
  styleUrls: ['./PPSR343.component.scss']
})
export class PPSR343Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  columnDefs: ColDef[] = [
    {
      headerName: '區別',
      field: 'areaGroup',
    },
    {
      headerName: '客戶',
      field: 'areaGroup',
    },
    {
      headerName: '訂單號碼',
      field: 'areaGroup',
    },
    {
      headerName: '待入庫(A)',
      field: 'areaGroup',
    },
    {
      headerName: '庫存(B)',
      field: 'areaGroup',
    },
    {
      headerName: '庫存-次月(C)',
      field: 'areaGroup',
    },
    {
      headerName: '合計(A+B+C)',
      field: 'areaGroup',
    },
    {
      headerName: '預估出貨量',
      field: 'areaGroup',
    }
  ];

  rowData = [
    {},
  ];

}
