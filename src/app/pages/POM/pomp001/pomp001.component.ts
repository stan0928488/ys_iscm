import { Component, OnInit } from '@angular/core';
import { lastValueFrom, firstValueFrom } from 'rxjs';

import {
  ColDef,
  ColumnApi,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  AgGridEvent,
  RowDragEndEvent,
  EditableCallbackParams,
  CellClassParams,
  ValueParserParams,
  CellValueChangedEvent,
} from 'ag-grid-community';

import { NzMessageService } from 'ng-zorro-antd/message';

import { POMService } from '../../../services/POM/pom.service';

import { PomMergeRollOrder } from './PomMergeRollOrder.Model';

import { Pomp001ActionBtnCellRenderer } from './pomp001-action-btn-cell-renderer.component';

import * as _ from 'lodash';
import * as moment from 'moment';

/**5.		【0R解開與配置】
(1)	增加”尺寸”, “軋延日期” 篩選條件.
(2)	訂單資訊新增”尺寸”, “交期”, “長度”, “訂單長度上下限”. “鋼種”, “客戶”.	曾開一

【0R解開與配置】
(1)	配置順位可隨時調整, 不限生產完才能調.
(2)	原配置邏輯以滿足優先順位之”訂單下限量”, 再往下一順位; 改為滿足”訂單目標量”.

 */

@Component({
  selector: 'app-pomp001',
  templateUrl: './pomp001.component.html',
  styleUrls: ['./pomp001.component.scss'],
})
export class POMP001Component implements OnInit {
  isSpinning = false;

  // cell 是否被修改
  isCellValueChanged = false;

  dateFormat = 'yyyy/MM/dd';

  // 軋延日期區間
  dateRange = [];

  // ag-grid  grid Column Api
  private gridApi!: GridApi<PomMergeRollOrder>;
  private gridColumnApi!: ColumnApi;

  // 0R 軋延尺寸 清單
  shaveDiaList: number[] = [];

  // 選中的 0R 軋延尺寸
  selectedShaveDia: number;

