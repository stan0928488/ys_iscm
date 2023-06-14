import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR308Component } from './PPSR308.component';

describe('PPSR308Component', () => {
  let component: PPSR308Component;
  let fixture: ComponentFixture<PPSR308Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR308Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR308Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
