import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI105Component } from './PPSI105.component';

describe('PPSI105Component', () => {
  let component: PPSI105Component;
  let fixture: ComponentFixture<PPSI105Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI105Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI105Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
