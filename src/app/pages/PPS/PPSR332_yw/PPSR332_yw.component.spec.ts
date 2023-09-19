import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR332YwComponent } from './PPSR332_yw.component';

describe('PPSR332YwComponent', () => {
  let component: PPSR332YwComponent;
  let fixture: ComponentFixture<PPSR332YwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PPSR332YwComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PPSR332YwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
