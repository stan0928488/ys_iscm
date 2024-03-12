import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "../config/config.service";

import * as _ from "lodash";
import { CookieService } from "../config/cookie.service";

@Injectable({
  providedIn: "root"
})
export class ORPService {
  CONTEXT_PATH = '';
  
  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json', 
      'accept-user': this.cookieService.getCookie('USERNAME'),
      'plant-code': this.cookieService.getCookie('plantCode'),
      }
    )
  };

  constructor(private http: HttpClient, 
              private configService: ConfigService,
              private cookieService: CookieService) {
    this.CONTEXT_PATH = this.configService.CONTEXT_PATH;
  }

  
  insertI001Data(payload : any) {
    let queryUrl = `${this.CONTEXT_PATH}/ORP/I001/insertData`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  finaAllI001Data() {
    let queryUrl = `${this.CONTEXT_PATH}/ORP/I001/findAll`;
    return this.http.get(queryUrl);
  }

  updateI001Data(payload : any) {
    let queryUrl = `${this.CONTEXT_PATH}/ORP/I001/updateData`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  deleteI001Data(id : string) {
    let queryUrl = `${this.CONTEXT_PATH}/ORP/I001/deleteData/${id}`;
    return this.http.get(queryUrl, this.httpOptions);
  }

  batchImportDataList(payload : any) {
    let queryUrl = `${this.CONTEXT_PATH}/ORP/I001/batchImportDataList`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  
  readWordFile(_data:object){//讀取word檔案
    let queryUrl = this.CONTEXT_PATH + `/ORP/I999/readWord`;
    return this.http.post(queryUrl, _data,{
      responseType:"text",
      reportProgress: false,
      observe: 'response'
    });  
  }

  readPdfFile(_data:object){//讀取pdf檔案
    let queryUrl = this.CONTEXT_PATH + `/ORP/I999/readPdf`;
    return this.http.post(queryUrl, _data,{
      responseType:"text",
      reportProgress: false,
      observe: 'response'
    });  
  }

  
  queryContractNoByCustNo(payload : any){
    let queryUrl = `${this.CONTEXT_PATH}/ORPExe/P001/queryContractNoByCustNo`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  queryMinMaxWeightByCustNo(payload : any){
    let queryUrl = `${this.CONTEXT_PATH}/ORPExe/P001/queryMinMaxWeightByCustNo`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  queryContractTotalWeightLeft(payload : any){
    let queryUrl = `${this.CONTEXT_PATH}/ORPExe/P001/queryContractTotalWeightLeft`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  queryMtrlAndUnitPrice(payload : any){
    let queryUrl = `${this.CONTEXT_PATH}/ORPExe/P001/queryMtrlAndUnitPrice`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  readWordFileByOrder(_data:object){//讀取word檔案
    let queryUrl = this.CONTEXT_PATH + `/ORP/I999/readWordOrder`;
    return this.http.post(queryUrl, _data,{
      responseType:"text",
      reportProgress: false,
      observe: 'response'
    });  
  }

  readPdfFileByOrder(_data:object){//讀取pdf檔案
    let queryUrl = this.CONTEXT_PATH + `/ORP/I999/readPdfOrder`;
    return this.http.post(queryUrl, _data,{
      responseType:"text",
      reportProgress: false,
      observe: 'response'
    });  
  }

  insertP001Data(payload : any) {
    let queryUrl = `${this.CONTEXT_PATH}/ORPExe/P001/insertData`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  querySales(payload : any){
    let queryUrl = `${this.CONTEXT_PATH}/ORPExe/P001/querySales`;
    return this.http.post(queryUrl,payload,this.httpOptions);
  }

  querySSM407MST01(payload : any) {
    let queryUrl = `${this.CONTEXT_PATH}/ORPExe/P001/querySSM407MST01`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  queryPackCodeCertificateCodeByCustNo(payload : any) {
    let queryUrl = `${this.CONTEXT_PATH}/ORPExe/P001/queryPackCodeCertificateCodeByCustNo`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  
}

