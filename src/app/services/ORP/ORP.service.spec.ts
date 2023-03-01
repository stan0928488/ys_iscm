import { TestBed } from '@angular/core/testing';

import { ORPService } from './ORP.service';

describe('ORPService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ORPService = TestBed.get(ORPService);
    expect(service).toBeTruthy();
  });
});
