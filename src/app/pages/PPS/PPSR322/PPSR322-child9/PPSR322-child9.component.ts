import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { PPSR322EvnetBusComponent } from '../PPSR322-evnet-bus/PPSR322-evnet-bus.component';

@Component({
  selector: 'app-PPSR322-child9',
  templateUrl: './PPSR322-child9.component.html',
  styleUrls: ['./PPSR322-child9.component.css'],
})
export class PPSR322Child9Component implements OnInit {
  listOfData: ItemData[] = [];
  searchData = {} as SearchData;
  mapOfExpandedData: { [schShopCode: string]: ItemData[] } = {};

  constructor(
    private ppsr322EvnetBusComponent: PPSR322EvnetBusComponent,
    private PPSService: PPSService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.ppsr322EvnetBusComponent.on('ppsr322search', (data: any) => {
      if (data.data) {
        this.searchData.verList = data.data.verList;
        this.searchData.schShop = data.data.schShop;
      }
      this.getR322Data(this.searchData);
    });

    let tempObj = this.ppsr322EvnetBusComponent.searchObj as any;
    this.searchData.verList = tempObj.verList;
    this.searchData.schShop = tempObj.schShop;
    this.getR322Data(this.searchData);
  }

  ngOnDestroy(): void {
    this.ppsr322EvnetBusComponent.unsubscribe();
  }

  getR322Data(postData) {
    postData['tabType'] = 9;
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
                } else if (value2.modelType == 'Y') {
                  value2.backgroupColor = '#efa5a3';
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
              } else if (value2.modelType == 'Y') {
                value2.backgroupColor = '#efa5a3';
              }
            });
          });
          this.listOfData.forEach((item) => {
            this.mapOfExpandedData[item.schShopCode] =
              this.convertTreeToList(item);
          });
        } else {
          this.listOfData = [];
        }
        this.sendData(8);
      },
      error: (e) => {
        this.message.error('網絡請求失敗');
      },
      complete: () => {},
    });
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

  sendData(index: number) {
    const dataToSend = this.listOfData;
    this.ppsr322EvnetBusComponent.updateSharedData(index, dataToSend);
  }
}

interface ItemData {
  dateTotal: number;
  schShopCode: string;
  schShopCodeDisplay: string;
  kindType: string;
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
