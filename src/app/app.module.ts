import { NZ_I18N, zh_TW } from 'ng-zorro-antd/i18n';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ZorroCompomentModule } from './shared/zorro-compoment/zorro-compoment.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  registerLocaleData,
  LocationStrategy,
  HashLocationStrategy,
} from '@angular/common';
import zh from '@angular/common/locales/zh';

import { NgxEchartsModule } from 'ngx-echarts';

import { LoginComponent } from './login/login.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { ClipboardModule } from 'ngx-clipboard';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ErrorPageComponent } from './pages/errorPage/ErrorPage.component';
import { InactivityTimerComponent } from './inactivity-timer/inactivity-timer.component';

import { PPSI101Component } from './pages/PPS/PPSI101/PPSI101.component';
import { PPSI102Component } from './pages/PPS/PPSI102/PPSI102.component';
import { PPSI102_NonBarComponent } from './pages/PPS/PPSI102_NonBar/PPSI102_NonBar.component';
import { PPSI103Component } from './pages/PPS/PPSI103/PPSI103.component';
import { PPSI103_NonBarComponent } from './pages/PPS/PPSI103_NonBar/PPSI103_NonBar.component';
import { PPSI104Component } from './pages/PPS/PPSI104/PPSI104.component';
import { PPSI104_NonBarComponent } from './pages/PPS/PPSI104_NonBar/PPSI104_NonBar.component';
import { PPSI105Component } from './pages/PPS/PPSI105/PPSI105.component';
import { PPSI105_NonBarComponent } from './pages/PPS/PPSI105_NonBar/PPSI105_NonBar.component';
import { PPSI106Component } from './pages/PPS/PPSI106/PPSI106.component';
import { PPSI106_NonBarComponent } from './pages/PPS/PPSI106_NonBar/PPSI106_NonBar.component';
import { PPSI107Component } from './pages/PPS/PPSI107/PPSI107.component';
import { PPSI107_NonBarComponent } from './pages/PPS/PPSI107_NonBar/PPSI107_NonBar.component';
import { PPSI108Component } from './pages/PPS/PPSI108/PPSI108.component';
import { PPSI108_NonBarComponent } from './pages/PPS/PPSI108_NonBar/PPSI108_NonBar.component';
import { PPSI109Component } from './pages/PPS/PPSI109/PPSI109.component';
import { PPSI109_NonBarComponent } from './pages/PPS/PPSI109_NonBar/PPSI109_NonBar.component';
import { PPSI110Component } from './pages/PPS/PPSI110/PPSI110.component';
import { PPSI110_NonBarComponent } from './pages/PPS/PPSI110_NonBar/PPSI110_NonBar.component';
import { PPSI111Component } from './pages/PPS/PPSI111/PPSI111.component';
import { PPSI111_NonBarComponent } from './pages/PPS/PPSI111_NonBar/PPSI111_NonBar.component';
import { PPSI120Component } from './pages/PPS/PPSI120/PPSI120.component';
import { PPSI121Component } from './pages/PPS/PPSI121/PPSI121.component';
import { PPSI122Component } from './pages/PPS/PPSI122/PPSI122.component';
import { PPSI123Component } from './pages/PPS/PPSI123/PPSI123.component';
import { PPSI130Component } from './pages/PPS/PPSI130/PPSI130.component';
import { PPSI131Component } from './pages/PPS/PPSI131/PPSI131.component';
import { PPSI200Component } from './pages/PPS/PPSI200/PPSI200.component';
import { PPSI201Component } from './pages/PPS/PPSI201/PPSI201.component';
import { PPSI202Component } from './pages/PPS/PPSI202/PPSI202.component';
import { PPSI203Component } from './pages/PPS/PPSI203/PPSI203.component';
import { PPSI204Component } from './pages/PPS/PPSI204/PPSI204.component';
import { PPSI204_NonBarComponent } from './pages/PPS/PPSI204_NonBar/PPSI204_NonBar.component';
import { PPSI205Component } from './pages/PPS/PPSI205/PPSI205.component';
import { PPSI205_100Component } from './pages/PPS/PPSI205_100/PPSI205_100.component';
import { PPSI205_401Component } from './pages/PPS/PPSI205_401/PPSI205_401.component';
import { PPSI210Component } from './pages/PPS/PPSI210_TabMenu/PPSI210/PPSI210.component';
import { PPSI220Component } from './pages/PPS/PPSI220_TabMenu/PPSI220/PPSI220.component';
import { PPSI230Component } from './pages/PPS/PPSI230_TabMenu/PPSI230/PPSI230.component';
import { PPSR301Component } from './pages/PPS/PPSR301/PPSR301.component';
import { PPSR302Component } from './pages/PPS/PPSR302/PPSR302.component';
import { PPSR303TabMenuComponent } from './pages/PPS/PPSR303_TabMenu/PPSR303_TabMenu.component';
import { PPSR303Component } from './pages/PPS/PPSR303_TabMenu/PPSR303/PPSR303.component';
import { PPSR303FcpComponent } from './pages/PPS/PPSR303_TabMenu/PPSR303_Fcp/PPSR303_Fcp.component';
import { PPSR304Component } from './pages/PPS/PPSR304/PPSR304.component';
import { PPSR305Component } from './pages/PPS/PPSR305/PPSR305.component';
import { PPSR306Component } from './pages/PPS/PPSR306/PPSR306.component';
import { PPSR307Component } from './pages/PPS/PPSR307/PPSR307.component';
import { PPSR308Component } from './pages/PPS/PPSR308/PPSR308.component';
import { PPSR309Component } from './pages/PPS/PPSR309/PPSR309.component';
import { NonPpsiComponent } from './pages/PPS/non-ppsi/non-ppsi.component';
import { PPSI210RefiningOpenSortRendererComponent } from './pages/PPS/PPSI210_TabMenu/PPSI210_Refining/open-sort-renderer-component';
import { PPSI210RefiningSendChoiceRendererComponent } from './pages/PPS/PPSI210_TabMenu/PPSI210_Refining/send-choice-renderer-component';

