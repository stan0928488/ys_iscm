import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { TRAService } from "src/app/services/TRA/TRA.service";
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
  plantCode: string;
  equipCode: string;
  lineupProductType: string;
  productType: string;
  processFactor: string;
  processFactorMin: number;
  processFactorMax: number;
}

@Component({
  selector: "app-TRAP001",
  templateUrl: "./TRAP001.component.html",
  styleUrls: ["./TRAP001.component.scss"],
  providers:[NzMessageService]
})
export class TRAP001component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;


  // 搜尋功能
  searchValue = "";
  searchKey = "";
  // TBORPM031listOfDisplayData;
  TBTRAM001listOfDisplayData;
  visible1 = false;
  visible2 = false;
  visible3 = false;
  visible4 = false;
  visible5 = false;
  visible6 = false;
  visible7 = false;

  // 製程參數管制值
  plantCode;
  equipCode;
  lineupProductType;
  productType;
  processFactor;
  processFactorMin;
  processFactorMax;


  // tab 1
  TBTRAM001List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  TBTRAM001List: ItemData1[] = [];
  RawTBTRAM001ListLen;


  constructor(
    private TRAService: TRAService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");

  }

  ngAfterViewInit() {
    // console.log("ngAfterViewChecked");
    this.getTBTRAM001List();
  }
  
  
  //tab1_select 
  getTBTRAM001List() {
    this.loading = true;
    let myObj = this;
    this.TRAService.getTBTRAM001List().subscribe(res => {
      console.log("getTBTRAM001List success");
      this.TBTRAM001List_tmp = res['data'];
      
      const data = [];
      for (let i = 0; i < this.TBTRAM001List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.TBTRAM001List_tmp[i].id,
          plantCode: this.TBTRAM001List_tmp[i].plantCode,
          equipCode: this.TBTRAM001List_tmp[i].equipCode,
          lineupProductType: this.TBTRAM001List_tmp[i].lineupProductType,
          productType: this.TBTRAM001List_tmp[i].productType,
          processFactor: this.TBTRAM001List_tmp[i].processFactor,
          processFactorMin: this.TBTRAM001List_tmp[i].processFactorMin,
          processFactorMax: this.TBTRAM001List_tmp[i].processFactorMax
        });
      }
      this.RawTBTRAM001ListLen = data.length; // 原始數據長度
      this.TBTRAM001List = data; // 原始數據
      this.TBTRAM001listOfDisplayData = data // 搜尋顯示數據
      this.updateEditCache(1);
      console.log(this.TBTRAM001List);
      myObj.loading = false;
    });
  }
  
  
  // insert1
  // insertTab1() {
  //   let myObj = this;
  //   if (this.saleOrderWidthMin === undefined) {
  //     myObj.message.create("error", "「輸入寬度下限」不可為空");
  //     return;
  //   } else if (this.saleOrderWidthMax === undefined) {
  //     myObj.message.create("error", "「輸入寬度上限」不可為空");
  //     return;
  //   }  else if (this.processType === undefined) {
  //     myObj.message.create("error", "「加工別」不可為空");
  //     return;
  //   } else if (this.materialWidthMin === undefined) {
  //       myObj.message.create("error", "「原料寬度下限」不可為空");
  //       return;
  //   } else if (this.materialWidthMax === undefined) {
  //       myObj.message.create("error", "「原料寬度上限」不可為空");
  //       return;
  //   } else {
  //     this.Modal.confirm({
  //       nzTitle: '是否確定新增',
  //       nzOnOk: () => {
  //         this.insertSave(1)
  //       },
  //       nzOnCancel: () =>
  //         console.log("cancel")
  //     });
  //   }
  // }
  


  
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
  // deleteRow(id: string, _type): void {
  //   console.log('id:'+id+'type:'+_type);
  //   if(_type === 1) {
  //     this.Modal.confirm({
  //       nzTitle: '是否確定刪除',
  //       nzOnOk: () => {
  //         this.delID(id, _type)
  //       },
  //       nzOnCancel: () =>
  //         console.log("cancel")
  //     });
  //   }
  // }

  // cancel
  cancelEdit(id: string, _type): void {
    if(_type === 1) {
      const index = this.TBTRAM001List.findIndex(item => item.id === id);
      // 若數據長度沒變(修改)，則以取消方式處理
      if (this.RawTBTRAM001ListLen === this.TBTRAM001List.length) {
        this.editCache1[id] = {
          data: { ...this.TBTRAM001List[index] },
          edit: false
        };
      }
      // 若數據長度改變(新增)，則以刪除ID方式處理
      else {
        this.TBTRAM001List = this.TBTRAM001List.filter(ItemData1 => ItemData1.id !== id);
        this.TBTRAM001listOfDisplayData = this.TBTRAM001listOfDisplayData.filter(ItemData1 => ItemData1.id !== id);
        delete this.editCache1[id];
      }
    }
  }

  // update Save
  saveEdit(id: string, _type): void {
    if(_type === 1) {
      console.log(this.editCache1[id].data)
      let myObj = this;
      if (this.editCache1[id].data.processFactorMax === undefined) {
        myObj.message.create("error", "「製程參數最大管制值」不可為空");
        return;
      } else if (this.editCache1[id].data.processFactorMin === undefined) {
        myObj.message.create("error", "「製程參數最小管制值」不可為空");
        return;
      }  else {
        this.Modal.confirm({
          nzTitle: '是否確定修改',
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
      this.TBTRAM001List.forEach(item => {
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
      this.getTBTRAM001List();
    }
  }
 
  // 新增資料
  // insertSave(_type) {
  //   if(_type === 1) {
  //     let myObj = this;
  //     this.LoadingPage = true;
      
  //     return new Promise((resolve, reject) => {
  //       let obj = {};
  //       _.extend(obj, {
  //           saleOrderWidthMin : this.saleOrderWidthMin,
  //           saleOrderWidthMax : this.saleOrderWidthMax,
  //           processType : this.processType,
  //           materialWidthMin : this.materialWidthMin,
  //           materialWidthMax : this.materialWidthMax,
  //           tolerateMin : this.tolerateMin,
  //           tolerateMax : this.tolerateMax,
  //           userCreate : this.USERNAME,
  //       })

  //       myObj.ORPService.insertTBORPM031(obj).subscribe(res => {

  //         console.log(res)
  //         if(res["message"] === "success") {
  //           this.saleOrderWidthMin = undefined;
  //           this.saleOrderWidthMax = undefined;
  //           this.processType = undefined;
  //           this.materialWidthMin = undefined;
  //           this.materialWidthMax = undefined;
  //           this.tolerateMin = undefined;
  //           this.tolerateMax = undefined;
  //           this.getTBORPM031List();
  //           this.sucessMSG("新增成功", ``);
  //         }
  //       },err => {
  //         reject('upload fail');
  //         this.errorMSG("新增失敗", "後台新增錯誤，請聯繫系統工程師");
  //         this.LoadingPage = false;
  //       })
  //     });
  //   } 
  // }

  // 修改資料
  updateSave(_id, _type) {
    if(_type === 1) {
      let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = {};
        _.extend(obj, {
          id : this.editCache1[_id].data.tab1ID,
          processFactorMin : this.editCache1[_id].data.processFactorMin,
          processFactorMax : this.editCache1[_id].data.processFactorMax,
          userUpdate : this.USERNAME,
          userCreate : this.USERNAME,
        })
        // 若數據長度沒變(修改)，則以更新方式處理
        if (this.RawTBTRAM001ListLen === this.TBTRAM001List.length) {
        myObj.TRAService.updateTBTRAM001(obj).subscribe(res => {
          if (res["message"] === "success") {
            this.plantCode = undefined;
            this.equipCode = undefined;
            this.lineupProductType = undefined;
            this.productType = undefined;
            this.processFactor = undefined;
            this.processFactorMin = undefined;
            this.processFactorMax = undefined;

            this.sucessMSG("修改成功", ``)

            const index = this.TBTRAM001List.findIndex(item => item.id === _id);
            Object.assign(this.TBTRAM001List[index], this.editCache1[_id].data);
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
  // delID(_id, _type) {
  //   if(_type === 1) {
  //     let myObj = this;
  //     return new Promise((resolve, reject) => {
  //       let _ID = this.editCache1[_id].data.tab1ID;
  //       myObj.ORPService.delTBORPM031(_ID).subscribe(res => {
  //         if(res["message"] === "success") {
  //           this.saleOrderWidthMin = undefined;
  //           this.saleOrderWidthMax = undefined;
  //           this.processType = undefined;
  //           this.materialWidthMin = undefined;
  //           this.materialWidthMax = undefined;
  //           this.tolerateMin = undefined;
  //           this.tolerateMax = undefined;
  
  //           this.sucessMSG("刪除成功", ``);
  //           this.getTBORPM031List();
  //         }
  //       },err => {
  //         reject('upload fail');
  //         this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
  //         this.LoadingPage = false;
  //       })
  //     });
  //   }
  // }

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
    var json_data = this.TBTRAM001List
    json_data = JSON.parse(JSON.stringify(json_data).split('"plantCode":').join('"廠區別":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"equipCode":').join('"機台別":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"lineupProductType":').join('"LINEUP產品":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"productType":').join('"產品別":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"processFactor":').join('"製程參數":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"processFactorMin":').join('"製程參數最小管制值":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"processFactorMax":').join('"製程參數最大管制值":'));
    for (let i = 1; i <= json_data.length; i++){
      delete json_data[i-1]['id'];
      delete json_data[i-1]['tab1ID'];
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json_data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, '製程參數管制值表.xlsx');
    await this.delay(500); // 睡眠0.5秒，以同步程式
    this.LoadingStatus("Off");
    this.sucessMSG("成功匯出!", ``);
  }

    // 匯入EXCEL
    // --選擇檔案
  //   movies: any[] = [];
  //   handleImport($event: any) {
  //     const files = $event.target.files;
  //     if (files.length) {
  //         const file = files[0];
  //         const reader = new FileReader();
  //         reader.onload = (event: any) => {
  //             const wb = XLSX.read(event.target.result);
  //             const sheets = wb.SheetNames;

  //             if (sheets.length) {
  //                 const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
  //                 this.movies = rows;
  //                 // 匯入
  //                 console.log("匯入資料...")
  //                 this.importExcel();
  //             }
  //         }
  //         reader.readAsArrayBuffer(file);
  //         // this.sucessMSG("已選擇檔案，請匯入!", ``);
  //     }
  // }
  // --確認
  // async importExcel(){
  //   if (this.movies.length != 0){
  //     var data = this.movies
  //     data = JSON.parse(JSON.stringify(data).split('"訂單寬度下限":').join('"saleOrderWidthMin":'));
  //     data = JSON.parse(JSON.stringify(data).split('"訂單寬度上限":').join('"saleOrderWidthMax":'));
  //     data = JSON.parse(JSON.stringify(data).split('"加工別":').join('"processType":'));
  //     data = JSON.parse(JSON.stringify(data).split('"原料寬度下限":').join('"materialWidthMin":'));
  //     data = JSON.parse(JSON.stringify(data).split('"原料寬度上限":').join('"materialWidthMax":'));
  //     data = JSON.parse(JSON.stringify(data).split('"原料寬度寬放下限":').join('"tolerateMin":'));
  //     data = JSON.parse(JSON.stringify(data).split('"原料寬度寬放上限":').join('"tolerateMax":'));
  //     for (let i = 1; i <= data.length; i++){
  //       data[i-1]["userCreate"] = this.USERNAME;
  //     }
  //     try {
  //       console.log("刪除舊資料...")
  //       this.del_all_data();
  //       await this.delay(1000); // 睡眠1秒，以同步程式
  //       console.log("寫入新資料...")
  //       this.batch_save_all(data);
  //     }
  //     catch (er) {
  //       console.log(er)
  //     }

  //   } else{
  //     this.errorMSG("上傳錯誤", "請新增檔案!");
  //   }
  // }
  // --刪除舊資料
  // del_all_data() {
  //   let myObj = this;
  //   return new Promise((resolve, reject) => {
  //     myObj.TRAService.delallITBORPM031().subscribe(res => {
  //       if(res === true) {
  //         console.log("已刪除舊資料!")
  //         this.getTBORPM031List();
  //       }
  //     },err => {
  //       reject('upload fail');
  //       this.errorMSG("上傳失敗", "後台刪除錯誤，請聯繫系統工程師");
  //       this.LoadingPage = false;
  //     })
  //   });
  // }
  // --寫入新資料
  // batch_save_all(_data){
  //   let myObj = this;
  //   return new Promise((resolve, reject) => {
  //     this.LoadingStatus("On");
  //     myObj.ORPService.batchsaveTBORPM031(_data).subscribe(res => {
  //       console.log(res)
  //       if(res["message"] === "success") {
  //         console.log("已寫入新資料!")
  //         this.saleOrderWidthMin = undefined;
  //         this.saleOrderWidthMax = undefined;
  //         this.processType = undefined;
  //         this.materialWidthMin = undefined;
  //         this.materialWidthMax = undefined;
  //         this.tolerateMin = undefined;
  //         this.tolerateMax = undefined;
  //         this.getTBORPM031List();
  //         this.LoadingStatus("Off");
  //         (<HTMLInputElement>document.getElementById("importExcel")).value = "" ; 
  //         this.sucessMSG("成功匯入!", ``);
  //       }
  //     },err => {
  //       reject('upload fail');
  //       this.LoadingStatus("Off");
  //       (<HTMLInputElement>document.getElementById("importExcel")).value = "" ; 
  //       this.errorMSG("上傳失敗", "後台新增錯誤，請聯繫系統工程師");
  //       this.LoadingPage = false;
  //     })
  //   });
  // }

  // 搜尋功能
  // --復原
  reset() {
    this.TBTRAM001listOfDisplayData = this.TBTRAM001List
    console.log(this.TBTRAM001listOfDisplayData)
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
    this.TBTRAM001listOfDisplayData = []
    for (let i = 1; i <= this.TBTRAM001List.length; i++){
      if (this.TBTRAM001List[i-1][searchKey] === searchValue) {
        this.TBTRAM001listOfDisplayData.push(this.TBTRAM001List[i-1])
      }
    }
    console.log(this.TBTRAM001listOfDisplayData)
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
    "plantCode":
    {
      priority: false
    },
    "equipCode":
    {
      priority: false
    },
    "lineupProductType":
    {
      priority: false
    },
    "productType":
    {
      priority: false
    },
    "processFactor":
    {
      priority: false
    },
    "processFactorMax":
    {
      compare: (a: ItemData1, b: ItemData1) => a.processFactorMax - b.processFactorMax,
      priority: false
    },
    "processFactorMin":
    {
      compare: (a: ItemData1, b: ItemData1) => a.processFactorMin - b.processFactorMin,
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
    if (this.RawTBTRAM001ListLen === this.TBTRAM001List.length){
      // 顯示數據初始化
      this.TBTRAM001listOfDisplayData = this.TBTRAM001List;
      // 取得最後一筆數據ID
      var max_data = this.getMax(this.TBTRAM001listOfDisplayData, "tab1ID");
      var max_id: number = +max_data.id;
      var max_tableID = max_data.tab1ID;
      // 新增空列
      var newRow = {
          id: `${max_id + 1}`,
          tab1ID: max_tableID + 1,
          plantCode: undefined,
          equipCode: undefined,
          lineupProductType: undefined,
          productType: undefined,
          processFactor: undefined,
          processFactorMin: undefined,
          processFactorMax: undefined
      }
      // 更新顯示數據
      this.TBTRAM001listOfDisplayData = [newRow, ...this.TBTRAM001listOfDisplayData];
      // 更新原始數據
      this.TBTRAM001List = [newRow, ...this.TBTRAM001List];
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
      // (<HTMLInputElement>document.getElementById("singleAdd")).disabled = true;
      // (<HTMLInputElement>document.getElementById("bacthAdd")).disabled = true;
      (<HTMLInputElement>document.getElementById("download")).disabled = true;
    }
    else {
      loadingStatus.className = "hidden";
      // 打開按鈕
      // (<HTMLInputElement>document.getElementById("singleAdd")).disabled = false;
      // (<HTMLInputElement>document.getElementById("bacthAdd")).disabled = false;
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
