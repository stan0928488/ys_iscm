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

  getData() {
    let queryUrl = this.APIURL + `/mshi/tbppsm117/get/117/log/list`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // 批次新增EPST整個資料或批次更新調整日期(newEpst)、備註資料
  batchInsertOrUpdateLDM(MSHI004PendingDataList) {
    console.log('批次修改整個資料表');
    let body = JSON.stringify(MSHI004PendingDataList);
    let endpointUrl = `${this.APIURL}/mshi/tbppsm117/updateLDM`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Body參數 : ${body}`);
    console.log(body);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }
}
