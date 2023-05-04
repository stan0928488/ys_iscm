import { AfterViewInit, Component } from '@angular/core';
import { MSHService } from 'src/app/services/MSH/MSH.service';
import {NzModalService} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {MSHI003} from "./MSHI003.model";
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { PrimeDatePickerCellEditorComponent } from './prime-date-picker-cell-editor';
import { DataTransferService } from 'src/app/services/MSH/Data.transfer.service';
import { CookieService } from 'src/app/services/config/cookie.service';

class MSHI003Payload {
  shopCode : string[];
  equipCode : string[];
  idNo : string;
  isHold : boolean;
  constructor(_shopCode : string[],
              _equipCode : string[],
              _idNo : string,
              _isHold : boolean){
    this.shopCode = _shopCode;
    this.equipCode = _equipCode;
    this.idNo = _idNo;
    this.isHold = _isHold;        
  }
}

@Component({
  selector: 'app-MSHI003',
  templateUrl: './MSHI003.component.html',
  styleUrls: ['./MSHI003.component.css'],
  providers:[NzMessageService]
})
export class MSHI003Component implements AfterViewInit {

  USERNAME;
  PLANTCODE;

  isSpinning = false;

  // 站別下拉選項
  shopCodeOfOption : string[] = [];
  // 使用者選中哪些站別
  shopCodeInputList : string[] = [];
  // 站別下拉是否正在載入選項
  shopCodeLoading = false;

  // 機台下拉選項
  equipCodeOfOption : string[] = [];
  // 使用者選中哪些機台
  equipCodeInputList : string[] = [];
  // 機台下拉是否正在載入選項
  equipCodeLoading = false;

  // mo輸入
  moInput = "";

  // hole狀態選擇
  holeChecked = false;


  MSHI003DataList : MSHI003[] = [];

  // 存放待更新或新增的row資料
  MSHI003PendingDataList : MSHI003[] = [];

  // 存放使用者搜尋的條件
  payloadcache : MSHI003Payload;

  gridOptions = {
    defaultColDef : {
      sortable: true,
      resizable: true,
    },
    components: {
      primeDatePickerCellEditorComponent: PrimeDatePickerCellEditorComponent,
    },
  };

  constructor(private mshService:MSHService,
              private Modal:NzModalService,
              private message:NzMessageService,
              private dataTransferService:DataTransferService,
              private cookieService: CookieService) { 

    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANTCODE = this.cookieService.getCookie("plantCode");

    this.dataTransferService.getData().subscribe((rowData) => {
      console.log('Data received: ==> ', JSON.stringify(rowData));

      if(_.isNil(rowData.id)) return;

      if(_.isEmpty(this.MSHI003PendingDataList)){
        this.MSHI003PendingDataList.push(rowData);
        return;
      }

      const existIndex = this.MSHI003PendingDataList.findIndex(item => item.id === rowData.id);

      // 找不到同樣id的資料則進行push
      if(existIndex < 0){
        this.MSHI003PendingDataList.push(rowData);
      }

    });

  }
  
  ngAfterViewInit(): void {
    
  }

  columnDefs : ColDef[]   = [
    {headerName: 'MO', field: 'idNo', width: 100},
    {headerName: '現況站別', field: 'shopCode', width: 100},
    {headerName: '訂單號碼', field: 'saleOrder', width: 100},
    {headerName: '項次', field: 'saleItem', width: 100},
    {headerName: '客戶', field: 'custAbbr', width: 100},
    {headerName: '放行碼', field: 'procStatus', width: 100},
    {headerName: '現況尺寸', field: 'sfcDia', width: 100},
    {headerName: '現況MIC', field: 'finalMicNo', width: 100},
    {headerName: '製成碼', field: 'processCode', width: 100},
    {headerName: 'EPST', field: 'epst', width: 100},
    { 
      headerName: '調整日期', 
      field: 'newEpst', 
      width: 100, 
      editable: true, 
      cellEditor: 'primeDatePickerCellEditorComponent',
    },
    {
      headerName: '備註', 
      field: 'comment', 
      width: 100,
      editable: true,
      cellEditor: 'agLargeTextCellEditor',
      cellEditorParams: {
        maxLength: 50,
        cols: '50',
        rows: '3'
      },
      onCellValueChanged : event => {
        if(_.isEmpty(event.newValue)){
          event.data.comment = null;
        }

       if(!_.isNil(event.data.id)){
          this.dataTransferService.setData(event.data);
        }
        console.log("編輯完備註了，內容為:" + JSON.stringify(event.data));
        
      }
    },
    {headerName: '建立人員', field: 'userCreate', width: 100},
    {headerName: '建立日期', field: 'dateCreate', width: 100},
    {headerName: '更新人員', field: 'userUpdate', width: 100},
    {headerName: '更新日期', field: 'dateUpdate', width: 100}
  ];

  

  getShopCodeList() : void {
    this.shopCodeLoading = true;
    new Promise<boolean>((resolve, reject) => {
      this.mshService.getShopCodeList().subscribe(res => {
        if(res.code === 200){
          this.shopCodeOfOption = res.data;
          resolve(true);
        }else{
          this.message.error('後台錯誤，獲取不到站別清單');
          reject(true);
        }

      }, error => {
        this.errorMSG('獲取站別清單失敗', `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`);
        reject(true);
      });

    })
    .then(success =>{
      this.shopCodeLoading = false;
    }).catch(error =>{
      this.shopCodeLoading = false;
    });

  }

