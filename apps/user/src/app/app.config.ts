import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { environment } from '../environments/environment';
import { API_URL, AuthService, SUPABASE_CONFIG } from '@cigaro/ng-shared';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideIonicAngular({}),
    { provide: SUPABASE_CONFIG, useValue: environment.supabase },
    { provide: API_URL, useValue: environment.apiUrl },
  ],
};