import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../interfaces/models/user.interface';
import { LoginCredentials } from '../interfaces/api/LoginCredentials.interface';
import { LoginResponse } from '../interfaces/api/LoginResponse.Interface';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_URL = 'api/auth/login';
  private readonly REGISTER_URL = 'api/auth/register'
  private readonly JWT_TOKEN = "JWT_TOKEN";

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private loggedUserSubject = new BehaviorSubject<User | null>(null);
  public loggedUser$ = this.loggedUserSubject.asObservable()


  private http = inject(HttpClient);

  constructor() {
    this.loadStoredUser()
  }

  loadStoredUser() {
    const jwtToken = this.getToken();

    if (!jwtToken) {
      return;
    }

    this.http.get<LoginResponse>('/api/auth/me')
      .subscribe(resp => {

        const user: User = {
          id: resp.data.id,
          name: resp.data.userName,
          email: this.getDecodedToken().sub
        }


        this.loggedUserSubject.next(user);
      });
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
    this.storeJwtToken(response.data.token);

  }

  private storeJwtToken(jwt: string): void {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.loggedUserSubject.value
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isTokenExpired(): boolean {
    const decodedToken = this.getDecodedToken();
    if (decodedToken == null || !decodedToken.exp) {
      return true;
    }
    const expirationDate = decodedToken.exp * 1000
    const now = new Date().getTime();

    return expirationDate < now
  }

  logout(): void {
    //localStorage.removeItem(this.JWT_TOKEN);
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.loggedUserSubject.next(null);
  }


}
