import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ORPP031component } from './pages/ORP/ORPP031/ORPP031.component';
import { ORPP032component } from './pages/ORP/ORPP032/ORPP032.component';
import { ORPP029_030component } from './pages/ORP/ORPP029_030/ORPP029_030.component';
import { ORPP033component } from './pages/ORP/ORPP033/ORPP033.component';
import { OIPP029component } from './pages/OIP/OIPP029/OIPP029.component';
import { ORPV101Component } from './pages/ORP/ORPV101/ORPV101.component';
import { ORPP100Component } from './pages/ORP/ORPP100/ORPP100.component';
import { ORPP101Component } from './pages/ORP/ORPP101/ORPP101.component';
import { ORPR102Component } from './pages/ORP/ORPR102/ORPR102.component';
import { ORPR403Component } from './pages/ORP/ORPR403/ORPR403.component';
import { ORPP040Component } from './pages/ORP/ORPP040/ORPP040.component';
import { ORPP041Component } from './pages/ORP/ORPP041/ORPP041.component';
import { ORPP042Component } from './pages/ORP/ORPP042/ORPP042.component';
import { ORPP043Component } from './pages/ORP/ORPP043/ORPP043.component';
import { ORPPDEMOComponent } from './pages/ORP/ORPPDEMO/ORPPDEMO.component';
import { ORPPDEMO1Component } from './pages/ORP/ORPPDEMO1/ORPPDEMO1.component';
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
import { PPSI210Component } from './pages/PPS/PPSI210_TabMenu/PPSI210/PPSI210.component';
import { PPSI220Component } from './pages/PPS/PPSI220_TabMenu/PPSI220/PPSI220.component';
import { PPSI230Component } from './pages/PPS/PPSI230_TabMenu/PPSI230/PPSI230.component';
import { PPSR301Component } from './pages/PPS/PPSR301/PPSR301.component';
import { PPSR302Component } from './pages/PPS/PPSR302/PPSR302.component';
import { PPSR303Component } from './pages/PPS/PPSR303/PPSR303.component';
import { PPSR304Component } from './pages/PPS/PPSR304/PPSR304.component';
import { PPSR305Component } from './pages/PPS/PPSR305/PPSR305.component';
import { PPSR306Component } from './pages/PPS/PPSR306/PPSR306.component';
import { PPSR307Component } from './pages/PPS/PPSR307/PPSR307.component';
import { PPSR308Component } from './pages/PPS/PPSR308/PPSR308.component';
import { PPSR309Component } from './pages/PPS/PPSR309/PPSR309.component';
import { SPAP100component } from './pages/SPA/SPAP100/SPAP100.component';
import { SPAP101component } from './pages/SPA/SPAP101/SPAP101.component';

import { MSHI001Component } from './pages/MSH/MSHI001/MSHI001.component';
import { MSHI002Component } from './pages/MSH/MSHI002/MSHI002.component';
import { MSHP001Component } from './pages/MSH/MSHP001/MSHP001.component';

