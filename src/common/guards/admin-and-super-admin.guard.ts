import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "common/constants/Role";
import { AuthMessage } from "modules/auth/constants/auth-message.enum";

@Injectable()
export class AdminAndSuperAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) {
      return true;
    }

    throw new UnauthorizedException(AuthMessage.NOT_ACCESS);
  }
}
