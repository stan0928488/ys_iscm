import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";



@Component({
    selector: 'manage-role-action-cell',
    template: `
        <button 
            nz-button 
            nzType="primary"
            nzShape="round"
            nzSize="small"
            (click)="params.menuPermissionsManage(params.data)">
            菜單權限
        </button>
      `
  })
export class ManageRoleActionCellComponent implements ICellRendererAngularComp {
   
    params : any;
    
    agInit(params: ICellRendererParams<any, any>): void {
        this.params = params;
    }

    refresh(params: ICellRendererParams<any, any>): boolean {
        return false;
    }


}