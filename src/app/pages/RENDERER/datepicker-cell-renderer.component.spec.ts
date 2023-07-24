import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerCellRendererComponent } from './datepicker-cell-renderer.component';

describe('DatePickerCellRendererComponent', () => {
  let component: DatePickerCellRendererComponent;
  let fixture: ComponentFixture<DatePickerCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatePickerCellRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
