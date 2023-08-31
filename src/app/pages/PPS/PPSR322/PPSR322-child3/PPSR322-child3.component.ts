import { Component, OnDestroy, OnInit } from '@angular/core';
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { PPSService } from "src/app/services/PPS/PPS.service";
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';

@Component({
  selector: 'app-PPSR322-child3',
  templateUrl: './PPSR322-child3.component.html',
  styleUrls: ['./PPSR322-child3.component.css'],
  providers:[NzMessageService]
})
export class PPSR322Child3Component implements OnInit,OnDestroy {

  listOfData: ItemData[] = [];
  otherInfo = {
    instructions:""
  };

  constructor(
    private ppsr322EvnetBusComponent:PPSR322EvnetBusComponent,
    private PPSService: PPSService,
    private message: NzMessageService
  ) {}

  ngOnInit(){

    this.ppsr322EvnetBusComponent.on("ppsr322search",(data:any) => {
      
      let postData = {
        verList:{fcpVer:String,shiftVer:String},
        tabType:Number
      };
      postData.verList.fcpVer = data.data.fcpVer
      postData.verList.shiftVer = data.data.shiftVer
      this.getR322Data(postData);
      this.getR322OtherInfo(postData);
      
    })

    let postData = {};
    this.getR322Data(postData);
    this.getR322OtherInfo(postData);

  }

  ngOnDestroy(): void {

    this.ppsr322EvnetBusComponent.unsubscribe();

  }

  getR322OtherInfo(postData){

    postData['tabType'] = 3
    this.PPSService.getR322OtherInfo(postData).subscribe(res =>{
      let result: any = res;
      this.otherInfo.instructions = result.instructions;
    });

  }

  getR322Data(postData){

    postData['tabType'] = 3
    this.PPSService.getR322Data(postData).subscribe({
      next: (res) => {
        let result: any = res;

        if(result[0]){

          const data = [];
          for (let i = 0; i < result.length ; i++) {
            data.push({
              rollDate: result[i].rollDate,
              rollDateStr: result[i].rollDateStr,
              dateDeliveryPp: result[i].dateDeliveryPp,
              dateDeliveryPpStr: result[i].dateDeliveryPpStr,
              inputDia: result[i].inputDia,
              steelType: result[i].steelType,
              weight: result[i].weight,
              rowspanSize: result[i].rowspanSize
            });
          }
          this.listOfData = data;

          this.listOfData.map(element => {
            element.dateDeliveryPpStr =  moment(element.dateDeliveryPp).format("YYYY-MM-DD")
            element.rollDateStr =  moment(element.rollDate).format("YYYY-MM-DD")
          });

        }else{
          const data = [];
          this.listOfData = data;
        }

      },
      error: (e) => {
        this.message.error('網絡請求失敗');
      },
      complete: () => {}
    });
    
  }

}

interface ItemData {
  rollDate: Date;
  rollDateStr: string;
  dateDeliveryPp: Date;
  dateDeliveryPpStr: string;
  inputDia: number;
  steelType: string;
  weight: number;
  rowspanSize:number;
}