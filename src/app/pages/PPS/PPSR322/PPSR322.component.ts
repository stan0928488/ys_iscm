import { Component, OnInit, ViewChild } from '@angular/core';
import { PPSR322Child1Component } from './PPSR322-child1/PPSR322-child1.component';
import { PPSR322Child2Component } from './PPSR322-child2/PPSR322-child2.component';
import { PPSR322Child3Component } from './PPSR322-child3/PPSR322-child3.component';
import { PPSR322Child4Component } from './PPSR322-child4/PPSR322-child4.component';
import { PPSR322Child5Component } from './PPSR322-child5/PPSR322-child5.component';
import { PPSR322Child6Component } from './PPSR322-child6/PPSR322-child6.component';

@Component({
  selector: 'app-PPSR322',
  templateUrl: './PPSR322.component.html',
  styleUrls: ['./PPSR322.component.css']
})
export class PPSR322Component implements OnInit {

  @ViewChild(PPSR322Child1Component) ppsr322Child1:PPSR322Child1Component;
  @ViewChild(PPSR322Child2Component) ppsr322Child2:PPSR322Child2Component;
  @ViewChild(PPSR322Child3Component) ppsr322Child3:PPSR322Child3Component;
  @ViewChild(PPSR322Child4Component) ppsr322Child4:PPSR322Child4Component;
  @ViewChild(PPSR322Child5Component) ppsr322Child5:PPSR322Child5Component;
  @ViewChild(PPSR322Child6Component) ppsr322Child6:PPSR322Child6Component;

  constructor() { }

  ngOnInit(): void {
  }

}
