import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR321Detail04Component } from './PPSR321-detail04.component';

describe('PPSR321Detail04Component', () => {
  let component: PPSR321Detail04Component;
  let fixture: ComponentFixture<PPSR321Detail04Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR321Detail04Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR321Detail04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
