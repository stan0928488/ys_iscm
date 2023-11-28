import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
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
import { ExcelService } from 'src/app/services/common/excel.service';

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
  ],
})
export class PPSR322Component implements OnInit, AfterViewInit {
  @ViewChild('tabGroup') tabGroup: any;

  selectedFcpVer = [{ label: '', value: '' }]; //版本选择
  selectedShiftVer = [{ label: '', value: '' }]; //版本选择

  breadcrumbIndex: number = 0;
  clickSubject: Subject<any> = new Subject();

  receivedData1: any[] = [];
  receivedData2: any[] = [];
  receivedData3: any[] = [];
  receivedData4: any[] = [];
  receivedData5: any[] = [];
  receivedData6: any[] = [];
  receivedData7: any[] = [];
  receivedData8: any[] = [];
  receivedData9: any[] = [];
  receivedData10: any[] = [];

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
    private excelService: ExcelService
  ) {}

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

  notifyClick() {
    this.ppsr322EvnetBusComponent.emit({
      name: 'ppsr322search',
      data: this.searchObj,
    });
    const searchData = { verList: this.searchObj.verList };
    this.ppsr332child1.getR322Data(searchData);
    this.ppsr332child2.getR322Data(searchData);
    this.ppsr332child3.getR322Data(searchData);
    this.ppsr332child4.getR322Data(searchData);
    this.ppsr332child5.getR322Data(searchData);
    this.ppsr332child6.getR322Data(searchData);
    this.ppsr332child7.getR322Data(searchData);
    this.ppsr332child8.getR322Data(searchData);
    this.ppsr332child9.getR322Data(searchData);
    this.getExcelData();
  }

  breadcrumbClick(index: number) {
    this.ppsr322EvnetBusComponent.addToInventory(
      {
        index: index,
      },
      this.searchObj
    );
  }

  getExcelData() {
    this.ppsr322EvnetBusComponent.sharedData$.subscribe((data) => {
      if (data.index == 0) {
        this.receivedData1 = data.data;
      } else if (data.index == 1) {
        this.receivedData2 = data.data;
      } else if (data.index == 2) {
        this.receivedData3 = data.data;
      } else if (data.index == 3) {
        this.receivedData4 = data.data;
      } else if (data.index == 4) {
        this.receivedData5 = data.data;
      } else if (data.index == 5) {
        this.receivedData6 = data.data;
      } else if (data.index == 6) {
        this.receivedData7 = data.data;
      } else if (data.index == 7) {
        this.receivedData8 = data.data;
      } else if (data.index == 8) {
        this.receivedData9 = data.data;
      }
      for (let i = 0; i < this.receivedData8.length; i++) {
        this.receivedData10 = this.receivedData8.map((item) => item.children);
      }
      // for (let j = 0; j< this.receivedData10.length; j++){
      //   if (this.receivedData10[i]['schShopCodeDisplay'] == '334'){
      //     this.receivedData10.push({
      //       data: this.receivedData8[i]['children'],
      //     });
      //   }
      // }
      this.dataSet = [
        this.receivedData1 || [],
        this.receivedData2 || [],
        this.receivedData3 || [],
        this.receivedData4 || [],
        this.receivedData5 || [],
        this.receivedData6 || [],
        this.receivedData7 || [],
        // this.receivedData10 || [],
      ];
    });
  }

  dataSet: any[];
  exportExcel() {
    const array = [
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ];

    const object = array.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    console.log(object);

    console.log(array);
    console.log(this.receivedData9);
    console.log(this.dataSet);
    this.excelService.multiSheet(
      this.dataSet,
      [
        {
          sheetName: '預計入庫資訊',
          headers: ['分類', '目標量(MT)', '預計入庫量(MT)'],
          fields: ['kindType', 'goalWeight', 'weight'],
          fieldMapping: {
            kindType: '分類',
            goalWeight: '目標量(MT)',
            weight: '預計入庫量(MT)',
          },
        },
        {
          sheetName: '特殊鋼種量',
          headers: ['產品分類', '鋼種', '尺寸(MM)', '過機量', '本月過機量'],
          fields: [
            'kindType',
            'gradeNo',
            'diaRange',
            'passMachineWeightNow',
            'passMachineWeight',
          ],
          fieldMapping: {
            kindType: '產品分類',
            gradeNo: '鋼種',
            diaRange: '尺寸(MM)',
            passMachineWeightNow: '過機量',
            passMachineWeight: '本月過機量',
          },
        },
        {
          sheetName: '頭份預計回廠日',
          headers: ['回廠日期', '交期', '尺寸', '鋼種', '重量'],
          fields: [
            'rollDateStr',
            'dateDeliveryPpStr',
            'inputDia',
            'steelType',
            'weight',
          ],
          fieldMapping: {
            rollDateStr: '回廠日期',
            dateDeliveryPpStr: '交期',
            inputDia: '尺寸',
            steelType: '鋼種',
            weight: '重量',
          },
        },
        {
          sheetName: '退火生產資訊',
          headers: [
            '站別',
            '機台',
            '當月訂單生產結束時間',
            '鋼種族群',
            '總退火量',
            '次月交期退火量',
          ],
          fields: [
            'schShopCode',
            'pstMachine',
            'pstStr',
            'gradeGroup',
            'aWeight',
            'bWeight',
          ],
          fieldMapping: {
            schShopCode: '站別',
            pstMachine: '機台',
            pstStr: '當月訂單生產結束時間',
            gradeGroup: '鋼種族群',
            aWeight: '總退火量',
            bWeight: '次月交期退火量',
          },
        },
        {
          sheetName: '排程生產原則說明',
          headers: [],
          fields: [],
          fieldMapping: {},
        },
        {
          sheetName: '各產線目標量',
          headers: [
            '產品別',
            '機台',
            '尺寸(起)',
            '尺寸(迄)',
            '過機量',
            '型態',
            '過機日均',
          ],
          fields: [
            'kindType',
            'pstMachine',
            'optimalDiaMin',
            'optimalDiaMax',
            'passWeight',
            'outputShape',
            'avgPassWeight',
          ],
          fieldMapping: {
            kindType: '產品別',
            pstMachine: '機台',
            optimalDiaMin: '尺寸(起)',
            optimalDiaMax: '尺寸(迄)',
            passWeight: '過機量',
            outputShape: '型態',
            avgPassWeight: '過機日均',
          },
        },
        {
          sheetName: '目標量總量',
          headers: ['產品別', '製程', '入庫量'],
          fields: ['kindType', 'process', 'planWeightI'],
          fieldMapping: {
            kindType: '產品別',
            process: '製程',
            planWeightI: '入庫量',
          },
        },
        // {
        //   sheetName: '日推移報表',
        //   headers: ['機台'],
        //   fields: ['pstMachine'],
        //   fieldMapping: { pstMachine: '機台' },
        // },
      ],
      '月推移報表'
    );
  }
}

interface SheetConfig {
  sheetName: string;
  headers?: string[];
  fields: string[];
}
