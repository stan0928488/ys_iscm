import { Component, EventEmitter } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'ppsi202-non-bar-edit-equip-cell-editor-component',
    template: `
         <nz-select 
            style=" margin-left:10px; margin-right:10px; width:100px;" 
            nzShowSearch  
            nzPlaceHolder="機台" 
            [(ngModel)]="params.data.equipCode" 
            (ngModelChange)="equipSelectChange($event)"
            (nzOpenChange)="equipOpenChange()">
            <nz-option *ngFor="let equipObj of params.data.equipOptionList ;let i = index" [nzLabel]="equipObj.equip" [nzValue]="equipObj.equip"></nz-option>
            <nz-option *ngIf="componentParent.isLoading" nzDisabled nzCustomContent>
                <span nz-icon nzType="loading" class="loading-icon"></span>
                機台載入中...
        </nz-option>
        </nz-select> 
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI202_NonBarEditEquipCellEditorComponent implements ICellEditorAngularComp {

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

    equipSelectChange(value : EventEmitter<any[]>){
        //this.params.api.stopEditing(false);
    }

    equipOpenChange(){
        
    }

    getValue() {
        return this.params.data.equipCode
    }
}