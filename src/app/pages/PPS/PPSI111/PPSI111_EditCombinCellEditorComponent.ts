import { Component, EventEmitter } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'ppsi111-edit-combin-cell-editor-component',
    template: `
         <nz-select 
            style="margin-left:10px; margin-right:10px; width:200px;" 
            nzShowSearch  
            nzPlaceHolder="combin條件" 
            [(ngModel)]="params.data.COLUMN_NAME">
            <nz-option *ngFor="let combin of componentParent.COLUMN_NAMEList; let i = index" [nzLabel]="combin.label" [nzValue]="combin.value">
            <nz-option *ngIf="componentParent.combinListLoading;" nzDisabled nzCustomContent>
                <span nz-icon nzType="loading" class="loading-icon"></span>
                載入中...
            </nz-option>
            </nz-option>
        </nz-select> 
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI111EditCombinCellEditorComponent implements ICellEditorAngularComp {

    // PPSI202NonBarComponent 的 this
    componentParent : any;
    params : any;

    constructor(){
    }

    async agInit(params: ICellEditorParams): Promise<void> {

        this.params = params;

        // 獲取 PPSI202NonBarComponent 的 this
        this.componentParent = params.context.componentParent;

        // 獲取combin條件	
        await this.componentParent.getRequierList();
    }

    getValue() {
        return this.params.data.COLUMN_NAME
    }
}