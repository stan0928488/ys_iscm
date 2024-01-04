import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, HostListener } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { PPSService } from "src/app/services/PPS/PPS.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as moment from 'moment';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import { ExcelService } from "src/app/services/common/excel.service";
import { AGCustomHeaderComponent } from "src/app/shared/ag-component/ag-custom-header-component";
import { BtnCellRenderer } from '../../RENDERER/BtnCellRenderer.component';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: "app-PPSI105",
  templateUrl: "./PPSI105.component.html",
  styleUrls: ["./PPSI105.component.scss"],
  providers:[NzMessageService]
})
export class PPSI105Component implements OnInit {
  // 測試預覽圖
  // @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  // @ViewChild('pasteArea') pasteArea!: ElementRef<HTMLTextAreaElement>;

  // selectedFile: File | null = null;
  // previewURL: string | ArrayBuffer | null = null;
  // pasteContent: string = ''; // 新增這行


  constructor(
    // private clipboard: Clipboard,
    private elementRef:ElementRef,
    private PPSService: PPSService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
    private excelService: ExcelService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
    this.frameworkComponents = {
      buttonRenderer: BtnCellRenderer,
    };
  }


  thisTabName = "大調機(PPSI205)";
  PPSINP04List_tmp;
  PPSINP04List: ItemData4[] = [];
  editCache4: { [key: string]: { edit: boolean; data: ItemData4 } } = {};
  displayPPSINP04List : ItemData4[] = [];

  tableHeight: string;
  frameworkComponents: any;

  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  PLANT_CODE;

  // 大調機
  EQUIP_CODE_4;
  DIA_MIN_4;
  DIA_MAX_4;
  SHAPE_TYPE_4;
  BIG_ADJUST_CODE_4;
  SMALL_ADJUST_TOLERANCE_4;
  FURANCE_BATCH_QTY_4; 
  isVisibleBigAdjust = false;
  searchEquipCode4Value = '';
  searchDiaMin4Value = '';
  searchDiaMax4Value = '';
  searchShapeType4Value = '';
  searchBigAdjustCode4Value = '';
  searchSmallAdjustTolerance4Value = '';
  searchFuranceBatchQty4Value = '';

  file:File;
  inputFileUseInUpload;
  arrayBuffer:any;
  importdata = [];
  titleArray = ["機台","產出尺寸最小值","產出尺寸最大值","產出型態","大調機代碼","小調機公差標準","爐批數量"];
  importdata_repeat = [];

  gridOptions = {
    defaultColDef: {
      editable: true,
      enableRowGroup: false,
      enablePivot: false,
      enableValue: false,
      sortable: false,
      resizable: true,
      filter: true,
    },
    api: null,
  };

  columnDefs = [
    {
      width: 100,
      headerName: '機台',
      field: 'EQUIP_CODE_4',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 100,
      headerName: '產出尺寸最小值',
      field: 'DIA_MIN_4',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 100,
      headerName: '產出尺寸最大值',
      field: 'DIA_MAX_4',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 130,
      headerName: '產出型態',
      field: 'SHAPE_TYPE_4',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 120,
      headerName: '大調機代碼',
      field: 'BIG_ADJUST_CODE_4',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 130,
      headerName: '小調機公差標準',
      field: 'SMALL_ADJUST_TOLERANCE_4',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 110,
      headerName: '爐批數量',
      field: 'FURANCE_BATCH_QTY_4',
      headerComponent: AGCustomHeaderComponent
    },
    {
      width: 150,
      headerName: 'Action',
      editable: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: [
        {
          onClick: this.onBtnClick1.bind(this),
        },
        {
          onClick: this.onBtnClick2.bind(this),
        },
        {
          onClick: this.onBtnClick3.bind(this),
        },
        {
          onClick: this.onBtnClick4.bind(this),
        },
      ],
    },
  ];



  ngAfterViewInit() {
    const aI105Tab = this.elementRef.nativeElement.querySelector('#aI105') as HTMLAnchorElement;
    const liI105Tab = this.elementRef.nativeElement.querySelector('#liI105') as HTMLLIElement;
    liI105Tab.style.backgroundColor = '#E4E3E3';
    aI105Tab.style.cssText = 'color: blue; font-weight:bold;';
  }
  
  ngOnInit() {
    console.log("ngAfterViewChecked");
    this.getPPSINP04List();
    this.tableHeight = (window.innerHeight - 250).toString() + "px";
  }
  
