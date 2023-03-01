import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "../config/config.service";

import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class TRAService {
  APIURL: string = "";
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  // APIURL:string = "http://apptst.walsin.com:8083/pps/rest/FCP";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.APIURL = this.configService.getAPIURL();
  }

  getTBTRAM001List() {
    console.log("api service getTBTRAM001List")
    let queryUrl = this.APIURL + "/requestTbtram001/getAllFromXml";
    console.log(queryUrl);
    return this.http.post(queryUrl, "");
  }
  updateTBTRAM001(_data) {
    const body = JSON.stringify(_data);
    let queryUrl = this.APIURL + `/requestTbtram001/updateData`;
    console.log(queryUrl);
    console.log(body);
    return this.http.post(queryUrl, body, this.httpOptions);
  }

}
