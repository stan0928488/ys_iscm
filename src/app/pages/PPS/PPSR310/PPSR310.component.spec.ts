import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR310Component } from './PPSR310.component';

describe('ProductCurComponent', () => {
  let component: PPSR310Component;
  let fixture: ComponentFixture<PPSR310Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSR310Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSR310Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
