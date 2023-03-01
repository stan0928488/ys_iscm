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
  daysFromNowMin: number;
  daysFromNowMax: number;
  priorityContent: string;
}

@Component({
  selector: "app-ORPP033",
  templateUrl: "./ORPP033.component.html",
  styleUrls: ["./ORPP033.component.scss"],
  providers:[NzMessageService]
})
export class ORPP033component implements AfterViewInit {
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

  // 排序功能
  priority1_tmp;
  priority2_tmp;
  priority3_tmp;
  priority4_tmp;
  priority1 = "";
  priority2 = "";
  priority3 = "";
  priority4 = "";
  radioValue1_tmp;
  radioValue2_tmp;
  radioValue3_tmp;
  radioValue4_tmp;
  radioValue1 = '↓';
  radioValue2 = '↓';
  radioValue3 = '↓';
  radioValue4 = '↓';
  combinepriority = "";

  // 原料策略表 
  daysFromNowMin;
  daysFromNowMax;
  priorityContent;


  // tab 1
  TBORPM033List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  TBORPM033List: ItemData1[] = [];
  RawTBORPM033ListLen;

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
    this.getTBORPM033List();
  }
  
  
  //tab1_select 
  getTBORPM033List() {
    this.loading = true;
    let myObj = this;
    this.ORPService.getTBORPM033List().subscribe(res => {
      console.log("getTBORPM033List success");
      this.TBORPM033List_tmp = res['data'];

      const data = [];
      for (let i = 0; i < this.TBORPM033List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab1ID: this.TBORPM033List_tmp[i].id,
          daysFromNowMin: this.TBORPM033List_tmp[i].daysFromNowMin,
          daysFromNowMax: this.TBORPM033List_tmp[i].daysFromNowMax,
          priorityContent: this.TBORPM033List_tmp[i].priorityContent,
        });
      }
      this.RawTBORPM033ListLen = data.length; // 原始數據長度
      this.TBORPM033List = data; // 原始數據
      this.listOfDisplayData = data // 搜尋顯示數據
      this.updateEditCache(1);
      console.log(this.TBORPM033List);
      myObj.loading = false;
    });
  }
  
  
  // insert1
  insertTab1() {
    let myObj = this;
    if (this.daysFromNowMin === undefined) {
      myObj.message.create("error", "「期望交期距今-min(日)」不可為空");
      return;
    } else if (this.daysFromNowMax === undefined) {
      myObj.message.create("error", "「期望交期距今-max(日)」不可為空");
      return;
    }  else if (this.priorityContent === undefined) {
      myObj.message.create("error", "「順位內容」不可為空");
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
      // 導入排序預設值
      this.priority1 = "" ;
      this.priority2 = "" ;
      this.priority3 = "" ;
      this.priority4 = "" ;
      this.radioValue1 = "↓" ;
      this.radioValue2 = "↓" ;
      this.radioValue3 = "↓" ;
      this.radioValue4 = "↓" ;
      var menuname = document.getElementById("menuName1");
      menuname.textContent = "請選擇 V";
      var menuname = document.getElementById("menuName2");
      menuname.textContent = "請選擇 V";
      var menuname = document.getElementById("menuName3");
      menuname.textContent = "請選擇 V";
      var menuname = document.getElementById("menuName4");
      menuname.textContent = "請選擇 V";
      this.combinepriority = "";
      var priorityContent_tmp = this.editCache1[id].data.priorityContent;
      if (priorityContent_tmp !== undefined) {
        this.combinepriority = priorityContent_tmp;
        var priorityContent_list_tmp = priorityContent_tmp.split(",");
        for (var i=1 ; i <= priorityContent_list_tmp.length ; i++) {
            var j = i - 1 ;
            if (j===0) {
                this.radioValue1 = priorityContent_list_tmp[j].charAt(priorityContent_list_tmp[j].length-1);
                this.priority1 = priorityContent_list_tmp[j].replace(this.radioValue1,"");
                document.getElementById("menuName1").textContent = this.priority1 + ' V';
            }
            if (j===1) {
                this.radioValue2 = priorityContent_list_tmp[j].charAt(priorityContent_list_tmp[j].length-1);
                this.priority2 = priorityContent_list_tmp[j].replace(this.radioValue2,"");
                document.getElementById("menuName2").textContent = this.priority2 + ' V';
            }
            if (j===2) {
                this.radioValue3 = priorityContent_list_tmp[j].charAt(priorityContent_list_tmp[j].length-1);
                this.priority3 = priorityContent_list_tmp[j].replace(this.radioValue3,"");
                document.getElementById("menuName3").textContent = this.priority3 + ' V';
            }
            if (j===3) {
                this.radioValue4 = priorityContent_list_tmp[j].charAt(priorityContent_list_tmp[j].length-1);
                this.priority4 = priorityContent_list_tmp[j].replace(this.radioValue4,"");
                document.getElementById("menuName4").textContent = this.priority4 + ' V';
            }
      }

      }
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
      const index = this.TBORPM033List.findIndex(item => item.id === id);
      // 若數據長度沒變(修改)，則以取消方式處理
      if (this.RawTBORPM033ListLen === this.TBORPM033List.length) {
        this.editCache1[id] = {
          data: { ...this.TBORPM033List[index] },
          edit: false
        };
      }
      // 若數據長度改變(新增)，則以刪除ID方式處理
      else {
        this.TBORPM033List = this.TBORPM033List.filter(ItemData1 => ItemData1.id !== id);
        this.listOfDisplayData = this.listOfDisplayData.filter(ItemData1 => ItemData1.id !== id);
        delete this.editCache1[id];
      }
    }
  }

  // 判斷是否重疊
  isOverlap(list1, list2) {
    // 開始組
    const maxStart = [list1[0], list2[0]]; 
    // 結束組
    const minEnd = [list1[1], list2[1]];
    if(Math.max(...maxStart)<= Math.min(...minEnd)) {
        return true
        }
    else {
        return false
    }
  }

  // update Save
  saveEdit(id: string, _type): void {
    if(_type === 1) {
        // 取得最大範圍
        var daysFromNowMinTotal = undefined;
        var daysFromNowMaxTotal = undefined;
        for (let i = 1; i <= this.TBORPM033List.length; i++){
            if (this.TBORPM033List[i-1]["id"] !== id) {
                if (daysFromNowMinTotal === undefined) {
                    daysFromNowMinTotal = this.TBORPM033List[i-1]["daysFromNowMin"];
                }
                else {
                    if (this.TBORPM033List[i-1]["daysFromNowMin"] < daysFromNowMinTotal)  {
                        daysFromNowMinTotal = this.TBORPM033List[i-1]["daysFromNowMin"];
                    }
                }
                if (daysFromNowMaxTotal === undefined) {
                    daysFromNowMaxTotal = this.TBORPM033List[i-1]["daysFromNowMax"];
                }
                else {
                    if (this.TBORPM033List[i-1]["daysFromNowMax"] > daysFromNowMaxTotal)  {
                        daysFromNowMaxTotal = this.TBORPM033List[i-1]["daysFromNowMax"];
                    }
                }
            }
          }
      console.log(this.editCache1[id].data)
      let myObj = this;
      if (this.editCache1[id].data.daysFromNowMin === undefined) {
        myObj.message.create("error", "「期望交期距今-min(日)」不可為空");
        return;
      } else if (this.editCache1[id].data.daysFromNowMax === undefined) {
        myObj.message.create("error", "「期望交期距今-max(日)」不可為空");
        return;
        } else if (this.isOverlap([this.editCache1[id].data.daysFromNowMin, this.editCache1[id].data.daysFromNowMax], [daysFromNowMinTotal, daysFromNowMaxTotal])) {
            myObj.message.create("error", "範圍重複!");

      }  else if (this.combinepriority === "") {
        myObj.message.create("error", "「順位內容」不可為空");
        return;
      } else {
        if (this.RawTBORPM033ListLen === this.TBORPM033List.length) {
            this.Modal.confirm({
                nzTitle: '是否確定修改',
                nzOnOk: () => {
                  this.updateSave(id, 1)
                },
                nzOnCancel: () =>
                  console.log("cancel")
              });
        }
        else {
            this.Modal.confirm({
                nzTitle: '是否確定新增',
                nzOnOk: () => {
                  this.updateSave(id, 1)
                },
                nzOnCancel: () =>
                  console.log("cancel")
              });
        }
      }
    }
  }
  


  // update
  updateEditCache(_type): void {
    if(_type === 1) {
      this.TBORPM033List.forEach(item => {
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
      this.getTBORPM033List();
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
            daysFromNowMin : this.daysFromNowMin,
            daysFromNowMax : this.daysFromNowMax,
            priorityContent : this.priorityContent,
            userCreate : this.USERNAME,
        })

        myObj.ORPService.insertTBORPM033(obj).subscribe(res => {

          console.log(res)
          if(res["message"] === "success") {
            this.daysFromNowMin = undefined;
            this.daysFromNowMax = undefined;
            this.priorityContent = undefined;
            this.getTBORPM033List();
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
          daysFromNowMin : this.editCache1[_id].data.daysFromNowMin,
          daysFromNowMax : this.editCache1[_id].data.daysFromNowMax,
          priorityContent : this.combinepriority,
          userUpdate : this.USERNAME,
          userCreate : this.USERNAME,
        })

        // 若數據長度沒變(修改)，則以更新方式處理
        if (this.RawTBORPM033ListLen === this.TBORPM033List.length) {
          myObj.ORPService.updateTBORPM033(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.daysFromNowMin = undefined;
              this.daysFromNowMax = undefined;
              this.priorityContent = undefined;
              this.combinepriority = ""
              this.getTBORPM033List();
  
              this.sucessMSG("修改成功", ``)
  
              const index = this.TBORPM033List.findIndex(item => item.id === _id);
              Object.assign(this.TBORPM033List[index], this.editCache1[_id].data);
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
          myObj.ORPService.insertTBORPM033(obj).subscribe(res => {
            if (res["message"] === "success") {
              this.daysFromNowMin = undefined;
              this.daysFromNowMax = undefined;
              this.priorityContent = undefined;
              this.combinepriority = ""
              this.getTBORPM033List();
              
              this.sucessMSG("新增成功", ``)
  
              const index = this.TBORPM033List.findIndex(item => item.id === _id);
              Object.assign(this.TBORPM033List[index], this.editCache1[_id].data);
              this.editCache1[_id].edit = false;
            }
          },err => {
            reject('upload fail');
            this.errorMSG("新增失敗", "後台修改錯誤，請聯繫系統工程師");
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
        myObj.ORPService.delTBORPM033(_ID).subscribe(res => {
          if(res["message"] === "success") {
            this.daysFromNowMin = undefined;
            this.daysFromNowMax = undefined;
            this.priorityContent = undefined;
  
            this.sucessMSG("刪除成功", ``);
            this.getTBORPM033List();
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
    var json_data = this.TBORPM033List
    json_data = JSON.parse(JSON.stringify(json_data).split('"daysFromNowMin":').join('"期望交期距今-min(日)":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"daysFromNowMax":').join('"期望交期距今-max(日)":'));
    json_data = JSON.parse(JSON.stringify(json_data).split('"priorityContent":').join('"順位內容":'));
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
      data = JSON.parse(JSON.stringify(data).split('"期望交期距今-min(日)":').join('"daysFromNowMin":'));
      data = JSON.parse(JSON.stringify(data).split('"期望交期距今-max(日)":').join('"daysFromNowMax":'));
      data = JSON.parse(JSON.stringify(data).split('"順位內容":').join('"priorityContent":'));
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
      myObj.ORPService.delallITBORPM033().subscribe(res => {
        if(res === true) {
          console.log("已刪除舊資料!")
          this.getTBORPM033List();
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
      myObj.ORPService.batchsaveTBORPM033(_data).subscribe(res => {
        console.log(res)
        if(res["message"] === "success") {
          console.log("已寫入新資料!")
          this.daysFromNowMin = undefined;
          this.daysFromNowMax = undefined;
          this.priorityContent = undefined;
          this.getTBORPM033List();
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
    this.listOfDisplayData = this.TBORPM033List
    console.log(this.listOfDisplayData)
    this.visible1 = false;
    this.visible2 = false;
    this.visible3 = false;
  }
  // --搜尋 by key
  search(searchValue, searchKey) {
    this.listOfDisplayData = []
    for (let i = 1; i <= this.TBORPM033List.length; i++){
      if (this.TBORPM033List[i-1][searchKey] === searchValue) {
        this.listOfDisplayData.push(this.TBORPM033List[i-1])
      }
    }
    console.log(this.listOfDisplayData)
  }
  // --搜尋各欄位
  searchDaysFromNowMin(searchValue) {this.search(searchValue, "daysFromNowMin"); this.visible1 = false;}
  searchDaysFromNowMax(searchValue) {this.search(searchValue, "daysFromNowMax"); this.visible2 = false;}
  searchPriorityContent(searchValue) {this.search(searchValue, "priorityContent"); this.visible3 = false;}
  
  // 升降冪
  listOfColumn = {
    "daysFromNowMin":
    {
      compare: (a: ItemData1, b: ItemData1) => a.daysFromNowMin - b.daysFromNowMin,
      priority: false
    },
    "daysFromNowMax":
    {
      compare: (a: ItemData1, b: ItemData1) => a.daysFromNowMax - b.daysFromNowMax,
      priority: false
    },
    "priorityContent":
    {
      compare: (a: ItemData1, b: ItemData1) => a.priorityContent.localeCompare(b.priorityContent),
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
    if (this.RawTBORPM033ListLen === this.TBORPM033List.length){
      // 顯示數據初始化
      this.listOfDisplayData = this.TBORPM033List;
      // 取得最後一筆數據ID
      var max_data = this.getMax(this.listOfDisplayData, "tab1ID");
      var max_id: number = +max_data.id;
      var max_tableID = max_data.tab1ID;
      // 新增空列
      var newRow = {
          id: `${max_id + 1}`,
          tab1ID: max_tableID + 1,
          daysFromNowMin: undefined,
          daysFromNowMax: undefined,
          priorityContent: undefined
      }
      // 更新顯示數據
      this.listOfDisplayData = [newRow, ...this.listOfDisplayData];
      // 更新原始數據
      this.TBORPM033List = [newRow, ...this.TBORPM033List];
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

  // 排序功能
    //--更新按鈕鎖定
    updataResetButton() {
        var data_temp = [this.priority1, this.priority2, this.priority3, this.priority4]
        var reset_button_temp = [(<HTMLInputElement>document.getElementById('resetPriority1')), (<HTMLInputElement>document.getElementById('resetPriority2')),
                                (<HTMLInputElement>document.getElementById('resetPriority3')), (<HTMLInputElement>document.getElementById('resetPriority4'))]
        // default
        for (var i=1 ; i <= data_temp.length ; i++) {
            reset_button_temp[i-1].disabled=true;
        }
        // 由後往前數第一個不為空button打開
        for (var i=1 ; i <= data_temp.length ; i++) {
            if (data_temp[(data_temp.length-1)-(i-1)] !== "") {
                reset_button_temp[(data_temp.length-1)-(i-1)].disabled=false;
                break
            }
        }
    }
    //-- 開始彈窗 
    openPriority() {
        let get = document.getElementById('pop1')
        get.style.display = ''
        //更新按鈕鎖定
        this.updataResetButton();
        //紀錄原始數據
        this.priority1_tmp = this.priority1;
        this.priority2_tmp = this.priority2;
        this.priority3_tmp = this.priority3;
        this.priority4_tmp = this.priority4;
        this.radioValue1_tmp = this.radioValue1;
        this.radioValue2_tmp = this.radioValue2;
        this.radioValue3_tmp = this.radioValue3;
        this.radioValue4_tmp = this.radioValue4;
        
    }
    //-- 關閉彈窗
    closePriority(confirm) {
        if (confirm === 1) {
            let get = document.getElementById('pop1')
            get.style.display = 'none'
        }
        else {
            let get = document.getElementById('pop1')
            get.style.display = 'none'
            // 還原成原始數據
            this.priority1 = this.priority1_tmp;
            this.priority2 = this.priority2_tmp;
            this.priority3 = this.priority3_tmp;
            this.priority4 = this.priority4_tmp;
            if (this.priority1 !== ""){
                document.getElementById("menuName1").textContent = this.priority1 + ' V';
            }
            else {
                document.getElementById("menuName1").textContent = '請選擇 V';
            }
            if (this.priority2 !== ""){
                document.getElementById("menuName2").textContent = this.priority2 + ' V';
            }
            else {
                document.getElementById("menuName2").textContent = '請選擇 V';
            }
            if (this.priority3 !== ""){
                document.getElementById("menuName3").textContent = this.priority3 + ' V';
            }
            else {
                document.getElementById("menuName3").textContent = '請選擇 V';
            }
            if (this.priority4 !== ""){
                document.getElementById("menuName4").textContent = this.priority4 + ' V';
            }
            else {
                document.getElementById("menuName4").textContent = '請選擇 V';
            }
            this.radioValue1 = this.radioValue1_tmp;
            this.radioValue2 = this.radioValue2_tmp;
            this.radioValue3 = this.radioValue3_tmp;
            this.radioValue4 = this.radioValue4_tmp;

        }
         
        
    }
    //-- 下拉選單
    selectTab1(value) {
        var priority_tmp = "";
        if (value === 1){
            priority_tmp = "在庫";
        } 
        if (value === 2){
            priority_tmp = "在途";
        }
        if (value === 3){
            priority_tmp = "委外代軋";
        }
        if (value === 4){
            priority_tmp = "採購中";
        }
        if (priority_tmp === this.priority2 || priority_tmp === this.priority3 || priority_tmp === this.priority4) {
            this.errorMSG("選擇失敗", "重複資料!");
        }
        else {
            this.priority1 = priority_tmp;
            // 更改菜單名
            var menuname = document.getElementById("menuName1");
            menuname.textContent = this.priority1 + ' V';
            //更新按鈕鎖定
            this.updataResetButton();
        }

        }
    selectTab2(value) {
        var priority_tmp = "";
        if (this.priority1 !== "") {
            if (value === 1){
                priority_tmp = "在庫";
            } 
            if (value === 2){
                priority_tmp = "在途";
            }
            if (value === 3){
                priority_tmp = "委外代軋";
            }
            if (value === 4){
                priority_tmp = "採購中";
            }
            if (priority_tmp === this.priority1 || priority_tmp === this.priority3 || priority_tmp === this.priority4) {
                this.errorMSG("選擇失敗", "重複資料!");
            }
            else {
                this.priority2 = priority_tmp;
                // 更改菜單名
                var menuname = document.getElementById("menuName2");
                menuname.textContent = this.priority2 + ' V';
                //更新按鈕鎖定
                this.updataResetButton();
            }
            
        }
        else {
            this.errorMSG("選擇失敗", "請先選擇順序一!");
        }
        
        }
    selectTab3(value) {
        var priority_tmp = "";
        if (this.priority1 !== "" && this.priority2 !== "") {
            if (value === 1){
                priority_tmp = "在庫";
            } 
            if (value === 2){
                priority_tmp = "在途";
            }
            if (value === 3){
                priority_tmp = "委外代軋";
            }
            if (value === 4){
                priority_tmp = "採購中";
            }
            if (priority_tmp === this.priority1 || priority_tmp === this.priority2 || priority_tmp === this.priority4) {
                this.errorMSG("選擇失敗", "重複資料!");
            }
            else {
                this.priority3 = priority_tmp;
                // 更改菜單名
                var menuname = document.getElementById("menuName3");
                menuname.textContent = this.priority3 + ' V';
                //更新按鈕鎖定
                this.updataResetButton();
            }
        }
        else {
            this.errorMSG("選擇失敗", "請先選擇順序一、二!");
        }
        }
    selectTab4(value) {
        var priority_tmp = "";
        if (this.priority1 !== "" && this.priority2 !== "" && this.priority3 !== "") {
            if (value === 1){
                priority_tmp = "在庫";
            } 
            if (value === 2){
                priority_tmp = "在途";
            }
            if (value === 3){
                priority_tmp = "委外代軋";
            }
            if (value === 4){
                priority_tmp = "採購中";
            }
            if (priority_tmp === this.priority1 || priority_tmp === this.priority2 || priority_tmp === this.priority3) {
                this.errorMSG("選擇失敗", "重複資料!");
            }
            else {
                this.priority4 = priority_tmp;
                // 更改菜單名
                var menuname = document.getElementById("menuName4");
                menuname.textContent = this.priority4 + ' V';
                //更新按鈕鎖定
                this.updataResetButton();
            }
        }
        else {
            this.errorMSG("選擇失敗", "請先選擇順序一、二、三!");
        }
        }
    //--組成順序
    combinePriority() {
        var combinelist = [this.priority1, this.priority2, this.priority3, this.priority4];
        var radiovaluelist = [this.radioValue1, this.radioValue2, this.radioValue3, this.radioValue4]
        if (this.priority1 !== "" || this.priority2 !== "" || this.priority3 !== "" || this.priority4 !== "") {
            for (var i=1 ; i <= combinelist.length ; i++) {
                if (i === 1) {
                    this.combinepriority = combinelist[i-1] + radiovaluelist[i-1]
                }
                else {
                    if (combinelist[i-1] !== "") {
                        this.combinepriority = this.combinepriority + ',' + combinelist[i-1] + radiovaluelist[i-1]
                    }
                }
                
            }
            // 更新頁面
            document.getElementById("priorityContentId").textContent = this.combinepriority;
            console.log("組成順序:" + this.combinepriority)
            this.closePriority(1);
        }
        else {
            this.errorMSG("設定失敗", "請選擇順序!");
        }
    }
    //--清除
    resetpriority1() {
        this.priority1 = ""
        // 清除菜單名
        var menuname = document.getElementById("menuName1");
        menuname.textContent = "請選擇 V";
        //更新按鈕鎖定
        this.updataResetButton();
    }
    resetpriority2() {
        this.priority2 = ""
        // 清除菜單名
        var menuname = document.getElementById("menuName2");
        menuname.textContent = "請選擇 V";
        //更新按鈕鎖定
        this.updataResetButton();
    }
    resetpriority3() {
        this.priority3 = ""
        // 清除菜單名
        var menuname = document.getElementById("menuName3");
        menuname.textContent = "請選擇 V";
        //更新按鈕鎖定
        this.updataResetButton();
    }
    resetpriority4() {
        this.priority4 = ""
        // 清除菜單名
        var menuname = document.getElementById("menuName4");
        menuname.textContent = "請選擇 V";
        //更新按鈕鎖定
        this.updataResetButton();
    }
    resetpriorityall() {
        this.resetpriority1();
        this.resetpriority2();
        this.resetpriority3();
        this.resetpriority4();
    }
}
