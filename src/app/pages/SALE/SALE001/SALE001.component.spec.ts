import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SALE001Component } from './SALE001.component';

describe('SALE001Component', () => {
  let component: SALE001Component;
  let fixture: ComponentFixture<SALE001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SALE001Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SALE001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
