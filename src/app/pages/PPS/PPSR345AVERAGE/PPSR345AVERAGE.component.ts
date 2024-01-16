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
  ValueFormatterParams,
} from 'ag-grid-community';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import { endOfDay, startOfDay } from 'date-fns'; // 引入相应的日期库
import { DatePipe } from '@angular/common';

interface ItemData {
  shopCode: string;
  totalWorkingHoursByShop: number;
  totalWeightByShop: number;
  averageWorkingHours: number;
}

@Component({
  selector: 'app-PPSR345AVERAGE',
  templateUrl: './PPSR345AVERAGE.component.html',
  styleUrls: ['./PPSR345AVERAGE.component.scss'],
  providers: [NzMessageService, DatePipe],
})
export class PPSR345AVERAGEComponent implements AfterViewInit {
  loading = false; //loaging data flag
  userName;
  plantCode;
  customWidth;
  gridOptions: GridOptions;
  dateBegin: string;
  dateEnd: string;
  originalDate: string;
  dateRange: Date[] = [];
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
      headerName: '站別',
      field: 'shopCode',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
    },
    {
      headerName: '總重量',
      field: 'totalWeightByShop',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
      valueFormatter: this.customNumberFormatter,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: '總工時',
      field: 'totalWorkingHoursByShop',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
      valueFormatter: this.customNumberFormatter,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: '平均工時',
      field: 'averageWorkingHours',
      width: 115,
      headerComponent: AGCustomHeaderComponent,
      valueFormatter: this.customNumberFormatter,
      cellStyle: { textAlign: 'right' },
    },
  ];

  titleArray = ['站別', '總重量', '總工時', '平均工時'];

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
    this.PPSService.getAverageByShopCodeByDate(null).subscribe((res: any) => {
      const { code, data } = res;
      if (code === 200) {
        this.rowData = data;
        this.getDate();
      }
    });
  }

  customNumberFormatter(params: any) {
    return params.value.toFixed(2);
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
    this.PPSService.getAverageByShopCodeByDate(date).subscribe((res: any) => {
      const { code, data } = res;
      if (code === 200) {
        this.loading = false;
        this.rowData = data;
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
        shopCode: this.rowData[i].shopCode,
        totalWeightByShop: this.rowData[i].totalWeightByShop,
        totalWorkingHoursByShop: this.rowData[i].totalWorkingHoursByShop,
        averageWorkingHours: this.rowData[i].averageWorkingHours,
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
