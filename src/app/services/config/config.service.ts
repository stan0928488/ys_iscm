import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  APIURL: string = '';
  CONTEXT_PATH = '/ys-iscm';
  LOCAL_PREFIX = 'ysiscm_jwtToken';

  constructor(private http: HttpClient) {
    //this.setAPIURL();
  }

  setAPIURL(flag?: string) {
    // let APIBODY = "/YSiSCM";    // 未來移植完成的新專案包

    let APIBODY = ''; // 先連到舊的後台
    let APIBODY_OLD = '/pps/rest'; // 先連到舊的後台
    let APIBODY_NEW = '/ys-iscm'; // 改連到新的後台

    let hostName = window.location.hostname;
    let host = window.location.host;
    if (flag === '1') {
      APIBODY = APIBODY_NEW;
    } else {
      APIBODY = APIBODY_OLD;
    }

    switch (hostName) {
      case 'localhost':
        if (flag === '1') {
          this.APIURL = `http://${hostName}:8080${APIBODY}`;
        } else {
          var urlHost = 'ys-ppsapt01.walsin.corp';
          this.APIURL = `http://${urlHost}:8080${APIBODY}`;
        }
        break;
      case 'ys-pps.walsin.corp':
        this.APIURL = `http://${hostName}:8080${APIBODY}`;
        break;
      case 'ys-webapp.walsin.com':
        // https://ys-webapp.walsin.com/iscm/ nginx 轉址 到 http://ys-ppsapp01.walsin.corp:8080/ 備援到 http://ys-ppsapp02.walsin.corp:8080/
        this.APIURL = `https://${hostName}/iscm/${APIBODY}`;
        break;
      default:
        this.APIURL = `http://${hostName}:8080${APIBODY}`;
    }
  }

  getAPIURL(flag?: string) {
    this.setAPIURL(flag);
    return this.APIURL;
  }
}
