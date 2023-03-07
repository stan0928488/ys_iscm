/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MSHP001Component } from './MSHP001.component';

describe('MSHP001Component', () => {
  let component: MSHP001Component;
  let fixture: ComponentFixture<MSHP001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MSHP001Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MSHP001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
