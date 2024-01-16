import { Component, EventEmitter } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'ppsi111-edit-machine-cell-editor-component',
    template: `
         <nz-select 
            style=" margin-left:10px; margin-right:10px; width:100px;" 
            nzShowSearch
            [nzAllowClear]="true"
            nzPlaceHolder="機台" 
            [(ngModel)]="params.data.MACHINE">
            <nz-option *ngFor="let machine of componentParent.MachineList; let i = index" [nzLabel]="machine" [nzValue]="machine">
            </nz-option>
        </nz-select> 
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI111EditMachineCellEditorComponent implements ICellEditorAngularComp {

    // PPSI202NonBarComponent 的 this
    componentParent : any;
    params : any;

    constructor(){
    }

    async agInit(params: ICellEditorParams): Promise<void> {

        this.params = params;

        // 獲取 PPSI202NonBarComponent 的 this
        this.componentParent = params.context.componentParent;

        // 獲取該站別對應的機台
        await this.componentParent.getPickerMachineData(params.data.SCH_SHOP_CODE_1, this.params.data.id);
    }

    getValue() {
        return this.params.data.MACHINE
    }
}