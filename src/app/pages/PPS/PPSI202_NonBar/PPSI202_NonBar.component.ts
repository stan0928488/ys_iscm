import { async } from '@angular/core/testing';
import { promise } from 'protractor';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { PPSI202DataTransferService } from '../PPSI202_TabMenu/PPSI202DataTransferService';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { firstValueFrom } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as _ from "lodash";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';
import { CookieService } from 'src/app/services/config/cookie.service';
import { CellDoubleClickedEvent, CellEditingStoppedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent, ICellEditorParams, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { PPSI202_NonBarEditButtonRendererComponent } from './PPSI202_NonBarEditButtonRendererComponent';
import { PPSI202_NonBarEditStartTimeCellEditorComponent } from './PPSI202_NonBarEditStartTimeCellEditorComponent';
import { PPSI202_NonBarEditEndTimeCellEditorComponent } from './PPSI202_NonBarEditEndTimeeCellEditorComponent';
import { PPSI202_NonBarEditShopCellEditorComponent } from './PPSI202_NonBarEditShopCellEditorComponent';
import { PPSI202_NonBarEditEquipCellEditorComponent } from './PPSI202_NonBarEditEquipCellEditorComponent';
import { PPSI202_NonBarEditShutdownTypeCellEditorComponent } from './PPSI202_NonBarEditShutdownTypeCellEditorComponent';
import { DisabledTimeConfig, DisabledTimeFn } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-ppsi202-non-bar',
  templateUrl: './PPSI202_NonBar.component.html',
  styleUrls: ['./PPSI202_NonBar.component.css'],
  providers:[NzMessageService]
})
export class PPSI202NonBarComponent implements OnInit, AfterViewInit {

   // ag grid Api物件
   gridApi : GridApi;
   gridColumnApi : ColumnApi;
   agGridContext : any;
   
  bodyLeftDiv! : HTMLDivElement;
  divider! : any;
  isStartDrag = false;
  startX = 0;

  USERNAME : string = undefined;
  
  isLoading = false;
  isEditLoading = false;

  // 是否正在執行FCP
  isRunFCP : boolean = undefined;

  // 編輯專用的站別選項清單
  shopListForEdit : any[] = [];
  // 站別選項清單
  shopList : any[] = undefined;
  // 站別選項清單分組
  shopCodeChunkList : any[] = undefined;

  // 是否選取所有站別
  checkedAllShop = false;
  // 是否有不定(只選取其中幾個)站別選取
  checkedAllShopIndeterminate = false;

  // 機台選項清單
  equipList : any[] = undefined;
  // 機台選項清單分組
  equipChunkList : any[] = undefined;
  // 是否選取所有機台
  checkedAllEquip = false;
  // 是否有不定(只選取其中幾個)機台選取
  checkedAllEquipIndeterminate = false;

  // 存放不會變動的站別-機台對應關係
  shopEquipMapPersist : Map<String, Array<any>> = new Map();
  // 存放會變動的站別-機台對應關係
  shopEquipMapIndeterminate : Map<String, Array<any>> = new Map();

  // 更新資料專用的物件
  editCache : { [id : number]: { isEdit : boolean, data : any} } = {};


  // 當使用者輸入休假開始時間之前，先禁止輸入休假結束時間
  disabledHolidayTimeEnd = true;
  // 休假結束時間禁用時的提示
  holidayTimeEndTooltipTitle = '請先選擇「停機時間(起)」';
  // 當使用者選擇到的開始時間是 H:59:59，
  // 結束時間必須從H+1開始選
  isDisabledHourPlusOne = false;
  timePickerDefaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  holidayTimeStart : Date = null;
  holidayTimeEnd : Date = null;

  // 停機模式
  shutdownModelType = '週保';

  // 選中的日期
  pickDates : string[] = [];
  calendarMode : NzCalendarMode = 'month';
  calendarSelectedDate : Date = new Date();
  // 紀錄當前日期時間
  currentDate : Date = this.calendarSelectedDate;


  // 使用者匯入的Excel檔案  
  excelImportFile:File;
  // input元件
  inputExcelFile:any;

  // 停機設定的資料
  listShutdownMap : Map<string, Map<string, any[]>> = new Map<string,  Map<string, any[]>>();

  // 停機模式的顯示背景顏色
  shutdownTypeBackgroundColorMap = new Map<string,  string>();

  // 顯示在停機詳細資訊彈出框標題的停機日期
  shutdownDateShowInModalTitle = '';
  // 停機詳細資訊彈出框是否可見
  isVisibleShutdownPeriods = false;
  // 彈出創窗確定按鈕是否載入中
  isOkLoading = false;

  // 用於匯出之Excel與中文名稱對照的英文名稱
  fieldNameList : string[] = [];
  // 用於匯出之Excel與英文名稱與中文名稱的對照
  englishChineseTitleMapping = {}; 
  // 排除不需要匯出的欄位名稱
  excludedField = ['action'];
  // 用於匯出Excel的資料來源
  ppsinptb06DataListForExcelExport : any[] = [];

  // 用於匯入比對表頭名稱是否正確
  headerNameList : string[] = [];


