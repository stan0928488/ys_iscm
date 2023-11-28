import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI220TabMenuComponent } from './PPSI220_TabMenu.component';

describe('PPSI220TabMenuComponent', () => {
  let component: PPSI220TabMenuComponent;
  let fixture: ComponentFixture<PPSI220TabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSI220TabMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSI220TabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
