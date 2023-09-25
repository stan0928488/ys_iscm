import { Component, OnInit } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

import { NzMessageService } from 'ng-zorro-antd/message';

import { POMService } from '../../../services/POM/pom.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid';

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
  userId;

  // 參數設定 obj
  paramObj = {
    diaRangeAdjMin: 0,
    diaRangeAdjMax: 0,
    orderWeightAdjMax: 0,
    paramJson: '',
    ts: '',
  };

  // 目前正在編輯數量 - 貨位
  editCountForRack: number = 0;

  // 編輯 cache - 貨位
  editCacheForRack: {
    [key: string]: { edit: boolean; data: PpsTbpomM08Model };
  } = {};

  // 表格 datalist - 貨位
  rackNotInDataList: PpsTbpomM08Model[] = [];

  // 目前正在編輯數量 - 倉庫
  editCountForHouse: number = 0;

  // 編輯 cache - 倉庫
  editCacheForHouse: {
    [key: string]: { edit: boolean; data: PpsTbpomM08Model };
  } = {};

  // 表格 datalist - 倉庫
  houseInDataList: PpsTbpomM08Model[] = [];

  constructor(
    private pomService: POMService,
    private message: NzMessageService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // fetch data
    this.fetchData();

    // 取得 userId;
    this.userId = this.cookieService.get('USERNAME');

    console.log('===> userId: ' + this.userId);
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

    console.log('===> fetch 需保留倉庫 ');

    // 需保留倉庫
    // HOUSE IN
    const houseInObj = {
      placeType: 'HOUSE',
      filterAction: 'IN',
    };

    this.pomService.getPlaceFilterList(houseInObj).subscribe(
      (res) => {
        console.log('res');
        console.log(res);

        const houseInDataList = [];

        res.data.forEach((item) => {
          houseInDataList.push(item);
        });

        console.log('---> houseInDataList');
        console.log(houseInDataList);

        this.houseInDataList = houseInDataList;

        // 貨位 cell 編輯  更新 editCacheForHouse
        this.updateEditCacheForHouse();
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
    this.pomService
      .updateParamConfig({ ...this.paramObj, modifier: this.userId })
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
    this.updateEditCacheForRack();
  }

  /**
   *
   * 貨位 cell 編輯  - 新增一筆空白
   *
   *
   *
   */
  newEditForRack(): void {
    const id = uuid.v4();

    const obj = {
      id,
      placeType: 'RACK',
      filterAction: 'NOT_IN',
      placeName: '',
    };

    this.rackNotInDataList.unshift(obj);

    // 更新 editCacheForRack
    this.updateEditCacheForRack();

    // 將該id 設定為編輯狀態
    const index = this.rackNotInDataList.findIndex((item) => item.id === id);
    this.editCacheForRack[id] = {
      data: { ...this.rackNotInDataList[index] },
      edit: true,
    };
    this.editCountForRack++;
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

    _.forEach(this.rackNotInDataList, (item) => {
      item.modifier = this.userId;
    });

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

  /**
   *
   * 倉庫 cell 編輯 開始
   *
   *
   *
   */
  startEditForHouse(id: string): void {
    this.editCacheForHouse[id].edit = true;
    this.editCountForHouse++;
  }

  /**
   *
   * 倉庫 cell 編輯   取消
   *
   *
   *
   */
  cancelEditForHouse(id: string): void {
    const index = this.houseInDataList.findIndex((item) => item.id === id);
    this.editCacheForHouse[id] = {
      data: { ...this.houseInDataList[index] },
      edit: false,
    };
    this.editCountForHouse--;
  }

  /**
   *
   * 倉庫 cell 編輯    儲存
   *
   *
   *
   */
  saveEditForHouse(id: string): void {
    const index = this.houseInDataList.findIndex((item) => item.id === id);
    Object.assign(this.houseInDataList[index], this.editCacheForHouse[id].data);
    this.editCacheForHouse[id].edit = false;
    this.editCountForHouse--;
  }

  /**
   *
   * 倉庫 cell 編輯  - 刪除
   *
   *
   *
   */
  deleteEditForHouse(id: string): void {
    this.houseInDataList = _.filter(
      this.houseInDataList,
      (item) => item.id !== id
    );

    // 更新 editCacheForHouse
    this.updateEditCacheForHouse();
  }

  /**
   *
   * 倉庫 cell 編輯  - 新增一筆空白
   *
   *
   *
   */
  newEditForHouse(): void {
    const id = uuid.v4();

    const obj = {
      id,
      placeType: 'HOUSE',
      filterAction: 'IN',
      placeName: '',
    };

    this.houseInDataList.unshift(obj);

    // 更新 editCacheForHouse
    this.updateEditCacheForHouse();

    // 將該id 設定為編輯狀態
    const index = this.houseInDataList.findIndex((item) => item.id === id);
    this.editCacheForHouse[id] = {
      data: { ...this.houseInDataList[index] },
      edit: true,
    };
    this.editCountForHouse++;
  }

  /**
   *
   * 倉庫 cell 編輯  更新 editCacheForHouse
   *
   *
   *
   */
  updateEditCacheForHouse(): void {
    this.houseInDataList.forEach((item) => {
      this.editCacheForHouse[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  /**
   *
   * 上傳更新 - 倉庫
   *
   *
   */
  uploadUpdateForHouse() {
    console.log('===> 上傳更新 - 倉庫');
    console.log(this.houseInDataList);

    _.forEach(this.houseInDataList, (item) => {
      item.modifier = this.userId;
    });

    // 依類型 , 過濾動作更新

    this.pomService
      .updateByPlaceTypeAndFilterAction(this.houseInDataList)
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
