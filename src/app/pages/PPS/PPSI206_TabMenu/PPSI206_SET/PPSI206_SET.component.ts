import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColDef, ColGroupDef, ColumnApi, GridApi, GridReadyEvent, ValueParserParams } from 'ag-grid-community';
import * as _ from 'lodash';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppComponent } from 'src/app/app.component';
import { BtnCellRendererUpdate } from 'src/app/pages/RENDERER/BtnCellRendererUpdate.component';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { ExcelService } from 'src/app/services/common/excel.service';
import { CookieService } from 'src/app/services/config/cookie.service';
import { AGCustomHeaderComponent } from "src/app/shared/ag-component/ag-custom-header-component";
import * as XLSX from 'xlsx';
import { PlanItemDatePickerCellEditor } from './PlanItemDatePickerCellEditor.component';
import * as moment from 'moment';



@Component({
  selector: 'app-PPSI206',
  templateUrl: './PPSI206_SET.component.html',
  styleUrls: ['./PPSI206_SET.component.scss'],
  providers: [NzMessageService],
})
export class PPSI206SETComponent implements OnInit {
  public editType: 'fullRow' = 'fullRow';
  importAndConvert:boolean;
  postData = {};
  PLANT = '直棒';
  userName: string;
  plantCode: string;
  loading = false; //loaging data flag
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  isErrorMsg = false;
  isEditing = false;
  myContext: any;

  tbppsm040EditCacheList: { [id: string]: { data: any } } = {};

  //新增視窗開關
  isVisibleYield: boolean;

  // ag grid Api物件
  gridApi : GridApi;
  gridColumnApi : ColumnApi;
  agGridContext : any;

  isERROR = false;
  arrayBuffer: any;
  file: File;
  importdata = [];
  importdata_new = [];
  errorTXT = [];
  rowData: ItemData[] = [];
  whichRow;
  conditionList: string[] = [];

  frameworkComponents;

  gridOptions = {
    defaultColDef: {
      editable: true,
      sortable: false,
      resizable: true,
      filter: true,
    },
    components: {
      PlanItemDatePickerCellEditor: PlanItemDatePickerCellEditor,
    },
    api: null,
  };

  constructor(
    private PPSService: PPSService,
    private excelService: ExcelService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private cdRef: ChangeDetectorRef,
    private appComponent: AppComponent
  ) {
    this.i18n.setLocale(zh_TW);
    this.userName = this.cookieService.getCookie('USERNAME');
    this.plantCode = this.cookieService.getCookie('plantCode');
    this.frameworkComponents = {
      buttonRenderer: BtnCellRendererUpdate,
    }
    this.myContext = {
      componentParent: this,
    };
  }

  ngOnInit(): void {
    this.isVisibleYield = false;
    this.loading = false;
    this.isErrorMsg = false;
    this.importdata = [];
    this.importdata_new = [];
    this.isERROR = false;
    this.errorTXT = [];
    this.getTbppsm040();
  }

