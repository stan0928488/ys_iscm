import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI110Component } from './PPSI110.component';

describe('PPSI110Component', () => {
  let component: PPSI110Component;
  let fixture: ComponentFixture<PPSI110Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI110Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI110Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
