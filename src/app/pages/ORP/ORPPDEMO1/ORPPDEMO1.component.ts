import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Orp040Service } from 'src/app/services/ORP/orp040.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-ORPPDEMO1',
  templateUrl: './ORPPDEMO1.component.html',
  styleUrls: ['./ORPPDEMO1.component.css'],
  providers: [NzMessageService]
})
export class ORPPDEMO1Component implements OnInit {
  checked = true ;
  table = {
    header: [
      {
        lable:'選擇',
        value: 'checked',
        bgcolor:'trbg'
      },
      {
        lable:'資料日期',
        value: 'ziliaoDate',
        bgcolor:'trbg'
      },
      {
        lable:'提貨單號',
        value: 'tihuoNo',
        bgcolor:'trbg'
      },
      {
        lable:'鋼捲號碼',
        value: 'gangJuanNo',
        bgcolor:'trbg'
      },
      {
        lable:'合約號碼',
        value: 'heyueNo',
        bgcolor:'trbg'
      },
      {
        lable:'訂單號碼',
        value: 'orderNo',
        bgcolor:'trbg'
      },
      {
        lable:'鋼捲號碼',
        value: 'gangJuanNo',
        bgcolor:'trbg'
      },
      {
        lable:'提領狀態',
        value: 'tilingStatus',
        bgcolor:'trbg'
      },
      {
        lable:'提領種類',
        value: 'tilingType',
        bgcolor:'trbg'
      },
     
     
      {
        lable:'鋼種',
        value: 'coilType',
        bgcolor:'trbg'
      },
      {
        lable:'表面',
        value: 'biaomian',
        bgcolor:'trbg'
      },
      {
        lable:'狀態',
        value: 'status',
        bgcolor:'trbg'
      },
      {
        lable:'捲板種類',
        value: 'gangjuanType',
        bgcolor:'trbg'
      },
      {
        lable:'規範',
        value: 'specification',
        bgcolor:'trbg'
      },
      // {
      //   lable:'品級',
      //   value: 'level',
      //   bgcolor:'trbg'
      // },
      // {
      //   lable:'訂單厚度',
      //   value: 'orderThickness',
      //   bgcolor:'trbg'
      // },
      // {
      //   lable:'訂單寬度',
      //   value: 'orderWidth',
      //   bgcolor:'trbg'
      // },
     
      // {
      //   lable:'訂單厚度上限',
      //   value: 'thicknessUpper',
      //   bgcolor:'trbg'
      // },
      // {
      //   lable:'訂單厚度下限',
      //   value: 'thicknessLower',
      //   bgcolor:'trbg'
      // },
      // {
      //   lable:'實際厚度',
      //   value: 'realThickness',
      //   bgcolor:'trbg'
      // },
      // {
      //   lable:'實際寬度',
      //   value: 'realWidth',
      //   bgcolor:'trbg'
      // },
      // {
      //   lable:'實際長度',
      //   value: 'realLong',
      //   bgcolor:'trbg'
      // },
      // {
      //   lable:'淨重',
      //   value: 'jingzong',
      //   bgcolor:'trbg'
      // },
      // {
      //   lable:'淨重',
      //   value: 'maozong',
      //   bgcolor:'trbg'
      // },
       {
        lable:'送貨地點',
        value: 'deliveryLocation',
        bgcolor:'trbg1'
      },
      {
        lable:'送貨地址',
        value: 'deliveryAddress',
        bgcolor:'trbg1'
      },
      {
        lable:'希望送貨日',
        value: 'preDeliveryDate',
        bgcolor:'trbg1'
      },
      {
        lable:'預計送貨日',
        value: 'deliveryPlanDate',
        bgcolor:'trbg'
      },
      {
        lable:'出貨備註',
        value: 'remark',
        bgcolor:'trbg'
      },
    ],
    listOfData:[]
  }

