export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface SupabaseUserDto {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    full_name?: string;
  };
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
}