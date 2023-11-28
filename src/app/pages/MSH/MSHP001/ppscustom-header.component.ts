import { Component , Input} from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { ColumnPinnedType, IFilter, IHeaderParams,ITextFilterParams ,IFilterComp,TextFilterModel} from 'ag-grid-community';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map } from 'lodash';
import { AgCustomHeaderParams } from 'src/app/shared/ag-component/custom-header-params';

@Component({
  selector: 'custom-header',
  template: `
    <div class="custom-header">
      <span>{{ params.displayName }}</span>
      <span style='margin-left:5px;'   [ngClass]="{ 'active': !isLock }" nz-icon nzType="lock" nzTheme="outline" (click)='handleLockClick()'   ></span>
      <!-- <button style='margin-left:5px;'  nz-button nzType="primary"   [nzPopoverContent]="contentTemplate" nzPopoverTrigger="click" >
      <span nz-icon nzType="filter"></span>
      </button> -->

      <span *ngIf='openFilter' style='margin-left:5px;' nz-icon nzType="filter" (click)='onFilterClick()'   nzTheme="outline"></span>
      <span *ngIf='openSort' style='margin-left:5px;'   nz-icon nzType="arrow-down"  [ngClass]="{ 'active': !isAscendingDown }"  (click)="toggleSortDown('desc', $event)" nzTheme="outline"></span>
      <span *ngIf='openSort' style='margin-left:5px;'   nz-icon nzType="arrow-up"   [ngClass]="{ 'active': !isAscendingUp }" (click)="toggleSortUp('asc', $event)"  nzTheme="outline"></span>
     
      <span style='margin-left:5px;'   nz-icon nzType="menu" nzTheme="outline" (click)='onMenuColumClick()' ></span>
      <br>
      <input type="text"  nz-input   *ngIf='isFilter' nzSize="small"  [(ngModel)]="filterValue" (input)="onFilterChanged()" />
      <!-- <nz-input-group   *ngIf='isFilter' nzCompact>
      <nz-select [ngModel]="'equals'">
        <nz-option [nzLabel]="'包含'" [nzValue]="'contains'"></nz-option>
        <nz-option [nzLabel]="'等於'" [nzValue]="'equals'"></nz-option>
      </nz-select>
      <input type="text"  nz-input  nzSize="small" style='width:100px;' [(ngModel)]="filterValue" (input)="onFilterChanged()" />
      </nz-input-group> -->

      <nz-drawer
      [nzClosable]="false"
      [nzVisible]="visible"
      nzPlacement="right"
      nzTitle="欄位設定"
      (nzOnClose)="handleClose()"
    >
      <ng-container *nzDrawerContent>
      <nz-table [nzData]="params.columnApi.getAllDisplayedColumns()" [nzFrontPagination]="false" [nzShowPagination]="false">
      <thead>
        <tr>
          <th>狀態</th>
          <th>欄位</th>
        </tr>
      </thead>
      <tbody cdkDropList (cdkDropListDropped)="drop($event)">
        <tr *ngFor="let data of listOfData" cdkDrag>
          <td> <nz-switch [ngModel]="data.visible" (ngModelChange)='handleVisible(data.colId)' ></nz-switch></td>
          <td>{{ data.colDef.headerName }}</td>
        </tr>
      </tbody>
    </nz-table>
      </ng-container>
    </nz-drawer>

    <ng-template #contentTemplate>
      <div>
        <p> <input type="text" [(ngModel)]="filterValue" (input)="onFilterChanged()" /></p>
      </div>
    </ng-template>

    </div>
  `,
  styles: [`
    .active {
       background-color: #0db87a; /* Set your desired color for the active state  */
    }
  `]
})
export class PPSCustomHeaderComponent implements IHeaderAngularComp  {
  public params!: IHeaderParams;
  visible = false ;
  listOfData = null ;
  filterValue: string = '';
  column :any ;
  originalData: any[];
  isAscendingUp: boolean = true;
  isAscendingDown: boolean = true;
  isLock: boolean = true;
  isFilter: boolean = false;
  @Input() type: string = '4'  ; 

