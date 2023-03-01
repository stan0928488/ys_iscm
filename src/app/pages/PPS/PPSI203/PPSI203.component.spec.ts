/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PPSI203Component } from './PPSI203.component';

describe('PPSI203Component', () => {
  let component: PPSI203Component;
  let fixture: ComponentFixture<PPSI203Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI203Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI203Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
