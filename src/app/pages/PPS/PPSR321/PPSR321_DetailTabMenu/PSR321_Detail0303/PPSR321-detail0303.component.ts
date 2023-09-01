import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PPSR321DataPassService } from '../../PPSR321_DataPass/PPSR321-data-pass.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'src/app/services/config/cookie.service';
import * as _ from "lodash";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ppsr321-detail0303',
  templateUrl: './PPSR321-detail0303.component.html',
  styleUrls: ['./PPSR321-detail0303.component.css'],
  providers:[NzMessageService]
})
export class PPSR321Detail0303Component implements OnInit, AfterViewInit {

  // 接收月推移主檔傳遞過來的資料
  receivedData = undefined
  PLANT_CODE = '';
  USER_NAME = '';

  // 固定的查詢/新增參數
  masterType = '3';

  isLoading = false;
  isEdit = false;

  peelData = null
  peelDataEditCache = null;

  cold01Data = null
  cold01DataEditCache = null;

  cold02Data = null
  cold02DataEditCache = null;

  grindData = null
  grindDataEditCache = null;

  constructor(private ppsr321DataPassService: PPSR321DataPassService,
              private ppsService: PPSService,
              private Modal: NzModalService,
              private nzMessageService: NzMessageService,
              private cookieService: CookieService) {

    // 接收月推移主檔傳遞過來的資料
    this.receivedData = this.ppsr321DataPassService.mainData;
    this.PLANT_CODE = this.cookieService.getCookie("plantCode");
    this.USER_NAME = this.cookieService.getCookie("USERNAME");

    this.peelData = {
      plantCode : this.PLANT_CODE,
      plant : '直棒',
      shiftEdition : this.receivedData.shiftEdition,
      masterType : this.masterType,
      detailType : '削皮股',
      instructions : '',
      userCreate : this.USER_NAME
    }

    this.cold01Data = {
      plantCode : this.PLANT_CODE,
      plant : '直棒',
      shiftEdition : this.receivedData.shiftEdition,
      masterType : this.masterType,
      detailType : '冷抽一股',
      instructions : '',
      userCreate : this.USER_NAME
    }

    this.cold02Data = {
      plantCode : this.PLANT_CODE,
      plant : '直棒',
      shiftEdition : this.receivedData.shiftEdition,
      masterType : this.masterType,
      detailType : '冷抽二股',
      instructions : '',
      userCreate : this.USER_NAME
    }

    this.grindData = {
      plantCode : this.PLANT_CODE,
      plant : '直棒',
      shiftEdition : this.receivedData.shiftEdition,
      masterType : this.masterType,
      detailType : '研磨股',
      instructions : '',
      userCreate : this.USER_NAME
    }

    this.cancel();             
  }

  ngOnInit(): void {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.findAllDetail0303DataList();
  }

  async findAllDetail0303DataList(){
    try{
      this.isLoading = true;

      const resObservable$ = this.ppsService.getDetail03ByCondition(this.receivedData.shiftEdition, this.masterType);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取「排程生產原則說明」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      if(res.data.length <= 0){
        return;
      }

      for (const elem of res.data) {
        if(elem.detailType === '削皮股'){
          this.peelData = elem;
          continue;
        }
        if(elem.detailType === '冷抽一股'){
          this.cold01Data = elem;
          continue;
        }
        if(elem.detailType === '冷抽二股'){
          this.cold02Data = elem;
          continue;
        }
        if(elem.detailType === '研磨股'){
          this.grindData = elem;
          continue;
        }
      }

      // clone一份到編輯緩存用的陣列之中
      this.cancel();
    }
    catch (error) {
      this.errorMSG(
        '獲取「排程生產原則說明」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  edit() : void {
    // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件正在新增或編輯中
    this.ppsr321DataPassService.hasEdited = '排程生產原則說明正在編輯中';
    this.isEdit = true;
  }

  async confirm() : Promise<void> {
    
    try{

      this.isLoading = true;

      const oldDatas : any[] = [];
      oldDatas.push(this.peelData, this.cold01Data, this.cold02Data, this.grindData);

      const newDatas : any[] = [];
      newDatas.push(this.peelDataEditCache, this.cold01DataEditCache, this.cold02DataEditCache, this.grindDataEditCache);
      
      // 準備新增的資料
       const insertDatas : any[] = [];
      // 準備更新的資料
      const updateDatas : any[] = [];

      for(let i=0; i<oldDatas.length; i++){
        if(_.isNil(newDatas[i].id)){
          insertDatas.push(newDatas[i]);
        }
        // 編輯的新資料與原資料不同表示需要更新
        else if(!_.isEqual(oldDatas[i], newDatas[i])){
          updateDatas.push(newDatas[i]);
        }
      }

      let isInsert = false;
      let isUpdate = false;
      if(!_.isEmpty(insertDatas)){
        const insertResObservable$ = this.ppsService.insertDetail0303Multiple(insertDatas);
        const insertRes = await firstValueFrom<any>(insertResObservable$);
         
        if(insertRes.code !== 200){
          this.errorMSG(
            '修改「排程生產原則說明」資料失敗',
            `請聯繫系統工程師。錯誤訊息 : ${insertRes.message}`
          );
          this.isLoading = false;
          return;
        }

        isInsert = true;
      }

      // 該批資料更新中為空，新增中也為空
      // 表示資料都為更新但與原資料都相同，不給予更新
      if(_.isEmpty(updateDatas) && _.isEmpty(insertDatas)){
          this.nzMessageService.warning('未修改任何資料，無法更新');
          return;
      }
      else if(!_.isEmpty(updateDatas)){
          
          
          isUpdate = true;
      }
        
      // 只要有新增或更新就重新拿取資料
      if(isInsert || isUpdate){
        await this.findAllDetail0303DataList();
      }

    }
    catch (error) {
      this.errorMSG(
        '修改「排程生產原則說明」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  
  cancel() : void {
    this.peelDataEditCache = _.cloneDeep(this.peelData);
    this.cold01DataEditCache = _.cloneDeep(this.cold01Data);
    this.cold02DataEditCache = _.cloneDeep(this.cold02Data);
    this.grindDataEditCache = _.cloneDeep(this.grindData);   
    // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件取消編輯
    this.ppsr321DataPassService.hasEdited = '';
    this.isEdit = false;
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