  incomingfile(event) {
    this.file = event.target.files[0]; 
    console.log("incomingfile e : " + this.file);
    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx') {
      this.message.error('檔案格式錯誤 僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    }
  }

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    let myObj = this;
    this.PPSService.getRunFCPCount().subscribe((res: number) => {
      console.log('getRunFCPCount success');
      if (res > 0) this.isRunFCP = true;
    });
  }

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      width: 100,
      headerName: '序列',
      field: 'planItem',
      editable: false,
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'MIC_NO',
      field: 'micNo',
      editable: false,
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: 'ID_NO',
      field: 'idNo',
      editable: false,
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 130,
      headerName: '訂單編號',
      field: 'saleOrder',
      editable: false,
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '訂單項次',
      field: 'saleItem',
      editable: false,
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '訂單長度',
      field: 'saleOrderLength',
      editable: false,
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 150,
      headerName: '生計交期',
      field: 'dateDeliveryPp',
      headerComponent: AGCustomHeaderComponent,
      cellEditor: 'PlanItemDatePickerCellEditor',
      cellRenderer: (data) => {
        if(data.value){
          return moment(data.value).format('YYYY/MM/DD')
        }
      }
    },
    {
      width: 110,
      headerName: 'ID尺寸',
      field: 'dia',
      valueParser: (params: ValueParserParams): number => {
        return Number.isNaN(Number(params.newValue))
        ? params.oldValue
        : Number(params.newValue);
      },
      headerComponent: AGCustomHeaderComponent
    },
    
    {
      width: 150,
      headerName: 'CYCLE_NO',
      field: 'cycleNo',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 120,
      headerName: '計畫重量',
      field: 'planWeightI',
      valueParser: (params: ValueParserParams): number => {
        return Number.isNaN(Number(params.newValue))
        ? params.oldValue
        : Number(params.newValue);
      },
      headerComponent: AGCustomHeaderComponent
    },
    // {
    //   width: 150,
    //   headerName: '軋延日期',
    //   field: 'millDate',
    //   headerComponent: AGCustomHeaderComponent
    // },
    {
      width: 200,
      headerName: '備註',
      field: 'comment',
      editable: false,
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 150,
      headerName: 'Action',
      editable: false,
      cellRenderer: BtnCellRendererUpdate,
      cellRendererParams: [
        {
          onClick: this.onBtnClick1.bind(this)
        },
        {
          onClick: this.onBtnClick2.bind(this)
        },
        {
          onClick: this.onBtnClick3.bind(this)
        }
      ]
    },
  ];
  
  excelExport() {

    let exportData = [];
    let dateFieldArr = ["dateDeliveryPp","millDate"];
    let appComponent = this.appComponent;

    this.PPSService.getTbppsm040("YS").subscribe((res) => {
      
      let result: any = res;
      if (result.data && result.data.length > 0) {
        if (result.data[0]) {
          for (var i = 0; i <= result.data.length; i++) {
            var element = result.data[i];
            if (element) {
              var obj = {};
              this.columnDefs.forEach(function(temp){
                if(temp['headerName'] == 'Action'){
                }else{
                  if(dateFieldArr.includes(temp['field'])){
                    obj[temp['headerName']] =  appComponent.dateObjFormat(element[temp['field']], 2);
                  }else{
                    obj[temp['headerName']] = element[temp['field']]
                  }
                }
              });
              exportData.push(obj);
            }
          }
        } else {
          this.rowData = [];
        }
      }

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '虛擬訂單設定')
      XLSX.writeFile(wb, ExcelService.toExportFileName("虛擬訂單設定"));

    });

  }

  getTbppsm040() {
    this.PPSService.getTbppsm040("YS").subscribe((res) => {
      let result: any = res;
      this.loading = false;
      if (result.data && result.data.length > 0) {
        if (result.data[0]) {
          this.rowData = result.data.map(
            (itemData) => itemData as ItemData
          ) as ItemData[];
        } else {
          this.rowData = [];
        }
      } else {
        this.message.error('無資料');
        return;
      }
    });
  }

  update() {
    this.gridOptions.defaultColDef.editable = true;
  }

  // update
  editRow(id: number): void {
  }

  // delete
  deleteRow(id: number): void {
    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        this.delData(id);
      },
      nzOnCancel: () => console.log('cancel'),
    });
  }

  // update Save
  saveEdit(rowData: any, id: number): void {
    let myObj = this;
    if (rowData.schShopCode === undefined) {
      myObj.message.create('error', '「站別」不可為空');
      return;
    } else if (rowData.equipCode === undefined) {
      myObj.message.create('error', '「機台」不可為空');
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.updateSave(rowData, id);
          this.loading = true;
        },
        nzOnCancel: () => console.log('cancel'),
      });
    }
  }

  // 修改資料
  updateSave(rowData, _id) {
    let myObj = this;
    this.loading = true;
    console.log(rowData);
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        id: rowData.id,
        plant : this.PLANT,
        schShopCode: rowData.schShopCode,
        equipCode: rowData.equipCode,
        cumsumType: rowData.cumsumType,
        accumulation: rowData.accumulation,
        dateLimit: rowData.dateLimit,
        useFlag: rowData.useFlag,
        userUpdate: this.userName,
      });
      myObj.PPSService.updateTbppsm040(obj).subscribe(
        (res) => {
        },
        (err) => {
          reject('upload fail');
          this.errorMSG('修改失敗', '後台修改錯誤，請聯繫系統工程師');
          this.loading = false;
        }
      );
    });
  }

  // 刪除資料
  delData(_id) {
    let myObj = this;
    this.loading = true;
    return new Promise((resolve, reject) => {
    });
  }

  clearFile() {
    this.file = null;
  }

  uploadExcel() {

    if(this.file === null || this.file === undefined) {
      this.message.error("請先上傳檔案")
      return
    }

    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx') {
      this.message.error('檔案格式錯誤 僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {

      this.Modal.confirm({
        nzTitle: '匯入資料後，是否同步生成虛擬訂單結果？',
        nzOnOk: () => {
          this.importAndConvert = true;
          this.importExcel();
        },
        nzOnCancel: () => {
          this.importExcel();
        }
      });

      
    }

  }

  importExcel(){

    this.loading = true;

    let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary",cellDates: true,
        cellNF: false,
        cellText: false,
        dateNF:"yyyy/mm/dd" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet: any = workbook.Sheets[first_sheet_name];
        this.importdata = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        this.postData = {
          excelData:this.importdata,
          userName:this.userName
        }
        return new Promise((resolve, reject) => {

          var myObj = this;
          console.log("匯入開始");
          myObj.PPSService.importTbppsm040(this.postData).subscribe(res => {

            this.loading = false;

            var ress:any = res;
            if(ress.code === "Y") { 
              if(this.importAndConvert){
                this.convertData();
              }else{
                this.getTbppsm040();
              }
              this.message.info("EXCCEL上傳成功");
            } else {
              this.message.error("匯入錯誤<br>"+ress.MSG);
            }
            this.clearFile();

          },err => {
            this.loading = false;
            this.message.error("後台存檔錯誤，請聯繫系統工程師");
            this.clearFile();
          })

        });

      }
      fileReader.readAsArrayBuffer(this.file);

  }

  sucessMSG(_title, _plan): void {
    this.Modal.success({
      nzTitle: _title,
      nzContent: `${_plan}`,
    });
  }

  errorMSG(_title, _context): void {
    this.Modal.error({
      nzTitle: _title,
      nzContent: `${_context}`,
    });
  }

  // 資料生成
  convertData() {
    let myObj = this;
    let obj = {};
    this.loading = true;
    myObj.PPSService.convertTbppsm041(obj).subscribe(res =>{
      if(res['code'] == 200){
        this.message.info('成功');
        this.getTbppsm040();
      }else{
        this.message.error('失敗');
      }
      this.loading = false;
    });

  }

  // 修改
  savedtlRow(data,index) {
    this.PPSService.savetTbppsm040(data).subscribe(res =>{
      if(res['code'] == 200){
        this.message.info('修改成功');
      }else{
        this.message.error('修改失敗');
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onBtnClick1(e) {
    e.params.api.setFocusedCell(e.params.node.rowIndex, "comment");
    e.params.api.startEditingCell({
      rowIndex: e.params.node.rowIndex,
      colKey: "comment"
    });
  }
  
  onBtnClick2(e) {
    e.params.api.stopEditing();
    this.savedtlRow(e.rowData,e.rowData.id);
  }

  onBtnClick3(e) {
  }

}

interface ItemData {
  id: string;
  plantCode: string;
  plant: string;
  planItem: string;
  micNo: string;
  idNo: string;
  saleOrder: string;
  saleItem: string;
  saleOrderLength: number;
  dateDeliveryPp: Date;
  dia: number;
  cycleNo: string;
  planWeightI: number;
  millDate: Date;
  comment: string;
  dateCreate: Date;
  userCreate: string;
  dateUpdate: Date;
  userUpdate: string;
}
