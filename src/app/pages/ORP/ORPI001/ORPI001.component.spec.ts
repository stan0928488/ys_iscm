import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPI001Component } from './ORPI001.component';

describe('ORPI001Component', () => {
  let component: ORPI001Component;
  let fixture: ComponentFixture<ORPI001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ORPI001Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ORPI001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
