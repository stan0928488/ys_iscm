import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI108_NonBarComponent } from './PPSI108_NonBar.component';

describe('PPSI108_NonBarComponent', () => {
  let component: PPSI108_NonBarComponent;
  let fixture: ComponentFixture<PPSI108_NonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI108_NonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI108_NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
