import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI220Component } from './PPSI220.component';

describe('PPSI220Component', () => {
  let component: PPSI220Component;
  let fixture: ComponentFixture<PPSI220Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI220Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI220Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
