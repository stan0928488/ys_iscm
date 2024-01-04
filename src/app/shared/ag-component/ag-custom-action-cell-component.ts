import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";



@Component({
    selector: 'ag-custom-action-cell',
    template: `
        <button 
            *ngIf="!params.data.isEditing"
            class="updateButton"
            (click)="params.edit(params)">
            編輯
        </button>
        <button 
            *ngIf="!params.data.isEditing"
            class="deleteButton"
            nz-popconfirm
            nzPopconfirmTitle="確定刪除嗎?"
            (nzOnConfirm)="params.delete(params)">
            刪除
        </button>
        <button 
            *ngIf="params.data.isEditing"
            class="updateButton"
            nz-popconfirm
            nzPopconfirmTitle="確定修改嗎?"
            (nzOnConfirm)="params.saveEdit(params)">
            確定
        </button>
        <button 
            *ngIf="params.data.isEditing"
            class="deleteButton" 
            (click)="params.cancelEdit(params)">
            取消
        </button>
      `,
    styleUrls: ['../../pages/RENDERER/BtnCellRenderer.component.scss'],
  })
  export class AGCustomActionCellComponent implements ICellRendererAngularComp {
   
    params : any;
    
    agInit(params: ICellRendererParams<any, any>): void {
        this.params = params;
    }

    refresh(params: ICellRendererParams<any, any>): boolean {
        return false;
    }


}