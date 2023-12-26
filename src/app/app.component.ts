import { Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CookieService } from "./services/config/cookie.service";
import { AuthService } from "./services/auth/auth.service";
import { Router, CanActivate } from "@angular/router";

import * as _ from "lodash";
import * as moment from "moment";
import { AppEventBusComponent } from "./app-event-bus.component";
import { SYSTEMService } from "./services/SYSTEM/SYSTEM.service";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit,OnDestroy {
  title = "YS_iSCM";
  isCollapsed = true;
  triggerTemplate = null;

  navClass = "";
  userName;
  plantCode;
  envName;

  menus: TreeNode[] = [];

  @ViewChild("trigger") customTrigger: TemplateRef<void>;
  @HostListener('document:keyup', ['$event'])
  @HostListener('document:click', ['$event'])
  @HostListener('document:wheel', ['$event'])
  resetTimer() {
    this.authService.notifyUserLoginAction();
  }

  constructor(
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService,
    private appEventBusComponent: AppEventBusComponent,
    private systemService : SYSTEMService,
    private nzModalService: NzModalService
  ) {
    this.isLatestVersion();
    const hostName = window.location.hostname;
    if (_.startsWith(hostName, "ys-webapp")) {
      if (window.location.protocol != "https:") {
        location.href = location.href.replace("http://", "https://");
      }
    }
    console.log("=====>");
    this.getEnvClass();
    this.userName = this.cookieService.getCookie("USERNAME");
    this.plantCode = this.cookieService.getCookie("plantCode");
    this.envName = this.getEnvName(hostName);
  }

  ngOnInit(): void {

    let logTime = localStorage.getItem('logTime');
    if(logTime){
      let today = new Date().getTime();
      let diffMs = (today - Number(logTime));
      let second_diff = diffMs/1000; 
      //3秒內視為刷新
      if(second_diff <= 3){
        console.log("刷新")
      }else{
        this.authService.authLogOut();
        console.log("視窗關閉")
      }
    }

    //刷新菜單要重撈
    if(this.userName){
      this.systemService.getCurrentUserMenu().subscribe((res) => {
        let result:any = res;
        if(result.code == 200){
          this.menus = result.data;
        }else{
          this.nzModalService.error({
            nzTitle: '獲取菜單失敗',
            nzContent: result.message,
          });
        }
      });
    }else{
      this.menus = [];
    }

    this.appEventBusComponent.on('logingSuccess', (data: any) => {
      if (data.data.logingSuccess) {
        this.systemService.getCurrentUserMenu().subscribe((res) => {
          let result:any = res;
          if(result.code == 200){
            this.menus = result.data;
          }else{
            this.nzModalService.error({
              nzTitle: '獲取菜單失敗',
              nzContent: result.message,
            });
          }
        });
      }else{
        this.menus = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.appEventBusComponent.unsubscribe();
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    localStorage.setItem('logTime', new Date().getTime().toString())
  }

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    console.log("==>changeTrigger");
    this.triggerTemplate = this.customTrigger;
  }

  //檢查是否是最新版本
  isLatestVersion() {
    const dateID = "check_YS_iSCM_Date";
    const checkDate = localStorage.getItem(dateID);
    console.log("checkDate");
    console.log(checkDate);
    if (
      checkDate === undefined ||
      checkDate !== moment().format("YYYY.MM.DD")
    ) {
      localStorage.setItem(dateID, moment().format("YYYY.MM.DD"));
      console.log("hard reload to update");
      // window.location.reload(true);
    } else {
      //good to go
      console.log("good to go");
    }
  }

  getEnvClass() {
    const hostName = window.location.hostname;
    let className = "navBar ";

    switch (hostName) {
      case "ys-ppsapp01.walsin.corp":
        className += " nav-bar-prod";
        break;
      case "localhost":
        className += " nav-bar-local";
        break;
      default:
        className += " nav-bar-tst";
    }

    this.navClass = className;
  }

  onLogout() {
    console.log("onLogout");
    this.cookieService.setCookie("USERNAME", "", 1);
    this.cookieService.setCookie("plantCode", "", 1);
    this.userName = "";
    this.plantCode = "";

    this.router.navigate(["login"]);
  }

  componentAdded(_event) {}

  componentRemoved(_event) {
    this.userName = this.cookieService.getCookie("USERNAME");
    this.plantCode = this.cookieService.getCookie("plantCode");
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  
  getEnvName(_name){
    let env;
    switch (_name) {
      case "ys-pps.walsin.corp":
        env = " 驗證環境 ";
        break;
      case "ys-ppsapp01.walsin.corp":
        env = " 正式環境 ";
        break;
      case "localhost":
        env = "_本機環境";
        break;
      default:
        env = "_測試環境";
    }

    return env;
  }

  // 日期相差
  dayDiff(d1:Date, d2:Date) {
    var diff = Math.abs(d2.getTime() - d1.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays;
  }

  // 日期轉換
  dateFormat(_dateString, _flag) {
    if (_dateString == undefined || _dateString == '' || _dateString == null) {
      return "";
    } else {
      if (_flag == '1') {
        let date = moment(_dateString, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        return date;
      } else if (_flag == '2') {
        let date = moment(_dateString, "YYYY-MM-DD").format("YYYY-MM-DD");
        return date;
      } else if (_flag == '3') {
        let date = moment(_dateString, "HH:mm:ss").format("HH:mm:ss");
        return date;
      } else if (_flag == '4') {
        let date = moment(_dateString, "HH:mm").format("HH:mm");
        return date;
      } else if (_flag == '5') {
        let date = moment(_dateString, "MM").format("MM");
        return date;
      } else if (_flag == '6') {
        let date = moment(_dateString, "YYYY-MM").format("YYYY-MM");
        return date;
      } else if (_flag == '7') {
        let date = moment(_dateString, "YYYYMMDDHHmmss").format("YYYYMMDDHHmmss");
        return date;
      } else if (_flag == '8') {
        let date = moment(_dateString, "MM-DD").format("MM-DD");
        return date;
      } 
    }
  }

  //pipe 數字3位一撇 (數值, 小數點幾位)
  toThousandNumber(param, point) {
    const paramStr = param.toFixed(point).toString();
    if (paramStr.length > 3) {
      return paramStr.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    if (param === 0) {
      return '　';
    }
    return paramStr;
  }

  // date 轉換
  dateStringFormat(dateString) {
    if(dateString !== undefined) {
      const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      const parts = dateString.split(' ');
      const month = months.indexOf(parts[0]) + 1;
      const day = parseInt(parts[1].replace(',', ''));
      const year = parseInt(parts[2]);
      const isoDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return isoDateString;
    }
    return '';
  }

}

interface TreeNode {
  id?: number;
  level:any;
  useStatus?: string;
  delStatus?: string;
  createUser?: string;
  createTime?: string;
  updateUser?: string;
  updateTime?: string;
  applicationFrom?: string;
  menuType?: string;
  icon?: string;
  sortIndex?: string;
  path?: string;
  parentId?: string;
  selected: boolean;
  code?: string;
  menuName: string;
  open?: boolean;
  roles?: string;
  children?: TreeNode[];
}