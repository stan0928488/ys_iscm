import { Component, OnInit, TemplateRef  } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
//import { zh_TW, NzI18nService,NzInputModule,NzTimePickerModule,NzDatePickerModule,NzSelectModule , NzMessageService ,NzSpinModule , NzModalRef, NzModalService } from "ng-zorro-antd";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService,NzModalRef} from "ng-zorro-antd/modal"
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
import * as moment from 'moment';
import { PPSService } from "src/app/services/PPS/PPS.service";
import { ExcelService } from "src/app/services/common/excel.service";
import * as _ from "lodash";
@Component({
  selector: 'app-PPSR302',
  templateUrl: './PPSR302.component.html',
  styleUrls: ['./PPSR302.component.scss'],
  providers:[NzMessageService,NzModalService,DatePipe]
})
export class PPSR302Component implements OnInit {
// 测试提交
  constructor(
    private nzInputModule:NzInputModule ,
    private  NzTimePickerModule:NzTimePickerModule,
    private  nzDatePickerModule:NzDatePickerModule,
    private datePipe : DatePipe,
    private getPPSService: PPSService,
    private excelService: ExcelService,
    private message:NzMessageService ,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.specialBarDisable = true;
    this.getVerList();
    this.getAreaGroup();
    this.getWeekData();
  }
  //补充定义
  tplModalButtonLoading = false
  now :Date = new Date() ;
  isVisibleBiWeekWip = false;
  headerFirst = [] ; //第一栏位  延迟订单
  tableHeaderList = [] ;  //头部内容
  tableHeaderLastList = [] ; //最后栏位 TOTAL
  tableSplitData = [] ;  //日期分割部分
  radioPointValue = 'A' ; //ASAP选择
  areaGroup = [];
  selectedVer = {label:'',value:'',pointStatus:''}; //版本选择
  listOfOption = [] ; //版本号选择
  splitnumm = 0 ;
  monLength = 4 ;
  loaded = false ; //计算完毕
  firstModalLoading = false;
  delayModalLoading = false;
  modalDataExportList = [] ; //导出数据
  modalDelayDataExportList = [] ; //导出数据

  secondModal:NzModalRef ; //第二层Modal
  secondModalData = [] ; //第二层页面显示数据
  secondModalExportList = [] ;//第二层导出数据
  secondModalButtonLoading = false ; //第二层导出数据按钮状态
  secondModalLoading = false ; //第二层loading状态
  secondModalTableHeader = [
    {label:'MO'},
    {label:'總重(噸)'},
    {label:'執行'}
   ];

   secondModalTableHeaderExport = [
    {label:'MO'},
    {label:'總重(噸)'}
   ];

   secondModalTableHeaderLast = [] ;
  optionList = [
    { label: '星期日', value: 6},
    { label: '星期一', value: 0},
    { label: '星期二', value: 1},
    { label: '星期三', value: 2},
    { label: '星期四', value: 3},
    { label: '星期五', value: 4},
    { label: '星期六', value: 5},
    ];

  selectedValue = { label: '星期一', value: 0 };
  radioSelectValue = 'M' ; //初始化按月
  tbodyList ;
  tableTotalCell ;//计算各列小计
  tableOrderTotalCell ; //訂單總計
  /**Modal显示 */
  isModalVisible = false ; //第一层显示
  firstModal : NzModalRef ;
  firstModalTitle = "訂單詳情" ; //第一层表头
  isDelayModalVisible = false ; //延期訂單Modal顯示
  delayModalTitleName = "遞延訂單詳情" ; //延期訂單詳情
  delayModal : NzModalRef ;
  firstModalTableHeaderList = [
    {label:'序號'},
    {label:'訂單編號'},
    {label:'訂單交期'},
    {label:'允收截止日'},
    {label:'客戶名稱'},
    {label:'鋼種'},
    {label:'尺寸'},
    {label:'尚未入庫量(噸)'},
    {label:'MAX 計畫入庫日'},
    {label:'預計入庫量(噸)'},
  ] ;

