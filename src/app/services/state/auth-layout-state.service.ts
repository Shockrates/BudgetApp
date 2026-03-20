import { Injectable, signal } from '@angular/core';
import { authStatus, AuthSuccessConfig } from '../../interfaces/ui-config/auth-success-config';

@Injectable({
  providedIn: 'root'
})
export class AuthLayoutStateService {

  config = signal<AuthSuccessConfig>({ message: "", redirectUrl: '', status: 'default' });

  constructor() { }

  setSuccess(successConfig: AuthSuccessConfig) {
    this.config.set({ ...successConfig });
    //this.config.update(x => ({ ...x, firstName: 'Danny' }))
  }

  setLoading() {
    this.config.set({
      message: '',
      redirectUrl: '',
      status: 'loading'
    });
  }

  reset() {
    this.config.set({ message: "", redirectUrl: '', status: 'default' });
  }


}

