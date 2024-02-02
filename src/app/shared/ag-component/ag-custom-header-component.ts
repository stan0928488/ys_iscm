import { Component , Input} from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { ColumnPinnedType, IFilter, IHeaderParams,ITextFilterParams ,IFilterComp,TextFilterModel,ColumnState} from 'ag-grid-community';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map } from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';

@Component({
  selector: 'custom-header',
  template: `
    <div class="custom-header">
      <span>{{ params.displayName }}</span>
      <span style='margin-left:5px;' *ngIf="this.params.column.getPinned() !== 'right'"   [ngClass]="{ 'active': !isLock }" nz-icon nzType="lock" nzTheme="outline" (click)='handleLockClick()'   ></span>
      <!-- <button style='margin-left:5px;'  nz-button nzType="primary"   [nzPopoverContent]="contentTemplate" nzPopoverTrigger="click" >
      <span nz-icon nzType="filter"></span>
      </button> -->

      <span *ngIf='openFilter'  style='margin-left:5px;' nz-icon nzType="filter" (click)='onFilterClick()'   nzTheme="outline"></span>
      <span *ngIf='openSort' style='margin-left:5px;'   nz-icon nzType="arrow-down"  [ngClass]="{ 'active': !isAscendingDown }"  (click)="toggleSortDown('desc', $event)" nzTheme="outline"></span>
      <span *ngIf='openSort' style='margin-left:5px;'   nz-icon nzType="arrow-up"   [ngClass]="{ 'active': !isAscendingUp }" (click)="toggleSortUp('asc', $event)"  nzTheme="outline"></span>
     
      <span style='margin-left:5px;' *ngIf="this.params.column.getColDef().headerComponentParams !== undefined && this.params.column.getColDef().headerComponentParams.isMenuShow === true "  nz-icon nzType="menu" nzTheme="outline" (click)='onMenuColumClick()' ></span>
      <br>
      <input type="text"  nz-input   *ngIf='isFilter' nzSize="small"  [(ngModel)]="filterValue" (input)="onFilterChanged()" />
      <!-- <nz-input-group   *ngIf='isFilter' nzCompact>
      <nz-select [ngModel]="'equals'">
        <nz-option [nzLabel]="'包含'" [nzValue]="'contains'"></nz-option>
        <nz-option [nzLabel]="'等於'" [nzValue]="'equals'"></nz-option>
      </nz-select>
      <input type="text"  nz-input  nzSize="small" style='width:100px;' [(ngModel)]="filterValue" (input)="onFilterChanged()" />
      </nz-input-group> -->

      <nz-drawer  *ngIf="this.params.column.getColDef().headerComponentParams !== undefined && this.params.column.getColDef().headerComponentParams.isMenuShow === true "
      [nzClosable]="false"
      [nzVisible]="visible"
      nzPlacement="right"
      nzTitle="欄位設定"
      [nzFooter]="footerTpl"
      (nzOnClose)="handleClose()"
    >
      <ng-container *nzDrawerContent>
      <nz-table [nzData]="params.columnApi.getAllDisplayedColumns()" [nzFrontPagination]="false" [nzShowPagination]="false">
      <thead>
        <tr>
          <th>狀態</th>
          <th>欄位</th>
          <th>width</th>
          <th>resizeable</th>
          <th>filter</th>
          <th>sortable</th>
        </tr>
      </thead>
      <tbody cdkDropList (cdkDropListDropped)="drop($event)">
        <tr *ngFor="let data of listOfData" cdkDrag>
          <td> <nz-switch [ngModel]="data.visible" [nzDisabled]="data.colDef.headerComponentParams !== undefined &&  data.colDef.headerComponentParams.isMenuShow === true"  (ngModelChange)='handleVisible(data.colId)' ></nz-switch></td>
          <td>{{ data.colDef.headerName }}</td>
          <td> <nz-input-number [(ngModel)]="data.colDef.width"></nz-input-number></td>
          <td> <nz-switch [ngModel]="data.colDef.resizable"></nz-switch></td>
          <td> <nz-switch [ngModel]="data.colDef.filter"></nz-switch></td>
          <td> <nz-switch [ngModel]="data.colDef.sortable"></nz-switch></td>
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

    <ng-template #footerTpl>
      <div style="float: left">
        <button nz-button *ngIf="isSave" nzType="primary" (click)="save()">保存</button>
      </div>
    </ng-template>

    </div>
  `,
  styles: [`
    .active {
       color: #0db87a; /* Set your desired color for the active state  */
    }
  `]
})
export class AGCustomHeaderComponent implements IHeaderAngularComp  {
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
  isSave = false ;

