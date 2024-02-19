import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
    selector: 'common-api-edit',
    template: `
        <button
            style="margin-right:10px"
            nz-button
            [disabled]="params.data.menuType!=='A'"
            nzType="primary"
            nzShape="round"
            nzSize="small"
            (click)="componentParent.commonApiEditOpen(params.data)">
            編輯
        </button>
        <button 
            nz-button
            [disabled]="params.data.menuType!=='A'"
            nzType="primary" 
            nzShape="round"
            nzSize="small"
            (click)="componentParent.deleteCommonApi(params.data)">
            刪除
        </button>
    `,
    styles :[ `
        :host ::ng-deep .ant-btn-primary[disabled="true"]{
            border-color: inherit ;
            background: inherit ;
        }
    `]
  })
export class CommonApiEditComponent implements ICellRendererAngularComp {
   
    params : any;
    componentParent : any;

    agInit(params: ICellRendererParams<any, any>): void {
        // 獲取 ManageMenuComponent 的 this
        this.componentParent = params.context.componentParent;
        this.params = params;
    }

    refresh(params: ICellRendererParams<any, any>): boolean {
        return false;
    }

}
