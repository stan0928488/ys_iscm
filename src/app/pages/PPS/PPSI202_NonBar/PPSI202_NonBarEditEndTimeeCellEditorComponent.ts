import { Component } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
    selector: 'ppsi202-non-bar-edit-end-time-cell-editor-component',
    template: `
       <nz-time-picker 
            style="margin-left:10px; margin-right:10px;"
            nz-tooltip 
            [nzTooltipTitle]="params.data.shutdownEndtimeTooltipTitle"
            [(ngModel)]="params.data.endTime" 
            nzPlaceHolder="休假時間(迄)"
            [nzNowText]="'Now'"
            [nzOkText]="'確認'"
            [nzDisabled]="params.data.disabledShutdownEndtime"
            [nzDisabledHours]="componentParent.disabledHours(params)"
            [nzDisabledMinutes]="componentParent.disabledMinutes(params)"
            [nzDisabledSeconds]="componentParent.disabledSeconds(params)"
            (ngModelChange)="componentParent.holidayTimeEndChange(params)">
        </nz-time-picker>
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI202_NonBarEditEndTimeCellEditorComponent implements ICellEditorAngularComp {

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
        return this.params.data.endTime;
    }
}