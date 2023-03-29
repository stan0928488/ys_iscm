import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI104_NonBarComponent } from './PPSI104_NonBar.component';

describe('PPSI104_NonBarComponent', () => {
  let component: PPSI104_NonBarComponent;
  let fixture: ComponentFixture<PPSI104_NonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI104_NonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI104_NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
