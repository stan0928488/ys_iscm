import { TestBed } from '@angular/core/testing';

import { RMPService } from './RMP.service';

describe('RMPService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RMPService = TestBed.get(RMPService);
    expect(service).toBeTruthy();
  });
});
