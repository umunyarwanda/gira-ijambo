import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/RolesGuard.guard';
import { ROLES_NAME_KEY, rolesPermissions } from '~/shared/constants/auth/roles.constants';
import { UserApiUrl } from '~/shared/variables/urls';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from './entities/user.entity';
import { PERMISSION_NAME_KEY } from '~/shared/constants/auth';
import { permissions } from '../../shared/constants/auth/permissions.constants';
import { PermissionGuard } from '../auth/guards/EnsurePermission.guard';

@ApiTags('Users')
@Controller(UserApiUrl.CONTROLLER)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.createUsers.roles,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(UserApiUrl.CREATE_USER)
  create(@Body() createUserDto: CreateUserDto, @GetUser() user: User) {
    return this.usersService.create(createUserDto, user);
  }

  @Post(UserApiUrl.CREATE_SYSTEM_USER)
  @ApiOperation({ summary: 'Create a system Super Admin user' })
  createSystemUser() {
    return this.usersService.createSystemUser();
  }

  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.getAllUsers.roles,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(UserApiUrl.GET_USERS)
  findAll(@GetUser() user: User) {
    return this.usersService.findAll(user);
  }

  @SetMetadata(ROLES_NAME_KEY, {
    roles: rolesPermissions.getUser
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by id' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(UserApiUrl.GET_USER + '/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.updateUser.roles,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user by id' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(UserApiUrl.UPDATE_USER + '/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.deleteUser.roles,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by id' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(UserApiUrl.DELETE_USER + '/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // Common endpoints will be here
  // @SetMetadata(ROLES_NAME_KEY, {
  //   roles: rolesPermissions.getAnalytics
  // })
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get analytics' })
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Get(UserApiUrl.GET_ANALYTICS)
  // getAnalytics() {
  //   return this.usersService.getAnalytics();
  // }
}
