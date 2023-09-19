import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { PPSR321Detail0302Component } from "./PPSR321-detail0302.component";

@Injectable({
    providedIn: 'root'
})
export class PPSR321Detail0302CanDeactivateGuard implements CanDeactivate<PPSR321Detail0302Component>{
    
    canDeactivate(component: PPSR321Detail0302Component, 
        currentRoute: ActivatedRouteSnapshot, 
        currentState: RouterStateSnapshot, 
        nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
            if(component === null || component === undefined) return true;
            return component.canDeactivate();  
    }
    
}