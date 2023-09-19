import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PPSR321DataPassService } from '../../PPSR321_DataPass/PPSR321-data-pass.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as _ from "lodash";
import { firstValueFrom } from 'rxjs';
import { CookieService } from 'src/app/services/config/cookie.service';

@Component({
  selector: 'app-ppsr321-detail01',
  templateUrl: './PPSR321-detail01.component.html',
  styleUrls: ['./PPSR321-detail01.component.css'],
  providers:[NzMessageService]
})
export class PPSR321Detail01Component implements OnInit, AfterViewInit {

  USER_NAME = '';
  PLANT_CODE = '';

  isLoading = false;

  // 是否正在編輯中
  isEdit = false;

  // 接收月推移主檔傳遞過來的資料
  receivedData: any;

  // 顯示的推移生產月份
  displayProduceMonth = '';

  // 需計算的屬性
  needSumProperties = ['PL', 'BTB', 'CTB'];

  editCacheTbppsrm011Detail01List : any[] = [];

  // 表格的數據
  tbppsrm011Detail01List : any[] = [
    {
      displayKindType : 'PL',
      kindType : 'PL',
      goalWeight : null
    },
    {
      displayKindType : 'BTB',
      kindType : 'B to B',
      goalWeight : null
    },
    {
      displayKindType : 'CTB',
      kindType : 'C to B',
      goalWeight : null
    },
    {
      displayKindType : '冷抽代工',
      kindType : '冷抽代工',
      goalWeight : null
    },
    {
      displayKindType : '合計',
      kindType : '合計',
      goalWeight : null
    },
    {
      displayKindType : '異形棒',
      kindType : '異形棒',
      goalWeight : null
    },
    {
      displayKindType : '大棒',
      kindType : '大棒',
      goalWeight : null
    }
  ];

    constructor(private ppsr321DataPassService: PPSR321DataPassService,
                private ppsService: PPSService,
                private Modal: NzModalService,
                private nzMessageService: NzMessageService,
                private cookieService: CookieService) {
      // 接收月推移主檔傳遞過來的資料
      this.receivedData = this.ppsr321DataPassService.mainData;
      this.displayProduceMonth = (this.receivedData.produceMonth as string).split('-')[1];
      
      this.PLANT_CODE = this.cookieService.getCookie("plantCode");
      this.USER_NAME = this.cookieService.getCookie("USERNAME");
    }

  ngOnInit(): void {
    
  }

  async ngAfterViewInit(): Promise<void> {
    await this.getDetail01ByShiftEdition(this.receivedData.shiftEdition)
  }


