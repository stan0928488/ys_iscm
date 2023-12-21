import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';
import { ManageRoleActionCellComponent } from './manage-role-action-cell-component';
import { MENU_TOKEN } from '../config/menu';
import { Menu } from '../config/types';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import * as _ from "lodash";

interface FlatNode {
  id:string;
  expandable: boolean;
  name: string;
  level: number;
  isSelected : boolean;
}

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.css']
})
export class ManageRoleComponent implements OnInit, AfterViewInit {

  isSpinning = false;

  private transformer = (node: any, level: number): FlatNode => {
    return  {
        id: node.id,
        expandable: !!node.children && node.children.length > 0,
        name: node.menuName,
        level,
        isSelected : node.selected
      };
  };

  checklistSelection = new SelectionModel<FlatNode>(true);

  // Tree控制器
  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  // 將具有子節點的巢狀資料轉換為具有層級（level）資訊的轉換器類別
  treeFlattener = new NzTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  
  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  roleList : any[] = [];

  gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: false,
      editable: true,
      resizable: true,
      autoHeight: true,
    }
  };

  columnDefs : ColDef[] = [
    { 
      headerName:'#', 
      field:'id',
      width: 80,
    },
    { 
      headerName:'職務名稱', 
      field:'roleName',
      width: 150,
    },
    { 
      headerName:'描述', 
      field:'roleDetail',
      width: 200,
    },
    { 
      headerName:'Action', 
      width: 150,
      editable: false,
      cellRenderer: ManageRoleActionCellComponent,
      cellRendererParams:{
        menuPermissionsManage : this.menuPermissionsManage.bind(this),
      }
    }
  ];

  rolePermissionsDrawerVisible = false;
  rolePermissionsDrawerTitle = '';


  constructor(@Inject(MENU_TOKEN) public menus: Menu[],
              private nzModalService: NzModalService,
              private systemService : SYSTEMService) { }

  async ngAfterViewInit(): Promise<void> {
    await this.getRoleListInfo();
  }

  ngOnInit(): void {

  }

  async getRoleListInfo(){
    this.isSpinning = true;
    try{
      const resObservable$  = this.systemService.getRoleList();
      const response = await firstValueFrom<any>(resObservable$);

      if(response.code === 200){
        this.roleList = response.data;
      }
      else{
        this.nzModalService.error({
          nzTitle: '獲取職務資訊失敗',
          nzContent: response.message,
        });
      }

      }catch (error) {
        this.nzModalService.error({
          nzTitle: '獲取職務資訊失敗',
          nzContent: `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`,
        });
      }
      finally{
        this.isSpinning = false;
      }
    
  }

  rolePermissionsDrawerClose(){
    this.rolePermissionsDrawerVisible = false;
  }


  async configRoleAndMenuRelation(selectedIds : string[], currentConfigRole : string){

    const payload = {
      menuIds : selectedIds, // 被勾選的菜單Id
      roleId : currentConfigRole // 當前被配置職務角色Id
    };

    try{
      this.isSpinning = true;
      const resObservable$  = this.systemService.configRoleAndMenuRelation(payload)
      const response = await firstValueFrom<any>(resObservable$);
      
      if(response.code === 200){
        this.nzModalService.success({
          nzTitle: '已保存',
          nzContent: `配置菜單權限成功`,
        });
      }
      else{
        this.nzModalService.error({
          nzTitle: '配置菜單權限失敗',
          nzContent: response.message,
        });
      }

      }catch (error) {
        this.nzModalService.error({
          nzTitle: '配置菜單權限失敗',
          nzContent: `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`,
        });
      }
      finally{
        this.isSpinning = false;
      }
  }


  // 儲放被選中的節點的Id以及各自的所有父級節點Id
  selectedIds = null;
  // 當前哪個職務被配置
  currentConfigRole = null;

  /**
   * 保存該職務對哪些菜單擁有權限
   */
  async rolePermissionsManageSubmitHandler(){

    // 取得哪些菜單有被選中找出它們的Id
    this.getSelectedMenuNodeIds();

    // 獲取該被配置的職務的Id
    const roleId = this.currentConfigRole.id;

    await this.configRoleAndMenuRelation([...this.selectedIds], String(roleId));

  }

  /**
   * 獲取被選中的節點的Id以及各自的所有父級節點Id
   */
  getSelectedMenuNodeIds(){
    this.selectedIds = new Set();
    // 儲存被選擇的節點本身與它的父節點
    this.treeControl.dataNodes.forEach((node) => {
      if (this.checklistSelection.isSelected(node)){
        this.selectedIds.add(node.id.toString());
        // 獲取所有有關係的前代父節點Id
        this.getAllAncestorsIds(node);
      }
    });
  }

  /**
   * 獲取所有有關係的前代父節點Id
   */
  getAllAncestorsIds(node: FlatNode){
    let parentNode = this.getParentNode(node)

    // 上級沒有父節點了
    if(_.isNull(parentNode)){
      return;
    }

    // 已找過這個分支的所有上級父節點了
    if(this.selectedIds.has(parentNode.id.toString())){
      return;
    }

    // 遞迴這個分支的所有上級父節點
    this.selectedIds.add(parentNode.id.toString());
    this.getAllAncestorsIds(parentNode);
 
  }

 async getMenusRelationRole(roleId : string){
    try{
      this.isSpinning = true;
      const resObservable$  = this.systemService.getMenusRelationRole(roleId);
      const response = await firstValueFrom<any>(resObservable$);
      
      if(response.code === 200){
         // 生成菜單樹視圖
       this.dataSource.setData(response.data);
      }
      else{
        this.nzModalService.error({
          nzTitle: '獲取職務對應菜單失敗',
          nzContent: `請稍後重試或聯繫系統工程師`,
        });
      }

      }catch (error) {
        this.nzModalService.error({
          nzTitle: '獲取職務對應菜單失敗',
          nzContent: `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`,
        });
      }
      finally{
        this.isSpinning = false;
      }
  }


 // 已存在資料庫的該職務有權限訪問的菜單Id
 selectedIdCache : string[] = [];

  /**
   * 先前配置過某個職務的菜單節點checkBox要打勾
   */
  hasSelectedMenuNodsMarkHandler(){
    // 遍歷所有節點isSelected為true的將它的checkBox打勾
    this.treeControl.dataNodes.forEach(node => {
      if(node.isSelected){
        this.checklistSelection.select(node);
        this.selectedIdCache.push(node.id.toString());
      }
    });
  }

//-----------------------------------------
// 菜單樹部分的相關函數
//-----------------------------------------

  /**
   * 控制抽屜出現
   * @param rowData 
   */
  async menuPermissionsManage(rowData:any){
    this.isSpinning = true;
    this.currentConfigRole = rowData;
    this.rolePermissionsDrawerTitle = `管理「${rowData.roleName}」的菜單權限`
    await this.getMenusRelationRole(String(rowData.id));
    this.treeControl.expandAll();
    this.hasSelectedMenuNodsMarkHandler();
    this.rolePermissionsDrawerVisible = true;
    this.isSpinning = false;
  }

  /**
   * 父節點被選擇底下所有子節點也被選擇
   * @param node 
   * @returns 
   */
  descendantsAllSelected(node: FlatNode): boolean {
    // 找到當前節點的所有後代
    const descendants = this.treeControl.getDescendants(node);
    return (
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child))
    );
  }

  /**
   * 父節點底下的子節點們有的選中有的沒選中
   * 父節點呈現半選擇的狀態
   * @param node 
   * @returns 
   */
  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    //descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /**
   * 給任一子節點找出他的父節點是誰
   * @param node 
   * @returns 
   */
  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }




}
