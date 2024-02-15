import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import * as _ from "lodash";

@Component({
  selector: 'app-customerNoAndName-dropdown',
  template: `
      <span style ="font-size: 16px; background-color:rgb(156, 182, 206); font-weight:bold; border-radius:5px; padding: 5px 5px;">客戶代號</span>
      <nz-select nzPlaceHolder="請選擇客戶代號" style="width:150px; margin-left:5px;" [(ngModel)]="customerNoInput" (ngModelChange)="customerChange('no')" nzAllowClear nzShowSearch (nzOpenChange) = "getCustomerList()" >
          <nz-option *ngFor="let customerNo of customerNoList" [nzLabel]="customerNo" [nzValue]="customerNo"></nz-option>
          <nz-option *ngIf="isCustomerListLoading" nzDisabled nzCustomContent>
              <span nz-icon nzType="loading" class="loading-icon"></span>
              客戶代號載入中..
          </nz-option>
      </nz-select>
      <span style ="font-size: 16px; background-color:rgb(156, 182, 206); font-weight:bold; border-radius:5px; padding: 5px 5px; margin-left: 20px;">客戶名稱</span>
      <nz-select nzPlaceHolder="請選擇客戶名稱" style="width:150px; margin-left:5px;" [(ngModel)]="customerNameInput" (ngModelChange)="customerChange('name')" nzAllowClear nzShowSearch (nzOpenChange) = "getCustomerList()" >
          <nz-option *ngFor="let customerName of customerNameList" [nzLabel]="customerName" [nzValue]="customerName"></nz-option>
          <nz-option *ngIf="isCustomerListLoading" nzDisabled nzCustomContent>
              <span nz-icon nzType="loading" class="loading-icon"></span>
              客戶名稱載入中..
          </nz-option>
      </nz-select>
  `,
  styles: [`

  `]
})
export class CustomerNoAndNameDropdownComponent implements OnInit {

  // 客戶清單載入中
  isCustomerListLoading = false;

  customerList : any[] = [];

  // 客戶代號選項
  customerNoList : string[] = [];

  // 客戶名稱選項
  customerNameList : string[] = [];  

  // 使用者選中的客戶代號
  customerNoInput = '';

  // 使用者選中的客戶名稱
  customerNameInput = '';

  // 發送使用者選中的客戶代號給父元件
  @Output() emitCustomerNo = new EventEmitter<string>();

  // 發送使用者選中的客戶名稱給父元件
  @Output() emitCustomerName = new EventEmitter<string>();

  constructor(private commonService:CommonService,
              private modal : NzModalService) { }

  ngOnInit(): void {

  }

  async getCustomerList(){

    if(!_.isEmpty(this.customerList)){
      return;
    }

    try{
      this.isCustomerListLoading = true;
      const resObservable$ = this.commonService.getCustomerList();
      const res = await firstValueFrom<any>(resObservable$);
      this.customerList = res.data;
     
      if(res.code !== 200){
        this.errorMSG(
          '查詢客戶資料失敗',
          `錯誤訊息 : ${res.message}`
        );
        return;
      }

      this.customerNoList = res.data.map(item => item.custNo);
      this.customerNameList = res.data.map(item => item.custAbbreviations);

    } catch (error) {
      this.errorMSG(
        '查詢客戶資料失敗',
        `伺服器異常，請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isCustomerListLoading = false;
    }
  }

  customerChange(type:string){

      // 選中某一個客戶代號則帶出對應的客戶名稱
      if(_.isEqual(type, 'no')){
        if(_.isNil(this.customerNoInput)){
          this.customerNameInput = null;
        }
        else{
          this.customerNameInput = this.customerList.find(item => item.custNo === this.customerNoInput).custAbbreviations;
        }
      }
        // 選中某一個客戶名稱則帶出對應的客戶代號
      else{
        if(_.isNil(this.customerNameInput)){
          this.customerNoInput = null;
        }
        else{
          this.customerNoInput = this.customerList.find(item => item.custAbbreviations === this.customerNameInput).custNo;
        }
      }

      this.emitCustomerNo.emit(this.customerNoInput);
      this.emitCustomerName.emit(this.customerNameInput);
  }

  errorMSG(_title, _context): void {
    this.modal.error({
      nzTitle: _title,
      nzContent: `${_context}`,
    });
  }

}