  totalWeight = 0 ;
  totalCount = 0 ;
  firstModalTableAppendList = [] ;
  firstModalListOfData = [] ; //
  testLength = [1,2,3,4,5,6,7,8,9,10]
  firstModalData = [] ;

  searchData = {
    kindType:"",
    specialBar:"",
    saleAreaGroup:""
  }

  firstSearchParamete = {
    fcpVer: this.selectedVer.value,
    pointStatus:this.selectedVer.pointStatus,
    tableHeader:{},
    tableLeft:{},
    custAbbreviations:"",
    saleOrder:"",
    searchData:this.searchData
  }
  specialBarDisable:boolean;



  // tslint:disable-next-line:no-any
  compareFn1 = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);
  compareFn2 = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);
  compareFn3 = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);
  log(value: { label: string; value: string }): void {
    //console.log(value);
    //console.log("选择：" + JSON.stringify(this.selectedValue))
    //this.splitSevenDate(7);
    //this.initTable();
  }
  //ASAP选择
  onChangePoint(value){
    console.log("ASAP选择:" + this.radioPointValue) ;
  }
  //选择版本
  changeVersion(value){
    console.log(this.selectedVer);
  }

  firstModalClick(orderNo,orderItemNo,secondModalTitle: TemplateRef<{}>, secondModalContent: TemplateRef<{}>, secondModalFooter: TemplateRef<{}>){
    console.log("訂單：" +orderNo + "訂單批次：" +  orderItemNo) ;
    this.secondModal = this.modalService.create({
      nzTitle: secondModalTitle,
      nzContent: secondModalContent,
      nzFooter: secondModalFooter,
      nzMaskClosable: true,
      nzClosable: false,
      nzWidth:'1500px',
      nzOnOk: () => console.log('Click ok')
    });
    this.getSecondModalData(orderNo,orderItemNo);
  }
  getSecondModalData(orderNo,orderItemNo){
    this.secondModalLoading = true;
    let myObj = this ;
    let paramete = {
      fcpVer: this.selectedVer.value,
      pointStatus:this.selectedVer.pointStatus,
      orderNo:orderNo,
      orderItemNo:orderItemNo
    }
    myObj.getPPSService.getR302OrderDataList(paramete).subscribe(res => {
      this.secondModalLoading = false
      this.secondModalTableHeaderLast = [] ;
      this.secondModalExportList = [] ;
      // console.log("comitData :" + JSON.stringify(res)) ;
      let result:any = res ;
      let tw = 0 ; //总重
      if(result.code === 1) {
        this.secondModalData = result.data.tableData ;
        let dateList = result.data.dateList ;
        for(let d of dateList){
          let last = {label: d} ;
          this.secondModalTableHeaderLast.push(last);
        }
        for(let i=0 ; i < this.secondModalData.length ; i ++ ){
          let item = this.secondModalData[i];
          let rowData = {} ;
          rowData["idNo"]= item.idNo;
          rowData["weight"]= item.weight;
          let dateTemp:any = item.dateShopList ;
          for(let i = 0 ; i < dateTemp.length ; i ++ ){

            rowData[dateList[i]] = dateTemp[i]
          }
          this.secondModalExportList.push(rowData) ;
        }

      } else {
        this.secondModalExportList = [] ;
      }

    },err => {
      this.secondModalLoading = false
      this.message.error('網絡請求失敗');
    })
  }
  //第二层导出
  handleSecondModalExport(){
    let headerArray = [] ;
    for(let item of this.secondModalTableHeaderExport){
     headerArray.push(item.label);
    }
    for(let item of this.secondModalTableHeaderLast){
      headerArray.push(item.label);
     }

    let exportTableName = "訂單執行情況";
    let exportData = this.secondModalExportList ;
    console.log("訂單執行情況:"+JSON.stringify(exportData));
    this.excelService.exportAsExcelFile(exportData, exportTableName,headerArray);
  }
  handleSecondModalChange(){
    this.secondModal.destroy() ;
  }

  firstSearchClickFun(){
    this.getFirstModalData(this.firstSearchParamete.tableHeader,this.firstSearchParamete.tableLeft);
  }

  tdClickFun(k,j,i,tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>){
    
    this.firstModalData = [] ;
    let tableLeftItem;
    let tableHeaderItem;
    let title;
    tableHeaderItem = this.tableHeaderList[j] ;
    tableLeftItem = this.tableSplitData[k] ;

    let headTitle = "";
    switch(i){
      case 0 :
      headTitle = "延遲"
      break ;
      case 1 :
      headTitle = "如期"
      break ;
      case 2 :
      headTitle = "超前"
      break ;
      case 3 :
      break ;
    }

    if(k == 99){
      //交期對應 pst 為全部
      tableLeftItem = this.tableSplitData[0];
      title = headTitle+"訂單明細（ 計劃執行："
      + this.tableSplitData[0].label + "~" + this.tableSplitData[this.tableSplitData.length - 1].label
      + " || 交期："+ tableHeaderItem.label + " ) " ;
      tableLeftItem.endDate = this.tableSplitData[this.tableSplitData.length - 1].endDate;
    }
    else if(k == 100){
      //交期為全部， pst 為全部
      tableLeftItem = this.tableSplitData[0];
      title = headTitle+"訂單明細（ 計劃執行："
      + this.tableSplitData[0].label + "~" + this.tableSplitData[this.tableSplitData.length - 1].label
      + " || 交期："+ this.tableHeaderList[0].label + "~" + this.tableHeaderList[this.tableHeaderList.length - 1].label
      + " ) " ;
      tableLeftItem.endDate = this.tableSplitData[this.tableSplitData.length - 1].endDate;

      tableHeaderItem = this.tableHeaderList[0];
      tableHeaderItem.endDate = this.tableHeaderList[this.tableHeaderList.length - 1].endDate;
    }

    if(j == 99){
      //交期為全部， 對應pst
      title = headTitle+"訂單明細（ 計劃執行："+ tableLeftItem.label 
      + " || 交期："+ this.tableHeaderList[0].label + "~" + this.tableHeaderList[this.tableHeaderList.length - 1].label
      + " ) " ;
      tableHeaderItem = this.tableHeaderList[0];
      tableHeaderItem.endDate = this.tableHeaderList[this.tableHeaderList.length - 1].endDate;
    }

    if(k!= 99 && k != 100 && j != 99){
      title = headTitle+"訂單明細（ 計劃執行："+ tableLeftItem.label + " || 交期："+ tableHeaderItem.label + " ) " ;
    }

    this.firstModalTitle = title ;
    this.getDateFrom(tableLeftItem.startDate,tableLeftItem.endDate);
    //this.isModalVisible = true ;
    this.firstModal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: true,
      nzClosable: false,
      nzWidth:'1500px',
      nzOnOk: () => console.log('Click ok')
    });

    this.getFirstModalData(tableHeaderItem,tableLeftItem);
  }
  //导出数据第一層Modal
  handleModalExport(){
     let headerArray = [] ;
     //let exportTableTitle = _.merge(this.firstModalTableHeaderList,this.firstModalTableAppendList) ;
     let exportTableTitle = [] ;

     for(let item of this.firstModalTableHeaderList){
      headerArray.push(item.label);
     }
     for(let item of this.firstModalTableAppendList){
      headerArray.push(item.label);
     }
     let exportTableName = "訂單明細"
     let exportData = this.modalDataExportList ;
     //console.log("exportTableTitle:"+exportTableTitle);
     exportData.forEach(function(item)
    {
      item['planWeight'] = Number(item['planWeight']);
    });
     console.log("exportData:"+JSON.stringify(exportData));
     this.excelService.exportAsExcelFile(exportData, exportTableName,headerArray);
  }
  delayDataBtn(delayModalTitle: TemplateRef<{}>, delayModalContent: TemplateRef<{}>, delayModalFooter: TemplateRef<{}>){
    this.firstModalData = [] ;
    this.modalDelayDataExportList = [] ;
    //this.isDelayModalVisible = true ;
    this.delayModal = this.modalService.create({
      nzTitle: delayModalTitle,
      nzContent: delayModalContent,
      nzFooter: delayModalFooter,
      nzMaskClosable: true,
      nzClosable: false,
      nzWidth:'1500px',
      nzOnOk: () => console.log('Click ok')
    });
    this.totalCount = 0 ;
    this.totalWeight = 0 ;
    this.getDelayDataList();
  }
  handleDelayModalExport(){
    let headerArray = [] ;
    for(let item of this.firstModalTableHeaderList){
     headerArray.push(item.label);
    }
    let exportTableName = "延期訂單詳情"
    let exportData = this.modalDelayDataExportList ;
    console.log("延期訂單詳情:"+JSON.stringify(exportData));
    this.excelService.exportAsExcelFile(exportData, exportTableName,headerArray);
 }

  getDelayDataList(){
    this.delayModalLoading = true;
    let myObj = this ;
    let paramete = {
      fcpVer: this.selectedVer.value,
      pointStatus:this.selectedVer.pointStatus,
      searchData:this.searchData
    }
    myObj.getPPSService.getR302DelayDataList(paramete).subscribe(res => {
      this.delayModalLoading = false
      this.modalDelayDataExportList = [] ;
      // console.log("comitData :" + JSON.stringify(res)) ;
      let result:any = res ;
      let tw = 0 ; //总重
      if(result.code === 1) {
        this.firstModalData = result.data ;
        this.totalCount = this.firstModalData.length ;
        for(let i=0 ; i < this.firstModalData.length ; i ++ ){
          let item = this.firstModalData[i];
          tw = tw + Number(item.planWeight) ;
          let rowData = {} ;
          rowData["index"]=""+(i+1) ;
          rowData["orderNo"]= item.orderNo+"-"+item.orderItemNo;
          rowData["deliveryDate"]= item.deliveryDate;
          rowData["planEndDate"]= item.planEndDate;
          rowData["customer"]= item.customer;
          rowData["steelType"]= item.steelType;
          rowData["steelSize"]= item.steelSize;
          rowData["pendingStorage"]= item.pendingStorage;;
          rowData["planInDate"]= item.planInDate;
          rowData["planWeight"]= item.planWeight;
          this.modalDelayDataExportList.push(rowData) ;
        }
        console.log("总重：" + tw) ;
        this.totalWeight = Number(tw.toFixed(2)) ;
      } else {
        this.modalDelayDataExportList = [] ;
      }

    },err => {
      this.message.error('網絡請求失敗');
    })
  }
  getFirstModalData(header,left){
    let myObj = this ;
    this.firstModalLoading = true
    
    this.firstSearchParamete.fcpVer = this.selectedVer.value;
    this.firstSearchParamete.pointStatus = this.selectedVer.pointStatus;
    this.firstSearchParamete.tableHeader = header;
    this.firstSearchParamete.tableLeft = left;

  myObj.getPPSService.getR302FirstModalDataList(this.firstSearchParamete).subscribe(res => {
    this.firstModalLoading = false
    this.modalDataExportList = [] ;
    console.log("comitData :" + JSON.stringify(res)) ;
    let result:any = res ;
    if(result.code === 1) {
      this.firstModalData = result.data ;
      for(let i=0 ; i < this.firstModalData.length ; i ++ ){
        let item = this.firstModalData[i];
        let rowData = {} ;
        rowData["index"]=""+(i+1) ;
        rowData["orderNo"]= item.orderNo+"-"+item.orderItemNo;
        rowData["deliveryDate"]= item.deliveryDate;
        rowData["planEndDate"]= item.planEndDate;
        rowData["customer"]= item.customer;
        rowData["steelType"]= item.steelType;
        rowData["steelSize"]= item.steelSize;
        rowData["pendingStorage"]= item.pendingStorage;
        rowData["planInDate"]= item.planInDate;
        rowData["planWeight"]= item.planWeight;
        let t = 0 ;
        for(let it of item.dateWeightList){
          t++ ;
          let col = "M" + t ;
          rowData[col] =  Number(it);
        }
        console.log("一行数据：" + JSON.stringify(rowData));
        //接收导出到数据
        this.modalDataExportList.push(rowData);
      }
      console.log(this.modalDataExportList);

    } else {

    }

  },err => {
    this.message.error('網絡請求失敗');

  })
  }

  /**
   *
   * @param value
   */
   handleModalChange(){
    //this.isModalVisible = !this.isModalVisible ;
    this.firstModal.destroy();
   }
   handleDelayModalChange(){
    //this.isDelayModalVisible = !this.isDelayModalVisible ;
    this.delayModal.destroy() ;
   }
  //月 旬选择
  onSelectChange(value){
    console.log(this.radioSelectValue);
    if(this.radioSelectValue === 'M'){
      this.showSelectSplitNum = false
      this.showSelectWeek = false
      this.tableSplitData = []
      this.initTable();
    } else if(this.radioSelectValue === 'N') {
      this.showSelectSplitNum = true
      this.selectedDayValue = { label : '10', value: '10' };
      this.showSelectWeek = false;
      this.initTable();
    } else if(this.radioSelectValue === 'Z'){
      this.showSelectSplitNum = true
      this.selectedDayValue = { label : '7', value: '7' };
      this.showSelectWeek = true;
      this.initTable();
    }
  }

  initTable(){
    this.loaded = false ;
    if(this.radioSelectValue === 'M') {
      this.initDateByMon() ;
    } else {
      this.initDateByN() ;
    }
    let tableList = this.headerFirst.concat(this.tableSplitData).concat(this.tableHeaderLastList) ;
    this.tableHeaderList = tableList ;
    this.getDataList();
  }

  initPostData(){
    // model 为月 N为旬
    let paramete = {
      fcpver: this.selectedVer,
      pointStatus:this.radioPointValue,
      model:this.radioSelectValue,
      days:this.selectedDayValue,
      weekDay:"0" ,
      tableHeaderList : this.tableHeaderList,
      tableLeftList: this.tableSplitData
    }
    console.log("post parameter ： " + JSON.stringify(paramete));

  }
  //提交查询按钮
  subnitBtnFunc(){
    this.initTable() ;
    //this. getDataList() ;
  }

  //获取数据
  getDataList(){
    let myObj = this ;
    let paramete = {
      fcpVer: this.selectedVer.value,
      pointStatus:this.radioPointValue,
      model:this.radioSelectValue,
      days:this.selectedDayValue.value,
      weekDay:"0",
      tableHeaderList : this.tableHeaderList,
      tableLeftList: this.tableSplitData,
      searchData:this.searchData
    }
  myObj.getPPSService.getR302DataList(paramete).subscribe(res => {
    //console.log("comitData :" + JSON.stringify(res)) ;

    let result:any = res ;
    this.tbodyList = [] ;
    if(result.code === 1) {
      this.tbodyList = result.data.tableCell ;
      if(this.tbodyList.length > 0){
        this.loaded = true ;
      }
      this.tableTotalCell = result.data.tableTotalCell[0] ;
      this.tableOrderTotalCell = result.data.tableOrderTotalCell[0];
      // console.log("填充数据0"+ JSON.stringify(this.tbodyList[0][0]));
      // for(let i= 0 ; i < this.tbodyList.length ; i ++){
      //   console.log("填充数据"+ JSON.stringify(this.tbodyList[i]));
      // }

    } else {

    }


  },err => {
    this.message.error('網絡請求失敗');
  })
  }

