import { Component, INJECTOR, Input } from "@angular/core";

@Component({
    selector: 'menus',
    template: `
    <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: menus }"></ng-container>
    <ng-template #menuTpl let-menus>
      <ng-container *ngFor="let menu of menus">
            <li
                *ngIf="!menu.children || menu.children.length <= 0"
                nz-menu-item
                [nzDisabled]="menu.disabled"
                [nzSelected]="menu.selected"
                [nzPaddingLeft]="menu.level * 24"
            >
            <span nz-icon [nzType]="menu.icon" *ngIf="menu.icon"></span>
            <a [routerLink]="[menu.path]"> {{menu.menuName}} </a>
            </li>
            <li
                *ngIf="menu.children && menu.children.length > 0"
                nz-submenu
                [nzOpen]="menu.open"
                [nzTitle]="menu.menuName"
                [nzIcon]="menu.icon"
                [nzDisabled]="menu.disabled"
                [nzPaddingLeft]="menu.level * 24"
            >
          <ul>
            <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: menu.children }"></ng-container>
          </ul>
        </li>
      </ng-container>
    </ng-template>

    `,
  })
  export class RecursionMenusComponent {
    @Input() menus;
}