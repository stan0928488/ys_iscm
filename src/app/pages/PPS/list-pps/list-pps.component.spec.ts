import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPpsComponent } from './list-pps.component';

describe('ListPpsComponent', () => {
  let component: ListPpsComponent;
  let fixture: ComponentFixture<ListPpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPpsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
