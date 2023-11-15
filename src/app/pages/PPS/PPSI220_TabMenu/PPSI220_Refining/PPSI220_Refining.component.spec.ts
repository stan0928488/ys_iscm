import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI220RefiningComponent } from './PPSI220_Refining.component';

describe('PPSI220Component', () => {
  let component: PPSI220RefiningComponent;
  let fixture: ComponentFixture<PPSI220RefiningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI220RefiningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI220RefiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
