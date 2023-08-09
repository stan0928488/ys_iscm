import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShipRepoComponent } from './list-ship-repo.component';

describe('ListShipRepoComponent', () => {
  let component: ListShipRepoComponent;
  let fixture: ComponentFixture<ListShipRepoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListShipRepoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListShipRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
