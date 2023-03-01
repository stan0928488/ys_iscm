import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI210Component } from './PPSI210.component';

describe('PPSI210Component', () => {
  let component: PPSI210Component;
  let fixture: ComponentFixture<PPSI210Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI210Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI210Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
