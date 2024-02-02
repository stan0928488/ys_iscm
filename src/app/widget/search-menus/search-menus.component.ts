import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, NgZone, Input, SimpleChange } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { Router } from "@angular/router";
import { map, fromEvent, of } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import * as _ from "lodash";
import { NzModalService } from "ng-zorro-antd/modal";
import { SYSTEMService } from "src/app/services/SYSTEM/SYSTEM.service";
import { DestroyService } from 'src/app/services/common/destory.service';


const passiveEventListenerOptions = <AddEventListenerOptions>normalizePassiveListenerOptions({ passive: true });

@Component({
  selector: 'app-search-menus',
  templateUrl: './search-menus.component.html',
  styleUrls: ['./search-menus.component.css'],
  providers: [DestroyService]
})


export class SearchMenusComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isVisible: boolean = false; 
  
  userName = "";
  menus: TreeNode[] = [];

  @ViewChild("trigger") customTrigger: TemplateRef<void>;
  @ViewChild("menuElement") menuElement: ElementRef;

  // 菜單搜索
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @HostListener('document:keyup', ['$event'])
  @HostListener('document:click', ['$event'])
  @HostListener('document:wheel', ['$event'])

  resultListShow: ResultItem[] = [];
  resultList: ResultItem[] = [];
  inputValue: string | null = null;

  constructor(
    private cookieService: CookieService,
    private systemService : SYSTEMService,
    private nzModalService: NzModalService,
    public router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) {
    this.userName = this.cookieService.getCookie("USERNAME");
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    // 在這裡進行清理操作，例如取消訂閱或釋放資源
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    //刷新菜單要重撈
    if(this.userName){
      this.systemService.getCurrentUserMenu().subscribe((res) => {
        let result:any = res;
        if(result.code == 200){
          this.menus = result.data;
          recursionSet(this.menus,1);
        }else{
          this.nzModalService.error({
            nzTitle: '獲取菜單失敗',
            nzContent: result.message,
          });
        }
      });
    }else{
      this.menus = [];
    }

    this.resultListFactory();
    
  }



  ngAfterViewInit(): void {
    if (this.isVisible) {
      setTimeout(() => {
        this.subSearchFn();
      });
    }
    
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
    if (changes['isVisible']) {
    }
  }

  // 菜單搜索
  changeSelAnswerIndex(dir: 'up' | 'down'): number | null {
    const index = this.resultListShow.findIndex(item => item.selItem);
    if (index > -1) {
      // 向上
      if (dir === 'up') {
        if (index === 0) {
          return this.resultListShow.length - 1;
        } else {
          return index - 1;
        }
      } else {
        if (index === this.resultListShow.length - 1) {
          return 0;
        } else {
          return index + 1;
        }
      }
    } else {
      return null;
    }
  }

  @HostListener('window:keyup.enter')
  onEnterUp() {
    const index = this.resultListShow.findIndex(item => item.selItem);
    if (index > -1) {
      this.resultClick(this.resultListShow[index]);
    }
  }

  @HostListener('window:keyup.arrowUp')
  onArrowUp() {
    const index = this.changeSelAnswerIndex('up');
    if (index !== null) {
      this.mouseOverItem(this.resultListShow[index]);
    }
  }

  @HostListener('window:keyup.arrowDown')
  onArrowDown() {
    const index = this.changeSelAnswerIndex('down');
    if (index !== null) {
      this.mouseOverItem(this.resultListShow[index]);
    }
  }

  resultClick(resultItem: ResultItem): void {
    this.router.navigate([resultItem.routePath]);
    this.isVisible = true;
  }

  getResultItem(menu: TreeNode, fatherTitle: string = ''): ResultItem[] {
    const fatherTitleTemp = fatherTitle === '' ? menu.menuName : `${fatherTitle} > ${menu.menuName}`;
    let resultItem: ResultItem = {
      title: fatherTitleTemp,
      routePath: menu.path!,
      selItem: false,
      isAliIcon: !!menu.icon,
      icon: menu.icon! || menu.icon!
    };
    if (menu.children && menu.children.length > 0) {
      let resultArrayTemp: ResultItem[] = [];
      menu.children.forEach(menuChild => {
        resultArrayTemp = [...resultArrayTemp, ...this.getResultItem(menuChild, fatherTitleTemp)];
      });
      return resultArrayTemp;
    } else {
      return [resultItem];
    }
  }
  
  mouseOverItem(item: ResultItem): void {
    this.resultListShow.forEach(resultItem => {
      resultItem.selItem = false;
    });
    item.selItem = true;
  }

  resultListFactory(): void {
    let temp: ResultItem[] = [];
    this.menus.forEach(item => {
      temp = [...temp, ...this.getResultItem(item)];
    });
    this.resultList = temp;
  }

  showSearchModal() {
    this.isVisible = true;
    this.subSearchFn();
  }
  
  searchMenuCancel() {
    this.isVisible = false;
  }

  
  clearInput(): void {
    this.inputValue = '';
    this.resultListShow = [];
    this.cdr.markForCheck();
  }

  subSearchFn(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(this.searchInput.nativeElement, 'input', passiveEventListenerOptions)
        .pipe(
          map(e => (e.target as HTMLInputElement).value),
          debounceTime(500),
          distinctUntilChanged(),
          switchMap(item => {
            return of(item);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(res => {
          this.resultListShow = [];
          this.resultList.forEach(item => {
            if (item.title.includes(res)) {
              this.resultListShow.push(item);
            }
          });
          if (this.resultListShow.length > 0) {
            this.resultListShow[0].selItem = true;
          }
          this.resultListShow = [...this.resultListShow];
          // 清空搜索条件时将结果集置空
          if (!res) {
            this.resultListShow = [];
          }
          this.ngZone.run(() => {
            this.cdr.markForCheck();
          });
      });
    });
  }

}

interface ResultItem {
  selItem: boolean;
  isAliIcon: boolean;
  title: string;
  routePath: string;
  icon: string;
}

interface TreeNode {
  isShow?:number;
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

function recursionSet(obj:TreeNode[],parentLevel:any) {
  obj.forEach(function (item) {
    if(item.parentId){
      item.level = parentLevel + 1;
    }else{
      item.level = 1;
    }
    if(item.children){
      recursionSet(item.children,item.level)
    }
  }); 
}
