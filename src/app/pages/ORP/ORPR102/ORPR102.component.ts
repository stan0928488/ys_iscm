import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { ORPService } from "src/app/services/ORP/ORP.service";
import { zh_TW ,NzI18nService } from "ng-zorro-antd/i18n";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { AppComponent } from "src/app/app.component";
import * as _ from "lodash";
import * as moment from 'moment';


@Component({
  selector: "app-ORPR102",
  templateUrl: "./ORPR102.component.html",
  styleUrls: ["./ORPR102.component.scss"],
  providers:[NzMessageService]
})

export class ORPR102Component implements AfterViewInit {
  USERNAME;
  safeUrl="http://10.104.5.166:8889/";

  constructor(
    private ORPService: ORPService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private component: AppComponent
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
  }




  ngAfterViewInit() {
    console.log("ngAfterViewCheckedr102");
    
  }


  ngOnInit(): void {
  }


}
