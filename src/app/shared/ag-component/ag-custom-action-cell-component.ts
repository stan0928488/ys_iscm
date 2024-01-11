import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";


@Component({
    selector: 'ag-custom-action-cell',
    template: `
        <button 
            *ngIf="!params.data.isEditing"
            [disabled]="!!this.componentParent.isRunFCP"
            [class]="{ updateButton:!!!this.componentParent.isRunFCP, disableButton:!!this.componentParent.isRunFCP, disableLeftButton:!!this.componentParent.isRunFCP}"
            (click)="params.edit(params)">
            編輯
        </button>
        <button 
            *ngIf="!params.data.isEditing"
            [disabled]="!!this.componentParent.isRunFCP"
            [class]="{ deleteButton:!!!this.componentParent.isRunFCP, disableButton:!!this.componentParent.isRunFCP}"
            nz-popconfirm
            nzPopconfirmTitle="確定刪除嗎?"
            (nzOnConfirm)="params.delete(params)">
            刪除
        </button>
        <button 
            *ngIf="params.data.isEditing"
            [disabled]="!!this.componentParent.isRunFCP"
            [class]="{ updateButton:!!!this.componentParent.isRunFCP, disableButton:!!this.componentParent.isRunFCP, disableLeftButton:!!this.componentParent.isRunFCP}"
            nz-popconfirm
            nzPopconfirmTitle="確定修改嗎?"
            (nzOnConfirm)="params.saveEdit(params)">
            確定
        </button>
        <button 
            *ngIf="params.data.isEditing"
            [disabled]="!!this.componentParent.isRunFCP"
            [class]="{ deleteButton:!!!this.componentParent.isRunFCP, disableButton:!!this.componentParent.isRunFCP}"
            (click)="params.cancelEdit(params)">
            取消
        </button>
      `,
    styleUrls: ['../../pages/RENDERER/BtnCellRenderer.component.scss'],
  })
  export class AGCustomActionCellComponent implements ICellRendererAngularComp {
   
    params : any;
    componentParent : any = {};
    
    agInit(params: ICellRendererParams<any, any>): void {
        this.params = params;
        // 獲取 PPSI202NonBarComponent 的 this
        if(!_.isNil(params.context)){
            this.componentParent = params.context.componentParent;
        }
    }

    refresh(params: ICellRendererParams<any, any>): boolean {
        return false;
    }


}