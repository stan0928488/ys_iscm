import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';

import * as _ from 'lodash';
import { CookieService } from '../config/cookie.service';

@Injectable({
  providedIn: 'root',
})
export class PPSService {
  APIURL: string = '';
  APINEWURL: string = '';
  APIYW: string = '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'accept-user': this.cookieService.getCookie('USERNAME'),
    }),
  };
  // APIURL:string = "http://apptst.walsin.com:8083/pps/rest/FCP";

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private cookieService: CookieService
  ) {
    this.APIURL = this.configService.getAPIURL();
    this.APINEWURL = this.configService.getAPIURL('1');
    this.APIYW = this.configService.getAPIURL('2');
  }

  //Get getPPSINP13List
  getPPSINP13List() {
    console.log('api service getPPSINP13List');
    let queryUrl = this.APIURL + '/FCP/I113/getPPSINP13List';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // I113 insertI113Tab1Save
  insertI113Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I113/insertI113Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I113 updateI113Tab1Save修改存檔
  updateI113Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I113/updateI113Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I113 delI113Tab1Data 刪除資料
  delI113Tab1Data(_ID) {
    let queryUrl = this.APIURL + `/FCP/I113/delI113Tab1Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }

  // I113 刪除所有資料
  deleteI113AllData() {
    let endpointUrl = this.APIURL + `/FCP/I113/deleteI113AllData`;
    console.log('刪除「直棒研磨道次」所有資料');
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 : 無`);
    return this.http.delete<any>(endpointUrl);
  }

  // I113 批次新增資料
  batchSaveI113Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I113/batchInsertI113Data`;
    console.log('批次新增「直棒研磨道次」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  //Get getPPSINP16List
  getPPSINP16List() {
    console.log('api service getPPSINP16List');
    let queryUrl = this.APIURL + '/FCP/I116/getPPSINP16List';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // I116 insertI116Tab1Save
  insertI116Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I116/insertI116Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I116 updateI116Tab1Save修改存檔
  updateI116Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I116/updateI116Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I101 updateI101Tab14Save
  updateI101Tab14Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I101/updateI101Tab14Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  importI101TablExcel(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I101/importExcelPPSI101`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I116 delI116Tab1Data 刪除資料
  delI116Tab1Data(_ID) {
    let queryUrl = this.APIURL + `/FCP/I116/delI116Tab1Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }

  //Get getPPSINP01List 取得tab01 data
  getPPSINP01List(pageIndex: number, pageSize: number) {
    const httpParams = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    console.log('api service getPPSINP01List');
    let queryUrl = this.APIURL + `/FCP/I101/getPPSINP01List`;
    console.log(queryUrl);
    return this.http.get(queryUrl, { params: httpParams });
  }

  //Get gettbppsm102List 取得tab14 data
  gettbppsm102List() {
    console.log('api service getPPSINP01List');
    let queryUrl = this.APIURL + '/FCP/I101/gettbppsm102List';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // I101 delI101Tab1Data 刪除資料
  delI101Tab1Data(_ID) {
    let queryUrl = this.APIURL + `/FCP/I101/delI101Tab1Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I101 insertI101Tab1Save
  insertI101Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I101/insertI101Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I101 updateI101Tab1Save修改存檔
  updateI101Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I101/updateI101Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // 2.機台能力
  //Get getPPSINP02List 取得02tab data
  getPPSINP02List(_type) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I102` + nonbarUrl + `/getPPSINP02List`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // I102 insertI102Tab1Save
  insertI102Tab1Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I102` + nonbarUrl + `/insertSave`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I102 updateI102Tab1Save修改存檔
  updateI102Tab1Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I102` + nonbarUrl + `/updateSave`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I102 delI102Tab1Data 刪除資料
  delI102Tab1Data(_type, _ID) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I102` + nonbarUrl + `/delData/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I102 importI102Excel EXCEL匯入
  importI102Excel(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I102` + nonbarUrl + `/importExcel`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //Get getPPSINP03List 取得03tab data
  getPPSINP03List(_type) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I103` + nonbarUrl + `/getPPSINP03List`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // I103 insertSave
  insertI103Tab1Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I103` + nonbarUrl + `/insertSave`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I103 updateI103Tab1Save修改存檔
  updateI103Tab1Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I103` + nonbarUrl + `/updateSave`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I103 delI103Tab1Data 刪除資料
  delI103Tab1Data(_type, _ID) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I103` + nonbarUrl + `/delData/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I103 importI103Excel EXCEL匯入
  importI103Excel(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I103` + nonbarUrl + `/importExcel`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // 4.大調機
  //Get getPPSINP04List 取得04tab data
  getPPSINP04List(_type) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I104` + nonbarUrl + `/getPPSINP04List`;
    return this.http.get(queryUrl);
  }
  // I104 delI104Tab1Data 刪除資料
  delI104Tab1Data(_type, _ID) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl =
      this.APIURL + `/FCP/I104` + nonbarUrl + `/delI104Tab1Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I104 insertI104Tab1Save
  insertI104Tab1Save(_type, _data) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I104` + nonbarUrl + `/insertSave`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I104 updateI104Tab1Save修改存檔
  updateI104Tab1Save(_type, _data) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I104/updateSave`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I104 importI104Excel EXCEL匯入
  importI104Excel(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I104` + nonbarUrl + `/importExcel`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // 05.線速工時
  //Get getPPSINP05List 取得05tab data
  getPPSINP05List(_type) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I105` + nonbarUrl + `/getPPSINP05List`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // I105 insertI105Save
  insertI105Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I105` + nonbarUrl + `/insertSave`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I105 updateI105Save
  updateI105Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I105` + nonbarUrl + `/updateSave`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I105 delI105Data 刪除資料
  delI105Data(_type, _ID) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I105` + nonbarUrl + `/delData/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I105 importI105Excel EXCEL匯入
  importI105Excel(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I105` + nonbarUrl + `/importExcel`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //Get getPPSINP07List
  getPPSINP07List(_type) {
    console.log('api service getPPSINP07List');
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I107` + nonbarUrl + `/getPPSINP07List`;
    return this.http.get(queryUrl);
  }
  // I107 insertI107Save
  insertI107Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I107` + nonbarUrl + `/insertI107Save`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I107 updateI107Save 修改存檔
  updateI107Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I107` + nonbarUrl + `/updateI107Save`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I107 delI107Data 刪除資料
  delI107Data(_type, _ID) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl =
      this.APIURL + `/FCP/I107` + nonbarUrl + `/delI107Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }

  //importI107Excel
  importI107Excel(_type, _data) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    const body = JSON.stringify(_data);
    console.log(body);
    console.log('########################');
    console.log(_type);
    let queryUrl =
      this.APIURL + `/FCP/I107` + nonbarUrl + `/importExcelPPSI107`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // 8.非線速
  //Get getPPSINP08List 取得08tab data
  getPPSINP08List(_type) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I108` + nonbarUrl + `/getPPSINP08List`;
    return this.http.get(queryUrl);
  }
  // I108 insertI108Save
  insertI108Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl =
      this.APIURL + `/FCP/I108` + nonbarUrl + `/insertSave`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I108 updateI108Save
  updateI108Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl =
      this.APIURL + `/FCP/I108` + nonbarUrl + `/updateSave`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I108 delI108Data 刪除資料
  delI108Data(_type, _ID) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl =
      this.APIURL + `/FCP/I108` + nonbarUrl + `/delData/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I108 importI108Excel EXCEL匯入
  importI108Excel(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I108` + nonbarUrl + `/importExcel`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // 9.退火爐工時
  //Get getPPSINP09List 取得09tab data
  getPPSINP09List() {
    console.log('api service getPPSINP09List');
    let queryUrl = this.APIURL + '/FCP/I109/getPPSINP09List';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // I109 delI109Tab1Data 刪除資料
  delI109Tab1Data(_ID) {
    let queryUrl = this.APIURL + `/FCP/I109/delI109Tab1Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I109 insertI109Tab1Save
  insertI109Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I109/insertI109Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I109 updateI109Tab1Save修改存檔
  updateI109Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I109/updateI109Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I109 刪除所有資料
  deleteI109AllData() {
    let endpointUrl = this.APIURL + `/FCP/I109/deleteI109AllData`;
    console.log('刪除「直棒退火爐工時」所有資料');
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 : 無`);
    return this.http.delete<any>(endpointUrl);
  }
  // I109 批次新增資料
  batchSaveI109Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I109/batchInsertI109Data`;
    console.log('批次新增「直棒退火爐工時」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  // 10.其他站別工時
  //Get getPPSINP10List 取得10tab data
  getPPSINP10List() {
    console.log('api service getPPSINP10List');
    let queryUrl = this.APIURL + '/FCP/I110/getPPSINP10List';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // I110 delI110Tab1Data 刪除資料
  delI110Tab1Data(_ID) {
    let queryUrl = this.APIURL + `/FCP/I110/delI110Tab1Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I110 insertI110Tab1Save
  insertI110Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I110/insertI110Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I110 updateI110Tab1Save修改存檔
  updateI110Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I110/updateI110Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I110 刪除所有資料
  deleteI110AllData() {
    let endpointUrl = this.APIURL + `/FCP/I110/deleteI110AllData`;
    console.log('刪除「直棒桶槽式工時」所有資料');
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 : 無`);
    return this.http.delete<any>(endpointUrl);
  }

  // I110 批次新增資料
  batchSaveI110Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I110/batchSaveI110Data`;
    console.log('批次新增「直棒桶槽式工時」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  // 17.小調機
  //Get getPPSINP17List 取得17tab data
  getPPSINP17List() {
    console.log('api service getPPSINP17List');
    let queryUrl = this.APIURL + '/FCP/I117/getPPSINP17List';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // I117 delI117Tab1Data 刪除資料
  delI117Tab1Data(_ID) {
    let queryUrl = this.APIURL + `/FCP/I117/delI117Tab1Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I117 insertI117Tab1Save
  insertI117Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I117/insertI117Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I117 updateI117Tab1Save修改存檔
  updateI117Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I117/updateI117Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I117 importI106Excel EXCEL匯入
  importI117Excel(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I117` + nonbarUrl + `/importExcel`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // 20.清洗站設備能力表
  //Get getPPSINP20List 取得20tab data
  getPPSINP20List() {
    console.log('api service getPPSINP20List');
    let queryUrl = this.APIURL + '/FCP/I120/getPPSINP20List';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // I120 delI120Tab1Data 刪除資料
  delI120Tab1Data(_ID) {
    let queryUrl = this.APIURL + `/FCP/I120/delI120Tab1Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I120 insertI120Tab1Save
  insertI120Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I120/insertI120Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I120 updateI120Tab1Save修改存檔
  updateI120Tab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I120/updateI120Tab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I120 刪除所有資料
  deleteI120AllData() {
    let endpointUrl = this.APIURL + `/FCP/I120/deleteI120AllData`;
    console.log('刪除「清洗站設備能力表」所有資料');
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 : 無`);
    return this.http.delete<any>(endpointUrl);
  }

  // I120 批次新增資料
  batchSaveI120Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I120/batchSaveI120Data`;
    console.log('批次新增「清洗站設備能力表」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  //Get getTbppsm013List 取得產能維護(管束設定)資料
  getTbppsm013List(_type) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I106` + nonbarUrl + `/getTbppsm013List`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // I106 insertSave
  insertI106Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I106` + nonbarUrl + `/insertSave`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I106 updateI106Save
  updateI106Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I106` + nonbarUrl + `/updateSave`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I106 delI106Data 刪除資料
  delI106Data(_type, _ID) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I106` + nonbarUrl + `/delData/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  // I106 importI106Excel EXCEL匯入
  importI106Excel(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I106` + nonbarUrl + `/importExcel`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //Get getFCPTB26List 取得combine資料設定
  getFCPTB26List() {
    console.log('api service getFCPTB26List');
    let queryUrl = this.APIURL + '/FCP/I200/getFCPTB26List';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //Get getFCPTB16List 取得設定星期資料
  getPPSFCPTB16List() {
    console.log('api service getFCPTB16List');
    let queryUrl = this.APINEWURL + '/FCP/I200/getPPSFCPTB16List';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //Get getPPSFCPTB16RSSetList 取得FCP結果保留設定資料
  getPPSFCPTB16RSSetList() {
    console.log('api service getPPSFCPTB16RSSetList');
    let queryUrl = this.APINEWURL + '/FCP/I200/getPPSFCPTB16RSSetList';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // I200 Tab1新增存檔
  insertTab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I200/insertTab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I200 Tab1修改存檔
  updateTab1Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I200/updateTab1Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I200 Tab4新增存檔
  insertTab4Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/I200/insertTab4Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I200 Tab5新增存檔
  insertTab5Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/I200/insertTab5Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I200 Tab4修改存檔
  updateTab4Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/I200/updateTab4Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I200 Tab5修改存檔
  updateTab5Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/I200/updateTab5Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // I200 刪除資料
  delI200Data(_ID, _type) {
    let queryUrl = this.APIURL + `/FCP/I200/delI200Data/${_ID}/${_type}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }

  // I200Tab5 刪除資料
  delI200Tab5Data(_ID) {
    let queryUrl = this.APIURL + `/FCP/I200/deletePPSI200Tab5Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }

  //Get getMonthWeekDay()
  getMonthWeekDay() {
    console.log('api service getMonthWeekDay');
    let queryUrl = this.APIURL + `/FCP/I200/getMonthWeekDayList`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //Get getOrignListData 建立規劃策略
  getOrignListData(plant : string) {
    console.log('api service getOrignListData');
    const httpParams = new HttpParams().set('plant', plant);
    let queryUrl = this.APINEWURL + '/FCP/I201/getOrignListData';
    console.log(queryUrl);
    return this.http.get(queryUrl, { params: httpParams });
  }
  getPickerShopEQUIPNEW(_type, _ShopArr) {
    console.log('api service getPickerShopEQUIP');
    let queryUrl =
      this.APINEWURL + `/FCP/I201/getPickerShopEQUIPNEW/${_type}/${_ShopArr}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  getSetShopEQUIP(_data) {
    console.log('api service getSetShopEQUIP');
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + '/FCP/I201/getSetShopEQUIP';
    console.log(queryUrl);
    console.log(body);

    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //保存排序數據
  saveSortData(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + '/FCP/I201/saveSortData';
    console.log(queryUrl);
    console.log(body);

    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //修改排序數據
  editSortData(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + '/FCP/I201/editSortData';
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //刪除排序數據
  deleteSortData(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + '/FCP/I201/deleteSortData';
    console.log(queryUrl);
    console.log(body);

    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //Get getPickerShopEQUIP 下拉選擇站別 / 機台
  getPickerShopEQUIP(_type, _ShopArr) {
    console.log('api service getPickerShopEQUIP');
    let queryUrl =
      this.APIURL + `/FCP/I202/getPickerShopEQUIP/${_type}/${_ShopArr}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //Get getCalendarList 定修計畫資料 (ppsinptb06)
  getCalendarList(_YM, _SHOP, _EQUIP) {
    console.log('api service getCalendarList');
    let queryUrl =
      this.APIURL + `/FCP/I202/getCalendarList/${_YM}/${_SHOP}/${_EQUIP}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //Get CalendarDtlList 定修計畫明細資料 (ppsinptb06)
  getCalendarDtlList(_type, _date, _mode, _PickShopCode, _equip) {
    console.log('api service getCalendarDtlList');
    let queryUrl =
      this.APIURL +
      `/FCP/I202/getCalendarDtlList/${_type}/${_date}/${_mode}/${_PickShopCode}/${_equip}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //addCalendarData 定修計畫insert存檔
  addCalendarData(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I202/addCalendarData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //importExcelCalendar 定修計畫EXCEL匯入
  importExcel(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I202/importExcel';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //updCalendarData 定修計畫修改存檔
  updCalendarData(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I202/updCalendarData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //delCalendarData 定修計畫刪除資料
  delCalendarData(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I202/delCalendarData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR303AllFirstData(edition: string) {
    let queryUrl =
      this.APINEWURL + `/ppsout004/getAllFirstData?edition=${edition}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  getR303AllFirstErrorData(edition) {
    let queryUrl =
      this.APINEWURL + `/ppsout004/getAllFirstErrorData?edition=${edition}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  getR303EditionList() {
    let queryUrl = this.APINEWURL + `/ppsout004/getAllEdition`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  getR303SecondData(idNo, edition, isError, routingSeq) {
    let queryUrl =
      this.APINEWURL +
      `/ppsout004/getAllSecondData?idNo=${idNo}&isError=${isError}&edition=${edition}&routingSeq=${routingSeq}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  getR303FCPEditionList() {
    let queryUrl = this.APINEWURL + `/ppsout001temp/getAllEdition`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  getR303FCPData(edition) {
    let queryUrl =
      this.APINEWURL + `/ppsout001temp/getAllFirstData?edition=${edition}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  /* 之後要刪掉 */
  /*
    //importExcelPPSI203 ASAP調整EXCEL匯入
    importExcelPPSI203(_result) {
      const body = _result;
      // console.log("JSON.stringify");
      console.log(body);
      let queryUrl = this.APIURL + "/FCP/I203/importExcelPPSI203";
      return this.http.post(queryUrl, body, this.httpOptions);
    }


    // 取得客戶清單
    getCustomerList() {
      console.log("api service getCustomerList")
      let queryUrl = this.APIURL + `/FCP/I203/getCustomerList`;
      console.log(queryUrl);
      return this.http.get(queryUrl);
    }

    // 取得鋼種清單
    getSteelTypeList() {
      console.log("api service getSteelTypeList")
      let queryUrl = this.APIURL + `/FCP/I203/getSteelTypeList`;
      console.log(queryUrl);
      return this.http.get(queryUrl);
    }

    // 取得ASAP滾表結果
    getPPSI203ListData(){
      console.log("api service getPPSI203List")
      let queryUrl = this.APIURL + `/FCP/I203/getPPSI203ListData`;
      console.log(queryUrl);
      return this.http.get(queryUrl);
    }
    // editPPSI203Data ASAP調整update存檔
    editPPSI203Data(_result){
      const body = JSON.stringify(_result);
      console.log("JSON.stringify");
      console.log(body);
      let queryUrl = this.APIURL + "/FCP/I203/editPPSI203Data";
      return this.http.post(queryUrl, body, this.httpOptions);
    }
    //Get getPPSI203ListUseInExportExcel ASAP調整 (ppsinptb19)
    // getPPSI203DtlList(){
    getPPSI203ListUseInExportExcel(){
      console.log("api service getPPSI203ListUseInExportExcel")
      let queryUrl = this.APIURL + `/FCP/I203/getPPSI203ListUseInExportExcel`;
      console.log(queryUrl);
      return this.http.get(queryUrl);
    }
    */
  /* 之後要刪掉 */

  //importExcelPPSI203 ASAP調整EXCEL匯入
  importExcelPPSI203(_result) {
    const body = _result;
    // console.log("JSON.stringify");
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I203/importExcelPPSI203';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // 取得客戶清單
  getCustomerList1() {
    console.log('api service getCustomerList');
    let queryUrl = this.APIURL + `/FCP/I203/getCustomerList`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // 取得鋼種清單
  getSteelTypeList1() {
    console.log('api service getSteelTypeList');
    let queryUrl = this.APIURL + `/FCP/I203/getSteelTypeList`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // 取得ASAP滾表結果
  getPPSI203ListData1() {
    console.log('api service getPPSI203List');
    let queryUrl = this.APIURL + `/FCP/I203/getPPSI203ListData`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // 取得ASAP滾表結果
  getPPSI203MasterListData() {
    console.log('api service getPPSI203MasterList');
    let queryUrl = this.APIURL + `/FCP/I203/getPPSI203_MasterListData`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // 取得ASAP副表滾表結果
  getPPSI203_DetailListData(_ID) {
    console.log('api service getPPSI203_DetailListData');
    let queryUrl = this.APIURL + `/FCP/I203/getPPSI203_DetailListData/${_ID}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //addPPSI203Data ASAP調整insert存檔
  addPPSI203Data(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I203/addPPSI203Data';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //addPPSI203DetailData ASAP調整insert存檔
  addPPSI203DetailData(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I203/addPPSI203DetailData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  update203DetailSave(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I203/updatePPSI203DetailDataSave`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // editPPSI203Data ASAP調整update存檔
  editPPSI203_M_Data(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I203/editPPSI203_M_Data';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //deletePPSI203Data 刪除ASAP調整(主表及副表)資料
  deletePPSI203Data(_ID) {
    let queryUrl = this.APIURL + `/FCP/I203/deletePPSI203_MD_Data/${_ID}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }
  //deletePPSI203DetailData 刪除ASAP調整(副表)資料
  deletePPSI203DetailData(_M_ID, _cust_abbreviations) {
    let queryUrl =
      this.APIURL +
      `/FCP/I203/deletePPSI203_D_Data/${_M_ID}/${_cust_abbreviations}`;
    return this.http.post(queryUrl, '', this.httpOptions);
  }

  getPPSI203ListUse_MID_InExportExcel(_result) {
    const body = JSON.stringify(_result);
    console.log('api service getPPSI203ListUse_MID_InExportExcel');
    console.log(body);
    let queryUrl =
      this.APIURL + `/FCP/I203/getPPSI203ListUse_MID_InExportExcel`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //getTbppsm101List 取得getTbppsm101List
  getTbppsm101List(_plantCode) {
    let queryUrl = this.APIURL + `/FCP/I205/getTbppsm101List/${_plantCode}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //getTbppsm102List 取得getTbppsm102List
  getTbppsm102List(_plantCode) {
    let queryUrl = this.APIURL + `/FCP/I205/getTbppsm102List/${_plantCode}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // MO I205_401 DataList
  getTbppsm119ListAll(_plantCode) {
    let queryUrl = this.APIURL + `/FCP/I205/getTbppsm119ListAll/${_plantCode}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //getTbppsm102ListAll 取得getTbppsm102ListAll
  getTbppsm102ListAll(_plantCode) {
    let queryUrl = this.APIURL + `/FCP/I205/getTbppsm102ListAll/${_plantCode}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // MO I205_401 MO Edition
  getTbppsm119VerList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I205/getTbppsm119VerList`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  converTBPPSM119Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I205/converTBPPSM119Data`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  convertTBPPSM102AutoCampaign(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I205/convertTBPPSM102AutoCampaign`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //getTbppsm113List getTbppsm113List
  getTbppsm113List(_plantCode) {
    let queryUrl = this.APIURL + `/FCP/I205/getTbppsm113List/${_plantCode}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //getppsfcptb16_ms_cust_sortList getppsfcptb16_ms_cust_sortList
  getPpsfcptb16MsCustSortList(_fcpEditionList) {
    let queryUrl =
      this.APIURL + `/FCP/I205/getPpsfcptb16MsCustSortList/${_fcpEditionList}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  getTbppsm100List(_plantCode) {
    let queryUrl = this.APIURL + `/FCP/I205/getTbppsm100List/${_plantCode}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  convertToTbppsm100(_data) {
    const body = JSON.stringify(_data);
    console.log(body);
    let queryUrl = this.APIURL + `/FCP/I205/convertToTbppsm100`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getFcpList(_plantCode) {
    let queryUrl = this.APIURL + `/FCP/I205/getFcpEditionList/${_plantCode}`;
    console.log(`API Url : ${queryUrl}`);
    return this.http.get<any>(queryUrl);
  }

  ppsi205100getShopCode(_parms) {
    const body = JSON.stringify(_parms);
    console.log(body);
    let endpointUrl = this.APIURL + `/FCP/I205/getShopCode`;
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  //upd102ListData 修改102List
  upd102ListData(obj) {
    const body = JSON.stringify(obj);
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I205/upd102ListData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  upd401AutoCampaignData(obj) {
    const body = JSON.stringify(obj);
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I205/upd401AutoCampaignData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //upd113ListData 修改102List
  upd113ListData(obj) {
    const body = JSON.stringify(obj);
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I205/upd113ListData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //importI205Excel 優先順序表EXCEL匯入 1. 420/430尺寸  2.401COMPAIGN
  importI205Excel(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I205/importI205Excel';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // 上傳到Compaign
  importCompaign(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I205/importCompaign';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //getRunFCPCount 取得目前正在執行的FCP (所有靜態資料、執行策略皆共用)
  getRunFCPCount(plant:string = '直棒') {
    let queryUrl = this.APINEWURL + `/FCP/I210/getRunFCPCount/${plant}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //Get getPlanSetData 規劃策略清單 (I210-I220 共用)
  getPlanSetData(_plant) {
    console.log('api service getPlanSetData');
    let queryUrl = this.APINEWURL + `/FCP/I210/getPlanSetData/${_plant}`;
    console.log(queryUrl);
    return this.http.get<any>(queryUrl);
  }
  //Get getShopSortingList (I210-I220-I230 共用)
  getShopSortingList(_type, _value) {
    // _type: I-210新增；Q-其他所有查詢
    console.log('api service getShopSortingList');
    let queryUrl =
      this.APINEWURL + `/FCP/I230/getShopSortingList/${_type}/${_value}`;
    console.log(queryUrl);
    return this.http.get<any>(queryUrl);
  }
  //Get getShopMachineSortingList (I210-I220-I230 共用)
  getShopMachineSortingList(_type, _value) {
    // _type: I-210新增；Q-其他所有查詢
    console.log('api service getShopMachineSortingList');
    let queryUrl =
      this.APINEWURL + `/FCP/I230/getShopMachineSortingList/${_type}/${_value}`;
    console.log(queryUrl);
    return this.http.get<any>(queryUrl);
  }

  // 刪除某筆規劃策略
  deletePlanSetData(planSetEdition: string) {
    const httpParams = new HttpParams().set('planSetEdition', planSetEdition);

    console.log('api service deletePlanSetData');
    const queryUrl = this.APINEWURL + `/FCP/I210/deletePlanSetData`;
    console.log(`刪除策略API --> ${queryUrl}`);
    console.log(`刪除策略API參數 --> ${planSetEdition}`);
    return this.http.delete(queryUrl, { params: httpParams });
  }

  // 獲取MO站別搬移順序選項
  getMoSort() {
    console.log('api service 獲取MO站別搬移順序選項');
    const queryUrl = this.APINEWURL + `/FCP/I230/getMoSort`;
    console.log(`獲取MO站別搬移順序選項API --> ${queryUrl}`);
    console.log(`刪除策略API參數 --> 無`);
    return this.http.get(queryUrl);
  }

  //Get getPlanSetInitstData 取得規劃策略基礎表
  getPlanSetInitstData() {
    let queryUrl = this.APIURL + '/FCP/I210/getPlanSetInitstData';
    return this.http.get(queryUrl);
  }
  //Get getPickerShopData sorting表的站別
  getPickerShopData(_plant) {
    let queryUrl = `${this.APINEWURL}/FCP/I210/getPickerShopData/${_plant}`;
    return this.http.get<any>(queryUrl);
  }
  //Get getPickerMachineData 下拉機台 by 站別
  getPickerMachineData(_plant, _shop) {
    let queryUrl = this.APINEWURL + `/FCP/I210/getPickerMachineData/${_plant}/${_shop}`;
    return this.http.get<any>(queryUrl);
  }
  //Get getPickerSortData sorting表的排序 by 站別
  getPickerSortData(_plant, _shop, _machine) {
    let queryUrl =
      this.APINEWURL + `/FCP/I210/getPickerSortData/${_plant}/${_shop}/${_machine}`;
    return this.http.get<any>(queryUrl);
  }
  //Get getRequierList sorting內的 集批條件
  getRequierList(_sort) {
    let queryUrl = this.APINEWURL + `/FCP/I210/getRequierList/${_sort}`;
    return this.http.get<any>(queryUrl);
  }
  //Get getRequierNAME 集批條件中文顯示
  getRequierNAME(_value) {
    let queryUrl = this.APINEWURL + `/FCP/I210/getRequierNAME/${_value}`;
    return this.http.get<any>(queryUrl);
  }
  //addPlanSetData 上傳規劃策略insert
  addPlanSetData(_result) {
    console.log('api service addPlanSetData');
    const body = JSON.stringify(_result);
    console.log(body);
    let queryUrl = this.APINEWURL + '/FCP/I210/addPlanSetData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //updPlanSetData 修改規劃策略update
  updPlanSetData(_result) {
    console.log('api service updPlanSetData');
    const body = JSON.stringify(_result);
    console.log(body);
    let queryUrl = this.APINEWURL + '/FCP/I210/updPlanSetData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // ----------------------------------------------------------------------------------------------------------------------------------------------- //

  //Get getCreatePlanDataList 取得規劃清單(僅建立)
  getCreatePlanDataList(plantType : string) {
    const httpParams = new HttpParams().set('plantType', plantType);
    let queryUrl = this.APINEWURL + `/FCP/I220/getCreatedPlanEditionData`; 
    return this.http.get<any>(queryUrl, { params: httpParams });
  }
  
  //Get getPlanDataList 取得規劃清單(含執行-最大一筆)
  getPlanDataList(plantType : string) {
    const httpParams = new HttpParams().set('plantType', plantType)
    let queryUrl = this.APINEWURL + '/FCP/I220/getNowPlanDataList'
    return this.http.get(queryUrl, { params: httpParams });
  }
  
  //Get getPlanDataListByPlan 取得規劃清單(取得該版次已執行過內容)
  getPlanDataListByPlan(_Plan, plant:string) {
    const httpParams = new HttpParams().set('planEdition', _Plan).set('plant', plant);
    let queryUrl = this.APINEWURL + `/FCP/I220/getPlanDataListByPlan`; 
    return this.http.get<any>(queryUrl,  { params: httpParams });
  }
  //addPlanData 建立規劃清單insert
  addPlanData(_result) {
    const body = JSON.stringify(_result);
    let queryUrl = this.APINEWURL + '/FCP/I220/insertPlanEditionData';
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }
  //updPlanData 修改規劃清單upd
  updPlanData(_result) {
    const body = JSON.stringify(_result);
    let queryUrl = this.APINEWURL + '/FCP/I220/updPlanData';
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }
  //delPlanData 刪除規劃清單_cancel_flag = '1'
  delPlanData(_result) {
    const body = JSON.stringify(_result);
    // let queryUrl = this.APIURL + '/FCP/I220/delPlanData';
    let queryUrl = this.APINEWURL + '/FCP/I220/deletePlanData';
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }
  //stopPlanData
  stopPlanData(_result) {
    const body = JSON.stringify(_result);
    let queryUrl = this.APINEWURL + `/FCP/I220/stopPlanData`; 
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }
  //publishData Publish 規劃案，FCP結果發版到工廠排程
  publishData(_result) {
    const body = JSON.stringify(_result);
    let queryUrl = this.APINEWURL + `/FCP/I220/publishData`; 
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }
  //updSCHEDULEPlanEdition 更改公版規劃案版本
  updSCHEDULEPlanEdition(_result) {
    const body = JSON.stringify(_result);
    let queryUrl = this.APINEWURL + `/FCP/I220/updateCommonPlanData`; 
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }
  //getTitleName 取得excel匯出表頭
  getTitleName() {
    let queryUrl = this.APINEWURL + `/FCP/I220/getTitleName`;
    return this.http.get(queryUrl);
  }

   // 獲取 tbppsm112 欄位的中英文對照
   getTbppsm112ColumnName() {
    let queryUrl = this.APINEWURL + `/FCP/I112/getTbppsm112ColumnName`;
    return this.http.get(queryUrl);
  }

  // getFCPResRepo 取得表內容
  getFCPResRepo(_data) {
    let queryUrl = this.APIURL + `/FCP/I220/getFCPResRepo/${_data}`;
    return this.http.get(queryUrl);
  }

  // getFCPResRepoDynamic 取得表內容(資料會隨著資料表有變更欄位而變更)
  getFCPResRepoDynamic(_data) {
    let queryUrl = this.APINEWURL + `/FCP/I220/exportExcelFcp16/${_data}`;
    return this.http.get(queryUrl, { responseType: 'arraybuffer' });
  }

  
  // 根據fcpEdition取得精整FCP執行結果資料
  getRefiningFcpResult( fcpEdition:string, batchSize:number = 3000) {
    let queryUrl = this.APINEWURL + `/FCP/I112/getRefiningFcpResult/${batchSize}/${fcpEdition}`;
    return this.http.get(queryUrl, { responseType: 'arraybuffer' });
  }

   // 刪除在後端產生的檔案避免佔用容量
   deleteFcp16File(fileName : string) {
    const httpParams = new HttpParams()
      .set('fileName', fileName);
    let queryUrl = `${this.APINEWURL}/FCP/I220/deleteFcp16File`;
    return this.http.get(queryUrl, { params: httpParams });
  }

  //StartFullRunPlan 啟動規劃案--->Full Run
  StartFullRunPlan(body) {
    // _type: A手動啟動、B排程啟動
    // let queryUrl = this.APIURL + `/FCP/Run/StartFullRunPlan/${_plan}/${_flag}/${_type}`;
    let queryUrl = this.APINEWURL + `/FCP/I220/startRunPlan`; 
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  //StartFullRunPlan 啟動規劃案--->Full Run
  newStartFullRunPlan(body) {
    // _type: A手動啟動、B排程啟動
    // let queryUrl = this.APIURL + `/FCP/Run/StartFullRunPlan/${_plan}/${_flag}/${_type}`;
    //let queryUrl = this.APINEWURL + `/FCP/I220/startRunPlan`; 
    let queryUrl = this.APINEWURL + `/FCP/I220/runPlanFcp`; 
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }
  
  //getFcpEdition 檢誤是否有FCP版次
  getFcpEdition(fcpEdition) {
    let queryUrl = this.APINEWURL + `/FCP/I220/getFcpEdition?edition=${fcpEdition}`; 
    return this.http.get<any>(queryUrl);
  }

    //getFcpEdition 檢誤是否有FCP版次
  getRefiningFcpEdition(fcpEdition) {
      let queryUrl = this.APINEWURL + `/FCP/I112/getRefiningFcpEdition?fcpEdition=${fcpEdition}`; 
      return this.http.get<any>(queryUrl);
  }
  
  //getICPMOVerList (共用)
  getICPMOVerList() {
    // let queryUrl = this.APIURL + '/FCP/I220/ICPMOVerList';
    let queryUrl = this.APINEWURL + `/FCP/I220/getHisMoEditionData`;
    return this.http.get<any>(queryUrl);
  }

  getICPMOVerListForRefining() {
    let queryUrl = this.APINEWURL + `/FCP/I220/getHisMoEditionDataForRefining`;
    return this.http.get<any>(queryUrl);
  }

  //getICPVerList (共用)
  getICPVerList() {
    // let queryUrl = this.APIURL + '/FCP/I220/ICPVerList';
    let queryUrl = this.APINEWURL + `/FCP/I220/getHisIcpEditionData`;
    console.log(queryUrl);
    return this.http.get<any>(queryUrl);
  }

  //getPlansetVerList 規劃策略版本-排除目前資料 (共用)
  getPlansetVerList(_edition, plantType:string) {
    const httpParams = new HttpParams().set('edition', _edition).set('plantType', plantType);
    let queryUrl = this.APINEWURL + `/FCP/I220/getPlansetVerList`;
    return this.http.get<any>(queryUrl , { params: httpParams });
  }

  //getPlanVerList 規劃案執行版本 (共用)
  getPlanVerList(_flag, plantType:string) {
    const httpParams = new HttpParams().set('flag', _flag).set('plantType', plantType);
    // let queryUrl = this.APIURL + `/FCP/I220/getPlanVerList/${_flag}`;
    let queryUrl = this.APINEWURL + `/FCP/I220/getPlanVerList`;
    return this.http.get<any>(queryUrl, { params: httpParams });
  }

  
  // http://ys-webapt1.walsin.com:8080/pps_FCP/rest/toMES/?FCP_Version=F20220714104112
  // publishDataToMsh
  publishDataToMsh(_result, _code) {
    let hostName = window.location.hostname;
    const body = JSON.stringify('');
    // let queryUrl = `http://${hostName}:8080/pps_FCP/rest/toMES/?FCP_Version=${_result}&shopRouting=${_code}`;
    let queryUrl = `http://ys-ppsapt01.walsin.corp:8080/pps_FCP/rest/toMES/?FCP_Version=${_result}&shopRouting=${_code}`;
    return this.http.post(queryUrl, body, {});
  }

  // ----------------------------------------------------------------------------------------------------------------------------------------------- //

  //Get getNewPlanData 啟動規劃案歷程
  getLogPlanData(_startrun, _plan, plantType) {
    console.log('api service getLogPlanData');
    let queryUrl =
      this.APINEWURL + `/FCP/I230/getLogPlanData/${_startrun}/${_plan}/${plantType}`;
    console.log(queryUrl);
    return this.http.get<any>(queryUrl);
  }
  //Get getStartLogData 規劃案執行log
  getStartLogData(_startrun, _planver) {
    console.log('api service getStartLogData');
    let queryUrl =
      this.APINEWURL + `/FCP/I230/getStartLogData/${_startrun}/${_planver}`;
    console.log(queryUrl);
    return this.http.get<any>(queryUrl);
  }


  // //Get getSaleAreaListData 訂單-交期彙總表
  // getSaleAreaListData() {
  //   let queryUrl = this.APIURL + "/FCP/R300/SaleAreaList";
  //   console.log(queryUrl);
  //   return this.http.get(queryUrl);
  // }

  // //Get getVerList
  // getVerList() {
  //   let queryUrl = this.APIURL + "/FCP/R300/VerList";
  //   console.log(queryUrl);
  //   return this.http.get(queryUrl);
  // }

  // //Get getMOVerList
  // getMOVerList(_ver) {
  //   let queryUrl = this.APIURL + `/FCP/R300/getMOVerList/${_ver}`;
  //   console.log(queryUrl);
  //   return this.http.get(queryUrl);
  // }

  // //Get getTBDate
  // getTBDate() {
  //   let queryUrl = this.APIURL + "/FCP/R300/TBDate";
  //   console.log(queryUrl);
  //   return this.http.get(queryUrl);
  // }

  // //Get TSalWeightData
  // getTSalWeightData() {
  //   let queryUrl = this.APIURL + "/FCP/R300/TSalWeight";
  //   console.log(queryUrl);
  //   return this.http.get(queryUrl);
  // }

  // //Get DSalWeightData 交期彙總表資料
  // getDSalWeightData(_rule, _ver, _MOver) {
  //   let queryUrl = this.APIURL + `/FCP/R300/DSalWeight/${_rule}/${_ver}/${_MOver}`;
  //   console.log(queryUrl);
  //   return this.http.get(queryUrl);
  // }

  // //Get FCP Result
  // getFCPResDtlData(_date1, _date2, _date3, _date4, _flag, _rule, _ver, _MOver) {
  //   let queryUrl = this.APIURL + `/FCP/R300/FCPResDtlData/${_date1}/${_date2}/${_date3}/${_date4}/${_flag}/${_rule}/${_ver}/${_MOver}`;
  //   console.log(queryUrl);
  //   return this.http.get(queryUrl);
  // }

  // //Get getTB_SCHSHOPCODE Result
  // getTB_SCHSHOPCODE(_order, _item, _ver, _stp, _MOver ) {
  //   let queryUrl = this.APIURL + `/FCP/R300/getTB_SCHSHOPCODE/${_order}/${_item}/${_ver}/${_stp}/${_MOver}`;
  //   console.log(queryUrl);
  //   return this.http.get(queryUrl);
  // }

  // //Get getDelayOrder Result
  // getDelayOrder(_rule, _ver, _MOver) {
  //   let queryUrl = this.APIURL + `/FCP/R300/getDelayOrder/${_rule}/${_ver}/${_MOver}`;
  //   console.log(queryUrl);
  //   return this.http.get(queryUrl);
  // }

  // //Get FCP Result
  // getFCPResData() {
  //   let queryUrl = this.APIURL + "/FCP/R300/FCPResult";
  //   console.log(queryUrl);
  //   return this.http.get(queryUrl);
  // }

  // getUploadURL() {
  //   return this.APIURL + "/FCP/R300/UPLOAD";
  // }

  // http://localhost:8080/pps/rest/FCP/Summary?startDate=2019-03-01&endtDate=2019-04-01
  //Get Summary
  getOemOrderSummary(_startDate, _endDate) {
    let queryUrl = `${this.APIURL}/Summary?startDate=${_startDate}&endtDate=${_endDate}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  downloadPdfFile(_oemOrder, _version) {
    let queryUrl = `${this.APIURL}/download/${_oemOrder}/${_version}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  getDownloadFileURL(_oemOrder, _version) {
    let queryUrl = `${this.APIURL}/download/${_oemOrder}/${_version}`;
    // console.log(queryUrl);
    return queryUrl;
  }

  //http://localhost:8080/pps/rest/FCP/update/DownloadLog

  //updateOrderFinishFlag
  updateDownloadLog(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/R300/update/DownloadLog';
    return this.http.put(queryUrl, body, this.httpOptions);
  }

  // http://localhost:8080/pps/rest/FCP/cas/login/?username=UR07231&password=1234
  //Get Summary
  casLogin(_username, _password, _env) {
    _password = encodeURIComponent(_password);
    let queryUrl = `${this.APIURL}/FCP/R300/cas/login/?username=${_username}&password=${_password}&env=${_env}`;
    // console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  casLoginWithPost(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    // let queryUrl = this.APIURL + "/DELETE/WIPCUR";
    let queryUrl =
      'http://apptst.walsin.com:8083/RecevieGoodsAPI/rest/ReceiveGoods/cas/login';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // http://10.106.2.151:8000/Coil_Work_Detail/?PLAN_START_TYPE=F&STARTRUN_TIME=20220719132801&PLAN_EDITION=20220719132801&ORDER_LIST={}&ICP_EDITION=20220719132801&MO=20220719132801
  // StartICP 啟動 ICP
  StartICP(_result) {
    const body = JSON.stringify(_result);
    console.log('StartICP');
    console.log(body);
    let queryUrl = 'http://10.106.2.151:8000/Coil_Work_Detail/';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // http://ys-webapt1.walsin.com:8080/pps_FCP/rest/run/execute?startPoint=ASAP
  // StartICP 啟動 FCP
  StartFCP(_flag, _result) {
    let hostName = window.location.hostname;
    const body = JSON.stringify(_result);
    console.log('StartFCP');
    console.log(body);
    let queryUrl = `http://${hostName}:8080/pps_FCP/rest/run/execute?startPoint=${_flag}`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }


  /*** 機台負荷表*/
  getR301DataList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/R301/queryDataList';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //Get getVerList
  getR301VerList() {
    let queryUrl = this.APIURL + '/FCP/R301/VerList';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // 機台負荷明細資料
  getR301DtlList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/R301/getR301DtlList';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //获取版本号仅限当月，报表使用
  getCurrentMonVerList(param) {
    let queryUrl = this.APINEWURL + '/FCP/R302' + param + '/VerList';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // 取得區域別，報表使用
  getAreaGroup() {
    let queryUrl = this.APINEWURL + '/FCP/R302/getAreaGroup';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //获取当月设定
  getWeekData() {
    let queryUrl = this.APINEWURL + '/FCP/R302/getWeekData';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //获取交期总表数据
  getR302DataList(param, _data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + '/FCP/R302' + param + '/queryDataList';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //获取交期总表第一層数据
  getR302FirstModalDataList(param, _data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + '/FCP/R302' + param + '/getFirstModalData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //獲取延遲訂單信息
  getR302DelayDataList(param, _data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + '/FCP/R302' + param + '/getDelayDataList';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //獲取訂單詳情 第二層modal
  getR302OrderDataList(param, _data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + '/FCP/R302' + param + '/getSecondModalData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // 取得mes以入庫量明細
  getR302MesDtlList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + '/FCP/R302/getR302MesDtlList';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  /////////////////////////////////////////////////////////////
  // PPSI130 批次爐鋼種捲數製程碼對應表
  /////////////////////////////////////////////////////////////

  saveTbppsm014Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I130/saveI130Data`;
    console.log('新增「批次爐鋼種捲數製程碼對應表」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  listTbppsm014DataByPagination(pageIndex: number, pageSize: number) {
    const httpParams = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    console.log('查詢「批次爐鋼種捲數製程碼對應表」資料');
    let endpointUrl = this.APIURL + `/FCP/I130/listI130Data`;
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:pageIndex=>${pageIndex}, pageSize=>${pageSize}`);
    return this.http.get<any>(endpointUrl, { params: httpParams });
  }

  updateTbppsm014Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I130/updateI130Data`;
    console.log('更新「批次爐鋼種捲數製程碼對應表」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${body}`);
    return this.http.put<any>(endpointUrl, body, this.httpOptions);
  }

  deleteTbppsm014Data(id: number) {
    let endpointUrl = this.APIURL + `/FCP/I130/deleteI130Data/${id}`;
    console.log('刪除「批次爐鋼種捲數製程碼對應表」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${id}`);
    return this.http.delete<any>(endpointUrl);
  }

  searchTbppsm014ColumnDataByKeyword(
    column: string,
    keyword: string,
    pageIndex: number,
    pageSize: number
  ) {
    const httpParams = new HttpParams()
      .set('columnName', column)
      .set('keyword', keyword)
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    console.log('搜尋「批次爐鋼種捲數製程碼對應表」資料');
    let endpointUrl = this.APIURL + `/FCP/I130/searchI130Data`;
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    return this.http.get<any>(endpointUrl, { params: httpParams });
  }

  deleteTbppsm014AllData() {
    let endpointUrl = this.APIURL + `/FCP/I130/deleteI130AllData`;
    console.log('刪除「批次爐鋼種捲數製程碼對應表」所有資料');
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 : 無`);
    return this.http.delete<any>(endpointUrl);
  }

  batchSaveTbppsm014Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I130/batchInsertI130Data`;
    console.log('批次新增「批次爐鋼種捲數製程碼對應表」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  listTbppsm014AllData() {
    console.log('查詢「批次爐鋼種捲數製程碼對應表」所有資料');
    let endpointUrl = this.APIURL + `/FCP/I130/listI130AllData`;
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 : 無`);
    return this.http.get<any>(endpointUrl);
  }

  getEquipCodeList(_data) {
    console.log('查詢「站別機台關聯表」所有資料');
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I109/getEquipCodeList`;
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 :${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  getR304DataList() {
    let endpointUrl = `${this.APINEWURL}/FCP/R304/getPPSR304List`;
    return this.http.get<any>(endpointUrl);
  }

  batchSaveR304Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = `${this.APINEWURL}/FCP/R304/insertPPSR304BatchSave`;
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 :${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  getR305DataList(plantCode) {
    let endpointUrl = `${this.APINEWURL}/FCP/R305/getPPSR305List/${plantCode}`;
    return this.http.get<any>(endpointUrl);
  }

  batchSaveR305Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = `${this.APINEWURL}/FCP/R305/insertPPSR305BatchSave`;
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 :${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  getR306EditionList() {
    let endpointUrl = `${this.APINEWURL}/FCP/R306/getPPSR306EditionList`;
    return this.http.get<any>(endpointUrl);
  }

  getR306DataList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = `${this.APINEWURL}/FCP/R306/getPPSR306List`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  getR307Editionist() {
    let endpointUrl = this.APIURL + `/FCP/R307/getPPSR307Edition`;
    return this.http.get<any>(endpointUrl);
  }

  getR307DataList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = `${this.APINEWURL}/FCP/R307/getPPSC307List`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  convertR308Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R308/converData`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR308Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R308/getPPSR308Data`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  /////////////////////////////////////////////////////////////
  // PPSI131 直棒批次爐表
  /////////////////////////////////////////////////////////////

  savetbppsm114Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I131/saveI131Data`;
    console.log('新增「直棒批次爐表」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  listtbppsm114DataByPagination(pageIndex: number, pageSize: number) {
    const httpParams = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    console.log('查詢「直棒批次爐表」資料');
    let endpointUrl = this.APIURL + `/FCP/I131/listI131Data`;
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:pageIndex=>${pageIndex}, pageSize=>${pageSize}`);
    return this.http.get<any>(endpointUrl, { params: httpParams });
  }

  updatetbppsm114Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I131/updateI131Data`;
    console.log('更新「直棒批次爐表」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${body}`);
    return this.http.put<any>(endpointUrl, body, this.httpOptions);
  }

  deletetbppsm114Data(id: number) {
    let endpointUrl = this.APIURL + `/FCP/I131/deleteI131Data/${id}`;
    console.log('刪除「直棒批次爐表」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${id}`);
    return this.http.delete<any>(endpointUrl);
  }

  searchtbppsm114ColumnDataByKeyword(
    column: string,
    keyword: string,
    pageIndex: number,
    pageSize: number
  ) {
    const httpParams = new HttpParams()
      .set('columnName', column)
      .set('keyword', keyword)
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    console.log('搜尋「直棒批次爐表」資料');
    let endpointUrl = this.APIURL + `/FCP/I131/searchI131Data`;
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    return this.http.get<any>(endpointUrl, { params: httpParams });
  }

  deletetbppsm114AllData() {
    let endpointUrl = this.APIURL + `/FCP/I131/deleteI131AllData`;
    console.log('刪除「直棒批次爐表」所有資料');
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 : 無`);
    return this.http.delete<any>(endpointUrl);
  }

  batchSavetbppsm114Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/I131/batchInsertI131Data`;
    console.log('批次新增「直棒批次爐表」資料');
    console.log(`請求API Endpoint Url:${endpointUrl}`);
    console.log(`請求API 參數:${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  listtbppsm114AllData() {
    console.log('查詢「直棒批次爐表」所有資料');
    let endpointUrl = this.APIURL + `/FCP/I131/listI131AllData`;
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 : 無`);
    return this.http.get<any>(endpointUrl);
  }

  getR309Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R308/getPPSR309List`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR310Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R310/getPPSR310Data`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR308VerListData(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R308/getVerList`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  importppsfcptb13TablExcel(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/I201/importppsfcptb13TablExcel`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getTBPPSM107(plant:string) {
    let queryUrl = this.APINEWURL + `/FCP/I112/getTBPPSM107/${plant}`;
    console.log(queryUrl);
    return this.http.get<any>(queryUrl).toPromise();
  }

  insertTBPPSM107(body) {
    let queryUrl = this.APINEWURL + `/FCP/I112/insertTBPPSM107`;
    console.log(queryUrl);
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  updateTBPPSM107(body){
    let queryUrl = this.APINEWURL + `/FCP/I112/updateTBPPSM107`;
    console.log(queryUrl);
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  delTBPPSM107(plant : string, id : number) {
    let queryUrl =
      this.APINEWURL + `/FCP/I112/delTBPPSM107/${plant}/${id}`;
    return this.http.get<any>(queryUrl);
  }

  getEquipCode(plant : string, shopCode : string) {
    let endpointUrl = this.APINEWURL + `/FCP/I112/getEquipCode/${plant}/${shopCode}`;
    return this.http.get<any>(endpointUrl);
  }

  getShopCode(plant : string) {
    let queryUrl = this.APINEWURL + `/FCP/I112/getShopCode/${plant}`;
    console.log(queryUrl);
    return this.http.get<any>(queryUrl);
  }

  importTBPPSM107Excel(body) {
    let queryUrl =
      this.APINEWURL + `/FCP/I112/importExcelPPSI112`;
    console.log(queryUrl);
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  getCondition() {
    let querUrl = this.APIURL + `/FCP/I112/getCondition`;
    return this.http.get(querUrl);
  }

  orderPPSI112(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I112` + nonbarUrl + `/orderPPSI112`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //Get gettbppsm012List 取得tab14 data
  gettbppsm012List(pageIndex: number, pageSize: number) {
    const httpParams = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    console.log('api service gettbppsm012List');
    let queryUrl = this.APIURL + '/FCP/I101/gettbppsm012List';
    console.log(queryUrl);
    return this.http.get<any>(queryUrl, { params: httpParams });
  }

  //Get getTbppsm012NonBarList 取得產率設定資料
  gettbppsm012NonBarList(pageIndex: number, pageSize: number) {
    const httpParams = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    console.log('api service gettbppsm012NonBarList');
    let queryUrl = this.APIURL + `/FCP/I101/NonBar/gettbppsm012NonBarList`;
    console.log(queryUrl);
    return this.http.get<any>(queryUrl, { params: httpParams });
  }

  //importI109Excel
  importI109Excel(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I101/importI109Excel`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  insertI109Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I101/insertI109Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //importI109NonBarExcel
  importI109NonBarExcel(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I101/NonBar/importI109NonBarExcel`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  insertI109NonBarSave(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I101/NonBar/insertI109NonBarSave`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  upd012BarData(_data) {
    const body = JSON.stringify(_data);
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I101/upd012BarData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  upd012NonBarData(obj) {
    const body = JSON.stringify(obj);
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I101/NonBar/upd012NonBarData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  del012NonBarTabData(_ID) {
    const body = JSON.stringify(_ID);
    console.log(body);
    let queryUrl = this.APIURL + `/FCP/I101/NonBar/del012NonBarTabData/${_ID}`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getI109ShopCodeList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I101/NonBar/getI109ShopCodeList`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getI109GradeNoList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I101/NonBar/getI109GradeNoList`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getShipRepoEditionList() {
    console.log('Api Service 獲取報表維護版次');
    const queryUrl = `${this.APINEWURL}/FCP/R311/getShipRepoEditionList`;
    console.log(`Api Service 獲取報表維護版次 url -> ${queryUrl}`);
    return this.http.get(queryUrl);
  }

  getPPSC311DataList(edition: string) {
    console.log('Api Service 獲取訂單結轉資料');
    const queryUrl = `${this.APINEWURL}/FCP/R311/getPPSC311Data/${edition}`;
    console.log(`Api Service 獲取訂單節轉資料 url -> ${queryUrl}`);
    console.log(`Api Service 獲取訂單節轉資料 參數 -> ${edition}`);
    return this.http.get(queryUrl);
  }

  getPPSC312Data(edition: string) {
    console.log('Api Service 獲取入庫儲區異動資料');
    const queryUrl = `${this.APINEWURL}/FCP/R312/getPPSC312Data/${edition}`;
    console.log(`Api Service 獲取入庫儲區異動資料 url -> ${queryUrl}`);
    console.log(`Api Service 獲取入庫儲區異動資料 參數 -> ${edition}`);
    return this.http.get(queryUrl);
  }

  getPPSC312Tbppsrm009Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R312/getTbppsrm009Data`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getPPSC312Tbppsrm009VerListData(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R312/getTbppsrm009VerListData`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //importPPSI116Excel
  importExcelPPSI116(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I116/importExcelPPSI116`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getNonBarShopList() {
    console.log('Api Service 獲取非直棒站別資料');
    const queryUrl = `${this.APIURL}/FCP/I202/NonBar/getShopList`;
    console.log(`Api Service 獲取非直棒站別資料 url -> ${queryUrl}`);
    console.log(`Api Service 獲取非直棒站別資料 參數 -> 無`);
    return this.http.get(queryUrl);
  }

  getEquipsByShopList(shopList: any) {
    console.log('Api Service 獲取非直棒機台資料');
    const queryUrl = `${this.APIURL}/FCP/I202/NonBar/getEquipsByShopList`;
    console.log(`Api Service 獲取非直棒機台資料 url -> ${queryUrl}`);
    console.log(
      `Api Service 獲取非直棒機台資料 參數 -> ${JSON.stringify(shopList)}`
    );
    return this.http.post(queryUrl, shopList, this.httpOptions);
  }

  batchSaveShutdownList(ppsI202NonBarRequest: any) {
    console.log('Api Service 批次新增非直棒停機定修表');
    const queryUrl = `${this.APIURL}/FCP/I202/NonBar/batchSaveShutdownList`;
    console.log(`Api Service 批次新增非直棒停機定修表 url -> ${queryUrl}`);
    console.log(
      `Api Service 批次新增非直棒停機定修表 參數 -> ${JSON.stringify(
        ppsI202NonBarRequest
      )}`
    );
    return this.http.post(queryUrl, ppsI202NonBarRequest, this.httpOptions);
  }

  batchSaveShutdownListForExcelImport(jsonExcelData: any[]) {
    console.log('Api Service 批次Excel匯入非直棒停機定修資料');
    const queryUrl = `${this.APIURL}/FCP/I202/NonBar/batchSaveShutdownListForExcelImport`;
    console.log(
      `Api Service 批次Excel匯入非直棒停機定修資料 url -> ${queryUrl}`
    );
    console.log(
      `Api Service 批次Excel匯入非直棒停機定修資料 參數 -> ${JSON.stringify(
        jsonExcelData
      )}`
    );
    return this.http.post(queryUrl, jsonExcelData, this.httpOptions);
  }

  getShutdownDataList(parms: any) {
    console.log('Api Service 獲取非直棒停機資料');
    const queryUrl = `${this.APIURL}/FCP/I202/NonBar/getShutdownDataList`;
    console.log(`Api Service 獲取非直棒停機資料 url -> ${queryUrl}`);
    console.log(
      `Api Service 獲取非直棒停機資料 參數 -> ${JSON.stringify(parms)}`
    );
    return this.http.post(queryUrl, parms, this.httpOptions);
  }

  getShutdownDataListForExcelExport(year: string, month: string) {
    const httpParams = new HttpParams().set('year', year).set('month', month);
    console.log('Api Service 獲取非直棒停機資料(for Excel下載)');
    const queryUrl = `${this.APIURL}/FCP/I202/NonBar/getShutdownDataListForExcelExport`;
    console.log(
      `Api Service 獲取非直棒停機資料(for Excel下載) url -> ${queryUrl}`
    );
    console.log(
      `Api Service 獲取非直棒停機資料(for Excel下載) 參數 -> ${{
        year: year,
        month: month,
      }}`
    );
    return this.http.get(queryUrl, { params: httpParams });
  }

  updateShutdownData(shutdownData: any) {
    console.log('Api Service 更新非直棒停機資料');
    const queryUrl = `${this.APIURL}/FCP/I202/NonBar/updateShutdownData`;
    console.log(`Api Service 更新非直棒停機資料 url -> ${queryUrl}`);
    console.log(
      `Api Service 更新非直棒停機資料 參數 -> ${JSON.stringify(shutdownData)}`
    );
    return this.http.put(queryUrl, shutdownData, this.httpOptions);
  }

  deleteShutdownData(deleteCondition: any) {
    console.log('Api Service 刪除非直棒停機資料');
    const queryUrl = `${this.APIURL}/FCP/I202/NonBar/deleteShutdownData`;
    // console.log(`Api Service 刪除非直棒停機資料 url -> ${queryUrl}`);
    // console.log(
    //   `Api Service 刪除非直棒停機資料 參數 -> ${JSON.stringify(
    //     deleteCondition
    //   )}`
    // );
    return this.http.delete(queryUrl, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: deleteCondition,
    });
  }

  convertR344Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R344/convertR344Data`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR344HeaderData(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R344/getPPSR344HeaderData`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR344Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R344/getPPSR344Data`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR343Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R343/getPPSR343Data`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  addShiftData(shiftData: any) {
    console.log('Api Service 新增月推移報表維護資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/addShiftData`;
    // console.log(`Api Service 獲取非直棒停機資料 url -> ${queryUrl}`);
    // console.log(
    //   `Api Service 獲取非直棒停機資料 參數 -> ${JSON.stringify(shiftData)}`
    // );
    return this.http.post(queryUrl, shiftData, this.httpOptions);
  }

  deleteShiftData(shiftEdition: string) {
    console.log('Api Service 刪除「月推移報表」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/deleteShiftData`;
    const httpParams = new HttpParams().set('shiftEdition', shiftEdition);
    // console.log(`Api Service 刪除「月推移報表」資料 url -> ${queryUrl}`);
    // console.log(`Api Service 刪除「月推移報表」資料 參數 -> ${shiftEdition}`);
    return this.http.delete(queryUrl, {
      headers: this.httpOptions.headers,
      params: httpParams,
    });
  }

  cloneShiftData(rowData: any) {
    console.log('Api Service 複製「月推移報表」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/cloneShiftData`;
    // console.log(`Api Service 複製「月推移報表」資料 url -> ${queryUrl}`);
    // console.log(
    //   `Api Service 複製「月推移報表」資料 參數 -> ${JSON.stringify(rowData)}`
    // );
    return this.http.post(queryUrl, rowData, this.httpOptions);
  }

  findAllShiftData() {
    console.log('Api Service 獲取「月推移報表」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/findAllShiftData`;
    return this.http.get(queryUrl);
  }

  getDetail01ByShiftEdition(shiftEdition: string) {
    const httpParams = new HttpParams().set('shiftEdition', shiftEdition);
    console.log('Api Service 獲取「月推移報表」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/getDetail01ByShiftEdition`;
    return this.http.get(queryUrl, { params: httpParams });
  }

  insertOrUpdateDetail01(ppsc321Detail01List: any[]) {
    console.log('Api Service 新增或更新「預計入庫資訊」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/insertOrUpdateDetail01`;
    // console.log(
    //   `Api Service 新增或更新「預計入庫資訊」資料 url -> ${queryUrl}`
    // );
    // console.log(
    //   `Api Service 新增或更新「預計入庫資訊」資料 參數 -> ${JSON.stringify(
    //     ppsc321Detail01List
    //   )}`
    // );
    return this.http.post(queryUrl, ppsc321Detail01List, this.httpOptions);
  }

  findAllGrade() {
    console.log('Api Service 獲取「鋼種」清單');
    const queryUrl = `${this.APINEWURL}/FCP/C321/findAllGrade`;
    // console.log(`Api Service 獲取「鋼種」清單 url -> ${queryUrl}`);
    return this.http.get(queryUrl);
  }

  insertDetail02(rowData: any) {
    console.log('Api Service 新增「特殊鋼種量」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/insertDetail02`;
    // console.log(`Api Service 新增「特殊鋼種量」資料 url -> ${queryUrl}`);
    // console.log(
    //   `Api Service 新增「特殊鋼種量」資料 參數 -> ${JSON.stringify(rowData)}`
    // );
    return this.http.post(queryUrl, rowData, this.httpOptions);
  }

  findAllDetail02(shiftEdition: string) {
    const httpParams = new HttpParams().set('shiftEdition', shiftEdition);
    console.log('Api Service 查詢「特殊鋼種量」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/findAllDetail02`;
    // console.log(`Api Service 查詢「特殊鋼種量」資料 url -> ${queryUrl}`);
    // console.log(`Api Service 查詢「特殊鋼種量」資料 參數 -> ${shiftEdition}`);
    return this.http.get(queryUrl, { params: httpParams });
  }

  updateDetail02ByPk(rowData: any) {
    console.log('Api Service 更新「特殊鋼種量」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/updateDetail02ByPk`;
    // console.log(`Api Service 更新「特殊鋼種量」資料 url -> ${queryUrl}`);
    // console.log(
    //   `Api Service 更新「特殊鋼種量」資料 參數 -> ${JSON.stringify(rowData)}`
    // );
    return this.http.put(queryUrl, rowData, this.httpOptions);
  }

  deleteDetail02ByPk(rowData: any) {
    console.log('Api Service 刪除「特殊鋼種量」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/deleteDetail02ByPk`;
    // console.log(`Api Service 刪除「特殊鋼種量」資料 url -> ${queryUrl}`);
    // console.log(
    //   `Api Service 刪除「特殊鋼種量」資料 參數 -> ${JSON.stringify(rowData)}`
    // );
    return this.http.delete(queryUrl, {
      headers: this.httpOptions.headers,
      body: rowData,
    });
  }

  findAllDetail04(shiftEdition: string) {
    const httpParams = new HttpParams().set('shiftEdition', shiftEdition);
    console.log('Api Service 查詢「頭份尺寸對照設定」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/findAllDetail04`;
    // console.log(`Api Service 查詢「頭份預計回廠尺寸」資料 url -> ${queryUrl}`);
    // console.log(`Api Service 查詢「頭份預計回廠尺寸」資料 參數 -> ${shiftEdition}`);
    return this.http.get(queryUrl, { params: httpParams });
  }

  insertDetail04(rowData: any) {
    console.log('Api Service 新增「頭份尺寸對照設定」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/insertDetail04`;
    // console.log(`Api Service 新增「頭份預計回廠尺寸」資料 url -> ${queryUrl}`);
    // console.log(`Api Service 新增「頭份預計回廠尺寸」資料 參數 -> ${JSON.stringify(rowData)}`);
    return this.http.post(queryUrl, rowData, this.httpOptions);
  }

  updateDetail04ByPk(rowData: any) {
    console.log('Api Service 更新「頭份尺寸對照設定」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/updateDetail04ByPk`;
    // console.log(`Api Service 更新「頭份預計回廠尺寸」資料 url -> ${queryUrl}`);
    // console.log(`Api Service 更新「頭份預計回廠尺寸」資料 參數 -> ${JSON.stringify(rowData)}`);
    return this.http.put(queryUrl, rowData, this.httpOptions);
  }

  deleteDetail04ByPk(rowData: any) {
    console.log('Api Service 刪除「頭份尺寸對照設定」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/deleteDetail04ByPk`;
    // console.log(`Api Service 刪除「頭份預計回廠尺寸」資料 url -> ${queryUrl}`);
    // console.log(`Api Service 刪除「頭份預計回廠尺寸」資料 參數 -> ${JSON.stringify(rowData)}`);
    return this.http.delete(queryUrl, {
      headers: this.httpOptions.headers,
      body: rowData,
    });
  }

  batchInsertDetail04(rowDataList: any) {
    console.log('Api Service 批次匯入「頭份尺寸對照設定」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/batchInsertDetail04`;
    return this.http.post(queryUrl, rowDataList, this.httpOptions);
  }

  getDetail03ByCondition(shiftEdition: string, masterType: string) {
    const httpParams = new HttpParams()
      .set('shiftEdition', shiftEdition)
      .set('masterType', masterType);

    let type = '';
    if (masterType === '1') {
      type = '頭份預計回廠日';
    } else if (masterType === '2') {
      type = '退火生產資訊';
    } else if (masterType === '3') {
      type = '排程生產原則說明';
    }

    console.log(`Api Service 獲取「${type}」資料`);
    const queryUrl = `${this.APINEWURL}/FCP/C321/getDetail03ByCondition`;
    console.log(`Api Service 獲取「${type}」資料 url -> ${queryUrl}`);
    console.log(
      `Api Service 獲取「${type}」資料 參數 -> ${shiftEdition},${masterType}`
    );
    return this.http.get(queryUrl, { params: httpParams });
  }

  updateDetail03ByPk(rowData: any) {
    let type = '';
    if (rowData.masterType === '1') {
      type = '頭份預計回廠日';
    } else if (rowData.masterType === '2') {
      type = '退火生產資訊';
    }

    console.log(`Api Service 更新「${type}」資料`);
    const queryUrl = `${this.APINEWURL}/FCP/C321/updateDetail03ByPk`;
    console.log(`Api Service 更新「${type}」資料 url -> ${queryUrl}`);
    console.log(
      `Api Service 更新「${type}」資料 參數 -> ${JSON.stringify(rowData)}`
    );
    return this.http.put(queryUrl, rowData, this.httpOptions);
  }

  insertDetail03(rowData: any) {
    let type = '';
    if (rowData.masterType === '1') {
      type = '頭份預計回廠日';
    } else if (rowData.masterType === '2') {
      type = '退火生產資訊';
    }

    console.log(`Api Service 新增「${type}」資料`);
    const queryUrl = `${this.APINEWURL}/FCP/C321/insertDetail03`;
    console.log(`Api Service 新增「${type}」資料 url -> ${queryUrl}`);
    console.log(
      `Api Service 新增「${type}」資料 參數 -> ${JSON.stringify(rowData)}`
    );
    return this.http.post(queryUrl, rowData, this.httpOptions);
  }

  insertDetail0303Multiple(rowData: any[]) {
    console.log(`Api Service 新增「排程生產原則說明」資料`);
    const queryUrl = `${this.APINEWURL}/FCP/C321/insertDetail0303Multiple`;
    console.log(`Api Service 新增「排程生產原則說明」資料 url -> ${queryUrl}`);
    console.log(
      `Api Service 新增「排程生產原則說明」資料 參數 -> ${JSON.stringify(
        rowData
      )}`
    );
    return this.http.post(queryUrl, rowData, this.httpOptions);
  }

  updateDetail0303Multiple(rowData: any[]) {
    console.log('Api Service 更新「排程生產原則說明」資料');
    const queryUrl = `${this.APINEWURL}/FCP/C321/updateDetail0303Multiple`;
    console.log(`Api Service 更新「排程生產原則說明」資料 url -> ${queryUrl}`);
    console.log(
      `Api Service 更新「排程生產原則說明」資料 參數 -> ${JSON.stringify(
        rowData
      )}`
    );
    return this.http.put(queryUrl, rowData, this.httpOptions);
  }

  getR322Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R322/getPPSR322Data`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR322VerList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R322/getVerList`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR322OtherInfo(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APINEWURL + `/FCP/R322/getOtherInfo`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  findLatestPPSR340DataList() {
    console.log('Api Service 獲取「訂單交期回覆」資料');
    const queryUrl = `${this.APINEWURL}/FCP/R340/findLatestPPSR340DataList`;
    console.log(`Api Service 獲取「訂單交期回覆」資料 url -> ${queryUrl}`);
    console.log(`Api Service 獲取「訂單交期回覆」資料 參數 -> 無參數`);
    return this.http.get(queryUrl);
  }

  findLatestPPSR341DataList() {
    console.log('Api Service 獲取「成品庫存現況」資料');
    const queryUrl = `${this.APINEWURL}/FCP/R341/findLatestPPSR341DataList`;
    console.log(`Api Service 獲取「成品庫存現況」資料 url -> ${queryUrl}`);
    console.log(`Api Service 獲取「成品庫存現況」資料 參數 -> 無參數`);
    return this.http.get(queryUrl);
  }

  postSelectTbpomm04(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm05/post/select-parameter`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  getBilletTypeList(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm05/post/billettype-list`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  getTBPOMM04() {
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm04/get/tbpomm04Data`;
    return this.http.get(queryUrl);
  }

  getProfiles() {
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm04/get/profiles`;
    return this.http.get(queryUrl);
  }

  postInsertParameter(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm05/post/insert-parameter`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  getTbpommm04Version() {
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm04/get/version`;
    return this.http.get(queryUrl);
  }

  postUpdateTbpomm04(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm04/post/update-tbpomm04`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  postDeleteTbpomm04(_parms) {
    const body = JSON.stringify(_parms);
    let queryUrl = `${this.APIYW}/iscm/ppsTbpomm04/post/delete-tbpomm04`;
    return this.http.post<any>(queryUrl, body, this.httpOptions);
  }

  getMergeResult() {
    let queryUrl = `${this.APIYW}/iscm/pomV0rOrder/merge/result`;
    return this.http.get(queryUrl);
  }
}
