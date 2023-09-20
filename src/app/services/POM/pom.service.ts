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
}
