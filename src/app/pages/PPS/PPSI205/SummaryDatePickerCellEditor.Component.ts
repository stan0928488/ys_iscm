import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { ICellEditorParams } from "ag-grid-community";
import * as _ from "lodash";

@Component({
    selector: 'summary-date-picker-cell-editor',
    template: `
        <nz-date-picker
            #summaryDatePicker
            [(ngModel)]="dateValue" 
            (ngModelChange)="onChange($event)">
        </nz-date-picker>
    `,
  styles: [``],
})
export class SummaryDatePickerCellEditorComponent implements ICellEditorAngularComp, AfterViewInit{

    private params!: ICellEditorParams;
    dateValue: Date;

    @ViewChild('summaryDatePicker', { static: true }) public summaryDatePicker;

    ngAfterViewInit(): void {
        //this.summaryDatePicker.open();
    }

    agInit(params: ICellEditorParams): void {
        this.params = params;

        if (this.params.value) {
            const dateArray = this.params.value.split('-');
            if(dateArray.length > 2){
                const day = parseInt(dateArray[2]);
                const month = parseInt(dateArray[1]);
                const year = parseInt(dateArray[0]);
                this.dateValue = new Date(year, month-1, day);
            }else{
                const month = parseInt(dateArray[1]);
                const year = parseInt(dateArray[0]);
                this.dateValue = new Date(year, month-1);
            }

        }

    }

    onChange(result: Date): void {

        if(_.isNil(result)) {
            return;
        }

        // 呼叫stopEditing傳入false表示保存資料到row中的調整日期欄位
        this.params.api.stopEditing(false);
        this.dateValue = result;
    }

    getValue() {

        if(_.isNil(this.dateValue))
        return null;

        const dateArray = this.params.value.split('-');
        if(dateArray.length > 2){
            const d = this.dateValue;
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        else{
            const d = this.dateValue;
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            return `${year}-${month}`;
        }
     
    }

}