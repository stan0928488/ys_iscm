import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR322Component } from './PPSR322.component';

describe('PPSR322Component', () => {
  let component: PPSR322Component;
  let fixture: ComponentFixture<PPSR322Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR322Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR322Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
