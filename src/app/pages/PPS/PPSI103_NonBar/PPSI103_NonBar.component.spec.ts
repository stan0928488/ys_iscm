import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI103_NonBarComponent } from './PPSI103_NonBar.component';

describe('PPSI103_NonBarComponent', () => {
  let component: PPSI103_NonBarComponent;
  let fixture: ComponentFixture<PPSI103_NonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI103_NonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI103_NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
