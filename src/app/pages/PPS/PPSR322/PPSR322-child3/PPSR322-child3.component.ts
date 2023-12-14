import { Component, OnDestroy, OnInit } from '@angular/core';
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';
import { Observable, catchError, map, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-PPSR322-child3',
  templateUrl: './PPSR322-child3.component.html',
  styleUrls: ['./PPSR322-child3.component.css'],
  providers: [NzMessageService],
})
export class PPSR322Child3Component implements OnInit, OnDestroy {
  listOfData: ItemData[] = [];
  otherInfo = {} as OtherInfo;
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
      this.getR322OtherInfo(this.searchData);
    });

    let tempObj = this.ppsr322EvnetBusComponent.searchObj as any;
    this.searchData.verList = tempObj.verList;
    this.getR322Data(this.searchData);
    this.getR322OtherInfo(this.searchData);
  }

  ngOnDestroy(): void {
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

  getR322OtherInfo(postData): Promise<void> {
    return new Promise<void>((resolve) => {
      postData['tabType'] = 3;
      this.PPSService.getR322OtherInfo(postData).subscribe((res) => {
        let result: any = res;
        if (result) {
          this.otherInfo = result as OtherInfo;
        } else {
          this.otherInfo = {} as OtherInfo;
        }
        resolve();
      });
    });
  }

  getInfo(postData): Observable<OtherInfo> {
    postData['tabType'] = 3;
    return this.PPSService.getR322OtherInfo(postData).pipe(
      map((res) => {
        let result: any = res;
        if (result) {
          this.otherInfo = result as OtherInfo;
          return this.otherInfo;
        } else {
          this.otherInfo = {} as OtherInfo;
          return this.otherInfo;
        }
      }),
      catchError((error) => {
        this.message.error('網絡請求失敗');
        throw error;
      })
    );
  }

  getR322Data(postData): Promise<void> {
    return new Promise<void>((resolve) => {
      postData['tabType'] = 3;
      this.PPSService.getR322Data(postData).subscribe({
        next: (res) => {
          let result: any = res;

          if (result[0]) {
            this.listOfData = result.map(
              (itemData) => itemData as ItemData
            ) as ItemData[];
            this.listOfData.map((element) => {
              element.dateDeliveryPpStr = moment(element.dateDeliveryPp).format(
                'YYYY-MM-DD'
              );
              element.rollDateStr = moment(element.rollDate).format(
                'YYYY-MM-DD'
              );
            });
          } else {
            this.listOfData = [];
          }
          resolve();
        },
        error: (e) => {
          this.message.error('網絡請求失敗');
        },
        complete: () => {},
      });
    });
  }

  getData(postData): Observable<ItemData[]> {
    postData['tabType'] = 3;
    return this.PPSService.getR322Data(postData).pipe(
      map((res) => {
        let result: any = res;
        if (result[0]) {
          this.listOfData = result.map(
            (itemData) => itemData as ItemData
          ) as ItemData[];
          this.listOfData.map((element) => {
            element.dateDeliveryPpStr = moment(element.dateDeliveryPp).format(
              'YYYY-MM-DD'
            );
            element.rollDateStr = moment(element.rollDate).format('YYYY-MM-DD');
          });
          return this.listOfData;
        } else {
          return (this.listOfData = []);
        }
      }),
      catchError((error) => {
        this.message.error('網絡請求失敗');
        throw error;
      })
    );
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
  rowspanSize: number;
}

interface OtherInfo {
  instructions: string;
}

interface SearchData {
  tabType: Number;
  verList: {
    fcpVer: String;
    shiftVer: String;
  };
}
