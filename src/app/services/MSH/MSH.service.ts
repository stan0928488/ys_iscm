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
/***獲取站點 */
  getShopCodes(){
    let queryUrl = this.APIURL + "/msh/getShopCodes";
    return this.http.get(queryUrl);
  }
 /**
  * 獲取版本號
  * @returns 
  */
  getFcpVerList(){
    let queryUrl = this.APIURL + "/msh/getFcpVerList";
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

//獲取已分群數據
getSetColumGroupData(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/getSetColumGroupData/"+_param;
  return this.http.get(queryUrl,_param);
}
//獲取User配置並下載數據
getTableData(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/getTableData";
  return this.http.post(queryUrl,_param);
}

//管理員保存 msh/MSHI001/saveShopColum
saveSortData(_param) {
  let queryUrl = this.APIURL + "/msh/MSHP001/saveSortData";
  return this.http.post(queryUrl,_param);
}

//查看當前是否存在未送出的版本
checkDataStatus(){
  let queryUrl = this.APIURL + "/msh/MSHI002/checkDataStatus";
  return this.http.get(queryUrl);
}
//鎖定版本
lockFcpVer(_param) {
  let queryUrl = this.APIURL + "/msh/MSHI002/lockFcpVer/"+_param;
  return this.http.get(queryUrl,_param);
}

//查看當前版次狀態
findShopCodeSaveStatus(_param:any){
  let queryUrl = this.APIURL + "/msh/MSHP001/findShopCodeSaveStatus/"+_param;
  return this.http.get(queryUrl);
}

}
