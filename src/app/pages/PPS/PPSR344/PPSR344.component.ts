import { Component, AfterViewInit, OnInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { zh_TW, NzI18nService } from "ng-zorro-antd/i18n"
import { NzModalService } from "ng-zorro-antd/modal"
import { ExcelService } from "src/app/services/common/excel.service";
import { CellClickedEvent, ColDef, GridReadyEvent, PreConstruct } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-PPSR344',
  templateUrl: './PPSR344.component.html',
  styleUrls: ['./PPSR344.component.scss'],
  providers:[NzMessageService]
})
export class PPSR344Component implements OnInit {

  hiddenSwitch;
  USERNAME;
  PLANT_CODE;
  rowData: data[] = [];
  titleData: any[] = [];    
  selectedVer = [{label:'',value:''}]; //版本选择
  isSpinning = false;
  searchData = {
    date:null
  }

  constructor(
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private excelService: ExcelService,
    private message: NzMessageService
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }

  ngOnInit(): void {
    this.searchData.date = new Date();
    this.hiddenSwitch = false;
    this.getHeaderDataList();
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  getDataList(){

    this.isSpinning = true;
    let postData = this.searchData;
    this.PPSService.getR344Data(postData).subscribe(res =>{
      let result:any = res ;
      if(result && result.datalist.length > 0) {
        console.log(result);
        this.rowData = JSON.parse(JSON.stringify(result.datalist));
        this.titleData = JSON.parse(JSON.stringify(result.headerInfoList));
      } else {
        this.message.error("無資料");
      }
      this.isSpinning = false;
    },err => {
      this.isSpinning = false;
      this.message.error('網絡請求失敗');
    })

  }

  getHeaderDataList(){

    this.isSpinning = true;
    let postData = this.searchData;
    this.PPSService.getR344HeaderData(postData).subscribe(res =>{
      let result:any = res ;
      if(result && result.headerInfoList.length > 0) {
        this.titleData = JSON.parse(JSON.stringify(result.headerInfoList));
      } else {
        this.message.error("無資料");
      }
      this.isSpinning = false;
    },err => {
      this.isSpinning = false;
      this.message.error('網絡請求失敗');
    })

  }

}

interface data {
  analGroup:String
  chiDesc:String
  rowspanSize:number
  weightShp:number
  weightShpNon:number
  aimDlvyQty:number
  openingStock:number
  unStock:number
  sumWipWeight:number
  sumNonfinishWeight:number
  maxShipmentVolumeThisMonth:number
  ppsd344RangeInfo1:{
    weight:number
    wipWeight:number
    nonfinishWeight:number
    weekDlvyQty:number
    availableShipmentsNextWeek:number
  }
  ppsd344RangeInfo2:{
    weight:number
    wipWeight:number
    nonfinishWeight:number
    weekDlvyQty:number
    availableShipmentsNextWeek:number
  }
  ppsd344RangeInfo3:{
    weight:number
    wipWeight:number
    nonfinishWeight:number
    weekDlvyQty:number
    availableShipmentsNextWeek:number
  }
  ppsd344RangeInfo4:{
    weight:number
    wipWeight:number
    nonfinishWeight:number
    weekDlvyQty:number
    availableShipmentsNextWeek:number
  }
  ppsd344RangeInfo5:{
    weight:number
    wipWeight:number
    nonfinishWeight:number
    weekDlvyQty:number
    availableShipmentsNextWeek:number
  }
  ppsd344RangeInfo6:{
    weight:number
    wipWeight:number
    nonfinishWeight:number
    weekDlvyQty:number
    availableShipmentsNextWeek:number
  }
}