import { Component, INJECTOR, Input } from "@angular/core";

@Component({
    selector: 'menus',
    template: `
        <ng-container *ngFor="let menu of menus">
            <li
                *ngIf="menu.isShow == 1 && menu.children && menu.children.length > 0"
                nz-submenu
                [nzOpen]="menu.open"
                [nzTitle]="menu.menuName"
                [nzIcon]="menu.icon"
                [nzDisabled]="menu.disabled"
                class="menuItemText">
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
        </ng-container>
    `,
  })
  export class RecursionMenusComponent {
    @Input() menus;
}