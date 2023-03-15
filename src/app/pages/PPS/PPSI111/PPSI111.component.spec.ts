import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI111Component } from './PPSI111.component';

describe('PPSI111Component', () => {
  let component: PPSI111Component;
  let fixture: ComponentFixture<PPSI111Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI111Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI111Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
