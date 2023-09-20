import { Component, OnInit, Renderer2 } from '@angular/core';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { tap } from 'rxjs/operators';
import { ColDef } from 'ag-grid-community';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';

interface ItemData {
  mergeNo: string;
  mergeSaleOrder: string;
  saleItem: number;
  saleLineno: number;
  gradeNo: string;
  orderDia: number;
  orderMicNo: string;
  mergeCycleNo: string;
  mergeBlock: string;
  billetTypeNo: string;
  mergeShape: string;
  mergeRollLength: string;
}
@Component({
  selector: 'app-PPSR332_yw',
  templateUrl: './PPSR332_yw.component.html',
  styleUrls: ['./PPSR332_yw.component.css'],
  providers: [NzMessageService],
})
export class PPSR332YwComponent implements OnInit {
  constructor(
    private PPSService: PPSService,
    private message: NzMessageService,
    private renderer: Renderer2,
    private modal: NzModalService
  ) {}

  gridOptions = {
    defaultColDef: {
      sortable: false,
      resizable: true,
    },
    api: null,
  };

  ngOnInit(): void {
    this.getData();
    this.getProfiles();
  }

  public columnDefs: ColDef[] = [
    { headerName: '合併單號', field: 'mergeNo', width: 200, editable: false },
    {
      headerName: '訂單號碼',
      field: 'mergeSaleOrder',
      width: 190,
      editable: false,
    },
    { headerName: '訂單項次', field: 'saleItem', width: 90, editable: false },
    {
      headerName: '訂單行號',
      field: 'saleLineno',
      width: 90,
      editable: false,
    },
    { headerName: '鋼種', field: 'gradeNo', width: 90, editable: false },
    {
      headerName: '訂單最終尺寸',
      field: 'orderDia',
      width: 115,
      editable: false,
    },
    {
      headerName: '訂單最終MIC',
      field: 'orderMicNo',
      width: 150,
      editable: false,
    },
    {
      headerName: '生產時機安排',
      field: 'mergeCycleNo',
      width: 115,
      editable: false,
    },
    {
      headerName: '是否安排軋延生產',
      field: 'mergeBlock',
      width: 140,
      editable: false,
    },
    {
      headerName: '鋼胚種類',
      field: 'billetTypeNo',
      width: 90,
      editable: false,
    },
    {
      headerName: '鋼胚形狀',
      field: 'mergeShape',
      width: 130,
      editable: false,
    },
    {
      headerName: '訂單長度',
      field: 'mergeRollLength',
      width: 90,
      editable: false,
    },
  ];

  isLoading: boolean = false;
  // newCoolingBed: number;
  // newNaturalAttritionRate: number;
  // newHeadCut: number;
  // newTailCut: number;
  // newCutDamage: number;
  // isChange: boolean = false;

  // panels = [
  //   {
  //     active: true,
  //     name: '新增熱軋棒參數',
  //     disabled: false,
  //   },
  // ];

  dataList;
  async getData() {
    this.isLoading = true;
    this.PPSService.getMergeResult().subscribe((res) => {
      if (res['code'] === 200) {
        this.dataList = res['data'];
        this.isLoading = false;
      }
    });
  }

  getProfiles() {
    this.PPSService.getProfiles().subscribe((res) => {
      console.log(res);
    });
  }

  // async sendData() {
  //   const currentDate = moment();
  //   const newDate = currentDate.format('YYYYMMDDHHmmss');
  //   let sendData = {
  //     id: newDate,
  //     coolingBed: this.newCoolingBed,
  //     naturalAttritionRate: this.newNaturalAttritionRate,
  //     headCut: this.newHeadCut,
  //     tailCut: this.newTailCut,
  //     cutDamage: this.newCutDamage,
  //     dateCreate: newDate,
  //   };

