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
  selector: "app-PPSR306",
  templateUrl: "./PPSR306.component.html",
  styleUrls: ["./PPSR306.component.scss"],
  providers:[NzMessageService]
})

export class PPSR306Component implements AfterViewInit {


  USERNAME;
  PLANT_CODE;
  LoadingPage = false;
  loading = false;

  R306DataList = [];

  tooltipShowDelay = 0;
  spinType = "";
  redirect307Url = "#/FCPshipRepo/R307"
  R307Url = "#/FCPshipRepo/R307"
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
    { headerName:'銷售區域',field: 'saleAreaGroup' , filter: false,width: 120 },
    { headerName: '客戶簡稱' ,field: 'custAbbreviations' , filter: false,width: 120 },
    { headerName: '訂單號碼' ,field: 'saleOrder'  ,filter: false,width: 100 },
    { headerName: '訂單項次' ,field: 'saleItem' ,filter: false,width: 100 },
    { headerName:'過帳否',field: 'typeIssue' , filter: false,width: 120 },
    { headerName:'重量',field: 'weight' , filter: false,width: 100 },
    { headerName:'MIC',field: 'mic' , filter: false,width: 130 },
    { headerName:'尺寸',field: 'dia' , filter: false,width: 100 }
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
    
  }

  ngAfterViewInit() {
    this.isLoading = true;
    console.log("ngAfterViewChecked");

    this.getR306EditionList();

    if(this.edition != '' && this.date !=''){
      this.getR306DataList();
    }
    
    
    
  }
  getR306EditionList(){
    let myObj = this ;

    myObj.PPSService.getR306Editionist().subscribe(res =>{

      let result : any = res;

      if(this.edition == '')
        this.edition = result[0];
      else
        this.redirect307Url = this.R307Url.concat("?edition=").concat(this.edition);

      this.editionList = result;
      this.isLoading = false;
      
      

      console.log(this.R307Url)
    });
  }
  search(){
    
      this.getR306DataList();
    
  }
  getR306DataList(){
    this.isLoading = true;
    let myObj = this ;
    
    let comitParamete = {edition : this.edition} ;
    myObj.PPSService.getR306DataList(comitParamete).subscribe(res =>{

      let result : any = res;

      console.log(res);

      this.R306DataList = result;
      
      this.redirect307Url = this.R307Url.concat("?edition=").concat(this.edition);

      this.date = this.R306DataList[0]['insertDate'];
      this.sucessMSG("查詢成功",'查詢成功 結果為' + this.R306DataList.length + '筆');
      
      this.isLoading = false;
    });
  }

  onEditionChange(result: string): void {
        console.log('onChange: ', result);
        if (result != null)
          this.redirect307Url = this.R307Url.concat("?edition=").concat(this.edition);
        else
          this.redirect307Url = this.R307Url;
  }

  onDateChange(result: Date[]): void {
    
    if(this.date !=null)
      this.redirect307Url = this.R307Url.concat("?edition=").concat(this.edition).concat("&date=").concat(moment(this.date).format('YYYY-MM-DD'));
    else
      this.redirect307Url = this.R307Url.concat("?edition=").concat(this.edition)

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


  exportToExcel(){
    let header = [];

      var head = [];
      for(var i in this.columnDefsTab){
        
        if(this.columnDefsTab[i]['hide'] == undefined || this.columnDefsTab[i]['hide'] != true)
          head.push(this.columnDefsTab[i]['headerName']);
      }
      header.push(head);
      console.log(header);
      var dataReSort = {
        data : []
      };
  
      for(var i in this.R306DataList) {
        
        var temp = {}
        for(var j in this.columnDefsTab){
          
          if(this.columnDefsTab[j]['hide'] == undefined || this.columnDefsTab[j]['hide'] != true){
            var field = this.columnDefsTab[j]['field'];
            console.log(field)
            temp[field] = this.R306DataList[i][field];
          }
          
        }
        console.log(temp)
        dataReSort.data.push(temp);

      }
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.sheet_add_aoa(worksheet,header);
      XLSX.utils.sheet_add_json(worksheet,dataReSort.data,{ origin: 'A2', skipHeader: true });//origin => started row
  
      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet,'sheet1');
      XLSX.writeFile(book,new Date().toLocaleDateString('sv')+'出貨轉移統計表.xlsx');//filename => Date_
      
      this.Modal.info({
        nzTitle: '提示訊息',
        nzContent: 'excel 匯出完成' ,
        nzOkText:'知道了'
      })
  }

}
