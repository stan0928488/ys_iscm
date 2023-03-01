import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "../config/config.service";

export interface TalkSessionItems{
  id? : number ,
  tsName:string;
  tsiSort:string;
  tsiCode:string;
  tsiName:string;
  tsiType:string;
  rmsCode:string;
  remark:string;
  previous:string;
  next:string;
  services:string;
  tsiError:string;
  useStatus:string,
  delStatus:string,
  createUser:string,
  createTime:string,
  updateUser:string,
  updateTime:string
}


@Injectable({
  providedIn: 'root'
})
export class Orp040Service {
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  APIURL: string = "";
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.APIURL = this.configService.getAPIURL();
  }

  getCustomerList(){
    let queryUrl = this.APIURL + "/ORP/ORP040/getAll";
    return this.http.get(queryUrl);
  }
  changetCustomerStatus(id){
    let queryUrl = this.APIURL + "/ORP/ORP040/changeStatus/"+id;
    return this.http.get(queryUrl);
  }

  saveRelation(_param) {
    let queryUrl = this.APIURL + "/ORP/ORP043/save";
    return this.http.post(queryUrl,_param);
  }

  getTalkSessionAll(){
    let queryUrl = this.APIURL + "/ORP/ORP041/getAll";
    return this.http.get(queryUrl);
  }
  delTalkSession(_ID){
    let queryUrl = this.APIURL + "/ORP/ORP041/getAll/";
    return this.http.get(queryUrl+_ID);
  }

  getTalkItemAll(){
    let queryUrl = this.APIURL + "/ORP/ORP042/getAll";
    return this.http.get(queryUrl);
  }
  getTalkItemByPara(_searchPara){
    const body = JSON.stringify(_searchPara);
    let queryUrl = this.APIURL + "/ORP/ORP042/getAllByPara";
    return this.http.post(queryUrl, _searchPara);
  }
  saveTalkSessionItem(_param){
    const body = JSON.stringify(_param);
    let queryUrl = this.APIURL + `/ORP/ORP042/save`;
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  delTalkSessionItem(_ID){
    let queryUrl = this.APIURL + "/ORP/ORP042/getAll/";
    return this.http.get(queryUrl+_ID);
  }

  getTalkLogsAll(){
    let queryUrl = this.APIURL + "/ORP/ORP044/getAll";
    return this.http.get(queryUrl);
  }
  getTalkLogsByCondition(_param){
    let queryUrl = this.APIURL + "/ORP/ORP044/getAllByCondition";
    return this.http.post(queryUrl,_param);
  }

  getAllCustomerByCondition(){
    let queryUrl = this.APIURL + "/ORP/ORP040/getAllCustomerByCondition";
    return this.http.get(queryUrl);
  }
  handlePostData(_param){
    const body = JSON.stringify(_param);
    let url = this.APIURL + `/ORP/ORP044/handlePostData`;
    return this.http.post(url, body,this.httpOptions);
  }
  testPostData(_param){
    const body = JSON.stringify(_param);
    let url = this.APIURL + `/requestDemo/body/post`;
    return this.http.post(url, _param,this.httpOptions);
  }
  changeLogUseStatus(_cstCode){
    let queryUrl = this.APIURL + "/ORP/ORP044/changeLogUseStatus/";
    return this.http.get(queryUrl+_cstCode);
  }


}
