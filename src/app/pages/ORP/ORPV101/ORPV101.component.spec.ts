import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPV101Component } from './ORPV101.component';

describe('ORPV101Component', () => {
  let component: ORPV101Component;
  let fixture: ComponentFixture<ORPV101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPV101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPV101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
