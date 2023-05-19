import { Component, OnInit } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
import * as moment from 'moment';
import { PPSService } from "src/app/services/PPS/PPS.service";


@Component({
  selector: 'app-PPSR301',
  templateUrl: './PPSR301.component.html',
  styleUrls: ['./PPSR301.component.css'],
  providers:[NzMessageService,DatePipe]
})
export class PPSR301Component implements OnInit {
  date = new Date(); // new Date();
  isVisibleUse = false;
  // content = "style={ p { word-break:break-all; }}"
  queryDate = "" ;
  MonOne = ""
  Montwo = ""
  MonThree = ""
  thead = [] ;
  testHeader = [
    {
      value : 'A' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'B' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'C' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'D' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'E' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },

    {
      value : 'F' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'G' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'H' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'I' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value :'J' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'K' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'L' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'M' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'N' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'O' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'P' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'Q' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'R' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'S' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },

    {
      value : 'T' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'U' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'V' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : ' -明細- ' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },

  ] ;
  theadList = [
    [
    {
    value : '站別' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'來源：站別機台關聯表-站別'
  },{
    value : '機群' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'來源：站別機台關聯表-機群'

  },{
    value : '機台' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'來源：站別機台關聯表-機台'
  },
  {
    value : '交期月份' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'計算當月往後，共三個月'
  },
  {
    value : '已生產量' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'MES代入已過機量'
  },
  {
    value : '最大負荷量' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'接單量+可再負荷量'
  },
  {
    value : '機台狀況' ,
    mergeRow: 0 ,
    mergeCol: 2,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'機台狀況'
  },
  {
    value : '機台狀況' ,
    mergeRow: 0 ,
    mergeCol: 2,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台狀況'
  },
  {
    value : '負荷量' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'負荷量'
  },
  {
    value : '負荷量' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'負荷量'
  },
  {
    value : '負荷量' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'負荷量'
  },
  {
    value : '負荷量' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'負荷量'
  },
  {
    value : '庫存分佈' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'庫存分佈'
  },
  {
    value : '庫存分佈' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'庫存分佈'
  },
  {
    value : '庫存分佈' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'庫存分佈'
  },
  {
    value : '庫存分佈' ,
    mergeRow: 0 ,
    mergeCol: 4,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'庫存分佈'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : true,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '機台負荷' ,
    mergeRow: 0 ,
    mergeCol: 6,
    showCell : false,
    hoverTitle:'說明',
    hoverContent:'機台負荷'
  },
  {
    value : '顯示明細' ,
    mergeRow: 2 ,
    mergeCol: 0,
    showCell : true
  },
  ],[
    {
      value : '站別' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false
    },
    {
      value : '機群' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false
    },
    {
      value : '機台' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false
    },
    {
      value : '交期月份' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false,
      hoverTitle:'說明'
    },
    {
      value : '已生產量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false
    },
    {
      value : '最大負荷量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : false
    },
    {
      value : '剩餘負荷量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:`來源：FCP結果表，不含跨天的總重，依機台、交期月份顯示`
    },
    {
      value : '可再負荷量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:`來源：FCP結果表，剩餘工時*平均工時；剩餘工時：月天數-目前時間-停機時間； 平均工時：總重/總工時(排除停機) `
    },
    {
      value : this.MonOne ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，總工時(不含停機)/排程負荷_當月工時(M)'
    },
    {
      value : this.Montwo ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，總工時(不含停機)/排程負荷_當月工時(M+1)'
    },
    {
      value :this.MonThree ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，總工時(不含停機)/排程負荷_當月工時(M+2)'
    },
    {
      value : '總工時(天)' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，總工時(不含停機)，換算成天'
    },
    {
      value : '軋欠' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天 & MO開頭=Y & MO開頭=0X & LOCK=1 的總重，依機台、交期月份顯示'
    },
    {
      value : '已軋未到料' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天 & MO開頭=Y & MO開頭=0X & LOCK=0 & 合併單號開頭=0C 的總重，依機台、交期月份顯示'
    },

    {
      value : 'WIP未到站' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天 & MO開頭<>Y & MO開頭<>0X & 預計安排站別不等於現況站別 的總重，依機台、交期月份顯示'
    },
    {
      value : 'WIP已到站' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天 & MO開頭<>Y & MO開頭<>0X & 預計安排站別 = 現況站別 & SORT群組=1 的總重，依機台、交期月份顯示',
    },
    {
      value : 'R' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，型態限定為 R & D，依機台、交期月份顯示'
    },
    {
      value : 'H' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，型態限定為 C & H，依機台、交期月份顯示'
    },
    {
      value : 'S' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，型態限定為 Z & S，依機台、交期月份顯示'
    },
    {
      value : 'F' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，型態限定為 F，依機台、交期月份顯示'
    },
    {
      value : 'I' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，型態限定為 I，依機台、交期月份顯示'
    },
    {
      value : '解捲' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true,
      hoverTitle:'說明',
      hoverContent:'來源：FCP結果表，不含跨天的總重，製程碼限定為 J，依機台、交期月份顯示'
    },

  ]];

  // 用途說明
  modalTableTitle = [] ;
  usetbodyList = [
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '由MES取得直棒各工站/機台實際過機量(區分生產訂單交期月份)' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '依據剩餘負荷量與可再負荷量加總顯示交期月份的最大負荷量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '依據交期月份角度計算目前剩餘負荷量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '依據交期月份的訂單平均工時與剩餘工時，推算當月可在接單量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '呈現各月份排程計畫中訂單交期分布工時' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value :'-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '交期月份中訂單的軋鋼尚未產出之欠量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '交期月份中訂單於軋鋼已產出但尚未到直棒廠重量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },

