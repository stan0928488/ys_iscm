import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR322Child7Component } from './PPSR322-child7.component';

describe('PPSR322Child7Component', () => {
  let component: PPSR322Child7Component;
  let fixture: ComponentFixture<PPSR322Child7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR322Child7Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR322Child7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
