import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { ORPService } from "src/app/services/ORP/ORP.service";
import { zh_TW ,NzI18nService } from "ng-zorro-antd/i18n";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { AppComponent } from "src/app/app.component";
import * as _ from "lodash";
import * as moment from 'moment';
import * as XLSX from 'xlsx';

class DailyShip {
  date = '';
  availble_ship =  0;
  material = 0;
  kaohsiung_onday = 0;
  kaohsiung_platen = 0;
  taichung_forout = 0;
  domestic_chou_noniscm = 0;
  domestic_NS_onday_noniscm = 0;
  domestic_NS_platen_noniscm = 0;
  customer_add = 0;
  domestic_chou_iscm = 0;
  domestic_NS_onday_iscm = 0;
  domestic_NS_platen_iscm =0;
  domestic_chou_remain = 0;
  domestic_NS_onday_remain = 0;
  domestic_NS_platen_remain = 0;
  expect_domestic_sales = 0;
  expect_export_sales = 0;
  all_sales = 0;
  //information
  plant_code:String;
  mes_import_time:String;
  create_user:String;
  create_date:String

  constructor(date : string , now :String , plant_code:String , create_user : String){
    this.date = date;
    this.mes_import_time = now;
    this.plant_code = plant_code;
    this.create_user = create_user;
    this.create_date = now;
    
  }
}


@Component({
  selector: "app-ORPR403",
  templateUrl: "./ORPR403.component.html",
  styleUrls: ["./ORPR403.component.scss"],
  providers:[NzMessageService]
})

