import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI201NonBarComponent } from './PPSI201_NonBar.component';

describe('PPSI201NonBarComponent', () => {
  let component: PPSI201NonBarComponent;
  let fixture: ComponentFixture<PPSI201NonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI201NonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI201NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
