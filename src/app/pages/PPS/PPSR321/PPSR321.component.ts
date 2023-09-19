import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as _ from "lodash";
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { PPSR321DataPassService } from './PPSR321_DataPass/PPSR321-data-pass.service';
import { Router } from '@angular/router';
import { isTemplateRef } from 'ng-zorro-antd/core/util';
import { NzTableComponent } from 'ng-zorro-antd/table';
registerLocaleData(zh);


export interface VirtualDataInterface {
  id: number;
}

@Component({
  selector: 'app-ppsr321',
  templateUrl: './PPSR321.component.html',
  styleUrls: ['./PPSR321.component.css'],
  providers:[NzMessageService]
})
export class PPSR321Component implements OnInit, AfterViewInit {

  displayTbppsrm011List : any[] = [];

  isLoading = false;
  addIndex = 0;
  monthFormat = 'yyyy-MM';

  // 生產月份
  produceMonth : Date = null;

  // 維護彈跳視窗的載入
  isMaintainLoading = false;
  // 維護彈跳視窗是否顯示
  isVisibleMaintain = false;
  // 當前點擊維護的月推移版本
  currentShiftEdition = '';

  tablePageSize = 10;
  tablePageIndex = 1;
  tbppsrm011TableScroll : any;
  tbppsrm011Table : any;
  
  constructor(private ppsService: PPSService,
              private Modal: NzModalService,
              private nzMessageService: NzMessageService,
              private ppsr321DataPassService: PPSR321DataPassService,
              private changeDetectorRef: ChangeDetectorRef,
              private elementRef:ElementRef) { 
      this.ppsr321DataPassService.getRefresh().subscribe(async toRefresh => {
          await this.findAllShiftData();
      });
  }

  async ngAfterViewInit(): Promise<void> {
    this.tbppsrm011TableScroll = this.elementRef.nativeElement.querySelector('.ant-table-body') as any;
    this.tbppsrm011Table = this.elementRef.nativeElement.querySelector('#tableId') as any;
    //this.tbppsrm011Table.addEventListener('scroll', this.onTableScroll);
    await this.findAllShiftData();
  }

  ngOnInit(): void {

  }

  // onTableScroll = (event: any) : void => {
  //   const scrollInfo = event.target;
  //   // 每個row的行高
  //   const rowHeight = 71;
  //   this.insertRowIndex = Math.ceil(scrollInfo.scrollTop / rowHeight); 
  // }

  // 新增月推移資料
  add() : void {

    this.isLoading = true;

    const newData = {
      id:this.addIndex,
      shiftEdition:'',
      produceMonth:null,
      userCreate:'',
      dateCreate:'',
      userUpdate:'',
      dateUpdate:'',
      hasDeleted:false,
      hasNew:1
    };
    const cloneDeepDataList = _.cloneDeep(this.displayTbppsrm011List);
    cloneDeepDataList.unshift(newData)
    this.tablePageIndex = 1;
    this.displayTbppsrm011List = cloneDeepDataList;
    this.addIndex++;

    // 將scrollY捲到最上面顯示複製的此筆選項
    const rect = this.tbppsrm011Table.getBoundingClientRect();
    if(rect.top < 0){
      window.scrollTo(0,0);
    }
    this.tbppsrm011TableScroll.scrollTop = 0;
    this.isLoading = false;
  }

