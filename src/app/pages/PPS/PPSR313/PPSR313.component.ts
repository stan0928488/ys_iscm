import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ListShipRepoDataTransferService } from '../list-ship-repo/ListShipRepoDataTransferService';
import { PPSService } from "src/app/services/PPS/PPS.service";
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExcelService } from "src/app/services/common/excel.service";
import * as moment from "moment";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-PPSR313',
  templateUrl: './PPSR313.component.html',
  styleUrls: ['./PPSR313.component.css']
})
export class PPSR313Component implements OnInit {

  constructor(
    private listShipRepoDataTransferService: ListShipRepoDataTransferService,
    private PPSService: PPSService,
    private message: NzMessageService
  ) { }

  convertTimeStr:String
  rowData: data[] = [];
  selectedVer = [{ label: '', value: '' }]; //版本选择
  searchData = {
    selectedVer_default: null,
  }

  columnDefs: ColDef[] = [
    { field: 'saleAreaGroup', headerName: '區別', width: 100 },
    { field: 'custAbbreviations', headerName: '客戶', width: 100 },
    { field: 'consignee', headerName: '收貨人', width: 100 },
    { field: 'classCode', headerName: '等級碼', width: 100 },
    { field: 'chiDesc', headerName: '產品類別', width: 100 },
    { field: 'saleOrder', headerName: '訂單編號', width: 100 },
    { field: 'saleItem', headerName: '訂單項次', width: 100 },
    { field: 'micNo', headerName: 'MIC_NO', width: 100 },
    { field: 'mergeNo', headerName: '合併單號', width: 100 },
    { field: 'ppFlagClosed', headerName: '是否發料', width: 100 },
    { field: 'dateDeliveryPp', headerName: '生計交期', width: 100,
      cellRenderer: (data) => {
        if(data.value){
          return moment(data.value).format('YYYY-MM-DD')
        }else{
          return data.value;
        }
    }},
    { field: 'dateDeliverySales', headerName: '營業交期', width: 100,
      cellRenderer: (data) => {
        if(data.value){
          return moment(data.value).format('YYYY-MM-DD')
        }else{
          return data.value;
        }
    }},
    { field: 'mtrlNo', headerName: '料號', width: 100  },
    { field: 'saleOrderDia', headerName: '尺寸', width: 100 },
    { field: 'hotRolledSize', headerName: '冷抽前尺寸', width: 100 },
    { field: 'ppShaveSize', headerName: '軋延尺寸', width: 100 },
    { field: 'saleOrderWeight', headerName: '訂單重量', width: 100 },
    { field: 'merageWeight', headerName: '併單計畫量', width: 100 },
    { field: 'totalWeight', headerName: '總重上限', width: 100 },
    { field: 'currentWeightB', headerName: 'B倉', width: 100 },
    { field: 'currentWeightR', headerName: 'R倉', width: 100 },
    { field: 'currentWeightA', headerName: 'A倉', width: 100 },
    { field: 'currentWeightP', headerName: 'P倉', width: 100 },
    { field: 'currentWeightS', headerName: 'S倉', width: 100 },
    { field: 'currentWeightT', headerName: 'T倉', width: 100 },
    { field: 'currentWeightO', headerName: 'O倉', width: 100 },
    { field: 'currentWeightF', headerName: 'F倉', width: 100 },
    { field: 'currentWeightZ', headerName: '待入', width: 100 },
    { field: 'currentWeightV', headerName: 'V倉(成品)', width: 100 },
    { field: 'wtVUnfinish', headerName: 'V倉(待退庫品)', width: 100 },
    { field: 'pickedNotShippingWeight', headerName: '撿貨', width: 100 },
    { field: 'shippingWeight', headerName: '出貨', width: 100 },
    { field: 'rejectWeight', headerName: '退貨, width: 100' },
    { field: 'lineupDesc', headerName: 'LINEUP製程', width: 100 },
    { field: 'empName', headerName: '建檔人員', width: 100 },
    { field: 'ppRollLength', headerName: '熱軋長度', width: 100 },
    { field: 'inputLinupDesc', headerName: '投產類型', width: 100 },
    { field: 'saleItemLength', headerName: '訂單長度', width: 100 },
    { field: 'kindType', headerName: '產品種類', width: 100 },
    { field: 'kindTypeDetial', headerName: '產品細分', width: 100 },
    { field: 'chamfer', headerName: '倒角', width: 100 },
    { field: 'cycleNo', headerName: 'CYCLE_NO', width: 100 },
    { field: 'lock', headerName: 'LOCK' },
    { field: 'vendorName', headerName: '代工廠名稱', width: 100 },
    { field: 'oemCode', headerName: '代工', width: 100 },
    { field: 'barShortPc', headerName: '允收短尺支數', width: 100 },
    { field: 'countryName', headerName: '國家別', width: 100 },
    { field: 'oxsaleOrder', headerName: '備料訂單', width: 100 },
    { field: 'oxsaleItem', headerName: '備料項次', width: 100 },
    { field: 'etTest', headerName: '需ET', width: 100 },
    { field: 'flagSetUt', headerName: '需UT', width: 100 },
    { field: 'sale0XOrder', headerName: '研發訂單', width: 100 },
    { field: 'sale0XItem', headerName: '研發項次', width: 100 },
    { field: 'lpst', headerName: '最晚投入日', width: 100 ,
      cellRenderer: (data) => {
        if(data.value){
          return moment(data.value).format('YYYY-MM-DD')
        }else{
          return data.value;
        }
    }},
    { field: 'lpstMonth', headerName: '最晚投入月份', width: 100,
      cellRenderer: (data) => {
        if(data.value){
          return moment(data.value).format('YYYY-MM-DD')
        }else{
          return data.value;
        }
      }},
  ];

