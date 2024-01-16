import { Component, EventEmitter } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'ppsi202-edit-shop-cell-editor-component',
    template: `
         <nz-select 
            style=" margin-left:10px; margin-right:10px; width:100px;" 
            nzShowSearch  
            nzPlaceHolder="站別" 
            [(ngModel)]="params.data.SCH_SHOP_CODE" 
            (ngModelChange)="shopSelectChange($event)"
            (nzOpenChange)="shopOpenChange()">
            <nz-option *ngFor="let shop of componentParent.shopListForEdit ;let i = index" [nzLabel]="shop.value" [nzValue]="shop.value">
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
export class PPSI202EditShopCellEditorComponent implements ICellEditorAngularComp {

    // PPSI202NonBarComponent 的 this
    componentParent : any;
    params : any;

    constructor(){
    }

    agInit(params: ICellEditorParams): void {

        this.params = params;

        // 獲取 PPSI202NonBarComponent 的 this
        this.componentParent = params.context.componentParent;

        // 獲取該站別
        this.componentParent.getSHOP_CODEList(true)

        // 獲取該站別對應的機台
        this.componentParent.getEQUIP_CODEList([params.data.SCH_SHOP_CODE], true, this.params.data);
    }

    shopSelectChange(value : string){
        this.componentParent.getEQUIP_CODEList([value], true, this.params.data);
        this.params.data.EQUIP_CODE = null;
    }

    shopOpenChange(){

    }

    getValue() {
        return this.params.data.SCH_SHOP_CODE
    }
}