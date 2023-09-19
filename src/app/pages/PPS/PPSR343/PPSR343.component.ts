import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PPSService } from "src/app/services/PPS/PPS.service";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";

@Component({
  selector: 'app-PPSR343',
  templateUrl: './PPSR343.component.html',
  styleUrls: ['./PPSR343.component.scss'],
  providers:[NzMessageService]
})
export class PPSR343Component implements OnInit {

  isSpinning = false;
  rowData: data[] = [];

  constructor(
    private PPSService: PPSService,
    private message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.getDataList();
  }

  columnDefs: ColDef[] = [
    {
      headerName: '區別',
      field: 'saleAreaGroup',
    },
    {
      headerName: '客戶',
      field: 'custAbbreviations',
    },
    {
      headerName: '訂單號碼',
      field: 'saleOrder',
    },
    {
      headerName: '待入庫(A)',
      field: 'nonfinishWeight',
    },
    {
      headerName: '庫存(B)',
      field: 'wipMonthWeight',
    },
    {
      headerName: '庫存-次月(C)',
      field: 'wipNextMonthWeight',
    },
    {
      headerName: '合計(A+B+C)',
      field: 'abcSum',
    }
  ];

  getDataList() {
    this.isSpinning = true;
    let postData = {};
    this.PPSService.getR343Data(postData).subscribe(res => {
      let result: any = res;
      if (result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
      } else {
        this.message.error("無資料");
      }
      this.isSpinning = false;
    }, err => {
      this.message.error('網絡請求失敗');
    })

  }

  excelExport() {

    let exportData = [];
    let postData = {}
    this.PPSService.getR343Data(postData).subscribe(res =>{
      
      let result: any = res;

      for (var i = 0; i <= result.length; i++) {
        var element = result[i];
        if (element) {
          var obj =
          {
            "區別": (element['saleAreaGroup'] ? element['saleAreaGroup'] : null),
            "客戶": (element['custAbbreviations'] ? element['custAbbreviations'] : null),
            "訂單號碼": (element['saleOrder'] ? element['saleOrder'] : null),
            "待入庫(A)": (element['nonfinishWeight'] ? Number(element['nonfinishWeight']) : null),
            "庫存(B)": (element['wipMonthWeight'] ? Number(element['wipMonthWeight']) : null),
            "庫存-次月(C)": (element['wipNextMonthWeight'] ? Number(element['wipNextMonthWeight']) : null),
            "合計(A+B+C)": (element['abcSum'] ? Number(element['abcSum']) : null),
          }
          exportData.push(obj);
        }
      }

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '預計週入庫計畫')
      XLSX.writeFile(wb, ExcelService.toExportFileName("預計週入庫計畫"));

    });

  }

}

interface data {
  plantCode: string
  saleAreaGroup: string
  custAbbreviations: string
  saleOrder: string
  saleItem: string
  nonfinishWeight: number
  wipMonthWeight: number
  wipNextMonthWeight: number
}