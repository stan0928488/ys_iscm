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
import { CellClickedEvent } from 'ag-grid-community/dist/lib/events';
import * as moment from 'moment';
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
   
];

rowData = [
    
];

rowData1 = [
 
];

onCellClicked(value:any){
  console.log(value.data)
}


public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
  date:Date[];
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

    dateFormat = 'yyyy-MM-dd';
    mdateFormat = 'yyyy-MM-DD';
    searchV0 = {
      shopCode :'334' ,
      startDate : '',
      endDate:''
    }

  constructor(private mshService:MSHService,private nzMessageService:NzMessageService) {
    this.gridOptions = {
      rowDragManaged: true,     
      animateRows: true, 
      //rowData: this.rowData,
    //  cellClicked: (event: CellClickedEvent<any>) => {this.onCellClicked(event);},
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
    //this.getSetColumByUser() ;
    
    
    this.searchV0.startDate = moment().format(this.mdateFormat) ;
    this.searchV0.endDate = moment().endOf('month').format(this.mdateFormat) ;
    //this.getTableData();
  }
  public rowSelection: 'single' | 'multiple' = 'multiple';

  onChangeStartDate(result): void {
    console.log('onChange: ', result);
   
  }
  onChangeEndDate(result): void {
    console.log('onChange: ', result);
   
  }
  handleChangeModal(){
    this.modalTableVisible = !this.modalTableVisible ;
  }

  handleOk(){
    this.isConfirmLoading = true ;
  }
  

  queryBtn(){
    this.searchV0.shopCode = this.selectShopCode ;
    console.log(JSON.stringify(this.searchV0)) ;
    this.rowData = this.rowData1 ;
    this.getTableData();

  }

  log(value: string[]): void {
    this.searchV0.shopCode = this.selectShopCode ;
    console.log("checked:"+JSON.stringify(this.selectShopCode) );
    this.getSetColumGroupData();
  }
  getTableData() {
    this.searchV0.shopCode = this.selectShopCode ;
    this.mshService.getTableData(this.searchV0).subscribe(res=>{
      let result:any = res ;
      this.rowData = result.data ;
    })

  }


  getSetColumGroupData(){
    this.mshService.getSetColumGroupData(this.selectShopCode).subscribe(res=>{
      let result:any = res ;
      this.groupColumList = result.data ;
      if(result.code !== 200) {
        this.nzMessageService.error(result.message)
      } else {
        this.getSetColumByUser() ;
      }
     
    })
  }


  getSetColumByUser(){
    this.mshService.getSetColumByUser(this.selectShopCode).subscribe(res=>{
      let result:any = res ;
      this.allColumList = result.data ;
      
      this.columnDefs = [] ;
      this.allColumList.forEach((item,index,array) => {
        if(index == 0) {
          let itemTemp = {headerName:item.columLabel,field:item.columValue,rowDrag: true,resizable:true,width:100 }
          this.columnDefs.push(itemTemp);
        } else { 
          let itemTemp = {headerName:item.columLabel,field:item.columValue,resizable:true,width:100 }
          this.columnDefs.push(itemTemp);
        }
        
      });
      console.log("标头栏位：", JSON.stringify(this.columnDefs)) ;

      this.getTableData()
      
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
    this.searchV0.shopCode = this.selectShopCode ;
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
