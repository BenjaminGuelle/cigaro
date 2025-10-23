import { Injectable, inject, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { UserResponse } from '@cigaro/shared';
import { ApiError } from './api.service';
import { SUPABASE_CONFIG, SupabaseConfig } from '../tokens';
import { ApiClientService } from './api-client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #supabase!: SupabaseClient;
  #config: SupabaseConfig = inject(SUPABASE_CONFIG);
  #apiClient: ApiClientService = inject(ApiClientService);
  #initialized = false;

  currentUser = signal<UserResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  async initialize() {
    if (this.#initialized) return;

    const supabase = this.#getSupabase();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && event !== 'SIGNED_OUT') {
        try {
          const user = await this.#syncUserWithBackend(session.user);
          this.currentUser.set(user);
        } catch (error) {
          console.error('Auth sync error:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        this.currentUser.set(null);
      }
    });

    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      try {
        const user = await this.#syncUserWithBackend(data.session.user);
        this.currentUser.set(user);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    }

    this.#initialized = true;
  }

  async loadUser() {
    const { data } = await this.#getSupabase().auth.getUser();
    if (data.user) {
      try {
        const user: UserResponse = await this.#syncUserWithBackend(data.user);
        this.currentUser.set(user);
      } catch (error) {
        console.error('Failed to load user:', error);
        this.currentUser.set(null);
      }
    }
  }

  // ==========================================
  // EMAIL/PASSWORD AUTH
  // ==========================================

  async signIn(email: string, password: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.#getSupabase().auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (error) throw error;

      const user = await this.#syncUserWithBackend(data.user);
      this.currentUser.set(user);
      return { data: user, error: null };
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : err.message || 'Erreur de connexion';

      this.error.set(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      this.loading.set(false);
    }
  }

  async signUp(email: string, password: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.#getSupabase().auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const user: UserResponse = await this.#syncUserWithBackend(data.user!);
      this.currentUser.set(user);
      return { data: user, error: null };
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : err.message || "Erreur lors de l'inscription";

      this.error.set(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      this.loading.set(false);
    }
  }

  // ==========================================
  // OAUTH
  // ==========================================

  async signInWithGoogle() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.#getSupabase().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur connexion Google';
      this.error.set(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      this.loading.set(false);
    }
  }

  async signInWithApple() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.#getSupabase().auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur connexion Apple';
      this.error.set(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      this.loading.set(false);
    }
  }

  // ==========================================
  // PASSWORD RESET
  // ==========================================

  async resetPassword(email: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { error } = await this.#getSupabase().auth.resetPasswordForEmail(
        email
      );
      if (error) throw error;

      return { success: true, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la réinitialisation';
      this.error.set(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      this.loading.set(false);
    }
  }

  // ==========================================
  // SIGN OUT
  // ==========================================

  async signOut() {
    this.loading.set(true);

    try {
      const { error } = await this.#getSupabase().auth.signOut();
      if (error) throw error;

      this.currentUser.set(null);
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Erreur lors de la déconnexion' };
    } finally {
      this.loading.set(false);
    }
  }

  // ==========================================
  // HELPERS
  // ==========================================

  async getCurrentUser(): Promise<UserResponse | null> {
    try {
      return await this.#apiClient.call('auth', 'getCurrentUser');
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        return null;
      }
      throw err;
    }
  }

  #getSupabase(): SupabaseClient {
    if (!this.#supabase) {
      this.#supabase = createClient(this.#config.url, this.#config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      });
    }
    return this.#supabase;
  }

  async #syncUserWithBackend(supabaseUser: User): Promise<UserResponse> {
    return this.#apiClient.call('auth', 'syncUser', supabaseUser);
  }
}
