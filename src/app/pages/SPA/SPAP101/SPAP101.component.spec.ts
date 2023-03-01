import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import  { SPAP101component } from './SPAP101.component';

describe('SPAP101component', () => {
  let component: SPAP101component;
  let fixture: ComponentFixture<SPAP101component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SPAP101component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SPAP101component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
