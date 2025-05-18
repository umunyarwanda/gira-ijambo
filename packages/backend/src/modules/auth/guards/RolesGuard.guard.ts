import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "~/modules/users/entities/user.entity";
import { ROLES_NAME_KEY } from "~/shared/constants/auth/roles.constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get(ROLES_NAME_KEY, context.getHandler());
    if (!metadata) {
      return true;
    }
    
    const { roles = [] } = metadata;

    const request = context.switchToHttp().getRequest();
    const user = await this.userRepository.findOne({
      where: {
        id: request.user.id
      }
    });

    if (!user) return false;

    if (roles.length <= 0) return true;

    const isAllowed = roles.includes(user.role);

    return isAllowed;
  }
}