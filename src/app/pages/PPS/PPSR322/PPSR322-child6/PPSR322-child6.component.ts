import { Component, OnDestroy, OnInit } from '@angular/core';
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';

@Component({
  selector: 'app-PPSR322-child6',
  templateUrl: './PPSR322-child6.component.html',
  styleUrls: ['./PPSR322-child6.component.css']
})
export class PPSR322Child6Component implements OnInit,OnDestroy,OnDestroy {

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

  constructor(private ppsr322EvnetBusComponent:PPSR322EvnetBusComponent) { }

  ngOnInit(){
    this.ppsr322EvnetBusComponent.on("ppsr322search",(data:any) => {
      console.log(data.data.fcpVer);
      console.log(data.data.maintainVer);
    })
  }

  ngOnDestroy(): void {
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

}
