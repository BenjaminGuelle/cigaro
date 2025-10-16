import { User } from '../../models';

export interface AuthUserResponse {
  user: User;
  isProfileComplete: boolean;
  needsProfileCompletion: boolean; // True si pseudo manque après OAuth
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}