  // 停機詳細資訊資料
  ppsinptb06DataList : any[] = [];
  // 緩存一份停機詳細資訊資料
  ppsinptb06EditCacheList: any[] = [];
  // 停機詳細資訊ag-grid欄位定義
  ppsinptb06ColumnDefs: ColDef[] = [
    { 
      headerName:'停機開始時間',
      field: 'startTime', 
      width: 220,
      cellEditor : PPSI202_NonBarEditStartTimeCellEditorComponent,
      valueFormatter: (params: ValueFormatterParams): string => {
        return moment(params.value).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    { 
      headerName:'停機結束時間',
      field: 'endTime', 
      width: 220,
      cellEditor : PPSI202_NonBarEditEndTimeCellEditorComponent,
      valueFormatter: (params: ValueFormatterParams): string => {
        return moment(params.value).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    { 
      headerName:'站別',
      field: 'shopCode', 
      cellEditor : PPSI202_NonBarEditShopCellEditorComponent,
      width: 120 
    },
    { 
      headerName:'機台',
      field: 'equipCode', 
      cellEditor : PPSI202_NonBarEditEquipCellEditorComponent,
      width: 120 
    },
    { 
      headerName:'停機模式',
      field: 'shutdownModelType', 
      cellEditor : PPSI202_NonBarEditShutdownTypeCellEditorComponent,
      width: 140 
    },
    { 
      headerName:'Action',
      field: 'action', 
      width: 180,
      editable: false,
      filter : false,
      cellRenderer : PPSI202_NonBarEditButtonRendererComponent
    }
  ];

   // 表格共有設定定義
   gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: false,
      resizable: true,
      autoHeight: true,
      editable: true
    }
  };


  constructor(private ppsI202DataTransferService : PPSI202DataTransferService,
              private ppsService: PPSService,
              private Modal: NzModalService,
              private nzMessageService: NzMessageService,
              private cookieService: CookieService,
              private elementRef : ElementRef,
              private renderer: Renderer2,) { 

    this.USERNAME = this.cookieService.getCookie("USERNAME");
    this.shutdownTypeBackgroundColorMap.set('週保', 'blue');
    this.shutdownTypeBackgroundColorMap.set('計畫性停機', 'gold');
    this.shutdownTypeBackgroundColorMap.set('調機', 'green');
    this.shutdownTypeBackgroundColorMap.set('定修', 'magenta');
    this.agGridContext = {
      componentParent: this,
    };
  }

  ngOnInit(): void {

  }

  listShutdownMapKeys(shutdownDay : string): string[] {
    return Array.from(this.listShutdownMap.get(shutdownDay).keys());
  }

  async ngAfterViewInit() {

    setTimeout(()=>{
      this.ppsI202DataTransferService.setSelectedPage("i202NonBar");
    },0);

    this.divider = this.elementRef.nativeElement.querySelector('.custom-divider') as any;
    this.bodyLeftDiv = this.elementRef.nativeElement.querySelector('.bodyLeftDiv') as HTMLDivElement;
    this.divider.addEventListener('mousedown', this.startDrag);
    document.addEventListener('mousemove', this.dragHandler);
    document.addEventListener('mouseup', this.stopDrag);
    document.addEventListener('mouseleave', this.stopDrag);

    this.inputExcelFile = this.renderer.selectRootElement('#importExcelFile');

    this.isLoading = true;
    await this.getRunFCPCount();
    await this.getShopOptionList(false);
    await this.getShutdownDataList();
    this.isLoading = false;
    
    setInterval(this.getRunFCPCount.bind(this), 1000 * 60 * 10);

  }

  startDrag = (event: MouseEvent): void =>{ 
    this.isStartDrag = true;
    this.startX = event.pageX;
  }

  dragHandler = (event : MouseEvent) : void => {
    if(!this.isStartDrag) return;

    event.preventDefault();

    let distanceMoved = this.startX - event.pageX;
    this.startX = event.pageX;

    // 調整左邊div的寬度
    let leftDivRect = this.bodyLeftDiv.getBoundingClientRect();
    this.bodyLeftDiv.style.width = (leftDivRect.width - distanceMoved) + 'px';
  }

  stopDrag = (event : Event) : void => {
    if(this.isStartDrag){
      this.isStartDrag = false;
    }
  }

  // 取得是否有正在執行的FCP
  getRunFCPCount() {
    
    return new Promise<boolean>((resolve, reject) => {
        this.ppsService.getRunFCPCount().subscribe({
          next: (res) => {
            const count = res as number;
            if(count > 0){
              this.isRunFCP = true;
            }
            else{
              this.isRunFCP = false;
            } 
            resolve(true);
          },
          error: (err) => {
            this.errorMSG(
              '獲取FCP執行狀態失敗',
              `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(err.message)}`
            );    
            reject(true);
          },
          complete: () => {},
        });
      });
  }

  async getShutdownDataList(){
    try{
      this.isLoading = true;
      const year = this.calendarSelectedDate.getFullYear().toString();
      const month = (this.calendarSelectedDate.getMonth() + 1).toString().padStart(2, '0');

      // 篩選出被打勾的站別
      const selectedShopList = this.shopList.map(item => {
            if(item.checked){
              return item.value;
            }
            else{
              return null;
            }
        }).filter(item => !_.isNull(item));
        
        let selectedEquipList = [];
        if(!_.isNil(this.equipList)){
            // 篩選出被打勾的機台
            selectedEquipList = this.equipList.map(item => {
              if(item.checked){
                return item.equip;
              }
              else{
                return null;
              }
            }).filter(item => !_.isNull(item));
        }

     const parms = {
        year : year,
        month : month,
        shopList : _.isEmpty(selectedShopList) ? null : selectedShopList,
        equipList : _.isEmpty(selectedEquipList) ? null : selectedEquipList
     }
     
      const resObservable$ = this.ppsService.getShutdownDataList(parms);
      const res = await firstValueFrom<any>(resObservable$);
     
      const listShutdownMapTemp : Map<string, Map<string, any[]>> = new Map<string,  Map<string, any[]>>();
      if(_.isEmpty(res.data)){
        this.listShutdownMap = listShutdownMapTemp;
        return;
      }
      
      _.keys(res.data).forEach(key => {
        let subShutdownMap : Map<string, any[]> = new Map();
        _.keys(res.data[key]).forEach(subKey => {
          subShutdownMap.set(subKey, res.data[key][subKey]);
        });
        listShutdownMapTemp.set(key, subShutdownMap);
      });

      this.listShutdownMap = listShutdownMapTemp;
    }
    catch (error) {
      this.errorMSG(
        '獲取非直棒停機資料異常',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }


  // 從後端獲取所有站別選項
  async getShopOptionList(forEdit : boolean){

    try{
      this.isLoading = true;
      const resObservable$ = this.ppsService.getNonBarShopList();
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 1){
        this.errorMSG(
          '獲取非直棒站別失敗',
          `請聯繫系統工程師。錯誤訊息 --> ${res.message}`
        );
        return
      }

      // 處理編輯專用的站別選項
      if(forEdit){
        this.shopListForEdit = res.data;
        return;
      }

      this.shopList = res.data.map(item => {
        return {
          value : item,
          checked : false
        };
      })

      // 五筆站別為一組
      this.shopCodeChunkList = _.chunk(this.shopList, 5);
    }
    catch (error) {
      this.errorMSG(
        '獲取非直棒站別資料異常',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  // 所有站別被選取/不被選取
  async onCheckedAllShop(){

    // 此時只有全選或全部不選，取消不定選取
    this.checkedAllShopIndeterminate = false;

    // 篩選出為勾選的站別將其勾選
    const uncheckedShopList = [];

    // 全選
    if(this.checkedAllShop){
      // 將所有站別選項勾選起來
      this.shopList.forEach(item => {
          if(item.checked === false){
            item.checked = true;
            uncheckedShopList.push(item);
          }
      });
      // 渲染站別對應的機台checkbox
      this.dynamicChangeEquipCheckbox(uncheckedShopList);
    }
    // 全部不選
    else{
      // 將所有站別選項取消勾選
      this.shopList.forEach(item => {
        item.checked = false;
      });
      // 渲染站別對應的機台checkbox
      this.dynamicChangeEquipCheckbox(this.shopList);
      // 取消機台全選的勾選
      this.checkedAllEquip = false;
      this.checkedAllEquipIndeterminate = false;
    }

    // 五筆站別為一組渲染站別checkbox
    this.shopCodeChunkList = _.chunk(this.shopList, 5);

    // 獲取被選擇的站別的停機資料
    await this.getShutdownDataList();
  }

  // 那些站別被選取到
  // 處理不定選取顯示圖示
   shopSingleChecked(shopItem : any){

    // ngModelChange中立刻獲取用ngModel雙向綁定的資料會拿不到最新值
    // 用setTimeout將要執行的程式碼延到下一個函數堆疊區
    setTimeout( async ()=>{

      // 將shopCodeChunk攤平成一個陣列
    const shopCodeChunkFlat = this.shopCodeChunkList.flat();

      // 全部選取
      // 取消不定選擇圖示
      // 將站別全選圖示打勾
      if(shopCodeChunkFlat.every(item => item.checked)){
        this.checkedAllShop = true;
        this.checkedAllShopIndeterminate = false;
      }
      // 站別全部都沒有選取
      // 取消站別不定選擇圖示
      // 取消站別全選勾選圖示
      // 取消機台不定選擇圖示
      // 取消機台全選勾選圖示
      else if(shopCodeChunkFlat.every(item => !item.checked)){
        this.checkedAllShop = false;     
        this.checkedAllShopIndeterminate = false;
        this.checkedAllEquip = false;
        this.checkedAllEquipIndeterminate = false;
      }
      // 有些有選有些沒有
      // 不定選擇圖示打勾
      else{
        this.checkedAllShopIndeterminate = true;
      }

      this.dynamicChangeEquipCheckbox([shopItem]);

      // 獲取該被選擇的站別的停機資料
      //await this.getShutdownDataList();

    },0);
  }

  async dynamicChangeEquipCheckbox(shopList : any[]){

    this.isLoading = true;
    const noShopOfEquipList = [];
    shopList.forEach(shopItem => {
        // 添加機台選項
      if(shopItem.checked){

        // 查詢是否已有在shopEquipMapPersist且不在shopEquipMapIndeterminate
        // 則增加這些機台Checkbox到畫面上
        if(this.shopEquipMapPersist.has(shopItem.value) && 
          !this.shopEquipMapIndeterminate.has(shopItem.value)){
            
            // 取出先前已保存的站別-機台對應資料
            const equipListPersist = this.shopEquipMapPersist.get(shopItem.value);

            // 將先前保存的站別-機台對應資料放到會變動的shopEquipMapIndeterminate
            this.shopEquipMapIndeterminate.set(shopItem.value, _.cloneDeep(equipListPersist))
            
            // 渲染機台Checkbox
            this.renderEquipCheckbox();
        }
        // 未有該站別對應的機台則發送請求跟後端索取
        else{
          noShopOfEquipList.push(shopItem.value);
        }
      }
      // 移除機台選項
      else{
         // 移除機台選項
        this.shopEquipMapIndeterminate.delete(shopItem.value);
         // 渲染機台Checkbox
         this.renderEquipCheckbox();
      }
    });

    // 未有該站別對應的機台則發送請求跟後端索取
    if(!_.isEmpty(noShopOfEquipList)){
      await this.getEquipsByShops(noShopOfEquipList);

      // 將緩存的機台選項複製一份到shopEquipMapIndeterminate以便於渲染
      for(const[key, value] of this.shopEquipMapPersist){
        // 使用者有選擇該站別
        if(_.includes(noShopOfEquipList, key)){
            this.shopEquipMapIndeterminate.set(key, _.cloneDeep(value));
        }
      }

      // 渲染機台Checkbox
      this.renderEquipCheckbox();
    }
    // 機台Checkbox有變動需順帶更改機台的Check All勾選圖示
    this.equipSingleChecked();
    this.isLoading = false;
  }

  async getEquipsByShopsForEditHandler(params : ICellEditorParams, shop : string) {

    // 如果該站別對應的機台已有緩存則從緩存拿
    if(this.shopEquipMapPersist.has(shop)){
      params.data.equipOptionList = _.cloneDeep(this.shopEquipMapPersist.get(shop))
    }
    // 沒有該站別對應機台，則發請求跟後端要
    // 一樣存到緩存中後，從緩存拿
    else{
      await this.getEquipsByShops([shop]);
      params.data.equipOptionList = _.cloneDeep(this.shopEquipMapPersist.get(shop))
    }

  }

  async getEquipsByShops(shopList : string[]) : Promise<any>{

    try{
      this.isLoading = true;

      const payload = {
        shopList : shopList
      };
      const resObservable$ = this.ppsService.getEquipsByShopList(payload);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 1){
        this.errorMSG(
          '獲取非直棒機台資料異常',
          `請聯繫系統工程師。錯誤訊息 --> ${res.message}`
        );
        return
      }

      // 添加查詢回來的站別-機台到shopEquipMapPersist保存起來
      // 添加查詢回來的站別-機台到shopEquipMapIndeterminate用以渲染畫面
      for (const [key, values] of Object.entries(res.data)) {
        const _values = values as Array<String>;
        const equipItem = _values.map(item => {
                            return {
                              shop : key,
                              equip : item,
                              checked : false
                            };
                        });
          this.shopEquipMapPersist.set(key, equipItem);
      }

    }
    catch (error) {
      this.errorMSG(
        '獲取非直棒機台資料異常',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false; 
    }

  }

  renderEquipCheckbox(){
    
      // 將當前選中的站別對應的機台聚集在一起
      this.equipList = [];
      for (const equips of this.shopEquipMapIndeterminate.values()) {
        this.equipList = this.equipList.concat(equips);
      }

      // 5個為一組渲染機台Checkbox到畫面上
      this.equipChunkList = _.chunk(this.equipList, 5);

      // 沒有機台選項不顯示 "Check All" Checkbox
      if(_.isEmpty(this.equipList)){
        this.equipList = undefined;
      }
      
  }

  // 所有機台被選取/不被選取
  async onCheckedAllEquip(){

    // 此時只有全選或全部不選，取消不定選取
    this.checkedAllEquipIndeterminate = false;

    // 全選
    if(this.checkedAllEquip){
      // 將所有機台選項勾選起來
      this.equipList.forEach(item => {
          item.checked = true;
      });
      // 五筆站別為一組
      this.equipChunkList = _.chunk(this.equipList, 5);
    }
    // 全部不選
    else{
      // 將所有機台選項取消勾選
      this.equipList.forEach(item => {
        item.checked = false;
      });
      // 五筆站別為一組
      this.equipChunkList = _.chunk(this.equipList, 5);
    }

    // 獲取被選擇的機台的停機資料
    await this.getShutdownDataList();

  }

  // 那些機台被選取到
  // 處理不定選取顯示圖示
  equipSingleChecked(){
    // ngModelChange中立刻獲取用ngModel雙向綁定的資料會拿不到最新值
    // 用setTimeout將要執行的程式碼延到下一個函數堆疊區
    setTimeout( async ()=>{

      // 將shopCodeChunk攤平成一個陣列
      const equipChunkFlat = this.equipChunkList.flat();

      // 全部選取
      // 取消不定選擇圖示
      // 將站別全選圖示打勾
      if(equipChunkFlat.every(item => item.checked)){
        this.checkedAllEquip = true;
        this.checkedAllEquipIndeterminate = false;
      }
      // 全部都沒有選取
      // 取消不定選擇圖示
      // 將取消站別全選勾選圖示
      else if(equipChunkFlat.every(item => !item.checked)){
        this.checkedAllEquip = false;     
        this.checkedAllEquipIndeterminate = false;
      }
      // 有些有選有些沒有
      // 不定選擇圖示打勾
      else{
        this.checkedAllEquipIndeterminate = true;
      }

      // 獲取被選擇的機台的停機資料
      await this.getShutdownDataList();

    },0);
  }


  async onSubmit(){

    // 輸入參數校驗未通過
    if(!this.validateInputParameters()){
      return;
    }

    try{
      
      this.isLoading = true;

      const _shopAndEquip = this.getCheckedEquipList().map(item =>{
          return _.omit(item, ['checked']);
      });

      const payload = {
        shutdownDays : this.pickDates,
        startTime : moment(this.holidayTimeStart).format('HH:mm:ss'),
        endTime : moment(this.holidayTimeEnd).format('HH:mm:ss'),
        shopAndEquip :_shopAndEquip,
        shutdownModelType : this.shutdownModelType,
        userCreate : this.USERNAME
      };

      const resObservable$ = this.ppsService.batchSaveShutdownList(payload);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 1){
        this.errorMSG(
          '新增失敗',
          res.message
        );
      }else{

        // 清空輸入元件上的資料
        this.checkedAllShop = false;
        this.onCheckedAllShop();
        this.pickDates = [];
        this.holidayTimeStart = null;
        this.holidayTimeEnd = null;
        this.shutdownModelType = '週保';

        // 拉取最新資料
        await this.getShutdownDataList();

        this.sucessMSG(
          '新增成功',
          res.message
        );
      }

    }
    catch (error) {
      this.errorMSG(
        ' 批次新增非直棒停機定修資料異常',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }

  }

  // 驗證輸入參數合法性
  validateInputParameters() : boolean{
    
    if(_.isEmpty(this.getCheckedShopList())){
      this.nzMessageService.error('請選擇站別')
      return false;
    }

    if(_.isEmpty(this.getCheckedEquipList())){
      this.nzMessageService.error('請選擇機台')
      return false;
    }

    const noCheckedEquipShop = this.allUnCheckedEquipOfShop();
    if(!_.isNull(noCheckedEquipShop)){
      this.nzMessageService.error(`有選擇站別「${noCheckedEquipShop}」卻未選擇任一相關機台`);
      return false;
    }

    if(_.isNil(this.holidayTimeStart)){
      this.nzMessageService.error('「停機時間(起)」不得為空');
      return false;
    }

    if(_.isNil(this.holidayTimeEnd)){
      this.nzMessageService.error('「停機時間(迄)」不得為空');
      return false;
    }

    if(_.isEmpty(this.pickDates)){
      this.nzMessageService.error('「停機日期」不得為空');
      return false;
    }

    return true;

  }

  // 有選擇站別卻沒選擇任一機台
  allUnCheckedEquipOfShop() : string {
    const checkedShopList =  this.getCheckedShopList();
    for (const shop of checkedShopList) {
      let noCheckedEquipShop = shop;
      if(this.shopEquipMapIndeterminate.has(shop)){
        for (const equip of this.shopEquipMapIndeterminate.get(shop)){
          if(equip.checked){
            noCheckedEquipShop = null;
            break;
          }
        }
        if(!_.isNull(noCheckedEquipShop)){
          return noCheckedEquipShop;
        }
      }
    }
    return null;
  }

  // 獲取使用者已勾選的站別
  getCheckedShopList() : any[] {

    if(_.isEmpty(this.shopList)){
      return [];
    }

    return this.shopList.map(item => {
      if(item.checked){
        return item;
      }
      else{
        return undefined;
      }
    }).filter(item => item !== undefined);
  }

  // 獲取使用者已勾選的機台
  getCheckedEquipList() : any[] {

    if(_.isEmpty(this.equipList)){
      return [];
    }

    return this.equipList.map(item => {
      if(item.checked){
        return item;
      }
      else{
        return undefined;
      }
    }).filter(item => item !== undefined);
  }

  // 行事曆點選監聽事件
  calendarSelected(date: Date){
    
    const selectedDateYearStr = moment(date).format("YYYY");
    const selectedDateMonthStr = moment(date).format("MM");
    const currentDateYearStr = moment(this.currentDate).format("YYYY");
    const currentDateMonthStr = moment(this.currentDate).format("MM");
    // 如果使用者是選擇年或月份的跳換，不執行添加日期
    // 執行獲取該年月的停機休假紀錄清單
    if(selectedDateYearStr !== currentDateYearStr || selectedDateMonthStr !== currentDateMonthStr){
      this.getShutdownDataList();
      this.currentDate = this.calendarSelectedDate;
      return;
    }

    let dateStr = moment(date).format("YYYY-MM-DD");
    // 若當前選中的日期不存在於集合中則直接添加進去
    // 若已存在則什麼都不做(不再添加)
    if(!_.includes(this.pickDates, dateStr)){
      this.pickDates.push(dateStr);
      this.pickDates.sort();
    }else{
      this.nzMessageService.warning(`日期「${dateStr}」已存在`)
    }
  }

   // 當使用者點選選中的日期tag的叉叉則從集合中移除該筆
   unPickDates(_index) : void {
    this.pickDates.splice(_index, 1);
  }

  // 當休假時間的輸入有變化時
  holidayTimeStartChange(params: ICellEditorParams) : void {

    const _holidayTimeStart = _.isNil(params) ? this.holidayTimeStart : params.data.startTime;

    if(_.isNil(params)){
      this.holidayTimeEnd = null;
    }
    else{
      params.data.endTime = null;
    }
    

    if(!_.isNil(_holidayTimeStart)){
      const selectedholidayTimeStartHour = _holidayTimeStart.getHours();
      const selectedholidayTimeStartMinute = _holidayTimeStart.getMinutes();
      const selectedholidayTimeStartSecond = _holidayTimeStart.getSeconds();

      if(selectedholidayTimeStartHour === 23 &&
         selectedholidayTimeStartMinute === 59 &&
         selectedholidayTimeStartSecond === 59){
          if(_.isNil(params)){
            this.disabledHolidayTimeEnd = true;
            this.holidayTimeEndTooltipTitle = '「休假時間(起)」已達最後時刻，已無「休假時間(迄)」可選，請調整';
          }
          else{
            params.data.disabledShutdownEndtime = true;
            params.data.shutdownEndtimeTooltipTitle = '「休假時間(起)」已達最後時刻，已無「休假時間(迄)」可選，請調整';
          }
      }
      else{
        if(_.isNil(params)){
          this.disabledHolidayTimeEnd = false;
          this.holidayTimeEndTooltipTitle = '';
        }
        else{
          params.data.disabledShutdownEndtime = false;
          params.data.shutdownEndtimeTooltipTitle = '';
        }
      }
      // 當使用者編輯更新時，清空時間再設定日期會變成抓當天日期，需重新設定回原初選擇的日期
      /*if(!_.isNil(params)){
          const originalDate : string = params.data.shutdownDay;
          const updateSelectedholidayTimeStartHour = params.data.startTime.getHours().toString();
          const updateSelectedholidayTimeStartMinute = params.data.startTime.getMinutes().toString();
          const updateSelectedholidayTimeStartSecond = params.data.startTime.getSeconds().toString();
          params.data.startTime = new Date(`${originalDate} ${updateSelectedholidayTimeStartHour}:${updateSelectedholidayTimeStartMinute}:${updateSelectedholidayTimeStartSecond}`);          
      }*/

    }else{
      if(_.isNil(params)){
        this.disabledHolidayTimeEnd = true;
        this.holidayTimeEndTooltipTitle = '請先選擇「休假時間(起)」';
      }
      else{
        params.data.disabledShutdownEndtime = true;
        params.data.shutdownEndtimeTooltipTitle = '請先選擇「休假時間(起)」';
      }
    }
  }

  // 限制使用者的休假結束時間不能小於休假開始時間
  disabledHours(params: ICellEditorParams){
    const _holidayTimeStart = _.isNil(params) ? this.holidayTimeStart : params.data.startTime;

    return () :  number[] => {
      if(_.isNil(params)){
        this.holidayTimeEnd = null;
      }
      else{
        params.data.endTime = null;
      }

      let disabledHoursNums : number[] = [];
      let selectedholidayTimeStartHour = _holidayTimeStart.getHours();
      const selectedholidayTimeStartMinute = _holidayTimeStart.getMinutes();
      const selectedholidayTimeStartSecond = _holidayTimeStart.getSeconds();

      if(selectedholidayTimeStartMinute === 59 && selectedholidayTimeStartSecond === 59){
        selectedholidayTimeStartHour++;
        if(_.isNil(params)){
          this.isDisabledHourPlusOne = true;
        }
        else{
          params.data.isDisabledHourPlusOne = true;
        }
      }
      else{
        if(_.isNil(params)){
          this.isDisabledHourPlusOne = false;
        }
        else{
          params.data.isDisabledHourPlusOne = false;
        }
      }

      for (let i = 0; i < selectedholidayTimeStartHour; i++) {
        disabledHoursNums.push(i);
      }

      return disabledHoursNums;
    }
}
disabledMinutes(params: ICellEditorParams){

  const _holidayTimeStart = _.isNil(params) ? this.holidayTimeStart : params.data.startTime;
  const _isDisabledHourPlusOne = _.isNil(params) ? this.isDisabledHourPlusOne : params.data.isDisabledHourPlusOne;

  return  (hour: number) : number[] => {
    const selectedholidayTimeStartHour = _holidayTimeStart.getHours();

    if(_isDisabledHourPlusOne || selectedholidayTimeStartHour !== hour){
      return [];
    }

    let disabledMinutesNums : number[] = [];

    let selectedholidayTimeStartMinute = _holidayTimeStart.getMinutes();
    const selectedholidayTimeStartSecond = _holidayTimeStart.getSeconds();

    if(selectedholidayTimeStartSecond === 59){
      selectedholidayTimeStartMinute++;
    }

    for (let i = 0; i < selectedholidayTimeStartMinute; i++) {
      disabledMinutesNums.push(i);
    }

    return disabledMinutesNums;
  }
}

disabledSeconds(params: ICellEditorParams) {

  const _holidayTimeStart = _.isNil(params) ? this.holidayTimeStart : params.data.startTime;
  const _isDisabledHourPlusOne = _.isNil(params) ? this.isDisabledHourPlusOne : params.data.isDisabledHourPlusOne;

  return (hour: number, minute: number) : number[] => {

    const selectedholidayTimeStartHour = _holidayTimeStart.getHours();

    if(_isDisabledHourPlusOne || selectedholidayTimeStartHour !== hour){
      return [];
    }

    if( _holidayTimeStart.getMinutes() !==  minute){
      return [];
    }

    let disabledSecondsNums : number[] = [];
    const selectedholidayTimeStartSecond = _holidayTimeStart.getSeconds();
    for (let i = 0; i <= selectedholidayTimeStartSecond; i++) {
      disabledSecondsNums.push(i);
    }

    return disabledSecondsNums;
  }
}

disabledDate(params: ICellEditorParams){

  return (current: Date): boolean => {

    const currentDate = moment(moment(current).format('YYYY-MM-DD'));
    const startDate = moment(moment(params.data.startTime).format('YYYY-MM-DD'));

    // 禁止選擇比停機開始時間還早的時間
    const disabledBeforeStratTime = currentDate.isBefore(startDate, 'days');

    // 禁止選擇比停機開始時間還晚超過一天時間
    const disabledAfterMoreThanOneDayLaterStratTime = currentDate.diff(startDate, 'days') > 1;

    return disabledBeforeStratTime || disabledAfterMoreThanOneDayLaterStratTime;
  }
}

disabledEndTime(params: ICellEditorParams) {

    return () : DisabledTimeConfig => (
        {
          nzDisabledHours:  this.disabledHours(params),
          nzDisabledMinutes: this.disabledMinutes(params),
          nzDisabledSeconds: this.disabledSeconds(params)
        } 
    );
}

holidayTimeEndChange(params: ICellEditorParams){

      // 如果停機開始日期與停機結束日期相差一天
      // 停機開始時間與停機結束時間調整為一樣
      // 這樣才符合相差一天(不能跨天)

      const startDate = moment(params.data.startTime);
      const endDate = moment(params.data.endTime);
      
      if(Math.abs(startDate.diff(endDate)) > 86400000){
        params.data.endTime = moment(`${endDate.year()}-${endDate.month()+1}-${endDate.date()} 00:00:00`).toDate();
        this.nzMessageService.warning('停機時段不得跨天，停機結束時間自動調整為零點');
      }
      
      

  /*if(!_.isNil(params.data.endTime)) {
    // 當使用者編輯更新時，清空時間再設定日期會變成抓當天日期，需重新設定回原初選擇的日期
    const originalDate : string = params.data.shutdownDay;
    const updateSelectedholidayTimeEndHour = params.data.endTime.getHours().toString();
    const updateSelectedholidayTimeEndMinute = params.data.endTime.getMinutes().toString();
    const updateSelectedholidayTimeEndSecond = params.data.endTime.getSeconds().toString();
    params.data.endTime = new Date(`${originalDate} ${updateSelectedholidayTimeEndHour}:${updateSelectedholidayTimeEndMinute}:${updateSelectedholidayTimeEndSecond}`);
   }*/
}

  selectedShutdownDayTag(event : Event, shutdownDay : string, shutdownType){
    event.stopPropagation();
    this.isLoading = false;
    this.shutdownDateShowInModalTitle = `${shutdownDay}(${shutdownType})`;

    // 渲染停機詳細資訊到ag-grid表格
    this.ppsinptb06DataList = this.listShutdownMap.get(shutdownDay).get(shutdownType)
                              .map(item => {
                                item.startTime = new Date(item.startTime);
                                item.endTime = new Date(item.endTime);
                                item.disabledShutdownEndtime = false;
                                item.shutdownEndtimeTooltipTitle = '';
                                item.isDisabledHourPlusOne = false;
                                item.equipOptionList = [];
                                return item;
                              });

    // 深拷貝緩存一份停機詳細資訊
    this.setupUpdateEditCache(this.ppsinptb06DataList);

    this.isLoading = false;
    this.isVisibleShutdownPeriods = true
  }

  async cancelSuhtdownModalVisible(){
    if(this.ppsinptb06DataList.some(item => item.hasEdit)){
      this.Modal.confirm({
        nzTitle: '尚在編輯中或資料尚未儲存，是否放棄儲存離開?',
        nzOkText: '確定',
        nzCancelText:'取消',
         nzOnOk: async () => {
          await this.getShutdownDataList();
          this.isVisibleShutdownPeriods = false;
          return;
        },
        nzOnCancel: () => {
        },
      });
    }
    else{
      await this.getShutdownDataList();
      this.isVisibleShutdownPeriods = false;
    }
  }

   // 深拷貝緩存一份停機詳細資訊
   setupUpdateEditCache(rowDataList:any[]): void {
    this.ppsinptb06EditCacheList = _.cloneDeep(rowDataList);
  }

  editSave(params: ICellRendererParams<any, any>){

    // 取得緩存的原有資料
    let oldData = this.ppsinptb06EditCacheList[params.node.rowIndex];
    // 清除儲存更新資料不必要的屬性
    const requsetData = _.omit(params.data, ['hasEdit', 'disabledShutdownEndtime', 'shutdownEndtimeTooltipTitle', 'isDisabledHourPlusOne', 'equipOptionList']) as any;
    // 清除儲存更新資料不必要的屬性
    oldData = _.omit(oldData, ['hasEdit', 'disabledShutdownEndtime', 'shutdownEndtimeTooltipTitle', 'isDisabledHourPlusOne', 'equipOptionList']) as any;

    // 無異動任何資料提醒使用者此筆不需要更新
    if(_.isEqual(oldData, requsetData)){
      this.nzMessageService.warning('資料尚未有任何修改，無法更新');
      this.cancalEditRow(params);
      return;
    }

    // 設定更新的相關資料與條件
    requsetData.oldData = oldData;
    requsetData.startTime = moment(requsetData.startTime).format('YYYY-MM-DD HH:mm:ss');
    requsetData.endTime = moment(requsetData.endTime).format('YYYY-MM-DD HH:mm:ss');
    requsetData.userUpdate = this.USERNAME;
    // oldData物件資料為更新的依據條件
    requsetData.oldData.startTime = moment(requsetData.oldData.startTime).format('YYYY-MM-DD HH:mm:ss');
    requsetData.oldData.endTime = moment(requsetData.oldData.endTime).format('YYYY-MM-DD HH:mm:ss');


    this.Modal.confirm({
      nzTitle: '確定修改資料?',
      nzOkText: '確定',
      nzCancelText:'取消',
       nzOnOk: async () => {
        await this.updatShutdownData(requsetData, params);
      },
      nzOnCancel: () => {
      },
    });

  }

  async updatShutdownData(shutdownData : any, params: ICellRendererParams<any, any>){

    try{
      
      this.isEditLoading = true;

      const resObservable$ = this.ppsService.updateShutdownData(shutdownData);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 1){
        this.errorMSG(
          '更新失敗',
          res.message
        );
      }else{

        this.updateSucessHandler(params);
        this.sucessMSG(
          '更新成功',
          res.message
        );
      }

    }
    catch (error) {
      this.errorMSG(
        ' 更新非直棒停機資料異常',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isEditLoading = false;
    }

  }

  // 處理更新停機資訊成功後
  // 舊資料緩存的更新與ag-grid表格畫面的渲染
  async updateSucessHandler(params : ICellRendererParams<any, any>){
    
    // 離開編輯模式
    params.api.stopEditing(false);

    // 若有修改到其他停機模式，則從當前表格移除
    //if(this.ppsinptb06EditCacheList[params.node.rowIndex].data.shutdownModelType != params.data.shutdownModelType){
     // this.ppsinptb06DataList.splice(params.node.rowIndex, 1);
    //}
    // 一樣則更新緩存
    //else{
      // 更新用於當作更新條件、取消編輯顯示原資料的緩存資料
      this.ppsinptb06EditCacheList[params.node.rowIndex] = _.cloneDeep(params.data);
   // }

    // 重新渲染停機資訊
    this.gridApi.setRowData(this.ppsinptb06DataList);

    // 重新要一份新的停機資訊
    await this.getShutdownDataList();

  }



  editRow(params: ICellRendererParams<any, any>){
    // 控制編輯按鈕的顯示切換
    params.data.hasEdit = true;
    // 使用ag-grid提供的api開啟整行進入編輯狀態
    // colKey設定進入編輯狀態後焦點要是哪個cloumn，
    // 但一定要帶值，且帶的該欄位是要可編輯的
    params.api.startEditingCell({
      rowIndex : params.rowIndex,
      colKey : 'startTime' 
    });
  }

  cancalEditRow(params: ICellRendererParams<any, any>){
    params.api.stopEditing(false);
    this.ppsinptb06DataList[params.node.rowIndex] = _.cloneDeep(
      this.ppsinptb06EditCacheList[params.node.rowIndex]
    );
    this.gridApi.setRowData(this.ppsinptb06DataList);
  }


  async deleteRow(params: ICellRendererParams<any, any>){

    this.Modal.confirm({
      nzTitle: '確定刪除資料?',
      nzOkText: '確定',
      nzCancelText:'取消',
       nzOnOk: async () => {
        await this.deleteRowHandler(params);
      },
      nzOnCancel: () => {
      },
    });

  }


  async deleteRowHandler(params: ICellRendererParams<any, any>){

    try{

      this.isEditLoading = true;
      
      // 取得緩存的原有資料
      let oldData = this.ppsinptb06EditCacheList[params.node.rowIndex];

      // 剔除不需要的屬性
      oldData = _.omit(oldData, ['hasEdit', 'disabledShutdownEndtime', 'shutdownEndtimeTooltipTitle', 'isDisabledHourPlusOne', 'equipOptionList']) as any;
      oldData.startTime = moment(oldData.startTime).format('YYYY-MM-DD HH:mm:ss');
      oldData.endTime = moment(oldData.endTime).format('YYYY-MM-DD HH:mm:ss');

      const resObservable$ = this.ppsService.deleteShutdownData({oldData:oldData});
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 1){
        this.errorMSG(
          '刪除失敗',
          res.message
        );
      }else{

        this.deleteSucessHandler(params);
        this.sucessMSG(
          '刪除成功',
          res.message
        );
      }

    }
    catch (error) {
      this.errorMSG(
        ' 刪除非直棒停機資料異常',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isEditLoading = false;
    }

  }


  // 處理刪除停機資訊成功後
  // 舊資料緩存的刪除與ag-grid表格畫面的渲染
  async deleteSucessHandler(params : ICellRendererParams<any, any>){
    
    // 離開編輯模式
    params.api.stopEditing(false);

    // 刪除前端中該筆資料
    this.ppsinptb06DataList.splice(params.node.rowIndex, 1);
    // 刪除該筆資料的緩存
    this.ppsinptb06EditCacheList.splice(params.node.rowIndex, 1);

    // 重新要一份新的停機資訊
    await this.getShutdownDataList();

    // 如果該顯示停機資訊的表格中資料被刪完
    // 則關閉modal彈出視窗
    if(_.isEmpty(this.ppsinptb06DataList)){
      this.nzMessageService.success('停機資訊已被刪除完了');
      this.isVisibleShutdownPeriods = false;
      return;
    }

    // 重新渲染停機資訊
    this.gridApi.setRowData(this.ppsinptb06DataList);

  }

  cellEditingStoppedHandler(event: CellEditingStoppedEvent<any, any>) {
    // 排除 "hasEdit" 屬性，不列入後續的資料比較
    const newValue = _.omit(event.data, ['hasEdit']);
    const oldValue = _.omit(this.ppsinptb06EditCacheList[event.rowIndex], [
      'hasEdit',
    ]);

    if (_.isEqual(oldValue, newValue)) {
      event.data.hasEdit = false;
    } else {
      event.data.hasEdit = true;
    }
    
  }

  cellDoubleClickedHandler(event: CellDoubleClickedEvent<any, any>) {
    event.data.hasEdit = true;
  }

   // 獲取ag-grid的Api物件
   onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  
  // 下載當月Excel資料
  async convertMonthDataToExcel(){

    this.isLoading = true;

    this.getFieldNameList();
    this.getEnglishChineseTitleMapping();

    const isSucess = await this.getShutdownDataListForExcelExport();

    // 獲取資料失敗
    if(!isSucess){
      return;
    }

    const year = this.calendarSelectedDate.getFullYear().toString();
    const month = (this.calendarSelectedDate.getMonth() + 1).toString().padStart(2, '0');

    const exportData = [this.englishChineseTitleMapping, ...this.ppsinptb06DataListForExcelExport];

    const workSheet = XLSX.utils.json_to_sheet(exportData, {
      header: this.fieldNameList,
      skipHeader: true,
    });
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
    XLSX.writeFileXLSX(
      workBook,
      `${year}-${month} 非直棒定修資料_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`
    );

    this.isLoading = false;
    this.nzMessageService.success('匯出成功');  



  }

  async getShutdownDataListForExcelExport() : Promise<boolean> {

    try{
      const year = this.calendarSelectedDate.getFullYear().toString();
      const month = (this.calendarSelectedDate.getMonth() + 1).toString().padStart(2, '0');
      const resObservable$ = this.ppsService.getShutdownDataListForExcelExport(year, month);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 1){
        this.errorMSG(
          '獲取當月停機資料失敗',
          res.message
        );
        this.isLoading = false;
        return false;
      }else{
        this.ppsinptb06DataListForExcelExport = res.data;
        return true;
      }
    }
    catch (error) {
      this.errorMSG(
        '獲取當月停機資料異常',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }

  }

  getFieldNameList(){
    if(_.isEmpty(this.fieldNameList)){

      this.fieldNameList = this.ppsinptb06ColumnDefs.map(item => {
                            if(!_.includes(this.excludedField, item.field)){
                              return item.field
                            }
                          }).filter(filed => !_.isNil(filed));

    }
  }

  getEnglishChineseTitleMapping(){

    if(_.isEmpty(this.englishChineseTitleMapping)){
      this.englishChineseTitleMapping = {};
      this.ppsinptb06ColumnDefs.forEach(item => {
        if(!_.includes(this.excludedField, item.field)){
            let enChMapping = {
              [item.field] : item.headerName
            }
            _.merge(this.englishChineseTitleMapping, enChMapping);
        }
      });
    }
  }

  // 吃excel檔案
  incomingFile($event: any) {
    this.excelImportFile = $event.target.files[0];
    let lastname = this.excelImportFile.name.split('.').pop();
    if (lastname !== 'xlsx' && lastname !== 'xls' && lastname !== 'csv') {
      this.errorMSG('檔案格式錯誤', '僅限定上傳 Excel 格式。');
      this.renderer.setProperty(this.inputExcelFile, 'value', '');  
      return;
    }
  }


  jsonExcelData : any[] = [];
  handleImport(){

    const fileValue = this.inputExcelFile.value
    if(fileValue === "") {
      this.errorMSG('無檔案', '請先選擇要上傳的檔案');
      return;
    }

    const reader = new FileReader();

    // 文件加載完成後調用
    reader.onload = (e: any) => {
      this.isLoading = true;
      // 從檔案獲取原始資料
      let data = e.target.result;

      // 從原始資料獲取工作簿
      // 兼容IE，需把type改為binary，並對data進行轉化
      let workbook = XLSX.read(data, {
        type: 'binary'
      });

      const sheets = workbook.SheetNames;

      if (sheets.length) {
        var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]], {
          defval: null // 單元格為空的預設值
        });
        this.jsonExcelData = jsonData;

        if(this.jsonExcelData.length != 0){
          this.importExcel();
        }
        else{
          this.errorMSG("匯入失敗", `此檔案無任何數據`);
          this.isLoading = false;
        }

      }
    }
    // 加載文件
    reader.readAsArrayBuffer(this.excelImportFile);

  }

  async importExcel() {

    this.isLoading = true;

    // 獲取所有欄位名稱
    this.getHeaderNameList();

    // 檢查欄位名稱是否都正確
    if (!this.checkExcelHeader(this.jsonExcelData[0])) {
      this.errorMSG('檔案欄位表頭錯誤', '請參考匯出的Excel修改後再做匯入');
      this.renderer.setProperty(this.inputExcelFile, 'value', '');
      this.isLoading = false;
      return;
    } 
    console.log('匯入的Excel header皆正確');

    // 校驗每個Excel欄位是否都有填寫
    if (!this.checkAllValuesNotEmpty(this.jsonExcelData)) {
      this.isLoading = false;
      this.renderer.setProperty(this.inputExcelFile, 'value', '');
      return;
    }
    console.log('匯入的Excle的欄位都有填寫');

    // 將jsonData轉成英文的key
    // 順便添加使用者名稱相關資料
    this.convertJsonToEnglishkey();

     // 校驗Excel中的資料是否有重複
    if (this.checkExcelDataDuplicate(this.jsonExcelData)) {
      this.isLoading = false;
      this.renderer.setProperty(this.inputExcelFile, 'value', '');
      return;
    }
    console.log('匯入的Excle中的資料皆無重複');

    // 校驗Excel中的停機時段是否有重疊
    if (this.checkShutdownPeriodsOverlap()){
      this.isLoading = false;
      this.renderer.setProperty(this.inputExcelFile, 'value', '');
      return;
    }
    console.log('匯入的Excle中的停機時段皆無重疊');

    // 將Excel匯入的資料存放進資料庫
    await this.batchSaveShutdownListForExcelImport();

  }

  async batchSaveShutdownListForExcelImport(){

    try {  

      const resObservable$ = this.ppsService.batchSaveShutdownListForExcelImport(this.jsonExcelData);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 1){
        this.errorMSG('新增失敗', res.message);
      }
      else{
        await this.getShutdownDataList();
        this.sucessMSG('新增成功', res.message);
      }
    }
    catch (error) {
      this.errorMSG(
        '批次Excel匯入非直棒停機定修資料異常',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
      this.renderer.setProperty(this.inputExcelFile, 'value', '');
    }
  }

  checkShutdownPeriodsOverlap() {

    // 同一天且站別、機台相同，需檢核停機時段有沒有重複
    for (let i = 0; i < this.jsonExcelData.length; i++) {
      for (let j = i+1; j < this.jsonExcelData.length; j++) {
        // 以停機開始時間作為判斷是否是同一天  
        let startDay : string = moment(this.jsonExcelData[i].startTime).format('YYYY-MM-DD');
        let nextStartDay : string = moment(this.jsonExcelData[j].startTime).format('YYYY-MM-DD');
        
        // 若同一天且站別、機台相同
        if( _.isEqual(startDay, nextStartDay) &&
            _.isEqual(this.jsonExcelData[i].shopCode, this.jsonExcelData[j].shopCode) &&
            _.isEqual(this.jsonExcelData[i].equipCode, this.jsonExcelData[j].equipCode)){
              
              let startTime = moment(this.jsonExcelData[i].startTime);
              let endTime = moment(this.jsonExcelData[i].endTime);
              let nextStartTime = moment(this.jsonExcelData[j].startTime);
              let nextEndTime = moment(this.jsonExcelData[j].endTime);
              
              // 若同一天且站別、機台相同且停機時段重疊
              if(endTime.isAfter(nextStartTime) && nextEndTime.isAfter(startTime)){
                this.errorMSG("匯入失敗", ` ${startDay}，資料行數 ${i+2} 與 資料行數 ${j+2} 停機時段時間重疊，請修正`);
                return true;
              }
        }
        else{
          continue;
        }
      }
    }

    return false;
  } 

  checkExcelDataDuplicate(jsonExcelData: any): boolean {
    let i = 0;
    let j = 1;

    while (true) {
      if (i === jsonExcelData.length - 1) return false;

      if (j > jsonExcelData.length - 1) {
        i++;
        j = i + 1;
      }

      if (i === jsonExcelData.length - 1) return false;

      if (_.isEqual(jsonExcelData[i], jsonExcelData[j])) {
        this.errorMSG(
          '匯入失敗',
          `第 ${i + 2} 行資料的與第 ${j + 2} 行資料已重複，請修改後再匯入`
        );
        return true;
      } else {
        j++;
      }
    }
  }

  convertJsonToEnglishkey() {

    this.getFieldNameList();
    this.getHeaderNameList();

    for (let i = 0; i <= this.headerNameList.length; i++) {
      let chineseKey = `"${this.headerNameList[i]}":`;
      let englishKey = `"${this.fieldNameList[i]}":`;
      this.jsonExcelData = JSON.parse(
        JSON.stringify(this.jsonExcelData).split(chineseKey).join(englishKey)
      );
    }

    // 添加屬性
    this.jsonExcelData.forEach(item => {
      item.userCreate = this.USERNAME;
    })
  }

  checkAllValuesNotEmpty(jsonExcelData): boolean {

    for (let i = 1; i <= jsonExcelData.length; i++) {
      let rowNumberInExcel = i + 1;
      let item = jsonExcelData[i - 1];

      let hasStartTime = false;
      let hasEndTime = false;

      // 檢查停機開始時間
      if (_.isNull(item[this.headerNameList[0]])) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「${this.headerNameList[0]}」不得為空，請修正。`
        );
        return false;
      }
      // 檢查停機開始時間合法性
      // 格式是否正確
      else{
        hasStartTime = true;
        if(!this.verifyDate(item, rowNumberInExcel, this.headerNameList[0])){
          return false;
        }
      }

      // 檢查停機結束時間
      if (_.isNull(item[this.headerNameList[1]])) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「${this.headerNameList[1]}」不得為空，請修正。`
        );
        return false;
      }
      else{
        hasEndTime = true;
        if(!this.verifyDate(item, rowNumberInExcel, this.headerNameList[1])){
          return false;
        }

      }

      // 停機開始時間不能晚於停機結束時間
      // 停機開始時間與停機結束時間之間不能跨天
      // 跨天只允許前一天的任意時間到隔天的00:00:00
      // 例如 2023-08-18 06:00:00 到 2023-08-19 00:00:00
      // 不允許其他時間的跨天 例如 2023-08-18 06:00:00 到 2023-08-19 01:00:00

      if(hasStartTime && hasEndTime){

        const startTime = moment(item[this.headerNameList[0]]);
        const endTime = moment(item[this.headerNameList[1]]);

        // 停機開始時間沒有早於停機結束時間
        if(startTime.isSameOrAfter(endTime)){
          this.errorMSG(
            '匯入失敗',
            `第${rowNumberInExcel}行資料的「${this.headerNameList[0]}」必須早於「${this.headerNameList[1]}」，請修正。`
          );
          return false;
        }

        // 停機開始時間與停機結束有跨天(不能跨天)
        const startTimeSpanningDay = moment(`${startTime.year()}-${startTime.month()+1}-${startTime.date()}`);
        const endTimeSpanning = moment(`${endTime.year()}-${endTime.month()+1}-${endTime.date()}`);
        const isMidnight = endTime.isSame(_.cloneDeep(endTime).startOf('day'));

        // 如果日期差一天且結束時間不是零點
        if(Math.abs(endTimeSpanning.diff(startTimeSpanningDay, 'days')) >=1 && !isMidnight){
          this.errorMSG(
            '匯入失敗',
            `第${rowNumberInExcel}行資料的「${this.headerNameList[0]}」與「${this.headerNameList[1]}」不能跨天，請修正。`
          );
          return false;
        }
      }

      // 檢查站別
      if (_.isNull(item[this.headerNameList[2]])) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「${this.headerNameList[2]}」不得為空，請修正。`
        );
        return false;
      }

      // 檢查機台
      if (_.isNull(item[this.headerNameList[3]])) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「${this.headerNameList[3]}」不得為空，請修正。`
        );
        return false;
      }

       // 檢查停機模式
      if (_.isNull(item[this.headerNameList[4]])) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「${this.headerNameList[4]}」不得為空，請修正。`
        );
        return false;
      }

    }

    return true;
  
  }

  verifyDate(inputItem: any, rowNumberInExcel: number, headerName: string): boolean {
    const dateRegex = /^\d{4}[\/-]\d{2}[\/-]\d{2}\s\d{2}:\d{2}:\d{2}$/;
    const inputDate = inputItem[headerName];

    if (typeof inputDate === 'string') {
      if (!dateRegex.test(String(inputDate))) {
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「${headerName}」格式錯誤，請修正。<br>日期格式為 YYYY-MM-DD HH:mm:ss <br> 例如 ${moment().format(
            'YYYY-MM-DD HH:mm:ss')}`
        );
        return false;
      }

      if(!moment(inputDate, 'YYYY-MM-DD HH:mm:ss', false).isValid()){
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「${headerName}」日期數字不合法，請修正。`
        );
        return false;
      }

    }
    else if (typeof inputDate === 'number') {
      const dateStr: string = this.excelDateToJSDate(inputDate);
      if(!moment(dateStr, 'YYYY-MM-DD HH:mm:ss', false).isValid()){
        this.errorMSG(
          '匯入失敗',
          `第${rowNumberInExcel}行資料的「${headerName}」日期數字不合法，請修正。`
        );
        return false;
      }

      inputItem[headerName] = dateStr;

    } 
    else {
      this.errorMSG(
        '匯入失敗',
        `第${rowNumberInExcel}行資料的「${headerName}」為無法辨識的資料型態，請修正。`
      );
      return false;
    }
    
    return true;
  }

  excelDateToJSDate(serial): string {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    const month = (date_info.getMonth() + 1).toString().padStart(2, '0');
    const day = date_info.getDate().toString().padStart(2, '0');
    const hour = hours.toString().padStart(2, '0');
    const minute = minutes.toString().padStart(2, '0');
    const second = seconds.toString().padStart(2, '0');

    return `${date_info.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  

  getHeaderNameList(){
    if(_.isEmpty(this.headerNameList)){

      this.headerNameList = this.ppsinptb06ColumnDefs.map(item => {
                            if(!_.includes(this.excludedField, item.field)){
                              return item.headerName
                            }
                          }).filter(headerName => !_.isNil(headerName));

    }
  }

  checkExcelHeader(d): boolean {

    const keys = Object.keys(d);

    // 用於判斷使用者匯入的Excel header是否正確以及數量一樣
    let checkNumber = 0;

    keys.forEach(key => {
        if(_.includes(this.headerNameList, key)){
          checkNumber++;
        }
    })

    return checkNumber == this.headerNameList.length;

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
