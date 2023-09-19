import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR322Child6Component } from './PPSR322-child6.component';

describe('PPSR322Child6Component', () => {
  let component: PPSR322Child6Component;
  let fixture: ComponentFixture<PPSR322Child6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR322Child6Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR322Child6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
