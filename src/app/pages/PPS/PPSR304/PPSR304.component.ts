import { Component, AfterViewInit } from "@angular/core";
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

interface data {

}

@Component({
  selector: "app-PPSR304",
  templateUrl: "./PPSR304.component.html",
  styleUrls: ["./PPSR304.component.scss"],
  providers:[NzMessageService]
})

export class PPSR304Component implements AfterViewInit {


  USERNAME;
  PLANT_CODE;
  LoadingPage = false;
  loading = false;

  R304DataList = [];

  tooltipShowDelay = 0;
  spinType = "";

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  importdata_repeat = [];

  uploadDate = "";
  uploadUser = "";

  public defaultColDefTab: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  public autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };


  columnDefsTab: ColDef<data>[] = [
    { headerName:'客戶簡稱',field: 'custAbbreviations' , filter: false,width: 100 },
    { headerName: '預估出貨量' ,field: 'estimateWeight' , filter: false,width: 120 },
    { headerName:'異型棒目標',field: 'profieldGoal' , filter: false,width: 120},
    { headerName:'大棒目標',field: 'bigStickGoal' , filter: false,width: 100 },
    { headerName:'允收截止日',field: 'datePlanInStorage' , filter: false,width: 200 },
    { headerName:'可接受交期', field:'dateDeliveryPp', filter:false, width:200}
 ];

  constructor(
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }

  ngAfterViewInit() {
    this.loading = true;
    console.log("ngAfterViewChecked");
    this.getR304DataList();
    
  }
  
  getR304DataList(){

    let myObj = this ;

    myObj.PPSService.getR304DataList().subscribe(res =>{

      let result : any = res;

      console.log(res);
      this.R304DataList = result ;

      this.uploadDate = result[0]['dateUpdate'] != undefined? result[0]['dateUpdate'].split(" ")[0]:result[0]['dateCreate'].split(" ")[0];
      this.uploadUser = result[0]['userUpdate'] != undefined? result[0]['userUpdate']:result[0]['userCreate'];
      this.loading = false;
    });
  }

  exportToExcel(){
    let header = [];

      var head = [];
      for(var i in this.columnDefsTab){
        
        head.push(this.columnDefsTab[i]['headerName']);
      }
      header.push(head);
      console.log(header);
      var dataReSort = {
        data : []
      };
  
      for(var i in this.R304DataList) {
        
        var temp = {}
        for(var j in this.columnDefsTab){
          
          var field = this.columnDefsTab[j]['field']

          if( this.R304DataList[i][this.columnDefsTab[j]['field']] != undefined &&
          field == 'datePlanInStorage' || field == 'dateDeliveryPp')
            temp[field] = moment(this.R304DataList[i][this.columnDefsTab[j]['field']])
                          .format('YYYY-MM-DD');
          else
            temp[field] = this.R304DataList[i][this.columnDefsTab[j]['field']];
          
          
        }
        console.log(temp)
        dataReSort.data.push(temp);

      }
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.sheet_add_aoa(worksheet,header);
      XLSX.utils.sheet_add_json(worksheet,dataReSort.data,{ origin: 'A2', skipHeader: true });//origin => started row
  
      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet,'sheet1');
      XLSX.writeFile(book,new Date().toLocaleDateString('sv')+'客戶出貨資訊維護表_.xlsx');//filename => Date_
      
      this.Modal.info({
        nzTitle: '提示訊息',
        nzContent: 'excel 匯出完成' ,
        nzOkText:'知道了'
      })
  }

  Upload() {
    
    // let getFileNull = this.inputFileUseInUpload;
    // if(getFileNull === undefined){
    //   this.errorMSG('請選擇檔案', '');
    //   return;
    // }

    let lastname = this.file.name.split('.').pop();
    console.log("this.file.name: "+this.file.name);
    console.log("incomingfile e : " + this.file);
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {
      console.log("上傳檔案格式沒有錯誤");
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet:any = workbook.Sheets[first_sheet_name];

        if(worksheet.A1 === undefined || worksheet.B1 === undefined || worksheet.C1 === undefined || worksheet.D1 === undefined || worksheet.E1 === undefined ||
          worksheet.F1 === undefined ) {
        this.errorMSG('檔案樣板錯誤', '請先下載資料後，再透過該檔案調整上傳。');
        this.clearFile();
          return;
        } else if(worksheet.A1.v !== "客戶簡稱" || worksheet.B1.v !== "預估出貨量" 
        || worksheet.C1.v !== "異型棒目標" || worksheet.D1.v !== "大棒目標" || worksheet.E1.v !== "允收截止日" || worksheet.F1.v !== "可接受交期" ) {
          this.errorMSG('檔案樣板欄位表頭錯誤', '請先下載資料後，再透過該檔案調整上傳。');
          this.clearFile();
          return;
        }

        this.importdata = XLSX.utils.sheet_to_json(worksheet, {raw:true});
  
        
          console.log("importExcel")
          console.log(this.importdata)
          this.importExcel(this.importdata);
        
      }
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  importExcel(_data) {

    console.log("EXCEL 資料上傳檢核開始");
    var upload_data = [];
    for(let i=0 ; i < _data.length ; i++) {
      console.log(_data[i]);
      let allData = JSON.stringify(_data[i]);

      if (this.importdata_repeat.includes(allData)){
        this.errorMSG('重複資料', '第' + (i+2) + "筆與上一筆為重複資料");
        this.clearFile();
        return;
      }
      else{
        this.importdata_repeat.push(allData);
        upload_data.push({
          plantCode:this.PLANT_CODE,
          custAbbreviations: _data[i]['客戶簡稱'] ,
          estimateWeight: _data[i]['預估出貨量'],
          profieldGoal : _data[i]['異型棒目標'],
          bigStickGoal :_data[i]['大棒目標'],
          datePlanInStorage :_data[i]['允收截止日'],
          dateDeliveryPp :_data[i]['可接受交期'],
          date : moment().format('YYYY-MM-DD HH:mm:ss'),
          user : this.USERNAME
        })
      }
    }
    

    return new Promise((resolve, reject) => {
      console.log("匯入開始");
      this.LoadingPage = true;
      let myObj = this;
      let obj = {};
      obj = {
        EXCELDATA: upload_data
      };

      console.log("EXCELDATA:"+ upload_data);
      myObj.PPSService.batchSaveR304Data(upload_data).subscribe(res => {
        console.log("importExcelPPSR304");
        if(res[0].MSG === "Y") { 
          

          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getR304DataList()
          
        } else {
          this.errorMSG("匯入錯誤", res[0].MSG);
          this.clearFile();
          this.loading = false;
          this.LoadingPage = false;
        }
      },err => {
        reject('upload fail');
        this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
        this.loading = false;
        this.LoadingPage = false;
      })
    });
    
    this.getR304DataList();

  }
  clearFile() {
    document.getElementsByTagName('input')[0].value = '';
    this.importdata_repeat = [];
  }

     // excel檔名
     incomingfile(event) {
      this.file = event.target.files[0]; 
      console.log("incomingfile e : " + this.file);
      let lastname = this.file.name.split('.').pop();
      if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
        this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
        this.clearFile();
        return;
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
