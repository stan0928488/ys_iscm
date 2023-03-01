import { TestBed } from '@angular/core/testing';

import { DCMService } from './DCM.service';

describe('DCMService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DCMService = TestBed.get(DCMService);
    expect(service).toBeTruthy();
  });
});
