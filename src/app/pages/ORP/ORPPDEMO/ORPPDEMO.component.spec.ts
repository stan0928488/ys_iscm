/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ORPPDEMOComponent } from './ORPPDEMO.component';

describe('ORPPDEMOComponent', () => {
  let component: ORPPDEMOComponent;
  let fixture: ComponentFixture<ORPPDEMOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPPDEMOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPPDEMOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
