import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI102Component } from './PPSI102.component';

describe('PPSI102Component', () => {
  let component: PPSI102Component;
  let fixture: ComponentFixture<PPSI102Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI102Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI102Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
