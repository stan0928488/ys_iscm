import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR306Component } from './PPSR306.component';

describe('PPSR306Component', () => {
  let component: PPSR306Component;
  let fixture: ComponentFixture<PPSR306Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSR306Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSR306Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
