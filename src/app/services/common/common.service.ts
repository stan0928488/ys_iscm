import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map } from 'rxjs/operators';

import * as _ from 'lodash';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  APIURL: string = '';
  APINEWURL: string = '';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  // APIURL:string = "http://apptst.walsin.com:8083/pps/rest/FCP";

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private Modal: NzModalService
  ) {
    this.APIURL = this.configService.getAPIURL();
    this.APINEWURL = this.configService.getAPIURL('1');
  }

  //getRunFCPCount 取得目前正在執行的FCP (所有靜態資料、執行策略皆共用)
  getRunFCPCount() {
    let queryUrl = this.APIURL + '/FCP/I210/getRunFCPCount';
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //Get getPickerShopEQUIP 下拉選擇站別 / 機台
  getPickerShopEQUIP(_type, _ShopArr) {
    console.log('api service getPickerShopEQUIP');
    let queryUrl =
      this.APIURL + `/FCP/I202/getPickerShopEQUIP/${_type}/${_ShopArr}`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //Get getMonthWeekDay()
  getMonthWeekDay() {
    console.log('api service getMonthWeekDay');
    let queryUrl = this.APIURL + `/FCP/I200/getMonthWeekDayList`;
    console.log(queryUrl);
    return this.http.get(queryUrl);
  }

  //Get getPickerShopData sorting表的站別
  getPickerShopData() {
    let queryUrl = this.APIURL + '/FCP/I210/getPickerShopData';
    return this.http.get(queryUrl);
  }
  //Get getPickerMachineData 下拉機台 by 站別
  getPickerMachineData(_shop) {
    let queryUrl = this.APIURL + `/FCP/I210/getPickerMachineData/${_shop}`;
    return this.http.get(queryUrl);
  }

  // http://localhost:8091/cas/login?_username=UR10369&_password=1234&_env=dev
  // casLogin(_username, _password, _env) {
  //   _password = encodeURIComponent(_password);
  //   // let queryUrl = `${this.APIURL}/Login/cas/login?_username=${_username}&_password=${_password}&_env=${_env}`;

  //   const COIL_APIURL = this.configService.getAPIURL('1');
  //   console.log(
  //     '🚀 ~ file: common.service.ts:68 ~ CommonService ~ casLogin ~ COIL_APIURL:',
  //     COIL_APIURL
  //   );
  //   let queryUrl = `${COIL_APIURL}/cas/login?_username=${_username}&_password=${_password}&_env=${_env}`;

  //   console.log(
  //     '🚀 ~ file: common.service.ts:74 ~ CommonService ~ casLogin ~ queryUrl:',
  //     queryUrl
  //   );
  //   return this.http.get(queryUrl);
  // }
  /** 
  casLogin(_username, _password, _env) {
    _password = encodeURIComponent(_password);
    let queryUrl = `${this.APINEWURL}/cas/login?_username=${_username}&_password=${_password}&_env=${_env}`;
    return this.http.get(queryUrl);
  }
  */
  casLogin(_param) {
    let queryUrl = "http://localhost:8080/ys-iscm/any/user/login";
    return this.http.post(queryUrl,_param,this.httpOptions);
  }


  casLoginWithPost(_result) {
    const body = JSON.stringify(_result);
    console.log('JSON.stringify');
    console.log(body);
    let queryUrl =
      'http://apptst.walsin.com:8083/RecevieGoodsAPI/rest/ReceiveGoods/cas/login';
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  checkExcelDataDuplicate(jsonExcelData: any): boolean {
    let i = 0;
    let j = 1;

    while (true) {
      if (i === jsonExcelData.length - 1) return false;

      if (j > jsonExcelData.length - 1) {
        i++;
        j = i + 1;
      }

      if (i === jsonExcelData.length - 1) return false;

      if (_.isEqual(jsonExcelData[i], jsonExcelData[j])) {
        this.errorMSG(
          '匯入失敗',
          `第 ${i + 2} 行資料的與第 ${j + 2} 行資料已重複，請修改後再匯入`
        );
        return true;
      } else {
        j++;
      }
    }
  }

  errorMSG(_title, _context): void {
    this.Modal.error({
      nzTitle: _title,
      nzContent: `${_context}`,
    });
  }
}
