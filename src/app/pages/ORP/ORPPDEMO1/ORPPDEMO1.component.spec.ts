/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ORPPDEMO1Component } from './ORPPDEMO1.component';

describe('ORPPDEMO1Component', () => {
  let component: ORPPDEMO1Component;
  let fixture: ComponentFixture<ORPPDEMO1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPPDEMO1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPPDEMO1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
