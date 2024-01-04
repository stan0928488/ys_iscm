import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI205A100Component } from './ppsi205-a100.component';

describe('PPSI205A100Component', () => {
  let component: PPSI205A100Component;
  let fixture: ComponentFixture<PPSI205A100Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSI205A100Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSI205A100Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
