import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class POMService {
  APIYW: string = '';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  // APIURL:string = "http://apptst.walsin.com:8083/pps/rest/FCP";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.APIYW = this.configService.getAPIURL('2');
  }

  // 取得假分配清單 by 0R 編號
  getVirtualQtyListBy0R(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/pom-merge-roll-order/virtual-qty-list-by-0r`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  // 更新合併訂單 0R 生計調整量/順序
  updateMergeRollOrder(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/pom-merge-roll-order/update`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  // 取得參數設定 by param id
  getParamConfigByParamId(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm06/get-param-config-by-param-id`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  // 更新參數設定
  updateParamConfig(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm06/update-by-id`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  // 取得倉貨貨位保留剔除清單
  getPlaceFilterList(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm08/get-place-filter-list`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  // 依類型 , 過濾動作更新
  updateByPlaceTypeAndFilterAction(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm08/save-by-place-filter-list`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  // 取得 軋鋼投胚邏輯順序表 及鋼種desc 清單
  getBilletOptionsWithDescList() {
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm07/billets/optionsWithDescList`;
    return this.http.get<any>(queryUrl, this.httpOptions);
  }

  // 取得 鋼胚種類表 清單
  getBilletTypeList() {
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm03/get/billet-type-list`;
    return this.http.get<any>(queryUrl, this.httpOptions);
  }

  // 更新 軋鋼投胚邏輯順序表 結果 by id
  updatePpsTbpomm07ResultById(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm07/update-by-id`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  // 更新 軋鋼投胚邏輯順序表 刪除 by id
  deleteBilletOptionsById(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm07/delete-by-id`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  // 取得 0R 清單
  getMergeRoll0RList(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/pom-merge-roll-order/0r-list`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }
}
