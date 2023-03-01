import { TestBed } from '@angular/core/testing';

import { SFCService } from './SFC.service';

describe('SFCService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SFCService = TestBed.get(SFCService);
    expect(service).toBeTruthy();
  });
});
