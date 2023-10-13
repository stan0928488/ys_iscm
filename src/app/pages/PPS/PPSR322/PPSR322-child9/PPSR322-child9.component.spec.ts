import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR322Child9Component } from './PPSR322-child9.component';

describe('PPSR322Child9Component', () => {
  let component: PPSR322Child9Component;
  let fixture: ComponentFixture<PPSR322Child9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR322Child9Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR322Child9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
