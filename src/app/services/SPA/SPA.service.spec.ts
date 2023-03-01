import { TestBed } from '@angular/core/testing';

import { SPAService } from './SPA.service';

describe('SPAService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SPAService = TestBed.get(SPAService);
    expect(service).toBeTruthy();
  });
});