  // 獲取「月推移報表」資料
  async findAllShiftData() : Promise<void> {

    try{
      this.isLoading = true;

      const resObservable$ = this.ppsService.findAllShiftData();
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '獲取月推移報表維護資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        this.isLoading = false;
        return;
      }

      if(res.data.length <= 0){
        this.sucessMSG(
          '目前無月推移報表維護資料',
          '目前無月推移報表維護資料'
        );
        return;
      }

      // 那些處於新增狀態的rowData，要添加回從後端抓取的資料之中
      // 過濾出正在新增或複製的資料
      const addOrCloneRowDataList = this.displayTbppsrm011List.filter(item => {
          return _.includes([1,2], item.hasNew);
      }).reverse();

      res.data = this.fromatDateTime(res.data);

      // 添加回最新的月推移報表維護資料之中
      addOrCloneRowDataList.forEach(item => {
        res.data.unshift(item);
      });

      // 渲染表格
      this.displayTbppsrm011List = res.data;
      this.tbppsrm011TableScroll.scrollTop = 0;

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

  fromatDateTime(data: any[]): any[] {
    return data.map(item => {
      item.dateCreate = moment(item.dateCreate).format('YYYY-MM-DD HH:mm');
      item.dateUpdate = moment(item.dateUpdate).format('YYYY-MM-DD HH:mm');
      return item;
    });
  }

  getActionStatus(rowData : any) : string {

    if(rowData.hasNew === 1){
      return '新增';
    }

    if(rowData.hasNew === 2){
      return `複製(from:${rowData.shiftEdition})`;
    }

    if(rowData.hasDeleted){
      return '刪除';
    }

    return '使用中';
  }

  formatProduceMonth(rowData : any) : string {
    return rowData.produceMonth.split('-')[1];
  }

  maintain(rowData : any) : void {
    // 傳遞給子元件的當前月推移主檔資料
    this.ppsr321DataPassService.mainData = rowData;
    this.currentShiftEdition = rowData.shiftEdition;
    this.isVisibleMaintain = true;
  }

  async deleteRow(rowData : any) : Promise<void>{

    try{

      this.isLoading = true;
      const shiftEdition = rowData.shiftEdition;
      const resObservable$ = this.ppsService.deleteShiftData(shiftEdition);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '刪除月推移報表維護資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
      }
      else{
        await this.findAllShiftData();
        this.sucessMSG(
          '刪除月推移報表維護資料成功',
          '刪除月推移報表維護資料成功'
        );
      }

    }
    catch (error) {
      this.errorMSG(
        '刪除版次資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  clone(rowData : any) : void{

    this.isLoading = true;

    const newData = {
      id:this.addIndex,
      shiftEdition:rowData.shiftEdition,
      produceMonth:null,
      userCreate:'',
      dateCreate:'',
      userUpdate:'',
      dateUpdate:'',
      hasDeleted:false,
      hasNew:2
    };
    const cloneDeepDataList = _.cloneDeep(this.displayTbppsrm011List);
    cloneDeepDataList.unshift(newData);

    this.tablePageIndex = 1;
    this.displayTbppsrm011List = cloneDeepDataList;
    this.addIndex++;

    // 將scrollY捲到最上面顯示複製的此筆選項
    const rect = this.tbppsrm011Table.getBoundingClientRect();
    if(rect.top < 0){
      window.scrollTo(0,0);
    }
    this.tbppsrm011TableScroll.scrollTop = 0;
    this.isLoading = false;
  }

  async cloneConfirm(rowData : any) : Promise<void> {

    if(_.isNull(rowData.produceMonth)){
      this.nzMessageService.error("請輸入生產月份");
      return;
    }

    try{
      this.isLoading = true;
      rowData.produceMonth = moment(rowData.produceMonth).format("YYYY-MM");
      const resObservable$ = this.ppsService.cloneShiftData(rowData);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '複製月推移報表維護資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
      }
      else{
        // 標記該筆資料已完成複製
        rowData.hasNew = undefined;
        await this.findAllShiftData();
        this.sucessMSG(
          '複製月推移報表維護資料成功',
          res.message
        );
      }

    }
    catch (error) {
      this.errorMSG(
        '複製月推移報表維護資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  async addConfirm(rowData : any) : Promise<void> {

    try{
      this.isLoading = true;
      if(_.isNull(rowData.produceMonth)){
        this.nzMessageService.error("請輸入生產月份");
        return;
      }

      const payload = {
        produceMonth : moment(rowData.produceMonth).format("YYYY-MM")
      }

      const resObservable$ = this.ppsService.addShiftData(payload);
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 200){
        this.errorMSG(
          '新增月推移報表維護資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
      }
      else{
        // 標記該筆資料已完成複製
        rowData.hasNew = undefined;
        await this.findAllShiftData();
        this.sucessMSG(
          '新增月推移報表維護資料成功',
          res.message
        );
      }

    }
    catch (error) {
      this.errorMSG(
        '新增月推移報表維護資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }
    

  cancelAdd(id:number) : void {
    this.isLoading = true;
    this.displayTbppsrm011List = _.filter(this.displayTbppsrm011List, item => {
        return item.id != id;
    });
    this.isLoading = false;
  }

  // 維護彈跳視窗關閉
  async cancelMaintainModalVisible(){
    // 如果子元件頁面有正在編輯資料，詢問使用者是否確定關閉彈出視窗
    if(!_.isEmpty(this.ppsr321DataPassService.hasEdited)){
        new Promise<boolean>((resolve) => {
          this.Modal.confirm({
            nzTitle: `${this.ppsr321DataPassService.hasEdited}，是否離開?`,
            nzOkText: '離開',
            nzCancelText: '取消',
            nzOnOk: () => {
              // 關閉彈跳視窗，重置編輯狀態，任何子元件都沒有在編輯的
              this.ppsr321DataPassService.hasEdited = '';
              resolve(true);
            },
            nzOnCancel: () => {
              resolve(false);
            }
          }); 
        }).then(exit => {
          if(exit){
            this.isVisibleMaintain = false;
          }
        });
    }
    else{
      this.isVisibleMaintain = false;
    }
  }

  // 使用者關閉瀏覽器、瀏覽器分頁或重整網頁時，如果處於編輯狀態给於是否離開的提示
  @HostListener('window:beforeunload', ['$event'])
  async onWindowClose(event: any){
    if (this.ppsr321DataPassService.hasEdited || this.displayTbppsrm011List.some(item => _.includes([1,2], item.hasNew))) {
      event.returnValue = '';
    }
  }

  // 使用者離開當前頁面時，如果處於編輯狀態给於是否離開的提示
  async canDeactivate() :  Promise<boolean> {

    if(this.displayTbppsrm011List.some(item => _.includes([1,2], item.hasNew))){
      return await new Promise<boolean>((resolve) => {
        this.Modal.confirm({
          nzTitle: `月推移報表資料正在新增或複製中，是否離開?`,
          nzOkText: '離開',
          nzCancelText: '取消',
          nzOnOk: () => {  
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

