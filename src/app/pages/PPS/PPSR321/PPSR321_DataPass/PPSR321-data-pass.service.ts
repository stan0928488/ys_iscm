import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PPSR321DataPassService {

  // 刷新主檔畫面
  private refresh = new Subject<boolean>();

   // 接收月推移主檔傳遞過來的資料
  private _mainData: any;

  // 任一子元件是否正在編輯中
  private _hasEdited : string = '';

  constructor() { }

  setRefresh(_data: boolean) {
      this.refresh.next(_data);
  }

  getRefresh() {
      return this.refresh.asObservable();
  }

   // 接收月推移主檔傳遞過來的資料
  get mainData(): any {
    return this._mainData;
  }

  // 設定月推移主檔傳遞過來的資料
  set mainData(data: any) {
    this._mainData = data;
  }

  get hasEdited(): any {
    return this._hasEdited;
  }

  set hasEdited(data: any) {
    this._hasEdited = data;
  }
}
