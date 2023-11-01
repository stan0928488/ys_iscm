import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
    selector: 'open-machine-component',
    template: `
        <button 
            nz-button 
            nzType="primary"
            nzShape="round"
            nzSize="small"
            (click)="componentParent.openMachineSorting(params.data.PLANSET_EDITION, params.data.SCH_SHOP_CODE)">
            明細
        </button>
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI210RefiningOpenMachineRendererComponent implements ICellRendererAngularComp {

    // PPSI210Component 的 this
    componentParent : any;
    params : any;

    constructor(){
    }

    agInit(params: ICellRendererParams<any, any>): void {

        this.params = params;

        // 獲取 PPSI210Component 的 this
        this.componentParent = params.context.componentParent;
    }

    refresh(params: ICellRendererParams<any, any>): boolean {
        return false;
    }
}