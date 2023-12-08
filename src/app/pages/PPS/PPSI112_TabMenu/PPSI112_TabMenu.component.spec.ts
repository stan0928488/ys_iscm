import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI112TabMenuComponent } from './PPSI112_TabMenu.component';

describe('PPSI112TabMenuComponent', () => {
  let component: PPSI112TabMenuComponent;
  let fixture: ComponentFixture<PPSI112TabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSI112TabMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSI112TabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
