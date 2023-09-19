import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSaleInputComponent } from './list-sale-input.component';

describe('ListSaleInputComponent', () => {
  let component: ListSaleInputComponent;
  let fixture: ComponentFixture<ListSaleInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSaleInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSaleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
