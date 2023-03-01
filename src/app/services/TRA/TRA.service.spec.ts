import { TestBed } from '@angular/core/testing';

import { TRAService } from './TRA.service';

describe('TRAService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TRAService = TestBed.get(TRAService);
    expect(service).toBeTruthy();
  });
});
