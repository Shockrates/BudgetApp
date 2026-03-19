import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { User } from '../interfaces/models/user.interface';
import { LoginCredentials } from '../interfaces/api/LoginCredentials.interface';
import { LoginResponse } from '../interfaces/api/LoginResponse.Interface';
import { RegisterCredentials } from '../interfaces/api/register-credentials';
import { JwtService } from './jwt.service';
import { catchError, switchMap } from 'rxjs/operators';
import { HouseholdService } from './household.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_URL = 'api/auth/login';
  private readonly REGISTER_URL = 'api/auth/register'


  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private loggedUserSubject = new BehaviorSubject<User | null>(null);
  public loggedUser$ = this.loggedUserSubject.asObservable()


  private http = inject(HttpClient);
  private jwtService = inject(JwtService);
  private householdService = inject(HouseholdService);

  constructor() {
    this.loadStoredUser()
  }

  loadStoredUser() {
    const jwtToken = this.jwtService.getToken();

    if (!this.isAuthenticated()) {
      return;
    }
  
    this.http.get<LoginResponse>('/api/auth/me').pipe(
        catchError(error => {
        
          console.error('Error fetching user data:', error);

          // Handle specific error cases
          if (error.status === 401) {
            console.warn('Unauthorized access - token may be invalid.');
          } else {
            console.warn('Failed to load user data. Please try again later.');
          }
          return of(null);
        })
      )
      .subscribe(resp => {
        console.log(resp);
        
        if (resp) {
          console.log(resp);
        
        const user: User = {
          id: resp.data.id,
          name: resp.data.userName,
          email: resp.data.userEmail
        }
        this.loggedUserSubject.next(user);
        }
        
      });
  }

  register(user:RegisterCredentials){
    return this.http.post<any>(this.REGISTER_URL, user).pipe(
       tap((response) => {

          console.log("FROM register service", response.data);
          

        })
      
    )
  }

  login(user: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.LOGIN_URL, user)
      .pipe(
        tap((response: LoginResponse) => {
          if (response && response.data) {
            this.doLoginUser(response)
          }
        }),
        switchMap(() => this.householdService.loadLoggedUserHouseholds())
      )
  }


  private doLoginUser(response: LoginResponse): void {
    const user: User = {
      id: response.data.id,
      name: response.data.userName,
      email: response.data.userEmail

    }
    this.loggedUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.jwtService.storeJwtToken(response.data.token);

  }

  getCurrentUser(): User | null {
    return this.loggedUserSubject.value
  }

  isAuthenticated(): boolean {
    const token = this.jwtService.getToken();
    const isExpired = this.jwtService.isTokenExpired()
    return !!token && !isExpired;
  }

  logout(): void {
    //localStorage.removeItem(this.JWT_TOKEN);
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.loggedUserSubject.next(null);
  }


}
