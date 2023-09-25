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
} from 'ag-grid-community';

import { NzMessageService } from 'ng-zorro-antd/message';

import { POMService } from '../../../services/POM/pom.service';

import { PpsTbpomm07 } from './PpsTbpomm07.Model';

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

  // 表格 column 定義
  columnDefs: ColDef[] = [];

  // 表格 datalist
  datalist: PpsTbpomm07[] = [];

  constructor(
    private pomService: POMService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // 取取得 軋鋼投胚邏輯順序表 及 鋼種desc 清單
    this.getBilletOptionsWithDescList();
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
   * 取取得 軋鋼投胚邏輯順序表 及 鋼種desc 清單
   *
   *
   */
  getBilletOptionsWithDescList() {
    console.log('取取得 軋鋼投胚邏輯順序表 及鋼種desc 清單  ');
    // 開啟  loading Indicator
    this.isShowLoadingIndicator(true);

    let myObj = this;

    myObj.pomService.getBilletOptionsWithDescList().subscribe(
      async (res) => {
        console.log('res');
        console.log(res);

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
}
