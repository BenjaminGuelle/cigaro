import { inject } from '@angular/core';
import { AuthService } from '@cigaro/ng-shared';

export function initializeApp() {
  const authService: AuthService = inject(AuthService);

  return () => authService.loadUser();
}