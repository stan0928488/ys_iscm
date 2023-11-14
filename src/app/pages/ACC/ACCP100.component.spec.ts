import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ACCP100component } from './ACCP100component';

describe('ACCP100component', () => {
  let component: ACCP100component;
  let fixture: ComponentFixture<ACCP100component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ACCP100component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ACCP100component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
