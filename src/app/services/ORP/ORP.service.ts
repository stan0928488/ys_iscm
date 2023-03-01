import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "../config/config.service";

import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class ORPService {
  APIURL: string = "";
  
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.APIURL = this.configService.getAPIURL();
  }



  //訂單寬度原料對照表//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get getTBORPM031List 取得data
  getTBORPM031List() {
    console.log("api service getTBORPM031List")
    let queryUrl = this.APIURL + "/requestTborpm031/getAllFromXml";
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // delTBORPM031 刪除資料
  delTBORPM031(_ID) {
    let queryUrl = this.APIURL + `/requestTborpm031/deleteData?id=${_ID}`;
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // insertTBORPM031 單筆插入
  insertTBORPM031(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm031/saveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // updateTBORPM031 修改存檔
  updateTBORPM031(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm031/updateData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // delallTBORPM031 刪除全部
  delallITBORPM031() {
    let queryUrl = this.APIURL + `/requestTborpm031/deleteallData`;
    console.log(queryUrl);
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // batchsaveTBORPM031 批量寫入
  batchsaveTBORPM031(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm031/batchsaveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//訂單厚度原料對照表//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get getTBORPM032List 取得data
  getTBORPM032List() {
    console.log("api service getTBORPM032List")
    let queryUrl = this.APIURL + "/requestTborpm032/getAllFromXml";
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // delTBORPM032 刪除資料
  delTBORPM032(_ID) {
    let queryUrl = this.APIURL + `/requestTborpm032/deleteData?id=${_ID}`;
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // insertTBORPM032 單筆插入
  insertTBORPM032(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm032/saveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // updateTBORPM032 修改存檔
  updateTBORPM032(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm032/updateData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // delallTBORPM032 刪除全部
  delallITBORPM032() {
    let queryUrl = this.APIURL + `/requestTborpm032/deleteallData`;
    console.log(queryUrl);
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // batchsaveTBORPM032 批量寫入
  batchsaveTBORPM032(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm032/batchsaveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //客戶鋼種廠內鋼種對應表//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get getTBORPM029List 取得data
  getTBORPM029List() {
    console.log("api service getTBORPM029List")
    let queryUrl = this.APIURL + "/requestTborpm029/getAllFromXml";
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // delTBORPM029 刪除資料
  delTBORPM029(_ID) {
    let queryUrl = this.APIURL + `/requestTborpm029/deleteData?id=${_ID}`;
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // insertTBORPM029 單筆插入
  insertTBORPM029(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm029/saveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // updateTBORPM029 修改存檔
  updateTBORPM029(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm029/updateData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // delallTBORPM029 刪除全部
  delallITBORPM029() {
    let queryUrl = this.APIURL + `/requestTborpm029/deleteallData`;
    console.log(queryUrl);
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // batchsaveTBORPM029 批量寫入
  batchsaveTBORPM029(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm029/batchsaveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //訂單鋼種原料對照表//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get getTBORPM030List 取得data
  getTBORPM030List() {
    console.log("api service getTBORPM030List")
    let queryUrl = this.APIURL + "/requestTborpm030/getAllFromXml";
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // delTBORPM030 刪除資料
  delTBORPM030(_ID) {
    let queryUrl = this.APIURL + `/requestTborpm030/deleteData?id=${_ID}`;
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // insertTBORPM030 單筆插入
  insertTBORPM030(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm030/saveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // updateTBORPM030 修改存檔
  updateTBORPM030(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm030/updateData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // delallTBORPM030 刪除全部
  delallITBORPM030() {
    let queryUrl = this.APIURL + `/requestTborpm030/deleteallData`;
    console.log(queryUrl);
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // batchsaveTBORPM030 批量寫入
  batchsaveTBORPM030(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm030/batchsaveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//原料策略表//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get getTBORPM033List 取得data
  getTBORPM033List() {
    console.log("api service getTBORPM033List")
    let queryUrl = this.APIURL + "/requestTborpm033/getAllFromXml";
    console.log(queryUrl);
    return this.http.post(queryUrl,"");
  }
  // delTBORPM033 刪除資料
  delTBORPM033(_ID) {
    let queryUrl = this.APIURL + `/requestTborpm033/deleteData?id=${_ID}`;
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // insertTBORPM033 單筆插入
  insertTBORPM033(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm033/saveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // updateTBORPM033 修改存檔
  updateTBORPM033(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm033/updateData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
  // delallTBORPM033 刪除全部
  delallITBORPM033() {
    let queryUrl = this.APIURL + `/requestTborpm033/deleteallData`;
    console.log(queryUrl);
    return this.http.post(queryUrl, "", this.httpOptions);
  }
  // batchsaveTBORPM033 批量寫入
  batchsaveTBORPM033(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTborpm033/batchsaveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

  // 取得客戶清單
  getCustList() {
    console.log("api service getCustList")
    let queryUrl = this.APIURL + `/ORPV101/getCustList`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }
  // 送出查詢
  SendQuery(_data) {
    const body = JSON.stringify(_data);
    // let queryUrl = this.APIURL + `/ORPV101/getQuery`;
    let queryUrl = this.APIURL + `/OIPC100/orderMatching`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  //生計訂單配料程式//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 訂單查詢
  sendOrder(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/ORPC100/requestLocOrder`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // 取得策略清單(scrollbar使用)
  getStrategyList() {
    console.log("api service getStrategyList")
    let queryUrl = this.APIURL + `/ORPC102/getStrategyList`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  // 取得策略清單(項目)
  getStrategyTable(_data) {
    const body = JSON.stringify(_data);
    console.log("api service getStrategyTable")
    let queryUrl = this.APIURL + `/ORPC102/getStrategyTable`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // 取得歷史策略清單(特定表單)
  getSpecifyStrategyTable(_data) {
    const body = JSON.stringify(_data);
    console.log("api service getSpecifyStrategyTable")
    let queryUrl = this.APIURL + `/ORPC102/getSpecifyStrategyTable`;
    console.log(queryUrl);
    console.log("--3--");
    console.log(body);
    console.log("--3--");
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  // 取得執行配料後清單
  getGredientsTable(_data) {
    const body = JSON.stringify(_data);
    console.log("api service getGredientsTable")
    let queryUrl = this.APIURL + `/ORPC100/orderMachingLoc`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }


  // 取得配料量清單
  getGredientsWeightTable(_data) {
    const body = JSON.stringify(_data);
    console.log("api service requestMachingCoil")
    let queryUrl = this.APIURL + `/ORPC100/requestMachingCoil`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //每日出貨負荷表//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  sendEveryDayloadingReport(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/ORPP403/saveData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

    // delTBORPM031 刪除資料
    getEveryDayloadingReport(after,before) {
      let queryUrl = this.APIURL + `/ORPP403/search?after=${after}&before=${before}`;
      return this.http.get(queryUrl);
    }
}

