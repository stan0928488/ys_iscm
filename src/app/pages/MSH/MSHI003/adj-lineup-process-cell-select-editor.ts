import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { AgEditorComponent } from "ag-grid-angular";
import { GridApi, ICellEditorParams } from "ag-grid-community";
import { MSHI003 } from "./MSHI003.model";
import { DataTransferService } from "src/app/services/MSH/Data.transfer.service";


@Component({
    selector: 'app-adj-lineup-process-cell-select-editor',
    template: `
         <nz-select 
            #adjLineupProcessCellSelect
            style="width: 100%; height: 100%;"
            nzPlaceHolder="請選擇流程"
            [nzOpen]="true"
            [nzAllowClear]="true"
            [nzShowSearch]="true"
            [(ngModel)]="selectedLineupProcessValue"
            (ngModelChange)="selected()">
            <nz-option *ngFor="let lineupProcess of componentParent.lineupProcessOfOptions" [nzLabel]="lineupProcess" [nzValue]="lineupProcess"></nz-option>
            <nz-option *ngIf="componentParent.lineupProcessLoading" nzDisabled nzCustomContent>
                <span nz-icon nzType="loading" class="loading-icon"></span>
                流程清單載入中...
            </nz-option>
        </nz-select>
        `,
  styles: [`

  `],
})
export class AdjLineupProcessSelectEditorComponent implements AgEditorComponent, AfterViewInit{
  
    @ViewChild('adjLineupProcessCellSelect', { static: true }) public adjLineupProcessCellSelect;

    gridApi: GridApi;
    selectedLineupProcessValue : string;

    // MSHI003Component 的 this
    componentParent : any;

    // 當前選中的那一個row的資料物件
    currentRowNode : any;

    constructor(private dataTransferService : DataTransferService){}

    ngAfterViewInit(): void {
        //this.adjShopCodeCellSelect.nzOpen = true;
    }

    agInit(params: ICellEditorParams<any, any>): void {
       // 獲取 MSHI003Component 的 this
       this.componentParent = params.context.componentParent;

       // 獲取 ag-grid 的 Api
       this.gridApi = params.api;

       // 將當前調整站別的值設定給<nz-select>雙向綁定的變數 
       this.selectedLineupProcessValue = params.value;

       // 調用 MSHI003Component 的方法撈取站別清單
       this.componentParent.getLineupProcessAsync();

       // 當前選中的那一個row的資料物件
       this.currentRowNode = params.node;
    }

    isPopup(): boolean {
        return false; 
    }
   
    getValue() {
        return this.selectedLineupProcessValue;
    }

    selected(){

        // 停止編輯，讓調整流程資料賦值到該row對應的物件上，並渲染畫面
        this.gridApi.stopEditing();

        // 送出該筆資料進行過站狀態與EPST的實時抓取
        this.dataTransferService.setParamsOfAdjShopCodeAndAdjLineupProcess(this.currentRowNode);
       
    }


    
}
    