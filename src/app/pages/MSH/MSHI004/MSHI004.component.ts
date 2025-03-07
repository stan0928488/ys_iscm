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
import { MSHI004MACHINE } from './machine.model';
import { PPSService } from 'src/app/services/PPS/PPS.service';
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
  PLANTCODE;
  lock;
  mgroup;
  isRunFCP = false;

  isSpinning = false;

  shopCodeOfOption: string[] = [];
  // 使用者選中哪些站別
  shopCodeInputList: string;
  // 站別下拉是否正在載入選項
  shopCodeLoading = false;
  normData;
  shopCodeList: Array<String> = [];
  PickShopCode = [];
  now;
  end;
  normFcpEdition;

  publishStartTime;
  publishEndTime;

  normTime;

  normday = 10;

  forMo;
  moEdition;
  lpstStartDate;
  lpstEndDate;
  shopList;

  machineDataList: MSHI004MACHINE[] = [];
  machineDataListDeepClone: MSHI004MACHINE[] = [];

  MSHI004DataList: MSHI004[] = [];
  selectedMachines: string[] = [];
  mesData: string[] = [];

  MSHI004DataListDeepClone: MSHI004[] = [];

  // 存放待更新或新增的row資料
  MSHI004PendingDataList: MSHI004[] = [];

  payloadcache: MSHI004Payload;
  rtmesPublishTime: boolean = false;

  preMes;

  buttonStyle: string = `color: #fff;
    background-color: #1677ff;
    border-style: none;
    width: 80%;
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    line-height: 0 !important;
    background-color: #1677ff;
    height: 100%;
    border-radius: 3px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap; `;
  isVisibleConvert = false;
  gridOptions = {
    defaultColDef: {
      sortable: false,
      resizable: true,
      headerClass: 'ag-header-cell',
    },
    components: {
      primeDatePickerCellEditorComponent: PrimeDatePickerCellEditor,
    },
  };

  constructor(
    private getPPSService: PPSService,
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
    this.PLANTCODE = this.cookieService.getCookie('plantCode');

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

    this.getCellData();
    this.getMachineData();
  }

  async ngOnInit() {
    await this.getFcpList();
    for (let value of this.shopCodeOfOption) {
      if (value.indexOf('(鎖定)') >= 0) {
        this.shopCodeInputList = value;
        this.serach(true);
      }
    }
    this.fcpStart();
  }

  public item: Array<any> = new Array<any>(); //因為會有多筆，先建一個any型別的陣列資料來接回傳值

  columnDefs: ColDef[] = [];

  getCellData() {
    let _this = this;
    this.columnDefs = [
      {
        headerName: 'MES群組',
        field: 'mesPublishGroup',
        width: 100,
        onCellClicked: function (params): void {
          _this.mgroup = params.data.mesPublishGroup;
          _this.searchMachine(true);
        },
      },
      {
        headerName: '發佈MES天數',
        field: 'mesPublishTime',
        width: 100,
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
          if (event.data.ppsControl == 'Y' && event.data.mesPublishTime <= 45) {
            this.dataTransferService.setData(event.node);
          } else if (event.data.ppsControl == 'N') {
            this.dataTransferService.setData(event.node);
          } else {
            this.message.error('依PPS配置為Y時MES發佈天數不可超過45天');
            this.rtmesPublishTime = true;
          }
        },
      },
      { headerName: '工作站數', field: 'shopCode', width: 90 },
      { headerName: '機台數', field: 'equipCode', width: 90 },
      {
        headerName: '依PPS配置',
        field: 'ppsControl',
        width: 150,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        headerClass: 'header-editable-color',
        cellClass: 'cell-editable-color',
        headerTooltip: '預設執行45天 發版限制45天',
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
        width: 110,
      },
      {
        headerName: '確認發佈',
        field: 'zxcvb',
        width: 110,
        cellRenderer: function (params) {
          if (params.data.fcpEditionLock == '1') {
            if (
              params.data.equipCode == params.data.publishMachine &&
              params.data.mesPublishTime != null &&
              params.data.ppsControl != null &&
              params.data.mesPublishTime > 0
            ) {
              const buttonElement = _this.renderer.createElement('button');
              const buttonText = _this.renderer.createText('PUBLISH');
              _this.renderer.appendChild(buttonElement, buttonText);
              _this.renderer.addClass(buttonElement, 'button');
              _this.renderer.listen(buttonElement, 'click', () => {
                if (!_.isEmpty(_this.MSHI004PendingDataList)) {
                  _this.message.error('請先儲存資料');
                } else {
                  _this.buttonClicked(params.data);
                  // _this.aaa(params.data);
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
        headerName: '轉入公版',
        width: 110,
        cellRenderer: function (params) {
          if (
            params.data.machineGroup.includes('RF') ||
            params.data.machineGroup.includes('BA1')
          ) {
            const buttonElement = _this.renderer.createElement('button');
            const buttonText = _this.renderer.createText('RF or BA1');
            _this.renderer.appendChild(buttonElement, buttonText);
            _this.renderer.addClass(buttonElement, 'button');
            return buttonElement;
          } else if (
            params.data.fcpEditionLock == '1' &&
            params.data.equipCode == params.data.publishMachine
          ) {
            const buttonElement = _this.renderer.createElement('button');
            const buttonText = _this.renderer.createText('轉入公版');
            _this.renderer.appendChild(buttonElement, buttonText);
            _this.renderer.addClass(buttonElement, 'button');
            _this.renderer.listen(buttonElement, 'click', () => {
              if (!_.isEmpty(_this.MSHI004PendingDataList)) {
                _this.message.error('請先儲存資料');
              } else if (_this.isRunFCP == false) {
                _this.shopCodeList = [];
                _this.now = moment(_this.publishStartTime).format('YYYY-MM-DD');
                _this.end = moment(
                  moment(_this.publishStartTime).add(_this.normday, 'days')
                ).format('yyyy-MM-DD');
                _this.publishEndTime = moment(
                  moment(_this.publishStartTime).add(_this.normday, 'days')
                ).format('yyyy-MM-DD 23:59:59');

                _this.normTime = _this.now + '~' + _this.end;
                _this.isVisibleConvert = true;
                _this.normFcpEdition = _this.lock.fcpEdition.split('(')[0];
                let b = params.data.mesPublishGroup;
                _this.mgroup = b;
                _this.preMes = {
                  fcpEdition: _this.normFcpEdition,
                  mesPublishGroup: b,
                };
                _this.getShopCode();
                _this.fcpStart();
                // _this.buttonClicked(params.data);
                // _this.aaa(params.data);
              } else {
                const buttonElement = _this.renderer.createElement('button');
                const buttonText = _this.renderer.createText('FCP執行中');
                _this.renderer.appendChild(buttonElement, buttonText);
                _this.renderer.addClass(buttonElement, 'button');
                return buttonElement;
              }
            });
            return buttonElement;
          } else {
            const buttonElement = _this.renderer.createElement('button');
            const buttonText = _this.renderer.createText('未能轉入');
            _this.renderer.appendChild(buttonElement, buttonText);
            _this.renderer.addClass(buttonElement, 'button');
            return buttonElement;
          }
        },
      },
      {
        headerName: '公版天數',
        field: 'normPublishTime',
        width: 90,
      },
      {
        headerName: '已發佈機台',
        field: 'publishMachineTotal',
        width: 110,
      },
      {
        headerName: '已發佈FCP版本',
        field: 'fcpEdition',
        width: 160,
        onCellClicked: (e: CellClickedEvent) => this.onCellClicked(e),
      },
      {
        headerName: '發佈時間區間',
        field: 'timeRegion',
        width: 300,
      },
      {
        headerName: '發佈者',
        field: 'userCreate',
        width: 90,
      },
      {
        headerName: '發佈日期',
        field: 'mesPublishDay',
        width: 160,
      },
    ];
  }

  machine: ColDef[] = [];

  getMachineData() {
    this.machine = [
      {
        headerName: '站別',
        field: 'schShopCode',
        width: 150,
      },
      {
        headerName: '所有機台',
        field: 'pstMachine',
        width: 650,
        cellStyle: {
          'min-width': '120px',
        },
      },
      {
        headerName: '未配置機台',
        field: 'publishMachine',
        width: 650,
      },
    ];
  }
  downloadMachine(data: any) {
    let a = this.lock.fcpEdition.split('(')[0];
    let b = data.mesPublishGroup;
    this.mgroup = b;
    let downloadMes = {
      fcpEdition: a,
      mesPublishGroup: b,
    };
    new Promise<boolean>((resolve, reject) => {
      let lock_data = JSON.parse(JSON.stringify(downloadMes));
      this.isSpinning = true;
      let paramete = downloadMes.fcpEdition + '/' + downloadMes.mesPublishGroup;
      this.mshi004Service.downloadAutoData(paramete).subscribe((res) => {
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

  //點擊一下即可複製的功能
  onCellClicked(e: CellClickedEvent): void {
    const { value } = e;
    this.clipboardApi.copyFromContent(value);
    this.message.create('success', `MES群組已複製：${value} `);
  }

  buttonClicked(params: any) {
    let a = this.lock.fcpEdition;
    let b = params.mesPublishGroup;
    this.mgroup = b;
    this.preMes = {
      fcpEdition: a,
      mesPublishGroup: b,
    };
    this.isSpinning = true;
    new Promise<boolean>((resolve, reject) => {
      this.mshi004Service.getMesData(this.preMes).subscribe(
        (res) => {
          const { code, data } = res;
          const forMesData = JSON.parse(data);
          forMesData.forEach((obj) => {
            obj.publishType = '1';
          });
          if (code === 200) {
            if (_.size(forMesData) > 0) {
              this.mesData = forMesData;
              this.mshi004Service
                .sendSortedDataToMESBatch(this.mesData)
                .subscribe((res) => {
                  let result: any = res;
                  if (result.code === 200) {
                    this.message.success(result.message);
                    this.isSpinning = false;
                    resolve(true);
                  } else {
                    this.message.error(result.message);
                    this.isSpinning = false;
                    reject(true);
                  }
                });
            } else {
              this.mesData = [];
            }
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
      })
      .catch((error) => {
        this.mesData = [];
      });
  }

  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe((res: number) => {
      if (res > 0) this.isRunFCP = true;
    });
  }
  // aaa(params) {
  //   console.log('新增發佈者');
  //   let c = params.id;
  //   let d = this.USERNAME;
  //   let f = this.lock.fcpEdition;
  //   console.log(f);
  //   let user = {
  //     id: c,
  //     userCreate: d,
  //     fcpEdition: f,
  //   };
  //   console.log(user);
  //   new Promise<boolean>((resolve, reject) => {
  //     this.mshi004Service.publishData(user).subscribe(
  //       (res) => {
  //         const { code, data } = res;
  //         if (code === 200) {
  //           resolve(true);
  //         } else {
  //           reject(true);
  //         }
  //       },
  //       (error) => {
  //         this.errorMSG(
  //           '獲取資料失敗',
  //           `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`
  //         );
  //         reject(true);
  //       }
  //     );
  //   })
  //     .then((success) => {
  //       this.serachEPST(true);
  //       this.isSpinning = false;
  //     })
  //     .catch((error) => {
  //       this.isSpinning = false;
  //     });
  // }

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
    } else {
      payloads = this.payloadcache;
    }

    if (_.isNil(payloads)) return;
    new Promise<boolean>((resolve, reject) => {
      this.mshi004Service.searchLdmData(payloads).subscribe(
        (res) => {
          const { code, data } = res;
          const myDataList = JSON.parse(data);

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
            if (data == '0') {
              this.fcp(this.USERNAME);
              this.message.success('開始重啟fcp');
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
        this.forMo = response.FCP_EDITION;
        this.getMoData();
      },
      (error) => {
        // 处理API调用错误
        console.error(error);
      }
    );
    // this.mshi004Service.test().subscribe(
    //   (response) => {
    //     // 处理API响应
    //     console.log(response);
    //     this.forMo = response.FCP_EDITION;
    //     console.log(this.forMo);
    //     this.getMoData();
    //   },
    //   (error) => {
    //     // 处理API调用错误
    //     console.error(error);
    //   }
    // );
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

  searchMachine(isUserClick: boolean): void {
    this.isSpinning = true;
    let payloads = null;

    let a = this.lock.fcpEdition.split('(')[0];
    let b = this.mgroup;
    let preMachine = {
      fcpEdition: a,
      mesPublishGroup: b,
    };
    if (_.isNil(preMachine)) return;
    new Promise<boolean>((resolve, reject) => {
      this.mshi004Service.machineData(preMachine).subscribe(
        (res) => {
          const { code, data } = res;
          const myDataList = JSON.parse(data);
          console.log(
            '🚀 ~ file: MSHI004.component.ts:333 ~ MSHI004Component ~ serachEPST ~ myDataList:',
            myDataList
          );

          if (code === 200) {
            if (_.size(myDataList) > 0) {
              this.machineDataList = myDataList;
              this.machineDataListDeepClone = _.cloneDeep(this.machineDataList);
            } else {
              this.message.success('查無資料');
              this.machineDataList = [];
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
        this.machineDataListDeepClone = [];
        this.isSpinning = false;
      })
      .catch((error) => {
        this.machineDataListDeepClone = [];
        this.isSpinning = false;
      });
  }

  convertSubmit() {
    const a: Array<String> = [];
    this.normData = [];
    if (!_.isNil(this.PickShopCode)) {
      for (var i = 0; i < this.PickShopCode.length; i++) {
        const data = {
          fcpVer: this.normFcpEdition,
          shopCode: this.PickShopCode[i],
          planStartTime: this.publishStartTime,
          planEndTime: this.publishEndTime,
          mesPublishGroup: this.mgroup,
          publishType: '1',
        };
        this.normData.push(data);
      }
    } else {
      this.message.error('請選擇站別');
    }

    this.mshi004Service
      .sendAutoCampaignBatch(this.normData)
      .subscribe((res) => {
        let result: any = res;
        if (result.code === 200) {
          let norm = {
            mesPublishGroup: this.mgroup,
            normPublishTime: this.normday,
          };
          new Promise<boolean>((resolve, reject) => {
            this.mshi004Service.normTime(norm).subscribe(
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
          this.normData = [];
          this.PickShopCode = [];
          this.normday = 10;
          this.isSpinning = false;
          this.isVisibleConvert = false;
        } else {
          this.normData = [];
          this.PickShopCode = [];
          this.normday = 10;
          this.isSpinning = false;
          this.isVisibleConvert = false;
        }
        this.message.info(result.message);
      });
    this.isVisibleConvert = false;
  }
  convertCancel(): void {
    this.isVisibleConvert = false;
    this.normday = 10;
  }

  getShopCode() {
    new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;
      this.mshi004Service.getMesData(this.preMes).subscribe(
        (res) => {
          const { code, data } = res;
          const forMesData = JSON.parse(data);

          if (code === 200) {
            if (_.size(forMesData) > 0) {
              for (var i = 0; i < forMesData.length; i++) {
                this.shopCodeList.push(forMesData[i].shopCode);
              }
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
        this.isSpinning = false;
      })
      .catch((error) => {
        this.isSpinning = false;
      });
  }

  async fcpStart() {
    await new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;
      let a = this.lock.fcpEdition.split('(')[0];
      let data = {
        fcpEdition: a,
      };
      this.mshi004Service.fcpStart(data).subscribe(
        (res) => {
          const { code, data } = res;
          const forMesData = JSON.parse(data);
          if (code === 200) {
            if (_.size(forMesData) > 0) {
              for (var i = 0; i < forMesData.length; i++) {
                this.publishStartTime = forMesData[i].startDatetime;
              }
            } else {
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
        this.isSpinning = false;
      })
      .catch((error) => {
        this.isSpinning = false;
      });
  }
  clickShopCode(_value) {
    this.PickShopCode = _value.toString().split(',');
  }
  inputDay() {
    this.now = moment(this.publishStartTime).format('YYYY-MM-DD');
    this.end = moment(
      moment(this.publishStartTime).add(this.normday, 'days')
    ).format('yyyy-MM-DD');
    this.normTime = this.now + '~' + this.end;

    this.publishEndTime = moment(
      moment(this.publishStartTime).add(this.normday, 'days')
    ).format('yyyy-MM-DD 23:59:59');
  }

  async getMoData() {
    await new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;
      let predata = {
        fcpEdition: this.forMo,
      };
      this.mshi004Service.moData(predata).subscribe({
        next: (res) => {
          const { code, data } = res;
          const modata = JSON.parse(data);
          this.moEdition = modata[0].moEdition;
          this.lpstStartDate = JSON.parse(modata[0].plansetList).startDate;
          this.lpstEndDate = JSON.parse(modata[0].plansetList).endDate;
          this.shopList = JSON.parse(modata[0].plansetList).shop_code;
          this.isSpinning = false;
          // 在這裡處理 next 事件的邏輯
          resolve(true);
        },
        error: (error) => {
          this.isSpinning = false;
          // 在這裡處理 error 事件的邏輯
        },
      });
    }).then((success) => {
      // this.labSamplingRun();
      // this.getMESPassedWeight();
      // this.getMESFinishedProduct();
      // this.getMESIsToShip();
      // this.getMESGoodsReceipt();
      // this.getMESrollOverOrder();
      // this.getMESwipChange();
      this.runRepoData();
      console.log('hiiiiiiiiiiiiiiiiiiiiiiiii');
    });
  }
  labSamplingRun() {
    new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;

      this.mshi004Service
        .labSamplingRun(this.moEdition, this.PLANTCODE, this.USERNAME)
        .subscribe({
          next: (res) => {
            this.isSpinning = false;
            resolve(true);
            // 在這裡處理 next 事件的邏輯
          },
          error: (error) => {
            this.isSpinning = false;
            // 在這裡處理 error 事件的邏輯
          },
        });
    })
      .then((success) => {
        this.message.success('實驗室工時計算完成');
      })
      .catch((error) => {
        this.message.error('實驗室工時計算失敗');
      });
  }

  getMESPassedWeight() {
    new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;

      this.mshi004Service.getMESPassedWeight(this.moEdition).subscribe({
        next: (res) => {
          this.isSpinning = false;
          resolve(true);
          // 在這裡處理 next 事件的邏輯
        },
        error: (error) => {
          this.isSpinning = false;
          // 在這裡處理 error 事件的邏輯
        },
      });
    })
      .then((success) => {
        this.message.success('已過機量取得完成');
      })
      .catch((error) => {
        this.message.error('已過機量取得失敗');
      });
  }

  getMESFinishedProduct() {
    new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;

      this.mshi004Service.getMESFinishedProduct(this.moEdition).subscribe({
        next: (res) => {
          this.isSpinning = false;
          resolve(true);
          // 在這裡處理 next 事件的邏輯
        },
        error: (error) => {
          this.isSpinning = false;
          // 在這裡處理 error 事件的邏輯
        },
      });
    })
      .then((success) => {
        this.message.success(
          '出貨計畫表(成品/半成品庫存現況)取得 mes 成品完成'
        );
      })
      .catch((error) => {
        this.message.error('出貨計畫表(成品/半成品庫存現況)取得 mes 成品失敗');
      });
  }

  getMESIsToShip() {
    new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;

      this.mshi004Service.getMESIsToShip(this.moEdition).subscribe({
        next: (res) => {
          this.isSpinning = false;
          resolve(true);
          // 在這裡處理 next 事件的邏輯
        },
        error: (error) => {
          this.isSpinning = false;
          // 在這裡處理 error 事件的邏輯
        },
      });
    })
      .then((success) => {
        this.message.success('出貨計畫表(出貨移轉統計表)取得 mes 已出貨完成');
      })
      .catch((error) => {
        this.message.error('出貨計畫表(出貨移轉統計表)取得 mes 已出貨失敗');
      });
  }

  getMESGoodsReceipt() {
    new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;

      this.mshi004Service.getMESGoodsReceipt(this.moEdition).subscribe({
        next: (res) => {
          this.isSpinning = false;
          resolve(true);
          // 在這裡處理 next 事件的邏輯
        },
        error: (error) => {
          this.isSpinning = false;
          // 在這裡處理 error 事件的邏輯
        },
      });
    })
      .then((success) => {
        this.message.success('取得 MES已入庫量完成');
      })
      .catch((error) => {
        this.message.error('取得 MES已入庫量失敗');
      });
  }
  getMESrollOverOrder() {
    new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;

      this.mshi004Service.getMESrollOverOrder(this.moEdition).subscribe({
        next: (res) => {
          this.isSpinning = false;
          resolve(true);
          // 在這裡處理 next 事件的邏輯
        },
        error: (error) => {
          this.isSpinning = false;
          // 在這裡處理 error 事件的邏輯
        },
      });
    })
      .then((success) => {
        this.message.success('取得 MES月初庫存訂單結轉完成');
      })
      .catch((error) => {
        this.message.error('取得 MES月初庫存訂單結轉失敗');
      });
  }
  getMESwipChange() {
    new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;

      this.mshi004Service.getMESwipChange(this.moEdition).subscribe({
        next: (res) => {
          this.isSpinning = false;
          resolve(true);
          // 在這裡處理 next 事件的邏輯
        },
        error: (error) => {
          this.isSpinning = false;
          // 在這裡處理 error 事件的邏輯
        },
      });
    })
      .then((success) => {
        this.message.success('取得 MES入庫儲區異動完成');
      })
      .catch((error) => {
        this.message.error('取得 MES入庫儲區異動失敗');
      });
  }

  runRepoData() {
    new Promise<boolean>((resolve, reject) => {
      this.isSpinning = true;

      this.mshi004Service
        .runRepoData(
          this.forMo,
          this.moEdition,
          this.lpstStartDate,
          this.lpstEndDate,
          this.shopList,
          this.USERNAME
        )
        .subscribe({
          next: (res) => {
            this.isSpinning = false;
            resolve(true);
            // 在這裡處理 next 事件的邏輯
          },
          error: (error) => {
            this.isSpinning = false;
            // 在這裡處理 error 事件的邏輯
          },
        });
    })
      .then((success) => {
        this.message.success('FCP計算結束階段完成');
      })
      .catch((error) => {
        this.message.error('FCP計算結束階段失敗');
      });
  }
}
