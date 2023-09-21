import { Component, OnInit, Renderer2 } from '@angular/core';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { tap } from 'rxjs/operators';
import { ColDef } from 'ag-grid-community';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';

interface ItemData {
  coolingBed: number;
  naturalAttritionRate: number;
  headCut: number;
  tailCut: number;
  cutDamage: number;
}
@Component({
  selector: 'app-PPSR330_yw',
  templateUrl: './PPSR330_yw.component.html',
  styleUrls: ['./PPSR330_yw.component.css'],
  providers: [NzMessageService],
})
export class PPSR330YwComponent implements OnInit {
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
    { headerName: '版本號', field: 'id', width: 140, editable: false },
    {
      headerName: 'Cooling Bed 有效長度',
      field: 'coolingBed',
      width: 165,
      editable: true,
    },
    {
      headerName: 'Billet -> Bar 自然損耗率',
      field: 'naturalAttritionRate',
      width: 165,
      editable: true,
    },
    { headerName: '頭切長度', field: 'headCut', width: 75, editable: true },
    { headerName: '尾切長度', field: 'tailCut', width: 75, editable: true },
    { headerName: '刀損', field: 'cutDamage', width: 50, editable: true },
    {
      headerName: '是否啟用',
      width: 100,
      cellRenderer: (params) => {
        if (params.data.status == '1') {
          const text = this.renderer.createElement('span'); // 创建一个 <span> 元素
          text.textContent = '使用中'; // 设置 <span> 元素的文本内容
          return text;
        } else {
          const buttonElement = this.renderer.createElement('button');
          const buttonText = this.renderer.createText('啟用');
          this.renderer.appendChild(buttonElement, buttonText);
          this.renderer.addClass(buttonElement, 'buttonTwo');
          this.renderer.listen(buttonElement, 'click', () => {
            this.confirmChange(params.data);
            this.isChange = true;
          });
          return buttonElement;
        }
      },
      editable: false,
    },
    { headerName: '啟用日期', field: 'dateUse', width: 165, editable: false },
    {
      headerName: '建立日期',
      field: 'dateCreate',
      width: 165,
      editable: false,
    },
    {
      headerName: '更新、刪除',
      width: 165,
      cellRenderer: (params) => {
        const container = this.renderer.createElement('div');
        this.renderer.addClass(container, 'container');

        const buttonElement1 = this.renderer.createElement('button');
        const buttonText1 = this.renderer.createText('修改');
        this.renderer.appendChild(buttonElement1, buttonText1);
        this.renderer.addClass(buttonElement1, 'buttonTwo');
        this.renderer.listen(buttonElement1, 'click', () => {
          this.confirmUpdate(params.data);
          this.isChange = true;
        });
        const buttonElement2 = this.renderer.createElement('button');
        const buttonText2 = this.renderer.createText('刪除');
        this.renderer.appendChild(buttonElement2, buttonText2);
        this.renderer.addClass(buttonElement2, 'buttonThree');
        this.renderer.listen(buttonElement2, 'click', () => {
          this.confirmDelete(params.data);
          this.isChange = true;
        });

        this.renderer.appendChild(container, buttonElement1);
        this.renderer.appendChild(container, buttonElement2);
        return container;
      },
      editable: false,
    },
  ];

  newCoolingBed: number;
  newNaturalAttritionRate: number;
  newHeadCut: number;
  newTailCut: number;
  newCutDamage: number;
  isUpdate: boolean = false;
  isChange: boolean = false;

  panels = [
    {
      active: true,
      name: '新增熱軋棒參數',
      disabled: false,
    },
  ];

  tbpomm04List;
  async getData() {
    this.PPSService.getTBPOMM04().subscribe((res) => {
      if (res['code'] === 200) {
        this.tbpomm04List = res['data'];
        this.isUpdate = false;
      }
    });
  }

  getProfiles() {
    this.PPSService.getProfiles().subscribe((res) => {
      console.log(res);
    });
  }

  async sendData() {
    const currentDate = moment();
    const newDate = currentDate.format('YYYYMMDDHHmmss');
    let sendData = {
      id: newDate,
      coolingBed: this.newCoolingBed,
      naturalAttritionRate: this.newNaturalAttritionRate,
      headCut: this.newHeadCut,
      tailCut: this.newTailCut,
      cutDamage: this.newCutDamage,
      dateCreate: newDate,
    };

    if (this.newCoolingBed == null) {
      this.message.error('請輸入Cooling Bed 有效長度');
    } else if (this.newCoolingBed < 0) {
      this.message.error('Cooling Bed 不得小於 0 ');
    } else if (this.newNaturalAttritionRate == null) {
      this.message.error('請輸入自然損耗率');
    } else if (
      this.newNaturalAttritionRate < 0 ||
      this.newNaturalAttritionRate > 100
    ) {
      this.message.error('自然損耗率輸入範圍為 1 ~ 100');
    } else if (this.newHeadCut == null) {
      this.message.error('請輸入頭切長度');
    } else if (this.newHeadCut < 0) {
      this.message.error('頭切長度 不得小於 0 ');
    } else if (this.newTailCut == null) {
      this.message.error('請輸入尾切長度');
    } else if (this.newTailCut < 0) {
      this.message.error('尾切長度 不得小於 0 ');
    } else if (this.newCutDamage == null) {
      this.message.error('請輸入刀損');
    } else if (this.newCutDamage < 0) {
      this.message.error('刀損 不得小於 0 ');
    } else {
      this.isUpdate = true;
      this.PPSService.postInsertParameter(sendData)
        .pipe(
          tap((data) => {
            this.getData();
          })
        )
        .subscribe((res) => {});
      // await this.getData();
    }
  }

  changeUse(params) {
    const currentDate = moment();
    const newDate = currentDate.format('YYYYMMDDHHmmss');
    let sendData = {
      id: params.id,
      coolingBed: params.coolingBed,
      naturalAttritionRate: params.naturalAttritionRate,
      headCut: params.headCut,
      tailCut: params.tailCut,
      cutDamage: params.cutDamage,
      dateUse: newDate,
    };
    this.PPSService.postSelectTbpomm04(sendData)
      .pipe(
        tap((data) => {
          this.getData();
          this.message.success('切換完成');
          this.isChange = false;
        })
      )
      .subscribe((res) => {});
  }

  updateById(params) {
    // const currentDate = moment();
    // const newDate = currentDate.format('YYYYMMDDHHmmss');
    let sendData = {
      id: params.id,
      coolingBed: params.coolingBed,
      naturalAttritionRate: params.naturalAttritionRate,
      headCut: params.headCut,
      tailCut: params.tailCut,
      cutDamage: params.cutDamage,
    };
    this.PPSService.postUpdateTbpomm04(sendData)
      .pipe(
        tap((data) => {
          this.getData();
          this.message.success('修改完成');
          this.isChange = false;
        })
      )
      .subscribe((res) => {});
  }

  deleteById(params) {
    // const currentDate = moment();
    // const newDate = currentDate.format('YYYYMMDDHHmmss');
    let sendData = {
      id: params.id,
      coolingBed: params.coolingBed,
      naturalAttritionRate: params.naturalAttritionRate,
      headCut: params.headCut,
      tailCut: params.tailCut,
      cutDamage: params.cutDamage,
    };
    this.PPSService.postDeleteTbpomm04(sendData)
      .pipe(
        tap((data) => {
          this.getData();
          this.message.success('刪除完成');
          this.isChange = false;
        })
      )
      .subscribe((res) => {});
  }

  confirmDelete(params): void {
    this.modal.confirm({
      nzTitle: '確定刪除此筆資料',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.message.info('刪除中');
        this.deleteById(params);
      },
      nzCancelText: 'No',
      nzOnCancel: () => this.message.info('已取消'),
    });
  }

  confirmUpdate(params): void {
    this.modal.confirm({
      nzTitle: '確定修改此筆資料',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.message.info('修改中');
        this.updateById(params);
      },
      nzCancelText: 'No',
      nzOnCancel: () => this.message.info('已取消'),
    });
  }

  confirmChange(params): void {
    this.modal.confirm({
      nzTitle: '確定啟用此筆資料',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.message.info('切換中');
        this.changeUse(params);
      },
      nzCancelText: 'No',
      nzOnCancel: () => this.message.info('已取消'),
    });
  }
}
