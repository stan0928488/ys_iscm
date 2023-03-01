import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { OIPService } from "src/app/services/OIP/OIP.service";
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
  condition1: number;
  condition2: number;
  condition3: string;
  condition4: string;
  condition5: string;
  coefficientMill3: number;
  coefficientMill4: number;
  coefficientMill5: number;
}

@Component({
  selector: "app-OIPP029",
  templateUrl: "./OIPP029.component.html",
  styleUrls: ["./OIPP029.component.scss"],
  providers:[NzMessageService]
})
export class OIPP029component implements AfterViewInit {
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
  visible8 = false;
  visible9 = false;

  // 接單係數表 
  productType;
  condition1;
  condition2;
  condition3;
  condition4;
  condition5;
  coefficientMill3;
  coefficientMill4;
  coefficientMill5;

  // tab 1
  TBOIPM029List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  TBOIPM029List: ItemData1[] = [];
  RawTBOIPM029ListLen;

  constructor(
    private OIPService: OIPService,
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
    this.getTBOIPM029List();
  }
  
  
  //tab1_select 
  getTBOIPM029List() {
    this.loading = true;
    let myObj = this;
    this.OIPService.getTBOIPM029List().subscribe(res => {
      console.log("getTBOIPM029List success");
      this.TBOIPM029List_tmp = res['data'];

      const data = [];
      for (let i = 0; i < this.TBOIPM029List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.TBOIPM029List_tmp[i].id,
          productType: this.TBOIPM029List_tmp[i].productType,
          condition1: this.TBOIPM029List_tmp[i].condition1,
          condition2: this.TBOIPM029List_tmp[i].condition2,
          condition3: this.TBOIPM029List_tmp[i].condition3,
          condition4: this.TBOIPM029List_tmp[i].condition4,
          condition5: this.TBOIPM029List_tmp[i].condition5,
          coefficientMill3: this.TBOIPM029List_tmp[i].coefficientMill3,
          coefficientMill4: this.TBOIPM029List_tmp[i].coefficientMill4,
          coefficientMill5: this.TBOIPM029List_tmp[i].coefficientMill5,
        });
      }
      this.RawTBOIPM029ListLen = data.length; // 原始數據長度
      this.TBOIPM029List = data; // 原始數據
      this.listOfDisplayData = data // 搜尋顯示數據
      this.updateEditCache(1);
      console.log(this.TBOIPM029List);
      myObj.loading = false;
    });
  }
  
  
  // insert1
  insertTab1() {
    let myObj = this;
    if (this.productType === undefined) {
      myObj.message.create("error", "「產品別」不可為空");
      return;
    } else if (this.condition1 === undefined) {
      myObj.message.create("error", "「厚度min」不可為空");
      return;
    }  else if (this.condition2 === undefined) {
      myObj.message.create("error", "「厚度max」不可為空");
      return;
    } else if (this.condition3 === undefined) {
        myObj.message.create("error", "「軟料(料號倒數第二碼)」不可為空");
        return;
    } else if (this.condition4 === undefined) {
        myObj.message.create("error", "「JIS」不可為空");
        return;
    }  else if (this.condition5 === undefined) {
        myObj.message.create("error", "「製程」不可為空");
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
      const index = this.TBOIPM029List.findIndex(item => item.id === id);
      // 若數據長度沒變(修改)，則以取消方式處理
      if (this.RawTBOIPM029ListLen === this.TBOIPM029List.length) {
        this.editCache1[id] = {
          data: { ...this.TBOIPM029List[index] },
          edit: false
        };
      }
      // 若數據長度改變(新增)，則以刪除ID方式處理
      else {
        this.TBOIPM029List = this.TBOIPM029List.filter(ItemData1 => ItemData1.id !== id);
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
      } else if (this.editCache1[id].data.condition1 === undefined) {
        myObj.message.create("error", "「厚度min」不可為空");
        return;
      }  else if (this.editCache1[id].data.condition2 === undefined) {
        myObj.message.create("error", "「厚度max」不可為空");
        return;
      } else if (this.editCache1[id].data.condition3 === undefined) {
          myObj.message.create("error", "「軟料(料號倒數第二碼)」不可為空");
          return;
      } else if (this.editCache1[id].data.condition4 === undefined) {
          myObj.message.create("error", "「JIS」不可為空");
          return;
      }  else if (this.editCache1[id].data.condition5 === undefined) {
        myObj.message.create("error", "「製程」不可為空");
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
      this.TBOIPM029List.forEach(item => {
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
      this.getTBOIPM029List();
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
            condition1 : this.condition1,
            condition2 : this.condition2,
            condition3 : this.condition3,
            condition4 : this.condition4,
            condition5 : this.condition5,
            coefficientMill3 : this.coefficientMill3,
            coefficientMill4 : this.coefficientMill4,
            coefficientMill5 : this.coefficientMill5,
            userCreate : this.USERNAME,
        })

        myObj.OIPService.insertTBOIPM029(obj).subscribe(res => {

          console.log(res)
          if(res["message"] === "success") {
            this.productType = undefined;
            this.condition1 = undefined;
            this.condition2 = undefined;
            this.condition3 = undefined;
            this.condition4 = undefined;
            this.condition5 = undefined;
            this.coefficientMill3 = undefined;
            this.coefficientMill4 = undefined;
            this.coefficientMill5 = undefined;
            this.getTBOIPM029List();
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
          condition1 : this.editCache1[_id].data.condition1,
          condition2 : this.editCache1[_id].data.condition2,
          condition3 : this.editCache1[_id].data.condition3,
          condition4 : this.editCache1[_id].data.condition4,
          condition5 : this.editCache1[_id].data.condition5,
          coefficientMill3 : this.editCache1[_id].data.coefficientMill3,
          coefficientMill4 : this.editCache1[_id].data.coefficientMill4,
          coefficientMill5 : this.editCache1[_id].data.coefficientMill5,
          userUpdate : this.USERNAME,
          userCreate : this.USERNAME,
        })

        // 若數據長度沒變(修改)，則以更新方式處理
        if (this.RawTBOIPM029ListLen === this.TBOIPM029List.length) {
          myObj.OIPService.updateTBOIPM029(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.productType = undefined;
              this.condition1 = undefined;
                this.condition2 = undefined;
                this.condition3 = undefined;
                this.condition4 = undefined;
                this.condition5 = undefined;
                this.coefficientMill3 = undefined;
                this.coefficientMill4 = undefined;
                this.coefficientMill5 = undefined;
  
              this.sucessMSG("修改成功", ``)
  
              const index = this.TBOIPM029List.findIndex(item => item.id === _id);
              Object.assign(this.TBOIPM029List[index], this.editCache1[_id].data);
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
          myObj.OIPService.insertTBOIPM029(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.productType = undefined;
              this.condition1 = undefined;
                this.condition2 = undefined;
                this.condition3 = undefined;
                this.condition4 = undefined;
                this.condition5 = undefined;
                this.coefficientMill3 = undefined;
                this.coefficientMill4 = undefined;
                this.coefficientMill5 = undefined;
              this.getTBOIPM029List();
              
              this.sucessMSG("修改成功", ``)
  
              const index = this.TBOIPM029List.findIndex(item => item.id === _id);
              Object.assign(this.TBOIPM029List[index], this.editCache1[_id].data);
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
        myObj.OIPService.delTBOIPM029(_ID).subscribe(res => {
          if(res["message"] === "success") {
            this.productType = undefined;
            this.condition1 = undefined;
            this.condition2 = undefined;
            this.condition3 = undefined;
            this.condition4 = undefined;
            this.condition5 = undefined;
            this.coefficientMill3 = undefined;
            this.coefficientMill4 = undefined;
            this.coefficientMill5 = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getTBOIPM029List();
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
    var json_data = this.TBOIPM029List
    json_data = JSON.parse(JSON.stringify(json_data).split('"productType":').join('"產品別":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"condition1":').join('"厚度min":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"condition2":').join('"厚度max":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"condition3":').join('"軟料(料號倒數第二碼)":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"condition4":').join('"JIS":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"condition5":').join('"製程":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"coefficientMill3":').join('"三呎係數":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"coefficientMill4":').join('"四呎係數":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"coefficientMill5":').join('"五呎係數":'));
    for (let i = 1; i <= json_data.length; i++){
      delete json_data[i-1]['id'];
      delete json_data[i-1]['tab1ID'];
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json_data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, '接單係數表.xlsx');
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
      data = JSON.parse(JSON.stringify(data).split('"厚度min":').join('"condition1":'));
      data = JSON.parse(JSON.stringify(data).split('"厚度max":').join('"condition2":'));
      data = JSON.parse(JSON.stringify(data).split('"軟料(料號倒數第二碼)":').join('"condition3":'));
      data = JSON.parse(JSON.stringify(data).split('"JIS":').join('"condition4":'));
      data = JSON.parse(JSON.stringify(data).split('"製程":').join('"condition5":'));
      data = JSON.parse(JSON.stringify(data).split('"三呎係數":').join('"coefficientMill3":'));
      data = JSON.parse(JSON.stringify(data).split('"四呎係數":').join('"coefficientMill4":'));
      data = JSON.parse(JSON.stringify(data).split('"五呎係數":').join('"coefficientMill5":'));
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
      myObj.OIPService.delallTBOIPM029().subscribe(res => {
        if(res === true) {
          console.log("已刪除舊資料!")
          this.getTBOIPM029List();
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
      myObj.OIPService.batchsaveTBOIPM029(_data).subscribe(res => {
        console.log(res)
        if(res["message"] === "success") {
          console.log("已寫入新資料!")
          this.productType = undefined;
          this.condition1 = undefined;
            this.condition2 = undefined;
            this.condition3 = undefined;
            this.condition4 = undefined;
            this.condition5 = undefined;
            this.coefficientMill3 = undefined;
            this.coefficientMill4 = undefined;
            this.coefficientMill5 = undefined;
          this.getTBOIPM029List();
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
    this.listOfDisplayData = this.TBOIPM029List
    console.log(this.listOfDisplayData)
    this.visible1 = false;
    this.visible2 = false;
    this.visible3 = false;
    this.visible4 = false;
    this.visible5 = false;
    this.visible6 = false;
    this.visible7 = false;
    this.visible8 = false;
    this.visible9 = false;

  }
  // --搜尋 by key
  search(searchValue, searchKey) {
    this.listOfDisplayData = []
    for (let i = 1; i <= this.TBOIPM029List.length; i++){
      if (this.TBOIPM029List[i-1][searchKey] === searchValue) {
        this.listOfDisplayData.push(this.TBOIPM029List[i-1])
      }
    }
    console.log(this.listOfDisplayData)
  }
  // --搜尋各欄位
  searchProductType(searchValue) {this.search(searchValue, "productType"); this.visible1 = false;}
  searchCondition1(searchValue) {this.search(searchValue, "condition1"); this.visible2 = false;}
  searchCondition2(searchValue) {this.search(searchValue, "condition2"); this.visible3 = false;}
  searchCondition3(searchValue) {this.search(searchValue, "condition3"); this.visible4 = false;}
  searchCondition4(searchValue) {this.search(searchValue, "condition4"); this.visible5 = false;}
  searchCondition5(searchValue) {this.search(searchValue, "condition5"); this.visible6 = false;}
  searchCoefficientMill3(searchValue) {this.search(searchValue, "coefficientMill3"); this.visible7 = false;}
  searchCoefficientMill4(searchValue) {this.search(searchValue, "coefficientMill4"); this.visible8 = false;}
  searchCoefficientMill5(searchValue) {this.search(searchValue, "coefficientMill5"); this.visible9 = false;}
  
  // 升降冪
  listOfColumn = {
    "productType":
    {
      compare: (a: ItemData1, b: ItemData1) => a.productType.localeCompare(b.productType),
      priority: false
    },
    "condition1":
    {
      compare: (a: ItemData1, b: ItemData1) => a.condition1 - b.condition1,
      priority: false
    },
    "condition2":
    {
      compare: (a: ItemData1, b: ItemData1) => a.condition2 - b.condition2,
      priority: false
    },
    "condition3":
    {
      compare: (a: ItemData1, b: ItemData1) => a.condition3.localeCompare(b.condition3),
      priority: false
    },
    "condition4":
    {
        compare: (a: ItemData1, b: ItemData1) => a.condition4.localeCompare(b.condition4),
      priority: false
    },
    "condition5":
    {
        compare: (a: ItemData1, b: ItemData1) => a.condition5.localeCompare(b.condition5),
      priority: false
    },
    "coefficientMill3":
    {
      compare: (a: ItemData1, b: ItemData1) => a.coefficientMill3 - b.coefficientMill3,
      priority: false
    },
    "coefficientMill4":
    {
      compare: (a: ItemData1, b: ItemData1) => a.coefficientMill4 - b.coefficientMill4,
      priority: false
    },
    "coefficientMill5":
    {
      compare: (a: ItemData1, b: ItemData1) => a.coefficientMill5 - b.coefficientMill5,
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
    if (this.RawTBOIPM029ListLen === this.TBOIPM029List.length){
      // 顯示數據初始化
      this.listOfDisplayData = this.TBOIPM029List;
      // 取得最後一筆數據ID
      var max_data = this.getMax(this.listOfDisplayData, "tab1ID");
      var max_id: number = +max_data.id;
      var max_tableID = max_data.tab1ID;
      // 新增空列
      var newRow = {
          id: `${max_id + 1}`,
          tab1ID: max_tableID + 1,
          productType: undefined,
          condition1: undefined,
          condition2: undefined,
          condition3: undefined,
          condition4: undefined,
          condition5: undefined,
          coefficientMill3: undefined,
          coefficientMill4: undefined,
          coefficientMill5: undefined,
      }
      // 更新顯示數據
      this.listOfDisplayData = [newRow, ...this.listOfDisplayData];
      // 更新原始數據
      this.TBOIPM029List = [newRow, ...this.TBOIPM029List];
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
