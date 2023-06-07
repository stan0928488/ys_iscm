import {
  AfterViewInit,
  Component,
  Renderer2,
  HostListener,
} from '@angular/core';
import { MSHI004Service } from 'src/app/services/MSHI004/MSHI004.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MSHI004 } from './MSHI004.model';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import {
  CellEditingStartedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { PrimeDatePickerCellEditor } from './prime-date-picker-cell-editor';
import { CookieService } from 'src/app/services/config/cookie.service';
import { DataTransferService } from 'src/app/services/MSHI004/Data.transfer.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-MSHI004',
  templateUrl: './MSHI004.component.html',
  styleUrls: ['./MSHI004.component.css'],
  providers: [NzMessageService],
})
export class MSHI004Component implements AfterViewInit {
  id; //

  isSpinning = false;

  MSHI004DataList: MSHI004[] = [];

  MSHI004DataListDeepClone: MSHI004[] = [];

  // 存放待更新或新增的row資料
  MSHI004PendingDataList: MSHI004[] = [];

  gridOptions = {
    defaultColDef: {
      sortable: false,
      resizable: true,
    },
    components: {
      primeDatePickerCellEditorComponent: PrimeDatePickerCellEditor,
    },
  };

  constructor(
    private mshi004Service: MSHI004Service,
    private Modal: NzModalService,
    private message: NzMessageService,
    private dataTransferService: DataTransferService,
    private cookieService: CookieService,
    private renderer: Renderer2,
    private commonService: CommonService
  ) {
    this.id = this.cookieService.getCookie('id');

    this.dataTransferService.getData().subscribe((node) => {
      this.isSpinning = true;

      //

      const isSame = _.isEqual(
        this.MSHI004DataListDeepClone[node.rowIndex],
        node.data
      );

      // 資料一樣，若之前有放到MSHI003PendingDataList之中則進行移除
      if (isSame) {
        const isSameIndex = this.MSHI004PendingDataList.findIndex(
          (data) => data === node.data
        );
        if (isSameIndex > -1) {
          this.MSHI004PendingDataList.splice(isSameIndex, 1);
        }
        this.isSpinning = false;
        return;
      }

      if (_.isEmpty(this.MSHI004PendingDataList)) {
        this.MSHI004PendingDataList.push(node.data);
        this.isSpinning = false;
        return;
      }

      // 判斷該筆資料是否已存在於this.MSHI003PendingDataList
      // 若存在則不需要再進行push
      const isExist = this.MSHI004PendingDataList.some(
        (data) => data === node.data
      );

      // 找不到同樣id的資料則進行push
      if (!isSame && !isExist) {
        this.MSHI004PendingDataList.push(node.data);
      }
      this.isSpinning = false;
    });
  }

  ngAfterViewInit(): void {
    this.getData();
  }

  public item: Array<any> = new Array<any>(); //因為會有多筆，先建一個any型別的陣列資料來接回傳值

  getData() {
    this.mshi004Service.getData().subscribe(
      (response: any) => {
        this.item = response;
        const { data } = response;
        console.log(
          '🚀 ~ file: MSHI004.component.ts:147 ~ MSHI004Component ~ getData ~ data:',
          data
        );
        this.MSHI004DataList = JSON.parse(data);
      },
      (error: HttpErrorResponse) => this.mshi004Service.HandleError(error)
    );
  }
  columnDefs: ColDef[] = [
    {
      headerName: 'MES群組',
      field: 'mesPublishGroup',
      width: 200,
      filter: true,
    },
    {
      headerName: '發佈MES天數',
      field: 'mesPublishTime',
      width: 200,
      editable: true,
      cellEditor: 'agLargeTextCellEditor',
      headerClass: 'header-editable-color',
      cellClass: 'cell-editable-color',
      cellEditorParams: {
        maxLength: 5,
        cols: '5',
        rows: '1',
      },
      onCellValueChanged: (event) => {
        if (_.isEmpty(event.newValue)) {
          event.data.comment = null;
        }

        this.dataTransferService.setData(event.node);
      },
    },
    { headerName: '工作站數', field: 'shopCode', width: 200, filter: true },
    { headerName: '機台數', field: 'equipCode', width: 200, filter: true },
    {
      headerName: '依PPS配置',
      field: 'ppsControl',
      width: 200,
      editable: true,
      cellEditor: 'agLargeTextCellEditor',
      headerClass: 'header-editable-color',
      cellClass: 'cell-editable-color',
      cellEditorParams: {
        maxLength: 5,
        cols: '5',
        rows: '1',
      },
      onCellValueChanged: (event) => {
        if (_.isEmpty(event.newValue)) {
          event.data.comment = null;
        }

        this.dataTransferService.setData(event.node);
      },
    },
  ];

  confirm(): void {
    if (_.isEmpty(this.MSHI004PendingDataList)) {
      this.message.error('尚無資料異動，無法儲存資料');
      this.isSpinning = false;
      return;
    }
    let missingNewEpst: MSHI004;
    let missingNewEpstFlag = this.MSHI004PendingDataList.some((element) => {
      missingNewEpst = element;
      console.log('jflsjflkdsjflk');

      return _.isNil(element.userCreate);
    });

    this.Modal.confirm({
      nzTitle: '是否確定儲存資料?',
      nzOnOk: () => {
        this.isSpinning = true;

        // 1.將需要新增的資料設定建立者名稱與廠區別
        // 2.將需要更新的資料設定異動者名稱
        this.MSHI004PendingDataList.forEach((item) => {
          if (_.isNil(item.id)) {
            console.log(this.id);
            item.id = this.id;
          }
        });

        new Promise<boolean>((resolve, reject) => {
          this.mshi004Service
            .batchInsertOrUpdateLDM(this.MSHI004PendingDataList)
            .subscribe(
              (res) => {
                if (res.code === 200) {
                  this.sucessMSG(res.message, res.message);
                  console.log(this.MSHI004PendingDataList);
                  console.log('fdfdfsfd');
                } else {
                  this.errorMSG(res.message, res.message);
                }
                resolve(true);
              },
              (error) => {
                this.errorMSG(
                  'EPST變更作業失敗',
                  `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error)}`
                );
                reject(true);
              }
            );
        })
          .then((success) => {
            this.MSHI004PendingDataList = [];
            this.getData();
            this.isSpinning = false;
          })
          .catch((error) => {
            this.MSHI004PendingDataList = [];
            this.getData();
            this.isSpinning = false;
          });
      },
      nzOnCancel: () => console.log('取消作業'),
    });
  }

  sucessMSG(_title, _plan): void {
    this.Modal.success({
      nzTitle: _title,
      nzContent: `${_plan}`,
    });
  }

  errorMSG(_title, _plan): void {
    this.Modal.error({
      nzTitle: _title,
      nzContent: `${_plan}`,
    });
  }
}
