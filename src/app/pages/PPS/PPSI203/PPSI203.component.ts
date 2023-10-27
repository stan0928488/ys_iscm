import { Component, AfterViewInit, NgZone, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import { NzPopoverModule } from 'ng-zorro-antd/popover';

import * as XLSX from 'xlsx';
//import { zh_TW, NzI18nService, NzMessageService, NzModalService, NzGridModule, UploadFile, NzUploadModule, UploadChangeParam } from "ng-zorro-antd";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import {NzGridModule} from "ng-zorro-antd/grid"
import {NzUploadModule} from "ng-zorro-antd/upload"
import { Router } from "@angular/router";
import * as moment from 'moment';
import * as _ from "lodash";

interface ItemData {
  id: string;
  custAbbreviations: string;
  
  gradeGroup: string;
}

@Component({
  selector: 'app-PPSI203',
  templateUrl: './PPSI203.component.html',
  styleUrls: ['./PPSI203.component.css'],
  providers:[NzMessageService]
})
export class PPSI203Component implements AfterViewInit {
  @ViewChild('editRowTable', { static: false }) editRowTable: ElementRef;
  tableHeight: string;  // 用来存储表格高度的变量

  USERNAME;
	loading              = false; //loaging data flag
  LoadingPage          = false;
  isVisibleAdd         = false;
  isVisibleEdit        = false;
  isVisibleExportExcel = false;
  isVisibleImportExcel = false;
  isVisibleUpd         = false;
  isVisibleDtl         = false;
  isErrorMsg           = false;
  clicked              = false;
  EditMode = [];

  time: Date | null = null;

  //----新增區 屬性 宣告begin ----------------------
	idForAdd;                             // ID ForAdd
	dataDeliveryRangeMinForAdd;           // 交付區間最小日期 ForAdd
	dataDeliveryRangeMaxForAdd;           // 交付區間最大日期 ForAdd
	processCodeForAdd;                    // 製程碼 ForAdd
  shopCodeForAdd;                    // 製程碼 ForAdd
	scheTypeForAdd;                       // 抽數別 ForAdd
	ASAPDateForAdd;                       // 最早可投產時間 ForAdd
	custAbbreviationsForAdd;              // 客戶 ForAdd
	gradeGroupForAdd;                     // 鋼鐵種類 ForAdd

  //----新增區 屬性 宣告end ----------------------

  //----修改區 屬性 宣告begin ----------------------
  idForEdit;                            // ID ForEdit
	dataDeliveryRangeMinForEdit;          // 交付區間最小日期 ForEdit
	dataDeliveryRangeMaxForEdit;          // 交付區間最大日期 ForEdit
	processCodeForEdit;                   // 製程碼 ForEdit
  shopCodeForEdit;                   // 製程碼 ForEdit
	scheTypeForEdit;                      // 抽數別 ForEdit
	ASAPDateForEdit;                      // 最早可投產時間 ForEdit
	custAbbreviationsForEdit;             // 客戶 ForEdit
	gradeGroupForEdit;                    // 鋼鐵種類 ForEdit
  isWatchModInEdit  = true;
  isAddModInEdit    = false;
  isUpdateModInEdit = false;
  UpdateModDisabledFlag = true;
  master_Id;
  T19DetailDataListForEdit;
  //----修改區 屬性 宣告end ----------------------
  
  //----產下拉清單及滾表區 屬性 宣告begin ----------------------
  Customer;                // 客戶
  CustomerList;            // 客戶清單
  NewCustomerList;          // 客戶清單 (新增用)
  SteelType;               // 鋼鐵種類
  SteelTypeList;           // 鋼鐵種類清單

  PPSI203DataList;         // ASAP調整查詢出來的資料(for insert,update,delete)
  displayPPSI203DataList;  // ASAP調整查詢出來的資料(for display after query)

  T19DetailDataList;       // ASAP調整副表查詢出來的資料
  //----產下拉清單及滾表區 屬性 宣告end -----------------

  //----查詢區 屬性 宣告begin ----------------------
  searchByDataDeliveryRangeMinValue = '';
  searchByDataDeliveryRangeMaxValue = '';
  searchByProcessCodeValue = '';
  searchByShopCodeValue = '';
  searchByScheTypeValue = '';
  searchByASAPDateValue = '';
  
  visibleByDataDeliveryRangeMinValue = false;
  visibleByDataDeliveryRangeMaxValue = false;
  visibleByProcessCodeValue = false;
  visibleByShopCodeValue = false;
  visibleByScheTypeValue = false;
  visibleByASAPDateValue = false;
  //----查詢區 屬性 宣告end   ----------------------

  PPSI203Display;          // ASAP調整清單(excel)
  titleArray = [
    "交期區間MIN",
    "交期區間MAX",
    "製程碼",
    "站別",
    "抽數別",
    "最早可投產時間",
    "不包含客戶",
    "不包含鋼種類別"
  ];
  month: number;
  datetime = moment(); 
  arrayBuffer:any;
  file:File;
  importdata = [];
  importdata_new;
  importdata_repeat = [];
  inputFileUseInUpload;
  customerTemp : String;
  isERROR = false;
  errorTXT = [];
  isRunFCP = false; // 如為true則不可異動
  newlist;

  fileType: string = '.xls, .xlsx, .csv'; //檔案類型

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  customerChange(value:{}): void {
    
    console.log("customerChange:"+value) ;
  }

  
  customerEdit(value,index){ 
    if(this.T19DetailDataListForEdit[index].custAbbreviations !=null)
      this.customerTemp = this.T19DetailDataListForEdit[index].custAbbreviations;
    console.log("customerChange:"+value) ;
    this.T19DetailDataListForEdit[index].custAbbreviations = value;
  }
  
  steelTypeChange(value:{} ): void {
    console.log("steelTypeChange:"+value) ;
  }

  
  constructor(
    private router: Router,
    private getPPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private _ngZone: NgZone,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private upload : NzUploadModule
  ) { 
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
  }

  ngAfterViewInit() {
    console.log('ngAfterViewChecked');
    // 在视图初始化后，计算表格的高度
    const windowHeight = window.innerHeight;
    const tableHeaderHeight = 55;  // 假设表头高度为50像素
    const pageSize = 1;  // 假设每页显示50条数据
    // 计算表格内容的高度，减去表头和底部分页的高度
    const tableContentHeight = windowHeight - tableHeaderHeight - 32;  // 60是底部分页的高度
    // 计算每行数据的高度
    const rowHeight = tableContentHeight / pageSize;
    // 设置表格高度
    this.tableHeight = `${rowHeight * pageSize}px`;

    console.log("ngAfterViewChecked");
    const time = new Date();
    const children: Array<{ label: string; value: string }> = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }

    this.getCUSTOMERList();
    this.getSTEELTYPEList();
    this.getPPSI203DataList();
    this.getRunFCPCount();
  }
  // ----下拉清單 function begin---------------
  // 取得客戶清單
  getCUSTOMERList() {
    this.loading = true;
    this.LoadingPage = true;
    let myObj = this;
    this.getPPSService.getCustomerList1().subscribe(res => {
      console.log("CustomerList success");
      this.CustomerList = res;
      // console.log(this.CustomerList);

      let newres = [];
      for(let i=0 ; i < this.CustomerList.length ; i++) {
        newres.push(this.CustomerList[i]);
      }
      this.listOfOption = newres;

      myObj.loading = false;
      myObj.LoadingPage = false;
    });
  }
  listOfOption = [];
  listOfCustomerValueForAdd: string[] = [];
  
  // 取得鋼種清單
  getSTEELTYPEList() {
    this.loading = true;
    this.LoadingPage = true;
    let myObj = this;
    this.getPPSService.getSteelTypeList1().subscribe(res => {
      console.log("SteelTypeList success");
      this.SteelTypeList = res;
      // console.log(this.SteelTypeList);

      let newres = [];
      for(let i=0 ; i < this.SteelTypeList.length ; i++) {
        newres.push(this.SteelTypeList[i]);
      }
      this.listOfOption2 = newres;

      myObj.loading = false;
      myObj.LoadingPage = false;
    });
  }
  listOfOption2 = [];
  listOfSteelTypeValueForAdd: string[] = [];
  // ----下拉清單 function end---------------
  ///////////////////////////////////////////////
  // edit function
  statusEditFunc(id,index){
    this.customerTemp = this.T19DetailDataListForEdit[index].custAbbreviations;
    this.T19DetailDataListForEdit[index].editStatus = true ;
  }
  statusCancelEdit( id, index){
    this.T19DetailDataListForEdit[index].custAbbreviations = this.customerTemp;
    this.T19DetailDataListForEdit[index].editStatus = false ;
  }
  statusSaveEdit(index){
    console.log("statusSaveEdit  :" + index);
    
    
    let obj =  {
      id                : this.T19DetailDataListForEdit[index].id,
      M_ID              : this.T19DetailDataListForEdit[index].M_ID,
      custAbbreviations : this.T19DetailDataListForEdit[index].custAbbreviations,
      gradeGroup        : this.T19DetailDataListForEdit[index].gradeGroups.toString(), 
      oldCustAbbreviations : this.customerTemp,
      //T19_ID            : this.T19DetailDataListForEdit[index].T19_ID,
      UPDATE_USER       : this.USERNAME,
      UPDATE_DATE       : moment().format('YYYY-MM-DD HH:mm:ss')
    };


    if(obj.gradeGroup == ''){
      this.errorMSG("修改失敗", "不包含鋼鐵種類不可為空");
      return;
    }
    else if(obj.custAbbreviations == null){
      this.errorMSG("修改失敗", "不包含客戶不可為空");
      return;
    }
    console.log("comit paramete : " + JSON.stringify(obj)) ;
    this.Modal.confirm({
          nzTitle: '是否確定修改',
          nzOnOk: () => {
            this.updateSava(obj)
          },
          nzOnCancel: () =>
            console.log("cancel")
        });
  }
  updateSava(_obj){
    let myObj = this;
      this.LoadingPage = true;
      return new Promise((resolve, reject) => {
        let obj = _obj;
        myObj.getPPSService.update203DetailSave(obj).subscribe(res => {
          if(res[0].MSG === "Y") {

            this.sucessMSG("修改成功", ``);
            this.getT19DetailDataList(this.master_Id);
            this.LoadingPage = false;
            this.switchWactchToupdate();
            this.initialWatch();
          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
          this.switchWactchToupdate();
        })
      });
  }
  /////////////////////////////////////////////////
  // ----滾表 function begin---------------
  //Get table list Data
  getPPSI203DataList() {
    this.LoadingPage = true;

    this.getPPSService.getPPSI203MasterListData().subscribe(res => {
      console.log("getPPSI203MasterListData success");
      this.PPSI203DataList = res;
      this.displayPPSI203DataList = this.PPSI203DataList;
      console.log(this.PPSI203DataList);
      this.LoadingPage = false;
      this.initialWatch();
    });
    
  }

  getT19DetailDataList(_id) {
    this.LoadingPage = true;
    this.master_Id = _id;
    this.T19DetailDataListForEdit=[];
    this.getPPSService.getPPSI203_DetailListData(this.master_Id).subscribe(res => {
      console.log("getT19DetailDataList success");
      this.T19DetailDataList = res;
      console.log(this.T19DetailDataList);
      let editStatus = false ;
      this.NewCustomerList = this.CustomerList;
      for(let i = 0; i<this.T19DetailDataList.length; i++){
        let id                = this.T19DetailDataList[i].id;
        let M_ID              = this.T19DetailDataList[i].M_ID;
        let custAbbreviations = this.T19DetailDataList[i].custAbbreviations;
        let gradeGroup        = this.T19DetailDataList[i].gradeGroup; 
        //let T19_ID            = this.T19DetailDataList[i].T19_ID;
        let gradeGroups       = this.T19DetailDataList[i].gradeGroup.split(',');
        let obj2 = {
          id: id,
          M_ID: M_ID,
          custAbbreviations: custAbbreviations,
          gradeGroup: gradeGroup,
          //T19_ID: T19_ID,
          editStatus: editStatus,
          gradeGroups : gradeGroups
        };
        
        this.NewCustomerList = this.NewCustomerList.filter(item => item != custAbbreviations);
        console.log(obj2);
        this.T19DetailDataListForEdit.push(obj2);
      }

      this.LoadingPage = false;
    });
    
  }
  // ----滾表 function end---------------

  // ----條件查詢 function begin---------------
  searchByDataDeliveryRangeMin(){
    console.log("search click start:" + JSON.stringify(this.PPSI203DataList));
    const filterFunc = item => {
      let dataDeliveryRangeMin = _.get(item, "dataDeliveryRangeMin");
      console.log("dataDeliveryRangeMin:"+dataDeliveryRangeMin);
      if (this.searchByDataDeliveryRangeMinValue == "") {
        return true;
      } else {
        console.log(_.startsWith(dataDeliveryRangeMin, this.searchByDataDeliveryRangeMinValue));
        return _.startsWith(dataDeliveryRangeMin, this.searchByDataDeliveryRangeMinValue);
      }
    };
    const data = this.PPSI203DataList.filter(item => filterFunc(item));
    console.log("search click end:" + JSON.stringify(this.displayPPSI203DataList));

    this.displayPPSI203DataList = data;
  }
  searchByDataDeliveryRangeMax(){
    console.log("search click start:" + JSON.stringify(this.PPSI203DataList));
    const filterFunc = item => {
      let dataDeliveryRangeMax = _.get(item, "dataDeliveryRangeMax");
      console.log("dataDeliveryRangeMax:"+dataDeliveryRangeMax);
      if (this.searchByDataDeliveryRangeMaxValue == "") {
        return true;
      } else {
        console.log(_.startsWith(dataDeliveryRangeMax, this.searchByDataDeliveryRangeMaxValue));
        return _.startsWith(dataDeliveryRangeMax, this.searchByDataDeliveryRangeMaxValue);
      }
    };
    const data = this.PPSI203DataList.filter(item => filterFunc(item));
    console.log("search click end:" + JSON.stringify(this.displayPPSI203DataList));

    this.displayPPSI203DataList = data;
  }
  searchByProcessCode(){
    console.log("search click start:" + JSON.stringify(this.PPSI203DataList));
    const filterFunc = item => {
      let processCode = _.get(item, "processCode");
      console.log("processCode:"+processCode);
      if (this.searchByProcessCodeValue == "") {
        return true;
      } else {
        console.log(_.startsWith(processCode, this.searchByProcessCodeValue));
        return _.startsWith(processCode, this.searchByProcessCodeValue);
      }
    };
    const data = this.PPSI203DataList.filter(item => filterFunc(item));
    console.log("search click end:" + JSON.stringify(this.displayPPSI203DataList));

    this.displayPPSI203DataList = data;
  }

  searchByShopCode(){
    console.log("search click start:" + JSON.stringify(this.PPSI203DataList));
    const filterFunc = item => {
      let shopCode = _.get(item, "shopCode");
      console.log("processCode:"+shopCode);
      if (this.searchByShopCodeValue == "") {
        return true;
      } else {
        console.log(_.startsWith(shopCode, this.searchByShopCodeValue));
        return _.startsWith(shopCode, this.searchByShopCodeValue);
      }
    };
    const data = this.PPSI203DataList.filter(item => filterFunc(item));
    console.log("search click end:" + JSON.stringify(this.displayPPSI203DataList));

    this.displayPPSI203DataList = data;
  }

  searchByScheType(){
    console.log("search click start:" + JSON.stringify(this.PPSI203DataList));
    const filterFunc = item => {
      let scheType = _.get(item, "scheType");
      console.log("scheType:"+scheType);
      if (this.searchByScheTypeValue == "") {
        return true;
      } else {
        console.log(_.startsWith(scheType, this.searchByScheTypeValue));
        return _.startsWith(scheType, this.searchByScheTypeValue);
      }
    };
    const data = this.PPSI203DataList.filter(item => filterFunc(item));
    console.log("search click end:" + JSON.stringify(this.displayPPSI203DataList));

    this.displayPPSI203DataList = data;
  }
  searchByASAPDate(){
    console.log("search click start:" + JSON.stringify(this.PPSI203DataList));
    const filterFunc = item => {
      let ASAPDate = _.get(item, "ASAPDate");
      console.log("ASAPDate:"+ASAPDate);
      if (this.searchByASAPDateValue == "") {
        return true;
      } else {
        console.log(_.startsWith(ASAPDate, this.searchByASAPDateValue));
        return _.startsWith(ASAPDate, this.searchByASAPDateValue);
      }
    };
    const data = this.PPSI203DataList.filter(item => filterFunc(item));
    console.log("search click end:" + JSON.stringify(this.displayPPSI203DataList));

    this.displayPPSI203DataList = data;
  }
  

  resetByDataDeliveryRangeMin(){
    this.searchByDataDeliveryRangeMinValue = '';
    this.searchByDataDeliveryRangeMin();
  }
  resetByDataDeliveryRangeMax(){
    this.searchByDataDeliveryRangeMaxValue = '';
    this.searchByDataDeliveryRangeMax();
  }
  resetByProcessCode(){
    this.searchByProcessCodeValue = '';
    this.searchByProcessCode();
  }
  resetByShopCode(){
    this.searchByProcessCodeValue = '';
    this.searchByShopCode();
  }
  resetByScheType(){
    this.searchByScheTypeValue = '';
    this.searchByScheType();
  }
  resetByASAPDate(){
    this.searchByASAPDateValue = '';
    this.searchByASAPDate();
  }
 
  // ----條件查詢 function end---------------

  // ----新增 function begin---------------
  // 點擊新增按鈕後觸發新增的跳窗
  openAddStrart(){
    this.isVisibleAdd = true;
    // console.log(JSON.stringify(this.CustomerList))
  }

  // 點擊取消按鈕後觸發關閉新增的跳窗
  handleCancel_Add(){
    this.isVisibleAdd               = false;
    this.dataDeliveryRangeMinForAdd = undefined;
    this.dataDeliveryRangeMaxForAdd = undefined;
    this.processCodeForAdd          = undefined;
    this.scheTypeForAdd             = undefined;
    this.ASAPDateForAdd             = undefined;
    this.listOfCustomerValueForAdd  = [];
    this.listOfSteelTypeValueForAdd = [];
  }
  onChange(result: Date[]): void {
    console.log('onChange: ', result);
    console.log(this.dateFormat(this.dataDeliveryRangeMinForAdd,2));
    console.log(this.dateFormat(this.dataDeliveryRangeMaxForAdd,2));
    if(this.dataDeliveryRangeMinForAdd != undefined && this.dataDeliveryRangeMaxForAdd != undefined){
      if(this.dataDeliveryRangeMinForAdd >this.dataDeliveryRangeMaxForAdd){
        console.log('error');
        this.errorMSG("日期錯誤", "交期區間 MAX 不應小於 MIN");
      }
    }
    
  }
  // 點擊確定按鈕後觸發關閉新增的跳窗
  handleOk_Add(){
  
    let myObj = this;
    
    // 新增資料檢核 begin----------------------------------
    let dataDeliveryRangeMinForAdd = this.dateFormat(this.dataDeliveryRangeMinForAdd,2);
    let dataDeliveryRangeMaxForAdd = this.dateFormat(this.dataDeliveryRangeMaxForAdd,2);
    let ASAPDateForAdd             = this.dateFormat(this.ASAPDateForAdd,2);
    
    if(dataDeliveryRangeMinForAdd === ''){
      this.errorMSG("錯誤", "交期區間MIN不可為空");
      return;
    }
    if(dataDeliveryRangeMaxForAdd === '' ){
      this.errorMSG("錯誤", "交期區間MAX不可為空");
      return;
    }
    if(ASAPDateForAdd === '' ){
      this.errorMSG("錯誤", "最早可投產時間不可為空");
      return;
    }
    if(dataDeliveryRangeMinForAdd > dataDeliveryRangeMaxForAdd) {
      this.errorMSG("錯誤", "交期區間MIN不可大於交期區間MAX");
      return;
    } 
    

    let processCodeForAdd       = this.processCodeForAdd;
    let scheTypeForAdd          = this.scheTypeForAdd;
    let custAbbreviationsForAdd = this.listOfCustomerValueForAdd;
    let gradeGroupForAdd        = this.listOfSteelTypeValueForAdd;

    if((processCodeForAdd === '' || processCodeForAdd === undefined)
        && (scheTypeForAdd === '' || scheTypeForAdd=== undefined) 
        && custAbbreviationsForAdd.length === 0 && gradeGroupForAdd.length === 0){
        this.errorMSG("錯誤", "[製程碼][抽數別][不包含客戶][不包含鋼種類別]不可同時為空");
        return;
    }
    if(processCodeForAdd === '' || processCodeForAdd === undefined){
      this.processCodeForAdd = '-';
    }

    if(this.shopCodeForAdd == '' || this.shopCodeForAdd == undefined){
      this.errorMSG("錯誤", "站別 不可為空");
      return;
    }

    if(scheTypeForAdd === '' || scheTypeForAdd === undefined){
      this.scheTypeForAdd = '-';
    }
    if(custAbbreviationsForAdd.length === 0){
      this.listOfCustomerValueForAdd.push('-');
    }
    if(gradeGroupForAdd.length === 0){
      this.listOfSteelTypeValueForAdd.push('-');
    }
    // 新增資料檢核 end-----------------------------------------

    let obj = {
      dataDeliveryRangeMin  :this.dateFormat(this.dataDeliveryRangeMinForAdd,2),
      dataDeliveryRangeMax  :this.dateFormat(this.dataDeliveryRangeMaxForAdd,2),
      processCode           :this.processCodeForAdd,
      scheType              :this.scheTypeForAdd,
      shopCode              :this.shopCodeForAdd,
      ASAPDate              :this.dateFormat(this.ASAPDateForAdd,2),
      custAbbreviations     :this.listOfCustomerValueForAdd,
      gradeGroup            :this.listOfSteelTypeValueForAdd,
      CREATE_USER           :this.USERNAME,
      CREATE_DATE           : moment().format('YYYY-MM-DD HH:mm:ss')
    };

    console.log(obj);
    myObj.getPPSService.addPPSI203Data(obj).subscribe(res => {
      if(res[0].MSG === "Y") {
        
        this.loading = true;
        this.LoadingPage = true;
        let countExistData = res[0].countExistData;
        let insertCount = res[0].insertCount;
        this.sucessMSG("存檔成功", "");
        this.isVisibleAdd = false;
        this.getPPSI203DataList();
        
        this.handleCancel_Add();   
      } else if(res[0].MSG === "N"){
        let countExistData = res[0].countExistData;
        let message = '已有存在「交期區間MIN：'+ obj.dataDeliveryRangeMin +'，交期區間MAX：'+ obj.dataDeliveryRangeMax+'，製程碼：'+ obj.processCode+'，抽數別：'+ obj.scheType+'，最早可投產時間：'+ obj.ASAPDate + '，請進入明細並修改異動。';
        let countExistDatamsg = '<p>'+ message +'</p>';
        this.errorMSG("存檔失敗", countExistDatamsg);
        this.isVisibleAdd = false;
        this.LoadingPage = false;
      }else {
        this.errorMSG("存檔失敗", res[0].MSG);
        this.isVisibleAdd = false;
        this.LoadingPage = false;
      }
    },err => {
      this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
      this.LoadingPage = false;
    })
    this.handleCancel_Add();
  }

  handleDetailEdit_Add(){
  
    let myObj = this;
    
    // 新增明細資料檢核 begin----------------------------------
    if(this.custAbbreviationsForEdit === '' || this.custAbbreviationsForEdit === undefined){
      this.errorMSG("錯誤", "不包含客戶不可為空");
      return;
    }
    let gradeGroup = this.gradeGroupForEdit;
    console.log(this.gradeGroupForEdit);
    if( gradeGroup === undefined){
      this.errorMSG("錯誤", "不包含鋼鐵種類不可為空");
      return;
    }

    let custAbbreviationsForEdit = [];
    custAbbreviationsForEdit.push(this.custAbbreviationsForEdit);
    this.custAbbreviationsForEdit = custAbbreviationsForEdit;

    // 新增資料檢核 end-----------------------------------------

    let obj = {
      dataDeliveryRangeMin  : this.dateFormat(this.dataDeliveryRangeMinForEdit,2),
      dataDeliveryRangeMax  : this.dateFormat(this.dataDeliveryRangeMaxForEdit,2),
      processCode           : this.processCodeForEdit,
      shopCOde              : this.shopCodeForEdit,
      scheType              : this.scheTypeForEdit,
      ASAPDate              : this.dateFormat(this.ASAPDateForEdit,2),
      custAbbreviations     : this.custAbbreviationsForEdit,
      gradeGroup            : this.gradeGroupForEdit,
      CREATE_USER           : this.USERNAME,
      CREATE_DATE           : moment().format('YYYY-MM-DD HH:mm:ss'),
      M_ID                  : this.master_Id
    };

    console.log(obj);
    myObj.getPPSService.addPPSI203DetailData(obj).subscribe(res => {
      if(res[0].MSG === "Y") {
        
        this.loading = true;
        this.LoadingPage = true;
        let countExistData = res[0].countExistData;
        let insertCount = res[0].insertCount;
        
        this.sucessMSG("存檔成功", "");
        
        this.getT19DetailDataList(this.master_Id);
        this.custAbbreviationsForEdit = undefined;
        this.gradeGroupForEdit = [];
         
      } else if(res[0].MSG === "N"){
        let errorMsg = res[0].errorMsg;
        let countExistDatamsg = '<p>'+ errorMsg + '</p>';
        this.errorMSG("存檔失敗", errorMsg);
        this.custAbbreviationsForEdit = undefined;
        this.gradeGroupForEdit = [];
        this.LoadingPage = false;
      }else {
        this.errorMSG("存檔失敗", res[0].MSG);
        this.LoadingPage = false;
      }
      this.switchWactchToAdd();
    },err => {
      this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
      this.LoadingPage = false;
      this.switchWactchToAdd();
    })
    
  }
  // ----新增 function end---------------

  // ----刪除 function begin---------------
  // 刪除單筆資料(主檔及副檔)
  delete_dtlRow(_id) {
    let colsed = false;

    // if(colsed) {
    //   this.errorMSG("錯誤", "尚有資料未完成修改，請先存檔或取消");
    //   return;
    // } else {
      console.log("------delete_dtlRow-------");
      this.loading = true;
      this.LoadingPage = true;
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = _id;
        
        myObj.getPPSService.deletePPSI203Data(_ID).subscribe(res => {
          if(res[0].MSG === "Y") { 
            
            this.getPPSI203DataList();
            this.isVisibleDtl = true;
            this.EditMode[_id] = false;
            this.sucessMSG("刪除成功", "");
          } else {
            this.errorMSG("刪除失敗", res[0].MSG);
            this.LoadingPage = false;
            this.isVisibleDtl = false;
            this.EditMode[_id] = true;           
          }
          this.switchWactchToupdate();
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台存檔錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
          this.switchWactchToupdate();
        })
      });
      
    // }
  }
  // 刪除單筆資料(副檔)
  delete_detailRow(_id,M_ID,custAbbreviations) {
    let colsed = false;

    // if(colsed) {
    //   this.errorMSG("錯誤", "尚有資料未完成修改，請先存檔或取消");
    //   return;
    // } else {

    
    if(this.T19DetailDataList.length ==1){
      this.errorMSG("刪除失敗", "資料剩餘一筆 不可刪除");
      return;
    }

      console.log("------delete_detailRow-------");
      this.loading = true;
      this.LoadingPage = true;
      let myObj = this;
      return new Promise((resolve, reject) => {
        let _ID = _id;
        let _M_ID = M_ID;
        let _cust_abbreviations = custAbbreviations;
        console.log(_ID);
        console.log(_M_ID);
        console.log(_cust_abbreviations);
        myObj.getPPSService.deletePPSI203DetailData(_M_ID,_cust_abbreviations).subscribe(res => {
          if(res[0].MSG === "Y") { 
            
            this.getT19DetailDataList(this.master_Id);
            this.isVisibleDtl = true;
            this.EditMode[_id] = false;
            this.sucessMSG("刪除成功", "");
          } else {
            this.errorMSG("刪除失敗", res[0].MSG);
            this.LoadingPage = false;
            this.isVisibleDtl = false;
            this.EditMode[_id] = true;
          }
          this.switchWactchToupdate();
        },err => {
          reject('upload fail');
          this.errorMSG("刪除失敗", "後台存檔錯誤，請聯繫系統工程師");
          this.LoadingPage = false;
          this.switchWactchToupdate();
        })
      });    
    // }
  }

