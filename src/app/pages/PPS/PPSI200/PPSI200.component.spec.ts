import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI200Component } from './PPSI200.component';

describe('PPSI200Component', () => {
  let component: PPSI200Component;
  let fixture: ComponentFixture<PPSI200Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI200Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI200Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
