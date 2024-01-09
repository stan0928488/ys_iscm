import { Component, EventEmitter } from "@angular/core";
import { ICellEditorAngularComp, ICellRendererAngularComp } from "ag-grid-angular";
import { GridApi, ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'ppsi111-edit-shop-cell-editor-component',
    template: `
         <nz-select 
            style=" margin-left:10px; margin-right:10px; width:100px;" 
            nzShowSearch  
            nzPlaceHolder="站別" 
            [(ngModel)]="params.data.SCH_SHOP_CODE_1" 
            (ngModelChange)="shopSelectChange($event)"
            (nzOpenChange)="shopOpenChange()">
            <nz-option *ngFor="let shop of componentParent.ShopList; let i = index" [nzLabel]="shop" [nzValue]="shop">
            <nz-option *ngIf="componentParent.shopListLoading" nzDisabled nzCustomContent>
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
export class PPSI111EditShopCellEditorComponent implements ICellEditorAngularComp {

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
        await this.componentParent.getPickerShopData(this.params.data.id)

        // 獲取該站別對應的機台
        await this.componentParent.getPickerMachineData(params.data.SCH_SHOP_CODE_1, this.params.data.id);
    }

    shopSelectChange(value : string){
        
        this.componentParent.getPickerMachineData(value, this.params.data.id);
        this.params.data.MACHINE = null;
    }

    shopOpenChange(){

    }

    getValue() {
        return this.params.data.SCH_SHOP_CODE_1
    }
}