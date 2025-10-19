import { Injectable, inject, signal } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../tokens/supabase.token';
import { UserResponse, SupabaseUserDto } from '@cigaro/shared';
import { ApiService, ApiError } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private config = inject(SUPABASE_CONFIG);
  private api = inject(ApiService);

  currentUser = signal<UserResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.supabase = createClient(this.config.url, this.config.anonKey);
    this.loadUser();
  }

  private async syncUserWithBackend(supabaseUser: User): Promise<UserResponse> {
    try {
      // Call API type-safe avec retry
      return await this.api.post<UserResponse>(
        '/auth/user',
        supabaseUser as SupabaseUserDto,
        { retryAttempts: 2 }
      );
    } catch (err) {
      if (err instanceof ApiError) {
        // Gestion erreur typée
        console.error(`API Error ${err.statusCode}: ${err.message}`, err.errors);
        throw new Error(`Impossible de synchroniser l'utilisateur: ${err.message}`);
      }
      throw err;
    }
  }

  async signIn(email: string, password: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      // 1. Auth Supabase
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // 2. Sync backend (avec gestion erreur ApiError)
      const user = await this.syncUserWithBackend(data.user);

      this.currentUser.set(user);
      return { data: user, error: null };

    } catch (err: any) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : err.message || 'Erreur de connexion';

      this.error.set(errorMessage);
      return { data: null, error: errorMessage };

    } finally {
      this.loading.set(false);
    }
  }

  async getCurrentUser(): Promise<UserResponse | null> {
    try {
      return await this.api.get<UserResponse>('/auth/me');
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        // Pas connecté = normal
        return null;
      }
      throw err;
    }
  }
}