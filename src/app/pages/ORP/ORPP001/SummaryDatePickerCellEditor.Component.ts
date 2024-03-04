import { AfterViewInit, Component, ViewChild,NgModule } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { ICellEditorParams } from "ag-grid-community";
import * as _ from "lodash";
import * as moment from "moment";
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'summary-date-picker-cell-editor',
    standalone: true,
    imports: [NzDatePickerModule,CommonModule,FormsModule],
    template: `
        <nz-date-picker
            #summaryDatePicker
            [(ngModel)]="dateValue" 
            (ngModelChange)="onChange($event)"
            >
        </nz-date-picker>
    `,
  styles: [``],
})
export class SummaryDatePickerCellEditorComponent implements ICellEditorAngularComp, AfterViewInit{

    private params!: ICellEditorParams|undefined;
    dateValue!: Date;

    @ViewChild('summaryDatePicker', { static: true }) public summaryDatePicker;

    ngAfterViewInit(): void {
        this.summaryDatePicker.open();
    }

    agInit(params: ICellEditorParams): void {
        this.params = params;
    }

    onChange(result: Date): void {

        if(_.isNil(result)) {
            return;
        }

        this.params.stopEditing(false);// 一有更動值，馬上關閉編輯
        this.dateValue = result;
    }

    getValue() {
        if(_.isNil(this.dateValue)){
            return null;
        }
        
        return moment(this.dateValue).format('YYYY-MM-DD');
    }

}