// 取得版本號
getVerList() {
  let myObj = this;
  this.getPPSService.getCurrentMonVerList().subscribe(res => {
    console.log("getVerList success");
    console.log("获取版本号： " + res)
    let result:any = res ;
    if(result.code === 1) {
      let verList:any = result.data;
      const children: Array<{ label: string; value: string ; pointStatus : string}> = [];
      for(let i = 0 ; i<verList.length ; i++) {
        let pointLabel = verList[i].startpoint === "A" ? 'ASAP' : verList[i].startpoint ;
        console.log("获取版本号：" + pointLabel)
        children.push({ label: verList[i].fcp_EDITION+"("+pointLabel+")", value: verList[i].fcp_EDITION ,pointStatus:verList[i].startpoint })
      }
      this.listOfOption = children;
      let pointLabel = verList[0].startpoint === "A" ? 'ASAP' : verList[0].startpoint ;
      this.selectedVer = {label:verList[0].fcp_EDITION+"("+pointLabel+")", value:verList[0].fcp_EDITION,pointStatus:verList[0].startpoint}
      this.initTable() ;
    } else{
      this.message.error(result.message);
    }
    //this.getDataList();

  });
}

// 取得區域別
getAreaGroup() {
  let myObj = this;
  this.getPPSService.getAreaGroup().subscribe(res => {
    let result:any = res ;
    if(result.code === 1) {
      let areaGroup:any = result.data;
      areaGroup.forEach(e => {
        this.areaGroup.push({label: e.saleAreaGroup, value: e.saleAreaGroup});
      });
    } else{
      this.message.error(result.message);
    }
  });
}

