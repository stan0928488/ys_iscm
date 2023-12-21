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

interface FlatNode {
  id:string;
  expandable: boolean;
  name: string;
  level: number;
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
          nzContent: `請稍後重試或聯繫系統工程師`,
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

  /**
   * 保存該職務對哪些菜單擁有權限
   */
  rolePermissionsManageSubmitHandler(){

    console.log("當前所有節點==>", this.treeControl.dataNodes);
    console.log("被選中的節點==>",  this.getSelectedMenuNodeIds());

  }

  getSelectedMenuNodeIds() : string[] {
    // 儲存被選擇的節點本身與它的父節點
    const selectedIds = new Set();
    this.treeControl.dataNodes.forEach((node) => {
      if (this.checklistSelection.isSelected(node)){
        selectedIds.add(node.id.toString());
        selectedIds.add(this.getParentNode(node).id.toString());
      }
    });
    return [...selectedIds] as string[];
  }


  async getSystemMenu(){
    try{
      this.isSpinning = true;
      const resObservable$  = this.systemService.getSystemMenu();
      const response = await firstValueFrom<any>(resObservable$);
      
      if(response.code === 200){
         // 生成菜單樹視圖
       this.dataSource.setData(response.data);
      }
      else{
        this.nzModalService.error({
          nzTitle: '獲取功能菜單失敗',
          nzContent: `請稍後重試或聯繫系統工程師`,
        });
      }

      }catch (error) {
        this.nzModalService.error({
          nzTitle: '獲取功能菜單失敗',
          nzContent: `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`,
        });
      }
      finally{
        this.isSpinning = false;
      }
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
    this.rolePermissionsDrawerTitle = `管理「${rowData.roleName}」的菜單權限`
    await this.getSystemMenu();
    this.treeControl.expandAll();
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
