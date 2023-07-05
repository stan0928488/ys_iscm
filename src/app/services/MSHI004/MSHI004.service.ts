import {
  AfterViewInit,
  Component,
  Renderer2,
  HostListener,
} from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { CookieService } from '../config/cookie.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MSHI004Service {
  isSpinning = false;
  APIURL: string = '';
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
    this.APIURL = this.configService.getAPIURL('1');
  }

  HandleError(e: any): void {
    // console.log(e);
    alert(e.error.error);
  }

  // 批次新增EPST整個資料或批次更新調整日期(newEpst)、備註資料
  batchInsertOrUpdateLDM(MSHI004PendingDataList) {
    console.log('批次修改整個資料表');
    let body = JSON.stringify(MSHI004PendingDataList);
    let endpointUrl = `${this.APIURL}/mshi/tbppsm117/updateLDM`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Body參數 : ${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  searchLdmData(_parms) {
    console.log('搜尋啟動發佈模式資料..');
    const body = JSON.stringify(_parms);
    let endpointUrl = `${this.APIURL}/mshi/tbppsm117/searchLdm`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Body參數 : ${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  // 獲取站別清單
  getFcpList() {
    console.log('獲取版本清單..');
    let endpointUrl = `${this.APIURL}/mshi/tbppsm117/getFcpVersionList`;
    console.log(`API Url : ${endpointUrl}`);
    return this.http.get<any>(endpointUrl);
  }

  runFcp() {
    console.log('檢查有無執行fcp..');
    let endpointUrl = `${this.APIURL}/mshi/tbppsm117/runFcp`;
    console.log(`API Url : ${endpointUrl}`);
    return this.http.get<any>(endpointUrl);
  }

  getMesData(_parms) {
    // const body = JSON.stringify(_parms);
    let endpointUrl = `${this.APIURL}/mshi/tbppsm117/forMesData`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`取得mes引數 : ${JSON.stringify(_parms)}`);
    return this.http.post<any>(endpointUrl, _parms, this.httpOptions);
  }

  getReRunFcp(USERNAME: string) {
    let endpointUrl = `${this.APIURL.substring(
      0,
      this.APIURL.lastIndexOf('/')
    )}/pps_FCP/rest/run/execute_FS`;
    console.log(`API Url : ${endpointUrl}`);
    return this.http.get<any>(
      // `http://10.106.9.66:8080/pps_FCP/rest/run/execute_FS?startPoint=ASAP&USERNAME=${USERNAME}`
      `${endpointUrl}?startPoint=ASAP&username=${USERNAME}`
    );
  }

  // sentMesData(_parms) {
  //   const body = JSON.stringify(_parms);
  //   // let endpointUrl = ``;
  //   let endpointUrl = `${this.APIURL}/msh/MSHP001/sendMesBatchByShopCode`;
  //   console.log(`API Url : ${endpointUrl}`);
  //   console.log(`送出mes參數 : ${body}`);
  //   return this.http.post<any>(endpointUrl, _parms, this.httpOptions);
  // }

  publishData(_parms) {
    const body = JSON.stringify(_parms);
    let endpointUrl = `${this.APIURL}/mshi/tbppsm117/publishData`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`發佈者；發佈日期 : ${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  // getEquipCode(_parms) {
  //   // let endpointUrl = ``;
  //   console.log(`API Url :`);
  //   let endpointUrl = `${this.APIURL}/MSHP001/downloadAutoData/${_parms}`;
  //   console.log(`API Url : ${endpointUrl}`);

  //   return this.http.post<any>(endpointUrl, _parms, this.httpOptions);
  // }

  /***发送批量 数据至mes */
  sendSortedDataToMESBatch(_param) {
    // let queryUrl = '';
    let queryUrl = this.APIURL + '/msh/MSHP001/sendMesBatchByShopCode';
    return this.http.post(queryUrl, _param, this.httpOptions);
  }

  //鎖定版本
  downloadAutoData(_param) {
    // let queryUrl = '';
    let queryUrl = this.APIURL + '/msh/MSHP001/downloadAutoData/' + _param;
    return this.http.get(queryUrl, this.httpOptions);
  }
  machineData(_parms) {
    let endpointUrl = `${this.APIURL}/mshi/tbppsm117/machineData`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`機台資料 : ${JSON.stringify(_parms)}`);
    return this.http.post<any>(endpointUrl, _parms, this.httpOptions);
  }
}
