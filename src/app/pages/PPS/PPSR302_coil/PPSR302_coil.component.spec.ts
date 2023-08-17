/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PPSR302Component } from './PPSR302.component';

describe('PPSR302Component', () => {
  let component: PPSR302Component;
  let fixture: ComponentFixture<PPSR302Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSR302Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSR302Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
