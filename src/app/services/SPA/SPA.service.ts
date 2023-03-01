import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "../config/config.service";

import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class SPAService {
  APIURL: string = "";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.APIURL = this.configService.getAPIURL();
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 業務每月預估量表//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 取得預估表全部資料
  getSPA100AllList() {
    console.log("api service getSPA100AllList")
    let queryUrl = this.APIURL + "/requestTbspam100/getAllFromXml";
    console.log(queryUrl);
    return this.http.post(queryUrl,"");
  }

  // delTBSPAM100 刪除資料
  delTBSPAM100(_ID) {
    let queryUrl = this.APIURL + `/requestTbspam100/deleteData?id=${_ID}`;
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  
  // insertTBSPAM100 單筆插入
  insertTBSPAM100(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTbspam100/saveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // updateTBSPAM100 修改存檔
  updateTBSPAM100(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTbspam100/updateData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // delallTBSPAM100 刪除全部
  delallTBSPAM100() {
    let queryUrl = this.APIURL + `/requestTbspam100/deleteallData`;
    console.log(queryUrl);
    return this.http.post(queryUrl, "", this.httpOptions);
  }

  // batchsaveTBSPAM100 批量寫入
  batchsaveTBSPAM100(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTbspam100/batchsaveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }




  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 業務維護總和趨勢圖//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 取得客戶名稱
  getSPA101CustList() {
    console.log("api service getSPA101CustList")
    let queryUrl = this.APIURL + "/requestTbspam101/getcustXml";
    console.log(queryUrl);
    return this.http.post(queryUrl,"");
  }

  // 取得全部資料
  getSPA101AllList(_CUST,_TYPEIE,_GRADENO,_WIDTHTYPE,_STARTDATE,_ENDDATE) {
    console.log("api service getSPA101AllList")
    let queryUrl = this.APIURL + `/requestTbspam101/getAllFromXml?cust_abbreviations=${_CUST}&type_ie=${_TYPEIE}&grade_no=${_GRADENO}&width_type=${_WIDTHTYPE}&start_date=${_STARTDATE}&end_date=${_ENDDATE}`;
    console.log(queryUrl);
    return this.http.post(queryUrl, "", this.httpOptions);
  }


}