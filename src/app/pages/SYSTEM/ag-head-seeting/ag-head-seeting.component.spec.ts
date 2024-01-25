import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgHeadSeetingComponent } from './ag-head-seeting.component';

describe('AgHeadSeetingComponent', () => {
  let component: AgHeadSeetingComponent;
  let fixture: ComponentFixture<AgHeadSeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgHeadSeetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgHeadSeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
