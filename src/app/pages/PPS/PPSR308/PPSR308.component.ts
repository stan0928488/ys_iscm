import { Component, AfterViewInit, OnInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { zh_TW, NzI18nService } from "ng-zorro-antd/i18n"
import { NzModalService } from "ng-zorro-antd/modal"
import { ExcelService } from "src/app/services/common/excel.service";
import { CellClickedEvent, ColDef, ColGroupDef, GridReadyEvent, PreConstruct } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-PPSR308',
  templateUrl: './PPSR308.component.html',
  styleUrls: ['./PPSR308.component.scss'],
  providers:[NzMessageService]
})
export class PPSR308Component implements OnInit {

  USERNAME;
  PLANT_CODE;

  constructor(
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private excelService: ExcelService,
    private message: NzMessageService
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
  }

  ngOnInit(): void {
    this.getDataList();
    this.getVerList();
  }

  rowData: data[] = [];  
  
  verList = [
    { label: '', value: '' }
  ];

  gridOptions = {
    defaultColDef: {
        editable: false,
        enableRowGroup: false,
        enablePivot: false,
        enableValue: false,
        sortable: false,
        resizable: true,
        filter: true,
    },
    getRowStyle: params => {
      if (params.data.areaGroup == '外銷' || params.data.areaGroup == '內銷'
      || params.data.areaGroup == '營三外銷(非預估)' || params.data.areaGroup == '營三內銷(非預估)'
      || params.data.areaGroup == '營一(非預估)' || params.data.areaGroup == '計畫庫存') {
        return { background: '#97CBFF' };
      }else if( params.data.areaGroup == '出貨總計' || params.data.areaGroup == '非預估總計'){
        return { background: 'yellow' };
      }
    }
  };

  
  public columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: '總出貨',
      children: [
        {
          children: [{
            children: [{
              width:150,
              headerName: '區別',
              field: "areaGroup"
            }],
          }],
        },
        {
          children: [{
            children: [{
              headerName: '負責業務',
              field: "sales",
              width:120,
            }],
          }],
        },
        {
          children: [{
            children: [{
              headerName: '訂單餘量',
              width:120,
            }],
          }],
        },
        {
          children: [{
            children: [{
              headerName: '出貨目標',
              field: "shippingTarget",
              width:120,
            }],
          }],
        },
        {
          children: [{
            children: [{
              headerName: '出貨進度',
              field: "shippingProgress",
              width:120,
            }],
          }],
        },
        {
          headerName: '可供出貨量(無卡計畫量)',
          children: [
            {
              children: [{
                headerName: '可供出貨量',
                field: "availableToShipNoCard",
                width:120,
              }],
            },
            {
              children: [{
                headerName: 'GAP',
                field: "gapNoCard",
                width:120,
              }],
            }
          ],
        },
        {
          headerName: '可供出貨量(符合計畫量/缺項)',
          children: [
            {
              children: [{
                headerName: '可供出貨量',
                field: "availableToShipMeetThePlanned",
                width:120,
              }],
            },
            {
              children: [{
                headerName: 'GAP',
                field: "gapMeetThePlanned",
                width:120,
              }],
            }
          ],
        },
        {
          headerName: '至月底可供出貨量(符合計畫量/缺項)',
          children: [
            {
              children: [{
                headerName: '可供出貨量',
                field: "endOfMonthAvailableToShipMeetThePlanned",
                width:120,
              }],
            },
            {
              children: [{
                headerName: 'GAP',
                field: "endOfMonthgapMeetThePlanned",
                width:120,
              }],
            }
          ],
        },
        {
          children: [{
            children: [{
              headerName: '已出貨',
              field: "shipped",
              width:120,
            }],
          }],
        },
        {
          headerName: '成品',
          children: [
            {
              headerName: '交期符合',
              children: [
                {
                  width:120,
                  headerName: '足項',
                  field: "finishedProductDateAcceptableEnough",
                },
                {
                  width:120,
                  headerName: '缺項',
                  field: "finishedProductDateAcceptableNotEnough",
                }
              ],
            },
            {
              children: [{
                headerName: '交期不符',
                field: "finishedProductDateNotMatch",
                width:120,
              }],
            },
            {
              children: [{
                headerName: '至月底足項',
                field: "finishedProductEnoughBeforeEndOfMonth",
                width:120,
              }],
            }
          ],
        },
        {
          headerName: '生產計劃',
          children: [
            {
              headerName: '交期符合',
              children: [
                {
                  width:120,
                  headerName: '足項',
                  field: "productPlanDateAcceptableEnough",
                },
                {
                  width:120,
                  headerName: '缺項',
                  field: "productPlanDateAcceptableNotEnough",
                }
              ],
            },
            {
              children: [{
                headerName: '交期不符',
                width:120,
                field: "productPlanDateNotMatch",
              }],
            },
            {
              children: [{
                headerName: '至月底足項',
                field: "productPlanEnoughBeforeEndOfMonth",
                width:120,
              }],
            }
          ],
        }
      ],
    }
  ] 


  getDataList(){
    let postData = {};
    this.PPSService.getR308Data(postData).subscribe(res =>{
      console.log(res);
      let result:any = res ;
      if(result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
      } else {
        this.message.error('無資料');
        return;
      }
    },err => {
      this.message.error('網絡請求失敗');
    })


  }

  getVerList(){

    let postData = {};
    this.PPSService.getR308VerListData(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        var parseData = JSON.parse(JSON.stringify(result));
        Object.keys(parseData).forEach(function(k){
          var temp = {};
          temp['label'] = parseData[k];
          temp['value'] = parseData[k];
          this.verList.push(temp);
        });
        console.log(this.verList);
      } else {
        this.message.error('無資料');
        return;
      }
    },err => {
      this.message.error('網絡請求失敗');
    })

  }

}

interface data {
  "areaGroup": String
}

interface dataa {
  "MO_EDITION": String
}