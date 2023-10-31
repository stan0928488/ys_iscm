import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI210ComponentXxx } from './PPSI210_Refining.component';

describe('PPSI210Component', () => {
  let component: PPSI210ComponentXxx;
  let fixture: ComponentFixture<PPSI210ComponentXxx>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI210ComponentXxx ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI210ComponentXxx);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