import { MSHI001Component } from './pages/MSH/MSHI001/MSHI001.component';
import { MSHI002Component } from './pages/MSH/MSHI002/MSHI002.component';
import { MSHP001Component } from './pages/MSH/MSHP001/MSHP001.component';
import { MSHI003Component } from './pages/MSH/MSHI003/MSHI003.component';
import { MSHI004Component } from './pages/MSH/MSHI004/MSHI004.component';

import { LABI001Component } from './pages/LAB/LABI001/LABI001.component';
import { LABP100Component } from './pages/LAB/LABP100/LABP100.component';
import { LABI002Component } from './pages/LAB/LABI002/LABI002.component';
import { LABI003Component } from './pages/LAB/LABI003/LABI003.component';

import { AgGridModule } from 'ag-grid-angular';
import { CalendarModule } from 'primeng/calendar';
import { PrimeDatePickerCellEditorComponent } from './pages/MSH/MSHI003/prime-date-picker-cell-editor';
import { PrimeDatePickerCellEditor } from './pages/MSH/MSHI004/prime-date-picker-cell-editor';
import { AdjShopCodeCellRendererComponent } from './pages/MSH/MSHI003/AdjShopCodeCellRenderer.componet';
import { AdjShopCodeCellSelectEditorComponent } from './pages/MSH/MSHI003/adj-shop-code-cell-select-editor';
import { AdjLineupProcessSelectEditorComponent } from './pages/MSH/MSHI003/adj-lineup-process-cell-select-editor';
import { BtnCellRenderer } from './pages/RENDERER/BtnCellRenderer.component';
import { OpenSortRendererComponent } from './pages/PPS/PPSI210_TabMenu/PPSI210/open-sort-renderer-component';
import { SendChoiceRendererComponent } from './pages/PPS/PPSI210_TabMenu/PPSI210/send-choice-renderer-component';

