import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPP032component } from './ORPP032.component';

describe('ORPP032component', () => {
  let component: ORPP032component;
  let fixture: ComponentFixture<ORPP032component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ORPP032component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ORPP032component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
