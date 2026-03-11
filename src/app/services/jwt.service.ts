import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AppJwtPayload } from '../interfaces/api/jwt-payload';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

    private readonly JWT_TOKEN = "JWT_TOKEN";

  constructor() { }

  storeJwtToken(jwt: string): void {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getDecodedToken(token:string): AppJwtPayload{
      return jwtDecode<AppJwtPayload>(token);
  }

  

  isTokenExpired(): boolean {
    const token = this.getToken();

    if(!token){
      return true
    }

    const decodedToken = this.getDecodedToken(token);

    if (decodedToken == null || !decodedToken.exp) {
      return true;
    }
    const expirationDate = decodedToken.exp * 1000
    const now = new Date().getTime();

    return expirationDate < now

      //const payload = JSON.parse(atob(token.split('.')[1]));
    //const expiration = payload.exp * 1000; // convert to ms
    //return Date.now() > expiration;
  }
}
