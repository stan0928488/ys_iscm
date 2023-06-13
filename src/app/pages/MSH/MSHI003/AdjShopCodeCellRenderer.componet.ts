import { ICellRendererParams } from "ag-grid-community";
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'app-adj-shop-code-renderer',
    template: `<div class="cellSelect">{{ value }} </div>`,
    styles : [`

    `]
  })
export class AdjShopCodeCellRendererComponent implements ICellRendererAngularComp{

    value : string;

    agInit(params: ICellRendererParams): void {
        this.value = params.value;
    }

    refresh(params: ICellRendererParams): boolean {
        return false;
    }

}