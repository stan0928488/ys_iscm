import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI109Component } from './PPSI109.component';

describe('PPSI109Component', () => {
  let component: PPSI109Component;
  let fixture: ComponentFixture<PPSI109Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI109Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI109Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
