import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PPSR322EvnetBusComponent } from './PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { PPSService } from "src/app/services/PPS/PPS.service";
import { Router} from '@angular/router';

@Component({
  selector: 'app-PPSR322',
  templateUrl: './PPSR322.component.html',
  styleUrls: ['./PPSR322.component.less']
})
export class PPSR322Component implements OnInit,AfterViewInit {

  selectedFcpVer = [{label:'',value:''}]; //版本选择
  selectedShiftVer = [{label:'',value:''}]; //版本选择

  breadcrumbIndex:number = 0;
  clickSubject:Subject<any> = new Subject();
  
  searchObj = {
    verList: {
      fcpVer: String,
      shiftVer: String
    },
    schShop:[]
  };

  constructor(
    private ppsr322EvnetBusComponent:PPSR322EvnetBusComponent,
    private PPSService: PPSService,
    private router: Router
  ) {}

  ngOnInit(){
    let postData = {};
    postData['verType'] = "fcp"
    this.PPSService.getR322VerList(postData).subscribe(res =>{
      let result: any = res;
      if(result.length > 0) {
        for(let i = 0 ; i<result.length ; i++) {
          this.selectedFcpVer.push({label:result[i].fcpVer, value:result[i].fcpVer})
        }
      }
    });

    postData['verType'] = "shift"
    this.PPSService.getR322VerList(postData).subscribe(res =>{
      let result: any = res;
      if(result.length > 0) {
        for(let i = 0 ; i<result.length ; i++) {
          this.selectedShiftVer.push({label:result[i].shiftVer, value:result[i].shiftVer})
        }
      }
    });

    

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
