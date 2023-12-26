import { Injectable } from '@angular/core';
import { Subject, Subscription, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppEventBusComponent {

  logingObj = {
    logingSuccess:false,
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

  logingObjAdd(logingObj: any) {
    this.logingObj = logingObj;
  }

}
