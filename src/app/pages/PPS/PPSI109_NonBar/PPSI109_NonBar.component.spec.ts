import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI109_NonBarComponent } from './PPSI109_NonBar.component';

describe('PPSI109_NonBarComponent', () => {
  let component: PPSI109_NonBarComponent;
  let fixture: ComponentFixture<PPSI109_NonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI109_NonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI109_NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
