import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI210TabMenuComponent } from './PPSI210_TabMenu.component';

describe('PPSI210TabMenuComponent', () => {
  let component: PPSI210TabMenuComponent;
  let fixture: ComponentFixture<PPSI210TabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSI210TabMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSI210TabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
