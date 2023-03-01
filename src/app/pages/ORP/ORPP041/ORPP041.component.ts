import { Component, OnInit } from '@angular/core';
import { Orp040Service } from 'src/app/services/ORP/orp040.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

interface talkSession {
  id? : number ,
  talkName:string,
  talkType:string,
  talkCode:string,
  talkApi:string,
  useStatus:boolean,
}
@Component({
  selector: 'app-ORPP041',
  templateUrl: './ORPP041.component.html',
  styleUrls: ['./ORPP041.component.css'],
  providers:[NzMessageService]
})
export class ORPP041Component implements OnInit {
 
  constructor(private service :Orp040Service,private modal: NzModalService,private message: NzMessageService) { }
  tbData = [] ;
  customerList = [];
  selectCustomerList = [] ;
  tbHeader = [
    {
      label:'排序',
      value:'id'
    },
    {
      label:'交談作業名稱',
      value:'talkName'
    },
    {
      label:'交談作業代碼',
      value:'talkCode'
    },
    {
      label:'作業版本',
      value:'talkVersion'
    },
    // {
    //   label:'作業类型',
    //   value:'talkType'
    // },
    {
      label:'服務接口',
      value:'talkApi'
    },
    {
      label:'啟用狀態',
      value:'usedStatus'
    },
    // {
    //   label:'刪除狀態',
    //   value:'delStatus'
    // },
    {
      label:'添加時間',
      value:'createTime'
    },
    {
      label:'客戶配置',
      value:'createTime'
    },
    {
      label:'Action',
      value:'Action'
    },
  ] ;
  isVisible = false ;
  isComitLoading = false ;
  modalTitle = ""
  selectTalkSession:any = {} ;
  //選擇客戶Id
  customerIds = [] ;
  editBtnStatus = true ;
  //修改Modal
  isEditVisible = false;
  modalEditTitle = "" ;
  isEditComitLoading = false
  //修改數據
  editData:talkSession = {
    id : 0 ,
    talkName:'',
    talkCode:'',
    talkType:'',
    talkApi:'',
    useStatus:true
    } ;


  checkOptions :object[]= [] ;
  ngOnInit() {
    this.getData() ;
    this.getCustomerData();
  }
  getData(){
    this.service.getTalkSessionAll().subscribe(res => {
      console.log("显示结果:" + JSON.stringify(res))
      let result : any = res ;
      this.tbData = result.data ;
    }) ;
  }
  getCustomerData(){
    this.service.getAllCustomerByCondition().subscribe(res => {
      console.log("显示结果:" + JSON.stringify(res))
      let result : any = res ;
      this.customerList = result.data ;
    }) ;
  }


  handleSetCustomer(id){
    console.log(id)
   var tbDataTemp = this.tbData.filter((val,index,array)=>{
     return val.id === id ;
    }) ;
    this.modalTitle = tbDataTemp[0].talkName  + "客戶配置";
    this.customerIds = []
    this.selectTalkSession = tbDataTemp[0] ;
    this.selectCustomerList = tbDataTemp[0].systemCustomers ;
    let checkOptionTemp = [] ;
    this.editBtnStatus = true ;
    //初始化check
    this.customerList.forEach((val,index,array)=>{
      let checkedTemp = false ;
      this.selectCustomerList.forEach((val1,index1,array1)=>{
        if(val1.id === val.id) {
          checkedTemp = true 
          return ;
          }
      })
      let option = {label:val.cstNickname,value:val.id,checked:checkedTemp} ;
      checkOptionTemp.push(option) ;
    })
    this.checkOptions = checkOptionTemp ;
   // console.log("选择客户：" + JSON.stringify(this.selectCustomerList)) ;
    this.isVisible = true 
  }
 //多選事件
  changeChecked(value: any[]){
    this.editBtnStatus = false 
    console.log(value) ;
    let customerIdsTemp = [] ;
    value.forEach((val)=>{
      if(val.checked === true){
        customerIdsTemp.push(val.value) ;
      }
    })
    this.customerIds = customerIdsTemp ;
  }
//提交配置
  comitSetCustomer() {
    let talkSessionId = this.selectTalkSession.id.toString() ;
    // if(this.customerIds.length < 1) {
    //   this.notificationMessage("請至少選擇一家客戶進行配置！","error") ;
    // }
    console.log("talkSessionId === " + talkSessionId)
    console.log("customerIds === " + this.customerIds)
    let param = {"talkSessionId":talkSessionId,"customerIds": this.customerIds.toString()}
    this.service.saveRelation(param).subscribe(res => {
      console.log("显示结果:" + JSON.stringify(res))
      let result: any = res ;
      this.message.info(result.message) ;
      this.getData() ;
      this.isVisible = false
    }) ;


  }

  notificationMessage(message:string, type:string){
    let title = "提示訊息" ;
    switch(type) {
      case "info" : 
      this.modal.info({
        nzTitle: '提示訊息',
        nzContent: message ,
        nzOkText:'知道了'
      });
      break ;
      case "success" : 
      this.modal.success({
        nzTitle: '提示訊息',
        nzContent: message ,
        nzOkText:'知道了'
      });
      break ;
      case "error" : 
      this.modal.error({
        nzTitle: '提示訊息',
        nzContent: message ,
        nzOkText:'知道了'
      });
      break ;
      case "warning" : 
      this.modal.warning({
        nzTitle: '提示訊息',
        nzContent: message ,
        nzOkText:'知道了'
      });
      break ;
      default : 
      this.modal.info({
        nzTitle: '提示訊息',
        nzContent: message ,
        nzOkText:'知道了'
      });
      break ;
    }
  }

  handleModalCancel(){
    this.isVisible = false 
  }

  handleEditModalCancel(){
    this.isEditVisible = false ;
  }

  saveTalkSession(){

  }

  showDeleteConfirm(id:any): void {
    this.modal.confirm({
      nzTitle: '確認刪除當前記錄嗎？',
      nzContent: '<b style="color: red;">刪除之後，不可使用</b>',
      nzOkText: '確定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        console.log("刪除:" + id)
        this.service.delTalkSession(id).subscribe(() => {
          this.getData();
        });
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
    }

    editCustomer(id:any){
      this.isEditVisible = true ;
      if(id === 0) {
        this.modalEditTitle = "新增" ;
      } else {
        this.modalEditTitle = "新增" ;
      }

    }


}
