import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { ORPService } from "src/app/services/ORP/ORP.service";
import { zh_TW ,NzI18nService } from "ng-zorro-antd/i18n";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { AppComponent } from "src/app/app.component";
import * as _ from "lodash";
import * as moment from 'moment';

interface Data {
  id: number;
  productKind: string;
  product: string;
  ID_NO: string;
  gradeNo: string;
  width: number;
  thickness: number;
  quality: string;
  weight: number;
  wipTime: string;
  DATE_PLAN_IN_STORAGE: string;
  DATE_DELIVERY_PP: string;
  memo: String;
  countDay: number;
  disabled: boolean;
}

@Component({
  selector: "app-ORPV101",
  templateUrl: "./ORPV101.component.html",
  styleUrls: ["./ORPV101.component.scss"],
  providers:[NzMessageService]
})

export class ORPV101Component implements AfterViewInit {
	loading = false; //loaging data flag
  isVisible = false;
  isOPVisible = true;
  isSpinning = false;
  isClear = true;
  disable_u = false;
  disable_d = true;
  disablePR = true;
  disableMR = true;
  disableOTW = true;
  USERNAME;
  PLANT_CODE;     // 廠區別
  
  customer = "";     // 客戶名稱
  custlistOfOption = [];
  gradeNo = "304";  // 鋼種
  productList = "2B";  // 表面
  width: number = null;        // 寬度
  thicknessMin: number = null; // 訂單厚度上下限起
  thicknessMax: number = null; // 訂單厚度上下限迄
  // materialThicknessMin: number = null;    // 原料厚度上限
  // materialThicknessMax: number = null;    // 原料厚度下限
  weightMin: number = null; // 單重上下限起
  weightMax: number = null; // 單重上下限迄
  expectdate = "";    // 期望交期
  unrollWeight : number = null; // 需求量
  Trimming = "N";     // 修邊
  JIS = "N";          // JIS
  Certificate = "N";  // 產證

  productCount: number;   // 成品數量
  productWeight: number;   // 成品重量
  materialDate;        // 原料預計入庫日
  materialCount: number;   // 原料數量
  materialWeight: number;   // 原料重量
  onthewayDate;        // 在途預計入庫日
  onthewayCount: number;   // 在途數量
  onthewayWeight: number;   // 在途重量

  productResult = [];
  materialResult = [];
  onthewayResult = [];
  productReserve: number;    // 成品預留量
  materialReserve: number;   // 原料預留量
  onthewayReserve: number;   // 在途預留量


  selCustomer = "";  // 已選擇客戶
  listOfData:Data[] = [];   // queryData
  setOfCheckedId = new Set<number>();     // 挑選
  listOfCurrentPageData: Data[] = [];



