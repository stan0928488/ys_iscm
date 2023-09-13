import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR343Component } from './PPSR343.component';

describe('PPSR343Component', () => {
  let component: PPSR343Component;
  let fixture: ComponentFixture<PPSR343Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR343Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR343Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
