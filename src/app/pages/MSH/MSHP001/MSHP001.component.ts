import { Component, OnInit } from '@angular/core';
import { MSHService } from 'src/app/services/MSH/MSH.service';
import {NzMessageService} from "ng-zorro-antd/message";
@Component({
  selector: 'app-MSHP001',
  templateUrl: './MSHP001.component.html',
  styleUrls: ['./MSHP001.component.css'],
  providers:[NzMessageService]

})
export class MSHP001Component implements OnInit {
  selectShopCode = "334" ;
  shopCodeList:any = [] ;
  //可展示欄位
  allColumList:any = [] ;
 //可以分群的數據
  groupColumList :any = [] ;
  //
  //table数据
  tbData :any = [] ;

  panels1:any = {
    active: true,
    name: '站別',
  };
  panels2:any = 
    {
      active: true,
      name: '可分群欄位',
    };
  constructor(private mshService:MSHService,private nzMessageService:NzMessageService) { }

  ngOnInit() {
    this.getShopCodes() ;
    this.getSetColumByUser() ;
  }

  log(value: string[]): void {
    console.log("checked:"+JSON.stringify(this.selectShopCode) );
    this.getSetColumGroupData();

  }
  getSetColumGroupData(){
    this.mshService.getSetColumGroupData(this.selectShopCode).subscribe(res=>{
      let result:any = res ;
      this.groupColumList = result.data ;
      this.getSetColumByUser() ;
    })
  }


  getSetColumByUser(){
    this.mshService.getSetColumByUser(this.selectShopCode).subscribe(res=>{
      let result:any = res ;
      this.allColumList = result.data ;
      
    })
  }
  getShopCodes(){
    this.mshService.getShopCodes().subscribe(res=>{
      let result:any = res ;
      this.shopCodeList = result.data ;
      console.log(this.shopCodeList) ;
      this.getSetColumGroupData();
    })
  }

   //挑選站別
   selectShopCodeFunc(){
    console.log("checked:"+JSON.stringify(this.selectShopCode) );
    this.getSetColumGroupData();
  }


}