  ngOnInit(): void {
    this.listShipRepoDataTransferService.setSelectedPage("R313");
    this.getDataList();
    this.getVerListData();
  }

  getDataList() {
    let postData = this.searchData;
    postData['mo_EDITION'] = this.searchData.selectedVer_default;
    this.PPSService.getPPSC312Tbppsrm009Data(postData).subscribe(res => {
      let result: any = res;
      if (result.length > 0) {
        this.rowData = JSON.parse(JSON.stringify(result));
        if(this.rowData.length > 0 && this.rowData[0].dateCreate){
          this.convertTimeStr = moment(this.rowData[0].dateCreate).format('YYYY-MM-DD')
        }
      } else {
        this.message.error("版次:" + this.searchData.selectedVer_default + "無資料");
      }
    }, err => {
      this.message.error('網絡請求失敗');
    })
  }

  getVerListData(){

    let postData = {};
    this.PPSService.getPPSC312Tbppsrm009VerListData(postData).subscribe(res =>{
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
    this.PPSService.getPPSC312Tbppsrm009Data(postData).subscribe(res =>{
      
      let result: any = res;


      for (var i = 0; i <= result.length; i++) {
        var element = result[i];
        console.log(element);
        if (element) {
          var obj =
          {
            "區別":(element['saleAreaGroup'] ? element['saleAreaGroup'] : null),
            "客戶": (element['custAbbreviations'] ? element['custAbbreviations'] : null),
            "收貨人": (element['consignee'] ? element['consignee'] : null),
            "等級碼": (element['classCode'] ? element['classCode'] : null),
            "產品類別": (element['chiDesc'] ? element['chiDesc'] : null),
            "訂單編號": (element['saleOrder'] ? element['saleOrder'] : null),
            "訂單項次": (element['saleItem'] ? element['saleItem'] : null),
            "MIC_NO": (element['micNo'] ? element['micNo'] : null),
            "合併單號": (element['mergeNo'] ? element['mergeNo'] : null),
            "是否發料": (element['ppFlagClosed'] ? element['ppFlagClosed'] : null),
            "生計交期": (element['dateDeliveryPp'] ? moment(element['dateDeliveryPp']).format('YYYY-MM-DD') : null),
            "營業交期": (element['dateDeliverySales'] ? moment(element['dateDeliverySales']).format('YYYY-MM-DD') : null),
            "料號": (element['mtrlNo'] ? element['mtrlNo'] : null),
            "尺寸": (element['saleOrderDia'] ? element['saleOrderDia'] : null),
            "冷抽前尺寸": (element['hotRolledSize'] ? element['hotRolledSize'] : null),
            "軋延尺寸": (element['ppShaveSize'] ? element['ppShaveSize'] : null),
            "訂單重量": (element['saleOrderWeight'] ? element['saleOrderWeight'] : null),
            "併單計畫量": (element['merageWeight'] ? element['merageWeight'] : null),
            "總重上限": (element['totalWeight'] ? element['totalWeight'] : null),
            "B倉": (element['currentWeightB'] ? element['currentWeightB'] : null),
            "R倉": (element['currentWeightR'] ? element['currentWeightR'] : null),
            "A倉": (element['currentWeightA'] ? element['currentWeightA'] : null),
            "P倉": (element['currentWeightP'] ? element['currentWeightP'] : null),
            "S倉": (element['currentWeightS'] ? element['currentWeightS'] : null),
            "T倉": (element['currentWeightT'] ? element['currentWeightT'] : null),
            "O倉": (element['currentWeightO'] ? element['currentWeightO'] : null),
            "F倉": (element['currentWeightF'] ? element['currentWeightF'] : null),
            "待入": (element['currentWeightZ'] ? element['currentWeightZ'] : null),
            "V倉(成品)": (element['currentWeightV'] ? element['currentWeightV'] : null),
            "V倉(待退庫品)": (element['wtVUnfinish'] ? element['wtVUnfinish'] : null),
            "撿貨": (element['pickedNotShippingWeight'] ? element['pickedNotShippingWeight'] : null),
            "出貨": (element['shippingWeight'] ? element['shippingWeight'] : null),
            "退貨": (element['rejectWeight'] ? element['rejectWeight'] : null),
            "LINEUP製程": (element['lineupDesc'] ? element['lineupDesc'] : null),
            "建檔人員": (element['empName'] ? element['empName'] : null),
            "熱軋長度": (element['ppRollLength'] ? element['ppRollLength'] : null),
            "投產類型": (element['inputLinupDesc'] ? element['inputLinupDesc'] : null),
            "訂單長度": (element['saleItemLength'] ? element['saleItemLength'] : null),
            "產品種類": (element['kindType'] ? element['kindType'] : null),
            "產品細分": (element['kindTypeDetial'] ? element['kindTypeDetial'] : null),
            "倒角": (element['chamfer'] ? element['chamfer'] : null),
            "CYCLE_NO": (element['cycleNo'] ? element['cycleNo'] : null),
            "LOCK": (element['lock'] ? element['lock'] : null),
            "代工廠名稱": (element['vendorName'] ? element['vendorName'] : null),
            "代工": (element['oemCode'] ? element['oemCode'] : null),
            "允收短尺支數": (element['barShortPc'] ? element['barShortPc'] : null),
            "國家別": (element['countryName'] ? element['countryName'] : null),
            "備料訂單": (element['oxsaleOrder'] ? element['oxsaleOrder'] : null),
            "備料項次": (element['oxsaleItem'] ? element['oxsaleItem'] : null),
            "需ET": (element['etTest'] ? element['etTest'] : null),
            "需UT": (element['flagSetUt'] ? element['flagSetUt'] : null),
            "研發訂單": (element['sale0XOrder'] ? element['sale0XOrder'] : null),
            "研發項次": (element['sale0XItem'] ? element['sale0XItem'] : null),
            "最晚投入日": (element['lpst'] ? moment(element['lpst']).format('YYYY-MM-DD') : null),
            "最晚投入月份": (element['lpstMonth'] ? moment(element['lpstMonth']).format('YYYY-MM-DD') : null)
          }
          exportData.push(obj);
        }
      }

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '訂單統計表')
      XLSX.writeFile(wb, ExcelService.toExportFileName("訂單統計表"));

    });

  }

}

interface data {
  "id": Number,
  "plantCode": String,
  "moEdition": String,
  "saleAreaGroup": String,
  "custAbbreviations": String,
  "consignee": String,
  "classCode": String,
  "chiDesc": String,
  "saleOrder": String,
  "saleItem": String,
  "micNo": String,
  "mergeNo": String,
  "ppFlagClosed": String,
  "dateDeliveryPp": Date,
  "dateDeliverySales": Date,
  "mtrlNo": String,
  "saleOrderDia": Number,
  "hotRolledSize": Number,
  "ppShaveSize": Number,
  "saleOrderWeight": Number,
  "merageWeight": Number,
  "totalWeight": Number,
  "currentWeightB": Number,
  "currentWeightR": Number,
  "currentWeightA": Number,
  "currentWeightP": Number,
  "currentWeightS": Number,
  "currentWeightT": Number,
  "currentWeightO": Number,
  "currentWeightF": Number,
  "currentWeightZ": Number,
  "currentWeightV": Number,
  "wtVUnfinish": Number,
  "pickedNotShippingWeight": Number,
  "shippingWeight": Number,
  "rejectWeight": Number,
  "lineupDesc": String,
  "empName": String,
  "ppRollLength": Number,
  "inputLinupDesc": String,
  "saleItemLength": Number,
  "kindType": String,
  "kindTypeDetial": String,
  "chamfer": String,
  "cycleNo": String,
  "lock": String,
  "vendorName": String,
  "oemCode": String,
  "barShortPc": Number,
  "countryName": String,
  "oxsaleOrder": String,
  "oxsaleItem": String,
  "etTest": String,
  "flagSetUt": String,
  "sale0XOrder": String,
  "sale0XItem": String,
  "lpst": Date,
  "lpstMonth": String,
  "userCreate": String,
  "dateCreate": Date,
  "userUpdate": String,
  "dateUpdate": Date,
}