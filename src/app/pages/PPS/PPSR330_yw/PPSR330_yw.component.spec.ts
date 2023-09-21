import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR330YwComponent } from './PPSR330_yw.component';

describe('PPSR330YwComponent', () => {
  let component: PPSR330YwComponent;
  let fixture: ComponentFixture<PPSR330YwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PPSR330YwComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PPSR330YwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
