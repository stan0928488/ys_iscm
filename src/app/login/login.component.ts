import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as utf8 from 'utf8';
import { NzButtonModule } from 'ng-zorro-antd/button';

//import * as bases from "bases";
import * as _ from 'lodash';
import { CommonService } from '../services/common/common.service';
import { AuthService } from '../services/auth/auth.service';
import { CookieService } from '../services/config/cookie.service';
import { MainEventBusComponent } from '../main/main-event-bus.component';
import { NzMessageService } from 'ng-zorro-antd/message';
//import * as base64 from "base64-encode-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[NzMessageService]
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

  // 帳號密碼不能為空校驗
  validateForm!: FormGroup;

  // 當前是什麼環境
  envName = '';
  // 當前環境的代表色號
  envColor = '';
  // 當前環境的CSS Class
  envClass = '';

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
    private commonService: CommonService,
    private appEventBusComponent: MainEventBusComponent,
    private formBuilder: FormBuilder,
    private nzMessage: NzMessageService,
  ) {

    let hostName = window.location.hostname;
    this.setEnvInfo(hostName);

  }

  setEnvInfo(host){
    switch (host) {
      case "ys-ppsapp01.walsin.corp":
        this.envName = "正式環境";
        this.envColor = '#e8e8e8';
        this.envClass = 'prod env-name';
        break;
      case "localhost":
        this.envName = "本機環境";
        this.envColor = '#96a6b5';
        this.envClass = 'local env-name';
        break;
      default:
        this.envName = "測試環境";
        this.envColor = '#df878c';
        this.envClass = 'tst env-name';
    }
  }


  ngOnInit() {

    this.validateForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.redirectCheck();
    this.authService.authLogOut();
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
  onSubmit() {
    const validStatus = this.validateForm.status;
    if(_.isEqual('INVALID', validStatus)){
      this.nzMessage.error('帳號與密碼不能為空');
      return;
    }

    this.isLogining = true;
    // 獲取表單上的所有參數
    const formParams = this.validateForm.getRawValue();
    let username = _.toUpper(formParams.username);
    let password = formParams.password;
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

    //this.commonService.casLoginWithPost(casObj).subscribe(
    // const env = "prod";
   const  _param = {userName:username,password:password,saveLogin:true}
    this.commonService.casLogin(_param).subscribe(
      (res) => {
        console.log("登录结果") ;
        console.log(res)
        let result:any = res ;

        // if (_.get(res, 'isAuth')) {
          if (result.code === 200 && result.data.auth === true) {
          console.log("login success");
          
          this.cookieService.setCookie("USERNAME", username, 2);
          this.cookieService.setCookie("plantCode", plantCode, 2);
          this.authService.emitAuthState();
          let jwtTokenTemp = result.data.jwtToken ;
          // 儲存 JWT token 到 localStorage
          localStorage.setItem('jwtToken',jwtTokenTemp);
          let jwtToken = localStorage.getItem('jwtToken');
          console.log("jwtToken:" + jwtToken);
          
          this.authFail = false;
          this.isLogining = false;
          
          this.appEventBusComponent.emit({
            name: 'logingSuccess',
            data: {
              logingSuccess:true,
            },
          });

          this.router.navigate(['/main']);
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
