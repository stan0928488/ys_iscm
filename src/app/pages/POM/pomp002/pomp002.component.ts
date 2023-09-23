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

interface PpsTbpomM08Model {
  id?: string;
  placeType?: string;
  filterAction?: string;
  placeName?: string;
  createTime?: string;
  modifyTime?: string;
  creator?: string;
  modifier?: string;
}

@Component({
  selector: 'app-pomp002',
  templateUrl: './pomp002.component.html',
  styleUrls: ['./pomp002.component.scss'],
})
export class POMP002Component implements OnInit {
  isSpinning = false;

  // 參數設定 obj
  paramObj = {
    diaRangeAdjMin: 0,
    diaRangeAdjMax: 0,
    orderWeightAdjMax: 0,
    paramJson: '',
    ts: '',
  };

  editCountForRack: number = 0;

  editCacheForRack: {
    [key: string]: { edit: boolean; data: PpsTbpomM08Model };
  } = {};

  // 表格 datalist - 貨位
  rackNotInDataList: PpsTbpomM08Model[] = [];

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
    console.log('===> fetch data');
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

    console.log('===> fetch 需要刪除的貨位清單 ');

    // 需要刪除的貨位清單
    // RACK NOT_ID
    const rackNotInObj = {
      placeType: 'RACK',
      filterAction: 'NOT_IN',
    };

    this.pomService.getPlaceFilterList(rackNotInObj).subscribe(
      (res) => {
        console.log('res');
        console.log(res);

        const rackNotInDataList = [];

        res.data.forEach((item) => {
          rackNotInDataList.push(item);
        });

        console.log('---> rackNotInDataList');
        console.log(rackNotInDataList);

        this.rackNotInDataList = rackNotInDataList;

        // 貨位 cell 編輯  更新 editCacheForRack
        this.updateEditCacheForRack();
      },
      (err) => {
        console.log(err);
        this.message.create('error', `請求異常: ${err}`);
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

  /**
   *
   * 貨位 cell 編輯 開始
   *
   *
   *
   */
  startEditForRack(id: string): void {
    this.editCacheForRack[id].edit = true;
    this.editCountForRack++;
  }

  /**
   *
   * 貨位 cell 編輯   取消
   *
   *
   *
   */
  cancelEditForRack(id: string): void {
    const index = this.rackNotInDataList.findIndex((item) => item.id === id);
    this.editCacheForRack[id] = {
      data: { ...this.rackNotInDataList[index] },
      edit: false,
    };
    this.editCountForRack--;
  }

  /**
   *
   * 貨位 cell 編輯    儲存
   *
   *
   *
   */
  saveEditForRack(id: string): void {
    const index = this.rackNotInDataList.findIndex((item) => item.id === id);
    Object.assign(
      this.rackNotInDataList[index],
      this.editCacheForRack[id].data
    );
    this.editCacheForRack[id].edit = false;
    this.editCountForRack--;
  }

  /**
   *
   * 貨位 cell 編輯  - 刪除
   *
   *
   *
   */
  deleteEditForRack(id: string): void {
    this.rackNotInDataList = _.filter(
      this.rackNotInDataList,
      (item) => item.id !== id
    );

    // 更新 editCacheForRack
    this, this.updateEditCacheForRack();
  }

  /**
   *
   * 貨位 cell 編輯  更新 editCacheForRack
   *
   *
   *
   */
  updateEditCacheForRack(): void {
    this.rackNotInDataList.forEach((item) => {
      this.editCacheForRack[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  /**
   *
   * 上傳更新 - 貨位
   *
   *
   */
  uploadUpdateForRack() {
    console.log('===> 上傳更新 - 貨位');
    console.log(this.rackNotInDataList);

    // 依類型 , 過濾動作更新

    this.pomService
      .updateByPlaceTypeAndFilterAction(this.rackNotInDataList)
      .subscribe(
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
  }
}
