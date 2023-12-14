import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PPSR322EvnetBusComponent {
  breadcrumbObj = {
    index: 0,
  };

  searchObj = {
    verList: {
      fcpVer: String,
      shiftVer: String,
    },
    schShop: [],
  };

  private subscription: Subscription;
  private subject$ = new Subject();

  constructor() {}

  emit(event: any) {
    this.subject$.next(event);
  }

  on(eventName: string, data: any): Subscription {
    this.subscription = this.subject$
      .pipe(
        filter((e: any) => e.name === eventName),
        map((e: any) => e)
      )
      .subscribe(data);
    return this.subscription;
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }

  addToInventory(breadcrumbObj: any, searchObj: any) {
    this.breadcrumbObj = breadcrumbObj;
    this.searchObj = searchObj;
  }

  private sharedDataSubject = new BehaviorSubject<any>(null);
  sharedData$ = this.sharedDataSubject.asObservable();

  updateSharedData(data: any) {
    const preData = { data };
    this.sharedDataSubject.next(preData);
    console.log(data);
  }
}