import { BtnCellRendererUpdate } from './pages/RENDERER/BtnCellRendererUpdate.component';
import { SummaryDatePickerCellEditorComponent } from './pages/PPS/PPSI205/SummaryDatePickerCellEditor.Component';
import { PPSR310Component } from './pages/PPS/PPSR310/PPSR310.component';
import { OpenMachineRendererComponent } from './pages/PPS/PPSI210_TabMenu/PPSI210/open-machine-renderer-component';
import { PPSI210RefiningOpenMachineRendererComponent } from './pages/PPS/PPSI210_TabMenu/PPSI210_Refining/open-machine-renderer-component';
import { AutoCampaignUpdateSaveCellRenderer } from './pages/PPS/PPSI205/AutoCampaign-UpdateSave-Cell-Renderer.component';
import { PlanItemUpdateSaveCellRenderer } from './pages/PPS/PPSI206_TabMenu/PPSI206_SET/PlanItemUpdateSaveCellRenderer.component';
import { PlanItemDatePickerCellEditor } from './pages/PPS/PPSI206_TabMenu/PPSI206_SET/PlanItemDatePickerCellEditor.component';
import { ListPpsBarComponent } from './pages/PPS/list-pps-bar/list-pps-bar.component';
import { ListPpsNonbarComponent } from './pages/PPS/list-pps-nonbar/list-pps-nonbar.component';
import { PPSI201NonBarComponent } from './pages/PPS/PPSI201_NonBar/PPSI201_NonBar.component';
import { PPSR311Component } from './pages/PPS/PPSR311/PPSR311.component';
import { ListShipRepoComponent } from './pages/PPS/list-ship-repo/list-ship-repo.component';
import { PPSR312Component } from './pages/PPS/PPSR312/PPSR312.component';
import { PPSI202TabMenuComponent } from './pages/PPS/PPSI202_TabMenu/PPSI202_TabMenu.component';
import { PPSI202NonBarComponent } from './pages/PPS/PPSI202_NonBar/PPSI202_NonBar.component';
import { PPSI202_NonBarEditButtonRendererComponent } from './pages/PPS/PPSI202_NonBar/PPSI202_NonBarEditButtonRendererComponent';
import { PPSI202_NonBarEditStartTimeCellEditorComponent } from './pages/PPS/PPSI202_NonBar/PPSI202_NonBarEditStartTimeCellEditorComponent';
import { PPSI202_NonBarEditEndTimeCellEditorComponent } from './pages/PPS/PPSI202_NonBar/PPSI202_NonBarEditEndTimeeCellEditorComponent';
import { PPSI202_NonBarEditShopCellEditorComponent } from './pages/PPS/PPSI202_NonBar/PPSI202_NonBarEditShopCellEditorComponent';
import { PPSI202_NonBarEditEquipCellEditorComponent } from './pages/PPS/PPSI202_NonBar/PPSI202_NonBarEditEquipCellEditorComponent';
import { PPSI202_NonBarEditShutdownTypeCellEditorComponent } from './pages/PPS/PPSI202_NonBar/PPSI202_NonBarEditShutdownTypeCellEditorComponent';
import { PPSR344Component } from './pages/PPS/PPSR344/PPSR344.component';
import { PPSR321Component } from './pages/PPS/PPSR321/PPSR321.component';
import { PPSR321DetailTabMenuComponent } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321-detail-tab-menu.component';
import { PPSR322Component } from './pages/PPS/PPSR322/PPSR322.component';
import { PPSR322Child1Component } from './pages/PPS/PPSR322/PPSR322-child1/PPSR322-child1.component';
import { PPSR322Child2Component } from './pages/PPS/PPSR322/PPSR322-child2/PPSR322-child2.component';
import { PPSR322Child3Component } from './pages/PPS/PPSR322/PPSR322-child3/PPSR322-child3.component';
import { PPSR322Child4Component } from './pages/PPS/PPSR322/PPSR322-child4/PPSR322-child4.component';
import { PPSR322Child5Component } from './pages/PPS/PPSR322/PPSR322-child5/PPSR322-child5.component';
import { PPSR322Child6Component } from './pages/PPS/PPSR322/PPSR322-child6/PPSR322-child6.component';
import { PPSR321Detail01Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail01/PPSR321-detail01.component';
import { PPSR321Detail02Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail02/PPSR321-detail02.component';
import { PPSR321Detail0301Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail0301/PPSR321-detail0301.component';
import { PPSR321Detail0302Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail0302/PPSR321-detail0302.component';
import { PPSR321Detail0303Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail0303/PPSR321-detail0303.component';
import { PPSR321Detail04Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail04/PPSR321-detail04.component';
import { PPSR322Child7Component } from './pages/PPS/PPSR322/PPSR322-child7/PPSR322-child7.component';
import { PPSR343Component } from './pages/PPS/PPSR343/PPSR343.component';
import { ListSaleInputComponent } from './pages/PPS/list-sale-input/list-sale-input.component';
import { PPSR340Component } from './pages/PPS/PPSR340/PPSR340.component';
import { PPSR341Component } from './pages/PPS/PPSR341/PPSR341.component';
import { PPSR313Component } from './pages/PPS/PPSR313/PPSR313.component';
import { PPSR322Child8Component } from './pages/PPS/PPSR322/PPSR322-child8/PPSR322-child8.component';
import { PPSR322Child9Component } from './pages/PPS/PPSR322/PPSR322-child9/PPSR322-child9.component';
import { PPSI210TabMenuComponent } from './pages/PPS/PPSI210_TabMenu/PPSI210_TabMenu.component';
import { PPSI210RefiningComponent } from './pages/PPS/PPSI210_TabMenu/PPSI210_Refining/PPSI210_Refining.component';
import { PPSI230TabMenuComponent } from './pages/PPS/PPSI230_TabMenu/PPSI230_TabMenu.component';
import { PPSI230RefiningComponent } from './pages/PPS/PPSI230_TabMenu/PPSI230_Refining/PPSI230_Refining.component';
import { PPSI220TabMenuComponent } from './pages/PPS/PPSI220_TabMenu/PPSI220_TabMenu.component';
import { PPSI220RefiningComponent } from './pages/PPS/PPSI220_TabMenu/PPSI220_Refining/PPSI220_Refining.component';
import { PPSR345Component } from './pages/PPS/PPSR345/PPSR345.component';
import { PPSR345AVERAGEComponent } from './pages/PPS/PPSR345AVERAGE/PPSR345AVERAGE.component';

import { PPSCustomHeaderComponent } from './pages/MSH/MSHP001/ppscustom-header.component';
import { AGCustomHeaderComponent } from './shared/ag-component/ag-custom-header-component';
import { AGCustomActionCellComponent } from 'src/app/shared/ag-component/ag-custom-action-cell-component';
import { ACCP100component } from './pages/ACC/ACCP100component';
import { JwtInterceptor } from './services/config/jwt.interceptor';
import { AccessDinedPageComponent } from './pages/AccessDinedPage/AccessDinedPage.component';
import { PPSI112TabMenuComponent } from './pages/PPS/PPSI112_TabMenu/PPSI112_TabMenu.component';
import { PPSI112Component } from './pages/PPS/PPSI112_TabMenu/PPSI112/PPSI112.component';
import { PPSI112RefinIngComponent } from './pages/PPS/PPSI112_TabMenu/PPSI112_Refining/PPSI112_Refining.component';
import { PPSI206TabMenuComponent } from './pages/PPS/PPSI206_TabMenu/PPSI206_TabMenu.component';
import { PPSI206SETComponent } from './pages/PPS/PPSI206_TabMenu/PPSI206_SET/PPSI206_SET.component';
import { PPSI206RESComponent } from './pages/PPS/PPSI206_TabMenu/PPSI206_RES/PPSI206_RES.component';
import { ManageMenuComponent } from './pages/SYSTEM/manage-menu/manage-menu.component';
import { ManageRoleComponent } from './pages/SYSTEM/manage-role/manage-role.component';
import { ManageRoleActionCellComponent } from './pages/SYSTEM/manage-role/manage-role-action-cell-component';
import { ManageUserComponent } from './pages/SYSTEM/manage-user/manage-user.component';
import { BtnCellRendererType2 } from './pages/RENDERER/BtnCellRendererType2.component';
import { UserProfileComponent } from './pages/USER/user-profile/user-profile.component';
import { CommonApiEditComponent } from './pages/SYSTEM/manage-menu/common-api-edit-component';
import { PPSI205A100Component } from './pages/PPS/ppsi205-a100/ppsi205-a100.component';
import { PPSI205A401Component } from './pages/PPS/ppsi205-a401/ppsi205-a401.component';
import { PPSI111EditShopCellEditorComponent } from './pages/PPS/PPSI111/PPSI111_EditShopCellEditorComponent';
import { PPSI111EditMachineCellEditorComponent } from './pages/PPS/PPSI111/PPSI111_EditMachineCellEditorComponent';
import { PPSI111EditCombinCellEditorComponent } from './pages/PPS/PPSI111/PPSI111_EditCombinCellEditorComponent';
import { DatePickerCellEditor } from './pages/RENDERER/DatePickerCellEditor.component';
import { PPSI202EditEndTimeCellEditorComponent } from './pages/PPS/PPSI202/PPSI202EditEndTimeeCellEditorComponent';
import { PPSI202EditEquipCellEditorComponent } from './pages/PPS/PPSI202/PPSI202EditEquipCellEditorComponent';
import { PPSI202EditShopCellEditorComponent } from './pages/PPS/PPSI202/PPSI202EditShopCellEditorComponent';
import { PPSI202EditShutdownTypeCellEditorComponent } from './pages/PPS/PPSI202/PPSI202EditShutdownTypeCellEditorComponent';
import { PPSI202EditStartTimeCellEditorComponent } from './pages/PPS/PPSI202/PPSI202EditStartTimeCellEditorComponent';
import { PPSI203ActionCellComponent } from './pages/PPS/PPSI203/PPSI203-action-cell-component';
import { MainComponent } from './main/main.component';
import { RecursionMenusComponent } from './main/recursion-menus.component';
import { AgHeadSeetingComponent } from './pages/SYSTEM/ag-head-seeting/ag-head-seeting.component';
import { NumberCellEditorComponent } from './pages/RENDERER/number-cell-editor.component';
import { SearchMenusComponent } from '../app/widget/search-menus/search-menus.component';


registerLocaleData(zh);

@NgModule({
  declarations: [
    AccessDinedPageComponent,
    AppComponent,
    LoginComponent,
    ErrorPageComponent,
    ACCP100component,

    PPSI101Component,
    PPSI102Component,
    PPSI102_NonBarComponent,
    PPSI103Component,
    PPSI103_NonBarComponent,
    PPSI104Component,
    PPSI104_NonBarComponent,
    PPSI105Component,
    PPSI105_NonBarComponent,
    PPSI106Component,
    PPSI106_NonBarComponent,
    PPSI107Component,
    PPSI107_NonBarComponent,
    PPSI108Component,
    PPSI108_NonBarComponent,
    PPSI109Component,
    PPSI109_NonBarComponent,
    PPSI110Component,
    PPSI110_NonBarComponent,
    PPSI111Component,
    PPSI111_NonBarComponent,
    PPSI120Component,
    PPSI121Component,
    PPSI122Component,
    PPSI123Component,
    PPSI130Component,
    PPSI131Component,
    NonPpsiComponent,
    PPSI200Component,
    PPSI201Component,
    PPSI202Component,
    PPSI203Component,
    PPSI204Component,
    PPSI204_NonBarComponent,
    PPSI205Component,
    PPSI205_100Component,
    PPSI205_401Component,
    PPSI210Component,
    PPSI210RefiningComponent,
    PPSI220Component,
    PPSI220RefiningComponent,
    PPSI230Component,
    PPSI230RefiningComponent,
    PPSR301Component,
    PPSR302Component,
    PPSR303TabMenuComponent,
    PPSR303Component,
    PPSR303FcpComponent,
    PPSR304Component,
    PPSR305Component,
    PPSR306Component,
    PPSR307Component,
    InactivityTimerComponent,
    MSHI001Component,
    MSHI002Component,
    MSHP001Component,
    LABI001Component,
    LABP100Component,
    MSHI003Component,
    MSHI004Component,
    PrimeDatePickerCellEditorComponent,
    PrimeDatePickerCellEditor,
    LABI002Component,
    LABI003Component,
    AdjShopCodeCellRendererComponent,
    AdjShopCodeCellSelectEditorComponent,
    AdjLineupProcessSelectEditorComponent,
    PPSR308Component,
    PPSR309Component,
    BtnCellRenderer,
    OpenSortRendererComponent,
    OpenMachineRendererComponent,
    SendChoiceRendererComponent,
    PPSI210RefiningOpenSortRendererComponent,
    PPSI210RefiningOpenMachineRendererComponent,
    PPSI210RefiningSendChoiceRendererComponent,
    PPSI112TabMenuComponent,
    PPSI112Component,
    PPSI112RefinIngComponent,
    BtnCellRendererUpdate,
    PlanItemDatePickerCellEditor,
    PPSR310Component,
    AutoCampaignUpdateSaveCellRenderer,
    SummaryDatePickerCellEditorComponent,
    PlanItemUpdateSaveCellRenderer,
    PlanItemDatePickerCellEditor,
    ListPpsBarComponent,
    ListPpsNonbarComponent,
    PPSI201NonBarComponent,
    PPSR311Component,
    ListShipRepoComponent,
    PPSR312Component,
    PPSI202TabMenuComponent,
    PPSI202NonBarComponent,
    PPSI202_NonBarEditButtonRendererComponent,
    PPSI202_NonBarEditStartTimeCellEditorComponent,
    PPSI202_NonBarEditEndTimeCellEditorComponent,
    PPSI202_NonBarEditShopCellEditorComponent,
    PPSI202_NonBarEditEquipCellEditorComponent,
    PPSI202_NonBarEditShutdownTypeCellEditorComponent,
    PPSI206TabMenuComponent,
    PPSI206SETComponent,
    PPSI206RESComponent,
    PPSR344Component,
    PPSR321Component,
    PPSR321DetailTabMenuComponent,
    PPSR321Detail01Component,
    PPSR321Detail02Component,
    PPSR322Component,
    PPSR322Child1Component,
    PPSR322Child2Component,
    PPSR322Child3Component,
    PPSR322Child4Component,
    PPSR322Child5Component,
    PPSR322Child6Component,
    PPSR321Detail0301Component,
    PPSR321Detail0302Component,
    PPSR321Detail0303Component,
    PPSR321Detail04Component,
    PPSR322Child7Component,
    PPSR343Component,
    ListSaleInputComponent,
    PPSR340Component,
    PPSR341Component,
    PPSR313Component,
    PPSR322Child8Component,
    PPSR322Child9Component,
    PPSI210TabMenuComponent,
    PPSI230TabMenuComponent,
    PPSI220TabMenuComponent,
    PPSCustomHeaderComponent,
    AGCustomHeaderComponent,
    ManageMenuComponent,
    AGCustomActionCellComponent,
    ManageRoleComponent,
    ManageRoleActionCellComponent,
    ManageUserComponent,
    BtnCellRendererType2,
    UserProfileComponent,
    CommonApiEditComponent,
    PPSI205A100Component,
    PPSI205A401Component,
    PPSI111EditShopCellEditorComponent,
    PPSI111EditMachineCellEditorComponent,
    PPSI111EditCombinCellEditorComponent,
    DatePickerCellEditor,
    PPSI202EditEndTimeCellEditorComponent,
    PPSI202EditEquipCellEditorComponent,
    PPSI202EditShopCellEditorComponent,
    PPSI202EditShutdownTypeCellEditorComponent,
    PPSI202EditStartTimeCellEditorComponent,
    PPSI203ActionCellComponent,
    PPSR345Component,
    PPSR345AVERAGEComponent,
    MainComponent,
    RecursionMenusComponent,
    AgHeadSeetingComponent,
    NumberCellEditorComponent,
    SearchMenusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule,
    ZorroCompomentModule,
    NgxJsonViewerModule,
    AgGridModule,
    NzTimelineModule,
    CalendarModule,
    ClipboardModule,
    NzMessageModule,
    NzGridModule,
    NzCardModule,
    NzSelectModule,
    ///////
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    ///////
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NZ_I18N, useValue: zh_TW },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