// 取得星期設定
getWeekData() {
  let myObj = this;
  this.getPPSService.getWeekData().subscribe(res => {
    console.log("getWeekData success");
    console.log("获取星期设定 " + JSON.stringify(res) );
    let result:any = res ;
    if(result.code === 1) {
       let week:any = result.data;
      this.selectedValue = {label:week.weekName,value:week.weekIndex} ;//{ label: '星期一', value: '0' };
      console.log("日期赋值："+this.selectedValue) ;
    }
    //this.getDataList();
  });
}


  dayOptionList = [
    {label : '10', value: '10'},
    {label : '7', value: '7'},
  ]
  selectedDayValue = {label : '10', value: '10'};
  selectDayLog(value: { label: string; value: string }): void {
    console.log(value);
    console.log("选择：" + JSON.stringify(this.selectedValue))
    if(this.selectedDayValue.value === "7") {
      this.showSelectWeek = true ;
    }else{
      this.showSelectWeek = false;
    }
    this.initTable();
  }

  showSelectSplitNum = false ;
  showSelectWeek = false ;


//按月
  initDateByMon(){
    this.headerFirst = [] ;
    this.tableSplitData = [] ;
    this.initDelayDate();
    this.currentMonTotal() ;
    this.initOtherMonth() ;
  }
