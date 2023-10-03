import { Component, OnDestroy } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';




@Component({
  selector: 'btn-cell-renderer',
  template: `
    <button
      class="buttonOne"
      nz-button
      nzType="primary"
      nz-popconfirm
      nzPopconfirmTitle="確認保存 ?"
      (nzOnConfirm)="onSave($event)"
      style="margin-left: 10px;"
    >
      保存
    </button>

    <button
      class="buttonOne"
      nz-button
      nz-popconfirm
      nzPopconfirmTitle="確認 0R 結案 ?"
      (nzOnConfirm)="onClosed($event)"
      style="margin-left: 10px;"
    >
      0R 結案
    </button>

    <!-- <button (click)="btnClickedHandler($event)">Click me!</button> -->
  `,
  styleUrls: ['./pomp001.component.scss'],
})
export class Pomp001ActionBtnCellRenderer implements ICellRendererAngularComp {
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  onSave(event: any) {
    console.log('this.params onSave ');
    console.log(this.params);
    this.params.onSave(this.params);
  }

  onClosed(event: any) {
    console.log('this.params onClosed ');
    console.log(this.params);
    this.params.onClosed(this.params);
  }

  refresh() {
    return false;
  }
}
