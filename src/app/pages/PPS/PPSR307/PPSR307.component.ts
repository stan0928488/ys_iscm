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
import { ListShipRepoDataTransferService } from "../list-ship-repo/ListShipRepoDataTransferService";

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
	  { headerName:'銷售區域',field: 'saleAreaGroup' , filter: false,width: 120 },
    { headerName: '客戶簡稱' ,field: 'custAbbreviations' , filter: false,width: 120 },
    { headerName: '訂單號碼' ,field: 'saleOrder'  ,filter: false,width: 100 },
    { headerName: '訂單項次' ,field: 'saleItem' ,filter: false,width: 100 },
    { headerName:'生計交期',field: 'dateDeliveryPp' , filter: false,width: 120 },
	  { headerName:'重量',field: 'weight' , filter: false,width: 100 },
	  { headerName:'產品ID',field: 'idNo' , filter: false,width: 120 },
	  { headerName: '形狀' ,field: 'shape' , filter: false,width: 100 },
	  { headerName:'尺寸',field: 'dia' , filter: false,width: 100 },
	  { headerName: '凍結部門' ,field: 'frozenDeptName'  ,filter: false,width: 150 }
 ];

  constructor(
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
    private route: ActivatedRoute,
    private listShipRepoDataTransferService:ListShipRepoDataTransferService
    
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }

  ngOnInit(){
    this.edition = this.route.snapshot.queryParamMap.has('edition')?this.route.snapshot.queryParamMap.get('edition'):'';
    this.date = this.route.snapshot.queryParamMap.has('date')?this.route.snapshot.queryParamMap.get('date'):'';
    console.log(this.edition)
    if(!_.isEmpty(this.edition)){
      this.listShipRepoDataTransferService.setEdition(this.edition);
    }
    this.listShipRepoDataTransferService.setSelectedPage("R307");
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

      if(this.edition == ''){
        this.edition = result[0];
      }
      else{
        this.listShipRepoDataTransferService.setEdition(this.edition);
        this.redirect306Url = this.R306Url.concat("?edition=").concat(this.edition);
      }

      this.editionList = result;
      this.isLoading = false;
      
      
      

      console.log(this.R306Url)
    });
  }
  search(){
    
      this.getR307DataList();
    
  }

  getR307DataList(){
    this.isLoading = true;
    let myObj = this ;
    
    let comitParamete = {edition : this.edition} ;
    myObj.PPSService.getR307DataList(comitParamete).subscribe(res =>{

      let result : any = res;

      console.log(res);

      this.R307DataList = result;
      this.redirect306Url = this.R306Url.concat("?edition=").concat(this.edition);

      this.sucessMSG("查詢成功",'查詢成功 結果為' + this.R307DataList.length + '筆');
      this.date = this.R307DataList[0]['insertDate'];
      this.isLoading = false;
    });
  }

  onEditionChange(result: string): void {
      if(this.edition != null){
        this.listShipRepoDataTransferService.setEdition(this.edition);
        this.redirect306Url = this.R306Url.concat("?edition=").concat(this.edition);
      }
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
  
      for(var i in this.R307DataList) {
        
        var temp = {}
        for(var j in this.columnDefsTab){
          
          if(this.columnDefsTab[j]['hide'] == undefined || this.columnDefsTab[j]['hide'] != true){
            var field = this.columnDefsTab[j]['field'];
            console.log(field)
            temp[field] = this.R307DataList[i][field];
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
      XLSX.writeFile(book,new Date().toLocaleDateString('sv')+'成品/半成品現況.xlsx');//filename => Date_
      
      this.Modal.info({
        nzTitle: '提示訊息',
        nzContent: 'excel 匯出完成' ,
        nzOkText:'知道了'
      })
  }
}
