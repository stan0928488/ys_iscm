/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ORPP041Component } from './ORPP041.component';

describe('ORPP041Component', () => {
  let component: ORPP041Component;
  let fixture: ComponentFixture<ORPP041Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPP041Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPP041Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
