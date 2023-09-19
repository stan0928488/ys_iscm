import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR340Component } from './PPSR340.component';

describe('PPSR340Component', () => {
  let component: PPSR340Component;
  let fixture: ComponentFixture<PPSR340Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR340Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR340Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
