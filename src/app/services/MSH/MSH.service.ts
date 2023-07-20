import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConfigService } from "../config/config.service";
import { CookieService } from "../config/cookie.service";
import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class MSHService {
  APIURL: string = "";
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json", 
    "accept-user": this.cookieService.getCookie("USERNAME") })
  };
  // APIURL:string = "http://apptst.walsin.com:8083/pps/rest/FCP";

  constructor(private http: HttpClient, private configService: ConfigService, private cookieService : CookieService) {
    this.APIURL = this.configService.getAPIURL("1");
  }
/***獲取站點 */
  getShopCodes(){
    let queryUrl = this.APIURL + "/msh/getShopCodes";
    return this.http.get(queryUrl,this.httpOptions);
  }
 /**
  * 獲取版本號
  * @returns 
  */
  getFcpVerList(){
    let queryUrl = this.APIURL + "/msh/getFcpVerList";
    return this.http.get(queryUrl,this.httpOptions);
  }

  //获取所有列表 FcpTb16所有列，用於管理員初步賽選
   getAllColum() {
     console.log("api service getPPSINP13List")
     let queryUrl = this.APIURL + "/msh/MSHI001/getAllColum";
     console.log(queryUrl);
     return this.http.get(queryUrl,this.httpOptions);
     }
//獲取管理員設定序列
  getSetColumByAdmin(){
    let queryUrl = this.APIURL + "/msh/MSHI001/getSetColumData";
    return this.http.get(queryUrl,this.httpOptions);
  }
//獲取User設定序列
getSetColumByUser(_param:any){
  let queryUrl = this.APIURL + "/msh/MSHI002/getSetColumData/"+_param;
  return this.http.get(queryUrl,this.httpOptions);
}

//管理員保存 msh/MSHI001/saveShopColum
saveDataByAdmin(_param) {
  let queryUrl = this.APIURL + "/msh/MSHI001/saveShopColum";
  return this.http.post(queryUrl,_param,this.httpOptions);
}

//User保存 msh/MSHI001/saveShopColum
saveDataByUser(_param) {
  let queryUrl = this.APIURL + "/msh/MSHI002/saveShopColum";
  return this.http.post(queryUrl,_param,this.httpOptions);
}

//获取ADMIN针对User的数据
getSetColumByAdminForUser(_param) {
  let queryUrl = this.APIURL + "/msh/MSHI002/getSetColumForUser/"+_param;
  return this.http.get(queryUrl,this.httpOptions);
}

//獲取已分群數據
getSetColumGroupData(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/getSetColumGroupData/"+_param;
  return this.http.get(queryUrl,this.httpOptions);
}
//獲取User配置並下載數據
getTableData(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/getTableData";
  return this.http.post(queryUrl,_param,this.httpOptions);
}

//獲取User配置並下載數據
getExportDataByShopCode(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/getExportDataByShopCode";
  return this.http.post(queryUrl,_param,this.httpOptions);
}

//管理員保存 msh/MSHI001/saveShopColum
saveSortData(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/saveSortData";
  return this.http.post(queryUrl,_param,this.httpOptions);
}

//查看當前是否存在未送出的版本
checkDataStatus(){
  let queryUrl = this.APIURL + "/msh/MSHI002/checkDataStatus";
  return this.http.get(queryUrl,this.httpOptions);
}
//鎖定版本
lockFcpVer(_param) {
  let queryUrl = this.APIURL + "/msh/MSHI002/lockFcpVer/"+_param;
  return this.http.get(queryUrl,this.httpOptions);
}

//查看當前版次狀態
findShopCodeSaveStatus(_param:any){
  let queryUrl = this.APIURL + "/msh/MSHP001/findShopCodeSaveStatus/"+_param;
  return this.http.get(queryUrl,this.httpOptions);
}
//获取可替换机台数据

