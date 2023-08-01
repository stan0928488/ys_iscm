import { Component, OnInit } from '@angular/core';
import { MSHService } from 'src/app/services/MSH/MSH.service';
import {NzMessageService} from "ng-zorro-antd/message";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
interface shopCodesItem {
  shopCode:string;
  columLabel:string;
  columValue:string;
  isNumber: number;
  columSort:number;
  category:string;
  remark:string;
}
@Component({
  selector: 'app-MSHI001',
  templateUrl: './MSHI001.component.html',
  styleUrls: ['./MSHI001.component.css'],
  providers:[NzMessageService]
})
export class MSHI001Component implements OnInit {
  constructor(private mshService:MSHService,private nzMessageService:NzMessageService) { }
  saveData:shopCodesItem[] = [] ;
  pageLoading = false ;
  selectShopCode = "" ;
  shopCodeList:any = [] ;
  allColumList:any = [] ;
  //所有選擇checked
  selectAllColumList:any = [] ;
  //編輯狀態使用 保存之後清除
  edited = false ;
  

  panels1:any = {
    active: true,
    name: '已配置欄位',
  };
  //expandIconPosition: 'left' | 'right' = 'left';
  expandIconPosition1: 'left' | 'right' = 'left';
  
  panels2:any = 
    {
      active: true,
      name: '可挑選欄位',
    };


  log(value: object): void {
    //過濾已經篩選數據
    this.selectAllColumList = this.allColumList.filter((item,index,array)=>{
      return item.checked === true ;
    })
   // console.log("checked:"+JSON.stringify(this.selectAllColumList) );
   this.edited = true ;
  }

  selectColumCheckedEach(i){
    console.log("選擇第幾筆數據" + JSON.stringify(this.allColumList[i]) )
     let checkItem =  this.allColumList[i] ;
     if(checkItem.checked === true) {  // 選擇的數據有兩種可能 1 checked = true 添加就直接追加到 挑選欄位
      // checkItem.columLabel = checkItem.label ;
      // checkItem.columValue = checkItem.value ;
      this.selectAllColumList.push(checkItem) ;
     }else{ // 選擇的數據有兩種可能 2 checked = false  從挑選欄位中移除
       this.selectAllColumList = this.selectAllColumList.filter((item,index,array)=>{
         return item.value !== checkItem.value ;
       })
     }
     this.edited = true ;
     console.log("選擇" + JSON.stringify(this.selectAllColumList) ) 
   }
 

  drop(event: CdkDragDrop<string[]>) {
    console.log(event.item)
    moveItemInArray(this.selectAllColumList, event.previousIndex, event.currentIndex);
    console.log("checked:"+JSON.stringify(this.selectAllColumList) );
    this.edited = true ;
  }
  saveCancel(): void {
    this.nzMessageService.info('click cancel');
  }

  saveConfirm($event:any): void {
    this.nzMessageService.info('click confirm');
    this.saveBtn($event)
  }
  saveBtn(event:any){
    console.log("save ")
    event.stopPropagation();
    this.edited = false ;
    this.panels1.active = true;
    this.saveData = [] ;
    this.selectAllColumList.forEach((item,index,array) => {
      var itemTemp:shopCodesItem = {
        shopCode:'',
        columLabel:item.label,
        columValue:item.value,
        isNumber:item.isNumber,
        columSort: index + 1,
        category:'A',
        remark:''
      } ;
      this.saveData.push(itemTemp) ;
    });
    console.log("保存數據：" +JSON.stringify(this.saveData))
    this.saveDataByAdmin();

  }
  saveDataComit(){

  }
  

  ngOnInit() {
    //獲取站別
    this.getShopCodes();
    //獲取所有欄位
    this.getAllColum();
   
  }
 //挑選站別
  selectShopCodeFunc(){
    console.log(this.selectShopCode)
    this.getSetColum();
  }
//獲取站別
  getShopCodes(){
    this.mshService.getShopCodes().subscribe(res=>{
      let result:any = res ;
      this.shopCodeList = result.data ;
      console.log(this.shopCodeList) ;
    })
  }
//獲取所有欄位
  getAllColum(){
    this.mshService.getAllColum().subscribe(res=>{
      let result:any = res ;
      this.allColumList = result.data ;
      console.log(this.shopCodeList) ;
       //獲取管理員配置
    this.getSetColumByAdmin();
    })
  }
//獲取管理員設定欄位
  getSetColum(){
    this.mshService.getSetColumByAdmin().subscribe(res=>{
      let result:any = res ;
      this.allColumList = result.data ;
      console.log(this.shopCodeList) ;
    })
  }
//管理員保存
saveDataByAdmin(){
  this.mshService.saveDataByAdmin(this.saveData).subscribe(res=>{
    let result:any = res ;
    console.log("管理員保存：" +res) ;
    this.nzMessageService.info(result.message)
     //獲取管理員配置
   this.getSetColumByAdmin();
  })
  
}
//管理員已配置
getSetColumByAdmin(){
  this.selectAllColumList = []
  this.mshService.getSetColumByAdmin().subscribe(res=>{
  let result:any = res ;
  let data:any[] = result.data;
  console.log("管理員已配置" +res) ;
  this.dbDataCovertSaveData(data);
})
}

//已選擇數據
dbDataCovertSaveData(data:any[]){
  data.forEach((item,index,arry) =>{
    let itemTemp = {
      label:item.columLabel,
      value:item.columValue,
      checked:true,
    }
    this.selectAllColumList.push(itemTemp)
    this.updateAllColumList(item.columValue)
  })

}

updateAllColumList(value:string){
  this.allColumList.forEach((item,index,array)=>{
    if(value === item.value) {
      this.allColumList[index].checked = true ;
    }
  })
}
}
