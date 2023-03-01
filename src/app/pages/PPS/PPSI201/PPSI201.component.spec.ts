import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI201Component } from './PPSI201.component';

describe('PPSI201Component', () => {
  let component: PPSI201Component;
  let fixture: ComponentFixture<PPSI201Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI201Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI201Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
