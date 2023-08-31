import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR321DetailTabMenuComponent } from './PPSR321-detail-tab-menu.component';

describe('PPSR321DetailTabMenuComponent', () => {
  let component: PPSR321DetailTabMenuComponent;
  let fixture: ComponentFixture<PPSR321DetailTabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PPSR321DetailTabMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PPSR321DetailTabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
