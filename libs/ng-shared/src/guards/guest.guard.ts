import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services';

export const guestGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const isAuthenticated: boolean = authService.currentUser() !== null;

  if (isAuthenticated) {
    return router.createUrlTree(['/tabs/home']);
  }

  return true;
};