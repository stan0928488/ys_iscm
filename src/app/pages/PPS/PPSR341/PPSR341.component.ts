import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-ppsr341',
  templateUrl: './PPSR341.component.html',
  styleUrls: ['./PPSR341.component.css'],
  providers:[NzMessageService]
})
export class PPSR341Component implements OnInit, AfterViewInit {

  thisTabName = '成品庫存現況';
  isLoading = false;
  insertDateTime = '';

  r341RowDataList : any[]  = [];

  r341ColumnDefs: ColDef[] = [
    { 
      headerName:'類型',
      field: 'stockType', 
      width: 100 
    },
    { 
      headerName:'儲區',
      field: 'loc', 
      width: 100 
    },
    { 
      headerName:'來源',
      field: 'stockSource', 
      width: 100 
    },
    { 
      headerName:'出貨單號',
      field: 'noSap', 
      width: 120 
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
      headerName:'收貨人',
      field: 'consignee', 
      width: 100 
    },
    { 
      headerName:'產品別',
      field: 'chiDesc', 
      width: 100 
    },
    { 
      headerName:'產品種類',
      field: 'typeFineDesc', 
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
      width: 110 
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
      headerName:'重量',
      field: 'weight', 
      width: 100 
    },
    { 
      headerName:'ID_NO',
      field: 'idNo', 
      width: 110 
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
      headerName:'厚度',
      field: 'thickness', 
      width: 100 
    },
    { 
      headerName:'尺寸公差',
      field: 'tolerance', 
      width: 110 
    },
    { 
      headerName:'料號',
      field: 'mtrlNo', 
      width: 150 
    },
    { 
      headerName:'MIC_NO',
      field: 'micNo', 
      width: 150 
    },
    { 
      headerName:'長度',
      field: 'length', 
      width: 100 
    },
    { 
      headerName:'實際長度',
      field: 'actualLength', 
      width: 110 
    },
    { 
      headerName:'寬度',
      field: 'width', 
      width: 100 
    },
    { 
      headerName:'包裝',
      field: 'packCode', 
      width: 100 
    },
    { 
      headerName:'委外單號',
      field: 'cscOrder', 
      width: 110 
    },
    { 
      headerName:'品質註記',
      field: 'qcMark', 
      width: 110 
    },
    { 
      headerName:'註記原因',
      field: 'qualityNote', 
      width: 110 
    },
    { 
      headerName:'凍結',
      field: 'shipMark', 
      width: 100 
    },
    { 
      headerName:'客戶採購單號',
      field: 'custPurchaseOrder', 
      width: 150 
    },
    { 
      headerName:'次採購單號',
      field: 'custPurchaseOrder2', 
      width: 150 
    },
    { 
      headerName:'倉別',
      field: 'house', 
      width: 100 
    }
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
    const aR341Tab = this.elementRef.nativeElement.querySelector('#aR341') as HTMLAnchorElement;
    const liR341Tab = this.elementRef.nativeElement.querySelector('#liR341') as HTMLLIElement;
    liR341Tab.style.backgroundColor = '#E4E3E3';
    aR341Tab.style.cssText = 'color: blue; font-weight:bold;';

     // 獲取資料
     const result = await this.obtainData();
     if(result.isObtainDataSuccess){
       this.r341RowDataList = result.dataList;
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
    
      const resObservable$ = this.ppsService.findLatestPPSR341DataList();
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取「成品庫存現況」資料失敗',
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
        '獲取「成品庫存現況」資料失敗',
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
      `成品庫存現況_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`
    );

    this.isLoading = false;
    this.nzMessageService.success('匯出成功');  
}

  getFieldNameList()  : void {
    if(_.isEmpty(this.fieldNameList)){
      this.fieldNameList = this.r341ColumnDefs.map(item => item.field);
    }
  }

  getEnglishChineseTitleMapping() : void {

    if(_.isEmpty(this.englishChineseTitleMapping)){
      this.englishChineseTitleMapping = {};
      this.r341ColumnDefs.forEach(item => {
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
