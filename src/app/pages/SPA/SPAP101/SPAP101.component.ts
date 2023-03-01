
import { CookieService } from "src/app/services/config/cookie.service";
import { SPAService } from "src/app/services/SPA/SPA.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import { AppComponent } from "src/app/app.component";
import * as _ from "lodash";

import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

// line-chart.component.ts
import { EChartsOption } from 'echarts';


interface ItemData1 {
  custAbbreviations: string;
  // typeIe: string;
  // gradeNo: string;
  // saleOrderWidth: number;
  dateDelivery: string;
  saleOrderWeight: number;
}

@Component({
  selector: "app-SPAP101",
  styleUrls: ["./SPAP101.component.scss"],
  templateUrl: "./SPAP101.component.html",
  providers:[NzMessageService]
})

export class SPAP101component implements AfterViewInit {
  isVisible = false;
  isOPVisible = true;
  isSpinning = false;
  isClear = true;
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;

  // 控制下拉式選單(產品別、鋼種、寬度): 是否可視，false:可視、true:不可視
  disable_typeie = false;
  disable_coid = false;
  disable_width = false;

  // 搜尋功能
  listOfDisplayData;

  // 下拉式選單相關:
  // 客戶名稱
  customer = "";
  custlistOfOption = [];
  // 產品別
  typeie = "";
  // 鋼種
  coid = "";
  // 寬度
  width = "";
  // 結果比較
  resultcf = "";
  // 時間區間
  dateStart = "";
  dateEnd = "";

  // 初始趨勢圖:
  chartOption: EChartsOption = {
    // x軸設定
    xAxis: {
      type: 'category',
      name: '生計交期', // x軸名字
      nameLocation: 'middle', // x軸名字位置
      nameTextStyle: {
        fontSize: 20 // x軸名字字體大小
      },
      nameGap: 40, // x軸名字與軸線的距離
      data: ['Jan', 'Feb', 'Feb', 'Feb', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] // x軸資料
    },
    // y軸設定
    yAxis: {
      type: 'value',
      name: '訂單重量',
      nameLocation: 'middle',
      nameTextStyle: {
        fontSize: 20,
      },
      nameGap: 50
    },
    series: [
      {
      type: 'line',
      data: [820, 932, 901, 934, 1290, 1430, 1550, 1200, 1650, 1450, 1680, 1890]
      }
    ]
  }

  // 參數
  custAbbreviations
  typeIe
  gradeNo
  saleOrderWidth
  dateDelivery
  saleOrderWeight

  // tab 1
  TBSPAM100List_tmp;
  editCache1: { [key: string]: { edit: boolean; data: ItemData1 } } = {};
  TBSPAM100List: ItemData1[] = [];
  RawTBSPAM100ListLen;

  constructor(
    private SPAService: SPAService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private component: AppComponent
  ) {
  this.i18n.setLocale(zh_TW);
  this.USERNAME = this.cookieService.getCookie("USERNAME");
  }

  // 進入頁面即會運行的功能
  ngAfterViewInit() {
      console.log("ngAfterViewChecked");
      this.getcustList();
  }

  // 下拉式選單: 客戶名稱--------------------------------------------------------------------------------------------
  getcustList() {
    this.loading = true;
    let myObj = this;
    this.SPAService.getSPA101CustList().subscribe(res => {
      let result:any = res ;
      if(result.code === 200) {
        // 變數定義
        let newres_customer = [];
       
        for(let i=0 ; i < result.data.length ; i++) {
          // 客戶名稱
          newres_customer.push(result.data[i].custAbbreviations);
        }
        // 消除重複項
        this.custlistOfOption = [...new Set(newres_customer)];

        // log: 檢查用
        // console.log(this.custlistOfOption)

      } else {
        this.message.error('後台錯誤，請檢查');
      }
      myObj.loading = false;
    },err => {
      this.message.error('請求獲取失敗');
    });
  }

  // 時間區間 開始時間--------------------------------------------------------------------------------------------------
  changeDateStart(result: Date): void {
    this.dateStart = this.component.dateFormat(result, 2)
    console.log('dateStart = ' + this.dateStart)
  }

  // 時間區間 結束時間--------------------------------------------------------------------------------------------------
  changeDateEnd(result: Date): void {
    this.dateEnd = this.component.dateFormat(result, 2)
    console.log('dateEnd = ' + this.dateEnd)
  }

  // 表面異動控制: 選了產品別，就不可選鋼種與寬度--------------------------------------------------------------------------
  changeProd_t(_value) {
    // 產品別非空-> 鋼種與寬度皆不可選
    if(_value !== null) {
      this.disable_coid = true;
      this.disable_width = true;
      console.log('選擇產品別、不可選擇鋼種與寬度')
    }
    // 產品別為空-> 鋼種、寬度可選 
    else if (_value === "" || _value === null || _value === undefined) {
      this.disable_coid = false;
      this.disable_width = false;
      this.typeie = "";
    }
  }

