import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { SPAService } from "src/app/services/SPA/SPA.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx'
import { NzTabPosition } from "ng-zorro-antd/tabs";
// import ExcelExport from 'export-xlsx';


interface ItemData1 {
  id: string;
  tab1ID: number;
  plantCode: string;
  forecastReceiveDate: string;
  custAbbr: string;
  productType: string;
  stage1Amount: number;
  stage2Amount: number;
  stage3Amount: number;
  stage4Amount: number;
}

@Component({
  selector: "app-SPAP100",
  styleUrls: ["./SPAP100.component.scss"],
  templateUrl: "./SPAP100.component.html",
  providers:[NzMessageService]
})
export class SPAP100component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;


  // 搜尋功能
  searchValue = "";
  searchKey = "";
  SPA100ListOfDisplayData;
  visible1 = false;
  visible2 = false;
  visible3 = false;
  visible4 = false;
  visible5 = false;
  visible6 = false;
  visible7 = false;
  visible8 = false;

  // 業務每月預估量
  plantCode;
  forecastReceiveDate;
  custAbbr;
  productType;
  stage1Amount;
  stage2Amount;
  stage3Amount;
  stage4Amount;


  // tab 1
  SPA100List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  SPA100List: ItemData1[] = [];
  RawSPA100ListLen;


  constructor(
    private SPAService: SPAService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
  }

  // 進入頁面及執行
  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getSPA100AllList();
  }
  
  
  //取得全部資料
  getSPA100AllList() {
    this.loading = true;
    let myObj = this;
    this.SPAService.getSPA100AllList().subscribe(res => {
      console.log("getSPA100AllList success");
      this.SPA100List_tmp = res['data'];
      
      const data = [];
      for (let i = 0; i < this.SPA100List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.SPA100List_tmp[i].id,

          plantCode: this.SPA100List_tmp[i].plantCode,
          forecastReceiveDate: this.SPA100List_tmp[i].forecastReceiveDate,
          custAbbr: this.SPA100List_tmp[i].custAbbr,
          productType: this.SPA100List_tmp[i].productType,
          stage1Amount: this.SPA100List_tmp[i].stage1Amount,
          stage2Amount: this.SPA100List_tmp[i].stage2Amount,
          stage3Amount: this.SPA100List_tmp[i].stage3Amount,
          stage4Amount: this.SPA100List_tmp[i].stage4Amount
        });
      }
      this.RawSPA100ListLen = data.length; // 原始數據長度
      this.SPA100List = data; // 原始數據
      this.SPA100ListOfDisplayData = data // 搜尋顯示數據
      this.updateEditCache(1);
      console.log(this.SPA100List);
      myObj.loading = false;
    });
  }

  // insert1
  insertTab1() {
    let myObj = this;
    if (this.custAbbr === undefined) {
      myObj.message.create("error", "「客戶」不可為空");
      return;
    } 
    else if (this.productType === undefined) {
      myObj.message.create("error", "「產品別」不可為空");
      return;
    } 
    else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }


  // update
  editRow(id: string, _type): void {
    if(_type === 1) {
      this.editCache1[id].edit = true;
      // this.getRequierList();
      // this.getPickerShopData(id);
      // this.getPickerMachineData(this.editCache1[id].data.SCH_SHOP_CODE_1, id);
    }
  }
  
  
  // delete
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

  // cancel
  cancelEdit(id: string, _type): void {
    if(_type === 1) {
      const index = this.SPA100List.findIndex(item => item.id === id);
      // 若數據長度沒變(修改)，則以取消方式處理
      if (this.RawSPA100ListLen === this.SPA100List.length) {
        this.editCache1[id] = {
          data: { ...this.SPA100List[index] },
          edit: false
        };
      }
      // 若數據長度改變(新增)，則以刪除ID方式處理
      else {
        this.SPA100List = this.SPA100List.filter(ItemData1 => ItemData1.id !== id);
        this.SPA100ListOfDisplayData = this.SPA100ListOfDisplayData.filter(ItemData1 => ItemData1.id !== id);
        delete this.editCache1[id];
      }
    }
  }

  // update Save
  saveEdit(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache1[id].data)
      let myObj = this;
      if (this.editCache1[id].data.custAbbr === undefined) {
        myObj.message.create("error", "「客戶」不可為空");
        return;
      } else if (this.editCache1[id].data.productType === undefined) {
        myObj.message.create("error", "「產品別」不可為空");
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

  // update
  updateEditCache(_type): void {
    if(_type === 1) {
      this.SPA100List.forEach(item => {
        this.editCache1[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }

  // 新增資料
  insertSave(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
            plantCode : this.plantCode,
            forecastReceiveDate : this.forecastReceiveDate,
            custAbbr : this.custAbbr,
            productType : this.productType,
            stage1Amount : this.stage1Amount,
            stage2Amount : this.stage2Amount,
            stage3Amount : this.stage3Amount,
            stage4Amount : this.stage4Amount,
            userCreate : this.USERNAME,
        })

        myObj.SPAService.insertTBSPAM100(obj).subscribe(res => {

          console.log(res)
          if(res["message"] === "success") {
            this.plantCode = undefined;
            this.forecastReceiveDate = undefined;
            this.custAbbr = undefined;
            this.productType = undefined;
            this.stage1Amount = undefined;
            this.stage2Amount = undefined;
            this.stage3Amount = undefined;
            this.stage4Amount = undefined;
            this.getSPA100AllList();
            this.sucessMSG("新增成功", ``);
          }
        },err => {
          reject('upload fail');
          this.errorMSG("新增失敗", "後台新增錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    } 
  }

  // 修改資料
  updateSave(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          id : this.editCache1[_id].data.tab1ID,
          plantCode : this.editCache1[_id].data.plantCode,
          forecastReceiveDate : this.editCache1[_id].data.forecastReceiveDate,
          custAbbr : this.editCache1[_id].data.custAbbr,
          productType : this.editCache1[_id].data.productType,
          stage1Amount : this.editCache1[_id].data.stage1Amount,
          stage2Amount : this.editCache1[_id].data.stage2Amount,
          stage3Amount : this.editCache1[_id].data.stage3Amount,
          stage4Amount : this.editCache1[_id].data.stage4Amount,
          userUpdate : this.USERNAME,
          userCreate : this.USERNAME,
        })
        // 若數據長度沒變(修改)，則以更新方式處理
        if (this.RawSPA100ListLen === this.SPA100List.length) {
        myObj.SPAService.updateTBSPAM100(obj).subscribe(res => {
          if (res["message"] === "success") {
            this.plantCode = undefined;
            this.forecastReceiveDate = undefined;
            this.custAbbr = undefined;
            this.productType = undefined;
            this.stage1Amount = undefined;
            this.stage2Amount = undefined;
            this.stage3Amount = undefined;
            this.stage4Amount = undefined;
            this.sucessMSG("修改成功", ``)

            const index = this.SPA100List.findIndex(item => item.id === _id);
            Object.assign(this.SPA100List[index], this.editCache1[_id].data);
            this.editCache1[_id].edit = false;
          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      }
      // 若數據長度改變(新增)，則以寫入方式處理
      else {
        myObj.SPAService.insertTBSPAM100(obj).subscribe(res => {
          if (res["message"] === "success") {
            this.plantCode = undefined;
            this.forecastReceiveDate = undefined;
            this.custAbbr = undefined;
            this.productType = undefined;
            this.stage1Amount = undefined;
            this.stage2Amount = undefined;
            this.stage3Amount = undefined;
            this.stage4Amount = undefined;
            this.getSPA100AllList();
            
            this.sucessMSG("修改成功", ``)

            const index = this.SPA100List.findIndex(item => item.id === _id);
            Object.assign(this.SPA100List[index], this.editCache1[_id].data);
            this.editCache1[_id].edit = false;
          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      }
      });
    }
  }

  // 刪除資料
  delID(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache1[_id].data.tab1ID;
        myObj.SPAService.delTBSPAM100(_ID).subscribe(res => {
          if(res["message"] === "success") {
            this.plantCode = undefined;
            this.forecastReceiveDate = undefined;
            this.custAbbr = undefined;
            this.productType = undefined;
            this.stage1Amount = undefined;
            this.stage2Amount = undefined;
            this.stage3Amount = undefined;
            this.stage4Amount = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getSPA100AllList();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
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

  // 匯出EXCEL
  async exportToExcel() {
    this.LoadingStatus("On");
    /* generate worksheet */
    var json_data = this.SPA100List
    json_data = JSON.parse(JSON.stringify(json_data).split('"plantCode":').join('"廠區別":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"forecastReceiveDate":').join('"預估接單月":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"custAbbr":').join('"客戶名稱":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"productType":').join('"產品別":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"stage1Amount":').join('"上旬量(1-5)":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"stage2Amount":').join('"中旬量(6-15)":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"stage3Amount":').join('"下旬量(16-25)":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"stage4Amount":').join('"月底旬量(26-月底)":'));
    for (let i = 1; i <= json_data.length; i++){
      delete json_data[i-1]['id'];
      delete json_data[i-1]['tab1ID'];
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json_data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, '業務每月預估量.xlsx');
    await this.delay(500); // 睡眠0.5秒，以同步程式
    this.LoadingStatus("Off");
    this.sucessMSG("成功匯出!", ``);
  }

  // 匯入EXCEL
  // --選擇檔案
  movies: any[] = [];
  handleImport($event: any) {
    const files = $event.target.files;
    if (files.length) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event: any) => {
            const wb = XLSX.read(event.target.result);
            const sheets = wb.SheetNames;

            if (sheets.length) {
                const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
                this.movies = rows;
                // 匯入
                console.log("匯入資料...")
                this.importExcel();
            }
        }
        reader.readAsArrayBuffer(file);
        // this.sucessMSG("已選擇檔案，請匯入!", ``);
    }
  }

  // --確認
  async importExcel(){
    if (this.movies.length != 0){
      var data = this.movies
      data = JSON.parse(JSON.stringify(data).split('"廠區別":').join('"plantCode":'));
      data = JSON.parse(JSON.stringify(data).split('"預估接單月":').join('"forecastReceiveDate":'));
      data = JSON.parse(JSON.stringify(data).split('"客戶名稱":').join('"custAbbr":'));
      data = JSON.parse(JSON.stringify(data).split('"產品別":').join('"productType":'));
      data = JSON.parse(JSON.stringify(data).split('"上旬量(1-5)":').join('"stage1Amount":'));
      data = JSON.parse(JSON.stringify(data).split('"中旬量(6-15)":').join('"stage2Amount":'));
      data = JSON.parse(JSON.stringify(data).split('"下旬量(16-25)":').join('"stage3Amount":'));
      data = JSON.parse(JSON.stringify(data).split('"月底旬量(26-月底)":').join('"stage4Amount":'));
      for (let i = 1; i <= data.length; i++){
        data[i-1]["userCreate"] = this.USERNAME;
      }
      try {
        console.log("刪除舊資料...")
        this.del_all_data();
        await this.delay(1000); // 睡眠1秒，以同步程式
        console.log("寫入新資料...")
        this.batch_save_all(data);
      }
      catch (er) {
        console.log(er)
      }

    } else{
      this.errorMSG("上傳錯誤", "請新增檔案!");
    }
  }

  // --刪除舊資料
  del_all_data() {
    let myObj = this;
    return new Promise((resolve, reject) => {
      myObj.SPAService.delallTBSPAM100().subscribe(res => {
        if(res === true) {
          console.log("已刪除舊資料!")
          this.getSPA100AllList();
        }
      },err => {
        reject('upload fail');
        this.errorMSG("上傳失敗", "後台刪除錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }

  // --寫入新資料
  batch_save_all(_data){
    let myObj = this;
    return new Promise((resolve, reject) => {
      this.LoadingStatus("On");
      myObj.SPAService.batchsaveTBSPAM100(_data).subscribe(res => {
        console.log(res)
        if(res["message"] === "success") {
          console.log("已寫入新資料!")
          this.plantCode = undefined;
          this.forecastReceiveDate = undefined;
          this.custAbbr = undefined;
          this.productType = undefined;
          this.stage1Amount = undefined;
          this.stage2Amount = undefined;
          this.stage3Amount = undefined;
          this.stage4Amount = undefined;
          this.getSPA100AllList();
          this.LoadingStatus("Off");
          (<HTMLInputElement>document.getElementById("importExcel")).value = "" ; 
          this.sucessMSG("成功匯入!", ``);
        }
      },err => {
        reject('upload fail');
        this.LoadingStatus("Off");
        (<HTMLInputElement>document.getElementById("importExcel")).value = "" ; 
        this.errorMSG("上傳失敗", "後台新增錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }


  // 搜尋功能
  // --復原
  reset() {
    this.SPA100ListOfDisplayData = this.SPA100List
    console.log(this.SPA100ListOfDisplayData)
    this.visible1 = false;
    this.visible2 = false;
    this.visible3 = false;
    this.visible4 = false;
    this.visible5 = false;
    this.visible6 = false;
    this.visible7 = false;
    this.visible8 = false;
  }

  // --搜尋 by key
  search(searchValue, searchKey) {
    this.SPA100ListOfDisplayData = []
    for (let i = 1; i <= this.SPA100List.length; i++){
      if (this.SPA100List[i-1][searchKey] === searchValue) {
        this.SPA100ListOfDisplayData.push(this.SPA100List[i-1])
      }
    }
    console.log(this.SPA100ListOfDisplayData)
  }

  // --搜尋各欄位
  searchplantCode(searchValue) {this.search(searchValue, "plantCode"); this.visible1 = false;}
  searchforecastReceiveDate(searchValue) {this.search(searchValue, "forecastReceiveDate"); this.visible2 = false;}
  searchcustAbbr(searchValue) {this.search(searchValue, "shopNacustAbbrme"); this.visible3 = false;}
  searchproductType(searchValue) {this.search(searchValue, "productType"); this.visible4 = false;}
  searchstage1Amount(searchValue) {this.search(searchValue, "stage1Amount"); this.visible5 = false;}
  searchstage2Amount(searchValue) {this.search(searchValue, "stage2Amount"); this.visible6 = false;}
  searchstage3Amount(searchValue) {this.search(searchValue, "stage3Amount"); this.visible7 = false;}
  searchstage4Amount(searchValue) {this.search(searchValue, "stage4Amount"); this.visible8 = false;}


  // 升降冪
  listOfColumn = {
    "plantCode":
    {
      compare: (a: ItemData1, b: ItemData1) => (a.plantCode || '').localeCompare(b.plantCode || ''),
      priority: false
    },
    "forecastReceiveDate":
    {
      compare: (a: ItemData1, b: ItemData1) => (a.forecastReceiveDate || '').localeCompare(b.forecastReceiveDate || ''),
      priority: false
    },
    "custAbbr":
    {
      compare: (a: ItemData1, b: ItemData1) => (a.custAbbr || '').localeCompare(b.custAbbr || ''),
      priority: false
    },
    "productType":
    {
      compare: (a: ItemData1, b: ItemData1) => (a.productType || '').localeCompare(b.productType || ''),
      priority: false
    },
    "stage1Amount":
    {
      compare: (a: ItemData1, b: ItemData1) => a.stage1Amount - b.stage1Amount,
      priority: false
    },
    "stage2Amount":
    {
      compare: (a: ItemData1, b: ItemData1) => a.stage2Amount - b.stage2Amount,
      priority: false
    },
    "stage3Amount":
    {
      compare: (a: ItemData1, b: ItemData1) => a.stage3Amount - b.stage3Amount,
      priority: false
    },
    "stage4Amount":
    {
      compare: (a: ItemData1, b: ItemData1) => a.stage4Amount - b.stage4Amount,
      priority: false
    }
  };

  // 新增資料列
  // --取得最大ID
  getMax(arr, prop) {
    var max;
    for (var i=1 ; i <= arr.length ; i++) {
        if (max == null || parseInt(arr[i-1][prop]) > parseInt(max[prop]))
            max = arr[i-1];
    }
    return max;
  }

  // --新增空列
  addRow() {
    // 若數據長度沒變，允許新增
    if (this.RawSPA100ListLen === this.SPA100List.length){
      // 顯示數據初始化
      this.SPA100ListOfDisplayData = this.SPA100List;
      // 取得最後一筆數據ID
      var max_data = this.getMax(this.SPA100ListOfDisplayData, "tab1ID");
      var max_id: number = +max_data.id;
      var max_tableID = max_data.tab1ID;
      console.log(max_tableID)
      // 新增空列
      var newRow = {
          id: `${max_id + 1}`,
          tab1ID: max_tableID + 1,
          plantCode: undefined,
          forecastReceiveDate: undefined,
          custAbbr: undefined,
          productType: undefined,
          stage1Amount: undefined,
          stage2Amount: undefined,
          stage3Amount: undefined,
          stage4Amount: undefined,
      }
      console.log(newRow)
      // 更新顯示數據
      this.SPA100ListOfDisplayData = [newRow, ...this.SPA100ListOfDisplayData];
      // 更新原始數據
      this.SPA100List = [newRow, ...this.SPA100List];
      // 更新Cache 
      this.updateEditCache(1);
      // 修改ROW
      this.editRow(`${max_id + 1}`, 1);
    }
    // 若數據長度沒變，表示以開啟新增，拒絕新增第二筆
    else {
      this.errorMSG("新增失敗", "請執行完本次新增!");
    }
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

}