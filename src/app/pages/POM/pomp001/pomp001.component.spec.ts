import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POMP001Component } from './pomp001.component';

describe('POMP001Component', () => {
  let component: POMP001Component;
  let fixture: ComponentFixture<POMP001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POMP001Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POMP001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
