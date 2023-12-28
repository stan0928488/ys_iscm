import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import * as _ from "lodash";

export interface TabModel {
    uuid : string;
    pageName: string;
    pagePath: string;
}

export interface TabData {
    isClose : boolean;
    tabArray : TabModel[]
}

@Injectable({
    providedIn: 'root'
  })
export class TabService {

    private tabDataList$ = new BehaviorSubject<TabData>({} as TabData);

    private tabDataList : TabData = {
        isClose : false,
        tabArray : []
    }

    public getTabDataList$(): Observable<TabData> {
        return this.tabDataList$ .asObservable();
    }

    public setTabDataList$(tabModel: TabModel): void {
        this.tabDataList.tabArray.push(tabModel);
        this.tabDataList.tabArray = _.uniqBy(this.tabDataList.tabArray, 'pageName');
        this.tabDataList.isClose = false;
        this.tabDataList$.next(this.tabDataList);
    }

    public closeTab(data: TabModel){
        this.tabDataList.tabArray = this.tabDataList.tabArray.filter(item =>  !_.isEqual(item.uuid, data.uuid));
        this.tabDataList.isClose = true;
        this.tabDataList$.next(this.tabDataList);
    }

    public clearTabDataList(){
        this.tabDataList.isClose = false;
        this.tabDataList.tabArray = [];
    }

}
  