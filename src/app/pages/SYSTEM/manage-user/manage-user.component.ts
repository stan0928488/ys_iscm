import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { BtnCellRendererType2 } from '../../RENDERER/BtnCellRendererType2.component';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';

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
    level
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

  //normal
  rowData: IRow[] = [];
  frameworkComponents: any;
  visible = false;

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
  };

  constructor(
    private systemService : SYSTEMService
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
      }
    });
  }

  colDefs: ColDef<IRow>[] = [
    {headerName: '廠區',field: 'plant'},
    {headerName: '工號',field: 'userCode'},
    {headerName: '使用者名稱',field: 'userName'},
    {headerName: '職位',field: 'positionName'},
    {headerName: '職務代碼',field: 'positionCode'},
    {headerName: '信箱',field: 'email'},
    {headerName: '分機',field: 'landline'},
    {headerName: '狀態',field: 'useStatus'},
    {headerName: '創建時間',field: 'createTime'},
    {headerName: '操作',field: 'id',
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

}

interface IRow {
  permission:string;
  userRoles:string;
  userMenus:string;
  platform:string;
  phone:string;
  salt:string;
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
  level: string;
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
}