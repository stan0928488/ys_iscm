import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR309Component } from './PPSR309.component';

describe('PPSR309Component', () => {
  let component: PPSR309Component;
  let fixture: ComponentFixture<PPSR309Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR309Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR309Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
