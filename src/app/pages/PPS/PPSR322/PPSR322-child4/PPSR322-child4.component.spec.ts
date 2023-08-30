import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR322Child4Component } from './PPSR322-child4.component';

describe('PPSR322Child4Component', () => {
  let component: PPSR322Child4Component;
  let fixture: ComponentFixture<PPSR322Child4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR322Child4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR322Child4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
