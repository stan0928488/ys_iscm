import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
//import { zh_TW, NzI18nService,NzPaginationModule,NzGridModule } from "ng-zorro-antd";
import { zh_TW, NzI18nService } from "ng-zorro-antd/i18n"
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NzMessageService } from "ng-zorro-antd/message";
import { NzPaginationModule } from "ng-zorro-antd/pagination"
import { NzGridModule } from "ng-zorro-antd/grid"
import { ExcelService } from "src/app/services/common/excel.service";
import { NzModalService} from "ng-zorro-antd/modal"
import * as _ from "lodash";
import * as XLSX from 'xlsx';
// import { EventEmitter } from "protractor";
// import { forEach } from "@angular/router/src/utils/collection";
// import { JsonPipe } from "@angular/common";

@Component({
  selector: "app-PPSI201",
  templateUrl: "./PPSI201.component.html",
  styleUrls: ["./PPSI201.component.scss"],
  providers: [NzMessageService]
})
export class PPSI201Component implements AfterViewInit {

  file:File;
  importdata = [];
  postData = {};
  arrayBuffer:any;

  loading = false; //loaging data flag
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  isEditMode: boolean = false; // 編輯模式
  orginList; 	  //原始欄位    {column_comment: "CYCLE_NO", column_name: "CYCLE_NO", column_sort: "ASC"}
  orginListStore; //存儲原始數據
  orginListStoreTmp;
  orginListStoreTemp;
  pickerList = [];   //挑選排序
  settedList
  ShopValue;
  USERNAME;
  values1;
  values2;
  commentList = [];
  isPicker: boolean = false;
  show: boolean = true;
  userName = "";
  saveCheckFg = true;

  //按鈕狀態組
  addBtnFg = true;
  uploadBtnFg = true;

  SHOP_CODEList;           // 站別清單
  SHOP_splitList;          // 站別清單 (分群)
  PickShopCode = [];       // 已挑選站別
  EQUIP_CODEList;          // 機台別清單
  EQUIP_splitList = [];         // 機台別清單 (分群)
  PickEquipCode = [];      // 已挑選機台別
  PickEquipCodeList = [];  //已選擇幾台
  shopCodeAndEquipCodeList = []; //已選擇站台幾台數據重組

  //編輯時使用
  editId = 0;

  //分页使用
  pageNum: number = 1;
  totalPage: number = 0;
  pageSize: number = 15;
  totalCount: number = 0;
  setData;

  comitCNStr = "";
  comitENStr = "";
  queryShopAndCode = [];


  todo = [
    { value: 'I can be dragged', disabled: true },
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep',
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  done = [
  ];


  constructor(
    private excelService: ExcelService,
    private getPPSService: PPSService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private cookieService: CookieService,
    private message: NzMessageService,
    private page: NzPaginationModule,
    private nzGridModule: NzGridModule,
    private Modal: NzModalService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");


  }

  ngAfterViewInit() {
    this.userName = this.cookieService.getCookie("USERNAME");
    console.log("ngAfterViewChecked");
    this.getOrignListData();
    this.getSHOP_CODEList();
    this.getSetShopEQUIP();
    this.getRunFCPCount();
  }


  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.getPPSService.getRunFCPCount().subscribe(res => {
      console.log("getRunFCPCount success");
      if (res > 0) this.isRunFCP = true;

    });
  }


