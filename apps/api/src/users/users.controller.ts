import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PublicUserProfile, User, UserProfile } from '@cigaro/libs';
import { AdminGuard } from '../auth/admin.guard';
import { ErrorManager } from '../common/errors/error-manager';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * ADMIN API
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/users')
  async getAllUsersForAdmin(): Promise<User[]> {
    try {
      return await this.usersService.getAllUsersForAdmin();
    } catch (error) {
      ErrorManager.handleError(error, 'getAllUsersForAdmin');
    }
  }

  /**
   * PUBLIC API
   */
  @Get('public-users')
  async getAllPublicUsers(): Promise<PublicUserProfile[]> {
    try {
      return await this.usersService.getAllPublicUsers();
    } catch (error) {
      ErrorManager.handleError(error, 'getAllPublicUsers');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req): Promise<UserProfile> {
    try {
      return await this.usersService.getUserProfile(req.user.id);
    } catch (error) {
      ErrorManager.handleError(error, 'getUserProfile');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req
  ): Promise<PublicUserProfile> {
    try {
      return await this.usersService.getPublicUserProfile(id, req.user.id);
    } catch (error) {
      ErrorManager.handleError(error, 'getPublicUserProfile');
    }
  }

  /**
   * TEST API
   */
  @Post('test')
  async createTestUser(): Promise<User> {
    if (process.env.NODE_ENV === 'production') {
      ErrorManager.testDisabled();
    }

    try {
      return await this.usersService.createTestUser();
    } catch (error) {
      ErrorManager.handleError(error, 'createTestUser');
    }
  }
}