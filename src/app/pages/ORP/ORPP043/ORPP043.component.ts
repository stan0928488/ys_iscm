import { Component, OnInit,Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Orp040Service } from 'src/app/services/ORP/orp040.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
const jsonToTable = require('json-to-table');

@Component({
  selector: 'app-ORPP043',
  templateUrl: './ORPP043.component.html',
  styleUrls: ['./ORPP043.component.css']
})
export class ORPP043Component implements OnInit {
  size: 'large' 
  leftTable = {
    tbHeader : [
      {
        label:'序號',
        value:'id'
      },
      {
        label:'客戶',
        value:'customer'
      },
      {
        label:'狀態',
        value:'status'
      },
      {
        label:'作業',
        value:'talkSession'
      },
      {
        label:'交談訊息',
        value:'msgCode'
      },
      {
        label:'Action',
        value:'Action'
      },
    ] ,
    tbData : [] ,
  }

  selectCustomer = "" ;
  rightTable = {
    tbHeader : [
      {
        label:'排序',
        value:'id'
      },
      // {
      //   label:'客戶',
      //   value:'customer'
      // },
      {
        label:'timeSeq',
        value:'txSerino'
      },
      {
        label:'txNo',
        value:'txNo'
      },
      {
        label:'交談作業',
        value:'tsName'
      },
      {
        label:'序號',
        value:'tsiSort'
      },
      {
        label:'方向',
        value:'tsiType'
      },
      {
        label:'交談訊息',
        value:'msgCode'
      },
      {
        label:'SERVICE',
        value:'service'
      },
      // {
      //   label:'有效作業',
      //   value:'useStatus'
      // },
      // {
      //   label:'DATA STREAM',
      //   value:'Action',
      //   width:'120px'
      // },
      {
        label:'Action',
        value:'Action'
      },
    ] ,
    tbData : [] ,
  }

  msgCode = ""
  handleLoading = false

  postData = {
    timeSeq:"" ,
    txNo:"",
    cstCode:"",
    msgCode:""
  }
  placement: NzDrawerPlacement = 'left';
  drawer = {
    visible:false,
    size:'large'
  }
  timer = null;

  drawerClose(){
    this.drawer.visible = !this.drawer.visible ;
  }
  jsonData = {} ;

  constructor(private service :Orp040Service,private modal: NzModalService) { }

  ngOnInit() {
    this.size = 'large';
    this.getData() ;
    //this.interfunc();
  }
  reloadData(){
    this.getData() ;
  }
  getData(){
    this.service.getAllCustomerByCondition().subscribe(res => {
      console.log("显示结果:" + JSON.stringify(res))
      let result : any = res ;
      this.leftTable.tbData = result.data ;
    }) ;
  }
  getTalkLogsData(cstCode:string){
    let param = {cstCode:cstCode} 
    this.service.getTalkLogsByCondition(param).subscribe(res => {
      let result : any = res ;
    
      this.rightTable.tbData = result.data ;
      console.log("获取日志:" + JSON.stringify(this.rightTable.tbData))
    }) ;
  }

  checkLog(id:any) {
    let temp:any = this.leftTable.tbData.filter((item, index, arry) =>{
      return item.id === id 
    })
    let tempItem = temp[0] ;
    this.selectCustomer = tempItem.cstNickname
    this.getTalkLogsData(tempItem.cstCode) ;
    console.log("选择公司 :" + JSON.stringify(temp)) ;
  }

  
  interfunc(){
    this.timer = setInterval(() => {
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 定时器正在执行...');
    }, 5000);
  }


  showCustomer(cstCode:string) :string  {
    let temp:any = this.leftTable.tbData.filter((item, index, arry) =>{
      return item.cstCode === cstCode 
    })
    let tempItem = temp[0] ;
    return tempItem.cstNickname  ;
  }
  destroyTplModal(modelRef: NzModalRef): void {
    modelRef.destroy();
  }
  selectCstCode = ""
  selectIdFun(id:any){
    let temp:any = this.leftTable.tbData.filter((item, index, arry) =>{
      return item.id === id 
    })
    let tempItem = temp[0] ;
    this.selectCustomer = tempItem.cstNickname ;
    this.selectCstCode = tempItem.cstCode ;

  }

  createTplModal(id:any,tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    let temp:any = this.leftTable.tbData.filter((item, index, arry) =>{
      return item.id === id 
    })
    let tempItem = temp[0] ;
    this.selectCustomer = tempItem.cstNickname ;
    this.selectCstCode = tempItem.cstCode ;
    this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        value: 'Template Context'
      },
      nzOnOk: () => console.log('Click ok')
    });
  }
  mockData(){
    this.handleLoading = true 
    console.log("input :" + this.msgCode)
    this.postData.cstCode = this.selectCstCode ;
    this.postData.msgCode = this.msgCode ;
    this.postData.timeSeq = moment().format("YYYYMMDDhhmmss")
    this.postData.txNo = moment().format("MMDDhhmmss")
    let postDataStr = {
      "cstCode":this.postData.cstCode,
      "msgCode":this.postData.msgCode,
      "timeSeq":this.postData.timeSeq,
      "txNo":this.postData.txNo,
    }

    this.service.handlePostData(this.postData).subscribe(res => {
      this.handleLoading = false 
      let result : any = res ;
      console.log("获取日志:" + res)
      this.getTalkLogsData(this.selectCstCode)
      this.getData();
    }) ;
   /* this.service.testPostData(this.postData).subscribe(res => {
      let result : any = res ;
      console.log("获取日志:" + res)
    })*/

  }
  queryJson(id){
    let temp:any = this.rightTable.tbData.filter((item, index, arry) =>{
      return item.id === id 
    })
    let tempItem = temp[0] ;
    this.jsonData = JSON.parse(tempItem.dataStr) ;
    this.drawer.visible = true ;
    const tabled = jsonToTable(this.jsonData);
  }

  termnateTalkSession(cstCode:any) {
    this.service.changeLogUseStatus(cstCode).subscribe(res => {
      this.handleLoading = false 
      let result : any = res ;
      console.log("获取日志:" + res)
      this.getTalkLogsData(this.selectCstCode)
      this.getData();
    }) ;

  }

  cancelTerm(){

  }

}
