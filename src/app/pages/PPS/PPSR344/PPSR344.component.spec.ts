import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR344Component } from './PPSR344.component';

describe('PPSR344Component', () => {
  let component: PPSR344Component;
  let fixture: ComponentFixture<PPSR344Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR344Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR344Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
