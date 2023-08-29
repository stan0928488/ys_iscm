import { Component, OnDestroy, OnInit } from '@angular/core';
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { PPSService } from "src/app/services/PPS/PPS.service";

@Component({
  selector: 'app-PPSR322-child1',
  templateUrl: './PPSR322-child1.component.html',
  styleUrls: ['./PPSR322-child1.component.css']
})
export class PPSR322Child1Component implements OnInit,OnDestroy {

  listOfData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      tel: '0571-22098909',
      phone: 18889898989,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      tel: '0571-22098333',
      phone: 18889898888,
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'London No. 2 Lake Park'
    },
    {
      key: '5',
      name: 'Jake White',
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Dublin No. 2 Lake Park'
    }
  ];

  constructor(
    private ppsr322EvnetBusComponent:PPSR322EvnetBusComponent,
    private PPSService: PPSService,
  ) {}

  ngOnInit(){
    this.ppsr322EvnetBusComponent.on("ppsr322search",(data:any) => {
      console.log(data.data.fcpVer);
      console.log(data.data.maintainVer);
    })

    let postData = {};
    postData['tab'] = 1
    this.PPSService.getR322Data(postData).subscribe(res =>{
      console.log(res);
    });

  }

  ngOnDestroy(): void {
    console.log("PPSR322Child1 ngOnDestroy");
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

}
