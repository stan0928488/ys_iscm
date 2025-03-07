import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
import { PPSI220RefiningComponent } from './pages/PPS/PPSI220_TabMenu/PPSI220_Refining/PPSI220_Refining.component';
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
import { PPSI112TabMenuComponent } from './pages/PPS/PPSI112_TabMenu/PPSI112_TabMenu.component';
import { PPSI112Component } from './pages/PPS/PPSI112_TabMenu/PPSI112/PPSI112.component';
import { PPSI112RefinIngComponent } from './pages/PPS/PPSI112_TabMenu/PPSI112_Refining/PPSI112_Refining.component';
import { PPSI206TabMenuComponent } from './pages/PPS/PPSI206_TabMenu/PPSI206_TabMenu.component';
import { PPSI206SETComponent } from './pages/PPS/PPSI206_TabMenu/PPSI206_SET/PPSI206_SET.component';
import { PPSI206RESComponent } from './pages/PPS/PPSI206_TabMenu/PPSI206_RES/PPSI206_RES.component';
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
import { PPSR343Component } from './pages/PPS/PPSR343/PPSR343.component';
import { PPSR340Component } from './pages/PPS/PPSR340/PPSR340.component';
import { PPSR341Component } from './pages/PPS/PPSR341/PPSR341.component';
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
import { PPSR345Component } from './pages/PPS/PPSR345/PPSR345.component';
import { PPSR345AVERAGEComponent } from './pages/PPS/PPSR345AVERAGE/PPSR345AVERAGE.component';

import { MSHI001Component } from './pages/MSH/MSHI001/MSHI001.component';
import { MSHI002Component } from './pages/MSH/MSHI002/MSHI002.component';
import { MSHP001Component } from './pages/MSH/MSHP001/MSHP001.component';
import { MSHI003Component } from './pages/MSH/MSHI003/MSHI003.component';
import { MSHI003CanDeactivateGuard } from './pages/MSH/MSHI003/MSHI003.can.deactivate.guard';
import { MSHI004Component } from './pages/MSH/MSHI004/MSHI004.component';

import { LABI002Component } from './pages/LAB/LABI002/LABI002.component';
import { LABI003Component } from './pages/LAB/LABI003/LABI003.component';
import { LABI001Component } from './pages/LAB/LABI001/LABI001.component';
import { LABP100Component } from './pages/LAB/LABP100/LABP100.component';

import { LoginComponent } from './login/login.component';
import { AuthGuardService as AuthGuard } from './services/auth/auth-guard.service';
import { ErrorPageComponent } from './pages/errorPage/ErrorPage.component';
import { AccessDinedPageComponent } from './pages/AccessDinedPage/AccessDinedPage.component';
import { ManageMenuComponent } from './pages/SYSTEM/manage-menu/manage-menu.component';
import { ManageRoleComponent } from './pages/SYSTEM/manage-role/manage-role.component';
import { ManageUserComponent } from './pages/SYSTEM/manage-user/manage-user.component';
import { UserProfileComponent } from './pages/USER/user-profile/user-profile.component';

import { PPSI205A401Component } from './pages/PPS/ppsi205-a401/ppsi205-a401.component';
import { PPSI205A100Component } from './pages/PPS/ppsi205-a100/ppsi205-a100.component';
import { MainComponent } from './main/main.component';
import { AgHeadSeetingComponent } from './pages/SYSTEM/ag-head-seeting/ag-head-seeting.component';

