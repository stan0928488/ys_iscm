import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI204_NonBarComponent } from './PPSI204_NonBar.component';

describe('PPSI204_NonBarComponent', () => {
  let component: PPSI204_NonBarComponent;
  let fixture: ComponentFixture<PPSI204_NonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI204_NonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI204_NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
