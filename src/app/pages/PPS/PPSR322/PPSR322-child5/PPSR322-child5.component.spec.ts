import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR322Child5Component } from './PPSR322-child5.component';

describe('PPSR322Child5Component', () => {
  let component: PPSR322Child5Component;
  let fixture: ComponentFixture<PPSR322Child5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR322Child5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR322Child5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
