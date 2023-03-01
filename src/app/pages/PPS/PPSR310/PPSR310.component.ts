import { Component, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from "lodash";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'




@Component({
  selector: "app-PPSR310",
  templateUrl: "./PPSR310.component.html",
  styleUrls: ["./PPSR310.component.scss"],
  providers:[NzMessageService]
})
export class PPSR310Component implements AfterViewInit {
  testUrl;
  url = "https://app.powerbi.com/reportEmbed?reportId=bb530009-9461-4714-b74b-00db4add051a&autoAuth=true&ctid=97876bed-bb9a-4617-802b-94c62e7837b5";

  constructor(
    private getPPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private sanitizer:DomSanitizer
  ) {
    this.i18n.setLocale(zh_TW);
  }


  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
  }

  trustUrl(url: string) {
    if(url){
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }


}
