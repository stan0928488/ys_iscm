import { Component, OnInit } from '@angular/core';
import { MSHService } from 'src/app/services/MSH/MSH.service';
import {NzMessageService} from "ng-zorro-antd/message";
import { ColDef, GetRowIdFunc, GetRowIdParams ,
  ColumnApi,
  GridApi,
  RowDragEndEvent,
  RowDragEnterEvent,
  RowDragLeaveEvent,
  RowDragMoveEvent,
  GridOptions
} from 'ag-grid-community';
@Component({
  selector: 'app-MSHP001',
  templateUrl: './MSHP001.component.html',
  styleUrls: ['./MSHP001.component.css'],
  providers:[NzMessageService]

})
export class MSHP001Component implements OnInit {
  private gridApi: GridApi<any>;
  private gridColumnApi!: ColumnApi;
  public gridOptions: GridOptions;

  columnDefs: ColDef[] = [
    { field: 'Row ID' ,valueGetter: 'node.id',rowDrag: true },
    { field: 'id' },
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
];

rowData = [
    {id:'C1', make: 'Toyota', model: 'Celica', price: 35000 },
    {id:'C2', make: 'Ford', model: 'Mondeo', price: 32000 },
    {id:'C3', make: 'Porsche', model: 'Boxster', price: 72000 },
    {id:'C4', make: 'Toyota', model: 'Celica', price: 35000 },
    {id:'C5', make: 'Ford', model: 'Mondeo', price: 32000 },
    {id:'C6', make: 'Porsche', model: 'Boxster', price: 72000 },
    {id:'C7', make: 'Toyota', model: 'Celica', price: 35000 },
    {id:'C8', make: 'Ford', model: 'Mondeo', price: 32000 },
    {id:'C9', make: 'Porsche', model: 'Boxster', price: 72000 },
    {id:'C10', make: 'Toyota', model: 'Celica', price: 35000 },
    {id:'C11', make: 'Ford', model: 'Mondeo', price: 32000 },
    {id:'C12', make: 'Porsche', model: 'Boxster', price: 72000 },
    {id:'C13', make: 'Toyota', model: 'Celica', price: 35000 }
];

rowData1 = [
  {id:'C1111', make: 'Toyota', model: 'Celica', price: 35000 },
  {id:'C1112', make: 'Ford', model: 'Mondeo', price: 32000 },
  {id:'C1113', make: 'Porsche', model: 'Boxster', price: 72000 },
  {id:'C1114', make: 'Toyota', model: 'Celica', price: 35000 },
  {id:'C1115', make: 'Ford', model: 'Mondeo', price: 32000 },
  {id:'C1116', make: 'Porsche', model: 'Boxster', price: 72000 },
  {id:'C1117', make: 'Toyota', model: 'Celica', price: 35000 },
  {id:'C1118', make: 'Ford', model: 'Mondeo', price: 32000 },
  {id:'C1119', make: 'Porsche', model: 'Boxster', price: 72000 },
  {id:'C11110', make: 'Toyota', model: 'Celica', price: 35000 },
  {id:'C11111', make: 'Ford', model: 'Mondeo', price: 32000 },
  {id:'C11112', make: 'Porsche', model: 'Boxster', price: 72000 },
  {id:'C11113', make: 'Toyota', model: 'Celica', price: 35000 }
];

onCellClicked(value:any){
  console.log(value.data)
}


public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;

  selectShopCode = "334" ;
  shopCodeList:any = [] ;
  //可展示欄位
  allColumList:any = [] ;
 //可以分群的數據
  groupColumList :any = [] ;
  //
  //table数据
  tbData :any = [] ;

  panels1:any = {
    active: true,
    name: '站別',
  };
  panels2:any = 
    {
      active: true,
      name: '可分群欄位',
    };
    panels3:any = 
    {
      active: true,
      name: '操作區',
    };

    /**modal显示明细数据 */
    modalTableVisible = false ;
    isConfirmLoading = false ;

  constructor(private mshService:MSHService,private nzMessageService:NzMessageService) {
    this.gridOptions = {
      rowDragManaged: true,     
      animateRows: true, 
      //rowData: this.rowData,
      onRowDragEnd: (event: RowDragEndEvent ) => {this.onRowDragEnd(event);},
      onGridReady(event) {
        console.log("onGridReady:" + event.api.setRowData(this.rowData))
      },
      // onRowDragMove: (event: RowDragMoveEvent ) => {this.onRowDragMove(event);}
    };
     
   }

  ngOnInit() {
   /// this.gridApi.setSuppressRowDrag(true) ;
    this.getShopCodes() ;
    this.getSetColumByUser() ;
  }
  public rowSelection: 'single' | 'multiple' = 'multiple';

  handleChangeModal(){
    this.modalTableVisible = !this.modalTableVisible ;
  }

  handleOk(){
    this.isConfirmLoading = true ;
  }
  


  TEST(){
    console.log(JSON.stringify(this.rowData)) ;
    this.rowData = this.rowData1 ;

  }

  log(value: string[]): void {
    console.log("checked:"+JSON.stringify(this.selectShopCode) );
    this.getSetColumGroupData();

  }
  getSetColumGroupData(){
    this.mshService.getSetColumGroupData(this.selectShopCode).subscribe(res=>{
      let result:any = res ;
      this.groupColumList = result.data ;
      this.getSetColumByUser() ;
    })
  }


  getSetColumByUser(){
    this.mshService.getSetColumByUser(this.selectShopCode).subscribe(res=>{
      let result:any = res ;
      this.allColumList = result.data ;
      
    })
  }
  getShopCodes(){
    this.mshService.getShopCodes().subscribe(res=>{
      let result:any = res ;
      this.shopCodeList = result.data ;
      console.log(this.shopCodeList) ;
      this.getSetColumGroupData();
    })
  }

   //挑選站別
   selectShopCodeFunc(){
    console.log("checked:"+JSON.stringify(this.selectShopCode) );
    this.getSetColumGroupData();
  }


  /*** */
  onRowDragEnd(e: RowDragEndEvent) {
    console.log("test")
    var itemsToUpdate = [];
    //console.log(this.gridOptions.api.forEachNodeAfterFilterAndSort)
    this.gridOptions.api.forEachNode((rowNode,index)=>{
      itemsToUpdate.push(rowNode.data);
    })
    this.rowData = itemsToUpdate;
    console.log('onRowDragEnd', JSON.stringify(this.rowData) );
    // this.gridOptions.api.forEachNodeAfterFilterAndSort(function (rowNode,index) {
    // console.log(index)
    // itemsToUpdate.push(rowNode.data);
    // });
    // this.rowData = itemsToUpdate;
  //console.log('onRowDragEnd', JSON.stringify(this.rowData) );

  }
  onRowDragMove(event: RowDragMoveEvent) {
    var movingNode = event.node;
    var overNode = event.overNode;
    var rowNeedsToMove = movingNode !== overNode;
    console.log("event:" + event)
  }
}
