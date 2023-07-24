import { Component } from '@angular/core';
import {
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'datepicker-cell-renderer',
  templateUrl: './datepicker-cell-renderer.component.html',
  styleUrls: ['./datepicker-cell-renderer.component.css']
})
export class DatePickerCellRendererComponent implements ICellRendererAngularComp {


  params;
  data;
  isOpen = false;

  constructor(private changeDetector: ChangeDetectorRef) {}
  
  refresh(params?: any): boolean {
    return true;
  }

  agInit(params): void {
    this.params = params;
  }

  onbuttonClick($event) {

    if(this.params.data.data){
      this.data = JSON.stringify(JSON.parse(this.params.data.data),null,2);  
    }
    var actionParam = this.params[0];
    this.togglePopup();

    if (actionParam.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      actionParam.onClick(params);

    }

  }

  togglePopup() {
    this.isOpen = !this.isOpen;
  }

  handleOk(): void {
    this.isOpen = false;
  }

  handleCancel(): void {
    this.isOpen = false;
  }

}
