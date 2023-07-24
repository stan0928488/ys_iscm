import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class PPSService {
  APIURL: string = '';
  APINEWURL: string = '';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  // APIURL:string = "http://apptst.walsin.com:8083/pps/rest/FCP";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.APIURL = this.configService.getAPIURL();
    this.APINEWURL = this.configService.getAPIURL('1');
  }

  getPPS;

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
      this.APIURL + `/FCP/I108` + nonbarUrl + `/insertI108Tab1Save`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I108 updateI108Save
  updateI108Save(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl =
      this.APIURL + `/FCP/I108` + nonbarUrl + `/updateI108Tab1Save`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I108 delI108Data 刪除資料
  delI108Data(_type, _ID) {
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl =
      this.APIURL + `/FCP/I108` + nonbarUrl + `/delI108Tab1Data/${_ID}`;
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
    let queryUrl = this.APIURL + '/FCP/I200/getPPSFCPTB16List';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //Get getPPSFCPTB16RSSetList 取得FCP結果保留設定資料
  getPPSFCPTB16RSSetList() {
    console.log('api service getPPSFCPTB16RSSetList');
    let queryUrl = this.APIURL + '/FCP/I200/getPPSFCPTB16RSSetList';
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
    let queryUrl = this.APIURL + `/FCP/I200/insertTab4Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I200 Tab5新增存檔
  insertTab5Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I200/insertTab5Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I200 Tab4修改存檔
  updateTab4Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I200/updateTab4Save`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // I200 Tab5修改存檔
  updateTab5Save(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I200/updateTab5Save`;
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
  getOrignListData() {
    console.log('api service getOrignListData');
    let queryUrl = this.APIURL + '/FCP/I201/getOrignListData';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  getPickerShopEQUIPNEW(_type, _ShopArr) {
    console.log('api service getPickerShopEQUIP');
    let queryUrl =
      this.APIURL + `/FCP/I201/getPickerShopEQUIPNEW/${_type}/${_ShopArr}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  getSetShopEQUIP(_data) {
    console.log('api service getSetShopEQUIP');
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/I201/getSetShopEQUIP';
    console.log(queryUrl);
    console.log(body);

    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //保存排序數據
  saveSortData(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/I201/saveSortData';
    console.log(queryUrl);
    console.log(body);

    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //修改排序數據
  editSortData(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/I201/editSortData';
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //刪除排序數據
  deleteSortData(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/I201/deleteSortData';
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

  // exportTbppsm102ListExcel 匯出 Excel
  exportTbppsm102ListExcel(_plantCode) {
    let queryUrl = this.APIURL + `/FCP/I205/exportTbppsm102ListExcel/${_plantCode}`;
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

  convertToTbppsm100(_fcpEditionList) {
    const body = JSON.stringify(_fcpEditionList);
    console.log(body);
    let queryUrl =
      this.APIURL + `/FCP/I205/convertToTbppsm100/${_fcpEditionList}`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getFcpList(_plantCode) {
    let queryUrl = this.APIURL + `/FCP/I205/getFcpEditionList/${_plantCode}`;
    console.log(`API Url : ${queryUrl}`);
    return this.http.get<any>(queryUrl);
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
  getRunFCPCount() {
    let queryUrl = this.APIURL + '/FCP/I210/getRunFCPCount';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //Get getPlanSetData 規劃策略清單 (I210-I220 共用)
  getPlanSetData() {
    console.log('api service getPlanSetData');
    let queryUrl = this.APIURL + `/FCP/I210/getPlanSetData`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //Get getShopSortingList (I210-I220-I230 共用)
  getShopSortingList(_type, _value) {
    // _type: I-210新增；Q-其他所有查詢
    console.log('api service getShopSortingList');
    let queryUrl =
      this.APIURL + `/FCP/I210/getShopSortingList/${_type}/${_value}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //Get getShopMachineSortingList (I210-I220-I230 共用)
  getShopMachineSortingList(_type, _value) {
    // _type: I-210新增；Q-其他所有查詢
    console.log('api service getShopMachineSortingList');
    let queryUrl =
      this.APIURL + `/FCP/I210/getShopMachineSortingList/${_type}/${_value}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // 刪除某筆規劃策略
  deletePlanSetData(planSetEdition:string) {
    const httpParams = new HttpParams()
    .set('planSetEdition', planSetEdition);

    console.log('api service deletePlanSetData');
    let queryUrl = this.APIURL + `/FCP/I210/deletePlanSetData`;
    console.log(`刪除策略API --> ${queryUrl}`);
    console.log(`刪除策略API參數 --> ${planSetEdition}`);
    return this.http.delete(queryUrl, { params: httpParams });
  }

  //Get getPlanSetInitstData 取得規劃策略基礎表
  getPlanSetInitstData() {
    let queryUrl = this.APIURL + '/FCP/I210/getPlanSetInitstData';
    return this.http.get(queryUrl);
  }
  //Get getPickerShopData sorting表的站別
  getPickerShopData() {
    let queryUrl = this.APIURL + '/FCP/I210/getPickerShopData';
    return this.http.get(queryUrl);
  }
  //Get getPickerMachineData 下拉機台 by 站別
  getPickerMachineData(_shop) {
    let queryUrl = this.APIURL + `/FCP/I210/getPickerMachineData/${_shop}`;
    return this.http.get(queryUrl);
  }
  //Get getPickerSortData sorting表的排序 by 站別
  getPickerSortData(_shop, _machine) {
    let queryUrl =
      this.APIURL + `/FCP/I210/getPickerSortData/${_shop}/${_machine}`;
    return this.http.get(queryUrl);
  }
  //Get getRequierList sorting內的 集批條件
  getRequierList(_sort) {
    let queryUrl = this.APIURL + `/FCP/I210/getRequierList/${_sort}`;
    return this.http.get(queryUrl);
  }
  //Get getRequierNAME 集批條件中文顯示
  getRequierNAME(_value) {
    let queryUrl = this.APIURL + `/FCP/I210/getRequierNAME/${_value}`;
    return this.http.get(queryUrl);
  }
  //addPlanSetData 上傳規劃策略insert
  addPlanSetData(_result) {
    console.log('api service addPlanSetData');
    const body = JSON.stringify(_result);
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I210/addPlanSetData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //updPlanSetData 修改規劃策略update
  updPlanSetData(_result) {
    console.log('api service updPlanSetData');
    const body = JSON.stringify(_result);
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I210/updPlanSetData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //Get getCreatePlanDataList 取得規劃清單(僅建立)
  getCreatePlanDataList() {
    console.log('api service getCreatePlanDataList');
    let queryUrl = this.APIURL + `/FCP/I220/getCreatePlanDataList`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //Get getPlanDataList 取得規劃清單(含執行-最大一筆)
  getPlanDataList() {
    console.log('api service getPlanDataList');
    let queryUrl = this.APIURL + `/FCP/I220/getPlanDataList`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //Get getPlanDataListByPlan 取得規劃清單(取得該版次已執行過內容)
  getPlanDataListByPlan(_Plan) {
    console.log('api service getPlanDataListByPlan');
    let queryUrl = this.APIURL + `/FCP/I220/getPlanDataListByPlan/${_Plan}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //addPlanData 建立規劃清單insert
  addPlanData(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I220/addPlanData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //updPlanData 修改規劃清單upd
  updPlanData(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I220/updPlanData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //delPlanData 刪除規劃清單_cancel_flag = '1'
  delPlanData(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I220/delPlanData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //stopPlanData
  stopPlanData(_result) {
    const body = JSON.stringify(_result);
    let queryUrl = this.APIURL + '/FCP/I220/stopPlanData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //PublishToMES Publish 規劃案結果到 mes (FCP結果塞到MES)
  PublishToMES(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I220/PublishToMES';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //updatePlanData 更新規劃案
  updatePlanData(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I220/updatePlanData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //updSCHEDULEPlanEdition 更改公版規劃案版本
  updSCHEDULEPlanEdition(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl = this.APIURL + '/FCP/I220/updSCHEDULEPlanEdition';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //getTitleName 取得excel匯出表頭
  getTitleName() {
    console.log('api service getTitleName');
    let queryUrl = this.APIURL + `/FCP/I220/getTitleName`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // getFCPResRepo 取得表內容
  getFCPResRepo(_data) {
    console.log('api service getFCPResRepo');
    let queryUrl = this.APIURL + `/FCP/I220/getFCPResRepo/${_data}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //StartFullRunPlan 啟動規劃案--->Full Run
  StartFullRunPlan(_plan, _flag, _type) {
    // _type: A手動啟動、B排程啟動
    console.log('api service StartFullRunPlan');
    let queryUrl =
      this.APIURL + `/FCP/Run/StartFullRunPlan/${_plan}/${_flag}/${_type}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //getFCP_EDITIONexist 檢誤是否有FCP版次
  getFCP_EDITIONexist(_FCP) {
    console.log('api service getFCP_EDITIONexist');
    let queryUrl = this.APIURL + `/FCP/Run/getFCP_EDITIONexist/${_FCP}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //Get getNewPlanData 啟動規劃案歷程
  getLogPlanData(_startrun, _plan) {
    console.log('api service getLogPlanData');
    let queryUrl =
      this.APIURL + `/FCP/I230/getLogPlanData/${_startrun}/${_plan}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  //Get getStartLogData 規劃案執行log
  getStartLogData(_startrun, _planver) {
    console.log('api service getStartLogData');
    let queryUrl =
      this.APIURL + `/FCP/I230/getStartLogData/${_startrun}/${_planver}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //getICPMOVerList (共用)
  getICPMOVerList() {
    let queryUrl = this.APIURL + '/FCP/I220/ICPMOVerList';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //getICPVerList (共用)
  getICPVerList() {
    let queryUrl = this.APIURL + '/FCP/I220/ICPVerList';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //getPlansetVerList 規劃策略版本-排除目前資料 (共用)
  getPlansetVerList(_edition) {
    let queryUrl = this.APIURL + `/FCP/I220/getPlansetVerList/${_edition}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //getPlanVerList 規劃案執行版本 (共用)
  getPlanVerList(_flag) {
    let queryUrl = this.APIURL + `/FCP/I220/getPlanVerList/${_flag}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
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

  // http://ys-webapt1.walsin.com:8080/pps_FCP/rest/toMES/?FCP_Version=F20220714104112
  // PublishDataToMES
  PublishDataToMES(_result, _code) {
    let hostName = window.location.hostname;
    const body = JSON.stringify('');
    console.log('PublishDataToMES');
    let queryUrl = `http://${hostName}:8080/pps_FCP/rest/toMES/?FCP_Version=${_result}&${_code}`;
    // let queryUrl = `http:///ys-pps.walsin.corp:8080/pps_FCP/rest/toMES/?FCP_Version=${_result}&${_code}`;
    return this.http.post(queryUrl, body, {});
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
  getCurrentMonVerList() {
    let queryUrl = this.APIURL + '/FCP/R302/VerList';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // 取得區域別，報表使用
  getAreaGroup() {
    let queryUrl = this.APIURL + '/FCP/R302/getAreaGroup';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //获取当月设定
  getWeekData() {
    let queryUrl = this.APIURL + '/FCP/R302/getWeekData';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //获取交期总表数据
  getR302DataList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/R302/queryDataList';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //获取交期总表第一層数据
  getR302FirstModalDataList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/R302/getFirstModalData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //獲取延遲訂單信息
  getR302DelayDataList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/R302/getDelayDataList';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  //獲取訂單詳情 第二層modal
  getR302OrderDataList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/R302/getSecondModalData';
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // 取得mes以入庫量明細
  getR302MesDtlList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/R302/getR302MesDtlList';
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
    let endpointUrl = this.APIURL + `/FCP/R304/getPPSR304List`;
    return this.http.get<any>(endpointUrl);
  }

  batchSaveR304Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/R304/insertPPSR304BatchSave`;
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 :${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  getR305DataList(plantCode) {
    let endpointUrl = this.APIURL + `/FCP/R305/getPPSR305List/${plantCode}`;
    return this.http.get<any>(endpointUrl);
  }

  batchSaveR305Data(_data) {
    const body = JSON.stringify(_data);
    let endpointUrl = this.APIURL + `/FCP/R305/insertPPSR305BatchSave`;
    console.log(`請求API Endpoint Url : ${endpointUrl}`);
    console.log(`請求API 參數 :${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  getR306Editionist() {
    let endpointUrl = this.APIURL + `/FCP/R306/getPPSR306Edition`;
    return this.http.get<any>(endpointUrl);
  }

  getR306DataList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/R306/getPPSR306List';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR307Editionist() {
    let endpointUrl = this.APIURL + `/FCP/R307/getPPSR307Edition`;
    return this.http.get<any>(endpointUrl);
  }

  getR307DataList(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + '/FCP/R307/getPPSR307List';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  convertR308Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/R308/converData`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR308Data(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/R308/getPPSR308Data`;
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
    let queryUrl = this.APIURL + `/FCP/R308/getPPSR309List`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getR308VerListData(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/R308/getVerList`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  importppsfcptb13TablExcel(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/FCP/I201/importppsfcptb13TablExcel`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getTBPPSM107() {
    let queryUrl = this.APIURL + `/FCP/I112/getTBPPSM107`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  insertTBPPSM107(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl = this.APIURL + `/FCP/I112` + nonbarUrl + `/insertTBPPSM107`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  importTBPPSM107Excel(_type, _data) {
    const body = JSON.stringify(_data);
    let nonbarUrl = '';
    if (_type === '2') nonbarUrl = `/NonBar`;
    let queryUrl =
      this.APIURL + `/FCP/I112` + nonbarUrl + `/importExcelPPSI112`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
}