  openFilter = false ;
  openSort = false ;

  customParams: AgCustomHeaderParams;

  agInit(params: IHeaderParams): void {
    this.params = params;
    this.column = params.column;
    //this.listOfData = this.params.columnApi.getAllDisplayedColumns().map(obj => obj["colDef"]) ;
    //this.params.columnApi.getColumns()  params.column.getColId()
    this.listOfData = this.params.columnApi.getColumns();
    //console.log("test")
    //console.log(this.params.column.getColDef().filter)
    this.openFilter = this.params.column.getColDef().filter ;
    this.openSort = this.params.column.getColDef().sortable
    //console.log(this.params.columnApi.getColumn(this.params.column.getColId()).getColDef().sortable)
  }

  refresh(params: IHeaderParams) {
    return false;
  }

  onSortRequested(sortDirection: 'asc' | 'desc') {
    // 實現排序邏輯
    this.params.setSort(sortDirection, true);
  }
//升序第一次點升序，再點恢復
  toggleSortUp(order: 'asc' | 'desc' | null,event: any): void {
    if (this.isAscendingUp) {
      this.params.setSort(order, false);
      this.isAscendingUp = false;
    } else {
      // Restore to the original data state when clicked the second time
     // this.params.api.setRowData([...this.originalData]);
     this.isAscendingUp = true;
     this.isAscendingDown = true;
     this.params.setSort(null, false);
    }
  }
//升序第一次點降序，再點恢復
  toggleSortDown(order: 'asc' | 'desc' | null,event: any): void {
    if (this.isAscendingDown) {
      this.params.setSort(order, false);
      this.isAscendingDown = false;
    } else {
      this.isAscendingDown = true;
      this.isAscendingUp = true;
      this.params.setSort(null, false);
    }
  }

  handleLockClick() {
    if (this.params) {
    const currentColumn = this.params.column;
    const allDisplayedColumns = this.params.columnApi.getAllDisplayedColumns();
   // console.log("pin 狀態" + this.params.column.getPinned()) ;
    const pined = this.params.column.getPinned() ;
    let setPin :ColumnPinnedType = 'left'
    if(pined === null) {
      setPin = 'left'
    } else {
      setPin = null
    }
    for (const column of allDisplayedColumns) {
      if(setPin === null) {
        this.params.columnApi.setColumnPinned(column, setPin);
      } else {
        this.params.columnApi.setColumnPinned(column, setPin);
        if (column === currentColumn) {
          this.params.columnApi.setColumnPinned(column, setPin);
          return ;
        }
      }
    }
    } else {
    
    }
  }

  onFilterClick(){
    this.isFilter = !this.isFilter ;
    this.filterValue = ''
    this.onFilterChanged() ;
  }

  onFilterChanged(){
    console.log("filter:" + this.filterValue)
    const colId = this.params.column.getColId();
    const filterComponent = this.params.api.getFilterInstance(colId) as IFilterComp ;
    // 處理過濾邏輯
   // this.params.filterChangedCallback();
   if (filterComponent) {  //equals contains
    const filterModel: TextFilterModel = { type: 'contains', filter: this.filterValue };
    filterComponent.setModel(filterModel);
    this.params.api.onFilterChanged();
   }
     
  }
  onMenuColumClick(){
    this.handleClose();
   console.log(this.listOfData )
    // console.log(this.params.columnApi.getAllDisplayedColumns())
  }
  handleClose(){
    this.visible = !this.visible ;
  }

  drop(event: CdkDragDrop<string[]>): void {
    const colId = this.listOfData[event.previousIndex].colId ;
    const targetIndex = event.currentIndex; // 移動到的目標索引
    this.params.columnApi.moveColumn(colId, targetIndex);
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
    
  }
  //控制顯示
  handleVisible(colId:any){
    const currentVisibility = this.params.columnApi.getColumn(colId).isVisible();
    this.params.columnApi.setColumnVisible(colId, !currentVisibility);
  }

}