import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PPSR321DataPassService } from '../../PPSR321_DataPass/PPSR321-data-pass.service';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'src/app/services/config/cookie.service';
import * as _ from "lodash";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ppsr321-detail04',
  templateUrl: './PPSR321-detail04.component.html',
  styleUrls: ['./PPSR321-detail04.component.css'],
  providers:[NzMessageService]
})
export class PPSR321Detail04Component implements OnInit, AfterViewInit {

  PLANT_CODE = '';
  USER_NAME = '';

  isLoading = false;

  // 接收月推移主檔傳遞過來的資料
  receivedData: any;

  // 新增資料的資料索引
  newRowDataIndex = 0;

  tablePageSize = 10;
  tablePageIndex = 1;

  // 表格數據
  tbppsrm011Detail04List : any[] = [

  ];

  // 
  operatorMap = new Map<string, string>();

  // 編輯專用陣列
  tbppsrm011Detail04EditCacheList : { [id:string]: { edit:boolean; add:boolean; data:any } } = {};

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

  async ngAfterViewInit(): Promise<void> {
    await this.findAllData();
  }

  editCacheListIsEmpty() : boolean{
    return _.isEmpty(this.tbppsrm011Detail04EditCacheList);
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
      const resObservable$ = this.ppsService.findAllDetail04(this.receivedData.shiftEdition);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '查詢「頭份預計回廠尺寸」資料失敗',
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

      // 那些處於新增狀態的rowData，要添加回從後端抓取的資料之中
      this.tbppsrm011Detail04List.reverse().forEach(item => {
        if(item.id.startsWith('new')){
          responseData.unshift(item);
        }
      });
      
      this.tbppsrm011Detail04List = responseData;
      this.setupUpdateEditCache();

    }
    catch (error) {
      this.errorMSG(
        '查詢「頭份預計回廠尺寸」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

   // 複製一份資料到編輯專用的資料list
 setupUpdateEditCache(): void {

    // 複製一份，用於紀錄那些處於新增或編輯狀態的rowData，要添加回緩存之中
    const cloneTbppsrm011Detail04Edit = _.cloneDeep(this.tbppsrm011Detail04EditCacheList);

    this.tbppsrm011Detail04List.forEach(item => {

      let isCurrentEdit = false;
      let isCurrentAdd= false;
      if(!_.isNil(cloneTbppsrm011Detail04Edit[item.id])){
        isCurrentEdit = cloneTbppsrm011Detail04Edit[item.id].edit;
        isCurrentAdd = cloneTbppsrm011Detail04Edit[item.id].add;
      }

      this.tbppsrm011Detail04EditCacheList[item.id] = {
        edit: isCurrentEdit,
        add : isCurrentAdd,
        // 是新增或編輯尚未儲存的資料從複製的緩存中拿設定給新的緩存
        // 使用者即使新增或更新某行資料，其他正在編輯或新增的資料也不會消失
        // 不是正在新增或編輯的資料則用最新從資料庫抓取的資料
        data: isCurrentEdit || isCurrentAdd ? _.cloneDeep(cloneTbppsrm011Detail04Edit[item.id].data) : _.cloneDeep(item)
      };
    });
  }

  add() : void {
    const newRowData = {
      id : `new${this.newRowDataIndex}`,
      originalDia : undefined,
      mappingDia : undefined
    }

    this.tbppsrm011Detail04EditCacheList[newRowData.id] = {
      edit: false,
      add : true,
      data: _.cloneDeep(newRowData)
    };

    const cloneDeepDataList = _.cloneDeep(this.tbppsrm011Detail04List);
    cloneDeepDataList.unshift(newRowData);
    this.tablePageIndex = 1;
    this.tbppsrm011Detail04List = cloneDeepDataList;

    // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件正在新增或編輯中
    this.ppsr321DataPassService.hasEdited = '頭份預計回廠尺寸正在新增或編輯中';

    this.newRowDataIndex++;
  }

  editRow(id:any) : void {
    this.tbppsrm011Detail04EditCacheList[id].edit = true;

    // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件正在新增或編輯中
    this.ppsr321DataPassService.hasEdited = '頭份預計回廠尺寸正在新增或編輯中';
  }

  async deleteRow(rowData:any) : Promise<void> {
    try{
      this.isLoading = true;

      const resObservable$ = this.ppsService.deleteDetail04ByPk(rowData);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '刪除「頭份預計回廠尺寸」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      await this.findAllData();
      // 通知主檔頁面更新資料並渲染畫面
      this.ppsr321DataPassService.setRefresh(true);

      this.sucessMSG(
        '刪除「頭份預計回廠尺寸」資料成功',
        `刪除「頭份預計回廠尺寸」資料成功`
      );
    }
    catch (error) {
      this.errorMSG(
        '刪除「頭份預計回廠尺寸」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  async addOrUpdateConfirm(id:any) : Promise<void> {
    let rowData = this.tbppsrm011Detail04EditCacheList[id].data;
    if(!this.dataVerify(rowData)) return;

    // id為 "new" 開頭表示為新增
    if(rowData.id.startsWith('new')){
      const addParms = {
        plantCode : this.PLANT_CODE,
        plant : '直棒',
        shiftEdition : this.receivedData.shiftEdition,
        userCreate : this.USER_NAME
      };

      const requestInsertRowData = _.omit(rowData, ['id']);

      _.merge(requestInsertRowData, addParms);

      // 刪除這筆新增資料的緩存
      this.cancelAddOrUpdate(id);
      
      await this.insertData(requestInsertRowData);
    }
    // 反之為更新
    else{
      // 檢查使用者是否有真的修改資料
      // 有的話才給予更新資料
      // 找出原有的資料
      const originalDataIndex = _.findIndex(this.tbppsrm011Detail04List, item =>{
          return item.id == id;
      });
      const  originalData = this.tbppsrm011Detail04List[originalDataIndex];
      if(_.isEqual(this.tbppsrm011Detail04EditCacheList[id].data, originalData)){
        this.nzMessageService.warning('資料未做任何修改，無法更新');
        return;
      }

      // 資料有做修改執行資料的更新
      this.tbppsrm011Detail04EditCacheList[id].edit = false;
      await this.updateData(rowData);
    }
    
  }

  async updateData(rowData:any){

    try{
      this.isLoading = true;

      const resObservable$ = this.ppsService.updateDetail04ByPk(rowData);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '修改「頭份預計回廠尺寸」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      await this.findAllData();
      // 通知主檔頁面更新資料並渲染畫面
      this.ppsr321DataPassService.setRefresh(true);


    // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件未有資料正在新增或編輯
    if(!this.isDataAddOrEdit()){
      this.ppsr321DataPassService.hasEdited = '';
    }

      this.sucessMSG(
        '修改「頭份預計回廠尺寸」資料成功',
        `修改「頭份預計回廠尺寸」資料成功`
      );
    }
    catch (error) {
      this.errorMSG(
        '修改「頭份預計回廠尺寸」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  async insertData(rowData:any){

    try{
    
      this.isLoading = true;

      const resObservable$ = this.ppsService.insertDetail04(rowData);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '新增「頭份預計回廠尺寸」資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      await this.findAllData();
      // 通知主檔頁面更新資料並渲染畫面
      this.ppsr321DataPassService.setRefresh(true);

      this.sucessMSG(
        '新增「頭份預計回廠尺寸」資料成功',
        `新增「頭份預計回廠尺寸」資料成功`
      );

    }
    catch (error) {
      this.errorMSG(
        '新增「頭份預計回廠尺寸」資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }


  dataVerify(rowData:any) : boolean{
    if(rowData.originalDia == undefined || rowData.originalDia == 0){
      this.nzMessageService.error('請輸入原始尺寸');
      return false;
    }

    if(rowData.mappingDia == undefined || rowData.mappingDia == 0){
      this.nzMessageService.error('請輸入對應尺寸');
      return false;
    }
    return true;
  }

  cancelAddOrUpdate(id:any) : void {

    // 如果是新增狀態點選取消
    if(this.tbppsrm011Detail04EditCacheList[id].add){

      // 刪除緩存中新增的這筆資料
      this.tbppsrm011Detail04EditCacheList = _.omit(this.tbppsrm011Detail04EditCacheList, [id]);

      // 刪除新增的這筆資料
      this.tbppsrm011Detail04List = this.tbppsrm011Detail04List.filter(item =>{
          return item.id != id;
      });
    }
    else{
      // 還原剛剛編輯過的緩存資料
      const originalDataIndex = _.findIndex(this.tbppsrm011Detail04List, item =>{
          return item.id == id;
      });
      this.tbppsrm011Detail04EditCacheList[id].data = _.cloneDeep(this.tbppsrm011Detail04List[originalDataIndex]);
      this.tbppsrm011Detail04EditCacheList[id].edit = false;
    }
    
    // 通知父元件(PPSR321DetailTabMenuComponent)當前子元件未有資料正在新增或編輯
    if(!this.isDataAddOrEdit()){
      this.ppsr321DataPassService.hasEdited = '';
    }

  }


  // 使用者離開當前頁面時，如果處於編輯狀態给於是否離開的提示
  async canDeactivate() : Promise<boolean> {
    if(this.isDataAddOrEdit()){
      return await new Promise<boolean>((resolve) => {
        this.Modal.confirm({
          nzTitle: `頭份預計回廠尺寸資料正在新增或編輯中，是否離開?`,
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

  isDataAddOrEdit() : boolean{
    return _.keys(this.tbppsrm011Detail04EditCacheList).some(key =>{
      return this.tbppsrm011Detail04EditCacheList[key].edit || this.tbppsrm011Detail04EditCacheList[key].add
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


}
