import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { AuthLayoutStateService } from '../../services/state/auth-layout-state.service';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);
  layoutState = inject(AuthLayoutStateService);
  userName?: string = ""
  user$ = this.authService.loggedUser$;



  deleteUserAccount() {
    this.userService.deleteUserAccount();
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigateByUrl('login');
  }

}
