import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PPSR321DataPassService } from '../PPSR321_DataPass/PPSR321-data-pass.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'src/app/services/config/cookie.service';
import * as _ from "lodash";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ppsr321-detail02',
  templateUrl: './PPSR321-detail02.component.html',
  styleUrls: ['./PPSR321-detail02.component.css'],
  providers:[NzMessageService]
})
export class PPSR321Detail02Component implements OnInit, AfterViewInit {

  PLANT_CODE = '';
  USER_NAME = '';

  isLoading = false;

  // 接收月推移主檔傳遞過來的資料
  receivedData: any;

  // 新增資料的資料索引
  newRowDataIndex = 0;

  // 鋼種選項
  gradeNolistOfOption : string[] = [];
  // 鋼種選項拿取載入中
  gradeNolistOfOptionLoading = false;

  // 表格數據
  tbppsrm011Detail02List : any[] = [

    // 範例數據，執行時會自動抓取資料庫資料覆蓋掉
    {
      id:String(1),
      kindType : 'PL',
      gradeNo : 'S17400',
      operator : '<=',
      diaRange : 40
    },
    {
      id:String(2),
      kindType : 'C to B',
      gradeNo : 'S20910',
      operator : '-',
      diaRange : null
    }
    // 範例數據，執行時會自動抓取資料庫資料覆蓋掉

  ];

  // 
  operatorMap = new Map<string, string>();

  // 編輯專用陣列
  tbppsrm011Detail02EditCacheList : { [id:string]: { edit:boolean; add:boolean; data:any } } = {};

  constructor(private ppsr321DataPassService: PPSR321DataPassService,
              private ppsService: PPSService,
              private Modal: NzModalService,
              private nzMessageService: NzMessageService,
              private cookieService: CookieService) {
      this.PLANT_CODE = this.cookieService.getCookie("plantCode");
      this.USER_NAME = this.cookieService.getCookie("USERNAME");
      this.operatorMap.set('<', '＜');
      this.operatorMap.set('>', '＞');
      this.operatorMap.set('=', '＝');
      this.operatorMap.set('<=', '≦');
      this.operatorMap.set('>=', '≧');
      this.operatorMap.set('-','－');
  }

  async ngAfterViewInit(): Promise<void> {

   // 接收月推移主檔傳遞過來的資料
    this.receivedData = this.ppsr321DataPassService.mainData;

   // 獲取鋼種清單
    await this.findAllGrade();

    await this.findAllData();
    
  }

  editCacheListIsEmpty() : boolean{
    return _.isEmpty(this.tbppsrm011Detail02EditCacheList);
  }

  diaRangeFormat(diaRange:any) : string {
    if(_.isNull(diaRange)) {
      return 'ALL';
    }
    return diaRange;
  }

  ngOnInit(): void {

  }

