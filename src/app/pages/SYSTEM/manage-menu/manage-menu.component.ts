import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Menu } from '../config/types';
import { NzTreeFlatDataSource, NzTreeFlattener, NzTreeViewComponent } from 'ng-zorro-antd/tree-view';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { MENU_TOKEN } from '../config/menu';
import * as _ from "lodash";
import * as uuid from 'uuid';

interface FlatNode {
  id : number | string;
  expandable: boolean;
  name: string;
  level: number;
  parentId : number | string;
}

@Component({
  selector: 'app-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.css']
})
export class ManageMenuComponent {

 
  @ViewChild('menuTreeView') treeView!: NzTreeViewComponent<FlatNode>;

  // 新增節點的側邊攔是否顯示
  addNewNodeVisible = false;

  // 當前哪個節點被點選新增子節點
  currentParentNode : null | FlatNode= null;

  // 新節點名稱
  newNodeName = '';

  // 新節點類型(是頁面路徑或API路徑)
  newMenuType : 'C'| 'F' = 'C';

  // 新節點路徑
  newNodePath = '';

  private transformer = (node: Menu, level: number): FlatNode => ({
    id : node.id,
    expandable: !!node.children && node.children.length > 0,
    // 當前節點名稱
    name: node.menuName,
    // 當前節點是第幾層
    level,
    parentId : node.parentId
  });

  selectListSelection = new SelectionModel<FlatNode>(true);

  // Tree 控制器
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  // 用於將巢狀節點 T 處理為扁平節點 F 的展平器
  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;
  
  constructor(@Inject(MENU_TOKEN) public menus: Menu[],
              private nzModalService: NzModalService){
    this.dataSource.setData(menus);
  }

  nodeClickHandler(currentNode: FlatNode){

    // 當有任一節點被選擇，則清除其他節點被選擇的狀態
    this.treeControl.dataNodes.forEach(node => {
      if(node!==currentNode){
        this.selectListSelection.deselect(node);
      }
    });
    // 指定當前節點是被選擇的狀態
    this.selectListSelection.toggle(currentNode);
 
  }

  addFirstLevelMenu(){
    this.currentParentNode = {
      id : null,
      expandable: true,
      name: '添加頂級菜單',
      level: 0,
      parentId : null
    }
    this.addNewNodeVisible = true;
  }

  addFirstNode(){
    const originalMenu = this.dataSource.getData();

    originalMenu.push({
      id : uuid.v4(),
      menuName : this.newNodeName,
      fatherId : 0,
      parentId :null,
      icon : 'android',
      open: false,
      selected: false,
      menuType: this.newMenuType,
      path : this.newNodePath,
      code: ''
  });

    this.dataSource.setData(originalMenu);
    this.addNewNodeClose();
  }

  addNewNodeOpen(node:FlatNode){
    this.currentParentNode = node;
    this.addNewNodeVisible = true;
  }

  // 關閉新增節點的側邊攔
  addNewNodeClose(): void {
    this.addNewNodeVisible = false;
  }

  expandNodes : any[] = []
  addNewNodeHandler(){

    // 取得父節點的Id
    const parentId = this.currentParentNode?.id;

    // 沒有父節點Id表示是在執行頂級菜單的新增
    if(!!!parentId){
      this.addFirstNode();
      return;
    }

    // 以下是第二級開始菜單的新增
    // 裝配新的子節點資料
    const newChildNode : Menu = {
        id : uuid.v4(),
        menuName : this.newNodeName,
        fatherId : 0,
        parentId : parentId,
        icon : 'android',
        open: false,
        selected: false,
        menuType: this.newMenuType,
        path : this.newNodePath,
        code: ''
    }

    const originalMenu = this.dataSource.getData();
    this.addNewChildNodeToParentNode(originalMenu, newChildNode, parentId);
    // console.log('newMenuTree===>', originalMenu);
    this.dataSource.setData(originalMenu);
    this.addNewNodeClose();
    // 用剛剛添加的子節點的所有上級父節點將樹攤開至此子節點的位置
    this.nestedExpand(parentId);
    
   
    
    // const flattenMenu = this.treeFlattener.flattenNodes(originalMenu);
    // console.log('攤平newMenuTree===>', flattenMenu);
  }

