import { Injectable } from "@angular/core";
import { MSHI003Component } from "./MSHI003.component";
import { CanDeactivate } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class MSHI003CanDeactivateGuard implements CanDeactivate<MSHI003Component> {
  canDeactivate(component) {
    return component.canDeactivate();
  }
}

