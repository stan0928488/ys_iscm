import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CookieService } from "../services/config/cookie.service";
import { AuthService } from "../services/auth/auth.service";
import { Router, ActivatedRoute, NavigationEnd, ChildActivationEnd } from "@angular/router";
import { Subscription, filter, map, mergeMap } from "rxjs";

import * as _ from "lodash";
import * as moment from "moment";
import { NzHeaderComponent } from "ng-zorro-antd/layout";
import { MainEventBusComponent } from "./main-event-bus.component";
import { SYSTEMService } from "../services/SYSTEM/SYSTEM.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { TabModel, TabService } from "../services/common/tab.service";
import * as uuid from 'uuid';
import { SearchMenusComponent } from '../widget/search-menus/search-menus.component';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {

  title = "YS_iSCM";
  isCollapsed = true;
  triggerTemplate = null;

  navClass = "";
  userName;
  plantCode;
  envName;
  envInfoClass = "";
  envMenuClass = "";
  logoImagePath = "../assets/images/headlogo.png";
  logoBackgroundColor = '#da6c72';

  menus: TreeNode[] = [];

  @ViewChild("trigger") customTrigger: TemplateRef<void>;
  resetTimer() {
    this.authService.notifyUserLoginAction();
  }

  @ViewChild('headerElement', { static: true }) headerElement: NzHeaderComponent;
  @ViewChild("menuElement") menuElement: ElementRef;

  // 菜單搜尋開啟
  isVisible: boolean = false; 
  @ViewChild(SearchMenusComponent) searchMenusComponent: SearchMenusComponent;


   // 渲染tab元件的資料
   tabsSourceData: TabModel[] = [];
   // 使用者當前點選的頁面的路徑
   routerPath = this.router.url;
   // 當前哪個tab被選中
   activeTabIndex = null;
   // 路由事件監聽(哪個頁面被點擊)
   routerEventsSubscription : Subscription = null; 
   

  constructor(
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService,
    private mainEventBusComponent: MainEventBusComponent,
    private systemService : SYSTEMService,
    private nzModalService: NzModalService,
    private activatedRoute: ActivatedRoute,
    private tabService: TabService
  ) {
    this.isLatestVersion();
    const hostName = window.location.hostname;
    if (_.startsWith(hostName, "ys-webapp")) {
      if (window.location.protocol != "https:") {
        location.href = location.href.replace("http://", "https://");
      }
    }
    this.getEnvClass();
    this.userName = this.cookieService.getCookie("USERNAME");
    this.plantCode = this.cookieService.getCookie("plantCode");
    this.envName = this.getEnvName(hostName);

    // 取消對路由導航的監聽處理
    if(_.isNil(this.routerEventsSubscription)){
      // 分頁渲染處理
      this.tabHandler();
    }
  }

  ngOnInit(): void {
    let logTime = localStorage.getItem('logTime');
    if(logTime){
      let today = new Date().getTime();
      let diffMs = (today - Number(logTime));
      let second_diff = diffMs/1000; 
      //3秒內視為刷新
      if(second_diff <= 3){
        localStorage.removeItem('logTime');
        console.log("刷新")
      }else{
        //localStorage.removeItem('logTime');
        //this.authService.authLogOut();
        //console.log("視窗關閉")
      }
    }

    //刷新菜單要重撈
    if(this.userName){
      this.systemService.getCurrentUserMenu().subscribe((res) => {
        let result:any = res;
        if(result.code == 200){
          this.menus = result.data;
          recursionSet(this.menus,1);
          this.mainEventBusComponent.logingObjAdd(this.menus);
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

    this.mainEventBusComponent.on('logingSuccess', (data: any) => {
      if (data.data.logingSuccess) {
        this.systemService.getCurrentUserMenu().subscribe((res) => {
          let result:any = res;
          if(result.code == 200){
            this.menus = result.data;
            recursionSet(this.menus,1);
            this.mainEventBusComponent.logingObjAdd(this.menus);
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
    });
    
  }

  nzOpenChange(menu:TreeNode){
    let ids = [];
    ids.push(menu.id);
    let findparentId = menu.parentId;
    if(findparentId){
      ids.push(findparentId);
    }
    let findparent = menu;
    if(findparent.parentId){
      findparent = recursionColletTop(findparent.parentId,this.menus);
      if(findparent){
        ids.push(findparent.id);
        ids.push(findparent.parentId);
      }
    }
    if(findparent.parentId){
      findparent = recursionColletTop(findparent.parentId,this.menus);
      if(findparent){
        ids.push(findparent.id);
        ids.push(findparent.parentId);
      }
    }
    if(findparent.parentId){
      findparent = recursionColletTop(findparent.parentId,this.menus);
      if(findparent){
        ids.push(findparent.id);
        ids.push(findparent.parentId);
      }
    }
    if(findparent.parentId){
      findparent = recursionColletTop(findparent.parentId,this.menus);
      if(findparent){
        ids.push(findparent.id);
        ids.push(findparent.parentId);
      }
    }
    recursionToggle(this.menus,ids);
    
  }

  ngOnDestroy(): void {
    this.mainEventBusComponent.unsubscribe();

    // 取消對路由導航的監聽處理訂閱
    if(!_.isNil(this.routerEventsSubscription)){
      this.routerEventsSubscription.unsubscribe();
    }

    // 清空動態顯示的分頁
    this.tabsSourceData = [];
    this.tabService.clearTabDataList();
     
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    localStorage.setItem('logTime', new Date().getTime().toString())
  }


  ngAfterViewInit(): void {
    this.headerBarHandler();
  }

  // 當前正在瀏覽的分頁
  isCurrentViewTabClose : boolean = null;
  // 當前被關閉的分頁的索引
  currentViewTabIndex : number = null;
  tabHandler(): void {

    this.tabService.getTabDataList$().subscribe(res => {

       // 如果是關閉分頁，頁面顯示區塊需顯示最後一個存在的頁面
       if(res.isClose){

          // 響應被動取得當前剩下的tab
          this.tabsSourceData = res.tabArray;

          // 當前正在瀏覽的頁面被關閉(已不存在在tabsSourceData裡了)
          // 則需要導航到下一個tab
          if(this.isCurrentViewTabClose){
            // tab中中間的tab被關閉，導航到它右方的tab
            if(this.tabsSourceData.length-1 >= this.currentViewTabIndex){
              this.goPage(this.tabsSourceData[this.currentViewTabIndex]);
            }
            // tab中排在最後一個的tab被關閉，導航到剩下的最後一個tab
            else{
              this.goPage(this.tabsSourceData[this.tabsSourceData.length - 1]);
            }
            return;
          }
       }
       // 使用者點開頁面產生新tab
       else{  
          // 響應被動取得當前剩下的tab
          this.tabsSourceData = res.tabArray;

          // tab選中的效果移到最新一個開啟的tab
          if(this.tabsSourceData !== undefined) {
            this.activeTabIndex = this.tabsSourceData.length-1;
          }
       }
       
    });

    this.routerEventsSubscription = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd || event instanceof ChildActivationEnd ),
      map(() => {
        this.routerPath = this.activatedRoute.snapshot['_routerState'].url;
        return this.activatedRoute;
      }),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => {
        return route.outlet === 'primary';
      }),
      mergeMap(route => {
        return route.data;
      })
    ).subscribe(routeData => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }     
      
      // 路由相關資訊
      let snapshot = route.snapshot;

      // 該路由頁面名稱
      let pageName = routeData['pageName'];
      // 該路由頁面路徑
      let pagePath = this.routerPath  

      // 若A分頁已開啟，再從側邊欄點選A分頁
      // A分頁頁簽呈現被選擇的狀態
      let existTabIdx = _.findIndex(this.tabsSourceData, item => { 
        return item.pageName === pageName 
      });

      // 已存在該分頁，將該分頁頁簽呈現被選擇的狀態
      if(existTabIdx !== -1){
        this.activeTabIndex = existTabIdx;
        return;
      }

      if(!_.isEqual(pagePath, '/login') && !_.isEqual(pagePath, '/AccessDined') && !_.isEmpty(routeData)){
        this.tabService.setTabDataList$(
          {
            uuid : uuid.v4(),
            pageName : pageName,
            pagePath : pagePath
          }
        )
      }

    });
  }

  closeTab({ index } : { index: number }){

    let tabIdx = Number(index);

    // 是否是當前正在瀏覽的頁面被關閉
    this.isCurrentViewTabClose = this.activeTabIndex === tabIdx;
    // 當前被關閉的分頁的索引
    this.currentViewTabIndex = tabIdx;
  
    this.tabService.closeTab(this.tabsSourceData[tabIdx]);
  }

  goPage(tab : TabModel){
    // 導航到獲取被點擊的tab的頁面
    this.router.navigate([tab.pagePath]);
  }
  

  headerBarHandler(){

    if(_.isNil(this.headerElement)){
      return;
    }

    const nativeHeaderElement = this.headerElement.elementRef.nativeElement
    const nativeMenuElement = this.menuElement.nativeElement;
    let backgroundColor = '#6c9dd5';
    if(this.envName === "正式環境"){
      backgroundColor = '#6c9dd5'
    }
    else if(this.envName === "測試環境"){
      backgroundColor = '#df878c';
    }
    else if (this.envName === "本機環境"){
      // backgroundColor = '#df878c'
      backgroundColor = '#96a6b5';
    }
    nativeHeaderElement.style.backgroundColor = backgroundColor; 
    nativeHeaderElement.style.padding = '0 0';
    nativeHeaderElement.style.position = 'sticky';
    nativeHeaderElement.style.left = '0';
    // nativeHeaderElement.style.top = '0';
    nativeHeaderElement.style.zIndex = '1';

    // nativeMenuElement.style.backgroundColor = 'white';
    nativeMenuElement.style.color = 'black';
    // nativeMenuElement.style.display = 'inline';

  }

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    console.log("==>changeTrigger");
    this.triggerTemplate = this.customTrigger;
  }

  //檢查是否是最新版本
  isLatestVersion() {
    const dateID = "check_YS_iSCM_Date";
    const checkDate = localStorage.getItem(dateID);
    console.log("checkDate");
    console.log(checkDate);
    if (
      checkDate === undefined ||
      checkDate !== moment().format("YYYY.MM.DD")
    ) {
      localStorage.setItem(dateID, moment().format("YYYY.MM.DD"));
      console.log("hard reload to update");
      // window.location.reload(true);
    } else {
      //good to go
      console.log("good to go");
    }
  }

  getEnvClass() {
    const hostName = window.location.hostname;
    let className = "navBar ";
    let envInfo = "";
    let envMenu = "";
    let bgColor = "";
    switch (hostName) {
      case "ys-ppsapp01.walsin.corp":
        className += " nav-bar-prod";
        envInfo = "info info-prod";
        envMenu = "menu menu-prod";
        bgColor = '#6c9dd5';
        break;
      case "localhost":
        className += " nav-bar-local";
        envInfo = "info info-local";
        envMenu = "menu menu-local"
        // bgColor = '#df878c';
        bgColor = '#96a6b5';
        break;
      default:
        className += " nav-bar-tst";
        envInfo = "info info-tst";
        envMenu = "menu menu-tst";
        bgColor = '#df878c';
    }

    this.navClass = className;
    this.envInfoClass = envInfo;
    this.envMenuClass = envMenu;
    this.logoBackgroundColor = bgColor;

    // Set the value of the CSS variable
    document.documentElement.style.setProperty('--logo-background-color', bgColor);
  }
  
  onLogout() {
    console.log("onLogout");
    this.cookieService.setCookie("USERNAME", "", 1);
    this.cookieService.setCookie("plantCode", "", 1);
    this.userName = "";
    this.plantCode = "";
    // 清空分頁
    this.tabsSourceData = [];
    this.tabService.clearTabDataList();
    this.router.navigate(["login"]);

  }

  componentAdded(_event) {}

  componentRemoved(_event) {
    this.userName = this.cookieService.getCookie("USERNAME");
    this.plantCode = this.cookieService.getCookie("plantCode");
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.logoImagePath = this.isCollapsed ? '../assets/images/headlogo.png' : '../assets/images/logo.png';
  }

  
  getEnvName(_name){
    let env;
    switch (_name) {
      case "ys-pps.walsin.corp":
        env = "驗證環境";
        break;
      case "ys-ppsapp01.walsin.corp":
        env = "正式環境";
        break;
      case "localhost":
        env = "本機環境";
        break;
      default:
        env = "測試環境";
    }

    return env;
  }

  // 日期相差
  dayDiff(d1:Date, d2:Date) {
    var diff = Math.abs(d2.getTime() - d1.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return diffDays;
  }

  // 日期轉換
  dateFormat(_dateString, _flag) {
    if (_dateString == undefined || _dateString == '' || _dateString == null) {
      return "";
    } else {
      if (_flag == '1') {
        let date = moment(_dateString, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        return date;
      } else if (_flag == '2') {
        let date = moment(_dateString, "YYYY-MM-DD").format("YYYY-MM-DD");
        return date;
      } else if (_flag == '3') {
        let date = moment(_dateString, "HH:mm:ss").format("HH:mm:ss");
        return date;
      } else if (_flag == '4') {
        let date = moment(_dateString, "HH:mm").format("HH:mm");
        return date;
      } else if (_flag == '5') {
        let date = moment(_dateString, "MM").format("MM");
        return date;
      } else if (_flag == '6') {
        let date = moment(_dateString, "YYYY-MM").format("YYYY-MM");
        return date;
      } else if (_flag == '7') {
        let date = moment(_dateString, "YYYYMMDDHHmmss").format("YYYYMMDDHHmmss");
        return date;
      } else if (_flag == '8') {
        let date = moment(_dateString, "MM-DD").format("MM-DD");
        return date;
      } 
    }
  }

  //日期物件format
  dateObjFormat(_date, _flag) {
    if (_date) {
      if (_flag == '1') {
        let date = moment(_date).format("YYYY/MM/DD HH:mm:ss");
        return date;
      } else if (_flag == '2') {
        let date = moment(_date).format("YYYY/MM/DD");
        return date;
      } else if (_flag == '3') {
        let date = moment(_date).format("HH:mm:ss");
        return date;
      } else if (_flag == '4') {
        let date = moment(_date).format("HH:mm");
        return date;
      } else if (_flag == '5') {
        let date = moment(_date).format("MM");
        return date;
      } else if (_flag == '6') {
        let date = moment(_date).format("YYYY/MM");
        return date;
      } else if (_flag == '7') {
        let date = moment(_date).format("YYYYMMDDHHmmss");
        return date;
      } else if (_flag == '8') {
        let date = moment(_date).format("MM/DD");
        return date;
      } 
    }
  }

  //pipe 數字3位一撇 (數值, 小數點幾位)
  toThousandNumber(param, point) {
    const paramStr = param.toFixed(point).toString();
    if (paramStr.length > 3) {
      return paramStr.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    if (param === 0) {
      return '　';
    }
    return paramStr;
  }

  // date 轉換
  dateStringFormat(dateString) {
    if(dateString !== undefined) {
      const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      const parts = dateString.split(' ');
      const month = months.indexOf(parts[0]) + 1;
      const day = parseInt(parts[1].replace(',', ''));
      const year = parseInt(parts[2]);
      const isoDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return isoDateString;
    }
    return '';
  }

  showSearchModal() {
    this.isVisible = true;
    let newMenu = [];

    const filterMenus = (menus) => {
      return menus.filter(menu => {
        if (menu.isShow !== "0") {
          const filteredChildren = filterMenus(menu.children);
          if (filteredChildren.length > 0) {
            menu.children = filteredChildren;
          }
          newMenu.push(menu);
          return true;
        }
        return false;
      });
    };
  
    filterMenus(this.menus);

    if (this.searchMenusComponent) {
      this.searchMenusComponent.isVisible = this.isVisible;
      this.searchMenusComponent.resultListFactory(newMenu);
      this.searchMenusComponent.ngAfterViewInit();
    }
  }
  



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

function recursionToggle(obj:TreeNode[],ids:any[]) {
  obj.forEach(function (item) {
    let find = ids.find(x => x == item.id)
    if(find){
      item.open = true;
    }else{
      item.open = false;
    }
    if(item.children){
      recursionToggle(item.children,ids)
    }
  }); 
}

function recursionColletTop(parentId:any,obj:TreeNode[]) : TreeNode {

  if(parentId && obj){
    let find = obj.find(x => x.id == parentId);
    if(find){
      return find;
    }else{
      obj.forEach(x => {
        recursionColletTop(parentId,x.children)
      })
    }
  }else{
    return null;
  }

}