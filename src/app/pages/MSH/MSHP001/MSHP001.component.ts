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
import * as XLSX from 'xlsx';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { ClipboardService } from 'ngx-clipboard'

@Component({
  selector: 'app-MSHP001',
  templateUrl: './MSHP001.component.html',
  styleUrls: ['./MSHP001.component.css'],
  providers:[NzMessageService]

})
export class MSHP001Component implements OnInit {
  private gridApi: GridApi<any>;
  private gridColumnApi!: ColumnApi;
  // 外層拖拽表格
  public gridOptions: GridOptions;
  // 內層拖拽表格
  public gridOptionsModal: GridOptions;
  // 微調拖拽表格
  public gridOptionsRowDataModal: GridOptions;
  // excel 模式表格 
  public excelModelGridOptions: GridOptions;
  //批量 excel 模式表格 
  public excelBatchModelGridOptions: GridOptions;
  // excel 模式表格數據
  rowExcelModelData = [] ;
   //批量 excel 模式表格數據
   rowExcelBatchModelData = [] ;
  // 表格頭
  columnDefs: ColDef[] = [];
  //外層表格頭部
  outsideColumnDefs: ColDef[] = [];

  rowData = [];

  rowData1 = [];
 // 批量表格頭
 excelBatchColumnDefs: ColDef[] = [];

//識別來源 A來自FCP（庭葦） B來自暫存 T 無效 M 已送入MES
category = '' ;


//public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
  date:Date[];
  selectShopCode = "334" ;
  shopCodeList:any = [] ;
  //選擇機台
  selectEquipCode = '';
  //可选机台
  equipCodeList = [] ;
  //可替換機台
  equipCodeChangeList = [] ;
  //可替換幾天
  equipCodeChangeListOption = [] ;
  //可替換機台選擇
  selectChangeEquipCode = "";
  //可展示欄位
  allColumList:any = [] ;
 //可以分群的數據
  groupColumList :any = [] ;
  //可以分群的數組
  groupArray = [] ;
  //搜尋內容
  searchText: string = '';
  //搜尋總數
  searchCount = 0 ;
  //搜尋Loading
  searchLoading = false ;

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

  //保存的狀態2
  saveLoading2 = false ;

 /***更換作業代碼 */
 changeOpCodeIsVisible = false ;

 //當前站別下載機台數
 shopMachineList = [] ;
// modal 寬
modalWidth = '90vw';

// modal body 高
modalBodyHeight = '75vh';

// modal body padding
modalBodyPadding = '24px';

  // modal body 內容樣式 ffa39e
  modalBodyStyle = {
   
    height: this.modalBodyHeight,
    overflow: 'auto',
    background: '#fff',
    padding: this.modalBodyPadding,
  };

// modal style
modalStyle = {
  top: `calc((100vh - ${this.modalBodyHeight} - 55px - 55px) / 2) `,
  with:this.modalWidth ,
};

// ag gird 外層 div style
style: any = {
  width: `calc(${this.modalWidth} - ${this.modalBodyPadding} - ${this.modalBodyPadding})`,
  height: `calc(${this.modalBodyHeight} - ${this.modalBodyPadding} - ${this.modalBodyPadding})`,
  flex: '1 1 auto',
};



 handleOpCodeModal(){
  this.changeCarFlag = '1' ;
  let idsTemp = "" ;
  this.rowSelectData.forEach((item,index,array)=>{
    if(index == 0) {
      idsTemp += item.ID
    } else {
      idsTemp += ',' + item.ID
    }
  })
  //console.log("ids: " + idsTemp) 
  this.getEquipOpCode(idsTemp) ;
  this.changeOpCodeIsVisible = !this.changeOpCodeIsVisible 

 }


 /******更換機台開始 */
 changeMachineModal = {
  isVisible : false ,
  title:'機台更換',
  isConfirmLoading: false ,
  table : {
    header : [
      {"label":'MO',"value":'ID_NO'},
      {"label":'投產機台',"value":'PST_MACHINE_ADD'},
      {"label":'',"value":''},
      {"label":'',"value":''},
      {"label":'',"value":''},
      {"label":'',"value":''},
    ] ,
    tbData : [] ,
  }
 }

 /******更換機台結束 */
// 換車標識
// 1 更換作業代碼 換車 
changeCarFlag = '1' ;


 /**同作業換車開始 */
 sameOpCodeChangeCarModal = {
  isVisible : false ,
  title:'車次更換',
  isConfirmLoading: false ,
  table : {
    header : [
      {"label":'MO',"value":'ID_NO'},
      {"label":'投產機台',"value":'PST_MACHINE_ADD'},
      {"label":'',"value":''},
      {"label":'',"value":''},
      {"label":'',"value":''},
      {"label":'',"value":''},
    ] ,
    tbData : [] ,
  }
 }
 /**同作業換車結束 */
 /***FCP使用開始 */
 fcpNumber = 0 ;
 fcpNumberIsDisabled = true ;
/***FCP使用結束 */
 //获取可替换作業代碼数据
 getEquipOpCode(ids){
  this.mshService.getEquipOpCode(ids).subscribe(res=>{
    let result:any = res ;
    if(result.code !== 200) {
      this.nzMessageService.error(result.message) ;
    } else {
      this.changeOpCodeTable.tbData = result.data ;
      this.changeOpCodeTable.tbData.forEach((item,index,array)=>{
        // 新增選擇作業碼
        this.changeOpCodeTable.tbData[index].selectedOpCode = "" 
        // 選擇作業碼列表 
        if(item.NEW_OP_CODE.toString() === "") {
          this.changeOpCodeTable.tbData[index].selectedOpCodeList = [] ;
        } else{
          let arr = item.NEW_OP_CODE.toString().split(',') ;
          
          let uniqueArr = arr.filter((value, index, self) => self.indexOf(value) === index); 
          this.changeOpCodeTable.tbData[index].selectedOpCodeList = uniqueArr ;
          this.changeOpCodeTable.tbData[index].NEW_OP_CODE = uniqueArr.join(',') ;
        }
        // 選擇配車
        this.changeOpCodeTable.tbData[index].selectedCarId = ""
      })
      //console.log("this.changeOpCodeTable.tbData: " + JSON.stringify(this.changeOpCodeTable.tbData)) 

    }
  })
 }
 //選擇新的ID  用於選車時候修改數據
 selectNewID = ""
// 選擇車輛
 selectCarClick(id,selectedCarId){
  let newOpCode = "" ;
  this.changeOpCodeTable.tbData.forEach((item,index,array)=>{
    if(item.ID === id) {
      newOpCode = item.selectedOpCode ;
     // this.changeOpCodeTable.tbData[index].selectedCarId = selectedCarId ;
    }
  })
  if(newOpCode === "" ) {
    this.nzMessageService.error("請先選擇要替換的作業代碼") 
    return 
  }
  let para = "id="+id +"&opCode="+newOpCode ;
  this.selectCarTable.tbData = [] ;
  this.selectNewID = ""
  this.mshService.getFcpCarInfo(para).subscribe(res=>{
    let result:any = res ;
    if(result.code !== 200) {
      this.nzMessageService.error(result.message) ;
    } else {
      this.selectNewID = id 
      this.selectCarTable.tbData = result.data ;
      //將配車選項重置false 
      this.selectCarTable.tbData.forEach((item, index, array)=>{
        if(item.BATCH_411_CAR_ID === selectedCarId) {
          this.selectCarTable.tbData[index].checked = true ;
        } else {
          this.selectCarTable.tbData[index].checked = false ;
        }
        
      })
  
    }
  })
  //開啟關閉選擇
  this.handleSelectCarModal() ;
 }
 selectOpCodeFun(){
  console.log("this.changeOpCodeTable.tbData: " + JSON.stringify(this.changeOpCodeTable.tbData)) 

 }
 // 確認保存
 comitHandleOpCodeModal(){
  if(this.changeCarFlag === '1') {
    this.saveChangeOpCodeAndCar();
  } else if(this.changeCarFlag === '2') {
    this.saveChangeSameOpCodeCar() ;
  }
  
  
 }
 //保存修改作業代碼及配車 
 saveChangeOpCodeAndCar(){
      //批量存檔
      console.log("批量存檔:" + JSON.stringify(this.changeOpCodeTable.tbData));
      let saveOpCodeAndCarData = []
      this.changeOpCodeTable.tbData.forEach((item,index,array)=>{
      if(item.selectedOpCode !== "" && item.selectedCarId  !== "") {
        let saveOpCodeAndCarDataTemp = {id:item.ID ,newOpCode:item.selectedOpCode,carId:item.selectedCarId,originalCarId:item.OLD_CAR_ID}
        saveOpCodeAndCarData.push(saveOpCodeAndCarDataTemp)
      }
      })
      if(saveOpCodeAndCarData.length < 1){
        this.nzMessageService.error("未選擇作業代碼及車次")
        return
      }
      this.handleOpCodeIsConfirmLoading = true
      console.log("有效存檔:" + JSON.stringify(saveOpCodeAndCarData));
      this.mshService.saveChangeOpCode(saveOpCodeAndCarData).subscribe(res=>{
        this.handleOpCodeIsConfirmLoading = false
        let result:any = res ;
        if(result.code !== 200) {
          this.nzMessageService.error(result.message) ;
        } else {
          this.nzMessageService.success(result.message);
          this.changeOpCodeIsVisible = false ;
          this.modalTableVisible = false ;
          this.getTableData() ;
        }
      })
 }
 // 保存狀態
 handleOpCodeIsConfirmLoading = false 
 // 更換機台數據
 changeOpCodeData = [] ;

 changeOpCodeTable = {
  header:[
    {label:"", value:""},
  ] ,
  tbData:[] 

 }

 carList = [] ;
/**選車Modal可見性 */
selectCarIsVisible = false 
// 選車Modal關閉開啟
handleSelectCarModal(){
  this.selectCarIsVisible = !this.selectCarIsVisible
}
// 選車表數據
selectCarTable = {
  header :[] ,
  tbData:[] 
}
//選車事件 
handleSelectCarCheckFun(carId){
  this.selectCarTable.tbData.forEach((item, index, array)=>{
    if(item.BATCH_411_CAR_ID !== carId) {
      this.selectCarTable.tbData[index].checked = false ;
    }
    
  })

}
handleSelectCarIsConfirmLoading = false
// 確認車輛選擇
comitHandleSelectCarModal(){
  console.log('this.changeCarFlag:'+this.changeCarFlag) ;
  let selectCarIdTemp = ""
  this.selectCarTable.tbData.forEach((item, index, array)=>{
   if(item.checked === true) {
     //選擇當前車次
     selectCarIdTemp = item.BATCH_411_CAR_ID ;
   }
 })
 if(selectCarIdTemp === "") {
   this.nzMessageService.error("尚未選擇配車編號")
 }

 if(this.selectNewID === "") {
   this.nzMessageService.error("選擇作業丟失，請關閉重新選擇")
 }
 console.log('this.selectNewID:'+this.selectNewID) ;
if(this.changeCarFlag === '1') {

  this.changeOpCodeTable.tbData.forEach((item,index,array)=>{
    if(item.ID === this.selectNewID) {
      this.changeOpCodeTable.tbData[index].selectedCarId = selectCarIdTemp
    }
  })

} else if(this.changeCarFlag === '2') {
  this.sameOpCodeChangeCarModal.table.tbData.forEach((item,index,array)=>{
    if(item.ID === this.selectNewID) {
      console.log("index: " + index)
      console.log("selectCarIdTemp: " + selectCarIdTemp)
      this.sameOpCodeChangeCarModal.table.tbData[index].NEW_CAR_ID = selectCarIdTemp

    }
  })
  console.log("this.sameOpCodeChangeCarModal.table.tbData:" + JSON.stringify(this.sameOpCodeChangeCarModal.table.tbData))
}
 
this.handleSelectCarModal() ;

}