//按旬
  initDateByN(){
    this.initDelayDate();
    if(this.selectedDayValue.value === "10"){
      console.log("选择10天处理日期：");
      this.splitTenDate(10);
    } else if(this.selectedDayValue.value === "7"){
      console.log("选择7天处理日期：");
      this.splitSevenDate(7);
    }
  }

  initDelayDate(){
    this.headerFirst = [] ;
    let mon = moment().add(-1, 'months') ;
    let monFirstDay = mon.startOf('month').format("YYYY-MM-DD");
    let monLastDay = mon.endOf('month').format("YYYY-MM-DD");
    let index = 1 ;
    let dateObj = {label:"上月延遲訂單", mon:mon.format("YYYY-MM"),startDate:null,endDate:monLastDay,sortindex:index}
    this.headerFirst.push(dateObj);
  }
currentMonTotal(){
  let mon = moment() ;
    let monFirstDay = mon.startOf('month').format("YYYY-MM-DD");
    let monLastDay = mon.endOf('month').format("YYYY-MM-DD");
    let index = 1 ;
    let dateObj = {label:mon.format("MM")+"月", mon:mon.format("YYYY-MM"),startDate:monFirstDay,endDate:monLastDay,sortindex:index}
    this.tableSplitData.push(dateObj);
}

