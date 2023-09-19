import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PPSR321DataPassService } from '../../PPSR321_DataPass/PPSR321-data-pass.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'src/app/services/config/cookie.service';
import * as _ from "lodash";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ppsr321-detail0301',
  templateUrl: './PPSR321-detail0301.component.html',
  styleUrls: ['./PPSR321-detail0301.component.css'],
  providers:[NzMessageService]
})
export class PPSR321Detail0301Component implements OnInit, AfterViewInit {
  
  isLoading = false;
  PLANT_CODE = '';
  USER_NAME = '';

  // 固定的查詢/新增參數
  masterType = '1';
  detailType =  null;

  // 接收月推移主檔傳遞過來的資料
  receivedData = undefined

  // 是否正在編輯中
  isEdit = false;

  // 頭份預計回廠日說明資料
  detail0301Obj = null;

  // 頭份預計回廠日說明資料編輯專用緩存
  detail0301ObjEditCache = null;

  constructor(private ppsr321DataPassService: PPSR321DataPassService,
              private ppsService: PPSService,
              private Modal: NzModalService,
              private nzMessageService: NzMessageService,
              private cookieService: CookieService) {

    // 接收月推移主檔傳遞過來的資料
    this.receivedData = this.ppsr321DataPassService.mainData;

    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
    this.USER_NAME = this.cookieService.getCookie("USERNAME");
    
  }

  ngOnInit(): void {
    // router-outlet會將所有tab的頁面都載入
    // 為了避免頁面渲染拿不到instructions先給初始值
    this.detail0301Obj = {
      instructions : ''
    }
  }

  async ngAfterViewInit(): Promise<void> {
      await this.getDetail0301ByCondition();
  }

  async getDetail0301ByCondition(){

    try{
      this.isLoading = true;

      const resObservable$ = this.ppsService.getDetail03ByCondition(this.receivedData.shiftEdition, this.masterType);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取「頭份預計回廠日」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      // 如果該版次有頭份預計回廠日說明
      // 則將回傳的資料設定給detail0301Obj
      // 否則什麼也不做，沿用在OnInit初始化instructions為空的那個物件
      if(res.data.length > 0){
        this.detail0301Obj = res.data[0];
      }

      this.detail0301ObjEditCache = _.cloneDeep(this.detail0301Obj);

    }
    catch (error) {
      this.errorMSG(
        '獲取「頭份預計回廠日」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  

  edit() : void {
    // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件正在新增或編輯中
    this.ppsr321DataPassService.hasEdited = '頭份預計回廠日說明正在編輯中';
    this.isEdit = true;
  }

  async confirm() {

    // 如果有id則進行更新，否則進行新增
    if(this.detail0301ObjEditCache.id){

      // 如果使用者未修改資料不做更新的動作
      if(_.isEqual(this.detail0301Obj, this.detail0301ObjEditCache)){
        this.nzMessageService.warning('資料未做任何修改，無法更新');
        return;
      }
      await this.updateDetail0301Data();
    }
    // 進行新增
    else{

      // 使用者未輸入任何說明文字
      if(_.isEmpty(this.detail0301ObjEditCache.instructions)){
        this.nzMessageService.warning('未輸入任何說明，無法新增');
        return;
      }

      await this.insertDetail0301Data();

    }

  }

  async insertDetail0301Data(){
    try{
      this.isLoading = true;

      const payload = {
        plantCode : this.PLANT_CODE,
        plant : '直棒',
        shiftEdition : this.receivedData.shiftEdition,
        masterType : this.masterType,
        detailType : this.detailType,
        instructions : this.detail0301ObjEditCache.instructions,
        userCreate : this.USER_NAME
      }

      const resObservable$ = this.ppsService.insertDetail03(payload);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '新增「頭份預計回廠日」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      // 離開編輯狀態
      this.cancel();

      await this.getDetail0301ByCondition();

      // 通知主檔頁面更新資料並渲染畫面
      this.ppsr321DataPassService.setRefresh(true);

      this.sucessMSG(
        '新增「頭份預計回廠日」資料成功',
        `新增「頭份預計回廠日」資料成功`
      );
    }
    catch (error) {
      this.errorMSG(
        '新增「頭份預計回廠日」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }

  }

  async updateDetail0301Data(){
    try{
      this.isLoading = true;

      const resObservable$ = this.ppsService.updateDetail03ByPk(this.detail0301ObjEditCache);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '修改「頭份預計回廠日」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      // 離開編輯狀態
      this.cancel();

      await this.getDetail0301ByCondition();

      // 通知主檔頁面更新資料並渲染畫面
      this.ppsr321DataPassService.setRefresh(true);

      this.sucessMSG(
        '修改「頭份預計回廠日」資料成功',
        `修改「頭份預計回廠日」資料成功`
      );
    }
    catch (error) {
      this.errorMSG(
        '修改「頭份預計回廠日」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  cancel() : void {
    this.detail0301ObjEditCache = _.cloneDeep(this.detail0301Obj);
    // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件取消編輯
    this.ppsr321DataPassService.hasEdited = '';
    this.isEdit = false;
  }

   // 使用者離開當前頁面時，如果處於編輯狀態给於是否離開的提示
   async canDeactivate() : Promise<boolean> {

    if(this.isEdit){
      return await new Promise<boolean>((resolve) => {
        this.Modal.confirm({
          nzTitle: `頭份預計回廠日說明正在編輯中，是否離開?`,
          nzOkText: '離開',
          nzCancelText: '取消',
          nzOnOk: () => {
            // 切換至其他頁面，重置新增或編輯狀態，任何子元件都沒有在新增或編輯
            this.ppsr321DataPassService.hasEdited = ''; 
            resolve(true);
          },
          nzOnCancel: () => {
            resolve(false);
          }
        }); 
      });
    }
    return Promise.resolve(true);
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
}
