import { Injectable } from '@angular/core';
import { Subject, Subscription, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppEventBusComponent {

  menus: TreeNode[] = [];

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

  logingObjAdd(menus: any) {
    this.menus = menus;
  }

  hasPermission(path:string) : boolean {
    let pathArr:string[] = [];
    recursionPath(this.menus,pathArr)
    const found = pathArr.find((item) => path.includes(item));
    if(found){
      return true;
    }else{
      return false;
    }
  }

}

interface TreeNode {
  id?: number;
  level:any;
  useStatus?: string;
  delStatus?: string;
  createUser?: string;
  createTime?: string;
  updateUser?: string;
  updateTime?: string;
  applicationFrom?: string;
  menuType?: string;
  icon?: string;
  sortIndex?: string;
  path?: string;
  parentId?: string;
  selected: boolean;
  code?: string;
  menuName: string;
  open?: boolean;
  roles?: string;
  children?: TreeNode[];
}

function recursionPath(obj:TreeNode[],pathArr:string[]) {
  obj.forEach(function (item) {
    pathArr.push(item.path)
    if(item.children){
      recursionPath(item.children,pathArr)
    }
  }); 
}