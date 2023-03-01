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
import { BinaryOperatorExpr, NONE_TYPE } from "@angular/compiler";
import { isNonEmptyString } from "ng-zorro-antd/core/util";
import { isNull } from "lodash";
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { number } from "echarts";



interface ItemData1 {
  id: string;
  tab1ID: number;
  productType: string;
  thicknessMin: number;
  thicknessMax: number;
  inputType: string;
  optionSeq: number;
  materialThicknessMin: number;
  materialThicknessMax: number;
}

@Component({
  selector: "app-ORPP032",
  templateUrl: "./ORPP032.component.html",
  styleUrls: ["./ORPP032.component.scss"],
  providers:[NzMessageService]
})
export class ORPP032component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;


  // 搜尋功能
  searchValue = "";
  searchKey = "";
  listOfDisplayData;
  visible1 = false;
  visible2 = false;
  visible3 = false;
  visible4 = false;
  visible5 = false;
  visible6 = false;
  visible7 = false;

  // 訂單厚度原料對照表 
  productType;
  thicknessMin;
  thicknessMax;
  inputType;
  optionSeq;
  materialThicknessMin;
  materialThicknessMax;


  // tab 1
  TBORPM032List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  TBORPM032List: ItemData1[] = [];
  RawTBORPM032ListLen;

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
    this.getTBORPM032List();
  }
  
  
  //tab1_select 
  getTBORPM032List() {
    this.loading = true;
    let myObj = this;
    this.ORPService.getTBORPM032List().subscribe(res => {
      console.log("getTBORPM032List success");
      this.TBORPM032List_tmp = res['data'];

      const data = [];
      for (let i = 0; i < this.TBORPM032List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.TBORPM032List_tmp[i].id,
          productType: this.TBORPM032List_tmp[i].productType,
          thicknessMin: this.TBORPM032List_tmp[i].thicknessMin,
          thicknessMax: this.TBORPM032List_tmp[i].thicknessMax,
          inputType: this.TBORPM032List_tmp[i].inputType,
          optionSeq: this.TBORPM032List_tmp[i].optionSeq,
          materialThicknessMin: this.TBORPM032List_tmp[i].materialThicknessMin,
          materialThicknessMax: this.TBORPM032List_tmp[i].materialThicknessMax
        });
      }
      this.RawTBORPM032ListLen = data.length; // 原始數據長度
      this.TBORPM032List = data; // 原始數據
      this.listOfDisplayData = data // 搜尋顯示數據
      this.updateEditCache(1);
      console.log(this.TBORPM032List);
      myObj.loading = false;
    });
  }
  
  
  // insert1
  insertTab1() {
    let myObj = this;
    if (this.productType === undefined) {
      myObj.message.create("error", "「產品別」不可為空");
      return;
    } else if (this.thicknessMin === undefined) {
      myObj.message.create("error", "「訂單對應厚度下限」不可為空");
      return;
    }  else if (this.thicknessMax === undefined) {
      myObj.message.create("error", "「訂單對應厚度上限」不可為空");
      return;
    } else if (this.inputType === undefined) {
        myObj.message.create("error", "「投料別」不可為空");
        return;
    } else if (this.optionSeq === undefined) {
        myObj.message.create("error", "「選用順序」不可為空");
        return;
    } else {
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
      const index = this.TBORPM032List.findIndex(item => item.id === id);
      // 若數據長度沒變(修改)，則以取消方式處理
      if (this.RawTBORPM032ListLen === this.TBORPM032List.length) {
        this.editCache1[id] = {
          data: { ...this.TBORPM032List[index] },
          edit: false
        };
      }
      // 若數據長度改變(新增)，則以刪除ID方式處理
      else {
        this.TBORPM032List = this.TBORPM032List.filter(ItemData1 => ItemData1.id !== id);
        this.listOfDisplayData = this.listOfDisplayData.filter(ItemData1 => ItemData1.id !== id);
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
      } else if (this.editCache1[id].data.thicknessMin === undefined) {
        myObj.message.create("error", "「訂單對應厚度下限」不可為空");
        return;
      }  else if (this.editCache1[id].data.thicknessMax === undefined) {
        myObj.message.create("error", "「訂單對應厚度上限」不可為空");
        return;
      } else if (this.editCache1[id].data.inputType === undefined) {
          myObj.message.create("error", "「投料別」不可為空");
          return;
      } else if (this.editCache1[id].data.optionSeq === undefined) {
          myObj.message.create("error", "「選用順序」不可為空");
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
      this.TBORPM032List.forEach(item => {
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
      this.getTBORPM032List();
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
            thicknessMin : this.thicknessMin,
            thicknessMax : this.thicknessMax,
            inputType : this.inputType,
            optionSeq : this.optionSeq,
            materialThicknessMin : this.materialThicknessMin,
            materialThicknessMax : this.materialThicknessMax,
            userCreate : this.USERNAME,
        })

        myObj.ORPService.insertTBORPM032(obj).subscribe(res => {

          console.log(res)
          if(res["message"] === "success") {
            this.productType = undefined;
            this.thicknessMin = undefined;
            this.thicknessMax = undefined;
            this.inputType = undefined;
            this.optionSeq = undefined;
            this.materialThicknessMin = undefined;
            this.materialThicknessMax = undefined;
            this.getTBORPM032List();
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
          thicknessMin : this.editCache1[_id].data.thicknessMin,
          thicknessMax : this.editCache1[_id].data.thicknessMax,
          inputType : this.editCache1[_id].data.inputType,
          optionSeq : this.editCache1[_id].data.optionSeq,
          materialThicknessMin : this.editCache1[_id].data.materialThicknessMin,
          materialThicknessMax : this.editCache1[_id].data.materialThicknessMax,
          userUpdate : this.USERNAME,
          userCreate : this.USERNAME,
        })

        // 若數據長度沒變(修改)，則以更新方式處理
        if (this.RawTBORPM032ListLen === this.TBORPM032List.length) {
          myObj.ORPService.updateTBORPM032(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.productType = undefined;
              this.thicknessMin = undefined;
              this.thicknessMax = undefined;
              this.inputType = undefined;
              this.optionSeq = undefined;
              this.materialThicknessMin = undefined;
              this.materialThicknessMax = undefined;
  
              this.sucessMSG("修改成功", ``)
  
              const index = this.TBORPM032List.findIndex(item => item.id === _id);
              Object.assign(this.TBORPM032List[index], this.editCache1[_id].data);
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
          myObj.ORPService.insertTBORPM032(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.productType = undefined;
              this.thicknessMin = undefined;
              this.thicknessMax = undefined;
              this.inputType = undefined;
              this.optionSeq = undefined;
              this.materialThicknessMin = undefined;
              this.materialThicknessMax = undefined;
              this.getTBORPM032List();
              
              this.sucessMSG("修改成功", ``)
  
              const index = this.TBORPM032List.findIndex(item => item.id === _id);
              Object.assign(this.TBORPM032List[index], this.editCache1[_id].data);
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
        myObj.ORPService.delTBORPM032(_ID).subscribe(res => {
          if(res["message"] === "success") {
            this.productType = undefined;
            this.thicknessMin = undefined;
            this.thicknessMax = undefined;
            this.inputType = undefined;
            this.optionSeq = undefined;
            this.materialThicknessMin = undefined;
            this.materialThicknessMax = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getTBORPM032List();
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
    var json_data = this.TBORPM032List
    json_data = JSON.parse(JSON.stringify(json_data).split('"productType":').join('"產品別":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"thicknessMin":').join('"訂單對應厚度下限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"thicknessMax":').join('"訂單對應厚度上限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"inputType":').join('"投料別":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"optionSeq":').join('"選用順序":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"materialThicknessMin":').join('"原料厚度下限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"materialThicknessMax":').join('"原料厚度上限":'));
    for (let i = 1; i <= json_data.length; i++){
      delete json_data[i-1]['id'];
      delete json_data[i-1]['tab1ID'];
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json_data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, '訂單厚度原料對照表.xlsx');
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
      data = JSON.parse(JSON.stringify(data).split('"訂單對應厚度下限":').join('"thicknessMin":'));
      data = JSON.parse(JSON.stringify(data).split('"訂單對應厚度上限":').join('"thicknessMax":'));
      data = JSON.parse(JSON.stringify(data).split('"投料別":').join('"inputType":'));
      data = JSON.parse(JSON.stringify(data).split('"選用順序":').join('"optionSeq":'));
      data = JSON.parse(JSON.stringify(data).split('"原料厚度下限":').join('"materialThicknessMin":'));
      data = JSON.parse(JSON.stringify(data).split('"原料厚度上限":').join('"materialThicknessMax":'));
      for (let i = 1; i <= data.length; i++){
        data[i-1]["userCreate"] = this.USERNAME;
      }
      try{
        console.log("刪除舊資料...")
        this.del_all_data();
        await this.delay(1000); // 睡眠1秒，以同步程式
        console.log("寫入新資料...")
        this.batch_save_all(data);
      }
      catch(er) {
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
      myObj.ORPService.delallITBORPM032().subscribe(res => {
        if(res === true) {
          console.log("已刪除舊資料!")
          this.getTBORPM032List();
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
      myObj.ORPService.batchsaveTBORPM032(_data).subscribe(res => {
        console.log(res)
        if(res["message"] === "success") {
          console.log("已寫入新資料!")
          this.productType = undefined;
          this.thicknessMin = undefined;
          this.thicknessMax = undefined;
          this.inputType = undefined;
          this.optionSeq = undefined;
          this.materialThicknessMin = undefined;
          this.materialThicknessMax = undefined;
          this.getTBORPM032List();
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
      }
      )
    });
  }

  // 搜尋功能
  // --復原
  reset() {
    this.listOfDisplayData = this.TBORPM032List
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
    for (let i = 1; i <= this.TBORPM032List.length; i++){
      if (this.TBORPM032List[i-1][searchKey] === searchValue) {
        this.listOfDisplayData.push(this.TBORPM032List[i-1])
      }
    }
    console.log(this.listOfDisplayData)
  }
  // --搜尋各欄位
  searchProductType(searchValue) {this.search(searchValue, "productType"); this.visible1 = false;}
  searchThicknessMin(searchValue) {this.search(searchValue, "thicknessMin"); this.visible2 = false;}
  searchThicknessMax(searchValue) {this.search(searchValue, "thicknessMax"); this.visible3 = false;}
  searchInputType(searchValue) {this.search(searchValue, "inputType"); this.visible4 = false;}
  searchOptionSeq(searchValue) {this.search(searchValue, "optionSeq"); this.visible5 = false;}
  searchMaterialThicknessMin(searchValue) {this.search(searchValue, "materialThicknessMin"); this.visible6 = false;}
  searchMaterialThicknessMax(searchValue) {this.search(searchValue, "materialThicknessMax"); this.visible7 = false;}
  
  // 升降冪
  listOfColumn = {
    "productType":
    {
      compare: (a: ItemData1, b: ItemData1) => a.productType.localeCompare(b.productType),
      priority: false
    },
    "thicknessMin":
    {
      compare: (a: ItemData1, b: ItemData1) => a.thicknessMin - b.thicknessMin,
      priority: false
    },
    "thicknessMax":
    {
      compare: (a: ItemData1, b: ItemData1) => a.thicknessMax - b.thicknessMax,
      priority: false
    },
    "inputType":
    {
      compare: (a: ItemData1, b: ItemData1) => a.inputType.localeCompare(b.inputType),
      priority: false
    },
    "optionSeq":
    {
      compare: (a: ItemData1, b: ItemData1) => a.optionSeq - b.optionSeq,
      priority: false
    },
    "materialThicknessMin":
    {
      compare: (a: ItemData1, b: ItemData1) => a.materialThicknessMin - b.materialThicknessMin,
      priority: false
    },
    "materialThicknessMax":
    {
      compare: (a: ItemData1, b: ItemData1) => a.materialThicknessMax - b.materialThicknessMax,
      priority: false
    },
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
    if (this.RawTBORPM032ListLen === this.TBORPM032List.length){
      // 顯示數據初始化
      this.listOfDisplayData = this.TBORPM032List;
      // 取得最後一筆數據ID
      var max_data = this.getMax(this.listOfDisplayData, "tab1ID");
      var max_id: number = +max_data.id;
      var max_tableID = max_data.tab1ID;
      // 新增空列
      var newRow = {
          id: `${max_id + 1}`,
          tab1ID: max_tableID + 1,
          productType: undefined,
          thicknessMin: undefined,
          thicknessMax: undefined,
          inputType: undefined,
          optionSeq: undefined,
          materialThicknessMin: undefined,
          materialThicknessMax: undefined
      }
      // 更新顯示數據
      this.listOfDisplayData = [newRow, ...this.listOfDisplayData];
      // 更新原始數據
      this.TBORPM032List = [newRow, ...this.TBORPM032List];
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
