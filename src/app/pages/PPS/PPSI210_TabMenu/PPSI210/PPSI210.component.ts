import { Component, AfterViewInit, NgZone, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'src/app/services/config/cookie.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
//import { zh_TW, NzI18nService, NzMessageService, NzModalService  } from "ng-zorro-antd";
import { zh_TW, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { OpenSortRendererComponent } from './open-sort-renderer-component';
import { SendChoiceRendererComponent } from './send-choice-renderer-component';
import { firstValueFrom } from 'rxjs';
import { OpenMachineRendererComponent } from './open-machine-renderer-component';
import { ConfigService } from 'src/app/services/config/config.service';
import { Router } from '@angular/router';
import { FcpStatusWebSocketStomp } from 'src/app/services/webSocket/FcpSatusWebSocketStomp';
@Component({
  selector: 'app-PPSI210',
  templateUrl: './PPSI210.component.html',
  styleUrls: ['./PPSI210.component.scss'],
  providers: [NzMessageService],
})
export class PPSI210Component implements OnInit, AfterViewInit, OnDestroy {
  planSetLoading = false; // 現有規劃策略明細表是否載入中
  shopSortLoading = false; // 站別優先順序明細表是否載入中
  machineSortLoading = false // 站別機台優先順序明細表是否載入中
  loading = false; //loaging data flag
  isRunFCP = false; // 如為true則不可異動
  isSpinning = false;
  isVisibleSorting = false; // 站別優先順序明細表
  isVisibleMachine = false; // 站別機台優先順序明細表
  isVisibleSelPlanSet = false; // 現有規劃策略明細表
  isVisibleSetMachine = false; // 機台優先順序設定表
  datetime = moment();

  plansetinitList; //原始欄位
  planSetDataList; // 套餐選擇清單
  ShopSortingList; // 挑選排序
  tmpArr;
  MachineSortingList; // 挑選排序
  planSetSort; // 套餐優先順序(下拉條件)
  planSetSortList; // 套餐優先順序(所有清單資料)
  CHOICE_plansetlist; // 選定的套餐內容
  CHOICE_shop_code; // 選定的優先順序--站別
  CHOICE_machine; // 選定的優先順序--機台
  CHOICE_sort; // 選定的優先順序--排序
  cellsort; // 站別, 機台

  PLANSET_EDITION; //版本
  setValue; //套餐
  KEEP_PLANSETVER;
  KEEP_A_SETNAME;
  A_SETNAME;
  B_SETNAME;
  AJValue; //ASAP/JIT
  MOValue; //MO 平衡搬移順序
  cellValue; //Cell處理順序
  nextshopValue; //相臨站別平衡策略
  machineValue; //機台平衡策略
  FROZAN_GROUP; //FCP下站天數

  pickerShopList; //挑選排序-站別
  pickerMachineList; //挑選排序-機台
  pickerSortingList; //挑選排序-sorting
  machienList; //帶入機台優先順序
  realMachineList = []; //實際存入機台排序
  ShopValue;
  USERNAME;
  values1;
  values2;

  SHOP_CODE; //站別
  SORTING; //排序
  befcode; //計算上筆站別
  nowcode; //計算本筆站別
  ShopList; //站別下拉清單
  MachineList; //站別下拉清單
  SortList; //優先順序下拉清單
  MachineSortList; //機台優先順序下拉清單
  REQUIREList; //站別集批條件
  pickerREQUIREList; //挑選站別集批條件

  dtlSHOP_CODE; //機台優先順序站別

  moSortListOfOption : any[] = []; // MO站別搬移順序選項
  moSortListOfOptionLoading = false; // MO站別搬移順序載入狀態

  // 使用者是否有選擇檢視已存在的策略
  isChooseStrategy = false;

  // 工廠別
  plant = '直棒'

  // 更新FCP執行狀態的web socket
  fcpStatusWebSocketStomp : FcpStatusWebSocketStomp = null;

  i = 1;
  j = 1;
  editId: string | null = null;
  dtleditId: string | null = null;
  listOfData: any[] = [];
  listOfData_dtl: any[] = [];

  nzPagination: any;

  gridApi : GridApi;
  gridColumnApi : ColumnApi;
  agGridContext : any;

  planSetColumnDefs: ColDef[] = [
    { 
      headerName:'點選', 
      field:'choice',
      pinned: 'left', 
      width: 80,
      cellRenderer: SendChoiceRendererComponent
    },
    { 
      headerName:'策略版本', 
      field:'PLANSET_EDITION',
      pinned: 'left',  
    },
    { 
      headerName:'策略名稱', 
      field:'SETNAME',
      pinned: 'left', 
    },
    { 
      headerName:'Initial PST', 
      field:'INITIALFLAG', 
    },
    { 
      headerName:'MO平衡搬移順序', 
      field:'MOSORTNA',
    },
    { 
      headerName:'Cell處理順序', 
      field:'CELLSORTNA',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'相臨站別平衡策略', 
      field:'NEXTSHOPSORTNA',
      hide: true
    },
    { 
      headerName:'機台平衡策略', 
      field:'MACHINESORTNA',
      hide: true,
    },
    { 
      headerName:'站別策略設定',
      field:'action', 
      cellRenderer: OpenSortRendererComponent,
    }
  ];

  // 站別優先順序明細表ColumnDefs
  shopSortingColumnDefs: ColDef[] = [
    { 
      headerName:'站別',
      field:'SCH_SHOP_CODE',
      width:80,
      headerClass:'wrap-header-Text',
    },
    { 
      headerName:'規劃優先順序',
      field:'SORTING_SEQ',
      width:180,
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'集批天數',
      field:'INTERVAL',
      width:105,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'集批條件',
      field:'REQUIREMENT',
      width:110,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'COMBINE執行',
      field:'ISCOMBINE',
      width:120,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'交期範圍(單位:月)',
      field:'COMBINE_RANGE',
      width:120,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'指定平衡設定',
      field:'MO_SORT',
      width:110,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text',
      valueFormatter : (params: ValueFormatterParams) : string => {
        let formatValue = null;
        this.moSortListOfOption.some(item =>{
          if(item.method === params.value) {
            formatValue = item.notesChinese;
            return true;
          }
        }); 
        return formatValue;
      }
    },
    { 
      headerName:'平移日期-起',
      field:'OFFLOAD_DATE_START',
      width:110,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text',
      valueFormatter : (params: ValueFormatterParams) : string => {
        if(_.isNil(params.value)){
          return moment().format('YYYY-MM-DD');
        }
      }
    },
    { 
      headerName:'平移日期-迄',
      field:'OFFLOAD_DATE_END',
      width:110,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text',
      valueFormatter : (params: ValueFormatterParams) : string => {
        if(_.isNil(params.value)){
          return moment().format('YYYY-MM-DD');
        }
      }
    },
    { 
      headerName:'Action',
      field:'action',
      width:95,
      headerClass:'wrap-header-Text',
      cellRenderer: OpenMachineRendererComponent
    }
  ];

  // 站別機台優先順序明細表ColumnDefs
  machineSortingColumnDefs : ColDef[] = [
    { 
      headerName:'站別',
      field:'SCH_SHOP_CODE_D2',
      width:80,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'機台',
      field:'MACHINE',
      width:80,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'規劃優先順序',
      field:'SORTING_SEQ_D2',
      width:200,
      cellClass:'wrap-cell-Text',
    },
    { 
      headerName:'集批天數',
      field:'INTERVAL_D2',
      width:105,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'集批條件',
      field:'REQUIREMENT_D2',
      width:150,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'COMBINE執行',
      field:'ISCOMBINE_D2',
      width:120,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    },
    { 
      headerName:'交期範圍(單位:月)',
      field:'COMBINE_RANGE_D2',
      width:120,
      headerClass:'wrap-header-Text',
      cellClass:'wrap-cell-Text'
    }
  ];

  gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: false,
      resizable: true,
      autoHeight: true,
    }
  };

  constructor(
    private getPPSService: PPSService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private configService: ConfigService,
    private router: Router,

  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie('USERNAME');
    this.agGridContext = {
      componentParent: this,
    };
    this.fcpStatusWebSocketStomp = new FcpStatusWebSocketStomp(this.configService, this.router, this.plant);
  }
  ngOnDestroy(): void {
    if(!_.isNil(this.fcpStatusWebSocketStomp)){
      this.fcpStatusWebSocketStomp.disconnect();
    }
  }

  async ngAfterViewInit() {
    console.log('ngAfterViewChecked');
    try{
      this.isSpinning = true;
      // 接收後端FCP開始執行與執行結束的通知
      await this.fcpStatusWebSocketStomp.connect();
      this.fcpStatusWebSocketStomp.getMessages().subscribe( message => {
        console.log("--直棒收到後端FCP執行狀態的通知--");
        this.getRunFCPCount();
      });
    }
    catch(error){
      this.errorMSG("伺服器異常", "已失去與FCP執行狀態更新的連線，請稍後重試重新整理頁面");
      this.fcpStatusWebSocketStomp.noAutoReconnectUserHandler();
    }
    finally{
      this.isSpinning = false;
    }
    this.getPickerShopData(0);
    this.getRunFCPCount();
    await this.getMoSortList();
  }

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe((res) => {
      console.log('getRunFCPCount success');
      if (res > 0) this.isRunFCP = true;
      else this.isRunFCP = false;
    });
  }

  //Get Data
  getPlanSetInitstData() {
    this.loading = true;
    console.log('getPlanSetInitstData...');

    let myObj = this;
    this.getPPSService.getPlanSetInitstData().subscribe((res) => {
      console.log('getPlanSetInitstData success');
      this.plansetinitList = res;
      this.PLANSET_EDITION = this.plansetinitList[0].PLANSET_EDITION;
      this.KEEP_PLANSETVER = this.plansetinitList[0].PLANSET_EDITION;
      this.setValue = 'A';
      this.KEEP_A_SETNAME = this.plansetinitList[0].SETNAME;
      this.A_SETNAME = this.plansetinitList[0].SETNAME;
      this.AJValue = this.plansetinitList[0].INITIALFLAG;
      this.MOValue = this.plansetinitList[0].MOSORT;
      this.cellValue = this.plansetinitList[0].CELLSORT;
      this.nextshopValue = this.plansetinitList[0].NEXTSHOPSORT;
      this.machineValue = this.plansetinitList[0].MACHINESORT;
      this.FROZAN_GROUP = this.plansetinitList[0].FROZAN_GROUP;

      let initdata = [];
      for (let i = 0; i < this.plansetinitList.length; i++) {
        const id = i;
        const SHOP_CODE = this.plansetinitList[i].SCH_SHOP_CODE;
        const SORTING = this.plansetinitList[i].SORTING_SEQ;
        const INTERVAL = this.plansetinitList[i].INTERVAL;
        var REQUIREMENT = this.plansetinitList[i].REQUIREMENT;
        const ISCOMBINE = this.plansetinitList[i].ISCOMBINE;
        const COMBINE_RANGE = this.plansetinitList[i].COMBINE_RANGE;

        if (REQUIREMENT === undefined) {
          REQUIREMENT = `　`;
        }
        initdata.push({
          id,
          SHOP_CODE,
          SORTING,
          INTERVAL,
          REQUIREMENT,
          ISCOMBINE,
          COMBINE_RANGE,
        });
      }
      this.listOfData = initdata;
      myObj.loading = false;
    });
  }

  // 撈取 sorting 表中的站別
  getPickerShopData(_idx) {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getPickerShopData(this.plant).subscribe((res) => {
      console.log('getPickerShopData success');
      this.pickerShopList = JSON.parse(res.data);
      const SchShopCode = [];
      this.listOfData[_idx].SORTING = '';
      this.listOfData[_idx].REQUIREMENT = '';
      for (let i = 0; i < this.pickerShopList.length; i++) {
        SchShopCode.push(this.pickerShopList[i].SCH_SHOP_CODE);
      }
      var newSchShopCode = SchShopCode.filter(function (element, index, arr) {
        // 排除重複資料
        return arr.indexOf(element) === index;
      });

      this.ShopList = newSchShopCode;
      myObj.loading = false;
    });
  }
  // 撈取 sorting 表中的機台 by 站別
  // _type: C = 點選下拉； Q = 查詢帶值<不清空sorting>F
  getPickerMachineData(_shop, _idx, _type) {
    this.loading = true;
    let myObj = this;
    this.getPPSService.getPickerMachineData(this.plant, _shop).subscribe((res) => {
      console.log('getPickerMachineData success');
      this.pickerMachineList = JSON.parse(res.data);
      const machine = [];

      if (_type === 'C') this.listOfData_dtl[_idx].dtlSORTING = ''; // 下拉機台清空sorting

      for (let i = 0; i < this.pickerMachineList.length; i++) {
        machine.push(this.pickerMachineList[i].MACHINE);
      }
      var newMachine = machine.filter(function (element, index, arr) {
        // 排除重複資料
        return arr.indexOf(element) === index;
      });

      this.MachineList = newMachine;
      myObj.loading = false;
    });
  }
  // 優先順序下拉資料 by 站別
  provinceChange(_type, _shopcode, _machine, _idx): void {
    let newtype;
    if (_type.length > 1) {
      newtype = _type.substring(0, 1); // 判斷為從後台帶入的資料，不可將集批條件清空
    } else {
      newtype = _type;
    }
    if (_shopcode === undefined || _shopcode === '　' || _shopcode === '') {
      this.message.create('error', '請先拉選「站別」');
      return;
    } else {
      if (
        (_machine === undefined || _machine === '　' || _machine === '') &&
        _type === '2'
      ) {
        this.message.create('error', '請先拉選「機台」');
        return;
      } else {
        this.getPPSService
          .getPickerSortData(this.plant, _shopcode, _machine)
          .subscribe((res) => {
            console.log('getPickerSortData success');
            this.pickerSortingList = JSON.parse(res.data);

            if (newtype === '1') {
              let Sorting = [];
              this.SortList = [];
              if (_type.length === 1) {
                this.listOfData[_idx].REQUIREMENT = '';
              }
              for (let i = 0; i < this.pickerSortingList.length; i++) {
                Sorting.push(this.pickerSortingList[i].DATALIST);
              }
              this.SortList = [...Sorting];
            } else if (newtype === '2') {
              let MachineSorting = [];
              this.MachineSortList = [];
              if (_type.length === 1) {
                this.listOfData_dtl[_idx].dtlREQUIREMENT = '';
              }
              for (let i = 0; i < this.pickerSortingList.length; i++) {
                MachineSorting.push(this.pickerSortingList[i].DATALIST);
              }
              this.MachineSortList = [...MachineSorting];
            }
          });
      }
    }
  }
  // 集批條件 by sorting
  getRequierList(_type, _sort, _machine, _idx): void {
    if (_type === '1') {
      if (this.listOfData[_idx].INTERVAL == 0) {
        this.listOfData[_idx].REQUIREMENT = `　`;
        this.message.create('error', '「集批天數」為 0，不可拉選「集批條件」');
        return;
      }
    } else if (_type === '2') {
      if (this.listOfData_dtl[_idx].dtlINTERVAL == 0) {
        this.listOfData_dtl[_idx].dtlREQUIREMENT = `　`;
        this.message.create('error', '「集批天數」為 0，不可拉選「集批條件」');
        return;
      }
    }

    if (_sort === undefined || _sort === '　' || _sort === '') {
      this.message.create('error', '請先拉選「規劃優先順序」');
      return;
    } else {
      const _newSort = _sort.split('. ');
      this.getPPSService.getRequierList(_newSort[0]).subscribe((res) => {
        console.log('getRequierList success');
        this.REQUIREList = JSON.parse(res.data);
      });
    }
  }
  // 取集批中文顯示
  getRequierNAME(_value) {
    this.getPPSService.getRequierNAME(_value).subscribe((res) => {
      console.log('getRequierNAME success');
      this.REQUIREList = JSON.parse(res.data);
    });
  }

  changeSet(_chValue) {
    if (_chValue === 'A') {
      this.PLANSET_EDITION = this.KEEP_PLANSETVER;
      this.A_SETNAME = this.KEEP_A_SETNAME;
      this.B_SETNAME = '';
    } else {
      this.setValue = 'B';
      this.PLANSET_EDITION = this.datetime.format('YYYYMMDDHHmmss');
      this.A_SETNAME = '';
    }
  }

  ngOnInit(): void {
    this.addRow();
  }

  // 外層 table (站別優先順序) ------------------------------
  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        SHOP_CODE: `　`,
        SORTING: `　`,
        INTERVAL: `0`,
        REQUIREMENT: `　`,
        ISCOMBINE: `Y`,
        COMBINE_RANGE: `3`,
        MO_SORT : '',
        OFFLOAD_DATE_START : null,
        OFFLOAD_DATE_END : null,
        isOffloadStartDateDisabled : false, // 「平移日期-起」選取器是否禁用
        offloadStartDateDisabledTooltip : '', // 「平移日期-起」選取器被禁用的說明訊息
        isOffloadEndDateDisabled : false, // 「平移日期-起」選取器是否禁用
        offloadEndDateDisabledTooltip : '', // 「平移日期-起」選取器被禁用的說明訊息
        moSortPrevSelected : null // 紀錄上一個選擇的平衡設定選項
      }
    ];
    this.i++;
  }

  deleteRow(id: string, _shopcode): void {
    this.listOfData = this.listOfData.filter((d) => d.id !== id);

    // 刪除資料時，該站別對應機台明細也要一起刪
    const thisTimeList = this.realMachineList.filter(function (
      item,
      index,
      arr
    ) {
      // 排除重複資料
      return item.dtlSHOP_CODE !== _shopcode;
    });
    for (let j = 0; j < thisTimeList.length; j++) {
      this.deleteindex(thisTimeList[j].dtlSHOP_CODE);
    }
    this.realMachineList = [...thisTimeList];
    this.listOfData_dtl = [...thisTimeList];

    // console.log(this.realMachineList)
    // console.log(this.listOfData_dtl)
  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(value): void {
    this.editId = null;
  }

  // 機台優先順序 ------------------------------
  setMachineSort(_shopcode) {
    let myObj = this;
    if (_shopcode == '　') {
      myObj.message.create('error', '請先拉選「站別」');
      return;
    } else {
      console.log('setMachineSort open');

      this.isVisibleSetMachine = true;
      this.dtlSHOP_CODE = _shopcode;
      this.listOfData_dtl = [];
      if (
        this.listOfData_dtl.length === 0 &&
        this.realMachineList.length === 0
      ) {
        this.listOfData_dtl = [
          ...this.listOfData_dtl,
          {
            dtlid: `${this.j}`,
            dtlSHOP_CODE: _shopcode,
            dtlMACHINE: `　`,
            dtlSORTING: `　`,
            dtlINTERVAL: `5`,
            dtlREQUIREMENT: `　`,
            dtlISCOMBINE: `Y`,
            dtlRANGE: `3`,
          },
        ];
        this.j++;
      } else if (this.realMachineList.length !== 0) {
        var real = this.realMachineList.filter(function (item, index, arr) {
          // 排除重複資料
          return item.dtlSHOP_CODE === _shopcode;
        });

        if (real[0] !== undefined) {
          let initdata = [];
          for (let i = 0; i < real.length; i++) {
            const dtlid = real[i].dtlid;
            const dtlSHOP_CODE = real[i].dtlSHOP_CODE;
            const dtlMACHINE = real[i].dtlMACHINE;
            const dtlSORTING = real[i].dtlSORTING;
            const dtlINTERVAL = real[i].dtlINTERVAL;
            var dtlREQUIREMENT = real[i].dtlREQUIREMENT;
            const dtlISCOMBINE = real[i].dtlISCOMBINE;
            const dtlRANGE = real[i].dtlRANGE;

            if (dtlREQUIREMENT === undefined) {
              dtlREQUIREMENT = `　`;
            }
            initdata.push({
              dtlid,
              dtlSHOP_CODE,
              dtlMACHINE,
              dtlSORTING,
              dtlINTERVAL,
              dtlREQUIREMENT,
              dtlISCOMBINE,
              dtlRANGE,
            });
          }
          this.listOfData_dtl = initdata;

          for (let j = 0; j < this.listOfData_dtl.length; j++) {
            this.provinceChange(
              '23',
              this.listOfData_dtl[j].dtlSHOP_CODE,
              this.listOfData_dtl[j].dtlMACHINE,
              j
            );
            this.getPickerMachineData(
              this.listOfData_dtl[j].dtlSHOP_CODE,
              j,
              'Q'
            );
            this.getRequierNAME(this.listOfData_dtl[j].dtlREQUIREMENT); // 取集批條件顯示
          }
        } else {
          this.listOfData_dtl = [
            ...this.listOfData_dtl,
            {
              dtlid: `${this.j}`,
              dtlSHOP_CODE: _shopcode,
              dtlMACHINE: `　`,
              dtlSORTING: `　`,
              dtlINTERVAL: `5`,
              dtlREQUIREMENT: `　`,
              dtlISCOMBINE: `Y`,
              dtlRANGE: `3`,
            },
          ];
          this.j++;
        }
      }
    }
  }

  setMachinehandleOk(): void {
    this.isVisibleSetMachine = false;
    console.log(' OK 關閉 ');
  }
  // 關閉機台設定時檢誤
  setMachinehandleCancel(_shopcode): void {
    console.log(' CANCEL 關閉 ');

    // 檢查list 是否有空值 (有選機台卻未拉排序)
    for (let i = 0; i < this.listOfData_dtl.length; i++) {
      if (
        this.listOfData_dtl[i].dtlMACHINE !== '' &&
        this.listOfData_dtl[i].dtlMACHINE !== '　' &&
        this.listOfData_dtl[i].dtlSORTING === ''
      ) {
        this.message.create('error', '有選機台卻未設定排序，請檢查！');
        this.isVisibleSetMachine = true;
        return;
      }
      if (
        this.listOfData_dtl[i].dtlMACHINE !== '' &&
        this.listOfData_dtl[i].dtlMACHINE !== '　' &&
        this.listOfData_dtl[i].dtlINTERVAL !== 0 &&
        (this.listOfData_dtl[i].dtlREQUIREMENT === '' ||
          this.listOfData_dtl[i].dtlREQUIREMENT === '　' ||
          this.listOfData_dtl[i].dtlREQUIREMENT === undefined)
      ) {
        this.message.create(
          'error',
          '有選機台且有集批天數，卻未設定「集批條件」，請檢查！'
        );
        this.isVisibleSetMachine = true;
        return;
      }
      if (
        this.listOfData_dtl[i].dtlMACHINE !== '' &&
        this.listOfData_dtl[i].dtlMACHINE !== '　' &&
        this.listOfData_dtl[i].dtlISCOMBINE === 'Y' &&
        this.listOfData_dtl[i].dtlRANGE === 0
      ) {
        this.message.create(
          'error',
          "有選機台且 COMBINE='Y'，「交期範圍」不可為 0，請檢查！"
        );
        this.isVisibleSetMachine = true;
        return;
      }
      if (
        this.listOfData_dtl[i].dtlMACHINE !== '' &&
        this.listOfData_dtl[i].dtlMACHINE !== '　' &&
        this.listOfData_dtl[i].dtlISCOMBINE === 'N' &&
        this.listOfData_dtl[i].dtlRANGE !== 0
      ) {
        this.message.create(
          'error',
          "有選機台且 COMBINE='N'，「交期範圍」應為 0，請檢查！"
        );
        this.isVisibleSetMachine = true;
        return;
      }
    }

    if (this.realMachineList.length > 0) {
      // 判別本次站別 filter 出來
      const thisTimeList = this.realMachineList.filter(function (
        item,
        index,
        arr
      ) {
        // 排除重複資料
        return item.dtlSHOP_CODE !== _shopcode;
      });

      // console.log(" 本站資料 thisTimeList----------------------------")
      // console.log(thisTimeList)

      // 移除本站資料
      for (let j = 0; j < thisTimeList.length; j++) {
        this.deleteindex(thisTimeList[j].dtlSHOP_CODE);
      }

      // console.log(" 移除本站資料 thisTimeList----------------------------")
      // console.log(thisTimeList)
      // console.log(" 畫面資訊----------------------------")
      // console.log(this.listOfData_dtl)
      // console.log(" 畫面資訊倒回 thisTimeList----------------------------")
      // console.log(thisTimeList.concat(this.listOfData_dtl))

      // 如果機台為空表示沒有值，就不放入新list
      const filterList = this.listOfData_dtl.filter(function (
        item,
        index,
        arr
      ) {
        return item.dtlMACHINE !== '　';
      });

      // console.log(" filterList----------------------------")
      // console.log(filterList)

      let newList = thisTimeList.concat(filterList);

      // 本次資訊倒回實際 list
      this.listOfData_dtl = [...newList];
      this.realMachineList = [...newList];

      console.log(
        ' 本次資訊倒回實際 realMachineList----------------------------'
      );
      console.log(this.listOfData_dtl);
      console.log(this.realMachineList);

      this.isVisibleSetMachine = false;
    } else {
      for (let k = 0; k < this.listOfData_dtl.length; k++) {
        if (
          this.listOfData_dtl[k].dtlMACHINE != '　' &&
          this.listOfData_dtl[k].dtlMACHINE !== ''
        ) {
          this.realMachineList.push({
            dtlid: k + 1,
            dtlSHOP_CODE: this.listOfData_dtl[k].dtlSHOP_CODE,
            dtlMACHINE: this.listOfData_dtl[k].dtlMACHINE,
            dtlSORTING: this.listOfData_dtl[k].dtlSORTING,
            dtlINTERVAL: this.listOfData_dtl[k].dtlINTERVAL,
            dtlREQUIREMENT: this.listOfData_dtl[k].dtlREQUIREMENT,
            dtlISCOMBINE: this.listOfData_dtl[k].dtlISCOMBINE,
            dtlRANGE: this.listOfData_dtl[k].dtlRANGE,
          });
        }
        console.log(this.realMachineList);
      }
      this.isVisibleSetMachine = false;
    }
  }

  // 移除相同站別資料
  deleteindex(_shopcode) {
    var events = _.remove(this.realMachineList, function (n) {
      return n.dtlSHOP_CODE == _shopcode;
    });
  }

  // 內層 table (機台優先順序) ------------------------------
  add_dtlRow(_shopcode): void {
    console.log(_shopcode);
    this.listOfData_dtl = [
      ...this.listOfData_dtl,
      {
        dtlid: `${this.j}`,
        dtlSHOP_CODE: _shopcode,
        dtlMACHINE: `　`,
        dtlSORTING: `　`,
        dtlINTERVAL: `5`,
        dtlREQUIREMENT: `　`,
        dtlISCOMBINE: `Y`,
        dtlRANGE: `3`,
      },
    ];
    this.j++;
  }

  delete_dtlRow(_shopcode, id): void {
    console.log(id);
    this.listOfData_dtl = this.listOfData_dtl.filter((d) => d.dtlid !== id);
  }

  startEdit_dtl(id: string): void {
    this.dtleditId = id;
  }

  stopEdit_dtl(): void {
    this.dtleditId = null;
  }

  // 帶入通用規劃優先順序 (LPST優先)
  addLPST(): void {
    // this.changeSet('B');
    let myObj = this;
    myObj.loading = true;
    this.isSpinning = true;
    this.getPPSService.getShopSortingList('I', 1).subscribe((res) => {
      console.log('getShopSortingList success');
      this.pickerShopList = res.data;
      let initdata = [];
      for (let i = 0; i < this.pickerShopList.length; i++) {
        const id = i;
        const SHOP_CODE = this.pickerShopList[i].SCH_SHOP_CODE;
        const SORTING = this.pickerShopList[i].SORTING_SEQ;
        const INTERVAL = this.pickerShopList[i].INTERVAL;
        var REQUIREMENT = this.pickerShopList[i].REQUIREMENT;
        const ISCOMBINE = this.pickerShopList[i].ISCOMBINE;
        const COMBINE_RANGE = this.pickerShopList[i].COMBINE_RANGE;

        if (REQUIREMENT === undefined) {
          REQUIREMENT = `　`;
        }
        initdata.push({
          id,
          SHOP_CODE,
          SORTING,
          INTERVAL,
          REQUIREMENT,
          ISCOMBINE,
          COMBINE_RANGE,
        });
      }
      this.listOfData = initdata;
      for (let j = 0; j < this.listOfData.length; j++) {
        this.provinceChange('13', this.listOfData[j].SHOP_CODE, '　', j);
        this.getRequierNAME(this.listOfData[j].REQUIREMENT); // 取集批條件顯示
      }

      this.getMachineSortList('20221025000001');
    });

    myObj.loading = false;
    this.isSpinning = false;
  }

  // 帶入通用規劃優先順序 (EPST優先)
  addEPST(): void {
    // this.changeSet('B');
    let myObj = this;
    myObj.loading = true;
    this.isSpinning = true;
    this.getPPSService.getShopSortingList('I', 2).subscribe((res) => {
      console.log('getShopSortingList success');
      this.pickerShopList = res.data;
      console.log(res);
      let initdata = [];
      for (let i = 0; i < this.pickerShopList.length; i++) {
        const id = i;
        const SHOP_CODE = this.pickerShopList[i].SCH_SHOP_CODE;
        const SORTING = this.pickerShopList[i].SORTING_SEQ;
        const INTERVAL = this.pickerShopList[i].INTERVAL;
        var REQUIREMENT = this.pickerShopList[i].REQUIREMENT;
        const ISCOMBINE = this.pickerShopList[i].ISCOMBINE;
        const COMBINE_RANGE = this.pickerShopList[i].COMBINE_RANGE;

        if (REQUIREMENT === undefined) {
          REQUIREMENT = `　`;
        }
        initdata.push({
          id,
          SHOP_CODE,
          SORTING,
          INTERVAL,
          REQUIREMENT,
          ISCOMBINE,
          COMBINE_RANGE,
        });
      }
      this.listOfData = initdata;
      for (let j = 0; j < this.listOfData.length; j++) {
        this.provinceChange('13', this.listOfData[j].SHOP_CODE, '　', j);
        this.getRequierNAME(this.listOfData[j].REQUIREMENT); // 取集批條件顯示
      }

      this.getMachineSortList('20221025000001');
    });

    myObj.loading = false;
    this.isSpinning = false;
  }

  // 變更參數值異動內容
  changeValue(_value) {
    // this.changeSet('B');
    if (_value === 'AJValue') {
      if (this.AJValue === 'ASAP') {
        this.MOValue = 'A';
      } else if (this.AJValue === 'JIT') {
        this.MOValue = 'J';
      }
    }
  }

  // 集批天數控制項
  cliINTERVAL(_type, _idx, _flag) {
    if (_type === '1') {
      if (_flag === 0) {
        this.listOfData[_idx].REQUIREMENT = `　`;
      }
    } else {
      if (_flag === 0) {
        this.listOfData_dtl[_idx].dtlREQUIREMENT = `　`;
      }
    }
  }

  // 是否 ISCOMBINE 控制項
  changeCtrl(_type, _idx, _flag) {
    if (_type === '1') {
      if (_flag === 'Y') {
        this.listOfData[_idx].COMBINE_RANGE = 3;
      } else {
        this.listOfData[_idx].COMBINE_RANGE = 0;
      }
    } else {
      if (_flag === 'Y') {
        this.listOfData_dtl[_idx].dtlRANGE = 3;
      } else {
        this.listOfData_dtl[_idx].dtlRANGE = 0;
      }
    }
  }
  // 交期範圍控制項
  cliRange(_type, _idx, _flag) {
    if (_type === '1') {
      if (
        this.listOfData[_idx].ISCOMBINE !== 'Y' &&
        this.listOfData[_idx].COMBINE_RANGE !== 0
      ) {
        this.listOfData[_idx].COMBINE_RANGE = 0;
        this.message.create(
          'error',
          "「COMBINE」為 'N'，「交期範圍」必須為 '0'"
        );
        return;
      }
    } else {
      if (
        this.listOfData_dtl[_idx].dtlISCOMBINE !== 'Y' &&
        this.listOfData_dtl[_idx].dtlRANGE !== 0
      ) {
        this.listOfData_dtl[_idx].dtlRANGE = 0;
        this.message.create(
          'error',
          "「COMBINE」為 'N'，「交期範圍」必須為 '0'"
        );
        return;
      }
    }
  }

  // 開啟策略選擇---------------------
  selPlanSet(): void {
    console.log('selPlanSet...');

    this.isVisibleSelPlanSet = true;
    this.planSetLoading = true;
    let myObj = this;
    this.getPPSService.getPlanSetData(this.plant).subscribe((res) => {
      // 取規劃策略
      console.log('getPlanSetData success');
      const resultDataList = JSON.parse(res.data);
      if(resultDataList.length <= 0){
        this.message.success(`目前${this.plant}尚無任何規劃策略內容`)
        myObj.planSetLoading = false;
        return;
      }
      this.planSetDataList = resultDataList;
      myObj.planSetLoading = false;
    });
  }
  plansethandleCancel(): void {
    this.isVisibleSelPlanSet = false;
  }

  //送出選定規劃策略
  sendchoice(data) {
    console.log('--------sendchoice---------');
    this.setValue = 'A';

    this.KEEP_PLANSETVER = data.PLANSET_EDITION;
    this.KEEP_A_SETNAME = data.SETNAME;
    this.A_SETNAME = data.SETNAME;
    this.B_SETNAME = '';
    this.PLANSET_EDITION = data.PLANSET_EDITION;
    this.AJValue = data.INITIALFLAG;
    this.MOValue = data.MOSORT;
    this.cellValue = data.CELLSORT;
    this.nextshopValue = data.NEXTSHOPSORT;
    this.machineValue = data.MACHINESORT;
    this.FROZAN_GROUP = data.FROZAN_GROUP;

    let myObj = this;
    myObj.loading = true;
    this.isSpinning = true;
    this.getPPSService.getShopSortingList('I', data.SEQNO).subscribe((res) => {
      console.log('getShopSortingList success');
      this.pickerShopList = res.data;
      let initdata = [];
      for (let i = 0; i < this.pickerShopList.length; i++) {
        const id = i;
        const SHOP_CODE = this.pickerShopList[i].SCH_SHOP_CODE;
        const SORTING = this.pickerShopList[i].SORTING_SEQ;
        const INTERVAL = this.pickerShopList[i].INTERVAL;
        var REQUIREMENT = this.pickerShopList[i].REQUIREMENT;
        const ISCOMBINE = this.pickerShopList[i].ISCOMBINE;
        const COMBINE_RANGE = this.pickerShopList[i].COMBINE_RANGE;
        const MO_SORT = _.isNil(this.pickerShopList[i].MO_SORT) ? 'null_string' : this.pickerShopList[i].MO_SORT;
        const OFFLOAD_DATE_START = _.isNil(this.pickerShopList[i].OFFLOAD_DATE_START) ? null : moment(this.pickerShopList[i].OFFLOAD_DATE_START, 'YYYY-MM-DD').toDate();
        const OFFLOAD_DATE_END = _.isNil(this.pickerShopList[i].OFFLOAD_DATE_END) ? null : moment(this.pickerShopList[i].OFFLOAD_DATE_END, 'YYYY-MM-DD').toDate();
        const isOffloadStartDateDisabled =  this.pickerShopList[i].isOffloadStartDateDisabled;
        const offloadStartDateDisabledTooltip = this.pickerShopList[i].offloadStartDateDisabledTooltip;
        const isOffloadEndDateDisabled =  this.pickerShopList[i].isOffloadEndDateDisabled;
        const offloadEndDateDisabledTooltip = this.pickerShopList[i].offloadEndDateDisabledTooltip;
        const moSortPrevSelected = this.pickerShopList[i].moSortPrevSelected;

        initdata.push({
          id,
          SHOP_CODE,
          SORTING,
          INTERVAL,
          REQUIREMENT,
          ISCOMBINE,
          COMBINE_RANGE,
          MO_SORT,
          OFFLOAD_DATE_START,
          isOffloadStartDateDisabled,
          offloadStartDateDisabledTooltip,
          OFFLOAD_DATE_END,
          isOffloadEndDateDisabled,
          offloadEndDateDisabledTooltip,
          moSortPrevSelected
        });
      }
      this.listOfData = initdata;
      // 用於標示目前是該批策略資料載入
      this.isChooseStrategy = true;
      for (let j = 0; j < this.listOfData.length; j++) {
        this.provinceChange('13', this.listOfData[j].SHOP_CODE, '　', j);
        if(!_.isEmpty(this.listOfData[j].REQUIREMENT)){
          this.getRequierNAME(this.listOfData[j].REQUIREMENT); // 取集批條件顯示
        }
        this.moSortSelectChange(this.listOfData[j].MO_SORT, this.listOfData[j]);
      }
      // 該批策略資料載入結束
      this.isChooseStrategy = false;
      this.getMachineSortList(data.PLANSET_EDITION);
    });

    myObj.loading = false;
    this.isSpinning = false;
    this.isVisibleSelPlanSet = false;
  }

  // 取得機台優先順序
  getMachineSortList(_planset) {
    this.getPPSService
      .getShopMachineSortingList('I', _planset)
      .subscribe((res) => {
        console.log('getShopMachineSortingList success');
        this.machienList = res.data;
        console.log(res);
        let initdata = [];
        for (let i = 0; i < this.machienList.length; i++) {
          const dtlid = i;
          const dtlSHOP_CODE = this.machienList[i].SCH_SHOP_CODE_D2;
          const dtlMACHINE = this.machienList[i].MACHINE;
          const dtlSORTING = this.machienList[i].SORTING_SEQ_D2;
          const dtlINTERVAL = this.machienList[i].INTERVAL_D2;
          var dtlREQUIREMENT = this.machienList[i].REQUIREMENT_D2;
          const dtlISCOMBINE = this.machienList[i].ISCOMBINE_D2;
          const dtlRANGE = this.machienList[i].COMBINE_RANGE_D2;

          if (dtlREQUIREMENT === undefined) {
            dtlREQUIREMENT = `　`;
          }
          initdata.push({
            dtlid,
            dtlSHOP_CODE,
            dtlMACHINE,
            dtlSORTING,
            dtlINTERVAL,
            dtlREQUIREMENT,
            dtlISCOMBINE,
            dtlRANGE,
          });
        }
        this.listOfData_dtl = [...initdata];
        this.realMachineList = [...initdata];
      });
  }

  // 撈取 sorting 表
   getShopSortingList(_Mseqno) {
    this.shopSortLoading = true;
    let myObj = this;
    this.getPPSService.getShopSortingList('Q', _Mseqno).subscribe(async (res) => {
      console.log('getShopSortingList success');
      this.ShopSortingList = res.data;
      this.ShopSortingList.forEach(item => {
        item.MO_SORT = _.isNil(item.MO_SORT) ? 'null_string' : item.MO_SORT;
      });
      myObj.shopSortLoading = false;
    });
  }

  // 拖曳改變 idx
  drop(event: CdkDragDrop<string[]>): void {
    var listTemp = this.listOfData;

    moveItemInArray(listTemp, event.previousIndex, event.currentIndex);

    this.listOfData = [];
    this.listOfData = this.listOfData.concat(listTemp);
  }

  openSorting(_Mseqno): void {
    this.isVisibleSorting = true;
    console.log('-----------this.isVisibleSorting--------------');
    console.log(this.isVisibleSorting);
    this.getShopSortingList(_Mseqno);
  }

  handleCancel(): void {
    this.isVisibleSorting = false;
  }

  openMachineSorting(_planset, _shopcode): void {
    this.machineSortLoading = true;
    let myObj = this;
    this.getPPSService
      .getShopMachineSortingList('Q', _planset)
      .subscribe((res) => {
        console.log('getShopMachineSortingList success');
        this.tmpArr = res.data;
        if (this.tmpArr.length > 0) {
          var newSchShopCode = this.tmpArr.filter(function (item, index, arr) {
            // 排除重複資料
            return item.SCH_SHOP_CODE_D2 === _shopcode;
          });
          if (newSchShopCode.length > 0) {
            this.MachineSortingList = [...newSchShopCode];
            this.isVisibleMachine = true;
          } else {
            myObj.message.create(
              'warning',
              `站別「${_shopcode}」無設定機台優先順序`
            );
          }
        } else {
          myObj.message.create(
            'warning',
            `站別「${_shopcode}」無設定機台優先順序`
          );
        }
        myObj.machineSortLoading = false;
      });
  }

  handleCancel_M(): void {
    console.log(this.MachineSortingList);
    this.MachineSortingList = [];
    this.isVisibleMachine = false;
  }

  // 上傳規劃策略
  onSunmit() {
    let myObj = this;
    if (this.A_SETNAME !== '' && this.setValue !== undefined) {
      myObj.message.create(
        'error',
        '目前為新增存檔，請調整「規劃策略」為：自訂策略'
      );
      return;
    }
    if (this.setValue === undefined) {
      myObj.message.create('error', '請輸入「規劃策略名稱」');
      return;
    }
    if (this.AJValue === undefined) {
      myObj.message.create('error', '請選擇「Initial PST」');
      return;
    }
    if (this.MOValue === undefined) {
      myObj.message.create('error', '請選擇「MO 平衡搬移順序」');
      return;
    }
    if (this.cellValue === undefined) {
      myObj.message.create('error', '請選擇「Cell處理順序」');
      return;
    }
    // if (this.nextshopValue === undefined) {
    //   myObj.message.create('error', '請選擇「相臨站別平衡策略」');
    //   return;
    // }
    // if (this.machineValue === undefined) {
    //   myObj.message.create('error', '請選擇「機台平衡策略」');
    //   return;
    // }
    if (this.FROZAN_GROUP === undefined) {
      myObj.message.create('error', '請輸入「FCP下站合併天數」');
      return;
    }

    const listOfData_cloneDeep = _.cloneDeep(this.listOfData);

    // 檢查list 是否有空值
    for (let i = 0; i < listOfData_cloneDeep.length; i++) {
      if (listOfData_cloneDeep[i].SHOP_CODE === '　') {
        myObj.message.create(
          'error',
          '「站別策略設定」，第 ' + listOfData_cloneDeep[i].id + ' 列未設定完整'
        );
        return;
      }
      if (
        listOfData_cloneDeep[i].SHOP_CODE !== '　' &&
        listOfData_cloneDeep[i].SORTING === ''
      ) {
        myObj.message.create(
          'error',
          '「站別策略設定」，第 ' +
          listOfData_cloneDeep[i].id +
            ' 列未設定排序，請檢查！'
        );
        return;
      }
      if (
        listOfData_cloneDeep[i].SHOP_CODE !== '　' &&
        listOfData_cloneDeep[i].INTERVAL != 0 &&
        (listOfData_cloneDeep[i].REQUIREMENT === '' ||
        listOfData_cloneDeep[i].REQUIREMENT === '　' ||
        listOfData_cloneDeep[i].REQUIREMENT === undefined)
      ) {
        myObj.message.create(
          'error',
          '「站別策略設定」，第 ' +
          listOfData_cloneDeep[i].id +
            ' 列有集批天數，卻未設定「集批條件」，請檢查！'
        );
        return;
      }
      if (
        listOfData_cloneDeep[i].SHOP_CODE !== '　' &&
        listOfData_cloneDeep[i].ISCOMBINE === 'Y' &&
        listOfData_cloneDeep[i].COMBINE_RANGE === 0
      ) {
        myObj.message.create(
          'error',
          '「站別策略設定」，第 ' +
          listOfData_cloneDeep[i].id +
            " 列 COMBINE='Y'，「交期範圍」不可為 0，請檢查！"
        );
        return;
      }
      if (
        listOfData_cloneDeep[i].SHOP_CODE !== '　' &&
        listOfData_cloneDeep[i].ISCOMBINE === 'N' &&
        listOfData_cloneDeep[i].COMBINE_RANGE !== 0
      ) {
        myObj.message.create(
          'error',
          '「站別策略設定」，第 ' +
          listOfData_cloneDeep[i].id +
            " 列 COMBINE='N'，「交期範圍」應為 0，請檢查！"
        );
        return;
      }

      if(_.isEmpty(listOfData_cloneDeep[i].MO_SORT)){
        myObj.message.create(
          'error',
          `
          「站別策略設定」，第 ${listOfData_cloneDeep[i].id} 列，
          必須選擇指定平衡設定，請檢查！ 
          `
        );
        return;
      }

      // 平衡設定選擇 offload-psuh 必須選擇「平移日期-起」與「平移日期-迄」
      if(_.isEqual(listOfData_cloneDeep[i].MO_SORT, 'F')) {

          const moSortLabel = this.moSortListOfOption.filter(item => _.isEqual(item.method, listOfData_cloneDeep[i].MO_SORT))[0].notesChinese;

          if(_.isNil(listOfData_cloneDeep[i].OFFLOAD_DATE_START)){
            myObj.message.create(
              'error',
              `
              「站別策略設定」，第 ${listOfData_cloneDeep[i].id} 列，
              平衡設定選擇「${moSortLabel}」必須選擇「平移日期-起」，請檢查！ 
              `
            );
            return;
          }

          if(_.isNil(listOfData_cloneDeep[i].OFFLOAD_DATE_END)){
            myObj.message.create(
              'error',
              `
              「站別策略設定」，第 ${listOfData_cloneDeep[i].id} 列，
              平衡設定選擇「${moSortLabel}」必須選擇「平移日期-迄」，請檢查！ 
              `
            );
            return;
          }
          
      }
      listOfData_cloneDeep[i].MO_SORT = listOfData_cloneDeep[i].MO_SORT === 'null_string' ? null : listOfData_cloneDeep[i].MO_SORT;

      // 如果指定平衡設定為「策略預設」或「Push(C)」
      // 「平移日期-起」與「平移日期-迄」畫面顯示當天日期，
      // 但存到資料庫的值是存null
      // 指定平衡設定為「push-策略預設」且「平移日期-起」為今天，
      // 存到資料庫的值也是存null
      if(_.includes([null, 'C'], listOfData_cloneDeep[i].MO_SORT)){
        listOfData_cloneDeep[i].OFFLOAD_DATE_START = null;
        listOfData_cloneDeep[i].OFFLOAD_DATE_END = null;
      }
      else if(_.isEqual('F', listOfData_cloneDeep[i].MO_SORT) &&
      moment(new Date().toLocaleDateString('en-CA')).isSame(moment(listOfData_cloneDeep[i].OFFLOAD_DATE_START.toLocaleDateString('en-CA')))){
        listOfData_cloneDeep[i].OFFLOAD_DATE_START = null;
        listOfData_cloneDeep[i].OFFLOAD_DATE_END = _.isNil(listOfData_cloneDeep[i].OFFLOAD_DATE_END) ? null : moment(listOfData_cloneDeep[i].OFFLOAD_DATE_END).format('YYYY-MM-DD');
      }
      else{
        listOfData_cloneDeep[i].OFFLOAD_DATE_START = _.isNil(listOfData_cloneDeep[i].OFFLOAD_DATE_START) ? null : moment(listOfData_cloneDeep[i].OFFLOAD_DATE_START).format('YYYY-MM-DD');
        listOfData_cloneDeep[i].OFFLOAD_DATE_END = _.isNil(listOfData_cloneDeep[i].OFFLOAD_DATE_END) ? null : moment(listOfData_cloneDeep[i].OFFLOAD_DATE_END).format('YYYY-MM-DD');
      }

    }

    /*
    for(let i = 0 ; i < this.listOfData_dtl.length ; i++ ) {
      if(this.listOfData_dtl[i].SHOP_CODE === "　" ) {
        myObj.message.create("error", "「機台策略設定」，第 " + this.listOfData_dtl[i].id + " 列未設定完整");
        return;
      }
      if((this.listOfData_dtl[i].dtlMACHINE !== "" && this.listOfData_dtl[i].dtlMACHINE !== "　") && this.listOfData_dtl[i].dtlSORTING === "") {
        this.message.create("error", "有選機台卻未設定排序，請檢查！");
        this.isVisibleSetMachine = true;
        return;
      }
      if((this.listOfData_dtl[i].dtlMACHINE !== "" && this.listOfData_dtl[i].dtlMACHINE !== "　") &&
         (this.listOfData_dtl[i].dtlINTERVAL !== 0 && (this.listOfData_dtl[i].dtlREQUIREMENT === '' || this.listOfData_dtl[i].dtlREQUIREMENT === '　' || this.listOfData_dtl[i].dtlREQUIREMENT === undefined) ) ) {
        this.message.create("error", "有選機台且有集批天數，卻未設定「集批條件」，請檢查！");
        this.isVisibleSetMachine = true;
        return;
      }
      if((this.listOfData_dtl[i].dtlMACHINE !== "" && this.listOfData_dtl[i].dtlMACHINE !== "　") &&
         (this.listOfData_dtl[i].dtlISCOMBINE === 'Y' && (this.listOfData_dtl[i].dtlRANGE === 0 ) ) ) {
        this.message.create("error", "有選機台且 COMBINE='Y'，「交期範圍」不可為 0，請檢查！");
        this.isVisibleSetMachine = true;
        return;
      }
      if((this.listOfData_dtl[i].dtlMACHINE !== "" && this.listOfData_dtl[i].dtlMACHINE !== "　") &&
         (this.listOfData_dtl[i].dtlISCOMBINE === 'N' && (this.listOfData_dtl[i].dtlRANGE !== 0 ) ) ) {
        this.message.create("error", "有選機台且 COMBINE='N'，「交期範圍」應為 0，請檢查！");
        this.isVisibleSetMachine = true;
        return;
      }
		}
    */

    this.loading = true;
    this.isSpinning = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      let setname = '';
      if (this.A_SETNAME === undefined || this.A_SETNAME === '') {
        setname = this.B_SETNAME;
      } else {
        setname = this.A_SETNAME;
      }
      _.extend(obj, {
        PlnaSetVer: this.PLANSET_EDITION,
        SETNAME: setname,
        AJValue: this.AJValue,
        MOValue: this.MOValue,
        cellValue: this.cellValue,
        plant: this.plant,
        nextshopValue: this.nextshopValue,
        machineValue: this.machineValue,
        FROZAN_GROUP: this.FROZAN_GROUP,
        listOfData: listOfData_cloneDeep,
        listOfData_dtl: this.listOfData_dtl,
        usercode: this.USERNAME,
        datetime: this.datetime.format('YYYY-MM-DD HH:mm:ss'),
      });
      myObj.getPPSService.addPlanSetData(obj).subscribe(
        (res) => {
          if (_.get(res, 'message') == 'Y') {
            this.sucessMSG(
              '已建立規劃策略',
              `規劃案版本：${this.PLANSET_EDITION}，名稱：${setname}`
            );
            (this.PLANSET_EDITION = undefined),
              (this.setValue = undefined),
              (this.A_SETNAME = undefined),
              (this.B_SETNAME = undefined),
              (this.AJValue = undefined),
              (this.MOValue = undefined),
              (this.cellValue = undefined),
              (this.nextshopValue = undefined),
              (this.machineValue = undefined),
              (this.FROZAN_GROUP = 0),
              (this.listOfData = [
                {
                  id: `${this.i}`,
                  SHOP_CODE: `　`,
                  SORTING: `　`,
                  INTERVAL: `0`,
                  REQUIREMENT: `　`,
                  ISCOMBINE: `Y`,
                  COMBINE_RANGE: `3`,
                },
              ]);
            this.listOfData_dtl = [
              {
                dtlid: `${this.j}`,
                dtlSHOP_CODE: `　`,
                dtlMACHINE: `　`,
                dtlSORTING: `　`,
                dtlINTERVAL: `5`,
                dtlREQUIREMENT: `　`,
                dtlISCOMBINE: `Y`,
                dtlRANGE: `3`,
              },
            ];
            this.realMachineList = [];
            this.pickerREQUIREList = [];
            this.loading = false;
            this.isSpinning = false;
          }
          else{
            reject('upload fail');
            this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
            this.loading = false;
            this.isSpinning = false;
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
          this.loading = false;
          this.isSpinning = false;
        }
      );
    });
  }

  // 修改規劃策略
  onUpdate() {
    let myObj = this;
    if (
      (this.A_SETNAME === '' || this.A_SETNAME === undefined) &&
      this.setValue !== ''
    ) {
      myObj.message.create(
        'error',
        '目前為修改存檔，請調整「規劃策略」為：既有策略'
      );
      return;
    }
    if (this.setValue === undefined) {
      myObj.message.create('error', '請輸入「規劃策略名稱」');
      return;
    }
    if (this.AJValue === undefined) {
      myObj.message.create('error', '請選擇「Initial PST」');
      return;
    }
    if (this.MOValue === undefined) {
      myObj.message.create('error', '請選擇「MO 平衡搬移順序」');
      return;
    }
    if (this.cellValue === undefined) {
      myObj.message.create('error', '請選擇「Cell處理順序」');
      return;
    }
    if (this.nextshopValue === undefined) {
      myObj.message.create('error', '請選擇「相臨站別平衡策略」');
      return;
    }
    if (this.machineValue === undefined) {
      myObj.message.create('error', '請選擇「機台平衡策略」');
      return;
    }
    if (this.FROZAN_GROUP === undefined) {
      myObj.message.create('error', '請輸入「FCP下站合併天數」');
      return;
    }
    
    const listOfData_cloneDeep = _.cloneDeep(this.listOfData);
    
    // 檢查list 是否有空值
    for (let i = 0; i < listOfData_cloneDeep.length; i++) {
      if (listOfData_cloneDeep[i].SHOP_CODE === '　') {
        myObj.message.create(
          'error',
          '「站別策略設定」，第 ' + listOfData_cloneDeep[i].id + ' 列未設定完整'
        );
        return;
      }
      if (
        listOfData_cloneDeep[i].SHOP_CODE !== '　' &&
        listOfData_cloneDeep[i].SORTING === ''
      ) {
        myObj.message.create(
          'error',
          '「站別策略設定」，第 ' +
            listOfData_cloneDeep[i].id +
            ' 列未設定排序，請檢查！'
        );
        return;
      }
      if (
        listOfData_cloneDeep[i].SHOP_CODE !== '　' &&
        listOfData_cloneDeep[i].INTERVAL != 0 &&
        (listOfData_cloneDeep[i].REQUIREMENT === '' ||
          listOfData_cloneDeep[i].REQUIREMENT === '　' ||
          listOfData_cloneDeep[i].REQUIREMENT === undefined)
      ) {
        myObj.message.create(
          'error',
          '「站別策略設定」，第 ' +
            listOfData_cloneDeep[i].id +
            ' 列有集批天數，卻未設定「集批條件」，請檢查！'
        );
        return;
      }
      if (
        listOfData_cloneDeep[i].SHOP_CODE !== '　' &&
        listOfData_cloneDeep[i].ISCOMBINE === 'Y' &&
        listOfData_cloneDeep[i].COMBINE_RANGE === 0
      ) {
        myObj.message.create(
          'error',
          '「站別策略設定」，第 ' +
            listOfData_cloneDeep[i].id +
            " 列 COMBINE='Y'，「交期範圍」不可為 0，請檢查！"
        );
        return;
      }
      if (
        listOfData_cloneDeep[i].SHOP_CODE !== '　' &&
        listOfData_cloneDeep[i].ISCOMBINE === 'N' &&
        listOfData_cloneDeep[i].COMBINE_RANGE !== 0
      ) {
        myObj.message.create(
          'error',
          '「站別策略設定」，第 ' +
            listOfData_cloneDeep[i].id +
            " 列 COMBINE='N'，「交期範圍」應為 0，請檢查！"
        );
        return;
      }
      
      if(_.isEmpty(listOfData_cloneDeep[i].MO_SORT)){
        myObj.message.create(
          'error',
          `
          「站別策略設定」，第 ${listOfData_cloneDeep[i].id} 列，
          必須選擇指定平衡設定，請檢查！ 
          `
        );
        return;
      }

      // 平衡設定選擇 offload-psuh 必須選擇「平移日期-起」與「平移日期-迄」
      if(_.isEqual(listOfData_cloneDeep[i].MO_SORT, 'F')) {

        const moSortLabel = this.moSortListOfOption.filter(item => _.isEqual(item.method, listOfData_cloneDeep[i].MO_SORT))[0].notesChinese;

        if(_.isNil(listOfData_cloneDeep[i].OFFLOAD_DATE_START)){
          myObj.message.create(
            'error',
            `
            「站別策略設定」，第 ${listOfData_cloneDeep[i].id} 列，
            平衡設定選擇「${moSortLabel}」必須選擇「平移日期-起」，請檢查！ 
            `
          );
          return;
        }

        if(_.isNil(listOfData_cloneDeep[i].OFFLOAD_DATE_END)){
          myObj.message.create(
            'error',
            `
            「站別策略設定」，第 ${listOfData_cloneDeep[i].id} 列，
            平衡設定選擇「${moSortLabel}」必須選擇「平移日期-迄」，請檢查！ 
            `
          );
          return;
        }
        
    }

      listOfData_cloneDeep[i].MO_SORT = listOfData_cloneDeep[i].MO_SORT === 'null_string' ? null : listOfData_cloneDeep[i].MO_SORT;
      
      // 如果指定平衡設定為「策略預設」或「Push(C)」
      // 「平移日期-起」與「平移日期-迄」畫面顯示當天日期，
      // 但存到資料庫的值是存null
      // 指定平衡設定為「push-策略預設」且「平移日期-起」為今天，
      // 存到資料庫的值也是存null
      if(_.includes([null, 'C'], listOfData_cloneDeep[i].MO_SORT)){
        listOfData_cloneDeep[i].OFFLOAD_DATE_START = null;
        listOfData_cloneDeep[i].OFFLOAD_DATE_END = null;
      }
      else if(_.isEqual('F', listOfData_cloneDeep[i].MO_SORT) &&
      moment(new Date().toLocaleDateString('en-CA')).isSame(moment(listOfData_cloneDeep[i].OFFLOAD_DATE_START.toLocaleDateString('en-CA')))){
        listOfData_cloneDeep[i].OFFLOAD_DATE_START = null;
        listOfData_cloneDeep[i].OFFLOAD_DATE_END = _.isNil(listOfData_cloneDeep[i].OFFLOAD_DATE_END) ? null : moment(listOfData_cloneDeep[i].OFFLOAD_DATE_END).format('YYYY-MM-DD');
      }
      else{
        listOfData_cloneDeep[i].OFFLOAD_DATE_START = _.isNil(listOfData_cloneDeep[i].OFFLOAD_DATE_START) ? null : moment(listOfData_cloneDeep[i].OFFLOAD_DATE_START).format('YYYY-MM-DD');
        listOfData_cloneDeep[i].OFFLOAD_DATE_END = _.isNil(listOfData_cloneDeep[i].OFFLOAD_DATE_END) ? null : moment(listOfData_cloneDeep[i].OFFLOAD_DATE_END).format('YYYY-MM-DD');
      }

    }

    this.loading = true;
    this.isSpinning = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      let setname = '';
      if (this.A_SETNAME === undefined || this.A_SETNAME === '') {
        setname = this.B_SETNAME;
      } else {
        setname = this.A_SETNAME;
      }
      _.extend(obj, {
        PlnaSetVer: this.PLANSET_EDITION,
        SETNAME: setname,
        AJValue: this.AJValue,
        MOValue: this.MOValue,
        plant: this.plant,
        cellValue: this.cellValue,
        nextshopValue: this.nextshopValue,
        machineValue: this.machineValue,
        FROZAN_GROUP: this.FROZAN_GROUP,
        listOfData: listOfData_cloneDeep,
        listOfData_dtl: this.listOfData_dtl,
        usercode: this.USERNAME,
        datetime: this.datetime.format('YYYY-MM-DD HH:mm:ss'),
      });
      myObj.getPPSService.updPlanSetData(obj).subscribe(
        (res) => {
          if (_.get(res, 'message') == 'Y') {
            this.sucessMSG(
              '已修改規劃策略',
              `規劃案版本：${this.PLANSET_EDITION}，名稱：${setname}`
            );
            (this.PLANSET_EDITION = undefined),
              (this.setValue = undefined),
              (this.A_SETNAME = undefined),
              (this.B_SETNAME = undefined),
              (this.AJValue = undefined),
              (this.MOValue = undefined),
              (this.cellValue = undefined),
              (this.nextshopValue = undefined),
              (this.machineValue = undefined),
              (this.FROZAN_GROUP = 0),
              (this.listOfData = [
                {
                  id: `${this.i}`,
                  SHOP_CODE: `　`,
                  SORTING: `　`,
                  INTERVAL: `0`,
                  REQUIREMENT: `　`,
                  ISCOMBINE: `Y`,
                  COMBINE_RANGE: `3`,
                  MO_SORT : '',
                  OFFLOAD_DATE_START : null,
                  isOffloadStartDateDisabled : false, // 「平移日期-起」選取器是否禁用
                  offloadStartDateDisabledTooltip : '', // 「平移日期-起」選取器被禁用的說明訊息
                  OFFLOAD_DATE_END : null,
                  isOffloadEndDateDisabled : false, // 「平移日期-迄」選取器是否禁用
                  offloadEndDateDisabledTooltip : '', // 「平移日期-迄」選取器被禁用的說明訊息
                  moSortPrevSelected : null // 紀錄上一個選擇的平衡設定選項
                },
              ]);
            this.listOfData_dtl = [
              {
                dtlid: `${this.j}`,
                dtlSHOP_CODE: `　`,
                dtlMACHINE: `　`,
                dtlSORTING: `　`,
                dtlINTERVAL: `5`,
                dtlREQUIREMENT: `　`,
                dtlISCOMBINE: `Y`,
                dtlRANGE: `3`,
              },
            ];
            this.realMachineList = [];
            this.pickerREQUIREList = [];
            this.loading = false;
            this.isSpinning = false;
          }
          else{
            reject('upload fail');
            this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
            this.loading = false;
            this.isSpinning = false;
          }
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改存檔失敗', '後台存檔錯誤，請聯繫系統工程師');
          this.loading = false;
          this.isSpinning = false;
        }
      );
    });
  }

  async deletePlot(rowData : any, rowIndex : number){

    try{
      const resObservable$  = this.getPPSService.deletePlanSetData(rowData.PLANSET_EDITION);
      const response = await firstValueFrom<any>(resObservable$);
      
      if(response.code === 200){

        if(response.data.updatedRows > 0){
   
          // 刪除該筆
          this.planSetDataList.splice(rowIndex, 1);
      
          // 深拷貝一個新的陣列，好重新賦值給planSetDataList觸發畫面重新渲染
          this.planSetDataList = _.cloneDeep(this.planSetDataList);
        
          // 如果刪除的是最後一筆
          if(_.isEmpty(this.planSetDataList)){
            this.sucessMSG('刪除成功', `已無策略版本`);
            return;
          }
          else{
            this.message.success('刪除成功');
          }
        }
        else {
          this.errorMSG('無法刪除', '該規劃策略正在被使用中');
        }
      }
      else{
        this.errorMSG('刪除規劃策略失敗','');
      }

    }
    catch (error) {
      this.errorMSG('刪除規劃策略失敗', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`);
    }
    finally{
    }
  }

  async getMoSortList(){

    if(!_.isEmpty(this.moSortListOfOption)) return;

    this.moSortListOfOptionLoading = true;

    try{
      const resObservable$ = this.getPPSService.getMoSort();
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取平衡設定選項資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        return;
      }
      
      this.moSortListOfOption = res.data;
    }
    catch (error) {
      this.errorMSG(
        '獲取平衡設定選項資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.moSortListOfOptionLoading = false;
    }
  }

  moSortSelectChange(value, data){

    // 選擇push(C)，平移日期disable，畫面顯示當天日期
    // 禁止使用者輸入「平移日期-起」與「平移日期-迄」
    // tooltip顯示：{{ 平移日期(當天日期) }} 以前為 {{ 指定平衡策略 }}，{{ 平移日期 +1day }} 以後為 {{ MO 平衡搬移順序 }}
    if(_.isEqual('C', value)){
      data.moSortPrevSelected = 'C';
      data.OFFLOAD_DATE_START = new Date();
      data.OFFLOAD_DATE_END = new Date();
      data.isOffloadStartDateDisabled = true;
      data.isOffloadEndDateDisabled = true;
      const moLabel = _.isEqual('A', this.MOValue) ? 'offload-push' : 'push-offload';
      const offloadLabel = this.moSortListOfOption.filter(item => _.isEqual(item.method, value))[0].notesChinese;
      data.offloadStartDateDisabledTooltip = `
        ${moment(data.OFFLOAD_DATE_START).format('YYYY-MM-DD')} 以前為 ${offloadLabel}，
        ${moment(data.OFFLOAD_DATE_START).add(1, 'days').format('YYYY-MM-DD')} 以後為 ${moLabel}
      `;
      data.offloadEndDateDisabledTooltip = data.offloadStartDateDisabledTooltip;
    }
    // 選擇push-策略預設(F)，平移日期開放選擇
    else if(_.isEqual('F', value)){

      // 如果上一個選擇是其他平衡設定，則將平移日期清空
      if(!_.isNil(data.moSortPrevSelected) && !_.isEqual('F', data.moSortPrevSelected)){
        data.OFFLOAD_DATE_START = null;
        data.OFFLOAD_DATE_END = null;
        data.moSortPrevSelected = 'F';
      }
      
      this.offloadStartDateChange(data);
    }
    // 選擇策略預設(null_string)，平移日期disable，顯示當天日期
    else if(_.isEqual('null_string', value)){
      data.moSortPrevSelected = 'null_string';
      data.OFFLOAD_DATE_START = new Date();
      data.OFFLOAD_DATE_END = new Date();
      data.isOffloadStartDateDisabled = true;
      data.isOffloadEndDateDisabled = true;
      // 取出該選擇的value對應的label
      const offloadLabel = this.moSortListOfOption.filter(item => _.isEqual(item.method, value))[0].notesChinese;
      data.offloadStartDateDisabledTooltip = `選擇「${offloadLabel}」不可選擇平移日期`;
      data.offloadEndDateDisabledTooltip = data.offloadStartDateDisabledTooltip;
    }
    else{
      data.moSortPrevSelected = null;
      data.OFFLOAD_DATE_START = null;
      data.OFFLOAD_DATE_END = null;
      data.isOffloadStartDateDisabled = false;
      data.offloadStartDateDisabledTooltip = null;
      data.isOffloadEndDateDisabled = false;
      data.offloadEndDateDisabledTooltip = null;
    }
  }

  offloadStartDateChange(rowData : any){

    rowData.isOffloadStartDateDisabled = false;
    rowData.offloadStartDateDisabledTooltip = '請選擇「平移日期-起」';

    if(_.isNil(rowData.OFFLOAD_DATE_START) && !this.isChooseStrategy){
      // 「平移日期-迄」須等到「平移日期-起」先選擇完畢才能選
      // 為了使「平移日期-迄」日期元件僅顯示「平移日期-起」日期的當天與當天之後的日期供使用者選擇
      rowData.isOffloadEndDateDisabled = true;
      rowData.offloadEndDateDisabledTooltip = '請先選擇「平移日期-起」';
      rowData.OFFLOAD_DATE_END = null;
      return;
    }

    // 若之前選擇那時候的當天日期，資料庫會存NULL
    // 此時從資料庫讀回來會是NULL，是NULL就顯示使用者此時選擇策略的當天日期
    if(_.isNil(rowData.OFFLOAD_DATE_START) && this.isChooseStrategy){
      rowData.OFFLOAD_DATE_START = new Date();
    }

    const offloadValue = rowData.MO_SORT;
    // 選擇push-策略預設(F)，「平移日期-迄」開放選擇
    if(_.isEqual('F', offloadValue)){

      // 「平移日期-起」已選擇，不顯示Tooltip
      rowData.offloadStartDateDisabledTooltip = null;

      // 「平移日期-起」已被選擇，開放「平移日期-迄」給使用者選擇
      // 「平移日期-迄」日期元件僅供今天與今天之後的日期給使用者選擇
      rowData.isOffloadEndDateDisabled = false;

       // 「平移日期-迄」已開放選擇，Tooltip提示使用者
       rowData.offloadEndDateDisabledTooltip = '請選擇「平移日期-迄」';
      
      // 如果是第一次載入，
      // 調用offloadEndDateChange函數主動將Tooltip相關訊息設置好
      if(this.isChooseStrategy){
        this.offloadEndDateChange(rowData);
      }
      // 如果不是第一次載入的情況，
      // 每次「平移日期-起」有變更日期就要清空「平移日期-迄」的日期
      else{
        rowData.OFFLOAD_DATE_END = null;
      }
        
    }
  }

  offloadEndDateChange(rowData : any){

    const offloadValue = rowData.MO_SORT;
    const moLabel = _.isEqual('A', this.MOValue) ? 'offload-push' : 'push-offload';
    // 選擇push-策略預設(F)且選擇完「平移日期-迄」
    // tooltip顯示：{{ 平移日期-起 }} 以前為 {{ 指定平衡策略 }}，{{ 平移日期-迄  }} 以後為 {{ MO 平衡搬移順序 }}
    if(_.isEqual('F', offloadValue)){

      // 如果使用者清空「平移日期-迄」
      if(_.isNil(rowData.OFFLOAD_DATE_END)){
        // 提示使用者選擇「平移日期-迄」並清空「平移日期-迄」的tooltip
        rowData.offloadEndDateDisabledTooltip = '請選擇「平移日期-迄」';
        rowData.offloadStartDateDisabledTooltip = '';
        return;
      }

      const offloadLabel = this.moSortListOfOption.filter(item => _.isEqual(item.method, offloadValue))[0].notesChinese;
      if(moment(rowData.OFFLOAD_DATE_START.toLocaleDateString('en-CA')).isSame(moment(rowData.OFFLOAD_DATE_END.toLocaleDateString('en-CA')))) {
        rowData.offloadStartDateDisabledTooltip = `
          ${moment(rowData.OFFLOAD_DATE_START).format('YYYY-MM-DD')} 為 ${offloadLabel}，
          ${moment(rowData.OFFLOAD_DATE_END).add(1, 'days').format('YYYY-MM-DD')} 以後為 ${moLabel}
        `;
      }
      else{
        rowData.offloadStartDateDisabledTooltip = `
          ${moment(rowData.OFFLOAD_DATE_START).format('YYYY-MM-DD')} ~ ${moment(rowData.OFFLOAD_DATE_END).format('YYYY-MM-DD')} 為 ${offloadLabel}，
          ${moment(rowData.OFFLOAD_DATE_END).add(1, 'days').format('YYYY-MM-DD')} 以後為 ${moLabel}
        `;
      }
        rowData.offloadEndDateDisabledTooltip = rowData.offloadStartDateDisabledTooltip;
      }
  }

  // 「平移日期-起」不能選擇當前日期之前的日期
  disabledOffloadStartDate = (datePick: Date): boolean => {
    // 日期選擇器的日期在當前日期之前不能選擇
    // 例如:(2023-09-11).isBefore(2023-09-12) => true
    // 2023-09-11此日期無法被使用者選擇
    return moment(moment(datePick).format('YYYY-MM-DD')).isBefore(moment(new Date()).format('YYYY-MM-DD'));
  }

  // 「平移日期-迄」不能選「平移日期-起」之前的日期
  disabledOffloadEndDate(OFFLOAD_DATE_START : Date){
    return (datePick: Date): boolean => {
      // 例如:「平移日期-起」的日期為 2023-09-11 在 2023-09-11 之前的日期都不能選
      return moment(moment(datePick).format('YYYY-MM-DD')).isBefore(moment(OFFLOAD_DATE_START).format('YYYY-MM-DD'));
    }
  }

  // 首次渲染資料完畢後被調用
  onFirstDataRendered(event : FirstDataRenderedEvent<any>){
    // 在首次資料渲染完畢後，再做寬度適應的調整
    this.autoSizeAll();
  }

  // 獲取ag-grid的Api函數
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  // 文字寬度適應的調整
  autoSizeAll() {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      if(column.getId() !== 'CELLSORTNA' && 
          column.getId() !== 'SORTING_SEQ' && 
          column.getId() !== 'SORTING_SEQ_D2'){
        allColumnIds.push(column.getId());
      }
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
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
}
