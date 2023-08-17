import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellRendererParams } from "ag-grid-community";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
    selector: 'ppsi202-non-bar-edit-button-renderer-component',
    template: `
        <button
            *ngIf="!params.data.hasEdit"
            nz-button 
            nzType="primary"
            nzShape="round"
            nzSize="small"
            (click)="componentParent.editRow(params)">
            編輯
        </button>
        <button
            *ngIf="!params.data.hasEdit"
            style="margin-left:10px;"
            nz-button 
            nzType="primary"
            nzShape="round"
            nzSize="small"
            (click)="componentParent.deleteRow(params)">
            刪除
        </button>
        <button
            *ngIf="params.data.hasEdit"
            nz-button 
            nzType="primary"
            nzShape="round"
            nzSize="small"
            (click)="componentParent.editSave(params)">
            確定
        </button>
        <button
            *ngIf="params.data.hasEdit"
            nz-button
            style="margin-left:10px;"
            nzType="primary"
            nzShape="round"
            nzSize="small"
            (click)="componentParent.cancalEditRow(params)">
            取消
        </button>
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI202_NonBarEditButtonRendererComponent implements ICellRendererAngularComp {

    // PPSI210Component 的 this
    componentParent : any;
    params : any;

    constructor(){
    }

    agInit(params: ICellRendererParams<any, any>): void {

        this.params = params;
        // 獲取 PPSI202NonBarComponent 的 this
        this.componentParent = params.context.componentParent;
    }

    refresh(params: ICellRendererParams<any, any>): boolean {
        return false;
    }
}