  panels = [
    {
      active: true,
      name: '資料查詢區域',
      disabled: false
    }
  ];



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
    console.log("ngAfterViewChecked");
    
  }


  ngOnInit(): void {
    this.isVisible = false;
    this.isOPVisible = true;
    this.isSpinning = false;
    this.disable_u = false;
    this.disable_d = true;
    this.disablePR = true;
    this.disableMR = true;
    this.isClear = true;
  
    this.customer = "";     // 客戶名稱
    this.custlistOfOption = [];
    this.gradeNo = "304";  // 鋼種
    this.productList = "2B";  // 表面
    this.width = null;        // 寬度
    this.thicknessMin = null; // 訂單厚度起
    this.thicknessMax = null; // 訂單厚度迄
    this.weightMin = null; // 單重上下限起
    this.weightMax = null; // 單重上下限迄
    this.expectdate = "";    // 期望交期
    this.unrollWeight  = null; // 需求量
    this.Trimming = "Y";     // 修邊
    this.JIS = "Y";          // JIS
    this.Certificate = "Y";  // 產證

    this.productCount = null;   // 成品數量
    this.productWeight = null;   // 成品重量
    this.materialDate = null;        // 原料預計入庫日
    this.materialCount = null;   // 原料數量
    this.materialWeight = null;   // 原料重量
    this.onthewayDate = null;        // 在途預計入庫日
    this.onthewayCount = null;   // 在途數量
    this.onthewayWeight = null;   // 在途重量

    this.productReserve = null;    // 成品預留量
    this.materialReserve = null;   // 原料預留量
    this.onthewayReserve = null;   // 在途預留量

    this.listOfData = [];   // queryData
    this.selCustomer = "";  // 已選擇客戶
    this.setOfCheckedId = new Set<number>();     // 挑選
    this.listOfCurrentPageData = [];
  }

  // 客戶名稱
  getcustList() {
    this.loading = true;
    let myObj = this;
    this.ORPService.getCustList().subscribe(res => {
      let result:any = res ;
      if(result.code === 200) {
        let newres = [];
        for(let i=0 ; i < result.data.length ; i++) {
          newres.push(result.data[i].custAbbreviations);
        }
        this.custlistOfOption = newres;

      } else {
        this.message.error('後台錯誤，請檢查');
      }
      myObj.loading = false;
    },err => {
      this.message.error('請求獲取失敗');
    });
  }

  // 表面異動控制
  changeProd(_value) {
    if(_value === 'No.1') {
      this.disable_u = false;
      this.disable_d = false;
      this.thicknessMin = null;
      this.thicknessMax = null;
    } else {
      this.disable_u = false;
      this.disable_d = true;
      this.thicknessMax = null;
    }
  }
  
  // 期望時間
  changeDate(result: Date): void {
    this.expectdate = this.component.dateFormat(result, 2)
  }

  // 檢查需求厚度&厚度上下限
  chekMinMax(_type) {
    if(_type === '1') {
      if((this.thicknessMin > this.thicknessMax) && (this.thicknessMax !== null)) {
        this.thicknessMin = null;
        this.message.create("error", `厚度上下限起不可超過厚度上下限迄`);
        return;
      }
    } else if(_type === '2') {
      if((this.weightMin > this.weightMax) && (this.weightMax !== null)) {
        this.weightMin = null;
        this.message.create("error", `單重上下限起不可超過單重上下限迄`);
        return;
      }
    } else if(_type === '3') {
      if(this.unrollWeight  <= 0) {
        this.message.create("error", `需求量必須大於 0 `);
        return;
      }
    }
  }

  // 檢查預留數量是否有超過
  chekCont(_type) {
    if (_type === '1') {
      if(this.productReserve > this.productCount) {
        this.message.create("error", `成品預留數量不可超過目前數量 ${this.productCount}`);
        return;
      }
    } else if (_type === '2') {
      if(this.materialReserve > this.materialCount) {
        this.message.create("error", `原料預留數量不可超過目前數量 ${this.materialCount}`);
        return;
      }
    } else if (_type === '3') {
      if(this.onthewayReserve > this.onthewayCount) {
        this.message.create("error", `在途預留數量不可超過目前數量 ${this.onthewayCount}`);
        return;
      }
    }
  }

  // 執行查詢檢查
  onQuery() {
    this.isSpinning = true;
    let myObj = this;
    if (this.customer === "" || this.customer === null) {
      myObj.message.create("error", "請選擇「客戶名稱」");
      return;
    } else if (this.width === null) {
      myObj.message.create("error", "「寬度」為必填");
      return;
    } else if (this.productList === "No.1") {
      if (this.thicknessMin === null || this.thicknessMax === null) {
        myObj.message.create("error", "表面為 No.1，「厚度上下限」為必填");
        return;
      }
    } else if (this.productList !== "No.1") {
      if (this.thicknessMin === null) {
        myObj.message.create("error", "表面非 No.1，「厚度上下限起」為必填");
        return;
      }
    } else if (this.unrollWeight  === null) {
      myObj.message.create("error", "「需求量」為必填");
      return;
    }
    this.SendQuery();

  }

  // 送出查詢
  SendQuery() {
    let myObj = this;
    let weightMin = null;
    let weightMax = null;
    if(this.weightMin != null) {
      weightMin = this.weightMin*1000;
    }
    
    if(this.weightMax != null) {
      weightMax = this.weightMax*1000;
    }
    
		return new Promise((resolve, reject) => {
			let obj = {};
			_.extend(obj, {
        customer : this.customer,
        gradeNo : this.gradeNo,
        product : this.productList,
				width : this.width,
        thicknessMin : this.thicknessMin,
        thicknessMax : this.thicknessMax,
        weightMin : weightMin,
        weightMax : weightMax,
        expectDate : this.expectdate,
        unrollWeight: this.unrollWeight*1000,
        Trimming : this.Trimming,
        JIS : this.JIS,
        certificate : this.Certificate,
        plantCode: this.PLANT_CODE,
        userName : this.USERNAME,
        dateTime : moment().format('YYYY-MM-DD')
			})

      myObj.ORPService.SendQuery(obj).subscribe(res => {
        let result:any = res ;
        if(result.code === 200) {
          let jsonString = result.data ;
          this.listOfData = JSON.parse(jsonString);
          if(this.listOfData.length < 1) {
            this.errorMSG("查無對應匹配資料", "");
            return;
          } else {
            // 成品清單
            this.productResult = [];
            // 原料清單
            this.materialResult = [];
            _.forEach(this.listOfData, item => {
              let kind = _.get(item, "productKind");
              if(kind === '成品') {
                this.productResult.push(item);
                this.productCount = this.component.toThousandNumber(this.productResult.length, 0);
                this.productWeight = this.component.toThousandNumber((this.productResult.map(el=>el.weight)).reduce((a,b)=>a+b), 0);
                this.disablePR = false;
              } else if(kind === '原料' || kind === '廠內') {
                this.materialResult.push(item);
                this.materialDate = this.component.dateFormat( this.materialResult[0].datePlanInStorage, 2)
                this.materialCount = this.component.toThousandNumber(this.materialResult.length, 0);
                this.materialWeight = this.component.toThousandNumber((this.materialResult.map(el=>el.weight)).reduce((a,b)=>a+b), 0);
                this.disableMR = false;
              } else if(kind === '在途') {
                this.onthewayResult.push(item);
                this.onthewayDate = this.component.dateFormat( this.onthewayResult[0].DATE_PLAN_IN_STORAGE, 2);
                this.onthewayCount = this.component.toThousandNumber(this.onthewayResult.length, 0);
                this.onthewayWeight = this.component.toThousandNumber((this.onthewayResult.map(el=>el.weight)).reduce((a,b)=>a+b), 0);
                this.disableOTW = false;
              } 
            });
          }


          this.isOPVisible = false;
          this.isClear = false;
          myObj.loading = false;
  
        } else {
          this.message.error('後台錯誤，請檢查');
        }
      },err => {
        reject('upload fail');
        this.message.error('請求獲取失敗');
      });
      this.isSpinning = false;
		});
  }
  
  openPicker() {
    this.isVisible = true;
    this.selCustomer = this.customer;


    /*

          // 成品清單
          const productResult = [];
          _.forEach(this.listOfData, item => {
            let kind = _.get(item, "productKind");
            if(kind === '成品') productResult.push(item);
          });

          this.productCount = this.component.toThousandNumber(productResult.length, 0);
          this.productWeight = this.component.toThousandNumber((productResult.map(el=>el.weight)).reduce((a,b)=>a+b), 0);
          this.disablePR = false;
          
          // 原料清單
          productResult
          materialResult
          const materialResult = [];
          _.forEach(this.listOfData, item => {
            let kind = _.get(item, "productKind");
            if(kind === '原料') materialResult.push(item);
          });
          this.materialDate = this.component.dateFormat( materialResult[0].datePlanInStorage, 2)
          this.materialCount = this.component.toThousandNumber(materialResult.length, 0);
          this.materialWeight = this.component.toThousandNumber((materialResult.map(el=>el.weight)).reduce((a,b)=>a+b), 0);
          this.disableMR = false;

    */

    

    if(this.productReserve > 0) {
      // onCurrentPageDataChange
      for(let i = 1; i <= this.productReserve; i++) {
        this.onItemChecked(i.toString(), true);
      }
      for(let j = this.productReserve+1; j > this.productCount; j++) {
        this.onItemChecked(j.toString(), false);
      }
    }
  }

  openPickerOK(): void {
    this.isVisible = true;
    this.loading = true;
    const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data.id));
    console.log(requestData);
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loading = false;
    }, 1000);
  }


  openPickerCancel() {
    this.isVisible = false;

  }

  onItemChecked(id, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id, checked: boolean): void {
    console.log(id)
    if (checked) {
      this.setOfCheckedId.add(id);
      // console.log(this.setOfCheckedId)
      this.listOfData[id-1].countDay = 3;
    } else {
      this.setOfCheckedId.delete(id);
      this.listOfData[id-1].countDay = undefined;
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  // 重整點選狀態
  refreshCheckedStatus(): void {
    // console.log(" refreshCheckedStatus ")
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    // console.log(listOfEnabledData) 
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
