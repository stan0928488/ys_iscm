import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR303TabMenuComponent } from './PPSR303_TabMenu.component';

describe('PPSR303TabMenuComponent', () => {
  let component: PPSR303TabMenuComponent;
  let fixture: ComponentFixture<PPSR303TabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR303TabMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR303TabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
