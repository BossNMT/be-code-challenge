import { utils } from "ethers";
import { v4 as uuidv4 } from "uuid";

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { AuthMessage } from "./constants/auth-message.enum";
import { TokenTypes } from "./constants/token.constant";
import { LoginDto } from "./dto/login.dto";
import { IVerifySignature } from "./interfaces/token.interface";
import { TokensService } from "./token.service";
import {
  RegisterDto,
} from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { generateRandomNumber, isVietnamesePhoneNumber } from "common/utils";
import { PaginateModel } from "mongoose";
import { AUTHS_MODEL, AuthsDocument } from "./schemas/auths.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Role } from "common/constants/Role";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AUTHS_MODEL)
    private readonly authsModel: PaginateModel<AuthsDocument>,
    private readonly tokenService: TokensService,
  ) {}

  async getUserById(userId: string): Promise<any> {
    return await this.authsModel.findById(userId);
  }

  async decodeAccessToken(
    accessToken: string
  ): Promise<any /*ResponseUsersDto*/> {
    const decodedToken: any = await this.tokenService.verifyToken(
      accessToken,
      TokenTypes.ACCESS
    );
    if (!decodedToken) {
      throw new UnauthorizedException("UNAUTHORIZED");
    }
    return decodedToken;
  }

  async logIn(loginDto: LoginDto): Promise<any> {
    const { phone, password } = loginDto;

    const user = await this.authsModel.findOne({
      phone,
    });

    if (!user) {
      throw new BadRequestException(AuthMessage.NOT_FOUND);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(AuthMessage.NOT_FOUND);
    }

    if (user.active === false) {
      throw new BadRequestException(AuthMessage.NOT_ACTIVE);
    }

    // await this.tokenService.deleteManyTokens(user._id);
    const tokens = await this.tokenService.generateAuthTokens(user);

    return {
      data: {
        user: {
          _id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          active: user.active,
          games: user.games,
        },
        tokens,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const verifyPhone = isVietnamesePhoneNumber(registerDto.phone);
    if (!verifyPhone) {
      throw new UnauthorizedException(AuthMessage.INVALID_PHONE);
    }

    const findUser = await this.authsModel.findOne({
      phone: registerDto.phone,
    });

    if (!findUser) {
      const hashPassWord = await bcrypt.hash(registerDto.password, 14);
      const user = await this.authsModel.create({
        ...registerDto,
        password: hashPassWord,
        role: Role.USER,
      });
      return user;
    }

    throw new BadRequestException(AuthMessage.CHECK_USE_PHONE);
  }

  async verifySignature(
    verifySignatureDto: IVerifySignature
  ): Promise<boolean> {
    try {
      const { address, message, signature } = verifySignatureDto;
      const publicAddress = utils.recoverAddress(
        utils.arrayify(utils.hashMessage(message)),
        signature
      );
      return publicAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  async logOut(refreshToken: string) {
    await this.tokenService.findAndRemoveRefreshToken(refreshToken);

    return {
      message: AuthMessage.LOGGED_OUT,
    };
  }

  async refreshToken(refreshToken: string) {
    const refreshTokenDoc = await this.tokenService.findAndRemoveRefreshToken(
      refreshToken
    );
    const userDoc = (await this.authsModel.findById(
      refreshTokenDoc.user
    )) as AuthsDocument;
    const newTokens = await this.tokenService.generateAuthTokens(userDoc);

    return {
      user: userDoc.id,
      tokens: newTokens,
    };
  }

  async findUserById(userId: string): Promise<any> {
    const user = await this.authsModel.findById(userId);

    if (!user) {
      throw new NotFoundException(AuthMessage.NOT_FOUND);
    }
    return {
      data: {
        user: {
          _id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          active: user.active,
          games: user.games,
        },
      },
    };
  }
}
