import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonPpsiComponent } from './non-ppsi.component';

describe('NonPpsiComponent', () => {
  let component: NonPpsiComponent;
  let fixture: ComponentFixture<NonPpsiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonPpsiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonPpsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
