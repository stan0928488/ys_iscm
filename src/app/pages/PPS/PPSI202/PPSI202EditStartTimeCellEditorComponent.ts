import { Component } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'ppsi202-edit-start-time-cell-editor-component',
    template: `
        <nz-date-picker
            style="margin-left:4px;"
            nzShowTime
            nzFormat="yyyy-MM-dd HH:mm:ss"
            [(ngModel)]="params.data.START_TIME"
            nzPlaceHolder="停機開始時間"
            (ngModelChange)="componentParent.startTimeStartChange(params)">
        </nz-date-picker>
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI202EditStartTimeCellEditorComponent implements ICellEditorAngularComp {

    // PPSI202NonBarComponent 的 this
    componentParent : any;
    params : any;

    constructor(){
    }

    agInit(params: ICellEditorParams): void {
        this.params = params;
        this.componentParent = params.context.componentParent;
    }

    startTimeChange(resultStartTime : Date){
        //this.params.api.stopEditing(false);
    }

    getValue() {
        return this.params.data.START_TIME;
    }
}