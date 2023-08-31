import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { PPSR321Detail02Component } from "./PPSR321-detail02.component";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PPSR321Detail02CanDeactivateGuard implements CanDeactivate<PPSR321Detail02Component>{
    
    canDeactivate(component: PPSR321Detail02Component, 
        currentRoute: ActivatedRouteSnapshot, 
        currentState: RouterStateSnapshot, 
        nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
          return component.canDeactivate();  
    }
    
}