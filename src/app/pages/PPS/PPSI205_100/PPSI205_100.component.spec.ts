import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI205_100Component } from './PPSI205_100.component';

describe('PPSI205_100Component', () => {
  let component: PPSI205_100Component;
  let fixture: ComponentFixture<PPSI205_100Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PPSI205_100Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI205_100Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
