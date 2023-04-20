import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD
import { LABI101Component } from './LABI101.component';

describe('LABI101Component', () => {
  let component: LABI101Component;
  let fixture: ComponentFixture<LABI101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LABI101Component ]
=======
import { LABI001Component } from './LABI001.component';

describe('LABI001Component', () => {
  let component: LABI001Component;
  let fixture: ComponentFixture<LABI001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LABI001Component ]
>>>>>>> ur12998
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD
    fixture = TestBed.createComponent(LABI101Component);
=======
    fixture = TestBed.createComponent(LABI001Component);
>>>>>>> ur12998
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
