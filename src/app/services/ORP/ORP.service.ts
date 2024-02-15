import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "../config/config.service";

import * as _ from "lodash";
import { CookieService } from "../config/cookie.service";

@Injectable({
  providedIn: "root"
})
export class ORPService {
  APINEWURL: string = "";
  
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
    this.APINEWURL = this.configService.getAPIURL("1");
  }

  
  insertI001Data(payload : any) {
    let queryUrl = `${this.APINEWURL}/ORP/I001/insertData`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  finaAllI001Data() {
    let queryUrl = `${this.APINEWURL}/ORP/I001/findAll`;
    return this.http.get(queryUrl);
  }

  updateI001Data(payload : any) {
    let queryUrl = `${this.APINEWURL}/ORP/I001/updateData`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  deleteI001Data(id : string) {
    let queryUrl = `${this.APINEWURL}/ORP/I001/deleteData/${id}`;
    return this.http.get(queryUrl);
  }

  batchImportDataList(payload : any) {
    let queryUrl = `${this.APINEWURL}/ORP/I001/batchImportDataList`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }
  
}

