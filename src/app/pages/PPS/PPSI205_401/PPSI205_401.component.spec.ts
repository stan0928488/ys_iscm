import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI205_401Component } from './PPSI205_401.component';

describe('PPSI205_401Component', () => {
  let component: PPSI205_401Component;
  let fixture: ComponentFixture<PPSI205_401Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSI205_401Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSI205_401Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
