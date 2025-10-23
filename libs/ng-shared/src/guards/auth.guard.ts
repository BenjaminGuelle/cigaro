import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@cigaro/ng-shared';

export const authGuard: CanActivateFn = async () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  await authService.initialize();
  const isAuthenticated: boolean = authService.currentUser() !== null;

  if (!isAuthenticated) {
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};