// ----刪除 function end---------------

// ----匯入匯出 function begin---------------
  //convert to Excel and Download
  convertToExcel() {
    console.log("convertToExcel");
    let _M_ID_List = [];
    let MID_Arr = [];
    for(let i=0; i<this.displayPPSI203DataList.length;i++){
      let tmpId = this.displayPPSI203DataList[i].id;
      MID_Arr.push(tmpId);
    }
    let obj = {M_ID : MID_Arr};
    _M_ID_List.push(obj);
    console.log("_M_ID_List:"+JSON.stringify(MID_Arr));
    // this.getPPSService.getPPSI203ListUseInExportExcel().subscribe(res => {
    this.getPPSService.getPPSI203ListUse_MID_InExportExcel(MID_Arr).subscribe(res => {
      console.log("getPPSI203ListUse_MID_InExportExcel success");
      this.PPSI203Display = res;
      let data = this.formatDataForExcelPPSI203(this.PPSI203Display);
      let fileName = `ASAP調整`;
      this.excelService.exportAsExcelFile(data, fileName, this.titleArray);
      console.log("convertToExcel Done");
    });
  }

  formatDataForExcelPPSI203(_displayData) {
    console.log("_displayData");
    let excelData = [];
    for (let item of _displayData) {
      let obj = {};
      obj = {
        dataDeliveryRangeMin  :this.dateFormat(item.dataDeliveryRangeMin,2),
        dataDeliveryRangeMax  :this.dateFormat(item.dataDeliveryRangeMax,2),
        processCode           :item.processCode,
        shopCode              :item.shopCode,
        scheType              :item.scheType,
        ASAPDate              :this.dateFormat(item.ASAPDate,2),
        custAbbreviations     :item.custAbbreviations,
        gradeGroup            :item.gradeGroup
      };
      excelData.push(obj);
    }
    console.log(excelData);
    return excelData;
  }

  // excel檔名
  incomingfile(event) {
    this.file = event.target.files[0]; 
    console.log("incomingfile e : " + this.file);
    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    }
  }
  
  Upload() {
    
    let getFileNull = this.inputFileUseInUpload;
    if(getFileNull === undefined){
      this.errorMSG('請選擇檔案', '');
      return;
    }

    let lastname = this.file.name.split('.').pop();
    console.log("this.file.name: "+this.file.name);
    console.log("incomingfile e : " + this.file);
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {
      console.log("上傳檔案格式沒有錯誤");
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet:any = workbook.Sheets[first_sheet_name];
        this.importdata = XLSX.utils.sheet_to_json(worksheet, {raw:true});
  
        if(worksheet.A1 === undefined || worksheet.B1 === undefined || 
           worksheet.C1 === undefined  || worksheet.D1 === undefined ||
           worksheet.E1 === undefined || worksheet.F1 === undefined || worksheet.G1 === undefined
           || worksheet.H1 === undefined) {
          this.errorMSG('檔案樣板錯誤', '請先下載當月資料後，再透過該檔案調整上傳。');
          this.clearFile();
          return;
        } else if(worksheet.A1.v !== "交期區間MIN" || worksheet.B1.v !== "交期區間MAX" ||
                  worksheet.C1.v !== "製程碼" || worksheet.D1.v !== "站別" 
                  || worksheet.E1.v !== "抽數別" || worksheet.F1.v !== "最早可投產時間" 
                  || worksheet.G1.v !== "不包含客戶" ||worksheet.H1.v !== "不包含鋼種類別") {
          this.errorMSG('檔案樣板欄位表頭錯誤', '請先下載當月資料後，再透過該檔案調整上傳。');
          this.clearFile();
          return;
        } else {
          console.log("importExcel")
          console.log(this.importdata)
          this.importExcel(this.importdata);
        }
      }
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  // EXCEL 資料上傳
  importExcel(_data) {
    console.log("EXCEL 資料上傳檢核開始");
    for(let i=0 ; i < _data.length ; i++) {
      let dataDeliveryRangeMin  = this.dateFormat(this.ExcelDateExchange(_data[i].交期區間MIN), 2);
      let dataDeliveryRangeMax  = this.dateFormat(this.ExcelDateExchange(_data[i].交期區間MAX), 2);
      let processCode           = _data[i].製程碼;
      let shopCode              = _data[i].站別;
      let scheType              = _data[i].抽數別;
      let ASAPDate              = this.dateFormat(this.ExcelDateExchange(_data[i].最早可投產時間), 2);
      let custAbbreviations     = _data[i].不包含客戶;
      let gradeGroup            = _data[i].不包含鋼種類別;
      let allData               = JSON.stringify(_data[i]);
      // ----匯入excel資料檢核 begin----------------------------
      if (dataDeliveryRangeMin === 'Invalid date') {
        dataDeliveryRangeMin = this.dateFormat(_data[i].交期區間MIN, 2);
      }
      if (dataDeliveryRangeMax === 'Invalid date') {
        dataDeliveryRangeMax = this.dateFormat(_data[i].交期區間MAX, 2);
      }
      if (ASAPDate === 'Invalid date') {
        ASAPDate = this.dateFormat(_data[i].最早可投產時間, 2);
      }
      if(dataDeliveryRangeMin === undefined || dataDeliveryRangeMax === undefined 
        || processCode === undefined || scheType === undefined || ASAPDate === undefined 
        || custAbbreviations === undefined || gradeGroup === undefined) {
        this.errorTXT.push({row: i+2, msg: "有欄位為空值"});
        this.isERROR = true;
      } else if(dataDeliveryRangeMin === 'Invalid date') {
        this.errorTXT.push({row: i+2, msg: "交期區間MIN" + dataDeliveryRangeMin + "時間格式有誤"});
        this.isERROR = true;
      } else if(dataDeliveryRangeMax === 'Invalid date') {
        this.errorTXT.push({row: i+2, msg: "交期區間MAX" + dataDeliveryRangeMax + "時間格式有誤"});
        this.isERROR = true;
      } else if(ASAPDate === 'Invalid date') {
        this.errorTXT.push({row: i+2, msg: "最早可投產時間" + ASAPDate + "時間格式有誤"});
        this.isERROR = true;
      } else if(dataDeliveryRangeMin === '' ) {
        this.errorTXT.push({row: i+2, msg: "交期區間MIN" + dataDeliveryRangeMin + "不可為空"});
        this.isERROR = true;
      } else if(dataDeliveryRangeMax === '') {
        this.errorTXT.push({row: i+2, msg: "交期區間MAX" + dataDeliveryRangeMax + "不可為空"});
        this.isERROR = true;
      } else if(ASAPDate === '') {
        this.errorTXT.push({row: i+2, msg: "最早可投產時間" + ASAPDate + "不可為空"});
        this.isERROR = true;
      } else if(dataDeliveryRangeMin > dataDeliveryRangeMax) {
        this.errorTXT.push({row: i+2, msg: "「交期區間MIN」" + dataDeliveryRangeMin + 
                           "，不可超過「交期區間MAX」" + dataDeliveryRangeMax});
        this.isERROR = true;
      } else if(processCode === ''       && scheType === '' &&
                custAbbreviations === '' && gradeGroup === ''){
        this.errorTXT.push({row: i+2, msg:"[製程碼][抽數別][不包含客戶][不包含鋼種類別]不可同時為空"});
        this.isERROR = true;
      }else if(shopCode === '' || shopCode === undefined){
        this.errorTXT.push({row: i+2, msg:"[站別]不可為空"});
        this.isERROR = true;
      }else if(processCode.length > 8){
        this.errorTXT.push({row: i+2, msg:"[製程碼]字串超過長度"});
        this.isERROR = true;
      }else if(scheType.length > 5){
        this.errorTXT.push({row: i+2, msg:"[抽數別]字串超過長度"});
        this.isERROR = true;
      }else if(custAbbreviations.length > 8){
        this.errorTXT.push({row: i+2, msg:"[不包含客戶]字串超過長度"});
        this.isERROR = true;
      }else if(gradeGroup.length > 8){
        this.errorTXT.push({row: i+2, msg:"[不包含鋼種類別]字串超過長度"});
        this.isERROR = true;
        
      }
      
      if (this.importdata_repeat.includes(allData)){
        this.errorTXT.push({row: i+2, msg:"重複資料"});
        this.isERROR = true;
      }
      else{
        this.importdata_repeat.push(allData);
      }
      // ----匯入excel資料檢核 end----------------------------
    }

    if(this.isERROR) {
      // 匯入錯誤失敗訊息提醒
      console.log("error msg----------------------------------")  
      console.log(this.errorTXT);
      let errorMsg = [];
      errorMsg = this.errorTXT;
      let errorMsgRs = '';
      for(let i = 0;i < errorMsg.length; i++){
        errorMsgRs = errorMsgRs + "<p>第"+ errorMsg[i].row + "筆資料，錯誤："+ errorMsg[i].msg + "。</p>";
      }

      this.clearFile();
      this.isErrorMsg = true;
      this.importdata_new = [];
      // this.errorTXT =  _.chunk(this.errorTXT, 1);    // list 5組 一分群
      this.errorMSG("錯誤", errorMsgRs);
    } else { 
      console.log("沒有匯入錯誤訊息 ")
      this.importdata_new = [];
      // set new data
      for(let i=0 ; i < _data.length ; i++) {
        let dataDeliveryRangeMin  = this.dateFormat(this.ExcelDateExchange(_data[i].交期區間MIN), 2).toString();
        let dataDeliveryRangeMax  = this.dateFormat(this.ExcelDateExchange(_data[i].交期區間MAX), 2).toString();
        let processCode           = _data[i].製程碼.toString();
        let shopCode              = _data[i].站別.toString();
        let scheType              = _data[i].抽數別.toString();
        let ASAPDate              = this.dateFormat(this.ExcelDateExchange(_data[i].最早可投產時間), 2).toString();
        let custAbbreviations     = _data[i].不包含客戶.toString();
        let gradeGroup            = _data[i].不包含鋼種類別.toString();
        let CREATE_USER           = this.USERNAME.toString();
        let CREATE_DATE           = moment().format('YYYY-MM-DD HH:mm:ss').toString();
        console.log("processCode:"+JSON.stringify(processCode));
        if (dataDeliveryRangeMin === 'Invalid date') {
          dataDeliveryRangeMin = this.dateFormat(_data[i].交期區間MIN, 2);
        }
        if (dataDeliveryRangeMax === 'Invalid date') {
          dataDeliveryRangeMax = this.dateFormat(_data[i].交期區間MAX, 2);
        }
        if (ASAPDate === 'Invalid date') {
          ASAPDate = this.dateFormat(_data[i].最早可投產時間, 2);
        }
        
        this.importdata_new.push({dataDeliveryRangeMin: dataDeliveryRangeMin,
                                  dataDeliveryRangeMax: dataDeliveryRangeMax,
                                  processCode: processCode,
                                  shopCode: shopCode,
                                  scheType: scheType,
                                  ASAPDate: ASAPDate,
                                  custAbbreviations: custAbbreviations,
                                  gradeGroup: gradeGroup,
                                  CREATE_USER: CREATE_USER,
                                  CREATE_DATE: CREATE_DATE});
        
      }
      console.log(this.importdata_new);

      return new Promise((resolve, reject) => {
        console.log("匯入開始");
        this.LoadingPage = true;
        let myObj = this;
        let obj = {};
        obj = {
          EXCELDATA:  this.importdata_new 
        };

        console.log("EXCELDATA:"+ obj);
        myObj.getPPSService.importExcelPPSI203(obj).subscribe(res => {
          console.log("importExcelPPSI203");
          if(res[0].MSG === "Y") { 

            this.dataDeliveryRangeMinForAdd = undefined;           // 交付區間最小日期
            this.dataDeliveryRangeMaxForAdd = undefined;           // 交付區間最大日期
            this.processCodeForAdd          = undefined;           // 製程碼
            this.shopCodeForAdd             = undefined;
            this.scheTypeForAdd             = undefined;           // 抽數別
            this.ASAPDateForAdd             = undefined;           // 最早可投產時間
            this.custAbbreviationsForAdd    = undefined;           // 客戶
            this.gradeGroupForAdd           = undefined;           // 鋼鐵種類
            
            this.importdata = [];
            this.importdata_new = [];
            this.importdata_repeat = [];

            this.loading = false;
            this.LoadingPage = false;
            
            this.sucessMSG("EXCCEL上傳成功", "");
            this.clearFile();
            this.getPPSI203DataList()
            
          } else {
            this.errorMSG("匯入錯誤", res[0].MSG);
            this.clearFile();
            this.importdata = [];
            this.importdata_new = [];
            this.loading = false;
            this.LoadingPage = false;
          }
        },err => {
          reject('upload fail');
          this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
          this.importdata_new = [];
          this.importdata_repeat = [];
          this.loading = false;
          this.LoadingPage = false;
        })
      });
      this.getPPSI203DataList();
    }
  }
  
  clearFile() {
    document.getElementsByTagName('input')[0].value = '';

  }

  clearFile2 () {
    var obj = document.getElementById('fileupload');  
    obj.outerHTML = obj.outerHTML;
  }
  // ----匯入匯出 function end---------------

  // ----修改 function begin---------------
  // 修改模式
  openUpdate_dtlRow(i, data) {
    console.log("--------openUpdate_dtlRow-----");
    this.isVisibleEdit = true;

    // set data to input box
    this.idForEdit                   = i;
    this.dataDeliveryRangeMinForEdit = data.dataDeliveryRangeMin;
    this.dataDeliveryRangeMaxForEdit = data.dataDeliveryRangeMax;
    this.processCodeForEdit          = data.processCode;
    this.shopCodeForEdit             = data.shopCode;
    this.scheTypeForEdit             = data.scheType;
    this.ASAPDateForEdit             = data.ASAPDate;

    this.getT19DetailDataList(i);
    // this.custAbbreviationsForEdit    = data.custAbbreviations;
    // this.gradeGroupForEdit           = data.gradeGroup;

  }

  // 在修改跳窗中點擊取消按鈕後觸發關閉修改的跳窗
  handleCancel_Edit(){
    this.isVisibleEdit               = false;
    this.idForEdit                   = undefined;
    this.dataDeliveryRangeMinForEdit = undefined;
    this.dataDeliveryRangeMaxForEdit = undefined;
    this.processCodeForEdit          = undefined;
    this.shopCodeForEdit          = undefined;
    this.scheTypeForEdit             = undefined;
    this.ASAPDateForEdit             = undefined;
    this.custAbbreviationsForEdit    = undefined;
    this.gradeGroupForEdit           = undefined;
    // 選項鈕恢復
    this.isWatchModInEdit = true;
    this.isUpdateModInEdit = false;
    this.UpdateModDisabledFlag = true;
  }
  switchWactchToAdd(){
    
    if(this.isWatchModInEdit == true){
      this.isWatchModInEdit = false;
      this.isAddModInEdit = true;
    }else{
      this.isWatchModInEdit = true;
      this.isAddModInEdit = false;
    }
  }
  initialWatch(){
    console.log('initial button');
    this.isWatchModInEdit = true;
    this.isUpdateModInEdit = false;
    this.UpdateModDisabledFlag = true;

    
  }
  initialEdit(){
    console.log('initial edit');
    for(let i = 0; i<this.T19DetailDataList.length; i++){
      this.T19DetailDataListForEdit[i].editStatus = false;
      this.T19DetailDataListForEdit[i].gradeGroup = this.T19DetailDataListForEdit[i].gradeGroups.toString();
    }
    console.log(this.T19DetailDataListForEdit);
  }
  switchWactchToupdate(){
    console.log('switch to update : ' + this.isWatchModInEdit);
    if(this.isWatchModInEdit == true){
      this.isWatchModInEdit = false;
      this.isUpdateModInEdit = true;
      this.UpdateModDisabledFlag = false;
    }else{
      this.isWatchModInEdit = true;
      this.isUpdateModInEdit = false;
      this.UpdateModDisabledFlag = true;
    }
  }

  // 在修改跳窗中點擊確定按鈕後觸發關閉修改的跳窗
  handleOk_Edit(){
    let myObj = this;

    // -----修改資料檢核 begin----------------------------------------------
    let idForEdit = this.master_Id;
    let dataDeliveryRangeMinForEdit = this.dateFormat(this.dataDeliveryRangeMinForEdit,2);
    let dataDeliveryRangeMaxForEdit = this.dateFormat(this.dataDeliveryRangeMaxForEdit,2);
    let ASAPDateForEdit             = this.dateFormat(this.ASAPDateForEdit,2);

    if(dataDeliveryRangeMinForEdit === ''){
      this.errorMSG("錯誤", "交期區間MIN不可為空");
      return;
    }
    if(dataDeliveryRangeMaxForEdit === '' ){
      this.errorMSG("錯誤", "交期區間MAX不可為空");
      return;
    }
    if(ASAPDateForEdit === '' ){
      this.errorMSG("錯誤", "最早可投產時間不可為空");
      return;
    }
    if(dataDeliveryRangeMinForEdit > dataDeliveryRangeMaxForEdit) {
      this.errorMSG("錯誤", "交期區間MIN不可大於交期區間MAX");
      return;
    }

    let processCodeForEdit       = this.processCodeForEdit;
    let scheTypeForEdit          = this.scheTypeForEdit;
    
    if((processCodeForEdit === ''  || processCodeForEdit === undefined)
        && (scheTypeForEdit === '' || scheTypeForEdit=== undefined)){
        this.errorMSG("錯誤", "[製程碼][抽數別]不可同時為空");
        return;
    }
    if(processCodeForEdit === '' || processCodeForEdit === undefined){
      this.processCodeForEdit = '-';
    }
    if(scheTypeForEdit === '' || scheTypeForEdit === undefined){
      this.scheTypeForEdit = '-';
    }
    if(this.shopCodeForEdit == '' || this.shopCodeForEdit == undefined){
      this.errorMSG("錯誤", "站別不可為空");
        return;
    }
    
    // -----修改資料檢核 end-----------------------------------------

    let obj = {
      id                    :idForEdit,
      dataDeliveryRangeMin  :this.dateFormat(this.dataDeliveryRangeMinForEdit,2),
      dataDeliveryRangeMax  :this.dateFormat(this.dataDeliveryRangeMaxForEdit,2),
      processCode           :this.processCodeForEdit,
      shopCode              :this.shopCodeForEdit,
      scheType              :this.scheTypeForEdit,
      ASAPDate              :this.dateFormat(this.ASAPDateForEdit,2),
      UPDATE_USER           :this.USERNAME,
      UPDATE_DATE           :moment().format('YYYY-MM-DD HH:mm:ss'),
      details               :this.T19DetailDataListForEdit
    };

    console.log(obj);
    myObj.getPPSService.editPPSI203_M_Data(obj).subscribe(res => {
      if(res[0].MSG === "Y") {

        this.loading = true;
        this.LoadingPage = true;

        this.sucessMSG("存檔成功", "");
        this.getPPSI203DataList();
        this.initialEdit();
      } else if(res[0].MSG === "DATAEXIST") {
        this.errorMSG("存檔失敗", "輸入的資料該筆資料在資料庫已存在有相同資料");
        this.LoadingPage = false;
      } else {
        this.errorMSG("存檔失敗", res[0].MSG);
        this.loading = false;
        this.LoadingPage = false;
      }
      this.switchWactchToupdate()
    },err => {
      this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
      this.loading = false;
      this.LoadingPage = false;
      this.switchWactchToupdate()
    })
    
  }
  // ----修改 function end---------------
  // excel 匯入日期格式處理
  ExcelDateExchange(serial) {
    const old = serial - 1;
    const t = Math.round((old - Math.floor(old)) * 24 *60 *60);
    const time = new Date(1900, 0, old, 0, 0, t);
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();

    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
    var fractional_day = serial - Math.floor(serial) + 0.0000001; 
    var total_seconds = Math.floor(86400 * fractional_day); 
    var seconds = total_seconds % 60; 
    total_seconds -= seconds;
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }
  //Date Format
  dateFormat(_dateString, _flag) {  
    if (_dateString == undefined || _dateString == '') {
      return "";
    }
    if (_flag == '1') {
      let date = moment(_dateString, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
      return date;
    } else if (_flag == '2') {
      let date = moment(_dateString, "YYYY-MM-DD").format("YYYY-MM-DD");
      return date;
    } else if (_flag == '3') {
      let date = moment(_dateString, "HH:mm:ss").format("HH:mm:ss");
      return date;
    } else if (_flag == '4') {
      let date = moment(_dateString, "HH:mm").format("HH:mm");
      return date;
    } else if (_flag == '5') {
      let date = moment(_dateString, "MM").format("MM");
      return date;
    }
  }
  sucessMSG(_title, _context): void {
		this.Modal.success({
			nzTitle: _title,
			nzContent: `${_context}`
		});
	}

	errorMSG(_title, _context): void {
		this.Modal.error({
			nzTitle: _title,
			nzContent: `${_context}`
		});
	}

  //關閉錯誤訊息
  ERR_Cancel() {
    this.errorTXT = [];
    this.isErrorMsg = false;
  }

    // 取得是否有正在執行的FCP
    getRunFCPCount() {
      let myObj = this;
      this.getPPSService.getRunFCPCount().subscribe(res => {
        console.log("getRunFCPCount success" + res);
        if(res > 0) this.isRunFCP = true;

        this.isRunFCP = false;
      });
      
    }
}
