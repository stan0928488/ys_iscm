import { Component, EventEmitter } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'ppsi202-non-bar-edit-shutdown-type-cell-editor-component',
    template: `
         <nz-select 
            style=" margin-left:10px; margin-right:10px; width:120px;" 
            nzShowSearch  
            nzPlaceHolder="停機模式" 
            [(ngModel)]="params.data.shutdownModelType" >
            <nz-option nzValue="週保" nzLabel="週保"></nz-option>
            <nz-option nzValue="計畫性停機" nzLabel="計畫性停機"></nz-option>
            <nz-option nzValue="調機" nzLabel="調機"></nz-option>
            <nz-option nzValue="定修" nzLabel="定修"></nz-option>
        </nz-select> 
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI202_NonBarEditShutdownTypeCellEditorComponent implements ICellEditorAngularComp {

    // PPSI202NonBarComponent 的 this
    componentParent : any;
    params : any;

    constructor(){
    }

    agInit(params: ICellEditorParams): void {
        
        this.params = params;
        // 獲取 PPSI202NonBarComponent 的 this
        this.componentParent = params.context.componentParent; 
    }

    getValue() {
        return this.params.data.shutdownModelType
    }
}