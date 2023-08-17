import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI202NonBarComponent } from './PPSI202_NonBar.component';

describe('PPSI202NonBarComponent', () => {
  let component: PPSI202NonBarComponent;
  let fixture: ComponentFixture<PPSI202NonBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSI202NonBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSI202NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
