import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-custom-header',
  template: `
    <div>
      <div style="margin-right: 10px;">Custom Button:</div>
      <button (click)="handleClick()">Click Me</button>
    </div>
  `,
})
export class PPSCustomHeaderComponent {
  @Input() column: ColDef;
  @Output() messageEvent = new EventEmitter<string>();

  handleClick() {
    if (this.column) {
      const message = `您点击了自定义按钮！当前列为：${this.column.headerName}`;
      this.messageEvent.emit(message);
    } else {
      const message = '没有找到当前列信息';
      this.messageEvent.emit(message);
    }
  }
}