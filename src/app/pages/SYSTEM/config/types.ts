/*
 * 菜单
 * */

export interface Menu {
  id: number | string;
  fatherId: number | string;
  path: string;
  menuName: string;
  menuType: 'C' | 'F' | 'A'; // F:權限API，C:菜單，A:不需權限通用API
  icon?: string; // 如果showIcon为false，设置这个为搜索窗口时，最左侧的icon
  alIcon?: string; // 如果showIcon为false，设置这个为搜索窗口时，最左侧的icon
  open?: boolean;
  selected?: boolean; // 是否选中
  children?: Menu[];
  code?: string; // 权限码
  newLinkFlag?: 0 | 1; // 是否是新页

  parentId : number | string;
  useStatus?: string;
  delStatus?: number;
  createUser?: string;
  createTime?: string;
  updateUser?: string;
  updateTime?: string;
  sortIndex?: string;
  level?: string;
  roles?: string;


}
