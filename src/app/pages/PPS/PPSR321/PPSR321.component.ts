import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import * as _ from "lodash";
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';
import { PPSService } from 'src/app/services/PPS/PPS.service';
import { PPSR321DataPassService } from './PPSR321_DataPass/PPSR321-data-pass.service';
registerLocaleData(zh);


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

  constructor(private ppsService: PPSService,
              private Modal: NzModalService,
              private nzMessageService: NzMessageService,
              private ppsr321DataPassService: PPSR321DataPassService) { 

      this.ppsr321DataPassService.getRefresh().subscribe(async toRefresh => {
          await this.findAllShiftData();
      });
  }

  async ngAfterViewInit(): Promise<void> {
    await this.findAllShiftData();
  }

  ngOnInit(): void {

  }

  // 新增月推移資料
  add() : void {
    const newData = {
      id:this.addIndex,
      shiftEdition:'',
      produceMonth:'',
      userCreate:'',
      dateCreate:'',
      userUpdate:'',
      dateUpdate:'',
      hasDeleted:false,
      hasNew:true
    };
    const cloneDeepDataList = _.cloneDeep(this.displayTbppsrm011List);
    cloneDeepDataList.unshift(newData);
    this.displayTbppsrm011List = cloneDeepDataList;
    this.addIndex++;
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

      this.displayTbppsrm011List = res.data;

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

  getActionStatus(rowData : any) : string {

    if(rowData.hasNew){
      return '新增';
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

  deleteRow(id:number) : void{

  }

  clone(id:number) : void{

  }

  async addConfirm(rowData : any) : Promise<void> {

    try{
      this.isLoading = true;

      if(_.isNil(this.produceMonth)){
        this.nzMessageService.error("請輸入生產月份");
        return;
      }

      const payload = {
        produceMonth : moment(this.produceMonth).format("YYYY-MM")
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
        await this.findAllShiftData();
        this.sucessMSG(
          '新增月推移報表維護資料成功',
          '新增月推移報表維護資料成功'
        );
      }

    }
    catch (error) {
      this.errorMSG(
        '獲取版次資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.isLoading = false;
    }
  }
    

  cancelAdd(id:number) : void {
    this.displayTbppsrm011List = _.filter(this.displayTbppsrm011List, item => {
        return item.id != id;
    });
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
    if (this.ppsr321DataPassService.hasEdited) {
      event.returnValue = '';
    }
  }

  // 使用者離開當前頁面時，如果處於編輯狀態给於是否離開的提示
  async canDeactivate() :  Promise<boolean> {

  //   if(this.ppsr321DataPassService.hasEdited){
  //     return await new Promise<boolean>((resolve) => {
  //       this.Modal.confirm({
  //         nzTitle: `預計入庫資訊編輯中，是否離開?`,
  //         nzOkText: '離開',
  //         nzCancelText: '取消',
  //         nzOnOk: () => {  
  //           resolve(true);
  //         },
  //         nzOnCancel: () => {
  //           resolve(false);
  //         }
  //       }); 
  //     });
  //   }

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

