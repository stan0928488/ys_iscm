import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI202TabMenuComponent } from './PPSI202_TabMenu.component';

describe('PPSI202TabMenuComponent', () => {
  let component: PPSI202TabMenuComponent;
  let fixture: ComponentFixture<PPSI202TabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSI202TabMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSI202TabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
