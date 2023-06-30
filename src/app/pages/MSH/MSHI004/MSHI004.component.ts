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
import { __param } from 'tslib';

class MSHI004Payload {
  fcpEdition: string;
  constructor(_fcpEdition: string) {
    this.fcpEdition = _fcpEdition;
  }
}

class forMes {
  fcpVer: string;
  shopCode: string;
  equipCode: string;
  constructor(_fcpVer: string, _shopCode: string, _equipCode: string) {
    this.fcpVer = _fcpVer;
    this.shopCode = _shopCode;
    this.equipCode = _shopCode;
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
  lock;
  mgroup;

  isSpinning = false;

  shopCodeOfOption: string[] = [];
  // 使用者選中哪些站別
  shopCodeInputList: string;
  // 站別下拉是否正在載入選項
  shopCodeLoading = false;

  MSHI004DataList: MSHI004[] = [];
  mesData: string[] = [];

  MSHI004DataListDeepClone: MSHI004[] = [];

  // 存放待更新或新增的row資料
  MSHI004PendingDataList: MSHI004[] = [];

  payloadcache: MSHI004Payload;

  buttonStyle: string = `color: #fff;
    background-color: #1677ff;
    border-style: none;
    width: 60%;
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    line-height: 0 !important;
    width: 60%;
    background-color: #1677ff;
    height: 100%;
    border-radius: 3px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap; `;

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

    this.dataTransferService.getData().subscribe((node) => {
      this.isSpinning = true;

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

    this.getCellData();
  }

  async ngOnInit() {
    console.log('預載入');
    await this.getFcpList();
    for (let value of this.shopCodeOfOption) {
      if (value.indexOf('(鎖定)') >= 0) {
        this.shopCodeInputList = value;
        this.serach(true);
      }
    }
  }

  public item: Array<any> = new Array<any>(); //因為會有多筆，先建一個any型別的陣列資料來接回傳值

  isButtonDisabled: boolean = false;

  columnDefs: ColDef[] = [];

  getCellData() {
    let _this = this;
    this.columnDefs = [
      {
        headerName: 'MES群組',
        field: 'mesPublishGroup',
        width: 150,
        filter: true,
        onCellClicked: (e: CellClickedEvent) => this.onCellClicked(e),
      },
      {
        headerName: '發佈MES天數',
        field: 'mesPublishTime',
        width: 150,
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
      { headerName: '工作站數', field: 'shopCode', width: 120, filter: true },
      { headerName: '機台數', field: 'equipCode', width: 120, filter: true },
      {
        headerName: '依PPS配置',
        field: 'ppsControl',
        width: 200,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        headerClass: 'header-editable-color',
        cellClass: 'cell-editable-color',
        cellEditorParams: {
          values: ['Y', 'N'],
        },

        onCellValueChanged: (event) => {
          if (_.isEmpty(event.newValue)) {
            event.data.comment = null;
          }
          if (event.data.ppsControl == 'Y') {
            if (
              event.data.machineGroup.includes('RF') ||
              event.data.machineGroup.includes('BA1')
            ) {
              this.message.info('機台包含RF或BA1');
              event.api.undoCellEditing();
              event.node.setDataValue('ppsControl', 'N');
            }
          }
          this.dataTransferService.setData(event.node);
        },
        cellRenderer: function (params) {
          const containerElement = _this.renderer.createElement('div');
          const labelElement = _this.renderer.createElement('label');
          _this.renderer.setAttribute(labelElement, 'value', '');
          labelElement.textContent = params.data.ppsControl;
          _this.renderer.appendChild(containerElement, labelElement);

          if (
            params.data.ppsControl == 'Y' &&
            params.data.equipCode != params.data.publishMachine &&
            params.data.fcpEditionLock == '1'
          ) {
            const labelElement2 = _this.renderer.createElement('label');
            labelElement2.textContent = '　';
            _this.renderer.appendChild(containerElement, labelElement2);

            const buttonElement1 = _this.renderer.createElement('button');
            const buttonText = _this.renderer.createText('排程計算');
            _this.renderer.appendChild(buttonElement1, buttonText);
            _this.renderer.addClass(buttonElement1, 'buttonCheck');
            _this.renderer.listen(buttonElement1, 'click', () => {
              if (!_.isEmpty(_this.MSHI004PendingDataList)) {
                _this.message.error('請先儲存資料');
              } else {
                _this.downloadMachine(params.data);
              }
            });
            _this.renderer.appendChild(containerElement, buttonElement1);
          }

          return containerElement;
        },
      },
      {
        headerName: '已配置機台數',
        field: 'publishMachine',
        width: 150,
        filter: true,
      },
      {
        headerName: '手動發佈',
        field: 'publishSelf',
        width: 200,
        filter: true,
        hide: true,
      },
      {
        headerName: '確認發佈',
        field: 'zxcvb',
        width: 160,
        filter: true,
        cellRenderer: function (params) {
          if (params.data.fcpEditionLock == '1') {
            if (params.data.equipCode == params.data.publishMachine) {
              const buttonElement = _this.renderer.createElement('button');
              const buttonText = _this.renderer.createText('PUBLISH');
              _this.renderer.appendChild(buttonElement, buttonText);
              _this.renderer.addClass(buttonElement, 'button');
              _this.renderer.listen(buttonElement, 'click', () => {
                if (!_.isEmpty(_this.MSHI004PendingDataList)) {
                  _this.message.error('請先儲存資料');
                } else {
                  _this.buttonClicked(params.data);
                  _this.aaa(params.data);
                }
              });
              return buttonElement;
            } else if (
              params.data.mesPublishTime == null ||
              params.data.mesPublishTime < 1 ||
              params.data.ppsControl == null
            ) {
              const buttonElement = _this.renderer.createElement('button');
              const buttonText = _this.renderer.createText('群組未設置');
              _this.renderer.appendChild(buttonElement, buttonText);
              _this.renderer.addClass(buttonElement, 'button');
              return buttonElement;
            } else {
              const buttonElement = _this.renderer.createElement('button');
              const buttonText = _this.renderer.createText('數量不一致');
              _this.renderer.appendChild(buttonElement, buttonText);
              _this.renderer.addClass(buttonElement, 'button');

              //   _this.renderer.listen(buttonElement, 'click', () => {
              //     _this.buttonClicked(params.data);
              //     _this.aaa(params.data);
              //   });

              return buttonElement;
            }
          } else {
            const buttonElement = _this.renderer.createElement('button');
            const buttonText = _this.renderer.createText('非鎖定版');
            _this.renderer.appendChild(buttonElement, buttonText);
            _this.renderer.addClass(buttonElement, 'button');
            return buttonElement;
          }
        },
      },

      {
        headerName: '已發佈機台',
        field: 'publishMachineTotal',
        width: 120,
        filter: true,
      },
      {
        headerName: '已發佈FCP版本',
        field: 'fcpEdition',
        width: 180,
        filter: true,
      },
      {
        headerName: '發佈時間區間',
        field: 'timeRegion',
        width: 350,
        filter: true,
      },
      {
        headerName: '發佈者',
        field: 'userCreate',
        width: 120,
        filter: true,
      },
      {
        headerName: '發佈日期',
        field: 'mesPublishDay',
        width: 200,
        filter: true,
      },
    ];
  }
  downloadMachine(data: any) {
    new Promise<boolean>((resolve, reject) => {
      console.log(1);
      let lock_data = JSON.parse(JSON.stringify(this.lock)).fcpEdition.split(
        '('
      )[0];
      console.log(lock_data);
      this.isSpinning = true;
      this.mshi004Service.downloadAutoData(lock_data).subscribe((res) => {
        let result: any = res;
        let message = result.message;
        this.message.info(message);
        this.serachEPST(true);
      });
    })
      .then((success) => {
        this.isSpinning = false;
      })
      .catch((error) => {
        this.isSpinning = false;
      });
  }

  nzOnOk: () => {};
  //點擊一下即可複製的功能
  onCellClicked(e: CellClickedEvent): void {
    console.log('=======>>>>cellClicked', e);
    const { value } = e;
    console.log('value:' + value);
    this.clipboardApi.copyFromContent(value);
    console.log('copyFromContent:' + value);
    console.log(`====>已複製: ${value} `);
    this.message.create('success', `MES群組已複製：${value} `);
  }

  buttonClicked(params: any) {
    console.log('呼叫PUBLISH API');
    let a = this.lock.fcpEdition;
    let b = params.mesPublishGroup;
    this.mgroup = b;
    let preMes = {
      fcpEdition: a,
      mesPublishGroup: b,
    };
    console.log(preMes);
    new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;
      this.mshi004Service.getMesData(preMes).subscribe(
        (res) => {
          const { code, data } = res;
          console.log(code);
          const forMesData = JSON.parse(data);
          console.log(forMesData);
          console.log('forMes');
          if (code === 200) {
            if (_.size(forMesData) > 0) {
              this.mesData = forMesData;
              this.mshi004Service
                .sendSortedDataToMESBatch(this.mesData)
                .subscribe((res) => {
                  let result: any = res;
                  if (result.code === 200) {
                    this.message.success(result.message);
                    resolve(true);
                    this.isSpinning = false;
                  } else {
                    this.message.error(result.message);
                    reject(true);
                    this.isSpinning = false;
                  }
                });
            } else {
              this.mesData = [];
            }
            this.isSpinning = false;
            resolve(true);
          } else {
            reject(true);
          }
        },
        (error) => {
          this.errorMSG(
            '獲取資料失敗',
            `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`
          );
          reject(true);
        }
      );
    })
      .then((success) => {
        this.mesData = [];
        this.isSpinning = false;
      })
      .catch((error) => {
        this.mesData = [];
        this.isSpinning = false;
      });
  }

  aaa(params) {
    console.log('新增發佈者');
    let c = params.id;
    let d = this.USERNAME;
    let f = this.lock.fcpEdition;
    console.log(f);
    let user = {
      id: c,
      userCreate: d,
      fcpEdition: f,
    };
    console.log(user);
    new Promise<boolean>((resolve, reject) => {
      this.mshi004Service.publishData(user).subscribe(
        (res) => {
          const { code, data } = res;
          if (code === 200) {
            resolve(true);
          } else {
            reject(true);
          }
        },
        (error) => {
          this.errorMSG(
            '獲取資料失敗',
            `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`
          );
          reject(true);
        }
      );
    })
      .then((success) => {
        this.serachEPST(true);
        this.isSpinning = false;
      })
      .catch((error) => {
        this.isSpinning = false;
      });
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

        // 校驗 如果機台有RF、BA1且依PPS配置=Y，就不可以儲存

        for (var i = 0; i < this.MSHI004PendingDataList.length; i++) {
          this.MSHI004PendingDataList[i].fcpEdition = new MSHI004Payload(
            this.shopCodeInputList
          ).fcpEdition;
          this.mgroup = this.MSHI004PendingDataList[i].mesPublishGroup;
        }
        // for (var i = 0; i < this.MSHI004PendingDataList.length; i++) {
        //   this.MSHI004PendingDataList[i].userCreate = this.USERNAME;
        // }

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
            this.isSpinning = false;
          });
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
      this.lock = payloads;
      // console.log(this.lock.fcpEdition);
      // console.log('以上是fcp版本');
    } else {
      payloads = this.payloadcache;
    }

    if (_.isNil(payloads)) return;
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
              this.MSHI004DataList = myDataList;
              this.MSHI004DataListDeepClone = _.cloneDeep(this.MSHI004DataList);
            } else {
              this.message.success('查無資料');
              this.MSHI004DataList = [];
            }

            resolve(true);
          } else {
            this.message.error('後台錯誤，獲取不到資料');
            reject(true);
          }
        },
        (error) => {
          this.errorMSG(
            '獲取資料失敗',
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

  async getFcpList(): Promise<void> {
    this.shopCodeLoading = true;
    await new Promise<boolean>((resolve, reject) => {
      this.mshi004Service.getFcpList().subscribe(
        (res) => {
          console.log(res);
          if (res.code === 200) {
            this.shopCodeOfOption = res.data;
            // this.MSHI004DataList.forEach((item, index, array) => {
            //   if (this.shopCodeInputList.includes('鎖定')) {
            //     this.MSHI004DataList[index].fcpEditionLock;
            //   }
            // });
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
  runFcp(): void {
    new Promise<boolean>((resolve, reject) => {
      this.mshi004Service.runFcp().subscribe(
        (res) => {
          const { code, data } = res;
          const myDataList = JSON.parse(data);
          if (res.code === 200) {
            console.log(data);
            if (data == '0') {
              this.fcp(this.USERNAME);
              this.message.success('開始重啟fcp');
              console.log(this.USERNAME);
              console.log('成功');
            } else {
              this.message.error('FCP正在執行');
            }
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
    this.mshi004Service.getReRunFcp(USERNAME).subscribe(
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
