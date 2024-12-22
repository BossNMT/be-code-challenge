import config from "common/config";
import express from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "../auth.service";
import { AuthMessage } from "../constants/auth-message.enum";
import { TokenTypes } from "../constants/token.constant";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: express.Request, args: { user: string; type: TokenTypes }) {
    const accessToken = req.headers["authorization"]?.split(" ")[1] || "";
    const authenticatedUser = await this.authService.decodeAccessToken(accessToken);
    if (!authenticatedUser) {
      throw new UnauthorizedException("UNAUTHORIZED");
    }
    // if (args.type !== TokenTypes.ACCESS) {
    //   throw new UnauthorizedException();
    // }

    const user = await this.authService.getUserById(args.user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user.toJSON();
  }
}
