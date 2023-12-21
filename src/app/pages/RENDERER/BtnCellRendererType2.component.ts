import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
    <button nz-button nzType="default" (click)="onClick($event)">{{btnContext}}</button>
    `
})

export class BtnCellRendererType2 implements ICellRendererAngularComp {

  params;
  btnContext;

  agInit(params): void {
    this.params = params;
    this.btnContext = this.params[0].context;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {

    var actionParam = this.params[0];

    if (actionParam.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data,
        params: this.params
      }
      actionParam.onClick(params);

    }

  }

}