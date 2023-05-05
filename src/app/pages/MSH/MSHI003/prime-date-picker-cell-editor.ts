import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from "@angular/core";
import { AgEditorComponent } from "ag-grid-angular";
import * as _ from "lodash";
import { DataTransferService } from "src/app/services/MSH/Data.transfer.service";

@Component({
    selector: 'app-prime-date-picker-cell-editor',
    template: `
        <p-calendar
            #primeDatePicker
            [(ngModel)]="value"
            [appendTo]="'body'"
            [style]="{ height: '100%', width: '100%' }"
            [inputStyle]="{ height: '100%', width: '100%' }"
            [monthNavigator]="true"
            [minDate]="minDate" 
            [maxDate]="maxDate"
            dateFormat="yy-mm-dd"
            [showButtonBar]="true"
            (onSelect)="onSelect($event)"
            (onClearClick)="onClearClick($event)">
        </p-calendar>
        `,
  styles: [``],
})
export class PrimeDatePickerCellEditorComponent implements AgEditorComponent, AfterViewInit{
    
    params: any;
    value: Date;
    date: Date;
    minDate: Date;
    maxDate: Date;

    @ViewChild('primeDatePicker', { static: true }) public primeDatePicker;

    constructor(private renderer2 : Renderer2,
                private changeDetectorRef : ChangeDetectorRef,
                private dataTransferService : DataTransferService) {

    }
    
    ngAfterViewInit(): void {
        this.primeDatePicker.toggle();
    }

    agInit(params: any): void {
        this.params = params;

        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        this.minDate = today;
        this.minDate.setMonth(month);
        this.minDate.setFullYear(year);
        this.maxDate = new Date();
        this.maxDate.setMonth(month);
        this.maxDate.setFullYear(year + 1);

        if (this.params.value) {
            const dateArray = this.params.value.split('-');
            const day = parseInt(dateArray[2]);
            const month = parseInt(dateArray[1]);
            const year = parseInt(dateArray[0]);
            this.value = new Date(year, month - 1, day);
        }
    }

    onSelect(event) {
        // 呼叫stopEditing傳入false表示保存資料到row中的調整日期欄位
        this.params.api.stopEditing(false);
        // 存放編輯過的row資料(需要發送到後端進行新增或更新)
        this.dataTransferService.setData(this.params.node);
    }

    onClearClick(event){
        this.value = null;
        this.params.api.stopEditing(false);
        // 存放編輯過的row資料(需要發送到後端進行更新)
        this.dataTransferService.setData(this.params.node);
    }

    getValue() {

        if(_.isNil(this.value))
        return null;

        const d = this.value;
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        //const hour = d.getHours().toString().padStart(2, '0');
        //const minute = d.getMinutes().toString().padStart(2, '0');
        //const second = d.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
   


}