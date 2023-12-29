import { AfterViewInit, Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators
} from '@angular/forms';

import {NzMessageService} from "ng-zorro-antd/message";
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { SYSTEMService } from 'src/app/services/SYSTEM/SYSTEM.service';

import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements AfterViewInit {

  //tree
  private transformer = (node: TreeNode, level: number): FlatNode => ({
    open: !!node.children && node.children.length > 0,
    menuName: node.menuName,
    level,
    icon : node.icon,
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

  //normal

  user: User

  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    checkPassword: FormControl<string>;
    nickname: FormControl<string>;
    phoneNumberPrefix: FormControl<'+86' | '+87'>;
    phoneNumber: FormControl<string>;
    website: FormControl<string>;
    captcha: FormControl<string>;
    agree: FormControl<boolean>;
  }>;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  ngAfterViewInit(): void {
  }

  expend(node){
    this.treeControl.toggle(node)
  }

  ngOnInit(): void {
    this.systemService.getCurrentUserMenuFunction().subscribe((res) => {
      let result: any = res;
      if (result.code == 200) {
        this.user = result.data;

        this.TREE_DATA = result.data.userMenus;
        this.dataSource.setData(this.TREE_DATA);

        // this.systemService.getMenuByUserPosition({
        //   "positionCode": this.user.positionCode
        // }).subscribe((res) => {
        //   let result:any = res;
        //   if(result.code == 200){
        //     this.TREE_DATA = result.data;
        //     this.dataSource.setData(this.TREE_DATA);
        //   }
        // });
      } else {
        this.message.create("error", "result.message");
        
      }
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getNode(menuName: string): FlatNode | null {
    return this.treeControl.dataNodes.find(n => n.menuName === menuName) || null;
  }

  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private systemService: SYSTEMService,
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      nickname: ['', [Validators.required]],
      phoneNumberPrefix: '+86' as '+86' | '+87',
      phoneNumber: ['', [Validators.required]],
      website: ['', [Validators.required]],
      captcha: ['', [Validators.required]],
      agree: [false]
    });
    this.treeControl.expandAll();
  }

}

interface User {
  id: string;
  useStatus: string;
  delStatus: string;
  createUser: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  applicationFrom: string;
  userCode: string;
  userName: string;
  userNickName: string;
  userAvatar: string;
  // salt: string;
  email: string;
  phone: string;
  landline: string;
  platform: string;
  positionName: string;
  positionCode: string;
  plant: string;
  userMenus: string;
  userRoles: Role[]
  permission: TreeNode[]
}

interface Role {
  id: string
  useStatus: string
  delStatus: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  applicationFrom: string
  roleName: string
  roleCode: string
  roleType: string
  roleDetail: string
  remark: string
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
  icon: string;
}