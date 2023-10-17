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
  searchData = {} as SearchData;

  constructor(
    private ppsr322EvnetBusComponent: PPSR322EvnetBusComponent,
    private PPSService: PPSService,
    private message: NzMessageService
  ) { }

  ngOnInit() {

    this.ppsr322EvnetBusComponent.on("ppsr322search", (data: any) => {

      if (data.data) {
        this.searchData.verList = data.data.verList;
      }
      this.getR322Data(this.searchData);

    })

    let tempObj = this.ppsr322EvnetBusComponent.searchObj as any
    this.searchData.verList = tempObj.verList; 
    this.getR322Data(this.searchData);

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
  instructions: string;
}

interface SearchData {
  tabType: Number;
  verList: {
    fcpVer: String,
    shiftVer: String
  };
}