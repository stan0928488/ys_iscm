import { Component, OnDestroy } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'btn-cell-renderer',
  template: `
    <a
      nz-popconfirm
      nzPopconfirmTitle="確認刪除 ?"
      (nzOnConfirm)="btnClickedHandler($event)"
      style="margin-left: 10px; color: red"
      >Delete</a
    >
    <!-- <button (click)="btnClickedHandler($event)">Click me!</button> -->
  `,
})
export class Pomp003BtnCellRenderer implements ICellRendererAngularComp {
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  btnClickedHandler(event: any) {
    console.log('this.params');
    console.log(this.params);
    this.params.clicked(this.params);
  }

  refresh() {
    return false;
  }
}
