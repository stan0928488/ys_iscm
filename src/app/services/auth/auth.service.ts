import { Injectable, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import * as moment from "moment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import * as _ from "lodash";
import { Observable, Subject } from "rxjs";
import { CookieService } from "../config/cookie.service";
import { ACCService } from "src/app/services/ACC/ACC.service";
import { MainEventBusComponent } from "src/app/main/app-event-bus.component";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  @Output()
  emitSpot = new EventEmitter();

  isAuth: boolean = false;
  USERNAME: string;
  checkTime: string;
  CAS_URL = "https://cas.walsin.com:8889/";
  constructor(
    private ACCService: ACCService,
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient,
    private appEventBusComponent: MainEventBusComponent,
  ) {}

  isAuthenticated(): boolean {
    let cookie_Id = this.cookieService.getCookie("USERNAME");
    if (cookie_Id.length > 3) {
      this.isAuth = true;
      this.USERNAME = cookie_Id;

    } else {
      this.isAuth = false;
      this.USERNAME = "";
    }
    return this.isAuth;
  }

  _userLoginActionOccured : Subject<void> = new Subject() ;
  get userLoginActionOccured(): Observable<void> {return this._userLoginActionOccured.asObservable()}

  notifyUserLoginAction() {
    // console.log("登錄標記：" + this.isAuth)
    this._userLoginActionOccured.next() ;

  }

  authLogOut() {
    this.cookieService.deleteCookie("USERNAME");
    this.emitSpot.emit("authLogOut");
    this.isAuth = false;
    this.router.navigateByUrl("/login");
  }

  emitAuthState() {
    this.checkTime = moment().format("YYYYMMDDHHmmss");
    this.emitSpot.emit(this.checkTime);
  }

  LoginAuthCheck(_ID, _PWD) {
    let header = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded;charset=UTF-8"
    );
    let params = new HttpParams()
      .set("username", _.toUpper(_ID))
      .set("password", _PWD)
      .set("fromApp", "true");
    let queryUrl = this.CAS_URL + "cas/v1/tickets";
    return this.http.post(queryUrl, params, {
      headers: header,
      responseType: "text"
    });
  }
}
