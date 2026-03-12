import { Component, effect, inject } from '@angular/core';
import { AuthLayoutStateService } from '../../../services/state/auth-layout-state.service';
import { AuthSuccessComponent } from "../authsuccess/authsuccess.component";
import { Router } from '@angular/router';
import { AuthSuccessConfig } from '../../../interfaces/ui-config/auth-success-config';

@Component({
  selector: 'app-auth-layout',
  imports: [AuthSuccessComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {


  public layoutState = inject(AuthLayoutStateService);
  private router = inject(Router);

  
  // logEffect = effect(() => {
  //   console.log(this.layoutState.config());
  // });

  private resetEffect = effect(() => {
    const authConfig = this.layoutState.config();
    if (authConfig.status === 'success') {
      setTimeout(() => {
        this.router.navigateByUrl(authConfig.redirectUrl);
        this.layoutState.reset();
      }, 3000);
    }
  });

  constructor() {
    
  }

  
  




}
