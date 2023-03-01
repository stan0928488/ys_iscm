import { TestBed } from '@angular/core/testing';

import { PASService } from './PAS.service';

describe('PASService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PASService = TestBed.get(PASService);
    expect(service).toBeTruthy();
  });
});