  menuOpen = false ;

  constructor(
    private systemService : SYSTEMService,
    private message: NzMessageService,
  ) {
  }
  agInit(params: IHeaderParams): void {
    this.params = params;
    this.column = params.column;
   // console.log(this.params.column.getColDef().headerComponentParams.isMenuShow)
    //this.listOfData = this.params.columnApi.getAllDisplayedColumns().map(obj => obj["colDef"]) ;
    //this.params.columnApi.getColumns()  params.column.getColId()
    this.listOfData = this.params.columnApi.getColumns();
    
    this.openFilter = this.params.column.getColDef().filter ;
    this.openSort = this.params.column.getColDef().sortable ;
    console.log(this.params.columnApi.getColumns()) ;
    let agCustomHeaderParams = this.column.gridOptionsService.gridOptions['agCustomHeaderParams'];
    if(agCustomHeaderParams){
      this.isSave = agCustomHeaderParams['isSave']
    }
  
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
    if(pined === null) {  // 未锁定
      setPin = 'left'
    } else {  // 锁定
      setPin = null
    }

    for (const column of allDisplayedColumns) {
        if(setPin === null) { //如果当前
          if(column.getPinned() !== 'right') {
            this.params.columnApi.setColumnPinned(column, setPin);
          }
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
    console.log(this.listOfData)
    // console.log(this.params.columnApi.getAllDisplayedColumns())
  }
  handleClose(){
    console.log("menuOpen:"+ this.menuOpen) ;
    if(!this.menuOpen) {
      this.listOfData.sort((a, b) => (a.sortIndex < b.sortIndex ? -1 : 1)) ;
      this.menuOpen = true ;
    }
    this.visible = !this.visible ;
    
  }

  drop(event: CdkDragDrop<string[]>): void {
    const colId = this.listOfData[event.previousIndex].colId ;
    const targetIndex = event.currentIndex; // 移動到的目標索引

    let currentColumn = this.params.columnApi.getColumn(colId);
    currentColumn.setSortIndex(event.currentIndex);
    if(targetIndex > event.previousIndex){
      //升序
      this.listOfData.forEach(element => {
        
        if(element.sortIndex <= targetIndex){
          element.setSortIndex(element.getSortIndex() - 1)
        }

      })

    }else{
      //降序
      this.listOfData.forEach(element => {
        
        if(element.sortIndex >= targetIndex){
          element.setSortIndex(element.getSortIndex() + 1)
        }

      })

    }

    this.params.columnApi.moveColumn(colId, targetIndex);
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
    
  }
  //控制顯示
  handleVisible(colId:any){
    const currentVisibility = this.params.columnApi.getColumn(colId).isVisible();
    this.params.columnApi.setColumnVisible(colId, !currentVisibility);
  }

  save() {
    let outthis = this;
    let columnState:ColumnState[]  = this.params.columnApi.getColumnState();
    let agCustomHeaderParams = this.column.gridOptionsService.gridOptions['agCustomHeaderParams'];
    columnState.forEach(function (element,index) {
      element['agName'] = agCustomHeaderParams['agName']
      element.sortIndex = index ;
      let findElement = outthis.listOfData.find(
        (el) => element.colId == el.colId
      );
      element['headername'] = '';
      if(findElement){
        console.log(findElement)
        element['headername'] = findElement.userProvidedColDef.headerName;
        element['width'] = findElement.colDef.width
        element['sortable'] = findElement.colDef.sortable
        element['resizable'] = findElement.colDef.resizable
        element['filter'] = findElement.colDef.filter
      }
      element['path'] = agCustomHeaderParams['path']
    }); 

    this.systemService.saveHeaderComponentStatus(columnState).subscribe(res=>{
      let result:any = res ;
      if(result.code === 200) {
        this.message.success("更新成功")
      } else {
        this.message.success("更新失敗")
      }
    });

  }

}