  getEquipCodeList() : void {
    this.equipCodeLoading = true;

    new Promise<boolean>((resolve, reject) => {
      this.mshService.getEquipCodeList(this.shopCodeInputList).subscribe(res => {
        if(res.code === 200){
          this.equipCodeOfOption = res.data;
          resolve(true);
        }else{
          this.message.error('後台錯誤，獲取不到機台清單');
          reject(true);
        }

      }, error => {
        this.errorMSG('獲取機台清單失敗', `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`);
        reject(true);
      });

    })
    .then(success =>{
      this.equipCodeLoading = false;
    }).catch(error =>{
      this.equipCodeLoading = false;
    });



  }

  serach(isUserClick : boolean) : void {
    this.isSpinning = true;
    let payloads = null;

    if(isUserClick){
      payloads = new MSHI003Payload(this.shopCodeInputList,
                                        this.equipCodeInputList,
                                        this.moInput,
                                        this.holeChecked)
    }else{
      payloads = this.payloadcache;
    }

     new Promise<boolean>((resolve, reject) => {
      this.mshService.searchEpstData(payloads).subscribe(res => {
        if(res.code === 200){
         
          if(res.data.length > 0) {
            let resultDataList : MSHI003[] =
              res.data.map(item => {

                let epstStr = null;
                if(!_.isEmpty(item.epst)){
                  const epstObj = moment(item.epst);
                  epstStr = epstObj.format('YYYY-MM-DD');
                }

                let newEpstStr = null;
                if(!_.isEmpty(item.newEpst)){
                  const newEpstObj = moment(item.newEpst);
                  newEpstStr = newEpstObj.format('YYYY-MM-DD');
                }

               return new MSHI003(
                  item.id,
                  item.plantCode,
                  item.idNo,
                  item.shopCode,
                  item.saleOrder,
                  item.saleItem,
                  item.saleLineno,
                  item.custAbbr,
                  item.procStatus,
                  item.sfcDia,
                  item.finalMicNo,
                  item.processCode,
                  epstStr,
                  item.comment,
                  newEpstStr,
                  item.dateCreate,
                  item.userCreate,
                  item.dateUpdate,
                  item.userUpdate
                  )
                });

              this.MSHI003DataList = resultDataList;
            } else{
              this.message.success(res.message);
            }

          resolve(true);
        }else{
          this.message.error('後台錯誤，獲取不到EPST資料');
          reject(true);
        }

      }, error => {
        this.errorMSG('獲取EPST資料失敗', `請聯繫系統工程師。Error Msg : ${JSON.stringify(error.error)}`);
        reject(true);
      });

    })
    .then(success =>{
      this.payloadcache = payloads;
      this.isSpinning = false;
    }).catch(error =>{
      this.payloadcache = payloads;
      this.isSpinning = false;
    });
    
  }

  confirm() :void {

      this.isSpinning = true;

      if(_.isEmpty(this.MSHI003DataList)){
        this.message.error('請更換搜尋條件，目前無資料可新增或更新');
        this.isSpinning = false;
        return;
      }

     // 將需要發送回後端進行新增的資料過濾出來
     const pendingInsertDataList = this.MSHI003DataList.filter(item => _.isNil(item.id))
    
     // 將需要新增的資料設定使用者名稱跟廠區別
      pendingInsertDataList.forEach(item =>{
        item.userCreate = this.USERNAME;
        item.plantCode = this.PLANTCODE;
      });

      // 將需要更新的資料設定異動者名稱
      this.MSHI003PendingDataList.forEach(item =>{
        item.userUpdate = this.USERNAME;
      });

     // 將需要進行新增的資料與MSHI003PendingDataList中需要更新的資料合併
     this.MSHI003PendingDataList= this.MSHI003PendingDataList.concat(pendingInsertDataList);

     if(_.isEmpty(this.MSHI003PendingDataList)){
      this.message.error('現有的資料沒有需要新增或更新');
      this.isSpinning = false;
      return;
     }



    this.Modal.confirm({
      nzTitle: '是否確定新增或更新資料?',
      nzOnOk: () => {
        new Promise<boolean>((resolve, reject) => {
          this.mshService.batchInsertOrUpdateEPST(this.MSHI003PendingDataList).subscribe(res => {
            if(res.code === 200){
              this.sucessMSG(res.message, res.message);
            }else{
              this.errorMSG(res.message, res.message);
            }
            resolve(true);
          }, error => {
            this.errorMSG('EPST變更作業失敗', `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.error)}`);
            reject(true);
          });

        })
        .then(success =>{
          this.MSHI003PendingDataList = [];
          this.serach(false);
          this.isSpinning = false;
        }).catch(error =>{
          this.isSpinning = false;
        });
      },
      nzOnCancel: () =>
        console.log("取消儲存資料")
    });
  }

  importExcel() : void {

  }

  exportExcel() : void {

  }

  onGridReady(params: GridReadyEvent) {
    const gridApi = params.api;
    //gridApi.sizeColumnsToFit();
  }

  sucessMSG(_title, _plan): void {
		this.Modal.success({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}

  errorMSG(_title, _plan): void {
		this.Modal.error({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}


}
