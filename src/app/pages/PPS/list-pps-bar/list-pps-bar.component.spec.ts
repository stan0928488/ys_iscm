import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPpsBarComponent } from './list-pps-bar.component';

describe('ListPpsBarComponent', () => {
  let component: ListPpsBarComponent;
  let fixture: ComponentFixture<ListPpsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPpsBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPpsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