  async findAllData() : Promise<void> {

    try{
    
      this.isLoading = true;

      const resObservable$ = this.ppsService.findAllDetail02(this.receivedData.shiftEdition);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '查詢「特殊鋼種量」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      // 將ID轉成字串類型，用於新增時可用"new+index"方式建立id
      const responseData = res.data.map(item => {
        item.id = String(item.id);
        return item;
      })

      this.tbppsrm011Detail02List = responseData;

      this.setupUpdateEditCache();

    }
    catch (error) {
      this.errorMSG(
        '查詢「特殊鋼種量」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

   // 複製一份資料到編輯專用的資料list
 setupUpdateEditCache(): void {
  this.tbppsrm011Detail02List.forEach(item => {
    this.tbppsrm011Detail02EditCacheList[item.id] = {
      edit: false,
      add : false,
      data: _.cloneDeep(item)
    };
  });
}

  add() : void {
    const newRowData = {
      id : `new${this.newRowDataIndex}`,
      kindType : undefined,
      gradeNo : undefined,
      operator : undefined,
      diaRange : undefined
    }

    this.tbppsrm011Detail02EditCacheList[newRowData.id] = {
      edit: false,
      add : true,
      data: _.cloneDeep(newRowData)
    };

    const cloneDeepDataList = _.cloneDeep(this.tbppsrm011Detail02List);
    cloneDeepDataList.unshift(newRowData);
    this.tbppsrm011Detail02List = cloneDeepDataList;

    this.newRowDataIndex++;
  }

  editRow(id:any) : void {
    this.tbppsrm011Detail02EditCacheList[id].edit = true;
  }

  deleteRow(id:any) : void {

  }

  async addOrUpdateConfirm(id:any) : Promise<void> {

    let rowData = this.tbppsrm011Detail02EditCacheList[id].data;
    if(!this.dataVerify(rowData)) return;

    // id為 "new" 開頭表示為新增
    if(rowData.id.startsWith('new')){

      const addParms = {
        plantCode : this.PLANT_CODE,
        plant : '直棒',
        shiftEdition : this.receivedData.shiftEdition,
        userCreate : this.USER_NAME
      };

      rowData = _.omit(rowData, ['id']);

      _.merge(rowData, addParms);
      
      await this.insertData(rowData);
    }
    // 反之為更新
    else{
     

    }
    
  }

  async insertData(rowData:any){

    try{
    
      this.isLoading = true;

      const resObservable$ = this.ppsService.insertDetail02(rowData);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '新增「特殊鋼種量」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      await this.findAllData();

      this.sucessMSG(
        '新增「特殊鋼種量」資料成功',
        `新增「特殊鋼種量」資料成功`
      );

    }
    catch (error) {
      this.errorMSG(
        '新增「特殊鋼種量」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }


  dataVerify(rowData:any) : boolean{

    if(_.isEmpty(rowData.kindType)){
      this.nzMessageService.error('請輸入產品分類');
      return false;
    }

    if(_.isEmpty(rowData.gradeNo)){
      this.nzMessageService.error('請輸入鋼種');
      return false;
    }

    if(_.isEmpty(rowData.operator)){
      this.nzMessageService.error('請輸入尺寸符號');
      return false;
    }

    if(rowData.operator !== '-' && _.isNil(rowData.diaRange)){
      this.nzMessageService.error('請輸入尺寸範圍');
      return false;
    }

    return true;
  }

  cancelAddOrUpdate(id:any) : void {

    // 如果是新增狀態點選取消
    if(this.tbppsrm011Detail02EditCacheList[id].add){

      // 刪除緩存中新增的這筆資料
      this.tbppsrm011Detail02EditCacheList = _.omit(this.tbppsrm011Detail02EditCacheList, [id]);

      // 刪除新增的這筆資料
      this.tbppsrm011Detail02List = this.tbppsrm011Detail02List.filter(item =>{
          return item.id != id;
      });

      return;
    }

    // 還原剛剛編輯過的緩存資料
    const originalDataIndex = _.findIndex(this.tbppsrm011Detail02List, item =>{
        return item.id == id;
    });
    this.tbppsrm011Detail02EditCacheList[id].data = _.cloneDeep(this.tbppsrm011Detail02List[originalDataIndex]);
    this.tbppsrm011Detail02EditCacheList[id].edit = false;
  }

  // 獲取「鋼種」清單
  async findAllGrade(){

    if(!_.isEmpty(this.gradeNolistOfOption)) return;

    try{

      this.isLoading = true;

      const resObservable$ = this.ppsService.findAllGrade();
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取鋼種清單失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      this.gradeNolistOfOption = res.data;

    }
    catch (error) {
      this.errorMSG(
        '獲取鋼種清單失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  compareFn() {
    return 0;
  }

  diaRangeDataChangeHandler(id:any){
    // 如果使用者符號選擇「-」將範圍的內容更改為null(ALL的意思)
    const rowData = this.tbppsrm011Detail02EditCacheList[id].data;
    if(rowData.operator === '-'){
      rowData.diaRange = null;
    }
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
