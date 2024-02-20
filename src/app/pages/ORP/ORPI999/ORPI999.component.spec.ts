import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPI999Component } from './ORPI999.component';

describe('ORPI999Component', () => {
  let component: ORPI999Component;
  let fixture: ComponentFixture<ORPI999Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ORPI999Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ORPI999Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
