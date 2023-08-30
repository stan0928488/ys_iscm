import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR321Detail02Component } from './PPSR321-detail02.component';

describe('PPSR321Detail02Component', () => {
  let component: PPSR321Detail02Component;
  let fixture: ComponentFixture<PPSR321Detail02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR321Detail02Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR321Detail02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
