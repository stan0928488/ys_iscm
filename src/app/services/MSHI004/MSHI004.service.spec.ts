import { TestBed } from '@angular/core/testing';

import { MSHI004Service } from './MSHI004.service';

describe('MSHI004Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MSHI004Service = TestBed.get(MSHI004Service);
    expect(service).toBeTruthy();
  });
});
