import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services';

export const guestGuard: CanActivateFn = async () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  await authService.initialize();
  const isAuthenticated: boolean = authService.currentUser() !== null;

  if (isAuthenticated) {
    return router.createUrlTree(['/tabs/home']);
  }

  return true;
};