  // 根據添加或刪除的子節點，尋找所有上級父節點好以將樹攤開至此子節點的位置
  nestedExpand(parentId){
    this.expandNodes = [];
    this.seekNestedParentId(parentId);
    for(const node of this.treeControl.dataNodes){
      if(_.includes(this.expandNodes, node.id)){
        this.treeControl.expand(node);
      }
    }
  }

  // 遞迴尋找當前新增的子節點的父節點的父節點(以此類推)
  seekNestedParentId(currentParentId : string | number) {

    for(const node of this.treeControl.dataNodes){
      if(node.id == currentParentId){
        this.expandNodes.push(node.id)
        const nextCurrentParentId = node.parentId;
        this.seekNestedParentId(nextCurrentParentId);
      }
    }

  }

  addNewChildNodeToParentNode(originalMenus : Menu[], newChildNode : Menu, parentId : number | string){
    
    for (const menuItem of originalMenus) {
      // 找到該子節點所屬的父節點
      if(menuItem.id === parentId){
        // 父節點的children為空新增一個陣列給他
        // 並把當前子節點加到children之中
        if(_.isEmpty(menuItem.children)){
          menuItem.children = [];
        }
        menuItem.children?.push(newChildNode);
        return;
      }

      // 不斷遞迴遍歷下一級節點
      // 下一級節點會有可能是當前子節點的父節點
      if(!_.isEmpty(menuItem.children) && menuItem.children !== undefined){
        this.addNewChildNodeToParentNode(menuItem.children, newChildNode, parentId);
      }
      
    }
  }

  finalChildrenlength : number = 0;
  deleteNode(node:FlatNode){
    this.finalChildrenlength = 0;
    const originalMenus = this.dataSource.getData();
    this.getChildrenlength(originalMenus, node.id);
    
    let message = '';
    if(this.finalChildrenlength > 0){
      message = `「${node.name}」底下有${this.finalChildrenlength}個子菜單，您確定要刪除及其下級所有資料嗎?`
    }
    else{
      message = `您確定要刪除「${node.name}」菜單資料嗎?`
    }
    const options: ModalOptions = {
      nzTitle: '確定刪除',
      nzContent: message,
      nzOnOk: () => {
       // 取的父節點id好以攤開
       const parentId = node.parentId;
       this.deleteRow(originalMenus, node.id);
       this.dataSource.setData(originalMenus);
       this.nestedExpand(parentId);
      },
      nzOnCancel: () => {
        console.log('取消刪除某樹節點');
      }
    };

    this.nzModalService.warning(options);
  }

 
  getChildrenlength(originalMenus : Menu[], id : number | string | null){

    for (const menuItem of originalMenus) {
      if(menuItem.id === id){
        this.finalChildrenlength = _.isEmpty(menuItem.children) ? 0 : menuItem.children?.length;
      }
      if(!_.isEmpty(menuItem.children) && menuItem.children !== undefined){
        this.getChildrenlength(menuItem.children, id);
      }
    }
  }

  deleteRow(originalMenus : Menu[], id : number | string | null){

    // 尋找這個被刪除的元素在當前層次中的哪一個位置
    let deleteIdx = null;
    for (let i = 0; i < originalMenus.length; i++) {
      if (originalMenus[i].id === id) {
        deleteIdx = i;
      }
    }
    // 有找到，將該節點刪除
    if(!_.isNull(deleteIdx)){
      originalMenus.splice(deleteIdx, 1);
      return;
    }

    // 沒找到再找下一層
    for (const menuItem of originalMenus) {
      if(!_.isEmpty(menuItem.children) && menuItem.children !== undefined){
            this.deleteRow(menuItem.children, id);
      }
    }
    
  }

}
