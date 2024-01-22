import { Component, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/common/excel.service';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridOptions,
} from 'ag-grid-community';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import { endOfDay, startOfDay } from 'date-fns'; // 引入相应的日期库
import { DatePipe } from '@angular/common';

interface ItemData {
  id: string;
  idNo: string;
  shopCode: string;
  equipCode: string;
  workingHours: number;
  outputDia: number;
  inputDia: number;
  ttlLength: number;
  pieceCount: number;
  actualLength: number;
  saleOrderLength: number;
  weight: number;
  outputShape: string;
  inputShape: string;
  mtrlNo: string;
  steelType: string;
  kindType: string;
  opCode: string;
  dateBeg: string;
  dateEnd: string;
  comment: string;
}

@Component({
  selector: 'app-PPSR345',
  templateUrl: './PPSR345.component.html',
  styleUrls: ['./PPSR345.component.scss'],
  providers: [NzMessageService, DatePipe],
})
export class PPSR345Component implements AfterViewInit {
  loading = false; //loaging data flag
  userName;
  plantCode;
  customWidth;
  gridOptions: GridOptions;
  dateBegin: string;
  dateEnd: string;
  dateRange: Date[] = [];
  originalDate: string;

  //ag-grid
  rowData: ItemData[] = [];

  public defaultColDef: ColDef = {
    sortable: false,
    resizable: true,
    filter: true,
    editable: true,
  };

  private gridApi!: GridApi;
  public editType: 'fullRow' = 'fullRow';
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  colDefs: ColDef[] = [
    {
      headerName: 'ID_NO',
      field: 'idNo',
      width: 129,
      headerComponent: AGCustomHeaderComponent,
      pinned: 'left',
    },
    {
      headerName: '站別',
      field: 'shopCode',
      width: 116,
      headerComponent: AGCustomHeaderComponent,
      pinned: 'left',
    },
    {
      headerName: '機台',
      field: 'equipCode',
      width: 116,
      headerComponent: AGCustomHeaderComponent,
      pinned: 'left',
    },
    {
      headerName: '工時',
      field: 'workingHours',
      width: 116,
      headerComponent: AGCustomHeaderComponent,
      pinned: 'left',
      cellStyle: { textAlign: 'right' },
      valueFormatter: function (params) {
        if (params.value != null || params.value != undefined) {
          return params.value.toFixed(2);
        }
      },
    },

    {
      headerName: '支數',
      field: 'pieceCount',
      width: 116,
      headerComponent: AGCustomHeaderComponent,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: '實際長度',
      field: 'actualLength',
      width: 142,
      headerComponent: AGCustomHeaderComponent,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: '訂單長度',
      field: 'saleOrderLength',
      width: 142,
      headerComponent: AGCustomHeaderComponent,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: '總長度',
      field: 'ttlLength',
      width: 129,
      headerComponent: AGCustomHeaderComponent,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: '重量',
      field: 'weight',
      width: 116,
      headerComponent: AGCustomHeaderComponent,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: '投入尺寸',
      field: 'inputDia',
      width: 142,
      headerComponent: AGCustomHeaderComponent,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: '產出尺寸',
      field: 'outputDia',
      width: 142,
      headerComponent: AGCustomHeaderComponent,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: '投入型態',
      field: 'inputShape',
      width: 142,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '產出型態',
      field: 'outputShape',
      width: 142,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '料號',
      field: 'mtrlNo',
      width: 175,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '鋼種',
      field: 'gradeNo',
      width: 116,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '產品',
      field: 'kindType',
      width: 116,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '作業代碼',
      field: 'opCode',
      width: 142,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '開始時間',
      field: 'dateBeg',
      width: 165,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '結束時間',
      field: 'dateEnd',
      width: 165,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '備註',
      field: 'comment',
      width: 200,
      headerComponent: AGCustomHeaderComponent,
    },
  ];

