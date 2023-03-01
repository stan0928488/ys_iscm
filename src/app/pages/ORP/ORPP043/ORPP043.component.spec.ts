/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ORPP043Component } from './ORPP043.component';

describe('ORPP043Component', () => {
  let component: ORPP043Component;
  let fixture: ComponentFixture<ORPP043Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPP043Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPP043Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
