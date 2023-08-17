import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class PPSI202DataTransferService {

    // 傳遞當前使用者選擇到哪個Tab
    private selectedPage = new Subject<String>();

    setSelectedPage(_selectedPage: String) {
        this.selectedPage.next(_selectedPage);
    }

    getSelectedPage() {
        return this.selectedPage.asObservable();
    }

}