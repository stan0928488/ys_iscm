import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LABI002Component } from './LABI002.component';

describe('LABI002Component', () => {
  let component: LABI002Component;
  let fixture: ComponentFixture<LABI002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LABI002Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LABI002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
