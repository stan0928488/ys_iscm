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
}
