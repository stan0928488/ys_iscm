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
  public gridOptionsModal: GridOptions;
  public gridOptionsRowDataModal: GridOptions;

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
  selectShopCode = "401" ;
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

    /**明细微调 */
    modalTableRowDataVisible = false ;

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
      title : "EXPORTDATA",
      header: [] ,
      data:[],
    }
  //內部Table 
  rowSelectData = [] ;
  //保存原始排程
  originalData = [] ;
  //編輯之後
  editFlag = false ;

  //保存欄位跟數據類型
  columKeyType = {};

  //調整後數據
  rowSortedData = [] ;

  //双击选择 索引
  selectRowIndex = -1 ;

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

    this.gridOptionsModal = {
      rowDragManaged: true, 
      onRowDragEnd: (event: RowDragEndEvent ) => {this.onRowDragEndModal(event);},
    }
    this.gridOptionsRowDataModal = {
      rowDragManaged: true, 
      onRowDragEnd: (event: RowDragEndEvent ) => {this.onRowDragEndRowDataModal(event);},
    }
     
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
    console.log("doubleClick")
    console.log(row)
    this.originalData = JSON.parse(localStorage.getItem("originalData"))
    this.rowSelectData = [] ;
    this.selectRowIndex = row.rowIndex ;

    let ids :any[] = row.data.id.split(',') ;
    let rowTemp = [] ;
    ids.forEach((val)=>{
    //  console.log("id :" + val)
     // console.log("originalData:" + JSON.stringify(this.originalData))
      let temp = this.originalData.forEach((item,index,array)=>{
       if(item.id === val) {
        rowTemp.push(item) 
       }
      })
    })
    this.rowSelectData = rowTemp ;
   //  console.log(this.rowSelectData )
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
    this.selectRowIndex = -1 ;
  }

  handleChangeRowDataModal(){
    this.modalTableRowDataVisible = !this.modalTableRowDataVisible ;
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
    let tableName = this.export.title + "_" + this.selectShopCode  ;
    this.excelService.exportAsExcelFile(this.export.data, tableName,this.export.header);
    this.isLoading = false ;
  }
  //選擇分組
  checkedChange(value: string[]): void {
    //選擇當前站別
    this.searchV0.shopCode = this.selectShopCode ;
    //選中分群數組
    this.groupArray = value ;
    console.log("開始調用分組")
    //this.formateGroupRow() ;
   // console.log("group colum select :" + JSON.stringify(this.groupColumList))
    // console.log("checked:"+JSON.stringify(this.selectShopCode) );
    // this.getSetColumGroupData();
  }
  getTableData() {
    this.isLoading = true ;
    this.searchV0.shopCode = this.selectShopCode ;
    //初始化原始数据
    this.originalData = [] ;
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
      if(this.rowData.length > 0 ) {
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
        localStorage.setItem("originalData",JSON.stringify(this.rowData))
        this.originalData =  JSON.parse(localStorage.getItem("originalData"))  ;
        //console.log("this.originalData :" + JSON.stringify(this.originalData)) ;
      }
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
      this.columKeyType = {} ;
     
      if(this.allColumList.length > 0) {
        let index1 = {headerName:'序號',field:'id',rowDrag: true,resizable:true,width:100 }
        exportHeader.push("序號")
        this.columnDefs.push(index1);
        this.columKeyType["id"] = 0 ;
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
          let columKeyTypeTemp = {} ;
          let key = item.columValue ;
          columKeyTypeTemp[key] = item.isNumber ;
          this.columKeyType[key] = item.isNumber ;
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


  /***最外层表格拖拽 */
  onRowDragEnd(e: RowDragEndEvent) {
    console.log("最外层表格拖拽")
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

   /***分组明细拖拽 */
   onRowDragEndModal(e: RowDragEndEvent) {
    console.log("test")
    var itemsToUpdate = [];
    let ids = "" ;
    this.gridOptionsModal.api.forEachNode((rowNode,index)=>{
      if(index === 0) {
        ids = ids + rowNode.data.id ;
      } else {
        ids = ids + "," + rowNode.data.id ;
      }
      itemsToUpdate.push(rowNode.data);
    })
    this.rowSelectData = itemsToUpdate;
    this.rowData[this.selectRowIndex].id = ids ;
    this.gridOptions.api.setRowData(this.rowData)
    //console.log('onRowDragEndModal', JSON.stringify(this.rowSelectData) );
  }
 /**微调明细 */
 onRowDragEndRowDataModal(e: RowDragEndEvent) {
    console.log("微调明细test")
    var itemsToUpdate = [];
    this.gridOptionsRowDataModal.api.forEachNode((rowNode,index)=>{
     // console.log("index: " + index + ",rowNode:" +JSON.stringify(rowNode.data))
      itemsToUpdate.push(rowNode.data);
    })
    console.log('onRowDragEndRowDataModal:', JSON.stringify(itemsToUpdate) );
    this.rowSortedData = [...itemsToUpdate];
    this.gridOptionsRowDataModal.api.setRowData(this.rowSortedData)
    console.log('onRowDragEndRowDataModal2:', JSON.stringify(this.rowSortedData) );
  }
  onRowDragMove(event: RowDragMoveEvent) {
    var movingNode = event.node;
    var overNode = event.overNode;
    var rowNeedsToMove = movingNode !== overNode;
    //console.log("event:" + event)
  }

  //恢复数据进行处理
  recoverDataBtn(){
    this.originalData = JSON.parse(localStorage.getItem("originalData")) ;
    this.rowData =  this.originalData ;
  }
//排序分群
  formateGroupRow(){
    // console.log("原始數據:" + JSON.stringify(this.rowData))
    // console.log("分群數組:" + JSON.stringify(this.groupArray))
    // console.log("欄位是否數字：" + JSON.stringify(this.columKeyType))
    let rowDataTemp = [] ;
    //前一條數據
    let preGroupString = "" ;
    let preGroupObject = {} ;
    this.originalData = JSON.parse(localStorage.getItem("originalData"))
   // console.log("this.originalData localStorage 1 :" + localStorage.getItem("originalData") ) ;
    let originalDataTemp:any[] = [...this.originalData]
    //遍歷原始數據
    originalDataTemp.forEach((item,index,array)=>{
      //遍歷出每一筆數據按照分群結果拼接,逗號隔開
      let currentGroupString = ""
      for(let i = 0 ; i < this.groupArray.length ; i ++) {
        let key = this.groupArray[i]
        if(i === 0) {
          currentGroupString += item[key] ;
        } else {
          currentGroupString += "," + item[key] ;
        }
      }
        // console.log("上個分組：" + JSON.stringify(preGroupString)) 
        // console.log("當前分組：" + JSON.stringify(currentGroupString)) 
       
        //取出每一個key值進行拼接
        if(index === 0) {
          preGroupString = currentGroupString ;
          preGroupObject = item ;
        }
        else {
          //如果當前分組跟上一次相等
          if(preGroupString === currentGroupString){
            Object.keys(preGroupObject).forEach((key)=>{
             // console.log("key:" +key + ",contain:" + this.arrayContainStr(this.groupArray,key)) ;
              //如果是分組欄位不做任何操作
              if(this.arrayContainStr(this.groupArray,key) === true) {
              //  console.log("分群欄位：" + key + ":" + preGroupObject[key]) ;
              } else {
               // console.log("this.columKeyType[key]:" +this.columKeyType[key])
                //如果不是分組欄位，數字加和，字符串拼接
                if(this.columKeyType[key] === 0 || this.columKeyType[key] === '0') {
                  if(key === 'id') {
                    let newStr = preGroupObject[key] + ',' + item[key] ;
                    preGroupObject[key] = newStr
                  } else {
                    let newStr =  item[key] ;
                    preGroupObject[key] = newStr
                  }
                 
                 /*
                  if(item[key] !== null) {
                    let newStr = preGroupObject[key] + ',' + item[key] ;
                    preGroupObject[key] = newStr
                  } else {
                    preGroupObject[key] = preGroupObject[key]
                  }
                  */
                 
               //   console.log("非分群 非數字：" + key + ":" + newStr) ;
                } else {
               //   console.log("非分群 數字：" + key + ":" + preGroupObject[key]) ;
                  //preGroupObject[key] =  Number(preGroupObject[key]).toFixed(2)
                  preGroupObject[key] +=  item[key];  
                 
                }

              }
            })
            //如果跟上一條數據相等
            if(index === originalDataTemp.length - 1) {
              rowDataTemp.push(this.pushDataBeforeFormat(preGroupObject)) ;
            }

          } else {
            //如果分组不相等 b保存上一次的數據
            rowDataTemp.push(this.pushDataBeforeFormat(preGroupObject)) ;
            //講當前值賦給上一個對象
            preGroupObject = item ;
            preGroupString = currentGroupString ;
             //如果跟上一條數據相等
             if(index === originalDataTemp.length -1) {
              rowDataTemp.push(this.pushDataBeforeFormat(preGroupObject)) ;
            }
          }

        }
      
     

    })
    this.rowData = rowDataTemp ;
    //console.log("rowDataTemp" + JSON.stringify(rowDataTemp) ) ;

   // console.log("this.originalData localStorage :" + localStorage.getItem("originalData") ) ;
  }
//写入之前需要处理数据
 pushDataBeforeFormat(preGroupObject:any) {
  Object.keys(preGroupObject).forEach((key)=>{
    //处理不是id的栏位
    if(key !== 'id') {
    //当前栏位不是数字
    if(this.columKeyType[key] === 0 || this.columKeyType[key] === '0') {
      //如果当前不为空
      if(preGroupObject[key] !== null) {
        let newStr = preGroupObject[key].toString().replace('null,','') //.toString().replace("null","");
        preGroupObject[key] = newStr
      } else {
        let newStr = preGroupObject[key]//.toString().replace("null","");
        preGroupObject[key] = newStr
      }
     //当前栏位是数字
    } else {
      if(Number(preGroupObject[key]) > 0) {
        preGroupObject[key] =  Number(preGroupObject[key]).toFixed(2);
      }  
    }
  }
  })
  return preGroupObject ;

 }

//包含數組
  arrayContainStr(array :any[],str:string) {
    let result = false ;
    array.find((item,index,array)=>{
     // console.log("item:" + item + "——" +"str:" + str)
      if(item === str) {
        result = true 
      }
    })
   // console.log("container:" + result)
    return result ;
  }

   //分群函數
   groupBtn(){
    if(this.groupArray.length > 0) {
      this.formateGroupRow();
    } else {
      this.nzMessageService.error("請至少選擇一個欄位分群") 
    }
   

   }

   //dataModal 調整之後查看微調數據
   dataSortedModal(){
    //調整接收數據
    this.rowSortedData = [] ;
    //原始數據調取
    this.originalData = JSON.parse(localStorage.getItem("originalData"))
    //遍歷分群數據
    this.rowData.forEach((item,index,array)=>{
      let ids = item.id.split(',')
      ids.forEach((val)=>{
        this.rowSortedData.push(this.originalData[val-1]) 
      })
    })
    this.modalTableRowDataVisible = true ;

   }

}
