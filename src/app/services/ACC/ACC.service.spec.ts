import { TestBed } from '@angular/core/testing';

import { ACCService } from './ACC.service';

describe('ACCService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ACCService = TestBed.get(ACCService);
    expect(service).toBeTruthy();
  });
});
