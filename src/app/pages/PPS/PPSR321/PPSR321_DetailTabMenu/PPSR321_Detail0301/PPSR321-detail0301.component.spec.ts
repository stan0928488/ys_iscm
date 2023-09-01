import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR321Detail0301Component } from './PPSR321-detail0301.component';

describe('PPSR321Detail0301zComponent', () => {
  let component: PPSR321Detail0301Component;
  let fixture: ComponentFixture<PPSR321Detail0301Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR321Detail0301Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR321Detail0301Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
