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
  saleOrderWidthMin: number;
  saleOrderWidthMax: number;
  processType: string;
  materialWidthMin: number;
  materialWidthMax: number;
  tolerateMin: number;
  tolerateMax: number;
}

@Component({
  selector: "app-ORPP031",
  templateUrl: "./ORPP031.component.html",
  styleUrls: ["./ORPP031.component.scss"],
  providers:[NzMessageService]
})
export class ORPP031component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;


  // 搜尋功能
  searchValue = "";
  searchKey = "";
  TBORPM031listOfDisplayData;
  visible1 = false;
  visible2 = false;
  visible3 = false;
  visible4 = false;
  visible5 = false;
  visible6 = false;
  visible7 = false;

  // 訂單寬度原料對照表 
  saleOrderWidthMin;
  saleOrderWidthMax;
  processType;
  materialWidthMin;
  materialWidthMax;
  tolerateMin;
  tolerateMax;


  // tab 1
  TBORPM031List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  TBORPM031List: ItemData1[] = [];
  RawTBORPM031ListLen;


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
    this.getTBORPM031List();
  }
  
  
  //tab1_select 
  getTBORPM031List() {
    this.loading = true;
    let myObj = this;
    this.ORPService.getTBORPM031List().subscribe(res => {
      console.log("getTBORPM031List success");
      this.TBORPM031List_tmp = res['data'];
      
      const data = [];
      for (let i = 0; i < this.TBORPM031List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.TBORPM031List_tmp[i].id,
          saleOrderWidthMin: this.TBORPM031List_tmp[i].saleOrderWidthMin,
          saleOrderWidthMax: this.TBORPM031List_tmp[i].saleOrderWidthMax,
          processType: this.TBORPM031List_tmp[i].processType,
          materialWidthMin: this.TBORPM031List_tmp[i].materialWidthMin,
          materialWidthMax: this.TBORPM031List_tmp[i].materialWidthMax,
          tolerateMin: this.TBORPM031List_tmp[i].tolerateMin,
          tolerateMax: this.TBORPM031List_tmp[i].tolerateMax
        });
      }
      this.RawTBORPM031ListLen = data.length; // 原始數據長度
      this.TBORPM031List = data; // 原始數據
      this.TBORPM031listOfDisplayData = data // 搜尋顯示數據
      this.updateEditCache(1);
      console.log(this.TBORPM031List);
      myObj.loading = false;
    });
  }
  
  
  // insert1
  insertTab1() {
    let myObj = this;
    if (this.saleOrderWidthMin === undefined) {
      myObj.message.create("error", "「輸入寬度下限」不可為空");
      return;
    } else if (this.saleOrderWidthMax === undefined) {
      myObj.message.create("error", "「輸入寬度上限」不可為空");
      return;
    }  else if (this.processType === undefined) {
      myObj.message.create("error", "「加工別」不可為空");
      return;
    } else if (this.materialWidthMin === undefined) {
        myObj.message.create("error", "「原料寬度下限」不可為空");
        return;
    } else if (this.materialWidthMax === undefined) {
        myObj.message.create("error", "「原料寬度上限」不可為空");
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
      const index = this.TBORPM031List.findIndex(item => item.id === id);
      // 若數據長度沒變(修改)，則以取消方式處理
      if (this.RawTBORPM031ListLen === this.TBORPM031List.length) {
        this.editCache1[id] = {
          data: { ...this.TBORPM031List[index] },
          edit: false
        };
      }
      // 若數據長度改變(新增)，則以刪除ID方式處理
      else {
        this.TBORPM031List = this.TBORPM031List.filter(ItemData1 => ItemData1.id !== id);
        this.TBORPM031listOfDisplayData = this.TBORPM031listOfDisplayData.filter(ItemData1 => ItemData1.id !== id);
        delete this.editCache1[id];
      }
    }
  }

  // update Save
  saveEdit(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache1[id].data)
      let myObj = this;
      if (this.editCache1[id].data.saleOrderWidthMin === undefined) {
        myObj.message.create("error", "「輸入寬度下限」不可為空");
        return;
      } else if (this.editCache1[id].data.saleOrderWidthMax === undefined) {
        myObj.message.create("error", "「輸入寬度上限」不可為空");
        return;
      }  else if (this.editCache1[id].data.processType === undefined) {
        myObj.message.create("error", "「加工別」不可為空");
        return;
      } else if (this.editCache1[id].data.materialWidthMin === undefined) {
          myObj.message.create("error", "「原料寬度下限」不可為空");
          return;
      } else if (this.editCache1[id].data.materialWidthMax === undefined) {
          myObj.message.create("error", "「原料寬度上限」不可為空");
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
      this.TBORPM031List.forEach(item => {
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
      this.getTBORPM031List();
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
            saleOrderWidthMin : this.saleOrderWidthMin,
            saleOrderWidthMax : this.saleOrderWidthMax,
            processType : this.processType,
            materialWidthMin : this.materialWidthMin,
            materialWidthMax : this.materialWidthMax,
            tolerateMin : this.tolerateMin,
            tolerateMax : this.tolerateMax,
            userCreate : this.USERNAME,
        })

        myObj.ORPService.insertTBORPM031(obj).subscribe(res => {

          console.log(res)
          if(res["message"] === "success") {
            this.saleOrderWidthMin = undefined;
            this.saleOrderWidthMax = undefined;
            this.processType = undefined;
            this.materialWidthMin = undefined;
            this.materialWidthMax = undefined;
            this.tolerateMin = undefined;
            this.tolerateMax = undefined;
            this.getTBORPM031List();
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
          saleOrderWidthMin : this.editCache1[_id].data.saleOrderWidthMin,
          saleOrderWidthMax : this.editCache1[_id].data.saleOrderWidthMax,
          processType : this.editCache1[_id].data.processType,
          materialWidthMin : this.editCache1[_id].data.materialWidthMin,
          materialWidthMax : this.editCache1[_id].data.materialWidthMax,
          tolerateMin : this.editCache1[_id].data.tolerateMin,
          tolerateMax : this.editCache1[_id].data.tolerateMax,
          userUpdate : this.USERNAME,
          userCreate : this.USERNAME,
        })
        // 若數據長度沒變(修改)，則以更新方式處理
        if (this.RawTBORPM031ListLen === this.TBORPM031List.length) {
        myObj.ORPService.updateTBORPM031(obj).subscribe(res => {
          if (res["message"] === "success") {
            this.saleOrderWidthMin = undefined;
            this.saleOrderWidthMax = undefined;
            this.processType = undefined;
            this.materialWidthMin = undefined;
            this.materialWidthMax = undefined;
            this.tolerateMin = undefined;
            this.tolerateMax = undefined;

            this.sucessMSG("修改成功", ``)

            const index = this.TBORPM031List.findIndex(item => item.id === _id);
            Object.assign(this.TBORPM031List[index], this.editCache1[_id].data);
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
        myObj.ORPService.insertTBORPM031(obj).subscribe(res => {
          if (res["message"] === "success") {
            this.saleOrderWidthMin = undefined;
            this.saleOrderWidthMax = undefined;
            this.processType = undefined;
            this.materialWidthMin = undefined;
            this.materialWidthMax = undefined;
            this.tolerateMin = undefined;
            this.tolerateMax = undefined;
            this.getTBORPM031List();
            
            this.sucessMSG("修改成功", ``)

            const index = this.TBORPM031List.findIndex(item => item.id === _id);
            Object.assign(this.TBORPM031List[index], this.editCache1[_id].data);
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
        myObj.ORPService.delTBORPM031(_ID).subscribe(res => {
          if(res["message"] === "success") {
            this.saleOrderWidthMin = undefined;
            this.saleOrderWidthMax = undefined;
            this.processType = undefined;
            this.materialWidthMin = undefined;
            this.materialWidthMax = undefined;
            this.tolerateMin = undefined;
            this.tolerateMax = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getTBORPM031List();
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
    var json_data = this.TBORPM031List
    json_data = JSON.parse(JSON.stringify(json_data).split('"saleOrderWidthMin":').join('"訂單寬度下限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"saleOrderWidthMax":').join('"訂單寬度上限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"processType":').join('"加工別":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"materialWidthMin":').join('"原料寬度下限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"materialWidthMax":').join('"原料寬度上限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"tolerateMin":').join('"原料寬度寬放下限":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"tolerateMax":').join('"原料寬度寬放上限":'));
    for (let i = 1; i <= json_data.length; i++){
      delete json_data[i-1]['id'];
      delete json_data[i-1]['tab1ID'];
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json_data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, '訂單寬度原料對照表.xlsx');
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
      data = JSON.parse(JSON.stringify(data).split('"訂單寬度下限":').join('"saleOrderWidthMin":'));
      data = JSON.parse(JSON.stringify(data).split('"訂單寬度上限":').join('"saleOrderWidthMax":'));
      data = JSON.parse(JSON.stringify(data).split('"加工別":').join('"processType":'));
      data = JSON.parse(JSON.stringify(data).split('"原料寬度下限":').join('"materialWidthMin":'));
      data = JSON.parse(JSON.stringify(data).split('"原料寬度上限":').join('"materialWidthMax":'));
      data = JSON.parse(JSON.stringify(data).split('"原料寬度寬放下限":').join('"tolerateMin":'));
      data = JSON.parse(JSON.stringify(data).split('"原料寬度寬放上限":').join('"tolerateMax":'));
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
      myObj.ORPService.delallITBORPM031().subscribe(res => {
        if(res === true) {
          console.log("已刪除舊資料!")
          this.getTBORPM031List();
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
      myObj.ORPService.batchsaveTBORPM031(_data).subscribe(res => {
        console.log(res)
        if(res["message"] === "success") {
          console.log("已寫入新資料!")
          this.saleOrderWidthMin = undefined;
          this.saleOrderWidthMax = undefined;
          this.processType = undefined;
          this.materialWidthMin = undefined;
          this.materialWidthMax = undefined;
          this.tolerateMin = undefined;
          this.tolerateMax = undefined;
          this.getTBORPM031List();
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
    this.TBORPM031listOfDisplayData = this.TBORPM031List
    console.log(this.TBORPM031listOfDisplayData)
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
    this.TBORPM031listOfDisplayData = []
    for (let i = 1; i <= this.TBORPM031List.length; i++){
      if (this.TBORPM031List[i-1][searchKey] === searchValue) {
        this.TBORPM031listOfDisplayData.push(this.TBORPM031List[i-1])
      }
    }
    console.log(this.TBORPM031listOfDisplayData)
  }
  // --搜尋各欄位
  searchSaleOrderWidthMin(searchValue) {this.search(searchValue, "saleOrderWidthMin"); this.visible1 = false;}
  searchSaleOrderWidthMax(searchValue) {this.search(searchValue, "saleOrderWidthMax"); this.visible2 = false;}
  searchProcessType(searchValue) {this.search(searchValue, "processType"); this.visible3 = false;}
  searchMaterialWidthMin(searchValue) {this.search(searchValue, "materialWidthMin"); this.visible4 = false;}
  searchMaterialWidthMax(searchValue) {this.search(searchValue, "materialWidthMax"); this.visible5 = false;}
  searchTolerateMin(searchValue) {this.search(searchValue, "tolerateMin"); this.visible6 = false;}
  searchTolerateMax(searchValue) {this.search(searchValue, "tolerateMax"); this.visible7 = false;}
  
  // 升降冪
  listOfColumn = {
    "saleOrderWidthMin":
    {
      compare: (a: ItemData1, b: ItemData1) => a.saleOrderWidthMin - b.saleOrderWidthMin,
      priority: false
    },
    "saleOrderWidthMax":
    {
      compare: (a: ItemData1, b: ItemData1) => a.saleOrderWidthMax - b.saleOrderWidthMax,
      priority: false
    },
    "processType":
    {
      compare: (a: ItemData1, b: ItemData1) => a.processType.localeCompare(b.processType),
      priority: false
    },
    "materialWidthMin":
    {
      compare: (a: ItemData1, b: ItemData1) => a.materialWidthMin - b.materialWidthMin,
      priority: false
    },
    "materialWidthMax":
    {
      compare: (a: ItemData1, b: ItemData1) => a.materialWidthMax - b.materialWidthMax,
      priority: false
    },
    "tolerateMin":
    {
      compare: (a: ItemData1, b: ItemData1) => a.tolerateMin - b.tolerateMin,
      priority: false
    },
    "tolerateMax":
    {
      compare: (a: ItemData1, b: ItemData1) => a.tolerateMax - b.tolerateMax,
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
    if (this.RawTBORPM031ListLen === this.TBORPM031List.length){
      // 顯示數據初始化
      this.TBORPM031listOfDisplayData = this.TBORPM031List;
      // 取得最後一筆數據ID
      var max_data = this.getMax(this.TBORPM031listOfDisplayData, "tab1ID");
      var max_id: number = +max_data.id;
      var max_tableID = max_data.tab1ID;
      // 新增空列
      var newRow = {
          id: `${max_id + 1}`,
          tab1ID: max_tableID + 1,
          saleOrderWidthMin: undefined,
          saleOrderWidthMax: undefined,
          processType: undefined,
          materialWidthMin: undefined,
          materialWidthMax: undefined,
          tolerateMin: undefined,
          tolerateMax: undefined
      }
      // 更新顯示數據
      this.TBORPM031listOfDisplayData = [newRow, ...this.TBORPM031listOfDisplayData];
      // 更新原始數據
      this.TBORPM031List = [newRow, ...this.TBORPM031List];
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
