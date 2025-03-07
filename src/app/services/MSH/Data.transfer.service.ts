import { Injectable } from "@angular/core";
import { IRowNode } from "ag-grid-community";
import { Subject } from "rxjs";
import { MSHI003 } from "src/app/pages/MSH/MSHI003/MSHI003.model";

@Injectable({
    providedIn: 'root',
})
export class DataTransferService {

    // 傳遞要儲存的資料
    private data = new Subject<IRowNode<MSHI003>>();

    // 傳遞要查詢過站狀態與EPST的參數
    private paramsOfAdjShopCodeAndAdjLineupProcessForSearchEpst = new Subject<IRowNode<MSHI003>>();

    setData(_data: IRowNode<MSHI003>) {
        this.data.next(_data);
    }

    getData() {
        return this.data.asObservable();
    }

    setParamsOfAdjShopCodeAndAdjLineupProcess(_data: IRowNode<MSHI003>) {
        this.paramsOfAdjShopCodeAndAdjLineupProcessForSearchEpst.next(_data);
    }

    getParamsOfAdjShopCodeAndAdjLineupProcess() {
        return this.paramsOfAdjShopCodeAndAdjLineupProcessForSearchEpst.asObservable();
    }
}
