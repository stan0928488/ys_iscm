import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { ORPService } from "src/app/services/ORP/ORP.service";
import { zh_TW ,NzI18nService } from "ng-zorro-antd/i18n";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { AppComponent } from "src/app/app.component";
import { NzTableSize } from 'ng-zorro-antd/table';
import * as XLSX from 'xlsx'
import * as _ from "lodash";
import * as moment from 'moment';
import { reject } from "lodash";


interface Data {
  id: string;
  tab1ID: number;
  strategy_name: string;            // 策略名稱(欄位) 
  priority_a: string;               // 排序1
  priority_b: string;               // 排序2
  priority_c: string;               // 排序3
  priority_d: string;               // 排序4
  priority_e: string;               // 排序5
  priority_f: string;               // 排序6
}

@Component({
  selector: "app-ORPP101",
  templateUrl: "./ORPP101.component.html",
  styleUrls: ["./ORPP101.component.scss"],
  providers:[NzMessageService]
})
export class ORPP101Component implements AfterViewInit {
	loading = false; //loaging data flag
  isVisible = false;
  isOPVisible = true;
  isSpinning = false;
  disable_r = false;
  disable_o = false;
  USERNAME;

  selCustomer: string;  // 已選擇客戶
  listOfData = [];   // queryData
  listOfData1 = [];

  // 訂單配料程式所需欄位
  SALE_ORDER: string;               // 訂單號碼
  DATE_DELIVERY_PP: string;         // 生計交期
  SALE_ORDER_WEIGHT: string;        // 訂單重
  CYCLE_NO: string;                 // CTCLE_NO
  PRODUCT: string;                  // 產品分類
  CUSTOMER: string;                 // 客戶
  PP_SHOW_LINEUP_DESC: string;      // 製程
  MTRL_NO: string;                  // 料號
  GRADE_NO: string;                 // 鋼種
  SALE_ORDER_THICK: string;         // 訂單厚度(厚度?)
  JIS_MARK: string;                 // JIS_MARK
  SALE_ORDER_WIDTH: string;         // 寬度
  THICK_MAX: string;                // 厚度上限
  THICK_MIN: string;                // 厚度下限
  HOT_ROLLED_THICK: string;         // 熱軋厚度
  MAX_WEIGHT_OF_EACH_PROD: string;  // 單重上限
  MIN_WEIGHT_OF_EACH_PROD: string;  // 單重下限
  FLAG_CERTIICATE_ORIGIN: string;   // 產證
  FLAG_BIS: string;                 // BIS 認證
  CUST_SPECIAL: string;             // 訂單特殊需求
  UNROLL_WEIGHT: string;            // 待軋量

  pp_date_start: string;            // 生計交期_起
  pp_date_end: string;              // 生計交期_迄
  strategy_method: string;          // 選定策略

  strategylistOfOption = [];        // 策略選單 
  strategyName: string;             // 策略名稱

  // 配料策略設定所需欄位
  strategy_name: string;            // 策略名稱(欄位) 
  order: string;                    // 順位
  priority_a: string;               // 排序1
  priority_b: string;               // 排序2
  priority_c: string;               // 排序3
  priority_d: string;               // 排序4
  priority_e: string;               // 排序5
  priority_f: string;               // 排序6

  // ---新增策略頁面--- //
  // ---1.鋼種--- 
  textValue1 = false;
  textValue2 = false;
  textValue3 = false;
  // ---2.寬度--- 
  textValue4 = false;
  textValue5 = false;
  textValue6 = false;
  textValue7 = false;
  textValue8 = false;
  // ---3.規範訂單--- 
  textValue9 = false;
  textValue10 = false;
  // ---4.鋼種匹配--- 
  textValue11 = false;
  textValue12 = false;
  // ---5.厚度---  
  textValue13 = false;
  textValue14 = false;
  // ---6.產品別---
  textValue15 = false;
  textValue16 = false;


  createOrderlist = Array(6).fill(null);   // 初始條件為6個null


  editCache1: { [key: string]: { edit: boolean; data: Data } } = {};
  TBORPM045List: Data[] = [];
  RawTBORPM045ListLen;
  listOfDisplayData;
  tableSize: NzTableSize = 'middle';

