import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { ColDef, ColumnApi, GridApi, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { AGCustomHeaderComponent } from 'src/app/shared/ag-component/ag-custom-header-component';
import { CommonApiEditComponent } from './common-api-edit-component';
import { CookieService } from 'src/app/services/config/cookie.service';

interface FlatNode {
  id : number | string;
  expandable: boolean;
  menuName: string;
  level: number;
  parentId : number | string;
  menuType: string;
  isShow: boolean;
  icon: string;
  sortIndex: string;
  path: string;
}

@Component({
  selector: 'app-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.css'],
  providers: [NzMessageService],
})
export class ManageMenuComponent implements AfterViewInit {

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

  // 新節點頁面是否顯示
  newIsShow = true;

  // 新節點路徑
  newNodePath = '';

  // 新節點排序索引
  newNodeSortIdx = '';

  // 是否彈出編輯框
  editIsVisible = false;
  // 編輯框標題
  editModalTitle = '';
  // 編輯的節點的Id
  editId; 
  // 編輯的節點名稱
  editNodeName = '';
  // 編輯的節點的層級
  editNodelevel = 0;
  // 編輯的節點類型(是頁面路徑或API路徑)
  editMenuType = '';
  // 編輯的節點頁面是否顯示
  editIsShow = true;
  // 編輯的節點圖示
  editMenuIcon = '';
  // 編輯的節點路徑
  editMenuPath = '';
  // 編輯的節點排序索引
  editMenuSortIndex = '';
  // 編輯的節點的父節點Id
  editParentId;
  // 執行編輯保存的loading控制
  editSaveLoading = false;

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
    isShow : node.isShow == '1' ? true : false,
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

  isExpandAll = false;
  
  USERNAME = '';
  constructor(@Inject(MENU_TOKEN) public menus: Menu[],
              private nzModalService: NzModalService,
              private systemService : SYSTEMService,
              private message: NzMessageService,
              private changeDetectorRef: ChangeDetectorRef,
              private cookieService : CookieService){
    // 測試用假資料
    //this.dataSource.setData(menus);
    this.agGridContext = {
      componentParent: this
    };
    this.USERNAME = this.cookieService.getCookie('USERNAME');
  }

