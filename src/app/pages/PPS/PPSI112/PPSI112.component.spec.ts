import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI112Component } from './PPSI112.component';

describe('PPSI112Component', () => {
  let component: PPSI112Component;
  let fixture: ComponentFixture<PPSI112Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PPSI112Component],
    }).compileComponents();

    fixture = TestBed.createComponent(PPSI112Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
