import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Orp040Service } from 'src/app/services/ORP/orp040.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-ORPP040',
  templateUrl: './ORPP040.component.html',
  styleUrls: ['./ORPP040.component.css'],
  providers: [NzMessageService]
})
export class ORPP040Component implements OnInit {
  tbData = [] ;
  tbLoading= false ;
  tbHeader = [
    {
      label:'排序',
      value:'id'
    },
    {
      label:'公司代碼',
      value:'cstCode'
    },
    {
      label:'公司名',
      value:'cstName'
    },
    {
      label:'公司簡稱',
      value:'cstNickname'
    },
    // {
    //   label:'英文名',
    //   value:'cstNameEn'
    // },
    // {
    //   label:'地址',
    //   value:'cstAddress'
    // },
    // {
    //   label:'客戶類型',
    //   value:'cstType'
    // },
    {
      label:'郵箱',
      value:'cstEmail'
    },
   
    {
      label:'聯繫人',
      value:'cstUser'
    },
    {
      label:'聯繫方式',
      value:'cstPhone'
    },
    // {
    //   label:'固話',
    //   value:'cstLandline'
    // },
    // {
    //   label:'授權碼',
    //   value:'cstAuthCode'
    // },
    {
      label:'服務狀態',
      value:'serviceStatus'
    },
    {
      label:'Action',
      value:'Action'
    },
  ]
  constructor(private service :Orp040Service, private message: NzMessageService) { }

  ngOnInit() {
    this.getData() ;
  }
  getData(){
    this.service.getCustomerList().subscribe(res => {
      console.log("显示结果:" + JSON.stringify(res))
      let result : any = res ;
      this.tbData = result.data ;
    }) ;
  }

  changeStatusBtn(id) {
    this.service.changetCustomerStatus(id).subscribe(res => {
      console.log("显示结果:" + JSON.stringify(res))
      let result:any = res ;
      this.message.info(result.message)
      this.getData() ;
    }) ;
  }

  cancelConfirm(){

  }
}
