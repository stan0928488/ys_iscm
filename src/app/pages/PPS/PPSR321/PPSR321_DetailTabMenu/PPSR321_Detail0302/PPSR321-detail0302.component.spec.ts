import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR321Detail0302Component } from './PPSR321-detail0302.component';

describe('PPSR321Detail0302Component', () => {
  let component: PPSR321Detail0302Component;
  let fixture: ComponentFixture<PPSR321Detail0302Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR321Detail0302Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR321Detail0302Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
