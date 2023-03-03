import { Component, OnInit } from '@angular/core';
import { MSHService } from 'src/app/services/MSH/MSH.service';
import {NzMessageService} from "ng-zorro-antd/message";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-MSHI002',
  templateUrl: './MSHI002.component.html',
  styleUrls: ['./MSHI002.component.css'],
  providers:[NzMessageService]
})
export class MSHI002Component implements OnInit {

  pageLoading = false ;
  selectShopCode = "" ;
  shopCodeList:any = [] ;
  allColumList:any = [] ;
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

  panels1:any = {
    active: true,
    name: '站別',
  };
  panels2:any = 
    {
      active: true,
      name: '可挑選欄位',
    };
  log(value: string[]): void {
    console.log(value);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }
  constructor(private mshService:MSHService) { }

  ngOnInit() {
    this.getShopCodes();
    this.getAllColum();
  }
 //挑選站別
  selectShopCodeFunc(){
    console.log(this.selectShopCode)
    this.getSetColum();
  }

  getShopCodes(){
    this.mshService.getShopCodes().subscribe(res=>{
      let result:any = res ;
      this.shopCodeList = result.data ;
      console.log(this.shopCodeList) ;
    })
  }

  getAllColum(){
    this.mshService.getAllColum().subscribe(res=>{
      let result:any = res ;
      this.allColumList = result.data ;
      console.log(this.shopCodeList) ;
    })
  }

  getSetColum(){
    let _param = {shopCode:this.selectShopCode}
    this.mshService.getSetColumByUser(_param).subscribe(res=>{
      let result:any = res ;
      this.allColumList = result.data ;
      console.log(this.shopCodeList) ;
    })
  }



}