   // 保存狀態
   handleEquipIsConfirmLoading = false 
   // 更換機台數據
   changeEquipData = [] ;

    changeEquipTable = {
      header:[
        {label:"", value:""},
      ] ,
      tbData:[] 
    }

    /**EXCEL model START parameter */
    //上傳的資料數據 rowExcelModelData
    upLoadExcelData = [] ;

    //excelModelModal 顯示 
    excelModelModalIsVisible = false ;
    excelBatchModelModalIsVisible = false ;

    //確認按鈕 loading 
    handlecomitExcelModelConfirmLoading = false ;
    excelModelModal = {
      tbHeader:[],
      tbData:[]
    }
    // 批量提交 loading 
    handleComitExcelBatchModelConfirmLoading = false ;
    //exportFileName
    exportFileName = "" ;
    uploadFile:File;
    acceptType = ['.xlsx','.xls','.csv']
    arrayBuffer:any;
  
    /**EXCEL model END */

  constructor( 
    private mshService:MSHService,
    private nzMessageService:NzMessageService,
    private excelService: ExcelService,
    private modal: NzModalService,
    private clipboardService: ClipboardService
    ) {
      // 最外層
    this.gridOptions = {
      rowDragManaged: true,     
      animateRows: true, 
      getRowStyle(params) {
        if(params.data["TIMEDIFFFLAG_ADD"] === "1") {
          if(params.data["COLORFLAG"].toString() === '1') {
            return  { background: '#FF00FF' };
          }
          return { background: 'SandyBrown' };
        } else {
        //console.log(" params.data[ORIGINAL_PST_MACHINE_ADD] :" + params.data["ORIGINAL_PST_MACHINE_ADD"])
        if( params.data["PST_MACHINE_ADD"] === 'RF' ||  params.data["PST_MACHINE_ADD"] === 'BA1' ) {
          if(params.data["CAR_WEIGHT_ADD"] < 3900) {
            if(params.data["COLORFLAG"].toString() === '1') {
              return  { background: '#FF00FF' };
            }
            return { background: 'lightcoral' };
          } else {
            if ((params.data["ORIGINAL_OP_CODE_ADD"] === null || params.data["ORIGINAL_OP_CODE_ADD"] === 'null' || params.data["ORIGINAL_OP_CODE_ADD"] ===undefined  || params.data["ORIGINAL_OP_CODE_ADD"] === "" || params.data["ORIGINAL_OP_CODE_ADD"] === 0)
            &&(params.data["ORIGINAL_CAR_ID_ADD"] === null || params.data["ORIGINAL_CAR_ID_ADD"] === 'null' || params.data["ORIGINAL_CAR_ID_ADD"] ===undefined  || params.data["ORIGINAL_CAR_ID_ADD"] === "" || params.data["ORIGINAL_CAR_ID_ADD"] === 0)) {
              if (params.data["ORIGINAL_PST_MACHINE_ADD"] === null || params.data["ORIGINAL_PST_MACHINE_ADD"] === 'null' || params.data["ORIGINAL_PST_MACHINE_ADD"] ===undefined  || params.data["ORIGINAL_PST_MACHINE_ADD"] === "" || params.data["ORIGINAL_PST_MACHINE_ADD"] === 0) {
                if(params.data["COLORFLAG"].toString() === '1') {
                  return  { background: '#FF00FF' };
                }
                return { background: 'white' };
              } else {
                if(params.data["COLORFLAG"].toString() === '1') {
                  return  { background: '#FF00FF' };
                }
                return { background: 'powderblue' };
              }
            } else {
              if(params.data["COLORFLAG"].toString() === '1') {
                return  { background: '#FF00FF' };
              }
              return { background: 'yellow' };
            }
          }
        } else {
          if (params.data["ORIGINAL_PST_MACHINE_ADD"] === null || params.data["ORIGINAL_PST_MACHINE_ADD"] === 'null' || params.data["ORIGINAL_PST_MACHINE_ADD"] ===undefined  || params.data["ORIGINAL_PST_MACHINE_ADD"] === "" || params.data["ORIGINAL_PST_MACHINE_ADD"] === 0) {
            if(params.data["COLORFLAG"].toString() === '1') {
              return  { background: '#FF00FF' };
            }
            return { background: 'white' };
          } else {
            if(params.data["COLORFLAG"].toString() === '1') {
              return  { background: '#FF00FF' };
            }
            return { background: 'powderblue' };
          }
        }
      }
       
      },
      //rowData: this.rowData,
      onCellClicked: (event: CellClickedEvent<any>) => {this.onCellClicked(event)},

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
      getRowStyle(params) {
        if(params.data["TIMEDIFFFLAG_ADD"] === "1") {
          return { background: 'SandyBrown' };
        } else {
        console.log(" params.data[ORIGINAL_PST_MACHINE_ADD] :" + params.data["ORIGINAL_PST_MACHINE_ADD"])
        if( params.data["PST_MACHINE_ADD"] === 'RF' ||  params.data["PST_MACHINE_ADD"] === 'BA1' ) {
          if(params.data["CAR_WEIGHT_ADD"] < 0) {
            return { background: 'lightcoral' };
          } else {
            if ((params.data["ORIGINAL_OP_CODE_ADD"] === null || params.data["ORIGINAL_OP_CODE_ADD"] === 'null' || params.data["ORIGINAL_OP_CODE_ADD"] ===undefined  || params.data["ORIGINAL_OP_CODE_ADD"] === "" || params.data["ORIGINAL_OP_CODE_ADD"] === 0)
            &&(params.data["ORIGINAL_CAR_ID_ADD"] === null || params.data["ORIGINAL_CAR_ID_ADD"] === 'null' || params.data["ORIGINAL_CAR_ID_ADD"] ===undefined  || params.data["ORIGINAL_CAR_ID_ADD"] === "" || params.data["ORIGINAL_CAR_ID_ADD"] === 0)) {
              if (params.data["ORIGINAL_PST_MACHINE_ADD"] === null || params.data["ORIGINAL_PST_MACHINE_ADD"] === 'null' || params.data["ORIGINAL_PST_MACHINE_ADD"] ===undefined  || params.data["ORIGINAL_PST_MACHINE_ADD"] === "" || params.data["ORIGINAL_PST_MACHINE_ADD"] === 0) {
                return { background: 'white' };
              } else {
                return { background: 'powderblue' };
              }
            } else {
              return { background: 'yellow' };
            }
          }
        } else {
          if (params.data["ORIGINAL_PST_MACHINE_ADD"] === null || params.data["ORIGINAL_PST_MACHINE_ADD"] === 'null' || params.data["ORIGINAL_PST_MACHINE_ADD"] ===undefined  || params.data["ORIGINAL_PST_MACHINE_ADD"] === "" || params.data["ORIGINAL_PST_MACHINE_ADD"] === 0) {
            return { background: 'white' };
          } else {
            return { background: 'powderblue' };
          }
        }
      }
        /*
        if(params.data["TIMEDIFFFLAG_ADD"] === "1") {
          return { background: 'lightcoral' };
        } else {
        console.log(" params.data[ORIGINAL_PST_MACHINE_ADD] :" + params.data["ORIGINAL_PST_MACHINE_ADD"])
        if ((params.data["ORIGINAL_OP_CODE_ADD"] === null || params.data["ORIGINAL_OP_CODE_ADD"] === 'null' || params.data["ORIGINAL_OP_CODE_ADD"] ===undefined  || params.data["ORIGINAL_OP_CODE_ADD"] === "" || params.data["ORIGINAL_OP_CODE_ADD"] === 0)
        &&(params.data["ORIGINAL_CAR_ID_ADD"] === null || params.data["ORIGINAL_CAR_ID_ADD"] === 'null' || params.data["ORIGINAL_CAR_ID_ADD"] ===undefined  || params.data["ORIGINAL_CAR_ID_ADD"] === "" || params.data["ORIGINAL_CAR_ID_ADD"] === 0)) {
          if (params.data["ORIGINAL_PST_MACHINE_ADD"] === null || params.data["ORIGINAL_PST_MACHINE_ADD"] === 'null' || params.data["ORIGINAL_PST_MACHINE_ADD"] ===undefined  || params.data["ORIGINAL_PST_MACHINE_ADD"] === "" || params.data["ORIGINAL_PST_MACHINE_ADD"] === 0) {
            return { background: 'white' };
          } else {
            return { background: 'powderblue' };
          }
        } else {
          console.log("ORIGINAL_OP_CODE_ADD2:" + JSON.stringify(params.data["ORIGINAL_OP_CODE_ADD"]))
          // Apply a different background color to odd rows
          return { background: 'yellow' };
        }
      } */
      },
      onCellClicked: (event: CellClickedEvent<any>) => {this.onCellClicked(event)},
      onRowDragEnd: (event: RowDragEndEvent ) => {this.onRowDragEndModal(event);},
      onRowDoubleClicked : (event:RowDoubleClickedEvent) => {
        this.doubleClickConfigCar(event) ;
      }
    }
    // 微調確認拖拽表格
    this.gridOptionsRowDataModal = {
      rowDragMultiRow:true,
      rowDragManaged: true,
      getRowStyle(params) {
        if(params.data["TIMEDIFFFLAG_ADD"] === "1") {
          return { background: 'SandyBrown' };
        } else {
        console.log(" params.data[ORIGINAL_PST_MACHINE_ADD] :" + params.data["ORIGINAL_PST_MACHINE_ADD"])
        if( params.data["PST_MACHINE_ADD"] === 'RF' ||  params.data["PST_MACHINE_ADD"] === 'BA1' ) {
          if(params.data["CAR_WEIGHT_ADD"] < 3900) {
            return { background: 'lightcoral' };
          } else {
            if ((params.data["ORIGINAL_OP_CODE_ADD"] === null || params.data["ORIGINAL_OP_CODE_ADD"] === 'null' || params.data["ORIGINAL_OP_CODE_ADD"] ===undefined  || params.data["ORIGINAL_OP_CODE_ADD"] === "" || params.data["ORIGINAL_OP_CODE_ADD"] === 0)
            &&(params.data["ORIGINAL_CAR_ID_ADD"] === null || params.data["ORIGINAL_CAR_ID_ADD"] === 'null' || params.data["ORIGINAL_CAR_ID_ADD"] ===undefined  || params.data["ORIGINAL_CAR_ID_ADD"] === "" || params.data["ORIGINAL_CAR_ID_ADD"] === 0)) {
              if (params.data["ORIGINAL_PST_MACHINE_ADD"] === null || params.data["ORIGINAL_PST_MACHINE_ADD"] === 'null' || params.data["ORIGINAL_PST_MACHINE_ADD"] ===undefined  || params.data["ORIGINAL_PST_MACHINE_ADD"] === "" || params.data["ORIGINAL_PST_MACHINE_ADD"] === 0) {
                return { background: 'white' };
              } else {
                return { background: 'powderblue' };
              }
            } else {
              return { background: 'yellow' };
            }
          }
        } else {
          if (params.data["ORIGINAL_PST_MACHINE_ADD"] === null || params.data["ORIGINAL_PST_MACHINE_ADD"] === 'null' || params.data["ORIGINAL_PST_MACHINE_ADD"] ===undefined  || params.data["ORIGINAL_PST_MACHINE_ADD"] === "" || params.data["ORIGINAL_PST_MACHINE_ADD"] === 0) {
            return { background: 'white' };
          } else {
            return { background: 'powderblue' };
          }
        }
      }
        /*
        if(params.data["TIMEDIFFFLAG_ADD"] === "1") {
          return { background: 'lightcoral' };
        } else {
          return { background: 'white' };
        }*/
      },
      onRowDragEnd: (event: RowDragEndEvent ) => {this.onRowDragEndRowDataModal(event);},
    }
    // excel模式表格
    this.excelModelGridOptions = {
      rowDragMultiRow:true,
      rowDragManaged: true,
      onRowDragEnd: (event: RowDragEndEvent ) => {this.onRowDragEndRowDataOnExcelModal(event);},
    }
 // 批量excel模式表格
 this.excelBatchModelGridOptions = {
  rowDragMultiRow:false,
  rowDragManaged: false,
  getRowStyle(params) {
    if (params.data["ACT_PST_MACHINE_ADD"] !== params.data["PST_MACHINE_ADD"]) {
      return { background: 'powderblue' };
    } else {
      return { background: 'white' };
    }
  },
 // onRowDragEnd: (event: RowDragEndEvent ) => {this.onRowDragEndRowDataOnExcelModal(event);},
}

     
   }

