import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OIPP029component } from './OIPP029.component';

describe('OIPP029component', () => {
  let component: OIPP029component;
  let fixture: ComponentFixture<OIPP029component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OIPP029component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OIPP029component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
