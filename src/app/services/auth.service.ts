import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_URL = 'api/auth/login';
  //private readonly LOGIN_URL = 'http://localhost:8080/api/auth/login';
  private readonly REGISTER_URL = 'api/auth/register'

  private http = inject(HttpClient);

  constructor() { }

  login(user: { userEmail: string, userPassword: string }): Observable<any> {
    return this.http.post(this.LOGIN_URL, user)
  }
}