export class ORPR403Component implements AfterViewInit {
  USERNAME;
  PLANT_CODE;
  safeUrl="http://10.104.5.166:8889/";
  value = "123";
  date = null;
  before = null;
  after = null;
  page = 1;
  datetime = moment(); 
  dailyShips : Array<DailyShip> = [];
  title = ['出貨日期','可供出貨量','原料','高雄港-當日到貨','高雄港-壓板','台中港',
            '','中部(預叫車)','北南部-當日到貨(預叫車)','北南部-壓板(預叫車)',
            '客戶追加','中部*','北南部-當日到貨*','北南部-壓板*','中部(餘量)','北南部-當日到貨(餘量)',
            '北南部-壓板(餘量)','',''];
  letter = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ','BA','BB','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT','BU','BV','BW','BX','BY','BZ',
            'CA','CB','CC','CD','CE','CF','CG','CH','CI','CJ','CK','CL','CM','CN','CO','CP','CQ','CR','CS','CT','CU','CV','CW','CX','CY','CZ','DA','DB','DC','DD','DE','DF','DG','DH','DI','DJ','DK','DL','DM','DN','DO','DP','DQ','DR','DS','DT','DU','DV','DW','DX','DY','DZ'];
  searchDailyShip;

  constructor(
    private ORPService: ORPService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private component: AppComponent
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }




  ngAfterViewInit() {
    console.log("ngAfterViewCheckedr403");
    
  }


  ngOnInit(): void {
    console.log("init");
    
    this.after = this.datetime.format("YYYY-MM-DD");
    this.before = this.datetime.add(15,'days').format("YYYY-MM-DD");
    this.search();
  }


  onChangeForOut(index): void {
    
    //預估內銷可出貨量 (只能電腦計算)
    index = index + (this.page - 1) * 8
    this.checkValue(this.dailyShips[index]);
    this.dailyShips[index].expect_export_sales = Math.round((Number(this.dailyShips[index].availble_ship) - Number(this.dailyShips[index].material)/3
        - Number(this.dailyShips[index].taichung_forout)/3)*2/3); 
    console.log(index);
    // 中部 (餘量)
    this.dailyShips[index].domestic_chou_remain = Math.round(Number(this.dailyShips[index].expect_export_sales) - Number(this.dailyShips[index].domestic_chou_noniscm)
      - Number(this.dailyShips[index].domestic_chou_iscm));
    console.log('domestic_chou_remain: ' + this.dailyShips[index].domestic_chou_remain);

    this.dailyShips[index].domestic_NS_onday_remain = Math.round((Number(this.dailyShips[index].availble_ship) - Number(this.dailyShips[index].material)/3
    - Number(this.dailyShips[index].taichung_forout)/3)/3/2 - Number(this.dailyShips[index].domestic_NS_onday_noniscm) 
      - Number(this.dailyShips[index].domestic_NS_onday_iscm) - Number(this.dailyShips[index].kaohsiung_onday));
    
      this.dailyShips[index].domestic_NS_platen_remain = Math.round((Number(this.dailyShips[index].availble_ship) - Number(this.dailyShips[index].material)/3
    - Number(this.dailyShips[index].taichung_forout)/3)/3/2 - Number(this.dailyShips[index].domestic_NS_platen_noniscm) 
      - Number(this.dailyShips[index].domestic_NS_platen_iscm) - Number(this.dailyShips[index].kaohsiung_platen));

      this.dailyShips[index].expect_domestic_sales = Math.round(Number(this.dailyShips[index].domestic_chou_noniscm) + Number(this.dailyShips[index].domestic_NS_onday_noniscm)
        + Number(this.dailyShips[index].domestic_NS_platen_noniscm) + Number(this.dailyShips[index].customer_add) + Number(this.dailyShips[index].domestic_chou_iscm)
        + Number(this.dailyShips[index].domestic_NS_onday_iscm) + Number(this.dailyShips[index].domestic_NS_platen_iscm));

        this.dailyShips[index].all_sales = Math.round(Number(this.dailyShips[index].expect_domestic_sales) + Number(this.dailyShips[index].kaohsiung_onday)
          + Number(this.dailyShips[index].kaohsiung_platen) + Number(this.dailyShips[index].taichung_forout));
  }

  search() {
    console.log("search");
    console.log(this.before);
    console.log(this.after);
    let myObj = this;

    myObj.ORPService.getEveryDayloadingReport(this.after,this.before).subscribe(res =>{
      
      this.searchDailyShip = res;
      
      this.dailyShips = [];

      for(var i=0 ; i < this.searchDailyShip.data.length; i++){
        //moment 格式問題˙
        this.searchDailyShip.data[i].date[1] -- ;
        var daily = new DailyShip(moment(this.searchDailyShip.data[i].date).format('YYYY-MM-DD'),this.datetime.format('YYYY-MM-DDTHH:mm:ss'),this.PLANT_CODE,this.USERNAME);
        daily.all_sales = this.searchDailyShip.data[i].allSales;
        daily.availble_ship = this.searchDailyShip.data[i].availbleShip;
        daily.customer_add = this.searchDailyShip.data[i].customerAdd;
        daily.domestic_chou_iscm = this.searchDailyShip.data[i].domesticChouIscm;
        daily.domestic_chou_noniscm = this.searchDailyShip.data[i].domesticChouNoniscm;
        daily.domestic_chou_remain = this.searchDailyShip.data[i].domesticChouRemain;
        daily.domestic_NS_onday_iscm = this.searchDailyShip.data[i].domesticNSOndayIscm;
        daily.domestic_NS_onday_noniscm = this.searchDailyShip.data[i].domesticNSOndayNoniscm;
        daily.domestic_NS_onday_remain = this.searchDailyShip.data[i].domesticNSOndayRemain;
        daily.domestic_NS_platen_iscm = this.searchDailyShip.data[i].domesticNSPlatenIscm;
        daily.domestic_NS_platen_noniscm = this.searchDailyShip.data[i].domesticNSPlatenNoniscm;
        daily.domestic_NS_platen_remain = this.searchDailyShip.data[i].domesticNSPlatenRemain;
        daily.expect_domestic_sales = this.searchDailyShip.data[i].expectDomesticSales;
        daily.expect_export_sales = this.searchDailyShip.data[i].expectExportSales;
        daily.kaohsiung_onday = this.searchDailyShip.data[i].kaohsiungOnday;
        daily.kaohsiung_platen = this.searchDailyShip.data[i].kaohsiungPlaten;
        daily.taichung_forout = this.searchDailyShip.data[i].taichungForout;
        daily.material = this.searchDailyShip.data[i].material;

        this.dailyShips.push(daily);
      }

    });
  }

  MESDownload() {
    console.log("MES Download");
  }
  onDateChange(result: Date[]): void {
    console.log('onChange: ', result);
    // before after
    this.after =  moment(result[0], "YYYY-MM-DD").format("YYYY-MM-DD");
    this.before = moment(result[1], "YYYY-MM-DD").format("YYYY-MM-DD");
  }

  save(){
    console.log('save');
    let myObj = this;
    console.log(JSON.stringify(this.dailyShips));

    myObj.ORPService.sendEveryDayloadingReport(this.dailyShips).subscribe(res => {
      let result:any = res;
      if(result.code === 200) {
        let jsonString = result.data;

        console.log(jsonString)
        console.log("成功接收資料")
      } else {
        this.message.error('後台錯誤，請檢查')
      }
    },err => {
      this.message.error('請求獲取失敗')
    })
    

  }

  exportExcel(){
    console.log('exportExcel');

    const data = new Array(19);

    for(let i = 0 ; i< 19 ; i++){
        data[i] = new Array(17);
    }
    for(var i = 0 ; i< 19 ; i++){       
          for(var j=0 ;j<2;j ++){
            

            if(j == 0){
                          
                if(i== 3)
                  data[i][j] ='外銷';
                else if (i == 6)
                  data[i][j] ='預估內銷可出貨量';
                else if (i == 7)
                  data[i][j] ='內銷';
                else if (i == 17)
                  data[i][j] ='預估內銷出貨量';
                else if (i == 18)
                  data[i][j] ='合計出貨量';
                else 
                  data[i][j] = '';

            }else if(j == 1)          
              data[i][j] = this.title[i];
            else{
            }
          
          }
        
    }

    for(var k=0 ; k < this.dailyShips.length; k ++){
      var propertyValues = this.dailyShips[k];
      data[0][k+2] = propertyValues.date;
      data[1][k+2] = propertyValues.availble_ship;
      data[2][k+2] = propertyValues.material;
      data[3][k+2] = propertyValues.kaohsiung_onday;
      data[4][k+2] = propertyValues.kaohsiung_platen;
      data[5][k+2] = propertyValues.taichung_forout;
      data[6][k+2] = propertyValues.domestic_chou_noniscm;
      data[7][k+2] = propertyValues.domestic_NS_onday_noniscm;
      data[8][k+2] = propertyValues.domestic_NS_platen_noniscm;
      data[9][k+2] = propertyValues.customer_add;
      data[10][k+2] = propertyValues.domestic_chou_iscm;
      data[11][k+2] = propertyValues.domestic_NS_onday_iscm;
      data[12][k+2] = propertyValues.domestic_NS_platen_iscm;
      data[13][k+2] = propertyValues.domestic_chou_remain;
      data[14][k+2] = propertyValues.domestic_NS_onday_remain;
      data[15][k+2] = propertyValues.domestic_NS_platen_remain;
      data[16][k+2] = propertyValues.expect_domestic_sales;
      data[17][k+2] = propertyValues.expect_export_sales;
      data[18][k+2] = propertyValues.all_sales;

    }

    let sheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = {Sheets: {'data': sheet}, SheetNames: ['data']};
    sheet['!merges'] = [  
      // s: start,
      // r: row,
      // c: column,
      // e: end.
      // 因此，這個 object 會設定合併從 (0, 0) 到 (0, 2) 的儲存格。
      {s: {r: 3, c: 0}, e: {r: 5, c: 0}},
    {s: {r: 7, c: 0}, e: {r: 16, c: 0}},
    {s: {r: 6, c: 0}, e: {r: 6, c: 1}},
    {s: {r: 17, c: 0}, e: {r: 17, c: 1}},
    {s: {r: 18, c: 0}, e: {r: 18, c: 1}}
  ];
    XLSX.writeFile(workbook, "test.xlsx"); 
  }

  private renameExcelColunmTitle(_ws,_titleArray){
		 console.log("_ws:" + JSON.stringify(_ws))
		for(let i=0;i< _titleArray.length;i++){
			let title = _titleArray[i];
			let key = this.letter[i]+1;
            // console.log("title:" + title)
			// console.log("key:" + key)
			_ws[key]['v'] = '';
		}
		return _ws;
	}

  checkValue(daily:DailyShip){

    if(daily.availble_ship.toString() == "")
      daily.availble_ship = 0;
    if(daily.material.toString() == "")
      daily.material = 0;
    if(daily.kaohsiung_onday.toString() == "")
      daily.kaohsiung_onday = 0;
    if(daily.kaohsiung_platen.toString() == "")
      daily.kaohsiung_platen = 0;
    if(daily.taichung_forout.toString() == "")
      daily.taichung_forout = 0;
    if(daily.domestic_chou_noniscm.toString() == "")
      daily.domestic_chou_noniscm = 0;
    if(daily.domestic_NS_onday_noniscm.toString() == "")
      daily.domestic_NS_onday_noniscm = 0;
    if(daily.domestic_NS_platen_noniscm.toString() == "")
      daily.domestic_NS_platen_noniscm = 0;
    if(daily.customer_add.toString() == "")
      daily.customer_add = 0;
    if(daily.domestic_chou_iscm.toString() == "")
      daily.domestic_chou_iscm = 0;
    if(daily.domestic_NS_onday_iscm.toString() == "")
      daily.domestic_NS_onday_iscm = 0;
    if(daily.domestic_NS_platen_iscm.toString() == "")
      daily.domestic_NS_platen_iscm = 0;
    if(daily.domestic_chou_remain.toString() == "")
      daily.domestic_chou_remain = 0;
    if(daily.domestic_NS_onday_remain.toString() == "")
      daily.domestic_NS_onday_remain = 0;
    if(daily.domestic_NS_platen_remain.toString() == "")
      daily.domestic_NS_platen_remain = 0;
    if(daily.expect_domestic_sales.toString() == "")
      daily.expect_domestic_sales = 0;
    if(daily.expect_export_sales.toString() == "")
      daily.expect_export_sales = 0;
    if(daily.all_sales.toString() == "")
      daily.all_sales = 0;
  }
}
