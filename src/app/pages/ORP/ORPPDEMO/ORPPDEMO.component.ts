import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Orp040Service } from 'src/app/services/ORP/orp040.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-ORPPDEMO',
  templateUrl: './ORPPDEMO.component.html',
  styleUrls: ['./ORPPDEMO.component.css'],
  providers:[NzMessageService]
})
export class ORPPDEMOComponent implements OnInit {
  customer = "運錩"
  orderNo = "T00000001"
  orderMaster = {
    preOrderNo:'T00000001' ,
    orderSatus:'T'
  }
  table = {
    header: [
      // {
      //   lable:'客戶名稱',
      //   value: 'customer'
      // },
      // {
      //   lable:'預進單號',
      //   value: 'orderNo'
      // },

      {
        lable:'選擇',
        value: 'checked',
        bgcolor:'trbg'
      },
      {
        lable:'產品編號',
        value: 'orderItemId',
        bgcolor:'trbg'
      },
      {
        lable:'項次',
        value: 'batch',
        bgcolor:'trbg'
      },
      {
        lable:'寬度',
        value: 'width',
        bgcolor:'trbg'
      },
      {
        lable:'訂單厚度上限',
        value: 'thicknessUpper',
        bgcolor:'trbg'
      },
      {
        lable:'訂單厚度下限',
        value: 'thicknessLower',
        bgcolor:'trbg'
      },
      {
        lable:'修邊',
        value: 'bianXiu',
        bgcolor:'trbg'
      },
      {
        lable:'需求量',
        value: 'demand',
        bgcolor:'trbg'
      },
      {
        lable:'重量',
        value: 'weight',
        bgcolor:'trbg1'
      },
      {
        lable:'希望交期',
        value: 'deliveryDate',
        bgcolor:'trbg'
      },
      {
        lable:'預計交期',
        value: 'preDeliveryDate',
        bgcolor:'trbg1'
      },
      {
        lable:'是否拆項',
        value: 'isBatch',
        bgcolor:'trbg1'
      },
      {
        lable:'預留狀態',
        value: 'isReserve',
        bgcolor:'trbg1'
      },
      {
        lable:'新編號',
        value: 'newOrderItemId',
        bgcolor:'trbg1'
      },
    ],
    listOfData:[
      {

        orderItemId:'T0000000101' ,
        batch:'01',
        width:'1240',
        thicknessUpper:'0.8',
        thicknessLower:'0.9',
        bianXiu:'N',
        demand:'60',
        weight:'',
        deliveryDate:'2023-02-28',
        preDeliveryDate:'',
        isBatch:'',
        isReserve:'',
        newOrderItemId:'',
      },
      {
        orderItemId:'T0000000102' ,
        batch:'02',
        width:'1530',
        thicknessUpper:'0.8',
        thicknessLower:'0.9',
        bianXiu:'N',
        demand:'20',
        weight:'',
        deliveryDate:'2023-02-28',
        preDeliveryDate:'',
        isBatch:'',
        isReserve:'',
        newOrderItemId:'',
      },

    ]
  }
  postData = {
    timeSeq:moment().format("YYYYMMDDhhmmss") ,
    txNo:moment().format("MMDDhhmmss"),
    cstCode:"",
    msgCode:"",
    data:{
      preOrderNo:'T00000001' ,
      orderStatus:'T',
      list:[
        {
          orderItemId:'T0000000101' ,
          batch:'01',
          width:'1240',
          thicknessUpper:'0.8',
          thicknessLower:'0.9',
          bianXiu:'N',
          demand:'60',
          deliveryDate:'2023-02-28',
        },
        {
          orderItemId:'T0000000102' ,
          batch:'02',
          width:'1530',
          thicknessUpper:'0.8',
          thicknessLower:'0.9',
          bianXiu:'N',
          demand:'20',
          deliveryDate:'2023-02-28',
        }
      ]
    }
  }
  constructor(private service :Orp040Service,private message :NzMessageService) { }
  comitData(){
    this.postData.cstCode = '22533297' ;
    if(this.orderMaster.orderSatus === 'T') {
      this.postData.msgCode = 'M110101' ;
      this.postData.data.orderStatus = "T";
    }
    if(this.orderMaster.orderSatus === 'P') {
      this.postData.msgCode = 'M110201' ;
      this.postData.data.orderStatus = "P" ;
      this.postData.data.list = this.table.listOfData ;
    }
    // this.postData.timeSeq = moment().format("YYYYMMDDhhmmss")
    // this.postData.txNo = moment().format("MMDDhhmmss")
    this.postData.cstCode = '22533297' ;
    this.postData.timeSeq = moment().format("YYYYMMDDhhmmss")
    this.postData.txNo = moment().format("MMDDhhmmss")
    let header = {apiId:"ECC01",
    date:"2023-01-19",
    time:"01:31:21",
    from:"C_ID",
    to:"W_ID",
    token:"1234566",
    userId:"23"}
    let param = {header:header,body:this.postData}

    this.service.handlePostData(param).subscribe(res => {
       console.log("模擬結果:" + res) ;
       let result:any = res ;
       if(result.code === 200) {
        this.orderMaster.orderSatus = result.data.orderStatus ;
        this.table.listOfData = result.data.list ;
       } else {
        this.message.error(result.message)
       }
     
    }) ;
  }
  checked = true 
  ngOnInit() {
  }
  change(){
    console.log("customer:"+this.customer)
    console.log("orderNo:"+this.orderNo)

  }

}
