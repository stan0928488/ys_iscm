import { Component, OnInit } from '@angular/core';

import {
  ColDef,
  ColumnApi,
  ColumnResizedEvent,
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

import * as _ from 'lodash';

@Component({
  selector: 'app-pomp001',
  templateUrl: './pomp001.component.html',
  styleUrls: ['./pomp001.component.scss'],
})
export class POMP001Component implements OnInit {
  isSpinning = false;

  // cell 是否被修改
  isCellValueChanged = false;

  // ag-grid  grid Column Api
  private gridApi!: GridApi<PomMergeRollOrder>;
  private gridColumnApi!: ColumnApi;

  // 0R 清單
  mergeNoList: string[] = [];

  // 選中的 0R 清單
  selectedMergeNo: string = '';

  // 表格 column 定義
  columnDefs: ColDef[] = [
    {
      headerName: `訂單號碼`,
      field: 'sale_order',
      width: 250,
      rowDrag: (params) => this.isCellEditable(params),
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
      headerName: '生計調整量',
      field: 'adjustment_qty',
      width: 150,
      type: 'editableColumn',
      headerClass: 'header-editable-color',
      // cellClass: 'cell-editable-color',
      valueParser: this.numberParser,
    },
    {
      headerName: ' 生產指令開立',
      field: 'flagRollProdOrder',
      width: 150,
    },
    {
      headerName: '生產指令全部關閉',
      field: 'flagClosedRollProd',
      width: 150,
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
    this.get0RDateList('0R');

    // ag grid auto size all columns
    this.autoSizeAll(false);
  }

  /**
   *
   * 取得 0R 資料
   *
   *
   */
  get0RDateList(_mergeNo: string) {
    console.log('取得 0R 資料  ');
    // 開啟  loading Indicator
    this.isShowLoadingIndicator(true);

    let myObj = this;

    const obj = {
      merge_no: _mergeNo,
    };

    myObj.pomService.getVirtualQtyListBy0R(obj).subscribe(
      async (res) => {
        console.log('res');
        console.log(res);

        const { code, data } = res;

        console.log(code);
        console.log(data);

        const mergeNoList = [];

        _.forEach(_.uniqBy(data, 'merge_no'), (item) =>
          mergeNoList.push(_.get(item, 'merge_no'))
        );

        // 更新 0R 清單
        this.mergeNoList = mergeNoList;

        this.datalist = [];

        if (_.size(mergeNoList) > 0) {
          // 預設抓第一筆 0R 資料
          this.selectedMergeNo = mergeNoList[0];

          // 取得 0R 資料 by merge_no
          this.get0RDataByMergeNo(mergeNoList[0]);
        }

        // 關閉  loading Indicator
        this.isShowLoadingIndicator(false);
      },
      (err) => {
        console.log(err);
        this.message.create('error', `請求異常: ${err}`);
        // 關閉  loading Indicator
        this.isShowLoadingIndicator(false);
      }
    );
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
   * on  0R 清單選擇 Event
   *
   *
   */
  onMergeNoSelectChange(event: any) {
    console.log('onMergeNoSelectChange');
    console.log(event);

    // init 被修改 flag
    this.isCellValueChanged = false;

    // 取得 0R 資料 by merge_no
    this.get0RDataByMergeNo(event);
  }

  /**
   *
   * 取得 0R 資料 by merge_no
   *
   *
   */
  get0RDataByMergeNo(_mergeNo: string) {
    console.log('取得 0R 資料 by merge_no');
    // 開啟  loading Indicator
    this.isShowLoadingIndicator(true);

    let myObj = this;

    const obj = {
      merge_no: _mergeNo,
    };

    myObj.pomService.getVirtualQtyListBy0R(obj).subscribe(
      async (res) => {
        console.log('res');
        console.log(res);

        const { code, data } = res;

        console.log(code);
        console.log(data);

        // 更新 選中的 0R 號碼
        this.selectedMergeNo = _mergeNo;

        const columnDefs = _.cloneDeep(this.columnDefs);

        columnDefs[0].headerName = `訂單號碼(${_mergeNo})`;

        console.log('columnDefs');
        console.log(columnDefs);

        // 更新 columnDefs
        this.columnDefs = columnDefs;

        // 更新 datalist
        this.datalist = data;

        // init 被修改 flag
        this.isCellValueChanged = false;

        // 關閉  loading Indicator
        this.isShowLoadingIndicator(false);
      },
      (err) => {
        console.log(err);
        this.message.create('error', `請求異常: ${err}`);
        // 關閉  loading Indicator
        this.isShowLoadingIndicator(false);
      }
    );
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

    let rowData = [];
    this.gridApi.forEachNode((node, index) => {
      rowData.push({ ...node.data, plan_seq: index + 1 });
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
    //TODO: 改成 Y
    return params.data.flagClosedRollProd === 'Y';

    // return true;
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
  updateMergeRollOrder() {
    // stop editing
    this.gridApi.stopEditing();

    // 取得目前 grid row data
    const rowData = this.getGridRowData();

    const data = {
      merge_no: this.selectedMergeNo,
      Block: '1',
      Sublist: [],
    };

    _.forEach(rowData, (item) => {
      const { id, plan_seq, adjustment_qty } = item;
      data.Sublist.push({ id, plan_seq, adjustment_qty });
    });

    console.log('data');
    console.log(data);

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
        this.message.create('success', `更新成功`);

        // init 被修改 flag
        this.isCellValueChanged = false;

        // 取得 0R 資料 by merge_no
        this.get0RDataByMergeNo(this.selectedMergeNo);
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
      const { id, plan_seq, adjustment_qty } = item;
      data.Sublist.push({ id, plan_seq, adjustment_qty });
    });

    console.log('data');
    console.log(data);

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
  }

  /**
   *
   * 是否可以結案
   *
   *
   */
  isCanCloseMergeRollOrder() {
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
  }
}
