import { TestBed } from '@angular/core/testing';

import { HouseholdService } from '../services/household.service';

describe('HouseholdService', () => {
  let service: HouseholdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseholdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
