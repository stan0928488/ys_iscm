import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
    selector: 'open-sort-component',
    template: `
        <button 
            nz-button 
            nzType="primary"
            nzShape="round"
            (click)="componentParent.openSorting(params.data.SEQNO)">
            明細
        </button>
        <button 
            id="deleteBtn"
            nz-button 
            nzType="primary" 
            nzShape="round"
            nzDanger
            (click)="deletePlot()">
            刪除
        </button>
    `,
     styles : [
        `
        #deleteBtn{
            margin-left: 10px;
        }
        
        `
    ]
})
export class OpenSortRendererComponent implements ICellRendererAngularComp {

    // PPSI210Component 的 this
    componentParent : any;
    params : any;

    constructor(private Modal: NzModalService,){

    }

    agInit(params: ICellRendererParams<any, any>): void {

        this.params = params;

        // 獲取 PPSI210Component 的 this
        this.componentParent = params.context.componentParent;
    }


    refresh(params: ICellRendererParams<any, any>): boolean {
        return false;
    }

    deletePlot() {

        this.Modal.confirm({
            nzTitle: `確定刪除該策略〈${this.params.data.SETNAME}〉?`,
            nzOkText: '確定',
            nzCancelText: '取消',
            nzOnOk: async () => {
                await this.componentParent.deletePlot(this.params.data, this.params.rowIndex);
            },
            nzOnCancel: () => {
                console.log("取消刪除策略");
            }
        }); 
    }

}