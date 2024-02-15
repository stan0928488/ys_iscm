import { Component } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import {  ICellEditorParams } from "ag-grid-community";
import * as _ from "lodash";
import { NzModalService } from "ng-zorro-antd/modal";
import { firstValueFrom } from "rxjs";
import { CommonService } from "src/app/services/common/common.service";

@Component({
    selector: 'orpi001-customer-name-cell-editor.component',
    template: `
       <nz-select 
          nzPlaceHolder="請選擇客戶名稱" 
          style="width:90%; left:50%; transform:translate(-50%, 0%);" 
          [(ngModel)]="params.data.customerName" (ngModelChange)="customerChange()" 
          nzAllowClear 
          nzShowSearch>
          <nz-option *ngFor="let customerName of customerNameList" [nzLabel]="customerName" [nzValue]="customerName"></nz-option>
      </nz-select>
    `,
     styles : [
        `
        
        `
    ]
})
export class ORPI001CustomerNameCellEditorComponent implements ICellEditorAngularComp {
    
    params : any;
    customerList : any[] = [];
    customerNameList : any[] = [];
    isCustomerListLoading = false;

    constructor(){
    }

    async agInit(params: ICellEditorParams): Promise<void> {
        this.params = params;
        this.customerList = await this.params.customerList;
        this.customerNameList = await this.params.customerNameList;
    }

    getValue() {
        return this.params.data.customerName;
    }

    customerChange(){

        if(_.isNil(this.params.data.customerName)){
            this.params.data.customerNo = null;
        }
        else{
            this.params.data.customerNo = this.customerList.find(item => item.custAbbreviations === this.params.data.customerName).custNo;
        }
    }
}