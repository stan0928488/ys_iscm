import { TestBed } from '@angular/core/testing';

import { MSHService } from './MSH.service';

describe('MSHService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MSHService = TestBed.get(MSHService);
    expect(service).toBeTruthy();
  });
});
