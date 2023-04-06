import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI105_NonBarComponent } from './PPSI105_NonBar.component';

describe('PPSI105_NonBarComponent', () => {
  let component: PPSI105_NonBarComponent;
  let fixture: ComponentFixture<PPSI105_NonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI105_NonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI105_NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
