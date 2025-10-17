import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Request,
  ParseUUIDPipe
} from '@nestjs/common';
import { UsersService } from './users.service';

import {
  JwtAuthGuard,
  RoleGuard,
  RequireAdmin,
  OwnerGuard,
  RequireOwnership
} from '../common/guards';

import { UserResponse, PublicUserListResponse, MyProfileResponse } from '../common/responses/users';
import {
  SerializeInterceptor,
  Serialize,
} from '../common/interceptors/serialize.interceptor';
import { GetUsersQueryDto } from '../common/dto/users/get-users-query.dto';
import { UpdateUserDto } from '../common/dto/users/update-user.dto';
import { CreateUserDto } from '../common/dto/users/create-user.dto';

@Controller('users')
@UseInterceptors(SerializeInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  /**
   * Liste publique des utilisateurs
   * GET /users
   */
  @Get()
  @Serialize(PublicUserListResponse)
  async findAllPublic(@Query() query: GetUsersQueryDto) {
    return this.usersService.findAllPublic(query);
  }

  /**
   * Profil utilisateur public
   * GET /users/:id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserResponse)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req
  ) {
    const viewerId = req.user?.id;
    return this.usersService.findById(id, viewerId);
  }

  // ==========================================
  // AUTHENTICATED ROUTES
  // ==========================================

  /**
   * Mon profil personnel
   * GET /users/me
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @Serialize(MyProfileResponse)
  async getMyProfile(@Request() req) {
    return this.usersService.getMyProfile(req.user.id);
  }

  /**
   * Mettre à jour mon profil
   * PUT /users/me
   */
  @Put('me')
  @UseGuards(JwtAuthGuard)
  @Serialize(MyProfileResponse)
  async updateMyProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  /**
   * Mettre à jour un profil utilisateur (owner ou admin)
   * PUT /users/:id
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @RequireOwnership({ model: 'user', ownerField: 'id' })
  @Serialize(UserResponse)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  // ==========================================
  // ADMIN ROUTES
  // ==========================================

  /**
   * Liste des utilisateurs pour admin avec pagination
   * GET /admin/users
   */
  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RequireAdmin()
  @Serialize(UserResponse)
  async findAllForAdmin(@Query() query: GetUsersQueryDto) {
    return this.usersService.findAllForAdmin(query);
  }

  /**
   * Export complet des utilisateurs (admin)
   * GET /admin/users/export
   */
  @Get('admin/users/export')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RequireAdmin()
  @Serialize(UserResponse)
  async exportAllUsers() {
    return this.usersService.findAllForAdminComplete();
  }

  /**
   * Créer un utilisateur (admin ou système)
   * POST /admin/users
   */
  @Post('admin/users')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RequireAdmin()
  @Serialize(UserResponse)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ==========================================
  // DEVELOPMENT / TEST ROUTES
  // ==========================================

  /**
   * Créer un utilisateur de test (dev uniquement)
   * POST /users/test
   */
  @Post('test')
  @Serialize(UserResponse)
  async createTestUser() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Test endpoints not available in production');
    }

    const testUser: CreateUserDto = {
      email: `test-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      pseudo: `testuser${Date.now()}`,
      rank: 'initie'
    };

    return this.usersService.create(testUser);
  }
}