import { TestBed } from '@angular/core/testing';

import { POMService } from './pom.service';

describe('POMService', () => {
  let service: POMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(POMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
