import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI121Component } from './PPSI121.component';

describe('PPSI121Component', () => {
  let component: PPSI121Component;
  let fixture: ComponentFixture<PPSI121Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI121Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI121Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
