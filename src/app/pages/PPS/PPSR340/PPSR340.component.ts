import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { firstValueFrom } from 'rxjs';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-ppsr340',
  templateUrl: './PPSR340.component.html',
  styleUrls: ['./PPSR340.component.css'],
  providers:[NzMessageService]
})
export class PPSR340Component implements OnInit, AfterViewInit{

  thisTabName = '訂單交期回覆';
  isLoading = false;
  insertDateTime = '';

  r340RowDataList : any[]  = [];

  r340ColumnDefs: ColDef[] = [
    { 
      headerName:'區別',
      field: 'saleAreaGroup', 
      width: 100 
    },
    { 
      headerName:'客戶',
      field: 'custAbbreviations', 
      width: 100 
    },
    { 
      headerName:'收貨人',
      field: 'consignee', 
      width: 100 
    },
    { 
      headerName:'訂單編號',
      field: 'saleOrder', 
      width: 110 
    },
    { 
      headerName:'訂單項次',
      field: 'saleItem', 
      width: 110 
    },
    { 
      headerName:'MIC_NO',
      field: 'micNo', 
      width: 150 
    },
    { 
      headerName:'生計交期',
      field: 'dateDeliveryPp', 
      width: 120 
    },
    { 
      headerName:'營業交期',
      field: 'dateDeliverySales', 
      width: 120 
    },
    { 
      headerName:'訂單重量',
      field: 'saleOrderWeight', 
      width: 120 
    },
    { 
      headerName:'待入庫量',
      field: 'unfinishGoodWeight', 
      width: 120 
    },
    { 
      headerName:'生計入庫日',
      field: 'datePp', 
      width: 120 
    },
  ];

   // 表格共有設定定義
   gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: true,
      resizable: true,
      autoHeight: true,
    }
  };

  // 用於匯出之Excel與中文名稱對照的英文名稱
  fieldNameList : string[] = [];
  // 用於匯出之Excel與英文名稱與中文名稱的對照
  englishChineseTitleMapping = {}; 

  constructor(private elementRef:ElementRef,
              private ppsService: PPSService,
              private Modal: NzModalService,
              private nzMessageService: NzMessageService) {
    
  }

  async ngAfterViewInit(): Promise<void> {
    const aR340Tab = this.elementRef.nativeElement.querySelector('#aR340') as HTMLAnchorElement;
    const liR340Tab = this.elementRef.nativeElement.querySelector('#liR340') as HTMLLIElement;
    liR340Tab.style.backgroundColor = '#E4E3E3';
    aR340Tab.style.cssText = 'color: blue; font-weight:bold;';

    // 獲取資料
    const result = await this.obtainData();
    if(result.isObtainDataSuccess){
      this.r340RowDataList = result.dataList;
      this.insertDateTime = result.insertDateTime;
    }
  }

  ngOnInit(): void {

  }

  async obtainData() : Promise<any> {

    const result = {
      dataList:[],
      insertDateTime : '',
      isObtainDataSuccess : false
    };

    try{

      this.isLoading = true;
    
      const resObservable$ = this.ppsService.findLatestPPSR340DataList();
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取「訂單交期回覆」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        return result;
      }

      if(res.data.length <= 0){
        this.nzMessageService.success('目前尚無資料');
        return result;
      }
      result.dataList = res.data.dataList;
      result.insertDateTime = res.data.insertDateTime
      result.isObtainDataSuccess = true;
    }
    catch (error) {
      this.errorMSG(
        '獲取「訂單交期回覆」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }

    return result;

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

    const exportData = [this.englishChineseTitleMapping, ...result.dataList];

    const workSheet = XLSX.utils.json_to_sheet(exportData, {
      header: this.fieldNameList,
      skipHeader: true,
    });
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
    XLSX.writeFileXLSX(
      workBook,
      `訂單交期回覆_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`
    );

    this.isLoading = false;
    this.nzMessageService.success('匯出成功');  
}

  getFieldNameList()  : void {
    if(_.isEmpty(this.fieldNameList)){
      this.fieldNameList = this.r340ColumnDefs.map(item => item.field);
    }
  }

  getEnglishChineseTitleMapping() : void {

    if(_.isEmpty(this.englishChineseTitleMapping)){
      this.englishChineseTitleMapping = {};
      this.r340ColumnDefs.forEach(item => {
          let enChMapping = {
            [item.field] : item.headerName
          }
          _.merge(this.englishChineseTitleMapping, enChMapping);
      });
    }
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
