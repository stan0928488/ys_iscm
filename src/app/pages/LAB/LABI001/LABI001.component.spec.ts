import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LABI101Component } from './LABI101.component';

describe('LABI101Component', () => {
  let component: LABI101Component;
  let fixture: ComponentFixture<LABI101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LABI101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LABI101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
