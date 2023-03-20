import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI120Component } from './PPSI120.component';

describe('PPSI120Component', () => {
  let component: PPSI120Component;
  let fixture: ComponentFixture<PPSI120Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI120Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI120Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
