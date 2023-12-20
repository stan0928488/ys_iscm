/*
 * 只有在菜单静态加载时候，可以把以下注释打开
 * */

import { InjectionToken } from '@angular/core';
import { Menu } from './types';

/*定义菜单*/
export const MENU_TOKEN = new InjectionToken<Menu[]>('menu-token', {
  providedIn: 'root',
  factory(): Menu[] {
    //return menuNav;
    const menuNav = JSON.parse(menuNav2_string) as Menu[]
    return menuNav;
  }
});

// const menuNav: Menu[] = [
//   {
//     menuName: '欢迎',
//     id: 1,
//     fatherId: 0,
//     icon: 'dashboard',
//     open: false,
//     selected: false,
//     menuType: 'C',
//     path: '/default/welcome',
//     code: ''
//   }
// ];

const menuNav2_stringtest1 = `
[
  {
    "menuName": "欢迎",
    "id": 1,
    "fatherId": null,
    "icon": "dashboard",
    "open": false,
    "selected": false,
    "menuType": "C",
    "path": "/default/welcome",
    "code": "",
    "children": []
  }
]
`

const menuNav2_stringtest2 = `
[
  {
    "id": 1,
    "useStatus": "Y",
    "delStatus": 0,
    "createUser": null,
    "createTime": null,
    "updateUser": null,
    "updateTime": null,
    "menuName": "系統管理",
    "menuType": "C",
    "icon": "setting",
    "sortIndex": null,
    "level": null,
    "path": "/admin/system",
    "fatherId": null,
    "parentId": null,
    "selected": false,
    "open": false,
    "code": "",
    "children": []
  }
]

`

const menuNav2_string = `
  [
    {
      "id": 1,
      "useStatus": "Y",
      "delStatus": 0,
      "createUser": null,
      "createTime": null,
      "updateUser": null,
      "updateTime": null,
      "menuName": "系統管理",
      "menuType": "C",
      "icon": "setting",
      "sortIndex": null,
      "level": null,
      "path": "/admin/system",
      "fatherId": null,
      "parentId": null,
      "selected": false,
      "open": false,
      "code": "",
      "children": [
        {
          "id": 2,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "用戶管理",
          "menuType": "C",
          "icon": "user",
          "sortIndex": null,
          "level": null,
          "path": "/admin/system/manageuser",
          "fatherId": "1",
          "parentId":"1",
          "selected": false,
          "open": false,
          "code": "",
          "children": [],
          "roles": null
        },
        {
          "id": 4,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "角色管理",
          "menuType": "C",
          "icon": "contacts",
          "sortIndex": null,
          "level": null,
          "path": "/admin/system/managerole",
          "fatherId": "1",
          "parentId":"1",
          "selected": false,
          "open": false,
          "code": "",
          "children": [],
          "roles": null
        },
        {
          "id": 5,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "菜單管理",
          "menuType": "C",
          "icon": "bars",
          "sortIndex": null,
          "level": null,
          "path": "/admin/system/managemenu",
          "fatherId": "1",
          "parentId":"1",
          "selected": false,
          "open": false,
          "code": "",
          "children": [],
          "roles": null
        },
        {
          "id": 10,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "範例管理",
          "menuType": "C",
          "icon": "bars",
          "sortIndex": null,
          "level": null,
          "path": "/admin/system/demo",
          "fatherId": "1",
          "parentId":"1",
          "selected": false,
          "open": false,
          "code": "",
          "children": [
            {
              "id": 11,
              "useStatus": "Y",
              "delStatus": 0,
              "createUser": null,
              "createTime": null,
              "updateUser": null,
              "updateTime": null,
              "menuName": "ng-grid",
              "menuType": "C",
              "icon": "android",
              "sortIndex": null,
              "level": null,
              "path": "/admin/system/demo/nggrid",
              "fatherId": "10",
              "parentId":"10",
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
          "id": 16,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "客戶管理",
          "menuType": "C",
          "icon": "fund",
          "sortIndex": null,
          "level": null,
          "path": "/admin/system/managecustomer",
          "fatherId": "1",
          "parentId":"1",
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
      "delStatus": 0,
      "createUser": null,
      "createTime": null,
      "updateUser": null,
      "updateTime": null,
      "menuName": "客戶訂單管理",
      "menuType": "C",
      "icon": "android",
      "sortIndex": null,
      "level": null,
      "path": "/admin/order",
      "fatherId": null,
      "parentId":null,
      "selected": false,
      "open": false,
      "code": "",
      "children": [
        {
          "id": 7,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "預進單送單管理",
          "menuType": "C",
          "icon": "fund",
          "sortIndex": null,
          "level": null,
          "path": "admin/order/sendorder",
          "fatherId": "6",
          "parentId":"6",
          "selected": false,
          "open": false,
          "code": "",
          "children": [],
          "roles": null
        },
        {
          "id": 8,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "預進單管理",
          "menuType": "C",
          "icon": "appstore",
          "sortIndex": null,
          "level": null,
          "path": "/admin/order/preorder",
          "fatherId": "6",
          "parentId":"6",
          "selected": false,
          "open": false,
          "code": "",
          "children": [],
          "roles": null
        },
        {
          "id": 9,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "訂單管理",
          "menuType": "C",
          "icon": "contacts",
          "sortIndex": null,
          "level": null,
          "path": "/admin/order/manageorder",
          "fatherId": "6",
          "parentId":"6",
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
      "id": 12,
      "useStatus": "Y",
      "delStatus": 0,
      "createUser": null,
      "createTime": null,
      "updateUser": null,
      "updateTime": null,
      "menuName": "客戶服務管理",
      "menuType": "C",
      "icon": "fund",
      "sortIndex": null,
      "level": null,
      "path": "/admin/csmanage",
      "fatherId": null,
      "parentId": null,
      "selected": false,
      "open": false,
      "code": "",
      "children": [
        {
          "id": 13,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "交談作業管理",
          "menuType": "C",
          "icon": "contacts",
          "sortIndex": null,
          "level": null,
          "path": "/admin/csmanage/talksession",
          "fatherId": "12",
          "parentId":"12",
          "selected": false,
          "open": false,
          "code": "",
          "children": [],
          "roles": null
        },
        {
          "id": 14,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "交談單元管理",
          "menuType": "C",
          "icon": "bars",
          "sortIndex": null,
          "level": null,
          "path": "/admin/csmanage/talkitem",
          "fatherId": "12",
          "parentId":"12",
          "selected": false,
          "open": false,
          "code": "",
          "children": [],
          "roles": null
        },
        {
          "id": 15,
          "useStatus": "Y",
          "delStatus": 0,
          "createUser": null,
          "createTime": null,
          "updateUser": null,
          "updateTime": null,
          "menuName": "客戶交談管理",
          "menuType": "C",
          "icon": "android",
          "sortIndex": null,
          "level": null,
          "path": "/admin/csmanage/customertalk",
          "fatherId": "12",
          "parentId":"12",
          "selected": false,
          "open": false,
          "code": "",
          "children": [],
          "roles": null
        }
      ],
      "roles": null
    }
  ]
`
