import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { Observable, catchError, map } from 'rxjs';

@Component({
  selector: 'app-PPSR322-child8',
  templateUrl: './PPSR322-child8.component.html',
  styleUrls: ['./PPSR322-child8.component.css'],
})
export class PPSR322Child8Component implements OnInit {
  listOfData: ItemData[] = [];
  searchData = {} as SearchData;
  mapOfExpandedData: { [schShopCode: string]: ItemData[] } = {};
  selectedSchShop = [{ label: '', value: '' }]; //站別選擇
  preSend: any;

  constructor(
    private ppsr322EvnetBusComponent: PPSR322EvnetBusComponent,
    private PPSService: PPSService,
    private message: NzMessageService
  ) {}

  async ngOnInit() {
    this.ppsr322EvnetBusComponent.on('ppsr322search', async (data: any) => {
      if (data.data) {
        this.searchData.verList = data.data.verList;
      }
      this.getR322Data(this.searchData);

      let postData = {};
      postData = this.searchData;
      postData['tabType'] = 8;
      this.PPSService.getR322OtherInfo(postData).subscribe((res) => {
        let result: any = res;
        if (result) {
          let shopCode: [] = result.shopCode.split(',');
          if (shopCode.length > 0) {
            for (let i = 0; i < shopCode.length; i++) {
              this.selectedSchShop.push({
                label: shopCode[i],
                value: shopCode[i],
              });
            }
          }
        }
      });
    });

    let tempObj = this.ppsr322EvnetBusComponent.searchObj as any;
    this.searchData.verList = tempObj.verList;
    this.searchData.schShop = tempObj.schShop;
    this.getR322Data(this.searchData);

    let postData = {};
    postData = this.searchData;
    postData['tabType'] = 8;
    this.PPSService.getR322OtherInfo(postData).subscribe((res) => {
      let result: any = res;
      if (result) {
        let shopCode: [] = result.shopCode.split(',');
        if (shopCode.length > 0) {
          for (let i = 0; i < shopCode.length; i++) {
            this.selectedSchShop.push({
              label: shopCode[i],
              value: shopCode[i],
            });
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

  getR322Data(postData): Promise<void> {
    return new Promise<void>((resolve) => {
      postData['tabType'] = 8;
      this.PPSService.getR322Data(postData).subscribe({
        next: (res) => {
          let result: any = res;

          if (result[0]) {
            this.listOfData = result.map(
              (itemData) => itemData as ItemData
            ) as ItemData[];
            //底色
            this.listOfData.forEach(function (value) {
              if (value.schShopCodeDisplay.indexOf('總計') != -1) {
                value.backgroupColor = '#92D050';
              } else if (value.schShopCodeDisplay.indexOf('合計') != -1) {
                value.backgroupColor = '#a3efd6';
              }

              if (value.children) {
                value.children.forEach(function (value2) {
                  if (value2.schShopCodeDisplay.indexOf('總計') != -1) {
                    value2.backgroupColor = '#92D050';
                  } else if (value2.schShopCodeDisplay.indexOf('合計') != -1) {
                    value2.backgroupColor = '#a3efd6';
                  }

                  value2.dateList.forEach(function (value3) {
                    if (value3.modelType == 'Y') {
                      value3.backgroupColor = '#efa5a3';
                    }
                  });
                });
              }

              value.dateList.forEach(function (value2) {
                if (value2.schShopCodeDisplay.indexOf('總計') != -1) {
                  value2.backgroupColor = '#92D050';
                } else if (value2.schShopCodeDisplay.indexOf('合計') != -1) {
                  value2.backgroupColor = '#a3efd6';
                }
              });
            });
            this.listOfData.forEach((item) => {
              this.mapOfExpandedData[item.schShopCode] =
                this.convertTreeToList(item);
            });
            this.sendData();
            resolve();
          } else {
            this.listOfData = [];
          }
        },
        error: (e) => {
          this.message.error('網絡請求失敗');
        },
        complete: () => {},
      });
    });
  }

  getData(postData): Observable<ItemData[]> {
    postData['tabType'] = 8;
    return this.PPSService.getR322Data(postData).pipe(
      map((res) => {
        let result: any = res;

        if (result[0]) {
          this.listOfData = result.map(
            (itemData) => itemData as ItemData
          ) as ItemData[];
          //底色
          this.listOfData.forEach(function (value) {
            if (value.schShopCodeDisplay.indexOf('總計') != -1) {
              value.backgroupColor = '#92D050';
            } else if (value.schShopCodeDisplay.indexOf('合計') != -1) {
              value.backgroupColor = '#a3efd6';
            }

            if (value.children) {
              value.children.forEach(function (value2) {
                if (value2.schShopCodeDisplay.indexOf('總計') != -1) {
                  value2.backgroupColor = '#92D050';
                } else if (value2.schShopCodeDisplay.indexOf('合計') != -1) {
                  value2.backgroupColor = '#a3efd6';
                }

                value2.dateList.forEach(function (value3) {
                  if (value3.modelType == 'Y') {
                    value3.backgroupColor = '#efa5a3';
                  }
                });
              });
            }

            value.dateList.forEach(function (value2) {
              if (value2.schShopCodeDisplay.indexOf('總計') != -1) {
                value2.backgroupColor = '#92D050';
              } else if (value2.schShopCodeDisplay.indexOf('合計') != -1) {
                value2.backgroupColor = '#a3efd6';
              }
            });
          });
          this.listOfData.forEach((item) => {
            this.mapOfExpandedData[item.schShopCode] =
              this.convertTreeToList(item);
          });
          // this.sendData(7);
          return this.listOfData;
        } else {
          this.listOfData = [];
          return [];
        }
      }),
      catchError((error) => {
        this.message.error('網絡請求失敗');
        throw error;
      })
    );
  }

  collapse(array: ItemData[], data: ItemData, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.schShopCode === d.schShopCode)!;
          target.expand = false;
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: ItemData): ItemData[] {
    const stack: ItemData[] = [];
    const array: ItemData[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      let node = stack.pop();
      array.push(node);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }

    return array;
  }

  sendData(): Promise<void> {
    const dataToSend = this.listOfData;
    console.log(dataToSend);
    this.preSend = dataToSend;
    this.ppsr322EvnetBusComponent.updateSharedData(dataToSend);
    return Promise.resolve();
  }

  emitShop(){
    this.ppsr322EvnetBusComponent.setShop(this.searchData.schShop);
  }
}

interface ItemData {
  dateTotal: number;
  schShopCode: string;
  schShopCodeDisplay: string;
  pstMachine: string;
  modelType: string;
  backgroupColor: string;
  pst?: Date;
  planWeightI?: number;
  level?: number;
  expand?: boolean;
  children?: ItemData[];
  parent?: ItemData;
  dateList?: ItemData[];
}

interface SearchData {
  tabType: Number;
  verList: {
    fcpVer: String;
    shiftVer: String;
  };
  schShop: [];
}
