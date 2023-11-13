import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI230Component } from './PPSI230.component';

describe('PPSI210Component', () => {
  let component: PPSI230Component;
  let fixture: ComponentFixture<PPSI230Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI230Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI230Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
