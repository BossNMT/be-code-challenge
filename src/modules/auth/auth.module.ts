import config from "common/config";

import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TOKENS_MODEL, TokensSchema } from "./schemas/tokens.schema";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { TokensService } from "./token.service";
import { AUTHS_MODEL, AuthsSchema } from "./schemas/auths.schema";
import { AuthAdminController } from "./auth-admin.controller";
import { AuthAdminService } from "./auth-admin.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AUTHS_MODEL, schema: AuthsSchema }]),
    MongooseModule.forFeature([{ name: TOKENS_MODEL, schema: TokensSchema }]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: config.jwt.secret,
    }),
  ],

  controllers: [AuthController, AuthAdminController],
  providers: [JwtStrategy, AuthService, TokensService, AuthAdminService],
  exports: [JwtModule, AuthService, AuthAdminService, TokensService],
})
export class AuthModule {}
