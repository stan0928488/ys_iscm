/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PPSR303Component } from './PPSR303.component';

describe('PPSR303Component', () => {
  let component: PPSR303Component;
  let fixture: ComponentFixture<PPSR303Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSR303Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSR303Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
