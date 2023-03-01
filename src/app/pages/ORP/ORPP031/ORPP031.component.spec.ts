import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPP031component } from './ORPP031.component';

describe('ORPP031component', () => {
  let component: ORPP031component;
  let fixture: ComponentFixture<ORPP031component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPP031component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPP031component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
