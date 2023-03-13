import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI108Component } from './PPSI108.component';

describe('PPSI108Component', () => {
  let component: PPSI108Component;
  let fixture: ComponentFixture<PPSI108Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI108Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI108Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
