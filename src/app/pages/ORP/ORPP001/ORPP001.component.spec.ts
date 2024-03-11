import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPP001Component } from './ORPP001.component';

describe('ORPP001Component', () => {
  let component: ORPP001Component;
  let fixture: ComponentFixture<ORPP001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ORPP001Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ORPP001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
