import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI107Component } from './PPSI107.component';

describe('PPSI107Component', () => {
  let component: PPSI107Component;
  let fixture: ComponentFixture<PPSI107Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI107Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI107Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
