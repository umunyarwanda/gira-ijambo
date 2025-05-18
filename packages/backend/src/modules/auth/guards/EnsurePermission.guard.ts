import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PERMISSION_NAME_KEY } from '../../../shared/constants/auth';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private authRepository: Repository<User>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get(
      PERMISSION_NAME_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      // No metadata found, allow access
      return true;
    }

    const { permissionName, roles = [] } = metadata;

    const { user } = context.switchToHttp().getRequest();
    //select user with their
    const query = this.authRepository.findOne({
      where: { id: user.id },
      // relations: ['userPermissions', 'userPermissions.permissions'],
    });

    const userResponse = await query;

    if (roles.length < 0) return false;

    return (
      this.hasPermission(userResponse, permissionName) &&
      roles.includes(userResponse.role)
    );
  }

  private hasPermission(user: User, requiredPermission: string): boolean {
    if (!user) {
      return false;
    }

    // const userPermissions = user.userPermissions.map((permission) => {
    //   if (permission.isActivated) {
    //     return permission.permissions.slug;
    //   }
    // });
    // return userPermissions.includes(requiredPermission);
  }
}
