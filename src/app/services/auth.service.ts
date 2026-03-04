import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../interfaces/models/user.interface';
import { LoginCredentials } from '../interfaces/api/LoginCredentials.interface';
import { LoginResponse } from '../interfaces/api/LoginResponse.Interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_URL = 'api/auth/login';
  private readonly REGISTER_URL = 'api/auth/register'
  private readonly JWT_TOKEN = "JWT_TOKEN";
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private loggedUser = new BehaviorSubject<User | null>(null);
  private loggedId?: string;

  private http = inject(HttpClient);

  constructor() { }

  login(user: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.LOGIN_URL, user)
      .pipe(
        tap((response: LoginResponse) => {
          if (response && response.data) {
            this.doLoginUser(response.data.userName, response.data.userEmail, response.data.token, response.data.id)
          }

        })
      )
  }


  private doLoginUser(username: string, email: string, token: any, id: string): void {
    const user: User = {
      id: id,
      name: username,
      email: ""
    }
    this.loggedUser.next(user);
    this.loggedId = id;
    this.storeJwtToken(token);
    this.isAuthenticatedSubject.next(true);
  }

  private storeJwtToken(jwt: string): void {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }
}