  ngOnInit() {
   /// this.gridApi.setSuppressRowDrag(true) ;
    //獲取版本訊息
    this.getFcpVerList();
    //獲取戰備機台訊息
    //this.getShopCodes() ;
    //this.getSetColumByUser() ;
   
    
    this.searchV0.startDate = moment().format(this.mdateFormat) ;
    //當月月底
    //this.searchV0.endDate = moment().endOf('month').format(this.mdateFormat) ;
    //一個月後
    this.searchV0.endDate = moment(new Date()).add(14, "days").format(this.mdateFormat) ;
    //this.getTableData();
  }
  //初始化數據
  initData(){
    //可分組欄位
    this.groupArray = [] ;


  }

  public rowSelection: 'single' | 'multiple' = 'multiple';
  onCellClicked(event:any){
    console.log("cellClick :" + event.value )
    if(event.colDef.field === 'ID_NO') {
      this.copy(event.value) ;
    }
   
  }
  copy(text: string){
    this.clipboardService.copy(text)
    this.nzMessageService.info(text + ", 已復製到剪切板，可使用CTRL+V") 
  }
  

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

  doubleClickConfigCar(row) {
    console.log(row) ;
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
    let tableName = this.export.title + "_" + this.selectShopCode + "_" + this.selectEquipCode ;
    this.exportFileName = tableName ;
    if(this.export.data.length < 1) {
      this.nzMessageService.error("沒有可以導出的數據，請查詢確認！")
      return 
    }
    this.isLoading = true ;
    // console.log("this.export.data length :" + this.export.data.length)
    // console.log("this.export.header length :" + this.export.header.length)
    this.excelService.exportAsExcelFile(this.export.data, tableName,this.export.header);
    this.isLoading = false ;
  }
  //選擇分組
  checkedChange(value: string[]): void {
   // console.log("选择的分群栏位:" + value) ;
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
  getExportDataByShopCode(){
    this.isLoading = true ;
    this.searchV0.shopCode = this.selectShopCode ;
    this.searchV0.equipCode = this.selectEquipCode ;
    this.mshService.getExportDataByShopCode(this.searchV0).subscribe(res=>{
      this.isLoading = false ;
      let result:any = res ;
      if(result.code === 200) {
        let exportHeader = result.data.tableHeader ;
        let exportData = result.data.TableContent ;
        
        let rowDataTemp = [] ;
        let header = [] ;
        let excelBatchColumnDefsTemp = [] ;
        exportData.forEach((item1,index1,array1)=>{
          let rowDataObjectTemp = {} ;
          let excelBatchColumnDefsTempObj = {} ;
          exportHeader.forEach((item2,index2,array2)=>{
            if(index1 === 0 ) {
              header.push(item2.columLabel)   
              let widthTemp = 100 ;
              switch(item2.columValue){
                case "sort": widthTemp = 50 ;break;
                case "ID": widthTemp = 80 ;break;
                case "PLAN_START_TIME": widthTemp = 160 ;break;
                case "PLAN_END_TIME": widthTemp = 160 ;break;

              }
              excelBatchColumnDefsTempObj = {headerName:item2.columLabel,field:item2.columValue,rowDrag: false,resizable:true,width:widthTemp }
              excelBatchColumnDefsTemp.push(excelBatchColumnDefsTempObj);
            }
            rowDataObjectTemp[item2.columValue] = item1[item2.columValue] ;
          })
          rowDataTemp.push(rowDataObjectTemp) ;
         
        })
        this.excelBatchColumnDefs = excelBatchColumnDefsTemp ;
       // this.rowExcelBatchModelData = rowDataTemp ;
        this.exportDataByShopCode(rowDataTemp,header) ;

      }else{
        this.nzMessageService.error(result.message)
      }
     
    })
  }

  exportDataByShopCode(exportData,exportHeader){
    let tableName = this.export.title + "_" + this.selectShopCode  ;
    this.exportFileName = tableName ;
    if(this.export.data.length < 1) {
      this.nzMessageService.error("沒有可以導出的數據，請查詢確認！")
      return 
    }
    this.excelService.exportAsExcelFile(exportData, tableName,exportHeader);
    this.isLoading = false
  }

  getTableData() {
    this.isLoading = true ;
    this.searchV0.shopCode = this.selectShopCode ;
    this.searchV0.equipCode = this.selectEquipCode ;
    this.searchV0.fcpVer = this.selectFcpVer
    // 如果是RF 的，结束时间为3个月之后
    if(this.selectEquipCode === 'RF' || this.selectEquipCode === 'BA1') {
      console.log("RF")
      this.searchV0.endDate = moment(new Date()).add(3, "months").format(this.mdateFormat) ;
      console.log("endDate ：" + this.searchV0.endDate)
    }
    
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
        //數據生成完畢
        this.export.data = this.rowData ;
        this.groupBtn() ;
      }
      } else {
        this.category = '';
        this.nzMessageService.error(result.message) ;
      }
    
    })
  
  }

//獲取站別分群配置
  // getSetColumGroupData(){
  //   this.mshService.getSetColumGroupData(this.selectShopCode).subscribe(res=>{
  //     let result:any = res ;
  //     this.groupColumList = result.data ;
  //     if(result.code !== 200) {
  //       this.nzMessageService.error(result.message)
  //     } else {
  //       this.getSetColumByUser() ;
  //     }
     
  //   })
  // }

