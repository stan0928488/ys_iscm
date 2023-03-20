import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI123Component } from './PPSI123.component';

describe('PPSI123Component', () => {
  let component: PPSI123Component;
  let fixture: ComponentFixture<PPSI123Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI123Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI123Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
