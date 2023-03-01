import { TestBed } from '@angular/core/testing';

import { PLGService } from './PLG.service';

describe('PLGService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PLGService = TestBed.get(PLGService);
    expect(service).toBeTruthy();
  });
});
