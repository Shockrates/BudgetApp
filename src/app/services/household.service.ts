import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, switchMap, tap } from 'rxjs';
import { Household } from '../interfaces/models/household.interface';
import { UserHouseholdResponse } from '../interfaces/api/UserHouseholdResponse';
import { HouseholdResponse } from '../interfaces/api/householdResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService {

  private readonly HOUSEHOLD_URL = 'api/household';
  private readonly ACTIVE_HOUSEHOLD_KEY = 'ACTIVE_HOUSEHOLD';

  http = inject(HttpClient);

  private householdsSubject = new BehaviorSubject<Household[]>([]);
  households$ = this.householdsSubject.asObservable();

  private activeHouseholdSubject = new BehaviorSubject<Household | null>(null);
  activeHouseholds$ = this.activeHouseholdSubject.asObservable();

  constructor() {
  }

  loadLoggedUserHouseholds() {
    return this.http.get<UserHouseholdResponse>('api/users/me/households').pipe(
      map(response => response.data.userHouseholds),
      tap(households => {
        this.setHouseholdsSubject(households);
        console.log("SERVICE RUNS");
      }),
      catchError(err => {
        console.error('Failed to load households', err);
        return of([]); // fallback to empty array
      })
    )
  }

  createHousehold(name: string) {
    return this.http.post<HouseholdResponse>(this.HOUSEHOLD_URL, { name: name }).pipe(
      map(response => response.data),
      switchMap((household) =>
        this.loadLoggedUserHouseholds().pipe(
          tap(() =>
            this.setActiveHousehold(household)
          ),
          map(() => household)
        ),
      ),
      catchError(err => {
        console.error('Failed to save households', err);
        return of(null);
      })
    )
  }

  private restoreActiveHousehold(households: Household[]) {

    const storedHousehold = localStorage.getItem(this.ACTIVE_HOUSEHOLD_KEY);
    // console.log("From restoreActiveHousehold " + households[0].name);

    if (!storedHousehold) {
      this.activeHouseholdSubject.next(null);
      return;
    }

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

  getActiveHouseholdOrThorw(): Household  {
    const household = this.activeHouseholdSubject.getValue();
    if (!household) {
      throw new Error('Active household is required but was null');
    }
    return household;
  }
  
  getHouseholds(): Household[] {
    return this.householdsSubject.getValue();
  }

  setHouseholdsSubject(households: Household[]) {
    this.householdsSubject.next(households);
    this.restoreActiveHousehold(households);
  }

  clearActiveHousehold() {
    localStorage.removeItem(this.ACTIVE_HOUSEHOLD_KEY);
    this.activeHouseholdSubject.next(null);
  }

}
