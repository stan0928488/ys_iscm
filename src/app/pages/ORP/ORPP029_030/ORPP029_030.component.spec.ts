import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPP029_030component } from './ORPP029_030.component';

describe('ORPP029_030component', () => {
  let component: ORPP029_030component;
  let fixture: ComponentFixture<ORPP029_030component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPP029_030component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPP029_030component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
