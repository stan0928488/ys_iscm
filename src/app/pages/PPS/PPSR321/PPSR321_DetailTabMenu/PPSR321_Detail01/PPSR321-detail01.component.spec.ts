import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR321Detail01Component } from './PPSR321-detail01.component';

describe('PPSR321Detail01Component', () => {
  let component: PPSR321Detail01Component;
  let fixture: ComponentFixture<PPSR321Detail01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR321Detail01Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR321Detail01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
