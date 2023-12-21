import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { BtnCellRendererType2 } from '../../RENDERER/BtnCellRendererType2.component';

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

  //normal
  frameworkComponents: any;
  visible = false;

  constructor() {
    this.dataSource.setData(TREE_DATA);
    this.frameworkComponents = {
      buttonRenderer: BtnCellRendererType2,
    };
  }

  ngAfterViewInit(): void {
    this.treeControl.expandAll();
  }

  ngOnInit(): void {
  }

  rowData: IRow[] = [
    {
      "id": 1,
      "useStatus": "Y",
      "delStatus": "0",
      "createUser": null,
      "createTime": "2023-12-08 11:02:51",
      "updateUser": null,
      "updateTime": "2023-12-19 13:25:48",
      "applicationFrom": "PPS001",
      "userCode": "UR11550",
      "userName": "UR11550",
      "userNickName": "Jane",
      "userAvatar": "彥敏",
      "salt": null,
      "email": null,
      "phone": null,
      "landline": null,
      "platform": null,
      "positionName": "軟體工程師",
      "positionCode": "O1IM01B600",
      "plant": "鹽水廠",
      "userMenus": null,
      "userRoles": null,
      "permission": null
    },
    {
      "id": 2,
      "useStatus": "Y",
      "delStatus": "0",
      "createUser": null,
      "createTime": "2023-12-20 14:09:41",
      "updateUser": null,
      "updateTime": "2023-12-20 14:09:41",
      "applicationFrom": "PPS001",
      "userCode": "UR10369",
      "userName": "UR10369",
      "userNickName": "張倩雯",
      "userAvatar": null,
      "salt": null,
      "email": null,
      "phone": null,
      "landline": null,
      "platform": null,
      "positionName": "軟體工程師",
      "positionCode": "O1IM01B600",
      "plant": null,
      "userMenus": null,
      "userRoles": null,
      "permission": null
    }
  ];

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


