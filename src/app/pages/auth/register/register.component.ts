import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [AuthLayoutComponent, ReactiveFormsModule],
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

  }

}
