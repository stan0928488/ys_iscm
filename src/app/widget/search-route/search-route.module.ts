import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZorroCompomentModule } from 'src/app/shared/zorro-compoment/zorro-compoment.module';
import { ModalWrapService } from '../base-modal';

import { SearchRouteComponent } from './search-route.component';
@NgModule({
  declarations: [SearchRouteComponent],
  imports: [CommonModule, ZorroCompomentModule, FormsModule],
  providers: [ModalWrapService]
})
export class SearchRouteModule {}
