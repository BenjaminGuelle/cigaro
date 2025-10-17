import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards';
import { UserResponse } from '../common/responses/users';
import {
  SerializeInterceptor,
  Serialize
} from '../common/interceptors/serialize.interceptor';

export class SupabaseUserDto {
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

@Controller('auth')
@UseInterceptors(SerializeInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ==========================================
  // SUPABASE AUTH CALLBACK
  // ==========================================

  /**
   * Callback simplifié avec juste l'user Supabase
   * POST /auth/user
   */
  @Post('user')
  @Serialize(UserResponse)
  async handleUserSync(@Body() supabaseUser: SupabaseUserDto) {
    return this.authService.handleSupabaseUser(supabaseUser);
  }

  // ==========================================
  // AUTHENTICATED ROUTES
  // ==========================================

  /**
   * Vérifier le statut d'authentification
   * GET /auth/me
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserResponse)
  async getCurrentUser(@Request() req) {
    return req.user;
  }

  // ==========================================
  // HEALTH CHECK
  // ==========================================

  /**
   * Health check pour auth service
   * GET /auth/health
   */
  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      service: 'auth',
      supabase: 'integrated',
      timestamp: new Date().toISOString()
    };
  }
}