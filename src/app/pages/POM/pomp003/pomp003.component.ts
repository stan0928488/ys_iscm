import { Component, OnInit } from '@angular/core';

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
  ITextCellEditorParams,
  ILargeTextEditorParams,
  ISelectCellEditorParams,
  IRichCellEditorParams,
} from 'ag-grid-community';

import { NzMessageService } from 'ng-zorro-antd/message';

import { POMService } from '../../../services/POM/pom.service';

import { PpsTbpomm07 } from './PpsTbpomm07.Model';
import { PpsTbpomm03 } from './PpsTbpomm03.Model';

import * as _ from 'lodash';

@Component({
  selector: 'app-pomp003',
  templateUrl: './pomp003.component.html',
  styleUrls: ['./pomp003.component.scss'],
})
export class POMP003Component implements OnInit {
  isSpinning = false;

  // cell 是否被修改
  isCellValueChanged = false;

  // ag-grid  grid Column Api
  private gridApi!: GridApi<PpsTbpomm07>;
  private gridColumnApi!: ColumnApi;

  // 中分類 選項 清單
  typeMiddleList: string[] = ['ALL', 'BA', 'CA'];

  // 鋼胚類型 desc 選項 清單
  billetTypeDescList: string[] = [];

  // 鋼胚類型清單
  billetTypeList: PpsTbpomm03[] = [];

  // 表格 column 定義
  columnDefs: ColDef[] = [
    {
      headerName: '中分類',
      field: 'typeMiddle',
      width: 100,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.typeMiddleList,
      } as ISelectCellEditorParams,
    },
    {
      headerName: '鋼種',
      field: 'gradeNo',
      width: 100,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        maxLength: 20,
      } as ITextCellEditorParams,
    },
    {
      headerName: '尺寸下限',
      field: 'diaMin',
      width: 100,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        max: 1000,
      },
      valueParser: this.numberParser,
    },
    {
      headerName: '尺寸上限',
      field: 'diaMax',
      width: 100,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        max: 1000,
      },
    },
    // {
    //   headerName: '鋼胚類型順位1',
    //   field: 'billetTypeOption1',
    //   width: 100,
    // },
    {
      headerName: '鋼胚類型順位1',
      field: 'billetTypeOption1Desc',
      width: 100,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.billetTypeDescList,
        };
      },
    },
    // {
    //   headerName: '鋼胚類型順位2',
    //   field: 'billetTypeOption2',
    //   width: 100,
    // },
    {
      headerName: '鋼胚類型順位2',
      field: 'billetTypeOption2Desc',
      width: 100,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.billetTypeDescList,
        };
      },
    },
    // {
    //   headerName: '鋼胚類型順位3',
    //   field: 'billetTypeOption3',
    //   width: 100,
    // },
    {
      headerName: '鋼胚類型順位3',
      field: 'billetTypeOption3Desc',
      width: 100,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.billetTypeDescList,
        };
      },
    },
    // {
    //   headerName: '鋼胚類型順位4',
    //   field: 'billetTypeOption4',
    //   width: 100,
    // },
    {
      headerName: '鋼胚類型順位4',
      field: 'billetTypeOption4Desc',
      width: 100,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.billetTypeDescList,
        };
      },
    },
    // {
    //   headerName: '鋼胚類型順位5',
    //   field: 'billetTypeOption5',
    //   width: 100,
    // },
    {
      headerName: '鋼胚類型順位5',
      field: 'billetTypeOption5Desc',
      width: 100,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        return {
          values: this.billetTypeDescList,
        };
      },
    },
  ];

  columnTypes: {
    [key: string]: ColDef;
  } = {
    editableColumn: {
      editable: (params: EditableCallbackParams<PpsTbpomm07>) => {
        return this.isCellEditable(params);
      },
      cellStyle: (params: CellClassParams<PpsTbpomm07>) => {
        if (this.isCellEditable(params)) {
          return { backgroundColor: 'lightBlue' };
        }
      },
    },
  };

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    editable: true,
  };

  // 表格 datalist
  datalist: PpsTbpomm07[] = [];

  constructor(
    private pomService: POMService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // 取取得 軋鋼投胚邏輯順序表 及 鋼種desc 清單
    this.getBilletOptionsWithDescList();

    // 取得 鋼胚種類表 清單
    this.getBilletTypeList();
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
   * 取得 軋鋼投胚邏輯順序表 及 鋼種desc 清單
   *
   *
   */
  getBilletOptionsWithDescList() {
    console.log('==> 取得 軋鋼投胚邏輯順序表 及鋼種desc 清單  ');
    // 開啟  loading Indicator
    this.isShowLoadingIndicator(true);

    let myObj = this;

    myObj.pomService.getBilletOptionsWithDescList().subscribe(
      async (res) => {
        console.log('res');
        console.log(res);

        const { code, data } = res;

        // 更新表格資料
        this.datalist = data;

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

    // 關閉  loading Indicator
    this.isShowLoadingIndicator(false);
  }

  /**
   *
   *
   * on grid ready
   *
   *
   */
  onGridReady(params: GridReadyEvent<PpsTbpomm07>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
   * 第一筆資料渲染完成
   *
   *
   */
  onFirstDataRendered(e: FirstDataRenderedEvent) {
    // 將寬度調整到最適合
    this.gridApi.sizeColumnsToFit();

    // this.gridApi.setColumnDefs(this.columnDefs);
  }

  /**
   *
   * cell 是否可編輯
   *
   *
   */
  isCellEditable(params: EditableCallbackParams | CellClassParams) {
    //TODO: 改成 Y
    // return params.data.flagClosedRollProd === 'Y';

    return true;
  }

  /**
   *
   *取得 鋼胚種類表 清單
   *
   *
   */
  getBilletTypeList() {
    console.log('==> 取得 鋼胚種類表 清單  ');
    // 開啟  loading Indicator
    this.isShowLoadingIndicator(true);

    let myObj = this;

    myObj.pomService.getBilletTypeList().subscribe(
      async (res) => {
        console.log('res');
        console.log(res);

        const { code, data } = res;

        // 更新資料
        this.billetTypeList = data;
        this.billetTypeDescList = _.map(data, 'billetTypeDesc');

        console.log('this.billetTypeList');
        console.log(this.billetTypeList);

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

    // 關閉  loading Indicator
    this.isShowLoadingIndicator(false);
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
}
