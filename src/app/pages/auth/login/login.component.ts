import { Component, inject } from '@angular/core';
import { AuthLayoutComponent } from "../auth-layout/auth-layout.component";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { LoginCredentials } from '../../../interfaces/api/LoginCredentials.interface';
import { AuthSuccessConfig } from '../../../interfaces/ui-config/auth-success-config';
import { AuthLayoutStateService } from '../../../services/state/auth-layout-state.service';

@Component({
  selector: 'app-login',
  imports: [AuthLayoutComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private layoutState = inject(AuthLayoutStateService);
  private router = inject(Router);
  public error = false;
  public errorMessage: string = "Login failed"


  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,])
  });


  handleLogin() {
    const loginData = this.mapFormToLogin();

    //this.layoutState.setLoading();


    this.authService.login(loginData).subscribe({
      next: data => {
        // this.isLoginFailed = false;
        // this.isLoggedIn = true;
        const successConfig: AuthSuccessConfig = {
          message: 'Login successfully',
          redirectUrl: '',
          status: 'success'
        }
        this.layoutState.setSuccess(successConfig);
        //this.router.navigate(['/auth-success', successConfig]);
        //this.router.navigateByUrl('');
      },
      error: err => {
        console.error(err.status, " ", err.error.message);
        this.error = true;
        if (err.status === 401) {
          this.errorMessage = "There is an issue with your credentials"
        }
      }
    });


  }

  private mapFormToLogin(): LoginCredentials {
    const { email, password } = this.loginForm.value;
    return {
      userEmail: email ?? '',
      userPassword: password ?? ''
    };
  }
}
