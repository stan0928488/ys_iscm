import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { PPSR321Component } from "../PPSR321/PPSR321.component";

@Injectable({
    providedIn: 'root'
})
export class PPSR321CanDeactivateGuard implements CanDeactivate<PPSR321Component>{
    
    canDeactivate(component: PPSR321Component, 
        currentRoute: ActivatedRouteSnapshot, 
        currentState: RouterStateSnapshot, 
        nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
          return component.canDeactivate();  
    }
    
}