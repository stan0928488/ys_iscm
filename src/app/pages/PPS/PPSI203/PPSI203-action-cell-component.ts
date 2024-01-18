import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";


@Component({
    selector: 'ppsi203-action-cell',
    template: `
        <button 
            class="updateButton"
            (click)="componentParent.openUpdate_dtlRow(params.data.id, params.data)">
            明細
        </button>
        <button 
            [disabled]="!!this.componentParent.isRunFCP"
            [class]="{ deleteButton:!!!this.componentParent.isRunFCP, disableButton:!!this.componentParent.isRunFCP}"
            nz-popconfirm
            nzPopconfirmTitle="確定刪除嗎?"
            (nzOnConfirm)="componentParent.delete_dtlRow(params.data.id)">
            刪除
        </button>
      `,
    styleUrls: ['../../RENDERER/BtnCellRenderer.component.scss'],
  })
  export class PPSI203ActionCellComponent implements ICellRendererAngularComp {
   
    params : any;
    componentParent : any;
    
    agInit(params: ICellRendererParams<any, any>): void {
        this.params = params;
        this.componentParent = params.context.componentParent;
    }

    refresh(params: ICellRendererParams<any, any>): boolean {
        return false;
    }


}