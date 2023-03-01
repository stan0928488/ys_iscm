import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPP033component } from './ORPP033.component';

describe('ORPP033component', () => {
  let component: ORPP033component;
  let fixture: ComponentFixture<ORPP033component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPP033component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPP033component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
