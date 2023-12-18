import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";



@Component({
    selector: 'ag-custom-action-cell',
    template: `
        <a 
            *ngIf="!params.data.isEditing"
            (click)="params.edit(params)">修改
        </a>
        <a
            *ngIf="!params.data.isEditing"
            nz-popconfirm
            nzPopconfirmTitle="確定刪除嗎?"
            (nzOnConfirm)="params.delete(params)">刪除
        </a>
        <a
            *ngIf="params.data.isEditing"
            nz-popconfirm
            nzPopconfirmTitle="確定修改嗎?"
            (nzOnConfirm)="params.saveEdit(params)">確認
        </a>
        <a 
            *ngIf="params.data.isEditing"
            (click)="params.cancelEdit(params)">取消
        </a>
      `
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