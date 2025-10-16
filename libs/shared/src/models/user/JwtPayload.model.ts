export interface JwtPayloadModel {
  sub: string;           // user ID
  email: string;
  aud: string;          // audience
  exp: number;          // expiration timestamp
  iat: number;          // issued at timestamp
  iss: string;          // issuer
  role?: string;        // Supabase role
  session_id?: string;
}