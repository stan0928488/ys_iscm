import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR322Child1Component } from './PPSR322-child1.component';

describe('PPSR322Child1Component', () => {
  let component: PPSR322Child1Component;
  let fixture: ComponentFixture<PPSR322Child1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR322Child1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR322Child1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
