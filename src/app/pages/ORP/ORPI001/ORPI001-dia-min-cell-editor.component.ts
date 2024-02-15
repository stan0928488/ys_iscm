import { Component } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'orpi001-dia-min-cell-editor.component',
    template: `
        <nz-input-number 
            style="width:100px; height:29px; left:50%; transform:translate(-50%, 0%);"
            [(ngModel)]="params.data.saleOrderDiaMin" 
            [nzPrecision]="2" 
            [nzMin]="0.01" 
            [nzMax]="9999.99" 
            [nzStep]="1">
        </nz-input-number> 
    `,
     styles : [
        `
        
        `
    ]
})
export class ORPI001DiaMinCellEditorComponent implements ICellEditorAngularComp {
    
    params : any;

    constructor(){
    }

    agInit(params: ICellEditorParams): void {
        this.params = params;
    }

    getValue() {
        return this.params.data.saleOrderDiaMin;
    }
}