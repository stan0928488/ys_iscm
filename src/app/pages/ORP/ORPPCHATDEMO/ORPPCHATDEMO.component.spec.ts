/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ORPPCHATDEMOComponent } from './ORPPCHATDEMO.component';

describe('ORPPCHATDEMOComponent', () => {
  let component: ORPPCHATDEMOComponent;
  let fixture: ComponentFixture<ORPPCHATDEMOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPPCHATDEMOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPPCHATDEMOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
