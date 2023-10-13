import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PPSService } from "src/app/services/PPS/PPS.service";
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';

@Component({
  selector: 'app-PPSR322-child8',
  templateUrl: './PPSR322-child8.component.html',
  styleUrls: ['./PPSR322-child8.component.css']
})
export class PPSR322Child8Component implements OnInit {

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

    this.searchData.verList = this.ppsr322EvnetBusComponent.searchObj as any
    this.getR322Data(this.searchData);

  }

  ngOnDestroy(): void {
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

  getR322Data(postData){
    postData['tabType'] = 7
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
  seq:number;
  kindType:string;
  process:string;
  planWeightI:number;
  rowspanSize: number;
}

interface SearchData {
  tabType: Number;
  verList: {
    fcpVer: String,
    shiftVer: String
  };
}
