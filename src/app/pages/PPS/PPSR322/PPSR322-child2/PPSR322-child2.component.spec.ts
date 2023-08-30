import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR322Child2Component } from './PPSR322-child2.component';

describe('PPSR322Child2Component', () => {
  let component: PPSR322Child2Component;
  let fixture: ComponentFixture<PPSR322Child2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR322Child2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR322Child2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
