import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI122Component } from './PPSI122.component';

describe('PPSI122Component', () => {
  let component: PPSI122Component;
  let fixture: ComponentFixture<PPSI122Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI122Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI122Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
