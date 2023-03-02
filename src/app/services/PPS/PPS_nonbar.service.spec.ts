import { TestBed } from '@angular/core/testing';

import { PPSService } from './PPS.service';

describe('PPSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PPSService = TestBed.get(PPSService);
    expect(service).toBeTruthy();
  });
});
