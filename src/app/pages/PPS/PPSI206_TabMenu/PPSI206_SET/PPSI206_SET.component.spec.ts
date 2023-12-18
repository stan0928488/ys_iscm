import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI206SETComponent } from './PPSI206_SET.component';

describe('PPSI206_SETComponent', () => {
  let component: PPSI206SETComponent;
  let fixture: ComponentFixture<PPSI206SETComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PPSI206SETComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PPSI206SETComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
