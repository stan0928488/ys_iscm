import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR313Component } from './PPSR313.component';

describe('PPSR313Component', () => {
  let component: PPSR313Component;
  let fixture: ComponentFixture<PPSR313Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR313Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR313Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
