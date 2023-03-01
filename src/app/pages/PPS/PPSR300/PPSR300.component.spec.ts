import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR300Component } from './PPSR300.component';

describe('ProductCurComponent', () => {
  let component: PPSR300Component;
  let fixture: ComponentFixture<PPSR300Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSR300Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSR300Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
