import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { Household } from '../interfaces/models/household.interface';
import { UserHouseholdResponse } from '../interfaces/api/UserHouseholdResponse';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService {

  private readonly HOUSEHOLD_URL = 'api/household';
  private readonly ACTIVE_HOUSEHOLD_KEY = 'ACTIVE_HOUSEHOLD_ID';

  http = inject(HttpClient);

  private householdsSubject = new BehaviorSubject<Household[]>([]);
  households$ = this.householdsSubject.asObservable();

  private activeHouseholdSubject = new BehaviorSubject<Household | null>(null);
  activeHouseholds$ = this.activeHouseholdSubject.asObservable();

  constructor() {
    this.loadLoggedUserHouseholds().subscribe();
   }

  loadLoggedUserHouseholds() {
    return this.http.get<UserHouseholdResponse>('api/users/me/households').pipe(
      map(response => response.data.userHouseholds),
      tap(households => {
        this.householdsSubject.next(households);
        this.restoreActiveHousehold(households);
        console.log(this.householdsSubject.value);


      }),
      catchError(err => {
      console.error('Failed to load households', err);
      return of([]); // fallback to empty array
    })
    )
  }

  private restoreActiveHousehold(households: Household[]) {

    const storedHousehold = localStorage.getItem(this.ACTIVE_HOUSEHOLD_KEY);

    if (!storedHousehold) return;

    const household: Household = JSON.parse(storedHousehold);
    const validHousehold = households.find(h => h.id === household.id)
    if (validHousehold) {
      this.activeHouseholdSubject.next(validHousehold);
    } else {
      this.clearActiveHousehold();
    }

  }

  setActiveHousehold(household: Household) {

    const households = this.householdsSubject.getValue();

    const exists = households.some(h => h.id === household.id);
    if (!exists) {
      console.warn('Trying to set invalid household');
      this.clearActiveHousehold();
      return;
    }

    localStorage.setItem(this.ACTIVE_HOUSEHOLD_KEY, JSON.stringify(household))
    this.activeHouseholdSubject.next(household);
  }

  getActiveHousehold(): Household | null {
    return this.activeHouseholdSubject.getValue();
  }

  clearActiveHousehold() {
    localStorage.removeItem(this.ACTIVE_HOUSEHOLD_KEY);
    this.activeHouseholdSubject.next(null);
  }

}
