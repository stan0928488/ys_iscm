import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

interface Message {
  messageId: string ,
  messageCode:string,
  messageContent:string,
  messageType:string,//1 问 2答 
  from:string,
  to:string,
  endFlag:boolean, //結束標記 Y 已經結束 N 尚未結束
  type:string, //text 單純消息  //table 單純表格 tablecheck 帶有check的表格 workbutton //作业单
  data:any 
}

@Component({
  selector: 'app-ORPPCHATDEMO',
  templateUrl: './ORPPCHATDEMO.component.html',
  styleUrls: ['./ORPPCHATDEMO.component.css']
})


export class ORPPCHATDEMOComponent implements OnInit {
  messageFrom = '運錩' ; 
  messageList : Message[] = [] ;
  chatStatus =  false ;

  timer = setInterval(() => {
    console.log("current date :" + moment().format("YYYY-MM-DD HH:mm::ss"))
    if(this.chatStatus === false) {
      this.initHelloMessage() ;
      this.initWorkMessage();
    }
    
  }, 30000);

  constructor() { }

  ngOnInit() {
    //初始化過往訊息列表
    this.initLocalStorage() ;
    //
    //this.timer ;

    this.timer = setInterval(() => {
      console.log("current date :" + moment().format("YYYY-MM-DD HH:mm::ss"))

      if(this.chatStatus === false) {
        this.initHelloMessage() ;
        this.initWorkMessage();
      }
      
    }, 5000);

  }
  workFunBtn(messageId:any,talkId:any) {
    this.chatStatus = true ;
    console.log(messageId) 
    console.log(talkId)

  }
  //
  initLocalStorage(){
    this.messageList = JSON.parse(localStorage.getItem("chatMessage"))  ;
    if(this.messageList === null) {
      this.messageList = [];
    }
  }

  initHelloMessage(){
    let messageTemp:Message = {
      messageId: moment().valueOf().toString(),
      messageCode:'2001',
      messageContent:'您好，運錩',
      messageType: '2',//答
      from: '華新', //華新
      to: '運錩',
      endFlag: true,
      type: 'text',
      data: undefined
    }

    this.messageList.push(messageTemp) ;
  }

  initWorkMessage(){
    let messageTemp:Message = {
      messageId: moment().valueOf().toString(),
      messageCode:'2002',
      messageContent:'您想要咨詢以下哪些作業？',
      messageType: '2',//答
      from: '華新', //華新
      to: '運錩',
      endFlag: false,
      type: 'workbutton',
      data: {

      }
    }

    this.messageList.push(messageTemp) ;
  }


  initM21Message(){
    let askMessage :Message ={
      messageId: moment().valueOf().toString(),
      messageCode: '10001',
      messageContent: '我想查詢當前訂單訊息',
      messageType: '1',
      from: '運錩',
      to: '華新',
      endFlag: true,
      type: 'text',
      data: undefined
    }
    this.messageList.push(askMessage) ;

    let anwMessage :Message ={
      messageId: moment().valueOf().toString(),
      messageCode: '10001',
      messageContent: '我想查詢當前訂單訊息',
      messageType: '1',
      from: '運錩',
      to: '華新',
      endFlag: true,
      type: 'table',
      data: {
        tableHeader:[
          {label:'訂單號碼', value:'orderNo'},
          {label:'訂單項次', value:'orderItem'},
          {label:'已出貨', value:'shipped'},
          {label:'待出貨', value:'shipping'},
          {label:'餘量', value:'restShip'},
          {label:'餘量如期', value:'restShipDate'},
          {label:'餘量逾期', value:'ShipDate'},
          {label:'訂單交期', value:'deliveryDate'},
          {label:'預計入庫', value:'storageDate'}
        ],
        tableContent:[
          {orderNo:"Y1",orderItem:"01", shipped:"3",shipping:"4",restShip:"5",restShipDate:"2023-04-10",ShipDate:"2023-04-10",deliveryDate:"2023-04-10",storageDate:"2023-04-10"},
          {orderNo:"Y1",orderItem:"02", shipped:"3",shipping:"4",restShip:"5",restShipDate:"2023-04-10",ShipDate:"2023-04-10",deliveryDate:"2023-04-10",storageDate:"2023-04-10"},
          {orderNo:"Y2",orderItem:"01", shipped:"3",shipping:"4",restShip:"5",restShipDate:"2023-04-10",ShipDate:"2023-04-10",deliveryDate:"2023-04-10",storageDate:"2023-04-10"},
          {orderNo:"Y2",orderItem:"02", shipped:"3",shipping:"4",restShip:"5",restShipDate:"2023-04-10",ShipDate:"2023-04-10",deliveryDate:"2023-04-10",storageDate:"2023-04-10"},
        ]
      }
    }
    this.messageList.push(anwMessage) ;


  }





}