  // 表格 column 定義
  columnDefs: ColDef[] = [
    {
      headerName: '軋延尺寸',
      field: 'shave_size',
      width: 100,
      pinned: 'left',
      rowDrag: (params) => this.isCellEditable(params),
    },
    {
      headerName: '合併號碼',
      field: 'merge_no',
      width: 200,
      pinned: 'left',
    },
    {
      headerName: `訂單號碼`,
      field: 'sale_order',
      width: 250,
    },
    {
      headerName: '訂單項次',
      field: 'sale_item',
      width: 100,
    },
    {
      headerName: '訂單行號',
      field: 'sale_lineno',
      width: 100,
    },

    {
      headerName: '軋延計畫開始',
      field: 'order_date_start',
      width: 200,
      valueFormatter: (params) => {
        if (params.value === undefined) {
          return '---';
        }
        return moment(params.value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      headerName: '軋延計畫結束',
      field: 'order_date_end',
      width: 200,
      valueFormatter: (params) => {
        if (params.value === undefined) {
          return '---';
        }
        return moment(params.value).format('YYYY-MM-DD HH:mm:ss');
      },
    },

    {
      headerName: '計畫量',
      field: 'plan_qty',
      width: 100,
      type: 'alightRightColumn',
    },
    {
      headerName: '總量下限',
      field: 'plan_qty_min',
      width: 100,
      type: 'alightRightColumn',
    },
    {
      headerName: '預分配順序',
      field: 'plan_seq',
      width: 150,
      headerClass: 'header-editable-color',
      type: 'alightRightColumn',
    },
    {
      headerName: '虛擬分配量',
      field: 'virtual_qty',
      width: 150,
      type: 'alightRightColumn',
    },

    {
      headerName: '鋼種',
      field: 'grade_no',
      width: 100,
    },

    {
      headerName: '訂單尺寸',
      field: 'order_dia',
      width: 100,
    },

    {
      headerName: '生計交期',
      field: 'date_delivery_pp',
      width: 150,
      valueFormatter: (params) => {
        return moment(params.value).format('YYYY-MM-DD');
      },
    },
    {
      headerName: '訂單長度',
      field: 'order_length',
      width: 100,
      valueFormatter: (params) => {
        return Number(params.value).toLocaleString();
      },
    },

    {
      headerName: '長度下限',
      field: 'order_length_min',
      width: 100,
      valueFormatter: (params) => {
        return Number(params.value).toLocaleString();
      },
    },

    {
      headerName: '長度上限',
      field: 'order_length_max',
      width: 100,
      valueFormatter: (params) => {
        return Number(params.value).toLocaleString();
      },
    },
    {
      headerName: '客戶',
      field: 'cust_abbreviations',
      width: 250,
    },
    {
      headerName: ' 生產指令開立',
      field: 'flagRollProdOrder',
      width: 150,
    },
    {
      headerName: '生產指令關閉',
      field: 'flagClosedRollProd',
      width: 150,
    },
    {
      field: '動作',
      cellRenderer: Pomp001ActionBtnCellRenderer,
      cellRendererParams: {
        onSave: (param: any) => {
          console.log('===> onSave');
          console.log(param);

          // 保存數據
          this.updateMergeRollOrder(param.data.merge_no); 
        },
        onClosed: (param: any) => {
          console.log('===> onClosed');
          console.log(param);
          // this.deleteRow(param.data);
        },
      },
      minWidth: 150,
    },
  ];

  // 表格 Options
  gridOptions = {
    defaultColDef: {
      sortable: false,
      resizable: true,
    },
    api: null,
  };

  // 表格 column type
  columnTypes: {
    [key: string]: ColDef;
  } = {
    editableColumn: {
      editable: (params: EditableCallbackParams<PomMergeRollOrder>) => {
        return this.isCellEditable(params);
      },
      cellStyle: (params: CellClassParams<PomMergeRollOrder>) => {
        let style = {};

        if (typeof params.value === 'number') {
          style = { ...style, 'text-align': 'right' };
        }

        if (this.isCellEditable(params)) {
          style = { ...style, backgroundColor: 'lightBlue' };
        } else {
          style = { ...style, backgroundColor: '#f5f5f5', color: '#bfbfbf' };
        }

        console.log('===> style');
        console.log(style);

        return style;
      },
    },
    alightRightColumn: {
      cellStyle: (params: CellClassParams<PomMergeRollOrder>) => {
        let style = { 'text-align': 'right' };

        return style;
      },
    },
  };

  // 表格 datalist
  datalist: PomMergeRollOrder[] = [];

  constructor(
    private pomService: POMService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // 取得全部 0R 資料
    this.get0RDateList({});
  }

  /**
   *
   * 取得 0R 資料
   *
   *
   */
  async get0RDateList(_searchObj: any) {
    console.log('取得 0R 資料 ');
    // 開啟  loading Indicator
    this.isShowLoadingIndicator(true);

    try {
      // 取得 0R 清單
      const res = await lastValueFrom(
        this.pomService.getMergeRoll0RList(_searchObj)
      );

      const { data } = res;

      const mergeRoll0RList = data;

      // OR 軋延尺寸 清單
      const shaveDiaList = [];

      _.forEach(_.uniqBy(mergeRoll0RList, 'shave_size'), (item) => {
        if (_.get(item, 'shave_size') !== undefined) {
          shaveDiaList.push(_.get(item, 'shave_size'));
        }
      });

      // 更新 0R 軋延尺寸 清單
      this.shaveDiaList = shaveDiaList;

      // 有 0R 資料清單
      if (_.size(mergeRoll0RList) > 0) {
        this.onSearch();
      } else {
        this.datalist = [];
        this.shaveDiaList = [];
      }

      // 關閉  loading Indicator
      this.isShowLoadingIndicator(false);
    } catch (err) {
      console.log('err');
      console.log(err);

      this.message.create('error', '請求異常');
      // 關閉  loading Indicator
      this.isShowLoadingIndicator(false);
    }
  }

  /**
   *
   * 開啟/關閉 loading Indicator
   *
   *
   */
  isShowLoadingIndicator(flag: boolean) {
    this.isSpinning = flag;
  }

  /**
   *
   * 取得 0R 資料 by merge_no
   *  get0RDataByMergeNo
   *
   */
  async get0RDataByCondition(_obj: any) {
    console.log('取得 0R 資料 get0RDataByCondition ');
    // 開啟  loading Indicator
    this.isShowLoadingIndicator(true);

    let myObj = this;

    try {
      // 取得 0R 資料 by condition
      const res = await lastValueFrom(
        this.pomService.getVirtualQtyListBy0R(_obj)
      );

      console.log('res');
      console.log(res);

      const { code, data } = res;

      console.log(code);
      console.log(data);

      // 設定 合併單號 index

      let mergeNoIndex = 0;
      let mergeNoArr = [];

      _.forEach(data, (item, index) => {
        if (_.indexOf(mergeNoArr, item.merge_no) === -1) {
          mergeNoIndex = mergeNoIndex + 1;
          item.mergeNoIndex = mergeNoIndex;
          mergeNoArr.push(item.merge_no);
        } else {
          item.mergeNoIndex = mergeNoIndex;
        }
      });

      // 更新 datalist
      this.datalist = data;

      // init 被修改 flag
      this.isCellValueChanged = false;

      // 關閉  loading Indicator
      this.isShowLoadingIndicator(false);
    } catch (err) {
      console.log('err');
      console.log(err);

      this.message.create('error', '請求異常');
      // 關閉  loading Indicator
      this.isShowLoadingIndicator(false);
    }
  }

  /**
   *
   *
   * ag grid auto size all columns
   *
   *
   */
  autoSizeAll(skipHeader: boolean) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  /**
   *
   *
   * on grid ready
   *
   *
   */
  onGridReady(params: GridReadyEvent<PomMergeRollOrder>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  /**
   *
   *
   * on row drag end
   *
   *
   */
  onRowDragEnd(event: RowDragEndEvent) {
    console.log('onRowDragEnd');

    console.log('    this.gridApi.getRenderedNodes()');
    console.log(this.gridApi.getRenderedNodes());

    // 合併單
    let mergeNoArr = [];

    this.gridApi.forEachNode((node, index) => {
      mergeNoArr.push(node.data.merge_no);
    });

    // mergeNoArr 取 uniq and sort
    mergeNoArr = _.uniq(mergeNoArr).sort();

    let rowData = [];
    // 重新給排序 for 每一張合併單

    _.forEach(mergeNoArr, (item, index) => {
      let seq = 0;
      this.gridApi.forEachNode((node, index) => {
        if (node.data.merge_no === item) {
          seq = seq + 1;
          rowData.push({ ...node.data, plan_seq: seq });
        }
      });
    });

    console.log('rowData');
    console.log(rowData);

    this.datalist = rowData;

    //  被修改 flag
    this.isCellValueChanged = true;
  }

  /**
   *
   *
   * 取得當前 grid row data
   *
   *
   */
  getGridRowData() {
    console.log('取得當前 grid row data');
    let rowData = [];
    this.gridApi.forEachNode((node, index) => {
      rowData.push({ ...node.data });
    });

    console.log('rowData');
    console.log(rowData);

    return rowData;
  }

  /**
   *
   * cell 是否可編輯
   *
   *
   */
  isCellEditable(params: EditableCallbackParams | CellClassParams) {
    // return params.data.flagClosedRollProd === 'Y';

    return true;
  }

  /**
   *
   * number Parser
   *
   *
   */
  numberParser(params: ValueParserParams): number | string {
    return Number.isNaN(Number(params.newValue))
      ? params.oldValue
      : Number(params.newValue);
  }

  /**
   *
   * 保存數據
   *
   *
   */
  updateMergeRollOrder(_mergeNo: string) {
    // stop editing
    this.gridApi.stopEditing();

    // 取得目前 grid row data
    const rowData = this.getGridRowData();

    const data = {
      merge_no: _mergeNo,
      Block: '1',
      Sublist: [],
    };

    _.forEach(rowData, (item) => {
      const { id, plan_seq, sale_order, sale_item, sale_lineno, merge_no } =
        item;

      if (merge_no === _mergeNo) {
        data.Sublist.push({
          id,
          plan_seq,
          sale_order,
          sale_item,
          sale_lineno,
          lock: 0,
        });
      }
    });

    console.log('data');
    console.log(data);

    //     {
    //    "merge_no":"0R2023092200008",
    //    "Block":"1",
    //    "Sublist":[
    //       {
    //          "id":"3476286599565568",
    //          "sale_order":"PP0102PPST2023000025",
    //          "sale_item":10,
    //          "sale_lineno":10,
    //          "plan_seq":2,
    //          "lock":0
    //       },
    //       {
    //          "id":"3476286607282432",
    //          "sale_order":"PP0102PPST2023000027",
    //          "sale_item":10,
    //          "sale_lineno":10,
    //          "plan_seq":1,
    //          "lock":0
    //       }
    //    ]
    // }

    this.pomService.updateMergeRollOrder(data).subscribe(
      (res) => {
        console.log('res');
        console.log(res);
        this.message.create('success', `更新成功`);

        // init 被修改 flag
        this.isCellValueChanged = false;

        this.onSearch();
      },
      (err) => {
        console.log(err);
        this.message.create('error', `更新失敗: ${err}`);
      }
    );
  }

  /**
   *
   * on cell value changed
   *
   *
   *
   */
  onCellValueChanged(e: CellValueChangedEvent) {
    this.isCellValueChanged = true;
  }

  /**
   *
   *
   * 0R 結案
   *
   *
   */
  closeMergeRollOrder() {
    /*
    // stop editing
    this.gridApi.stopEditing();

    // 取得目前 grid row data
    const rowData = this.getGridRowData();

    const data = {
      merge_no: this.selectedMergeNo,
      Block: '0',
      Sublist: [],
    };

    _.forEach(rowData, (item) => {
      const { id, plan_seq, sale_order, sale_item, sale_lineno } = item;
      data.Sublist.push({
        id,
        plan_seq,
        sale_order,
        sale_item,
        sale_lineno,
        lock: 0,
      });
    });

    // const d = {
    //   merge_no: 'aaa',
    //   Block: '1',
    //   Sublist: [
    //     { id: '111', plan_seq: '1', adjustment_qty: '1' },
    //     { id: '222', plan_seq: '2', adjustment_qty: '2' },
    //   ],
    // };

    this.pomService.updateMergeRollOrder(data).subscribe(
      (res) => {
        console.log('res');
        console.log(res);
        this.message.create('success', `結案成功`);

        // init 被修改 flag
        this.isCellValueChanged = false;

        // 取得 0R 資料 by merge_no
        this.get0RDataByMergeNo(this.selectedMergeNo);
      },
      (err) => {
        console.log(err);
        this.message.create('error', `結案失敗`);
      }
    );
    */
  }

  /**
   *
   * 是否可以結案
   *
   *
   */
  isCanCloseMergeRollOrder() {
    /* 
    // 生產是否全部結束
    let isProdAllClosed = false;

    const notFinishList = _.filter(this.datalist, (item) => {
      return (
        item.flagClosedRollProd === 'N' &&
        item.merge_no === this.selectedMergeNo
      );
    });

    if (_.size(notFinishList) > 0) {
      isProdAllClosed = false;
    } else {
      isProdAllClosed = true;
    }

    return !this.isCellValueChanged && isProdAllClosed;
    */
    return false;
  }

  /**
   *
   * 第一筆資料渲染完成
   *
   *
   */
  onFirstDataRendered(e: FirstDataRenderedEvent) {
    // 將寬度調整到最適合
    // this.gridApi.sizeColumnsToFit();
  }

  /**
   *
   * 將寬度調整到最適合
   *
   *
   */
  sizeColumnsToFit() {
    //  this.gridApi.sizeColumnsToFit();
  }

  /**
   *
   * on  0R 尺寸 清單選擇 Event
   *
   *
   */
  onShaveDiaSelectChange(event: any) {
    console.log('onShaveDiaSelectChange');
    console.log(event);

    // init 被修改 flag
    this.isCellValueChanged = false;

    // 選種的 0R 軋延尺寸
    this.selectedShaveDia = event;
  }

  /**
   *
   * 重置查詢條件
   *
   *
   */
  onResetSearch() {
    console.log('onResetSearch');

    // 取得全部 0R 資料
    this.get0RDateList({});

    this.selectedShaveDia = undefined;

    this.dateRange = [];
  }

  nzOnCalendarChange(e: any) {
    console.log('nzOnCalendarChange e');
    console.log(e);

    const startDate = moment(e[0]).format('YYYY-MM-DD');
    const endDate = moment(e[1]).format('YYYY-MM-DD');

    console.log('startDate');
    console.log(startDate);

    console.log('endDate');
    console.log(endDate);
  }

  /**
   *
   *
   * onSearch
   *
   *
   */
  async onSearch() {
    console.log('onSearch');

    // 開啟  loading Indicator
    this.isShowLoadingIndicator(true);

    //       qDia,
    // qDateSrsStart,
    // qDateSrsEnd,

    const obj = {
      qDia: this.selectedShaveDia,
    };

    if (_.size(this.dateRange) > 0) {
      const startDate = moment(this.dateRange[0]).format('YYYY-MM-DD');
      const endDate = moment(this.dateRange[1]).format('YYYY-MM-DD');

      obj['qDateSrsStart'] = startDate;
      obj['qDateSrsEnd'] = endDate;
    }

    console.log('取得 0R 資料 ');
    this.get0RDataByCondition(obj);
  }

  /**
   *
   * row style
   *
   *
   */
  getRowStyle(params: any) {
    if (params.data.mergeNoIndex % 2 === 0) {
      return { background: '#bae0ff' };
    } else {
      return { background: 'white' };
    }
  }
}
