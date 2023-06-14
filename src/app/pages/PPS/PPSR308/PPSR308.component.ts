import { Component, OnInit } from '@angular/core';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-PPSR308',
  templateUrl: './PPSR308.component.html',
  styleUrls: ['./PPSR308.component.scss']
})
export class PPSR308Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
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

  public columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: '總出貨',
      children: [
        {
          headerName: '區別',
          children: [{
            children: [{}],
          }],
        },
        {
          headerName: '負責業務',
          children: [{
            children: [{}],
          }],
        },
        {
          headerName: '出貨目標',
          children: [{
            children: [{}],
          }],
        },
        {
          headerName: '出貨進度',
          children: [{
            children: [{}],
          }],
        },
        {
          headerName: '可供出貨量(無卡計畫量)',
          children: [
            {
              headerName: '可供出貨量',
              field: 'make',
              width: 180,
              children: [{}],
            },
            {
              headerName: 'GAP',
              field: 'model',
              width: 90,
              children: [{}],
            }
          ],
        },
        {
          headerName: '可供出貨量(符合計畫量/缺項)',
          children: [
            {
              headerName: '可供出貨量',
              field: 'make',
              width: 180,
              children: [{}],
            },
            {
              headerName: 'GAP',
              field: 'model',
              width: 90,
              children: [{}],
            }
          ],
        },
        {
          headerName: '已出貨',
          children: [{
            children: [{}],
          }],
        },
        {
          headerName: '成品',
          children: [
            {
              headerName: '交期符合',
              children: [
                {
                  headerName: '足項',
                },
                {
                  headerName: '缺項',
                }
              ],
            },
            {
              headerName: '交期不符',
              children: [{}],
            },
            {
              headerName: '至月底足項',
              children: [{}],
            }
          ],
        },
        {
          headerName: '生產計劃',
          children: [
            {
              headerName: '交期符合',
              children: [
                {
                  headerName: '足項',
                },
                {
                  headerName: '缺項',
                }
              ],
            },
            {
              headerName: '交期不符',
              children: [{}],
            },
            {
              headerName: '至月底足項',
              children: [{}],
            }
          ],
        }
      ],
    }
  ] 

  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 }
  ];

}
