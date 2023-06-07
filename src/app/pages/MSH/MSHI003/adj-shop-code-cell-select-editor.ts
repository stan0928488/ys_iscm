import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { AgEditorComponent } from "ag-grid-angular";
import { GridApi, ICellEditorParams } from "ag-grid-community";


@Component({
    selector: 'app-adj-shop-code-cell-select-editor',
    template: `
         <nz-select 
            #adjShopCodeCellSelect
            style="width: 100%; height: 100%;"
            nzPlaceHolder="請選擇站別"
            nzAllowClear
            [(ngModel)]="selectedShopCodeValue"
            (ngModelChange)="selected()">
            <nz-option nzValue="jack" nzLabel="Jack"></nz-option>
            <nz-option nzValue="lucy" nzLabel="Lucy"></nz-option>
            <nz-option nzValue="David" nzLabel="David"></nz-option>
        </nz-select>
        `,
  styles: [`

  `],
})
export class AdjShopCodeCellSelectEditorComponent implements AgEditorComponent, AfterViewInit{
  
    @ViewChild('adjShopCodeCellSelect', { static: true }) public adjShopCodeCellSelect;

    gridApi: GridApi;
    
    selectedShopCodeValue : string;

    ngAfterViewInit(): void {
        this.adjShopCodeCellSelect.nzOpen = true;
    }

    agInit(params: ICellEditorParams<any, any>): void {
       console.log('params--->', params);
       this.gridApi = params.api;
    }
   

    getValue() {
        return this.selectedShopCodeValue;
    }

    selected(){
        this.gridApi.stopEditing(false);
    }
    
}
    