  initSelectData() {
    //
  }
  //挑选类型 {"column_comment":"投入尺寸","column_name":"INPUT_DIA","column_sort":"ASC"}
  //{"sorting_CN":"EPST↑, 投入尺寸↓, 產出尺寸↑, 交期↑","date_CREATE":"2022-07-26 09:43:01.0","sorting_SEQ":"65","date_UPDATE":null,"user_CREATE":"UR10369","user_UPDATE":null,"sch_SHOP_CODE":"451","machine":null,"sorting_EN":"EPST, INPUT_DIA desc, OUT_DIA, DATE_PLAN_IN_STORAGE"}
  editFunc(item: any) {
    console.log("編輯事件：" + JSON.stringify(item));
    /***处理数据库字串转drag */
    let sortCN = item.sorting_CN;
    let sortEn = item.sorting_EN;
    let pickTemp = [];
    let sortCNArray = sortCN.split(",");
    let sortENArray = sortEn.split(",")
    if (sortCNArray.length === sortENArray.length) {
      this.editId = item.sorting_SEQ;
      let arrayTep = []
      sortCNArray.forEach((value, index, array) => {
        let sortStrLast = value[value.length - 1];
        let sortType = "ASC";
        if (sortStrLast === "↓") sortType = "DESC"
        let sortStr = value.substr(0, value.length - 1);
        let sortEnTemp = sortENArray[index];
        if (sortEnTemp.indexOf("desc") > -1) {
          let sortEnLast = sortEnTemp.substr((sortEnTemp.length - 5), 5)
          sortEnTemp = sortEnTemp.substr(0, (sortEnTemp.length - 5))
        } else {
          console.log(index + "英文不需要排序字串：" + sortEnTemp);
        }
        sortStr = sortStr.trim();
        sortEnTemp = sortEnTemp.trim();
        let tempObj = { "column_comment": sortStr, "column_name": sortEnTemp, "column_sort": sortType };
        arrayTep.push(tempObj);
      });
      /**重新绑定挑选数据 */
      this.pickerList = arrayTep;
      /**过滤原始数据 */
      this.initOrigiData(arrayTep);
    }
  }

