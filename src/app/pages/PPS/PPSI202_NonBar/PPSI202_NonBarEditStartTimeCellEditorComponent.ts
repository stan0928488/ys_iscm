import { Component } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'ppsi202-non-bar-edit-start-time-cell-editor-component',
    template: `
        <nz-time-picker 
            style="margin-left:10px; margin-right:10px;"
            [(ngModel)]="params.data.startTime" 
            nzPlaceHolder="停機時間(起)"
            [nzNowText]="'Now'"
            [nzOkText]="'確認'"
            (ngModelChange)="componentParent.holidayTimeStartChange(params)">
        </nz-time-picker>
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI202_NonBarEditStartTimeCellEditorComponent implements ICellEditorAngularComp {

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

    startTimeChange(resultStartTime : Date){
        //this.params.api.stopEditing(false);
    }

    getValue() {
        return this.params.data.startTime;
    }
}