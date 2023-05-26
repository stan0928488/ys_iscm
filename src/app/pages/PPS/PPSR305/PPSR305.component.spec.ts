import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR305Component } from './PPSR305.component';

describe('PPSR305Component', () => {
  let component: PPSR305Component;
  let fixture: ComponentFixture<PPSR305Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSR305Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSR305Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
