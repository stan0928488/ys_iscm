import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI110_NonBarComponent } from './PPSI110_NonBar.component';

describe('PPSI110_NonBarComponent', () => {
  let component: PPSI110_NonBarComponent;
  let fixture: ComponentFixture<PPSI110_NonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPSI110_NonBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPSI110_NonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