  //   if (this.newCoolingBed == null) {
  //     this.message.error('請輸入Cooling Bed 有效長度');
  //   } else if (this.newCoolingBed < 0) {
  //     this.message.error('Cooling Bed 不得小於 0 ');
  //   } else if (this.newNaturalAttritionRate == null) {
  //     this.message.error('請輸入自然損耗率');
  //   } else if (
  //     this.newNaturalAttritionRate < 0 ||
  //     this.newNaturalAttritionRate > 100
  //   ) {
  //     this.message.error('自然損耗率輸入範圍為 1 ~ 100');
  //   } else if (this.newHeadCut == null) {
  //     this.message.error('請輸入頭切長度');
  //   } else if (this.newHeadCut < 0) {
  //     this.message.error('頭切長度 不得小於 0 ');
  //   } else if (this.newTailCut == null) {
  //     this.message.error('請輸入尾切長度');
  //   } else if (this.newTailCut < 0) {
  //     this.message.error('尾切長度 不得小於 0 ');
  //   } else if (this.newCutDamage == null) {
  //     this.message.error('請輸入刀損');
  //   } else if (this.newCutDamage < 0) {
  //     this.message.error('刀損 不得小於 0 ');
  //   } else {
  //     this.isUpdate = true;
  //     this.PPSService.postInsertParameter(sendData)
  //       .pipe(
  //         tap((data) => {
  //           this.getData();
  //         })
  //       )
  //       .subscribe((res) => {});
  //     // await this.getData();
  //   }
  // }

  // changeUse(params) {
  //   const currentDate = moment();
  //   const newDate = currentDate.format('YYYYMMDDHHmmss');
  //   let sendData = {
  //     id: params.id,
  //     coolingBed: params.coolingBed,
  //     naturalAttritionRate: params.naturalAttritionRate,
  //     headCut: params.headCut,
  //     tailCut: params.tailCut,
  //     cutDamage: params.cutDamage,
  //     dateUse: newDate,
  //   };
  //   this.PPSService.postSelectTbpomm04(sendData)
  //     .pipe(
  //       tap((data) => {
  //         this.getData();
  //         this.message.success('切換完成');
  //         this.isChange = false;
  //       })
  //     )
  //     .subscribe((res) => {});
  // }

  // updateById(params) {
  //   // const currentDate = moment();
  //   // const newDate = currentDate.format('YYYYMMDDHHmmss');
  //   let sendData = {
  //     id: params.id,
  //     coolingBed: params.coolingBed,
  //     naturalAttritionRate: params.naturalAttritionRate,
  //     headCut: params.headCut,
  //     tailCut: params.tailCut,
  //     cutDamage: params.cutDamage,
  //   };
  //   this.PPSService.postUpdateTbpomm04(sendData)
  //     .pipe(
  //       tap((data) => {
  //         this.getData();
  //         this.message.success('修改完成');
  //         this.isChange = false;
  //       })
  //     )
  //     .subscribe((res) => {});
  // }

  // deleteById(params) {
  //   // const currentDate = moment();
  //   // const newDate = currentDate.format('YYYYMMDDHHmmss');
  //   let sendData = {
  //     id: params.id,
  //     coolingBed: params.coolingBed,
  //     naturalAttritionRate: params.naturalAttritionRate,
  //     headCut: params.headCut,
  //     tailCut: params.tailCut,
  //     cutDamage: params.cutDamage,
  //   };
  //   this.PPSService.postDeleteTbpomm04(sendData)
  //     .pipe(
  //       tap((data) => {
  //         this.getData();
  //         this.message.success('刪除完成');
  //         this.isChange = false;
  //       })
  //     )
  //     .subscribe((res) => {});
  // }

  // confirmDelete(params): void {
  //   this.modal.confirm({
  //     nzTitle: '確定刪除此筆資料',
  //     nzOkText: 'Yes',
  //     nzOkType: 'primary',
  //     nzOkDanger: true,
  //     nzOnOk: () => {
  //       this.message.info('刪除中');
  //       this.deleteById(params);
  //     },
  //     nzCancelText: 'No',
  //     nzOnCancel: () => this.message.info('已取消'),
  //   });
  // }

  // confirmUpdate(params): void {
  //   this.modal.confirm({
  //     nzTitle: '確定修改此筆資料',
  //     nzOkText: 'Yes',
  //     nzOkType: 'primary',
  //     nzOnOk: () => {
  //       this.message.info('修改中');
  //       this.updateById(params);
  //     },
  //     nzCancelText: 'No',
  //     nzOnCancel: () => this.message.info('已取消'),
  //   });
  // }

  // confirmChange(params): void {
  //   this.modal.confirm({
  //     nzTitle: '確定啟用此筆資料',
  //     nzOkText: 'Yes',
  //     nzOkType: 'primary',
  //     nzOnOk: () => {
  //       this.message.info('切換中');
  //       this.changeUse(params);
  //     },
  //     nzCancelText: 'No',
  //     nzOnCancel: () => this.message.info('已取消'),
  //   });
  // }
}
