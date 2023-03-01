/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PPSR301Component } from './PPSR301.component';

describe('PPSR301Component', () => {
  let component: PPSR301Component;
  let fixture: ComponentFixture<PPSR301Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSR301Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSR301Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
