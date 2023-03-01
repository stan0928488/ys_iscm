import { TestBed } from '@angular/core/testing';

import { OIPService } from './OIP.service';

describe('OIPService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OIPService = TestBed.get(OIPService);
    expect(service).toBeTruthy();
  });
});
