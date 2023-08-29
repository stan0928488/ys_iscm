import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PPSR322EvnetBusComponent } from './PPSR322-evnet-bus/PPSR322-evnet-bus.component';

@Component({
  selector: 'app-PPSR322',
  templateUrl: './PPSR322.component.html',
  styleUrls: ['./PPSR322.component.less']
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
