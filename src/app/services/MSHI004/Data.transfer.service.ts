import { Injectable } from "@angular/core";
import { IRowNode } from "ag-grid-community";
import { Subject } from "rxjs";
import { MSHI004 } from "src/app/pages/MSH/MSHI004/MSHI004.model";

@Injectable({
    providedIn: 'root',
})
export class DataTransferService {

    private data = new Subject<IRowNode<MSHI004>>();

    setData(_data: IRowNode<MSHI004>) {
        this.data.next(_data);
    }

    getData() {
        return this.data.asObservable();
    }

}
