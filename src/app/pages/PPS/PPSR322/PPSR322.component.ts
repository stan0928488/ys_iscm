import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Subject, take, lastValueFrom, from, Subscription } from 'rxjs';
import { PPSR322EvnetBusComponent } from './PPSR322-evnet-bus/PPSR322-evnet-bus.component';
import { PPSR322Child1Component } from './PPSR322-child1/PPSR322-child1.component';
import { PPSR322Child2Component } from './PPSR322-child2/PPSR322-child2.component';
import { PPSR322Child3Component } from './PPSR322-child3/PPSR322-child3.component';
import { PPSR322Child4Component } from './PPSR322-child4/PPSR322-child4.component';
import { PPSR322Child5Component } from './PPSR322-child5/PPSR322-child5.component';
import { PPSR322Child6Component } from './PPSR322-child6/PPSR322-child6.component';
import { PPSR322Child7Component } from './PPSR322-child7/PPSR322-child7.component';
import { PPSR322Child8Component } from './PPSR322-child8/PPSR322-child8.component';
import { PPSR322Child9Component } from './PPSR322-child9/PPSR322-child9.component';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { ExcelService } from 'src/app/services/common/excel.service';
import { DatePipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-PPSR322',
  templateUrl: './PPSR322.component.html',
  styleUrls: ['./PPSR322.component.less'],
  providers: [
    PPSR322Child1Component,
    PPSR322Child2Component,
    PPSR322Child3Component,
    PPSR322Child4Component,
    PPSR322Child5Component,
    PPSR322Child6Component,
    PPSR322Child7Component,
    PPSR322Child8Component,
    PPSR322Child9Component,
    DatePipe,
    NzMessageService,
  ],
})
export class PPSR322Component implements OnInit, AfterViewInit {
  @ViewChild('tabGroup') tabGroup: any;
  @ViewChild(PPSR322Child8Component) ppsr322Child8: PPSR322Child8Component;

  selectedFcpVer = [{ label: '', value: '' }]; //版本选择
  selectedShiftVer = [{ label: '', value: '' }]; //版本选择

  breadcrumbIndex: number = 0;
  clickSubject: Subject<any> = new Subject();

  childData1: any[] = [];
  childData2: any[] = [];
  childData3: any[] = [];
  preInfo3: OtherInfo = { instructions: '' };
  childDataInfo3: string[] = [];
  childData4: any[] = [];
  preInfo4: OtherInfo = { instructions: '' };
  childDataInfo4: string[] = [];
  childData5: any[] = [];
  childDataInfo5: any[] = [];
  childData6: any[] = [];
  childData7: any[] = [];
  childData8: any[] = [];
  childData9: any[] = [];
  childData10: netItem[] = [];
  indexxx: any;

  searchObj = {
    verList: {
      fcpVer: String,
      shiftVer: String,
    },
    schShop: [],
  };

  constructor(
    private ppsr322EvnetBusComponent: PPSR322EvnetBusComponent,
    private ppsr332child1: PPSR322Child1Component,
    private ppsr332child2: PPSR322Child2Component,
    private ppsr332child3: PPSR322Child3Component,
    private ppsr332child4: PPSR322Child4Component,
    private ppsr332child5: PPSR322Child5Component,
    private ppsr332child6: PPSR322Child6Component,
    private ppsr332child7: PPSR322Child7Component,
    private ppsr332child8: PPSR322Child8Component,
    private ppsr332child9: PPSR322Child9Component,
    private PPSService: PPSService,
    private router: Router,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private message: NzMessageService
  ) {}

