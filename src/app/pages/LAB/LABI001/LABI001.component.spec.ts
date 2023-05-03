import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LABI001Component } from './LABI001.component';

describe('LABI001Component', () => {
  let component: LABI001Component;
  let fixture: ComponentFixture<LABI001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LABI001Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LABI001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
