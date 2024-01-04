import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI205A401Component } from './ppsi205-a401.component';

describe('PPSI205A401Component', () => {
  let component: PPSI205A401Component;
  let fixture: ComponentFixture<PPSI205A401Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSI205A401Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSI205A401Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