    {
      value : '交期月份中訂單中來料已到直棒廠生產，但尚未到該站生產的重量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '交期月份中訂單中來料已到直棒廠生產，且已到站待生產的重量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '計算交期月份現況各機台生產的產品型態分布量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '-' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : '交期月份於當站為解捲製程的重量' ,
      mergeRow: 0 ,
      mergeCol: 0,
      showCell : true
    },
    {
      value : 'a' ,
      mergeRow: 0,
      mergeCol: 0,
      showCell : true
    },

  ] ;




  optionList = [];
  selectedValue = {};

  fcpVer = "";
  monList = [] ;
  tbodyList = [] ;
  tableLoading = false ;

  loading = false; //loaging data flag
  // tslint:disable-next-line:no-any
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  log(value: { label: string; value: string }): void {
    //console.log(value);
  }
  constructor(
    private nzInputModule:NzInputModule ,
    private  NzTimePickerModule:NzTimePickerModule,
    private  nzDatePickerModule:NzDatePickerModule,
    private datePipe : DatePipe,
    private getPPSService: PPSService,
    private message:NzMessageService ,
    ) {

  }
  ngOnInit() {
    // this.theadList.push(this.testHeader);
    this.getVerList();
    this.initDate();
    this.getShopList();
    this.modalTableTitle.push(this.usetbodyList)
  }

  listOfOption = [];
  listOfSelectedValue: string[] = [];

  isNotSelected(value: string): boolean {
    return this.listOfSelectedValue.indexOf(value) === -1;
  }

  // 取得版本號
  getVerList() {
    this.loading = true;
    //console.log("getVerList...");
    let myObj = this;
    this.getPPSService.getR301VerList().subscribe(res => {
     // console.log("getVerList success :" + JSON.stringify(res)) ;
      let result:any = res ;
      this.optionList = []
      let optionListTemp = [] ;
      for(let item of result) {
        let temp = {label:item.FCP_EDITION, value:item.FCP_EDITION} ;
        optionListTemp.push(temp);
      }
      this.selectedValue = optionListTemp[0] ;
      this.optionList = optionListTemp ;
      //console.log("optionList:"+JSON.stringify(this.optionList))
      myObj.loading = false;
    });
  }
  initDate(){
    let result = this.date ;
    this.queryDate = this.datePipe.transform(result,'yyyy-MM') ;
    this.MonOne = moment(result).format('YYYY-MM') ;
    this.Montwo = moment(result).add(1,'months').format('YYYY-MM') ;
    this.MonThree = moment(result).add(2,'months').format('YYYY-MM') ;
    this.theadList[1][8].value = this.MonOne ;
    this.theadList[1][9].value = this.Montwo ;
    this.theadList[1][10].value = this.MonThree ;
    this.thead = this.theadList ;
    console.log("表格头部：" + JSON.stringify(this.thead)) ;
  }

  onChange(result: Date): void {
    this.queryDate = this.datePipe.transform(result,'yyyy-MM') ;
    this.MonOne = moment(result).format('YYYY-MM') ;
    this.Montwo = moment(result).add(1,'months').format('YYYY-MM') ;
    this.MonThree = moment(result).add(2,'months').format('YYYY-MM') ;
    this.theadList[1][8].value = this.MonOne ;
    this.theadList[1][9].value = this.Montwo ;
    this.theadList[1][10].value = this.MonThree ;
    this.thead = this.theadList ;
    //console.log("theadList : "+ JSON.stringify(this.theadList));
    //console.log('onChange: ', this.datePipe.transform(result,'yyyy-MM'));
  }

  getShopList(){
  let myObj = this;
  this.getPPSService.getPickerShopEQUIPNEW('1', '　').subscribe(res => {
    let result :any = res;
    var newres = [];
    for(let i=0 ; i < result.length ; i++) {
      newres.push(result[i].SHOP_CODE);
    }
    this.listOfOption = newres;   //初始化站別選擇
  });
  }

  queryBtnFun(){
    // console.log("queryDate",)
    // //數據庫讀出日期
    // this.queryDate = "2022-05"
    // let date = new Date(this.queryDate)
    // this.date = date ;
    // console.log("data ： "+date) ;
    this.tbodyList = [];
    //this.fcpVer = "F20220906165544"
    this.monList = [] ;
    this.monList.push(this.MonOne) ;
    this.monList.push(this.Montwo) ;
    this.monList.push(this.MonThree) ;
    //console.log("已選擇數據:" + this.listOfSelectedValue)
    let verTemp:any = this.selectedValue ;
    this.fcpVer = verTemp.value ;
    //console.log("版本號選擇："  + JSON.stringify(verTemp.value) ) ;
    this.getDataList() ;

  }

  getDataList(){
    this.tableLoading = true ;
    let myObj = this ;
    let comitParamete = {fcpVer : this.fcpVer, monList: this.monList, shopList: this.listOfSelectedValue } ;
    myObj.getPPSService.getR301DataList(comitParamete).subscribe(res => {
      //console.log("comitData :" + JSON.stringify(res)) ;
      this.tableLoading = false;
      let result:any = res ;
      this.tbodyList = [] ;
      if(result.code === 1) {
        this.tbodyList = result.data ;
        //this.message.info(result.message) ;
      } else {
        //this.message.error(result.message) ;
      }

    },err => {
      this.tableLoading = false ;
      this.message.error('網絡請求失敗');
    })
  }

  openComment() {
    this.isVisibleUse = true;

  }
  useCancel() {
    this.isVisibleUse = false;

  }
  useOk() {
    this.isVisibleUse = false;
  }

  // 展開明細第二層
  openDtl(i) {
    
    this.message.create("error", "開發中，還沒寫完");
    console.log(i[0].value);
    console.log(i[2].value);
    console.log(i[3].value);
  }



}
