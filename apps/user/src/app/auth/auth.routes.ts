import { Route } from '@angular/router';

export const authRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login)
  },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./register/register').then(m => m.Register)
  // },
  // {
  //   path: 'forgot-password',
  //   loadComponent: () => import('./forgot-password/forgot-password').then(m => m.ForgotPassword)
  // }
];