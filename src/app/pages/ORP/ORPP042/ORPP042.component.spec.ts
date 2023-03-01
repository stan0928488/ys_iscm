/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ORPP042Component } from './ORPP042.component';

describe('ORPP042Component', () => {
  let component: ORPP042Component;
  let fixture: ComponentFixture<ORPP042Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPP042Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPP042Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
