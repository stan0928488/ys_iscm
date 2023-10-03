import { Component, OnDestroy } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';


import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'btn-cell-renderer',
  template: ` 

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

    <!--   disabled="{{ !isCanSave() }}"  -->

    <!-- <button (click)="btnClickedHandler($event)">Click me!</button> -->
  `,
  styleUrls: ['./pomp001.component.scss'],
})
export class Pomp001ActionBtnCellRenderer implements ICellRendererAngularComp {
  private params: any;

  agInit(params: any): void {
    this.params = params;
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