import { ORPI001Component } from './pages/ORP/ORPI001/ORPI001.component';
import { ORPI999Component } from './pages/ORP/ORPI999/ORPI999.component';
import { ORPP001Component } from './pages/ORP/ORPP001/ORPP001.component';


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
  {
    path: 'main',
    component: MainComponent,
    children: [
      /* ORP & OIP & TRA */
      /* PPS & MSH */
      {
        path: 'commonData',
        children: [
          { path: '', redirectTo: '/main/commonData/I101', pathMatch: 'full' },
          { path: 'I101', component: PPSI101Component, data : { pageName:"鋼種分類" } },
          { path: 'I102', component: PPSI102Component, data : { pageName:"站別機台關聯表" } },
          { path: 'I102_NonBar', component: PPSI102_NonBarComponent },
          { path: 'I103', component: PPSI103Component, data : { pageName:"設備能力" } },
          { path: 'I103_NonBar', component: PPSI103_NonBarComponent },
          { path: 'I104', component: PPSI104Component, data : { pageName:"整備時間" } },
          { path: 'I104_NonBar', component: PPSI104_NonBarComponent },
          { path: 'I105', component: PPSI105Component, data : { pageName:"大調機" } },
          { path: 'I105_NonBar', component: PPSI105_NonBarComponent },
          { path: 'I106', component: PPSI106Component, data : { pageName:"小調機" } },
          { path: 'I106_NonBar', component: PPSI106_NonBarComponent },
          { path: 'I107', component: PPSI107Component, data : { pageName:"線速工時" } },
          { path: 'I107_NonBar', component: PPSI107_NonBarComponent },
          { path: 'I108', component: PPSI108Component, data : { pageName:"非線速工時" } },
          { path: 'I108_NonBar', component: PPSI108_NonBarComponent },
          { path: 'I109', component: PPSI109Component, data : { pageName:"產率設定" } },
          { path: 'I109_NonBar', component: PPSI109_NonBarComponent },
          { path: 'I110', component: PPSI110Component, data : { pageName:"產能維護" } },
          { path: 'I110_NonBar', component: PPSI110_NonBarComponent },
          { path: 'I111', component: PPSI111Component, data : { pageName:"combine資料設定" } },
          { path: 'I111_NonBar', component: PPSI111_NonBarComponent },
          { path: 'I200', component: PPSI200Component, data : { pageName:"系統設定" } },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'singleData',
        children: [
          { path: '', redirectTo: '/main/singleData/I120', pathMatch: 'full' },
          { path: 'I120', component: PPSI120Component, data : { pageName:"直棒退火爐工時" } },
          { path: 'I121', component: PPSI121Component, data : { pageName:"直棒研磨道次" } },
          { path: 'I122', component: PPSI122Component, data : { pageName:"直棒桶槽式工時" } },
          { path: 'I123', component: PPSI123Component, data : { pageName:"直棒清洗站設備能力" } },
          { path: 'I130', component: PPSI130Component, data : { pageName:"精整批次爐鋼種捲數製程碼對應表" } },
          { path: 'I131', component: PPSI131Component, data : { pageName:"直棒BA1批次爐工時維護" } },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'PlanSet',
        children: [
          { path: '', redirectTo: '/main/PlanSet/I112_TabMenu', pathMatch: 'full' },
          { 
            path: 'I112_TabMenu',
            component: PPSI112TabMenuComponent,
            children: [
              { path: '', redirectTo: '/main/PlanSet/I112_TabMenu/I112', pathMatch: 'full' },
              { 
                path: 'I112', 
                component: PPSI112Component, 
                data : { pageName : "累計生產" },
              },
              { 
                path: 'I112_Refining', 
                component: PPSI112RefinIngComponent
              },
            ],
          },
          {
            path: 'I202_TabMenu',
            component: PPSI202TabMenuComponent,
            children: [
              { path: 'I202', component: PPSI202Component, data : { pageName : "定修計畫" }, },
              { path: 'I202_NonBar', component: PPSI202NonBarComponent },
            ],
          },
          {
            path: 'I206_TabMenu',
            component: PPSI206TabMenuComponent,
            children: [
              { path: '', redirectTo: '/main/PlanSet/I206_TabMenu/I206_SET', pathMatch: 'full' },
              { path: 'I206_SET', component: PPSI206SETComponent, data : { pageName : "虛擬訂單表" } },
              { path: 'I206_RES', component: PPSI206RESComponent },
            ],
          },
          { path: 'I205', component: PPSI205Component, data : { pageName : "公版設定維護" } },
          { path: 'I205_401', component: PPSI205_401Component },
          { path: 'I205_a401', component: PPSI205A401Component },
          { path: 'I205_a100', component: PPSI205A100Component },
          { path: 'I205_100', component: PPSI205_100Component },
          { path: 'I204', component: PPSI204Component, data : { pageName : "Campaign 限制" } },
          { path: 'I204_NonBar', component: PPSI204_NonBarComponent },
          { path: 'I203', component: PPSI203Component, data : { pageName : "最早可投產時間調整" } },
          { path: 'I201', component: PPSI201Component, data : { pageName : "站別機台優先順序表" } },
          { path: 'I201_NonBar', component: PPSI201NonBarComponent },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'FCPBarData',
        children: [
          { path: '', redirectTo: '/main/FCPBarData/P201_TabMenu/P201', pathMatch: 'full' },
          {
            path: 'P201_TabMenu',
            component: PPSI210TabMenuComponent,
            children: [
              {
                path: '',
                redirectTo: '/main/FCPBarData/P201_TabMenu/P201',
                pathMatch: 'full',
              },
              {
                path: 'P201',
                component: PPSI210Component,
                data : { pageName : "建立規劃策略" },
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
              { path: '', redirectTo: '/main/FCPBarData/P202_TabMenu/P202', pathMatch: 'full' },
              { 
                path: 'P202', 
                component: PPSI220Component,
                data : { pageName : "規劃策略清單" },
              },
              { 
                path: 'P202_Refining', 
                component: PPSI220RefiningComponent
              },
            ],
          },
          {
            path: 'P203_TabMenu',
            component: PPSI230TabMenuComponent,
            children: [
              { path: '', redirectTo: '/main/FCPBarData/P203_TabMenu/P203', pathMatch: 'full' },
              { 
                path: 'P203', 
                component: PPSI230Component,
                data : { pageName : "生產規劃執行" }
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
          { path: '', redirectTo: '/main/FCPBarRepo/R302', pathMatch: 'full' },
          {
            path: 'R303_TabMenu',
            component: PPSR303TabMenuComponent,
            children: [
              { path: '', redirectTo: '/main/FCPBarRepo/R303_TabMenu/R303', pathMatch: 'full' },
              { path: 'R303', component: PPSR303Component, data : { pageName : "異常表" } },
              { path: 'R303_Fcp', component: PPSR303FcpComponent},
            ],
          },
          { path: 'R302', component: PPSR302Component, data : { pageName : "交期-計畫彙總表" } },
          { path: 'R301', component: PPSR301Component, data : { pageName : "機台產能分析表" } },
          { path: 'R345', component: PPSR345Component, data : { pageName : "工時計算結果表" } },
          { path: 'R345average', component: PPSR345AVERAGEComponent, data : { pageName : "工時計算平均結果表" }  },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'FCPshipRepo',
        children: [
          { path: '', redirectTo: '/main/FCPBarRepo/R304', pathMatch: 'full' },
          { path: 'R304', component: PPSR304Component, data : { pageName : "出貨計畫表-維護" } },
          { path: 'R305', component: PPSR305Component },
          { path: 'R306', component: PPSR306Component },
          { path: 'R307', component: PPSR307Component },
          { path: 'R308', component: PPSR308Component, data : { pageName : "出貨計畫表-檢視" } },
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
          { path: '', redirectTo: '/main/FCPshiftRepo/R321', pathMatch: 'full' },
          {
            path: 'R321',
            component: PPSR321Component,
            data : { pageName : "月推移表-維護" },
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
            data : { pageName : "月推移表-檢視" },
            children: [
              { path: '', redirectTo: '/main/FCPshiftRepo/R322/R322_1', pathMatch: 'full' },
              { path: 'R322_1', component: PPSR322Child1Component, data : { pageName : "月推移表-檢視" } },
              { path: 'R322_2', component: PPSR322Child2Component },
              { path: 'R322_3', component: PPSR322Child3Component },
              { path: 'R322_4', component: PPSR322Child4Component },
              { path: 'R322_5', component: PPSR322Child5Component },
              { path: 'R322_6', component: PPSR322Child6Component },
              { path: 'R322_7', component: PPSR322Child7Component },
              { path: 'R322_8', component: PPSR322Child8Component },
            ],
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'MSHSet',
        children: [
          { path: '', redirectTo: '/main/MSHSet/I001', pathMatch: 'full' },
          { path: 'I001', component: MSHI001Component, data : { pageName : "管理人員設定排序" } },
          { path: 'I002', component: MSHI002Component, data : { pageName : "業務人員設定排序" } },
          {
            path: 'I003',
            component: MSHI003Component,
            data : { pageName : "EPST變更作業" }, 
            canDeactivate: [MSHI003CanDeactivateGuard],
          },
          { path: 'I004', component: MSHI004Component, data : { pageName : "啟動發佈模式" } },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'MSHPlan',
        children: [
          { path: '', redirectTo: '/main/MSHPlan/P001', pathMatch: 'full' },
          { path: 'P001', component: MSHP001Component, data : { pageName : "直棒排程設定" } },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'LABSet',
        children: [
          { path: '', redirectTo: '/main/LABSet/I001', pathMatch: 'full' },
          { path: 'I001', component: LABI001Component, data : { pageName : "實驗室靜態資料" } },
          { path: 'I002', component: LABI002Component, data : { pageName : "實驗室取樣時間設定" } }, // 實驗室取樣時間設定
          { path: 'I003', component: LABI003Component, data : { pageName : "實驗室行事曆" } }, // 實驗室行事曆
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'LABPlan',
        children: [
          { path: '', redirectTo: '/main/LABPlan/P100', pathMatch: 'full' },
          { path: 'P100', component: LABP100Component, data : { pageName : "工時擷取與結果" } },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'SaleInput',
        children: [
          { path: '', redirectTo: '/main/SaleInput/I001', pathMatch: 'full' },
          { path: 'I001', component: PPSR340Component, data : { pageName : "訂單交期回覆" } },
          { path: 'I002', component: PPSR341Component, data : { pageName : "成品庫存現況" } },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'SaleView',
        children: [
          { path: '', redirectTo: '/main/SaleView/R001', pathMatch: 'full' },
          { path: 'R001', component: PPSR344Component, data : { pageName : "出貨追蹤管理報表" } },
          // { path: 'R002', component: PPSR343Component },       // 先關閉預估周入庫計畫表
          { path: 'R002', component: ErrorPageComponent, data : { pageName : "預估週入庫計畫" } },
        ],
        canActivate: [AuthGuard],
      },
      /* ORP & OIP & TRA */
      {
        path: 'ORPInput',
        children: [
          { path: '', redirectTo: '/main/ORPInput/I001', pathMatch: 'full' },
          { 
            path: 'I001', 
            component: ORPI001Component,
            data : {
              pageName:"料號客戶需求碼對照表"
            }
          },
          { 
            path: 'I999', 
            component: ORPI999Component,
            data : {
              pageName:"表格讀取"
            }
          }
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'ORPExe',
        children: [
          { path: '', redirectTo: '/main/ORPExe/P001', pathMatch: 'full' },
          { 
            path: 'P001', 
            component: ORPP001Component,
            data : {
              pageName:"進單作業"
            }
          }
        ],
        canActivate: [AuthGuard]
      },

      /* RMP & PAS & DCM */

      /* DCM */

      /* SPA */

      /* TRA */

      /* POM  */

      /* system  */
      {
        path: 'system',
        children: [
          { path: '', redirectTo: '/main/system/ACCSetting', pathMatch: 'full' },
          {
            path: "manageMenu",
            data : {
              pageName:"菜單功能管理"
            },
            component: ManageMenuComponent
          },
          {
            path: "manageRole",
            data : {
              pageName:"職務權限管理"
            },
            component: ManageRoleComponent
          },
          {
            path : "manageUser",
            data : {
              pageName:"用戶管理"
            },
            component: ManageUserComponent
          },
          {
            path : "agHeadSeeting",
            data : {
              pageName:"ag表頭設定管理"
            },
            component: AgHeadSeetingComponent
          }
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'user',
        children: [
          { path: '', redirectTo: '/main/user/profile', pathMatch: 'full' },
          {
            path: "profile",
            component: UserProfileComponent,
            data : {
              pageName:"個人資料"
            },
          }
        ],
        canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: '/main/user/profile',
        pathMatch: 'full',
      },
      {
        path: '**',
        data : {
          pageName:"頁面尚未存在"
        },
        component: ErrorPageComponent,
      },
      {
        path: '/main/AccessDined',
        component: AccessDinedPageComponent,
        canActivate: [AuthGuard],
      },
    ]
  }

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
