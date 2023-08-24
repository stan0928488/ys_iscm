import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR321Component } from './PPSR321.component';

describe('PPSR321Component', () => {
  let component: PPSR321Component;
  let fixture: ComponentFixture<PPSR321Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR321Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR321Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
