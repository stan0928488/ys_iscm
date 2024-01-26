import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';
import { BtnCellRendererType2 } from '../../RENDERER/BtnCellRendererType2.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { number } from 'echarts';


@Component({
  selector: 'app-ag-head-seeting',
  templateUrl: './ag-head-seeting.component.html',
  styleUrls: ['./ag-head-seeting.component.css']
})
export class AgHeadSeetingComponent implements AfterViewInit {

  //model
  isVisible = false;

  //tree
  private transformer = (node: TreeNode, level: number): FlatNode => ({
    open: !!node.children && node.children.length > 0,
    menuName: node.menuName,
    level,
    icon: node.icon,
    path: node.path,
    children:node.children
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

  //grid
  currentNode
  insertObj
  gridApi: GridApi|any;
  switchValue = false;
  frameworkComponents: any;
  rowData: ItemData[] = [];
  columnDefs = [
    {
      width: 150,
      headerName: 'ag表格名稱',
      field: 'agName',
    },
    {
      width: 150,
      headerName: '中文名稱',
      field: 'headername',
    },
    {
      width: 150,
      headerName: 'key欄位',
      field: 'field',
    },
    {
      width: 150,
      headerName: '備註',
      field: 'remark',
    },
    {
      width: 150,
      headerName: '顯示順位',
      field: 'sortIndex',
    },
    {
      width: 150,
      headerName: 'ag默認欄寬',
      field: 'width',
    },
    {
      width: 150,
      headerName: 'ag排序是否啟用 (0:啟用, 1:不啟用)',
      field: 'sortable',
    },
    {
      width: 150,
      headerName: 'ag寬度是否可調 (0:可調, 1:不可調)',
      field: 'resizable',
    },
    {
      width: 150,
      headerName: 'ag過濾器是否啟用 (0:啟用, 1:不啟用)',
      field: 'filter',
    },
    {
      width: 150,
      headerName: '欄位是否隱藏 (0:顯示, 1:隱藏)',
      field: 'hide',
    },
    {
      width: 150,
      headerName: '是否啟用參數(0:啟用, 1:不啟用)',
      field: 'isParamFlag',
    },
    {
      headerName: '複製', field: 'id', width: 150,
      editable: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: [
        {
          context: "複製",
          onClick: this.onBtnClick1.bind(this),
        }
      ]
    },
    {
      headerName: '刪除', field: 'id', width: 150,
      editable: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: [
        {
          context: "刪除",
          onClick: this.onBtnClick2.bind(this),
        }
      ]
    }
  ];

  gridOptions = {
    defaultColDef: {
      editable: false,
      enableRowGroup: false,
      enablePivot: false,
      enableValue: false,
      sortable: false,
      resizable: true,
      filter: true,
    },
    api: null,
    onCellValueChanged: this.onCellValueChanged,
  };

  
  constructor(
    private message: NzMessageService,
    private systemService: SYSTEMService,
    private Modal: NzModalService
  ) {
    this.dataSource.setData(this.TREE_DATA);
    this.frameworkComponents = {
      buttonRenderer: BtnCellRendererType2,
    };
  }

  ngAfterViewInit(): void {
    this.initInsertObj();
    this.treeControl.expandAll();
    this.systemService.getSystemMenu().subscribe((res) => {
      let result: any = res;
      if (result.code == 200) {
        this.TREE_DATA = result.data;
        this.dataSource.setData(this.TREE_DATA);
      } else {
        this.message.create("error", result.message);
      }
    });
  }

  initInsertObj(){
    this.insertObj = 
    {
      path:'',
      agName: '',
      headername:  '',
      field:  '',
      remark:  '',
      sortIndex: 0,
      width: 100,
      sortable: '1',
      resizable: '1',
      filter: '1',
      hide: '1',
      isParamFlag: '1',
    }
  }

  submitForm(): void {
    let saveList = [];
    this.insertObj.path = this.currentNode.path;
    saveList[0] = this.insertObj;
    this.systemService.saveHeaderComponentStatusSys(saveList).subscribe(res => {
      let result: any = res;
      if (result.code === 200) {
        this.message.success("儲存成功")
      } else {
        this.message.error("儲存失敗")
      }
    });
  }

  onswitch(){
    this.gridOptions.defaultColDef.editable = this.switchValue;
    this.gridApi.setDefaultColDef(this.gridOptions.defaultColDef);
  }

  onCellValueChanged(event) {
    event.data.hasChange = true;
  }

  onGridReady(params) {
    this.gridApi = params.api; // To access the grids API
  }

  expend(node) {
    this.currentNode = node;
    this.treeControl.toggle(node)
    let columnState = {};
    columnState['agName'] = '';
    columnState['headername'] = '';
    columnState['path'] = node.path;
    this.systemService.getHeaderComponentStatusSys(columnState).subscribe(res => {
      let result: any = res;
      if (result.code === 200) {
        this.rowData = result.data;
      } else {
        this.message.error("load error")
      }
    });

  }

  getNode(menuName: string): FlatNode | null {
    return this.treeControl.dataNodes.find(n => n.menuName === menuName) || null;
  }

  save() {
    this.gridApi.stopEditing();
    let saveList = this.rowData.filter((element) => element.hasChange == true);
    if(saveList && saveList.length > 0){
      this.systemService.saveHeaderComponentStatusSys(saveList).subscribe(res => {
        let result: any = res;
        if (result.code === 200) {
          this.message.success("儲存成功")
        } else {
          this.message.error("儲存失敗")
        }
      });
    }
  }

  onBtnClick1(e) {
    let copyObj = structuredClone(e.rowData)
    copyObj.hasChange = true;
    copyObj.id = '';
    this.rowData.push(copyObj);
    this.gridApi.setRowData(this.rowData); // Refresh grid
  }

  onBtnClick2(e) {
    let outthis = this;
    this.Modal.confirm({
      nzTitle: '是否確定刪除',
      nzOnOk: () => {
        const index = outthis.rowData.indexOf(e.rowData);
        if (index !== -1) {
          outthis.rowData.splice(index, 1);
          outthis.gridApi.setRowData(this.rowData); // Refresh grid
        }
        outthis.systemService.delHeaderComponentStatusSys(e.rowData).subscribe(res => {
          let result: any = res;
          if (result.code === 200) {
            outthis.message.success("刪除成功")
          } else {
            outthis.message.error("刪除失敗")
          }
        });
      },
      nzOnCancel: () =>
        console.log("cancel")
    });

    
  }

  showModal(): void {
    this.initInsertObj();
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

}

interface ItemData {
  id: string
  agName: string;
  headername: string;
  field: string;
  remark: string;
  sortIndex: number;
  width: number;
  sortable: string;
  resizable: string;
  filter: string;
  hide: string;
  isParamFlag: string;
  del_status: number;
  hasChange: boolean;
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
  level: string | number;
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
  children?: TreeNode[];
}