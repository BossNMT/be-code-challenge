import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "common/constants/Role";
import { AuthMessage } from "modules/auth/constants/auth-message.enum";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (user.role === Role.USER) {
      return true;
    }

    throw new UnauthorizedException(AuthMessage.NOT_ACCESS);
  }
}
