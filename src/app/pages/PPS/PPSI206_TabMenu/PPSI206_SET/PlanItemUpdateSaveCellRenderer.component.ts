// Author: T4professor

import { ChangeDetectorRef, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-plan-item-update-save-cell-renderer',
  template: `
  <button *ngIf="!this.params.data.isEditing"  nz-button nzType="default" (click)="editOnClick($event)">編輯</button>
  <button *ngIf="this.params.data.isEditing"  nz-button nzType="default" (click)="updateOnClick($event)">保存</button>
  <button style="margin-left:10px" *ngIf="this.params.data.isEditing"  nz-button nzType="default" (click)="calcelOnClick($event)">取消</button>
    `
})

export class  PlanItemUpdateSaveCellRenderer implements ICellRendererAngularComp {

  params : ICellRendererParams<any, any>;
  isEditing = false;
  componentParent : any;

  constructor(private changeDetectorRef: ChangeDetectorRef){

  }

  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
    // 獲取 PPSI205 的 this
    this.componentParent = params.context.componentParent;
  }

  refresh(params?: any): boolean {
    return false;
  }
  
  // 編輯
  editOnClick(event) {

    this.params.data.isEditing = true;
    
    // 使用ag-grid提供的api開啟整行進入編輯狀態
    // colKey設定進入編輯狀態後焦點要是哪個cloumn，
    // 但一定要帶值，且帶的該欄位是要可編輯的
    this.params.api.startEditingCell({
      rowIndex : this.params.rowIndex,
      colKey : 'dateDeliveryPp' 
    });
  }

  // 更新保存
  updateOnClick(event) {

    var actionParam = this.params[1];
    this.params.api.stopEditing();

    if (actionParam.onClick instanceof Function) {
      const params = {
        event: event,
        rowData: this.params.node.data,
        index:this.params.node.id
      }
      console.log(params);
      actionParam.onClick(params);

    }

  }

  // 取消
  calcelOnClick(event) {
    this.params.data.isEditing = false;

    var actionParam = this.params[2];
    this.params.api.stopEditing(true);

    if (actionParam.onClick instanceof Function) {
      const params = {
        event: event,
        rowData: this.params.node.data,
        index:this.params.node.id
      }
      actionParam.onClick(params);

    }

  }

}