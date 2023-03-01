import { Injectable } from "@angular/core";
import cookie from "src/app/lib/json-cookie";
import * as _ from "lodash";

import * as utf8 from "utf8";

@Injectable({
  providedIn: "root"
})
export class CookieService {
  public isConsented: boolean = false;
  constructor() {}

  public getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(";");
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, "");
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return "";
  }

  public deleteCookie(name) {
    this.setCookie(name, "", -1);
  }

  public setCookie(
    name: string,
    value: string,
    expireDays: number,
    path: string = ""
  ) {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : "";
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  public setCheckedPoRowDataJsonCookie(json) {
    let groupCount = _.round(json.length / 5);
    if (json.length % 5 != 0) {
      groupCount = groupCount + 1;
    }

    this.deleteCookie("groupCount");
    this.setCookie("groupCount", groupCount.toString(), 1);
    for (let i = 1; i <= groupCount; i++) {
      let cookieName = "checkedPoRowDataJson" + i;
      let start = (i - 1) * 5;
      let end = i == groupCount ? json.length : i * 5;
      this.deleteCookie(cookieName);
      cookie.set(cookieName, _.slice(json, start, end));
    }
  }

  public getCheckedPoRowDataJsonCookie() {
    let groupCount = parseInt(this.getCookie("groupCount"));
    console.log("groupCount: " + groupCount);
    let resultSet = [];
    for (let i = 1; i <= groupCount; i++) {
      let cookieName = "checkedPoRowDataJson" + i;
      let data = cookie.get(cookieName);
      for (let item of data) {
        resultSet.push(item);
      }
    }

    return resultSet;
  }
}
