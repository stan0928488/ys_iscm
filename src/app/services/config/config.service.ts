import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import * as _ from "lodash";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class ConfigService {
  APIURL: string = "";

  constructor(private http: HttpClient) {
    //this.setAPIURL();
  }

  setAPIURL(flag?:string) {
    // let APIBODY = "/YSiSCM";    // 未來移植完成的新專案包
    
    let APIBODY = "";       // 先連到舊的後台
    let APIBODY_OLD = "/pps/rest";       // 先連到舊的後台
    let APIBODY_NEW = "/coil";       // 改連到新的後台


    let hostName = window.location.hostname;
    let host = window.location.host;
    if(flag === "1") {
      APIBODY = APIBODY_NEW ;
    } else {
      APIBODY = APIBODY_OLD ;
    }

    switch (hostName) {
      case "localhost":
        this.APIURL = `http://${hostName}:8080${APIBODY}`;
      break;
      case "10.106.200.96":
        if(flag === "1") { 
          //var urlHost = "ys-webapt1.walsin.com"
          this.APIURL = `http://${hostName}:8080${APIBODY}`;
        } else {
          var urlHost = "ys-webapt1.walsin.com"
          this.APIURL = `http://${urlHost}:8080${APIBODY}`;
        }
        
        break;
      case "apptst.walsin.com":
        this.APIURL = `http://${hostName}:8083${APIBODY}`;
        break;
      case "ys-webapt1.walsin.com":
        this.APIURL = `http://${hostName}:8080${APIBODY}`;
        break;
      case "ys-pps.walsin.corp":
        this.APIURL = `http://${hostName}:8080${APIBODY}`;
        break;
      case "10.106.2.153":
        this.APIURL = `http://${hostName}:80${APIBODY}`;
        break;
      case "ys-webapp.walsin.com":
        this.APIURL = `https://${hostName}${APIBODY}`;
        break;
      default:
        this.APIURL = `http://${hostName}:8080${APIBODY}`;        
    }
  }

  getAPIURL(flag?:string) {
    this.setAPIURL(flag)
    return this.APIURL;
  }
}
