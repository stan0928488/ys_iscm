import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR320Component } from './PPSR320.component';

describe('PPSR320Component', () => {
  let component: PPSR320Component;
  let fixture: ComponentFixture<PPSR320Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR320Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR320Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
