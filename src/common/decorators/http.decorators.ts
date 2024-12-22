import type { PipeTransform } from "@nestjs/common";
import { Role } from "common/constants/Role";
import { JwtAuthGuard } from "common/guards/jwt-auth.guard";
import { RolesGuard } from "common/guards/roles.guard";

import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { AuthUserInterceptor } from "../interceptors/auth-user-interceptor.service";

import type { Type } from "@nestjs/common/interfaces";
import { AdminGuard } from "common/guards/admin.guard";
import { UserGuard } from "common/guards/user.guard";
import { SuperAdminGuard } from "common/guards/super-admin.guard";
import { AdminAndSuperAdminGuard } from "common/guards/admin-and-super-admin.guard";
export const ROLES_KEY = "role";

export function Auth(...permission: Role[]): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Permission(...permission),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
  );
}

export function AuthAdmin(...permission: Role[]): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Permission(...permission),
    UseGuards(JwtAuthGuard, AdminGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
  );
}

export function SuperAuthAdmin(...permission: Role[]): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Permission(...permission),
    UseGuards(JwtAuthGuard, SuperAdminGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
  );
}

export function AuthAdminAndSuperAuthAdmin(...permission: Role[]): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Permission(...permission),
    UseGuards(JwtAuthGuard, AdminAndSuperAdminGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
  );
}

export function AuthUser(...permission: Role[]): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Permission(...permission),
    UseGuards(JwtAuthGuard, UserGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
  );
}

export function Permission(
  ...permission: Role[]
): MethodDecorator & ClassDecorator {
  return SetMetadata(ROLES_KEY, permission);
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: "4" }), ...pipes);
}
