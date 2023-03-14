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
  RowDoubleClickedEvent,
  GridOptions
} from 'ag-grid-community';
import { CellClickedEvent } from 'ag-grid-community/dist/lib/events';
import * as moment from 'moment';
import { ExcelService } from 'src/app/services/common/excel.service';
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
  //可以分群的數組
  groupArray = [] ;

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
      name: '可分群欄位(暫時不可用)',
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

    //isSpinning
    isLoading = false
    //导出数据
    export = {
      title : "exportData",
      header: [] ,
      data:[],
    }
  //內部Table 
  rowSelectData = [] ;
  //保存原始排程
  originalData = [] ;
  constructor( 
    private mshService:MSHService,
    private nzMessageService:NzMessageService,
    private excelService: ExcelService,
    ) {
    this.gridOptions = {
      rowDragManaged: true,     
      animateRows: true, 
      //rowData: this.rowData,
    //  cellClicked: (event: CellClickedEvent<any>) => {this.onCellClicked(event);},
      onRowDoubleClicked : (event:RowDoubleClickedEvent) => {
        this.doubleClick(event) ;
      } ,
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
  //初始化數據
  initData(){
    //可分組欄位
    this.groupArray = [] ;


  }

  public rowSelection: 'single' | 'multiple' = 'multiple';
  doubleClick(row){
    this.rowSelectData = [] ;
    this.rowSelectData.push(row.data)
     console.log(row.data )
     this.modalTableVisible = true ;

  }
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

  exportBtn(){
    this.isLoading = true ;
    console.log(this.export.data.length)
    this.excelService.exportAsExcelFile(this.export.data, this.export.title,this.export.header);
    this.isLoading = false ;
  }
  //選擇分組
  checkedChange(value: string[]): void {
    this.searchV0.shopCode = this.selectShopCode ;
    this.groupArray = value ;
    console.log("開始調用分組")
   // console.log("group colum select :" + JSON.stringify(this.groupColumList))
    // console.log("checked:"+JSON.stringify(this.selectShopCode) );
    // this.getSetColumGroupData();
  }
  getTableData() {
    this.isLoading = true ;
    this.searchV0.shopCode = this.selectShopCode ;
    this.mshService.getTableData(this.searchV0).subscribe(res=>{
      this.isLoading = false ;
      let result:any = res ;
      //獲取所有結果
      console.log("result:" + JSON.stringify(result) )
      //清空欄位跟數據
      this.rowData = [] ;
      if(result.code === 200) {
      this.rowData = result.data ;
      let rowDataTemp = [] ;
      //重新修改
     // if(this.rowData.length > 0 ) {
        this.rowData.forEach((item1,index1,array1)=>{
          let rowDataObjectTemp = {} ;
          this.columnDefs.forEach((item2,index2,array2)=>{
            if(index1 === 0 ) {
              console.log(item2.field)
            }

            rowDataObjectTemp[item2.field] = item1[item2.field] ;
          })
          rowDataTemp.push(rowDataObjectTemp) ;
        })
        this.rowData = rowDataTemp ;
    //  }
      } else {
        this.nzMessageService.error(result.message) ;
      }
      this.export.data = this.rowData ;
    })

  }

//獲取站別分群配置
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

///User設定的欄位
  getSetColumByUser(){
    this.mshService.getSetColumByUser(this.selectShopCode).subscribe(res=>{
      let result:any = res ;
      this.allColumList = result.data ;
      
      this.columnDefs = [] ;
      let exportHeader = [] ;
     
      if(this.allColumList.length > 0) {
        let index1 = {headerName:'序號',field:'id',rowDrag: true,resizable:true,width:100 }
        exportHeader.push("序號")
        this.columnDefs.push(index1);
        this.allColumList.forEach((item,index,array) => {
          //放入导出头部
          exportHeader.push(item.columLabel) ;
          if(index == 0) {
            let itemTemp = {headerName:item.columLabel,field:item.columValue,resizable:true,width:130 }
            this.columnDefs.push(itemTemp);
          } else { 
            let itemTemp = {headerName:item.columLabel,field:item.columValue,resizable:true,width:120 }
            this.columnDefs.push(itemTemp);
          }
          
        });
      }

      this.export.header = exportHeader ;
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

  formateGroupRow(){
    console.log("checkedChange:" + JSON.stringify(this.rowData))

  

  }

}
