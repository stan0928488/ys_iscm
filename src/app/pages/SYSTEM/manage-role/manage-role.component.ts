import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';
import { ManageRoleActionCellComponent } from './manage-role-action-cell-component';
import { MENU_TOKEN } from '../config/menu';
import { Menu } from '../config/types';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.css']
})
export class ManageRoleComponent implements OnInit, AfterViewInit {

  isSpinning = false;

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

  menuPermissionsManage(rowData:any){
    this.rolePermissionsDrawerTitle = `管理「${rowData.roleName}」的菜單權限`
    this.rolePermissionsDrawerVisible = true;
  }

  rolePermissionsDrawerClose(){
    this.rolePermissionsDrawerVisible = false;
  }

  rolePermissionsManageHandler(){

  }


}