import { LABI001Component } from './pages/LAB/LABI001/LABI001.component';
import { LABP100Component } from './pages/LAB/LABP100/LABP100.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService as AuthGuard } from './services/auth/auth-guard.service';
import { ErrorPageComponent } from './pages/errorPage/ErrorPage.component';
import { MSHI003Component } from './pages/MSH/MSHI003/MSHI003.component';
import { MSHI003CanDeactivateGuard } from './pages/MSH/MSHI003/MSHI003.can.deactivate.guard';
import { MSHI004Component } from './pages/MSH/MSHI004/MSHI004.component';
import { LABI002Component } from './pages/LAB/LABI002/LABI002.component';
import { LABI003Component } from './pages/LAB/LABI003/LABI003.component';
import { PPSI112Component } from './pages/PPS/PPSI112/PPSI112.component';
import { PPSR310Component } from './pages/PPS/PPSR310/PPSR310.component';
import { PPSI201NonBarComponent } from './pages/PPS/PPSI201_NonBar/PPSI201_NonBar.component';
import { PPSR311Component } from './pages/PPS/PPSR311/PPSR311.component';
import { PPSR312Component } from './pages/PPS/PPSR312/PPSR312.component';
import { PPSI202TabMenuComponent } from './pages/PPS/PPSI202_TabMenu/PPSI202_TabMenu.component';
import { PPSI202NonBarComponent } from './pages/PPS/PPSI202_NonBar/PPSI202_NonBar.component';
import { PPSR344Component } from './pages/PPS/PPSR344/PPSR344.component';
import { PPSR321Component } from './pages/PPS/PPSR321/PPSR321.component';
import { PPSR321Detail01Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail01/PPSR321-detail01.component';
import { PPSR321Detail02Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail02/PPSR321-detail02.component';
import { PPSR321CanDeactivateGuard } from './pages/PPS/PPSR321/PPSR321.CanDeactivateGuard';
import { PPSR321Detail01CanDeactivateGuard } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail01/PPSR321-detail01.CanDeactivateGuard';
import { PPSR322Component } from './pages/PPS/PPSR322/PPSR322.component';
import { PPSR322Child1Component } from './pages/PPS/PPSR322/PPSR322-child1/PPSR322-child1.component';
import { PPSR322Child2Component } from './pages/PPS/PPSR322/PPSR322-child2/PPSR322-child2.component';
import { PPSR322Child3Component } from './pages/PPS/PPSR322/PPSR322-child3/PPSR322-child3.component';
import { PPSR322Child4Component } from './pages/PPS/PPSR322/PPSR322-child4/PPSR322-child4.component';
import { PPSR322Child5Component } from './pages/PPS/PPSR322/PPSR322-child5/PPSR322-child5.component';
import { PPSR322Child6Component } from './pages/PPS/PPSR322/PPSR322-child6/PPSR322-child6.component';
import { PPSR321Detail02CanDeactivateGuard } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail02/PPSR321Detail02CanDeactivateGuard';
import { PPSR321Detail0301Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail0301/PPSR321-detail0301.component';
import { PPSR321Detail0301CanDeactivateGuard } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail0301/PPSR321Detail0301CanDeactivateGuard';
import { PPSR321Detail0302Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail0302/PPSR321-detail0302.component';
import { PPSR321Detail0302CanDeactivateGuard } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail0302/PPSR321Detail0301CanDeactivateGuard';
import { PPSR321Detail0303Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail0303/PPSR321-detail0303.component';
import { PPSR322Child7Component } from './pages/PPS/PPSR322/PPSR322-child7/PPSR322-child7.component';
import { PPSR321Detail0303CanDeactivateGuard } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail0303/PPSR321Detail0301CanDeactivateGuard';
import { PPSR330YwComponent } from './pages/PPS/PPSR330_yw/PPSR330_yw.component';
import { PPSR331YwComponent } from './pages/PPS/PPSR331_yw/PPSR331_yw.component';
import { PPSR332YwComponent } from './pages/PPS/PPSR332_yw/PPSR332_yw.component';
import { PPSR343Component } from './pages/PPS/PPSR343/PPSR343.component';
import { PPSR340Component } from './pages/PPS/PPSR340/PPSR340.component';
import { PPSR341Component } from './pages/PPS/PPSR341/PPSR341.component';

import { POMP001Component } from './pages/POM/pomp001/pomp001.component';
import { POMP002Component } from './pages/POM/pomp002/pomp002.component';
import { POMP003Component } from './pages/POM/pomp003/pomp003.component';
import { PPSR313Component } from './pages/PPS/PPSR313/PPSR313.component';
import { PPSR322Child8Component } from './pages/PPS/PPSR322/PPSR322-child8/PPSR322-child8.component';
import { PPSR322Child9Component } from './pages/PPS/PPSR322/PPSR322-child9/PPSR322-child9.component';
import { PPSR321Detail04Component } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail04/PPSR321-detail04.component';
import { PPSR321Detail04CanDeactivateGuard } from './pages/PPS/PPSR321/PPSR321_DetailTabMenu/PPSR321_Detail04/PPSR321Detail04CanDeactivateGuard';
import { PPSI210TabMenuComponent } from './pages/PPS/PPSI210_TabMenu/PPSI210_TabMenu.component';
import { PPSI210RefiningComponent } from './pages/PPS/PPSI210_TabMenu/PPSI210_Refining/PPSI210_Refining.component';
import { PPSI230TabMenuComponent } from './pages/PPS/PPSI230_TabMenu/PPSI230_TabMenu.component';
import { PPSI230RefiningComponent } from './pages/PPS/PPSI230_TabMenu/PPSI230_Refining/PPSI230_Refining.component';
import { PPSI220TabMenuComponent } from './pages/PPS/PPSI220_TabMenu/PPSI220_TabMenu.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  /* ORP & OIP & TRA */
  {
    path: 'ORPInput',
    children: [
      { path: '', redirectTo: '/ORPInput/V101', pathMatch: 'full' }, // 100開始
      { path: 'V101', component: ORPP029_030component },
      { path: 'V102', component: ORPP031component },
      { path: 'V103', component: ORPP032component },
      { path: 'V105', component: OIPP029component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'ORPPlot',
    children: [
      { path: '', redirectTo: '/ORPPlot/P201', pathMatch: 'full' }, // 200開始
      { path: 'P201', component: ORPP033component },
      { path: 'P203', component: ORPP101Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'ORPExe',
    children: [
      { path: '', redirectTo: '/ORPExe/E301', pathMatch: 'full' }, // 300開始
      { path: 'E301', component: ORPV101Component },
      { path: 'E306', component: ORPP100Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'ORPRepo',
    children: [
      { path: '', redirectTo: '/ORPRepo/R401', pathMatch: 'full' }, // 400開始
      { path: 'R401', component: ORPR102Component },
      { path: 'R403', component: ORPR403Component },
    ],
    canActivate: [AuthGuard],
  },

  {
    path: 'ORPCust',
    children: [
      { path: '', redirectTo: '/ORPCust/V040', pathMatch: 'full' },
      { path: 'V040', component: ORPP040Component },
      { path: 'V041', component: ORPP041Component },
      { path: 'V042', component: ORPP042Component },
      { path: 'V043', component: ORPP043Component },
      { path: 'demo', component: ORPPDEMOComponent },
      { path: 'demo1', component: ORPPDEMO1Component },
      { path: 'chatdemo', component: ORPPCHATDEMOComponent },
    ],
    canActivate: [AuthGuard],
  },

  /* PPS & MSH */
  {
    path: 'commonData',
    children: [
      { path: '', redirectTo: '/commonData/I101', pathMatch: 'full' },
      { path: 'I101', component: PPSI101Component },
      { path: 'I102', component: PPSI102Component },
      { path: 'I102_NonBar', component: PPSI102_NonBarComponent },
      { path: 'I103', component: PPSI103Component },
      { path: 'I103_NonBar', component: PPSI103_NonBarComponent },
      { path: 'I104', component: PPSI104Component },
      { path: 'I104_NonBar', component: PPSI104_NonBarComponent },
      { path: 'I105', component: PPSI105Component },
      { path: 'I105_NonBar', component: PPSI105_NonBarComponent },
      { path: 'I106', component: PPSI106Component },
      { path: 'I106_NonBar', component: PPSI106_NonBarComponent },
      { path: 'I107', component: PPSI107Component },
      { path: 'I107_NonBar', component: PPSI107_NonBarComponent },
      { path: 'I108', component: PPSI108Component },
      { path: 'I108_NonBar', component: PPSI108_NonBarComponent },
      { path: 'I109', component: PPSI109Component },
      { path: 'I109_NonBar', component: PPSI109_NonBarComponent },
      { path: 'I110', component: PPSI110Component },
      { path: 'I110_NonBar', component: PPSI110_NonBarComponent },
      { path: 'I111', component: PPSI111Component },
      { path: 'I112', component: PPSI112Component },
      { path: 'I111_NonBar', component: PPSI111_NonBarComponent },
      { path: 'I200', component: PPSI200Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'singleData',
    children: [
      { path: '', redirectTo: '/singleData/I120', pathMatch: 'full' },
      { path: 'I120', component: PPSI120Component },
      { path: 'I121', component: PPSI121Component },
      { path: 'I122', component: PPSI122Component },
      { path: 'I123', component: PPSI123Component },
      { path: 'I130', component: PPSI130Component },
      { path: 'I131', component: PPSI131Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'PlanSet',
    children: [
      { path: '', redirectTo: '/PlanSet/I202_TabMenu', pathMatch: 'full' },
      {
        path: 'I202_TabMenu',
        component: PPSI202TabMenuComponent,
        children: [
          { path: 'I202', component: PPSI202Component },
          { path: 'I202_NonBar', component: PPSI202NonBarComponent },
        ],
      },
      { path: 'I205', component: PPSI205Component },
      { path: 'I205_100', component: PPSI205_100Component },
      { path: 'I205_401', component: PPSI205_401Component },
      { path: 'I204', component: PPSI204Component },
      { path: 'I204_NonBar', component: PPSI204_NonBarComponent },
      { path: 'I203', component: PPSI203Component },
      { path: 'I201', component: PPSI201Component },
      { path: 'I201_NonBar', component: PPSI201NonBarComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'FCPBarData',
    children: [
      { path: '', redirectTo: '/FCPBarData/P201_TabMenu', pathMatch: 'full' },
      { 
        path: 'P201_TabMenu', 
        component: PPSI210TabMenuComponent,
        children: [
          {
            path: 'P201',
            component: PPSI210Component
          },
          {
            path: 'P201_Refining',
            component: PPSI210RefiningComponent
          }
        ]
      },
      { 
        path: 'P202_TabMenu', 
        component: PPSI220TabMenuComponent,
        children: [
          { 
            path: 'P202', 
            component: PPSI220Component 
          },
          { 
            path: 'P202_Refining', 
            component: null 
          },
        ]
      },
      { 
        path: 'P203_TabMenu', 
        component: PPSI230TabMenuComponent,
        children: [
          { 
            path: 'P203', 
            component: PPSI230Component 
          },
          { 
            path: 'P203_Refining', 
            component: PPSI230RefiningComponent 
          }
        ]
      }
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'FCPBarRepo',
    children: [
      { path: '', redirectTo: '/FCPBarRepo/R302', pathMatch: 'full' },
      { path: 'R303', component: PPSR303Component },
      { path: 'R302', component: PPSR302Component },
      { path: 'R301', component: PPSR301Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'FCPshipRepo',
    children: [
      { path: '', redirectTo: '/FCPBarRepo/R304', pathMatch: 'full' },
      { path: 'R304', component: PPSR304Component },
      { path: 'R305', component: PPSR305Component },
      { path: 'R306', component: PPSR306Component },
      { path: 'R307', component: PPSR307Component },
      { path: 'R308', component: PPSR308Component },
      { path: 'R309', component: PPSR309Component },
      { path: 'R310', component: PPSR310Component },
      { path: 'R311', component: PPSR311Component },
      { path: 'R312', component: PPSR312Component },
      { path: 'R313', component: PPSR313Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'FCPshiftRepo',
    children: [
      { path: '', redirectTo: '/FCPshiftRepo/R321', pathMatch: 'full' },
      {
        path: 'R321',
        component: PPSR321Component,
        canDeactivate: [PPSR321CanDeactivateGuard],
        children: [
          {
            path: 'detail01',
            component: PPSR321Detail01Component,
            canDeactivate: [PPSR321Detail01CanDeactivateGuard],
          },
          {
            path: 'detail02',
            component: PPSR321Detail02Component,
            canDeactivate: [PPSR321Detail02CanDeactivateGuard],
          },
          {
            path: 'detail0301',
            component: PPSR321Detail0301Component,
            canDeactivate: [PPSR321Detail0301CanDeactivateGuard],
          },
          {
            path: 'detail0302',
            component: PPSR321Detail0302Component,
            canDeactivate: [PPSR321Detail0302CanDeactivateGuard],
          },
          {
            path: 'detail0303',
            component: PPSR321Detail0303Component,
            canDeactivate: [PPSR321Detail0303CanDeactivateGuard],
          },
          {
            path: 'detail04',
            component: PPSR321Detail04Component,
            canDeactivate: [PPSR321Detail04CanDeactivateGuard],
          },
        ],
      },
      {
        path: 'R322',
        component: PPSR322Component,
        children: [
          { path: '', redirectTo: 'R322_1' },
          { path: 'R322_1', component: PPSR322Child1Component },
          { path: 'R322_2', component: PPSR322Child2Component },
          { path: 'R322_3', component: PPSR322Child3Component },
          { path: 'R322_4', component: PPSR322Child4Component },
          { path: 'R322_5', component: PPSR322Child5Component },
          { path: 'R322_6', component: PPSR322Child6Component },
          { path: 'R322_7', component: PPSR322Child7Component },
          { path: 'R322_8', component: PPSR322Child8Component }
        ],
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'MSHSet',
    children: [
      { path: '', redirectTo: '/MSHSet/I001', pathMatch: 'full' },
      { path: 'I001', component: MSHI001Component },
      { path: 'I002', component: MSHI002Component },
      {
        path: 'I003',
        component: MSHI003Component,
        canDeactivate: [MSHI003CanDeactivateGuard],
      },
      { path: 'I004', component: MSHI004Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'MSHPlan',
    children: [
      { path: '', redirectTo: '/MSHPlan/P001', pathMatch: 'full' },
      { path: 'P001', component: MSHP001Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'LABSet',
    children: [
      { path: '', redirectTo: '/LABSet/I001', pathMatch: 'full' },
      { path: 'I001', component: LABI001Component },
      { path: 'I002', component: LABI002Component }, // 實驗室取樣時間設定
      { path: 'I003', component: LABI003Component }, // 實驗室行事曆
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'LABPlan',
    children: [
      { path: '', redirectTo: '/LABPlan/P100', pathMatch: 'full' },
      { path: 'P100', component: LABP100Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'SaleInput',
    children: [
      { path: '', redirectTo: '/SaleInput/I001', pathMatch: 'full' },
      { path: 'I001', component: PPSR340Component },
      { path: 'I002', component: PPSR341Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'SaleView',
    children: [
      { path: '', redirectTo: '/SaleView/R001', pathMatch: 'full' },
      { path: 'R001', component: PPSR344Component },
      // { path: 'R002', component: PPSR343Component },       // 先關閉預估周入庫計畫表
      { path: 'R002', component: ErrorPageComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'maintenance',
    children: [
      { path: '', redirectTo: '/maintenance/M001', pathMatch: 'full' },
      { path: 'M001', component: PPSR330YwComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'report',
    children: [
      { path: '', redirectTo: '/report/R002', pathMatch: 'full' },
      { path: 'R001', component: PPSR331YwComponent },
      { path: 'R002', component: PPSR332YwComponent },
    ],
    canActivate: [AuthGuard],
  },

  /* RMP & PAS & DCM */
  {
    path: 'RMPInput',
    children: [
      { path: '', redirectTo: '/RMP/RMPInput/I101', pathMatch: 'full' },
      // { path: "I101", component: PPSI200Component }
    ],
    canActivate: [AuthGuard],
  },

  /* DCM */
  {
    path: 'DCMInput',
    children: [
      { path: '', redirectTo: '/DCM/DCMInput/I101', pathMatch: 'full' },
      // { path: "I101", component: PPSI200Component }
    ],
    canActivate: [AuthGuard],
  },

  /* SPA */
  {
    path: 'SPAInput',
    children: [
      { path: '', redirectTo: '/SPA/SPAInput/I101', pathMatch: 'full' },
      { path: 'I101', component: SPAP100component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'SPAPlot',
    children: [
      { path: '', redirectTo: '/SPA/SPAPlot/P201', pathMatch: 'full' },
      { path: 'P201', component: SPAP101component },
    ],
    canActivate: [AuthGuard],
  },
  /* TRA */
  {
    path: 'TRAInput',
    children: [
      { path: '', redirectTo: '/TRAInput/I001', pathMatch: 'full' },
      { path: 'I001', component: TRAP001component },
    ],
    canActivate: [AuthGuard],
  },
  /* POM  */
  {
    path: 'POM',
    children: [
      { path: '', redirectTo: '/POM/P001', pathMatch: 'full' },
      { path: 'P001', component: POMP001Component },
      { path: 'P002', component: POMP002Component },
      { path: 'P003', component: POMP003Component },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: ErrorPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
