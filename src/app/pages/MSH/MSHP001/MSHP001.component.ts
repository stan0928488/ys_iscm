import { Component, OnInit } from '@angular/core';
import { MSHService } from 'src/app/services/MSH/MSH.service';
import {NzMessageService} from "ng-zorro-antd/message";
import { NzModalService } from 'ng-zorro-antd/modal';
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
import { isDataSource } from '@angular/cdk/collections';
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
//識別來源 A來自FCP（庭葦） B來自暫存 T 無效 M 已送入MES
category = '' ;


//public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
  date:Date[];
  selectShopCode = "401" ;
  shopCodeList:any = [] ;
  //選擇機台
  selectEquipCode = '';
  //可选机台
  equipCodeList = [] ;
  //可展示欄位
  allColumList:any = [] ;
 //可以分群的數據
  groupColumList :any = [] ;
  //可以分群的數組
  groupArray = [] ;

  //選擇版本號
  selectFcpVer = '';
  selectFcpVerObj ;
  fcpVerList = [] ;

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

    /**明细微调 */
    modalTableRowDataVisible = false ;

    dateFormat = 'yyyy-MM-dd';
    mdateFormat = 'yyyy-MM-DD';
    searchV0 = {
      shopCode :'334' ,
      equipCode :'',
      startDate : '',
      endDate:'',
      fcpVer:''
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
  //保存最後一次操作數據
  finalChangeDataIds = [] ;

  //編輯之後
  editFlag = false ;

  //保存欄位跟數據類型
  columKeyType = {};

  //調整後數據
  rowSortedData = [] ;

  //双击选择 索引
  selectRowIndex = -1 ;

  //所有站點機台配置狀況 
  shopCodeSaveStatusList = [] ;
  //保存的狀態
  saveLoading = false ;

  constructor( 
    private mshService:MSHService,
    private nzMessageService:NzMessageService,
    private excelService: ExcelService,
    private modal: NzModalService
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
      rowDragMultiRow: true,
      rowDragManaged: true, 
      onRowDragEnd: (event: RowDragEndEvent ) => {this.onRowDragEndModal(event);},
    }
    this.gridOptionsRowDataModal = {
      rowDragMultiRow:true,
      rowDragManaged: true,
      onRowDragEnd: (event: RowDragEndEvent ) => {this.onRowDragEndRowDataModal(event);},
    }
     
   }

  ngOnInit() {
   /// this.gridApi.setSuppressRowDrag(true) ;
    this.getShopCodes() ;
    //this.getSetColumByUser() ;
    this.getFcpVerList();
    
    this.searchV0.startDate = moment().format(this.mdateFormat) ;
    //當月月底
    //this.searchV0.endDate = moment().endOf('month').format(this.mdateFormat) ;
    //一個月後
    this.searchV0.endDate = moment(new Date()).add(2, "months").format(this.mdateFormat) ;
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

    let ids :any[] = row.data.sortId.split(',') ;
    let rowTemp = [] ;
    ids.forEach((val)=>{
    //  console.log("id :" + val)
     // console.log("originalData:" + JSON.stringify(this.originalData))
      let temp = this.originalData.forEach((item,index,array)=>{
       if(item.sortId === val) {
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
    this.searchV0.endDate = moment(result).format(this.mdateFormat)
    console.log('onChange: ', this.searchV0.endDate);
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
    this.searchV0.equipCode = this.selectEquipCode ;
    this.searchV0.fcpVer = this.selectFcpVer ;
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
    this.searchV0.equipCode = this.selectEquipCode ;
    //初始化原始数据
    this.originalData = [] ;
    this.mshService.getTableData(this.searchV0).subscribe(res=>{
      this.isLoading = false ;
      let result:any = res ;
      //獲取所有結果
     // console.log("result:" + JSON.stringify(result) )
      //清空欄位跟數據
      this.rowData = [] ;
      if(result.code === 200 && result.data !== null) {
      this.rowData = result.data ;
      let rowDataTemp = [] ;
      //重新修改
      if(this.rowData.length > 0 ) {
        //識別來源
        this.category = this.rowData[0].CATEGORY ;
        console.log("當前數據來源:" + this.category)
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
        this.category = '';
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
        let index1 = {headerName:'編號',field:'sortId',rowDrag: true,resizable:true,width:50 }
        exportHeader.push("編號")
        this.columnDefs.push(index1);
        this.columKeyType["sortId"] = 0 ;

        let index2 = {headerName:'KEY',field:'ID',rowDrag: false,resizable:true,width:50, hide: true }
        exportHeader.push("KEY")
        this.columnDefs.push(index2);
        //数据类型
        this.columKeyType["ID"] = 0 ;

        let index3 = {headerName:'開始',field:'START_DATE_C',rowDrag: false,resizable:true,width:130 }
        exportHeader.push("START_DATE_C")
        this.columnDefs.push(index3);
        //数据类型
        this.columKeyType["START_DATE_C"] = 0 ;

        let index4 = {headerName:'結束',field:'END_DATE_C',rowDrag: false,resizable:true,width:80 }
        exportHeader.push("END_DATE_C")
        this.columnDefs.push(index4);
        //数据类型
        this.columKeyType["START_DATE_C"] = 0 ;
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
     // console.log("标头栏位：", JSON.stringify(this.columnDefs)) ;
      if(this.selectFcpVer !== null && this.selectFcpVer !== '') {
        this.getTableData()
      }
    })
  }
  getShopCodes(){
    this.mshService.getShopCodes().subscribe(res=>{
      let result:any = res ;
      this.shopCodeList = result.data ;
      this.initSelectShop();
      this.getSetColumGroupData();
    })
  }

  getFcpVerList(){
    this.mshService.getFcpVerList().subscribe(res=>{
      let result:any = res ;
      this.fcpVerList = result.data ;
      console.log("this.fcpVerList:" + JSON.stringify(this.fcpVerList))
      this.inintLockBtn() ;
    })
  }
  //當選擇的的版本狀態不是'1'時候，顯示鎖定的按鈕
  inintLockBtn(){
    if(this.selectFcpVer !== null && this.selectFcpVer !=='') {
     this.selectFcpVerObj = this.fcpVerList.filter((item)=>{
         return item.fcpVer === this.selectFcpVer ;
      })[0]

      if(this.selectFcpVerObj.fcpLockStatus === '0') {
        this.showLockBtn = true ;
      } else {
        this.showLockBtn = false ;
      }
      console.log("fcp shijian " + this.selectFcpVerObj.fcpStartDate)
      this.searchV0.startDate = moment(this.selectFcpVerObj.fcpStartDate).format('YYYY-MM-DD')
    } else {
      this.showLockBtn = false ;
    }
   
  }
 showLockBtn = false ;
  changeFcpVer(){
    console.log("select " + this.selectFcpVer) ;
    this.inintLockBtn()
  }

  lockFcpBtn(){

    this.mshService.checkDataStatus().subscribe(res=>{
      let result:any = res ;
      let message = result.message ;
    this.modal.confirm({
      nzTitle: message +'! 您確定鎖定該版本嗎?',
      nzContent: '<b style="color: red;"></b>',
      nzOkText: '確定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.lockFcpVer(this.selectFcpVer)
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  });
  }


  lockFcpVer(fcpVer:any) {
    this.mshService.lockFcpVer(fcpVer).subscribe(res=>{
      let result:any = res ;
      let message = result.message ;
      this.nzMessageService.info(message);
      this.originalData = [] ;
      this.rowData = [] ;
      this.getFcpVerList() ;
     
    });
  }


  initSelectShop(){
    let shopCodeListTemp =  this.shopCodeList.filter((item)=>{
      return item.value === this.selectShopCode
    })[0] 
    this.equipCodeList = shopCodeListTemp.child ;
    this.selectEquipCode = this.equipCodeList[0].value ;
  }

   //挑選站別
   selectShopCodeFunc(){
    //console.log("checked:"+JSON.stringify(this.selectShopCode) );
    this.searchV0.shopCode = this.selectShopCode ;
    //console.log("所有站別：" + JSON.stringify(this.shopCodeList))
    let shopCodeListTemp =  this.shopCodeList.filter((item)=>{
      return item.value === this.selectShopCode
    })[0] 
    this.equipCodeList = shopCodeListTemp.child ;
    this.selectEquipCode = this.equipCodeList[0].value ;
    this.originalData = [] ;
    this.rowData = [] ;
    //console.log("已選擇站別：" + JSON.stringify(shopCodeListTemp))
    this.getSetColumGroupData();
  }

  selectEquipCodeFunc(){
    console.log("選擇站別 :" + this.selectEquipCode)
    this.originalData = [] ;
    this.rowData = [] ;
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
   // console.log('onRowDragEnd', JSON.stringify(this.rowData) );
  }

   /***分组明细拖拽 */
   onRowDragEndModal(e: RowDragEndEvent) {
    console.log("test")
    var itemsToUpdate = [];
    let ids = "" ;
    this.gridOptionsModal.api.forEachNode((rowNode,index)=>{
      if(index === 0) {
        ids = ids + rowNode.data.sortId ;
      } else {
        ids = ids + "," + rowNode.data.sortId ;
      }
      itemsToUpdate.push(rowNode.data);
    })
    this.rowSelectData = itemsToUpdate;
    this.rowData[this.selectRowIndex].sortId = ids ;
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
    console.log("this.originalData localStorage 1 :" + localStorage.getItem("originalData") ) ;
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
                  if(key === 'sortId') {
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
    if(key !== 'sortId') {
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
      let ids = item.sortId.split(',')
      ids.forEach((val)=>{
        this.rowSortedData.push(this.originalData[val-1]) 
      })
    })
    this.modalTableRowDataVisible = true ;

   }
  //排序後的數據送入MES
   sendSortedDataToMES(){
    this.nzMessageService.info("開發中");
   }

   saveSortedModal(flag:string){
     if(this.selectFcpVerObj.fcpLockStatus === '0') {
      this.nzMessageService.error("必須是鎖定版本才能保存！") ;
      return ;
     }
     this.saveLoading = true ;
     this.isLoading = true ;

     //調整接收數據
     this.finalChangeDataIds = [] ;
     //原始數據調取
     this.originalData = JSON.parse(localStorage.getItem("originalData"))
     //遍歷分群數據
     this.rowData.forEach((item,index,array)=>{
       let ids = item.sortId.split(',')
       ids.forEach((val)=>{
        this.finalChangeDataIds.push(this.originalData[val-1].ID) 
       })
     })
     let finalChangeDataTemp = [] ;
     this.finalChangeDataIds.forEach((item,index,array)=>{
      finalChangeDataTemp.push({id:item,sort:index + 1})
     }) ;
    // console.log("使用："+this.finalChangeDataIds)
    // this.originalData = JSON.parse(localStorage.getItem("originalData")) ;
    // console.log("使用："+this.finalChangeDataIds)
   // let _param = {ids:this.finalChangeDataIds.toString()}
    this.mshService.saveSortData(finalChangeDataTemp).subscribe(res=>{
      this.saveLoading = false ;
      this.isLoading = false ;
      if(flag === '1') {

      } else if(flag === '2') 
      {
        this.modalTableVisible = false ;

      }else if(flag === '3'){
        this.modalTableRowDataVisible = false ;
      }
      let result:any = res ;
      this.groupColumList = result.data ;
      if(result.code !== 200) {
        this.nzMessageService.error(result.message)
      } else {
        this.getSetColumGroupData() ;
      }
     
    })
    // this.saveLoading = false ;
    // this.isLoading = false ;
   }
  /****
   * 查看當前版次狀態
   */
   queryFcpVerStatusBtn(){
    this.shopCodeSaveStatusList = [] ;
    this.mshService.findShopCodeSaveStatus(this.selectFcpVer).subscribe(res=>{
      let result:any = res ;
      //調取所有站點機台配置狀況
      let shopCodeSaveStatusListTemp = result.data ;
      let tempList = [] ;
      shopCodeSaveStatusListTemp.forEach((item,value,array)=>{
        let flag = 0 
        let color = '#828282' //未配置
        if(item.categorys.includes('B')) {
          flag = 1 
          color = '#f50' //已送出
        } else if(item.categorys.includes('M')){
          flag = 2
          color = '#108ee9' //已送出
        } else {
          flag = 0 
          color = '#828282' //未配置
        }
        item.flag = flag 
        item.color = color 
        tempList.push(item)
      })
      const groupedData = tempList
      .map((item) => ({ ...item, categoryKey: `${item.shopCode}` }))
      .reduce((accumulator, item) => {
        const key = item.categoryKey;
        if (!accumulator[key]) {
          accumulator[key] = [];
        }
        accumulator[key].push(item);
        return accumulator;
      }, {});
     //console.log("分群处理结果：" + JSON.stringify(groupedData)) 
      this.shopCodeSaveStatusList = [] ;
      Object.keys(groupedData).forEach((key)=>{
        let obj = { shopCode:key ,list:groupedData[key] } ;
        this.shopCodeSaveStatusList.push(obj)
      })
      console.log("处理结果：" + JSON.stringify(this.shopCodeSaveStatusList)) 
      this.handleShopStatusModal() ;
    })
   }

   shopStatusModalVisiable = false ;
   //站別配置詳情 handleShopStatusModal
   handleShopStatusModal(){
    this.shopStatusModalVisiable = !this.shopStatusModalVisiable ;
   }


}
