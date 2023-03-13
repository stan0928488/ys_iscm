import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI103Component } from './PPSI103.component';

describe('PPSI103Component', () => {
  let component: PPSI103Component;
  let fixture: ComponentFixture<PPSI103Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI103Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI103Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
