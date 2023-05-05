import { AfterViewInit, Component } from '@angular/core';
import { MSHService } from 'src/app/services/MSH/MSH.service';
import {NzModalService} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {MSHI003} from "./MSHI003.model";
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { PrimeDatePickerCellEditorComponent } from './prime-date-picker-cell-editor';
import { CookieService } from 'src/app/services/config/cookie.service';
import { DataTransferService } from 'src/app/services/MSH/Data.transfer.service';

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

  MSHI003DataListDeepClone : MSHI003[] = [];

  // 存放待更新或新增的row資料
  MSHI003PendingDataList : MSHI003[] = [];

  // 存放使用者搜尋的條件
  payloadcache : MSHI003Payload;

  gridOptions = {
    defaultColDef : {
      sortable: false,
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

    this.dataTransferService.getData().subscribe((node) => {
        this.isSpinning = true;

      // 判斷使用者經過一連串的編輯後，是否仍然與原資料相同
      // 若相同該筆資料則不進行儲存
      const isSame = _.isEqual(this.MSHI003DataListDeepClone[node.rowIndex], node.data);

      // 資料一樣，若之前有放到MSHI003PendingDataList之中則進行移除
      if(isSame){
        const isSameIndex = this.MSHI003PendingDataList.findIndex(data => data === node.data);
        if(isSameIndex > -1){
          this.MSHI003PendingDataList.splice(isSameIndex, 1);
        }
        this.isSpinning = false;
        return;
      }

      if(_.isEmpty(this.MSHI003PendingDataList)){
        this.MSHI003PendingDataList.push(node.data);
        this.isSpinning = false;
        return;
      }
      
      // 判斷該筆資料是否已存在於this.MSHI003PendingDataList
      // 若存在則不需要再進行push
      const isExist = this.MSHI003PendingDataList.some(data => data === node.data);

      // 找不到同樣id的資料則進行push
      if(!isSame && !isExist) {
        this.MSHI003PendingDataList.push(node.data);
      }
      this.isSpinning = false;
    });

  }
  
  ngAfterViewInit(): void {
    
  }

  columnDefs : ColDef[]   = [
    {headerName: 'MO', field: 'idNo', width: 100, filter: true},
    {headerName: '現況站別', field: 'shopCode', width: 120, filter: true},
    {headerName: '訂單號碼', field: 'saleOrder', width: 120, filter: true},
    {headerName: '項次', field: 'saleItem', width: 100, filter: true},
    {headerName: '客戶', field: 'custAbbr', width: 100, filter: true},
    {headerName: '放行碼', field: 'procStatus', width: 100},
    {headerName: '現況尺寸', field: 'sfcDia', width: 100},
    {headerName: '現況MIC', field: 'finalMicNo', width: 100},
    {headerName: '製程碼', field: 'processCode', width: 100},
    {headerName: 'EPST', field: 'epst', width: 120},
    { 
      headerName: '調整日期', 
      field: 'newEpst', 
      width: 120, 
      editable: true, 
      cellEditor: 'primeDatePickerCellEditorComponent',
      headerClass: 'header-editable-color',
      cellClass: 'cell-editable-color',
    },
    {
      headerName: '備註', 
      field: 'comment', 
      width: 100,
      editable: true,
      cellEditor: 'agLargeTextCellEditor',
      headerClass: 'header-editable-color',
      cellClass: 'cell-editable-color',
      cellEditorParams: {
        maxLength: 50,
        cols: '50',
        rows: '3'
      },
      onCellValueChanged : event => {
        if(_.isEmpty(event.newValue)){
          event.data.comment = null;
        }

        this.dataTransferService.setData(event.node);
        
      }
    },
    {headerName: '建立人員', field: 'userCreate', width: 100},
    {headerName: '建立日期', field: 'dateCreate', width: 180},
    {headerName: '更新人員', field: 'userUpdate', width: 100},
    {headerName: '更新日期', field: 'dateUpdate', width: 180}
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
    
     // 若存在編輯過的資料
     if(!_.isEmpty(this.MSHI003PendingDataList) && isUserClick){
      this.Modal.confirm({
        nzTitle: '資料尚未儲存，是否放棄儲存執行搜尋?',
        nzOnOk: () => {
          this.serachEPST(isUserClick);
        },
        nzOnCancel: () =>
          console.log("取消搜尋EPST資料")
      });
     }
     else{
      this.serachEPST(isUserClick);
     }

  }


  serachEPST(isUserClick : boolean) : void {
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
              this.MSHI003DataListDeepClone = _.cloneDeep(this.MSHI003DataList);
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
      this.MSHI003PendingDataList = [];
      this.isSpinning = false;
    }).catch(error =>{
      this.payloadcache = payloads;
      this.MSHI003PendingDataList = [];
      this.isSpinning = false;
    });
    
  }

  confirm() :void {

      if(_.isEmpty(this.MSHI003DataList)){
        this.message.error('請更換搜尋條件，目前無資料可儲存');
        this.isSpinning = false;
        return;
      }

     if(_.isEmpty(this.MSHI003PendingDataList)){
      this.message.error('尚無資料經過編輯，無法儲存資料');
      this.isSpinning = false;
      return;
     }

    this.Modal.confirm({
      nzTitle: '是否確定儲存資料?',
      nzOnOk: () => {

        this.isSpinning = true;

        // 1.將需要新增的資料設定建立者名稱與廠區別
        // 2.將需要更新的資料設定異動者名稱
        this.MSHI003PendingDataList.forEach(item =>{
          if(_.isNil(item.id)){
            item.userCreate = this.USERNAME;
            item.plantCode = this.PLANTCODE;
          }
          else{
            item.userUpdate = this.USERNAME;
          }
        });

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
          this.MSHI003PendingDataList = [];
          this.serach(false);
          this.isSpinning = false;
        });
      },
      nzOnCancel: () =>
        console.log("取消EPST變更作業")
    });
  }

  importExcel() : void {
    this.message.info('開發中');
  }

  exportExcel() : void {
    this.message.info('開發中');
  }

  onGridReady(params: GridReadyEvent) {
    //this.gridApi = params.api;
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
