import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let jwtToken = localStorage.getItem('jwtToken');
    let currentRoute = this.router.url; // 獲取當前路由

    console.log(jwtToken)
    console.log(currentRoute)

    if (jwtToken) {
      request = request.clone({
        setHeaders: {
         // Authorization: `Bearer ${jwtToken}`,
         Authorization:jwtToken,
          CurrentRoute: currentRoute // 放入當前路由
        }
      });
    }

    // console.log("測試中")
    // return next.handle(request)

    console.log("正式運行")
    return next.handle(request).pipe(
      catchError((error) => {
        console.log(error)
        if (error) {
          const errorMessage = error.error?.error || 'Access Denied';
          console.log('Error Message:', errorMessage);
          console.log('拒絕此使用者訪問');
          // 使用 UserStatusService 或其他方式處理錯誤訊息
          // 導航到 '/AccessDined' 網頁
          this.router.navigate(['/AccessDined']);
        }

        return throwError(error);
      })
    );
  }
}



    // }

    //--這段之後記得復原
    // return next.handle(request).pipe(
    //   catchError((error) => {
    //     console.log(error)
    //     if (error.status === 403) {
    //       const errorMessage = error.error?.error || 'Access Denied';
    //       console.log('Error Message:', errorMessage);
    //       console.log('拒絕此使用者訪問');
    //       // 使用 UserStatusService 或其他方式處理錯誤訊息
    //       // 導航到 '/AccessDined' 網頁
    //       this.router.navigate(['/AccessDined']);
    //     }

    //     return throwError(error);
    //   })
    // );

