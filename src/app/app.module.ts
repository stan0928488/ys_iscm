import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ZorroCompomentModule } from './shared/zorro-compoment/zorro-compoment.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData ,LocationStrategy, HashLocationStrategy} from '@angular/common';
import zh from '@angular/common/locales/zh';

///////////////////
import { NgxEchartsModule } from 'ngx-echarts';
//////////////////

import { LoginComponent } from './login/login.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { ErrorPageComponent } from './pages/errorPage/ErrorPage.component';
import { InactivityTimerComponent } from './inactivity-timer/inactivity-timer.component';

import { ORPV101Component } from './pages/ORP/ORPV101/ORPV101.component';
import { ORPP031component } from "./pages/ORP/ORPP031/ORPP031.component";
import { ORPP032component } from "./pages/ORP/ORPP032/ORPP032.component";
import { ORPP029_030component } from "./pages/ORP/ORPP029_030/ORPP029_030.component";
import { ORPP033component } from "./pages/ORP/ORPP033/ORPP033.component";
import { ORPR102Component } from "./pages/ORP/ORPR102/ORPR102.component";
import { ORPR403Component } from "./pages/ORP/ORPR403/ORPR403.component";
import { ORPP040Component } from './pages/ORP/ORPP040/ORPP040.component';
import { ORPP041Component } from './pages/ORP/ORPP041/ORPP041.component';
import { ORPP042Component } from './pages/ORP/ORPP042/ORPP042.component';
import { ORPP043Component } from './pages/ORP/ORPP043/ORPP043.component';
import { ORPPDEMOComponent } from './pages/ORP/ORPPDEMO/ORPPDEMO.component';
import { ORPPDEMO1Component } from './pages/ORP/ORPPDEMO1/ORPPDEMO1.component';
import { ORPP100Component } from './pages/ORP/ORPP100/ORPP100.component';
import { ORPP101Component } from './pages/ORP/ORPP101/ORPP101.component';


import { TRAP001component } from "./pages/TRA/TRAP001/TRAP001.component";


import { PPSI101Component } from "./pages/PPS/PPSI101/PPSI101.component";
import { PPSI200Component } from "./pages/PPS/PPSI200/PPSI200.component";
import { PPSI201Component } from "./pages/PPS/PPSI201/PPSI201.component";
import { PPSI202Component } from "./pages/PPS/PPSI202/PPSI202.component";
import { PPSI203Component } from "./pages/PPS/PPSI203/PPSI203.component";
import { PPSI204Component } from "./pages/PPS/PPSI204/PPSI204.component";
import { PPSI205Component } from "./pages/PPS/PPSI205/PPSI205.component";
import { PPSI210Component } from "./pages/PPS/PPSI210/PPSI210.component";
import { PPSI220Component } from "./pages/PPS/PPSI220/PPSI220.component";
import { PPSI230Component } from "./pages/PPS/PPSI230/PPSI230.component";
import { PPSR300Component } from "./pages/PPS/PPSR300/PPSR300.component";
import { PPSR301Component } from "./pages/PPS/PPSR301/PPSR301.component";
import { PPSR302Component } from "./pages/PPS/PPSR302/PPSR302.component";
import { PPSR310Component } from "./pages/PPS/PPSR310/PPSR310.component";


import { OIPP029component } from "./pages/OIP/OIPP029/OIPP029.component";

import { SPAP100component } from "./pages/SPA/SPAP100/SPAP100.component";
import { SPAP101component } from "./pages/SPA/SPAP101/SPAP101.component";


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
    
    TRAP001component,

    PPSI101Component,
    PPSI200Component,
    PPSI201Component,
    PPSI202Component,
    PPSI203Component,
    PPSI204Component,
    PPSI205Component,
    PPSI210Component,
    PPSI220Component,
    PPSI230Component,
    PPSR300Component,
    PPSR301Component,
    PPSR302Component,

    OIPP029component,
    
    SPAP100component,
    SPAP101component,
    InactivityTimerComponent
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
    ///////
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
    ///////
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
