import { Injectable, signal } from '@angular/core';
import { AuthSuccessConfig } from '../../interfaces/ui-config/auth-success-config';

@Injectable({
  providedIn: 'root'
})
export class AuthLayoutStateService {

  config = signal<string>('default');

  constructor() { }

  setSuccess() {
    this.config.set('success');
  }

  reset() {
    this.config.set('default');
  }
}
