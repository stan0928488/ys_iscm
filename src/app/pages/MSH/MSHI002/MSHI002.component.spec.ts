/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MSHI002Component } from './MSHI002.component';

describe('MSHI002Component', () => {
  let component: MSHI002Component;
  let fixture: ComponentFixture<MSHI002Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MSHI002Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MSHI002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
