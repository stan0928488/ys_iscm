import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LABI003Component } from './LABI003.component';

describe('LABI003Component', () => {
  let component: LABI003Component;
  let fixture: ComponentFixture<LABI003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LABI003Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LABI003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
