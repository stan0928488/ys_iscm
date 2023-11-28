import { Component, AfterViewInit, NgZone } from "@angular/core";
import { CookieService } from "src/app/services/config/cookie.service";
import { ACCService } from "src/app/services/ACC/ACC.service";
import {zh_TW ,NzI18nService} from "ng-zorro-antd/i18n"
import {NzMessageService} from "ng-zorro-antd/message"
import {NzModalService} from "ng-zorro-antd/modal"
import * as _ from "lodash";


interface ItemData1 {
  id: string;
  tab1ID: number;

}
@Component({
  selector: "app-ACC",
  templateUrl: "./ACCP100.component.html",
  styleUrls: ["./ACCP100.component.scss"],
  providers:[NzMessageService]
})
export class ACCP100component implements AfterViewInit {
  LoadingPage = false;
  isRunFCP = false; // 如為true則不可異動
  loading = false; //loaging data flag
  USERNAME;
  isSpinning = false;
  // 控制下拉式選單(產品別、鋼種、寬度): 是否可視，false:可視、true:不可視
  disable_plant = false;
  disable_deptName = false;
  disable_pnf = false;
  disable_allowroute =  false;


  // 廠區
  plant = "";
  plantlistOfOption = [];
  // 部門
  deptName = "";
  deptlistOfOption = [];
  // 職務代碼
  pnf = "";
  pnflistOfOption = [];
  // 網址清單
  route = ""
  routelistOfOption = [];
  // 已設定權限網址清單
  allowroute = ""
  allowroutelistOfOption = [];
  // 還未被設定權限的網址清單
  notallowroute = ""
  notallowroutelistOfOption = [];


  constructor(
    private ACCService: ACCService,
    private i18n: NzI18nService,
    private cookieService: CookieService,
    private message: NzMessageService,
    private Modal: NzModalService,
  ) {
    this.i18n.setLocale(zh_TW);
    this.USERNAME = this.cookieService.getCookie("USERNAME");

  }


