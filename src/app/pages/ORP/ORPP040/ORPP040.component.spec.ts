/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ORPP040Component } from './ORPP040.component';

describe('ORPP040Component', () => {
  let component: ORPP040Component;
  let fixture: ComponentFixture<ORPP040Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPP040Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPP040Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
