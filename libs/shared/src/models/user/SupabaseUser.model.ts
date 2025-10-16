export interface SupabaseUserModel {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    provider?: string;
  };
  created_at: string;
}