  deleteFunc(item: any) {
    const data = { editId: "" };
    let myObj = this;
    data.editId = item.sorting_SEQ;

    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        myObj.getPPSService.deleteSortData(data).subscribe(res => {
          console.log("comitData :" + res)
          let result: any = res;
          if (result.code === 1) {
            this.message.info(result.message);
            this.getSetShopEQUIP();
          } else {
            this.message.error(result.message);
          }
        }, err => {
          this.message.error('delete fail');
        })
      },
      nzOnCancel: () => {
      },
    });

  }

  initOrigiData(arrayTep: any) {
    console.log("需要过滤的数据: " + JSON.stringify(arrayTep));
    let initTodo = [];
    for (let item of this.orginListStore) {
      let containFg = false;
      for (let editItem of arrayTep) {
        if (item.column_comment === editItem.column_comment) {
          // console.log(" 找到 item.column_comment === editItem.column_comment: " + item.column_comment +"===" + editItem.column_comment) ;
          containFg = true;
        }
      }
      if (!containFg) {
        initTodo.push(item)
      }
    }
    this.orginList = initTodo;
  }


  // 點擊站別控制項
  clickShopCode(_value) {
    console.log("clickShopCode ")
    this.PickShopCode = _value.toString().split(',');
    this.getEQUIP_CODEList(this.PickShopCode);
    this.queryData();
  }
  /*
  clickShopCode(_value) {
    console.log("clickShopCode ")
    var findarr = [];
    if(this.PickShopCode.length > 0) {
      findarr = [...this.PickShopCode];
      if(findarr.indexOf(_value) >= 0) {
        var filterValue = findarr.filter(function(item, index, array) {
          return item !== _value;       // 取得相同站別
        });
        this.PickShopCode = [...filterValue];
  
        if(this.PickEquipCode.length > 0) {
          var filter = this.PickEquipCode.filter(item => item.SHOP_CODE !== _value);
          this.PickEquipCode = [...filter];
        }
      } else {
        this.PickShopCode.push(_value);
      }
    } else {
      this.PickShopCode.push(_value);
    }
    this.getEQUIP_CODEList(this.PickShopCode);
    this.queryData() ;
  }
  */
  // 點擊機台別控制項
  clickEquipCode(_value) {
    console.log("机台：" + _value.toString())
    var pickEquipCodeTemp = _value.toString().split(',');
    this.PickEquipCode = [];
    for (let itemTemp of pickEquipCodeTemp) {
      this.EQUIP_splitList.forEach((item1, index, arry) => {
        item1.forEach((item2, index, arry) => {
          if (item2.value === itemTemp) {
            item2.checked = true
            this.PickEquipCode.push(item2);
            console.log("选择机台数据 :" + JSON.stringify(this.PickEquipCode))
          }
        })
      })
    }
    this.queryData();
  }
  /*
  clickEquipCode(_value) {
   console.log("clickEquipCode :" + JSON.stringify(_value))
   var findarr = [];
   if(this.PickEquipCode.length > 0) {
     findarr = [...this.PickEquipCode];
     //console.log("this.PickEquipCode ：" + JSON.stringify(this.PickEquipCode))
     //console.log("findarr [...this.PickEquipCode] ：" + JSON.stringify(findarr))
 
     if (_value.checked) {
       if(findarr.indexOf(_value) >= 0) {    // 檢查是否有資料
           var filterValue = findarr.filter(function(item, index, array) {
             console.log("item filter "+ JSON.stringify(item))
             console.log("_value filter "+ JSON.stringify(_value))
             return item.value !== _value;       // 取得相同機台別
           });
           this.PickEquipCode = [...filterValue];
       } else {
         this.PickEquipCode.push(_value);
       }
     } else {
       this.PickEquipCode.splice(this.PickEquipCode.findIndex(item => item.value === _value.value), 1);
     }
   } else {
     this.PickEquipCode.push(_value);
   }
  this.queryData() ;
 }
 */


  //获取站别
  getSHOP_CODEList() {
    this.loading = true;
    this.LoadingPage = true;
    let myObj = this;
    this.getPPSService.getPickerShopEQUIPNEW('1', '　').subscribe(res => {
      console.log("SHOP_CODEList success");
      this.SHOP_CODEList = res;
      console.log("this.SHOP_CODEList :" + JSON.stringify(this.SHOP_CODEList));

      var newres = [];
      for (let i = 0; i < this.SHOP_CODEList.length; i++) {
        newres.push(this.SHOP_CODEList[i].SHOP_CODE);
      }
      this.SHOP_splitList = _.chunk(newres, 13);    // list 13組 一分群
      console.log("this.SHOP_CODEList chunk  :" + JSON.stringify(this.SHOP_splitList));
      myObj.loading = false;
      myObj.LoadingPage = false;
    });
  }

  changePage(event: any) {
    console.log(" changePage event :" + event)
    this.pageNum = event;
    this.getSetShopEQUIP();
  }
  //获取已设定数据
  getSetShopEQUIP() {
    this.loading = true;
    this.LoadingPage = true;
    let myObj = this;
    let comitParamete = { pageNum: this.pageNum, pageSize: this.pageSize, queryKey: this.queryShopAndCode.toString() };
    //this.getPPSService.getSetShopEQUIP(this.pageNum, this.pageSize,this.queryShopAndCode.toString()).subscribe(res => {
    console.log("查詢數據:" + JSON.stringify(comitParamete));
    myObj.getPPSService.getSetShopEQUIP(comitParamete).subscribe(res => {
      console.log("获取已设定数据 success");
      console.log("获取已设定数据 :" + JSON.stringify(res));
      let result: any = res;
      if (result.code === 1) {
        this.setData = result.data;
        this.pageNum = result.pageNum;
        this.totalPage = result.totalPage;
        this.totalCount = result.totalCount;
      } else {
        this.setData = [];
        this.pageNum = 1;
        this.totalPage = 0;
        this.totalCount = 0;
      }

      myObj.loading = false;
      myObj.LoadingPage = false;
    });
  }
  //获取機台
  getEQUIP_CODEList(_ShopArr) {
    if (_ShopArr.toString() !== "") {
      this.loading = true;
      this.LoadingPage = true;
      let myObj = this;
      this.getPPSService.getPickerShopEQUIPNEW('2', _ShopArr.toString()).subscribe(res => {
        console.log("EQUIP_CODEList success");
        this.EQUIP_CODEList = res;
        console.log("幾台數據網絡獲取EQUIP_CODEList：" + JSON.stringify(this.EQUIP_CODEList));
        var newres = [];
        for (let i = 0; i < this.EQUIP_CODEList.length; i++) {
          newres.push({ value: this.EQUIP_CODEList[i].EQUIP_CODE, checked: false, shopCode: this.EQUIP_CODEList[i].SHOP_CODE });
        }
        if (this.PickEquipCode.length > 0) {
          for (let j = 0; j < newres.length; j++) {    // 判斷目前機台及已挑選機台
            for (let k = 0; k < this.PickEquipCode.length; k++) {
              if (newres[j].value === this.PickEquipCode[k].value) {
                newres[j].checked = true;
              }
            }
          }
          this.EQUIP_splitList = _.chunk(newres, 13);    // list 13組 一分群
        } else {
          this.EQUIP_splitList = _.chunk(newres, 13);    // list 13組 一分群
        }
        myObj.loading = false;
        myObj.LoadingPage = false;
      });
    } else {
      this.EQUIP_splitList = [];
    }

    console.log("幾台展示數據EQUIP_splitList" + JSON.stringify(this.EQUIP_splitList))
  }
  //Get Data
  getOrignListData() {
    this.loading = true;
    console.log("getOrignListData...");

    let myObj = this;
    this.getPPSService.getOrignListData().subscribe(res => {
      console.log("getOrignListData success");
      this.orginList = res;
      console.log(res);
      this.orginListCopy();  //將原始數據複製出來,以供編輯數據使用
      // for(let i=0; i < this.orginList.length; i++) {
      //   // const comment = {value: this.orginList[i].column_comment, value2: this.orginList[i].column_name, disabled: true}
      //   const comment = this.orginList[i].column_comment;
      //   this.commentList.push(comment);
      // }
      // console.log("...............");
      // console.log(this.commentList[0].value)
      // console.log("...............");
      myObj.loading = false;
    });
  }

  editListBtn(item: any) {
    this.editId = item.groupId;
    console.log("editId:" + this.editId)
    console.log("item groupList : " + JSON.stringify(item.groupList));
    //this.done = item.groupList ;
    this.initDoneData(item.groupList)
    this.initTodoData(item.groupList)
  }

  initTodoData(groupList: any) {
    let initTodo = [];
    for (let item of this.orginListStore) {
      let containFg = false;
      for (let editItem of groupList) {
        if (item.column_name === editItem.column_name) {
          containFg = true;
        }
      }
      if (!containFg) initTodo.push(item)
    }
    this.orginList = initTodo;
  }
  //编辑时重置Done数据
  initDoneData(groupList: any) {
    //重置为空
    this.done = [];
    for (let list of groupList) {
      this.done.push(list)
    }
  }

  orginListCopy() {
    this.orginListStore = [];
    this.orginListStoreTemp = [];
    for (let item of this.orginList) {
      this.orginListStore.push(item);
      this.orginListStoreTemp.push(item);
    }
  }


  drop(event: CdkDragDrop<string[]>, dragForm: number) {
    if (event.previousContainer === event.container) {
      //当前位置
      if (dragForm === 1) {
        return;
      }
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      //第一位只能是
      if (!this.checkFistRow(event.previousIndex)) {
        this.message.error("第一位只能是「FCP下站順位」");
        return;
      }
      if (!this.checkEPSTOrLPSTExist(event.previousIndex)) {
        this.message.error("PST 、 EPST 或者 LPST 每組排序只能存在其一");
        return;
      }

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      // console.log("----------transferArrayItem-------------")
      // // console.log(event)
      // console.log(event.previousContainer.data)
      // console.log(event.container.data)
      // console.log(event.previousIndex)
      // console.log(event.currentIndex)
      // console.log("----------END-------------")
    }
  }

  // console.log(this.ShopValue)
  //判斷挑選首位是否是 FROZAN_GROUP
  checkFistRow(index: number) {
    console.log("首位index" + index)
    if (this.pickerList.length == 0) {  //如果挑選為空，則校驗
      if (this.orginList[index].column_name === "FROZAN_GROUP") {
        return true
      } else {
        return false;
      }

    } else { //如果不是首位。判斷當前值是否為 FROZAN_GROUP
      return true;
    }
  }

  //校驗當前列已存在
  //wen 04/26 1018-先拿掉LPST 檢誤
  checkEPSTOrLPSTExist(index: number) {
    if (this.orginList[index].column_comment === "EPST" || this.orginList[index].column_comment === "PST") {
      //校驗已存在列表是否包含
      for (let item of this.pickerList) {
        if (item.column_comment === "EPST" || item.column_comment === "PST") {
          return false
        }
      }
      return true
    } else {
      return true;
    }
  }

  checkPreSave() {
    this.saveCheckFg = true;
    //校验站别
    if (this.PickShopCode.length === 0 && this.editId === 0) {
      this.message.error("站別必須選擇！");
      this.saveCheckFg = false;
    }
    // 1.首位必須是 EPST  LPST
    if (this.pickerList.length === 0) {
      this.message.error("挑選排序不能為空！");
      this.saveCheckFg = false;
    }
    this.pickerList.forEach((value, index, array) => {
      console.log("val" + JSON.stringify(value))
      console.log("index" + index)
      /*
      if( (index === 0 || index === 1 || index === 2) && (value.column_comment !=="EPST" && value.column_comment !=="LPST" && value.column_name !== "SORT_GROUP" && value.column_name !== "FROZAN_GROUP")) {
        this.message.error(" 前三位只能是 EPST/LPST、SORT群組或FCP下站順位，請您調整");
        this.saveCheckFg = false ;
      }
      */
      if (index === 0 && value.column_name !== "FROZAN_GROUP") {
        this.message.error("FCP下站順位必須在第一位,請您調整");
        this.saveCheckFg = false;
      }

      /** TODO  先拿掉，後面再補
      else if(index === 1 && value.column_name !== "SORT_GROUP") {
        this.message.error("SORT群組必須在第二位,請您調整");
        this.saveCheckFg = false ;
      } 
      */
      /** TODO  先拿掉，後面再補
      else if(index === 2 && (value.column_comment !=="PST" && value.column_comment !=="EPST" && value.column_comment !=="LPST" ) ) {
        this.message.error("PST、EPST 或者 LPST 必須在第三位，請您調整");
        this.saveCheckFg = false ;
      }
       */
    })

  }

  //新增
  onAddSunmit() {
    //重置drag1数据
    this.orginList = this.orginListStore;
    this.orginList = [...this.orginListStoreTemp];
    this.pickerList = [];
    this.editId = 0;
    //重置drag2数据
  }
  //存檔
  onSunmit() {
    this.checkPreSave();
    if (!this.saveCheckFg) {
      return;
    }

    //console.log("原始組別 orginList :"+JSON.stringify(this.orginList))
    //console.log("挑選組  pickerList :"+JSON.stringify(this.pickerList))
    //console.log("站別 PickShopCode : "+JSON.stringify(this.PickShopCode)) ; //站台
    //console.log("幾台選擇 PickEquipCode: "+JSON.stringify(this.PickEquipCode)) ; //幾台
    //console.log("幾台全部 this.EQUIP_splitList :" + JSON.stringify(this.EQUIP_splitList))  //幾台
    //重组站台跟機台數據
    this.formatEQUIPPickList();
    this.formatPickSortData();
    console.log("最後重組站別幾台數據： " + JSON.stringify(this.shopCodeAndEquipCodeList))
    if (this.editId === 0) {
      //this.message.info("當前操作是新增");
      this.comitData();
    } else {
      //this.message.info("當前操作是修改");
      this.comitUpdateData();
    }
  }

  queryData() {
    this.pageNum = 1;
    this.formateQuery();
    console.log("挑選數組 : " + this.queryShopAndCode.toString());
    this.getSetShopEQUIP();
  }

  comitData() {
    let myObj = this;
    let comitParamete = { shopAndCode: this.shopCodeAndEquipCodeList, cnStr: this.comitCNStr, enStr: this.comitENStr, user: this.userName };
    console.log("新增最後提交後台數據： " + JSON.stringify(comitParamete));
    myObj.getPPSService.saveSortData(comitParamete).subscribe(res => {
      console.log("comitData :" + res)
      let result: any = res;
      if (result.code === 1) {
        this.message.info(result.message);
        //this.getSetShopEQUIP() ;
        this.queryData();
      } else {
        this.message.error(result.message);
      }

    }, err => {
      this.message.error('upload fail');
    })
    //this.getPPSService.saveSortData(comitParamete);
  }

  comitUpdateData() {
    let myObj = this;
    let comitParamete = { editId: this.editId, cnStr: this.comitCNStr, enStr: this.comitENStr, user: this.userName };
    console.log("修改最後提交後台數據： " + JSON.stringify(comitParamete));
    myObj.getPPSService.editSortData(comitParamete).subscribe(res => {
      console.log("comitData :" + res)
      let result: any = res;
      if (result.code === 1) {
        this.message.info(result.message);
        this.getSetShopEQUIP();
      } else {
        this.message.error(result.message);
      }
    }, err => {
      this.message.error('upload fail');
    })
  }


  formatPickSortData() {
    let pickListTemp = this.pickerList
    let cnString = "";
    let enString = "";
    for (let item of pickListTemp) {
      if (item.column_sort === "ASC") {
        cnString += item.column_comment + "↑,"
        enString += item.column_name + ","
      } else if (item.column_sort === "DESC") {
        cnString += item.column_comment + "↓,"
        enString += item.column_name + " desc,"
      }
    }
    cnString = cnString.substring(0, cnString.length - 1);
    enString = enString.substring(0, enString.length - 1);
    this.comitCNStr = cnString;
    this.comitENStr = enString;
  }
  //處理幾台選擇
  //希望提交的數據 {站別： '',幾台 : '' , sortData : [{}]}
  formatEQUIPPickList() {
    this.PickEquipCodeList = [];
    for (let item of this.EQUIP_splitList) {
      for (let i of item) {
        if (i.checked) this.PickEquipCodeList.push(i)
      }
    }
    //console.log("選擇組：" + JSON.stringify(this.PickEquipCodeList) ) ;
    this.formatPickShopCode();
  }

  formateQuery() {
    let equipCodeListTemp = []; //機台選擇
    for (let item of this.EQUIP_splitList) {
      for (let i of item) {
        if (i.checked) equipCodeListTemp.push(i.value);
      }
    }
    let shopCodeTemp = this.PickShopCode; //站別挑選
    let shopCodeAndEquipCodeTemp = equipCodeListTemp.concat(this.PickShopCode);
    this.queryShopAndCode = shopCodeAndEquipCodeTemp;

  }

  //處理站別選擇
  formatPickShopCode() {
    this.shopCodeAndEquipCodeList = [];
    let shopAndEquip = [];
    let shopCodeTemp = this.PickShopCode;
    let pickEquipCodeListTemp = this.PickEquipCodeList;
    shopCodeTemp.forEach((val, index, array) => {
      let containFg = false;
      for (let i of pickEquipCodeListTemp) {
        if (index === 0) {
          shopAndEquip.push({ shopCode: i.shopCode, equipCode: i.value });
        }
        if (val === i.shopCode) {
          console.log("val === i.shopCode : " + val)
          containFg = true;
        }
      }
      if (!containFg) shopAndEquip.push({ shopCode: val, equipCode: '' });
    })
    //console.log("最後重組站別幾台數據： " + JSON.stringify(shopAndEquip))
    this.shopCodeAndEquipCodeList = shopAndEquip;
  }

  clickObj: any = {};
  clickCurrentFunc(index: number, item: any) {
    console.log(JSON.stringify(item))
    if (Object.keys(item).length === 0) {
      console.log("当前对象没有值")
      return
    }
    this.clickObj = item;
    let flag = "ASC";
    switch (item.column_sort) {
      case "ASC": flag = "DESC"; break;
      case "DESC": flag = "ASC"; break;
      default: flag = "ASC"; break;
    }
    this.clickObj.column_sort = flag;
    this.pickerList[index] = this.clickObj;
    console.log("this.pickerList" + JSON.stringify(this.pickerList));

  }
  uploadBtnCheck() {
    return true;
  }

  // 測試方法
  pickBtnFun() {
    console.log("PickShopCode : " + JSON.stringify(this.PickShopCode));
    console.log("PickEquipCode: " + JSON.stringify(this.PickEquipCode));
    console.log("this.EQUIP_splitList :" + JSON.stringify(this.EQUIP_splitList))


  }

  exportExcel() {

    let myObj = this;
    let exportData = [];
    let comitParamete = { pageNum: 1, pageSize: 1000, queryKey: this.queryShopAndCode.toString() };
    console.log("excel匯出查詢數據:" + JSON.stringify(comitParamete));
    myObj.getPPSService.getSetShopEQUIP(comitParamete).subscribe(res => {
      let result: any = res;
      if (result.code === 1) {

        for (var i = 0; i <= result.data.length; i++) {
          var element = result.data[i];
          if (element) {
            var obj =
            {
              "key不可異動": (element['sorting_SEQ'] ? Number(element['sorting_SEQ']) : null),
              "站別": (element['sch_SHOP_CODE'] ? element['sch_SHOP_CODE'] : null),
              "機台": (element['machine'] ? element['machine'] : null),
              "排序": (element['sorting_CN'] ? element['sorting_CN'] : null)
            }
            exportData.push(obj);
          }
        }

        exportData = exportData.sort((a, b) => {
          if (a['key不可異動'] < b['key不可異動']) {
            return -1;
          }
        });

        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, '站別機台優先順序表')
        XLSX.writeFile(wb, ExcelService.toExportFileName("站別機台優先順序表"));

      }

    });

  }

  uploadExcel() {

    if(this.file === null || this.file === undefined) {
      this.message.error("請先上傳檔案")
      return
    }

    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx') {
      this.message.error('檔案格式錯誤 僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {
      console.log("上傳檔案格式沒有錯誤");
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet: any = workbook.Sheets[first_sheet_name];
        this.importdata = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        this.postData = {
          excelData:this.importdata,
          userName:this.userName
        }
        return new Promise((resolve, reject) => {

          var myObj = this;
          console.log("匯入開始");
          myObj.getPPSService.importppsfcptb13TablExcel(this.postData).subscribe(res => {
            var ress:any = res;
            if(ress.code === "Y") { 
              this.message.info("EXCCEL上傳成功");
              this.clearFile();
            } else {
              this.message.error("匯入錯誤<br>"+ress.MSG);
              this.clearFile();
            }
          },err => {
            console.log(err);
            this.message.error("後台存檔錯誤，請聯繫系統工程師");
            this.clearFile();
          })

        });

      }
      fileReader.readAsArrayBuffer(this.file);
    }

  }

  incomingfile(event) {
    this.file = event.target.files[0]; 
    console.log("incomingfile e : " + this.file);
    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx') {
      this.message.error('檔案格式錯誤 僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    }
  }

  clearFile() {
    this.file = null;
  }

}
