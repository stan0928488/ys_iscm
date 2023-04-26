import { TestBed } from '@angular/core/testing';

import { LABService } from './LAB.service';

describe('LABService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LABService = TestBed.get(LABService);
    expect(service).toBeTruthy();
  });
});
