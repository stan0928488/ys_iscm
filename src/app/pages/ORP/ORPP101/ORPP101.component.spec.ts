import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPP101Component } from './ORPP101.component';

describe('ORPP101Component', () => {
  let component: ORPP101Component;
  let fixture: ComponentFixture<ORPP101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPP101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPP101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
