import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConfigService } from "../config/config.service";

import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class ACCService {
  APIURL: string = "";
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };


  constructor(private http: HttpClient, private configService: ConfigService) {
    this.APIURL = this.configService.getAPIURL('1');
  }


  //取得廠區 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get getplantACC100List 取得data
  getplantACC100List() {
    console.log("api service getplantList")
    let queryUrl = this.APIURL + `/requestTbaccm100/getPlantList`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //取得部門 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get getdeptACC100List 取得data
  getdeptACC100List(_plant) {
    console.log("api service getdeptACC100List")
    let queryUrl = this.APIURL + `/requestTbaccm100/getDeptName?plant=${_plant}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //取得職務代碼 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get getdeptACC100List 取得data
  getpnfACC100List(_plant,_deptName) {
    console.log("api service getpnfACC100List")
    let queryUrl = this.APIURL + `/requestTbaccm100/getPostNoFirst?plant=${_plant}&deptName=${_deptName}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //取得已有權限的網址清單 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getAllowRouteACC100List(expnf) {
    console.log("api service getAllowRouteACC100List")
    let queryUrl = this.APIURL + `/requestTbaccm100/getAllowRoute?pnf=${expnf}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //取得所有網址清單 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Get getrouteACC101List 取得data
  getrouteACC101List() {
    console.log("api service getrouteACC101List")
    let queryUrl = this.APIURL + `/requestTbaccm101/getRouteList`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //取得無權限的網址清單 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getNotAllowRouteACC101List(expnf) {
    console.log("api service getNotAllowRouteACC101List")
    let queryUrl = this.APIURL + `/requestTbaccm101/getNotAllowRouteList?pnf=${expnf}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //儲存有權限網址清單 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  saveselectedACC101List(_data) {
    const body = JSON.stringify(_data);
    console.log("api service saveselectedACC101List") 
    let queryUrl = this.APIURL + `/requestTbaccm100/saveRouteList`;
    console.log(queryUrl);
    return this.http.post(queryUrl, body, this.httpOptions);
  }
}