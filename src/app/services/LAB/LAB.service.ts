import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConfigService } from "../config/config.service";

import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class LABService {
  APIURL: string = "";
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.APIURL = this.configService.getAPIURL("1");
  }
  

  saveLab001Data(_data){

    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + "/LAB001/saveData";
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  batchsaveLab001Data(_data){

    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + "/LAB001/batchSaveData";
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  getLab001Data(){
    let queryUrl = this.APIURL + "/LAB001/getAll";

    return this.http.get(queryUrl);
  }

  updateLab001Data(_data){

    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + "/LAB001/updateData";
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  deleteLab001Data(_data){

    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + "/LAB001/deleteData";
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }


  getMoEditionList(plantCode:String){

    let queryUrl = this.APIURL + `/LABP100/getMoEditionList?plantCode=${plantCode}`;
  
      return this.http.get(queryUrl);
  }

  
  getAbbrList(plantCode:String,moEdition:String){

    let queryUrl = this.APIURL + `/LABP100/getAbbrList?plantCode=${plantCode}&&moEdition=${moEdition}`;
  
      return this.http.get(queryUrl);
  }

  getMoInformation(plantCode:String ,moEdition:String,abbr:String, sampleId:String,  idNo:String, order:String,  startDate:String, endDate:String
    ,  expStartDate:String,  expEndDate:String){

    let queryUrl = this.APIURL + `/LABP100/getMoInformation?plantCode=${plantCode}&&moEdition=${moEdition}&&abbr=${abbr}&&sampleId=${sampleId}&&idNo=${idNo}`
                  + `&&order=${order}&&startDate=${startDate}&&endDate=${endDate}&&expStartDate=${expStartDate}&&expEndDate=${expEndDate}`;
  
      return this.http.get(queryUrl);
  }

  getMoDetailList(plantCode:String,moEdition:String,abbr:String,sampleId:String,startDate:String,endDate:String){

    let queryUrl = this.APIURL + `/LABP100/getMoDetailList?plantCode=${plantCode}&&moEdition=${moEdition}&&abbr=${abbr}&&sampleId=${sampleId}&&startDate=${startDate}&&endDate=${endDate}`;
  
      return this.http.get(queryUrl);
  }

  getLabInformation(plantCode:String,moEdition:String){

    let queryUrl = this.APIURL + `/LABP100/getLabInformation?plantCode=${plantCode}&&moEdition=${moEdition}`;
      console.log(queryUrl)
      return this.http.get(queryUrl);
  }

  getTblabl001AllData(plantCode:String,moEdition:String){

    let queryUrl = this.APIURL + `/LABP100/getTblabl001AllData?plantCode=${plantCode}&&moEdition=${moEdition}`;
  
      return this.http.get(queryUrl);
  }

  getSaleOrder(plantCode:String,moEdition:String){

    let queryUrl = this.APIURL + `/LABP100/getSaleOrder?plantCode=${plantCode}&&moEdition=${moEdition}`;
  
      return this.http.get(queryUrl);
  }

  reloadLabStatus(plantCode:String,moEdition:String,userName:String){

    let queryUrl = this.APIURL + `/lab/samplingRun?plantCode=${plantCode}&&moEdition=${moEdition}&&userName=${userName}`;
  
      return this.http.get(queryUrl);
  }

  // 新增實驗室取樣時間設定
  saveTblabm002(payload){
    console.log('新增實驗室取樣時間設定');
    const payloadJson = JSON.stringify(payload);
    let endpointUrl = `${this.APIURL}/LAB001/saveTblabm002`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Payload 參數 : ${payloadJson}`);
    return this.http.post<any>(endpointUrl, payload, this.httpOptions);
  }

   // 查找實驗室取樣時間設定
   findAllTblabm002(){
    console.log('查找實驗室取樣時間設定');
    let endpointUrl = `${this.APIURL}/LAB001/findAllTblabm002`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Payload 參數 : 無`);
    return this.http.get<any>(endpointUrl);
   }

   // 更新實驗室取樣時間設定
   updateTblabm002(payload){
    console.log('更新實驗室取樣時間設定');
    const payloadJson = JSON.stringify(payload);
    let endpointUrl = `${this.APIURL}/LAB001/updateTblabm002`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Payload 參數 : ${payloadJson}`);
    return this.http.put<any>(endpointUrl, payload, this.httpOptions);
  }

  // 刪除實驗室取樣時間設定
  deleteTblabm002(id:number, plantCode:string){
    console.log('更新實驗室取樣時間設定');
    const httpParams = new HttpParams()
      .set('id', id)
      .set('plantCode', plantCode);
    let endpointUrl = `${this.APIURL}/LAB001/deleteTblabm002`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Payload 參數 : ${JSON.stringify(httpParams)}`);
    return this.http.delete<any>(endpointUrl, { params: httpParams });
  }

   // 新增實驗室取樣時間設定(only time)
   saveTblabm002Time(payload){
    console.log('新增實驗室取樣時間設定(24小時制)設定');
    const payloadJson = JSON.stringify(payload);
    let endpointUrl = `${this.APIURL}/LAB001/saveTblabm002Time`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Payload 參數 : ${payloadJson}`);
    return this.http.post<any>(endpointUrl, payload, this.httpOptions);
  }

  // 查找實驗室取樣時間設定(only time)
  findAllTblabm002Time(){
    console.log('查找實驗室取樣時間設定(only time)');
    let endpointUrl = `${this.APIURL}/LAB001/findAllTblabm002Time`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Payload 參數 : 無`);
    return this.http.get<any>(endpointUrl);
   }

   // 更新實驗室取樣時間設定(only time)
   updateTblabm002Time(payload){
    console.log('更新實驗室取樣時間設定(only time)');
    const payloadJson = JSON.stringify(payload);
    let endpointUrl = `${this.APIURL}/LAB001/updateTblabm002Time`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Payload 參數 : ${payloadJson}`);
    return this.http.put<any>(endpointUrl, payload, this.httpOptions);
  }

   // 刪除實驗室取樣時間設定(only time)
   deleteTblabm002Time(id:number, plantCode:string){
    console.log('更新實驗室取樣時間設定');
    const httpParams = new HttpParams()
      .set('id', id)
      .set('plantCode', plantCode);
    let endpointUrl = `${this.APIURL}/LAB001/deleteTblabm002Time`;
    console.log(`API Url : ${endpointUrl}`);
    console.log(`Payload 參數 : ${JSON.stringify(httpParams)}`);
    return this.http.delete<any>(endpointUrl, { params: httpParams });
  }
}
