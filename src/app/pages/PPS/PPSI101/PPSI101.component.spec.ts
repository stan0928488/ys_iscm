import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI101Component } from './PPSI101.component';

describe('PPSI101Component', () => {
  let component: PPSI101Component;
  let fixture: ComponentFixture<PPSI101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
