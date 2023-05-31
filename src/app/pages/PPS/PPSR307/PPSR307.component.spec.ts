import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR307Component } from './PPSR307.component';

describe('PPSR307Component', () => {
  let component: PPSR307Component;
  let fixture: ComponentFixture<PPSR307Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSR307Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSR307Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
