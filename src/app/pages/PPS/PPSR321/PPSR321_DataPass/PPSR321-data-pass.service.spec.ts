import { TestBed } from '@angular/core/testing';

import { PPSR321DataPassService } from './PPSR321-data-pass.service';

describe('PPSR321DataPassService', () => {
  let service: PPSR321DataPassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PPSR321DataPassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
