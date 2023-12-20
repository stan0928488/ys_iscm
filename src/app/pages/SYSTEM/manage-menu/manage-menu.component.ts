import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Menu } from '../config/types';
import { NzTreeFlatDataSource, NzTreeFlattener, NzTreeViewComponent } from 'ng-zorro-antd/tree-view';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { MENU_TOKEN } from '../config/menu';
import * as _ from "lodash";
import * as uuid from 'uuid';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';
import { firstValueFrom } from 'rxjs';

interface FlatNode {
  id : number | string;
  expandable: boolean;
  menuName: string;
  level: number;
  parentId : number | string;
  menuType: string;
  icon: string;
  sortIndex: string;
  path: string;
}

@Component({
  selector: 'app-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.css']
})
export class ManageMenuComponent {

  isSpinning = false;
 
  @ViewChild('menuTreeView') treeView!: NzTreeViewComponent<FlatNode>;

  // 新增節點的側邊攔是否顯示
  addNewNodeVisible = false;

  // 當前哪個節點被點選新增子節點
  currentParentNode : null | FlatNode= null;

  // 新節點圖示
  newNodeIcon = '';

  // 新節點名稱
  newNodeName = '';

  // 新節點類型(是頁面路徑或API路徑)
  newMenuType : 'C'| 'F' = 'C';

  // 新節點路徑
  newNodePath = '';

  // 新節點排序索引
  newNodeSortIdx = '';

  private transformer = (node: Menu, level: number): FlatNode => ({
    id : node.id,
    expandable: !!node.children && node.children.length > 0,
    // 當前節點名稱
    menuName: node.menuName,
    // 當前節點是第幾層
    level,
    parentId : node.parentId,
    menuType : node.menuType,
    icon : node.icon,
    sortIndex : node.sortIndex,
    path : node.path
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
              private nzModalService: NzModalService,
              private systemService : SYSTEMService){
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

    console.log("點選到節點~~~!!", currentNode);
    
 
  }

  addFirstLevelMenu(){
    this.currentParentNode = {
      id : null,
      expandable: true,
      menuName: '添加頂級菜單',
      menuType: '',
      icon: '',
      sortIndex: '',
      path: '',
      level: 0,
      parentId : null
    }
    this.addNewNodeVisible = true;
  }

  addNewNodeOpen(node:FlatNode){
    this.currentParentNode = node;
    if(node.level == 3){
      this.newMenuType = 'F';
    }
    this.addNewNodeVisible = true;
  }

  // 關閉新增節點的側邊攔
  addNewNodeClose(): void {
    this.addNewNodeVisible = false;
  }

  expandNodes : any[] = []
  addNewNodeHandler(){

    // 向後端發送請求保存此節點
    this.saveNewNode();
    
    // const flattenMenu = this.treeFlattener.flattenNodes(originalMenu);
    // console.log('攤平newMenuTree===>', flattenMenu);
  }

  async saveNewNode(){

    this.isSpinning = true;

    // 裝配要保存的資料
    const requestNodeData = {
      menuType : this.newMenuType,   // 新節點類型(菜單/權限API)
      icon : this.newNodeIcon, //新節點圖示
      menuName : this.newNodeName,   // 新節點名稱
      sortIndex : this.newNodeSortIdx, // 新節點的排序索引
      level : String(this.currentParentNode.level), // 新節點在樹中的層級
      path : this.newNodePath, // 新節點對應的路徑
      parentId : _.isNil(this.currentParentNode?.id) ? null : String(this.currentParentNode?.id) // 父節點的Id
    }

    try{
      const resObservable$  = this.systemService.saveMenuNode(requestNodeData);
      const response = await firstValueFrom<any>(resObservable$);

      if(response.code === 200){
        this.renderMenuTree(requestNodeData, response.data.id);
        this.newNodeIcon = '';
        this.newNodeName = '';
        this.newMenuType = 'C';
        this.newNodePath = '';
        this.newNodeSortIdx = '';
      }
      else{
        this.nzModalService.error({
          nzTitle: '保存節點失敗',
          nzContent: `請稍後重試或聯繫系統工程師`,
        });
      }

      }catch (error) {
        this.nzModalService.error({
          nzTitle: '保存節點失敗',
          nzContent: `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`,
        });
      }
      finally{
        this.isSpinning = false;
      }
  }

  renderMenuTree(requestNodeData : any, dbId : number | string){

    // 第二級之後的菜單新增
    // 裝配要渲染新的子節點資料
    const newChildNode : Menu = {
      id : dbId,
      menuType: requestNodeData.menuType,
      icon : requestNodeData.icon,
      menuName : requestNodeData.menuName,
      sortIndex : requestNodeData.sortIndex,
      path : requestNodeData.path,
      parentId : requestNodeData.parentId,
    }
    
    //渲染資料
    const originalMenu = this.dataSource.getData();
    // 非頂級菜單添加需要一層一層找尋它的父並掛在其底下
    if(!_.isNull(requestNodeData.parentId)) {
      this.addNewChildNodeToParentNode(originalMenu, newChildNode, requestNodeData.parentId);
    }
    // 頂級菜單直接加到第一層即可
    else{
      originalMenu.push(newChildNode)
    }
    this.dataSource.setData(originalMenu);
   
    // 關閉側邊欄輸入
    this.addNewNodeClose();

    // 非頂級菜單添加用剛剛添加的子節點找尋所有上級父節點攤開至此子節點的位置
    if(!_.isNull(requestNodeData.parentId)) {
      this.nestedExpand(requestNodeData.parentId);
    }
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
      if(menuItem.id == parentId){
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
      message = `「${node.menuName}」底下有${this.finalChildrenlength}個子菜單，您確定要刪除及其下級所有資料嗎?`
    }
    else{
      message = `您確定要刪除「${node.menuName}」菜單資料嗎?`
    }
    const options: ModalOptions = {
      nzTitle: '確定刪除',
      nzContent: message,
      nzOnOk: () => {
       // 取得父節點id好以攤開被刪除的節點原本所在的位置
       const parentId = node.parentId;
       // 從樹的資料中刪除該節點
       this.deleteRow(originalMenus, node.id, parentId);
      },
      nzOnCancel: () => {
        console.log('取消刪除某樹節點');
      }
    };

    this.nzModalService.confirm(options);
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
  
  async deleteRow(originalMenus : Menu[], nodeId, parentId){
    this.isSpinning = true;
    try{
      const resObservable$  = this.systemService.deleteMenuNode(nodeId);
      const response = await firstValueFrom<any>(resObservable$);
      
      if(response.code === 200){
        this.renderingTreeForNodeDelete(originalMenus, nodeId);
         // 重新渲染樹視圖
       this.dataSource.setData(originalMenus);
       // 攤開被刪除的節點原本所在的位置
       this.nestedExpand(parentId);
      }
      else{
        this.nzModalService.error({
          nzTitle: '刪除節點失敗',
          nzContent: `請稍後重試或聯繫系統工程師`,
        });
      }

      }catch (error) {
        this.nzModalService.error({
          nzTitle: '刪除節點失敗',
          nzContent: `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`,
        });
      }
      finally{
        this.isSpinning = false;
      }
    
  }

  renderingTreeForNodeDelete(originalMenus : Menu[], id : number | string | null){

    // 尋找這個被刪除的元素在當前層次中的哪一個位置
    let deleteIdx = null;
    for (let i = 0; i < originalMenus.length; i++) {
      if (originalMenus[i].id == id) {
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
            this.renderingTreeForNodeDelete(menuItem.children, id);
      }
    }
    
  }

}
