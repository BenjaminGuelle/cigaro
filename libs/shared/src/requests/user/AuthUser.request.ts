export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  pseudo: string;
}

export interface OAuthCallbackRequest {
  code: string;
  provider: 'google' | 'apple';
}