import { Component } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
    selector: 'ppsi202-edit-end-time-cell-editor-component',
    template: `
        <nz-date-picker
            style="margin-left:4px;"
            nzShowTime
            nzFormat="yyyy-MM-dd HH:mm:ss"
            [(ngModel)]="params.data.END_TIME"
            nzPlaceHolder="停機結束時間"
            nz-tooltip
            [nzTooltipTitle]="params.data.shutdownEndtimeTooltipTitle"
            [nzDisabled]="params.data.disabledShutdownEndtime"
            [nzDisabledDate]="componentParent.disabledDate(params)"
            [nzDisabledTime]="componentParent.disabledEndTime(params)"
            (ngModelChange)="componentParent.holidayTimeEndChange(params)">
        </nz-date-picker>
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI202EditEndTimeCellEditorComponent implements ICellEditorAngularComp {

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

    endTimeChange(resultStartTime : Date){
        //this.params.api.stopEditing(false);
    }

    getValue() {
        return this.params.data.END_TIME;
    }
}