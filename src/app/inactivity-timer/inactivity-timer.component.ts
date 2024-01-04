import { Component,OnDestroy, OnInit } from '@angular/core';
import { Subject, timer, Subscription,interval } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { CookieService } from '../services/config/cookie.service';
import { AppEventBusComponent } from '../app-event-bus.component';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-inactivity-timer',
  templateUrl: './inactivity-timer.component.html',
  styleUrls: ['./inactivity-timer.component.scss']
})
export class InactivityTimerComponent implements  OnDestroy, OnInit {
  endTime = 120;
  isVisible = false ;
  message = ""
  constructor(
    private authService:AuthService,
    private cookieService: CookieService,
    private appEventBusComponent: AppEventBusComponent,
    private router: Router,
  ) { }
  unsubscribe$: Subject<void> = new Subject();
  timerSubscription: Subscription;
  ngOnInit() {
    this.resetTimer();
    this.authService.userLoginActionOccured.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.resetTimer();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  handleCancel(){
    this.isVisible = !this.isVisible ;
  }
  resetTimer(endTime: number = this.endTime) {
    const interval = 1000;
    const duration = endTime * 60;
    const pseudoSubscriber = {
      next: (value: number) => {
        //登出菜單要清空
        let userName = this.cookieService.getCookie("USERNAME");
        if(!userName){
          this.appEventBusComponent.emit({
            name: 'logingSuccess',
            data: {
              logingSuccess:false,
            },
          });
        }else{
          this.router.events.subscribe(
            (event:any)=>{
              if(event instanceof NavigationEnd){
                if(!event.url.includes('login') && this.appEventBusComponent.hasPermission(event.url) == false){
                  this.router.navigate(['/AccessDined']);
                }
              }
          })
        }
        this.render((duration - +value)*interval,value,duration)
      },
      error: (error: any) => {},
      complete: () => {
        if(this.authService.isAuth){
                this.authService.authLogOut();
              }
      },
  }
  this.timerSubscription = timer(0, interval).pipe(
      take(duration)
    ).subscribe(pseudoSubscriber) ;
    // this.timerSubscription = timer(0, interval).pipe(
    //   take(duration)
    // ).subscribe(value =>
    //   this.render((duration - +value)*interval,value,duration),
    //   err => { },
    //   () => {
    //     if(this.authService.isAuth){
    //       this.authService.authLogOut();
    //     }

    //   }
    // )
  }

  private render(count,value,duration) {
    //console.log("this render(count) :" +  (count / 1000).toFixed(0) + " Value : " + value + " duration : " + duration)
    if(count <= 30 * 1000 && count > 1000 && this.authService.isAuth) {
      this.isVisible = true ;
      this.message = (count / 1000).toFixed(0);
    } else {
      this.isVisible = false ;
    }

  }


}