  async ngAfterViewInit(): Promise<void> {
    await this.getSystemMenu();
    await this.searchMenusOrApis();
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

  currentEditNode = null;
  nodeClickHandler(currentNode: FlatNode){

    // 當有任一節點被選擇，則清除其他節點被選擇的狀態
    this.treeControl.dataNodes.forEach(node => {
      if(node!==currentNode){
        this.selectListSelection.deselect(node);
      }
    });

    // 指定當前節點是被選擇的狀態
    this.selectListSelection.toggle(currentNode);
    this.currentEditNode = currentNode;

    this.editNodelevel = currentNode.level;
    this.editNodeName = currentNode.menuName;
    this.editMenuType = currentNode.menuType;
    this.editIsShow = currentNode.isShow;
    this.editMenuIcon = currentNode.icon;
    this.editMenuPath = currentNode.path;
    this.editMenuSortIndex = currentNode.sortIndex;
    this.editId = currentNode.id;
    this.editParentId = currentNode.parentId;

    this.editModalTitle = `編輯「${this.editNodeName}」節點`;

    this.editIsVisible = true;
    
 
  }

  /**
   * 編輯彈出框關閉
   */
  closeEditModal(){
    this.selectListSelection.toggle(this.currentEditNode);
    this.editIsVisible = false;
  }

 async editSave() {

    if(_.isEmpty(this.editNodeName)){
      this.message.error('請填寫菜單名稱');
      return;
    }

    this.editSaveLoading = true;

    // 裝配要更新的資料
    const requestUpdateNodeData = {
      id: this.editId,
      menuType : this.editMenuType,   // 新節點類型(菜單/權限API)
      icon : _.isEmpty(this.editMenuIcon) ? null : this.editMenuIcon, //新節點圖示
      isShow : this.editIsShow == true ? '1' : '0', //新節點是否顯示頁面
      menuName : this.editNodeName,   // 新節點名稱
      sortIndex : _.isEmpty(this.editMenuSortIndex) ? null : this.editMenuSortIndex, // 新節點的排序索引
      level : String(this.editNodelevel), // 新節點在樹中的層級
      path : _.isEmpty(this.editMenuPath) ? null : this.editMenuPath , // 新節點對應的路徑
      parentId : _.isNil(this.editParentId) ? null : String(this.editParentId), // 父節點的Id
      //updateUser : this.USERNAME
    }

    await this.saveOrUpdateHandler(requestUpdateNodeData);
    this.editSaveLoading = false;
  }

  addFirstLevelMenu(){
    this.currentParentNode = {
      id : null,
      expandable: true,
      menuName: '添加頂級菜單',
      menuType: '',
      isShow: true,
      icon: '',
      sortIndex: '',
      path: '',
      level: 0,
      parentId : null,
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
  isDrawerSpinning = false;
  addNewNodeHandler(){

    // 向後端發送請求保存此節點
    this.saveNewNode();
    
    // const flattenMenu = this.treeFlattener.flattenNodes(originalMenu);
    // console.log('攤平newMenuTree===>', flattenMenu);
  }

  async saveNewNode(){

    if(_.isEmpty(this.newMenuType)){
      this.message.error('請填寫菜單名稱');
      return;
    }

    this.isDrawerSpinning = true;

    // 裝配要保存的資料
    const requestSaveNodeData = {
      menuType : this.newMenuType,   // 新節點類型(菜單/權限API)
      isShow : this.newIsShow == true ? '1' : '0',   // 新節點頁面是否顯示
      icon : _.isEmpty(this.newNodeIcon) ? null : this.newNodeIcon, //新節點圖示
      menuName : this.newNodeName,   // 新節點名稱
      sortIndex : _.isEmpty(this.newNodeSortIdx) ? null : this.newNodeSortIdx, // 新節點的排序索引
      level : String(this.currentParentNode.level), // 新節點在樹中的層級
      path : _.isEmpty(this.newNodePath) ? null : this.newNodePath , // 新節點對應的路徑
      parentId : _.isNil(this.currentParentNode?.id) ? null : String(this.currentParentNode?.id), // 父節點的Id
      //createUser : this.USERNAME
    }

    await this.saveOrUpdateHandler(requestSaveNodeData);
    this.isDrawerSpinning = false;
  }

 async saveOrUpdateHandler(requestNodeData : any){

    try{
      const resObservable$  = this.systemService.saveMenuNode(requestNodeData);
      const response = await firstValueFrom<any>(resObservable$);

      if(response.code === 200){
        // 前端自行將當前節點加到樹中渲染資料
        //this.renderMenuTree(requestNodeData, response.data.id);

        // 從後端重拿一次菜單樹
        await this.getSystemMenu();
        // 非頂級菜單添加用剛剛添加的子節點找尋所有上級父節點攤開至此子節點的位置
        if(!_.isNull(requestNodeData.parentId)) {
          this.nestedExpand(requestNodeData.parentId);
        }

        // 保存成功後的處理
        if(_.isNil(requestNodeData.id)){
          // 關閉側邊欄輸入
          this.addNewNodeClose();
          this.newNodeIcon = '';
          this.newIsShow = true;
          this.newNodeName = '';
          this.newMenuType = 'C';
          this.newNodePath = '';
          this.newNodeSortIdx = '';
          this.message.success(`新增「${requestNodeData.menuName}」菜單成功`);
        }
        // 更改成功後的處理
        else{
          this.closeEditModal();
          this.message.success(`更新「${requestNodeData.menuName}」菜單成功`);
        }

      }
      else{
        this.nzModalService.error({
          nzTitle: '保存節點失敗',
          nzContent: response.message,
        });
      }

      }catch (error) {
        this.nzModalService.error({
          nzTitle: '保存節點失敗',
          nzContent: `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`,
        });
      }
      finally{
        
      }

  }



  /**
   * 前端自行將當前節點加到樹中渲染資料
   * @param requestNodeData 
   * @param dbId 
   */
  renderMenuTree(requestNodeData : any, dbId : number | string){

    // 第二級之後的菜單新增
    // 裝配要渲染新的子節點資料
    const newChildNode : Menu = {
      id : dbId,
      menuType: requestNodeData.menuType,
      isShow : requestNodeData.isShow,
      icon : requestNodeData.icon,
      menuName : requestNodeData.menuName,
      sortIndex : requestNodeData.sortIndex,
      path : requestNodeData.path,
      parentId : requestNodeData.parentId,
      //createUser : this.USERNAME
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

  deleteNode(node:FlatNode){

    // 獲取當前節點的id
    const menuId = node.id.toString();

    // 根據該Id刪除這個節點
    const options: ModalOptions = {
      nzTitle: '確定刪除',
      nzContent: `您確定要刪除「${node.menuName}」菜單節點嗎?`,
      nzOnOk: () => {
       // 從樹的資料中刪除該節點
       this.deleteRow(node);
      },
      nzOnCancel: () => {
        console.log('取消刪除某樹節點');
      }
    };

    this.nzModalService.confirm(options);
  }

  async deleteRow(node:FlatNode){

    try{
      this.isSpinning = true;
      const resObservable$  = this.systemService.deleteMenuNode(node.id.toString());
      const response = await firstValueFrom<any>(resObservable$);
      if(response.code === 200){
        // 從後端重拿一次菜單樹
        await this.getSystemMenu();
        // 非頂級菜單添加用剛剛添加的子節點找尋所有上級父節點攤開至此子節點的位置
        if(!_.isNull(node.parentId)) {
          this.nestedExpand(node.parentId);
        }
      }
      else{
        this.nzModalService.error({
          nzTitle: '刪除節點失敗',
          nzContent: response.message,
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
  

  finalChildrenlength : number = 0;
  /**
   * 前端測試用，刪除某節點
   * @param node 
   */
  oldDeleteNode(node:FlatNode){
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
       this.oldDeleteRow(originalMenus, node.id, parentId);
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

  /**
   * 前端測試用，前端自行將節點從樹中移除並渲染
   * @param originalMenus 
   * @param nodeId 
   * @param parentId 
   */
  async oldDeleteRow(originalMenus : Menu[], nodeId, parentId){
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

  expandAll(){
    this.isSpinning = true;
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
    this.isSpinning = false;
  }

  // 節流，不讓使用者一直觸發重新獲取菜單
  // 觸發一次要等2000毫秒
  timeouter = null;
  async throttleGetSystemMenu(){
    if(this.timeouter){
      this.message.warning('獲取菜單太過頻繁，請等候二秒再獲取');
      return;
    }
    await this.getSystemMenu();
    this.timeouter = setTimeout(()=>{
      this.timeouter = null;
    }, 2000);
  }

  reloadSystemMenus(){
    this.isExpandAll = false;
    this.throttleGetSystemMenu();
  }


//-----------------------------------------------
// 通用API管理
//-----------------------------------------------
  gridApi : GridApi;
  gridColumnApi : ColumnApi;
  agGridContext: any;

  // 搜尋關鍵字
  menusOrApisKeyword = null;
  // 搜尋指定的類型
  menusOrApisType = 'A';

  // 控制新增通用API側邊欄顯示與否
  addCommonApiVisible = false;

  // 新增通用授權API輸入參數--名稱
  newCommonApiNameInput = '';
  // 新增通用授權API輸入參數--路徑
  newCommonApiPathInput = '';

  // 編輯通用授權API彈出框是否顯示
  commonApiEditModalVisible = false;
  // 編輯通用授權API彈出框標題
  commonApiEditModalTitle = '';
  // 編輯通用授權API彈出框保存按鈕是否顯示處理中
  commonApiEditSaveLoading = false;
  // 編輯通用授權API輸入參數--名稱
  editCommonApiNameInput = '';
  // 編輯通用授權API輸入參數--路徑
  editCommonApiPathInput = '';

  menusAndApisList : any[] = [];

  menusAndApisColumnDefs: ColDef[] = [
    { 
      headerName:'名稱', 
      field:'menuName',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'類型', 
      field:'menuType',
      valueFormatter: (params: ValueFormatterParams<any, string>) => {
        const type = params.value;
        if(_.isEqual('A', type)){
          return '通用授權API';
        }
        else if(_.isEqual('F', type)){
          return '權限API';
        }
        else if(_.isEqual('C', type)){
          return '菜單';
        }
        else{
          return type;
        }
      },
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'路徑', 
      field:'path',
      headerComponent : AGCustomHeaderComponent
    },
    { 
      headerName:'Action', 
      headerComponent : AGCustomHeaderComponent,
      cellRenderer: CommonApiEditComponent,
    }
  ];

  gridOptions = {
    defaultColDef: {
      filter: true,
      sortable: false,
      //editable: true,
      resizable: true,
      autoHeight: true,
    }
  };

  currentCommonApiEditData = null;
  commonApiCacheData = null;
  commonApiEditOpen(rowData : any){

    // 顯示通用授權API編輯視窗
    this.commonApiEditModalVisible = true;

    // 賦值原來的名稱跟路徑給編輯輸入框
    this.editCommonApiNameInput = rowData.menuName;
    this.editCommonApiPathInput = rowData.path;

    // 紀錄當前編輯的資料
    this.currentCommonApiEditData = rowData;

    // 緩存一份當前編輯的資料，用於比對使用者是否有做修改了
    this.commonApiCacheData = _.cloneDeep(rowData);
  }

  async commonApiEditSave(){

    if(_.isEmpty(this.editCommonApiNameInput)){
      this.message.error('請填寫通用授權API名稱');
      return;
    }

    if(_.isEmpty(this.editCommonApiPathInput)){
      this.message.error('請填寫通用授權API路徑');
      return;
    }

    this.currentCommonApiEditData.menuName = this.editCommonApiNameInput;
    this.currentCommonApiEditData.path = this.editCommonApiPathInput;

    // 比對是否跟編輯前的資料一樣
    // 一樣的話則不執行更新保存
    if(_.isEqual(this.currentCommonApiEditData, this.commonApiCacheData)){
      this.message.warning('您尚未修改任何資料');
      return;
    }

    const requestUpdateCommonApiData = {
      id: this.currentCommonApiEditData.id,
      menuName :  this.currentCommonApiEditData.menuName,   // 通用授權API名稱
      path : this.currentCommonApiEditData.path // 通用授權API名稱路徑
      //updateUser : this.USERNAME
    }

    await this.addOrUpdateCommonApiHandler(requestUpdateCommonApiData);
    this.commonApiCloseEditModal();
    
  }

  commonApiCloseEditModal(){
    this.commonApiEditModalVisible = false;
  }


  addCommomApiVisible(){
    this.addCommonApiVisible = true;
  }

  async searchMenusOrApis(){

    try{
      this.isSpinning = true;
      const payload = {
        keyword : this.menusOrApisKeyword, //關鍵字
        menuType : this.menusOrApisType // 類型
      }
      const resObservable$  = this.systemService.findMenusOrApisByKeyword(payload);
      const response = await firstValueFrom<any>(resObservable$);
      if(response.code === 200){
        this.menusAndApisList = response.data;
        // 使用detectChanges()函數讓ag-grid渲染完畢
        // 之後再調autoSize才會成功
        this.changeDetectorRef.detectChanges();
        this. autoSizeAll();
      }
      else{
        this.menusAndApisList = [];
        this.nzModalService.error({
          nzTitle: '搜尋失敗',
          nzContent: response.message,
        });
      }

      }catch (error) {
        this.nzModalService.error({
          nzTitle: '搜尋失敗',
          nzContent: `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`,
        });
      }
      finally{
        this.isSpinning = false;
      }

  }

  // 關閉新增通用API側邊欄
  addCommonApiClose(){
    this.addCommonApiVisible = false;
  }

  async addCommonApi(){

    if(_.isEmpty(this.newCommonApiNameInput)){
      this.message.error('請填寫通用授權API名稱');
      return;
    }

    if(_.isEmpty(this.newCommonApiNameInput)){
      this.message.error('請填寫通用授權API路徑');
      return;
    }

    // 裝配要新增的資料
    const requestSaveCommonApiData = {
      menuType : 'A',   // 類型固定為A(通用授權API)
      icon : 'ant-design', //先固定為ant-design
      menuName : this.newCommonApiNameInput,   // 通用授權API名稱
      sortIndex : null, // 沒有排序關係
      level : null, // 沒有層級關係
      path : this.newCommonApiPathInput, // 通用授權API名稱對應的路徑
      parentId : null, // 沒有父節點
      //createUser : this.USERNAME
    }

    await this.addOrUpdateCommonApiHandler(requestSaveCommonApiData);

  }



  // 新增或更新通用API
  async addOrUpdateCommonApiHandler(payload : any){

    try{
      this.isDrawerSpinning = true;
      const resObservable$  = this.systemService.saveMenuNode(payload);
      const response = await firstValueFrom<any>(resObservable$);
      if(response.code === 200){

        this.menusOrApisKeyword = '';
        this.menusOrApisType = 'A';

        await this.searchMenusOrApis();

        this.addCommonApiClose();
        this.nzModalService.success({
          nzTitle: '新增成功',
          nzContent: '新增通用授權API成功',
        });

        if(!!!payload.id){
          this.newCommonApiNameInput = '';
          this.newCommonApiPathInput = '';
        }
      }
      else{
        this.nzModalService.error({
          nzTitle: '新增通用授權API失敗',
          nzContent: response.message,
        });
      }

    }catch (error) {
      this.nzModalService.error({
        nzTitle: '新增通用授權API失敗',
        nzContent: `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`,
      });
    }
    finally{
      this.isDrawerSpinning = false;
    }
  }

  deleteCommonApi(rowData : any){

    this.nzModalService.confirm({
      nzTitle: `確定刪除該通用授權API「${rowData.menuName}」?`,
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOnOk: async () => {
          await this.deleteCommonApiHandler(rowData);
      },
      nzOnCancel: () => {
          console.log("取消刪除通用授權API");
      }
    }); 
  }

  async deleteCommonApiHandler(rowData : any){

    try{
      this.isSpinning = true;
      const resObservable$  = this.systemService.deleteMenuNode(rowData.id.toString());
      const response = await firstValueFrom<any>(resObservable$);

      if(response.code === 200){
        // 從後端重拿一次資料
        await this.searchMenusOrApis();
        this.nzModalService.success({
          nzTitle: '刪除成功',
          nzContent: '刪除通用授權API成功',
        });
      }
      else{
        this.nzModalService.error({
          nzTitle: '刪除通用授權API失敗',
          nzContent: response.message,
        });
      }
    }catch (error) {
      this.nzModalService.error({
        nzTitle: '刪除通用授權API失敗',
        nzContent: `請聯繫系統工程師。錯誤訊息 : ${JSON.stringify(error.message)}`,
      });
    }
    finally{
      this.isSpinning = false;
    }

  }

  // ag-grid根據cell中的內容寬度適應
  autoSizeAll() {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
        allColumnIds.push(column.getId());
      }
    );
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  // 獲取ag-grid的Api函數
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }



}
