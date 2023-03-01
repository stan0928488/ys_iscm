import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI205Component } from './PPSI205.component';

describe('PPSI205Component', () => {
  let component: PPSI205Component;
  let fixture: ComponentFixture<PPSI205Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI205Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI205Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
