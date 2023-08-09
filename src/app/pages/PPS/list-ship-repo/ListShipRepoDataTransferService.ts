import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ListShipRepoDataTransferService {

    // 傳遞版次
    private edition = new Subject<String>();

    // 傳遞當前使用者選擇到哪個頁面
    private selectedPage = new Subject<String>();

    setEdition(_edition: String) {
        this.edition.next(_edition);
    }

    getEdition() {
        return this.edition.asObservable();
    }

    setSelectedPage(_selectedPage: String) {
        this.selectedPage.next(_selectedPage);
    }

    getSelectedPage() {
        return this.selectedPage.asObservable();
    }

}