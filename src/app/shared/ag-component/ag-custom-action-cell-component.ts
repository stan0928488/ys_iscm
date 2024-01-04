import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";



@Component({
    selector: 'ag-custom-action-cell',
    template: `
        <button 
            *ngIf="!params.data.isEditing"
            nz-button 
            nzType="primary"
            (click)="params.edit(params)">
            編輯
        </button>
        <button 
            *ngIf="!params.data.isEditing"
            id="deleteBtn"
            nz-button 
            nzType="primary" 
            nzDanger
            nz-popconfirm
            nzPopconfirmTitle="確定刪除嗎?"
            (nzOnConfirm)="params.delete(params)">
            刪除
        </button>
        <button 
            *ngIf="params.data.isEditing"
            nz-button 
            nzType="primary"
            nz-popconfirm
            nzPopconfirmTitle="確定修改嗎?"
            (nzOnConfirm)="params.saveEdit(params)">
            確定
        </button>
        <button 
            *ngIf="params.data.isEditing"
            id="deleteBtn"
            nz-button 
            nzType="primary" 
            nzDanger
            (click)="params.cancelEdit(params)">
            取消
        </button>
      `,
     styles : [
        `
        #deleteBtn{
            margin-left: 10px;
        }
        
        `
    ]
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