import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI206TabMenuComponent } from './PPSI206_TabMenu.component';

describe('PPSI206TabMenuComponent', () => {
  let component: PPSI206TabMenuComponent;
  let fixture: ComponentFixture<PPSI206TabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSI206TabMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSI206TabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
