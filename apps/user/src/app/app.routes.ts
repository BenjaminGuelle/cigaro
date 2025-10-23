import { Route } from '@angular/router';
import { authGuard, guestGuard } from '@cigaro/ng-shared';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.tabsRoutes)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];