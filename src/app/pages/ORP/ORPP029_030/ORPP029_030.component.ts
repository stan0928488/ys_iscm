import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { ORPService } from "src/app/services/ORP/ORP.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx'
// import ExcelExport from 'export-xlsx';


interface ItemData1 {
  id: string;
  tab1ID: number;
  productType: string;
  custGradeNo: string;
  saleOrderGradeNo: string;
}

interface ItemData2 {
    id: string;
    tab1ID: number;
    saleOrderGradeNo: string;
    materialGradeNo: string;
    purchaseFlag: string;
    optionSeq: number;
  }

@Component({
  selector: "app-ORPP029_030",
  templateUrl: "./ORPP029_030.component.html",
  styleUrls: ["./ORPP029_030.component.scss"],
  providers:[NzMessageService]
})
export class ORPP029_030component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;


  // 搜尋功能
  searchValue = "";
  searchKey = "";
  TBORPM029listOfDisplayData;
  TBORPM030listOfDisplayData;
  visible1 = false;
  visible2 = false;
  visible3 = false;
  visible4 = false;
  visible5 = false;
  visible6 = false;
  visible7 = false;

  // 客戶鋼種廠內鋼種對應表 & 訂單鋼種原料對照表
  productType;
  custGradeNo;
  saleOrderGradeNo;  // 共用

  materialGradeNo;
  purchaseFlag;
  optionSeq;


  // 客戶鋼種廠內鋼種對應表 ---------------------------------------------------------------------------------------------------------
  // tab 1
  TBORPM029List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  TBORPM029List: ItemData1[] = [];
  RawTBORPM029ListLen;

  constructor(
    private ORPService: ORPService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");

  }

  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getTBORPM029List();
    this.getTBORPM030List();
  }
  
  
  //tab1_select 
  getTBORPM029List() {
    this.loading = true;
    let myObj = this;
    this.ORPService.getTBORPM029List().subscribe(res => {
      console.log("getTBORPM029List success");
      this.TBORPM029List_tmp = res['data'];
      
      const data = [];
      for (let i = 0; i < this.TBORPM029List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.TBORPM029List_tmp[i].id,
          productType: this.TBORPM029List_tmp[i].productType,
          custGradeNo: this.TBORPM029List_tmp[i].custGradeNo,
          saleOrderGradeNo: this.TBORPM029List_tmp[i].saleOrderGradeNo,
        });
      }
      this.RawTBORPM029ListLen = data.length; // 原始數據長度
      this.TBORPM029List = data; // 原始數據
      this.TBORPM029listOfDisplayData = data // 搜尋顯示數據
      this.updateEditCache(1);
      console.log(this.TBORPM029List);
      myObj.loading = false;
    });
  }
  
  
  // insert1
  insertTab1() {
    let myObj = this;
    if (this.productType === undefined) {
      myObj.message.create("error", "「產品別」不可為空");
      return;
    } else if (this.custGradeNo === undefined) {
      myObj.message.create("error", "「客戶鋼種」不可為空");
      return;
    }  else if (this.saleOrderGradeNo === undefined) {
      myObj.message.create("error", "「訂單鋼種」不可為空");
      return;
    }  else {
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
      const index = this.TBORPM029List.findIndex(item => item.id === id);
      // 若數據長度沒變(修改)，則以取消方式處理
      if (this.RawTBORPM029ListLen === this.TBORPM029List.length) {
        this.editCache1[id] = {
          data: { ...this.TBORPM029List[index] },
          edit: false
        };
      }
      // 若數據長度改變(新增)，則以刪除ID方式處理
      else {
        this.TBORPM029List = this.TBORPM029List.filter(ItemData1 => ItemData1.id !== id);
        this.TBORPM029listOfDisplayData = this.TBORPM029listOfDisplayData.filter(ItemData1 => ItemData1.id !== id);
        delete this.editCache1[id];
      }
    }
  }

  // update Save
  saveEdit(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache1[id].data)
      let myObj = this;
      if (this.editCache1[id].data.productType === undefined) {
        myObj.message.create("error", "「產品別」不可為空");
        return;
      } else if (this.editCache1[id].data.custGradeNo === undefined) {
        myObj.message.create("error", "「客戶鋼種」不可為空");
        return;
      }  else if (this.editCache1[id].data.saleOrderGradeNo === undefined) {
        myObj.message.create("error", "「訂單鋼種」不可為空");
        return;
      }  else {
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
      this.TBORPM029List.forEach(item => {
        this.editCache1[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }


  changeTab(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getTBORPM029List();
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
            productType : this.productType,
            custGradeNo : this.custGradeNo,
            saleOrderGradeNo : this.saleOrderGradeNo,
            userCreate : this.USERNAME,
        })

        myObj.ORPService.insertTBORPM029(obj).subscribe(res => {

          console.log(res)
          if(res["message"] === "success") {
            this.productType = undefined;
            this.custGradeNo = undefined;
            this.saleOrderGradeNo = undefined;
            this.getTBORPM029List();
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
          productType : this.editCache1[_id].data.productType,
          custGradeNo : this.editCache1[_id].data.custGradeNo,
          saleOrderGradeNo : this.editCache1[_id].data.saleOrderGradeNo,
          userUpdate : this.USERNAME,
          userCreate : this.USERNAME,
        })
        // 若數據長度沒變(修改)，則以更新方式處理
        if (this.RawTBORPM029ListLen === this.TBORPM029List.length) {
          myObj.ORPService.updateTBORPM029(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.productType = undefined;
              this.custGradeNo = undefined;
              this.saleOrderGradeNo = undefined;

              this.sucessMSG("修改成功", ``)

              const index = this.TBORPM029List.findIndex(item => item.id === _id);
              Object.assign(this.TBORPM029List[index], this.editCache1[_id].data);
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
          myObj.ORPService.insertTBORPM029(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.productType = undefined;
              this.custGradeNo = undefined;
              this.saleOrderGradeNo = undefined;
              this.getTBORPM029List();
              
              this.sucessMSG("修改成功", ``)
  
              const index = this.TBORPM029List.findIndex(item => item.id === _id);
              Object.assign(this.TBORPM029List[index], this.editCache1[_id].data);
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
        myObj.ORPService.delTBORPM029(_ID).subscribe(res => {
          if(res["message"] === "success") {
            this.productType = undefined;
            this.custGradeNo = undefined;
            this.saleOrderGradeNo = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getTBORPM029List();
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
    var json_data = this.TBORPM029List
    json_data = JSON.parse(JSON.stringify(json_data).split('"productType":').join('"產品別":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"custGradeNo":').join('"客戶鋼種":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"saleOrderGradeNo":').join('"訂單鋼種":'));
    for (let i = 1; i <= json_data.length; i++){
      delete json_data[i-1]['id'];
      delete json_data[i-1]['tab1ID'];
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json_data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, '客戶鋼種廠內鋼種對應表.xlsx');
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
  async importExcel() {
    if (this.movies.length != 0){
      var data = this.movies
      data = JSON.parse(JSON.stringify(data).split('"產品別":').join('"productType":'));
      data = JSON.parse(JSON.stringify(data).split('"客戶鋼種":').join('"custGradeNo":'));
      data = JSON.parse(JSON.stringify(data).split('"訂單鋼種":').join('"saleOrderGradeNo":'));
      for (let i = 1; i <= data.length; i++){
        data[i-1]["userCreate"] = this.USERNAME;
      }
      try{
        console.log("刪除舊資料...")
        this.del_all_data();
        await this.delay(1000); // 睡眠1秒，以同步程式
        console.log("寫入新資料...")
        this.batch_save_all(data)
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
      myObj.ORPService.delallITBORPM029().subscribe(res => {
        if(res === true) {
          console.log("已刪除舊資料!")
          this.getTBORPM029List();
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
      myObj.ORPService.batchsaveTBORPM029(_data).subscribe(res => {
        console.log(res)
        if(res["message"] === "success") {
          console.log("已寫入新資料!")
          this.productType = undefined;
          this.custGradeNo = undefined;
          this.saleOrderGradeNo = undefined;
          this.getTBORPM029List();
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
    this.TBORPM029listOfDisplayData = this.TBORPM029List
    console.log(this.TBORPM029listOfDisplayData)
    this.visible1 = false;
    this.visible2 = false;
    this.visible3 = false;
  }
  // --搜尋 by key
  search(searchValue, searchKey) {
    this.TBORPM029listOfDisplayData = []
    for (let i = 1; i <= this.TBORPM029List.length; i++){
      if (this.TBORPM029List[i-1][searchKey] === searchValue) {
        this.TBORPM029listOfDisplayData.push(this.TBORPM029List[i-1])
      }
    }
    console.log(this.TBORPM029listOfDisplayData)
  }
  // --搜尋各欄位
  searchProductType(searchValue) {this.search(searchValue, "productType"); this.visible1 = false;}
  searchCustGradeNo(searchValue) {this.search(searchValue, "custGradeNo"); this.visible2 = false;}
  searchSaleOrderGradeNo(searchValue) {this.search(searchValue, "saleOrderGradeNo"); this.visible3 = false;}
  
  // 升降冪
  listOfColumn = {
    "productType":
    {
      compare: (a: ItemData1, b: ItemData1) => a.productType.localeCompare(b.productType),
      priority: false
    },
    "custGradeNo":
    {
      compare: (a: ItemData1, b: ItemData1) => a.custGradeNo.localeCompare(b.custGradeNo),
      priority: false
    },
    "saleOrderGradeNo":
    {
      compare: (a: ItemData1, b: ItemData1) => a.saleOrderGradeNo.localeCompare(b.saleOrderGradeNo),
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
    if (this.RawTBORPM029ListLen === this.TBORPM029List.length){
      // 顯示數據初始化
      this.TBORPM029listOfDisplayData = this.TBORPM029List;
      // 取得最後一筆數據ID
      var max_data = this.getMax(this.TBORPM029listOfDisplayData, "tab1ID");
      var max_id: number = +max_data.id;
      var max_tableID = max_data.tab1ID;
      // 新增空列
      var newRow = {
          id: `${max_id + 1}`,
          tab1ID: max_tableID + 1,
          productType: undefined,
          custGradeNo: undefined,
          saleOrderGradeNo: undefined,
      }
      // 更新顯示數據
      this.TBORPM029listOfDisplayData = [newRow, ...this.TBORPM029listOfDisplayData];
      // 更新原始數據
      this.TBORPM029List = [newRow, ...this.TBORPM029List];
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


// 訂單鋼種原料對照表 ---------------------------------------------------------------------------------------------------------
  // tab 1
  TBORPM030List_tmp;
  editCache2: { [key: string]: { edit: boolean; data: ItemData2 } } = {};
  TBORPM030List: ItemData2[] = [];
  RawTBORPM030ListLen;
  
  
  //tab1_select 
  getTBORPM030List() {
    this.loading = true;
    let myObj = this;
    this.ORPService.getTBORPM030List().subscribe(res => {
      console.log("getTBORPM030List success");
      this.TBORPM030List_tmp = res['data'];
      
      const data = [];
      for (let i = 0; i < this.TBORPM030List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.TBORPM030List_tmp[i].id,
          saleOrderGradeNo: this.TBORPM030List_tmp[i].saleOrderGradeNo,
          materialGradeNo: this.TBORPM030List_tmp[i].materialGradeNo,
          purchaseFlag: this.TBORPM030List_tmp[i].purchaseFlag,
          optionSeq: this.TBORPM030List_tmp[i].optionSeq,
        });
      }
      this.RawTBORPM030ListLen = data.length; // 原始數據長度
      this.TBORPM030List = data; // 原始數據
      this.TBORPM030listOfDisplayData = data // 搜尋顯示數據
      this.updateEditCache2(1);
      console.log(this.TBORPM030List);
      myObj.loading = false;
    });
  }
  
  
  // insert1
  insertTab2() {
    let myObj = this;
    if (this.saleOrderGradeNo === undefined) {
      myObj.message.create("error", "「詢單或訂單鋼種」不可為空");
      return;
    } else if (this.materialGradeNo === undefined) {
      myObj.message.create("error", "「原料鋼種」不可為空");
      return;
    }  else if (this.purchaseFlag === undefined) {
      myObj.message.create("error", "「是否外購」不可為空");
      return;
    }  else if (this.optionSeq === undefined) {
        myObj.message.create("error", "「選用順序」不可為空");
        return;
    }  else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave2(1)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  


  
  // update
  editRow2(id: string, _type): void {
    if(_type === 1) {
      this.editCache2[id].edit = true;
      // this.getRequierList();
      // this.getPickerShopData(id);
      // this.getPickerMachineData(this.editCache2[id].data.SCH_SHOP_CODE_1, id);
    }
  }


  // delete
  deleteRow2(id: string, _type): void {
    console.log('id:'+id+'type:'+_type);
    if(_type === 1) {
      this.Modal.confirm({
        nzTitle: '是否確定刪除',
        nzOnOk: () => {
          this.delID2(id, _type)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }

  // cancel
  cancelEdit2(id: string, _type): void {
    if(_type === 1) {
      const index = this.TBORPM030List.findIndex(item => item.id === id);
      // 若數據長度沒變(修改)，則以取消方式處理
      if (this.RawTBORPM030ListLen === this.TBORPM030List.length) {
        this.editCache2[id] = {
          data: { ...this.TBORPM030List[index] },
          edit: false
        };
      }
      // 若數據長度改變(新增)，則以刪除ID方式處理
      else {
        this.TBORPM030List = this.TBORPM030List.filter(ItemData2 => ItemData2.id !== id);
        this.TBORPM030listOfDisplayData = this.TBORPM030listOfDisplayData.filter(ItemData2 => ItemData2.id !== id);
        delete this.editCache2[id];
      }
    }
  }

  // update Save
  saveEdit2(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache2[id].data)
      let myObj = this;
      if (this.editCache2[id].data.saleOrderGradeNo === undefined) {
        myObj.message.create("error", "「詢單或訂單鋼種」不可為空");
        return;
      } else if (this.editCache2[id].data.materialGradeNo === undefined) {
        myObj.message.create("error", "「原料鋼種」不可為空");
        return;
      }  else if (this.editCache2[id].data.purchaseFlag === undefined) {
        myObj.message.create("error", "「是否外購」不可為空");
        return;
      }  else if (this.editCache2[id].data.optionSeq === undefined) {
        myObj.message.create("error", "「選用順序」不可為空");
        return;
      }  else {
        this.Modal.confirm({
          nzTitle: '是否確定?',
          nzOnOk: () => {
            this.updateSave2(id, 1)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
      }
    }
  }
  


  // update
  updateEditCache2(_type): void {
    if(_type === 1) {
      this.TBORPM030List.forEach(item => {
        this.editCache2[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }


  changeTab2(tab): void {
    console.log(tab)
    // this.addRow(tab);
    if(tab === 1) {
      // this.getSHOP_CODEList();
      this.getTBORPM030List();
    }
  }
 
  // 新增資料
  insertSave2(_type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
            saleOrderGradeNo : this.saleOrderGradeNo,
            materialGradeNo : this.materialGradeNo,
            purchaseFlag : this.purchaseFlag,
            optionSeq : this.optionSeq,
            userCreate : this.USERNAME,
        })

        myObj.ORPService.insertTBORPM030(obj).subscribe(res => {

          console.log(res)
          if(res["message"] === "success") {
            this.saleOrderGradeNo = undefined;
            this.materialGradeNo = undefined;
            this.purchaseFlag = undefined;
            this.optionSeq = undefined;
            this.getTBORPM030List();
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
  updateSave2(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          id : this.editCache2[_id].data.tab1ID,
          saleOrderGradeNo : this.editCache2[_id].data.saleOrderGradeNo,
          materialGradeNo : this.editCache2[_id].data.materialGradeNo,
          purchaseFlag : this.editCache2[_id].data.purchaseFlag,
          optionSeq : this.editCache2[_id].data.optionSeq,
          userUpdate : this.USERNAME,
          userCreate : this.USERNAME,
        })
        // 若數據長度沒變(修改)，則以更新方式處理
        if (this.RawTBORPM030ListLen === this.TBORPM030List.length) {
          myObj.ORPService.updateTBORPM030(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.saleOrderGradeNo = undefined;
              this.materialGradeNo = undefined;
              this.purchaseFlag = undefined;
              this.optionSeq = undefined;

              this.sucessMSG("修改成功", ``)

              const index = this.TBORPM030List.findIndex(item => item.id === _id);
              Object.assign(this.TBORPM030List[index], this.editCache2[_id].data);
              this.editCache2[_id].edit = false;
            }
          },err => {
            reject('upload fail');
            this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
            this.LoadingPage = false;
          })
        }
        // 若數據長度改變(新增)，則以寫入方式處理
        else {
            myObj.ORPService.insertTBORPM030(obj).subscribe(res => {
              if (res["message"] === "success") {
                this.saleOrderGradeNo = undefined;
                this.materialGradeNo = undefined;
                this.purchaseFlag = undefined;
                this.optionSeq = undefined;
                this.getTBORPM030List();
                
                this.sucessMSG("修改成功", ``)
    
                const index = this.TBORPM030List.findIndex(item => item.id === _id);
                Object.assign(this.TBORPM030List[index], this.editCache2[_id].data);
                this.editCache2[_id].edit = false;
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
  delID2(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = this.editCache2[_id].data.tab1ID;
        myObj.ORPService.delTBORPM030(_ID).subscribe(res => {
          if(res["message"] === "success") {
            this.saleOrderGradeNo = undefined;
            this.materialGradeNo = undefined;
            this.purchaseFlag = undefined;
            this.optionSeq = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getTBORPM030List();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
        })
      });
    }
  }


  // 匯出EXCEL
  async exportToExcel2() {
    this.LoadingStatus2("On");
    /* generate worksheet */
    var json_data = this.TBORPM030List
    json_data = JSON.parse(JSON.stringify(json_data).split('"saleOrderGradeNo":').join('"詢單或訂單鋼種":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"materialGradeNo":').join('"原料鋼種":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"purchaseFlag":').join('"是否外購":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"optionSeq":').join('"選用順序":'));
    for (let i = 1; i <= json_data.length; i++){
      delete json_data[i-1]['id'];
      delete json_data[i-1]['tab1ID'];
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json_data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, '訂單鋼種原料對照表.xlsx');
    await this.delay(500); // 睡眠0.5秒，以同步程式
    this.LoadingStatus2("Off");
    this.sucessMSG("成功匯出!", ``);
  }

    // 匯入EXCEL
    // --選擇檔案
    movies2: any[] = [];
    handleImport2($event: any) {
      const files = $event.target.files;
      if (files.length) {
          const file = files[0];
          const reader = new FileReader();
          reader.onload = (event: any) => {
              const wb = XLSX.read(event.target.result);
              const sheets = wb.SheetNames;

              if (sheets.length) {
                  const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
                  this.movies2 = rows;
                  // 匯入
                  console.log("匯入資料...")
                  this.importExcel2();
              }
          }
          reader.readAsArrayBuffer(file);
          // this.sucessMSG("已選擇檔案，請匯入!", ``);
      }
  }
  // --確認
  async importExcel2() {
    if (this.movies2.length != 0){
      var data = this.movies2
      data = JSON.parse(JSON.stringify(data).split('"詢單或訂單鋼種":').join('"saleOrderGradeNo":'));
      data = JSON.parse(JSON.stringify(data).split('"原料鋼種":').join('"materialGradeNo":'));
      data = JSON.parse(JSON.stringify(data).split('"是否外購":').join('"purchaseFlag":'));
      data = JSON.parse(JSON.stringify(data).split('"選用順序":').join('"optionSeq":'));
      for (let i = 1; i <= data.length; i++){
        data[i-1]["userCreate"] = this.USERNAME;
      }
      try{
        console.log("刪除舊資料...")
        this.del_all_data2();
        await this.delay(1000); // 睡眠1秒，以同步程式
        console.log("寫入新資料...")
        this.batch_save_all2(data)
      }
      catch (er) {
        console.log(er)
      }
      
    } else{
      this.errorMSG("上傳錯誤", "請新增檔案!");
    }
  }
  // --刪除舊資料
  del_all_data2() {
    let myObj = this;
    return new Promise((resolve, reject) => {
      myObj.ORPService.delallITBORPM030().subscribe(res => {
        if(res === true) {
          console.log("已刪除舊資料!")
          this.getTBORPM030List();
        }
      },err => {
        reject('upload fail');
        this.errorMSG("上傳失敗", "後台刪除錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }
  // --寫入新資料
  batch_save_all2(_data){
    let myObj = this;
    return new Promise((resolve, reject) => {
      this.LoadingStatus2("On");
      myObj.ORPService.batchsaveTBORPM030(_data).subscribe(res => {
        console.log(res)
        if(res["message"] === "success") {
          console.log("已寫入新資料!")
          this.saleOrderGradeNo = undefined;
          this.materialGradeNo = undefined;
          this.purchaseFlag = undefined;
          this.optionSeq = undefined;
          this.getTBORPM030List();
          this.LoadingStatus2("Off");
          (<HTMLInputElement>document.getElementById("importExcel2")).value = "" ;
          this.sucessMSG("成功匯入!", ``);
        }
      },err => {
        reject('upload fail');
        this.LoadingStatus2("Off");
        (<HTMLInputElement>document.getElementById("importExcel2")).value = "" ;
        this.errorMSG("上傳失敗", "後台新增錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }

  // 搜尋功能
  // --復原
  reset2() {
    this.TBORPM030listOfDisplayData = this.TBORPM030List
    console.log(this.TBORPM030listOfDisplayData)
    this.visible4 = false;
    this.visible5 = false;
    this.visible6 = false;
    this.visible7 = false;
  }
  // --搜尋 by key
  search2(searchValue, searchKey) {
    this.TBORPM030listOfDisplayData = []
    for (let i = 1; i <= this.TBORPM030List.length; i++){
      if (this.TBORPM030List[i-1][searchKey] === searchValue) {
        this.TBORPM030listOfDisplayData.push(this.TBORPM030List[i-1])
      }
    }
    console.log(this.TBORPM030listOfDisplayData)
  }
  // --搜尋各欄位
  searchSaleOrderGradeNo2(searchValue) {this.search2(searchValue, "saleOrderGradeNo"); this.visible4 = false;}
  searchMaterialGradeNo(searchValue) {this.search2(searchValue, "materialGradeNo"); this.visible5 = false;}
  searchPurchaseFlag(searchValue) {this.search2(searchValue, "purchaseFlag"); this.visible6 = false;}
  searchOptionSeq(searchValue) {this.search2(searchValue, "optionSeq"); this.visible7 = false;}

  // 升降冪
  listOfColumn2 = {
    "saleOrderGradeNo":
    {
      compare: (a: ItemData2, b: ItemData2) => a.saleOrderGradeNo.localeCompare(b.saleOrderGradeNo),
      priority: false
    },
    "materialGradeNo":
    {
      compare: (a: ItemData2, b: ItemData2) => a.materialGradeNo.localeCompare(b.materialGradeNo),
      priority: false
    },
    "purchaseFlag":
    {
      compare: (a: ItemData2, b: ItemData2) => a.purchaseFlag.localeCompare(b.purchaseFlag),
      priority: false
    },
    "optionSeq":
    {
      compare: (a: ItemData2, b: ItemData2) => a.optionSeq - b.optionSeq,
      priority: false
    }
  };

  // 新增資料列
  // --新增空列
  addRow2() {
    // 若數據長度沒變，允許新增
    if (this.RawTBORPM030ListLen === this.TBORPM030List.length){
      // 顯示數據初始化
      this.TBORPM030listOfDisplayData = this.TBORPM030List;
      // 取得最後一筆數據ID
      var max_data = this.getMax(this.TBORPM030listOfDisplayData, "tab1ID");
      var max_id: number = +max_data.id;
      var max_tableID = max_data.tab1ID;
      // 新增空列
      var newRow = {
          id: `${max_id + 1}`,
          tab1ID: max_tableID + 1,
          saleOrderGradeNo: undefined,
          materialGradeNo: undefined,
          purchaseFlag: undefined,
          optionSeq: undefined,
      }
      // 更新顯示數據
      this.TBORPM030listOfDisplayData = [newRow, ...this.TBORPM030listOfDisplayData];
      // 更新原始數據
      this.TBORPM030List = [newRow, ...this.TBORPM030List];
      // 更新Cache 
      this.updateEditCache2(1);
      // 修改ROW
      this.editRow2(`${max_id + 1}`, 1);
    }
    // 若數據長度沒變，表示以開啟新增，拒絕新增第二筆
    else {
      this.errorMSG("新增失敗", "請執行完本次新增!");
    }
  }

  // 控制加載圖示顯示/隱藏
  LoadingStatus2(Status) {
    var loadingStatus2 = document.getElementById('loadingStatus2')
    if (Status==='On') {
      loadingStatus2.className = "";
      // 鎖住按鈕
      (<HTMLInputElement>document.getElementById("singleAdd2")).disabled = true;
      (<HTMLInputElement>document.getElementById("bacthAdd2")).disabled = true;
      (<HTMLInputElement>document.getElementById("download2")).disabled = true;
    }
    else {
      loadingStatus2.className = "hidden";
      // 打開按鈕
      (<HTMLInputElement>document.getElementById("singleAdd2")).disabled = false;
      (<HTMLInputElement>document.getElementById("bacthAdd2")).disabled = false;
      (<HTMLInputElement>document.getElementById("download2")).disabled = false;
    }
  }

  // 切換頁籤
  selectTab1() {
    // 更改菜單名
    var menuname = document.getElementById("menuName");
    menuname.textContent = "客戶鋼種廠內鋼種對應表";
    // 打開頁籤一
    var tab1 = document.getElementById("tab_1");
    tab1.style.display = "";
    // 關閉頁籤二
    var tab2 = document.getElementById("tab_2");
    tab2.style.display = "none";
  }
  
  selectTab2() {
    // 更改菜單名
    var menuname = document.getElementById("menuName");
    menuname.textContent = "訂單鋼種原料對照表";
    // 關閉頁籤一
    var tab1 = document.getElementById("tab_1");
    tab1.style.display = "none";
    // 打開頁籤二
    var tab2 = document.getElementById("tab_2");
    tab2.style.display = "";
  }

}
