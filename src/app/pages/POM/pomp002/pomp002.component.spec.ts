import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POMP002Component } from './pomp002.component';

describe('POMP002Component', () => {
  let component: POMP002Component;
  let fixture: ComponentFixture<POMP002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POMP002Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POMP002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