  getPPSINP04List() {
    this.loading = true;
    let myObj = this;
    this.PPSService.getPPSINP04List('1').subscribe(res => {
      console.log("getFCPTB26List success");
      this.PPSINP04List_tmp = res;

      const data = [];
      for (let i = 0; i < this.PPSINP04List_tmp.length ; i++) {
        data.push({
          id: `${i}`,
          tab4ID: this.PPSINP04List_tmp[i].ID,
          EQUIP_CODE_4: this.PPSINP04List_tmp[i].EQUIP_CODE,
          DIA_MIN_4: this.PPSINP04List_tmp[i].DIA_MIN,
          DIA_MAX_4: this.PPSINP04List_tmp[i].DIA_MAX,
          SHAPE_TYPE_4: this.PPSINP04List_tmp[i].SHAPE_TYPE,
          BIG_ADJUST_CODE_4: this.PPSINP04List_tmp[i].BIG_ADJUST_CODE,
          SMALL_ADJUST_TOLERANCE_4: this.PPSINP04List_tmp[i].SMALL_ADJUST_TOLERANCE,
          FURANCE_BATCH_QTY_4: this.PPSINP04List_tmp[i].FURANCE_BATCH_QTY
        });
      }
      this.PPSINP04List = data;
      this.updateEditCache();
      myObj.loading = false;
    });
  }


  // insert
  insertTab() {
    let myObj = this;
    if (this.EQUIP_CODE_4 === undefined) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (this.DIA_MIN_4 === undefined) {
      myObj.message.create("error", "「產出尺寸最小值」不可為空");
      return;
    }  else if (this.DIA_MAX_4 === undefined) {
      myObj.message.create("error", "「產出尺寸最大值」不可為空");
      return;
    }   else if (this.SHAPE_TYPE_4 === undefined) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    }   else if (this.BIG_ADJUST_CODE_4 === undefined) {
      myObj.message.create("error", "「大調機代碼」不可為空");
      return;
    }   else if (this.SMALL_ADJUST_TOLERANCE_4 === undefined) {
      myObj.message.create("error", "「小調機公差標準」不可為空");
      return;
    }   else if (this.FURANCE_BATCH_QTY_4 === undefined) {
      myObj.message.create("error", "「爐批數量」不可為空");
      return;
    }else {
      this.Modal.confirm({
        nzTitle: '是否確定新增',
        nzOnOk: () => {
          this.insertSave()
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }


  // update
  editRow(id: string): void {
    this.editCache4[id].edit = true;
  }
  
  // delete
  deleteRow(rowData: ItemData4): void {
    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        this.delID(rowData)
      },
      nzOnCancel: () =>
        console.log("cancel")
    });
  }


  // cancel
  cancelEdit(id: string): void {
    const index = this.PPSINP04List.findIndex(item => item.id === id);
    this.editCache4[id] = {
      data: { ...this.PPSINP04List[index] },
      edit: false
    };
  }


  // update Save
  saveEdit(rowData: ItemData4): void {
    let myObj = this;
    if (rowData.EQUIP_CODE_4 === undefined || "" === rowData.EQUIP_CODE_4) {
      myObj.message.create("error", "「機台」不可為空");
      return;
    } else if (rowData.DIA_MIN_4 === undefined || "" === rowData.DIA_MIN_4.toString()) {
      myObj.message.create("error", "「產出尺寸最小值」不可為空");
      return;
    } else if (rowData.DIA_MAX_4 === undefined || "" === rowData.DIA_MAX_4.toString()) {
      myObj.message.create("error", "「產出尺寸最大值」不可為空");
      return;
    } else if (rowData.SHAPE_TYPE_4 === undefined || "" === rowData.SHAPE_TYPE_4) {
      myObj.message.create("error", "「產出型態」不可為空");
      return;
    } else if (rowData.BIG_ADJUST_CODE_4 === undefined || "" === rowData.BIG_ADJUST_CODE_4) {
      myObj.message.create("error", "「大調機代碼」不可為空");
      return;
    } else if (rowData.SMALL_ADJUST_TOLERANCE_4 === undefined || "" === rowData.SMALL_ADJUST_TOLERANCE_4) {
      myObj.message.create("error", "「小調機公差標準」不可為空");
      return;
    } else if (rowData.FURANCE_BATCH_QTY_4 === undefined || "" === rowData.FURANCE_BATCH_QTY_4.toString()) {
      myObj.message.create("error", "「爐批數量」不可為空");
      return;
    } else {
      this.Modal.confirm({
        nzTitle: '是否確定修改',
        nzOnOk: () => {
          this.updateSave(rowData)
        },
        nzOnCancel: () =>
          console.log("cancel")
      });
    }
  }
  

