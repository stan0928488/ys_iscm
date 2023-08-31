import { Component, OnDestroy, OnInit } from '@angular/core';
import { PPSService } from "src/app/services/PPS/PPS.service";
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-PPSR322-child5',
  templateUrl: './PPSR322-child5.component.html',
  styleUrls: ['./PPSR322-child5.component.css'],
  providers:[NzMessageService]
})
export class PPSR322Child5Component implements OnInit, OnDestroy {

  listOfData: ItemData[] = [];

  constructor(
    private ppsr322EvnetBusComponent: PPSR322EvnetBusComponent,
    private PPSService: PPSService,
    private message: NzMessageService
  ) { }

  ngOnInit() {

    this.ppsr322EvnetBusComponent.on("ppsr322search",(data:any) => {
      let postData = {
        verList:{fcpVer:String,shiftVer:String},
        tabType:Number
      };
      postData.verList.fcpVer = data.data.fcpVer
      postData.verList.shiftVer = data.data.shiftVer
      this.getR322Data(postData);
    })

    let postData = {};
    this.getR322Data(postData);

  }

  ngOnDestroy(): void {
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

  getR322Data(postData){

    postData['tabType'] = 5
    this.PPSService.getR322Data(postData).subscribe({
      next: (res) => {
        let result: any = res;

        if(result[0]){

          const data = [];
          for (let i = 0; i < result.length ; i++) {
            data.push({
              instructions: result[i].instructions,
            });
          }
          this.listOfData = data;

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
  instructions: string;
}
