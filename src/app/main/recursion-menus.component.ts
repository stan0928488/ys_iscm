import { Component, INJECTOR, Input } from "@angular/core";

@Component({
    selector: 'menus',
    template: `
        <div *ngFor="let menu of menus">
            <li
                *ngIf="menu.isShow == 1 && menu.children && menu.children.length > 0"
                nz-submenu
                [nzTitle]="menu.menuName"
                [nzIcon]="menu.icon"
                [nzDisabled]="menu.disabled">
                <ul>
                    <menus 
                        [menus]="menu.children">
                    </menus>
                </ul>
            </li>
            <li
                *ngIf="menu.isShow == 1 && (!menu.children || menu.children.length <= 0)"
                nz-menu-item
                [nzDisabled]="menu.disabled"
                [nzSelected]="menu.selected">
                <span nz-icon [nzType]="menu.icon" *ngIf="menu.icon"></span>
                <a [routerLink]="[menu.path]"> {{menu.menuName}} </a>
            </li>
        </div>
    `,
  })
  export class RecursionMenusComponent {
    @Input() menus;
}