initOtherMonth(){
  // this.currentMonTotal();
  for(var i= 1 ; i <= this.monLength ; i ++){
    let monTemp = moment().add(i,"M")
    let mon = monTemp.format("YYYY-MM")
    let monFirstDay = monTemp.startOf('month').format("YYYY-MM-DD") ;
    let monLastDay = monTemp.endOf('month').format("YYYY-MM-DD") ;
    let dateObj = {label:monTemp.format("MM") + "月", mon:mon,startDate:monFirstDay,endDate:monLastDay,sortindex:1}
    this.tableSplitData.push(dateObj) ;
    if(i === this.monLength){
      this.tableHeaderLastList = [] ;
      let dateObj = {label:"TOTAL", mon:null,startDate:null,endDate:monLastDay,sortindex:1}
      this.tableHeaderLastList.push(dateObj) ;
    }
  }
}


getDateFrom(startD,endD){
let dayLength = moment(endD).diff(moment(startD), 'days');
this.firstModalTableAppendList = [] ;
 for(var i=0 ; i <= dayLength ; i ++){
  let dateTemp = moment(startD).add(i, 'day') ;
  let obj = {label:dateTemp.format("YYYY-MM-DD")}
  console.log("日期：" + JSON.stringify(obj) )
  this.firstModalTableAppendList.push(obj);
 }
//新版本
  // this.firstModalTableAppendList = [] ;
  // let dateStartTemp = moment(startD).format("YYYY-MM-DD");
  // let dateEndTemp = moment(endD).format("YYYY-MM-DD");
  // let obj = {label:dateStartTemp + "至" + dateEndTemp }
  // this.firstModalTableAppendList.push(obj);
}
  splitDate(splitnumm){
    let nowMonDays = moment().daysInMonth();
    let nowMon = moment().format("MM")
    let nowMonFirstDay = moment().startOf('month').format("YYYY-MM-DD");
    let nowMonOLastDay = moment().endOf('month').format("YYYY-MM-DD");
    let temp = 1 ; //标记周期倍数
    let circleNum = Math.floor(nowMonDays / splitnumm)
    console.log("circleNum:" +circleNum);
    let startDate = nowMonFirstDay ;
    let endDate = nowMonOLastDay ;
    for(var i= 0 ; i < nowMonDays ; i ++  ) {
      let dateTemp = moment(nowMonFirstDay).add(i, 'day') ;
        if( i === splitnumm * temp -1){
          endDate = dateTemp.format("YYYY-MM-DD");
          let startStr = moment(startDate).format("DD");
          let endStr = moment(endDate).format("DD");
          let dateObj = {label:nowMon + "月（"+ startStr + "-"+ endStr + ")", mon:nowMon,startDate:startDate,endDate:endDate}
           this.tableSplitData.push(dateObj) ;
          console.log("时间分割 " + temp + "：" + JSON.stringify(dateObj)) ;
            temp = temp + 1 ;
            startDate = moment(endDate).add(1, 'day').format("YYYY-MM-DD"); //时间开始从下一天
        } else if ( i === nowMonDays - 1){
          endDate =  nowMonOLastDay ;
          let startStr = moment(startDate).format("DD");
          let endStr = moment(endDate).format("DD");
          let dateObj = {label:nowMon + "月（"+ startStr + "-"+ endStr + ")", mon:nowMon,startDate:startDate,endDate:endDate}
          this.tableSplitData.push(dateObj) ;
          console.log("时间分割 " + temp + "：" + JSON.stringify(dateObj)) ;
        }
    }
  }

  splitTenDate(splitnumm){
    this.tableSplitData = [] ;
    //获取月份天数
    let nowMonDays = moment().daysInMonth();
    let nowMon = moment().format("MM")
    let nowMonFirstDay = moment().startOf('month').format("YYYY-MM-DD");
    let nowMonOLastDay = moment().endOf('month').format("YYYY-MM-DD");
    let temp = 1 ; //标记周期倍数
    let startDate = nowMonFirstDay ;
    let endDate = nowMonOLastDay ;
    for(var i= 0 ; i < nowMonDays ; i ++  ) {
      let dateTemp = moment(nowMonFirstDay).add(i, 'day') ;
        if( i === splitnumm * temp -1 && temp !== 3){
          endDate = dateTemp.format("YYYY-MM-DD");
          let startStr = moment(startDate).format("DD");
          let endStr = moment(endDate).format("DD");
          let dateObj = {label:nowMon + "月（"+ startStr + "-"+ endStr + ")", mon:nowMon,startDate:startDate,endDate:endDate,sortindex:temp}
          this.tableSplitData.push(dateObj) ;
          console.log("时间分割 " + temp + "：" + JSON.stringify(dateObj)) ;
          temp = temp + 1 ;
          startDate = moment(endDate).add(1, 'day').format("YYYY-MM-DD"); //时间开始从下一天
        } else if (i === nowMonDays - 1){
          endDate =  nowMonOLastDay ;
          let startStr = moment(startDate).format("DD");
          let endStr = moment(endDate).format("DD");
          let dateObj = {label:nowMon + "月（"+ startStr + "-"+ endStr + ")", mon:nowMon,startDate:startDate,endDate:endDate,sortindex:temp}
          this.tableSplitData.push(dateObj) ;
          console.log("时间分割 " + temp + "：" + JSON.stringify(dateObj)) ;
        }
    }
    this.initOtherMonth() ;
  }

  splitSevenDate(splitnumm){
    this.tableSplitData = [] ;
    let nowMonDays = moment().daysInMonth();
    let nowMon = moment().format("MM")
    let nowMonFirstDay = moment().startOf('month').format("YYYY-MM-DD");
    let nowMonOLastDay = moment().endOf('month').format("YYYY-MM-DD");
    let temp = 1 ; //标记周期倍数
    //let flag = 0 ; //标记循环

    let startDate = nowMonFirstDay ;
    let endDate = nowMonOLastDay ;
    for(var i= 0 ; i < nowMonDays ; i ++  ) {
      let dateTemp = moment(nowMonFirstDay).add(i, 'day') ; //月份某天
      //flag ++ ;
      if(dateTemp.day() === this.selectedValue.value) {
          endDate = dateTemp.format("YYYY-MM-DD");
          let startStr = moment(startDate).format("DD");
          let endStr = moment(endDate).format("DD");
          let dateObj = {label:nowMon + "月（"+ startStr + "-"+ endStr + ")", mon:nowMon,startDate:startDate,endDate:endDate,sortindex:temp}
          this.tableSplitData.push(dateObj) ;
          temp ++ ;
          console.log("时间分割 " + i + "：" + JSON.stringify(dateObj)) ;
          //flag = 0 ;
          startDate = moment(endDate).add(1, 'day').format("YYYY-MM-DD"); //时间开始从下一天
      } else if (i === nowMonDays - 1){
        endDate =  nowMonOLastDay ;
        let startStr = moment(startDate).format("DD");
        let endStr = moment(endDate).format("DD");
        let dateObj = {label:nowMon + "月（"+ startStr + "-"+ endStr + ")", mon:nowMon,startDate:startDate,endDate:endDate,sortindex:temp}
        this.tableSplitData.push(dateObj) ;
        console.log("时间分割 " + i + "：" + JSON.stringify(dateObj)) ;
      }
    }
    this.initOtherMonth() ;
  }

  onChangekindType(result:any): void {
    if(result){
      this.specialBarDisable = false;
    }else{
      this.specialBarDisable = true;
    }
  }

  // 展開週計畫入庫表
  openBiWeekWip() {
    this.isVisibleBiWeekWip = true;
  }
  BiWeekWipCancel() {
    this.isVisibleBiWeekWip = false;
  }

}
