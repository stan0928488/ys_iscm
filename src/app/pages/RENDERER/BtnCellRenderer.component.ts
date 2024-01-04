// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
    <button class="updateButton" *ngIf="isNew == false" (click)="editOnClick($event)">編輯</button>
    <button class="updateButton" *ngIf="isNew == true" (click)="updateOnClick($event)">保存</button>
    <button class="deleteButton" *ngIf="isNew == false" (click)="deleteOnClick($event)">刪除</button>
    <button class="deleteButton" *ngIf="isNew == true" (click)="calcelOnClick($event)">取消</button>
    `,
    styleUrls: ['./BtnCellRenderer.component.scss']
})

export class BtnCellRenderer implements ICellRendererAngularComp {

  params;
  isNew = false;

  agInit(params): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }

  editOnClick($event) {

    var actionParam = this.params[0];

    this.isNew = true;
    if (actionParam.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data,
        params:this.params
      }
      actionParam.onClick(params);

    }

  }

  updateOnClick($event) {

    var actionParam = this.params[1];
    this.params.api.stopEditing();

    if (actionParam.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data,
      }
      actionParam.onClick(params);

    }

  }

  calcelOnClick($event) {
    
    var actionParam = this.params[2];
    this.params.api.stopEditing(true);

    this.isNew = false;
    if (actionParam.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      actionParam.onClick(params);

    }

  }

  deleteOnClick($event) {
    
    var actionParam = this.params[3];

    this.isNew = true;
    if (actionParam.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      actionParam.onClick(params);

    }

  }

}