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
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { PrimeDatePickerCellEditor } from './prime-date-picker-cell-editor';
import { CookieService } from 'src/app/services/config/cookie.service';
import { DataTransferService } from 'src/app/services/MSHI004/Data.transfer.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common/common.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ClipboardService } from 'ngx-clipboard';
import { ButtonComponent } from 'src/app/button/button.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';

class MSHI004Payload {
  fcpEdition: string;
  constructor(_fcpEdition: string) {
    this.fcpEdition = _fcpEdition;
  }
}

@Component({
  selector: 'app-MSHI004',
  templateUrl: './MSHI004.component.html',
  styleUrls: ['./MSHI004.component.css'],
  providers: [NzMessageService],
})
export class MSHI004Component {
  USERNAME; //

  isSpinning = false;

  shopCodeOfOption: string[] = [];
  // 使用者選中哪些站別
  shopCodeInputList: string;
  // 站別下拉是否正在載入選項
  shopCodeLoading = false;

  MSHI004DataList: MSHI004[] = [];

  MSHI004DataListDeepClone: MSHI004[] = [];

  // 存放待更新或新增的row資料
  MSHI004PendingDataList: MSHI004[] = [];

  payloadcache: MSHI004Payload;

  gridOptions = {
    defaultColDef: {
      sortable: false,
      resizable: true,
    },
    components: {
      primeDatePickerCellEditorComponent: PrimeDatePickerCellEditor,
    },
  };

  fieldStatus: string = '0';

