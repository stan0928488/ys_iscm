import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR331YwComponent } from './PPSR331_yw.component';

describe('PPSR331YwComponent', () => {
  let component: PPSR331YwComponent;
  let fixture: ComponentFixture<PPSR331YwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PPSR331YwComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PPSR331YwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
