import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterCredentials } from '../../../interfaces/api/register-credentials';

@Component({
  selector: 'app-register',
  imports: [AuthLayoutComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private authService = inject(AuthService);
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
        //console.log(this.authService.getDecodedToken().sub);
        // this.isLoginFailed = false;
        // this.isLoggedIn = true;
        // this.router.navigate(['/expenses']);
        //this.router.navigateByUrl('');
      },
      error: err => {
        console.error(err.status, " ", err.error.message);
      }
    });
  }

    private mapFormToRegister(): RegisterCredentials {
      const { name,email, password } = this.registerForm.value;
      return {
        userName: name ?? '',
        userEmail: email ?? '',
        userPassword: password ?? ''
      };
    }

  

}