  constructor(
    private mshi004Service: MSHI004Service,
    private Modal: NzModalService,
    private message: NzMessageService,
    private dataTransferService: DataTransferService,
    private cookieService: CookieService,
    private renderer: Renderer2,
    private commonService: CommonService,
    private clipboardApi: ClipboardService,
    private http: HttpClient
  ) {
    this.USERNAME = this.cookieService.getCookie('USERNAME');
    console.log(this.USERNAME);
    console.log('順利的話以上是user');

    this.dataTransferService.getData().subscribe((node) => {
      this.isSpinning = true;

      //

      const isSame = _.isEqual(
        this.MSHI004DataListDeepClone[node.rowIndex],
        node.data
      );

      // 資料一樣，若之前有放到MSHI004PendingDataList之中則進行移除
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

      // 判斷該筆資料是否已存在於this.MSHI004PendingDataList
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
    this.isButtonDisabled = this.fieldStatus === '1';
  }

  public item: Array<any> = new Array<any>(); //因為會有多筆，先建一個any型別的陣列資料來接回傳值

  // getData() {
  //   this.mshi004Service.getData().subscribe(
  //     (response: any) => {
  //       this.item = response;
  //       const { data } = response;
  //       console.log(
  //         '🚀 ~ file: MSHI004.component.ts:147 ~ MSHI004Component ~ getData ~ data:',
  //         data
  //       );
  //       this.MSHI004DataList = JSON.parse(data);
  //     },
  //     (error: HttpErrorResponse) => this.mshi004Service.HandleError(error)
  //   );
  // }

  isButtonDisabled: boolean = false;

  columnDefs: ColDef[] = [
    {
      headerName: 'MES群組',
      field: 'mesPublishGroup',
      width: 200,
      filter: true,
      onCellClicked: (e: CellClickedEvent) => this.onCellClicked(e),
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
    {
      headerName: '已配置機台數',
      field: 'publishMachine',
      width: 200,
      filter: true,
    },
    { headerName: '手動發佈', field: 'publishSelf', width: 200, filter: true },
    {
      headerName: '確認發佈',
      field: 'zxcvb',
      width: 200,
      filter: true,
      cellRenderer: ButtonComponent,
    },

    {
      headerName: '已發佈機台',
      field: 'publishMachineTotal',
      width: 200,
      filter: true,
    },
    {
      headerName: '已發佈FCP版本',
      field: 'fcpEdition',
      width: 200,
      filter: true,
    },
    {
      headerName: '發佈時間區間',
      field: 'timeRegion',
      width: 400,
      filter: true,
    },
  ];
  //點擊一下即可複製的功能
  onCellClicked(e: CellClickedEvent): void {
    console.log('=======>>>>cellClicked', e);
    const { value } = e;
    console.log('value:' + value);
    this.clipboardApi.copyFromContent(value);
    console.log('copyFromContent:' + value);
    console.log(`=[===>已複製: ${value} `);
    this.message.create('success', `MES群組已複製：${value} `);
  }

  confirm(isUserClick: boolean): void {
    if (_.isEmpty(this.MSHI004PendingDataList)) {
      this.message.error('尚無資料異動，無法儲存資料');
      this.isSpinning = false;
      return;
    }

    this.Modal.confirm({
      nzTitle: '是否確定儲存資料?',
      nzOnOk: () => {
        this.isSpinning = true;
        console.log(new MSHI004Payload(this.shopCodeInputList).fcpEdition);
        console.log('版本');
        console.log(this.MSHI004PendingDataList);

        for (var i = 0; i < this.MSHI004PendingDataList.length; i++) {
          this.MSHI004PendingDataList[i].fcpEdition = new MSHI004Payload(
            this.shopCodeInputList
          ).fcpEdition;
        }

        new Promise<boolean>((resolve, reject) => {
          this.mshi004Service
            .batchInsertOrUpdateLDM(this.MSHI004PendingDataList)
            .subscribe(
              (res) => {
                if (res.code === 200) {
                  this.sucessMSG(res.message, res.message);
                  console.log('以下是本次更新的資料');
                  console.log(this.MSHI004PendingDataList);
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

          //成功或失敗都釋放掉原先準備新增的資料
          .then((success) => {
            this.MSHI004PendingDataList = [];
            this.serachEPST(isUserClick);
            this.isSpinning = false;
          })
          .catch((error) => {
            this.MSHI004PendingDataList = [];
            // this.getData();
            this.isSpinning = false;
          });
        // this.getData();
      },
      nzOnCancel: () => console.log('取消作業'),
    });
  }

  serach(isUserClick: boolean): void {
    // 若存在編輯過的資料
    if (!_.isEmpty(this.MSHI004PendingDataList) && isUserClick) {
      this.Modal.confirm({
        nzTitle: '資料尚未儲存，是否放棄儲存執行搜尋?',

        nzOnOk: () => {
          this.serachEPST(isUserClick);
        },
        nzOnCancel: () => console.log('取消搜尋資料'),
      });
    } else {
      this.serachEPST(isUserClick);
    }
  }

  serachEPST(isUserClick: boolean): void {
    this.isSpinning = true;
    let payloads = null;

    if (isUserClick) {
      payloads = new MSHI004Payload(this.shopCodeInputList);
    } else {
      payloads = this.payloadcache;
    }

    if (_.isNil(payloads)) return;
    console.log(payloads + '==================');
    new Promise<boolean>((resolve, reject) => {
      this.mshi004Service.searchLdmData(payloads).subscribe(
        (res) => {
          const { code, data } = res;
          const myDataList = JSON.parse(data);
          console.log(
            '🚀 ~ file: MSHI004.component.ts:333 ~ MSHI004Component ~ serachEPST ~ myDataList:',
            myDataList
          );

          if (code === 200) {
            if (_.size(myDataList) > 0) {
              // xxxx.lenght
              /*
              let resultDataList: fcpdata[] = res.data.map((item) => {
                return new fcpdata(
                  item.pstMachineSum,
                  item.publishSelf,
                  item.pstMachine,
                  item.fcpDate
                );
              });
              */
              this.MSHI004DataList = myDataList;

              this.MSHI004DataListDeepClone = _.cloneDeep(this.MSHI004DataList);
            } else {
              this.message.success(res.message);
            }

            resolve(true);
          } else {
            this.message.error('後台錯誤，獲取不到EPST資料');
            reject(true);
          }
        },
        (error) => {
          this.errorMSG(
            '獲取EPST資料失敗',
            `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`
          );
          reject(true);
        }
      );
    })
      .then((success) => {
        this.payloadcache = payloads;
        this.MSHI004PendingDataList = [];
        this.isSpinning = false;
      })
      .catch((error) => {
        this.payloadcache = payloads;
        this.MSHI004PendingDataList = [];
        this.isSpinning = false;
      });
  }

  getFcpList(): void {
    this.shopCodeLoading = true;
    new Promise<boolean>((resolve, reject) => {
      this.mshi004Service.getFcpList().subscribe(
        (res) => {
          console.log(res);
          if (res.code === 200) {
            this.shopCodeOfOption = res.data;
            resolve(true);
          } else {
            this.message.error('後台錯誤，獲取不到站別清單');
            reject(true);
          }
        },
        (error) => {
          this.errorMSG(
            '獲取站別清單失敗',
            `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`
          );
          reject(true);
        }
      );
    })
      .then((success) => {
        this.shopCodeLoading = false;
      })
      .catch((error) => {
        this.shopCodeLoading = false;
      });
  }

  fcp(USERNAME: string): void {
    USERNAME = this.USERNAME;
    this.http
      .get<any>(
        `http://ys-ppsapt01.walsin.corp:8080/pps_FCP/rest/run/execute_FS?startPoint=ASAP&username=${USERNAME}`
      )
      .subscribe(
        (response) => {
          // 处理API响应
          console.log(response);
          console.log(USERNAME);
        },
        (error) => {
          // 处理API调用错误
          console.error(error);
        }
      );
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
