import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSR345AVERAGEComponent } from './PPSR345AVERAGE.component';

describe('PPSR345AVERAGEComponent', () => {
  let component: PPSR345AVERAGEComponent;
  let fixture: ComponentFixture<PPSR345AVERAGEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PPSR345AVERAGEComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PPSR345AVERAGEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
