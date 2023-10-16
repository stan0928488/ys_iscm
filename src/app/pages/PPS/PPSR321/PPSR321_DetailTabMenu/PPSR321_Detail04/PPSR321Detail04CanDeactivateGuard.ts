import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { PPSR321Detail04Component } from "./PPSR321-detail04.component";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PPSR321Detail04CanDeactivateGuard implements CanDeactivate<PPSR321Detail04Component>{
    
    canDeactivate(component: PPSR321Detail04Component, 
        currentRoute: ActivatedRouteSnapshot, 
        currentState: RouterStateSnapshot, 
        nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
            if(component === null || component === undefined) return true;
            return component.canDeactivate();  
    }
    
}