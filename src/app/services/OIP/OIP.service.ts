import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import * as _ from "lodash";
import { ConfigService } from "../config/config.service";

@Injectable({
  providedIn: "root"
})
export class OIPService {
  APIURL: string = "";
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  // APIURL:string = "http://apptst.walsin.com:8083/pps/rest/FCP";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.APIURL = this.configService.getAPIURL();
  }


  //訂單寬度原料對照表//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get getTBOIPM029List 取得data
  getTBOIPM029List() {
    console.log("api service getTBOIPM029List")
    let queryUrl = this.APIURL + "/requestTboipm029/getAllFromXml";
    console.log(queryUrl);
    return this.http.post(queryUrl, "");
  }
  // delTBOIPM029 刪除資料
  delTBOIPM029(_ID) {
    let queryUrl = this.APIURL + `/requestTboipm029/deleteData?id=${_ID}`;
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // insertTBOIPM029 單筆插入
  insertTBOIPM029(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTboipm029/saveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // updateTBOIPM029 修改存檔
  updateTBOIPM029(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTboipm029/updateData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // delallTBOIPM029 刪除全部
  delallTBOIPM029() {
    let queryUrl = this.APIURL + `/requestTboipm029/deleteallData`;
    console.log(queryUrl);
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // batchsaveTBOIPM029 批量寫入
  batchsaveTBOIPM029(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTboipm029/batchsaveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  



}
