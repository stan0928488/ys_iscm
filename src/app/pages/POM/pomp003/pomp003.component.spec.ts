import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POMP003Component } from './pomp003.component';

describe('POMP003Component', () => {
  let component: POMP003Component;
  let fixture: ComponentFixture<POMP003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POMP003Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POMP003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
