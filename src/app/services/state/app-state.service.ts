import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HouseholdService } from '../household.service';
import { AuthService } from '../auth.service';
import { BehaviorSubject, catchError, map, Observable, of, take, tap } from 'rxjs';
import { JwtService } from '../jwt.service';
import { User } from '../../interfaces/models/user.interface';
import { UserHouseholdResponse } from '../../interfaces/api/UserHouseholdResponse';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private http = inject(HttpClient);
  private householdService = inject(HouseholdService);
  private authService = inject(AuthService);
  private jwtService = inject(JwtService);

  private initializedSubject = new BehaviorSubject<boolean>(false);
  initialized$ = this.initializedSubject.asObservable();

  constructor() { }

  initializeApp(): Observable<void> {

    if (!this.authService.isAuthenticated()) {
      this.initializedSubject.next(true);
      return of(undefined);
    }


    return this.http.get<UserHouseholdResponse>('/api/users/me/households').pipe(
      tap(resp => {
        const user: User = {
          id: resp.data.user.userId.toString(),
          name: resp.data.user.userName,
          email: resp.data.user.userEmail
        }
        this.authService.setCurrentUser(user);

        this.householdService.setHouseholdsSubject(
          resp.data.userHouseholds
        );
      }),
      map(() => undefined),
      catchError(error => {
        if (error.status === 401) {
          console.warn('Invalid token → logging out');
          this.authService.logout(); // 🔥 important
        } else {
          console.error('Initialization failed', error);
        }

        return of(undefined)
      }),
      tap(() => this.initializedSubject.next(true))
    );

  }
}
