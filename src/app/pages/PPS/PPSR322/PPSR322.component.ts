import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { PPSR322Child1Component } from './PPSR322-child1/PPSR322-child1.component';
import { PPSR322Child2Component } from './PPSR322-child2/PPSR322-child2.component';
import { PPSR322Child3Component } from './PPSR322-child3/PPSR322-child3.component';
import { PPSR322Child4Component } from './PPSR322-child4/PPSR322-child4.component';
import { PPSR322Child5Component } from './PPSR322-child5/PPSR322-child5.component';
import { PPSR322Child6Component } from './PPSR322-child6/PPSR322-child6.component';
import { Subject } from 'rxjs';
import { PPSR322EvnetBusComponent } from './PPSR322-evnet-bus/PPSR322-evnet-bus.component';

@Component({
  selector: 'app-PPSR322',
  templateUrl: './PPSR322.component.html',
  styleUrls: ['./PPSR322.component.css']
})
export class PPSR322Component implements OnInit,AfterViewInit {

  breadcrumbIndex:number = 0;
  clickSubject:Subject<any> = new Subject();
  searchObj = {
    fcpVer:String,
    maintainVer:String,
  };

  constructor(private ppsr322EvnetBusComponent:PPSR322EvnetBusComponent) { }

  ngOnInit(){
  }

  ngAfterViewInit(){
    this.breadcrumbIndex = this.ppsr322EvnetBusComponent.breadcrumbObj.index;
    this.searchObj = this.ppsr322EvnetBusComponent.searchObj;
  }

  notifyClick() {
    this.ppsr322EvnetBusComponent.emit({name:"ppsr322search",data:this.searchObj})
  }

  breadcrumbClick(index:number){
    this.ppsr322EvnetBusComponent.addToInventory({
      index:index
    },this.searchObj)
  }

}