  // update
  updateEditCache(): void {
    this.PPSINP04List.forEach(item => {
      this.editCache4[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }


  // 新增資料
  insertSave() {
    let myObj = this;
    this.LoadingPage = true;
    
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        EQUIP_CODE : this.EQUIP_CODE_4,
        DIA_MIN : this.DIA_MIN_4,
        DIA_MAX : this.DIA_MAX_4,
        SHAPE_TYPE : this.SHAPE_TYPE_4,
        BIG_ADJUST_CODE : this.BIG_ADJUST_CODE_4,
        SMALL_ADJUST_TOLERANCE : this.SMALL_ADJUST_TOLERANCE_4,
        FURANCE_BATCH_QTY : this.FURANCE_BATCH_QTY_4,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })

      myObj.PPSService.insertI104Tab1Save('1', obj).subscribe(res => {

        console.log(res)
        if(res[0].MSG === "Y") {
          this.EQUIP_CODE_4 = undefined;
          this.DIA_MIN_4 = undefined;
          this.DIA_MAX_4 = undefined;
          this.SHAPE_TYPE_4 = undefined;
          this.BIG_ADJUST_CODE_4 = undefined;
          this.SMALL_ADJUST_TOLERANCE_4 = undefined;
          this.FURANCE_BATCH_QTY_4 = undefined;
          this.getPPSINP04List();
          this.sucessMSG("新增成功", ``);
          this.isVisibleBigAdjust = false;
        } else {
          this.errorMSG("新增失敗", res[0].MSG);
        }
      },err => {
        reject('upload fail');
        this.errorMSG("新增失敗", "後台新增錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }


  // 修改資料
  updateSave(rowData:ItemData4) {
    let myObj = this;
    this.LoadingPage = true;
    return new Promise((resolve, reject) => {
      let obj = {};
      _.extend(obj, {
        ID : rowData.tab4ID,
        EQUIP_CODE : rowData.EQUIP_CODE_4,
        DIA_MIN : rowData.DIA_MIN_4,
        DIA_MAX : rowData.DIA_MAX_4,
        SHAPE_TYPE : rowData.SHAPE_TYPE_4,
        BIG_ADJUST_CODE : rowData.BIG_ADJUST_CODE_4,
        SMALL_ADJUST_TOLERANCE : rowData.SMALL_ADJUST_TOLERANCE_4,
        FURANCE_BATCH_QTY : rowData.FURANCE_BATCH_QTY_4,
        USERNAME : this.USERNAME,
        DATETIME : moment().format('YYYY-MM-DD HH:mm:ss')
      })
      myObj.PPSService.updateI104Tab1Save('1', obj).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.EQUIP_CODE_4 = undefined;
          this.DIA_MIN_4 = undefined;
          this.DIA_MAX_4 = undefined;
          this.SHAPE_TYPE_4 = undefined;
          this.BIG_ADJUST_CODE_4 = undefined;
          this.SMALL_ADJUST_TOLERANCE_4 = undefined;
          this.FURANCE_BATCH_QTY_4 = undefined;

          this.sucessMSG("修改成功", ``);

          const index = this.PPSINP04List.findIndex(item => item.id === rowData.id);
          Object.assign(this.PPSINP04List[index], rowData);
          this.editCache4[rowData.id].edit = false;
        } else {
          this.errorMSG("修改失敗", res[0].MSG);
        }
      },err => {
        reject('upload fail');
        this.errorMSG("修改失敗", "後台修改錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }

  
  // 刪除資料
  delID(rowData:ItemData4) {
    let myObj = this;
    return new Promise((resolve, reject) => {
      let _ID = rowData.tab4ID;
      myObj.PPSService.delI104Tab1Data('1', _ID).subscribe(res => {
        if(res[0].MSG === "Y") {
          this.EQUIP_CODE_4 = undefined;
          this.DIA_MIN_4 = undefined;
          this.DIA_MAX_4 = undefined;
          this.SHAPE_TYPE_4 = undefined;
          this.BIG_ADJUST_CODE_4 = undefined;
          this.SMALL_ADJUST_TOLERANCE_4 = undefined;
          this.FURANCE_BATCH_QTY_4 = undefined;

          this.sucessMSG("刪除成功", ``);
          this.getPPSINP04List();
        }
      },err => {
        reject('upload fail');
        this.errorMSG("刪除失敗", "後台刪除錯誤，請聯繫系統工程師");
        this.LoadingPage = false;
      })
    });
  }

	sucessMSG(_title, _plan): void {
		this.Modal.success({
			nzTitle: _title,
			nzContent: `${_plan}`
		});
	}

	errorMSG(_title, _context): void {
		this.Modal.error({
			nzTitle: _title,
			nzContent: `${_context}`
		});
	}

  //============== 新增資料之彈出視窗 =====================
   // 新增大調機之彈出視窗
  openBigAdjustInput() : void {
    this.isVisibleBigAdjust = true;
  }
   //取消大調機彈出視窗
   cancelBigAdjustInput() : void {
    this.isVisibleBigAdjust = false;
  }
  
   // excel檔名
   incomingfile(event) {
    this.file = event.target.files[0]; 
    console.log("incomingfile e : " + this.file);
    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    }
  }

  clearFile() {
    document.getElementsByTagName('input')[0].value = '';
  }

  Upload() {
    // let getFileNull = this.inputFileUseInUpload;
    // if(getFileNull === undefined){
    //   this.errorMSG('請選擇檔案', '');
    //   return;
    // }

    let lastname = this.file.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.clearFile();
      return;
    } else {
      console.log("上傳檔案格式沒有錯誤");
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet:any = workbook.Sheets[first_sheet_name];
        this.importdata = XLSX.utils.sheet_to_json(worksheet, {raw:true});
        this.importExcel(this.importdata);
      }
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  importExcel(_data) {
    console.log("EXCEL 資料上傳檢核開始");
    var upload_data = [];
    for(let i=0 ; i < _data.length ; i++) {
      upload_data.push({
        EQUIP_CODE: _data[i]['機台'].toString(),
        DIA_MIN: _data[i]['產出尺寸最小值'].toString(),
        DIA_MAX: _data[i]['產出尺寸最大值'].toString(),
        SHAPE_TYPE: _data[i]['產出型態'].toString(),
        BIG_ADJUST_CODE: _data[i]['大調機代碼'].toString(),
        SMALL_ADJUST_TOLERANCE: _data[i]['小調機公差標準'].toString(),
        FURANCE_BATCH_QTY: _data[i]['爐批數量'].toString()
      })
    }
    
    console.log(upload_data);
    return new Promise((resolve, reject) => {
      console.log("匯入開始");
      this.LoadingPage = true;
      let myObj = this;
      let obj = {};
      obj = {
        EXCELDATA: upload_data
      };

      myObj.PPSService.importI104Excel('1', obj).subscribe(res => {
        if(res[0].MSG === "Y") { 
          this.loading = false;
          this.LoadingPage = false;
          
          this.sucessMSG("EXCCEL上傳成功", "");
          this.clearFile();
          this.getPPSINP04List()
          
        } else {
          this.errorMSG("匯入錯誤", res[0].MSG);
          this.clearFile();
          this.loading = false;
          this.LoadingPage = false;
        }
      },err => {
        reject('upload fail');
        this.errorMSG("修改存檔失敗", "後台存檔錯誤，請聯繫系統工程師");
        this.loading = false;
        this.LoadingPage = false;
      })
      this.getPPSINP04List();
    });
  }

  convertToExcel() {
    let fileName = `調機狀態_直棒`;
    let arr = [];
    
    for(let i=0 ; i < this.displayPPSINP04List.length ; i++){
      var ppsInp04 = {
        EQUIP_CODE : this.displayPPSINP04List[i].EQUIP_CODE_4,
        DIA_MIN : this.displayPPSINP04List[i].DIA_MIN_4,
        DIA_MAX: this.displayPPSINP04List[i].DIA_MAX_4,
        SHAPE_TYPE : this.displayPPSINP04List[i].SHAPE_TYPE_4,
        BIG_ADJUST_CODE : this.displayPPSINP04List[i].BIG_ADJUST_CODE_4,
        SMALL_ADJUST_TOLERANCE : this.displayPPSINP04List[i].SMALL_ADJUST_TOLERANCE_4,
        FURANCE_BATCH_QTY: this.displayPPSINP04List[i].FURANCE_BATCH_QTY_4
      }
      arr.push(ppsInp04);
    }
    this.excelService.exportAsExcelFile(arr, fileName, this.titleArray);
  }

  onBtnClick1(e) {
    e.params.api.setFocusedCell(e.params.node.rowIndex, 'FURANCE_BATCH_QTY_4');
    e.params.api.startEditingCell({
      rowIndex: e.params.node.rowIndex,
      colKey: 'FURANCE_BATCH_QTY_4',
    });
  }

  onBtnClick2(e) {
    this.saveEdit(e.rowData)
  }

  onBtnClick3(e) {
    this.cancelEdit(e.rowData.id);
  }

  onBtnClick4(e) {
    this.deleteRow(e.rowData);
  }

}

interface ItemData4 {
  id: string;
  tab4ID: number;
  EQUIP_CODE_4: string;
  DIA_MIN_4: number;
  DIA_MAX_4: number;
  SHAPE_TYPE_4: string;
  BIG_ADJUST_CODE_4: string;
  SMALL_ADJUST_TOLERANCE_4: string;
  FURANCE_BATCH_QTY_4: number; 
}








  // ----------------------------------------------------------
  // 測試預覽圖
  // @HostListener('paste', ['$event'])
  // onPaste(event: ClipboardEvent): void {
  //   this.handleClipboardImage(event);
  // }

  // handleClipboardImage(event: ClipboardEvent): void {
  //   const items = event.clipboardData?.items;

  //   if (items) {
  //     for (let i = 0; i < items.length; i++) {
  //       const item = items[i];
  //       if (item.type.startsWith('image')) {
  //         this.handleImageItem(item);
  //       }
  //     }
  //   }
  // }

  // handleImageItem(item: DataTransferItem): void {
  //   item.getAsString((url) => {
  //     const blob = this.dataURItoBlob(url);
  //     if (blob) {
  //       this.selectedFile = new File([blob], 'pasted_image.png', { type: blob.type });
  //       this.displayImagePreview();
  //       this.copyImageToClipboard();
  //     }
  //   });
  // }

  // displayImagePreview(): void {
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     this.previewURL = e.target?.result;
  //   };

  //   if (this.selectedFile) {
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }

  // copyImageToClipboard(): void {
  //   if (this.selectedFile) {
  //     const dataURL = URL.createObjectURL(this.selectedFile);

  //     // Check if the clipboard API is available
  //     if (navigator.clipboard && navigator.clipboard.writeText) {
  //       navigator.clipboard.writeText(dataURL)
  //         .then(() => {
  //           console.log('Image copied to clipboard.');
  //         })
  //         .catch((error) => {
  //           console.error('Error copying image to clipboard:', error);
  //         });
  //     } else {
  //       // Fallback for browsers that do not support the clipboard API
  //       const textArea = document.createElement('textarea');
  //       textArea.value = dataURL;
  //       document.body.appendChild(textArea);
  //       textArea.select();
  //       document.execCommand('copy');
  //       document.body.removeChild(textArea);
  //       console.log('Image copied to clipboard (fallback).');
  //     }
  //   }
  // }

  // dataURItoBlob(dataURI: string): Blob | null {
  //   const byteString = atob(dataURI.split(',')[1]);
  //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);

  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }

  //   return new Blob([ab], { type: mimeString });
  // }

// -------- ok 版本
  // onFileSelected(event: any): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   const files = fileInput.files;

  //   if (files && files.length > 0) {
  //     this.selectedFile = files[0];
  //     this.displayImagePreview();
  //     this.copyImageToClipboard();
  //   }
  // }

  // displayImagePreview(): void {
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     this.previewURL = e.target?.result;
  //   };

  //   if (this.selectedFile) {
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }

  // copyImageToClipboard(): void {
  //   if (this.selectedFile) {
  //     const dataURL = URL.createObjectURL(this.selectedFile);

  //     navigator.clipboard.writeText(dataURL)
  //       .then(() => {
  //         console.log('Image copied to clipboard.');
  //       })
  //       .catch((error) => {
  //         console.error('Error copying image to clipboard:', error);
  //       });
  //   }
  // }