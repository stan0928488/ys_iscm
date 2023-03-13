import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI106Component } from './PPSI106.component';

describe('PPSI106Component', () => {
  let component: PPSI106Component;
  let fixture: ComponentFixture<PPSI106Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI106Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI106Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
