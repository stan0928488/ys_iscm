import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as utf8 from 'utf8';
import { NzButtonModule } from 'ng-zorro-antd/button';

//import * as bases from "bases";
import * as _ from 'lodash';
import { CommonService } from '../services/common/common.service';
import { AuthService } from '../services/auth/auth.service';
import { CookieService } from '../services/config/cookie.service';
//import * as base64 from "base64-encode-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authFail: boolean = false;
  isVisibleMiddle: boolean = false;
  suffixTemplate;

  second = 5;
  myCountdown;
  PLANT_CODE = 'YS';
  noShow = true;

  isLogining: boolean = false;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.redirectCheck();

    this.authService.emitAuthState();

    if (this.authService.isAuthenticated()) {
      // this.router.navigateByUrl("/FCPINPUT/I220");
    }
  }

  redirectCheck() {
    const hostName = window.location.hostname;
    const YS_WEBAPP = 'ys-webapp.walsin.com';

    if (hostName !== YS_WEBAPP) {
      this.showModalMiddle();

      this.myCountdown = setInterval(this.countdown.bind(this), 1000);
    }
  }

  showModalMiddle() {
    this.isVisibleMiddle = true;
  }

  handleOkMiddle() {
    this.redirectToYSWebSite();
  }

  redirectToYSWebSite() {
    //window.location.href = this.YS_WEBSITE;
  }

  countdown() {
    if (this.second > 0) {
      this.second--;
    } else {
      clearInterval(this.myCountdown);
      this.redirectToYSWebSite();
    }
  }

  // 判斷使用者帳號切換廠區
  showPlantCode(f: any) {
    let usercode = _.toUpper(f.value.username);
    if (
      usercode === 'UR11445' ||
      usercode === 'UR11994' ||
      usercode === 'UR10167' ||
      usercode === 'UR09124' ||
      usercode === 'UR07210' ||
      usercode === 'UR11550' ||
      usercode === 'UR10369'
    ) {
      this.noShow = false;
    } else {
      this.noShow = true;
    }
  }

  //Form Submit Event
  onSubmit(f: any) {
    this.isLogining = true;
    let username = _.toUpper(f.value.username);
    let password = f.value.password;
    let plantCode = this.PLANT_CODE; // 廠區別
    // console.log("密码：" +JSON.stringify(f.value))

    //華新登入
    const hostName = window.location.hostname;
    const env = hostName === 'ys-pps.walsin.corp' ? 'tst' : 'dev';

    const casObj = {
      username,
      password,
      env,
    };
    this.router.navigateByUrl('/FCPBarData/P202');
    //this.commonService.casLoginWithPost(casObj).subscribe(
    // const env = "prod";
    this.commonService.casLogin(username, password, env).subscribe(
      (res) => {
        if (_.get(res, 'isAuth')) {
          console.log('login success');
          this.authFail = false;

          this.cookieService.setCookie('USERNAME', username, 2);
          this.cookieService.setCookie('plantCode', plantCode, 2);
          this.authService.emitAuthState();
          this.router.navigateByUrl('/FCPBarData/P202');
          this.isLogining = false;
          // window.location.reload();
        } else {
          console.log('login fail err');
          console.log(res);
          this.isLogining = false;
          this.authFail = true;
        }
      },
      (err) => {
        console.log('login fail err');
        console.log(err);
        this.isLogining = false;
        this.authFail = true;
      }
    );

    /*
    this.authService.LoginAuthCheck(username, password).subscribe(
      res => {
        console.log("login success");
        this.authFail = false;

        this.cookieService.setCookie("USERNAME", username, 2);
        this.authService.emitAuthState();
        // this.router.navigateByUrl("/Billet");
        window.location.reload();
      },
      err => {
        console.log("login fail err");
        console.log(err);
        this.authFail = true;
      }
    );
    */
  }
}