  titleArray = [
    'ID_NO',
    '站別',
    '機台',
    '工時',
    '支數',
    '實際長度',
    '訂單長度',
    '總長度',
    '重量',
    '投入尺寸',
    '產出尺寸',
    '投入型態',
    '產出型態',
    '料號',
    '鋼種',
    '產品',
    '作業代碼',
    '開始時間',
    '結束時間',
    '備註',
  ];

  constructor(
    private elementRef: ElementRef,
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
    private renderer: Renderer2,
    private datePipe: DatePipe
  ) {
    this.i18n.setLocale(zh_TW);
    this.userName = this.cookieService.getCookie('USERNAME');
    this.plantCode = this.cookieService.getCookie('plantCode');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.getDataList();
  }

  getDataList() {
    this.loading = true;
    this.PPSService.getPPSOUTTB01HISTORY().subscribe((res: any) => {
      const { code, data } = res;
      if (code === 200) {
        this.rowData = data;
        this.getDate();
      }
    });
  }

  getDate() {
    this.loading = true;
    this.PPSService.getHisrotyStartEnd().subscribe((res: any) => {
      const { code, data } = res;
      if (code === 200) {
        const start = new Date(data['dateBeg']);
        const end = new Date(data['dateEnd']);
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() + 1);
        this.originalDate =
          moment(start).format('YYYY-MM-DD') +
          ' ~ ' +
          moment(end).format('YYYY-MM-DD');
      }
      this.loading = false;
    });
  }

  search() {
    this.loading = true;
    console.log(this.dateBegin, this.dateEnd);
    let date = {
      dateBeg: this.dateBegin,
      dateEnd: this.dateEnd,
    };
    this.PPSService.getPPSOUTTB01HISTORYbyDate(date).subscribe((res: any) => {
      const { code, data } = res;
      if (code === 200) {
        this.loading = false;
        this.rowData = data;
        this.sucessMSG('計算完成', ``);
        this.getDataList();
      } else {
        this.errorMSG('計算失敗', ``);
        this.getDataList();
      }
    });
  }

  sucessMSG(_title, _plan): void {
    this.Modal.success({
      nzTitle: _title,
      nzContent: `${_plan}`,
    });
  }

  errorMSG(_title, _context): void {
    this.Modal.error({
      nzTitle: _title,
      nzContent: `${_context}`,
    });
  }

  convertToExcel() {
    this.loading = true;
    let fileName = `歷史工時結果表`;
    let outputDataList = [];
    for (let i = 0; i < this.rowData.length; i++) {
      var data = {
        idNo: this.rowData[i].idNo,
        shopCode: this.rowData[i].shopCode,
        equipCode: this.rowData[i].equipCode,
        workingHours: this.rowData[i].workingHours,
        pieceCount: this.rowData[i].pieceCount,
        actualLength: this.rowData[i].actualLength,
        saleOrderLength: this.rowData[i].saleOrderLength,
        ttlLength: this.rowData[i].ttlLength,
        weight: this.rowData[i].weight,
        inputDia: this.rowData[i].inputDia,
        outputDia: this.rowData[i].outputDia,
        inputShape: this.rowData[i].inputShape,
        outputShape: this.rowData[i].outputShape,
        mtrlNo: this.rowData[i].mtrlNo,
        steelType: this.rowData[i].steelType,
        kindType: this.rowData[i].kindType,
        opCode: this.rowData[i].opCode,
        dateBeg: this.rowData[i].dateBeg,
        dateEnd: this.rowData[i].dateEnd,
        comment: this.rowData[i].comment,
      };
      outputDataList.push(data);
    }
    this.excelService.exportAsExcelFile(
      outputDataList,
      fileName,
      this.titleArray
    );
    this.loading = false;
  }

  onDateSelect(e: any) {
    console.log(e);
    this.dateBegin = moment(e[0]).format('YYYY-MM-DD') + ' 00:00:00';
    this.dateEnd = moment(e[1]).format('YYYY-MM-DD') + ' 23:59:59';
  }
}
