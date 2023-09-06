import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR321Detail0303Component } from './PPSR321-detail0303.component';

describe('PPSR321Detail0303Component', () => {
  let component: PPSR321Detail0303Component;
  let fixture: ComponentFixture<PPSR321Detail0303Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR321Detail0303Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR321Detail0303Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
