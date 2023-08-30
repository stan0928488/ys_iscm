import { NgModule } from '@angular/core';
//zorro
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

const zorroComponent :any = [
  NzButtonModule
 , NzLayoutModule
 , NzIconModule
 , NzDividerModule
 , NzGridModule
 , NzBreadCrumbModule
 , NzDropDownModule
 , NzCheckboxModule
 , NzDatePickerModule
 , NzFormModule
 , NzInputModule
 , NzSelectModule
 , NzSwitchModule
 , NzTimePickerModule
 , NzUploadModule
 , NzCardModule
 , NzCalendarModule
 ,NzPaginationModule
 ,NzListModule
 ,NzSpinModule
 ,NzTableModule
 ,NzInputNumberModule
 ,NzModalModule
 ,NzCollapseModule
 ,NzPopoverModule
 ,NzRadioModule
 ,NzTabsModule
 ,NzProgressModule
 ,NzPopconfirmModule
 ,NzResultModule
 ,NzDrawerModule
 ,NzTagModule
 ,NzToolTipModule
 ,NzBadgeModule
]
@NgModule({
  imports: [
    ...zorroComponent
  ],
  declarations: [],
  exports:[...zorroComponent]

})
export class ZorroCompomentModule { }
