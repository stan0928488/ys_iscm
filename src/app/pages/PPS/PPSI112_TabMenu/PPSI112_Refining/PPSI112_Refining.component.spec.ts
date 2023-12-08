import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PPSI112RefinIngComponent } from './PPSI112_Refining.component';

describe('PPSI112Component', () => {
  let component: PPSI112RefinIngComponent;
  let fixture: ComponentFixture<PPSI112RefinIngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PPSI112RefinIngComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PPSI112RefinIngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
