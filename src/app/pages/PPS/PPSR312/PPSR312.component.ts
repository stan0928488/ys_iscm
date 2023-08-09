import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ListShipRepoDataTransferService } from '../list-ship-repo/ListShipRepoDataTransferService';
import { PPSService } from "src/app/services/PPS/PPS.service";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ppsr312',
  templateUrl: './PPSR312.component.html',
  styleUrls: ['./PPSR312.component.css'],
  providers:[NzMessageService]
})
export class PPSR312Component implements OnInit {

  // 控制是否顯示載入中圖示
  isLoading = false;

  // 版次是否載入中
  editionsLoading = false;
  // 版次選項
  editionList : string[] = [];
  // 使用者當前選擇的版次
  edition : string;

  constructor(private PPSService: PPSService,
              private Modal: NzModalService,
              private nzMessageService: NzMessageService,
              private listShipRepoDataTransferService:ListShipRepoDataTransferService) { 

  }

  ngOnInit(): void {
    this.listShipRepoDataTransferService.setSelectedPage("R312");
  }

  // 獲取查詢條件「版次」
  async getEditions() {
    this.editionsLoading = true;

    try{
      const resObservable$ = this.PPSService.getShipRepoEditionList();
      const res = await firstValueFrom<any>(resObservable$);

      if(res.code !== 1){
        this.errorMSG(
          '獲取版次資料失敗',
          `請聯繫系統工程師。錯誤訊息 : ${res.message}`
        );
        return;
      }

      this.editionList = res.data;
    }
    catch (error) {
      this.errorMSG(
        '獲取版次資料失敗',
        `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`
      );
    } finally {
      this.editionsLoading = false;
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