  ngAfterViewInit() {
    console.log("ngAfterViewChecked");
    this.getplantList();
    // this.getrouteList();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 取得廠區
  getplantList() {
    this.loading = true;
    let myObj = this;
    this.ACCService.getplantACC100List().subscribe(res =>{
      console.log("getplantList success");
      let result:any = res ;
      if(result.code === 200) {
        // 變數定義
        let newres_plant = [];
        for(let i=0 ; i < result.data.length ; i++) {
          // 廠區
          console.log(result.data[i].plant);
          newres_plant.push(result.data[i].plant);
        }
        this.plantlistOfOption = newres_plant;

        // log: 檢查用
        console.log(this.plantlistOfOption)

      } else {
        this.message.error('後台錯誤，請檢查');
      }
      myObj.loading = false;
    },err => {
      this.message.error('請求獲取失敗');
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 取得部門by廠區
  getdeptList() {
    console.log(this.plant);
    this.loading = true;
    let myObj = this;
    this.ACCService.getdeptACC100List(this.plant).subscribe(res =>{
      console.log("getdeptACC100List success");

      let result:any = res ;
      console.log(result.data);
      if(result.code === 200) {
        // 變數定義
        let newres_dept = [];
        for(let i=0 ; i < result.data.length ; i++) {
          // 部門名稱
          console.log(result.data[i].deptName);
          newres_dept.push(result.data[i].deptName);
        }
        this.deptlistOfOption = newres_dept;

        // log: 檢查用
        console.log(this.deptlistOfOption)

      } else {
        this.message.error('後台錯誤，請檢查');
      }
      myObj.loading = false;
    },err => {
      this.message.error('請求獲取失敗');
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 取得職務代碼by廠區&部門
  getpnfList() {
    console.log("測試");
    console.log(this.plant);
    console.log(this.deptName);
    this.loading = true;
    let myObj = this;
    this.ACCService.getpnfACC100List(this.plant, this.deptName).subscribe(res =>{
      console.log("getpnfACC100List success");

      let result:any = res ;
      console.log(result.data);
      if(result.code === 200) {
        // 變數定義
        let newres_dept = [];
        for(let i=0 ; i < result.data.length ; i++) {
          // 職務代碼 
          // console.log(result.data[i].postNoFirst);
          // console.log(result.data[i].postDescription);
          newres_dept.push(result.data[i].postNoFirst + '/' + result.data[i].postDescription);
        }
        this.pnflistOfOption = newres_dept;

        // log: 檢查用
        console.log(this.pnflistOfOption)
        
      } else {
        this.message.error('後台錯誤，請檢查');
      }
      myObj.loading = false;
    },err => {
      this.message.error('請求獲取失敗');
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 取得已有權限的網址清單
  getallowrouteList() {
    console.log(this.pnf);
    const expnf = this.pnf.split('/')[0];
    this.loading = true;
    let myObj = this;
    this.ACCService.getAllowRouteACC100List(expnf).subscribe(res => {
      console.log("getAllowRouteACC100List success");

      let result: any = res;
      // console.log(result.data);
      if (result.code === 200) {
        // 變數定義
        let allow_route = [];
        for (let i = 0; i < result.data.length; i++) {
          allow_route.push({
            description: result.data[i].description,
            route: result.data[i].route
          });
        }
        this.allowroutelistOfOption = allow_route;  // 將資料放入 routeList 變數

        // log: 檢查用
        console.log(this.allowroutelistOfOption);

      } else {
        this.message.error('後台錯誤，請檢查');
      }
      myObj.loading = false;
    }, err => {
      this.message.error('請求獲取失敗');
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 取得全部網址清單
  getrouteList() {
    this.loading = true;
    let myObj = this;
    this.ACCService.getrouteACC101List().subscribe(res => {
      console.log("getrouteACC101List success");

      let result: any = res;
      // console.log(result.data);
      if (result.code === 200) {
        // 變數定義
        let newres_route = [];
        for (let i = 0; i < result.data.length; i++) {
          newres_route.push({
            description: result.data[i].menuId + "_" + result.data[i].routeId + "_" + result.data[i].description,
            route: result.data[i].route
          });
          
        }
        this.routelistOfOption = newres_route;  // 將資料放入 routeList 變數
        // log: 檢查用
        console.log(this.routelistOfOption);

      } else {
        this.message.error('後台錯誤，請檢查');
      }
      myObj.loading = false;
    }, err => {
      this.message.error('請求獲取失敗');
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 取得無權限的網址清單
  getnotallowrouteList() {
    console.log(this.pnf);
    const expnf = this.pnf.split('/')[0];
    this.loading = true;
    let myObj = this;
    this.ACCService.getNotAllowRouteACC101List(expnf).subscribe(res => {
      console.log("getNotAllowRouteACC101List success");

      let result: any = res;
      // console.log(result.data);
      if (result.code === 200) {
        // 變數定義
        let newres_route = [];
        for (let i = 0; i < result.data.length; i++) {
          newres_route.push({
            description: result.data[i].menuId + "_" + result.data[i].routeId + "_" + result.data[i].description,
            route: result.data[i].route
          });
        }
        this.notallowroutelistOfOption = newres_route;  // 將資料放入 routeList 變數
        // log: 檢查用
        console.log(this.notallowroutelistOfOption);

      } else {
        this.message.error('後台錯誤，請檢查');
      }
      myObj.loading = false;
    }, err => {
      this.message.error('請求獲取失敗');
    });
  }


  //////////////////////////////////////////////////////

  // routeList = this.getrouteList();

  // selectedRoutes = this.allowroutelistOfOption;

  toggleSelection2(route: Route, isFromLeft: boolean): void {
    const indexInSelected = this.allowroutelistOfOption.findIndex(r => r === route);
    const indexInOption = this.notallowroutelistOfOption.findIndex(r => r === route);
  
    if (isFromLeft) {
      if (indexInSelected > -1) {
        this.allowroutelistOfOption.splice(indexInSelected, 1);
      } else {
        this.notallowroutelistOfOption.splice(indexInOption, 1);
        this.allowroutelistOfOption.push(route);
      }
    } else {
      if (indexInOption > -1) {
        this.notallowroutelistOfOption.splice(indexInOption, 1);
      } else {
        this.allowroutelistOfOption.splice(indexInSelected, 1);
        this.notallowroutelistOfOption.push(route);
      }
    }
    // // 在每次操作后进行排序
    this.sortRouteLists();
  }


  // toggleSelection(route: Route, isFromLeft: boolean): void {
  //   const indexInSelected = this.selectedRoutes.findIndex(r => r === route);
  //   const indexInOption = this.routelistOfOption.findIndex(r => r === route);
  
  //   if (isFromLeft) {
  //     if (indexInSelected > -1) {
  //       this.selectedRoutes.splice(indexInSelected, 1);
  //     } else {
  //       this.routelistOfOption.splice(indexInOption, 1);
  //       this.selectedRoutes.push(route);
  //     }
  //   } else {
  //     if (indexInOption > -1) {
  //       this.routelistOfOption.splice(indexInOption, 1);
  //     } else {
  //       this.selectedRoutes.splice(indexInSelected, 1);
  //       this.routelistOfOption.push(route);
  //     }
  //   }
  //   // 在每次操作后进行排序
  //   this.sortRouteLists();
  // }

  sortRouteLists(): void {
    this.notallowroutelistOfOption.sort((a, b) => a.description.localeCompare(b.description));
    this.allowroutelistOfOption.sort((a, b) => a.description.localeCompare(b.description));
  }


  isSelected(route: Route): boolean {
    return this.allowroutelistOfOption.includes(route);
  }

  // 儲存選擇的網址
  saveSelection() {
    console.log(this.plant);
    console.log(this.deptName);
    console.log(this.pnf);
    console.log(this.allowroutelistOfOption);

    // 防呆檢查
    let myObj = this;
    if (this.plant === "" || this.plant === null) {
      myObj.message.create("error", "請選擇「廠區」");
      return;
    }
    else if (this.deptName === "" && this.deptName === "") {
      myObj.message.create("error", "請選擇「部門」");
      return;
    }
    else if (this.pnf === "" || this.pnf === "") {
      myObj.message.create("error", "請選擇「職務代碼」");
      return;
    }

    // 创建一个临时数组，用于存储选中的 route.description
    const selectedDercription = [];
    // 遍历 selectedRoutes 数组，将选中的 route.description 添加到临时数组中
    for (const route of this.allowroutelistOfOption) {
      selectedDercription.push(route.description);
    }

    // 创建一个临时数组，用于存储选中的 route.route
    const selectedRouteRouters = [];
    // 遍历 selectedRoutes 数组，将选中的 route.route 添加到临时数组中
    for (const route of this.allowroutelistOfOption) {
      selectedRouteRouters.push(route.route);
    }
    // 取出/前面的職務代碼
    const extractedPostNoFirst = this.pnf.split('/')[0];

    // 組成新data
    const data = {
      plant: this.plant,
      deptName: this.deptName,
      postNoFirst: extractedPostNoFirst,
      description: selectedDercription,
      selectedRoutes: selectedRouteRouters
    };

    console.log("檢查輸出項");
    console.log(data);

    this.ACCService.saveselectedACC101List(data).subscribe(res =>{
      console.log("saveselectedACC101List success");
      this.message.create('success', '權限設定成功'); 

    }, err => {
      this.message.error('請求獲取失敗');
    });
  }

  // 在点击按钮后将左侧数据全部移到右侧
  moveAllToRight() {
    // 将左侧所有数据添加到右侧
    this.allowroutelistOfOption.push(...this.notallowroutelistOfOption);
    // 清空左侧数据
    this.notallowroutelistOfOption = [];
    // 在每次操作后进行排序
    this.sortRouteLists();
  }

  // 在点击按钮后将左侧数据全部移到左侧
  moveAllToLeft() {
    // 将右侧所有数据添加到左侧
    this.notallowroutelistOfOption.push(...this.allowroutelistOfOption);
    // 清空右侧数据
    this.allowroutelistOfOption = [];
    // 在每次操作后进行排序
    this.sortRouteLists();
  }

  // 查詢權限清單
  searchrouteList() {
    // 選擇職務代碼後，帶出已儲存的權限
    console.log('查詢權限')
    this.getallowrouteList();
    this.getnotallowrouteList();
  }

}

interface Route {
  description: string;
  route: string;
}
  