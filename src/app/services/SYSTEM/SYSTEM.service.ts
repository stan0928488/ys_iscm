import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';

import * as _ from 'lodash';
import { CookieService } from '../config/cookie.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SYSTEMService {
  APIURL: string = '';
  APINEWURL: string = '';
  CONTEXT_PATH = '/ys-iscm';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'accept-user': this.cookieService.getCookie('USERNAME'),
      //'plant-code': this.cookieService.getCookie('plantCode')
    }),
  };

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private cookieService: CookieService
  ) {
    this.APIURL = this.configService.getAPIURL();
    this.APINEWURL = this.configService.getAPIURL('1');
  }


  /**
   * 獲取系統所有功能菜單
   * @returns 
   */
  getSystemMenu(){
    const queryUrl = `${this.CONTEXT_PATH}/system/menu/getAllMenuFunctionAuth`;
    const body = {};
    return this.http.post(queryUrl, body, this.httpOptions);
  }

  /**
   * 保存菜單
   * @param body 
   * @returns 
   */
  saveMenuNode(body : any) {
    const queryUrl = `${this.CONTEXT_PATH}/system/menu/saveMenuFunction`;
    return this.http.post(queryUrl, body, this.httpOptions);
    // 測試用回傳資料
    // const testResponse = {
    //   code: 200,
    //   data : {
    //     id : new Date().getTime()
    //   }
    // }
    // return of(testResponse);
  }

  deleteMenuNode(id : any) {
    const queryUrl = `${this.APINEWURL}/system/menu/deleteMenuFunction/${id}`;

    // TODO
    // 測試用回傳資料
    const testResponse = {
      code: 200
    }

    return of(testResponse);

    // return this.http.get(queryUrl);
  }

  /**
   * 
   * @returns 獲取職務資訊
   */
  getRoleList() {
    const queryUrl = `${this.CONTEXT_PATH}/system/role/getAllRole`;
    return this.http.post(queryUrl, null, this.httpOptions);
  }

  /**
   * 配置某職務角色擁有哪些菜單權限
   */
  configRoleAndMenuRelation(payload:any){
    const queryUrl = `${this.CONTEXT_PATH}/system/role/saveRoleAuth`;
    return this.http.post(queryUrl, payload, this.httpOptions);
  }

  /**
   * 
   */
  getMenusRelationRole(roleId : string){
    const queryUrl = `${this.CONTEXT_PATH}/system/role/getMenuByRoleId`;
    const payload = {
      roleId : roleId
    }
    return this.http.post(queryUrl, payload, this.httpOptions);
  }
}
