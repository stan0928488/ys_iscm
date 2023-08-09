import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR311Component } from './PPSR311.component';

describe('PPSR311Component', () => {
  let component: PPSR311Component;
  let fixture: ComponentFixture<PPSR311Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR311Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR311Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
