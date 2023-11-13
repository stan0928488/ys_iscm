import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI230TabMenuComponent } from './PPSI230_TabMenu.component';

describe('PPSI230TabMenuComponent', () => {
  let component: PPSI230TabMenuComponent;
  let fixture: ComponentFixture<PPSI230TabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSI230TabMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSI230TabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