//获取可替换作業代碼数据 msh/MSHP001/getEquipOpCode
getEquipOpCode(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/getEquipOpCode?ids=" + _param;
  return this.http.post(queryUrl,null,this.httpOptions);
}
//获取當前版本最新批次的配車數據
getFcpCarInfo(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/getFcpCarInfo?" +_param ;
  return this.http.post(queryUrl,null,this.httpOptions);
}
//获取當前版本最新批次的配車數據 msh/MSHP001/saveChangeOpCode
saveChangeOpCode(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/saveChangeOpCode";
  return this.http.post(queryUrl,_param,this.httpOptions);
}

  // 搜尋EPST資料
  searchEpstData(_parms){
    console.log('搜尋EPST資料..');
    const body = JSON.stringify(_parms);
    let endpointUrl = `${this.APIURL}/msh/MSHC003/searchEPST`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Body參數 : ${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  // 獲取站別清單
  getShopCodeList(){
    console.log('獲取站別清單..');
    let endpointUrl = `${this.APIURL}/msh/MSHC003/getShopCodeList`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Body參數 : 無`);
    return this.http.get<any>(endpointUrl);
  }

  // 檢查 idNo(MO) 是否存在於MySql(表:PPSFCPTB16)
  checkIdNoExists(idNo : string){
    const httpParams = new HttpParams()
      .set('idNo', idNo);
    let endpointUrl = `${this.APIURL}/msh/MSHC003/checkIdNoExists`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Params參數 : idNo=${idNo}`);
    return this.http.get<any>(endpointUrl, { params: httpParams });
  }

  // 根據idNo與站別獲取流程清單
  getLineupProcessListByIdNoAndShopCode(idNo : string, adjShopCode : string){
    console.log('根據idNo與站別獲取流程清單..');
    const httpParams = new HttpParams()
      .set('idNo', idNo)
      .set('adjShopCode', adjShopCode);
    let endpointUrl = `${this.APIURL}/msh/MSHC003/getLineupProcessListByIdNoAndShopCode`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Body參數 : 無`);
    return this.http.get<any>(endpointUrl, { params: httpParams });
  }

  // 獲取機台清單
  getEquipCodeList(shopCodeList){
    console.log('獲取機台清單..');
    let body = JSON.stringify({shopCodeList:shopCodeList});
    let endpointUrl = `${this.APIURL}/msh/MSHC003/getEquipCodeList`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Body參數 : ${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  // 批次新增EPST整個資料或批次更新調整日期(newEpst)、備註資料
  batchInsertOrUpdateEPST(MSHI003PendingDataList){
    console.log('批次新增EPST整個資料或批次更新調整日期(newEpst)、備註資料');
    let body = JSON.stringify(MSHI003PendingDataList);
    let endpointUrl = `${this.APIURL}/msh/MSHC003/batchInsertOrUpdateEPST`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Body參數 : ${body}`);
    return this.http.post<any>(endpointUrl, body, this.httpOptions);
  }

  // Excel EPST 資料匯入
  excelBatchInsertOrUpdateEPST(jsonExcelData){
    console.log('Excel EPST 資料匯入');
    let body = JSON.stringify(jsonExcelData);
    let endpointUrl = `${this.APIURL}/msh/MSHC003/excelBatchInsertOrUpdateEPST`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Body參數 : ${body}`);
    return this.http.post<any>(endpointUrl, jsonExcelData, this.httpOptions);
  }

  // 根據idNo、調整站別與調整流程搜尋過站狀態與EPST
  findByIdNoAdjShopCodeAdjLineupProcess(idNo : string, adjShopCode : string, adjLineupProcess : string){
  console.log('根據idNo、調整站別與調整流程搜尋過站狀態與EPST..');
  const httpParams = new HttpParams()
      .set('idNo', idNo)
      .set('adjShopCode', adjShopCode)
      .set('adjLineupProcess', adjLineupProcess);
  let endpointUrl = `${this.APIURL}/msh/MSHC003/findByIdNoAdjShopCodeAdjLineupProcess`;
  console.log(`API Url : ${endpointUrl}`);
  console.log(`Payload 參數 : ${JSON.stringify(httpParams)}`);
  return this.http.get<any>(endpointUrl, { params: httpParams });
}

  //僅顯示已變更EPST資料
  listChangedEPSTData(){
    let endpointUrl = `${this.APIURL}/msh/MSHC003/listChangedEPSTData`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`參數 : 無`);
    return this.http.get<any>(endpointUrl);
  }

  /****機台更換 */
  saveChangeMachine(_param) {
    let queryUrl = this.APIURL + "/msh/MSHP001/saveChangeMachine";
    return this.http.post(queryUrl,_param,this.httpOptions);
  }
  // 獲取當前機台數據已配置的數據
  getCurrentMachineData(_param) {
    let queryUrl = this.APIURL + "/msh/MSHP001/getCurrentMachineData";
    return this.http.post(queryUrl,_param,this.httpOptions);
  }
  /**同作業代碼換車 */
  saveSameOpCodeChangeCar(_param) {
    let queryUrl = this.APIURL + "/msh/MSHP001/saveSameOpCodeChangeCar";
    return this.http.post(queryUrl,_param,this.httpOptions);
  }
 
   /***发送批量 数据至mes */
   sendSortedDataToMESBatch(_param) {
    let queryUrl = this.APIURL + "/msh/MSHP001/sendMesBatchByShopCode";
    return this.http.post(queryUrl,_param,this.httpOptions);
  }

     /***发送批量 数据至AutoCompagin */
     sendDataToAutoCompagin(_param) {
      let queryUrl = this.APIURL + "/msh/MSHP001/sendAutoCampaignBatch";
      return this.http.post(queryUrl,_param,this.httpOptions);
    }

  //鎖定版本
  downloadAutoData(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/downloadAutoData/"+_param;
  return this.http.get(queryUrl,this.httpOptions);
  }


}
