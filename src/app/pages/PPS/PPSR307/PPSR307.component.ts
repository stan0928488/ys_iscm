import { Component, AfterViewInit ,OnInit} from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";
import { CellClickedEvent, ColDef, GridReadyEvent, PreConstruct } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';

interface data {

}

@Component({
  selector: "app-PPSR307",
  templateUrl: "./PPSR307.component.html",
  styleUrls: ["./PPSR307.component.scss"],
  providers:[NzMessageService]
})

export class PPSR307Component implements AfterViewInit {


  USERNAME;
  PLANT_CODE;
  LoadingPage = false;
  loading = false;

  R307DataList = [];

  tooltipShowDelay = 0;
  spinType = "";
  redirect306Url = "#/FCPshipRepo/R306"
  R306Url = "#/FCPshipRepo/R306"
  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  importdata_repeat = [];
  uploadDate = "";
  uploadUser = "";
  editionList = [];
  edition = "";
  date = "";
  isLoading = false;
  public defaultColDefTab: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  public autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };


  columnDefsTab: ColDef<data>[] = [
    { headerName:'類型',field: 'stockType' , filter: false,width: 100 },
	  { headerName:'銷售區域',field: 'saleAreaGroup' , filter: false,width: 100 },
    { headerName: '客戶簡稱' ,field: 'custAbbreviations' , filter: false,width: 100 },
    { headerName: '訂單號碼' ,field: 'saleOrder'  ,filter: false,width: 100 },
    { headerName: '訂單項次' ,field: 'saleItem' ,filter: false,width: 100 },
    { headerName:'生計交期',field: 'dateDeliveryPp' , filter: false,width: 100 },
	  { headerName:'重量',field: 'weight' , filter: false,width: 100 },
	  { headerName:'產品ID',field: 'idNo' , filter: false,width: 100 },
	  { headerName: '形狀' ,field: 'shape' , filter: false,width: 100 },
	  { headerName:'尺寸',field: 'dia' , filter: false,width: 100 },
	  { headerName: '凍結部門' ,field: 'frozenDeptName'  ,filter: false,width: 200 }
 ];

  constructor(
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
    private route: ActivatedRoute,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }

  ngOnInit(){
    this.edition = this.route.snapshot.queryParamMap.has('edition')?this.route.snapshot.queryParamMap.get('edition'):'';
    this.date = this.route.snapshot.queryParamMap.has('date')?this.route.snapshot.queryParamMap.get('date'):'';
    console.log(this.edition)
  }
  ngAfterViewInit() {
    this.isLoading = true;
    console.log("ngAfterViewChecked");

    this.getR307EditionList();

    if(this.edition != '' && this.date !=''){
      this.getR307DataList();
    }
    
    
  }
  getR307EditionList(){
    let myObj = this ;

    myObj.PPSService.getR307Editionist().subscribe(res =>{

      let result : any = res;

      if(this.edition == '')
        this.edition = result[0];
      else{
        this.redirect306Url = this.R306Url.concat("?edition=").concat(this.edition);
      }

      this.editionList = result;
      this.isLoading = false;
      
      
      

      console.log(this.R306Url)
    });
  }
  search(){
    if(this.date == null || this.date == ''){
      this.errorMSG("參數錯誤","請輸入 日期參數");
      return;
    }else{
      this.getR307DataList();
    }
  }

  getR307DataList(){
    this.isLoading = true;
    let myObj = this ;
    
    let comitParamete = {edition : this.edition, date: moment(this.date).format('YYYY-MM-DD') } ;
    myObj.PPSService.getR307DataList(comitParamete).subscribe(res =>{

      let result : any = res;

      console.log(res);

      this.R307DataList = result;
      this.redirect306Url = this.R306Url.concat("?edition=").concat(this.edition).concat("&date=").concat(moment(this.date).format('YYYY-MM-DD'));

      this.sucessMSG("查詢成功",'查詢成功 結果為' + this.R307DataList.length + '筆');
      
      this.isLoading = false;
    });
  }

  onEditionChange(result: string): void {
      if(this.edition != null)
        this.redirect306Url = this.R306Url.concat("?edition=").concat(this.edition);
      else
        this.redirect306Url = this.R306Url
        console.log('onChange: ', result);
  
  }

  onDateChange(result: Date[]): void {
    console.log(this.date)
      if(this.date !=null)
        this.redirect306Url = this.R306Url.concat("?edition=").concat(this.edition).concat("&date=").concat(moment(this.date).format('YYYY-MM-DD'));
      else
        this.redirect306Url = this.R306Url.concat("?edition=").concat(this.edition)

      console.log('onChange: ', result);
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

  saleInfoGetter(params){
    return params.data.saleOrder + '-' + params.data.saleItem;
  }
}
