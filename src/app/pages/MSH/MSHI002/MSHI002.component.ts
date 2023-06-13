import { Component, OnInit } from '@angular/core';
import { MSHService } from 'src/app/services/MSH/MSH.service';
import {NzMessageService} from "ng-zorro-antd/message";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


interface shopCodesItem {
  shopCode:string;
  columLabel:string;
  columValue:string;
  isGroup: number;
  isOutside: number;
  isNumber: number;
  columSort:number;
  category:string;
  remark:string;
}
@Component({
  selector: 'app-MSHI002',
  templateUrl: './MSHI002.component.html',
  styleUrls: ['./MSHI002.component.css'],
  providers:[NzMessageService]
})
export class MSHI002Component implements OnInit {
  saveData:shopCodesItem[] = [] ;
  pageLoading = false ;
  selectShopCode = "334" ;
  shopCodeList:any = [] ;
  //可以挑選欄位
  allColumList:any = [] ;
  //已經挑選欄位
  selectAllColumList :any = [] ;
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
  ];
  edited = false ;
  expandIconPosition1: 'left' | 'right' = 'left';
  panels1:any = {
    active: true,
    name: '站別',
  };
  panels2:any = 
    {
      active: true,
      name: '可挑選欄位',
    };
    panels3:any = 
    {
      active: true,
      name: '已挑選欄位 （MO必選）',
    };

  selectColumChecked(value: string[]): void {
    console.log("checked:"+JSON.stringify(this.allColumList) );
     //過濾已經篩選數據
     this.selectAllColumList = this.allColumList.filter((item,index,array)=>{
      return item.checked === true ;
    })
    console.log("checked:"+JSON.stringify(this.selectAllColumList) );
   this.edited = true ;

  }

  drop(event: CdkDragDrop<string[]>) {
    this.edited = true ;
    moveItemInArray(this.selectAllColumList, event.previousIndex, event.currentIndex);
    console.log
  }

  saveBtn(event) {
    event.stopPropagation();
    console.log(event) ;
    this.edited = false ;
    this.saveData = [] ;
    this.selectAllColumList.forEach((item,index,array) => {
      var itemTemp:shopCodesItem = {
        shopCode:this.selectShopCode,
        columLabel:item.columLabel,
        columValue:item.columValue,
        isGroup:item.isGroup,
        isOutside:item.isOutside,
        isNumber:item.isNumber,
        columSort: index + 1,
        category:'B',
        remark:''
      } ;
      this.saveData.push(itemTemp) ;
    });
    console.log("保存數據：" +JSON.stringify(this.saveData))
    this.saveDataByAdmin();
  }
  clickCurrentFunc(index:number,item:any){
    this.edited = true ;
    this.selectAllColumList[index].isGroup = this.selectAllColumList[index].isGroup === 0 ? 1:0 ;
    console.log("選擇操作：" + JSON.stringify(this.selectAllColumList))
  }
  doubleClickCurrentFunc(index:number,item:any){
    this.edited = true ;
    this.selectAllColumList[index].isOutside = this.selectAllColumList[index].isOutside === 0 ? 1:0 ;
    console.log("選擇操作：" + JSON.stringify(this.selectAllColumList))
  }


  //User保存
saveDataByAdmin(){
  this.mshService.saveDataByUser(this.saveData).subscribe(res=>{
    let result:any = res ;
    console.log("管理員保存：" +res) ;
    this.nzMessageService.info(result.message)
     //獲取管理員配置
   this.getSetColumByAdminForUser();
  })
  
}
  constructor(private mshService:MSHService,private nzMessageService:NzMessageService) { }

  ngOnInit() {
    this.getShopCodes();
    //获取可选列表
    this.getSetColumByAdminForUser();
  }
 //挑選站別
  selectShopCodeFunc(){
    console.log(this.selectShopCode)
    this.getSetColumByAdminForUser();
  }

  getShopCodes(){
    this.mshService.getShopCodes().subscribe(res=>{
      let result:any = res ;
      this.shopCodeList = result.data ;
      console.log(this.shopCodeList) ;
    })
  }

  getSetColumByAdminForUser(){
    let _param = {'shopCode' : this.selectShopCode} ;
    this.mshService.getSetColumByAdminForUser(this.selectShopCode).subscribe(res=>{
      let result:any = res ;
      this.allColumList = result.data ;
      //console.log("獲取管理員設定排序:" + this.shopCodeList) ;
      //獲取User設定
      this.getSetColumByUser();
    })
  }

  getSetColumByUser(){
    let _param = {shopCode:this.selectShopCode}
    this.mshService.getSetColumByUser(this.selectShopCode).subscribe(res=>{
      let result:any = res ;
      this.selectAllColumList = result.data ;
      console.log("this.selectAllColumList:"+this.shopCodeList) ;
    })
  }



}
