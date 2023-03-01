import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI202Component } from './PPSI202.component';

describe('PPSI202Component', () => {
  let component: PPSI202Component;
  let fixture: ComponentFixture<PPSI202Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI202Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI202Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
