import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterCredentials } from '../../../interfaces/api/register-credentials';
import { AuthSuccessConfig } from '../../../interfaces/ui-config/auth-success-config';
import { AuthLayoutStateService } from '../../../services/state/auth-layout-state.service';

@Component({
  selector: 'app-register',
  imports: [AuthLayoutComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private authService = inject(AuthService);
  private layoutState = inject(AuthLayoutStateService);
  private router = inject(Router);


  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required,]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,])
  });

  handleRegister() {
    console.log("From Register Form: ", this.registerForm.value);
    const registerdData = this.mapFormToRegister();


    this.authService.register(registerdData).subscribe({
      next: data => {
        console.log(data.message);
        // this.isLoginFailed = false;
        // this.isLoggedIn = true;
        // this.router.navigate(['/expenses']);
        const successConfig: AuthSuccessConfig = {
          message: 'Account created successfully',
          redirectUrl: '/login',
          status:"success"
        }
        this.layoutState.setSuccess(successConfig);
      },
      error: err => {
        console.error(err.error.message);
      }
    });
  }

  private mapFormToRegister(): RegisterCredentials {
    const { name, email, password } = this.registerForm.value;
    return {
      userName: name ?? '',
      userEmail: email ?? '',
      userPassword: password ?? ''
    };
  }



}
