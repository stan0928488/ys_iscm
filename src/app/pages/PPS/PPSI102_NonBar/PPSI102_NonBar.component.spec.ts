import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI102_NonBarComponent } from './PPSI102_NonBar.component';

describe('PPSI102_NonBarComponent', () => {
  let component: PPSI102_NonBarComponent;
  let fixture: ComponentFixture<PPSI102_NonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI102_NonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI102_NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