  // 表面異動控制: 選了鋼種與寬度，就不可選產品別--------------------------------------------------------------------------
  changeProd_cw(_value) {
    // 鋼種、寬度非空-> 產品別皆不可選
    if(_value !== null) {
      this.disable_typeie = true;
      console.log('選擇鋼種與寬度、不可選擇產品別')
    }
    // 鋼種、寬度為空-> 產品別可選; 鋼種與寬度必須同時為空
    else if (_value === "" || _value === null || _value === undefined ) {
      this.disable_typeie = false;
      this.coid = "";
      this.width = "";
    }
  }

  // 查詢與檢查----------------------------------------------------------------------------------------------------------
  searchCheck() {
    let myObj = this;
    if (this.customer === "" || this.customer === null) {
      myObj.message.create("error", "請選擇「客戶名稱」");
      return;
    }
    else if (this.typeie === "" && this.coid === "") {
      myObj.message.create("error", "請選擇「產品別」或「鋼種」");
      return;
    }
    else if (this.dateStart === "" || this.dateEnd === "") {
      myObj.message.create("error", "請選擇「日期區間」");
      return;
    }

    // 執行: 清空趨勢圖
    this.clearplot();
    // 執行: 跟後端拿資料並更新趨勢圖
    this.pltTBSPAM100();
  }

  // 清除選單--------------------------------------------------------------------------------------------------------------
  clearPar(): void {
    this.customer = "";
    this.custlistOfOption = [];
    this.typeie = "";
    this.coid = "";
    this.width = "";
    this.dateStart = "";
    this.dateEnd = "";
    this.isClear = true;

    console.log('clear parameter success')
  }


  // 清空折線圖----------------------------------------------------------------------------------------------------------------
  clearplot() {
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
        type: 'line',
        data: []
        }
      ]
    }
    console.log('clear line chart success')
  }

  // 跟後端拿資料並更新趨勢圖----------------------------------------------------------------------------------------------------
  pltTBSPAM100() {
    this.loading = true;
    let myObj = this;
    
    // 定義要傳回去service的東西
    var _CUST= this.customer;
    var _TYPEIE= this.typeie;
    var _GRADENO= this.coid;
    var _WIDTHTYPE= this.width;
    // 日期數值處理: 2020-02-01 => 2020/02
    var _STARTDATE= this.dateStart.substr(0, 4) + '/' + this.dateStart.substr(5, 2) + '/' + this.dateStart.substr(8, 2);
    var _ENDDATE= this.dateEnd.substr(0, 4) + '/' + this.dateEnd.substr(5, 2) + '/' + this.dateEnd.substr(8, 2);

    // 如果變數為null，則改為空值，資料庫才不會出錯
    if (_TYPEIE === null) {
      _TYPEIE = "";
    } 
    else if (_GRADENO === null) {
      _GRADENO = "";
    } 
    else if (_WIDTHTYPE === null) {
      _WIDTHTYPE = "";
    }

    // 檢查參數
    console.log('_CUST = ' + _CUST)
    console.log('_TYPEIE = ' + _TYPEIE)
    console.log('_GRADENO = ' + _GRADENO)
    console.log('_WIDTHTYPE = ' + _WIDTHTYPE)
    console.log('_STARTDATE = ' + _STARTDATE)
    console.log('_ENDDATE = ' + _ENDDATE)

    // 資料溝通
    this.SPAService.getSPA101AllList(_CUST,_TYPEIE,_GRADENO,_WIDTHTYPE,_STARTDATE,_ENDDATE).subscribe(res => {
      console.log("pltTBSPAM100 success");
      this.TBSPAM100List_tmp = res['data'];
      var data = [];
      for (let i = 0; i < this.TBSPAM100List_tmp.length; i++) {
        data.push({       
          custAbbreviations: this.TBSPAM100List_tmp[i].custAbbreviations,
          // typeIe: this.TBSPAM100List_tmp[i].typeIe,          
          // gradeNo: this.TBSPAM100List_tmp[i].gradeNo,
          // saleOrderWidth: this.TBSPAM100List_tmp[i].saleOrderWidth,
          dateDelivery: this.TBSPAM100List_tmp[i].dateDelivery,
          saleOrderWeight: this.TBSPAM100List_tmp[i].saleOrderWeight
        })
    
        this.chartOption.xAxis['data'].push(this.TBSPAM100List_tmp[i].dateDelivery)
        this.chartOption.series[0]['data'].push(this.TBSPAM100List_tmp[i].saleOrderWeight)
      }

      // 趨勢圖資料
      console.log(this.chartOption.xAxis['data'])
      console.log(this.chartOption.series[0]['data'])

      // 更新折線圖
      this.chartOption = {
        xAxis: {
          type: 'category',
          name: '生計交期',
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 20
          },
          nameGap: 40,
          data: this.chartOption.xAxis['data']
        },
        yAxis: {
          type: 'value',
          name: '訂單重量',
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 20,
          },
          nameGap: 60 // 設定Y軸名字與軸線的距離
        },
        series: [
          {
            type: 'line',
            data: this.chartOption.series[0]['data'],
            label: {
              show: true,
              position: 'bottom'
            }
          }
        ]
      }

    })
  this.isClear = false;
  myObj.loading = false;
  }
  
}