import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { AppEventBusComponent } from 'src/app/app-event-bus.component';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    public auth: AuthService, 
    public router: Router,
  ) {}
  
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
