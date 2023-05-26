import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR304Component } from './PPSR304.component';

describe('PPSR304Component', () => {
  let component: PPSR304Component;
  let fixture: ComponentFixture<PPSR304Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSR304Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSR304Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
