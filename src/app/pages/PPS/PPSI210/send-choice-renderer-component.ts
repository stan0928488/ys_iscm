import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams, Logger } from "ag-grid-community";

@Component({
    selector: 'send-choice-component',
    template: `
        <label 
            nz-radio
            [(ngModel)]="params.data.selectedRadioValue"
            (ngModelChange)="sendChoiceHandler()">
        </label>
    `,
     styles : [
        `
        `
    ]
})
export class SendChoiceRendererComponent implements ICellRendererAngularComp {

    // PPSI210Component 的 this
    componentParent : any;
    params:any;

    agInit(params: ICellRendererParams<any, any>): void {

        this.params = params;

        // 獲取 PPSI210Component 的 this
        this.componentParent = params.context.componentParent;
        
    }


    refresh(params: ICellRendererParams<any, any>): boolean {
        return false;
    }

    sendChoiceHandler(){
        
        this.componentParent.planSetDataList.forEach(item =>{
            item.selectedRadioValue = false;
        });
        this.params.data.selectedRadioValue = true;

        // 呼叫PPSI210Component的方法
        this.componentParent.sendchoice(this.params.data);
    }

}