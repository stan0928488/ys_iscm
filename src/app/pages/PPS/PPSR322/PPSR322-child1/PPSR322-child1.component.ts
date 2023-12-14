import { Component, OnDestroy, OnInit } from '@angular/core';
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, catchError, map } from 'rxjs';

@Component({
  selector: 'app-PPSR322-child1',
  templateUrl: './PPSR322-child1.component.html',
  styleUrls: ['./PPSR322-child1.component.css'],
  providers: [NzMessageService],
})
export class PPSR322Child1Component implements OnInit, OnDestroy {
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
    console.log('PPSR322Child1 ngOnDestroy');
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

  getR322Data(postData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      postData['tabType'] = 1;
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
          resolve();
        },
        error: (e) => {
          this.message.error('網絡請求失敗');
          reject(e);
        },
        complete: () => {},
      });
    });
  }

  getData(postData): Observable<ItemData[]> {
    postData['tabType'] = 1;
    return this.PPSService.getR322Data(postData).pipe(
      map((res) => {
        let result: any = res;
        return result[0] ? result.map((itemData) => itemData as ItemData) : [];
      }),
      catchError((error) => {
        this.message.error('網絡請求失敗');
        throw error;
      })
    );
  }
}

interface ItemData {
  kindType: string;
  goalWeight: number;
  weight: number;
}

interface SearchData {
  tabType: Number;
  verList: {
    fcpVer: String;
    shiftVer: String;
  };
}
