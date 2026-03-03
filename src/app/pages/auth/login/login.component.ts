import { Component, inject } from '@angular/core';
import { AuthLayoutComponent } from "../auth-layout/auth-layout.component";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

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

    //this.userService.addUser(this.accountForm.value.name);
    //this.router.navigateByUrl('');
    console.log(this.loginForm.value);
    //const loginData = this.mapFormToLogin();

    //this.authService.login({userEmail:username, userPassword:password}).subscribe({
    this.authService.login({ userEmail: this.loginForm.value.email, userPassword: this.loginForm.value.password }).subscribe({
      next: data => {
        //this.storageService.saveUser(data);
        console.log(data);
        // this.isLoginFailed = false;
        // this.isLoggedIn = true;
        // this.router.navigate(['/expenses']);
      },
      error: err => {
        console.error(err.error.message);

        // this.errorMessage = err.error.message;
        // this.isLoginFailed = true;
      }
    });


  }
}
