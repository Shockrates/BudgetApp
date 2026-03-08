import { Component, inject } from '@angular/core';
import { AuthLayoutComponent } from "../auth-layout/auth-layout.component";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { LoginCredentials } from '../../../interfaces/api/LoginCredentials.interface';

@Component({
  selector: 'app-login',
  imports: [AuthLayoutComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);


  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,])
  });


  handleLogin() {
    console.log("From Login: ", this.loginForm.value);
    const loginData = this.mapFormToLogin();


    this.authService.login(loginData).subscribe({
      next: data => {
        //console.log(this.authService.getDecodedToken().sub);
        // this.isLoginFailed = false;
        // this.isLoggedIn = true;
        // this.router.navigate(['/expenses']);
        this.router.navigateByUrl('');
      },
      error: err => {
        console.error(err.status, " ", err.error.message);
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
