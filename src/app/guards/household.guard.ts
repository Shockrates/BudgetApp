import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HouseholdService } from '../services/household.service';

export const HouseholdGuard: CanActivateFn = (route, state) => {

  const householdService = inject(HouseholdService);
  const router = inject(Router);

  const active = householdService.getActiveHousehold();

  if (!active) {
    router.navigate(['/household/dashboard']);
    return false;
  }

  return true;
};
