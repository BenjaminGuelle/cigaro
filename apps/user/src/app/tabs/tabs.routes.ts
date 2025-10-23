import { Route } from '@angular/router';
import { Tabs } from './tabs';

export const tabsRoutes: Route[] = [
  {
    path: '',
    component: Tabs,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('../home/home').then(m => m.Home)
      }
    ]
  }
];