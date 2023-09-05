import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { PPSR321Detail0301Component } from "./PPSR321-detail0301.component";

@Injectable({
    providedIn: 'root'
})
export class PPSR321Detail0301CanDeactivateGuard implements CanDeactivate<PPSR321Detail0301Component>{
    
    canDeactivate(component: PPSR321Detail0301Component, 
        currentRoute: ActivatedRouteSnapshot, 
        currentState: RouterStateSnapshot, 
        nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
            if(component === null || component === undefined) return true; 
            return component.canDeactivate();  
    }
    
}