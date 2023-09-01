import { Component, OnDestroy, OnInit } from '@angular/core';
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { PPSService } from "src/app/services/PPS/PPS.service";
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-PPSR322-child2',
  templateUrl: './PPSR322-child2.component.html',
  styleUrls: ['./PPSR322-child2.component.css'],
  providers:[NzMessageService]
})
export class PPSR322Child2Component implements OnInit,OnDestroy {

  listOfData: ItemData[] = [];
  searchData = {} as SearchData;

  constructor(
    private ppsr322EvnetBusComponent:PPSR322EvnetBusComponent,
    private PPSService: PPSService,
    private message: NzMessageService
  ) {}

  ngOnInit(){
    
    this.ppsr322EvnetBusComponent.on("ppsr322search", (data: any) => {

      if (data.data) {
        this.searchData.verList = data.data;
      }
      this.getR322Data(this.searchData);

    })

    this.searchData = {} as SearchData;
    this.getR322Data(this.searchData);

  }

  ngOnDestroy(): void {
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

  getR322Data(postData){
    postData['tabType'] = 2
    this.PPSService.getR322Data(postData).subscribe({
      next: (res) => {
        let result: any = res;

        if(result[0]){
          this.listOfData = result.map((itemData)=> itemData as ItemData) as ItemData[]
        }else{
          this.listOfData = [];
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
  kindType: string;
  diaRange: string;
  gradeNo: string;
  passMachineWeight: number;
  passMachineWeightNow: number;
}

interface SearchData {
  tabType: Number;
  verList: {
    fcpVer: String,
    shiftVer: String
  };
}