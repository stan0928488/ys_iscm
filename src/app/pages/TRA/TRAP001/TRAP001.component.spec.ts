import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TRAP001component } from './TRAP001.component';

describe('TRAP001component', () => {
  let component: TRAP001component;
  let fixture: ComponentFixture<TRAP001component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TRAP001component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TRAP001component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
