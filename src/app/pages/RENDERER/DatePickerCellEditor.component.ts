import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { ICellEditorParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'date-picker-cell-editor',
    template: `
        <nz-date-picker
            [(ngModel)]="dateValue" 
            (ngModelChange)="onChange($event)">
        </nz-date-picker>
    `,
  styles: [``],
})
export class DatePickerCellEditor implements ICellEditorAngularComp, AfterViewInit{

    private params!: ICellEditorParams;
    dateValue: Date;

    ngAfterViewInit(): void {
        //this.summaryDatePicker.open();
    }

    agInit(params: ICellEditorParams): void {
        
        this.params = params;
        if (this.params.value) {
            this.dateValue = this.params.value
        }

    }

    onChange(result: Date): void {

        if(_.isNil(result)) {
            return;
        }

        this.dateValue = result;
    }

    getValue() {

        if(_.isNil(this.dateValue)){
            return null;
        }else{
            return this.dateValue
        }
     
    }

}