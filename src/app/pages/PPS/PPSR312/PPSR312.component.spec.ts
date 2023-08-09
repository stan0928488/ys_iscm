import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR312Component } from './PPSR312.component';

describe('PPSR312Component', () => {
  let component: PPSR312Component;
  let fixture: ComponentFixture<PPSR312Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR312Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR312Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
