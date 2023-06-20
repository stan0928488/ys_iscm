import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI131Component } from './PPSI131.component';

describe('PPSI131Component', () => {
  let component: PPSI131Component;
  let fixture: ComponentFixture<PPSI131Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI131Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI131Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
