import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CookieService } from "./services/config/cookie.service";
import { AuthService } from "./services/auth/auth.service";
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ResolveStart, ResolveEnd, GuardsCheckEnd, NavigationCancel } from "@angular/router";
import * as _ from "lodash";
import * as moment from "moment";
import { MainEventBusComponent } from "./main/main-event-bus.component";
import { SYSTEMService } from "./services/SYSTEM/SYSTEM.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { TabModel, TabService } from "./services/common/tab.service";
import { filter, map, mergeMap } from "rxjs";
import * as uuid from 'uuid';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {

  title = "YS_iSCM";

  constructor(){}

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

  //日期物件format
  dateObjFormat(_date, _flag) {
    if (_date) {
      if (_flag == '1') {
        let date = moment(_date).format("YYYY/MM/DD HH:mm:ss");
        return date;
      } else if (_flag == '2') {
        let date = moment(_date).format("YYYY/MM/DD");
        return date;
      } else if (_flag == '3') {
        let date = moment(_date).format("HH:mm:ss");
        return date;
      } else if (_flag == '4') {
        let date = moment(_date).format("HH:mm");
        return date;
      } else if (_flag == '5') {
        let date = moment(_date).format("MM");
        return date;
      } else if (_flag == '6') {
        let date = moment(_date).format("YYYY/MM");
        return date;
      } else if (_flag == '7') {
        let date = moment(_date).format("YYYYMMDDHHmmss");
        return date;
      } else if (_flag == '8') {
        let date = moment(_date).format("MM/DD");
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
