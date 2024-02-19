import { AfterViewInit, Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';
import * as _ from "lodash";

@Component({
  selector: 'app-number-cell-editor',
  template: `
      <nz-input-number
          style="width:99%"
          [(ngModel)]="dateValue">
      </nz-input-number>
  `,
  styles: [``],
})
export class NumberCellEditorComponent implements ICellEditorAngularComp, AfterViewInit {

  private params!: ICellEditorParams;
  dateValue: number;

  ngAfterViewInit(): void {
    //this.summaryDatePicker.open();
  }

  agInit(params: ICellEditorParams): void {

    this.params = params;
    if (this.params.value) {
      this.dateValue = this.params.value
    }

  }

  getValue() {

    if (_.isNil(this.dateValue)) {
      return null;
    } else {
      return this.dateValue
    }

  }

}