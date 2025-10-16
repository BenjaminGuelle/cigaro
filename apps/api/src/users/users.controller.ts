import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PublicUserProfile, User, UserProfile } from '@cigaro/libs';
import { AdminGuard } from '../auth/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
  *  ADMIN API
  * */

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/users')
  async getAllUsersForAdmin(): Promise<User[]> {
    return this.usersService.getAllUsersForAdmin();
  }

  /**
   *  PUBLIC API
   * */

  @Get('public-users')
  async getAllPublicUsers(): Promise<PublicUserProfile[]> {
    return this.usersService.getAllPublicUsers();
  }

  @Post('test')
  async createTestUser(): Promise<User> {
    return this.usersService.createTestUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req): Promise<UserProfile> {
    return this.usersService.getUserProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string, @Request() req): Promise<PublicUserProfile> {
    return this.usersService.getPublicUserProfile(id, req.user.id);
  }
}