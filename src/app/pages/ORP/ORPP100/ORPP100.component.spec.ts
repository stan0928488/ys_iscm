import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPP100Component } from './ORPP100.component';

describe('ORPP100Component', () => {
  let component: ORPP100Component;
  let fixture: ComponentFixture<ORPP100Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPP100Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPP100Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
