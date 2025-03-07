import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component } from '@angular/core';
import { ColDef, Column, ColumnEvent } from 'ag-grid-community';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import { BtnCellRendererType2 } from '../../RENDERER/BtnCellRendererType2.component';
import {NzMessageService} from "ng-zorro-antd/message";
import {AGHeaderCommonParams, AGHeaderParams} from "../../../shared/ag-component/types"
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements AfterViewInit {

  //tree
  private transformer = (node: TreeNode, level: number): FlatNode => ({
    open: !!node.children && node.children.length > 0,
    menuName: node.menuName,
    level,
    icon : node.icon,
    path: node.path,
    node : node
  });

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.open
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.open,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  showLeafIcon = false;
  hasChild = (_: number, node: FlatNode): boolean => node.open;
  TREE_DATA: TreeNode[] = [];
  isExpandAll = false;

  //normal
  rowData: IRow[] = [];
  frameworkComponents: any;
  visible = false;

  agCustomHeaderCommonParams : AGHeaderCommonParams = {agName: 'AGName1' , isSave:true ,path: this.router.url  }
  agCustomHeaderParams : AGHeaderParams = {isMenuShow: true,}
  gridOptions = {
    defaultColDef: {
      editable: true,
      enableRowGroup: false,
      enablePivot: false,
      enableValue: false,
      sortable: false,
      resizable: true,
      filter: true,
    },
    api: null,
    agCustomHeaderParams : {
      agName: 'AGName1' , // AG 表名
      isSave:true ,
      path: this.router.url ,
     },
  };

  constructor(
    private message: NzMessageService,
    private systemService : SYSTEMService,
    private router: Router,
  ) {
    this.dataSource.setData(this.TREE_DATA);
    this.frameworkComponents = {
      buttonRenderer: BtnCellRendererType2,
    };
  }

  ngAfterViewInit(): void {
    this.treeControl.expandAll();
  }

  ngOnInit(): void {
    this.systemService.getAllUserInfo().subscribe((res) => {
      let result:any = res;
      if(result.code == 200){
        this.rowData = result.data;
      } else {
        this.message.create("error", result.message);
      }
    });
    this.getDbCloumn();
  }

  expend(node){
    console.log(node)
    if(node.node.children && node.node.children.find(x => x.menuType == 'C')){
      this.treeControl.toggle(node)
    }else{
      this.router.navigateByUrl(node.path);
    }
  }

   //調用DB欄位
   getDbCloumn(){
    this.systemService.getHeaderComponentStatus(this.agCustomHeaderCommonParams).subscribe(res=>{
      let result:any = res ;
      if(result.code === 200) {
        console.log(result) ;
        if (result.data.length > 0) {
          //拿到DB數據 ，複製到靜態數據
          this.colDefs.forEach((item)=>{
            result.data.forEach((it) => {
               if(item.field === it.colId) {
                 item.width = it.width;
                 item.hide = it.hide ;
                 item.resizable = it.resizable;
                 item.sortable = it.sortable ;
                 item.filter = it.filter ;
                 item.sortIndex = it.sortIndex ;
               }
            })
          })
          this.colDefs.sort((a, b) => (a.sortIndex < b.sortIndex ? -1 : 1));
          console.log()
          this.gridOptions.api.setColumnDefs(this.colDefs) ;   
        }
      } else {
        this.message.error("load error")
      }
    });
  }

  colDefs: ColDef<IRow>[] = [
    {headerName: '廠區',field: 'plant', width:120, headerComponent : AGCustomHeaderComponent,
    headerComponentParams:this.agCustomHeaderParams},
    {headerName: '工號',field: 'userCode', width:120, headerComponent : AGCustomHeaderComponent},
    {headerName: '使用者名稱',field: 'userNickName', width:120, headerComponent : AGCustomHeaderComponent},
    {headerName: '職位',field: 'positionName', width:200, headerComponent : AGCustomHeaderComponent},
    {headerName: '職務代碼',field: 'positionCode', width:150, headerComponent : AGCustomHeaderComponent},
    {headerName: '信箱',field: 'email', width:200, headerComponent : AGCustomHeaderComponent},
    {headerName: '分機',field: 'landline', width:120, headerComponent : AGCustomHeaderComponent},
    {headerName: '狀態',field: 'useStatus', width:100, headerComponent : AGCustomHeaderComponent},
    {headerName: '創建時間',field: 'createTime', width:200, headerComponent : AGCustomHeaderComponent},
    {headerName: '操作',field: 'id', width:150, 
        cellRenderer: 'buttonRenderer',
        cellRendererParams: [
        {
          context:"查看權限",
          onClick: this.onBtnClick1.bind(this),
        }  
    ]}
  ];

  onBtnClick1(e) {
    this.systemService.getMenuByUserPosition({
      "positionCode": e.rowData.positionCode
    }).subscribe((res) => {
      let result:any = res;
      if(result.code == 200){
        this.TREE_DATA = result.data;
        this.dataSource.setData(this.TREE_DATA);
      } else {
        this.message.create("error", result.message);
      }
    });
    this.open();
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  getNode(menuName: string): FlatNode | null {
    return this.treeControl.dataNodes.find(n => n.menuName === menuName) || null;
  }

  expandAll(){
    this.isExpandAll = !this.isExpandAll;
    if(this.isExpandAll){
      // 使用setTimeout讓expandAll在Spinning出現之後才執行
      setTimeout(() => {
        this.treeControl.expandAll();
      },0);
    }
    else{
      // 使用setTimeout讓collapseAll在Spinning出現之後才執行
      setTimeout(() => {
        this.treeControl.collapseAll();
      },0);
    }
  }

}

interface IRow {
  permission:string;
  userRoles:string;
  userMenus:string;
  platform:string;
  phone:string;
  // salt:string;
  userAvatar:string;
  userNickName:string;
  applicationFrom:string;
  updateTime:string;
  updateUser:string;
  createUser:string;
  delStatus:string;
  plant: string;
  userCode: string;
  userName: string;
  positionName: string;
  positionCode: string;
  email: string;
  landline: string;
  useStatus: string;
  createTime: string;
  id: number;
}

interface TreeNode {
  id: number;
  useStatus: string;
  delStatus: string;
  createUser: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  applicationFrom: string;
  menuType: string;
  icon: string;
  sortIndex: string;
  level: string|number;
  path: string;
  parentId: string;
  selected: boolean;
  code: string;
  menuName: string;
  open: boolean;
  roles: string;
  children?: TreeNode[];
}

interface FlatNode {
  open: boolean;
  menuName: string;
  level: number;
  icon: string;
  path: string;
  node: TreeNode;
}