  private subscription: Subscription;
  ngOnInit() {
    let postData = {};
    postData['verType'] = 'fcp';
    this.PPSService.getR322VerList(postData).subscribe((res) => {
      let result: any = res;
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          this.selectedFcpVer.push({
            label: result[i].fcpVer,
            value: result[i].fcpVer,
          });
        }
      }
    });

    postData['verType'] = 'shift';
    this.PPSService.getR322VerList(postData).subscribe((res) => {
      let result: any = res;
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          this.selectedShiftVer.push({
            label: result[i].shiftVer,
            value: result[i].shiftVer,
          });
        }
      }
    });
  }

  ngAfterViewInit() {
    this.breadcrumbIndex = this.ppsr322EvnetBusComponent.breadcrumbObj.index;
    this.searchObj = this.ppsr322EvnetBusComponent.searchObj;
  }

  async notifyClick() {
    this.message.info('查詢中');
    this.childData1 = [];
    this.childData2 = [];
    this.childData3 = [];
    this.childDataInfo3 = [];
    this.childData4 = [];
    this.childDataInfo4 = [];
    this.childData5 = [];
    this.childDataInfo5 = [];
    this.childData6 = [];
    this.childData7 = [];
    this.childData8 = [];
    this.childData9 = [];
    this.childData10 = [];
    this.dataSet = [];
    this.listDate = [];
    this.ppsr322EvnetBusComponent.emit({
      name: 'ppsr322search',
      data: this.searchObj,
    });
    const searchData = {
      verList: this.searchObj.verList,
    };
    const promises = [
      this.ppsr332child1.getData(searchData).toPromise(),
      this.ppsr332child2.getData(searchData).toPromise(),
      this.ppsr332child3.getData(searchData).toPromise(),
      this.ppsr332child4.getData(searchData).toPromise(),
      this.ppsr332child5.getData(searchData).toPromise(),
      this.ppsr332child6.getData(searchData).toPromise(),
      this.ppsr332child7.getData(searchData).toPromise(),
      this.indexxx !== 7
        ? this.ppsr332child8.getData(searchData).toPromise()
        : null,
      this.ppsr332child9.getData(searchData).toPromise(),
    ];
    const [
      childData1,
      childData2,
      childData3,
      childData4,
      childData5,
      childData6,
      childData7,
      childData8,
      childData9,
    ] = await Promise.all(promises);

    const promisesInfo = [
      this.ppsr332child3.getInfo(searchData).toPromise(),
      this.ppsr332child4.getInfo(searchData).toPromise(),
    ];

    const [
      childDataInfo3, // 使用 this.childDataInfo3
      childDataInfo4,
    ] = await Promise.all(promisesInfo);

    this.childData1 = childData1;
    this.childData2 = childData2;
    this.childData3 = childData3;
    this.childDataInfo3 = childDataInfo3.instructions.split('\n');
    this.childData4 = childData4;
    this.childDataInfo4 = childDataInfo4.instructions.split('\n');
    this.childData5 = childData5;
    this.childData6 = childData6;
    this.childData7 = childData7;
    this.childData8 = childData8;
    this.childData9 = childData9;

    if (this.indexxx === 7) {
      this.subscription = this.ppsr322EvnetBusComponent.sharedData$.subscribe(
        (data) => {
          console.log(data);
          this.childData8 = data.data;
          console.log(this.childData8);
        }
      );
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.message.success('查詢完成');
  }

  breadcrumbClick(index: number) {
    this.ppsr322EvnetBusComponent.addToInventory(
      {
        index: index,
      },
      this.searchObj
    );
    this.indexxx = index;
  }

  listDate: string[] = [];
  dataSet: any[];
  dataSetInfo: any[];
  exportExcel() {
    for (let i = 0; i < this.childData5.length; i++) {
      const one = this.childData5[i].instructions.split(/(?=\d+\.)/);
      for (let k = 0; k < one.length; k++) {
        if (k === 0) {
          this.childDataInfo5.push({
            first: one[k],
          });
        } else {
          this.childDataInfo5.push({
            sort: one[k],
          });
        }
      }
    }

    for (let i = 0; i < this.childData8.length; i++) {
      const children = this.childData8[i]['children'];
      const dataList = this.childData8[i]['dateList'];

      if (dataList && dataList.length > 0) {
        const newData = {
          schShopCodeDisplay: dataList[0].schShopCodeDisplay,
          pstMachine: '',
          dateTotal: this.childData8[i].dateTotal,
        };

        for (let k = 0; k < dataList.length; k++) {
          const dynamicPropertyName = `planWeightI${k + 1}`;
          newData[dynamicPropertyName] = dataList[k]['planWeightI'];
          if (i == 0) {
            this.listDate.push(
              this.datePipe.transform(dataList[k]['pst'], 'yyyy-MM-dd')
            );
          }
        }

        this.childData10.push(newData);
      }

      if (children && children.length > 0) {
        for (let j = 0; j < children.length; j++) {
          const newData = {
            pstMachine: children[j]['pstMachine'],
          };

          for (let k = 0; k < children[j]['dateList'].length; k++) {
            const dynamicPropertyName = `planWeightI${k + 1}`;
            newData[dynamicPropertyName] =
              children[j]['dateList'][k]['planWeightI'];
          }

          this.childData10.push(newData);
        }
      }
    }

    this.childData10.push({
      schShopCodeDisplay: '',
      pstMachine: '',
      dateTotal: '',
    });

    for (let i = 0; i < this.childData9.length; i++) {
      const children = this.childData9[i]['children'];
      const dataList = this.childData9[i]['dateList'];

      if (dataList && dataList.length > 0) {
        const newData = {
          schShopCodeDisplay: dataList[0].schShopCodeDisplay,
          dateTotal: this.childData9[i].dateTotal,
        };

        for (let k = 0; k < dataList.length; k++) {
          const dynamicPropertyName = `planWeightI${k + 1}`;
          newData[dynamicPropertyName] = dataList[k]['planWeightI'];
        }

        this.childData10.push(newData);
      }

      if (children && children.length > 0) {
        for (let j = 0; j < children.length; j++) {
          const newData = {
            pstMachine: children[j]['kindType'],
          };

          for (let k = 0; k < children[j]['dateList'].length; k++) {
            const dynamicPropertyName = `planWeightI${k + 1}`;
            newData[dynamicPropertyName] =
              children[j]['dateList'][k]['planWeightI'];
          }

          this.childData10.push(newData);
        }
      }
    }

    for (let i = 0; i < this.childData3.length; i++) {
      const data = this.childData3[i].steelType;
      if (data === '合計') {
        this.childData3[i].dateDeliveryPpStr = null;
        this.childData3[i].rollDateStr = null;
      }
    }

    for (let i = 0; i < this.childData4.length; i++) {
      const data = this.childData4[i].pstMachine.slice(-2);
      if (data === '合計') {
        this.childData4[i].pstStr = null;
      }
    }

    this.childDataInfo3.unshift('說明欄位：');
    this.childDataInfo4.unshift('說明欄位：');

    this.dataSet = [
      this.childData1 || [],
      this.childData2 || [],
      this.childData3 || [],
      this.childData4 || [],
      this.childDataInfo5 || [],
      this.childData6 || [],
      this.childData7 || [],
      this.childData10 || [],
    ];
    this.dataSetInfo = [
      '',
      '',
      this.childDataInfo3 || [],
      this.childDataInfo4 || [],
    ];
    // console.log("---------------------------------------------------------");
    // console.log(this.dataSet, this.dataSetInfo);
    // console.log("---------------------------------------------------------");
    this.excelService.multiSheet(
      this.dataSet,
      [
        {
          sheetName: '預計入庫資訊',
          fieldMapping: {
            kindType: '分類',
            goalWeight: '目標量(MT)',
            weight: '預計入庫量(MT)',
          },
          includeDescription: false,
        },
        {
          sheetName: '特殊鋼種量',
          fieldMapping: {
            kindType: '產品分類',
            gradeNo: '鋼種',
            diaRange: '尺寸(MM)',
            passMachineWeightNow: '過機量',
            passMachineWeight: '本月過機量',
          },
          includeDescription: false,
        },
        {
          sheetName: '頭份預計回廠日',
          fieldMapping: {
            info: '說明',
            rollDateStr: '回廠日期',
            dateDeliveryPpStr: '交期',
            inputDia: '尺寸',
            steelType: '鋼種',
            weight: '重量',
          },
          includeDescription: true,
        },
        {
          sheetName: '退火生產資訊',
          fieldMapping: {
            schShopCode: '站別',
            pstMachine: '機台',
            pstStr: '當月訂單生產結束時間',
            gradeGroup: '鋼種族群',
            aWeight: '總退火量',
            bWeight: '次月交期退火量',
          },
          includeDescription: true,
        },
        {
          sheetName: '排程生產原則說明',
          fieldMapping: {
            first: '種類',
            sort: '事項',
          },
          includeDescription: false,
        },
        {
          sheetName: '各產線目標量',
          fieldMapping: {
            kindType: '產品別',
            pstMachine: '機台',
            optimalDiaMin: '尺寸(起)',
            optimalDiaMax: '尺寸(迄)',
            passWeight: '過機量',
            outputShape: '型態',
            avgPassWeight: '過機日均',
          },
          includeDescription: false,
        },
        {
          sheetName: '目標量總量',
          fieldMapping: {
            kindType: '產品別',
            process: '製程',
            planWeightI: '入庫量',
          },
          includeDescription: false,
        },
        {
          sheetName: '日推移報表',
          fieldMapping: {
            schShopCodeDisplay: '站台',
            pstMachine: '機台 / 產品別',
            // planWeightI1: this.listDate[0],
            // planWeightI2: this.listDate[1],
            // planWeightI3: this.listDate[2],
            // planWeightI4: this.listDate[3],
            // planWeightI5: this.listDate[4],
            // planWeightI6: this.listDate[5],
            // planWeightI7: this.listDate[6],
            // planWeightI8: this.listDate[7],
            // planWeightI9: this.listDate[8],
            // planWeightI10: this.listDate[9],
            // planWeightI11: this.listDate[10],
            // planWeightI12: this.listDate[11],
            // planWeightI13: this.listDate[12],
            // planWeightI14: this.listDate[13],
            // planWeightI15: this.listDate[14],
            // planWeightI16: this.listDate[15],
            // planWeightI17: this.listDate[16],
            // planWeightI18: this.listDate[17],
            // planWeightI19: this.listDate[18],
            // planWeightI20: this.listDate[19],
            // planWeightI21: this.listDate[20],
            // planWeightI22: this.listDate[21],
            // planWeightI23: this.listDate[22],
            // planWeightI24: this.listDate[23],
            // planWeightI25: this.listDate[24],
            // planWeightI26: this.listDate[25],
            // planWeightI27: this.listDate[26],
            // planWeightI28: this.listDate[27],
            // planWeightI29: this.listDate[28],
            // planWeightI30: this.listDate[29],
            // planWeightI31: this.listDate[30],
            ...this.listDate.reduce((acc, date, index) => {
              acc[`planWeightI${index + 1}`] = date;
              return acc;
            }, {}),
            dateTotal: '總計',
          },
          includeDescription: false,
        },
      ],
      `月推移報表_${moment().format('YYYYMMDDHHmmss')}`,
      this.dataSetInfo
    );
  }

  formatDate(pre: any): string {
    const date = new Date(pre);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是從 0 開始的，需要加 1
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}

interface netItem {
  [key: string]: string;
}

interface OtherInfo {
  instructions: string;
}
