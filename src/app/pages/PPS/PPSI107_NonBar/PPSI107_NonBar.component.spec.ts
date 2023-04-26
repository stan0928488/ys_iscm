import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI107_NonBarComponent } from './PPSI107_NonBar.component';

describe('PPSI107_NonBarComponent', () => {
  let component: PPSI107_NonBarComponent;
  let fixture: ComponentFixture<PPSI107_NonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI107_NonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI107_NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
