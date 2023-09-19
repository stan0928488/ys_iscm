import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { PPSR321Detail01Component } from "./PPSR321-detail01.component";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PPSR321Detail01CanDeactivateGuard implements CanDeactivate<PPSR321Detail01Component>{
    
    canDeactivate(component: PPSR321Detail01Component, 
        currentRoute: ActivatedRouteSnapshot, 
        currentState: RouterStateSnapshot, 
        nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
          
            if(component === null || component === undefined) return true;
            return component.canDeactivate();  

    }
    
}