import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR322Child8Component } from './PPSR322-child8.component';

describe('PPSR322Child8Component', () => {
  let component: PPSR322Child8Component;
  let fixture: ComponentFixture<PPSR322Child8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR322Child8Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR322Child8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
