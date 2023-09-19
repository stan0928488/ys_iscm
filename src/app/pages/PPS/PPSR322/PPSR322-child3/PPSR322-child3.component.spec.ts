import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR322Child3Component } from './PPSR322-child3.component';

describe('PPSR322Child3Component', () => {
  let component: PPSR322Child3Component;
  let fixture: ComponentFixture<PPSR322Child3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR322Child3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR322Child3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
