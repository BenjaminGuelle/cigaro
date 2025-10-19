import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { environment } from '../environments/environment';
import { API_URL, SUPABASE_CONFIG } from '@cigaro/ng-shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideIonicAngular({}),
    { provide: SUPABASE_CONFIG, useValue: environment.supabase },
    { provide: API_URL, useValue: environment.apiUrl }
  ],
};