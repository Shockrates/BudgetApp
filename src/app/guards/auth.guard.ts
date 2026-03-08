import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService)
  //const userService = inject(UserService)
  // if (!userService.isLoggedIn()) {
  if (!authService.isAuthenticated()) {
    router.navigateByUrl('login');
    return false;
  }
  return true;
};