  creditTable = {
    header: [
      {
        lable:'資料日期',
        value: 'currentDate',
      },
      {
        lable:'客戶名稱',
        value: 'cstName',
      },
      {
        lable:'開狀日',
        value: 'handleDate',
      },
      {
        lable:'開狀銀行',
        value: 'handleBank',
      },
      {
        lable:'通知行',
        value: 'handleBranch',
      },
      {
        lable:'信用狀號碼',
        value: 'creditNo',
      },
      {
        lable:'押匯日',
        value: 'billingDate',
      },
      {
        lable:'開狀金額',
        value: 'creditAmount',
      },
      {
        lable:'總押匯金額',
        value: 'billAmount',
      },
      {
        lable:'折讓金額',
        value: 'discountAmount',
      },
      {
        lable:'可押匯餘額',
        value: 'remainingAmount',
      },
      {
        lable:'到期日',
        value: 'expiryDate',
      },
      {
        lable:'備註',
        value: 'remark',
      },
    ],
    listOfData:[]
  }


  dataHeader = {apiId:"ECC01",
    date:"2023-01-19",
    time:"01:31:21",
    from:"C_ID",
    to:"W_ID",
    token:"1234566",
    userId:"23"} ;
    postData = {
    timeSeq:moment().format("YYYYMMDDhhmmss") ,
    txNo:moment().format("MMDDhhmmss"),
    cstCode:"22533297",
    //msgCode1:"1234",
    msgCode:"M230101",
    data:{
      ctNo:''
    }
  }
  postApplyData = {
    timeSeq:moment().format("YYYYMMDDhhmmss") ,
    txNo:moment().format("MMDDhhmmss"),
    cstCode:"22533297",
    //msgCode1:"1234",
    msgCode:"M240101",
    data:{
      prdID:'9W848L01,9W722L05,9W722L05',
      prtNo: '01' ,
      ctNo:'11111S034' ,
      dlvType:'Y',
      expDeliver:'2022-03-09',
      dlvSite:'運錩(大寮廠)',
      dlvAdd:'高雄市大寮區華西路12號',
      note:''
    }
  }
  postCreditData = {
    timeSeq:moment().format("YYYYMMDDhhmmss") ,
    txNo:moment().format("MMDDhhmmss"),
    cstCode:"22533297",
    // msgCode1:"M310101",
     msgCode:"M310101",
  }

  isCreditVisible = false ;
  creditResultCode ;

  //申請提貨 Modal
  isApplyDeliveryModalVisible = false ;
  applyLoading  = false ;

  
  constructor(private service :Orp040Service, private message :NzMessageService) { }
  ngOnInit() {
  }
  handleCreditModalCancel(){
    this.isCreditVisible = false ;
  }

  handleApplyDeliveryModalCancel(){
    this.isApplyDeliveryModalVisible = !this.isApplyDeliveryModalVisible ;
  }
  comitCreditData(){
    this.postCreditData.cstCode = '22533297' ;
    this.postCreditData.timeSeq = moment().format("YYYYMMDDhhmmss")
    this.postCreditData.txNo = moment().format("MMDDhhmmss")
    let param = {header:this.dataHeader,body:this.postCreditData}
    this.service.handlePostData(param).subscribe(res => {
      console.log("模擬結果:" + res) ;
      let result:any = res ;
      if(result.code == 200){
        this.creditTable.listOfData = result.data ;
        this.creditResultCode = result ;
        this.isCreditVisible = true ;
      } else {
        this.message.error(result.message)
      }
   }) ;
  }

  comitData(){
    this.postData.cstCode = '22533297' ;
    this.postData.timeSeq = moment().format("YYYYMMDDhhmmss")
    this.postData.txNo = moment().format("MMDDhhmmss")
    let param = {header:this.dataHeader,body:this.postData}
    this.service.handlePostData(param).subscribe(res => {
      console.log("模擬結果:" + res) ;
      let result:any = res ;
      if(result.code == 200){
        this.table.listOfData = result.data ;
      } else {
        this.message.error(result.message)
      }
      
   }) ;
  }

  comitApplyData(){
    this.postApplyData.cstCode = '22533297' ;
    this.postApplyData.timeSeq = moment().format("YYYYMMDDhhmmss")
    this.postApplyData.txNo = moment().format("MMDDhhmmss")
    let param = {header:this.dataHeader,body:this.postApplyData}
    this.applyLoading = true ;
    this.service.handlePostData(param).subscribe(res => {
      this.applyLoading = false ;
      this.handleApplyDeliveryModalCancel();
      console.log("模擬結果:" + res) ;
      let result:any = res ;
      if(result.code == 200){
        this.table.listOfData = result.data ;
      } else {
        this.message.error(result.message)
      }
      
   }) ;
  }

}
