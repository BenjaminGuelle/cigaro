import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CompleteProfileRequest, SupabaseUserModel } from '@cigaro/libs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('oauth/callback')
  async oauthCallback(@Body() body: { supabaseUser: SupabaseUserModel }) {
    return this.authService.handleAuthCallback(body.supabaseUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getUserProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/complete')
  async completeProfile(
    @Request() req,
    @Body() completeProfileRequest: CompleteProfileRequest
  ) {
    return this.authService.completeUserProfile(req.user.id, completeProfileRequest);
  }
}