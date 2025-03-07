import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { AgEditorComponent } from "ag-grid-angular";
import { ColDef, GridApi, ICellEditorParams, IRowNode } from "ag-grid-community";
import { MSHI003 } from "./MSHI003.model";
import { DataTransferService } from "src/app/services/MSH/Data.transfer.service";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: 'app-adj-shop-code-cell-select-editor',
    template: `
         <nz-select 
            #adjShopCodeCellSelect
            style="width: 100%; height: 100%;"
            nzPlaceHolder="請選擇站別"
            [nzOpen]="true"
            [nzAllowClear]="true"
            [nzShowSearch]="true"
            [(ngModel)]="selectedShopCodeValue"
            (ngModelChange)="selected()">
            <nz-option *ngFor="let shopCode of componentParent.shopCodeByIdNoOfOption" [nzLabel]="shopCode" [nzValue]="shopCode"></nz-option>
            <nz-option *ngIf="componentParent.shopCodeByIdNoLoading" nzDisabled nzCustomContent>
                <span nz-icon nzType="loading" class="loading-icon"></span>
                站別清單載入中...
            </nz-option>
        </nz-select>
        `,
  styles: [`

  `],
 providers:[NzMessageService]
})
export class AdjShopCodeCellSelectEditorComponent implements AgEditorComponent, AfterViewInit{
  
    @ViewChild('adjShopCodeCellSelect', { static: true }) public adjShopCodeCellSelect;

    gridApi: GridApi;
    selectedShopCodeValue : string;

    // MSHI003Component 的 this
    componentParent : any;

    // 當前選中的那一個row的資料物件
    currentRowNode : IRowNode<MSHI003>;

    params: ICellEditorParams<any, any>;

    constructor(private dataTransferService : DataTransferService,
                private message:NzMessageService,
                private changeDetectorRef: ChangeDetectorRef){} 

    ngAfterViewInit(): void {
        //this.adjShopCodeCellSelect.nzOpen = true;
    }

    async agInit(params: ICellEditorParams<any, any>): Promise<void> {
       // 獲取 MSHI003Component 的 this
       this.componentParent = params.context.componentParent;

       // 獲取 ag-grid 的 Api
       this.gridApi = params.api;

       this.params = params;

       // 將當前調整站別的值設定給<nz-select>雙向綁定的變數 
       this.selectedShopCodeValue = params.value;

       // 當前選中的那一個row的資料物件
       this.currentRowNode = params.node;

       // 調整站別為當前從Oracle查出來的站別
       this.getAdjShopCode(this.currentRowNode);

       
    }

    getAdjShopCode(currentRowNode : IRowNode<MSHI003>){
        this.componentParent.shopCodeByIdNoLoading = true;
        this.componentParent.shopCodeByIdNoOfOption = [currentRowNode.data.shopCode];
        this.componentParent.shopCodeByIdNoLoading = false;

    }

    isPopup(): boolean {
        return false; 
    }
   
    getValue() {
        return this.selectedShopCodeValue;
    }

    selected(){

        this.currentRowNode.data.adjLineupProcess = null;

        // 停止編輯，讓調整站別資料賦值到該row對應的物件上，並渲染畫面
        this.gridApi.stopEditing();
        
        // 送出該筆資料進行過站狀態與EPST的實時抓取
        this.dataTransferService.setParamsOfAdjShopCodeAndAdjLineupProcess(this.currentRowNode);

    }
}
    