import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ListShipRepoDataTransferService } from '../list-ship-repo/ListShipRepoDataTransferService';
import { PPSService } from "src/app/services/PPS/PPS.service";
import { firstValueFrom } from 'rxjs';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { saveAs } from 'file-saver';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-ppsr312',
  templateUrl: './PPSR312.component.html',
  styleUrls: ['./PPSR312.component.css'],
  providers:[NzMessageService]
})
export class PPSR312Component implements OnInit {

   // ag grid Api物件
   gridApi : GridApi;
   gridColumnApi : ColumnApi;
   
  // 控制是否顯示載入中圖示
  isLoading = false;

  // 版次是否載入中
  editionsLoading = false;
  // 版次選項
  editionList : string[] = [];
  // 使用者當前選擇的版次
  edition : string;

  // 結轉時間
  insertDateTime : string = undefined;

  // 表格資料來源
  r312DataList : any[] = [];

  // 用於匯出之Excel與中文名稱對照的英文名稱
  fieldNameList : string[] = [];
  // 用於匯出之Excel與英文名稱與中文名稱的對照
  englishChineseTitleMapping = {}; 

  // 表格欄位定義
  r312ColumnDefs: ColDef[] = [
    { 
      headerName:'MO版次',
      field: 'moEdition', 
      width: 180 
    },
    { 
      headerName:'區別',
      field: 'saleAreaGroup', 
      width: 120 
    },
    { 
      headerName:'客戶',
      field: 'custAbbreviations', 
      width: 120 
    },
    { 
      headerName:'訂單編號',
      field: 'saleOrder', 
      width: 120 
    },
    { 
      headerName:'訂單項次',
      field: 'saleItem', 
      width: 120 
    },
    { 
      headerName:'料號',
      field: 'mtrlNo', 
      width: 140 
    },
    { 
      headerName:'MIC_NO',
      field: 'micNo', 
      width: 130 
    },
    { 
      headerName:'訂單交期',
      field: 'dateDeliverySales', 
      width: 120 
    },
    { 
      headerName:'尺寸',
      field: 'dia', 
      width: 100 
    },
    { 
      headerName:'尺寸2',
      field: 'dia2', 
      width: 100 
    },
    { 
      headerName:'站別',
      field: 'shopCode', 
      width: 100 
    },
    { 
      headerName:'長度',
      field: 'length', 
      width: 100 
    },
    { 
      headerName:'實際長度',
      field: 'actualLength', 
      width: 120 
    },
    { 
      headerName:'重量',
      field: 'weight', 
      width: 100 
    },
    { 
      headerName:'產品別',
      field: 'productDesc', 
      width: 110 
    },
    { 
      headerName:'產品種類',
      field: 'productType', 
      width: 120 
    }
  ];

  // 表格共有設定定義
  gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: false,
      resizable: true,
      autoHeight: true,
    }
  };

  constructor(private PPSService: PPSService,
              private Modal: NzModalService,
              private nzMessageService: NzMessageService,
              private listShipRepoDataTransferService:ListShipRepoDataTransferService) { 

  }

  ngOnInit(): void {
    this.listShipRepoDataTransferService.setSelectedPage("R312");
  }

  // 獲取查詢條件「版次」
  async getEditions() {
    this.editionsLoading = true;

    try{
      const resObservable$ = this.PPSService.getShipRepoEditionList();
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取版次資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        return;
      }

      this.editionList = res.data;
    }
    catch (error) {
      this.errorMSG(
        '獲取版次資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.editionsLoading = false;
    }
  }

  async obtainData() : Promise<any> {

    const result = {
      ppsc312DataList:[],
      insertDateTime : undefined,
      isObtainDataSuccess : false
    };

    try{

      this.isLoading = true;
    
      if(_.isNil(this.edition)){
        this.nzMessageService.error('請選擇版次');
        return result;
      }

      const resObservable$ = this.PPSService.getPPSC312Data(this.edition);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取入庫儲區異動資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        return result;
      }

      if(res.data.ppsc312DataList.length <= 0){
        this.nzMessageService.success('該版次無資料，請選擇其他版次');
        return result;
      }
      result.ppsc312DataList = res.data.ppsc312DataList;
      result.insertDateTime = res.data.insertDateTime
      result.isObtainDataSuccess = true;
    }
    catch (error) {
      this.errorMSG(
        '獲取入庫儲區異動資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }

    return result;

  }

  async search(){
    const result = await this.obtainData();
    if(result.isObtainDataSuccess){
      this.r312DataList = result.ppsc312DataList;
      this.insertDateTime = result.insertDateTime;
    }
  }

  async exportToExcel() {
      this.isLoading = true;

      this.getFieldNameList();
      this.getEnglishChineseTitleMapping();

      const result = await this.obtainData();
      if(!result.isObtainDataSuccess){
        this.isLoading = false;
        return;
      }

      const exportData = [this.englishChineseTitleMapping, ...result.ppsc312DataList];

      const workSheet = XLSX.utils.json_to_sheet(exportData, {
        header: this.fieldNameList,
        skipHeader: true,
      });
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
      XLSX.writeFileXLSX(
        workBook,
        `入庫儲區異動_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`
      );

      this.isLoading = false;
      this.nzMessageService.success('匯出成功');  
  }

  getFieldNameList(){
    if(_.isEmpty(this.fieldNameList)){
      this.fieldNameList = this.r312ColumnDefs.map(item => item.field);
    }
  }

  getEnglishChineseTitleMapping(){

    if(_.isEmpty(this.englishChineseTitleMapping)){
      this.englishChineseTitleMapping = {};
      this.r312ColumnDefs.forEach(item => {
          let enChMapping = {
            [item.field] : item.headerName
          }
          _.merge(this.englishChineseTitleMapping, enChMapping);
      });
    }
  }

  // 獲取ag-grid的Api物件
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  sucessMSG(_title, _plan): void {
		this.Modal.success({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}

	errorMSG(_title, _context): void {
		this.Modal.error({
			nzTitle: _title,
			nzContent: `${_context}`
		});
  }

}
