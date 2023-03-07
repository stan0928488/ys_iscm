/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MSHI001Component } from './MSHI001.component';

describe('MSHI001Component', () => {
  let component: MSHI001Component;
  let fixture: ComponentFixture<MSHI001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MSHI001Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MSHI001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
