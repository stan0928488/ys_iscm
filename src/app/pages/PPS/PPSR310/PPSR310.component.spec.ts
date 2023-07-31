import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR310Component } from './PPSR310.component';

describe('PPSR310Component', () => {
  let component: PPSR310Component;
  let fixture: ComponentFixture<PPSR310Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR310Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR310Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
