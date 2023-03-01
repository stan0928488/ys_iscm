import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI204Component } from './PPSI204.component';

describe('PPSI204Component', () => {
  let component: PPSI204Component;
  let fixture: ComponentFixture<PPSI204Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI204Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI204Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
