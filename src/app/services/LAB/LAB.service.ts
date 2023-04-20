import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
}
