import { Component, AfterViewInit, OnInit } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import { zh_TW, NzI18nService } from "ng-zorro-antd/i18n"
import { NzModalService } from "ng-zorro-antd/modal"
import { ExcelService } from "src/app/services/common/excel.service";
import { CellClickedEvent, ColDef, ColGroupDef, GridReadyEvent, PreConstruct } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-PPSR308',
  templateUrl: './PPSR308.component.html',
  styleUrls: ['./PPSR308.component.scss'],
  providers:[NzMessageService]
})
export class PPSR308Component implements OnInit {

  USERNAME;
  PLANT_CODE;
  tooltipShowDelay = 500;
  areaGroup = [];

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
    this.getVerListData();
    this.getAreaGroup();
  }

  searchData = {
    specialBar:"",
    saleAreaGroup:"",
    selectedVer_default:null,
    custAbbreviations:""
  }

  selectedVer = [{label:'',value:''}]; //版本选择

  isSpinning = false;

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
      if (params.data.areaGroup.includes("合計") || params.data.areaGroup == '計畫庫存') {
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
              pinned: 'left',
              width:150,
              headerName: '區別',
              field: "areaGroup"
            }],
          }],
        },
        {
          children: [{
            children: [{
              pinned: 'left',
              width:150,
              headerName: '客戶',
              field: "custAbbreviations"
            }],
          }],
        },
        {
          children: [{
            children: [{
              pinned: 'left',
              headerName: 'A.負責業務',
              field: "sales",
              width:120,
            }],
          }],
        },
        {
          children: [{
            children: [{
              pinned: 'left',
              headerName: 'B.訂單餘量',
              width:120,
              cellStyle: params => {
                if (params.value < 0) {
                    return {color: 'red'};
                }
              },
              cellRenderer: function (params) {
                if (params.value < 0) {
                  return "(" + params.value * -1 + ")";
                }else {
                  return params.value
                }
              },
            }],
          }],
        },
        {
          children: [{
            children: [{
              pinned: 'left',
              headerName: 'C.出貨目標',
              field: "shippingTarget",
              width:120,
              cellStyle: params => {
                if (params.value < 0) {
                    return {color: 'red'};
                }
              },
              cellRenderer: function (params) {
                if (params.value < 0) {
                  return "(" + params.value * -1 + ")";
                }else {
                  return params.value
                }
              },
            }],
          }],
        },
        {
          children: [{
            children: [{
              pinned: 'left',
              headerTooltip: "已出貨(H)/出貨目標(C.)",
              headerName: 'D.出貨進度',
              field: "shippingProgress",
              width:120,
              cellStyle: params => {
                if (params.value < 0) {
                    return {color: 'red'};
                }
              },
              cellRenderer: function (params) {
                if (params.value < 0) {
                  return "(" + params.value * -1 + ")";
                }else {
                  return params.value
                }
              },
            }],
          }],
        },
        {
          headerName: 'E.可供出貨量(無卡計畫量)',
          children: [
            {
              children: [{
                headerTooltip: "已出貨(H)+ 成品_交期符合_足項(I1.1)+ 生產計劃_交期符合_足項(J1.1)",
                headerName: '1.可供出貨量',
                field: "availableToShipNoCard",
                width:120,
                cellStyle: params => {
                  if (params.value < 0) {
                      return {color: 'red'};
                  }
                },
                cellRenderer: function (params) {
                  if (params.value < 0) {
                    return "(" + params.value * -1 + ")";
                  }else {
                    return params.value
                  }
                },
              }],
            },
            {
              children: [{
                headerTooltip: "可供出貨量(E1)-出貨目標(C.)",
                headerName: '2.GAP',
                field: "gapNoCard",
                width:120,
                cellStyle: params => {
                  if (params.value < 0) {
                      return {color: 'red'};
                  }
                },
                cellRenderer: function (params) {
                  if (params.value < 0) {
                    return "(" + params.value * -1 + ")";
                  }else {
                    return params.value
                  }
                },
              }],
            }
          ],
        },
        {
          headerName: 'F.可供出貨量(符合計畫量/缺項)',
          children: [
            {
              children: [{
                headerTooltip: "若E1-C>=0則此欄位值為C，若E1-C<0則此欄位值為E1",
                headerName: '1.可供出貨量',
                field: "availableToShipMeetThePlanned",
                width:120,
                cellStyle: params => {
                  if (params.value < 0) {
                      return {color: 'red'};
                  }
                },
                cellRenderer: function (params) {
                  if (params.value < 0) {
                    return "(" + params.value * -1 + ")";
                  }else {
                    return params.value
                  }
                },
              }],
            },
            {
              children: [{
                headerTooltip: "可供出貨量(F1)-出貨目標(C.)",
                headerName: '2.GAP',
                field: "gapMeetThePlanned",
                width:120,
                cellStyle: params => {
                  if (params.value < 0) {
                      return {color: 'red'};
                  }
                },
                cellRenderer: function (params) {
                  if (params.value < 0) {
                    return "(" + params.value * -1 + ")";
                  }else {
                    return params.value
                  }
                },
              }],
            }
          ],
        },
        {
          headerName: 'G.至月底可供出貨量(符合計畫量/缺項)',
          children: [
            {
              children: [{
                headerTooltip: "已出貨(H)+ 成品_至月底足項(I3)+ 生產計劃_至月底足項(J3)",
                headerName: '1.可供出貨量',
                field: "endOfMonthAvailableToShipMeetThePlanned",
                width:120,
                cellStyle: params => {
                  if (params.value < 0) {
                      return {color: 'red'};
                  }
                },
                cellRenderer: function (params) {
                  if (params.value < 0) {
                    return "(" + params.value * -1 + ")";
                  }else {
                    return params.value
                  }
                },
              }],
            },
            {
              children: [{
                headerTooltip: "可供出貨量(G1)-出貨目標(C.)",
                headerName: '2.GAP',
                field: "endOfMonthgapMeetThePlanned",
                width:120,
                cellStyle: params => {
                  if (params.value < 0) {
                      return {color: 'red'};
                  }
                },
                cellRenderer: function (params) {
                  if (params.value < 0) {
                    return "(" + params.value * -1 + ")";
                  }else {
                    return params.value
                  }
                },
              }],
            }
          ],
        },
        {
          children: [{
            children: [{
              headerName: 'H.已出貨',
              field: "shipped",
              width:120,
              cellStyle: params => {
                if (params.value < 0) {
                    return {color: 'red'};
                }
              },
              cellRenderer: function (params) {
                if (params.value < 0) {
                  return "(" + params.value * -1 + ")";
                }else {
                  return params.value
                }
              },
            }],
          }],
        },
        {
          headerName: 'I.成品',
          children: [
            {
              headerName: '1.交期符合',
              children: [
                {
                  headerTooltip:"生計交期<=可接受交期 (DATE_DELIVERY_PP<=DATE_ACCEPTABLE)"+
                  "是否符合允收截止日、是否符合可接受交期、是否缺項皆為Y者",
                  width:120,
                  headerName: '1.足項',
                  field: "finishedProductDateAcceptableEnough",
                  cellStyle: params => {
                    if (params.value < 0) {
                        return {color: 'red'};
                    }
                  },
                  cellRenderer: function (params) {
                    if (params.value < 0) {
                      return "(" + params.value * -1 + ")";
                    }else {
                      return params.value
                    }
                  },
                },
                {
                  headerTooltip:"生計交期<=可接受交期 (DATE_DELIVERY_PP<=DATE_ACCEPTABLE)"+
                  "是否符合允收截止日Y、是否符合可接受交期Y、是否缺項N者",
                  width:120,
                  headerName: '2.缺項',
                  field: "finishedProductDateAcceptableNotEnough",
                  cellStyle: params => {
                    if (params.value < 0) {
                        return {color: 'red'};
                    }
                  },
                  cellRenderer: function (params) {
                    if (params.value < 0) {
                      return "(" + params.value * -1 + ")";
                    }else {
                      return params.value
                    }
                  },
                }
              ],
            },
            {
              children: [{
                headerTooltip:"是否符合允收截止日、是否符合可接受交期、是否缺項皆為Y者",
                headerName: '2.交期符合_至月底足項',
                field: "finishedProductEnoughBeforeEndOfMonth",
                width:120,
                cellStyle: params => {
                  if (params.value < 0) {
                      return {color: 'red'};
                  }
                },
                cellRenderer: function (params) {
                  if (params.value < 0) {
                    return "(" + params.value * -1 + ")";
                  }else {
                    return params.value
                  }
                },
              }],
            },
            {
              children: [{
                headerTooltip:"生計交期>可接受交期 (DATE_DELIVERY_PP<=DATE_ACCEPTABLE)",
                headerName: '3.交期不符',
                field: "finishedProductDateNotMatch",
                width:120,
                cellStyle: params => {
                  if (params.value < 0) {
                      return {color: 'red'};
                  }
                },
                cellRenderer: function (params) {
                  if (params.value < 0) {
                    return "(" + params.value * -1 + ")";
                  }else {
                    return params.value
                  }
                },
              }],
            }
          ],
        },
        {
          headerName: 'J.生產計劃',
          children: [
            {
              headerName: '1.交期符合',
              children: [
                {
                  headerTooltip:"生計交期<=可接受交期 (DATE_DELIVERY_PP<=DATE_ACCEPTABLE)"+
                  "PST<=允收截止日 (PST<=DATE_PLAN_IN_STORAGE)"+
                  "是否符合允收截止日、是否符合可接受交期、是否缺項皆為Y者",
                  width:120,
                  headerName: '1.足項',
                  field: "productPlanDateAcceptableEnough",
                  cellStyle: params => {
                    if (params.value < 0) {
                        return {color: 'red'};
                    }
                  },
                  cellRenderer: function (params) {
                    if (params.value < 0) {
                      return "(" + params.value * -1 + ")";
                    }else {
                      return params.value
                    }
                  },
                },
                {
                  headerTooltip:"生計交期<=可接受交期 (DATE_DELIVERY_PP<=DATE_ACCEPTABLE)"+
                  "PST<=允收截止日 (PST<=DATE_PLAN_IN_STORAGE)"+
                  "是否符合允收截止日Y、是否符合可接受交期Y、是否缺項N者",
                  width:120,
                  headerName: '2.缺項',
                  field: "productPlanDateAcceptableNotEnough",
                  cellStyle: params => {
                    if (params.value < 0) {
                        return {color: 'red'};
                    }
                  },
                  cellRenderer: function (params) {
                    if (params.value < 0) {
                      return "(" + params.value * -1 + ")";
                    }else {
                      return params.value
                    }
                  },
                }
              ],
            },
            {
              children: [{
                headerTooltip:"是否符合允收截止日、是否符合可接受交期、是否缺項皆為Y者",
                headerName: '2.交期符合_至月底足項',
                field: "productPlanEnoughBeforeEndOfMonth",
                width:120,
                cellStyle: params => {
                  if (params.value < 0) {
                      return {color: 'red'};
                  }
                },
                cellRenderer: function (params) {
                  if (params.value < 0) {
                    return "(" + params.value * -1 + ")";
                  }else {
                    return params.value
                  }
                },
              }],
            },
            {
              children: [{
                headerTooltip:"生計交期>可接受交期 (DATE_DELIVERY_PP>DATE_ACCEPTABLE)"+
                "PST<=允收截止日 (PST<=DATE_PLAN_IN_STORAGE)",
                headerName: '3.交期不符',
                width:120,
                field: "productPlanDateNotMatch",
                cellStyle: params => {
                  if (params.value < 0) {
                      return {color: 'red'};
                  }
                },
                cellRenderer: function (params) {
                  if (params.value < 0) {
                    return "(" + params.value * -1 + ")";
                  }else {
                    return params.value
                  }
                },
              }],
            }
          ],
        }
      ],
    }
  ] 


  getDataList(){
    this.isSpinning = true;
    let postData = this.searchData;
    postData['mo_EDITION'] = this.searchData.selectedVer_default;
    this.PPSService.getR308Data(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
      } else {
        this.message.error('無資料');
        return;
      }
      this.isSpinning = false;
    },err => {
      this.isSpinning = false;
      this.message.error('網絡請求失敗');
    })


  }

  getVerListData(){

    let postData = {};
    this.PPSService.getR308VerListData(postData).subscribe(res =>{
      let result:any = res ;
      if(result.length > 0) {
        for(let i = 0 ; i<result.length ; i++) {
          this.selectedVer.push({label:result[i].mo_EDITION, value:result[i].mo_EDITION})
        }
      } else {
        this.message.error('無資料');
        return;
      }
    },err => {
      this.message.error('網絡請求失敗');
    })

  }

  excelExport() {

    let exportData = [];
    let postData = this.searchData;
    postData['mo_EDITION'] = this.searchData.selectedVer_default;
    this.PPSService.getR308Data(postData).subscribe(res =>{
      
      let result: any = res;


      for (var i = 0; i <= result.length; i++) {
        var element = result[i];
        if (element) {
          var obj =
          {
            "區別": (element['areaGroup'] ? element['areaGroup'] : null),
            "客戶": (element['custAbbreviations'] ? element['custAbbreviations'] : null),
            "A.負責業務": (element['sales'] ? element['sales'] : null),
            "B.訂單餘量": "",
            "C.出貨目標": (element['shippingTarget'] ? Number(element['shippingTarget']) : null),
            "D.出貨進度": (element['shippingProgress'] ? Number(element['shippingProgress']) : null),
            "E.可供出貨量(無卡計畫量)": (element['availableToShipNoCard'] ? Number(element['availableToShipNoCard']) : null),
            "E.可供出貨量(無卡計畫量) GAP": (element['gapNoCard'] ? Number(element['gapNoCard']) : null),
            "F.可供出貨量(符合計畫量/缺項)": (element['availableToShipMeetThePlanned'] ? Number(element['availableToShipMeetThePlanned']) : null),
            "F.可供出貨量(符合計畫量/缺項) GAP": (element['gapMeetThePlanned'] ? Number(element['gapMeetThePlanned']) : null),
            "G.至月底可供出貨量(符合計畫量/缺項)": (element['endOfMonthAvailableToShipMeetThePlanned'] ? Number(element['endOfMonthAvailableToShipMeetThePlanned']) : null),
            "G.至月底可供出貨量(符合計畫量/缺項) GAP": (element['endOfMonthgapMeetThePlanned'] ? Number(element['endOfMonthgapMeetThePlanned']) : null),
            "H.已出貨": (element['shipped'] ? Number(element['shipped']) : null),
            "I.成品_交期符合_足項": (element['finishedProductDateAcceptableEnough'] ? Number(element['finishedProductDateAcceptableEnough']) : null),
            "I.成品_交期符合_缺項": (element['finishedProductDateAcceptableNotEnough'] ? Number(element['finishedProductDateAcceptableNotEnough']) : null),
            "I.成品_交期符合_至月底足項": (element['finishedProductEnoughBeforeEndOfMonth'] ? Number(element['finishedProductEnoughBeforeEndOfMonth']) : null),
            "I.成品_交期不符": (element['finishedProductDateNotMatch'] ? Number(element['finishedProductDateNotMatch']) : null),
            "J.生產計劃_交期符合_足項": (element['productPlanDateAcceptableEnough'] ? Number(element['productPlanDateAcceptableEnough']) : null),
            "J.生產計劃_交期符合_缺項": (element['productPlanDateAcceptableNotEnough'] ? Number(element['productPlanDateAcceptableNotEnough']) : null),
            "J.生產計劃_交期符合_至月底足項": (element['productPlanEnoughBeforeEndOfMonth'] ? Number(element['productPlanEnoughBeforeEndOfMonth']) : null),
            "J.生產計劃_交期不符": (element['productPlanDateNotMatch'] ? Number(element['productPlanDateNotMatch']) : null)
          }
          exportData.push(obj);
        }
      }

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '出貨計畫主表')
      XLSX.writeFile(wb, ExcelService.toExportFileName("出貨計畫主表"));

    });

  }

  getAreaGroup() {
    let myObj = this;
    this.PPSService.getAreaGroup().subscribe(res => {
      let result:any = res ;
      if(result.code === 1) {
        let areaGroup:any = result.data;
        areaGroup.forEach(e => {
          this.areaGroup.push({label: e.saleAreaGroup, value: e.saleAreaGroup});
        });
      } else{
        this.message.error(result.message);
      }
    });
  }
  
}

interface data {
  "areaGroup": String
}

interface dataa {
  "MO_EDITION": String
}