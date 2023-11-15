import { Component, OnDestroy, OnInit } from '@angular/core';
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-PPSR322-child6',
  templateUrl: './PPSR322-child6.component.html',
  styleUrls: ['./PPSR322-child6.component.css'],
  providers: [NzMessageService],
})
export class PPSR322Child6Component implements OnInit, OnDestroy, OnDestroy {
  listOfData: ItemData[] = [];
  searchData = {} as SearchData;

  constructor(
    private ppsr322EvnetBusComponent: PPSR322EvnetBusComponent,
    private PPSService: PPSService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.ppsr322EvnetBusComponent.on('ppsr322search', (data: any) => {
      if (data.data) {
        this.searchData.verList = data.data.verList;
      }
      this.getR322Data(this.searchData);
    });

    let tempObj = this.ppsr322EvnetBusComponent.searchObj as any;
    this.searchData.verList = tempObj.verList;
    this.getR322Data(this.searchData);
  }

  ngOnDestroy(): void {
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

  getR322Data(postData) {
    postData['tabType'] = 6;
    this.PPSService.getR322Data(postData).subscribe({
      next: (res) => {
        let result: any = res;

        if (result[0]) {
          this.listOfData = result.map(
            (itemData) => itemData as ItemData
          ) as ItemData[];
        } else {
          this.listOfData = [];
        }
        this.sendData(5);
      },
      error: (e) => {
        this.message.error('網絡請求失敗');
      },
      complete: () => {},
    });
  }

  sendData(index: number) {
    const dataToSend = this.listOfData;
    this.ppsr322EvnetBusComponent.updateSharedData(index, dataToSend);
  }
}

interface ItemData {
  kindType: string;
  pstMachine: string;
  optimalDiaMin: number;
  optimalDiaMax: number;
  passWeight: number;
  outputShape: string;
  avgPassWeight: number;
  schShopCode: string;
  kindTypeRowspanSize: number;
  schShopCodeRowspanSize: number;
  kindTypeColSpanSize: number;
}

interface SearchData {
  tabType: Number;
  verList: {
    fcpVer: String;
    shiftVer: String;
  };
}
