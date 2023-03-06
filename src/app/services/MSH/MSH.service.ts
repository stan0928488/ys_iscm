import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "../config/config.service";

import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class MSHService {
  APIURL: string = "";
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  // APIURL:string = "http://apptst.walsin.com:8083/pps/rest/FCP";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.APIURL = this.configService.getAPIURL("1");
  }

  getShopCodes(){
    let queryUrl = this.APIURL + "/msh/getShopCodes";
    return this.http.get(queryUrl);
  }

  //获取所有列表 FcpTb16所有列，用於管理員初步賽選
   getAllColum() {
     console.log("api service getPPSINP13List")
     let queryUrl = this.APIURL + "/msh/MSHI001/getAllColum";
     console.log(queryUrl);
     return this.http.get(queryUrl);
     }
//獲取管理員設定序列
  getSetColumByAdmin(){
    let queryUrl = this.APIURL + "/msh/MSHI001/getSetColumData";
    return this.http.get(queryUrl);
  }
//獲取User設定序列
getSetColumByUser(_param:any){
  let queryUrl = this.APIURL + "/msh/MSHI002/getSetColumData/"+_param;
  return this.http.get(queryUrl);
}

//管理員保存 msh/MSHI001/saveShopColum
saveDataByAdmin(_param) {
  let queryUrl = this.APIURL + "/msh/MSHI001/saveShopColum";
  return this.http.post(queryUrl,_param);
}

//User保存 msh/MSHI001/saveShopColum
saveDataByUser(_param) {
  let queryUrl = this.APIURL + "/msh/MSHI002/saveShopColum";
  return this.http.post(queryUrl,_param);
}

//获取ADMIN针对User的数据
getSetColumByAdminForUser(_param) {
  let queryUrl = this.APIURL + "/msh/MSHI002/getSetColumForUser/"+_param;
  return this.http.get(queryUrl,_param);
}

}
