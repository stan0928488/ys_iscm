import { Type } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
// 动态组件
export class DynamicComponent {
  constructor(public component: Type<NzSafeAny>, public data: NzSafeAny) {}
}

// 列表搜索
export interface SearchCommonVO<T> {
  pageNum: number;
  pageSize: number;
  filters?: T;
}