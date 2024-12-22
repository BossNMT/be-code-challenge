import config from "common/config";
import jwt from "jsonwebtoken";
import { PaginateModel } from "mongoose";

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";

import { AuthMessage } from "./constants/auth-message.enum";
import { TokenTypes } from "./constants/token.constant";
import { ICreateToken } from "./interfaces/token.interface";
import { Tokens, TOKENS_MODEL, TokensDocument } from "./schemas/tokens.schema";
import { AuthsDocument } from "./schemas/auths.schema";

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(TOKENS_MODEL)
    private readonly tokenModel: PaginateModel<TokensDocument>,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * Generate token
   * @param {ObjectId} user
   * @param {Moment} expires
   * @param {string} type
   * @param {string} [secret]
   * @returns {string}
   */
  async generateToken(tokenDto: ICreateToken) {
    const { user, name, type, role } = tokenDto;
    const { refreshExpirationDays, accessExpirationMinutes } = config.jwt;

    let expires = Math.floor(Date.now() / 1000);
    // if (type === TokenTypes.ACCESS) {
    //   expires += accessExpirationMinutes * 60;
    // } else if (type === TokenTypes.REFRESH) {
    //   expires += refreshExpirationDays * 86_400;
    // }
    switch (type) {
      case TokenTypes.ACCESS:
        expires += accessExpirationMinutes * 60;
        break;
      case TokenTypes.REFRESH:
        expires += refreshExpirationDays * 86_400;
        break;
      case TokenTypes.ADMIN_ACCESS:
        expires += accessExpirationMinutes * 60;
        break;
      case TokenTypes.ADMIN_REFRESH:
        expires += refreshExpirationDays * 86_400;
        break;
    }

    const payload = {
      user,
      name,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: expires,
      type,
    };
    const token = await this.jwtService.signAsync(payload);
    const expiresDate = new Date(expires * 1000);

    await this.saveToken({
      token,
      name,
      role,
      user,
      expires: expiresDate,
      type,
    });
    return {
      token,
      expires: expiresDate,
    };
  }

  /**
   * Save a token
   * @param {string} token
   * @param {ObjectId} user
   * @param {Moment} expires
   * @param {string} type
   * @param {boolean} [blacklisted]
   * @returns {Promise<Token>}
   */
  async saveToken(saveTokenDto: Tokens) {
    const { token, user, name, expires, type, blacklisted, role } = saveTokenDto;
    return await this.tokenModel.create({
      token,
      user,
      name,
      role,
      expires: expires,
      type,
      blacklisted: blacklisted || false,
    });
  }

  /**
   * Verify token and return token doc (or throw an error if it is not valid)
   * @param {string} token
   * @param {string} type
   * @returns {Promise<Token>}
   */
  async verifyToken(token: string, type: string) {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await this.tokenModel.findOne({
      token,
      type,
      user: payload ? payload["user"] : '',
      blacklisted: false,
    });
    if (!tokenDoc) {
      throw new BadRequestException(AuthMessage.TOKEN_NOT_FOUND);
    }
    return tokenDoc;
  }

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  async generateAuthTokens(user: AuthsDocument) {
    const accessToken = await this.generateToken({
      user: user.id,
      name: user.name,
      role: user.role,
      type: TokenTypes.ACCESS,
    });

    const refreshToken = await this.generateToken({
      user: user.id,
      name: user.name,
      role: user.role,
      type: TokenTypes.REFRESH,
    });

    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }

  async findAndRemoveRefreshToken(refreshToken: string): Promise<any> {
    const result = await this.tokenModel.findOneAndDelete({
      token: refreshToken,
      type: TokenTypes.REFRESH,
      blacklisted: false,
    });

    if (!result) {
      throw new NotFoundException(AuthMessage.REFRESH_TOKEN_NOT_FOUND);
    }

    return result;
  }

  async deleteManyTokens(user: string) {
    await this.tokenModel.deleteMany({ user });
  }
}
