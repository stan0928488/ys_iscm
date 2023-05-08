import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MSHI003Component } from './MSHI003.component';

describe('MSHI003Component', () => {
  let component: MSHI003Component;
  let fixture: ComponentFixture<MSHI003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MSHI003Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MSHI003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
