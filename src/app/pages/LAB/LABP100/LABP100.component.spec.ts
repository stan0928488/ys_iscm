import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LABP100Component } from './LABP100.component';

describe('LABP100Component', () => {
  let component: LABP100Component;
  let fixture: ComponentFixture<LABP100Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LABP100Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LABP100Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