const TREE_DATA: TreeNode[] = [
  {
    "id": 3,
    "useStatus": "Y",
    "delStatus": "0",
    "createUser": null,
    "createTime": "2023-12-19 16:50:24",
    "updateUser": null,
    "updateTime": "2023-12-19 16:51:33",
    "applicationFrom": "PPS001",
    "menuName": "係統管理",
    "menuType": "C",
    "icon": null,
    "sortIndex": "1",
    "level": "1",
    "path": "/system/admin",
    "parentId": null,
    "selected": false,
    "open": false,
    "code": "",
    "children": [
      {
        "id": 4,
        "useStatus": "Y",
        "delStatus": "0",
        "createUser": null,
        "createTime": "2023-12-19 16:59:09",
        "updateUser": null,
        "updateTime": "2023-12-19 16:59:09",
        "applicationFrom": "PPS001",
        "menuName": "菜單功能管理",
        "menuType": "C",
        "icon": null,
        "sortIndex": "1",
        "level": "2",
        "path": "/system/admin/menuManager",
        "parentId": "3",
        "selected": false,
        "open": false,
        "code": "",
        "children": [
          {
            "id": 6,
            "useStatus": "Y",
            "delStatus": "0",
            "createUser": null,
            "createTime": "2023-12-19 17:03:31",
            "updateUser": null,
            "updateTime": "2023-12-19 17:03:31",
            "applicationFrom": "PPS001",
            "menuName": "保存",
            "menuType": "F",
            "icon": null,
            "sortIndex": null,
            "level": null,
            "path": "/system/menu/saveMenuFunction",
            "parentId": "4",
            "selected": false,
            "open": false,
            "code": "",
            "children": [],
            "roles": null
          },
          {
            "id": 7,
            "useStatus": "Y",
            "delStatus": "0",
            "createUser": null,
            "createTime": "2023-12-19 17:05:25",
            "updateUser": null,
            "updateTime": "2023-12-19 17:05:25",
            "applicationFrom": "PPS001",
            "menuName": "查詢",
            "menuType": "F",
            "icon": null,
            "sortIndex": null,
            "level": null,
            "path": "/system/menu/getAllMenuFunctionAuth",
            "parentId": "4",
            "selected": false,
            "open": false,
            "code": "",
            "children": [],
            "roles": null
          }
        ],
        "roles": null
      },
      {
        "id": 5,
        "useStatus": "Y",
        "delStatus": "0",
        "createUser": null,
        "createTime": "2023-12-19 17:01:49",
        "updateUser": null,
        "updateTime": "2023-12-19 17:01:49",
        "applicationFrom": "PPS001",
        "menuName": "職務權限管理",
        "menuType": "C",
        "icon": null,
        "sortIndex": "2",
        "level": "2",
        "path": "/system/admin/roleManager",
        "parentId": "3",
        "selected": false,
        "open": false,
        "code": "",
        "children": [
          {
            "id": 8,
            "useStatus": "Y",
            "delStatus": "0",
            "createUser": null,
            "createTime": "2023-12-20 10:03:55",
            "updateUser": null,
            "updateTime": "2023-12-20 10:03:55",
            "applicationFrom": "PPS001",
            "menuName": "查詢職務",
            "menuType": "F",
            "icon": null,
            "sortIndex": null,
            "level": null,
            "path": "/system/role/getAllRole",
            "parentId": "5",
            "selected": false,
            "open": false,
            "code": "",
            "children": [],
            "roles": null
          }
        ],
        "roles": null
      }
    ],
    "roles": null
  },
  {
    "id": 4,
    "useStatus": "Y",
    "delStatus": "0",
    "createUser": null,
    "createTime": "2023-12-19 16:59:09",
    "updateUser": null,
    "updateTime": "2023-12-19 16:59:09",
    "applicationFrom": "PPS001",
    "menuName": "菜單功能管理",
    "menuType": "C",
    "icon": null,
    "sortIndex": "1",
    "level": "2",
    "path": "/system/admin/menuManager",
    "parentId": "3",
    "selected": false,
    "open": false,
    "code": "",
    "children": [
      {
        "id": 6,
        "useStatus": "Y",
        "delStatus": "0",
        "createUser": null,
        "createTime": "2023-12-19 17:03:31",
        "updateUser": null,
        "updateTime": "2023-12-19 17:03:31",
        "applicationFrom": "PPS001",
        "menuName": "保存",
        "menuType": "F",
        "icon": null,
        "sortIndex": null,
        "level": null,
        "path": "/system/menu/saveMenuFunction",
        "parentId": "4",
        "selected": false,
        "open": false,
        "code": "",
        "children": [],
        "roles": null
      },
      {
        "id": 7,
        "useStatus": "Y",
        "delStatus": "0",
        "createUser": null,
        "createTime": "2023-12-19 17:05:25",
        "updateUser": null,
        "updateTime": "2023-12-19 17:05:25",
        "applicationFrom": "PPS001",
        "menuName": "查詢",
        "menuType": "F",
        "icon": null,
        "sortIndex": null,
        "level": null,
        "path": "/system/menu/getAllMenuFunctionAuth",
        "parentId": "4",
        "selected": false,
        "open": false,
        "code": "",
        "children": [],
        "roles": null
      }
    ],
    "roles": null
  },
  {
    "id": 5,
    "useStatus": "Y",
    "delStatus": "0",
    "createUser": null,
    "createTime": "2023-12-19 17:01:49",
    "updateUser": null,
    "updateTime": "2023-12-19 17:01:49",
    "applicationFrom": "PPS001",
    "menuName": "職務權限管理",
    "menuType": "C",
    "icon": null,
    "sortIndex": "2",
    "level": "2",
    "path": "/system/admin/roleManager",
    "parentId": "3",
    "selected": false,
    "open": false,
    "code": "",
    "children": [
      {
        "id": 8,
        "useStatus": "Y",
        "delStatus": "0",
        "createUser": null,
        "createTime": "2023-12-20 10:03:55",
        "updateUser": null,
        "updateTime": "2023-12-20 10:03:55",
        "applicationFrom": "PPS001",
        "menuName": "查詢職務",
        "menuType": "F",
        "icon": null,
        "sortIndex": null,
        "level": null,
        "path": "/system/role/getAllRole",
        "parentId": "5",
        "selected": false,
        "open": false,
        "code": "",
        "children": [],
        "roles": null
      }
    ],
    "roles": null
  },
  {
    "id": 6,
    "useStatus": "Y",
    "delStatus": "0",
    "createUser": null,
    "createTime": "2023-12-19 17:03:31",
    "updateUser": null,
    "updateTime": "2023-12-19 17:03:31",
    "applicationFrom": "PPS001",
    "menuName": "保存",
    "menuType": "F",
    "icon": null,
    "sortIndex": null,
    "level": null,
    "path": "/system/menu/saveMenuFunction",
    "parentId": "4",
    "selected": false,
    "open": false,
    "code": "",
    "children": [],
    "roles": null
  },
  {
    "id": 7,
    "useStatus": "Y",
    "delStatus": "0",
    "createUser": null,
    "createTime": "2023-12-19 17:05:25",
    "updateUser": null,
    "updateTime": "2023-12-19 17:05:25",
    "applicationFrom": "PPS001",
    "menuName": "查詢",
    "menuType": "F",
    "icon": null,
    "sortIndex": null,
    "level": null,
    "path": "/system/menu/getAllMenuFunctionAuth",
    "parentId": "4",
    "selected": false,
    "open": false,
    "code": "",
    "children": [],
    "roles": null
  },
  {
    "id": 8,
    "useStatus": "Y",
    "delStatus": "0",
    "createUser": null,
    "createTime": "2023-12-20 10:03:55",
    "updateUser": null,
    "updateTime": "2023-12-20 10:03:55",
    "applicationFrom": "PPS001",
    "menuName": "查詢職務",
    "menuType": "F",
    "icon": null,
    "sortIndex": null,
    "level": null,
    "path": "/system/role/getAllRole",
    "parentId": "5",
    "selected": false,
    "open": false,
    "code": "",
    "children": [],
    "roles": null
  }
]
