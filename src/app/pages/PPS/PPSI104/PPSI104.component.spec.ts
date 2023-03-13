import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI104Component } from './PPSI104.component';

describe('PPSI104Component', () => {
  let component: PPSI104Component;
  let fixture: ComponentFixture<PPSI104Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI104Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI104Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
