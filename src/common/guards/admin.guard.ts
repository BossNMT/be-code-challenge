import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "common/constants/Role";
import { ROLES_KEY } from "common/decorators/http.decorators";
import { AuthMessage } from "modules/auth/constants/auth-message.enum";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (user.role === Role.ADMIN) {
      return true;
    }

    throw new UnauthorizedException(AuthMessage.NOT_ACCESS);
  }
}
