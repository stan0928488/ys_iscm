import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MSHI004Component } from './MSHI004.component';

describe('MSHI004Component', () => {
  let component: MSHI004Component;
  let fixture: ComponentFixture<MSHI004Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MSHI004Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MSHI004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
