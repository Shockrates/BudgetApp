import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../interfaces/models/user.interface';
import { LoginCredentials } from '../interfaces/api/LoginCredentials.interface';
import { LoginResponse } from '../interfaces/api/LoginResponse.Interface';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { RegisterCredentials } from '../interfaces/api/register-credentials';
import { AppJwtPayload } from '../interfaces/api/jwt-payload';
import { JwtService } from './jwt.service';

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

  constructor() {
    this.loadStoredUser()
  }

  loadStoredUser() {
    const jwtToken = this.jwtService.getToken();

    if (!this.isAuthenticated()) {
      return;
    }
  
    this.http.get<LoginResponse>('/api/auth/me')
      .subscribe(resp => {

        const user: User = {
          id: resp.data.id,
          name: resp.data.userName,
          email: resp.data.userEmail
        }


        this.loggedUserSubject.next(user);
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

          console.log("FROM login ", response.data);
          if (response && response.data) {
            this.doLoginUser(response)
          }

        })
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
