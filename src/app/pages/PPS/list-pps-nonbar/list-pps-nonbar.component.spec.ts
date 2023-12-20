import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPpsNonbarComponent } from './list-pps-nonbar.component';

describe('ListPpsNonbarComponent', () => {
  let component: ListPpsNonbarComponent;
  let fixture: ComponentFixture<ListPpsNonbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPpsNonbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPpsNonbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
