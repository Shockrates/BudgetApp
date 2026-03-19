import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Household } from '../interfaces/models/household.interface';

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

  constructor() { }

  loadLoggedUserHouseholds(){
    return this.http.get<Household[]>('api/user/me/households').pipe(
      tap(households => {
        this.householdsSubject.next(households);
        this.restoreActiveHousehold(households);
    
      })
    )
  }

  private restoreActiveHousehold(households: Household[]){

      const storedHousehold = localStorage.getItem(this.ACTIVE_HOUSEHOLD_KEY);

      if(!storedHousehold) return;

      const household: Household = JSON.parse(storedHousehold);
      const validHousehold =households.find(h => h.id === household.id)
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

    localStorage.setItem(this.ACTIVE_HOUSEHOLD_KEY,JSON.stringify(household))
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
