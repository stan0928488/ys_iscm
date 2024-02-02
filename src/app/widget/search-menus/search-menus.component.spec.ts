import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMenusComponent } from './search-menus.component';

describe('SearchMenusComponent', () => {
  let component: SearchMenusComponent;
  let fixture: ComponentFixture<SearchMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchMenusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
