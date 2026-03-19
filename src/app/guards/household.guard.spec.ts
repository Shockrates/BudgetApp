import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { householdGuard } from './household.guard';

describe('householdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => householdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
