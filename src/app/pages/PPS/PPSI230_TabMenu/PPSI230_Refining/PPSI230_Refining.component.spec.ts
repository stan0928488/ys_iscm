import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI230RefiningComponent } from './PPSI230_Refining.component';

describe('PPSI210RefiningComponent', () => {
  let component: PPSI230RefiningComponent;
  let fixture: ComponentFixture<PPSI230RefiningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI230RefiningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI230RefiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
