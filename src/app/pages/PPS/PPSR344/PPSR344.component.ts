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
  date = null;

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
    this.date = new Date();
    this.hiddenSwitch = true;
    this.getDataList();
    this.getVerListData();
  }

  rowData: data[] = [];
  titleData: any[] = [];    
  
  selectedVer = [{label:'',value:''}]; //版本选择
  isSpinning = false;

  searchData = {
    selectedVer_default:null,
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  getDataList(){

    this.isSpinning = true;
    let postData = this.searchData;
    postData['mo_EDITION'] = this.searchData.selectedVer_default;
    this.PPSService.getR320Data(postData).subscribe(res =>{
      let result:any = res ;
      if(result && result.datalist.length > 0) {
        console.log(result);
        this.rowData = JSON.parse(JSON.stringify(result.datalist));
        this.titleData = JSON.parse(JSON.stringify(result.sald001HeaderInfoList));
      } else {
        this.message.error("版次:"+this.searchData.selectedVer_default+"無資料");
      }
      this.isSpinning = false;
    },err => {
      this.isSpinning = false;
      this.message.error('網絡請求失敗');
    })

  }

  getVerListData(){

    let postData = {};
    this.PPSService.getR308VerListData(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        for(let i = 0 ; i<result.length ; i++) {
          this.selectedVer.push({label:result[i].mo_EDITION, value:result[i].mo_EDITION})
        }
      } else {
        this.message.error('無資料');
        return;
      }
    },err => {
      this.message.error('網絡請求失敗');
    })

  }

}

interface data {
  estimateWeight:Number;
}