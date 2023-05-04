import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { MSHI003 } from "src/app/pages/MSH/MSHI003/MSHI003.model";

@Injectable({
    providedIn: 'root',
})
export class DataTransferService {

    private data = new Subject<MSHI003>();

    setData(_data: MSHI003) {
        this.data.next(_data);
    }

    getData() {
        return this.data.asObservable();
    }

}
