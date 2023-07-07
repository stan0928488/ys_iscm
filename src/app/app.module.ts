import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ZorroCompomentModule } from './shared/zorro-compoment/zorro-compoment.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  registerLocaleData,
  LocationStrategy,
  HashLocationStrategy,
} from '@angular/common';
import zh from '@angular/common/locales/zh';

///////////////////
import { NgxEchartsModule } from 'ngx-echarts';
//////////////////

import { LoginComponent } from './login/login.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { ClipboardModule } from 'ngx-clipboard';

import { ErrorPageComponent } from './pages/errorPage/ErrorPage.component';
import { InactivityTimerComponent } from './inactivity-timer/inactivity-timer.component';

import { ORPV101Component } from './pages/ORP/ORPV101/ORPV101.component';
import { ORPP031component } from './pages/ORP/ORPP031/ORPP031.component';
import { ORPP032component } from './pages/ORP/ORPP032/ORPP032.component';
import { ORPP029_030component } from './pages/ORP/ORPP029_030/ORPP029_030.component';
import { ORPP033component } from './pages/ORP/ORPP033/ORPP033.component';
import { ORPR102Component } from './pages/ORP/ORPR102/ORPR102.component';
import { ORPR403Component } from './pages/ORP/ORPR403/ORPR403.component';
import { ORPP040Component } from './pages/ORP/ORPP040/ORPP040.component';
import { ORPP041Component } from './pages/ORP/ORPP041/ORPP041.component';
import { ORPP042Component } from './pages/ORP/ORPP042/ORPP042.component';
import { ORPP043Component } from './pages/ORP/ORPP043/ORPP043.component';
import { ORPPDEMOComponent } from './pages/ORP/ORPPDEMO/ORPPDEMO.component';
import { ORPPDEMO1Component } from './pages/ORP/ORPPDEMO1/ORPPDEMO1.component';
import { ORPP100Component } from './pages/ORP/ORPP100/ORPP100.component';
import { ORPP101Component } from './pages/ORP/ORPP101/ORPP101.component';
import { ORPPCHATDEMOComponent } from './pages/ORP/ORPPCHATDEMO/ORPPCHATDEMO.component';

import { TRAP001component } from './pages/TRA/TRAP001/TRAP001.component';

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
import { PPSI210Component } from './pages/PPS/PPSI210/PPSI210.component';
import { PPSI220Component } from './pages/PPS/PPSI220/PPSI220.component';
import { PPSI230Component } from './pages/PPS/PPSI230/PPSI230.component';
import { PPSR301Component } from './pages/PPS/PPSR301/PPSR301.component';
import { PPSR302Component } from './pages/PPS/PPSR302/PPSR302.component';
import { PPSR303Component } from './pages/PPS/PPSR303/PPSR303.component';

import { PPSR304Component } from './pages/PPS/PPSR304/PPSR304.component';
import { PPSR305Component } from './pages/PPS/PPSR305/PPSR305.component';
import { PPSR306Component } from './pages/PPS/PPSR306/PPSR306.component';
import { PPSR307Component } from './pages/PPS/PPSR307/PPSR307.component';
import { OIPP029component } from './pages/OIP/OIPP029/OIPP029.component';

import { SPAP100component } from './pages/SPA/SPAP100/SPAP100.component';
import { SPAP101component } from './pages/SPA/SPAP101/SPAP101.component';

import { MSHI001Component } from './pages/MSH/MSHI001/MSHI001.component';
import { MSHI002Component } from './pages/MSH/MSHI002/MSHI002.component';
import { MSHP001Component } from './pages/MSH/MSHP001/MSHP001.component';

import { LABI001Component } from './pages/LAB/LABI001/LABI001.component';
import { LABP100Component } from './pages/LAB/LABP100/LABP100.component';
import { AgGridModule } from 'ag-grid-angular';
import { MSHI003Component } from './pages/MSH/MSHI003/MSHI003.component';
import { MSHI004Component } from './pages/MSH/MSHI004/MSHI004.component';
import { CalendarModule } from 'primeng/calendar';
import { PrimeDatePickerCellEditorComponent } from './pages/MSH/MSHI003/prime-date-picker-cell-editor';
import { PrimeDatePickerCellEditor } from './pages/MSH/MSHI004/prime-date-picker-cell-editor';
import { LABI002Component } from './pages/LAB/LABI002/LABI002.component';
import { LABI003Component } from './pages/LAB/LABI003/LABI003.component';
import { AdjShopCodeCellRendererComponent } from './pages/MSH/MSHI003/AdjShopCodeCellRenderer.componet';
import { AdjShopCodeCellSelectEditorComponent } from './pages/MSH/MSHI003/adj-shop-code-cell-select-editor';
import { AdjLineupProcessSelectEditorComponent } from './pages/MSH/MSHI003/adj-lineup-process-cell-select-editor';
import { PPSR308Component } from './pages/PPS/PPSR308/PPSR308.component';
import { PPSR309Component } from './pages/PPS/PPSR309/PPSR309.component';
import { NonPpsiComponent } from './pages/PPS/non-ppsi/non-ppsi.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorPageComponent,

    ORPV101Component,
    ORPP100Component,
    ORPP101Component,
    ORPR403Component,
    ORPP031component,
    ORPP032component,
    ORPP029_030component,
    ORPP033component,
    ORPR102Component,
    ORPP040Component,
    ORPP041Component,
    ORPP042Component,
    ORPP043Component,
    ORPPDEMOComponent,
    ORPPDEMO1Component,
    ORPPCHATDEMOComponent,
    TRAP001component,

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
    PPSI220Component,
    PPSI230Component,
    PPSR301Component,
    PPSR302Component,
    PPSR303Component,
    PPSR304Component,
    PPSR305Component,
    PPSR306Component,
    PPSR307Component,
    OIPP029component,

    SPAP100component,
    SPAP101component,
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
    ///////
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    ///////
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