  // 搜尋功能
  searchValue = "";
  visible1 = false;
  visible2 = false;
  visible3 = false;
  visible4 = false;
  visible5 = false;
  visible6 = false;
  visible7 = false;


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
  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    
  }
  
  // --- 新增策略 Function --- //
  // 1.鋼種
  onClick1(event) {
    if ((this.textValue1)||(this.textValue2)||(this.textValue3)){
      const label = document.querySelector(`label[for='${event.target.id}']`);
      const labelText = label?.textContent;
      this.createOrderlist[0] = labelText
    } else {this.createOrderlist[0] = null}
    console.log(this.createOrderlist)
  }
  // 2.寬度
  onClick2(event) {
    if ((this.textValue4)||(this.textValue5)||(this.textValue6)||(this.textValue7)||(this.textValue8)){
      const label = document.querySelector(`label[for='${event.target.id}']`);
      const labelText = label?.textContent;
      this.createOrderlist[1] = labelText
    } else {this.createOrderlist[1] = null}
    console.log(this.createOrderlist)
  }
  // 3.規範訂單
  onClick3(event) {
    if ((this.textValue9)||(this.textValue10)){
      const label = document.querySelector(`label[for='${event.target.id}']`);
      const labelText = label?.textContent;
      this.createOrderlist[2] = labelText
    } else {this.createOrderlist[2] = null}
    console.log(this.createOrderlist)
  }
  // 4.鋼種匹配
  onClick4(event) {
    if ((this.textValue11)||(this.textValue12)){
      const label = document.querySelector(`label[for='${event.target.id}']`);
      const labelText = label?.textContent;
      this.createOrderlist[3] = labelText
    } else {this.createOrderlist[3] = null}
    console.log(this.createOrderlist)
  }
  // 5.厚度
  onClick5(event) {
    if ((this.textValue13)||(this.textValue14)){
      const label = document.querySelector(`label[for='${event.target.id}']`);
      const labelText = label?.textContent;
      this.createOrderlist[4] = labelText
    } else {this.createOrderlist[4] = null}
    console.log(this.createOrderlist)
  }
  // 6.產品別
  onClick6(event) {
    if ((this.textValue15)||(this.textValue16)){
      const label = document.querySelector(`label[for='${event.target.id}']`);
      const labelText = label?.textContent;
      this.createOrderlist[5] = labelText
    } else {this.createOrderlist[5] = null}
    console.log(this.createOrderlist)
  }


  openPickerCancel() {
    this.isVisible = false;
  }

  // 匯出EXCEL
  async exportToExcel() {
    /* generate worksheet */
    var json_data = this.listOfData1
    json_data = JSON.parse(JSON.stringify(json_data).split('"strategy_name":').join('"策略名稱":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"order":').join('"順位":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"priority_a":').join('"選項1":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"priority_b":').join('"選項2":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"priority_c":').join('"選項3":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"priority_d":').join('"選項4":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"priority_e":').join('"選項5":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"priority_f":').join('"選項6":'));
    for (let i = 1; i <= json_data.length; i++){
      delete json_data[i-1]['id'];
      delete json_data[i-1]['tab1ID'];
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json_data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '歷史策略清單');
    /* save to file */
    XLSX.writeFile(wb, '歷史策略清單.xlsx');
    await this.delay(500); // 睡眠0.5秒，以同步程式
    // this.LoadingStatus("Off");
    this.sucessMSG("成功匯出!", ``);
  }

  // 控制加載圖示顯示/隱藏
  LoadingStatus(Status) {
    var loadingStatus = document.getElementById('loadingStatus')
    if (Status==='On') {
      loadingStatus.className = "";
      // 鎖住按鈕
      (<HTMLInputElement>document.getElementById("singleAdd")).disabled = true;
      (<HTMLInputElement>document.getElementById("bacthAdd")).disabled = true;
      (<HTMLInputElement>document.getElementById("download")).disabled = true;
    }
    else {
      loadingStatus.className = "hidden";
      // 打開按鈕
      (<HTMLInputElement>document.getElementById("singleAdd")).disabled = false;
      (<HTMLInputElement>document.getElementById("bacthAdd")).disabled = false;
      (<HTMLInputElement>document.getElementById("download")).disabled = false;
    }
  }

  // 睡眠函式
  delay(ms: number) {
    return new Promise<void>(function(resolve) {
      setTimeout(resolve, ms);
    });
  }


  // --復原
  reset() {
    this.listOfDisplayData = this.TBORPM045List
    console.log(this.listOfDisplayData)
    this.visible1 = false;
    this.visible2 = false;
    this.visible3 = false;
    this.visible4 = false;
    this.visible5 = false;
    this.visible6 = false;
    this.visible7 = false;
  }

  // --搜尋 by key
  search(searchValue, searchKey) {
    this.listOfDisplayData = []
    for (let i = 1; i <= this.TBORPM045List.length; i++){
      if (this.TBORPM045List[i-1][searchKey] === searchValue) {
        this.listOfDisplayData.push(this.TBORPM045List[i-1])
      }
    }
    console.log(this.listOfDisplayData)
  }

  // --搜尋各欄位
  searchStrategyName(searchValue) {this.search(searchValue, "strategy_name"); this.visible1 = false}
  searchPriorityA(searchValue) {this.search(searchValue, "priority_a"); this.visible1 = false}
  searchPriorityB(searchValue) {this.search(searchValue, "priority_b"); this.visible1 = false}
  searchPriorityC(searchValue) {this.search(searchValue, "priority_c"); this.visible1 = false}
  searchPriorityD(searchValue) {this.search(searchValue, "priority_d"); this.visible1 = false}
  searchPriorityE(searchValue) {this.search(searchValue, "priority_e"); this.visible1 = false}
  searchPriorityF(searchValue) {this.search(searchValue, "priority_f"); this.visible1 = false}

  // 刪除
  deleteRow(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }

  // 刪除資料
  delID(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache1[_id].data.tab1ID;
        myObj.ORPService.delTBORPM032(_ID).subscribe(res => {
          if(res["message"] === "success") {
            this.strategy_name = undefined;
            this.priority_a = undefined;
            this.priority_b = undefined;
            this.priority_c = undefined;
            this.priority_d = undefined;
            this.priority_e = undefined;
            this.priority_f = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getStrategyTable();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.loading = false;
        })
      });
    }
  }

  // update Save
  saveEdit(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache1[id].data)
      let myObj = this;
      if (this.editCache1[id].data.strategy_name === undefined) {
        myObj.message.create("error", "「策略名稱」不可為空");
        return;
      } else if (this.editCache1[id].data.priority_a === undefined) {
        myObj.message.create("error", "「排序1」不可為空");
        return;
      } else {
        this.Modal.confirm({
          nzTitle: '是否確定?',
          nzOnOk: () => {
            this.updateSave(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }

  // 修改
  editRow(id: string, _type): void {
    if(_type === 1) {
      this.editCache1[id].edit = true;
      // this.getRequierList();
      // this.getPickerShopData(id);
      // this.getPickerMachineData(this.editCache1[id].data.SCH_SHOP_CODE_1, id);
    }
  }

  // 修改資料
  updateSave(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.loading = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          id : this.editCache1[_id].data.tab1ID,
          strategy_name : this.editCache1[_id].data.strategy_name,
          priority_a : this.editCache1[_id].data.priority_a,
          priority_b : this.editCache1[_id].data.priority_b,
          priority_c : this.editCache1[_id].data.priority_c,
          priority_d : this.editCache1[_id].data.priority_d,
          priority_e : this.editCache1[_id].data.priority_e,
          priority_f : this.editCache1[_id].data.priority_f,
          userUpdate : this.USERNAME,
          userCreate : this.USERNAME,
        })

        // 若數據長度沒變(修改)，則以更新方式處理
        if (this.RawTBORPM045ListLen === this.TBORPM045List.length) {
          myObj.ORPService.updateTBORPM032(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.strategy_name = undefined;
              this.priority_a = undefined;
              this.priority_b = undefined;
              this.priority_c = undefined;
              this.priority_d = undefined;
              this.priority_e = undefined;
              this.priority_f = undefined;
  
              this.sucessMSG("修改成功", ``)
  
              const index = this.TBORPM045List.findIndex(item => item.id === _id);
              Object.assign(this.TBORPM045List[index], this.editCache1[_id].data);
              this.editCache1[_id].edit = false;
            }
          },err => {
            reject('upload fail');
            this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
            this.loading = false;
          })
        }
        // 若數據長度改變(新增)，則以寫入方式處理
        else {
          myObj.ORPService.insertTBORPM032(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.strategy_name = undefined;
              this.priority_a = undefined;
              this.priority_b = undefined;
              this.priority_c = undefined;
              this.priority_d = undefined;
              this.priority_e = undefined;
              this.priority_f = undefined;
              this.getStrategyTable();
              
              this.sucessMSG("修改成功", ``)
  
              const index = this.TBORPM045List.findIndex(item => item.id === _id);
              Object.assign(this.TBORPM045List[index], this.editCache1[_id].data);
              this.editCache1[_id].edit = false;
            }
          },err => {
            reject('upload fail');
            this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
            this.loading = false;
          })
        }
        
      });
    }
  }

  // cancel
  cancelEdit(id: string, _type): void {
    if(_type === 1) {
      const index = this.TBORPM045List.findIndex(item => item.id === id);
      // 若數據長度沒變(修改)，則以取消方式處理
      if (this.RawTBORPM045ListLen === this.TBORPM045List.length) {
        this.editCache1[id] = {
          data: { ...this.TBORPM045List[index] },
          edit: false
        };
      }
      // 若數據長度改變(新增)，則以刪除ID方式處理
      else {
        this.TBORPM045List = this.TBORPM045List.filter(ItemData1 => ItemData1.id !== id);
        this.listOfDisplayData = this.listOfDisplayData.filter(ItemData1 => ItemData1.id !== id);
        delete this.editCache1[id];
      }
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

  // 查詢檢查
  requestTEST(){
    let myObj = this;
    myObj.message.create("warning", "功能待開發");
  }



  // 執行歷史策略查詢
  onSearch() {
    let myObj = this;
    myObj.message.create("success", "資料讀取中 ...")
    this.getStrategyTable();
  }

  // 送出歷史策略查詢(項目)
  getStrategyTable(){
    let myObj = this;
    let obj = {};
      _.extend(obj, {
        pp_date_start : this.pp_date_start,
        pp_date_end : this.pp_date_end,
        unroll_weight : this.UNROLL_WEIGHT,
        strategy_method : this.strategyName
      })

      myObj.ORPService.getStrategyTable(obj).subscribe(res => {
        let result:any = res;
        if(result.code === 200) {
          let jsonString = result.data;
          this.listOfData = JSON.parse(jsonString);
          console.log(jsonString)
          console.log("成功接收資料")
        } else {
          this.message.error('後台錯誤，請檢查')
        }
      },err => {
        reject('upload fail');
        this.message.error('請求獲取失敗')
      })
  }


  // 執行特定策略查詢
  onStrategy(_data) {
    let myObj = this;
    console.log("--1--")
    console.log(_data)
    console.log("--1--")
    myObj.message.create("success", "資料讀取中 ...")
    this.getSpecifyStrategyTable(_data);
  }

  // 送出特定策略查詢
  getSpecifyStrategyTable(_data){
    let myObj = this;
    let obj = {};
      _.extend(obj, {
        strategy_method : _data
      })
      console.log("--2--")
      console.log(obj)
      console.log("--2--")
      myObj.ORPService.getSpecifyStrategyTable(obj).subscribe(res => {
        let result:any = res;
        if(result.code === 200) {
          let jsonString = result.data;
          this.listOfData1 = JSON.parse(jsonString);
          console.log(jsonString)
          console.log("成功接收資料")
        } else {
          this.message.error('後台錯誤，請檢查')
        }
      },err => {
        reject('upload fail');
        this.message.error('請求獲取失敗')
      })
  }

  openPicker() {
    this.isVisible = true;
  }
  
}

