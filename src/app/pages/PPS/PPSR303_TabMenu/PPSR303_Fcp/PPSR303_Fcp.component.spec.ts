/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PPSR303FcpComponent } from './PPSR303_Fcp.component';

describe('PPSR303FcpComponent', () => {
  let component: PPSR303FcpComponent;
  let fixture: ComponentFixture<PPSR303FcpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSR303FcpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSR303FcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
