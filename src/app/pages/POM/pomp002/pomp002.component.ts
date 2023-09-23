import { PASService } from './../../../services/PAS/PAS.service';
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

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-pomp002',
  templateUrl: './pomp002.component.html',
  styleUrls: ['./pomp002.component.scss'],
})
export class POMP002Component implements OnInit {
  isSpinning = false;

  paramObj = {
    diaRangeAdjMin: 0,
    diaRangeAdjMax: 0,
    orderWeightAdjMax: 0,
    paramJson: '',
    ts: '',
  };

  constructor(
    private pomService: POMService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // fetch data
    this.fetchData();
  }

  /**
   *
   * fetch data
   *
   *
   */
  fetchData() {
    console.log('===> fetch date');
    // 開啟  loading Indicator
    this.isShowLoadingIndicator(true);

    // 取得參數設定 by param id
    const paramObj = { paramId: 'OWNLESS_MATCH_RANGE' };
    this.pomService.getParamConfigByParamId(paramObj).subscribe(
      (res) => {
        console.log('res');
        console.log(res);

        const { data } = res;
        const { paramJson } = data;

        // 將 paramJson 轉成物件
        const paramObj = {
          ...data,
          ...JSON.parse(paramJson),
          ts: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        console.log(
          '🚀 ~ file: pomp002.component.ts:66 ~ POMP002Component ~ fetchData ~ paramObj:',
          paramObj
        );

        this.paramObj = paramObj;
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
   * 開啟/關閉 loading Indicator
   *
   *
   */
  isShowLoadingIndicator(flag: boolean) {
    this.isSpinning = flag;
  }

  /**
   *
   * 更新參數設定
   *
   *
   */
  updateParamConfig() {
    console.log('===> 更新參數設定');
    console.log(this.paramObj);

    // 開啟  loading Indicator
    this.isShowLoadingIndicator(true);

    const { diaRangeAdjMin, diaRangeAdjMax, orderWeightAdjMax } = this.paramObj;

    this.paramObj.paramJson = JSON.stringify({
      diaRangeAdjMin,
      diaRangeAdjMax,
      orderWeightAdjMax,
    });

    // 更新參數設定
    this.pomService.updateParamConfig(this.paramObj).subscribe(
      (res) => {
        console.log('res');
        console.log(res);
        this.message.create('success', `更新成功`);

        // fetch data
        this.fetchData();
      },
      (err) => {
        console.log(err);
        this.message.create('error', `更新失敗: ${err}`);
      }
    );

    // 關閉  loading Indicator
    this.isShowLoadingIndicator(false);
  }
}
