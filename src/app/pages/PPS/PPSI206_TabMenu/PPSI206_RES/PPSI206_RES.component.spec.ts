import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI206RESComponent } from './PPSI206_RES.component';

describe('PPSI206_RESComponent', () => {
  let component: PPSI206RESComponent;
  let fixture: ComponentFixture<PPSI206RESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PPSI206RESComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PPSI206RESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