///User設定的欄位 包含分群數據CAR_ID_ADD
  getSetColumByUser(){
    this.mshService.getSetColumByUser(this.selectShopCode).subscribe(res=>{
      let result:any = res ;
      this.allColumList = result.data ;
      //直接在所有欄位中過濾出分群數據
      let groupColumListTemp = [] ;
      //分群默认选择
      let groupArrayTemp = [] ;
      //如果是 RF 需要CARID
      if(this.selectEquipCode === 'RF' || this.selectEquipCode === 'BA1'){
        let itemTemp = {"columValue":"CAR_ID_ADD","columLabel":"CARID","checked":true}
        groupColumListTemp.push(itemTemp) ;
        groupArrayTemp.push(itemTemp.columValue) ;
      }
      this.allColumList.forEach((item,index,array)=>{
        if(item.isGroup === 1) {
          //分群默認選擇
          item.checked = true ;
          groupColumListTemp.push(item) ;
          //默认选择所有的分群
          groupArrayTemp.push(item.columValue);
        }
      })
      // 分群欄位
      this.groupColumList = groupColumListTemp ;
      // 分群栏位 checked
      this.groupArray = groupArrayTemp ;
      //頭部
      this.columnDefs = [] ;
      //外層頭部
      this.outsideColumnDefs = [] ;

      let exportHeader = [] ;
      this.columKeyType = {} ;
     
      if(this.allColumList.length > 0) {
        let index1 = {headerName:'編號',field:'sortId',rowDrag: true,resizable:true,width:50 }
        exportHeader.push("編號")
        this.columnDefs.push(index1);
        this.outsideColumnDefs.push(index1);
        this.columKeyType["sortId"] = 0 ;

        let index2 = {headerName:'KEY',field:'ID',rowDrag: false,resizable:true,width:50, hide: true }
        exportHeader.push("KEY")
        this.columnDefs.push(index2);
        this.outsideColumnDefs.push(index2);
        //数据类型
        this.columKeyType["ID"] = 0 ;

        let index3 = {headerName:'開始',field:'START_DATE_C',rowDrag: false,resizable:true,width:200 }
        exportHeader.push("開始")
        this.columnDefs.push(index3);
        this.outsideColumnDefs.push(index3);
        //数据类型
        this.columKeyType["START_DATE_C"] = 0 ;

        let index4 = {headerName:'結束',field:'END_DATE_C',rowDrag: false,resizable:true,width:200 }
        exportHeader.push("結束")
        this.columnDefs.push(index4);
        this.outsideColumnDefs.push(index4);
        //数据类型
        this.columKeyType["END_DATE_C"] = 0 ;
        if(this.selectEquipCode === 'RF' || this.selectEquipCode === 'BA1' ) {
        // 411 CARID
        let index5 = {headerName:'CARID',field:'CAR_ID_ADD',rowDrag: false,resizable:true,width:80 }
        exportHeader.push("CAR_ID_ADD")
        this.columnDefs.push(index5);
        this.outsideColumnDefs.push(index5);
        //数据类型
        this.columKeyType["CAR_ID_ADD"] = 0 ;

        // 411 CAREPST
        let index6 = {headerName:'CAREPST',field:'CAR_EPST_ADD',rowDrag: false,resizable:true,width:80 }
        exportHeader.push("CAREPST")
        this.columnDefs.push(index6);
        this.outsideColumnDefs.push(index6);
        //数据类型
        this.columKeyType["CAR_EPST_ADD"] = 0 ;
        // 411 CARLPST
        let index7 = {headerName:'CARLPST',field:'CAR_LPST_ADD',rowDrag: false,resizable:true,width:80 }
        exportHeader.push("CARLPST")
        this.columnDefs.push(index7);
        this.outsideColumnDefs.push(index7);
        //数据类型
        this.columKeyType["CAR_LPST_ADD"] = 0 ;

         // 411 CARLPST
         let index8 = {headerName:'ORIGINAL_OP_CODE',field:'ORIGINAL_OP_CODE_ADD',rowDrag: false,resizable:true,width:80,hide: true }
         exportHeader.push("ORIGINAL_OP_CODE")
         this.columnDefs.push(index8);
         this.outsideColumnDefs.push(index8);
         //数据类型
         this.columKeyType["ORIGINAL_OP_CODE"] = 0 ;

         //411 車重
         let index9 = {headerName:'車重',field:'CAR_WEIGHT_ADD',rowDrag: false,resizable:true,width:80 }
         exportHeader.push("車重")
         this.columnDefs.push(index9);
         this.outsideColumnDefs.push(index9);
         //数据类型
         this.columKeyType["CAR_WEIGHT_ADD"] = 0 ;
         // 411 PST_MACHINE_ADD

         let index10 = {headerName:'固定機台',field:'PST_MACHINE_ADD',rowDrag: false,resizable:true,width:80,hide: true }
         exportHeader.push("固定機台")
         this.columnDefs.push(index10);
         this.outsideColumnDefs.push(index10);
         //数据类型
         this.columKeyType["PST_MACHINE_ADD"] = 0 ;
          // 411 ORIGINAL_CAR_ID_ADD
          let index12 = {headerName:'ORIGINAL_CAR_ID_ADD',field:'ORIGINAL_CAR_ID_ADD',rowDrag: false,resizable:true,width:80,hide: true }
          exportHeader.push("ORIGINAL_CAR_ID_ADD")
          this.columnDefs.push(index12);
          this.outsideColumnDefs.push(index12);
          //数据类型
          this.columKeyType["ORIGINAL_CAR_ID_ADD"] = 0 ;
        
      }
       //ORIGINAL_PST_MACHINE_ADD
       let index11 = {headerName:'原始機台',field:'ORIGINAL_PST_MACHINE_ADD',rowDrag: false,resizable:true,width:80,hide: true }
       exportHeader.push("原始機台")
       this.columnDefs.push(index11);
       this.outsideColumnDefs.push(index11);
       //数据类型
       this.columKeyType["ORIGINAL_PST_MACHINE_ADD"] = 0 ;

       // TIMEDIFFFLAG_ADD 添加跳時間

       let index12 = {headerName:'NEWEPST修正',field:'TIMEDIFFFLAG_ADD',rowDrag: false,resizable:true,width:80,hide: true }
       exportHeader.push("NEWEPST修正")
       this.columnDefs.push(index12);
       this.outsideColumnDefs.push(index12);
       //数据类型
       this.columKeyType["TIMEDIFFFLAG_ADD"] = 0 ;
      //顏色標記 COLORFLAG
      let indexColor = {headerName:'搜尋',field:'COLORFLAG',rowDrag: false,resizable:true,width:80,hide: true }
      exportHeader.push("搜尋")
      this.columnDefs.push(indexColor);
      this.outsideColumnDefs.push(indexColor);
      //数据类型
      this.columKeyType["COLORFLAG"] = 0 ;

       //可替换机台 1 ，2， 3
       let indexMachine1 = {headerName:'替換機台1',field:'MACHINE1_ADD',rowDrag: false,resizable:true,width:80,hide: true }
       exportHeader.push("替換機台1")
       this.columnDefs.push(indexMachine1);
       this.outsideColumnDefs.push(indexMachine1);
       //数据类型
       this.columKeyType["MACHINE1_ADD"] = 0 ;
       let indexMachine2 = {headerName:'替換機台2',field:'MACHINE2_ADD',rowDrag: false,resizable:true,width:80,hide: true }
       exportHeader.push("替換機台2")
       this.columnDefs.push(indexMachine2);
       this.outsideColumnDefs.push(indexMachine2);
       //数据类型
       this.columKeyType["MACHINE2_ADD"] = 0 ;
       let indexMachine3 = {headerName:'替換機台1',field:'MACHINE3_ADD',rowDrag: false,resizable:true,width:80,hide: true }
       exportHeader.push("替換機台3")
       this.columnDefs.push(indexMachine3);
       this.outsideColumnDefs.push(indexMachine3);
       //数据类型
       this.columKeyType["MACHINE3_ADD"] = 0 ;

       let indexMachine4 = {headerName:'最佳機台',field:'BEST_MACHINE_ADD',rowDrag: false,resizable:true,width:80,hide: true }
       exportHeader.push("最佳機台")
       this.columnDefs.push(indexMachine4);
       this.outsideColumnDefs.push(indexMachine4);
       //数据类型
       this.columKeyType["BEST_MACHINE_ADD"] = 0 ;
       // 訂單拼接  SALE_ORDER_ITEM_ADD
       let SALE_ORDER_ITEM_ADD_index = {headerName:'搜索訂單',field:'SALE_ORDER_ITEM_ADD',rowDrag: false,resizable:true,width:80,hide: true }
       exportHeader.push("搜索訂單")
       this.columnDefs.push(SALE_ORDER_ITEM_ADD_index);
       this.outsideColumnDefs.push(SALE_ORDER_ITEM_ADD_index);
       //数据类型
       this.columKeyType["SALE_ORDER_ITEM_ADD"] = 0 ;


        this.allColumList.forEach((item,index,array) => {
          //放入导出头部
          exportHeader.push(item.columLabel) ;
          if(index == 0) {
            let itemTemp = {headerName:item.columLabel,field:item.columValue,resizable:true,width:130 }
            this.columnDefs.push(itemTemp);
            if(item.isOutside === 1) {
              this.outsideColumnDefs.push(itemTemp);
            }
            
          } else { 
            let itemTemp = {headerName:item.columLabel,field:item.columValue,resizable:true,width:120 }
            this.columnDefs.push(itemTemp);
            if(item.isOutside === 1) {
              this.outsideColumnDefs.push(itemTemp);
            }
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
  //調用站別機台訊息
  getShopCodes(){
    this.mshService.getShopCodes().subscribe(res=>{
      let result:any = res ;
      this.shopCodeList = result.data ;
      this.initSelectShop();
      //this.getSetColumGroupData();
      //開始調用數據部分
      this.getSOPData() ;
    })
  }
  /**1.查詢客戶設置欄位 
   * 2.默認分群設置
   * 3.獲取表格數據
   * 4.調用分群方法
  */
 getSOPData(){
  //調用客戶欄位配置訊息
  this.getSetColumByUser() ;
 }
 /**
  * 獲取版本訊息
  */
  getFcpVerList(){
    this.mshService.getFcpVerList().subscribe(res=>{
      let result:any = res ;
      this.fcpVerList = result.data ;
    //console.log("this.fcpVerList:" + JSON.stringify(this.fcpVerList))
    // 默認版本號
    this.fcpVerList.forEach((item,index,array)=>{
      if(index === 0){
        this.selectFcpVer = item.fcpVer
      } else {
        if(item.fcpLockStatus === '1'){
          this.selectFcpVer = item.fcpVer
        }
      }

    })
    //初始化選擇的版本
    this.inintLockBtn() ;
    //調用站別機台訊息
    this.getShopCodes() ;
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
    this.originalData = [] ;
    this.isLoading = true ;
    this.mshService.lockFcpVer(fcpVer).subscribe(res=>{
      this.isLoading = false ;
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
    //SETENDDATE
    if(shopCodeListTemp.setEndDate !== null  && shopCodeListTemp.setEndDate !== '' && shopCodeListTemp.setEndDate !== undefined ) {
      this.searchV0.endDate = shopCodeListTemp.setEndDate
    }
    this.equipCodeList = shopCodeListTemp.child ;
    this.selectEquipCode = this.equipCodeList[0].value ;
  }

   //挑選站別
   selectShopCodeFunc(){
    //站別切換 數據重置
    this.fcpNumber = 0 ;
    this.fcpNumberIsDisabled = true ;
    //console.log("checked:"+JSON.stringify(this.selectShopCode) );
    this.searchV0.shopCode = this.selectShopCode ;
    //console.log("所有站別：" + JSON.stringify(this.shopCodeList))
    let shopCodeListTemp =  this.shopCodeList.filter((item)=>{
      return item.value === this.selectShopCode
    })[0] 
     //SETENDDATE
    
    this.equipCodeList = shopCodeListTemp.child ;
    this.selectEquipCode = this.equipCodeList[0].value ;
    if(this.selectShopCode !== '401' && this.selectShopCode !== '411' ){
      //日期重置 
      if(shopCodeListTemp.setEndDate !== null  && shopCodeListTemp.setEndDate !== '' && shopCodeListTemp.setEndDate !== undefined ) {
        this.searchV0.endDate = shopCodeListTemp.setEndDate
      } else {
        this.searchV0.endDate = moment(new Date()).add(14, "days").format(this.mdateFormat) ;
      }
      
    }

    this.originalData = [] ;
    this.rowData = [] ;
    //console.log("已選擇站別：" + JSON.stringify(shopCodeListTemp))
    this.getSetColumByUser();
  }

  selectEquipCodeFunc(){
    if(this.selectShopCode === '401' || this.selectShopCode === '411') {
    if(this.selectEquipCode === 'BA1'){
      //  let itemTemp = {"columValue":"CAR_ID_ADD","columLabel":"CARID","checked":true}
      let isExsit = true ;
      let groupColumListTemp = [] ;
      let itemTemp = {"columValue":"CAR_ID_ADD","columLabel":"CARID","checked":true};
      groupColumListTemp.push(itemTemp);
      this.groupColumList = this.groupColumList.forEach((item)=>{
        groupColumListTemp.push(item);
        if(item.columValue === 'CAR_ID_ADD')  {
          isExsit = false ;
        }
      })
      if(isExsit){
        this.groupColumList = groupColumListTemp;
        this.groupArray.push("CAR_ID_ADD") ;
      }
    }
    if(this.selectEquipCode !== 'RF' && this.selectEquipCode !== 'BA1' ){
      if(this.selectShopCode === '401') {
          //日期重置 
          this.searchV0.endDate = moment(new Date()).add(14, "days").format(this.mdateFormat) ;
      }
     
      // 移除carid
      this.groupColumList = this.groupColumList.filter((item)=>{
        return item.columValue !== 'CAR_ID_ADD'
      })
      this.groupArray = this.groupArray.filter((val)=>{ return val !=="CAR_ID_ADD"}) ;
      this.columnDefs.forEach((item,index,array)=>{
        if(item.field === 'CAR_ID_ADD' || item.field === 'CAR_EPST_ADD' || item.field === 'CAR_LPST_ADD'  || item.field === 'CAR_WEIGHT_ADD' ) {
          this.columnDefs[index].hide = true ;
        }

      })

      this.outsideColumnDefs.forEach((item,index,array)=>{
        if(item.field === 'CAR_ID_ADD' || item.field === 'CAR_EPST_ADD' || item.field === 'CAR_LPST_ADD'  || item.field === 'CAR_WEIGHT_ADD' ) {
          this.outsideColumnDefs[index].hide = true ;
        }
      })
    } else {
      this.columnDefs.forEach((item,index,array)=>{
        if(item.field === 'CAR_ID_ADD' || item.field === 'CAR_EPST_ADD' || item.field === 'CAR_LPST_ADD'  || item.field === 'CAR_WEIGHT_ADD' ) {
          this.columnDefs[index].hide = false ;
        }

      })

      this.outsideColumnDefs.forEach((item,index,array)=>{
        if(item.field === 'CAR_ID_ADD' || item.field === 'CAR_EPST_ADD' || item.field === 'CAR_LPST_ADD'  || item.field === 'CAR_WEIGHT_ADD' ) {
          this.outsideColumnDefs[index].hide = false ;
        }
      })
    }
    console.log("columnDefs2:" + JSON.stringify(this.columnDefs))
   // this.gridOptionsModal.api.setColumnDefs(this.outsideColumnDefs)  ;
    this.gridOptions.api.setColumnDefs(this.columnDefs)  ;
    //this.gridOptionsRowDataModal.api.setColumnDefs(this.columnDefs) ;
    //console.log("columnDefs:" + JSON.stringify(this.columnDefs)) ;
    //console.log("outsideColumnDefs:" + JSON.stringify(this.outsideColumnDefs)) ;
  }
    this.originalData = [] ;
    this.rowData = [] ;
    this.getTableData() ;
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
    console.log("分组明细拖拽")
    this.saveLoading2 = true ;
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
    this.saveLoading2 = false ;
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
    //this.rowSortedData = [...itemsToUpdate];
    this.rowSortedData = itemsToUpdate;
    this.gridOptionsRowDataModal.api.setRowData(this.rowSortedData)
    //console.log('onRowDragEndRowDataModal2:', JSON.stringify(this.rowSortedData) );
  }
  /***
   *excel模式微調
   */
   onRowDragEndRowDataOnExcelModal(e: RowDragEndEvent) {
    console.log("微调明细test")
    var itemsToUpdate = [];
    this.excelModelGridOptions.api.forEachNode((rowNode,index)=>{
     // console.log("index: " + index + ",rowNode:" +JSON.stringify(rowNode.data))
      itemsToUpdate.push(rowNode.data);
    })
    console.log('onRowDragEndRowDataModal:', JSON.stringify(itemsToUpdate) );
    //this.rowSortedData = [...itemsToUpdate];
    this.rowExcelModelData = itemsToUpdate;
    this.excelModelGridOptions.api.setRowData(this.rowExcelModelData)
    //console.log('onRowDragEndRowDataModal2:', JSON.stringify(this.rowSortedData) );
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
    let rowDataTemp = [] ;
    //前一條數據
    let preGroupString = "" ;
    let preGroupObject = {} ;
    this.originalData = JSON.parse(localStorage.getItem("originalData"))
    //console.log("this.originalData localStorage 1 :" + localStorage.getItem("originalData") ) ;
    let originalDataTemp:any[] = [...this.originalData]
    //遍歷原始數據
    originalDataTemp.forEach((item,index,array)=>{
      //遍歷出每一筆數據按照分群結果拼接,逗號隔開
      //將分群欄位的內容進行拼接 以判斷分群界限
      let currentGroupString = ""
      for(let i = 0 ; i < this.groupArray.length ; i ++) {
        let key = this.groupArray[i]
        if(i === 0) {
          currentGroupString += item[key] ;
        } else {
          currentGroupString += "," + item[key] ;
        }
      }
         // console.log("上個分組：" +index+ ":"+ JSON.stringify(this.groupArray)) 
        // console.log("當前分組：" + JSON.stringify(currentGroupString)) 
       
        //取出每一個key值進行拼接
        if(index === 0) {
          preGroupString = currentGroupString ;
          preGroupObject = item ;
          if(originalDataTemp.length === 1) {
            rowDataTemp.push(this.pushDataBeforeFormat(preGroupObject)) ;
          }
         
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
                  // 將所有的分群進行拼接，逗號隔開
                  if(item[key] !== null) {
                    let newStr = preGroupObject[key] + ',' + item[key] ;
                    preGroupObject[key] = newStr
                  } else {
                    preGroupObject[key] = preGroupObject[key]
                  }
                  
                 /** ========== 舊算法 */
               // console.log("this.columKeyType[key]:" +this.columKeyType[key])
                //如果不是分組欄位，數字加和，字符串拼接
                //如果不是數字
                /*if(this.columKeyType[key] === 0 || this.columKeyType[key] === '0') {
                  if(key === 'sortId') {
                    let newStr = preGroupObject[key] + ',' + item[key] ;
                    preGroupObject[key] = newStr
                  } else if(key === 'START_DATE_C' || key === 'END_DATE_C')  {
                    let newStr = preGroupObject[key] + ',' + item[key] ;
                    preGroupObject[key] = newStr
                  }
                  else {
                    let newStr =  item[key] ;
                      preGroupObject[key] = newStr
                  }
                } else { // 如果是數子
                  //   console.log("非分群 數字：" + key + ":" + preGroupObject[key]) ;
                  //preGroupObject[key] =  Number(preGroupObject[key]).toFixed(2)
                  preGroupObject[key] +=  item[key];  
                   //結束時間顯示
                   if(key === 'END_DATE_C') {
                    console.log("結束時間2END_DATE_C ：" + item[key]) 
                  }
                 
                }
              /** ========== 舊算法 */
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
  // console.log("寫入數據分群：" + JSON.stringify(preGroupObject) )
  Object.keys(preGroupObject).forEach((key)=>{
    //处理不是id的栏位
    if(key !== 'sortId') { 
      if(preGroupObject[key] !== null) {
        // 開始時間取第一筆
        if(key === 'START_DATE_C') {
         // preGroupObject[key] = ""
        let  startDateArray =   preGroupObject[key].toString().split(',')[0]
        preGroupObject[key] = startDateArray
        } else if(key === 'END_DATE_C'){ // 結束時間取左後一筆
          let endDateArrayLen = preGroupObject[key].toString().split(',').length ;
          let  endDateArray =   preGroupObject[key].toString().split(',')[endDateArrayLen - 1]
          preGroupObject[key] = endDateArray
         // preGroupObject[key] = ""
        } else if( key === 'NEXT_SCH_SHOP_CODE') {  // 若果是下站別 逗號隔開 去重復
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          let uniqueArr = arr.filter((value, index, self) => self.indexOf(value) === index); // 过滤掉重复项
          const filteredArray: string[] = uniqueArr.filter(str => str !== null && str !== 'null');
         
          preGroupObject[key] = filteredArray.join(','); 

        }else if( key === 'PLAN_WEIGHT_I') {  // 若果是計劃重量 加總 
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          let numArr = arr.map(Number); // 将字符数组转换为数字数组
          let sum = numArr.reduce((acc, curr) => acc + curr, 0); // 计算数字数组的总和
          preGroupObject[key] = sum ;

        }else if( key === 'SFC_SHOP_CODE') {  // 若果是現況站別 逗號
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          let uniqueArr = arr.filter((value, index, self) => self.indexOf(value) === index); // 过滤掉重复项
          const filteredArray: string[] = uniqueArr.filter(str => str !== null && str !== 'null');
          preGroupObject[key] = filteredArray.join(','); 

        }
        else if( key === 'WEIGHT') {  // 若果是現況重量 加總 
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          let numArr = arr.map(Number); // 将字符数组转换为数字数组
          let sum = numArr.reduce((acc, curr) => acc + curr, 0); // 计算数字数组的总和
          preGroupObject[key] = sum ;

        }else if( key === 'OUTPUT_SHAPE') {  // 若果是產出形態 逗號隔開 去重復
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          let uniqueArr = arr.filter((value, index, self) => self.indexOf(value) === index); // 过滤掉重复项
          preGroupObject[key] = uniqueArr.join(','); 

        }else if( key === 'TC_TEMPERATURE') {  // 若果是TC_溫度 從低到高
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          arr.sort((a, b) => +a - +b); // 对数组进行从小到大排序
          let r = arr[0] + ' ~ ' + arr[arr.length - 1] ;
          preGroupObject[key] = r 

        }else if( key === 'TC_FREQUENCE') {  // 若果是TC_頻率 從低到高
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          arr.sort((a, b) => +a - +b); // 对数组进行从小到大排序
          let r = arr[0] + ' ~ ' + arr[arr.length - 1] ;
          preGroupObject[key] = r 
        }else if( key === 'BA1_TEMPERATURE') {  // 若果是BA_溫度 從低到高
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          arr.sort((a, b) => +a - +b); // 对数组进行从小到大排序
          let r = arr[0] + ' ~ ' + arr[arr.length - 1] ;
          preGroupObject[key] = r 
        }else if( key === 'INPUT_DIA') {  // 若果是投入尺寸 從低到高
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          arr.sort((a, b) => +a - +b); // 对数组进行从小到大排序
          let r =  arr[0] === arr[arr.length - 1] ?  arr[0] :  arr[0] + ' ~ ' + arr[arr.length - 1] ;
          preGroupObject[key] = r 
        } else if( key === 'OUT_DIA') {  // 若果是產出尺寸 從低到高
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          arr.sort((a, b) => +a - +b); // 对数组进行从小到大排序
          let r =  arr[0] === arr[arr.length - 1] ?  arr[0] :  arr[0] + ' ~ ' + arr[arr.length - 1] ;
          preGroupObject[key] = r 
        }  
        else if( key === 'OP_CODE') {  // 若果是作業代碼 從低到高
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          arr.sort((a, b) => +a - +b); // 对数组进行从小到大排序
          let r = arr[0] + ' ~ ' + arr[arr.length - 1] ;
          preGroupObject[key] = r 
        }  
        else if( key === 'DATE_DELIVERY_PP') {  // 若果是交期 從低到高
          let dateTimeStrings = preGroupObject[key].toString().split(",");
          const filteredArray: string[] = dateTimeStrings.filter(str => str !== null && str !== 'null');
          let dateObjects = filteredArray.map((dateString) => new Date(dateString)); // 将日期字符串数组转换为日期对象数组
          dateObjects.sort((a, b) => a.getTime() - b.getTime()); // 对日期对象数组进行从小到大排序
          let r = moment(dateObjects[0]).format('YYYYMM') + ' ~ ' + moment(dateObjects[dateObjects.length - 1]).format('YYYYMM') ;
          preGroupObject[key] = r 
        }  
        else if( key === 'PST') {  // 若果是投產日 從低到高
          let dateTimeStrings = preGroupObject[key].toString().split(",");
          const filteredArray: string[] = dateTimeStrings.filter(str => str !== null && str !== 'null');
          let dateObjects = filteredArray.map((dateString) => new Date(dateString)); // 将日期字符串数组转换为日期对象数组
          dateObjects.sort((a, b) => a.getTime() - b.getTime()); // 对日期对象数组进行从小到大排序
          let r = moment(dateObjects[0]).format('YYMMDD') + ' ~ ' + moment(dateObjects[dateObjects.length - 1]).format('YYMMDD') ;
          preGroupObject[key] = r 
        }  
        else if( key === 'AUTO_FROZEN') {  // 若果是排程凍結 

        }  
        else if( key === 'DATE_PLAN_IN_STORAGE') {  // 若果是允收截止日 從低到高
          let dateTimeStrings = preGroupObject[key].toString().split(",");
          const filteredArray: string[] = dateTimeStrings.filter(str => str !== null && str !== 'null');
          let dateObjects = filteredArray.map((dateString) => new Date(dateString)); // 将日期字符串数组转换为日期对象数组
          dateObjects.sort((a, b) => a.getTime() - b.getTime()); // 对日期对象数组进行从小到大排序
          let r = moment(dateObjects[0]).format('MMDD') + ' ~ ' + moment(dateObjects[dateObjects.length - 1]).format('MMDD') ;
          preGroupObject[key] = r 
        }
        else if( key === 'NEW_EPST') {  // 若果是允收截止日 從低到高
          let dateTimeStrings = preGroupObject[key].toString().split(",");
          const filteredArray: string[] = dateTimeStrings.filter(str => str !== null && str !== 'null');
          let dateObjects = filteredArray.map((dateString) => new Date(dateString)); // 将日期字符串数组转换为日期对象数组
          dateObjects.sort((a, b) => a.getTime() - b.getTime()); // 对日期对象数组进行从小到大排序
          let r = moment(dateObjects[0]).format('YYMMDD') + ' ~ ' + moment(dateObjects[dateObjects.length - 1]).format('YYMMDD') ;
          preGroupObject[key] = r 
        }
        
        else if( key === 'STEEL_TYPE') {  // 若果是鋼種，逗號拼接
          //console.log(" 鋼種 : " +  preGroupObject[key])
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          let uniqueArr = arr.filter((value, index, self) => self.indexOf(value) === index); // 过滤掉重复项
          preGroupObject[key] = uniqueArr.join(','); 
        }  
        else if( key === 'GRADE_GROUP') {  // 若果是鋼種，逗號拼接
          //console.log(" 鋼種 : " +  preGroupObject[key])
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          let uniqueArr = arr.filter((value, index, self) => self.indexOf(value) === index); // 过滤掉重复项
          preGroupObject[key] = uniqueArr.join(','); 
        } 
        else if( key === 'TIMEDIFFFLAG_ADD') { // 如果是包含跳的時間
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          arr.sort((a, b) => +a - +b); // 对数组进行从小到大排序
          let r = arr[0] + ' ~ ' + arr[arr.length - 1] ;
          preGroupObject[key] = arr[arr.length - 1]
        }
       else if( key === 'ID_NO') { // MO逗號隔開
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          preGroupObject[key] =arr ;
        } 
        else if( key === 'SALE_ORDER_ITEM_ADD') { // MO逗號隔開
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          preGroupObject[key] =arr ;
        } 
        else {
         // let newStr = preGroupObject[key].toString().replace('null,','') //.toString().replace("null","");
          let arr = preGroupObject[key].toString().split(","); // 将字符串分割为一个字符数组
          let filteredArr = arr.filter((item) => item !== "null"); // 过滤掉数组中的 null 元素
          preGroupObject[key] = filteredArr[0]
        }
      } else {
       // 當前值為空
        if(key === 'START_DATE_C' || key === 'END_DATE_C') {
          preGroupObject[key] = "" 
        } else {
          let newStr = preGroupObject[key]//.toString().replace("null","");
          preGroupObject[key] = newStr
        }
      }


      /*** ======舊算法 */
    //当前栏位不是数字
    /*
    if(this.columKeyType[key] === 0 || this.columKeyType[key] === '0') {
      //如果当前值不为空
      if(preGroupObject[key] !== null) {
      
        if(key === 'START_DATE_C') {
         // preGroupObject[key] = ""
        let  startDateArray =   preGroupObject[key].toString().split(',')[0]
        preGroupObject[key] = startDateArray
        } else if(key === 'END_DATE_C'){
          let endDateArrayLen = preGroupObject[key].toString().split(',').length ;
          let  endDateArray =   preGroupObject[key].toString().split(',')[endDateArrayLen - 1]
          preGroupObject[key] = endDateArray
         // preGroupObject[key] = ""
        } else {
          let newStr = preGroupObject[key].toString().replace('null,','') //.toString().replace("null","");
          preGroupObject[key] = newStr
        }
      } else {
       // 當前值為空
        if(key === 'START_DATE_C' || key === 'END_DATE_C') {
          preGroupObject[key] = "" 
        } else {
          let newStr = preGroupObject[key]//.toString().replace("null","");
          preGroupObject[key] = newStr
        }
      }
     //当前栏位是数字
    } else {
      if(Number(preGroupObject[key]) > 0) {
        preGroupObject[key] =  Number(preGroupObject[key]).toFixed(2);
      }  
    }
    */
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
    //this.nzMessageService.info("開發中");
    /*if(this.category === 'M') {
      this.nzMessageService.info("當前機台已送出");
      return ;
    }*/
    let comitData = [{fcpVer:this.selectFcpVer,shopCode:this.selectShopCode,mesPublishGroup:"",publishType:"0"}]
    this.isConfirmLoading = true ;
    this.mshService.sendSortedDataToMESBatch(comitData).subscribe(res=>{
      this.isConfirmLoading = false ;
      this.shopMachineList = []
      let result:any = res ;
      if(result.code === 200) {
        this.nzMessageService.success(result.message) ;
        this.modalTableRowDataVisible = false ;
        this.getTableData() ;
        
      } else {
        this.nzMessageService.error(result.message) ;
      }
      
    });
   }

   saveSortedModal(flag:string){
     if(this.selectFcpVerObj.fcpLockStatus === '0') {
      this.nzMessageService.error("必須是鎖定版本才能保存！") ;
      return ;
     }
     
    //  if(this.category === 'M') {
    //   this.nzMessageService.error("當前版已送入MES，不能保存！") ;
    //   return ;
    //  }
    
     this.saveLoading = true ;
     this.isLoading = true ;

     //調整接收數據  id carId
     this.finalChangeDataIds = [] ;
     //原始數據調取
     this.originalData = JSON.parse(localStorage.getItem("originalData"))
     // 微调确认
     if(flag === '3') {
      this.rowSortedData.forEach((item,index,array)=>{
        if(this.selectEquipCode === 'RF') {
          this.finalChangeDataIds.push({id:item.ID,carId:item.CAR_ID_ADD}) ;
        } else{
          this.finalChangeDataIds.push({id:item.ID}) ;
        }
        
      })
     } else {  //内外层 遍歷分群數據
      this.rowData.forEach((item,index,array)=>{
        let ids = item.sortId.split(',')
        ids.forEach((val)=>{
         this.finalChangeDataIds.push({id:this.originalData[val-1].ID,carId:this.originalData[val-1].CAR_ID_ADD}) 
        })
      })
     }
    
    
     let finalChangeDataTemp = [] ;
     this.finalChangeDataIds.forEach((item,index,array)=>{
      if(this.selectEquipCode === 'RF') {
       // finalChangeDataTemp.push({id:item,sort:index + 1,carId:item.CAR_ID_ADD})
        finalChangeDataTemp.push({id:item.id,sort:index + 1,carId:item.carId})
      }  else {
        finalChangeDataTemp.push({id:item.id,sort:index + 1})
      }
     
     }) ;
    // console.log("使用："+this.finalChangeDataIds)
    // this.originalData = JSON.parse(localStorage.getItem("originalData")) ;
    // console.log("使用："+this.finalChangeDataIds)
   // let _param = {ids:this.finalChangeDataIds.toString()}
   let saveSortData = {saveByIDSList:finalChangeDataTemp,fcpNumber:this.fcpNumber}
    this.mshService.saveSortData(saveSortData).subscribe(res=>{
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
      //this.groupColumList = result.data ;
      if(result.code !== 200) {
        this.nzMessageService.error(result.message)
      } else {
       // this.getSetColumByUser() ;
        this.getTableData() 
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
   // 搜索
   handleSearchText(){
    // this.gridOptions.api.refres(this.rowData) ;
    // 遍歷 SALE_ORDER
    console.log("數值：" + this.searchText);
    this.searchLoading = true ;
    let countTemp = 0 ;
    let rowIndexToScrollTo = 0 ;
    this.rowData.forEach((item,index,array)=>{
      if(this.searchText === '') {
        this.rowData[index].COLORFLAG = "0" ;
        countTemp = 0;
      } else {
      let searchTextArray = this.searchText.split(',') ;
      if(searchTextArray.some(element => item.ID_NO.includes(element)) || searchTextArray.some(element => item.SALE_ORDER_ITEM_ADD.includes(element)) ) {
        rowIndexToScrollTo = rowIndexToScrollTo === 0 ? index : rowIndexToScrollTo ;
        this.rowData[index].COLORFLAG = "1" ;
        countTemp ++ ;
       
      } else {
        this.rowData[index].COLORFLAG = "0" ;
      }
      }
     
    })
    this.searchCount = countTemp ;
    if(countTemp >= 1) {
      this.gridOptions.api.ensureIndexVisible(rowIndexToScrollTo, 'middle');
    }
    this.gridOptions.api.setRowData(this.rowData);
    this.searchLoading = false ;
   }

    /**EXCEL FUNCTION START parameter */

    // ExcelModelModal 顯示模式
    handleExcelModelModal(){
      this.rowExcelModelData = [] ;
      this.excelModelModalIsVisible = !this.excelModelModalIsVisible ;
    }
    // Batch批量使用 
    handleExcelBatchModelModal(){
      this.rowExcelBatchModelData = [] ;
      this.excelBatchColumnDefs = [] ;
      this.excelBatchModelModalIsVisible = !this.excelBatchModelModalIsVisible ;
    }

    comitExcelBatchModelModal(){
      if(this.selectShopCode !== '453' && this.selectShopCode !== '452') {
        this.nzMessageService.error("指定機台才可以使用當前功能")
        return ;
      }
      if(this.rowExcelBatchModelData.length < 1) {
        this.nzMessageService.error("請先匯入排程數據")
        return ;
      }
      
      const comitData = [] ;
      this.rowExcelBatchModelData.forEach((item,index,array)=>{
        if(item.ID === "") {
          this.nzMessageService.error("ID不能為空")
          return ;
        }
        if(item.ACT_PST_MACHINE_ADD === "") {
          this.nzMessageService.error("實際機台不能為空")
          return ;
        }
        if(item.ACT_PST_MACHINE_ADD !== item.PST_MACHINE_ADD  ) {
          if(item.ACT_PST_MACHINE_ADD !== item.BEST_MACHINE_ADD && item.ACT_PST_MACHINE_ADD !== item.MACHINE1_ADD && item.ACT_PST_MACHINE_ADD !== item.MACHINE2_ADD && item.ACT_PST_MACHINE_ADD !== item.MACHINE3_ADD ) {
            this.nzMessageService.error("替換機台時，提換機台必須在允許替換的機台中")
            return ;
          }
         
        }

       let BEST_MACHINE_ADD_Temp = ""
       if(item.BEST_MACHINE_ADD === undefined || item.BEST_MACHINE_ADD === null) {
        BEST_MACHINE_ADD_Temp = null
       } else {
        BEST_MACHINE_ADD_Temp = item.BEST_MACHINE_ADD
       }

       let MACHINE1_ADD_Temp = ""
       if(item.MACHINE1_ADD === undefined || item.MACHINE1_ADD === null) {
        MACHINE1_ADD_Temp = null
       } else {
        MACHINE1_ADD_Temp = item.MACHINE1_ADD
       }

       let MACHINE2_ADD_Temp = ""
       if(item.MACHINE2_ADD === undefined || item.MACHINE2_ADD === null) {
        MACHINE2_ADD_Temp = null
       } else {
        MACHINE2_ADD_Temp = item.MACHINE2_ADD
       }
       let MACHINE3_ADD_Temp = ""
       if(item.MACHINE3_ADD === undefined || item.MACHINE3_ADD === null) {
        MACHINE3_ADD_Temp = null
       } else {
        MACHINE3_ADD_Temp = item.MACHINE3_ADD
       }
       let obj = {id:item.ID,sort:item.sort,actPstMachine:item.ACT_PST_MACHINE_ADD,pstMachine:item.PST_MACHINE_ADD,totalWorkTime:item.TOTAL_WORK_TIME_ADD,bestMachine:BEST_MACHINE_ADD_Temp,workHours:item.WORK_HOURS_ADD,machine1:MACHINE1_ADD_Temp,workHours1:item.WORK_HOURS1_ADD,machine2:MACHINE2_ADD_Temp,workHours2:item.WORK_HOURS2_ADD,machine3:MACHINE3_ADD_Temp,workHours3:item.WORK_HOURS3_ADD,fcpUseFlag:item.FCP_USE_FLAG} ;
       comitData.push(obj) ;
      })
      //console.log(JSON.stringify(comitData)) ;
      this.handleComitExcelBatchModelConfirmLoading  = true ;
      this.mshService.saveChangeMachineBatch(comitData).subscribe(res=>{
        this.handleComitExcelBatchModelConfirmLoading  = false ;
        let result:any = res ;
        if(result.code == 200) {
          this.nzMessageService.success(result.message)
          this.excelBatchModelModalIsVisible = false
          this.uploadFile = null
          this.getTableData()
        } else{
          this.nzMessageService.error(result.message)
        }
      })



    }
    // 批量導出排程模版
    exportBatchModalBtn(){
      this.getExportDataByShopCode();
    }


    //確認使用當前排程
    comitExcelModelModal(){
      if(this.rowExcelModelData.length < 1) {
        this.nzMessageService.error("請先匯入排程數據")
        return ;
      }
      let finalChangeDataTemp = [] ;
      this.rowExcelModelData.forEach((item,index,array)=>{
        if(this.selectEquipCode === 'RF') {
          finalChangeDataTemp.push({id:item.ID,sort:index + 1,carId:item.CAR_ID_ADD})
        }  else {
          finalChangeDataTemp.push({id:item.ID,sort:index + 1})
        }
      }) 
      this.handlecomitExcelModelConfirmLoading = true
      let saveSortData = {saveByIDSList:finalChangeDataTemp,fcpNumber:this.fcpNumber}
      this.mshService.saveSortData(saveSortData).subscribe(res=>{
        this.handlecomitExcelModelConfirmLoading  = false ;
        let result:any = res ;
        if(result.code == 200) {
          this.nzMessageService.success(result.message)
          this.excelModelModalIsVisible = false
          this.uploadFile = null
          this.getTableData()
        } else{
          this.nzMessageService.error(result.message)
        }
      })

    }

    importBtn(){

    }
    // excel檔名
    incomingfile(event) {
      this.uploadFile = event.target.files[0]; 
      console.log("incomingfile e : " + this.uploadFile);
      let lastname = this.uploadFile.name.split('.').pop();
      console.log("lastname:" + lastname)
      console.log("exportFileName:" + this.exportFileName)
      if(!this.uploadFile.name.includes(this.exportFileName)) {
        this.nzMessageService.error('請使用同一份文件檔案。');
        this.clearFile();
        return;
      }
      if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
        this.nzMessageService.error('檔案格式錯誤,僅限定上傳 Excel 格式。');
        this.clearFile();
        return;
      }
    }
    //清除文件
    clearFile() {
      this.uploadFile = null ;
      document.getElementsByTagName('input')[0].value = '';
  
    }

    handleUploadFile(flag){
      console.log("上傳文件： "+this.uploadFile)
      if(this.uploadFile === null || this.uploadFile === undefined) {
        this.nzMessageService.error("請先上傳檔案")
        return
      }
      let lastname = this.uploadFile.name.split('.').pop();
      console.log("this.file.name: "+this.uploadFile.name);
      console.log("incomingfile e : " + this.uploadFile);
      if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
        this.nzMessageService.error('檔案格式錯誤,僅限定上傳 Excel 格式。');
        this.clearFile();
        return;
      } else if(!this.uploadFile.name.includes(this.exportFileName)) {
        this.nzMessageService.error('請使用同一份文件檔案。');
        this.clearFile();
        return;
      }
      else {
        console.log("上傳檔案格式沒有錯誤");
        if(flag === "2") {
          if(this.excelBatchColumnDefs.length < 1){
            this.nzMessageService.error('請先下載模板！');
            return ;
          }
        }
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet:any = workbook.Sheets[first_sheet_name];
          this.upLoadExcelData = XLSX.utils.sheet_to_json(worksheet, {raw:true});
          this.importExcel(this.upLoadExcelData,flag);
          
        }
        fileReader.readAsArrayBuffer(this.uploadFile);
      }
    }

    importExcel(_data,flag) {
      console.log("EXCEL 資料上傳檢核開始:" + flag);
      var upload_data = [];
      for(let i=0 ; i < _data.length ; i++) {
        console.log("數據： " + JSON.stringify(_data[i]));
        let dataTemp = _data[i];
        const myObject = {};
        if(flag === '1') {
          this.columnDefs.forEach((item2,index2,array2)=>{
            myObject[item2.field] = dataTemp[item2.headerName] 
          })
        } else if(flag === '2') {
          this.excelBatchColumnDefs.forEach((item2,index2,array2)=>{
            myObject[item2.field] = dataTemp[item2.headerName] 
          })
        }
        upload_data.push(myObject);
      }
      if(flag === '1') {
        this.rowExcelModelData = upload_data ;
        this.excelModelGridOptions.api.setRowData(this.rowExcelModelData) ;
      } else if(flag === '2') {
        this.rowExcelBatchModelData = upload_data ;
        this.excelBatchModelGridOptions.api.setRowData(this.rowExcelModelData) ;
      }
   

    }

    /**EXCEL FUNCTION END */

    /***子層開始 */
    exportRowSelectData(){
    let tableName = 'EXPORTDATAINFO' ;
    if(this.rowSelectData.length < 1) {
      this.nzMessageService.error("沒有可以導出的數據，請查詢確認！")
      return 
    }
    this.excelService.exportAsExcelFile(this.rowSelectData, tableName,this.export.header);

    }
    exportRowSortedData(){
      let tableName = 'EXPORTALLDATAINFO' ;
      if(this.rowSortedData.length < 1) {
        this.nzMessageService.error("沒有可以導出的數據，請查詢確認！")
        return 
      }
      this.excelService.exportAsExcelFile(this.rowSortedData, tableName,this.export.header);
    }

     /***子層結束 */

     /***機台更換開始 */
     //更換機台，將數據從子層調出
     handleChangeMachineModal(){
       // 可選機台
       this.equipCodeChangeList =  [] ;
      
      this.selectChangeEquipCode = "" ;
      // 過濾掉非當前機台
      /*this.equipCodeChangeListOption = this.equipCodeChangeList.filter((item)=>{
         return item.value !== this.selectEquipCode
      })*/

      let changeMachineTB = [] ;
      let childChangeMachineListTotal = [] ;
      // 子層數據源
      this.rowSelectData.forEach((item,index,array)=>{

        let childChangeMachineList = [] ;
        if(item.MACHINE1_ADD !== null && item.MACHINE1_ADD !== '' && item.MACHINE1_ADD !== undefined ){
          childChangeMachineList.push({"label":item.MACHINE1_ADD,"value":item.MACHINE1_ADD}) ;
          childChangeMachineListTotal.push(item.MACHINE1_ADD)
        }
        if(item.MACHINE2_ADD !== null && item.MACHINE2_ADD !== '' && item.MACHINE2_ADD !== undefined ){
          childChangeMachineList.push({"label":item.MACHINE2_ADD,"value":item.MACHINE2_ADD})
          childChangeMachineListTotal.push(item.MACHINE2_ADD)
        }
        if(item.MACHINE3_ADD !== null && item.MACHINE3_ADD !== '' && item.MACHINE3_ADD !== undefined){
          childChangeMachineList.push({"label":item.MACHINE3_ADD,"value":item.MACHINE3_ADD})
          childChangeMachineListTotal.push(item.MACHINE3_ADD)
        }
        if(item.BEST_MACHINE_ADD !== null && item.BEST_MACHINE_ADD !== '' && item.BEST_MACHINE_ADD !== undefined){
          childChangeMachineList.push({"label":item.BEST_MACHINE_ADD,"value":item.BEST_MACHINE_ADD})
          childChangeMachineListTotal.push(item.BEST_MACHINE_ADD)
        }
       //  childChangeMachineList = childChangeMachineList.filter((item, index, self) => self.indexOf(item.value) === index);
       //  console.log("子層數據源：" + JSON.stringify(item))
        const uniqueNameSet = new Set<string>();
        const uniqueItems = childChangeMachineList.filter(item => {
          if (!uniqueNameSet.has(item.value)) {
            uniqueNameSet.add(item.value);
            return true;
          }
          return false;
        });
       let changeMachineTBTemp = {"ID":item.ID,"ID_NO":item.ID_NO,"PST_MACHINE":item.PST_MACHINE,"PST_MACHINE_NEW":"", "isEdit":false ,checked:false ,"childChangeMachine":uniqueItems}
        changeMachineTB.push(changeMachineTBTemp) ;
      })
       childChangeMachineListTotal = childChangeMachineListTotal.filter((value, index, self) => self.indexOf(value) === index); // 过滤掉重复项
       let changeMachineList = [] ;
       childChangeMachineListTotal.forEach((value,index,array)=>{
        changeMachineList.push({"label":value,"value":value}) 
       })
       console.log("changeMachineList length : " + JSON.stringify(changeMachineList) )
       if(changeMachineList.length < 1) {
        this.nzMessageService.error("沒有可用的替換機台") ;
        return ;
       }
        // 可選機台
      this.equipCodeChangeList =  changeMachineList ;
      //替換機台表格
      this.changeMachineModal.table.tbData = changeMachineTB ;
      console.log("changeMachineTB:" + JSON.stringify(changeMachineTB))
      
      //當前站別已配置的機台
      this.getCurrentMachineData() ;
      this.changeMachineModal.isVisible = true ;
     }
     // 機台更換選擇
     selectChangeEquipCodeFunc(){
      console.log("selectChangeEquipCode:" + this.selectChangeEquipCode)
      if(this.shopMachineList.length === 0){
        this.nzMessageService.error("當前站別沒有查到已配置機台，請刷新重試!") 
        return ;
      }
      const containsValue = this.shopMachineList.some(obj => obj.PST_MACHINE === this.selectChangeEquipCode);
      if (containsValue) {
        // 数组对象包含特定值
        
      } else {
        // 数组对象不包含特定值
        this.nzMessageService.error("當前機台未配置，請先下載數據!") ;
        return ;
      }

       this.changeMachineModal.table.tbData.forEach((item,index,arr)=>{
        // 看每組子機台包含當前機台
        let ckeckMachine = false ;
        let ckeckMachineTemp = this.changeMachineModal.table.tbData[index].childChangeMachine.filter((item)=>{
          return item.value === this.selectChangeEquipCode ;
        })
        if(ckeckMachineTemp.length > 0 ){
          this.changeMachineModal.table.tbData[index].PST_MACHINE_NEW = this.selectChangeEquipCode;
          this.changeMachineModal.table.tbData[index].checked = true ;
        }
      })
      
     }
     //機台選擇
     selectChangeEquipCodeOptionFunc(index:any){
      if(this.shopMachineList.length === 0){
        this.nzMessageService.error("當前站別沒有查到已配置機台，請刷新重試!") 
        return ;
      }
      console.log("已配置机台" + JSON.stringify(this.shopMachineList))
      console.log("选择机台：" + this.selectChangeEquipCode)
      const containsValue = this.shopMachineList.some(obj => obj.PST_MACHINE === this.changeMachineModal.table.tbData[index].PST_MACHINE_NEW);
      if (containsValue) {
        // 数组对象包含特定值
        
      } else {
        // 数组对象不包含特定值
        this.nzMessageService.error("當前機台未配置，請先下載數據!") ;
        return ;
      }

     }
     //手動修改機台
     startEdit(i:any){
      this.changeMachineModal.table.tbData[i].isEdit = !this.changeMachineModal.table.tbData[i].isEdit

     }
     // 開啟關閉更換機台窗口
     handleMachineModal(){
      this.changeMachineModal.isVisible = ! this.changeMachineModal.isVisible ;
     }

     // 選擇更換哪些機台
     handleSelectChangeMachine(){
      console.log("this.changeMachineModal.table.tbData : " + JSON.stringify(this.changeMachineModal.table.tbData))

     }

 /***機台更換開始 */
    //提交機台更換確認
     comitHandleMachineModal(){
      let comitDataTemp = [] ;
      comitDataTemp = this.changeMachineModal.table.tbData.filter((item)=>{
       return item.checked === true 
      })
      //console.log("comitDataTemp : " + JSON.stringify(comitDataTemp))
      //處理提交數據
      let comitData = []
      let checkData = true ;
      console.log("")
      comitDataTemp.forEach((item,index,value)=>{
        const containsValue = this.shopMachineList.some(obj => obj.PST_MACHINE === item.PST_MACHINE_NEW);
      if (containsValue) {
        let obj = {id:item.ID, pstMachine:item.PST_MACHINE_NEW, originalPstMachine:item.PST_MACHINE} ;
        comitData.push(obj) ;
        // 数组对象包含特定值
      } else {
        // 数组对象不包含特定值
        checkData = false ;
      }
      
      }) ;
      
      if(checkData === true) {
        //console.log("提交參數：" + JSON.stringify(comitData))
        
        this.changeMachineModal.isConfirmLoading = true ;
        this.mshService.saveChangeMachine(comitData).subscribe(res=>{
          this.changeMachineModal.isConfirmLoading = false
          let result:any = res ;
          if(result.code !== 200) {
            this.nzMessageService.error(result.message) ;
          } else {
            this.nzMessageService.success(result.message);
            this.changeMachineModal.isVisible = false ;
            this.modalTableVisible = false ;
            this.getTableData() ;
          }
        })
      } else {
        this.nzMessageService.error("存在未配置機台，請先下載數據!") ;
      }
      
     }

     //獲取當前站別配置的機台
     getCurrentMachineData(){
      this.searchV0.shopCode = this.selectShopCode ;
      this.searchV0.equipCode = this.selectEquipCode ;
      this.searchV0.fcpVer = this.selectFcpVer
      this.mshService.getCurrentMachineData(this.searchV0).subscribe(res=>{
        this.shopMachineList = []
        let result:any = res ;
        if(result.code !== 200) {
          this.nzMessageService.error(result.message) ;
        } else {
          this.shopMachineList = result.data ;
        }
        console.log("當前站別，配置機台：" + JSON.stringify(this.shopMachineList))

      });
     }
    /***機台更換結束 */

    /**同作業換車開始 */
    openSameOpCodeChangeCarModal(){
      this.changeCarFlag = '2'
      this.sameOpCodeChangeCarModal.table.tbData = [] ;
      this.handleOpCodeIsConfirmLoading = false;
      let sameOpCodeChangeCarModalTemp = [] ;
      this.rowSelectData.forEach((item,index,array)=>{
        let objTemp = {ID:item.ID,ID_NO: item.ID_NO, OP_CODE:item.OP_CODE,OLD_CAR_ID:item.CAR_ID_ADD,CAR_WEIGHT_ADD:item.CAR_WEIGHT_ADD,NEW_CAR_ID:""} ;
        sameOpCodeChangeCarModalTemp.push(objTemp);
      }) ;
      this.sameOpCodeChangeCarModal.table.tbData = sameOpCodeChangeCarModalTemp ;
      console.log("待換車：" + JSON.stringify(this.sameOpCodeChangeCarModal.table.tbData))
      this.sameOpCodeChangeCarModal.isVisible = !this.sameOpCodeChangeCarModal.isVisible ;
    }

    selectSameOpCodeCarClick(id:any,opCode:any,oldCarId:any,newCarId:any) {
      this.selectCarTable.tbData = [] ;
      let para = "id="+id +"&opCode="+opCode ;
      this.mshService.getFcpCarInfo(para).subscribe(res=>{
        let result:any = res ;
        if(result.code !== 200) {
          this.nzMessageService.error(result.message) ;
        } else {
          // 當前排程ID
          this.selectNewID = id 
          // 將當前CARID 過濾
          this.selectCarTable.tbData = result.data.filter((item)=>{
            return item.BATCH_411_CAR_ID !== oldCarId ;
          }) ;
          //將配車選項重置false 
          this.selectCarTable.tbData.forEach((item, index, array)=>{
            if(item.BATCH_411_CAR_ID === newCarId) {
              this.selectCarTable.tbData[index].checked = true ;
            } else {
              this.selectCarTable.tbData[index].checked = false ;
            }
            
          })
       //開啟關閉選擇
        this.handleSelectCarModal() ;
        }
         })
    }

    //清除已經選擇的CARID
    handleClearCarID(id:any){
      this.sameOpCodeChangeCarModal.table.tbData.forEach((item,index,array)=>{
        if(item.ID === id) {
          this.sameOpCodeChangeCarModal.table.tbData[index].NEW_CAR_ID = '' ;
    
        }
      })

    }
    handleSameOpCodeChangeCarModal(){
      this.sameOpCodeChangeCarModal.isVisible = !this.sameOpCodeChangeCarModal.isVisible ;
    }
    // 保存同作業換車
    saveChangeSameOpCodeCar(){

      console.log("換車批量存檔:" + JSON.stringify(this.sameOpCodeChangeCarModal.table.tbData));
      let saveSameOpCodeChangeCarData = []
      this.sameOpCodeChangeCarModal.table.tbData.forEach((item,index,array)=>{
      if(item.NEW_CAR_ID  !== "") {
        let saveOpCodeAndCarDataTemp = {id:item.ID ,newOpCode:"",carId:item.NEW_CAR_ID,originalCarId:item.OLD_CAR_ID}
        saveSameOpCodeChangeCarData.push(saveOpCodeAndCarDataTemp)
      }
      })
      if(saveSameOpCodeChangeCarData.length < 1){
        this.nzMessageService.error("未選擇作業代碼及車次")
        return
      }
      console.log("保存數據:" + JSON.stringify(saveSameOpCodeChangeCarData));
      this.handleOpCodeIsConfirmLoading = true
      console.log("有效存檔:" + JSON.stringify(saveSameOpCodeChangeCarData));
      this.mshService.saveSameOpCodeChangeCar(saveSameOpCodeChangeCarData).subscribe(res=>{
        this.handleOpCodeIsConfirmLoading = false
        let result:any = res ;
        if(result.code !== 200) {
          this.nzMessageService.error(result.message) ;
        } else {
          this.nzMessageService.success(result.message);
          this.sameOpCodeChangeCarModal.isVisible = false ;
          this.modalTableVisible = false ;
          this.getTableData() ;
        }
      })

    }
    /**FCP 使用 */
    // 開啟關閉可使用
    toggleDisabled(){
      this.fcpNumberIsDisabled = !this.fcpNumberIsDisabled;
    }
    

    /**同作業換車結束 */
    handleTest(index:any){
      if(index === '1') {
        let comitData = [
          {fcpVer:"R20230626110457",shopCode:"420",mesPublishGroup:"CTB"},
          {fcpVer:"R20230626110457",shopCode:"430",mesPublishGroup:"CTB"}]
          this.mshService.sendSortedDataToMESBatch(comitData).subscribe(res=>{
          let result:any = res ;
          console.log("jieguo ：" + res)
        })
      } else if(index === '3') { //sendDataToAutoCompagin
        let comitData = [
          {fcpVer:"F20230712083899",shopCode:this.selectShopCode,mesPublishGroup:"" ,planStartTime:"2023-07-10 00:00:00" ,planEndTime:"2023-07-26 23:59:59",publishType:'0'}]
          this.mshService.sendDataToAutoCompagin(comitData).subscribe(res=>{
          let result:any = res ;
          console.log("jieguo ：" + res)
        })
      }
      else if(index === '2'){
        
        this.mshService.downloadAutoData(this.selectFcpVer).subscribe(res=>{
          this.isLoading = false ;
          let result:any = res ;
          let message = result.message ;
          this.nzMessageService.info(message);
          this.originalData = [] ;
          this.rowData = [] ;
          this.getFcpVerList() ;
         
        });

      }
      
    }

}
