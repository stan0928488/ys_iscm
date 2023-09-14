import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR341Component } from './PPSR341.component';

describe('PPSR341Component', () => {
  let component: PPSR341Component;
  let fixture: ComponentFixture<PPSR341Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR341Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR341Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
