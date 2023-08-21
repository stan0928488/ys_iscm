import { Component, EventEmitter } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'ppsi202-non-bar-edit-shop-cell-editor-component',
    template: `
         <nz-select 
            style=" margin-left:10px; margin-right:10px; width:100px;" 
            nzShowSearch  
            nzPlaceHolder="站別" 
            [(ngModel)]="params.data.shopCode" 
            (ngModelChange)="shopSelectChange($event)"
            (nzOpenChange)="shopOpenChange()">
            <nz-option *ngFor="let shop of componentParent.shopListForEdit ;let i = index" [nzLabel]="shop" [nzValue]="shop">
            <nz-option *ngIf="componentParent.isLoading" nzDisabled nzCustomContent>
                <span nz-icon nzType="loading" class="loading-icon"></span>
                站別載入中...
            </nz-option>
            </nz-option>
        </nz-select> 
    `,
     styles : [
        `
        
        `
    ]
})
export class PPSI202_NonBarEditShopCellEditorComponent implements ICellEditorAngularComp {

    // PPSI202NonBarComponent 的 this
    componentParent : any;
    params : any;

    constructor(){
    }

    async agInit(params: ICellEditorParams): Promise<void> {

        this.params = params;

        // 獲取 PPSI202NonBarComponent 的 this
        this.componentParent = params.context.componentParent;

        // 獲取該站別
        await this.componentParent.getShopOptionList(true)

        // 獲取該站別對應的機台
        await this.componentParent.getEquipsByShopsForEditHandler(this.params, params.data.shopCode);
    }

    shopSelectChange(value : string){
        
        this.componentParent.getEquipsByShopsForEditHandler(this.params, value);
        this.params.data.equipCode = null;
    }

    shopOpenChange(){

    }

    getValue() {
        return this.params.data.shopCode
    }
}