  async getDetail01ByShiftEdition(shiftEdition : string) {

    try{
      this.isLoading = true;

      const resObservable$ = this.ppsService.getDetail01ByShiftEdition(shiftEdition);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取「預計入庫資訊」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      this.assembleData(res.data);

    }
    catch (error) {
      this.errorMSG(
        '獲取月推移報表維護資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }

  }

  // 裝配渲染表格畫面之資料
  assembleData(PPSR321Detail01 : any[]){

    const cloneTbppsrm011Detail01List = _.cloneDeep(this.tbppsrm011Detail01List);

    // 該推移版次尚未儲存任何預計入庫資料
    if(_.isEmpty(PPSR321Detail01)){
      this.editCacheTbppsrm011Detail01List = _.cloneDeep(cloneTbppsrm011Detail01List);
      return;
    }

    PPSR321Detail01.forEach(item => {
      if(_.isEqual(item.kindType, 'PL')){
        _.merge(cloneTbppsrm011Detail01List[0], item);
      }
      else if(_.isEqual(item.kindType, 'B to B')){
        _.merge(cloneTbppsrm011Detail01List[1], item);
      }
      else if(_.isEqual(item.kindType, 'C to B')){
        _.merge(cloneTbppsrm011Detail01List[2], item);
      }
      else if(_.isEqual(item.kindType, '冷抽代工')){
        _.merge(cloneTbppsrm011Detail01List[3], item);
      }
      else if(_.isEqual(item.kindType, '合計')){
        _.merge(cloneTbppsrm011Detail01List[4], item);
      }
      else if(_.isEqual(item.kindType, '異形棒')){
        _.merge(cloneTbppsrm011Detail01List[5], item);
      }
      else if(_.isEqual(item.kindType, '大棒')){
        _.merge(cloneTbppsrm011Detail01List[6], item);
      }
    })

    let total = 0;
    // 計算合計為多少
    for(let i=0; i<3; i++){
      if(!_.isNil(cloneTbppsrm011Detail01List[i])){
        total += cloneTbppsrm011Detail01List[i].goalWeight;
      }
    }
    // 設定合計的計算結果
    cloneTbppsrm011Detail01List[4].goalWeight = total;

    this.editCacheTbppsrm011Detail01List = _.cloneDeep(cloneTbppsrm011Detail01List);

    this.tbppsrm011Detail01List = cloneTbppsrm011Detail01List;
  }

  // 合計計算
  // 只加總PL、BTB與CTB
  sumTotal(displayKindType : string){
   
    if(_.includes(this.needSumProperties, displayKindType)){
      // 計算合計為多少
      let total = 0;
      for(let i=0; i<3; i++){
        if(!_.isNil(this.tbppsrm011Detail01List[i])){
          total += this.tbppsrm011Detail01List[i].goalWeight;
        }
      }
      this.tbppsrm011Detail01List[4].goalWeight = total;
    }
    
  }

  edit(): void {
    // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件正在編輯中
    this.ppsr321DataPassService.hasEdited = '預計入庫資訊正在編輯中';
    this.isEdit = true;
  }

  async confirm(): Promise<void> {

    // 若使用者未修改任何資料，則無需更新
    if(_.isEqual(this.tbppsrm011Detail01List, this.editCacheTbppsrm011Detail01List)){
      this.nzMessageService.warning('尚未做任何修改，無法更新');
      return;
    }

    // 如果是新增資料則要往請求數據添加資料
    if(!this.tbppsrm011Detail01List[0].id){
      this.tbppsrm011Detail01List = this.assembleInsertRequestData();
    }

    try{
      this.isLoading = true;

      const resObservable$ = this.ppsService.insertOrUpdateDetail01(this.tbppsrm011Detail01List);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '修改「預計入庫資訊」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件已取消編輯中
      this.ppsr321DataPassService.hasEdited = '';

      // 取消編輯狀態
      this.isEdit = false;

      // 重新獲取新增或更新的資料
      await this.getDetail01ByShiftEdition(this.receivedData.shiftEdition)
      
      // 通知主檔頁面更新資料並渲染畫面
      this.ppsr321DataPassService.setRefresh(true);

      this.sucessMSG(
        '修改「預計入庫資訊」資料成功',
        `修改「預計入庫資訊」資料成功`
      );
    }
    catch (error) {
      this.errorMSG(
        '修改「預計入庫資訊」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }

  }

  assembleInsertRequestData() : any[] {
   return this.tbppsrm011Detail01List.map(item =>{
        const appendProperties = {
          plantCode : this.PLANT_CODE,
          plant : '直棒',
          shiftEdition : this.receivedData.shiftEdition,
          produceMonth : this.receivedData.produceMonth,
          userCreate : this.USER_NAME
        }
        _.merge(item, appendProperties);
        return item;
    })
  }

   // 使用者離開當前頁面時，如果處於編輯狀態给於是否離開的提示
   async canDeactivate() : Promise<boolean> {
    if(this.isEdit){
      return await new Promise<boolean>((resolve) => {
        this.Modal.confirm({
          nzTitle: `預計入庫資訊編輯中，是否離開?`,
          nzOkText: '離開',
          nzCancelText: '取消',
          nzOnOk: () => {
            // 切換至其他頁面，重置編輯狀態，任何子元件都沒有在編輯的
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

  cancel() : void {

    // 還原成未編輯前的資料
    this.tbppsrm011Detail01List = _.cloneDeep(this.editCacheTbppsrm011Detail01List);

    // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件已取消編輯中
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
