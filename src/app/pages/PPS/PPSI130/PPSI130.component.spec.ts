import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI130Component } from './PPSI130.component';

describe('PPSI130Component', () => {
  let component: PPSI130Component;
  let fixture: ComponentFixture<PPSI130Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI130Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI130Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
